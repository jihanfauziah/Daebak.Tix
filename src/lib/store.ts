import {
  INITIAL_USERS,
  INITIAL_SELLERS,
  INITIAL_STAFF,
  INITIAL_EVENTS,
  INITIAL_ORDERS,
  INITIAL_TICKETS,
  INITIAL_LOGS,
} from './mockData';
import { User, Seller, StaffAccount, EventItem, Order, Ticket, ActivityLog, WishlistItem } from './types';

const STORAGE_KEYS = {
  USERS: 'daebaktix_users_v1',
  SELLERS: 'daebaktix_sellers_v1',
  STAFF: 'daebaktix_staff_v1',
  EVENTS: 'daebaktix_events_v1',
  ORDERS: 'daebaktix_orders_v1',
  TICKETS: 'daebaktix_tickets_v1',
  LOGS: 'daebaktix_logs_v1',
  WISHLIST: 'daebaktix_wishlist_v1',
  CURRENT_USER: 'daebaktix_session_user_v1',
  CURRENT_SELLER: 'daebaktix_session_seller_v1',
  CURRENT_STAFF: 'daebaktix_session_staff_v1',
};

// Helper for LocalStorage with SSR check
function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('LocalStorage write error', err);
  }
}

// Data Store Class
export class DataStore {
  // Users
  static getUsers(): User[] {
    return getItem(STORAGE_KEYS.USERS, INITIAL_USERS);
  }
  static saveUsers(users: User[]) {
    setItem(STORAGE_KEYS.USERS, users);
  }
  static addUser(user: Omit<User, 'id'>): User {
    const users = this.getUsers();
    const newUser: User = { ...user, id: Date.now() };
    users.push(newUser);
    this.saveUsers(users);
    this.addLog(user.role, user.full_name, 'REGISTER_USER', `Pendaftaran akun baru ${user.username} (${user.email})`);
    return newUser;
  }

  // Sellers
  static getSellers(): Seller[] {
    return getItem(STORAGE_KEYS.SELLERS, INITIAL_SELLERS);
  }
  static saveSellers(sellers: Seller[]) {
    setItem(STORAGE_KEYS.SELLERS, sellers);
  }
  static addSellerRequest(data: {
    nik: string;
    owner_name: string;
    age: number;
    dob: string;
    gender: 'Laki-laki' | 'Perempuan';
    store_name: string;
    store_desc: string;
    store_address: string;
    store_email: string;
  }): Seller {
    const sellers = this.getSellers();
    const code = `SM-${Math.floor(1000 + Math.random() * 9000)}`;
    const newSeller: Seller = {
      id: Date.now(),
      user_id: Date.now() + 1,
      store_name: data.store_name,
      store_desc: data.store_desc,
      store_address: data.store_address,
      store_email: data.store_email,
      account_code: code,
      package_type: 'free',
      status: 'pending',
      created_at: new Date().toISOString().split('T')[0],
      owner_name: data.owner_name,
      nik: data.nik,
    };
    sellers.push(newSeller);
    this.saveSellers(sellers);
    this.addLog('seller', data.store_name, 'SUBMIT_SELLER_APPLICATION', `Pengajuan seller baru toko "${data.store_name}" NIK: ${data.nik}`);
    return newSeller;
  }

  static approveSeller(sellerId: number, packageType: 'free' | 'paid_1m' | 'paid_3m' = 'free'): Seller | null {
    const sellers = this.getSellers();
    const index = sellers.findIndex((s) => s.id === sellerId);
    if (index === -1) return null;

    let expires = new Date();
    if (packageType === 'paid_1m') expires.setDate(expires.getDate() + 30);
    else if (packageType === 'paid_3m') expires.setDate(expires.getDate() + 90);
    else expires.setDate(expires.getDate() + 15); // Free package default duration 15 days

    sellers[index].status = 'approved';
    sellers[index].package_type = packageType;
    sellers[index].expires_at = expires.toISOString();
    this.saveSellers(sellers);

    // Also register a user record for this seller if not exists
    const users = this.getUsers();
    if (!users.some((u) => u.email === sellers[index].store_email)) {
      users.push({
        id: sellers[index].user_id,
        nik: sellers[index].nik || '3171000000000000',
        username: sellers[index].store_email.split('@')[0],
        full_name: sellers[index].owner_name || sellers[index].store_name,
        email: sellers[index].store_email,
        password: 'seller123',
        role: 'seller',
        created_at: new Date().toISOString().split('T')[0],
      });
      this.saveUsers(users);
    }

    this.addLog('admin', 'Super Admin', 'APPROVE_SELLER', `Menyetujui seller toko "${sellers[index].store_name}" (Kode: ${sellers[index].account_code})`);
    return sellers[index];
  }

  static rejectSeller(sellerId: number): Seller | null {
    const sellers = this.getSellers();
    const index = sellers.findIndex((s) => s.id === sellerId);
    if (index === -1) return null;

    sellers[index].status = 'rejected';
    this.saveSellers(sellers);
    this.addLog('admin', 'Super Admin', 'REJECT_SELLER', `Menolak pengajuan toko "${sellers[index].store_name}"`);
    return sellers[index];
  }

  // Staff
  static getStaff(): StaffAccount[] {
    return getItem(STORAGE_KEYS.STAFF, INITIAL_STAFF);
  }
  static saveStaff(staffList: StaffAccount[]) {
    setItem(STORAGE_KEYS.STAFF, staffList);
  }
  static createStaff(sellerId: number, staffName: string, username: string, accountCode: string, storeEmail: string): StaffAccount {
    const staffList = this.getStaff();
    const newStaff: StaffAccount = {
      id: Date.now(),
      seller_id: sellerId,
      username,
      staff_name: staffName,
      account_code: accountCode,
      store_email: storeEmail,
      created_at: new Date().toISOString().split('T')[0],
    };
    staffList.push(newStaff);
    this.saveStaff(staffList);
    this.addLog('seller', storeEmail, 'CREATE_STAFF', `Membuat akun staf baru: ${staffName} (${username})`);
    return newStaff;
  }

  // Events
  static getEvents(): EventItem[] {
    const events = getItem(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    // Auto-update event status based on validity / active days check
    const now = new Date();
    return events.map((ev) => {
      const created = new Date(ev.created_at || '2026-08-01');
      const expiry = new Date(created.getTime() + (ev.duration_days || 15) * 24 * 60 * 60 * 1000);
      if (now > expiry && ev.status === 'active') {
        return { ...ev, is_active: false, status: 'inactive' };
      }
      return ev;
    });
  }
  static saveEvents(events: EventItem[]) {
    setItem(STORAGE_KEYS.EVENTS, events);
  }
  static addEvent(eventData: Omit<EventItem, 'id' | 'created_at'>): EventItem {
    const events = this.getEvents();
    const newEvent: EventItem = {
      ...eventData,
      id: Date.now(),
      created_at: new Date().toISOString().split('T')[0],
    };
    events.unshift(newEvent);
    this.saveEvents(events);
    this.addLog('seller', eventData.seller_name || 'Seller', 'CREATE_EVENT', `Membuat event baru: "${eventData.title}" (${eventData.category.toUpperCase()})`);
    return newEvent;
  }
  static extendEventDuration(eventId: number, extraDays: number): EventItem | null {
    const events = this.getEvents();
    const index = events.findIndex((e) => e.id === eventId);
    if (index === -1) return null;

    events[index].duration_days += extraDays;
    events[index].is_active = true;
    events[index].status = 'active';
    this.saveEvents(events);
    this.addLog('seller', events[index].seller_name || 'Seller', 'EXTEND_EVENT', `Memperpanjang masa jual event "${events[index].title}" (+${extraDays} hari)`);
    return events[index];
  }

  // Orders & Tickets
  static getOrders(): Order[] {
    return getItem(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  }
  static saveOrders(orders: Order[]) {
    setItem(STORAGE_KEYS.ORDERS, orders);
  }

  static getTickets(): Ticket[] {
    return getItem(STORAGE_KEYS.TICKETS, INITIAL_TICKETS);
  }
  static saveTickets(tickets: Ticket[]) {
    setItem(STORAGE_KEYS.TICKETS, tickets);
  }

  static createOrder(
    buyer: User,
    event: EventItem,
    category: { id: number; name: string; price: number },
    quantity: number,
    paymentMethod: string
  ): { order: Order; tickets: Ticket[] } {
    const orderNum = `DBK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`;
    const totalPrice = category.price * quantity;

    const newOrder: Order = {
      id: Date.now(),
      order_number: orderNum,
      buyer_id: buyer.id,
      buyer_name: buyer.full_name,
      buyer_nik: buyer.nik,
      event_id: event.id,
      event_title: event.title,
      artist_name: event.artist_name,
      category_id: category.id,
      category_name: category.name,
      quantity,
      total_price: totalPrice,
      payment_method: paymentMethod,
      status: 'paid',
      created_at: new Date().toISOString(),
    };

    const orders = this.getOrders();
    orders.unshift(newOrder);
    this.saveOrders(orders);

    // Update remaining quota
    const events = this.getEvents();
    const evIndex = events.findIndex((e) => e.id === event.id);
    if (evIndex !== -1) {
      const catIndex = events[evIndex].categories.findIndex((c) => c.id === category.id);
      if (catIndex !== -1) {
        events[evIndex].categories[catIndex].remaining_quota = Math.max(0, events[evIndex].categories[catIndex].remaining_quota - quantity);
        this.saveEvents(events);
      }
    }

    // Generate Tickets with Unique QR Codes
    const tickets = this.getTickets();
    const createdTickets: Ticket[] = [];
    for (let i = 0; i < quantity; i++) {
      const qrHash = `DBK-QR-${event.artist_name.replace(/\s+/g, '')}-${category.name.substring(0, 3)}-${buyer.nik || 'BUYER'}-${Math.floor(100 + Math.random() * 900)}-${i + 1}`;
      const seatNo = `${category.name.toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;
      const t: Ticket = {
        id: Date.now() + i,
        order_id: newOrder.id,
        order_number: orderNum,
        buyer_id: buyer.id,
        buyer_name: buyer.full_name,
        buyer_nik: buyer.nik || 'N/A',
        event_id: event.id,
        event_title: event.title,
        artist_name: event.artist_name,
        venue: event.venue,
        city: event.city,
        event_date: event.event_date,
        poster_url: event.poster_url,
        category_name: category.name,
        seat_number: seatNo,
        qr_code_hash: qrHash,
        status: 'valid',
        created_at: new Date().toISOString(),
      };
      tickets.unshift(t);
      createdTickets.push(t);
    }
    this.saveTickets(tickets);

    // Reward Loyalty Points (100 pts per order)
    const users = this.getUsers();
    const uIdx = users.findIndex((u) => u.id === buyer.id);
    if (uIdx !== -1) {
      users[uIdx].loyalty_points = (users[uIdx].loyalty_points || 0) + 100 * quantity;
      this.saveUsers(users);
    }

    this.addLog('buyer', buyer.full_name, 'CREATE_ORDER', `Membeli ${quantity}x ${category.name} "${event.title}" (${paymentMethod})`);

    return { order: newOrder, tickets: createdTickets };
  }

  // Scan Ticket (For Staff)
  static scanTicketByQr(qrHash: string, staffName: string): { success: boolean; message: string; ticket?: Ticket } {
    const tickets = this.getTickets();
    const index = tickets.findIndex((t) => t.qr_code_hash.trim().toLowerCase() === qrHash.trim().toLowerCase());

    if (index === -1) {
      this.addLog('staff', staffName, 'SCAN_FAILED', `Gagal scan: QR code "${qrHash}" tidak ditemukan di database!`);
      return { success: false, message: 'TIKET TIDAK VALID! QR Code tidak terdaftar di sistem.' };
    }

    const ticket = tickets[index];

    if (ticket.status === 'scanned') {
      this.addLog('staff', staffName, 'SCAN_REJECTED', `Percobaan scan ulang tiket ${ticket.order_number} milik ${ticket.buyer_name} (Sudah discan pada ${ticket.scanned_at})`);
      return {
        success: false,
        message: `TIKET SUDAH DIPAKAI! Sebelumnya discan oleh ${ticket.scanned_by_staff_name || 'Staf'} pada ${new Date(ticket.scanned_at || '').toLocaleString('id-ID')}`,
        ticket,
      };
    }

    if (ticket.status === 'expired') {
      return { success: false, message: 'TIKET EXPIRED! Masa berlaku tiket telah habis.', ticket };
    }

    // Lock ticket as scanned
    tickets[index].status = 'scanned';
    tickets[index].scanned_at = new Date().toISOString();
    tickets[index].scanned_by_staff_name = staffName;
    this.saveTickets(tickets);

    this.addLog('staff', staffName, 'SCAN_SUCCESS', `Berhasil memvalidasi tiket "${ticket.event_title}" - ${ticket.category_name} milik ${ticket.buyer_name} (NIK: ${ticket.buyer_nik})`);

    return {
      success: true,
      message: `TIKET VALID! Selamat Datang ${ticket.buyer_name} (${ticket.category_name} - ${ticket.seat_number})`,
      ticket: tickets[index],
    };
  }

  // Activity Logs
  static getLogs(): ActivityLog[] {
    return getItem(STORAGE_KEYS.LOGS, INITIAL_LOGS);
  }
  static addLog(role: string, name: string, action: string, details: string) {
    const logs = this.getLogs();
    const newLog: ActivityLog = {
      id: Date.now(),
      user_role: role,
      user_name: name,
      action,
      details,
      timestamp: new Date().toLocaleString('id-ID'),
    };
    logs.unshift(newLog);
    setItem(STORAGE_KEYS.LOGS, logs);
  }

  // Session handling helpers
  static getSessionUser(): User | null {
    return getItem(STORAGE_KEYS.CURRENT_USER, null);
  }
  static setSessionUser(user: User | null) {
    setItem(STORAGE_KEYS.CURRENT_USER, user);
  }

  static getSessionSeller(): Seller | null {
    return getItem(STORAGE_KEYS.CURRENT_SELLER, null);
  }
  static setSessionSeller(seller: Seller | null) {
    setItem(STORAGE_KEYS.CURRENT_SELLER, seller);
  }

  static getSessionStaff(): StaffAccount | null {
    return getItem(STORAGE_KEYS.CURRENT_STAFF, null);
  }
  static setSessionStaff(staff: StaffAccount | null) {
    setItem(STORAGE_KEYS.CURRENT_STAFF, staff);
  }

  // Wishlist
  static getWishlist(buyerId: number): number[] {
    const list: WishlistItem[] = getItem(STORAGE_KEYS.WISHLIST, []);
    return list.filter((w) => w.buyer_id === buyerId).map((w) => w.event_id);
  }
  static toggleWishlist(buyerId: number, eventId: number): boolean {
    const list: WishlistItem[] = getItem(STORAGE_KEYS.WISHLIST, []);
    const idx = list.findIndex((w) => w.buyer_id === buyerId && w.event_id === eventId);
    let added = false;
    if (idx !== -1) {
      list.splice(idx, 1);
    } else {
      list.push({ id: Date.now(), buyer_id: buyerId, event_id: eventId });
      added = true;
    }
    setItem(STORAGE_KEYS.WISHLIST, list);
    return added;
  }
}

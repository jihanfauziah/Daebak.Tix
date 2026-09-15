export type Role = 'admin' | 'seller' | 'buyer' | 'staff';

export interface User {
  id: number;
  nik?: string;
  username: string;
  full_name: string;
  email: string;
  phone?: string;
  age?: number;
  dob?: string;
  gender?: 'Laki-laki' | 'Perempuan';
  password?: string;
  role: Role;
  isOwner?: boolean;
  loyalty_points?: number;
  created_at?: string;
}

export interface Seller {
  id: number;
  user_id: number;
  store_name: string;
  store_desc: string;
  store_address: string;
  store_email: string;
  account_code: string;
  package_type: 'free' | 'paid_1m' | 'paid_3m';
  status: 'pending' | 'approved' | 'rejected';
  expires_at?: string;
  created_at: string;
  owner_name?: string;
  nik?: string;
}

export interface StaffAccount {
  id: number;
  seller_id: number;
  username: string;
  staff_name: string;
  account_code: string; // seller's account_code
  store_email: string;
  created_at: string;
}

export type EventCategory = 'concert' | 'fanmeet' | 'fansign' | 'other';

export interface TicketCategory {
  id: number;
  event_id: number;
  name: string;
  price: number;
  quota: number;
  remaining_quota: number;
  description?: string;
}

export interface EventItem {
  id: number;
  seller_id: number;
  seller_name?: string;
  title: string;
  category: EventCategory;
  artist_name: string;
  venue: string;
  city: string;
  event_date: string;
  poster_url: string;
  duration_days: number;
  is_active: boolean;
  status: 'active' | 'inactive' | 'completed';
  categories: TicketCategory[];
  created_at: string;
}

export interface Order {
  id: number;
  order_number: string;
  buyer_id: number;
  buyer_name?: string;
  buyer_nik?: string;
  event_id: number;
  event_title?: string;
  artist_name?: string;
  category_id: number;
  category_name?: string;
  quantity: number;
  total_price: number;
  payment_method: string;
  status: 'pending' | 'paid' | 'cancelled';
  created_at: string;
}

export interface Ticket {
  id: number;
  order_id: number;
  order_number: string;
  buyer_id: number;
  buyer_name: string;
  buyer_nik: string;
  event_id: number;
  event_title: string;
  artist_name: string;
  venue: string;
  city: string;
  event_date: string;
  poster_url: string;
  category_name: string;
  seat_number: string;
  qr_code_hash: string;
  status: 'valid' | 'scanned' | 'expired';
  scanned_at?: string;
  scanned_by_staff_name?: string;
  created_at: string;
}

export interface ActivityLog {
  id: number;
  user_role: string;
  user_name: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface WishlistItem {
  id: number;
  buyer_id: number;
  event_id: number;
}

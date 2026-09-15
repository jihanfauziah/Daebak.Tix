-- Daebak.Tix Database Schema
-- Compatible with MySQL & phpMyAdmin

CREATE DATABASE IF NOT EXISTS `daebaktix_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `daebaktix_db`;

-- 1. Users Table (Admin, Seller, Buyer)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nik` VARCHAR(16) UNIQUE NULL,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `full_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `phone` VARCHAR(20) NULL,
  `age` INT NULL,
  `dob` DATE NULL,
  `gender` ENUM('Laki-laki', 'Perempuan') NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'seller', 'buyer') NOT NULL DEFAULT 'buyer',
  `loyalty_points` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Sellers Table
CREATE TABLE IF NOT EXISTS `sellers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `store_name` VARCHAR(100) NOT NULL,
  `store_desc` TEXT NULL,
  `store_address` TEXT NULL,
  `store_email` VARCHAR(100) NOT NULL UNIQUE,
  `account_code` VARCHAR(20) NOT NULL UNIQUE,
  `package_type` ENUM('free', 'paid_1m', 'paid_3m') NOT NULL DEFAULT 'free',
  `status` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  `expires_at` DATETIME NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Staff Accounts Table
CREATE TABLE IF NOT EXISTS `staff_accounts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `seller_id` INT NOT NULL,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `staff_name` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`seller_id`) REFERENCES `sellers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Events Table
CREATE TABLE IF NOT EXISTS `events` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `seller_id` INT NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `category` ENUM('concert', 'fanmeet', 'fansign', 'other') NOT NULL,
  `artist_name` VARCHAR(100) NOT NULL,
  `venue` VARCHAR(150) NOT NULL,
  `city` VARCHAR(50) NOT NULL,
  `event_date` DATETIME NOT NULL,
  `poster_url` TEXT NOT NULL,
  `duration_days` INT DEFAULT 15,
  `is_active` TINYINT(1) DEFAULT 1,
  `status` ENUM('active', 'inactive', 'completed') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`seller_id`) REFERENCES `sellers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Ticket Categories Table
CREATE TABLE IF NOT EXISTS `ticket_categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `event_id` INT NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `price` DECIMAL(12,2) NOT NULL,
  `quota` INT NOT NULL,
  `remaining_quota` INT NOT NULL,
  `description` VARCHAR(255) NULL,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Orders Table
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_number` VARCHAR(30) UNIQUE NOT NULL,
  `buyer_id` INT NOT NULL,
  `event_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `total_price` DECIMAL(12,2) NOT NULL,
  `payment_method` VARCHAR(50) NOT NULL,
  `status` ENUM('pending', 'paid', 'cancelled') DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`buyer_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`),
  FOREIGN KEY (`category_id`) REFERENCES `ticket_categories`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Tickets Table (with unique QR code hashes & scan tracking)
CREATE TABLE IF NOT EXISTS `tickets` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `buyer_id` INT NOT NULL,
  `event_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  `qr_code_hash` VARCHAR(64) UNIQUE NOT NULL,
  `seat_number` VARCHAR(20) NOT NULL,
  `status` ENUM('valid', 'scanned', 'expired') DEFAULT 'valid',
  `scanned_at` DATETIME NULL,
  `scanned_by_staff_id` INT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`),
  FOREIGN KEY (`buyer_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`),
  FOREIGN KEY (`category_id`) REFERENCES `ticket_categories`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Activity Logs
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_role` VARCHAR(20) NOT NULL,
  `user_id` INT NULL,
  `action` VARCHAR(100) NOT NULL,
  `details` TEXT NULL,
  `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Initial Default Admin Account Insert
INSERT INTO `users` (`nik`, `username`, `full_name`, `email`, `password_hash`, `role`)
VALUES ('3171000000000001', 'admin', 'Super Admin Daebak.Tix', 'admin@daebaktix.co.id', 'admin123', 'admin')
ON DUPLICATE KEY UPDATE `id`=`id`;

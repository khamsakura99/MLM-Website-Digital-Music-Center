-- =====================================================================
-- OMC MULTI-LEVEL MARKETING (MLM) ENTERPRISE SYSTEM
-- COMPLETE DATABASE SCHEMA & INITIAL SEED DATA
-- Charset: utf8mb4 | Collation: utf8mb4_unicode_ci
-- Compatible with: MySQL 5.7+, MySQL 8.0+, MariaDB 10.3+
-- Generated for Server FTP / phpMyAdmin Import
-- =====================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET NAMES utf8mb4;
SET time_zone = "+07:00";

-- ---------------------------------------------------------------------
-- 1. Table structure for: mlm_members
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `mlm_members`;
CREATE TABLE `mlm_members` (
  `id` VARCHAR(36) NOT NULL,
  `member_code` VARCHAR(20) NOT NULL,
  `full_name` VARCHAR(150) NOT NULL,
  `nickname` VARCHAR(50) DEFAULT NULL,
  `id_card_number` VARCHAR(30) DEFAULT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `address` TEXT DEFAULT NULL,
  `province` VARCHAR(100) DEFAULT NULL,
  `postcode` VARCHAR(20) DEFAULT NULL,
  `rank` ENUM('Member', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Crown_Diamond') NOT NULL DEFAULT 'Member',
  `sponsor_code` VARCHAR(20) DEFAULT NULL,
  `sponsor_name` VARCHAR(150) DEFAULT NULL,
  `upline_code` VARCHAR(20) DEFAULT NULL,
  `upline_name` VARCHAR(150) DEFAULT NULL,
  `position` ENUM('L', 'R') DEFAULT 'L',
  `personal_pv` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `accumulated_pv` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `left_leg_pv` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `right_leg_pv` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `left_leg_members` INT(11) NOT NULL DEFAULT 0,
  `right_leg_members` INT(11) NOT NULL DEFAULT 0,
  `wallet_balance` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
  `total_earnings` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
  `autoship_status` ENUM('active', 'inactive', 'grace') NOT NULL DEFAULT 'active',
  `autoship_expire_date` DATE DEFAULT NULL,
  `join_date` DATE NOT NULL,
  `avatar_url` VARCHAR(255) DEFAULT NULL,
  `bank_name` VARCHAR(100) DEFAULT NULL,
  `bank_code` VARCHAR(20) DEFAULT NULL,
  `bank_account_no` VARCHAR(50) DEFAULT NULL,
  `bank_account_name` VARCHAR(150) DEFAULT NULL,
  `bank_branch` VARCHAR(100) DEFAULT NULL,
  `is_bank_verified` TINYINT(1) NOT NULL DEFAULT 0,
  `kyc_status` ENUM('pending', 'verified', 'rejected') NOT NULL DEFAULT 'pending',
  `transaction_pin` VARCHAR(10) DEFAULT '123456',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_member_code` (`member_code`),
  KEY `idx_sponsor_code` (`sponsor_code`),
  KEY `idx_upline_code` (`upline_code`),
  KEY `idx_phone` (`phone`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Member Profiles & Downline Positions';

-- ---------------------------------------------------------------------
-- 2. Table structure for: mlm_products
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `mlm_products`;
CREATE TABLE `mlm_products` (
  `id` VARCHAR(36) NOT NULL,
  `code` VARCHAR(30) NOT NULL,
  `name_th` VARCHAR(150) NOT NULL,
  `name_en` VARCHAR(150) NOT NULL,
  `name_lo` VARCHAR(150) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `pv` DECIMAL(10, 2) NOT NULL,
  `stock` INT(11) NOT NULL DEFAULT 100,
  `rating` DECIMAL(3, 2) NOT NULL DEFAULT 4.80,
  `reviews_count` INT(11) NOT NULL DEFAULT 0,
  `image_url` VARCHAR(255) DEFAULT NULL,
  `description_th` TEXT DEFAULT NULL,
  `description_en` TEXT DEFAULT NULL,
  `description_lo` TEXT DEFAULT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_product_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='MLM Products & PV Points Catalog';

-- ---------------------------------------------------------------------
-- 3. Table structure for: mlm_orders
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `mlm_orders`;
CREATE TABLE `mlm_orders` (
  `id` VARCHAR(36) NOT NULL,
  `order_no` VARCHAR(40) NOT NULL,
  `member_code` VARCHAR(20) NOT NULL,
  `member_name` VARCHAR(150) NOT NULL,
  `order_type` ENUM('General', 'Autoship', 'Upgrade', 'Promotion') NOT NULL DEFAULT 'General',
  `order_date` DATETIME NOT NULL,
  `status` ENUM('completed', 'processing', 'shipped', 'cancelled') NOT NULL DEFAULT 'completed',
  `payment_method` ENUM('wallet', 'bank_transfer', 'promptpay', 'credit_card') NOT NULL DEFAULT 'wallet',
  `total_amount` DECIMAL(12, 2) NOT NULL,
  `total_pv` DECIMAL(12, 2) NOT NULL,
  `shipping_address` TEXT DEFAULT NULL,
  `tracking_number` VARCHAR(50) DEFAULT NULL,
  `slip_image_url` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_order_no` (`order_no`),
  KEY `idx_member_orders` (`member_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Orders & PV Transactions';

-- ---------------------------------------------------------------------
-- 4. Table structure for: mlm_order_items
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `mlm_order_items`;
CREATE TABLE `mlm_order_items` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `order_no` VARCHAR(40) NOT NULL,
  `product_id` VARCHAR(36) NOT NULL,
  `product_name` VARCHAR(150) NOT NULL,
  `quantity` INT(11) NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `pv` DECIMAL(10, 2) NOT NULL,
  `subtotal_amount` DECIMAL(12, 2) NOT NULL,
  `subtotal_pv` DECIMAL(12, 2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_order_items` (`order_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Line items per order';

-- ---------------------------------------------------------------------
-- 5. Table structure for: mlm_wallet_transactions
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `mlm_wallet_transactions`;
CREATE TABLE `mlm_wallet_transactions` (
  `id` VARCHAR(36) NOT NULL,
  `tx_no` VARCHAR(40) NOT NULL,
  `member_code` VARCHAR(20) NOT NULL,
  `type` ENUM('commission', 'withdrawal', 'transfer_in', 'transfer_out', 'order_payment', 'deposit') NOT NULL,
  `amount` DECIMAL(14, 2) NOT NULL,
  `fee` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `net_amount` DECIMAL(14, 2) NOT NULL,
  `balance_after` DECIMAL(14, 2) NOT NULL,
  `status` ENUM('success', 'pending', 'rejected', 'cancelled') NOT NULL DEFAULT 'success',
  `reference_no` VARCHAR(50) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_tx_no` (`tx_no`),
  KEY `idx_wallet_member` (`member_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='E-Wallet Financial Ledger';

-- ---------------------------------------------------------------------
-- 6. Table structure for: mlm_commission_cycles
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `mlm_commission_cycles`;
CREATE TABLE `mlm_commission_cycles` (
  `id` VARCHAR(36) NOT NULL,
  `cycle_code` VARCHAR(30) NOT NULL,
  `cycle_name` VARCHAR(100) NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `pay_date` DATE NOT NULL,
  `status` ENUM('pending', 'calculating', 'approved', 'transferred') NOT NULL DEFAULT 'transferred',
  `fast_start_bonus` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `weak_leg_bonus` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `matching_bonus` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `all_sale_bonus` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `total_gross` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
  `withholding_tax` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `transfer_fee` DECIMAL(10, 2) NOT NULL DEFAULT 30.00,
  `net_payout` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_cycle_code` (`cycle_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Weekly/Monthly Commission Calculation Cycles';

-- ---------------------------------------------------------------------
-- 7. Table structure for: mlm_supported_banks
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `mlm_supported_banks`;
CREATE TABLE `mlm_supported_banks` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(20) NOT NULL,
  `name_th` VARCHAR(150) NOT NULL,
  `name_en` VARCHAR(150) NOT NULL,
  `name_lo` VARCHAR(150) NOT NULL,
  `country` ENUM('TH', 'LA', 'OTHER') NOT NULL DEFAULT 'TH',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_bank_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Supported Thai & Lao Commercial Banks';

-- ---------------------------------------------------------------------
-- 8. Table structure for: mlm_company_bank_accounts
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `mlm_company_bank_accounts` (
  `id` VARCHAR(36) NOT NULL,
  `bank_name` VARCHAR(150) NOT NULL,
  `bank_code` VARCHAR(20) NOT NULL,
  `account_number` VARCHAR(50) NOT NULL,
  `account_name` VARCHAR(150) NOT NULL,
  `branch` VARCHAR(100) DEFAULT NULL,
  `promptpay_id` VARCHAR(50) DEFAULT NULL,
  `qr_code_url` VARCHAR(255) DEFAULT NULL,
  `country` ENUM('TH', 'LA') NOT NULL DEFAULT 'TH',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Company Bank Accounts for Deposit Transfers';

-- ---------------------------------------------------------------------
-- 9. Table structure for: mlm_system_settings
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `mlm_system_settings`;
CREATE TABLE `mlm_system_settings` (
  `setting_key` VARCHAR(50) NOT NULL,
  `setting_value` TEXT NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='System Configuration & Compensation Plan Rules';

-- =====================================================================
-- INITIAL SEED DATA
-- =====================================================================

-- Supported Banks (Thailand & Laos)
INSERT INTO `mlm_supported_banks` (`code`, `name_th`, `name_en`, `name_lo`, `country`) VALUES
('KBANK', 'ธนาคารกสิกรไทย', 'Kasikornbank (KBANK)', 'ທະນາຄານກະສິກອນໄທ', 'TH'),
('SCB', 'ธนาคารไทยพาณิชย์', 'Siam Commercial Bank (SCB)', 'ທະນາຄານໄທພານິດ', 'TH'),
('BBL', 'ธนาคารกรุงเทพ', 'Bangkok Bank (BBL)', 'ທະນາຄານກຸງເທບ', 'TH'),
('KTB', 'ธนาคารกรุงไทย', 'Krungthai Bank (KTB)', 'ທະນາຄານກຸງໄທ', 'TH'),
('TTB', 'ธนาคารทหารไทยธนชาต', 'TMBThanachart Bank (TTB)', 'ທະນາຄານທະຫານໄທທະນະຊາດ', 'TH'),
('BAY', 'ธนาคารกรุงศรีอยุธยา', 'Bank of Ayudhya (BAY)', 'ທະນາຄານກຸງສີອະຍຸດທະຍາ', 'TH'),
('GSB', 'ธนาคารออมสิน', 'Government Savings Bank (GSB)', 'ທະນາຄານອອມສິນ', 'TH'),
('BCEL', 'ธนาคารการค้าต่างประเทศลาว (BCEL)', 'BANQUE POUR LE COMMERCE EXTERIEUR LAO PUBLIC (BCEL)', 'ທະນາຄານການຄ້າຕ່າງປະເທດລາວ (BCEL)', 'LA'),
('LDB', 'ธนาคารพัฒนาลาว (LDB)', 'Development Bank CO LTD (LDB)', 'ທະນາຄານພັດທະນາລາວ (LDB)', 'LA'),
('JDB', 'ธนาคารร่วมพัฒนา (JDB)', 'Joint Development Bank (JDB)', 'ທະນາຄານຮ່ວມພັດທະນາ (JDB)', 'LA'),
('VIETIN', 'ธนาคารเวียตินแบงก์ ลาว (VietinBank Lao)', 'VietinBank Lao | Vientiane', 'ທະນາຄານຫວຽດຕິນລາວ (VietinBank Lao)', 'LA');

-- Company Bank Accounts
INSERT INTO `mlm_company_bank_accounts` (`id`, `bank_name`, `bank_code`, `account_number`, `account_name`, `branch`, `promptpay_id`, `country`, `is_active`) VALUES
('cba_001', 'ธนาคารกสิกรไทย (Kasikornbank)', 'KBANK', '095-2-88776-6', 'บริษัท โอเอ็มซี เน็ตเวิร์ค คอร์ปอเรชั่น จำกัด', 'สาขารัชโยธิน', '0105566012345', 'TH', 1),
('cba_002', 'ธนาคารไทยพาณิชย์ (SCB)', 'SCB', '118-4-55221-9', 'บริษัท โอเอ็มซี เน็ตเวิร์ค คอร์ปอเรชั่น จำกัด', 'สาขาลาดพร้าว', '0105566012345', 'TH', 1),
('cba_003', 'BANQUE POUR LE COMMERCE EXTERIEUR LAO PUBLIC (BCEL)', 'BCEL', '010-12-00-01234567-001', 'OMC LAO TRADING CO., LTD (ບໍລິສັດ ໂອເອັມຊີ ລາວ ຈຳກັດ)', 'ສຳນັກງານໃຫຍ່ ນະຄອນຫຼວງວຽງຈັນ', NULL, 'LA', 1);

-- Members Seed Data
INSERT INTO `mlm_members` (`id`, `member_code`, `full_name`, `nickname`, `id_card_number`, `phone`, `email`, `address`, `province`, `postcode`, `rank`, `sponsor_code`, `sponsor_name`, `upline_code`, `upline_name`, `position`, `personal_pv`, `accumulated_pv`, `left_leg_pv`, `right_leg_pv`, `left_leg_members`, `right_leg_members`, `wallet_balance`, `total_earnings`, `autoship_status`, `autoship_expire_date`, `join_date`, `avatar_url`, `bank_name`, `bank_code`, `bank_account_no`, `bank_account_name`, `bank_branch`, `is_bank_verified`, `kyc_status`) VALUES
('usr_001', 'TH889214', 'กิตติศักดิ์ เจริญสุขสวัสดิ์', 'คุณท็อป (Top)', '1-1020-00894-32-1', '089-765-4321', 'kittisak.omc@gmail.com', '99/42 หมู่ 5 ถนนรัชดาภิเษก แขวงจตุจักร เขตจตุจักร', 'กรุงเทพมหานคร', '10900', 'Diamond', 'TH880001', 'วรพจน์ ธนบูลย์ (VP Leader)', 'TH880001', 'วรพจน์ ธนบูลย์ (VP Leader)', 'L', 3250.00, 48600.00, 285400.00, 192800.00, 148, 96, 84650.00, 428750.00, 'active', '2026-10-31', '2024-03-15', '/assets/avatar.jpg', 'ธนาคารกสิกรไทย (Kasikornbank)', 'KBANK', '045-8-91234-5', 'นาย กิตติศักดิ์ เจริญสุขสวัสดิ์', 'สาขา รัชโยธิน', 1, 'verified'),
('usr_002', 'TH889502', 'ณัชชา ภัทรไพศาล', 'คุณมายด์', '3-1002-00431-11-2', '081-234-5678', 'natcha.pat@omc.th', '12/88 หมู่บ้านศุภาลัย ถ.แจ้งวัฒนะ ต.คลองเกลือ อ.ปากเกร็ด', 'นนทบุรี', '11120', 'Gold', 'TH889214', 'กิตติศักดิ์ เจริญสุขสวัสดิ์', 'TH889214', 'กิตติศักดิ์ เจริญสุขสวัสดิ์', 'L', 1500.00, 14200.00, 84000.00, 62500.00, 42, 31, 19400.00, 82400.00, 'active', '2026-10-25', '2024-08-10', '/assets/avatar.jpg', 'ธนาคารไทยพาณิชย์ (SCB)', 'SCB', '112-2-90123-4', 'น.ส. ณัชชา ภัทรไพศาล', 'สาขา แจ้งวัฒนะ', 1, 'verified'),
('usr_003', 'TH890118', 'ธนากร สุวรรณสิทธิ์', 'คุณบอส', '1-5099-00124-78-9', '092-889-1122', 'thanakorn.s@omc.th', '204/15 ถนนนิมมานเหมินท์ ต.สุเทพ อ.เมือง', 'เชียงใหม่', '50200', 'Platinum', 'TH889214', 'กิตติศักดิ์ เจริญสุขสวัสดิ์', 'TH889214', 'กิตติศักดิ์ เจริญสุขสวัสดิ์', 'R', 2100.00, 26800.00, 112000.00, 94000.00, 56, 44, 38900.00, 165000.00, 'active', '2026-10-28', '2024-05-20', '/assets/avatar.jpg', 'ธนาคารกรุงเทพ (Bangkok Bank)', 'BBL', '230-0-84512-3', 'นาย ธนากร สุวรรณสิทธิ์', 'สาขา นิมมานเหมินท์', 1, 'verified');

-- Products Seed Data
INSERT INTO `mlm_products` (`id`, `code`, `name_th`, `name_en`, `name_lo`, `category`, `price`, `pv`, `stock`, `description_th`, `description_en`, `description_lo`) VALUES
('prd_001', 'OMC-COL-01', 'OMC คอลลาเจน โกลด์ พลัส ไตรเปปไทด์', 'OMC Collagen Gold Plus Tripeptide', 'OMC ຄອນລາເຈນ ໂກລ ພລັສ ໄຕຣເປບໄທດ໌', 'อาหารเสริมเพื่อความงาม', 1290.00, 300.00, 450, 'คอลลาเจนพรีเมียมจากญี่ปุ่น บำรุงผิว ข้อต่อ กระดูก', 'Premium Japanese Collagen Tripeptide for radiant skin and healthy joints', 'ຄອນລາເຈນພຣີມ່ຽມຈາກຍີ່ປຸ່ນ ບຳລຸງຜິວພັນ ແລະ ຂໍ້ຕໍ່ກະດູກ'),
('prd_002', 'OMC-COF-02', 'OMC กาแฟถั่งเช่า ผสมเห็ดหลินจือ สูตรเจ', 'OMC Cordyceps & Reishi Health Coffee', 'OMC ກາເຟຖັ່ງເຊົ່າ ປະສົມເຫັດຫຼິນຈື ສູດເຈ', 'เครื่องดื่มสุขภาพ', 650.00, 120.00, 890, 'กาแฟอาราบิก้าแท้ ผสานสารสกัดถั่งเช่าทิเบต ไม่มีน้ำตาล', 'Pure Arabica coffee enriched with Tibetan Cordyceps & Organic Reishi', 'ກາເຟອາຣາບິກ້າແທ້ ຜະສານສານສະກັດຖັ່ງເຊົ່າທິເບດ ບໍ່ມີນ້ຳຕານ'),
('prd_003', 'OMC-SRM-03', 'OMC ไบรท์เทนนิ่ง แอนตี้เอจจิ้ง เซรั่ม ไฮยา', 'OMC Brightening & Anti-Aging Hyaluron Serum', 'OMC ໄບຣທ໌ເທນນິ່ງ ແອນຕີ້ເອຈຈິ້ງ ເຊຣັ່ມ ໄຮຢາ', 'สกินแคร์บำรุงผิวหน้า', 1590.00, 400.00, 320, 'เซรั่มเข้มข้นลดเลือนริ้วรอย ฟื้นฟูความกระจ่างใส', 'Concentrated brightening serum with multi-molecular hyaluronic acid', 'ເຊຣັ່ມເຂັ້ມຂຸ້ນຫຼຸດຮອຍຫ່ຽວຍົ່ນ ຟື້ນຟູຜິວໃຫ້ກະຈ່າງໃສ'),
('prd_004', 'OMC-IMM-04', 'OMC อิมมูโน พลัส สมุนไพรฟ้าทะลายโจร & ขมิ้นชัน', 'OMC Immuno Plus Herbal Complex', 'OMC ອິມມູໂນ ພລັສ ສະໝຸນໄພຟ້າທະລາຍໂຈນ & ຂະມິ້ນຊັນ', 'อาหารเสริมเสริมภูมิคุ้มกัน', 890.00, 200.00, 620, 'สูตรเสริมภูมิคุ้มกันร่างกายด้วยสมุนไพรสกัดมาตรฐานสากล', 'Advanced immune boosting formula with standardized botanical extracts', 'ສູດເສີມພູມຄຸ້ມກັນຮ່າງກາຍດ້ວຍສະໝຸນໄພສະກັດມາດຕະຖານສາກົນ');

-- Initial System Settings
INSERT INTO `mlm_system_settings` (`setting_key`, `setting_value`, `description`) VALUES
('COMPANY_NAME', 'OMC Network Corporation Ltd.', 'ชื่อบริษัทผู้ให้บริการ'),
('ADMIN_USERNAME', 'admin', 'ชื่อผู้ใช้เข้าสู่ระบบผู้ดูแลระบบ (Admin Login)'),
('ADMIN_PASSWORD', 'admin123', 'รหัสผ่านผู้ดูแลระบบเริ่มต้น (Default Admin Password)'),
('DEFAULT_CURRENCY', 'THB', 'สกุลเงินหลักของระบบ'),
('FAST_START_BONUS_PERCENT', '50.00', 'เปอร์เซ็นต์โบนัสขยายธุรกิจ Fast Start Bonus'),
('WEAK_LEG_PAIRING_PERCENT', '20.00', 'เปอร์เซ็นต์โบนัสจับคู่สายงานขาอ่อน (Weak Leg)'),
('MATCHING_GEN1_PERCENT', '10.00', 'เปอร์เซ็นต์แมทชิ่งชั้นที่ 1 (ลูก)'),
('MATCHING_GEN2_PERCENT', '5.00', 'เปอร์เซ็นต์แมทชิ่งชั้นที่ 2 (หลาน)'),
('MATCHING_GEN3_PERCENT', '2.00', 'เปอร์เซ็นต์แมทชิ่งชั้นที่ 3 (เหลน)'),
('ALL_SALE_DIAMOND_PERCENT', '3.00', 'กองทุน All Sale สำหรับ Diamond ขึ้นไป'),
('MIN_WITHDRAWAL_AMOUNT', '500.00', 'ยอดถอนเงินขั้นต่ำเข้าบัญชีธนาคาร'),
('WITHDRAWAL_FEE', '30.00', 'ค่าธรรมเนียมการโอนเงินต่อรายการ'),
('WITHHOLDING_TAX_PERCENT', '5.00', 'หักภาษี ณ ที่จ่ายตามกฎหมาย');

SET FOREIGN_KEY_CHECKS = 1;
-- End of SQL Export File

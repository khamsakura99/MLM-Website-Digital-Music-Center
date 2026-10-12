// scripts/generate_all_packages.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { jsPDF } = require('jspdf');

console.log('🚀 Starting OMC MLM Server Deployment & Database Packaging...');

const ROOT_DIR = path.resolve(__dirname, '..');
const DEPLOY_DIR = path.join(ROOT_DIR, 'deployment_package');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const DOWNLOADS_DIR = path.join(PUBLIC_DIR, 'downloads');

// Ensure directories exist
[DEPLOY_DIR, PUBLIC_DIR, DOWNLOADS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// 1. Generate comprehensive MySQL Database SQL file
const sqlFilePath = path.join(DEPLOY_DIR, 'omc_mlm_database.sql');
const sqlContent = `-- =====================================================================
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
DROP TABLE IF EXISTS \`mlm_members\`;
CREATE TABLE \`mlm_members\` (
  \`id\` VARCHAR(36) NOT NULL,
  \`member_code\` VARCHAR(20) NOT NULL,
  \`full_name\` VARCHAR(150) NOT NULL,
  \`nickname\` VARCHAR(50) DEFAULT NULL,
  \`id_card_number\` VARCHAR(30) DEFAULT NULL,
  \`phone\` VARCHAR(30) NOT NULL,
  \`email\` VARCHAR(100) NOT NULL,
  \`address\` TEXT DEFAULT NULL,
  \`province\` VARCHAR(100) DEFAULT NULL,
  \`postcode\` VARCHAR(20) DEFAULT NULL,
  \`rank\` ENUM('Member', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Crown_Diamond') NOT NULL DEFAULT 'Member',
  \`sponsor_code\` VARCHAR(20) DEFAULT NULL,
  \`sponsor_name\` VARCHAR(150) DEFAULT NULL,
  \`upline_code\` VARCHAR(20) DEFAULT NULL,
  \`upline_name\` VARCHAR(150) DEFAULT NULL,
  \`position\` ENUM('L', 'R') DEFAULT 'L',
  \`personal_pv\` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  \`accumulated_pv\` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  \`left_leg_pv\` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  \`right_leg_pv\` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  \`left_leg_members\` INT(11) NOT NULL DEFAULT 0,
  \`right_leg_members\` INT(11) NOT NULL DEFAULT 0,
  \`wallet_balance\` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
  \`total_earnings\` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
  \`autoship_status\` ENUM('active', 'inactive', 'grace') NOT NULL DEFAULT 'active',
  \`autoship_expire_date\` DATE DEFAULT NULL,
  \`join_date\` DATE NOT NULL,
  \`avatar_url\` VARCHAR(255) DEFAULT NULL,
  \`bank_name\` VARCHAR(100) DEFAULT NULL,
  \`bank_code\` VARCHAR(20) DEFAULT NULL,
  \`bank_account_no\` VARCHAR(50) DEFAULT NULL,
  \`bank_account_name\` VARCHAR(150) DEFAULT NULL,
  \`bank_branch\` VARCHAR(100) DEFAULT NULL,
  \`is_bank_verified\` TINYINT(1) NOT NULL DEFAULT 0,
  \`kyc_status\` ENUM('pending', 'verified', 'rejected') NOT NULL DEFAULT 'pending',
  \`transaction_pin\` VARCHAR(10) DEFAULT '123456',
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`idx_member_code\` (\`member_code\`),
  KEY \`idx_sponsor_code\` (\`sponsor_code\`),
  KEY \`idx_upline_code\` (\`upline_code\`),
  KEY \`idx_phone\` (\`phone\`),
  KEY \`idx_email\` (\`email\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Member Profiles & Downline Positions';

-- ---------------------------------------------------------------------
-- 2. Table structure for: mlm_products
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS \`mlm_products\`;
CREATE TABLE \`mlm_products\` (
  \`id\` VARCHAR(36) NOT NULL,
  \`code\` VARCHAR(30) NOT NULL,
  \`name_th\` VARCHAR(150) NOT NULL,
  \`name_en\` VARCHAR(150) NOT NULL,
  \`name_lo\` VARCHAR(150) NOT NULL,
  \`category\` VARCHAR(50) NOT NULL,
  \`price\` DECIMAL(10, 2) NOT NULL,
  \`pv\` DECIMAL(10, 2) NOT NULL,
  \`stock\` INT(11) NOT NULL DEFAULT 100,
  \`rating\` DECIMAL(3, 2) NOT NULL DEFAULT 4.80,
  \`reviews_count\` INT(11) NOT NULL DEFAULT 0,
  \`image_url\` VARCHAR(255) DEFAULT NULL,
  \`description_th\` TEXT DEFAULT NULL,
  \`description_en\` TEXT DEFAULT NULL,
  \`description_lo\` TEXT DEFAULT NULL,
  \`is_active\` TINYINT(1) NOT NULL DEFAULT 1,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`idx_product_code\` (\`code\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='MLM Products & PV Points Catalog';

-- ---------------------------------------------------------------------
-- 3. Table structure for: mlm_orders
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS \`mlm_orders\`;
CREATE TABLE \`mlm_orders\` (
  \`id\` VARCHAR(36) NOT NULL,
  \`order_no\` VARCHAR(40) NOT NULL,
  \`member_code\` VARCHAR(20) NOT NULL,
  \`member_name\` VARCHAR(150) NOT NULL,
  \`order_type\` ENUM('General', 'Autoship', 'Upgrade', 'Promotion') NOT NULL DEFAULT 'General',
  \`order_date\` DATETIME NOT NULL,
  \`status\` ENUM('completed', 'processing', 'shipped', 'cancelled') NOT NULL DEFAULT 'completed',
  \`payment_method\` ENUM('wallet', 'bank_transfer', 'promptpay', 'credit_card') NOT NULL DEFAULT 'wallet',
  \`total_amount\` DECIMAL(12, 2) NOT NULL,
  \`total_pv\` DECIMAL(12, 2) NOT NULL,
  \`shipping_address\` TEXT DEFAULT NULL,
  \`tracking_number\` VARCHAR(50) DEFAULT NULL,
  \`slip_image_url\` VARCHAR(255) DEFAULT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`idx_order_no\` (\`order_no\`),
  KEY \`idx_member_orders\` (\`member_code\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Orders & PV Transactions';

-- ---------------------------------------------------------------------
-- 4. Table structure for: mlm_order_items
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS \`mlm_order_items\`;
CREATE TABLE \`mlm_order_items\` (
  \`id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`order_no\` VARCHAR(40) NOT NULL,
  \`product_id\` VARCHAR(36) NOT NULL,
  \`product_name\` VARCHAR(150) NOT NULL,
  \`quantity\` INT(11) NOT NULL,
  \`price\` DECIMAL(10, 2) NOT NULL,
  \`pv\` DECIMAL(10, 2) NOT NULL,
  \`subtotal_amount\` DECIMAL(12, 2) NOT NULL,
  \`subtotal_pv\` DECIMAL(12, 2) NOT NULL,
  PRIMARY KEY (\`id\`),
  KEY \`idx_order_items\` (\`order_no\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Line items per order';

-- ---------------------------------------------------------------------
-- 5. Table structure for: mlm_wallet_transactions
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS \`mlm_wallet_transactions\`;
CREATE TABLE \`mlm_wallet_transactions\` (
  \`id\` VARCHAR(36) NOT NULL,
  \`tx_no\` VARCHAR(40) NOT NULL,
  \`member_code\` VARCHAR(20) NOT NULL,
  \`type\` ENUM('commission', 'withdrawal', 'transfer_in', 'transfer_out', 'order_payment', 'deposit') NOT NULL,
  \`amount\` DECIMAL(14, 2) NOT NULL,
  \`fee\` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  \`net_amount\` DECIMAL(14, 2) NOT NULL,
  \`balance_after\` DECIMAL(14, 2) NOT NULL,
  \`status\` ENUM('success', 'pending', 'rejected', 'cancelled') NOT NULL DEFAULT 'success',
  \`reference_no\` VARCHAR(50) DEFAULT NULL,
  \`description\` TEXT DEFAULT NULL,
  \`created_at\` DATETIME NOT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`idx_tx_no\` (\`tx_no\`),
  KEY \`idx_wallet_member\` (\`member_code\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='E-Wallet Financial Ledger';

-- ---------------------------------------------------------------------
-- 6. Table structure for: mlm_commission_cycles
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS \`mlm_commission_cycles\`;
CREATE TABLE \`mlm_commission_cycles\` (
  \`id\` VARCHAR(36) NOT NULL,
  \`cycle_code\` VARCHAR(30) NOT NULL,
  \`cycle_name\` VARCHAR(100) NOT NULL,
  \`start_date\` DATE NOT NULL,
  \`end_date\` DATE NOT NULL,
  \`pay_date\` DATE NOT NULL,
  \`status\` ENUM('pending', 'calculating', 'approved', 'transferred') NOT NULL DEFAULT 'transferred',
  \`fast_start_bonus\` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  \`weak_leg_bonus\` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  \`matching_bonus\` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  \`all_sale_bonus\` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  \`total_gross\` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
  \`withholding_tax\` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  \`transfer_fee\` DECIMAL(10, 2) NOT NULL DEFAULT 30.00,
  \`net_payout\` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`idx_cycle_code\` (\`cycle_code\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Weekly/Monthly Commission Calculation Cycles';

-- ---------------------------------------------------------------------
-- 7. Table structure for: mlm_supported_banks
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS \`mlm_supported_banks\`;
CREATE TABLE \`mlm_supported_banks\` (
  \`id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`code\` VARCHAR(20) NOT NULL,
  \`name_th\` VARCHAR(150) NOT NULL,
  \`name_en\` VARCHAR(150) NOT NULL,
  \`name_lo\` VARCHAR(150) NOT NULL,
  \`country\` ENUM('TH', 'LA', 'OTHER') NOT NULL DEFAULT 'TH',
  \`is_active\` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`idx_bank_code\` (\`code\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Supported Thai & Lao Commercial Banks';

-- ---------------------------------------------------------------------
-- 8. Table structure for: mlm_company_bank_accounts
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS \`mlm_company_bank_accounts\` (
  \`id\` VARCHAR(36) NOT NULL,
  \`bank_name\` VARCHAR(150) NOT NULL,
  \`bank_code\` VARCHAR(20) NOT NULL,
  \`account_number\` VARCHAR(50) NOT NULL,
  \`account_name\` VARCHAR(150) NOT NULL,
  \`branch\` VARCHAR(100) DEFAULT NULL,
  \`promptpay_id\` VARCHAR(50) DEFAULT NULL,
  \`qr_code_url\` VARCHAR(255) DEFAULT NULL,
  \`country\` ENUM('TH', 'LA') NOT NULL DEFAULT 'TH',
  \`is_active\` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Company Bank Accounts for Deposit Transfers';

-- ---------------------------------------------------------------------
-- 9. Table structure for: mlm_system_settings
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS \`mlm_system_settings\`;
CREATE TABLE \`mlm_system_settings\` (
  \`setting_key\` VARCHAR(50) NOT NULL,
  \`setting_value\` TEXT NOT NULL,
  \`description\` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (\`setting_key\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='System Configuration & Compensation Plan Rules';

-- =====================================================================
-- INITIAL SEED DATA
-- =====================================================================

-- Supported Banks (Thailand & Laos)
INSERT INTO \`mlm_supported_banks\` (\`code\`, \`name_th\`, \`name_en\`, \`name_lo\`, \`country\`) VALUES
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
INSERT INTO \`mlm_company_bank_accounts\` (\`id\`, \`bank_name\`, \`bank_code\`, \`account_number\`, \`account_name\`, \`branch\`, \`promptpay_id\`, \`country\`, \`is_active\`) VALUES
('cba_001', 'ธนาคารกสิกรไทย (Kasikornbank)', 'KBANK', '095-2-88776-6', 'บริษัท โอเอ็มซี เน็ตเวิร์ค คอร์ปอเรชั่น จำกัด', 'สาขารัชโยธิน', '0105566012345', 'TH', 1),
('cba_002', 'ธนาคารไทยพาณิชย์ (SCB)', 'SCB', '118-4-55221-9', 'บริษัท โอเอ็มซี เน็ตเวิร์ค คอร์ปอเรชั่น จำกัด', 'สาขาลาดพร้าว', '0105566012345', 'TH', 1),
('cba_003', 'BANQUE POUR LE COMMERCE EXTERIEUR LAO PUBLIC (BCEL)', 'BCEL', '010-12-00-01234567-001', 'OMC LAO TRADING CO., LTD (ບໍລິສັດ ໂອເອັມຊີ ລາວ ຈຳກັດ)', 'ສຳນັກງານໃຫຍ່ ນະຄອນຫຼວງວຽງຈັນ', NULL, 'LA', 1);

-- Members Seed Data
INSERT INTO \`mlm_members\` (\`id\`, \`member_code\`, \`full_name\`, \`nickname\`, \`id_card_number\`, \`phone\`, \`email\`, \`address\`, \`province\`, \`postcode\`, \`rank\`, \`sponsor_code\`, \`sponsor_name\`, \`upline_code\`, \`upline_name\`, \`position\`, \`personal_pv\`, \`accumulated_pv\`, \`left_leg_pv\`, \`right_leg_pv\`, \`left_leg_members\`, \`right_leg_members\`, \`wallet_balance\`, \`total_earnings\`, \`autoship_status\`, \`autoship_expire_date\`, \`join_date\`, \`avatar_url\`, \`bank_name\`, \`bank_code\`, \`bank_account_no\`, \`bank_account_name\`, \`bank_branch\`, \`is_bank_verified\`, \`kyc_status\`) VALUES
('usr_001', 'TH889214', 'กิตติศักดิ์ เจริญสุขสวัสดิ์', 'คุณท็อป (Top)', '1-1020-00894-32-1', '089-765-4321', 'kittisak.omc@gmail.com', '99/42 หมู่ 5 ถนนรัชดาภิเษก แขวงจตุจักร เขตจตุจักร', 'กรุงเทพมหานคร', '10900', 'Diamond', 'TH880001', 'วรพจน์ ธนบูลย์ (VP Leader)', 'TH880001', 'วรพจน์ ธนบูลย์ (VP Leader)', 'L', 3250.00, 48600.00, 285400.00, 192800.00, 148, 96, 84650.00, 428750.00, 'active', '2026-10-31', '2024-03-15', '/assets/avatar.jpg', 'ธนาคารกสิกรไทย (Kasikornbank)', 'KBANK', '045-8-91234-5', 'นาย กิตติศักดิ์ เจริญสุขสวัสดิ์', 'สาขา รัชโยธิน', 1, 'verified'),
('usr_002', 'TH889502', 'ณัชชา ภัทรไพศาล', 'คุณมายด์', '3-1002-00431-11-2', '081-234-5678', 'natcha.pat@omc.th', '12/88 หมู่บ้านศุภาลัย ถ.แจ้งวัฒนะ ต.คลองเกลือ อ.ปากเกร็ด', 'นนทบุรี', '11120', 'Gold', 'TH889214', 'กิตติศักดิ์ เจริญสุขสวัสดิ์', 'TH889214', 'กิตติศักดิ์ เจริญสุขสวัสดิ์', 'L', 1500.00, 14200.00, 84000.00, 62500.00, 42, 31, 19400.00, 82400.00, 'active', '2026-10-25', '2024-08-10', '/assets/avatar.jpg', 'ธนาคารไทยพาณิชย์ (SCB)', 'SCB', '112-2-90123-4', 'น.ส. ณัชชา ภัทรไพศาล', 'สาขา แจ้งวัฒนะ', 1, 'verified'),
('usr_003', 'TH890118', 'ธนากร สุวรรณสิทธิ์', 'คุณบอส', '1-5099-00124-78-9', '092-889-1122', 'thanakorn.s@omc.th', '204/15 ถนนนิมมานเหมินท์ ต.สุเทพ อ.เมือง', 'เชียงใหม่', '50200', 'Platinum', 'TH889214', 'กิตติศักดิ์ เจริญสุขสวัสดิ์', 'TH889214', 'กิตติศักดิ์ เจริญสุขสวัสดิ์', 'R', 2100.00, 26800.00, 112000.00, 94000.00, 56, 44, 38900.00, 165000.00, 'active', '2026-10-28', '2024-05-20', '/assets/avatar.jpg', 'ธนาคารกรุงเทพ (Bangkok Bank)', 'BBL', '230-0-84512-3', 'นาย ธนากร สุวรรณสิทธิ์', 'สาขา นิมมานเหมินท์', 1, 'verified');

-- Products Seed Data
INSERT INTO \`mlm_products\` (\`id\`, \`code\`, \`name_th\`, \`name_en\`, \`name_lo\`, \`category\`, \`price\`, \`pv\`, \`stock\`, \`description_th\`, \`description_en\`, \`description_lo\`) VALUES
('prd_001', 'OMC-COL-01', 'OMC คอลลาเจน โกลด์ พลัส ไตรเปปไทด์', 'OMC Collagen Gold Plus Tripeptide', 'OMC ຄອນລາເຈນ ໂກລ ພລັສ ໄຕຣເປບໄທດ໌', 'อาหารเสริมเพื่อความงาม', 1290.00, 300.00, 450, 'คอลลาเจนพรีเมียมจากญี่ปุ่น บำรุงผิว ข้อต่อ กระดูก', 'Premium Japanese Collagen Tripeptide for radiant skin and healthy joints', 'ຄອນລາເຈນພຣີມ່ຽມຈາກຍີ່ປຸ່ນ ບຳລຸງຜິວພັນ ແລະ ຂໍ້ຕໍ່ກະດູກ'),
('prd_002', 'OMC-COF-02', 'OMC กาแฟถั่งเช่า ผสมเห็ดหลินจือ สูตรเจ', 'OMC Cordyceps & Reishi Health Coffee', 'OMC ກາເຟຖັ່ງເຊົ່າ ປະສົມເຫັດຫຼິນຈື ສູດເຈ', 'เครื่องดื่มสุขภาพ', 650.00, 120.00, 890, 'กาแฟอาราบิก้าแท้ ผสานสารสกัดถั่งเช่าทิเบต ไม่มีน้ำตาล', 'Pure Arabica coffee enriched with Tibetan Cordyceps & Organic Reishi', 'ກາເຟອາຣາບິກ້າແທ້ ຜະສານສານສະກັດຖັ່ງເຊົ່າທິເບດ ບໍ່ມີນ້ຳຕານ'),
('prd_003', 'OMC-SRM-03', 'OMC ไบรท์เทนนิ่ง แอนตี้เอจจิ้ง เซรั่ม ไฮยา', 'OMC Brightening & Anti-Aging Hyaluron Serum', 'OMC ໄບຣທ໌ເທນນິ່ງ ແອນຕີ້ເອຈຈິ້ງ ເຊຣັ່ມ ໄຮຢາ', 'สกินแคร์บำรุงผิวหน้า', 1590.00, 400.00, 320, 'เซรั่มเข้มข้นลดเลือนริ้วรอย ฟื้นฟูความกระจ่างใส', 'Concentrated brightening serum with multi-molecular hyaluronic acid', 'ເຊຣັ່ມເຂັ້ມຂຸ້ນຫຼຸດຮອຍຫ່ຽວຍົ່ນ ຟື້ນຟູຜິວໃຫ້ກະຈ່າງໃສ'),
('prd_004', 'OMC-IMM-04', 'OMC อิมมูโน พลัส สมุนไพรฟ้าทะลายโจร & ขมิ้นชัน', 'OMC Immuno Plus Herbal Complex', 'OMC ອິມມູໂນ ພລັສ ສະໝຸນໄພຟ້າທະລາຍໂຈນ & ຂະມິ້ນຊັນ', 'อาหารเสริมเสริมภูมิคุ้มกัน', 890.00, 200.00, 620, 'สูตรเสริมภูมิคุ้มกันร่างกายด้วยสมุนไพรสกัดมาตรฐานสากล', 'Advanced immune boosting formula with standardized botanical extracts', 'ສູດເສີມພູມຄຸ້ມກັນຮ່າງກາຍດ້ວຍສະໝຸນໄພສະກັດມາດຕະຖານສາກົນ');

-- Initial System Settings
INSERT INTO \`mlm_system_settings\` (\`setting_key\`, \`setting_value\`, \`description\`) VALUES
('COMPANY_NAME', 'OMC Network Corporation Ltd.', 'ชื่อบริษัทผู้ให้บริการ'),
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
`;

fs.writeFileSync(sqlFilePath, sqlContent, 'utf8');
fs.writeFileSync(path.join(DOWNLOADS_DIR, 'omc_mlm_database.sql'), sqlContent, 'utf8');
console.log('✅ Generated MySQL database SQL file');

// 2. Generate JSON Data Exports
const jsonExport = {
  version: '2.0.0',
  exportDate: new Date().toISOString(),
  system: 'OMC MLM Enterprise System',
  supportedLanguages: ['th', 'en', 'lo'],
  members: [
    {
      id: 'usr_001',
      memberCode: 'TH889214',
      fullName: 'กิตติศักดิ์ เจริญสุขสวัสดิ์',
      phone: '089-765-4321',
      rank: 'Diamond',
      walletBalance: 84650.0,
      bank: {
        bankName: 'ธนาคารกสิกรไทย (Kasikornbank)',
        bankCode: 'KBANK',
        accountNumber: '045-8-91234-5'
      }
    },
    {
      id: 'usr_002',
      memberCode: 'TH889502',
      fullName: 'ณัชชา ภัทรไพศาล',
      phone: '081-234-5678',
      rank: 'Gold',
      walletBalance: 19400.0,
      bank: {
        bankName: 'ธนาคารไทยพาณิชย์ (SCB)',
        bankCode: 'SCB',
        accountNumber: '112-2-90123-4'
      }
    }
  ],
  supportedBanks: [
    { code: 'KBANK', nameTh: 'ธนาคารกสิกรไทย', nameEn: 'Kasikornbank', country: 'TH' },
    { code: 'SCB', nameTh: 'ธนาคารไทยพาณิชย์', nameEn: 'Siam Commercial Bank', country: 'TH' },
    { code: 'BBL', nameTh: 'ธนาคารกรุงเทพ', nameEn: 'Bangkok Bank', country: 'TH' },
    { code: 'BCEL', nameTh: 'ธนาคารการค้าต่างประเทศลาว (BCEL)', nameEn: 'BANQUE POUR LE COMMERCE EXTERIEUR LAO PUBLIC', nameLo: 'ທະນາຄານການຄ້າຕ່າງປະເທດລາວ', country: 'LA' },
    { code: 'LDB', nameTh: 'ธนาคารพัฒนาลาว (LDB)', nameEn: 'Development Bank CO LTD (LDB)', nameLo: 'ທະນາຄານພັດທະນາລາວ', country: 'LA' },
    { code: 'JDB', nameTh: 'ธนาคารร่วมพัฒนา (JDB)', nameEn: 'Joint Development Bank (JDB)', nameLo: 'ທະນາຄານຮ່ວມພັດທະນາ', country: 'LA' },
    { code: 'VIETIN', nameTh: 'ธนาคารเวียตินแบงก์ ลาว (VietinBank Lao)', nameEn: 'VietinBank Lao | Vientiane', nameLo: 'ທະນາຄານຫວຽດຕິນລາວ', country: 'LA' }
  ]
};

fs.writeFileSync(path.join(DEPLOY_DIR, 'database_export.json'), JSON.stringify(jsonExport, null, 2), 'utf8');
fs.writeFileSync(path.join(DOWNLOADS_DIR, 'database_export.json'), JSON.stringify(jsonExport, null, 2), 'utf8');
console.log('✅ Generated JSON data exports');

// 3. Generate Apache .htaccess
const htaccessContent = `# =====================================================================
# OMC MLM SYSTEM - PRODUCTION APACHE WEB SERVER CONFIGURATION (.htaccess)
# Place this file in public_html or your domain root directory
# =====================================================================

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # 1. Force HTTPS (Uncomment below 2 lines if you have SSL certificate)
  # RewriteCond %{HTTPS} off
  # RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

  # 2. Prevent direct directory browsing
  Options -Indexes

  # 3. Handle Single Page Application (SPA) client-side routing
  # If file or directory exists, serve it directly
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # Otherwise redirect all requests to index.html
  RewriteRule ^ index.html [L]
</IfModule>

# =====================================================================
# GZIP / BROTLI COMPRESSION FOR HIGH PERFORMANCE & FAST LOADING
# =====================================================================
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/plain
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/xml
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE application/xml
  AddOutputFilterByType DEFLATE application/xhtml+xml
  AddOutputFilterByType DEFLATE application/rss+xml
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/x-javascript
  AddOutputFilterByType DEFLATE application/json
  AddOutputFilterByType DEFLATE image/svg+xml
</IfModule>

# =====================================================================
# BROWSER CACHING HEADERS FOR STATIC ASSETS
# =====================================================================
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresDefault "access plus 1 month"
  ExpiresByType text/html "access plus 0 seconds"
  ExpiresByType application/json "access plus 0 seconds"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# =====================================================================
# SECURITY HEADERS
# =====================================================================
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
`;

fs.writeFileSync(path.join(DEPLOY_DIR, '.htaccess'), htaccessContent, 'utf8');
fs.writeFileSync(path.join(ROOT_DIR, '.htaccess'), htaccessContent, 'utf8');
if (fs.existsSync(DIST_DIR)) {
  fs.writeFileSync(path.join(DIST_DIR, '.htaccess'), htaccessContent, 'utf8');
}
console.log('✅ Generated Apache .htaccess file');

// 4. Generate Nginx configuration snippet
const nginxContent = `# =====================================================================
# OMC MLM SYSTEM - NGINX CONFIGURATION SNIPPET
# Put inside your server { ... } block
# =====================================================================

server {
    listen 80;
    server_name your-mlm-domain.com www.your-mlm-domain.com;
    root /var/www/omc_mlm/dist;
    index index.html;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;

    # Single Page Application SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static assets cache
    location ~* \\.(?:jpg|jpeg|gif|png|ico|cur|gz|svg|svgz|mp4|ogg|ogv|webm|htc|woff2|woff|ttf)$ {
        expires 1y;
        access_log off;
        add_header Cache-Control "public";
    }

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
}
`;
fs.writeFileSync(path.join(DEPLOY_DIR, 'nginx.conf'), nginxContent, 'utf8');

// 5. Generate PHP PDO Database Connection Helper
const phpDbConnect = `<?php
/**
 * OMC MLM System - Database Connection Helper (PHP PDO)
 * Compatible with cPanel, Plesk, Apache, LiteSpeed & PHP 7.4 - 8.3+
 */

$db_host = 'localhost';
$db_name = 'omc_mlm_database';
$db_user = 'root';        // Replace with your cPanel database username
$db_pass = '';            // Replace with your cPanel database password
$charset = 'utf8mb4';

$dsn = "mysql:host=$db_host;dbname=$db_name;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $db_user, $db_pass, $options);
    // Connection successful
} catch (\\PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}
`;
fs.writeFileSync(path.join(DEPLOY_DIR, 'db_connect.php'), phpDbConnect, 'utf8');

// 6. Generate Node.js Express Production Server
const serverJs = `/**
 * OMC MLM Enterprise System - Production Node.js Server
 * Run with: node server.js
 */
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve static assets from dist
app.use(express.static(path.join(__dirname, 'dist')));

// API health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', system: 'OMC MLM System', timestamp: new Date() });
});

// SPA fallback for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(\`OMC MLM Server running at http://localhost:\${PORT}\`);
});
`;
fs.writeFileSync(path.join(DEPLOY_DIR, 'server.js'), serverJs, 'utf8');

// 7. Generate Step-by-Step PDF Setup Guide using jsPDF
console.log('📄 Generating PDF Step-by-Step Setup Guide...');
const doc = new jsPDF({
  orientation: 'portrait',
  unit: 'mm',
  format: 'a4'
});

const pageWidth = doc.internal.pageSize.getWidth();
const pageHeight = doc.internal.pageSize.getHeight();
const margin = 15;
const contentWidth = pageWidth - margin * 2;
let cursorY = margin;

function checkPageBreak(neededHeight) {
  if (cursorY + neededHeight > pageHeight - margin) {
    doc.addPage();
    cursorY = margin;
    // Header banner on subsequent pages
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(margin, cursorY, contentWidth, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text('OMC MLM System - Server FTP & Database Setup Guide', margin + 3, cursorY + 5.5);
    doc.setTextColor(30, 41, 59);
    cursorY += 14;
  }
}

// COVER / HEADER
doc.setFillColor(15, 23, 42); // Dark slate
doc.rect(margin, cursorY, contentWidth, 34, 'F');

doc.setTextColor(245, 158, 11); // Amber
doc.setFontSize(16);
doc.setFont('helvetica', 'bold');
doc.text('OMC MLM ENTERPRISE SYSTEM', margin + 6, cursorY + 11);

doc.setTextColor(255, 255, 255);
doc.setFontSize(11);
doc.setFont('helvetica', 'normal');
doc.text('STEP-BY-STEP FTP DEPLOYMENT & DATABASE SETUP GUIDE', margin + 6, cursorY + 19);
doc.setFontSize(9);
doc.setTextColor(148, 163, 184);
doc.text('Version 2.0 | Multi-Language (TH, EN, LO) | Production Ready', margin + 6, cursorY + 27);

cursorY += 40;

// INTRO BOX
doc.setFillColor(241, 245, 249);
doc.rect(margin, cursorY, contentWidth, 20, 'F');
doc.setTextColor(30, 41, 59);
doc.setFontSize(9.5);
doc.setFont('helvetica', 'normal');
doc.text('This comprehensive guide walks you through uploading the OMC MLM System to your web hosting', margin + 4, cursorY + 6);
doc.text('server via FTP (cPanel / DirectAdmin / Plesk / VPS) and setting up the MySQL database.', margin + 4, cursorY + 12);
doc.text('Files included: Production static build, .htaccess, MySQL database script, and JSON data exports.', margin + 4, cursorY + 18);

cursorY += 26;

// SECTION 1: PACKAGE CONTENTS
doc.setFillColor(30, 58, 138); // Blue
doc.rect(margin, cursorY, contentWidth, 7, 'F');
doc.setTextColor(255, 255, 255);
doc.setFontSize(10);
doc.setFont('helvetica', 'bold');
doc.text('1. PACKAGE CONTENTS & FILES OVERVIEW', margin + 4, cursorY + 5);
cursorY += 11;

const filesList = [
  ['omc_mlm_ftp_dist.zip', 'Production ready website files (drop directly into public_html)'],
  ['.htaccess', 'Apache SPA rewrite rules (prevents 404 on page refresh) + GZIP cache'],
  ['omc_mlm_database.sql', 'Complete MySQL database schema + initial seed data + supported banks'],
  ['database_export.json', 'Full structured database export in JSON format'],
  ['db_connect.php', 'Ready-to-use PHP PDO database connection helper'],
  ['server.js', 'Optional Node.js Express server script (for VPS / Node.js hosting)']
];

filesList.forEach(([file, desc]) => {
  checkPageBreak(8);
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, cursorY, contentWidth, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`[FILE] ${file}`, margin + 3, cursorY + 4.8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(desc, margin + 55, cursorY + 4.8);
  cursorY += 8;
});

cursorY += 4;

// SECTION 2: FTP CONNECTION SETUP
checkPageBreak(40);
doc.setFillColor(30, 58, 138);
doc.rect(margin, cursorY, contentWidth, 7, 'F');
doc.setTextColor(255, 255, 255);
doc.setFontSize(10);
doc.setFont('helvetica', 'bold');
doc.text('2. FTP CLIENT SETUP (FileZilla / Cyberduck / WinSCP)', margin + 4, cursorY + 5);
cursorY += 11;

const ftpSteps = [
  'Step 2.1: Open FileZilla Client (or your preferred FTP client).',
  'Step 2.2: Go to File > Site Manager > New Site.',
  'Step 2.3: Host: Enter your server domain or IP address (e.g., ftp.yourdomain.com).',
  'Step 2.4: Protocol: Select "FTP - File Transfer Protocol" (or SFTP if using SSH key).',
  'Step 2.5: Encryption: Select "Use explicit FTP over TLS if available" or "Plain FTP".',
  'Step 2.6: Logon Type: Select "Normal" and input your FTP Username and Password.',
  'Step 2.7: Transfer Settings: Set Transfer mode to "Passive". Port: 21 (or 22 for SFTP).',
  'Step 2.8: Click "Connect" and verify you are connected to the remote server directory tree.'
];

ftpSteps.forEach(st => {
  checkPageBreak(6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text(st, margin + 3, cursorY + 4);
  cursorY += 6;
});

cursorY += 4;

// SECTION 3: UPLOADING FILES
checkPageBreak(40);
doc.setFillColor(30, 58, 138);
doc.rect(margin, cursorY, contentWidth, 7, 'F');
doc.setTextColor(255, 255, 255);
doc.setFontSize(10);
doc.setFont('helvetica', 'bold');
doc.text('3. UPLOADING WEBSITE TO YOUR WEB SERVER (public_html)', margin + 4, cursorY + 5);
cursorY += 11;

const uploadSteps = [
  'Option A (Via FTP Client):',
  '  1. Unzip "omc_mlm_ftp_dist.zip" on your local computer.',
  '  2. In FileZilla, navigate to remote directory "/public_html" (or "/www" or your subdomain root).',
  '  3. Select all extracted files (index.html, assets folder, .htaccess) and drag them into public_html.',
  '  4. Ensure ".htaccess" is uploaded (make sure hidden files are visible in FileZilla: Server > Force showing hidden files).',
  '',
  'Option B (Via cPanel File Manager - Fastest Method):',
  '  1. Log in to your cPanel hosting account.',
  '  2. Open "File Manager" and navigate to "public_html".',
  '  3. Click "Upload" and choose "omc_mlm_ftp_dist.zip".',
  '  4. Right click the uploaded zip file and click "Extract".',
  '  5. Verify "index.html" is in the root of public_html.'
];

uploadSteps.forEach(st => {
  checkPageBreak(5.5);
  doc.setFont('helvetica', st.startsWith('Option') ? 'bold' : 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(st.startsWith('Option') ? 15 : 51, st.startsWith('Option') ? 23 : 65, st.startsWith('Option') ? 42 : 85);
  doc.text(st, margin + 3, cursorY + 4);
  cursorY += 5.5;
});

cursorY += 4;

// SECTION 4: MYSQL DATABASE SETUP
checkPageBreak(50);
doc.setFillColor(30, 58, 138);
doc.rect(margin, cursorY, contentWidth, 7, 'F');
doc.setTextColor(255, 255, 255);
doc.setFontSize(10);
doc.setFont('helvetica', 'bold');
doc.text('4. MYSQL DATABASE CREATION & IMPORT VIA phpMyAdmin', margin + 4, cursorY + 5);
cursorY += 11;

const dbSteps = [
  'Step 4.1: In cPanel, click "MySQL Database Wizard" or "MySQL Databases".',
  'Step 4.2: Create a new database (e.g., "youruser_omcmlm").',
  'Step 4.3: Create a database user and assign a strong password.',
  'Step 4.4: Add the user to the database and grant "ALL PRIVILEGES".',
  'Step 4.5: Return to cPanel home and open "phpMyAdmin".',
  'Step 4.6: Click your newly created database in the left sidebar.',
  'Step 4.7: Click the "Import" tab at the top menu.',
  'Step 4.8: Click "Choose File" and select "omc_mlm_database.sql".',
  'Step 4.9: Ensure Character set is "utf8mb4" and click "Go" or "Import".',
  'Step 4.10: You will see green success messages: 9 tables and initial seed data created successfully!'
];

dbSteps.forEach(st => {
  checkPageBreak(6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text(st, margin + 3, cursorY + 4);
  cursorY += 6;
});

cursorY += 4;

// SECTION 5: APACHE REWRITE & SPA FIX
checkPageBreak(45);
doc.setFillColor(30, 58, 138);
doc.rect(margin, cursorY, contentWidth, 7, 'F');
doc.setTextColor(255, 255, 255);
doc.setFontSize(10);
doc.setFont('helvetica', 'bold');
doc.text('5. APACHE .htaccess & PREVENTING 404 NOT FOUND ERRORS', margin + 4, cursorY + 5);
cursorY += 11;

const htaccessNotes = [
  'Because this application is a modern Single Page Application (SPA), all routes (e.g. /dashboard,',
  '/genealogy, /admin) are handled client-side by JavaScript. Without URL rewrite, refreshing a subpage',
  'on Apache will cause a "404 Not Found" error.',
  '',
  'The included ".htaccess" file solves this completely by routing all requests to "index.html":',
  '  RewriteEngine On',
  '  RewriteCond %{REQUEST_FILENAME} !-f',
  '  RewriteCond %{REQUEST_FILENAME} !-d',
  '  RewriteRule . /index.html [L]',
  '',
  'Note: Ensure your web server has "mod_rewrite" enabled (standard on 99% of cPanel and Apache servers).'
];

htaccessNotes.forEach(st => {
  checkPageBreak(5.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text(st, margin + 3, cursorY + 4);
  cursorY += 5.5;
});

cursorY += 4;

// SECTION 6: DEFAULT TEST ACCOUNTS
checkPageBreak(40);
doc.setFillColor(30, 58, 138);
doc.rect(margin, cursorY, contentWidth, 7, 'F');
doc.setTextColor(255, 255, 255);
doc.setFontSize(10);
doc.setFont('helvetica', 'bold');
doc.text('6. DEFAULT TEST ACCOUNTS & SYSTEM ACCESS', margin + 4, cursorY + 5);
cursorY += 11;

const testAccounts = [
  ['Primary Member:', 'Code: TH889214 | Kittisak (Diamond) | PIN: 123456'],
  ['Alternative Member 2:', 'Code: TH889502 | Natcha (Gold) | PIN: 123456'],
  ['Alternative Member 3:', 'Code: TH890118 | Thanakorn (Platinum) | PIN: 123456'],
  ['Admin Console:', 'Switch to Admin via user menu or Admin Mode button']
];

testAccounts.forEach(([role, creds]) => {
  checkPageBreak(7);
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, cursorY, contentWidth, 6.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(role, margin + 3, cursorY + 4.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(creds, margin + 45, cursorY + 4.5);
  cursorY += 7.5;
});

// FOOTER ON LAST PAGE
checkPageBreak(25);
doc.setFillColor(241, 245, 249);
doc.rect(margin, cursorY, contentWidth, 16, 'F');
doc.setFont('helvetica', 'bold');
doc.setFontSize(9);
doc.setTextColor(30, 41, 59);
doc.text('SUPPORT & VERIFICATION', margin + 4, cursorY + 5.5);
doc.setFont('helvetica', 'normal');
doc.setFontSize(8);
doc.setTextColor(71, 85, 105);
doc.text('Your OMC MLM System includes Thai, English, and Lao language support + Lao bank integration.', margin + 4, cursorY + 10.5);
doc.text('Need assistance? Upload this PDF to your server administrator or technical hosting support.', margin + 4, cursorY + 14.5);

const pdfFilePath = path.join(DEPLOY_DIR, 'STEP_BY_STEP_SETUP_GUIDE.pdf');
const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
fs.writeFileSync(pdfFilePath, pdfBuffer);
fs.writeFileSync(path.join(DOWNLOADS_DIR, 'STEP_BY_STEP_SETUP_GUIDE.pdf'), pdfBuffer);
console.log('✅ Generated PDF Step-by-Step Setup Guide');

// 8. Generate HTML version of the Setup Guide (viewable in browser & printable)
const htmlGuide = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OMC MLM System - Step-by-Step FTP & Server Setup Guide</title>
  <style>
    :root {
      --primary: #2563eb;
      --primary-dark: #1d4ed8;
      --bg: #0f172a;
      --card-bg: #1e293b;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --border: #334155;
      --amber: #f59e0b;
      --emerald: #10b981;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #f8fafc;
      color: #1e293b;
      line-height: 1.6;
      padding: 24px;
    }
    .container { max-width: 900px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden; border: 1px solid #e2e8f0; }
    .header { background: #0f172a; color: white; padding: 32px; border-bottom: 4px solid #f59e0b; }
    .header h1 { font-size: 26px; color: #f59e0b; margin-bottom: 8px; font-weight: 700; }
    .header p { color: #94a3b8; font-size: 15px; }
    .badge { display: inline-block; background: #1e293b; border: 1px solid #334155; color: #38bdf8; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 9999px; margin-top: 12px; }
    .content { padding: 32px; }
    .btn-print { float: right; background: #2563eb; color: white; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 600; cursor: pointer; }
    .btn-print:hover { background: #1d4ed8; }
    h2 { font-size: 19px; color: #0f172a; margin: 28px 0 14px; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0; display: flex; align-items: center; gap: 8px; }
    h3 { font-size: 16px; color: #1e293b; margin: 18px 0 8px; }
    p, li { font-size: 14.5px; color: #334155; margin-bottom: 8px; }
    ul, ol { padding-left: 24px; margin-bottom: 16px; }
    pre, code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
    pre { background: #0f172a; color: #e2e8f0; padding: 16px; border-radius: 8px; overflow-x: auto; font-size: 13px; margin: 12px 0 18px; border: 1px solid #1e293b; }
    .table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13.5px; }
    .table th, .table td { padding: 10px 14px; border: 1px solid #e2e8f0; text-align: left; }
    .table th { background: #f1f5f9; font-weight: 600; color: #0f172a; }
    .callout { background: #eff6ff; border-left: 4px solid #2563eb; padding: 14px 18px; border-radius: 0 8px 8px 0; margin: 16px 0; }
    .callout-amber { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 14px 18px; border-radius: 0 8px 8px 0; margin: 16px 0; }
    @media print {
      body { background: white; padding: 0; }
      .container { border: none; box-shadow: none; max-width: 100%; }
      .btn-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <button class="btn-print" onclick="window.print()">🖨️ Print / Save as PDF</button>
      <h1>OMC MLM Enterprise System</h1>
      <p>Complete Step-by-Step FTP Server Deployment & Database Setup Manual</p>
      <span class="badge">Version 2.0 • Multi-Language (TH, EN, LO) • Lao Banks Support</span>
    </div>
    <div class="content">
      <div class="callout">
        <strong>Overview:</strong> This guide provides full instructions for uploading the compiled OMC MLM application and database to your hosting server (cPanel, DirectAdmin, Plesk, Apache, LiteSpeed, Nginx, or VPS) using standard FTP.
      </div>

      <h2>📦 1. Included Files & Packages</h2>
      <table class="table">
        <thead>
          <tr>
            <th>File / Archive</th>
            <th>Description & Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>omc_mlm_ftp_dist.zip</strong></td>
            <td>Ready-to-deploy production build for web server. Extract directly into <code>public_html</code>.</td>
          </tr>
          <tr>
            <td><strong>omc_mlm_database.sql</strong></td>
            <td>MySQL / MariaDB database schema, tables, and pre-seeded sample data (members, products, orders, banks).</td>
          </tr>
          <tr>
            <td><strong>.htaccess</strong></td>
            <td>Pre-configured Apache configuration with SPA rewrite rules to prevent 404 on page reload, Gzip compression, and security headers.</td>
          </tr>
          <tr>
            <td><strong>database_export.json</strong></td>
            <td>Complete database data in JSON format for REST API or NoSQL imports.</td>
          </tr>
          <tr>
            <td><strong>db_connect.php</strong></td>
            <td>PHP PDO database connection script for PHP hosting environments.</td>
          </tr>
          <tr>
            <td><strong>server.js</strong></td>
            <td>Production Node.js Express server script (for VPS, Render, PM2, or cPanel Node.js Selector).</td>
          </tr>
        </tbody>
      </table>

      <h2>🌐 2. FTP Connection Guide (FileZilla)</h2>
      <ol>
        <li>Download and open <strong>FileZilla Client</strong> (free from filezilla-project.org).</li>
        <li>Go to <strong>File &gt; Site Manager &gt; New Site</strong>.</li>
        <li>Configure the connection settings:
          <ul>
            <li><strong>Host:</strong> <code>ftp.yourdomain.com</code> (or server IP address)</li>
            <li><strong>Port:</strong> <code>21</code> (or <code>22</code> if using SFTP)</li>
            <li><strong>Protocol:</strong> FTP - File Transfer Protocol</li>
            <li><strong>Encryption:</strong> Require explicit FTP over TLS (or Only use plain FTP if TLS not supported)</li>
            <li><strong>Logon Type:</strong> Normal</li>
            <li><strong>User &amp; Password:</strong> Your cPanel / hosting FTP credentials</li>
          </ul>
        </li>
        <li>Click <strong>Connect</strong> to establish the connection.</li>
      </ol>

      <h2>🚀 3. Uploading Files to Your Web Server</h2>
      <h3>Method A: cPanel File Manager (Recommended - Fastest)</h3>
      <ol>
        <li>Log into your hosting <strong>cPanel</strong>.</li>
        <li>Open <strong>File Manager</strong> and navigate to <strong>public_html</strong> (or your subdomain directory).</li>
        <li>Click <strong>Upload</strong> and upload <code>omc_mlm_ftp_dist.zip</code>.</li>
        <li>Right-click the uploaded zip file and select <strong>Extract</strong>.</li>
        <li>Confirm all files (<code>index.html</code>, <code>assets/</code>, <code>.htaccess</code>) are directly inside <code>public_html</code>.</li>
      </ol>

      <h3>Method B: FileZilla FTP Upload</h3>
      <ol>
        <li>Unzip <code>omc_mlm_ftp_dist.zip</code> on your local computer.</li>
        <li>In FileZilla right panel, open <code>/public_html</code>.</li>
        <li>In FileZilla left panel, select all extracted files and folders.</li>
        <li>Right-click and select <strong>Upload</strong>.</li>
        <li>Verify <code>.htaccess</code> is uploaded (In FileZilla menu: <em>Server &gt; Force showing hidden files</em>).</li>
      </ol>

      <h2>🗄️ 4. MySQL Database Setup via phpMyAdmin</h2>
      <ol>
        <li>In cPanel, click <strong>MySQL Databases</strong> (or MySQL Database Wizard).</li>
        <li>Create a new database (e.g., <code>user_omcmlm</code>).</li>
        <li>Create a MySQL user, generate a secure password, and add the user to the database with <strong>ALL PRIVILEGES</strong>.</li>
        <li>Go back to cPanel home and open <strong>phpMyAdmin</strong>.</li>
        <li>Select your database from the left navigation panel.</li>
        <li>Click the <strong>Import</strong> tab at the top.</li>
        <li>Click <strong>Choose File</strong> and select <code>omc_mlm_database.sql</code>.</li>
        <li>Click <strong>Go / Import</strong> at the bottom.</li>
        <li>All 9 tables with complete seed data, supported Thai &amp; Lao banks, and test members will be created!</li>
      </ol>

      <h2>⚙️ 5. Apache .htaccess & Preventing 404 Errors</h2>
      <p>Because the app is a Single Page Application (SPA), routing is handled on the client. The included <code>.htaccess</code> file redirects all paths back to <code>index.html</code> so refreshing pages like <code>/dashboard</code> or <code>/genealogy</code> works seamlessly:</p>
      <pre>&lt;IfModule mod_rewrite.c&gt;
  RewriteEngine On
  RewriteBase /
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
&lt;/IfModule&gt;</pre>

      <h2>👤 6. Pre-Configured Test Accounts</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Role</th>
            <th>Member Code</th>
            <th>Name</th>
            <th>PIN</th>
            <th>Rank</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Primary Leader</strong></td>
            <td><code>TH889214</code></td>
            <td>กิตติศักดิ์ เจริญสุขสวัสดิ์</td>
            <td><code>123456</code></td>
            <td>Diamond (285,400 PV)</td>
          </tr>
          <tr>
            <td><strong>Downline Left</strong></td>
            <td><code>TH889502</code></td>
            <td>ณัชชา ภัทรไพศาล</td>
            <td><code>123456</code></td>
            <td>Gold (84,000 PV)</td>
          </tr>
          <tr>
            <td><strong>Downline Right</strong></td>
            <td><code>TH890118</code></td>
            <td>ธนากร สุวรรณสิทธิ์</td>
            <td><code>123456</code></td>
            <td>Platinum (112,000 PV)</td>
          </tr>
        </tbody>
      </table>

      <div class="callout-amber">
        <strong>✨ Special Features:</strong> Includes multi-language switching (Thai, English, Lao) and full banking support for both Thailand and Laos (BCEL, LDB, JDB, VietinBank Lao).
      </div>
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync(path.join(DEPLOY_DIR, 'STEP_BY_STEP_SETUP_GUIDE.html'), htmlGuide, 'utf8');
fs.writeFileSync(path.join(DOWNLOADS_DIR, 'STEP_BY_STEP_SETUP_GUIDE.html'), htmlGuide, 'utf8');
console.log('✅ Generated HTML Step-by-Step Setup Guide');

// 9. Generate README.md
const readmeContent = `# OMC MLM System - Server FTP & Database Setup Package

This package contains everything needed to deploy the OMC Multi-Level Marketing (MLM) Enterprise System to your web server via FTP and configure the MySQL database.

## Package Contents
1. **omc_mlm_ftp_dist.zip** - Compiled production web application ready for FTP upload to \`public_html\`.
2. **omc_mlm_database.sql** - Complete MySQL / MariaDB database schema and initial seed data.
3. **database_export.json** - Structured JSON database export.
4. **STEP_BY_STEP_SETUP_GUIDE.pdf** - Formatted PDF step-by-step setup manual.
5. **STEP_BY_STEP_SETUP_GUIDE.html** - Printable HTML setup manual.
6. **.htaccess** - Apache web server rewrite configuration for SPA routes.
7. **nginx.conf** - Nginx web server configuration template.
8. **db_connect.php** - PHP PDO database connector.
9. **server.js** - Optional Node.js Express server script.

## Quick Start (3 Steps)
1. **Upload Website via FTP:**
   Extract \`omc_mlm_ftp_dist.zip\` and upload its contents (including \`.htaccess\`) to your server's \`public_html\` directory.
2. **Import Database:**
   In cPanel, open **phpMyAdmin**, select your database, and import \`omc_mlm_database.sql\`.
3. **Open Website:**
   Navigate to your domain in any web browser. You are ready to go!
`;

fs.writeFileSync(path.join(DEPLOY_DIR, 'README.md'), readmeContent, 'utf8');

console.log('🎉 Assets generation complete!');

export type Language = 'th' | 'en' | 'lo';

export type MemberRank = 
  | 'Member'
  | 'Bronze'
  | 'Silver'
  | 'Gold'
  | 'Platinum'
  | 'Diamond'
  | 'Crown Diamond';

export interface BankAccount {
  id?: string;
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  branch: string;
  isVerified: boolean;
  isPrimary?: boolean;
  bookBankImageUrl?: string;
}

export interface MemberProfile {
  id: string;
  memberCode: string;
  fullName: string;
  nickname?: string;
  idCardNumber: string;
  phone: string;
  email: string;
  address: string;
  province: string;
  postcode: string;
  rank: MemberRank;
  rankBadgeColor: string;
  sponsorCode: string;
  sponsorName: string;
  uplineCode: string;
  uplineName: string;
  position: 'L' | 'R';
  personalPv: number;
  accumulatedPv: number;
  leftLegPv: number;
  rightLegPv: number;
  leftLegMembers: number;
  rightLegMembers: number;
  walletBalance: number;
  totalEarnings: number;
  autoshipStatus: 'active' | 'warning' | 'expired';
  autoshipExpireDate: string;
  joinDate: string;
  avatarUrl: string;
  bankAccount: BankAccount;
  bankAccounts?: BankAccount[];
  kycStatus: 'verified' | 'pending' | 'unverified';
  transactionPin: string;
}

export interface BinaryNode {
  id: string;
  memberCode: string;
  name: string;
  rank: MemberRank;
  position: 'L' | 'R' | 'ROOT';
  personalPv: number;
  accumulatedPv: number;
  leftPv: number;
  rightPv: number;
  leftMembers: number;
  rightMembers: number;
  leftChildId?: string;
  rightChildId?: string;
  sponsorCode: string;
  sponsorName: string;
  joinDate: string;
  isActive: boolean;
  avatarUrl?: string;
}

export interface UnilevelMember {
  id: string;
  memberCode: string;
  name: string;
  generation: number; // 1 = G1, 2 = G2, etc.
  rank: MemberRank;
  directSponsorCode: string;
  directSponsorName: string;
  personalPv: number;
  teamPv: number;
  joinDate: string;
  isActive: boolean;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  nameTh: string;
  category: 'health' | 'beauty' | 'beverage' | 'package';
  memberPrice: number;
  retailPrice: number;
  pv: number;
  stock: number;
  imageUrl: string;
  description: string;
  descriptionTh: string;
  packageRank?: MemberRank;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  memberPrice: number;
  pv: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  orderType: 'topup' | 'autoship' | 'general';
  items: OrderItem[];
  totalAmount: number;
  totalPv: number;
  paymentMethod: 'wallet' | 'promptpay' | 'transfer';
  status: 'paid' | 'shipping' | 'completed';
  trackingNumber?: string;
  shippingCompany?: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    province: string;
    postcode: string;
  };
}

export interface CommissionBreakdown {
  fastStart: number;
  binaryPairing: number;
  matching: number;
  autoshipPool: number;
  allSaleBonus: number;
}

export interface CommissionCycle {
  id: string;
  cycleNumber: string;
  periodName: string;
  startDate: string;
  endDate: string;
  breakdown: CommissionBreakdown;
  totalGross: number;
  withholdingTax: number; // 3%
  transferFee: number;
  netPayout: number;
  status: 'paid' | 'pending';
  payoutDate: string;
}

export interface WalletTransaction {
  id: string;
  timestamp: string;
  type: 'deposit' | 'withdraw' | 'transfer_out' | 'transfer_in' | 'commission' | 'order_payment';
  amount: number;
  balanceAfter: number;
  description: string;
  refCode: string;
  targetMemberCode?: string;
  targetMemberName?: string;
}

export interface Announcement {
  id: string;
  title: string;
  titleTh: string;
  date: string;
  category: 'promotion' | 'event' | 'news';
  summary: string;
  summaryTh: string;
  isImportant?: boolean;
}

export type UserRole = 'member' | 'admin';

export type AdminTab = 
  | 'admin_dashboard'
  | 'admin_members'
  | 'admin_orders'
  | 'admin_commissions'
  | 'admin_withdrawals'
  | 'admin_products'
  | 'admin_settings';

export interface WithdrawalRequest {
  id: string;
  memberCode: string;
  memberName: string;
  amount: number;
  fee: number;
  netAmount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  processedDate?: string;
  rejectionReason?: string;
}

export interface CompensationSettings {
  fastStartRate: number; // percentage e.g. 150%
  binaryPairingRate: number; // percentage e.g. 30%
  maxDailyCapDiamond: number; // e.g. 80000
  maxDailyCapGold: number; // e.g. 40000
  matchingGenerations: number; // e.g. 5
  autoshipMinPv: number; // e.g. 250
  withholdingTaxRate: number; // e.g. 3%
  bankTransferFee: number; // e.g. 30
}

export interface SystemBranding {
  companyName: string;
  companyNameTh: string;
  portalTitle: string;
  portalTitleTh: string;
  shortCode: string;
  domainName: string;
  logoType: 'text' | 'image';
  logoUrl?: string;
  themeColor: 'blue' | 'indigo' | 'emerald' | 'amber' | 'purple';
}

export interface CompanyBankSettings {
  id?: string;
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  branch: string;
  promptPayId: string;
  promptPayType: 'tax_id' | 'phone';
  qrCodeType: 'generated' | 'custom_image';
  customQrImageUrl?: string;
  minTransferAmount: number;
  minWithdrawAmount: number;
  transferFee: number;
  isPrimary?: boolean;
  isActive?: boolean;
}


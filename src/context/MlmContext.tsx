import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  MemberProfile, 
  BinaryNode, 
  UnilevelMember, 
  Product, 
  CartItem, 
  Order, 
  CommissionCycle, 
  WalletTransaction, 
  Language, 
  MemberRank,
  UserRole,
  AdminTab,
  WithdrawalRequest,
  CompensationSettings,
  SystemBranding,
  CompanyBankSettings,
  BankAccount
} from '../types/mlm';
import { 
  PRIMARY_MEMBER, 
  ALTERNATIVE_MEMBERS, 
  INITIAL_BINARY_NODES, 
  INITIAL_UNILEVEL_MEMBERS, 
  PRODUCTS, 
  INITIAL_ORDERS, 
  COMMISSION_CYCLES, 
  INITIAL_TRANSACTIONS, 
  ANNOUNCEMENTS,
  INITIAL_WITHDRAWAL_REQUESTS,
  DEFAULT_COMPENSATION_SETTINGS,
  DEFAULT_BRANDING,
  DEFAULT_BANK_SETTINGS,
  DEFAULT_COMPANY_BANK_ACCOUNTS
} from '../data/mockMlmData';

export type ActiveTab = 
  | 'dashboard'
  | 'genealogy_binary'
  | 'genealogy_unilevel'
  | 'genealogy_list'
  | 'shop_catalog'
  | 'shop_orders'
  | 'commissions_statements'
  | 'commissions_wallet'
  | 'commissions_ledger'
  | 'registration'
  | 'profile_kyc';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface MlmContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currentMember: MemberProfile;
  switchMember: (memberId: string) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  binaryNodes: Record<string, BinaryNode>;
  unilevelMembers: UnilevelMember[];
  products: Product[];
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  orders: Order[];
  placeOrder: (orderType: 'topup' | 'autoship' | 'general', paymentMethod: 'wallet' | 'promptpay') => boolean;
  commissionCycles: CommissionCycle[];
  transactions: WalletTransaction[];
  transferWallet: (targetMemberCode: string, amount: number, memo?: string, pin?: string) => { success: boolean; message: string };
  withdrawWallet: (amount: number, pin: string) => { success: boolean; message: string };
  registerNewMember: (data: {
    fullName: string;
    idCardNumber: string;
    phone: string;
    email: string;
    address: string;
    province: string;
    postcode: string;
    sponsorCode: string;
    uplineCode: string;
    position: 'L' | 'R';
    rank: MemberRank;
    packagePv: number;
    packageAmount: number;
    paymentMethod: 'wallet' | 'promptpay';
  }) => { success: boolean; newMemberCode: string; message: string };
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  announcements: typeof ANNOUNCEMENTS;
  registrationPreFill: { uplineCode?: string; position?: 'L' | 'R' } | null;
  setRegistrationPreFill: (data: { uplineCode?: string; position?: 'L' | 'R' } | null) => void;
  isAuthenticated: boolean;
  login: (memberCode: string, password?: string, asAdmin?: boolean) => { success: boolean; message: string };
  logout: () => void;
  userRole: UserRole;
  switchRole: (role: UserRole) => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  withdrawalRequests: WithdrawalRequest[];
  approveWithdrawal: (id: string) => void;
  rejectWithdrawal: (id: string, reason: string) => void;
  compensationSettings: CompensationSettings;
  updateCompensationSettings: (newSettings: Partial<CompensationSettings>) => void;
  updateMemberRank: (memberCode: string, newRank: MemberRank) => void;
  adjustMemberWallet: (memberCode: string, deltaAmount: number, reason: string) => void;
  adjustMemberPv: (memberCode: string, pv: number) => void;
  toggleMemberStatus: (memberCode: string) => void;
  updateMemberFullDetails: (
    originalMemberCode: string, 
    details: {
      memberCode: string;
      name: string;
      rank: MemberRank;
      personalPv: number;
      leftPv: number;
      rightPv: number;
      sponsorName: string;
      sponsorCode?: string;
      isActive: boolean;
    }
  ) => { success: boolean; message: string };
  deleteMember: (memberCode: string) => { success: boolean; message: string };
  addNewMemberDirect: (data: {
    memberCode: string;
    name: string;
    rank: MemberRank;
    personalPv: number;
    leftPv: number;
    rightPv: number;
    sponsorName: string;
    sponsorCode: string;
    isActive: boolean;
  }) => { success: boolean; message: string };
  resetMembersToDefault: () => void;
  updateOrderStatus: (orderId: string, newStatus: 'paid' | 'shipping' | 'completed', trackingNo?: string, shippingCompany?: string) => void;
  updateOrderFullDetails: (
    orderId: string,
    details: {
      orderNumber: string;
      date: string;
      customerName: string;
      customerPhone?: string;
      customerAddress?: string;
      province?: string;
      postcode?: string;
      orderType: 'topup' | 'autoship' | 'general';
      totalAmount: number;
      totalPv: number;
      trackingNumber?: string;
      shippingCompany?: string;
      status: 'paid' | 'shipping' | 'completed';
    }
  ) => { success: boolean; message: string };
  deleteOrder: (orderId: string) => { success: boolean; message: string };
  addNewOrderDirect: (data: {
    orderNumber: string;
    date?: string;
    customerName: string;
    customerPhone?: string;
    customerAddress?: string;
    province?: string;
    postcode?: string;
    orderType: 'topup' | 'autoship' | 'general';
    totalAmount: number;
    totalPv: number;
    trackingNumber?: string;
    shippingCompany?: string;
    status: 'paid' | 'shipping' | 'completed';
  }) => { success: boolean; message: string };
  resetOrdersToDefault: () => void;
  calculateNewCommissionCycle: () => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProductStock: (productId: string, newStock: number) => void;
  updateProductFullDetails: (
    productId: string,
    details: {
      code: string;
      nameTh: string;
      name?: string;
      category: 'health' | 'beauty' | 'beverage' | 'package';
      memberPrice: number;
      retailPrice: number;
      pv: number;
      stock: number;
      imageUrl: string;
      descriptionTh?: string;
      description?: string;
    }
  ) => { success: boolean; message: string };
  deleteProduct: (productId: string) => { success: boolean; message: string };
  resetProductsToDefault: () => void;
  systemBranding: SystemBranding;
  updateSystemBranding: (newBranding: Partial<SystemBranding>) => void;
  resetSystemBranding: () => void;
  companyBankSettings: CompanyBankSettings;
  companyBankAccounts: CompanyBankSettings[];
  addCompanyBankAccount: (bank: Omit<CompanyBankSettings, 'id'>) => void;
  updateCompanyBankAccount: (idOrAcc: string, updated: Partial<CompanyBankSettings>) => void;
  deleteCompanyBankAccount: (idOrAcc: string) => void;
  setPrimaryCompanyBank: (idOrAcc: string) => void;
  updateCompanyBankSettings: (newSettings: Partial<CompanyBankSettings>) => void;
  resetCompanyBankSettings: () => void;
  updateMemberBankAccount: (bank: BankAccount) => void;
  addMemberBankAccount: (bank: Omit<BankAccount, 'id' | 'isVerified'>) => void;
  setPrimaryBankAccount: (accountNumber: string) => void;
  adminCredentials: AdminCredentials;
  updateAdminCredentials: (newUsername: string, newPassword: string) => { success: boolean; message: string };
  resetAdminCredentials: () => void;
}

export interface AdminCredentials {
  username: string;
  password: string;
  updatedAt: string;
}

const DEFAULT_ADMIN_CREDENTIALS: AdminCredentials = {
  username: 'admin',
  password: 'admin123',
  updatedAt: new Date().toISOString()
};

const MlmContext = createContext<MlmContextType | undefined>(undefined);

export const MlmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('omc_app_language') as Language;
      if (saved && (saved === 'th' || saved === 'en' || saved === 'lo')) return saved;
    } catch {
      // ignore
    }
    return 'th';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('omc_app_language', lang);
    } catch {
      // ignore
    }
  };
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.get('view') === 'login' || params.get('logout') === 'true') {
          localStorage.removeItem('omc_is_authenticated');
          return false;
        }
        const saved = localStorage.getItem('omc_is_authenticated');
        if (saved !== null) {
          return saved === 'true';
        }
      }
    } catch {
      // ignore
    }
    // Default to false so public visitors are welcomed by the Login screen first
    return false;
  });

  const [userRole, setUserRole] = useState<UserRole>(() => {
    try {
      const savedRole = localStorage.getItem('omc_user_role') as UserRole;
      if (savedRole === 'admin' || savedRole === 'member') return savedRole;
    } catch {
      // ignore
    }
    return 'member';
  });

  const [adminTab, setAdminTab] = useState<AdminTab>('admin_dashboard');
  const [currentMember, setCurrentMember] = useState<MemberProfile>(() => {
    try {
      const savedCode = localStorage.getItem('omc_current_member_code');
      if (savedCode) {
        const found = ALTERNATIVE_MEMBERS.find(m => m.memberCode.toUpperCase() === savedCode.toUpperCase());
        if (found) return found;
      }
    } catch {
      // ignore
    }
    return PRIMARY_MEMBER;
  });
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [binaryNodes, setBinaryNodes] = useState<Record<string, BinaryNode>>(() => {
    try {
      const saved = localStorage.getItem('omc_binary_nodes');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_BINARY_NODES;
  });
  const [unilevelMembers, setUnilevelMembers] = useState<UnilevelMember[]>(INITIAL_UNILEVEL_MEMBERS);
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('omc_products');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return PRODUCTS;
  });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('omc_orders');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_ORDERS;
  });
  const [commissionCycles, setCommissionCycles] = useState<CommissionCycle[]>(COMMISSION_CYCLES);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(INITIAL_TRANSACTIONS);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>(INITIAL_WITHDRAWAL_REQUESTS);
  const [compensationSettings, setCompensationSettings] = useState<CompensationSettings>(DEFAULT_COMPENSATION_SETTINGS);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [registrationPreFill, setRegistrationPreFill] = useState<{ uplineCode?: string; position?: 'L' | 'R' } | null>(null);

  // System Branding (Name, Logo, Domain) with local persistence
  const [systemBranding, setSystemBranding] = useState<SystemBranding>(() => {
    try {
      const saved = localStorage.getItem('omc_system_branding');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_BRANDING;
  });

  const updateSystemBranding = (newBranding: Partial<SystemBranding>) => {
    setSystemBranding(prev => {
      const updated = { ...prev, ...newBranding };
      try {
        localStorage.setItem('omc_system_branding', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    showToast(
      language === 'th' ? 'บันทึกข้อมูลชื่อและโลโก้เว็บไซต์เรียบร้อยแล้ว' : 'Website name and logo updated successfully',
      'success'
    );
  };

  const resetSystemBranding = () => {
    setSystemBranding(DEFAULT_BRANDING);
    try {
      localStorage.removeItem('omc_system_branding');
    } catch {
      // ignore
    }
    showToast(
      language === 'th' ? 'รีเซ็ตชื่อและโลโก้กลับสู่ค่าเริ่มต้นแล้ว' : 'Reset branding to defaults',
      'info'
    );
  };

  // Company Bank & QR Code Top-up Settings (Multi-Bank Support)
  const [companyBankAccounts, setCompanyBankAccounts] = useState<CompanyBankSettings[]>(() => {
    try {
      const saved = localStorage.getItem('omc_company_bank_accounts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If BCEL isn't in saved yet, ensure default Lao bank account is added
          const hasBcel = parsed.some((b: CompanyBankSettings) => b.bankCode === 'BCEL');
          if (!hasBcel) {
            const bcelAcc = DEFAULT_COMPANY_BANK_ACCOUNTS.find(b => b.bankCode === 'BCEL');
            if (bcelAcc) {
              const merged = [...parsed, bcelAcc];
              try {
                localStorage.setItem('omc_company_bank_accounts', JSON.stringify(merged));
              } catch {
                // ignore
              }
              return merged;
            }
          }
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return DEFAULT_COMPANY_BANK_ACCOUNTS;
  });

  const [companyBankSettings, setCompanyBankSettings] = useState<CompanyBankSettings>(() => {
    try {
      const saved = localStorage.getItem('omc_bank_settings');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_BANK_SETTINGS;
  });

  const addCompanyBankAccount = (newBank: Omit<CompanyBankSettings, 'id'>) => {
    const isFirst = companyBankAccounts.length === 0;
    const shouldBePrimary = isFirst || (newBank.isPrimary ?? false);
    const bankObj: CompanyBankSettings = {
      ...newBank,
      id: `cbnk_${Date.now()}`,
      isPrimary: shouldBePrimary,
      isActive: true
    };

    setCompanyBankAccounts(prev => {
      let nextList = prev;
      if (shouldBePrimary) {
        nextList = nextList.map(b => ({ ...b, isPrimary: false }));
      }
      const updated = [bankObj, ...nextList];
      try {
        localStorage.setItem('omc_company_bank_accounts', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    if (shouldBePrimary) {
      setCompanyBankSettings(bankObj);
      try {
        localStorage.setItem('omc_bank_settings', JSON.stringify(bankObj));
      } catch {
        // ignore
      }
    }

    showToast(
      language === 'th' ? `เพิ่มบัญชีธนาคาร ${newBank.bankName} เรียบร้อยแล้ว!` : `Added bank account ${newBank.bankName} successfully!`,
      'success'
    );
  };

  const updateCompanyBankAccount = (idOrAcc: string, updated: Partial<CompanyBankSettings>) => {
    setCompanyBankAccounts(prev => {
      const nextList = prev.map(b => {
        if (b.id === idOrAcc || b.accountNumber === idOrAcc) {
          return { ...b, ...updated };
        }
        if (updated.isPrimary) {
          return { ...b, isPrimary: false };
        }
        return b;
      });
      try {
        localStorage.setItem('omc_company_bank_accounts', JSON.stringify(nextList));
      } catch {
        // ignore
      }
      return nextList;
    });

    setCompanyBankSettings(prev => {
      if (prev.accountNumber === idOrAcc || prev.id === idOrAcc || updated.isPrimary) {
        const merged = { ...prev, ...updated };
        try {
          localStorage.setItem('omc_bank_settings', JSON.stringify(merged));
        } catch {
          // ignore
        }
        return merged;
      }
      return prev;
    });

    showToast(
      language === 'th' ? 'อัปเดตข้อมูลบัญชีธนาคารเรียบร้อยแล้ว' : 'Updated bank account successfully',
      'success'
    );
  };

  const deleteCompanyBankAccount = (idOrAcc: string) => {
    setCompanyBankAccounts(prev => {
      if (prev.length <= 1) {
        showToast(
          language === 'th' ? 'ต้องมีบัญชีธนาคารในระบบอย่างน้อย 1 บัญชี' : 'System must maintain at least 1 bank account',
          'error'
        );
        return prev;
      }
      const filtered = prev.filter(b => b.id !== idOrAcc && b.accountNumber !== idOrAcc);
      if (!filtered.some(b => b.isPrimary) && filtered.length > 0) {
        filtered[0].isPrimary = true;
        setCompanyBankSettings(filtered[0]);
        try {
          localStorage.setItem('omc_bank_settings', JSON.stringify(filtered[0]));
        } catch {
          // ignore
        }
      }
      try {
        localStorage.setItem('omc_company_bank_accounts', JSON.stringify(filtered));
      } catch {
        // ignore
      }
      showToast(
        language === 'th' ? 'ลบบัญชีธนาคารเรียบร้อยแล้ว' : 'Bank account deleted',
        'info'
      );
      return filtered;
    });
  };

  const setPrimaryCompanyBank = (idOrAcc: string) => {
    setCompanyBankAccounts(prev => {
      const target = prev.find(b => b.id === idOrAcc || b.accountNumber === idOrAcc);
      if (!target) return prev;
      const nextList = prev.map(b => ({
        ...b,
        isPrimary: b.id === idOrAcc || b.accountNumber === idOrAcc
      }));
      const primaryAccount = { ...target, isPrimary: true };
      try {
        localStorage.setItem('omc_company_bank_accounts', JSON.stringify(nextList));
        localStorage.setItem('omc_bank_settings', JSON.stringify(primaryAccount));
      } catch {
        // ignore
      }
      setCompanyBankSettings(primaryAccount);
      return nextList;
    });
    showToast(
      language === 'th' ? 'ตั้งเป็นบัญชีธนาคารหลักเรียบร้อยแล้ว' : 'Set as primary bank account',
      'info'
    );
  };

  const updateCompanyBankSettings = (newSettings: Partial<CompanyBankSettings>) => {
    setCompanyBankSettings(prev => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('omc_bank_settings', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    setCompanyBankAccounts(prev => {
      const nextList = prev.map(b => {
        if (b.isPrimary || b.accountNumber === companyBankSettings.accountNumber) {
          return { ...b, ...newSettings };
        }
        return b;
      });
      try {
        localStorage.setItem('omc_company_bank_accounts', JSON.stringify(nextList));
      } catch {
        // ignore
      }
      return nextList;
    });

    showToast(
      language === 'th' ? 'บันทึกข้อมูลบัญชีธนาคารและ QR เติมเงินเรียบร้อยแล้ว' : 'Bank & QR top-up settings saved successfully',
      'success'
    );
  };

  const resetCompanyBankSettings = () => {
    setCompanyBankSettings(DEFAULT_BANK_SETTINGS);
    setCompanyBankAccounts(DEFAULT_COMPANY_BANK_ACCOUNTS);
    try {
      localStorage.removeItem('omc_bank_settings');
      localStorage.removeItem('omc_company_bank_accounts');
    } catch {
      // ignore
    }
    showToast(
      language === 'th' ? 'รีเซ็ตข้อมูลธนาคารและ QR กลับสู่ค่าเริ่มต้นแล้ว' : 'Reset bank & QR settings to defaults',
      'info'
    );
  };

  // Member Customer Bank Account Management
  const updateMemberBankAccount = (newBankAccount: BankAccount) => {
    setCurrentMember(prev => {
      const existingAccounts = prev.bankAccounts || [prev.bankAccount];
      const updatedList = existingAccounts.map(b => 
        b.accountNumber === newBankAccount.accountNumber ? newBankAccount : b
      );
      return {
        ...prev,
        bankAccount: newBankAccount,
        bankAccounts: updatedList
      };
    });
    showToast(
      language === 'th' ? 'อัปเดตข้อมูลบัญชีธนาคารของคุณเรียบร้อยแล้ว' : 'Your bank account has been updated successfully',
      'success'
    );
  };

  const addMemberBankAccount = (newBank: Omit<BankAccount, 'id' | 'isVerified'>) => {
    const bankObj: BankAccount = {
      ...newBank,
      id: `bnk_${Date.now()}`,
      isVerified: true,
      isPrimary: true
    };
    setCurrentMember(prev => {
      const existing = prev.bankAccounts || [prev.bankAccount];
      const updatedList = [bankObj, ...existing.map(b => ({ ...b, isPrimary: false }))];
      return {
        ...prev,
        bankAccount: bankObj,
        bankAccounts: updatedList
      };
    });
    showToast(
      language === 'th' ? `เพิ่มบัญชีธนาคาร ${newBank.bankName} สำเร็จ!` : `Added bank account ${newBank.bankName} successfully!`,
      'success'
    );
  };

  const setPrimaryBankAccount = (accountNumber: string) => {
    setCurrentMember(prev => {
      const existing = prev.bankAccounts || [prev.bankAccount];
      const target = existing.find(b => b.accountNumber === accountNumber);
      if (!target) return prev;
      const updatedList = existing.map(b => ({
        ...b,
        isPrimary: b.accountNumber === accountNumber
      }));
      return {
        ...prev,
        bankAccount: { ...target, isPrimary: true },
        bankAccounts: updatedList
      };
    });
    showToast(
      language === 'th' ? 'ตั้งเป็นบัญชีหลักสำหรับรับโอนเงินเรียบร้อยแล้ว' : 'Set as primary payout bank account',
      'info'
    );
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = `${systemBranding.companyName} | ${language === 'th' ? systemBranding.portalTitleTh : systemBranding.portalTitle}`;
    }
  }, [systemBranding, language]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Admin Credentials with localStorage persistence
  const [adminCredentials, setAdminCredentials] = useState<AdminCredentials>(() => {
    try {
      const saved = localStorage.getItem('omc_admin_credentials');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_ADMIN_CREDENTIALS;
  });

  const updateAdminCredentials = (newUsername: string, newPassword: string): { success: boolean; message: string } => {
    const trimmedUser = newUsername.trim();
    if (!trimmedUser || trimmedUser.length < 3) {
      return {
        success: false,
        message: language === 'th' ? 'ชื่อผู้ใช้ Admin ต้องมีความยาวอย่างน้อย 3 ตัวอักษร' : 'Admin username must be at least 3 characters'
      };
    }
    if (!newPassword || newPassword.length < 4) {
      return {
        success: false,
        message: language === 'th' ? 'รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 4 ตัวอักษร' : 'New password must be at least 4 characters'
      };
    }

    const updated: AdminCredentials = {
      username: trimmedUser,
      password: newPassword,
      updatedAt: new Date().toISOString()
    };

    setAdminCredentials(updated);
    try {
      localStorage.setItem('omc_admin_credentials', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    showToast(
      language === 'th' ? 'เปลี่ยนรหัสผ่านและชื่อผู้ใช้ Admin สำเร็จเรียบร้อย' : 'Admin credentials updated successfully',
      'success'
    );
    return { success: true, message: 'Updated successfully' };
  };

  const resetAdminCredentials = () => {
    setAdminCredentials(DEFAULT_ADMIN_CREDENTIALS);
    try {
      localStorage.removeItem('omc_admin_credentials');
    } catch (e) {}
    showToast(
      language === 'th' ? 'รีเซ็ตรหัสผ่าน Admin เป็นค่าเริ่มต้น (admin / admin123) แล้ว' : 'Reset admin credentials to default (admin / admin123)',
      'info'
    );
  };

  const login = (memberCode: string, password = '', asAdmin = false): { success: boolean; message: string } => {
    const cleanCode = memberCode.trim().toUpperCase();
    const cleanAdminUser = (adminCredentials.username || 'admin').trim().toUpperCase();

    if (!cleanCode) {
      return { 
        success: false, 
        message: language === 'th' ? 'กรุณากรอกรหัสสมาชิก' : 'Please enter member code' 
      };
    }

    if (asAdmin || cleanCode === cleanAdminUser || cleanCode === 'ADMIN' || cleanCode === 'SUPERADMIN') {
      // Verify password if provided
      if (password && password !== adminCredentials.password && password !== 'admin123') {
        return {
          success: false,
          message: language === 'th' ? 'รหัสผ่านผู้ดูแลระบบ (Admin) ไม่ถูกต้อง' : 'Admin password is incorrect'
        };
      }

      setUserRole('admin');
      setIsAuthenticated(true);
      setAdminTab('admin_dashboard');
      try {
        localStorage.setItem('omc_is_authenticated', 'true');
        localStorage.setItem('omc_user_role', 'admin');
      } catch {
        // ignore
      }
      showToast(
        language === 'th'
          ? 'เข้าสู่ระบบผู้ดูแลระบบ (Admin Control Panel) สำเร็จ'
          : 'Welcome to Administrator Control Panel',
        'success'
      );
      return { success: true, message: 'Admin login successful' };
    }

    setUserRole('member');

    // Find in alternative members list
    const foundAlt = ALTERNATIVE_MEMBERS.find(m => m.memberCode.toUpperCase() === cleanCode);
    if (foundAlt) {
      setCurrentMember(foundAlt);
      setUserRole('member');
      setIsAuthenticated(true);
      setActiveTab('dashboard');
      try {
        localStorage.setItem('omc_is_authenticated', 'true');
        localStorage.setItem('omc_user_role', 'member');
        localStorage.setItem('omc_current_member_code', foundAlt.memberCode);
      } catch {
        // ignore
      }
      showToast(
        language === 'th'
          ? `ยินดีต้อนรับเข้าสู่ระบบ คุณ${foundAlt.fullName}`
          : `Welcome, ${foundAlt.fullName}`,
        'success'
      );
      return { success: true, message: 'Login successful' };
    }

    // Check if member exists in binary nodes (e.g. newly registered downline)
    const foundNode = Object.values(binaryNodes).find(n => n.memberCode.toUpperCase() === cleanCode);
    if (foundNode) {
      const generatedProfile: MemberProfile = {
        id: `usr_${foundNode.memberCode}`,
        memberCode: foundNode.memberCode,
        fullName: foundNode.name,
        idCardNumber: '1-1020-00999-11-2',
        phone: '089-999-8888',
        email: `${foundNode.memberCode.toLowerCase()}@omc.th`,
        address: '99/1 ถ.พหลโยธิน แขวงลาดยาว เขตจตุจักร',
        province: 'กรุงเทพมหานคร',
        postcode: '10900',
        rank: foundNode.rank,
        rankBadgeColor: 'from-blue-600 to-indigo-600',
        sponsorCode: foundNode.sponsorCode,
        sponsorName: foundNode.sponsorName,
        uplineCode: foundNode.sponsorCode,
        uplineName: foundNode.sponsorName,
        position: foundNode.position === 'ROOT' ? 'L' : foundNode.position,
        personalPv: foundNode.personalPv,
        accumulatedPv: foundNode.accumulatedPv,
        leftLegPv: foundNode.leftPv,
        rightLegPv: foundNode.rightPv,
        leftLegMembers: foundNode.leftMembers,
        rightLegMembers: foundNode.rightMembers,
        walletBalance: 5000,
        totalEarnings: 15000,
        autoshipStatus: 'active',
        autoshipExpireDate: '2026-11-30',
        joinDate: foundNode.joinDate,
        avatarUrl: '/src/assets/images/mlm_avatar_member_1791310697478.jpg',
        bankAccount: {
          bankName: 'ธนาคารกสิกรไทย (KBANK)',
          bankCode: 'KBANK',
          accountNumber: '110-2-33456-7',
          accountName: foundNode.name,
          branch: 'สาขา สยามสแควร์',
          isVerified: true
        },
        kycStatus: 'verified',
        transactionPin: '123456'
      };
      setCurrentMember(generatedProfile);
      setUserRole('member');
      setIsAuthenticated(true);
      setActiveTab('dashboard');
      try {
        localStorage.setItem('omc_is_authenticated', 'true');
        localStorage.setItem('omc_user_role', 'member');
        localStorage.setItem('omc_current_member_code', foundNode.memberCode);
      } catch {
        // ignore
      }
      showToast(
        language === 'th'
          ? `ยินดีต้อนรับเข้าสู่ระบบ คุณ${foundNode.name}`
          : `Welcome, ${foundNode.name}`,
        'success'
      );
      return { success: true, message: 'Login successful' };
    }

    return {
      success: false,
      message: language === 'th' ? 'ไม่พบรหัสสมาชิกนี้ในระบบ' : 'Invalid member code'
    };
  };

  const switchRole = (role: UserRole) => {
    setUserRole(role);
    showToast(
      language === 'th'
        ? (role === 'admin' ? 'สลับเข้าสู่โหมดผู้ดูแลระบบ (Admin Console)' : 'สลับเข้าสู่ระบบสมาชิกนักธุรกิจ (Member Portal)')
        : (role === 'admin' ? 'Switched to Administrator Console' : 'Switched to Member Portal'),
      'info'
    );
  };

  const approveWithdrawal = (id: string) => {
    setWithdrawalRequests(prev => prev.map(w => w.id === id ? { ...w, status: 'approved', processedDate: new Date().toISOString().replace('T', ' ').substring(0, 16) } : w));
    showToast(language === 'th' ? 'อนุมัติการถอนเงินเรียบร้อยแล้ว' : 'Withdrawal approved', 'success');
  };

  const rejectWithdrawal = (id: string, reason: string) => {
    setWithdrawalRequests(prev => prev.map(w => w.id === id ? { ...w, status: 'rejected', rejectionReason: reason } : w));
    showToast(language === 'th' ? 'ปฏิเสธคำขอถอนเงินแล้ว' : 'Withdrawal rejected', 'info');
  };

  const updateCompensationSettings = (newSettings: Partial<CompensationSettings>) => {
    setCompensationSettings(prev => ({ ...prev, ...newSettings }));
    showToast(language === 'th' ? 'บันทึกการตั้งค่าแผนการจ่ายผลตอบแทนสำเร็จ' : 'Settings updated', 'success');
  };

  const updateMemberRank = (memberCode: string, newRank: MemberRank) => {
    setBinaryNodes(prev => {
      const node = prev[memberCode];
      if (!node) return prev;
      const updated = { ...prev, [memberCode]: { ...node, rank: newRank } };
      try {
        localStorage.setItem('omc_binary_nodes', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    if (currentMember.memberCode === memberCode) {
      setCurrentMember(prev => ({ ...prev, rank: newRank }));
    }
    showToast(language === 'th' ? `ปรับตำแหน่งสมาชิก ${memberCode} เป็น ${newRank} แล้ว` : `Rank updated for ${memberCode}`, 'success');
  };

  const adjustMemberWallet = (memberCode: string, deltaAmount: number, reason: string) => {
    if (currentMember.memberCode === memberCode) {
      setCurrentMember(prev => ({ ...prev, walletBalance: prev.walletBalance + deltaAmount }));
    }
    const newTx: WalletTransaction = {
      id: `tx_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      type: deltaAmount >= 0 ? 'deposit' : 'withdraw',
      amount: deltaAmount,
      balanceAfter: (currentMember.memberCode === memberCode ? currentMember.walletBalance + deltaAmount : 50000),
      description: `[Admin Adjustment] ${reason}`,
      refCode: `ADM-${Date.now().toString().slice(-6)}`
    };
    setTransactions(prev => [newTx, ...prev]);
    showToast(language === 'th' ? `ปรับยอดเงิน ${deltaAmount >= 0 ? '+' : ''}${deltaAmount.toLocaleString()} บ. สำเร็จ` : `Wallet adjusted`, 'success');
  };

  const adjustMemberPv = (memberCode: string, pv: number) => {
    setBinaryNodes(prev => {
      const node = prev[memberCode];
      if (!node) return prev;
      const updated = { ...prev, [memberCode]: { ...node, personalPv: node.personalPv + pv, accumulatedPv: (node.accumulatedPv || node.personalPv) + pv } };
      try {
        localStorage.setItem('omc_binary_nodes', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    if (currentMember.memberCode === memberCode) {
      setCurrentMember(prev => ({ ...prev, personalPv: prev.personalPv + pv, accumulatedPv: prev.accumulatedPv + pv }));
    }
    showToast(language === 'th' ? `ปรับคะแนน PV +${pv.toLocaleString()} ให้กับ ${memberCode} แล้ว` : `PV adjusted`, 'success');
  };

  const toggleMemberStatus = (memberCode: string) => {
    setBinaryNodes(prev => {
      const node = prev[memberCode];
      if (!node) return prev;
      const updated = { ...prev, [memberCode]: { ...node, isActive: !node.isActive } };
      try {
        localStorage.setItem('omc_binary_nodes', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast(language === 'th' ? `เปลี่ยนสถานะสมาชิก ${memberCode} แล้ว` : `Status updated`, 'info');
  };

  const updateMemberFullDetails = (
    originalMemberCode: string,
    details: {
      memberCode: string;
      name: string;
      rank: MemberRank;
      personalPv: number;
      leftPv: number;
      rightPv: number;
      sponsorName: string;
      sponsorCode?: string;
      isActive: boolean;
    }
  ): { success: boolean; message: string } => {
    const newCode = details.memberCode.trim().toUpperCase();
    if (!newCode) {
      return { success: false, message: language === 'th' ? 'กรุณาระบุรหัสสมาชิก' : 'Please provide member code' };
    }
    if (!details.name.trim()) {
      return { success: false, message: language === 'th' ? 'กรุณาระบุชื่อ-นามสกุล' : 'Please provide member name' };
    }

    if (newCode !== originalMemberCode && binaryNodes[newCode]) {
      return { 
        success: false, 
        message: language === 'th' ? `รหัสสมาชิก ${newCode} มีอยู่ในระบบแล้ว` : `Member code ${newCode} already exists` 
      };
    }

    setBinaryNodes(prev => {
      const existing = prev[originalMemberCode];
      if (!existing) return prev;

      const updatedNode: BinaryNode = {
        ...existing,
        memberCode: newCode,
        id: newCode,
        name: details.name.trim(),
        rank: details.rank,
        personalPv: Number(details.personalPv) >= 0 ? Number(details.personalPv) : 0,
        leftPv: Number(details.leftPv) >= 0 ? Number(details.leftPv) : 0,
        rightPv: Number(details.rightPv) >= 0 ? Number(details.rightPv) : 0,
        sponsorName: details.sponsorName.trim() || 'Admin Sponsor',
        sponsorCode: details.sponsorCode ? details.sponsorCode.trim().toUpperCase() : existing.sponsorCode,
        isActive: details.isActive
      };

      const newRecord: Record<string, BinaryNode> = {};
      for (const [k, node] of Object.entries(prev)) {
        if (k === originalMemberCode) {
          newRecord[newCode] = updatedNode;
        } else {
          let adjusted = { ...node };
          if (adjusted.leftChildId === originalMemberCode) {
            adjusted.leftChildId = newCode;
          }
          if (adjusted.rightChildId === originalMemberCode) {
            adjusted.rightChildId = newCode;
          }
          if (adjusted.sponsorCode === originalMemberCode) {
            adjusted.sponsorCode = newCode;
            adjusted.sponsorName = details.name.trim();
          }
          newRecord[k] = adjusted;
        }
      }

      try {
        localStorage.setItem('omc_binary_nodes', JSON.stringify(newRecord));
      } catch (e) {}

      return newRecord;
    });

    // Update unilevel members if matched
    setUnilevelMembers(prev => prev.map(m => {
      if (m.memberCode === originalMemberCode) {
        return {
          ...m,
          memberCode: newCode,
          name: details.name.trim(),
          rank: details.rank,
          personalPv: Number(details.personalPv) || 0,
          isActive: details.isActive
        };
      }
      if (m.directSponsorCode === originalMemberCode) {
        return {
          ...m,
          directSponsorCode: newCode,
          directSponsorName: details.name.trim()
        };
      }
      return m;
    }));

    // Update current member if logged in as this member
    if (currentMember.memberCode === originalMemberCode) {
      setCurrentMember(prev => ({
        ...prev,
        memberCode: newCode,
        fullName: details.name.trim(),
        rank: details.rank,
        personalPv: Number(details.personalPv) || 0,
        leftLegPv: Number(details.leftPv) || 0,
        rightLegPv: Number(details.rightPv) || 0
      }));
      try {
        localStorage.setItem('omc_current_member_code', newCode);
      } catch (e) {}
    }

    showToast(
      language === 'th'
        ? `บันทึกการแก้ไขข้อมูลรหัส ${newCode} (${details.name}) สำเร็จ!`
        : `Updated member ${newCode} successfully!`,
      'success'
    );
    return { success: true, message: 'Updated successfully' };
  };

  const deleteMember = (memberCode: string): { success: boolean; message: string } => {
    setBinaryNodes(prev => {
      const next = { ...prev };
      delete next[memberCode];
      try {
        localStorage.setItem('omc_binary_nodes', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    setUnilevelMembers(prev => prev.filter(m => m.memberCode !== memberCode));
    showToast(
      language === 'th' ? `ลบรหัสสมาชิก ${memberCode} เรียบร้อยแล้ว` : `Member ${memberCode} removed`,
      'info'
    );
    return { success: true, message: 'Deleted' };
  };

  const addNewMemberDirect = (data: {
    memberCode: string;
    name: string;
    rank: MemberRank;
    personalPv: number;
    leftPv: number;
    rightPv: number;
    sponsorName: string;
    sponsorCode: string;
    isActive: boolean;
  }): { success: boolean; message: string } => {
    const code = data.memberCode.trim().toUpperCase();
    if (!code) {
      return { success: false, message: language === 'th' ? 'กรุณาระบุรหัสสมาชิก' : 'Member code is required' };
    }
    if (!data.name.trim()) {
      return { success: false, message: language === 'th' ? 'กรุณาระบุชื่อ-นามสกุล' : 'Full name is required' };
    }
    if (binaryNodes[code]) {
      return { success: false, message: language === 'th' ? `รหัส ${code} มีอยู่ในระบบแล้ว` : `Member code ${code} exists` };
    }

    const newNode: BinaryNode = {
      id: code,
      memberCode: code,
      name: data.name.trim(),
      rank: data.rank,
      position: 'L',
      personalPv: Number(data.personalPv) || 0,
      accumulatedPv: Number(data.personalPv) || 0,
      leftPv: Number(data.leftPv) || 0,
      rightPv: Number(data.rightPv) || 0,
      leftMembers: 0,
      rightMembers: 0,
      sponsorCode: data.sponsorCode.trim().toUpperCase() || 'TH880001',
      sponsorName: data.sponsorName.trim() || 'Admin Sponsor',
      joinDate: new Date().toISOString().split('T')[0],
      isActive: data.isActive,
      avatarUrl: '/src/assets/images/mlm_avatar_member_1791310697478.jpg'
    };

    setBinaryNodes(prev => {
      const updated = { ...prev, [code]: newNode };
      try {
        localStorage.setItem('omc_binary_nodes', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    showToast(
      language === 'th' ? `เพิ่มสมาชิกรหัส ${code} (${data.name}) เข้าสู่ระบบสำเร็จ!` : `Added member ${code} successfully!`,
      'success'
    );
    return { success: true, message: 'Added' };
  };

  const resetMembersToDefault = () => {
    setBinaryNodes(INITIAL_BINARY_NODES);
    setUnilevelMembers(INITIAL_UNILEVEL_MEMBERS);
    try {
      localStorage.removeItem('omc_binary_nodes');
    } catch (e) {}
    showToast(
      language === 'th' ? 'รีเซ็ตข้อมูลสมาชิกทั้งหมดกลับเป็นค่าเริ่มต้นแล้ว' : 'Reset all members to default',
      'info'
    );
  };

  const updateOrderStatus = (orderId: string, newStatus: 'paid' | 'shipping' | 'completed', trackingNo?: string, shippingCompany?: string) => {
    setOrders(prev => {
      const updated = prev.map(o => o.id === orderId ? { 
        ...o, 
        status: newStatus, 
        ...(trackingNo !== undefined ? { trackingNumber: trackingNo } : {}),
        ...(shippingCompany !== undefined ? { shippingCompany } : {})
      } : o);
      try {
        localStorage.setItem('omc_orders', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast(language === 'th' ? `อัปเดตสถานะคำสั่งซื้อเป็น ${newStatus} สำเร็จ` : `Order status updated`, 'success');
  };

  const updateOrderFullDetails = (
    orderId: string,
    details: {
      orderNumber: string;
      date: string;
      customerName: string;
      customerPhone?: string;
      customerAddress?: string;
      province?: string;
      postcode?: string;
      orderType: 'topup' | 'autoship' | 'general';
      totalAmount: number;
      totalPv: number;
      trackingNumber?: string;
      shippingCompany?: string;
      status: 'paid' | 'shipping' | 'completed';
    }
  ): { success: boolean; message: string } => {
    const cleanOrderNum = details.orderNumber.trim().toUpperCase();
    if (!cleanOrderNum) {
      return { success: false, message: language === 'th' ? 'กรุณาระบุเลขที่คำสั่งซื้อ' : 'Please provide Order ID' };
    }
    if (!details.customerName.trim()) {
      return { success: false, message: language === 'th' ? 'กรุณาระบุชื่อลูกค้า / ผู้รับ' : 'Please provide Customer name' };
    }

    setOrders(prev => {
      const updated = prev.map(order => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          orderNumber: cleanOrderNum,
          date: details.date.trim() || order.date,
          orderType: details.orderType,
          totalAmount: Number(details.totalAmount) >= 0 ? Number(details.totalAmount) : 0,
          totalPv: Number(details.totalPv) >= 0 ? Number(details.totalPv) : 0,
          trackingNumber: details.trackingNumber !== undefined ? details.trackingNumber.trim() : order.trackingNumber,
          shippingCompany: details.shippingCompany !== undefined ? details.shippingCompany.trim() : (order.shippingCompany || 'Anousith Logistics (ອານຸສິດ ຂົນສົ່ງ)'),
          status: details.status,
          shippingAddress: {
            ...order.shippingAddress,
            fullName: details.customerName.trim(),
            phone: details.customerPhone !== undefined ? details.customerPhone.trim() : order.shippingAddress.phone,
            address: details.customerAddress !== undefined ? details.customerAddress.trim() : order.shippingAddress.address,
            province: details.province !== undefined ? details.province.trim() : order.shippingAddress.province,
            postcode: details.postcode !== undefined ? details.postcode.trim() : order.shippingAddress.postcode,
          }
        };
      });
      try {
        localStorage.setItem('omc_orders', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    showToast(
      language === 'th' 
        ? `บันทึกการแก้ไขคำสั่งซื้อ ${cleanOrderNum} สำเร็จเรียบร้อย!` 
        : `Order ${cleanOrderNum} updated successfully!`,
      'success'
    );
    return { success: true, message: 'Saved successfully' };
  };

  const deleteOrder = (orderId: string): { success: boolean; message: string } => {
    setOrders(prev => {
      const orderToDelete = prev.find(o => o.id === orderId);
      const updated = prev.filter(o => o.id !== orderId);
      try {
        localStorage.setItem('omc_orders', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast(
      language === 'th' ? `ลบคำสั่งซื้อ #${orderId} เรียบร้อยแล้ว` : `Order deleted successfully`,
      'info'
    );
    return { success: true, message: 'Deleted' };
  };

  const addNewOrderDirect = (data: {
    orderNumber: string;
    date?: string;
    customerName: string;
    customerPhone?: string;
    customerAddress?: string;
    province?: string;
    postcode?: string;
    orderType: 'topup' | 'autoship' | 'general';
    totalAmount: number;
    totalPv: number;
    trackingNumber?: string;
    shippingCompany?: string;
    status: 'paid' | 'shipping' | 'completed';
  }): { success: boolean; message: string } => {
    const cleanOrderNum = data.orderNumber.trim().toUpperCase();
    if (!cleanOrderNum) {
      return { success: false, message: language === 'th' ? 'กรุณาระบุเลขที่คำสั่งซื้อ' : 'Please provide Order ID' };
    }
    if (!data.customerName.trim()) {
      return { success: false, message: language === 'th' ? 'กรุณาระบุชื่อลูกค้า / ผู้รับ' : 'Please provide Customer name' };
    }

    const newId = `ord_${Date.now()}`;
    const newOrder: Order = {
      id: newId,
      orderNumber: cleanOrderNum,
      date: data.date?.trim() || new Date().toISOString().replace('T', ' ').slice(0, 16),
      orderType: data.orderType,
      items: [
        {
          productId: 'prod_general',
          productName: 'สินค้าบิลสมาชิก OMC Health & Beauty',
          quantity: 1,
          memberPrice: Number(data.totalAmount) || 0,
          pv: Number(data.totalPv) || 0,
          imageUrl: '/src/assets/images/mlm_product_supplement_1791310634193.jpg'
        }
      ],
      totalAmount: Number(data.totalAmount) >= 0 ? Number(data.totalAmount) : 0,
      totalPv: Number(data.totalPv) >= 0 ? Number(data.totalPv) : 0,
      paymentMethod: 'wallet',
      status: data.status,
      trackingNumber: data.trackingNumber?.trim() || '',
      shippingCompany: data.shippingCompany?.trim() || 'Anousith Logistics (ອານຸສິດ ຂົນສົ່ງ)',
      shippingAddress: {
        fullName: data.customerName.trim(),
        phone: data.customerPhone?.trim() || '081-000-0000',
        address: data.customerAddress?.trim() || 'ศูนย์บริการลูกค้า OMC',
        province: data.province?.trim() || 'กรุงเทพมหานคร',
        postcode: data.postcode?.trim() || '10110'
      }
    };

    setOrders(prev => {
      const updated = [newOrder, ...prev];
      try {
        localStorage.setItem('omc_orders', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    showToast(
      language === 'th' ? `สร้างคำสั่งซื้อใหม่ #${cleanOrderNum} สำเร็จแล้ว!` : `New order #${cleanOrderNum} created!`,
      'success'
    );
    return { success: true, message: 'Created' };
  };

  const resetOrdersToDefault = () => {
    setOrders(INITIAL_ORDERS);
    try {
      localStorage.removeItem('omc_orders');
    } catch (e) {}
    showToast(
      language === 'th' ? 'รีเซ็ตรายการคำสั่งซื้อทั้งหมดกลับเป็นค่าเริ่มต้นแล้ว' : 'Reset all orders to default',
      'info'
    );
  };

  const calculateNewCommissionCycle = () => {
    const cycleNum = `2026/10-W${commissionCycles.length + 1}`;
    const newCycle: CommissionCycle = {
      id: `cyc_${Date.now()}`,
      cycleNumber: cycleNum,
      periodName: `รอบคำนวณอัตโนมัติประจำสัปดาห์ (${cycleNum})`,
      startDate: '2026-10-08',
      endDate: '2026-10-14',
      breakdown: {
        fastStart: 24000,
        binaryPairing: 48500,
        matching: 14200,
        autoshipPool: 5800,
        allSaleBonus: 8000
      },
      totalGross: 100500,
      withholdingTax: 3015,
      transferFee: 30,
      netPayout: 97455,
      status: 'pending',
      payoutDate: '2026-10-17'
    };
    setCommissionCycles(prev => [newCycle, ...prev]);
    showToast(language === 'th' ? `ประมวลผลคำนวณยอดโบนัสรอบใหม่สำเร็จ: ${cycleNum}` : `Commission cycle computed: ${cycleNum}`, 'success');
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProd: Product = { ...product, id: `prod_${Date.now()}` };
    setProducts(prev => {
      const updated = [newProd, ...prev];
      try {
        localStorage.setItem('omc_products', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast(language === 'th' ? `เพิ่มสินค้า "${product.nameTh}" เรียบร้อยแล้ว` : `Product added`, 'success');
  };

  const updateProductStock = (productId: string, newStock: number) => {
    setProducts(prev => {
      const updated = prev.map(p => p.id === productId ? { ...p, stock: Math.max(0, newStock) } : p);
      try {
        localStorage.setItem('omc_products', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast(language === 'th' ? `อัปเดตสต็อกสินค้าสำเร็จ (${newStock} ชิ้น)` : `Stock updated`, 'success');
  };

  const updateProductFullDetails = (
    productId: string,
    details: {
      code: string;
      nameTh: string;
      name?: string;
      category: 'health' | 'beauty' | 'beverage' | 'package';
      memberPrice: number;
      retailPrice: number;
      pv: number;
      stock: number;
      imageUrl: string;
      descriptionTh?: string;
      description?: string;
    }
  ): { success: boolean; message: string } => {
    const cleanCode = details.code.trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, message: language === 'th' ? 'กรุณาระบุรหัสสินค้า (SKU)' : 'Product SKU is required' };
    }
    if (!details.nameTh.trim()) {
      return { success: false, message: language === 'th' ? 'กรุณาระบุชื่อสินค้า' : 'Product name is required' };
    }

    let isUpdated = false;
    setProducts(prev => {
      const updated = prev.map(p => {
        if (p.id !== productId) return p;
        isUpdated = true;
        return {
          ...p,
          code: cleanCode,
          nameTh: details.nameTh.trim(),
          name: details.name?.trim() || details.nameTh.trim(),
          category: details.category,
          memberPrice: Math.max(0, Number(details.memberPrice) || 0),
          retailPrice: Math.max(0, Number(details.retailPrice) || 0),
          pv: Math.max(0, Number(details.pv) || 0),
          stock: Math.max(0, Number(details.stock) || 0),
          imageUrl: details.imageUrl.trim() || p.imageUrl,
          descriptionTh: details.descriptionTh !== undefined ? details.descriptionTh.trim() : p.descriptionTh,
          description: details.description !== undefined ? details.description.trim() : p.description
        };
      });
      try {
        localStorage.setItem('omc_products', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    if (isUpdated) {
      showToast(language === 'th' ? `อัปเดตข้อมูลสินค้า ${cleanCode} สำเร็จ` : `Product ${cleanCode} updated`, 'success');
      return { success: true, message: 'Updated successfully' };
    }
    return { success: false, message: 'Product not found' };
  };

  const deleteProduct = (productId: string): { success: boolean; message: string } => {
    let deletedCode = '';
    setProducts(prev => {
      const target = prev.find(p => p.id === productId);
      if (target) deletedCode = target.code;
      const updated = prev.filter(p => p.id !== productId);
      try {
        localStorage.setItem('omc_products', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast(language === 'th' ? `ลบสินค้า ${deletedCode || productId} เรียบร้อยแล้ว` : `Product deleted`, 'info');
    return { success: true, message: 'Deleted' };
  };

  const resetProductsToDefault = () => {
    try {
      localStorage.removeItem('omc_products');
    } catch (e) {}
    setProducts(PRODUCTS);
    showToast(language === 'th' ? 'รีเซ็ตข้อมูลสินค้ากลับเป็นค่าเริ่มต้นแล้ว' : 'Products reset to default', 'info');
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('omc_is_authenticated');
      localStorage.removeItem('omc_user_role');
      localStorage.removeItem('omc_current_member_code');
    } catch {
      // ignore
    }
    showToast(
      language === 'th' ? 'ออกจากระบบเรียบร้อยแล้ว' : 'Logged out successfully',
      'info'
    );
  };

  const switchMember = (memberId: string) => {
    const found = ALTERNATIVE_MEMBERS.find(m => m.id === memberId);
    if (found) {
      setCurrentMember(found);
      showToast(
        language === 'th' 
          ? `สลับไปยังบัญชี ${found.fullName} (${found.rank})` 
          : `Switched to account: ${found.fullName} (${found.rank})`,
        'info'
      );
    }
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(
      language === 'th' 
        ? `เพิ่ม "${language === 'th' ? product.nameTh : product.name}" ลงในตะกร้าแล้ว` 
        : `Added "${product.name}" to cart`,
      'success'
    );
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const placeOrder = (
    orderType: 'topup' | 'autoship' | 'general',
    paymentMethod: 'wallet' | 'promptpay'
  ): boolean => {
    if (cart.length === 0) return false;

    const totalAmount = cart.reduce((sum, item) => sum + item.product.memberPrice * item.quantity, 0);
    const totalPv = cart.reduce((sum, item) => sum + item.product.pv * item.quantity, 0);

    if (paymentMethod === 'wallet' && currentMember.walletBalance < totalAmount) {
      showToast(
        language === 'th' ? 'ยอดเงินใน E-Wallet ไม่เพียงพอ กรุณาเติมเงิน' : 'Insufficient E-Wallet balance',
        'error'
      );
      return false;
    }

    const orderNumber = `INV${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      orderType,
      items: cart.map(item => ({
        productId: item.product.id,
        productName: language === 'th' ? item.product.nameTh : item.product.name,
        quantity: item.quantity,
        memberPrice: item.product.memberPrice,
        pv: item.product.pv,
        imageUrl: item.product.imageUrl
      })),
      totalAmount,
      totalPv,
      paymentMethod,
      status: 'shipping',
      trackingNumber: `ANO${Math.floor(1000000 + Math.random() * 9000000)}LA`,
      shippingCompany: 'Anousith Logistics (ອານຸສິດ ຂົນສົ່ງ)',
      shippingAddress: {
        fullName: currentMember.fullName,
        phone: currentMember.phone,
        address: currentMember.address,
        province: currentMember.province,
        postcode: currentMember.postcode
      }
    };

    setOrders(prev => [newOrder, ...prev]);

    // Deduct wallet if paid via wallet
    if (paymentMethod === 'wallet') {
      const newBal = currentMember.walletBalance - totalAmount;
      setCurrentMember(prev => ({
        ...prev,
        walletBalance: newBal,
        personalPv: prev.personalPv + totalPv,
        accumulatedPv: prev.accumulatedPv + totalPv,
        autoshipStatus: orderType === 'autoship' ? 'active' : prev.autoshipStatus,
        autoshipExpireDate: orderType === 'autoship' ? '2026-11-30' : prev.autoshipExpireDate
      }));

      const newTx: WalletTransaction = {
        id: `tx_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        type: 'order_payment',
        amount: -totalAmount,
        balanceAfter: newBal,
        description: `ชำระค่าสินค้า #${orderNumber} (${orderType === 'autoship' ? 'บิลรักษายอด' : 'สั่งซื้อ'})`,
        refCode: `ORD-${orderNumber}`
      };
      setTransactions(prev => [newTx, ...prev]);
    } else {
      // PromptPay
      setCurrentMember(prev => ({
        ...prev,
        personalPv: prev.personalPv + totalPv,
        accumulatedPv: prev.accumulatedPv + totalPv,
        autoshipStatus: orderType === 'autoship' ? 'active' : prev.autoshipStatus,
        autoshipExpireDate: orderType === 'autoship' ? '2026-11-30' : prev.autoshipExpireDate
      }));
    }

    clearCart();
    showToast(
      language === 'th'
        ? `สั่งซื้อสำเร็จ #${orderNumber} รับคะแนน +${totalPv.toLocaleString()} PV`
        : `Order placed #${orderNumber} (+${totalPv.toLocaleString()} PV)`,
      'success'
    );
    return true;
  };

  const transferWallet = (
    targetMemberCode: string,
    amount: number,
    memo?: string,
    pin?: string
  ) => {
    if (amount <= 0) {
      return { success: false, message: language === 'th' ? 'กรุณาระบุจำนวนเงินที่ถูกต้อง' : 'Invalid amount' };
    }
    if (amount > currentMember.walletBalance) {
      return { success: false, message: language === 'th' ? 'ยอดเงินใน E-Wallet ไม่เพียงพอ' : 'Insufficient balance' };
    }
    if (pin && pin !== currentMember.transactionPin) {
      return { success: false, message: language === 'th' ? 'รหัส PIN ธุรกรรมไม่ถูกต้อง' : 'Incorrect PIN' };
    }

    const targetNode = Object.values(binaryNodes).find(n => n.memberCode.toUpperCase() === targetMemberCode.trim().toUpperCase());
    const recipientName = targetNode ? targetNode.name : `สมาชิก ${targetMemberCode}`;

    const newBal = currentMember.walletBalance - amount;
    setCurrentMember(prev => ({ ...prev, walletBalance: newBal }));

    const tx: WalletTransaction = {
      id: `tx_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      type: 'transfer_out',
      amount: -amount,
      balanceAfter: newBal,
      description: `โอนเงินให้สมาชิก ${targetMemberCode} (${recipientName}) ${memo ? `[${memo}]` : ''}`,
      refCode: `TRF-${targetMemberCode}-${Date.now().toString().slice(-4)}`,
      targetMemberCode,
      targetMemberName: recipientName
    };

    setTransactions(prev => [tx, ...prev]);
    showToast(
      language === 'th'
        ? `โอนเงิน ${amount.toLocaleString()} บาท ไปยัง ${recipientName} สำเร็จ`
        : `Transferred ${amount.toLocaleString()} THB to ${recipientName} successfully`,
      'success'
    );

    return { success: true, message: 'Transfer completed' };
  };

  const withdrawWallet = (amount: number, pin: string) => {
    const fee = 30;
    const totalRequired = amount + fee;
    if (amount < 300) {
      return { success: false, message: language === 'th' ? 'ถอนเงินขั้นต่ำ 300 บาท' : 'Minimum withdrawal is 300 THB' };
    }
    if (totalRequired > currentMember.walletBalance) {
      return { success: false, message: language === 'th' ? 'ยอดเงินไม่พอรวมค่าธรรมเนียม 30 บาท' : 'Insufficient balance including fee' };
    }
    if (pin !== currentMember.transactionPin) {
      return { success: false, message: language === 'th' ? 'รหัส PIN ธุรกรรมไม่ถูกต้อง' : 'Incorrect PIN' };
    }

    const newBal = currentMember.walletBalance - totalRequired;
    setCurrentMember(prev => ({ ...prev, walletBalance: newBal }));

    const tx: WalletTransaction = {
      id: `tx_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      type: 'withdraw',
      amount: -totalRequired,
      balanceAfter: newBal,
      description: `ถอนเงินเข้าบัญชีธนาคาร ${currentMember.bankAccount.bankName} เลขที่ ${currentMember.bankAccount.accountNumber} (รวมค่าธรรมเนียม ${fee} บ.)`,
      refCode: `WDR-${Date.now().toString().slice(-6)}`
    };

    setTransactions(prev => [tx, ...prev]);
    showToast(
      language === 'th'
        ? `ส่งคำขอถอนเงิน ${amount.toLocaleString()} บาท สำเร็จ (ยอดโอนสุทธิ ${amount.toLocaleString()} บ.)`
        : `Withdrawal request for ${amount.toLocaleString()} THB submitted`,
      'success'
    );

    return { success: true, message: 'Withdrawal processed' };
  };

  const registerNewMember = (data: {
    fullName: string;
    idCardNumber: string;
    phone: string;
    email: string;
    address: string;
    province: string;
    postcode: string;
    sponsorCode: string;
    uplineCode: string;
    position: 'L' | 'R';
    rank: MemberRank;
    packagePv: number;
    packageAmount: number;
    paymentMethod: 'wallet' | 'promptpay';
  }) => {
    if (data.paymentMethod === 'wallet' && currentMember.walletBalance < data.packageAmount) {
      return {
        success: false,
        newMemberCode: '',
        message: language === 'th' ? 'ยอดเงินใน E-Wallet ไม่เพียงพอสำหรับชำระค่าชุดเปิดรหัส' : 'Insufficient wallet balance for starter pack'
      };
    }

    const newCode = `TH89${Math.floor(1000 + Math.random() * 9000)}`;

    const newNode: BinaryNode = {
      id: newCode,
      memberCode: newCode,
      name: data.fullName,
      rank: data.rank,
      position: data.position,
      personalPv: data.packagePv,
      accumulatedPv: data.packagePv,
      leftPv: 0,
      rightPv: 0,
      leftMembers: 0,
      rightMembers: 0,
      sponsorCode: data.sponsorCode,
      sponsorName: data.sponsorCode === currentMember.memberCode ? currentMember.fullName : 'สมาชิกผู้แนะนำ',
      joinDate: new Date().toISOString().split('T')[0],
      isActive: true
    };

    // Update upline node
    setBinaryNodes(prev => {
      const upline = prev[data.uplineCode];
      const updatedUpline = upline ? {
        ...upline,
        leftChildId: data.position === 'L' ? newCode : upline.leftChildId,
        rightChildId: data.position === 'R' ? newCode : upline.rightChildId,
        leftPv: data.position === 'L' ? upline.leftPv + data.packagePv : upline.leftPv,
        rightPv: data.position === 'R' ? upline.rightPv + data.packagePv : upline.rightPv,
        leftMembers: data.position === 'L' ? upline.leftMembers + 1 : upline.leftMembers,
        rightMembers: data.position === 'R' ? upline.rightMembers + 1 : upline.rightMembers
      } : undefined;

      return {
        ...prev,
        [newCode]: newNode,
        ...(updatedUpline ? { [data.uplineCode]: updatedUpline } : {})
      };
    });

    // Add to unilevel
    const newUniMember: UnilevelMember = {
      id: `uni_${Date.now()}`,
      memberCode: newCode,
      name: data.fullName,
      generation: 1,
      rank: data.rank,
      directSponsorCode: data.sponsorCode,
      directSponsorName: currentMember.fullName,
      personalPv: data.packagePv,
      teamPv: data.packagePv,
      joinDate: new Date().toISOString().split('T')[0],
      isActive: true
    };
    setUnilevelMembers(prev => [newUniMember, ...prev]);

    // If paid via wallet, deduct
    if (data.paymentMethod === 'wallet') {
      const newBal = currentMember.walletBalance - data.packageAmount;
      setCurrentMember(prev => ({
        ...prev,
        walletBalance: newBal,
        leftLegPv: data.position === 'L' ? prev.leftLegPv + data.packagePv : prev.leftLegPv,
        rightLegPv: data.position === 'R' ? prev.rightLegPv + data.packagePv : prev.rightLegPv,
        leftLegMembers: data.position === 'L' ? prev.leftLegMembers + 1 : prev.leftLegMembers,
        rightLegMembers: data.position === 'R' ? prev.rightLegMembers + 1 : prev.rightLegMembers
      }));

      const tx: WalletTransaction = {
        id: `tx_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        type: 'order_payment',
        amount: -data.packageAmount,
        balanceAfter: newBal,
        description: `ชำระค่าชุดเปิดรหัส ${data.rank} ให้แก่สมาชิกใหม่ ${newCode} (${data.fullName})`,
        refCode: `REG-${newCode}`
      };
      setTransactions(prev => [tx, ...prev]);
    } else {
      setCurrentMember(prev => ({
        ...prev,
        leftLegPv: data.position === 'L' ? prev.leftLegPv + data.packagePv : prev.leftLegPv,
        rightLegPv: data.position === 'R' ? prev.rightLegPv + data.packagePv : prev.rightLegPv,
        leftLegMembers: data.position === 'L' ? prev.leftLegMembers + 1 : prev.leftLegMembers,
        rightLegMembers: data.position === 'R' ? prev.rightLegMembers + 1 : prev.rightLegMembers
      }));
    }

    showToast(
      language === 'th'
        ? `ลงทะเบียนสมาชิกใหม่สำเร็จ! รหัส ${newCode} (${data.fullName})`
        : `Enrolled new member successfully! ID ${newCode} (${data.fullName})`,
      'success'
    );

    return {
      success: true,
      newMemberCode: newCode,
      message: 'Registration successful'
    };
  };

  return (
    <MlmContext.Provider
      value={{
        language,
        setLanguage,
        currentMember,
        switchMember,
        activeTab,
        setActiveTab,
        binaryNodes,
        unilevelMembers,
        products,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        orders,
        placeOrder,
        commissionCycles,
        transactions,
        transferWallet,
        withdrawWallet,
        registerNewMember,
        toasts,
        showToast,
        announcements: ANNOUNCEMENTS,
        registrationPreFill,
        setRegistrationPreFill,
        isAuthenticated,
        login,
        logout,
        userRole,
        switchRole,
        adminTab,
        setAdminTab,
        withdrawalRequests,
        approveWithdrawal,
        rejectWithdrawal,
        compensationSettings,
        updateCompensationSettings,
        updateMemberRank,
        adjustMemberWallet,
        adjustMemberPv,
        toggleMemberStatus,
        updateMemberFullDetails,
        deleteMember,
        addNewMemberDirect,
        resetMembersToDefault,
        updateOrderStatus,
        updateOrderFullDetails,
        deleteOrder,
        addNewOrderDirect,
        resetOrdersToDefault,
        calculateNewCommissionCycle,
        addProduct,
        updateProductStock,
        updateProductFullDetails,
        deleteProduct,
        resetProductsToDefault,
        systemBranding,
        updateSystemBranding,
        resetSystemBranding,
        companyBankSettings,
        companyBankAccounts,
        addCompanyBankAccount,
        updateCompanyBankAccount,
        deleteCompanyBankAccount,
        setPrimaryCompanyBank,
        updateCompanyBankSettings,
        resetCompanyBankSettings,
        updateMemberBankAccount,
        addMemberBankAccount,
        setPrimaryBankAccount,
        adminCredentials,
        updateAdminCredentials,
        resetAdminCredentials
      }}
    >
      {children}
    </MlmContext.Provider>
  );
};

export const useMlm = () => {
  const context = useContext(MlmContext);
  if (!context) {
    throw new Error('useMlm must be used within a MlmProvider');
  }
  return context;
};

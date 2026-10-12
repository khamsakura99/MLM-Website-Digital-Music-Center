import React, { useState } from 'react';
import { MlmProvider, useMlm, ActiveTab } from './context/MlmContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Toasts } from './components/Toasts';
import { DashboardView } from './components/views/DashboardView';
import { BinaryTreeView } from './components/views/BinaryTreeView';
import { UnilevelTreeView } from './components/views/UnilevelTreeView';
import { DownlineListView } from './components/views/DownlineListView';
import { ShopCatalogView } from './components/views/ShopCatalogView';
import { OrderHistoryView } from './components/views/OrderHistoryView';
import { CommissionStatementsView } from './components/views/CommissionStatementsView';
import { WalletManagementView } from './components/views/WalletManagementView';
import { CommissionLedgerView } from './components/views/CommissionLedgerView';
import { RegistrationView } from './components/views/RegistrationView';
import { ProfileKycView } from './components/views/ProfileKycView';
import { LoginView } from './components/views/LoginView';
import { CartDrawer } from './components/modals/CartDrawer';
import { QuickWalletModal } from './components/modals/QuickWalletModal';
import { CommissionSlipModal } from './components/modals/CommissionSlipModal';
import { CommissionCycle, AdminTab } from './types/mlm';

// Admin Components
import { AdminHeader } from './components/admin/AdminHeader';
import { AdminSidebar } from './components/admin/AdminSidebar';
import { AdminDashboardView } from './components/admin/views/AdminDashboardView';
import { AdminMembersView } from './components/admin/views/AdminMembersView';
import { AdminOrdersView } from './components/admin/views/AdminOrdersView';
import { AdminCommissionsView } from './components/admin/views/AdminCommissionsView';
import { AdminWithdrawalsView } from './components/admin/views/AdminWithdrawalsView';
import { AdminProductsView } from './components/admin/views/AdminProductsView';
import { AdminSettingsView } from './components/admin/views/AdminSettingsView';

const MainLayout: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    currentMember, 
    language, 
    isAuthenticated,
    userRole,
    adminTab 
  } = useMlm();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [slipModalCycle, setSlipModalCycle] = useState<CommissionCycle | null>(null);

  if (!isAuthenticated) {
    return (
      <>
        <LoginView />
        <Toasts />
      </>
    );
  }

  // --- ADMINISTRATOR CONTROL PANEL LAYOUT ---
  if (userRole === 'admin') {
    const getAdminBreadcrumb = (tab: AdminTab) => {
      switch (tab) {
        case 'admin_dashboard':
          return language === 'th' ? 'ภาพรวมระบบบริหาร (Dashboard)' : 'System Overview';
        case 'admin_members':
          return language === 'th' ? 'จัดการสมาชิกและผังองค์กร' : 'Member Management';
        case 'admin_orders':
          return language === 'th' ? 'จัดการคำสั่งซื้อและการจัดส่ง' : 'Order Fulfillment';
        case 'admin_commissions':
          return language === 'th' ? 'ประมวลผลคำนวณคอมมิชชั่น' : 'Commission Engine';
        case 'admin_withdrawals':
          return language === 'th' ? 'อนุมัติคำขอถอนเงิน' : 'Withdrawal Approvals';
        case 'admin_products':
          return language === 'th' ? 'จัดการแคตตาล็อกสินค้า & สต็อก' : 'Product Inventory';
        case 'admin_settings':
          return language === 'th' ? 'ตั้งค่าแผนการจ่ายผลตอบแทน' : 'Compensation Settings';
        default:
          return 'Admin Console';
      }
    };

    return (
      <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
        <AdminHeader onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

        <div className="flex-1 flex overflow-hidden">
          <AdminSidebar
            isMobileOpen={isMobileMenuOpen}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
          />

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-100 text-slate-900">
            <div className="max-w-7xl mx-auto space-y-6">
              
              {/* Admin Breadcrumb Header */}
              <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-200">
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="text-purple-700 font-bold">OMC Admin Console</span>
                  <span>/</span>
                  <span className="text-slate-900 font-semibold">{getAdminBreadcrumb(adminTab)}</span>
                </div>
                <div className="font-mono text-slate-500 text-[11px] hidden sm:block">
                  Role: Superadmin (Central Headquarters)
                </div>
              </div>

              {/* Dynamic Admin View */}
              {adminTab === 'admin_dashboard' && <AdminDashboardView />}
              {adminTab === 'admin_members' && <AdminMembersView />}
              {adminTab === 'admin_orders' && <AdminOrdersView />}
              {adminTab === 'admin_commissions' && <AdminCommissionsView />}
              {adminTab === 'admin_withdrawals' && <AdminWithdrawalsView />}
              {adminTab === 'admin_products' && <AdminProductsView />}
              {adminTab === 'admin_settings' && <AdminSettingsView />}

            </div>
          </main>
        </div>

        <Toasts />
      </div>
    );
  }

  // --- MEMBER PORTAL LAYOUT ---
  const getBreadcrumbTitle = (tab: ActiveTab) => {
    switch (tab) {
      case 'dashboard':
        return language === 'th' ? 'ภาพรวมธุรกิจ' : 'Dashboard Overview';
      case 'genealogy_binary':
        return language === 'th' ? 'ผังองค์กรไบนารี่ (Binary Tree)' : 'Binary Tree';
      case 'genealogy_unilevel':
        return language === 'th' ? 'ผังสายเลือดผู้แนะนำ (Unilevel Tree)' : 'Unilevel Sponsor Tree';
      case 'genealogy_list':
        return language === 'th' ? 'รายชื่อสมาชิกในสายงาน (Downline Directory)' : 'Downline Directory';
      case 'shop_catalog':
        return language === 'th' ? 'สั่งซื้อสินค้า & รักษายอด (Store & Autoship)' : 'Store & Autoship';
      case 'shop_orders':
        return language === 'th' ? 'ประวัติคำสั่งซื้อสินค้า (Order History)' : 'Order History';
      case 'commissions_statements':
        return language === 'th' ? 'ใบแจ้งยอดรอบโบนัส (Statements)' : 'Commission Statements';
      case 'commissions_wallet':
        return language === 'th' ? 'กระเป๋าเงิน E-Wallet & โอน (Wallet)' : 'E-Wallet Management';
      case 'commissions_ledger':
        return language === 'th' ? 'รายการเดินบัญชีการเงิน (Financial Ledger)' : 'Transaction Ledger';
      case 'registration':
        return language === 'th' ? 'สมัครสมาชิกใหม่ในสายงาน (Enrollment)' : 'Enroll New Member';
      case 'profile_kyc':
        return language === 'th' ? 'ข้อมูลส่วนตัว & ยืนยันตัวตน KYC' : 'Profile & KYC';
      default:
        return 'BackOffice';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* Top Header */}
      <Header
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Shell (Sidebar + Viewport) */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar */}
        <Sidebar
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Contextual Breadcrumb Header */}
            <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-200">
              <div className="flex items-center gap-1.5 font-medium">
                <span className="text-slate-400">OMC BackOffice</span>
                <span>/</span>
                <span className="text-slate-900 font-semibold">{getBreadcrumbTitle(activeTab)}</span>
              </div>
              <div className="font-mono text-slate-400 text-[11px] hidden sm:block">
                Member: {currentMember.memberCode} ({currentMember.rank})
              </div>
            </div>

            {/* Dynamic View rendering */}
            {activeTab === 'dashboard' && (
              <DashboardView onOpenWalletModal={() => setIsWalletModalOpen(true)} />
            )}

            {activeTab === 'genealogy_binary' && <BinaryTreeView />}
            {activeTab === 'genealogy_unilevel' && <UnilevelTreeView />}
            {activeTab === 'genealogy_list' && <DownlineListView />}

            {activeTab === 'shop_catalog' && (
              <ShopCatalogView onOpenCart={() => setIsCartOpen(true)} />
            )}
            {activeTab === 'shop_orders' && <OrderHistoryView />}

            {activeTab === 'commissions_statements' && (
              <CommissionStatementsView onOpenSlipModal={(c) => setSlipModalCycle(c)} />
            )}
            {activeTab === 'commissions_wallet' && <WalletManagementView />}
            {activeTab === 'commissions_ledger' && <CommissionLedgerView />}

            {activeTab === 'registration' && <RegistrationView />}
            {activeTab === 'profile_kyc' && <ProfileKycView />}

          </div>
        </main>
      </div>

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      {/* Quick E-Wallet Modal */}
      <QuickWalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />

      {/* Printable Commission Voucher Slip Modal */}
      <CommissionSlipModal
        cycle={slipModalCycle}
        member={currentMember}
        isOpen={!!slipModalCycle}
        onClose={() => setSlipModalCycle(null)}
        language={language}
      />

      {/* Toast Notifications */}
      <Toasts />
    </div>
  );
};

export default function App() {
  return (
    <MlmProvider>
      <MainLayout />
    </MlmProvider>
  );
}

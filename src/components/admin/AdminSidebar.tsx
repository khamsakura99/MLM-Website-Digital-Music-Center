import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  Calculator, 
  ArrowDownToLine, 
  Package, 
  Sliders, 
  X,
  ExternalLink,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { useMlm } from '../../context/MlmContext';
import { AdminTab } from '../../types/mlm';

interface AdminSidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const { 
    language, 
    adminTab, 
    setAdminTab, 
    switchRole, 
    logout,
    withdrawalRequests,
    orders,
    systemBranding
  } = useMlm();

  const pendingWithdrawalsCount = withdrawalRequests.filter(w => w.status === 'pending').length;
  const pendingOrdersCount = orders.filter(o => o.status === 'shipping').length;

  const menuItems: {
    id: AdminTab;
    labelTh: string;
    labelEn: string;
    labelLo: string;
    icon: React.ElementType;
    badgeCount?: number;
  }[] = [
    {
      id: 'admin_dashboard',
      labelTh: 'ภาพรวมระบบบริหาร (Dashboard)',
      labelEn: 'System Overview',
      labelLo: 'ພາບລວມລະບົບບໍລິຫານ (Dashboard)',
      icon: LayoutDashboard
    },
    {
      id: 'admin_members',
      labelTh: 'จัดการสมาชิก & ปรับตำแหน่ง',
      labelEn: 'Member Management',
      labelLo: 'ຈັດການສະມາຊິກ & ປັບຕຳແໜ່ງ',
      icon: Users
    },
    {
      id: 'admin_orders',
      labelTh: 'จัดการคำสั่งซื้อ & จัดส่ง',
      labelEn: 'Orders & Fulfillment',
      labelLo: 'ຈັດການຄຳສັ່ງຊື້ & ຈັດສົ່ງ',
      icon: ShoppingBag,
      badgeCount: pendingOrdersCount > 0 ? pendingOrdersCount : undefined
    },
    {
      id: 'admin_commissions',
      labelTh: 'คำนวณ & ตัดรอบคอมมิชชั่น',
      labelEn: 'Commission Calculation',
      labelLo: 'ຄຳນວນ & ຕັດຮອບຄອມມິດຊັ່ນ',
      icon: Calculator
    },
    {
      id: 'admin_withdrawals',
      labelTh: 'อนุมัติการถอนเงิน',
      labelEn: 'Withdrawal Approvals',
      labelLo: 'ອະນຸມັດການຖອນເງິນ',
      icon: ArrowDownToLine,
      badgeCount: pendingWithdrawalsCount > 0 ? pendingWithdrawalsCount : undefined
    },
    {
      id: 'admin_products',
      labelTh: 'จัดการสินค้า & สต็อก',
      labelEn: 'Products & Inventory',
      labelLo: 'ຈັດການສິນຄ້າ & ສະຕັອກ',
      icon: Package
    },
    {
      id: 'admin_settings',
      labelTh: 'ตั้งค่าระบบ & รหัสผ่าน Admin',
      labelEn: 'Settings & Admin Password',
      labelLo: 'ຕັ້ງຄ່າລະບົບ & ລະຫັດຜ່ານ Admin',
      icon: Sliders
    }
  ];

  const handleSelectTab = (tab: AdminTab) => {
    setAdminTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Admin Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-950 text-slate-300 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-10 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header Close */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 lg:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-white text-base">
              {systemBranding.shortCode || 'OMC'} Admin Console
            </span>
          </div>
          <button 
            type="button" 
            onClick={onCloseMobile}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Administrator Badge Header Box */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xs font-bold text-white truncate">
                ผู้ดูแลระบบสูงสุด (Superadmin)
              </h3>
              <p className="text-[11px] font-mono text-purple-400">
                admin@omc.co.th
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-slate-400">
                  สิทธิ์การจัดการระดับสูงสุด
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 text-[11px] font-semibold tracking-wider uppercase text-slate-500 mb-2">
            {language === 'lo' ? 'ໂມດູນລະບົບຜູ້ດູແລ' : (language === 'th' ? 'โมดูลระบบผู้ดูแล' : 'Admin Control Modules')}
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = adminTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium rounded-lg transition-colors text-left cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-semibold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">
                    {language === 'lo' ? item.labelLo : (language === 'th' ? item.labelTh : item.labelEn)}
                  </span>
                </div>
                {item.badgeCount !== undefined && (
                  <span className="ml-2 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-500 text-slate-950 font-mono">
                    {item.badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Switch Role & Logout Footer */}
        <div className="p-3 bg-slate-900/80 border-t border-slate-800 space-y-2 text-xs">
          <button
            onClick={() => {
              onCloseMobile();
              switchRole('member');
            }}
            className="w-full py-2 px-3 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 hover:text-blue-200 transition-colors flex items-center justify-center gap-1.5 font-medium cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{language === 'th' ? 'สลับไปมุมมองสมาชิก' : 'Switch to Member Portal'}</span>
          </button>

          <button
            onClick={() => {
              onCloseMobile();
              logout();
            }}
            className="w-full py-2 px-3 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-300 hover:text-white transition-colors flex items-center justify-center gap-1.5 font-medium cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{language === 'th' ? 'ออกจากระบบผู้ดูแล' : 'Log Out'}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

import React from 'react';
import { 
  ShieldCheck, 
  LogOut, 
  Menu,
  ExternalLink,
  Building2,
  KeyRound
} from 'lucide-react';
import { useMlm } from '../../context/MlmContext';

interface AdminHeaderProps {
  onOpenMobileMenu?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onOpenMobileMenu }) => {
  const { 
    language, 
    setLanguage, 
    switchRole, 
    logout,
    withdrawalRequests,
    orders,
    systemBranding,
    setAdminTab
  } = useMlm();

  const pendingWithdrawalsCount = withdrawalRequests.filter(w => w.status === 'pending').length;
  const pendingOrdersCount = orders.filter(o => o.status === 'paid' || o.status === 'shipping').length;

  return (
    <header className="sticky top-0 z-30 bg-slate-950 text-slate-100 border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Mobile Menu & Admin Wordmark */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Open admin sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white font-bold text-lg shadow-md tracking-wider">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base tracking-tight text-white leading-tight">
                    {systemBranding.shortCode || 'OMC'} Admin Console
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    SUPERADMIN
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono leading-none">
                  {systemBranding.domainName}/admin
                </span>
              </div>
            </div>
          </div>

          {/* Zone 2: Pending Tasks Badges */}
          <div className="hidden md:flex items-center gap-3 text-xs">
            {pendingWithdrawalsCount > 0 && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-950/60 border border-amber-700/60 text-amber-300 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>
                  {language === 'th' ? 'รออนุมัติถอนเงิน: ' : 'Pending Withdrawals: '}
                  <strong className="font-mono">{pendingWithdrawalsCount}</strong> {language === 'th' ? 'รายการ' : ''}
                </span>
              </div>
            )}

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300">
              <span className="text-slate-400">{language === 'th' ? 'สถานะเซิร์ฟเวอร์:' : 'Server:'}</span>
              <span className="text-emerald-400 font-medium">Online (Live DB)</span>
            </div>
          </div>

          {/* Zone 3: Switch to Member View, Language, Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Admin Bank Settings Button */}
            <button
              onClick={() => setAdminTab('admin_settings')}
              className="px-2.5 py-1.5 bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-emerald-700/60 transition-colors shadow-2xs cursor-pointer"
              title={language === 'th' ? '+ เพิ่มบัญชีธนาคารของคุณ (+ Add My Bank Account)' : '+ Add My Bank Account'}
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{language === 'th' ? '+ เพิ่มบัญชีธนาคาร' : '+ Add Bank'}</span>
            </button>

            {/* Quick Admin Password & Security Button */}
            <button
              onClick={() => setAdminTab('admin_settings')}
              className="px-2.5 py-1.5 bg-rose-950/80 hover:bg-rose-900/90 text-rose-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-rose-700/60 transition-colors shadow-2xs cursor-pointer"
              title={language === 'th' ? 'เปลี่ยนรหัสผ่าน Admin (Admin Password)' : 'Change Admin Password'}
            >
              <KeyRound className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">{language === 'th' ? 'รหัสผ่าน Admin' : 'Admin Password'}</span>
            </button>

            {/* Switch to Member Portal Button */}
            <button
              onClick={() => switchRole('member')}
              className="px-3 py-1.5 bg-blue-600/90 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-blue-500 transition-colors shadow-2xs cursor-pointer"
              title={language === 'th' ? 'สลับไปยังหน้าระบบสมาชิก' : 'Switch to Member Portal'}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'th' ? 'สลับไปหน้าระบบสมาชิก' : 'Member Portal'}</span>
              <span className="sm:hidden">{language === 'th' ? 'สมาชิก' : 'Portal'}</span>
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-800 rounded-md p-0.5 border border-slate-700">
              <button
                type="button"
                onClick={() => setLanguage('th')}
                className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                  language === 'th' 
                    ? 'bg-indigo-600 text-white font-semibold' 
                    : 'text-slate-400 hover:text-white'
                }`}
                title="ภาษาไทย (TH)"
              >
                TH
              </button>
              <button
                type="button"
                onClick={() => setLanguage('lo')}
                className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                  language === 'lo' 
                    ? 'bg-indigo-600 text-white font-semibold' 
                    : 'text-slate-400 hover:text-white'
                }`}
                title="ພາສາລາວ (LAO)"
              >
                🇱🇦 LO
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                  language === 'en' 
                    ? 'bg-indigo-600 text-white font-semibold' 
                    : 'text-slate-400 hover:text-white'
                }`}
                title="English (EN)"
              >
                EN
              </button>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
              title={language === 'th' ? 'ออกจากระบบผู้ดูแล' : 'Log Out'}
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};

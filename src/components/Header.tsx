import React, { useState } from 'react';
import { 
  Globe, 
  Wallet, 
  Bell, 
  ShieldCheck, 
  AlertCircle, 
  ChevronDown, 
  UserCheck, 
  ExternalLink,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { useMlm } from '../context/MlmContext';
import { ALTERNATIVE_MEMBERS } from '../data/mockMlmData';

interface HeaderProps {
  onOpenMobileMenu?: () => void;
  onOpenWalletModal?: () => void;
  onOpenCart?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenMobileMenu, 
  onOpenWalletModal,
  onOpenCart
}) => {
  const { 
    language, 
    setLanguage, 
    currentMember, 
    switchMember, 
    cart, 
    announcements,
    setActiveTab,
    logout,
    switchRole,
    systemBranding
  } = useMlm();

  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const getRankBadgeClass = (rank: string) => {
    switch (rank) {
      case 'Diamond':
        return 'bg-blue-900 text-blue-100 border border-blue-700';
      case 'Platinum':
        return 'bg-purple-900 text-purple-100 border border-purple-700';
      case 'Gold':
        return 'bg-amber-800 text-amber-100 border border-amber-600';
      case 'Silver':
        return 'bg-slate-700 text-slate-200 border border-slate-600';
      case 'Bronze':
        return 'bg-amber-950 text-amber-200 border border-amber-800';
      default:
        return 'bg-slate-800 text-slate-300 border border-slate-700';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900 text-slate-100 border-b border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Mobile toggle & Brand Title */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              {systemBranding.logoType === 'image' && systemBranding.logoUrl ? (
                <img
                  src={systemBranding.logoUrl}
                  alt={systemBranding.companyName}
                  className="w-9 h-9 rounded-lg object-contain bg-slate-800 p-0.5 border border-slate-700 shadow-md"
                />
              ) : (
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-base shadow-md tracking-wider">
                  {systemBranding.shortCode || 'OMC'}
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-bold text-base tracking-tight text-white leading-tight">
                  {language === 'th' ? systemBranding.portalTitleTh : systemBranding.portalTitle}
                </span>
                <span className="text-[11px] text-slate-400 font-mono leading-none">
                  {systemBranding.domainName}
                </span>
              </div>
            </div>
          </div>

          {/* Zone 2: Member Quick Stat Overview (Desktop) */}
          <div className="hidden md:flex items-center gap-4 text-xs">
            {/* Autoship indicator */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700/60 text-slate-300">
              <span className={`w-2 h-2 rounded-full ${currentMember.autoshipStatus === 'active' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span>
                {language === 'th' ? 'สถานะรักษายอด: ' : 'Autoship: '}
                <strong className={currentMember.autoshipStatus === 'active' ? 'text-emerald-400' : 'text-amber-400'}>
                  {currentMember.autoshipStatus === 'active' ? (language === 'th' ? 'ปกติ' : 'Active') : (language === 'th' ? 'ใกล้หมด' : 'Expiring')}
                </strong>
              </span>
              <span className="text-slate-500 font-mono">({currentMember.autoshipExpireDate})</span>
            </div>

            {/* PV Badge */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700/60">
              <span className="text-slate-400">{language === 'th' ? 'PV ส่วนตัว' : 'Personal PV'}:</span>
              <span className="font-mono font-semibold text-blue-300 tabular-nums">
                {currentMember.personalPv.toLocaleString()} PV
              </span>
            </div>

            {/* E-Wallet Quick Button */}
            <button
              onClick={onOpenWalletModal}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 hover:bg-emerald-900/60 transition-colors cursor-pointer"
              title={language === 'th' ? 'คลิกเพื่อจัดการ E-Wallet' : 'Manage E-Wallet'}
            >
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-300">{language === 'th' ? 'กระเป๋าเงิน' : 'Wallet'}:</span>
              <span className="font-mono font-bold text-white tabular-nums">
                ฿{currentMember.walletBalance.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
              </span>
            </button>
          </div>

          {/* Zone 3: Language, Notifications, Cart, Profile Switcher */}
          <div className="flex items-center gap-2">
            
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-800 rounded-md p-0.5 border border-slate-700">
              <button
                type="button"
                onClick={() => setLanguage('th')}
                className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                  language === 'th' 
                    ? 'bg-blue-600 text-white font-semibold' 
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
                    ? 'bg-blue-600 text-white font-semibold' 
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
                    ? 'bg-blue-600 text-white font-semibold' 
                    : 'text-slate-400 hover:text-white'
                }`}
                title="English (EN)"
              >
                EN
              </button>
            </div>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title={language === 'th' ? 'ตะกร้าสินค้า' : 'Cart'}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cart.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center font-mono">
                  {cart.reduce((sum, i) => sum + i.quantity, 0)}
                </span>
              )}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title={language === 'th' ? 'การแจ้งเตือน' : 'Notifications'}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white text-slate-900 rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden text-xs">
                  <div className="px-4 py-2.5 bg-slate-100 font-semibold text-slate-800 border-b border-slate-200 flex items-center justify-between">
                    <span>{language === 'th' ? 'ข่าวสารและประกาศ' : 'Announcements'}</span>
                    <span className="text-[11px] text-blue-600 font-normal">3 รายการ</span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                    {announcements.map(ann => (
                      <div key={ann.id} className="p-3 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                          <span className="font-semibold text-blue-700">
                            {ann.category.toUpperCase()}
                          </span>
                          <span className="font-mono">{ann.date}</span>
                        </div>
                        <h4 className="font-medium text-slate-900 leading-snug">
                          {language === 'th' ? ann.titleTh : ann.title}
                        </h4>
                        <p className="text-slate-600 text-[11px] mt-1 line-clamp-2">
                          {language === 'th' ? ann.summaryTh : ann.summary}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Member Persona Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMemberDropdown(!showMemberDropdown)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors text-left"
              >
                <img
                  src={currentMember.avatarUrl}
                  alt={currentMember.fullName}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover border border-slate-600"
                />
                <div className="hidden sm:block text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-white leading-tight">
                      {currentMember.memberCode}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${getRankBadgeClass(currentMember.rank)}`}>
                      {currentMember.rank}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate max-w-[110px] leading-tight">
                    {currentMember.fullName.split(' ')[0]}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showMemberDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-white text-slate-900 rounded-lg shadow-xl border border-slate-200 z-50 p-2 text-xs">
                  <div className="p-2 border-b border-slate-100 mb-1">
                    <p className="text-slate-500 text-[11px]">{language === 'th' ? 'สมาชิกปัจจุบัน' : 'Current Account'}</p>
                    <p className="font-semibold text-slate-900">{currentMember.fullName}</p>
                    <p className="text-slate-600 font-mono text-[11px]">{currentMember.memberCode} · {currentMember.rank}</p>
                  </div>
                  
                  <div className="py-1">
                    <p className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      {language === 'th' ? 'สลับบัญชีทดสอบบทบาท' : 'Switch Test Account'}
                    </p>
                    {ALTERNATIVE_MEMBERS.map(m => (
                      <button
                        key={m.id}
                        onClick={() => {
                          switchMember(m.id);
                          setShowMemberDropdown(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded hover:bg-slate-50 text-left transition-colors ${
                          m.id === currentMember.id ? 'bg-blue-50 text-blue-900 font-semibold' : 'text-slate-700'
                        }`}
                      >
                        <div className="truncate">
                          <span className="font-mono text-slate-500 text-[11px] mr-1">{m.memberCode}</span>
                          <span>{m.fullName.split(' ')[0]}</span>
                        </div>
                        <span className="text-[11px] font-medium text-slate-500">{m.rank}</span>
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 pt-1 mt-1 space-y-0.5">
                    <button
                      onClick={() => {
                        setActiveTab('profile_kyc');
                        setShowMemberDropdown(false);
                      }}
                      className="w-full text-left p-2 rounded hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>{language === 'th' ? 'จัดการข้อมูลส่วนตัว & KYC' : 'Profile & KYC'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowMemberDropdown(false);
                        switchRole('admin');
                      }}
                      className="w-full text-left p-2 rounded hover:bg-purple-50 text-purple-700 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                      <span className="font-semibold">{language === 'th' ? 'แผงควบคุมผู้ดูแล (Admin Console)' : 'Switch to Admin Console'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowMemberDropdown(false);
                        logout();
                      }}
                      className="w-full text-left p-2 rounded hover:bg-red-50 text-red-600 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-600" />
                      <span className="font-semibold">{language === 'th' ? 'ออกจากระบบ (Log Out)' : 'Log Out'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Admin Shortcut Button */}
            <button
              onClick={() => switchRole('admin')}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-950/80 hover:bg-purple-900 border border-purple-700/60 text-purple-200 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
              title={language === 'th' ? 'สลับเข้าสู่โหมดผู้ดูแลระบบ Admin Console' : 'Switch to Admin Console'}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Admin</span>
            </button>

            {/* Quick Logout Header Icon Button */}
            <button
              onClick={logout}
              className="hidden sm:flex p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
              title={language === 'th' ? 'ออกจากระบบ' : 'Log Out'}
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { 
  LayoutDashboard, 
  GitFork, 
  Network, 
  Users, 
  ShoppingBag, 
  Receipt, 
  DollarSign, 
  Wallet, 
  FileText, 
  UserPlus, 
  UserCheck, 
  HelpCircle,
  X,
  Share2,
  LogOut
} from 'lucide-react';
import { useMlm, ActiveTab } from '../context/MlmContext';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const { language, activeTab, setActiveTab, currentMember, logout, systemBranding } = useMlm();

  const navGroups: {
    titleTh: string;
    titleEn: string;
    titleLo: string;
    items: {
      id: ActiveTab;
      labelTh: string;
      labelEn: string;
      labelLo: string;
      icon: React.ElementType;
      badge?: string;
    }[];
  }[] = [
    {
      titleTh: 'ระบบงานหลัก',
      titleEn: 'Main Console',
      titleLo: 'ລະບົບງານຫຼັກ',
      items: [
        {
          id: 'dashboard',
          labelTh: 'ภาพรวมธุรกิจ (Dashboard)',
          labelEn: 'Dashboard Overview',
          labelLo: 'ພາບລວມທຸລະກິດ (Dashboard)',
          icon: LayoutDashboard
        }
      ]
    },
    {
      titleTh: 'โครงสร้างสายงาน & องค์กร',
      titleEn: 'Network & Genealogy',
      titleLo: 'ໂຄງສ້າງສາຍງານ & ອົງກອນ',
      items: [
        {
          id: 'genealogy_binary',
          labelTh: 'ผังไบนารี่ 2 สายงาน',
          labelEn: 'Binary Tree (2 Legs)',
          labelLo: 'ຜັງໄບນາຣີ່ 2 ສາຍງານ',
          icon: GitFork
        },
        {
          id: 'genealogy_unilevel',
          labelTh: 'ผังสายเลือดผู้แนะนำ',
          labelEn: 'Unilevel Sponsor Tree',
          labelLo: 'ຜັງສາຍເລືອດຜູ້ແນະນຳ',
          icon: Network
        },
        {
          id: 'genealogy_list',
          labelTh: 'รายชื่อสมาชิกในสายงาน',
          labelEn: 'Downline Directory',
          labelLo: 'ລາຍຊື່ສະມາຊິກໃນສາຍງານ',
          icon: Users
        }
      ]
    },
    {
      titleTh: 'การสั่งซื้อ & รักษายอด',
      titleEn: 'Store & Autoship',
      titleLo: 'ການສັ່ງຊື້ & ຮັກສາຍອດ',
      items: [
        {
          id: 'shop_catalog',
          labelTh: 'สั่งซื้อสินค้า & รักษายอด',
          labelEn: 'Online Store & Autoship',
          labelLo: 'ສັ່ງຊື້ສິນຄ້າ & ຮັກສາຍອດ',
          icon: ShoppingBag
        },
        {
          id: 'shop_orders',
          labelTh: 'ประวัติคำสั่งซื้อสินค้า',
          labelEn: 'Order History',
          labelLo: 'ປະຫວັດຄຳສັ່ງຊື້ສິນຄ້າ',
          icon: Receipt
        }
      ]
    },
    {
      titleTh: 'คอมมิชชั่น & การเงิน',
      titleEn: 'Commission & Finance',
      titleLo: 'ຄອມມິດຊັ່ນ & ການເງິນ',
      items: [
        {
          id: 'commissions_statements',
          labelTh: 'ใบแจ้งยอดรอบโบนัส',
          labelEn: 'Commission Statements',
          labelLo: 'ໃບແຈ້ງຍອດຮອບໂບນັດ',
          icon: DollarSign
        },
        {
          id: 'commissions_wallet',
          labelTh: 'กระเป๋าเงิน E-Wallet & โอน',
          labelEn: 'E-Wallet & Transfers',
          labelLo: 'ກະເປົາເງິນ E-Wallet & ໂອນ',
          icon: Wallet
        },
        {
          id: 'commissions_ledger',
          labelTh: 'รายการเดินบัญชีการเงิน',
          labelEn: 'Financial Ledger',
          labelLo: 'ລາຍການເຄື່ອນໄຫວບັນຊີການເງິນ',
          icon: FileText
        }
      ]
    },
    {
      titleTh: 'ขยายธุรกิจ & สมาชิก',
      titleEn: 'Expansion & Account',
      titleLo: 'ຂະຫຍາຍທຸລະກິດ & ສະມາຊິກ',
      items: [
        {
          id: 'registration',
          labelTh: 'สมัครสมาชิกใหม่ในสายงาน',
          labelEn: 'Enroll New Member',
          labelLo: 'ສະໝັກສະມາຊິກໃໝ່ໃນສາຍງານ',
          icon: UserPlus,
          badge: 'HOT'
        },
        {
          id: 'profile_kyc',
          labelTh: 'ข้อมูลสมาชิก & ยืนยัน KYC',
          labelEn: 'Profile & KYC Verification',
          labelLo: 'ຂໍ້ມູນສະມາຊິກ & ຢືນຢັນ KYC',
          icon: UserCheck
        }
      ]
    }
  ];

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
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

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-10 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header Close */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 lg:hidden">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-base">
              {language === 'th' ? systemBranding.portalTitleTh : systemBranding.portalTitle}
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

        {/* Member Profile Compact Box in Sidebar */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <img
              src={currentMember.avatarUrl}
              alt={currentMember.fullName}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/50"
            />
            <div className="min-w-0 flex-1">
              <h3 className="text-xs font-semibold text-white truncate">
                {currentMember.fullName}
              </h3>
              <p className="text-[11px] font-mono text-blue-400 truncate">
                ID: {currentMember.memberCode}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-900/80 text-blue-200 border border-blue-700/60 font-medium">
                  {currentMember.rank}
                </span>
                <span className="text-[10px] text-slate-400">
                  PV: {currentMember.personalPv.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <h4 className="px-3 text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                {language === 'lo' ? group.titleLo : (language === 'th' ? group.titleTh : group.titleEn)}
              </h4>
              <div className="mt-1 space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${
                        isActive
                          ? 'bg-blue-600 text-white font-semibold shadow-sm'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span className="truncate">
                          {language === 'lo' ? item.labelLo : (language === 'th' ? item.labelTh : item.labelEn)}
                        </span>
                      </div>
                      {item.badge && (
                        <span className="ml-2 px-1.5 py-0.2 text-[10px] font-bold rounded bg-amber-500 text-slate-950">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sponsor Footer info */}
        <div className="p-3 bg-slate-950/60 border-t border-slate-800 text-[11px] text-slate-400">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span>{language === 'lo' ? 'ຜູ້ແນະນຳ:' : (language === 'th' ? 'ผู้แนะนำ:' : 'Sponsor:')}</span>
            <span className="font-mono text-slate-300 truncate max-w-[120px]">{currentMember.sponsorCode}</span>
          </div>
          <p className="truncate text-slate-300">{currentMember.sponsorName}</p>

          <button
            onClick={() => {
              onCloseMobile();
              logout();
            }}
            className="mt-2.5 w-full py-1.5 px-3 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-300 hover:text-white transition-colors flex items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span>{language === 'th' ? 'ออกจากระบบ (Log Out)' : 'Log Out'}</span>
          </button>

          <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
            <span>{systemBranding.shortCode || 'OMC'} MLM v4.2 Demo</span>
            <span className="text-emerald-400 font-medium">Online</span>
          </div>
        </div>
      </aside>
    </>
  );
};

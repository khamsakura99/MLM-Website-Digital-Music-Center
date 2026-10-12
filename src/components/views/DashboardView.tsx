import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Wallet, 
  Sparkles, 
  Award, 
  Copy, 
  Check, 
  QrCode, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  Clock, 
  ShoppingBag, 
  UserPlus, 
  GitFork, 
  DollarSign, 
  ChevronRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { useMlm } from '../../context/MlmContext';

interface DashboardViewProps {
  onOpenWalletModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenWalletModal }) => {
  const { 
    language, 
    currentMember, 
    setActiveTab, 
    announcements, 
    transactions,
    showToast 
  } = useMlm();

  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const currentOrigin = typeof window !== 'undefined' && window.location.origin 
    ? window.location.origin 
    : 'https://ais-dev-xveygu4jsq7ezoqxez4dsw-895647000118.asia-southeast1.run.app';
  const sponsorUrl = `${currentOrigin}/?ref=${currentMember.memberCode}&leg=${currentMember.position}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(sponsorUrl);
    setCopiedLink(true);
    showToast(
      language === 'th' ? 'คัดลอกลิงก์ผู้แนะนำแล้ว!' : 'Sponsor referral link copied!',
      'success'
    );
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Binary pairing math
  const leftPv = currentMember.leftLegPv;
  const rightPv = currentMember.rightLegPv;
  const weakLegPv = Math.min(leftPv, rightPv);
  const strongLegPv = Math.max(leftPv, rightPv);
  const isLeftWeak = leftPv < rightPv;
  // Pairing bonus in Thailand MLM is typically 20% - 30% of weak leg PV depending on rank
  const pairingRate = currentMember.rank === 'Diamond' ? 0.30 : currentMember.rank === 'Platinum' ? 0.25 : 0.20;
  const estimatedPairingBonus = Math.floor(weakLegPv * pairingRate);

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner & Rank Badge */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-xl p-6 text-white border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-blue-500/10 to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={currentMember.avatarUrl}
              alt={currentMember.fullName}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full object-cover ring-4 ring-blue-500/30 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xl font-bold tracking-tight">
                  {currentMember.fullName}
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-blue-600 to-indigo-600 border border-blue-400 text-white shadow-sm">
                  {currentMember.rank} Rank
                </span>
                <span className="font-mono text-xs text-blue-300 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                  ID: {currentMember.memberCode}
                </span>
              </div>
              
              <div className="mt-1 flex items-center gap-4 text-xs text-slate-300">
                <span>
                  {language === 'th' ? 'ผู้แนะนำ:' : 'Sponsor:'} <strong className="text-white">{currentMember.sponsorName}</strong> ({currentMember.sponsorCode})
                </span>
                <span>·</span>
                <span>
                  {language === 'th' ? 'วันที่สมัคร:' : 'Joined:'} <span className="font-mono">{currentMember.joinDate}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('registration')}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{language === 'th' ? 'ลงทะเบียนสมาชิก' : 'Enroll Downline'}</span>
            </button>
            <button
              onClick={() => setActiveTab('shop_catalog')}
              className="px-3.5 py-2 text-xs font-medium rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-blue-400" />
              <span>{language === 'th' ? 'สั่งซื้อสินค้า' : 'Shop'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Autoship Banner if Warning */}
      {currentMember.autoshipStatus === 'warning' && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 flex items-center justify-between text-amber-900 text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              {language === 'th'
                ? `สถานะรักษายอดจะหมดอายุในวันที่ ${currentMember.autoshipExpireDate} กรุณารักษายอดเพื่อรักษาสิทธิ์รับโบนัสจับคู่`
                : `Autoship status expires on ${currentMember.autoshipExpireDate}. Maintain your PV to keep earning pairing bonuses.`}
            </span>
          </div>
          <button
            onClick={() => setActiveTab('shop_catalog')}
            className="px-3 py-1 bg-amber-600 text-white rounded font-medium hover:bg-amber-700 whitespace-nowrap"
          >
            {language === 'th' ? 'รักษายอดด่วน' : 'Renew Now'}
          </button>
        </div>
      )}

      {/* 4 Primary Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Personal PV */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">{language === 'th' ? 'PV ส่วนตัวเดือนนี้' : 'Personal PV (Month)'}</span>
            <Sparkles className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {currentMember.personalPv.toLocaleString()} <span className="text-sm font-normal text-slate-500">PV</span>
            </div>
            <div className="mt-1 text-xs text-slate-500 flex items-center justify-between">
              <span>{language === 'th' ? 'PV สะสมทั้งหมด:' : 'Lifetime PV:'}</span>
              <span className="font-mono font-medium text-slate-700 tabular-nums">{currentMember.accumulatedPv.toLocaleString()} PV</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
            <Check className="w-3.5 h-3.5" />
            <span>{language === 'th' ? 'ผ่านเกณฑ์รักษายอด' : 'Autoship Qualified'}</span>
          </div>
        </div>

        {/* Metric 2: Left Leg PV */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">{language === 'th' ? 'PV ทีมซ้าย (L)' : 'Left Team PV (L)'}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${!isLeftWeak ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'}`}>
              {!isLeftWeak ? (language === 'th' ? 'ขาแข็ง' : 'Strong') : (language === 'th' ? 'ขาอ่อน' : 'Weak')}
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {leftPv.toLocaleString()} <span className="text-sm font-normal text-slate-500">PV</span>
            </div>
            <div className="mt-1 text-xs text-slate-500 flex items-center justify-between">
              <span>{language === 'th' ? 'จำนวนสมาชิกในสาย:' : 'Members:'}</span>
              <span className="font-mono font-medium text-slate-700 tabular-nums">{currentMember.leftLegMembers} {language === 'th' ? 'คน' : 'people'}</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>{language === 'th' ? 'คะแนนใหม่รอบนี้' : 'Cycle Volume'}</span>
            <span className="font-mono font-medium text-indigo-600">+18,400 PV</span>
          </div>
        </div>

        {/* Metric 3: Right Leg PV */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">{language === 'th' ? 'PV ทีมขวา (R)' : 'Right Team PV (R)'}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${isLeftWeak ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'}`}>
              {isLeftWeak ? (language === 'th' ? 'ขาแข็ง' : 'Strong') : (language === 'th' ? 'ขาอ่อน' : 'Weak')}
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {rightPv.toLocaleString()} <span className="text-sm font-normal text-slate-500">PV</span>
            </div>
            <div className="mt-1 text-xs text-slate-500 flex items-center justify-between">
              <span>{language === 'th' ? 'จำนวนสมาชิกในสาย:' : 'Members:'}</span>
              <span className="font-mono font-medium text-slate-700 tabular-nums">{currentMember.rightLegMembers} {language === 'th' ? 'คน' : 'people'}</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>{language === 'th' ? 'คะแนนใหม่รอบนี้' : 'Cycle Volume'}</span>
            <span className="font-mono font-medium text-indigo-600">+12,500 PV</span>
          </div>
        </div>

        {/* Metric 4: E-Wallet Balance */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">{language === 'th' ? 'ยอดเงิน E-Wallet' : 'E-Wallet Balance'}</span>
            <Wallet className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-emerald-600 tabular-nums">
              ฿{currentMember.walletBalance.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
            </div>
            <div className="mt-1 text-xs text-slate-500 flex items-center justify-between">
              <span>{language === 'th' ? 'รายได้สะสมรวม:' : 'Total Earned:'}</span>
              <span className="font-mono font-medium text-slate-700 tabular-nums">฿{currentMember.totalEarnings.toLocaleString()}</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              onClick={onOpenWalletModal}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              <span>{language === 'th' ? 'โอนเงิน / ถอนเงิน' : 'Transfer / Withdraw'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Binary Leg Balance Bar & Pairing Calculation */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <GitFork className="w-4 h-4 text-blue-600" />
              <span>{language === 'th' ? 'การคำนวณสมดุลคะแนนไบนารี่ (Pairing Balance)' : 'Binary Leg Pairing Balance'}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'th' 
                ? 'คำนวณโบนัสจับคู่จากคะแนนขาอ่อน (Weak Leg) สูงสุด 30% ตามตำแหน่งธุรกิจ' 
                : 'Team pairing bonus computed against weak leg volume at up to 30% based on your rank'}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-500">{language === 'th' ? 'ประมาณการโบนัสจับคู่รอบนี้:' : 'Est. Pairing Bonus:'}</span>
            <div className="text-lg font-bold font-mono text-blue-700 tabular-nums">
              ฿{estimatedPairingBonus.toLocaleString()} <span className="text-xs font-normal text-slate-500">({(pairingRate * 100)}%)</span>
            </div>
          </div>
        </div>

        {/* Progress ratio bar */}
        <div className="space-y-1.5">
          <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
            <div 
              style={{ width: `${(leftPv / (leftPv + rightPv)) * 100}%` }}
              className="bg-blue-600 h-full flex items-center justify-center text-[9px] text-white font-mono font-bold"
            >
              L {Math.round((leftPv / (leftPv + rightPv)) * 100)}%
            </div>
            <div 
              style={{ width: `${(rightPv / (leftPv + rightPv)) * 100}%` }}
              className="bg-indigo-500 h-full flex items-center justify-center text-[9px] text-white font-mono font-bold"
            >
              R {Math.round((rightPv / (leftPv + rightPv)) * 100)}%
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-slate-500">
            <div>
              <span className="text-blue-600 font-semibold">{language === 'th' ? 'ทีมซ้าย:' : 'Left Team:'}</span> {leftPv.toLocaleString()} PV
            </div>
            <div>
              <span className="text-indigo-600 font-semibold">{language === 'th' ? 'ทีมขวา:' : 'Right Team:'}</span> {rightPv.toLocaleString()} PV
            </div>
          </div>
        </div>
      </div>

      {/* Sponsor Referral Link & Quick Expand Tools */}
      <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold flex items-center gap-2 text-white">
              <Share2Icon className="w-4 h-4 text-blue-400" />
              <span>{language === 'th' ? 'ลิงก์และ QR Code ขยายสายงาน (Sponsor Referral Link)' : 'Sponsor Referral Link & QR Code'}</span>
            </h3>
            <p className="text-xs text-slate-300">
              {language === 'th' 
                ? 'ส่งลิงก์นี้ให้ผู้มุ่งหวังเพื่อสมัครสมาชิก ระบบจะใส่รหัสผู้แนะนำของคุณโดยอัตโนมัติ' 
                : 'Send this recruitment link to prospects; your sponsor code is pre-populated automatically'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQrModal(true)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <QrCode className="w-4 h-4 text-blue-400" />
              <span>{language === 'th' ? 'ดู QR Code' : 'Show QR'}</span>
            </button>
            <button
              onClick={handleCopyLink}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                copiedLink 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-blue-600 text-white hover:bg-blue-500'
              }`}
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? (language === 'th' ? 'คัดลอกสำเร็จ!' : 'Copied!') : (language === 'th' ? 'คัดลอกลิงก์' : 'Copy Link')}</span>
            </button>
          </div>
        </div>

        <div className="mt-3 p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300 break-all select-all">
          <span className="truncate">{sponsorUrl}</span>
        </div>
      </div>

      {/* Grid: Company News & Recent Financial Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* News & Announcements (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">
              {language === 'th' ? 'ข่าวสารและประกาศจากบริษัท' : 'Company Announcements & Promotions'}
            </h3>
            <span className="text-xs text-blue-600 font-medium">OMC News</span>
          </div>

          <div className="mt-4 space-y-4">
            {announcements.map((item) => (
              <div 
                key={item.id} 
                className="p-4 rounded-lg bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-blue-100 text-blue-800">
                      {item.category}
                    </span>
                    {item.isImportant && (
                      <span className="text-red-600 font-semibold text-[10px]">
                        ★ {language === 'th' ? 'โปรโมชั่นเด่น' : 'Featured'}
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-xs text-slate-400">{item.date}</span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {language === 'th' ? item.titleTh : item.title}
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {language === 'th' ? item.summaryTh : item.summary}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Ledger Transactions (1 Col) */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {language === 'th' ? 'รายการเงินล่าสุด' : 'Recent Wallet Transactions'}
              </h3>
              <button
                onClick={() => setActiveTab('commissions_ledger')}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                {language === 'th' ? 'ดูทั้งหมด' : 'View All'}
              </button>
            </div>

            <div className="mt-3 divide-y divide-slate-100">
              {transactions.slice(0, 4).map((tx) => (
                <div key={tx.id} className="py-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-800 truncate max-w-[160px]">
                      {tx.description}
                    </span>
                    <span className={`font-mono font-bold tabular-nums ${tx.amount > 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
                      {tx.amount > 0 ? `+฿${tx.amount.toLocaleString()}` : `-฿${Math.abs(tx.amount).toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mt-0.5">
                    <span>{tx.timestamp.substring(5, 16)}</span>
                    <span>{tx.refCode}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={onOpenWalletModal}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>{language === 'th' ? 'จัดการ E-Wallet' : 'Manage E-Wallet'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {language === 'th' ? 'QR Code ผู้แนะนำสมัครสมาชิก' : 'Enrollment Referral QR Code'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'th' ? `ผู้แนะนำ: ${currentMember.fullName} (${currentMember.memberCode})` : `Sponsor: ${currentMember.fullName} (${currentMember.memberCode})`}
            </p>

            {/* Simulating QR Image container */}
            <div className="my-5 p-4 bg-slate-50 border border-slate-200 rounded-xl inline-block shadow-inner">
              <div className="w-48 h-48 bg-white border border-slate-300 rounded-lg p-2 flex flex-col items-center justify-center">
                {/* SVG QR Code pattern */}
                <svg className="w-40 h-40" viewBox="0 0 100 100" fill="currentColor">
                  {/* Outer corner 1 */}
                  <rect x="5" y="5" width="25" height="25" fill="#1e293b" />
                  <rect x="9" y="9" width="17" height="17" fill="#ffffff" />
                  <rect x="13" y="13" width="9" height="9" fill="#1e293b" />

                  {/* Outer corner 2 */}
                  <rect x="70" y="5" width="25" height="25" fill="#1e293b" />
                  <rect x="74" y="9" width="17" height="17" fill="#ffffff" />
                  <rect x="78" y="13" width="9" height="9" fill="#1e293b" />

                  {/* Outer corner 3 */}
                  <rect x="5" y="70" width="25" height="25" fill="#1e293b" />
                  <rect x="9" y="74" width="17" height="17" fill="#ffffff" />
                  <rect x="13" y="78" width="9" height="9" fill="#1e293b" />

                  {/* QR Data Matrix dots */}
                  <rect x="36" y="10" width="6" height="6" fill="#1e293b" />
                  <rect x="46" y="14" width="6" height="6" fill="#1e293b" />
                  <rect x="56" y="10" width="6" height="6" fill="#1e293b" />
                  <rect x="36" y="24" width="6" height="6" fill="#1e293b" />
                  <rect x="46" y="28" width="6" height="6" fill="#1e293b" />

                  <rect x="10" y="38" width="6" height="6" fill="#1e293b" />
                  <rect x="20" y="42" width="6" height="6" fill="#1e293b" />
                  <rect x="34" y="42" width="6" height="6" fill="#2563eb" />
                  <rect x="44" y="46" width="12" height="12" fill="#2563eb" />
                  <rect x="62" y="38" width="6" height="6" fill="#1e293b" />
                  <rect x="74" y="42" width="6" height="6" fill="#1e293b" />
                  <rect x="84" y="38" width="6" height="6" fill="#1e293b" />

                  <rect x="36" y="66" width="6" height="6" fill="#1e293b" />
                  <rect x="46" y="72" width="6" height="6" fill="#1e293b" />
                  <rect x="56" y="66" width="6" height="6" fill="#1e293b" />
                  <rect x="68" y="74" width="6" height="6" fill="#1e293b" />
                  <rect x="78" y="80" width="6" height="6" fill="#1e293b" />
                  <rect x="88" y="70" width="6" height="6" fill="#1e293b" />
                </svg>
                <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">OMC-{currentMember.memberCode}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              {language === 'th' ? 'สแกนเพื่อเปิดฟอร์มสมัครสมาชิกพร้อมต่อสายงาน' : 'Scan with mobile camera to register immediately'}
            </p>

            <div className="mt-5 flex gap-2">
              <button
                onClick={handleCopyLink}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                {language === 'th' ? 'คัดลอกลิงก์' : 'Copy Link'}
              </button>
              <button
                onClick={() => setShowQrModal(false)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
              >
                {language === 'th' ? 'ปิดหน้าต่าง' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const Share2Icon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
);

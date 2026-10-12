import React, { useState } from 'react';
import { 
  Wallet, 
  Send, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  ShieldCheck, 
  Check, 
  AlertCircle,
  Building2,
  Lock,
  QrCode,
  RefreshCw,
  Copy
} from 'lucide-react';
import { useMlm } from '../../context/MlmContext';

export const WalletManagementView: React.FC = () => {
  const { 
    language, 
    currentMember, 
    binaryNodes, 
    transferWallet, 
    withdrawWallet, 
    transactions,
    companyBankSettings,
    companyBankAccounts,
    systemBranding,
    setActiveTab,
    showToast 
  } = useMlm();

  // Tab: 'transfer' | 'withdraw' | 'deposit'
  const [subTab, setSubTab] = useState<'transfer' | 'withdraw' | 'deposit'>('transfer');

  // Transfer Form State
  const [targetCode, setTargetCode] = useState('');
  const [verifiedName, setVerifiedName] = useState<string | null>(null);
  const [transferAmount, setTransferAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [transferPin, setTransferPin] = useState('123456');

  // Withdraw Form State
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawPin, setWithdrawPin] = useState('123456');

  // Deposit Form State
  const [depositAmount, setDepositAmount] = useState('5000');
  const [showDepositQr, setShowDepositQr] = useState(false);
  const [selectedDepositBankIndex, setSelectedDepositBankIndex] = useState(0);

  const activeDepositBank = (companyBankAccounts && companyBankAccounts[selectedDepositBankIndex]) || companyBankSettings;

  const handleVerifyTarget = () => {
    if (!targetCode.trim()) return;
    const code = targetCode.trim().toUpperCase();
    const node = Object.values(binaryNodes).find(n => n.memberCode.toUpperCase() === code);
    if (node) {
      setVerifiedName(node.name);
      showToast(language === 'th' ? `พบสมาชิก: ${node.name}` : `Found: ${node.name}`, 'info');
    } else {
      setVerifiedName(null);
      showToast(language === 'th' ? 'ไม่พบรหัสสมาชิกนี้ในระบบ' : 'Member not found', 'error');
    }
  };

  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(transferAmount);
    if (isNaN(amt) || amt <= 0) {
      showToast(language === 'th' ? 'กรุณาระบุจำนวนเงินที่ต้องการโอน' : 'Invalid amount', 'error');
      return;
    }

    const res = transferWallet(targetCode, amt, memo, transferPin);
    if (res.success) {
      setTargetCode('');
      setVerifiedName(null);
      setTransferAmount('');
      setMemo('');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleExecuteWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0) {
      showToast(language === 'th' ? 'กรุณาระบุจำนวนเงิน' : 'Invalid amount', 'error');
      return;
    }

    const res = withdrawWallet(amt, withdrawPin);
    if (res.success) {
      setWithdrawAmount('');
    } else {
      showToast(res.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Wallet Balance Hero Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-xl p-6 text-white border border-slate-700 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold uppercase tracking-wider">
            <Wallet className="w-4 h-4" />
            <span>{language === 'th' ? 'กระเป๋าเงินอิเล็กทรอนิกส์ E-Wallet' : 'Electronic Wallet Balance'}</span>
          </div>
          <div className="text-3xl font-bold font-mono text-white tabular-nums">
            ฿{currentMember.walletBalance.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-slate-400">
            {language === 'th' ? 'ใช้สำหรับสั่งซื้อสินค้า, โอนให้สมาชิกในสายงาน หรือถอนเข้าบัญชีธนาคาร' : 'Use for store orders, member-to-member transfers, or bank withdrawals'}
          </p>
        </div>

        {/* Bank Account Snapshot */}
        <div className="bg-white/10 backdrop-blur-xs p-4 rounded-xl border border-white/10 text-xs space-y-1 min-w-[240px]">
          <div className="flex items-center justify-between text-slate-400">
            <span>{language === 'th' ? 'บัญชีธนาคารผูกรับเงิน' : 'Linked Bank Account'}</span>
            <span className="text-emerald-400 font-semibold">{language === 'th' ? 'ยืนยันแล้ว' : 'Verified'}</span>
          </div>
          <p className="font-bold text-white text-sm">{currentMember.bankAccount.bankName}</p>
          <p className="font-mono text-slate-300">{currentMember.bankAccount.accountNumber}</p>
          <p className="text-[11px] text-slate-400">{currentMember.bankAccount.accountName}</p>
        </div>
      </div>

      {/* Operation Tabs Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Sub-tabs header */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => setSubTab('transfer')}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${
              subTab === 'transfer' 
                ? 'border-blue-600 text-blue-700 bg-white' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>{language === 'th' ? 'โอนเงินให้สมาชิก (Transfer)' : 'Transfer to Member'}</span>
          </button>

          <button
            onClick={() => setSubTab('withdraw')}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${
              subTab === 'withdraw' 
                ? 'border-emerald-600 text-emerald-700 bg-white' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ArrowDownCircle className="w-4 h-4" />
            <span>{language === 'th' ? 'ถอนเงินเข้าธนาคาร (Withdraw)' : 'Withdraw to Bank'}</span>
          </button>

          <button
            onClick={() => setSubTab('deposit')}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${
              subTab === 'deposit' 
                ? 'border-indigo-600 text-indigo-700 bg-white' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ArrowUpCircle className="w-4 h-4" />
            <span>{language === 'th' ? 'เติมเงิน E-Wallet (Deposit)' : 'Top-up E-Wallet'}</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          
          {/* TAB 1: TRANSFER TO MEMBER */}
          {subTab === 'transfer' && (
            <form onSubmit={handleExecuteTransfer} className="max-w-xl mx-auto space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {language === 'th' ? 'รหัสสมาชิกผู้รับเงิน (Recipient Member ID):' : 'Recipient Member Code:'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="เช่น TH889502"
                    value={targetCode}
                    onChange={(e) => {
                      setTargetCode(e.target.value);
                      setVerifiedName(null);
                    }}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono text-sm uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleVerifyTarget}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
                  >
                    {language === 'th' ? 'ตรวจสอบชื่อ' : 'Verify'}
                  </button>
                </div>

                {verifiedName && (
                  <div className="mt-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{language === 'th' ? 'ชื่อผู้รับ:' : 'Recipient:'} <strong>{verifiedName}</strong></span>
                  </div>
                )}
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {language === 'th' ? 'จำนวนเงินที่ต้องการโอน (บาท):' : 'Transfer Amount (THB):'}
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  min="1"
                  max={currentMember.walletBalance}
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono text-lg font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  {language === 'th' ? `ยอดคงเหลือโอนได้สูงสุด ฿${currentMember.walletBalance.toLocaleString()}` : `Max transferable balance ฿${currentMember.walletBalance.toLocaleString()}`}
                </span>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {language === 'th' ? 'บันทึกช่วยจำ (Memo):' : 'Memo (Optional):'}
                </label>
                <input
                  type="text"
                  placeholder={language === 'th' ? 'เช่น คืนค่าสินค้า, ช่วยปิดยอด' : 'e.g. Order assistance'}
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1 flex items-center justify-between">
                  <span>{language === 'th' ? 'รหัส PIN ธุรกรรม (6 หลัก):' : 'Transaction PIN (6 digits):'}</span>
                  <span className="text-slate-400 text-[10px] font-mono">Demo PIN: 123456</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    maxLength={6}
                    value={transferPin}
                    onChange={(e) => setTransferPin(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-sm tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
              >
                {language === 'th' ? 'ยืนยันการโอนเงินทันที' : 'Confirm Transfer Now'}
              </button>
            </form>
          )}

          {/* TAB 2: WITHDRAW TO BANK */}
          {subTab === 'withdraw' && (
            <form onSubmit={handleExecuteWithdraw} className="max-w-xl mx-auto space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                  <span className="font-semibold text-slate-700 block text-xs">
                    {language === 'th' ? 'ข้อมูลบัญชีธนาคารรับเงิน (Verified Bank):' : 'Destination Bank Account:'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('profile_kyc')}
                    className="text-blue-600 hover:text-blue-800 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>{language === 'th' ? '+ แก้ไข/เปลี่ยนบัญชีธนาคาร' : '+ Change / Add Bank'}</span>
                  </button>
                </div>
                <div className="text-slate-900 font-bold text-sm">
                  {currentMember.bankAccount.bankName}
                </div>
                <div className="font-mono text-slate-700">
                  {language === 'th' ? 'เลขที่บัญชี:' : 'Account:'} {currentMember.bankAccount.accountNumber}
                </div>
                <div className="text-slate-500 text-[11px]">
                  {language === 'th' ? 'ชื่อบัญชี:' : 'Name:'} {currentMember.bankAccount.accountName}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {language === 'th' ? 'จำนวนเงินที่ต้องการถอน (บาท):' : 'Withdrawal Amount (THB):'}
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  min="300"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono text-lg font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{language === 'th' ? `ถอนขั้นต่ำ ${companyBankSettings.minWithdrawAmount.toLocaleString()} บาท` : `Min ${companyBankSettings.minWithdrawAmount.toLocaleString()} THB`}</span>
                  <span>{language === 'th' ? `ค่าธรรมเนียมโอนธนาคาร: ${companyBankSettings.transferFee} บาท` : `Bank fee: ${companyBankSettings.transferFee} THB`}</span>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1 flex items-center justify-between">
                  <span>{language === 'th' ? 'รหัส PIN ธุรกรรม (6 หลัก):' : 'Transaction PIN (6 digits):'}</span>
                  <span className="text-slate-400 text-[10px] font-mono">Demo PIN: 123456</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    maxLength={6}
                    value={withdrawPin}
                    onChange={(e) => setWithdrawPin(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-sm tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
              >
                {language === 'th' ? 'ส่งคำขอถอนเงินเข้าบัญชีธนาคาร' : 'Submit Bank Withdrawal Request'}
              </button>
            </form>
          )}

          {/* TAB 3: DEPOSIT VIA QR */}
          {subTab === 'deposit' && (
            <div className="max-w-md mx-auto space-y-4 text-xs">
              
              {/* Deposit Amount Input */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {language === 'th' ? 'ระบุจำนวนเงินที่ต้องการเติมเข้ากระเป๋า (บาท):' : 'Top-up Amount (THB):'}
                </label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-center text-slate-900 font-mono text-xl font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Bank Selector if Multiple Accounts Exist */}
              {companyBankAccounts && companyBankAccounts.length > 1 && (
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    {language === 'th' ? 'เลือกบัญชีธนาคารบริษัทที่ต้องการโอนเข้า:' : 'Select Company Receiving Bank:'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {companyBankAccounts.map((b, idx) => {
                      const isLao = b.bankCode === 'BCEL' || b.bankCode === 'LDB' || b.bankCode === 'JDB' || b.bankCode === 'VIETIN';
                      return (
                        <button
                          key={b.id || b.accountNumber || idx}
                          type="button"
                          onClick={() => setSelectedDepositBankIndex(idx)}
                          className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                            selectedDepositBankIndex === idx
                              ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs'
                              : 'bg-white border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="font-bold text-xs text-slate-900 flex items-center justify-center gap-1">
                            <span>{isLao ? '🇱🇦' : '🇹🇭'}</span>
                            <span>{b.bankCode}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">{b.bankName.split('(')[0]}</div>
                          {b.isPrimary && (
                            <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">★ บัญชีหลัก</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Company Bank Account Details Card */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-left">
                <div className="flex items-center justify-between text-slate-500 text-[11px] pb-1 border-b border-slate-200">
                  <span className="font-semibold text-slate-700">
                    {language === 'th' ? 'บัญชีธนาคารบริษัทสำหรับเติมเงิน:' : 'Company Official Bank Account:'}
                  </span>
                  <span className="font-mono text-emerald-700 font-bold">{activeDepositBank.bankCode}</span>
                </div>

                <div className="font-bold text-slate-900 text-sm">
                  {activeDepositBank.bankName}
                </div>

                <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 block">{language === 'th' ? 'เลขที่บัญชี / พร้อมเพย์:' : 'Account / PromptPay:'}</span>
                    <span className="font-mono text-base font-bold text-slate-900">{activeDepositBank.accountNumber}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(activeDepositBank.accountNumber.replace(/-/g, ''));
                      showToast(language === 'th' ? 'คัดลอกเลขที่บัญชีแล้ว' : 'Copied account number', 'info');
                    }}
                    className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 transition-colors"
                    title="คัดลอกเลขบัญชี"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-[11px] text-slate-600 space-y-0.5 pt-1">
                  <div><strong className="text-slate-700">{language === 'th' ? 'ชื่อบัญชี:' : 'Account Name:'}</strong> {activeDepositBank.accountName}</div>
                  <div><strong className="text-slate-700">{language === 'th' ? 'สาขา:' : 'Branch:'}</strong> {activeDepositBank.branch || 'สำนักงานใหญ่'}</div>
                  <div><strong className="text-slate-700">{language === 'th' ? 'PromptPay ID:' : 'PromptPay:'}</strong> <span className="font-mono">{activeDepositBank.promptPayId}</span> ({activeDepositBank.promptPayType === 'tax_id' ? (language === 'th' ? 'เลขนิติบุคคล 13 หลัก' : 'Corporate Tax ID') : (language === 'th' ? 'เบอร์โทรศัพท์' : 'Mobile Phone')})</div>
                </div>
              </div>

              {/* QR Code Presentation Box */}
              <div className="p-5 bg-gradient-to-b from-blue-900 to-indigo-950 text-white border border-blue-800 rounded-2xl shadow-md text-center space-y-3">
                
                {/* Official PromptPay Header Bar */}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[11px] font-semibold text-blue-200 border border-white/20">
                  <QrCode className="w-3.5 h-3.5 text-blue-400" />
                  <span>Thai QR Payment · PromptPay</span>
                </div>

                <div className="bg-white p-3 rounded-xl mx-auto w-48 h-48 flex items-center justify-center shadow-lg">
                  {activeDepositBank.qrCodeType === 'custom_image' && activeDepositBank.customQrImageUrl ? (
                    <img
                      src={activeDepositBank.customQrImageUrl}
                      alt="Company Custom Top up QR"
                      className="w-44 h-44 object-contain rounded"
                    />
                  ) : (
                    <div className="relative w-44 h-44 flex flex-col items-center justify-center">
                      {/* High-res Styled Promptpay SVG */}
                      <svg className="w-40 h-40" viewBox="0 0 100 100" fill="currentColor">
                        <rect x="5" y="5" width="26" height="26" fill="#0f172a" />
                        <rect x="9" y="9" width="18" height="18" fill="#ffffff" />
                        <rect x="13" y="13" width="10" height="10" fill="#0f172a" />

                        <rect x="69" y="5" width="26" height="26" fill="#0f172a" />
                        <rect x="73" y="9" width="18" height="18" fill="#ffffff" />
                        <rect x="77" y="13" width="10" height="10" fill="#0f172a" />

                        <rect x="5" y="69" width="26" height="26" fill="#0f172a" />
                        <rect x="9" y="73" width="18" height="18" fill="#ffffff" />
                        <rect x="13" y="77" width="10" height="10" fill="#0f172a" />

                        <rect x="36" y="10" width="8" height="8" fill="#1e40af" />
                        <rect x="50" y="20" width="8" height="8" fill="#1e40af" />
                        <rect x="42" y="38" width="16" height="16" fill="#1e40af" />
                        <rect x="68" y="44" width="8" height="8" fill="#0f172a" />
                        <rect x="40" y="68" width="12" height="12" fill="#0f172a" />
                        <rect x="65" y="68" width="8" height="8" fill="#1e40af" />
                        <rect x="80" y="68" width="8" height="8" fill="#0f172a" />
                        <rect x="68" y="80" width="8" height="8" fill="#0f172a" />
                        <rect x="80" y="80" width="8" height="8" fill="#1e40af" />
                      </svg>
                      {/* Center PromptPay badge */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="px-2 py-0.5 rounded bg-blue-900 text-white font-mono text-[9px] font-bold shadow-md border border-white">
                          THAI QR
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="font-mono text-lg font-bold text-emerald-400">
                    ฿{parseFloat(depositAmount || '0').toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[11px] text-blue-200 mt-0.5">
                    {activeDepositBank.accountName}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    PromptPay: {activeDepositBank.promptPayId} ({activeDepositBank.bankCode})
                  </div>
                </div>

              </div>

              {/* Simulation Completion Button */}
              <button
                type="button"
                onClick={() => {
                  const amt = parseFloat(depositAmount);
                  if (isNaN(amt) || amt <= 0) {
                    showToast(language === 'th' ? 'กรุณาระบุจำนวนเงินที่ถูกต้อง' : 'Invalid amount', 'error');
                    return;
                  }
                  showToast(
                    language === 'th' 
                      ? `ระบบจำลองการเติมเงิน ฿${amt.toLocaleString()} เข้า E-Wallet สำเร็จเรียบร้อยแล้ว!` 
                      : `Simulated deposit of ฿${amt.toLocaleString()} credited to E-Wallet`, 
                    'success'
                  );
                }}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>{language === 'th' ? 'จำลองการแจ้งโอนสำเร็จ (+เงินเข้ากระเป๋า)' : 'Simulate Deposit Completion'}</span>
              </button>

            </div>
          )}

        </div>
      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { 
  UserCheck, 
  ShieldCheck, 
  CreditCard, 
  Lock, 
  Check, 
  Building2, 
  Upload, 
  FileCheck, 
  Calendar, 
  Sparkles, 
  Award,
  Plus,
  Edit2,
  Trash2,
  X,
  Copy,
  AlertCircle
} from 'lucide-react';
import { useMlm } from '../../context/MlmContext';
import { BankAccount } from '../../types/mlm';
import { SUPPORTED_BANKS, THAI_BANKS_ONLY, LAO_BANKS, THAI_BANKS } from '../../data/mockMlmData';

export const ProfileKycView: React.FC = () => {
  const { 
    language, 
    currentMember, 
    updateMemberBankAccount, 
    addMemberBankAccount, 
    setPrimaryBankAccount, 
    showToast 
  } = useMlm();

  // PIN Change State
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  // Add / Edit Bank Account Modal State
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedBankCode, setSelectedBankCode] = useState('KBANK');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState(currentMember.fullName);
  const [branch, setBranch] = useState('สำนักงานใหญ่');
  const [bookBankImage, setBookBankImage] = useState<string>('');
  const [securityPin, setSecurityPin] = useState('123456');

  const registeredAccounts: BankAccount[] = currentMember.bankAccounts && currentMember.bankAccounts.length > 0 
    ? currentMember.bankAccounts 
    : [{ ...currentMember.bankAccount, isPrimary: true }];

  const handleOpenAddBank = () => {
    setModalMode('add');
    setSelectedBankCode('KBANK');
    setAccountNumber('');
    setAccountName(currentMember.fullName);
    setBranch('สาขา รัชโยธิน');
    setBookBankImage('');
    setSecurityPin('123456');
    setIsBankModalOpen(true);
  };

  const handleOpenEditBank = (bank: BankAccount) => {
    setModalMode('edit');
    setSelectedBankCode(bank.bankCode || 'KBANK');
    setAccountNumber(bank.accountNumber);
    setAccountName(bank.accountName);
    setBranch(bank.branch);
    setBookBankImage(bank.bookBankImageUrl || '');
    setSecurityPin('123456');
    setIsBankModalOpen(true);
  };

  const handleSaveBankAccount = (e: React.FormEvent) => {
    e.preventDefault();

    if (!accountNumber.trim()) {
      showToast(language === 'th' ? 'กรุณากรอกเลขที่บัญชีธนาคาร' : 'Please enter account number', 'error');
      return;
    }

    if (!accountName.trim()) {
      showToast(language === 'th' ? 'กรุณากรอกชื่อบัญชีธนาคาร' : 'Please enter account name', 'error');
      return;
    }

    const bankObj = THAI_BANKS.find(b => b.code === selectedBankCode) || THAI_BANKS[0];

    const bankData: BankAccount = {
      bankName: bankObj.name,
      bankCode: bankObj.code,
      accountNumber: accountNumber.trim(),
      accountName: accountName.trim(),
      branch: branch.trim() || 'สำนักงานใหญ่',
      isVerified: true,
      isPrimary: true,
      bookBankImageUrl: bookBankImage
    };

    if (modalMode === 'add') {
      addMemberBankAccount(bankData);
    } else {
      updateMemberBankAccount(bankData);
    }

    setIsBankModalOpen(false);
  };

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length !== 6 || isNaN(Number(newPin))) {
      showToast(language === 'th' ? 'PIN ต้องเป็นตัวเลข 6 หลัก' : 'PIN must be 6 digits', 'error');
      return;
    }
    if (newPin !== confirmPin) {
      showToast(language === 'th' ? 'รหัส PIN ใหม่ไม่ตรงกัน' : 'PINs do not match', 'error');
      return;
    }
    showToast(language === 'th' ? 'เปลี่ยนรหัส PIN ธุรกรรมสำเร็จแล้ว' : 'Transaction PIN updated', 'success');
    setOldPin('');
    setNewPin('');
    setConfirmPin('');
  };

  const getBankColor = (code: string) => {
    const found = THAI_BANKS.find(b => b.code === code);
    return found ? found.color : 'bg-slate-700';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Title */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-600" />
            <span>{language === 'th' ? 'ข้อมูลสมาชิก & บัญชีธนาคารรับเงิน (Profile & Bank Accounts)' : 'Member Profile & Bank Accounts'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'th' 
              ? 'จัดการข้อมูลส่วนตัว บัญชีธนาคารสำหรับรับโอนเงินคอมมิชชั่น และเอกสารยืนยันตัวตน KYC' 
              : 'Manage verified identification, custom bank accounts for commission payouts, and security PIN.'}
          </p>
        </div>

        {/* Action Button to Add Customer Bank */}
        <button
          type="button"
          onClick={handleOpenAddBank}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'th' ? '+ เพิ่มบัญชีธนาคารของคุณ' : '+ Add My Bank Account'}</span>
        </button>
      </div>

      {/* Member ID Digital Business Card */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white border border-slate-800 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-radial from-blue-600/10 to-transparent pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={currentMember.avatarUrl}
              alt={currentMember.fullName}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full object-cover ring-4 ring-blue-500/40"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">{currentMember.fullName}</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-600 text-white uppercase">
                  {currentMember.rank}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                MEMBER ID: <span className="text-blue-400 font-bold">{currentMember.memberCode}</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {language === 'th' ? 'สังกัดสายงาน:' : 'Direct Team:'} {currentMember.sponsorName} ({currentMember.sponsorCode})
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/10 text-xs space-y-1 sm:text-right">
            <span className="text-slate-400 block text-[10px]">{language === 'th' ? 'สถานะเอกสาร KYC' : 'KYC Verification Status'}</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded font-semibold text-xs border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              {language === 'th' ? 'อนุมัติแล้ว (Verified)' : 'Approved & Verified'}
            </span>
            <span className="text-[10px] text-slate-400 block font-mono">
              {language === 'th' ? 'ยืนยันเมื่อ:' : 'Verified on:'} {currentMember.joinDate}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Personal Details & Customer Bank Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Personal Profile */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3 text-xs">
          <h3 className="font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2 text-sm">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span>{language === 'th' ? 'ข้อมูลส่วนตัวสมาชิก (Personal Details)' : 'Personal Profile Information'}</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-slate-400 block text-[11px]">{language === 'th' ? 'ชื่อ-นามสกุล:' : 'Full Name:'}</span>
              <span className="font-semibold text-slate-800">{currentMember.fullName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">{language === 'th' ? 'ชื่อเล่น:' : 'Nickname:'}</span>
              <span className="font-semibold text-slate-800">{currentMember.nickname || '-'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">{language === 'th' ? 'เบอร์โทรศัพท์:' : 'Phone:'}</span>
              <span className="font-mono text-slate-800">{currentMember.phone}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">{language === 'th' ? 'อีเมล:' : 'Email:'}</span>
              <span className="font-mono text-slate-800 truncate block">{currentMember.email}</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400 block text-[11px]">{language === 'th' ? 'เลขบัตรประชาชน:' : 'National ID:'}</span>
              <span className="font-mono font-semibold text-slate-800">{currentMember.idCardNumber}</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400 block text-[11px]">{language === 'th' ? 'ที่อยู่ตามทะเบียนบ้าน / จัดส่ง:' : 'Address:'}</span>
              <span className="text-slate-800 leading-snug block">{currentMember.address} {currentMember.province} {currentMember.postcode}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Customer / Member Bank Accounts List */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>{language === 'th' ? 'บัญชีธนาคารของคุณสำหรับรับเงิน' : 'My Payout Bank Accounts'}</span>
            </h3>

            <button
              type="button"
              onClick={handleOpenAddBank}
              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md font-semibold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'th' ? 'เพิ่มบัญชี' : 'Add Bank'}</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-500">
            {language === 'th' 
              ? 'ระบบจะโอนเงินคอมมิชชั่นและการถอนเงิน E-Wallet เข้าบัญชีที่ตั้งเป็น "บัญชีหลัก" โดยอัตโนมัติ' 
              : 'Commissions and withdrawals will be paid to your selected primary bank account.'}
          </p>

          {/* List of Registered Bank Accounts */}
          <div className="space-y-2.5">
            {registeredAccounts.map((bank, idx) => {
              const isPrimary = bank.accountNumber === currentMember.bankAccount.accountNumber || (idx === 0 && !bank.isPrimary);
              const bInfo = SUPPORTED_BANKS.find(b => b.code === bank.bankCode);
              const flag = bInfo?.flag || (bank.bankCode === 'BCEL' || bank.bankCode === 'LDB' || bank.bankCode === 'JDB' || bank.bankCode === 'VIETIN' ? '🇱🇦' : '🇹🇭');
              
              return (
                <div 
                  key={bank.accountNumber || idx} 
                  className={`p-3.5 rounded-xl border transition-all ${
                    isPrimary 
                      ? 'bg-blue-50/40 border-blue-300 shadow-xs' 
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-md ${getBankColor(bank.bankCode)} text-white font-bold text-[10px] flex items-center justify-center shrink-0`}>
                        {bank.bankCode.slice(0, 3)}
                      </div>
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <span className="text-sm shrink-0">{flag}</span>
                        <span className="truncate">{bank.bankName}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isPrimary ? (
                        <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold shrink-0">
                          {language === 'th' ? '★ บัญชีหลัก' : '★ Primary'}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setPrimaryBankAccount(bank.accountNumber)}
                          className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold px-2 py-0.5 rounded hover:bg-blue-100 transition-colors cursor-pointer shrink-0"
                        >
                          {language === 'th' ? 'ตั้งเป็นบัญชีหลัก' : 'Set Primary'}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleOpenEditBank(bank)}
                        className="p-1 rounded text-slate-400 hover:text-slate-600 transition-colors shrink-0"
                        title="แก้ไขบัญชีนี้"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-slate-800 text-sm">{bank.accountNumber}</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(bank.accountNumber.replace(/-/g, ''));
                        showToast(language === 'th' ? 'คัดลอกเลขบัญชีแล้ว' : 'Copied', 'info');
                      }}
                      className="text-slate-400 hover:text-slate-600 p-0.5"
                      title="คัดลอกเลขบัญชี"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="text-slate-600 text-[11px] mt-1 flex items-center justify-between">
                    <span><strong>{language === 'th' ? 'ชื่อบัญชี:' : 'Name:'}</strong> {bank.accountName}</span>
                    <span className="text-slate-400 font-normal">{bank.branch}</span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                    <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{language === 'th' ? 'สถานะ: ยืนยัน KYC เรียบร้อย' : 'Status: KYC Verified'}</span>
                    </span>
                    <span className="text-slate-400">สำหรับรับโอนเงิน</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* KYC Upload Info Box */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="font-semibold text-slate-700 block text-[11px]">
              {language === 'th' ? 'เอกสาร KYC ที่แนบในระบบ:' : 'Uploaded KYC Documents:'}
            </span>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
              <span className="flex items-center gap-2 text-slate-700 font-medium">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>สำเนาบัตรประชาชน (ID Card Copy)</span>
              </span>
              <span className="text-emerald-600 font-semibold text-[11px]">✓ อนุมัติแล้ว</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
              <span className="flex items-center gap-2 text-slate-700 font-medium">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>สำเนาหน้าสมุดบัญชีธนาคาร (Book Bank Copy)</span>
              </span>
              <span className="text-emerald-600 font-semibold text-[11px]">✓ อนุมัติแล้ว</span>
            </div>
          </div>
        </div>

      </div>

      {/* Security: Change Transaction PIN Form */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2 text-sm">
          <Lock className="w-4 h-4 text-blue-600" />
          <span>{language === 'th' ? 'ความปลอดภัย & รหัสผ่านทำธุรกรรม (Transaction PIN)' : 'Security & Transaction PIN'}</span>
        </h3>

        <form onSubmit={handleUpdatePin} className="max-w-md space-y-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              {language === 'th' ? 'รหัส PIN เดิม (Current PIN):' : 'Current PIN:'}
            </label>
            <input
              type="password"
              maxLength={6}
              placeholder="123456"
              value={oldPin}
              onChange={(e) => setOldPin(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              {language === 'th' ? 'รหัส PIN ใหม่ (6 หลัก):' : 'New 6-digit PIN:'}
            </label>
            <input
              type="password"
              maxLength={6}
              placeholder="ตัวเลข 6 หลัก"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              {language === 'th' ? 'ยืนยันรหัส PIN ใหม่อีกครั้ง:' : 'Confirm New PIN:'}
            </label>
            <input
              type="password"
              maxLength={6}
              placeholder="ยืนยันตัวเลข 6 หลัก"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition-colors shadow-2xs cursor-pointer"
          >
            {language === 'th' ? 'บันทึกการเปลี่ยน PIN' : 'Save PIN Changes'}
          </button>
        </form>
      </div>

      {/* --- MODAL: ADD / EDIT CUSTOMER BANK ACCOUNT --- */}
      {isBankModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 text-slate-900 shadow-2xl border border-slate-200 space-y-4 my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {modalMode === 'add'
                      ? (language === 'th' ? 'เพิ่มบัญชีธนาคารของคุณ (Add My Bank)' : 'Add My Bank Account')
                      : (language === 'th' ? 'แก้ไขบัญชีธนาคาร (Edit Bank Account)' : 'Edit Bank Account')}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {language === 'th' ? 'สำหรับรับเงินคอมมิชชั่นและการถอนเงินเข้าบัญชี' : 'For commission payouts and wallet withdrawals'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsBankModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick 1-Click Bank Buttons Bar */}
            <div className="space-y-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-700 flex items-center gap-1">
                  <span>⚡</span>
                  <span>{language === 'th' ? 'เลือกธนาคารด่วน:' : 'Quick Select Bank:'}</span>
                </span>
                <span className="text-[10px] text-slate-400">🇱🇦 ลาว / 🇹🇭 ไทย</span>
              </div>

              {/* Lao Banks */}
              <div>
                <span className="text-[10px] font-bold text-red-700 flex items-center gap-1 mb-1">
                  <span>🇱🇦</span> {language === 'th' ? 'ธนาคาร สปป.ลาว (Lao Banks):' : 'Lao Banks:'}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {LAO_BANKS.map(b => (
                    <button
                      key={b.code}
                      type="button"
                      onClick={() => setSelectedBankCode(b.code)}
                      className={`p-1.5 rounded-lg border text-left transition-all cursor-pointer flex items-center gap-1.5 ${
                        selectedBankCode === b.code
                          ? 'border-red-500 bg-red-50 ring-2 ring-red-500/20 shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-5 h-5 shrink-0 rounded ${b.color} text-white font-bold text-[8px] flex items-center justify-center`}>
                        {b.code.slice(0, 3)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-[10px] text-slate-900 truncate">{b.code}</div>
                        <div className="text-[8px] text-slate-500 truncate">{b.shortName}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Thai Banks */}
              <div>
                <span className="text-[10px] font-bold text-blue-700 flex items-center gap-1 mb-1">
                  <span>🇹🇭</span> {language === 'th' ? 'ธนาคารไทย (Thai Banks):' : 'Thai Banks:'}
                </span>
                <div className="grid grid-cols-5 gap-1">
                  {THAI_BANKS_ONLY.map(b => (
                    <button
                      key={b.code}
                      type="button"
                      onClick={() => setSelectedBankCode(b.code)}
                      className={`p-1 rounded border text-center transition-all cursor-pointer ${
                        selectedBankCode === b.code
                          ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500/20 shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-4 h-4 mx-auto rounded ${b.color} text-white font-bold text-[8px] flex items-center justify-center mb-0.5`}>
                        {b.code.slice(0, 3)}
                      </div>
                      <div className="font-bold text-[9px] text-slate-800 truncate">{b.code}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveBankAccount} className="space-y-4 text-xs">
              
              {/* Select Bank */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  {language === 'th' ? 'เลือกธนาคาร (Select Bank):' : 'Select Bank:'}
                </label>
                <select
                  value={selectedBankCode}
                  onChange={(e) => setSelectedBankCode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <optgroup label="🇱🇦 ธนาคารแห่ง สปป.ลาว (Lao Banks)">
                    {LAO_BANKS.map(bank => (
                      <option key={bank.code} value={bank.code}>
                        🇱🇦 {bank.name} ({bank.code})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="🇹🇭 ธนาคารไทย (Thailand Banks)">
                    {THAI_BANKS_ONLY.map(bank => (
                      <option key={bank.code} value={bank.code}>
                        🇹🇭 {bank.name} ({bank.code})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Account Number */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  {language === 'th' ? 'เลขที่บัญชีธนาคาร (Account Number):' : 'Bank Account Number:'}
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="เช่น 045-8-91234-5 หรือ 10 หลัก"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  {language === 'th' ? 'กรอกตัวเลขบัญชี 10 หลัก เช่น 045-8-91234-5' : '10-12 digit bank account number'}
                </span>
              </div>

              {/* Account Holder Name */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  {language === 'th' ? 'ชื่อเจ้าของบัญชี (Account Holder Name):' : 'Account Holder Name:'}
                </label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="เช่น นาย กิตติศักดิ์ เจริญสุขสวัสดิ์"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <span className="text-[10px] text-amber-700 mt-0.5 block font-medium">
                  ⚠️ {language === 'th' ? 'ชื่อบัญชีต้องตรงกับชื่อสมาชิกที่ลงทะเบียนไว้' : 'Account name must match registered member name'}
                </span>
              </div>

              {/* Branch */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {language === 'th' ? 'สาขาธนาคาร (Branch):' : 'Bank Branch:'}
                </label>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  placeholder="เช่น สาขา สยามพารากอน หรือ สาขา เมืองทองธานี"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Passbook / Book Bank Image Simulation */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {language === 'th' ? 'แนบภาพหน้าสมุดบัญชี (Upload Book Bank Photo):' : 'Book Bank Photo (Optional):'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={bookBankImage}
                    onChange={(e) => setBookBankImage(e.target.value)}
                    placeholder="https://example.com/bookbank.jpg หรือเว้นว่างไว้"
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-[11px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setBookBankImage('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=300&auto=format&fit=crop&q=80');
                      showToast(language === 'th' ? 'จำลองการแนบไฟล์สมุดบัญชีแล้ว' : 'Sample passbook attached', 'info');
                    }}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer"
                  >
                    {language === 'th' ? 'แนบรูปตัวอย่าง' : 'Sample Photo'}
                  </button>
                </div>
              </div>

              {/* Security Transaction PIN */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1.5">
                <label className="font-bold text-amber-900 block flex items-center justify-between">
                  <span>{language === 'th' ? 'ยืนยันด้วยรหัส PIN ธุรกรรม (6 หลัก):' : 'Confirm with Transaction PIN (6 digits):'}</span>
                  <span className="font-mono text-[10px] text-amber-700">Demo PIN: 123456</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-amber-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    maxLength={6}
                    value={securityPin}
                    onChange={(e) => setSecurityPin(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-amber-300 rounded-lg font-mono text-sm tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBankModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
                >
                  {language === 'th' ? 'ยกเลิก' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{language === 'th' ? 'บันทึกบัญชีธนาคาร' : 'Save Bank Account'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

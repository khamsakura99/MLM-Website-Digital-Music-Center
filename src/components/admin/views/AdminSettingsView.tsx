import React, { useState } from 'react';
import { 
  Sliders, 
  Save, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  Image as ImageIcon, 
  Type, 
  RotateCcw, 
  Code, 
  Globe,
  Building2,
  Palette,
  QrCode,
  CreditCard,
  Wallet,
  ArrowRightLeft,
  Copy,
  ExternalLink,
  Plus,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  User,
  Shield,
  CheckCircle2,
  HelpCircle,
  Key
} from 'lucide-react';
import { useMlm } from '../../../context/MlmContext';
import { SystemBranding, CompanyBankSettings } from '../../../types/mlm';
import { THAI_BANKS, THAI_BANKS_ONLY, LAO_BANKS, SUPPORTED_BANKS } from '../../../data/mockMlmData';

export const AdminSettingsView: React.FC = () => {
  const { 
    language, 
    compensationSettings, 
    updateCompensationSettings,
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
    showToast,
    adminCredentials,
    updateAdminCredentials,
    resetAdminCredentials
  } = useMlm();

  const [activeSubTab, setActiveSubTab] = useState<'branding' | 'bank_qr' | 'compensation' | 'code_guide' | 'security'>('security');

  // --- ADMIN SECURITY & PASSWORD FORM STATE ---
  const [adminUsername, setAdminUsername] = useState(adminCredentials?.username || 'admin');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // --- BRANDING FORM STATE ---
  const [companyName, setCompanyName] = useState(systemBranding.companyName);
  const [companyNameTh, setCompanyNameTh] = useState(systemBranding.companyNameTh);
  const [portalTitle, setPortalTitle] = useState(systemBranding.portalTitle);
  const [portalTitleTh, setPortalTitleTh] = useState(systemBranding.portalTitleTh);
  const [shortCode, setShortCode] = useState(systemBranding.shortCode);
  const [domainName, setDomainName] = useState(systemBranding.domainName);
  const [logoType, setLogoType] = useState<'text' | 'image'>(systemBranding.logoType);
  const [logoUrl, setLogoUrl] = useState(systemBranding.logoUrl || '');
  const [themeColor, setThemeColor] = useState<SystemBranding['themeColor']>(systemBranding.themeColor || 'blue');

  // --- BANK & QR TOP-UP FORM STATE ---
  const [bankName, setBankName] = useState(companyBankSettings.bankName);
  const [bankCode, setBankCode] = useState(companyBankSettings.bankCode);
  const [accountNumber, setAccountNumber] = useState(companyBankSettings.accountNumber);
  const [accountName, setAccountName] = useState(companyBankSettings.accountName);
  const [branch, setBranch] = useState(companyBankSettings.branch);
  const [promptPayId, setPromptPayId] = useState(companyBankSettings.promptPayId);
  const [promptPayType, setPromptPayType] = useState(companyBankSettings.promptPayType);
  const [qrCodeType, setQrCodeType] = useState(companyBankSettings.qrCodeType);
  const [customQrImageUrl, setCustomQrImageUrl] = useState(companyBankSettings.customQrImageUrl || '');
  const [minTransferAmount, setMinTransferAmount] = useState(companyBankSettings.minTransferAmount.toString());
  const [minWithdrawAmount, setMinWithdrawAmount] = useState(companyBankSettings.minWithdrawAmount.toString());
  const [transferFeeVal, setTransferFeeVal] = useState(companyBankSettings.transferFee.toString());

  // --- ADD / EDIT COMPANY BANK MODAL STATE ---
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingBankId, setEditingBankId] = useState<string | null>(null);
  const [modalBankCode, setModalBankCode] = useState('KBANK');
  const [modalBankName, setModalBankName] = useState('ธนาคารกสิกรไทย (Kasikornbank)');
  const [modalAccountNumber, setModalAccountNumber] = useState('');
  const [modalAccountName, setModalAccountName] = useState(companyName ? `บริษัท ${companyName} จำกัด` : 'บริษัท โอเอ็มซี ซิสเต็มส์ จำกัด');
  const [modalBranch, setModalBranch] = useState('สำนักงานใหญ่');
  const [modalPromptPayId, setModalPromptPayId] = useState('0105562018899');
  const [modalPromptPayType, setModalPromptPayType] = useState<'tax_id' | 'phone'>('tax_id');
  const [modalQrCodeType, setModalQrCodeType] = useState<'generated' | 'custom_image'>('generated');
  const [modalCustomQrImageUrl, setModalCustomQrImageUrl] = useState('');
  const [modalIsPrimary, setModalIsPrimary] = useState(false);

  const handleOpenAddBankModal = () => {
    setModalMode('add');
    setEditingBankId(null);
    setModalBankCode('KBANK');
    setModalBankName('ธนาคารกสิกรไทย (Kasikornbank)');
    setModalAccountNumber('');
    setModalAccountName(companyName ? `บริษัท ${companyName} จำกัด` : 'บริษัท โอเอ็มซี ซิสเต็มส์ จำกัด');
    setModalBranch('สำนักงานใหญ่');
    setModalPromptPayId(promptPayId || '0105562018899');
    setModalPromptPayType('tax_id');
    setModalQrCodeType('generated');
    setModalCustomQrImageUrl('');
    setModalIsPrimary(companyBankAccounts.length === 0);
    setIsBankModalOpen(true);
  };

  const handleOpenEditBankModal = (bank: CompanyBankSettings) => {
    setModalMode('edit');
    setEditingBankId(bank.id || bank.accountNumber);
    setModalBankCode(bank.bankCode);
    setModalBankName(bank.bankName);
    setModalAccountNumber(bank.accountNumber);
    setModalAccountName(bank.accountName);
    setModalBranch(bank.branch);
    setModalPromptPayId(bank.promptPayId);
    setModalPromptPayType(bank.promptPayType);
    setModalQrCodeType(bank.qrCodeType);
    setModalCustomQrImageUrl(bank.customQrImageUrl || '');
    setModalIsPrimary(bank.isPrimary ?? false);
    setIsBankModalOpen(true);
  };

  const handleSelectBankCodeInModal = (code: string) => {
    setModalBankCode(code);
    const found = THAI_BANKS.find(b => b.code === code);
    if (found) {
      setModalBankName(found.name);
    }
  };

  const handleSaveBankModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalAccountNumber.trim()) {
      showToast(language === 'th' ? 'กรุณากรอกเลขที่บัญชีธนาคาร' : 'Please enter bank account number', 'error');
      return;
    }

    const bankData: Omit<CompanyBankSettings, 'id'> = {
      bankName: modalBankName,
      bankCode: modalBankCode,
      accountNumber: modalAccountNumber.trim(),
      accountName: modalAccountName.trim() || 'บริษัท โอเอ็มซี ซิสเต็มส์ จำกัด',
      branch: modalBranch.trim() || 'สำนักงานใหญ่',
      promptPayId: modalPromptPayId.trim(),
      promptPayType: modalPromptPayType,
      qrCodeType: modalQrCodeType,
      customQrImageUrl: modalCustomQrImageUrl.trim(),
      minTransferAmount: parseFloat(minTransferAmount) || 100,
      minWithdrawAmount: parseFloat(minWithdrawAmount) || 300,
      transferFee: parseFloat(transferFeeVal) || 30,
      isPrimary: modalIsPrimary,
      isActive: true
    };

    if (modalMode === 'add') {
      addCompanyBankAccount(bankData);
    } else if (editingBankId) {
      updateCompanyBankAccount(editingBankId, bankData);
    }

    if (modalIsPrimary) {
      setBankName(bankData.bankName);
      setBankCode(bankData.bankCode);
      setAccountNumber(bankData.accountNumber);
      setAccountName(bankData.accountName);
      setBranch(bankData.branch);
      setPromptPayId(bankData.promptPayId);
      setPromptPayType(bankData.promptPayType);
      setQrCodeType(bankData.qrCodeType);
      setCustomQrImageUrl(bankData.customQrImageUrl || '');
    }

    setIsBankModalOpen(false);
  };

  const handleSelectBankForPreview = (bank: CompanyBankSettings) => {
    setBankName(bank.bankName);
    setBankCode(bank.bankCode);
    setAccountNumber(bank.accountNumber);
    setAccountName(bank.accountName);
    setBranch(bank.branch);
    setPromptPayId(bank.promptPayId);
    setPromptPayType(bank.promptPayType);
    setQrCodeType(bank.qrCodeType);
    setCustomQrImageUrl(bank.customQrImageUrl || '');
    showToast(
      language === 'th' ? `เลือก ${bank.bankName} แสดงในตัวอย่างแล้ว` : `Loaded ${bank.bankName} into preview`,
      'info'
    );
  };

  // --- COMPENSATION FORM STATE ---
  const [fastStart, setFastStart] = useState(compensationSettings.fastStartRate.toString());
  const [pairingRate, setPairingRate] = useState(compensationSettings.binaryPairingRate.toString());
  const [capDiamond, setCapDiamond] = useState(compensationSettings.maxDailyCapDiamond.toString());
  const [capGold, setCapGold] = useState(compensationSettings.maxDailyCapGold.toString());
  const [autoshipPv, setAutoshipPv] = useState(compensationSettings.autoshipMinPv.toString());
  const [taxRate, setTaxRate] = useState(compensationSettings.withholdingTaxRate.toString());
  const [transferFee, setTransferFee] = useState(compensationSettings.bankTransferFee.toString());

  // Handle Save Branding
  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    updateSystemBranding({
      companyName: companyName.trim() || 'OMC MLM System',
      companyNameTh: companyNameTh.trim() || companyName.trim(),
      portalTitle: portalTitle.trim() || `${companyName} Portal`,
      portalTitleTh: portalTitleTh.trim() || `ระบบสมาชิก ${companyNameTh}`,
      shortCode: (shortCode.trim() || 'OMC').toUpperCase(),
      domainName: domainName.trim() || 'demomlm.omc.co.th',
      logoType,
      logoUrl: logoUrl.trim(),
      themeColor
    });
  };

  // Handle Save Bank & QR
  const handleSaveBankSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanyBankSettings({
      bankName: bankName.trim(),
      bankCode: bankCode.trim().toUpperCase(),
      accountNumber: accountNumber.trim(),
      accountName: accountName.trim(),
      branch: branch.trim(),
      promptPayId: promptPayId.trim(),
      promptPayType,
      qrCodeType,
      customQrImageUrl: customQrImageUrl.trim(),
      minTransferAmount: parseFloat(minTransferAmount) || 100,
      minWithdrawAmount: parseFloat(minWithdrawAmount) || 300,
      transferFee: parseFloat(transferFeeVal) || 30
    });
  };

  // Apply Bank Preset
  const applyBankPreset = (preset: {
    bankName: string;
    bankCode: string;
    accountNumber: string;
    accountName: string;
    branch: string;
    promptPayId: string;
    promptPayType: 'tax_id' | 'phone';
    qrCodeType: 'generated' | 'custom_image';
    customQrImageUrl?: string;
  }) => {
    setBankName(preset.bankName);
    setBankCode(preset.bankCode);
    setAccountNumber(preset.accountNumber);
    setAccountName(preset.accountName);
    setBranch(preset.branch);
    setPromptPayId(preset.promptPayId);
    setPromptPayType(preset.promptPayType);
    setQrCodeType(preset.qrCodeType);
    setCustomQrImageUrl(preset.customQrImageUrl || '');

    updateCompanyBankSettings({
      ...preset,
      minTransferAmount: parseFloat(minTransferAmount) || 100,
      minWithdrawAmount: parseFloat(minWithdrawAmount) || 300,
      transferFee: parseFloat(transferFeeVal) || 30
    });
  };

  // Handle Quick Presets
  const applyPreset = (preset: {
    companyName: string;
    companyNameTh: string;
    portalTitle: string;
    portalTitleTh: string;
    shortCode: string;
    domainName: string;
    logoType: 'text' | 'image';
    logoUrl?: string;
    themeColor: SystemBranding['themeColor'];
  }) => {
    setCompanyName(preset.companyName);
    setCompanyNameTh(preset.companyNameTh);
    setPortalTitle(preset.portalTitle);
    setPortalTitleTh(preset.portalTitleTh);
    setShortCode(preset.shortCode);
    setDomainName(preset.domainName);
    setLogoType(preset.logoType);
    setLogoUrl(preset.logoUrl || '');
    setThemeColor(preset.themeColor);

    updateSystemBranding(preset);
  };

  // Handle Save Compensation
  const handleSaveCompensation = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompensationSettings({
      fastStartRate: parseFloat(fastStart) || 150,
      binaryPairingRate: parseFloat(pairingRate) || 30,
      maxDailyCapDiamond: parseFloat(capDiamond) || 80000,
      maxDailyCapGold: parseFloat(capGold) || 40000,
      autoshipMinPv: parseInt(autoshipPv, 10) || 250,
      withholdingTaxRate: parseFloat(taxRate) || 3,
      bankTransferFee: parseFloat(transferFee) || 30
    });
  };

  // Handle Save Admin Password & Username
  const handleSaveAdminPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // Check current password if set
    if (currentPassword && currentPassword !== adminCredentials.password && currentPassword !== 'admin123') {
      setPasswordError(
        language === 'th' 
          ? 'รหัสผ่านปัจจุบันไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง' 
          : 'Current password is incorrect. Please try again.'
      );
      return;
    }

    if (!newPassword || newPassword.length < 4) {
      setPasswordError(
        language === 'th' 
          ? 'รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 4 ตัวอักษร' 
          : 'New password must be at least 4 characters.'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        language === 'th' 
          ? 'รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน' 
          : 'New password and confirmation password do not match.'
      );
      return;
    }

    const res = updateAdminCredentials(adminUsername, newPassword);
    if (res.success) {
      setPasswordSuccess(
        language === 'th'
          ? `เปลี่ยนรหัสผ่านและชื่อผู้ใช้สำหรับ "${adminUsername}" สำเร็จแล้ว สามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้ทันที`
          : `Admin password and username for "${adminUsername}" updated successfully. You can now login with this password.`
      );
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordError(res.message);
    }
  };

  const handleResetAdminPassword = () => {
    if (confirm(language === 'th' ? 'ต้องการรีเซ็ตรหัสผ่าน Admin กลับเป็นค่าเริ่มต้น (admin / admin123) หรือไม่?' : 'Reset Admin password back to default (admin / admin123)?')) {
      resetAdminCredentials();
      setAdminUsername('admin');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError('');
      setPasswordSuccess(
        language === 'th' 
          ? 'รีเซ็ตรหัสผ่านกลับเป็นค่าเริ่มต้น (admin / admin123) สำเร็จเรียบร้อย' 
          : 'Reset to default credentials (admin / admin123) successfully.'
      );
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Top Section Nav Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-1.5 flex flex-wrap items-center gap-1.5 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveSubTab('bank_qr')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'bank_qr'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>{language === 'th' ? '1. ธนาคาร & QR เติมเงิน' : '1. Bank & QR'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('branding')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'branding'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>{language === 'th' ? '2. ชื่อ & โลโก้เว็บ' : '2. Name & Logo'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('compensation')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'compensation'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>{language === 'th' ? '3. แผนรายได้' : '3. Compensation'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('security')}
          className={`flex-1 min-w-[150px] py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'security'
              ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-xs font-bold ring-2 ring-red-400/40'
              : 'text-rose-700 bg-rose-50/70 hover:bg-rose-100 hover:text-rose-900'
          }`}
        >
          <KeyRound className="w-4 h-4 text-rose-500" />
          <span>{language === 'th' ? '4. เปลี่ยนรหัสผ่าน Admin' : '4. Admin Password'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('code_guide')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'code_guide'
              ? 'bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>{language === 'th' ? '5. คู่มือโค้ด' : '5. Code Guide'}</span>
        </button>
      </div>

      {/* --- TAB 1: BANK & QR TOP-UP SETTINGS --- */}
      {activeSubTab === 'bank_qr' && (
        <div className="space-y-6">

          {/* Header Action Bar with "+ เพิ่มบัญชีธนาคารของคุณ (+ Add My Bank Account)" */}
          <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white border border-emerald-800/60 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/30">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <span>{language === 'th' ? 'บัญชีธนาคารรับเงินของบริษัท (Company Bank Accounts)' : 'Corporate Receiving Bank Accounts'}</span>
                  </h2>
                </div>
                <p className="text-xs text-slate-300">
                  {language === 'th'
                    ? 'ผู้ดูแลระบบสามารถเพิ่ม แก้ไข สลับบัญชีหลัก และจัดการบัญชีธนาคารหลายบัญชีสำหรับรับโอนเงินและ QR เติมเงิน'
                    : 'Manage corporate receiving bank accounts, set primary payout accounts, and configure QR codes'}
                </p>
              </div>

              {/* Exact user requested button */}
              <button
                type="button"
                onClick={handleOpenAddBankModal}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/20 cursor-pointer whitespace-nowrap active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>{language === 'th' ? '+ เพิ่มบัญชีธนาคารของคุณ (+ Add My Bank Account)' : '+ Add My Bank Account'}</span>
              </button>
            </div>
          </div>

          {/* Registered Company Bank Accounts Cards Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>{language === 'th' ? `บัญชีธนาคารที่เปิดใช้งานในระบบ (${companyBankAccounts.length} บัญชี)` : `Registered Bank Accounts (${companyBankAccounts.length})`}</span>
              </h3>
              <span className="text-[11px] text-slate-500">
                {language === 'th' ? 'คลิกที่การ์ดเพื่อสลับดูตัวอย่างหรือตั้งเป็นบัญชีหลัก' : 'Click card to view preview or set primary'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {companyBankAccounts.map((bank, idx) => {
                const bankInfo = SUPPORTED_BANKS.find(b => b.code === bank.bankCode) || THAI_BANKS.find(b => b.code === bank.bankCode) || {
                  code: bank.bankCode,
                  name: bank.bankName,
                  color: 'bg-slate-700',
                  flag: '🏦',
                  country: 'TH'
                };
                const isSelectedForPreview = bank.accountNumber === accountNumber;

                return (
                  <div
                    key={bank.id || bank.accountNumber || idx}
                    className={`p-4 rounded-xl border transition-all relative flex flex-col justify-between ${
                      bank.isPrimary
                        ? 'bg-gradient-to-br from-emerald-50/80 to-white border-emerald-400 shadow-sm ring-2 ring-emerald-500/20'
                        : isSelectedForPreview
                        ? 'bg-blue-50/60 border-blue-400 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    <div>
                      {/* Top Bar of Card */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg ${bankInfo.color} text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0`}>
                            {bank.bankCode.slice(0, 3)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-xs text-slate-900 leading-tight flex items-center gap-1.5">
                              <span className="text-sm shrink-0">{'flag' in bankInfo ? bankInfo.flag : (bank.bankCode === 'BCEL' || bank.bankCode === 'LDB' || bank.bankCode === 'JDB' || bank.bankCode === 'VIETIN' ? '🇱🇦' : '🇹🇭')}</span>
                              <span className="truncate">{bank.bankName}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 block truncate">
                              {bank.branch || 'สำนักงานใหญ่'}
                            </span>
                          </div>
                        </div>

                        {bank.isPrimary ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-2xs shrink-0">
                            {language === 'th' ? '★ บัญชีหลัก' : '★ Primary'}
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setPrimaryCompanyBank(bank.id || bank.accountNumber)}
                            className="text-[10px] text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100 font-semibold px-2 py-0.5 rounded transition-colors cursor-pointer shrink-0"
                          >
                            {language === 'th' ? 'ตั้งเป็นบัญชีหลัก' : 'Set Primary'}
                          </button>
                        )}
                      </div>

                      {/* Account Number */}
                      <div className="flex items-center justify-between bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200/80 font-mono my-2">
                        <span className="font-bold text-slate-900 text-sm tracking-wide">{bank.accountNumber}</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText(bank.accountNumber.replace(/-/g, ''));
                            showToast(language === 'th' ? 'คัดลอกเลขที่บัญชีแล้ว' : 'Copied', 'info');
                          }}
                          className="text-slate-400 hover:text-slate-600 p-1"
                          title="คัดลอก"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Account Details */}
                      <div className="text-[11px] text-slate-600 space-y-0.5">
                        <div className="truncate">
                          <strong>{language === 'th' ? 'ชื่อบัญชี:' : 'Name:'}</strong> {bank.accountName}
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500">
                          <span>PromptPay: <span className="font-mono">{bank.promptPayId}</span></span>
                          <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[9px] uppercase font-medium">
                            {bank.qrCodeType === 'custom_image' ? 'Custom QR' : 'Auto QR'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1 text-[11px]">
                      <button
                        type="button"
                        onClick={() => handleSelectBankForPreview(bank)}
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded transition-colors cursor-pointer ${
                          isSelectedForPreview
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {language === 'th' ? 'แสดงตัวอย่าง' : 'Preview'}
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditBankModal(bank)}
                          className="p-1.5 rounded-md text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                          title="แก้ไขบัญชีนี้"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {companyBankAccounts.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(language === 'th' ? `ต้องการลบบัญชีธนาคาร ${bank.bankName} (${bank.accountNumber}) ใช่หรือไม่?` : 'Delete this bank account?')) {
                                deleteCompanyBankAccount(bank.id || bank.accountNumber);
                              }
                            }}
                            className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="ลบบัญชีนี้"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Live QR & Bank Details Preview Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-2xl p-6 text-white border border-slate-700 shadow-md">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3 pb-2 border-b border-slate-800">
              <span className="font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {language === 'th' ? 'ตัวอย่างที่สมาชิกจะเห็นในเมนูเติมเงิน E-Wallet (Member View Preview)' : 'Member Top-up View Preview'}
              </span>
              <span className="font-mono text-[11px] text-emerald-300">
                Live Dynamic Card
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Left: Bank Info Card */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1">
                  <span className="font-semibold text-slate-300">บัญชีธนาคารบริษัทที่สมาชิกต้องโอนเข้า</span>
                  <span className="font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">{bankCode}</span>
                </div>
                <div className="font-bold text-sm text-white">{bankName}</div>
                <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono">
                  <span className="text-emerald-400 text-base font-bold">{accountNumber}</span>
                  <span className="text-[10px] text-slate-400">คัดลอกได้</span>
                </div>
                <div className="text-[11px] text-slate-300">
                  <div><strong>ชื่อบัญชี:</strong> {accountName}</div>
                  <div><strong>สาขา:</strong> {branch || 'สำนักงานใหญ่'}</div>
                  <div><strong>PromptPay ID:</strong> <span className="font-mono text-emerald-400">{promptPayId}</span> ({promptPayType === 'tax_id' ? 'เลขนิติบุคคล 13 หลัก' : 'เบอร์โทรศัพท์'})</div>
                </div>
              </div>

              {/* Right: QR Code Visual Preview */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex items-center justify-center gap-4 text-center">
                <div className="bg-white p-2 rounded-xl shadow-md w-32 h-32 flex items-center justify-center">
                  {qrCodeType === 'custom_image' && customQrImageUrl.trim() ? (
                    <img
                      src={customQrImageUrl.trim()}
                      alt="Custom QR Preview"
                      className="w-28 h-28 object-contain rounded"
                    />
                  ) : (
                    <div className="relative w-28 h-28 flex flex-col items-center justify-center">
                      <svg className="w-24 h-24" viewBox="0 0 100 100" fill="currentColor">
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
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="px-1 py-0.2 rounded bg-blue-900 text-white font-mono text-[8px] font-bold">
                          THAI QR
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-left text-xs space-y-1">
                  <div className="font-bold text-white text-sm">พร้อมเพย์ สแกนจ่าย</div>
                  <div className="text-slate-400 text-[11px]">รองรับทุกแอปธนาคารไทย</div>
                  <div className="font-mono text-emerald-400 font-bold text-base">฿5,000.00</div>
                  <div className="text-[10px] text-slate-500 font-mono">Type: {qrCodeType === 'custom_image' ? 'รูปภาพของคุณ' : 'สร้างอัตโนมัติ'}</div>
                </div>
              </div>

            </div>
          </div>

          {/* Quick Bank Presets */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  {language === 'th' ? '⚡ ธนาคารตัวอย่างยอดนิยม (1-Click Thai Bank Presets)' : '⚡ Quick Bank Presets'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {language === 'th' ? 'คลิกเลือกธนาคารเพื่อกรอกข้อมูลตัวอย่างทันที' : 'Click to load typical Thai corporate bank profiles'}
                </p>
              </div>
              <button
                type="button"
                onClick={resetCompanyBankSettings}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{language === 'th' ? 'รีเซ็ตค่าเดิม' : 'Reset Defaults'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <button
                type="button"
                onClick={() => applyBankPreset({
                  bankName: 'ธนาคารกสิกรไทย (Kasikornbank)',
                  bankCode: 'KBANK',
                  accountNumber: '045-8-91234-5',
                  accountName: companyName ? `บริษัท ${companyName} จำกัด` : 'บริษัท โอเอ็มซี ซิสเต็มส์ จำกัด',
                  branch: 'สาขา สยามพารากอน',
                  promptPayId: '0105562018899',
                  promptPayType: 'tax_id',
                  qrCodeType: 'generated'
                })}
                className="p-3 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-left transition-all cursor-pointer group"
              >
                <div className="w-7 h-7 rounded bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                  K
                </div>
                <div className="font-bold text-xs text-slate-900 flex items-center gap-1">
                  <span>🇹🇭</span> กสิกรไทย (KBANK)
                </div>
                <div className="text-[10px] text-slate-500">พร้อมเพย์นิติบุคคล 13 หลัก</div>
              </button>

              <button
                type="button"
                onClick={() => applyBankPreset({
                  bankName: 'ธนาคารไทยพาณิชย์ (Siam Commercial Bank)',
                  bankCode: 'SCB',
                  accountNumber: '111-3-45678-9',
                  accountName: companyName ? `บริษัท ${companyName} จำกัด` : 'บริษัท มาย เอ็มแอลเอ็ม จำกัด',
                  branch: 'สาขา รัชโยธิน',
                  promptPayId: '0105564023456',
                  promptPayType: 'tax_id',
                  qrCodeType: 'generated'
                })}
                className="p-3 rounded-lg border border-slate-200 hover:border-purple-500 hover:bg-purple-50/50 text-left transition-all cursor-pointer group"
              >
                <div className="w-7 h-7 rounded bg-purple-700 text-white font-bold text-xs flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                  SCB
                </div>
                <div className="font-bold text-xs text-slate-900 flex items-center gap-1">
                  <span>🇹🇭</span> ไทยพาณิชย์ (SCB)
                </div>
                <div className="text-[10px] text-slate-500">พร้อมเพย์นิติบุคคล 13 หลัก</div>
              </button>

              <button
                type="button"
                onClick={() => applyBankPreset({
                  bankName: 'ธนาคารกรุงเทพ (Bangkok Bank)',
                  bankCode: 'BBL',
                  accountNumber: '240-0-78129-0',
                  accountName: companyName ? `บริษัท ${companyName} จำกัด` : 'บริษัท เน็ตเวิร์ค อินเตอร์เนชั่นแนล จำกัด',
                  branch: 'สาขา สีลม',
                  promptPayId: '0897654321',
                  promptPayType: 'phone',
                  qrCodeType: 'generated'
                })}
                className="p-3 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-left transition-all cursor-pointer group"
              >
                <div className="w-7 h-7 rounded bg-blue-800 text-white font-bold text-xs flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                  BBL
                </div>
                <div className="font-bold text-xs text-slate-900 flex items-center gap-1">
                  <span>🇹🇭</span> กรุงเทพ (BBL)
                </div>
                <div className="text-[10px] text-slate-500">พร้อมเพย์เบอร์มือถือ</div>
              </button>

              <button
                type="button"
                onClick={() => applyBankPreset({
                  bankName: 'ธนาคารกรุงไทย (Krungthai Bank)',
                  bankCode: 'KTB',
                  accountNumber: '002-1-98765-4',
                  accountName: companyName ? `บริษัท ${companyName} จำกัด` : 'บริษัท ซัคเซส กรุ๊ป จำกัด',
                  branch: 'สาขา นานาเหนือ',
                  promptPayId: '0105561098765',
                  promptPayType: 'tax_id',
                  qrCodeType: 'custom_image',
                  customQrImageUrl: 'https://images.unsplash.com/photo-1595079672139-625c58c27944?w=200&auto=format&fit=crop&q=80'
                })}
                className="p-3 rounded-lg border border-slate-200 hover:border-sky-500 hover:bg-sky-50/50 text-left transition-all cursor-pointer group"
              >
                <div className="w-7 h-7 rounded bg-sky-500 text-white font-bold text-xs flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                  KTB
                </div>
                <div className="font-bold text-xs text-slate-900 flex items-center gap-1">
                  <span>🇹🇭</span> กรุงไทย (KTB)
                </div>
                <div className="text-[10px] text-slate-500">ตัวอย่างใช้ Custom QR Image</div>
              </button>

              <button
                type="button"
                onClick={() => applyBankPreset({
                  bankName: 'BANQUE POUR LE COMMERCE EXTERIEUR LAO PUBLIC (BCEL)',
                  bankCode: 'BCEL',
                  accountNumber: '010-12-000-88990-1',
                  accountName: companyName ? `บริษัท ${companyName} จำกัด (Lao PDR Branch)` : 'บริษัท โอเอ็มซี ซิสเต็มส์ จำกัด (สปป.ลาว)',
                  branch: 'Vientiane Capital Head Office (ນະຄອນຫຼວງວຽງຈັນ)',
                  promptPayId: '',
                  promptPayType: 'phone',
                  qrCodeType: 'generated'
                })}
                className="p-3 rounded-lg border border-red-200 hover:border-red-500 hover:bg-red-50/50 text-left transition-all cursor-pointer group bg-red-50/20"
              >
                <div className="w-7 h-7 rounded bg-red-600 text-white font-bold text-xs flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                  BCEL
                </div>
                <div className="font-bold text-xs text-red-900 flex items-center gap-1">
                  <span>🇱🇦</span> การค้าต่างประเทศลาว (BCEL)
                </div>
                <div className="text-[10px] text-red-600 font-medium">ธนาคารแห่ง สปป.ลาว</div>
              </button>
            </div>
          </div>

          {/* Bank & QR Configuration Form */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <span>{language === 'th' ? 'แบบฟอร์มแก้ไขบัญชีธนาคาร & QR Code สำหรับเติมเงิน' : 'Company Bank & QR Top-up Configuration Form'}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'th' 
                  ? 'ข้อมูลนี้จะแสดงในเมนูเติมเงิน E-Wallet, หน้าชำระเงินบิลสินค้า และการสมัครสมาชิกใหม่' 
                  : 'This account info and QR code are displayed in E-Wallet top-ups, checkout drawers, and registrations.'}
              </p>
            </div>

            <form onSubmit={handleSaveBankSettings} className="p-6 space-y-6 text-xs">
              
              {/* Section 1: Bank Information */}
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'th' ? '1. ข้อมูลบัญชีธนาคารของบริษัท' : '1. Company Official Bank Information'}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      {language === 'th' ? 'ชื่อธนาคาร (Bank Name):' : 'Bank Name:'}
                    </label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="เช่น ธนาคารกสิกรไทย (Kasikornbank)"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      {language === 'th' ? 'รหัสย่อธนาคาร (Bank Code):' : 'Bank Code:'}
                    </label>
                    <input
                      type="text"
                      value={bankCode}
                      onChange={(e) => setBankCode(e.target.value.toUpperCase())}
                      placeholder="เช่น KBANK, SCB, BBL"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      {language === 'th' ? 'เลขที่บัญชีธนาคาร (Account Number):' : 'Bank Account Number:'}
                    </label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="เช่น 045-8-91234-5"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      {language === 'th' ? 'ชื่อบัญชีบริษัท (Account Name):' : 'Company Account Name:'}
                    </label>
                    <input
                      type="text"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      placeholder="เช่น บริษัท โอเอ็มซี ซิสเต็มส์ จำกัด"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold text-slate-700 block mb-1">
                      {language === 'th' ? 'สาขาธนาคาร (Branch):' : 'Bank Branch:'}
                    </label>
                    <input
                      type="text"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      placeholder="เช่น สาขา สยามพารากอน หรือ สำนักงานใหญ่"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: PromptPay & QR Settings */}
              <div className="space-y-4 pt-2">
                <h3 className="font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'th' ? '2. ตั้งค่าระบบพร้อมเพย์ (PromptPay) & QR Code สำหรับเติมเงิน' : '2. PromptPay & QR Code Setup'}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      {language === 'th' ? 'หมายเลขพร้อมเพย์ (PromptPay ID):' : 'PromptPay ID:'}
                    </label>
                    <input
                      type="text"
                      value={promptPayId}
                      onChange={(e) => setPromptPayId(e.target.value)}
                      placeholder="เช่น 0105562018899 หรือ 0891234567"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      {language === 'th' ? 'ประเภทของพร้อมเพย์ (PromptPay Type):' : 'PromptPay Type:'}
                    </label>
                    <select
                      value={promptPayType}
                      onChange={(e) => setPromptPayType(e.target.value as 'tax_id' | 'phone')}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="tax_id">{language === 'th' ? 'เลขนิติบุคคล / เลขประจำตัวผู้เสียภาษี 13 หลัก (Tax ID)' : 'Corporate Tax ID (13 digits)'}</option>
                      <option value="phone">{language === 'th' ? 'เบอร์โทรศัพท์มือถือ (Mobile Phone)' : 'Mobile Phone Number'}</option>
                    </select>
                  </div>
                </div>

                {/* QR Code Format Selection */}
                <div>
                  <label className="font-semibold text-slate-800 block mb-2">
                    {language === 'th' ? 'รูปแบบ QR Code ที่ต้องการให้สมาชิกสแกน (QR Format):' : 'QR Code Display Method:'}
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className={`p-4 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                      qrCodeType === 'generated'
                        ? 'border-emerald-600 bg-emerald-50/40 text-emerald-900'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}>
                      <input
                        type="radio"
                        name="qrCodeType"
                        checked={qrCodeType === 'generated'}
                        onChange={() => setQrCodeType('generated')}
                        className="mt-0.5 text-emerald-600"
                      />
                      <div>
                        <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                          <QrCode className="w-4 h-4 text-emerald-600" />
                          <span>{language === 'th' ? 'สร้าง QR PromptPay อัตโนมัติ (Dynamic Thai QR)' : 'Auto Generated PromptPay QR'}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {language === 'th' ? 'ระบบจะสร้าง QR Code อัตโนมัติพร้อมระบุจำนวนเงินที่สมาชิกต้องการเติมทันที' : 'Dynamic QR that updates amount automatically'}
                        </p>
                      </div>
                    </label>

                    <label className={`p-4 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                      qrCodeType === 'custom_image'
                        ? 'border-emerald-600 bg-emerald-50/40 text-emerald-900'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}>
                      <input
                        type="radio"
                        name="qrCodeType"
                        checked={qrCodeType === 'custom_image'}
                        onChange={() => setQrCodeType('custom_image')}
                        className="mt-0.5 text-emerald-600"
                      />
                      <div>
                        <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-emerald-600" />
                          <span>{language === 'th' ? 'ใช้รูปภาพ QR Code ของคุณเอง (Custom QR Image)' : 'Custom QR Code Image URL'}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {language === 'th' ? 'นำรูปรหัส QR ที่ดาวน์โหลดจากแอปธนาคารของคุณจริงมาใส่ลิงก์หรือรูปภาพ' : 'Direct URL to your bank-issued official QR image'}
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Conditional Custom QR URL input */}
                {qrCodeType === 'custom_image' && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <label className="font-semibold text-slate-700 block mb-1">
                      {language === 'th' ? 'ลิงก์รูปภาพ QR Code (Custom QR Image URL):' : 'Custom QR Image URL:'}
                    </label>
                    <input
                      type="url"
                      value={customQrImageUrl}
                      onChange={(e) => setCustomQrImageUrl(e.target.value)}
                      placeholder="https://example.com/my-promptpay-qr.jpg หรือ /src/assets/images/qr.png"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <p className="text-[11px] text-slate-500">
                      {language === 'th' ? 'แนะนำให้ใช้ภาพ QR สี่เหลี่ยมจัตุรัสที่สแกนติดง่าย' : 'Recommended: High resolution square image.'}
                    </p>

                    {customQrImageUrl.trim() && (
                      <div className="pt-2 flex items-center gap-3">
                        <span className="text-slate-600 font-medium">ภาพที่ตรวจพบ:</span>
                        <img
                          src={customQrImageUrl.trim()}
                          alt="Custom QR Preview"
                          className="w-16 h-16 object-contain rounded border border-slate-300 p-1 bg-white"
                        />
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* Section 3: E-Wallet Transfer & Withdrawal Rules */}
              <div className="space-y-4 pt-2">
                <h3 className="font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <ArrowRightLeft className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'th' ? '3. กฎเกณฑ์การโอนและถอนเงิน E-Wallet' : '3. E-Wallet Transfer & Withdrawal Rules'}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      {language === 'th' ? 'ยอดโอนขั้นต่ำระหว่างสมาชิก (บาท):' : 'Min Member-to-Member Transfer:'}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={minTransferAmount}
                        onChange={(e) => setMinTransferAmount(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">THB</span>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      {language === 'th' ? 'ยอดถอนเงินขั้นต่ำเข้าบัญชี (บาท):' : 'Min Bank Withdrawal Amount:'}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={minWithdrawAmount}
                        onChange={(e) => setMinWithdrawAmount(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">THB</span>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      {language === 'th' ? 'ค่าธรรมเนียมโอนถอนเข้าธนาคาร (บาท):' : 'Bank Withdrawal Fee:'}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={transferFeeVal}
                        onChange={(e) => setTransferFeeVal(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">THB</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {language === 'th' ? 'บันทึกแล้วจะมีผลต่อหน้าสมาชิกทันที' : 'Settings update active E-Wallet screens immediately'}
                </span>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>{language === 'th' ? 'บันทึกข้อมูลธนาคาร & QR เติมเงิน' : 'Save Bank & QR Settings'}</span>
                </button>
              </div>

            </form>
          </div>

          {/* --- MODAL: ADD / EDIT COMPANY BANK ACCOUNT --- */}
          {isBankModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
              <div className="bg-white rounded-2xl max-w-xl w-full p-6 text-slate-900 shadow-2xl border border-slate-200 space-y-4 my-8">
                
                {/* Modal Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900">
                        {modalMode === 'add'
                          ? (language === 'th' ? '+ เพิ่มบัญชีธนาคารของคุณ (+ Add My Bank Account)' : '+ Add My Bank Account')
                          : (language === 'th' ? 'แก้ไขบัญชีธนาคารของบริษัท (Edit Company Bank)' : 'Edit Company Bank Account')}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        {language === 'th' ? 'กำหนดบัญชีธนาคารเพื่อรับเงินโอนและการสร้าง QR Code เติมเงิน' : 'Configure corporate receiving account and PromptPay QR'}
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

                {/* 1-Click Quick Bank Selector Bar (Lao PDR & Thailand) */}
                <div className="space-y-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                      <span>⚡</span>
                      <span>{language === 'th' ? 'เลือกธนาคารด่วน 1-คลิก:' : 'Quick Bank Selection:'}</span>
                    </label>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {language === 'th' ? 'รองรับธนาคารไทย 🇹🇭 และ สปป.ลาว 🇱🇦' : 'Supported TH 🇹🇭 & LA 🇱🇦'}
                    </span>
                  </div>

                  {/* Lao Banks Row */}
                  <div>
                    <span className="text-[10px] font-bold text-red-700 flex items-center gap-1 mb-1">
                      <span>🇱🇦</span> {language === 'th' ? 'ธนาคารแห่ง สปป.ลาว (Lao Banks):' : 'Lao Banks (Lao PDR):'}
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      {LAO_BANKS.map(b => (
                        <button
                          key={b.code}
                          type="button"
                          onClick={() => handleSelectBankCodeInModal(b.code)}
                          className={`p-2 rounded-lg border text-left transition-all cursor-pointer flex items-center gap-2 ${
                            modalBankCode === b.code
                              ? 'border-red-500 bg-red-50 ring-2 ring-red-500/20 shadow-xs'
                              : 'border-slate-200 bg-white hover:bg-slate-50'
                          }`}
                        >
                          <div className={`w-6 h-6 shrink-0 rounded ${b.color} text-white font-bold text-[9px] flex items-center justify-center`}>
                            {b.code.slice(0, 3)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-[10px] text-slate-900 leading-tight truncate">{b.code}</div>
                            <div className="text-[9px] text-slate-500 truncate">{b.shortName}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Thai Banks Row */}
                  <div>
                    <span className="text-[10px] font-bold text-blue-700 flex items-center gap-1 mb-1">
                      <span>🇹🇭</span> {language === 'th' ? 'ธนาคารพาณิชย์ไทย (Thai Banks):' : 'Thai Commercial Banks:'}
                    </span>
                    <div className="grid grid-cols-5 gap-1.5">
                      {THAI_BANKS_ONLY.map(b => (
                        <button
                          key={b.code}
                          type="button"
                          onClick={() => handleSelectBankCodeInModal(b.code)}
                          className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                            modalBankCode === b.code
                              ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20 shadow-xs'
                              : 'border-slate-200 bg-white hover:bg-slate-50'
                          }`}
                        >
                          <div className={`w-5 h-5 mx-auto rounded ${b.color} text-white font-bold text-[9px] flex items-center justify-center mb-0.5`}>
                            {b.code.slice(0, 3)}
                          </div>
                          <div className="font-bold text-[10px] text-slate-800 truncate">{b.code}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modal Form */}
                <form onSubmit={handleSaveBankModal} className="space-y-4 text-xs">
                  
                  {/* Select Bank Full Dropdown with Optgroups */}
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      {language === 'th' ? 'ชื่อธนาคาร (Bank Name):' : 'Bank Name:'}
                    </label>
                    <select
                      value={modalBankCode}
                      onChange={(e) => handleSelectBankCodeInModal(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Account Number */}
                    <div>
                      <label className="font-bold text-slate-800 block mb-1">
                        {language === 'th' ? 'เลขที่บัญชีธนาคาร (Account Number):' : 'Account Number:'}
                      </label>
                      <input
                        type="text"
                        value={modalAccountNumber}
                        onChange={(e) => setModalAccountNumber(e.target.value)}
                        placeholder="เช่น 045-8-91234-5 หรือ 10 หลัก"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>

                    {/* Branch */}
                    <div>
                      <label className="font-bold text-slate-800 block mb-1">
                        {language === 'th' ? 'สาขาธนาคาร (Branch):' : 'Branch:'}
                      </label>
                      <input
                        type="text"
                        value={modalBranch}
                        onChange={(e) => setModalBranch(e.target.value)}
                        placeholder="เช่น สำนักงานใหญ่ หรือ สยามสแควร์"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Account Name */}
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      {language === 'th' ? 'ชื่อบัญชี (Account Holder / Company Name):' : 'Account Holder Name:'}
                    </label>
                    <input
                      type="text"
                      value={modalAccountName}
                      onChange={(e) => setModalAccountName(e.target.value)}
                      placeholder="เช่น บริษัท โอเอ็มซี ซิสเต็มส์ จำกัด"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  {/* PromptPay Settings */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <span className="font-bold text-slate-800 block text-[11px]">
                      {language === 'th' ? 'ข้อมูลพร้อมเพย์สำหรับสแกน QR (PromptPay Settings):' : 'PromptPay QR Configuration:'}
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-slate-600 block mb-1">
                          {language === 'th' ? 'PromptPay ID (เบอร์โทร หรือ เลขภาษี 13 หลัก):' : 'PromptPay ID:'}
                        </label>
                        <input
                          type="text"
                          value={modalPromptPayId}
                          onChange={(e) => setModalPromptPayId(e.target.value)}
                          placeholder="เช่น 0105562018899"
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-600 block mb-1">
                          {language === 'th' ? 'ประเภท PromptPay:' : 'PromptPay Type:'}
                        </label>
                        <select
                          value={modalPromptPayType}
                          onChange={(e) => setModalPromptPayType(e.target.value as 'tax_id' | 'phone')}
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="tax_id">เลขนิติบุคคล 13 หลัก (Corporate Tax ID)</option>
                          <option value="phone">เบอร์โทรศัพท์มือถือ (Mobile Phone)</option>
                        </select>
                      </div>
                    </div>

                    {/* QR Code Type Selector */}
                    <div>
                      <label className="text-[11px] text-slate-600 block mb-1">
                        {language === 'th' ? 'รูปแบบ QR Code สำหรับชำระเงิน:' : 'QR Code Display Method:'}
                      </label>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="modalQrType"
                            checked={modalQrCodeType === 'generated'}
                            onChange={() => setModalQrCodeType('generated')}
                            className="text-emerald-600"
                          />
                          <span>สร้าง SVG PromptPay QR อัตโนมัติ</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="modalQrType"
                            checked={modalQrCodeType === 'custom_image'}
                            onChange={() => setModalQrCodeType('custom_image')}
                            className="text-emerald-600"
                          />
                          <span>ใส่ลิงก์รูปภาพ QR จริงของธนาคาร</span>
                        </label>
                      </div>

                      {modalQrCodeType === 'custom_image' && (
                        <input
                          type="url"
                          value={modalCustomQrImageUrl}
                          onChange={(e) => setModalCustomQrImageUrl(e.target.value)}
                          placeholder="https://example.com/my-bank-qr.png"
                          className="w-full mt-2 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      )}
                    </div>
                  </div>

                  {/* Primary Toggle */}
                  <div className="flex items-center justify-between p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                    <div>
                      <span className="font-bold text-emerald-900 block text-xs">
                        {language === 'th' ? 'ตั้งเป็นบัญชีธนาคารหลัก (Set as Primary Bank Account)' : 'Set as Primary Bank Account'}
                      </span>
                      <span className="text-[11px] text-emerald-700">
                        {language === 'th' ? 'ระบบจะแสดงบัญชีนี้เป็นตัวเลือกแรกในหน้าเติมเงิน' : 'Will be displayed as default receiving account'}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={modalIsPrimary}
                      onChange={(e) => setModalIsPrimary(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsBankModalOpen(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
                    >
                      {language === 'th' ? 'ยกเลิก' : 'Cancel'}
                    </button>

                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Save className="w-4 h-4" />
                      <span>
                        {modalMode === 'add'
                          ? (language === 'th' ? '+ เพิ่มบัญชีธนาคารของคุณ (+ Add My Bank Account)' : '+ Add My Bank Account')
                          : (language === 'th' ? 'บันทึกการแก้ไข' : 'Save Changes')}
                      </span>
                    </button>
                  </div>

                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* --- TAB 2: BRANDING & LOGO SETTINGS --- */}
      {activeSubTab === 'branding' && (
        <div className="space-y-6">
          
          {/* Live Preview Card */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white border border-slate-700 shadow-md">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3 pb-2 border-b border-slate-800">
              <span className="font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {language === 'th' ? 'ตัวอย่างการแสดงผลสดบนแถบเมนู (Live Header Preview)' : 'Live Header Preview'}
              </span>
              <span className="font-mono text-[11px] text-slate-400">
                Auto Updates Everywhere
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-3">
                {logoType === 'image' && logoUrl.trim() ? (
                  <img
                    src={logoUrl.trim()}
                    alt="Logo Preview"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                    className="w-10 h-10 object-contain rounded-lg bg-white p-1 shadow-md border border-slate-700"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-lg shadow-md tracking-wider">
                    {shortCode || 'OMC'}
                  </div>
                )}

                <div>
                  <h3 className="font-bold text-base text-white leading-tight">
                    {language === 'th' ? (portalTitleTh || 'ระบบสมาชิกนักธุรกิจ') : (portalTitle || 'Member Portal')}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    {domainName || 'demomlm.omc.co.th'}
                  </p>
                </div>
              </div>

              <div className="text-right text-xs">
                <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium">
                  {companyName}
                </span>
                <p className="text-[11px] text-slate-400 mt-1">
                  {companyNameTh}
                </p>
              </div>
            </div>
          </div>

          {/* Quick 1-Click Brand Presets */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  {language === 'th' ? '⚡ ธีมตัวอย่างสำเร็จรูป (1-Click Presets)' : '⚡ Quick Brand Presets'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {language === 'th' ? 'คลิกเพื่อทดสอบเปลี่ยนชื่อแบรนด์และโลโก้ทันที' : 'Click to instantly preview alternative company brands'}
                </p>
              </div>
              <button
                type="button"
                onClick={resetSystemBranding}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{language === 'th' ? 'รีเซ็ตค่าเดิม' : 'Reset Defaults'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => applyPreset({
                  companyName: 'OMC MLM System',
                  companyNameTh: 'โอเอ็มซี ซิสเต็มส์ (ประเทศไทย)',
                  portalTitle: 'OMC Member Portal',
                  portalTitleTh: 'ระบบสมาชิกนักธุรกิจ OMC',
                  shortCode: 'OMC',
                  domainName: 'demomlm.omc.co.th',
                  logoType: 'text',
                  themeColor: 'blue'
                })}
                className="p-3 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-left transition-all cursor-pointer group"
              >
                <div className="w-7 h-7 rounded bg-blue-600 text-white font-bold text-xs flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                  OMC
                </div>
                <div className="font-bold text-xs text-slate-900">OMC MLM Standard</div>
                <div className="text-[10px] text-slate-500">demomlm.omc.co.th</div>
              </button>

              <button
                type="button"
                onClick={() => applyPreset({
                  companyName: 'Green Life Global',
                  companyNameTh: 'กรีน ไลฟ์ โกลบอล จำกัด',
                  portalTitle: 'Green Life Member BackOffice',
                  portalTitleTh: 'ระบบสมาชิก กรีน ไลฟ์ โกลบอล',
                  shortCode: 'GLG',
                  domainName: 'member.greenlifeglobal.com',
                  logoType: 'text',
                  themeColor: 'emerald'
                })}
                className="p-3 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-left transition-all cursor-pointer group"
              >
                <div className="w-7 h-7 rounded bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                  GLG
                </div>
                <div className="font-bold text-xs text-slate-900">Green Life Global</div>
                <div className="text-[10px] text-slate-500">member.greenlifeglobal.com</div>
              </button>

              <button
                type="button"
                onClick={() => applyPreset({
                  companyName: 'Alpha Diamond Network',
                  companyNameTh: 'อัลฟ่า ไดมอนด์ เน็ตเวิร์ค',
                  portalTitle: 'Alpha Diamond Portal',
                  portalTitleTh: 'ระบบนักธุรกิจ อัลฟ่า ไดมอนด์',
                  shortCode: 'ADN',
                  domainName: 'backoffice.alphadiamond.co',
                  logoType: 'text',
                  themeColor: 'purple'
                })}
                className="p-3 rounded-lg border border-slate-200 hover:border-purple-500 hover:bg-purple-50/50 text-left transition-all cursor-pointer group"
              >
                <div className="w-7 h-7 rounded bg-purple-600 text-white font-bold text-xs flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                  ADN
                </div>
                <div className="font-bold text-xs text-slate-900">Alpha Diamond Network</div>
                <div className="text-[10px] text-slate-500">backoffice.alphadiamond.co</div>
              </button>

              <button
                type="button"
                onClick={() => applyPreset({
                  companyName: 'Rich Pharma MLM',
                  companyNameTh: 'ริช ฟาร์มา เอ็มแอลเอ็ม',
                  portalTitle: 'Rich Pharma Member System',
                  portalTitleTh: 'ระบบสมาชิก ริช ฟาร์มา',
                  shortCode: 'RPM',
                  domainName: 'member.richpharmagroup.com',
                  logoType: 'image',
                  logoUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=150&auto=format&fit=crop&q=80',
                  themeColor: 'indigo'
                })}
                className="p-3 rounded-lg border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 text-left transition-all cursor-pointer group"
              >
                <div className="w-7 h-7 rounded bg-indigo-600 text-white font-bold text-xs flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                  RPM
                </div>
                <div className="font-bold text-xs text-slate-900">Rich Pharma (With Image Logo)</div>
                <div className="text-[10px] text-slate-500">member.richpharmagroup.com</div>
              </button>
            </div>
          </div>

          {/* Main Customization Form */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <span>{language === 'th' ? 'แบบฟอร์มกำหนดข้อมูลชื่อและโลโก้' : 'Website Name & Logo Customization Form'}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'th' 
                  ? 'เมื่อบันทึกแล้ว ข้อมูลชื่อและโลโก้จะอัปเดตอัตโนมัติบน Header, Sidebar, หน้าล็อกอิน, ใบแจ้งยอด และชื่อหัวเว็บแท็บ Browser' 
                  : 'Changes automatically reflect across navigation bars, login cards, commission slips, and browser tab titles.'}
              </p>
            </div>

            <form onSubmit={handleSaveBranding} className="p-6 space-y-6 text-xs">
              
              {/* Row 1: Logo Type Selector */}
              <div>
                <label className="font-bold text-slate-800 block mb-2">
                  {language === 'th' ? 'รูปแบบโลโก้ที่ต้องการแสดงผล (Logo Format):' : 'Logo Display Format:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className={`p-4 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                    logoType === 'text' 
                      ? 'border-blue-600 bg-blue-50/40 text-blue-900' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="logoType"
                      checked={logoType === 'text'}
                      onChange={() => setLogoType('text')}
                      className="mt-0.5 text-blue-600"
                    />
                    <div>
                      <div className="font-bold text-sm flex items-center gap-1.5 text-slate-900">
                        <Type className="w-4 h-4 text-blue-600" />
                        <span>{language === 'th' ? 'โลโก้อักษรย่อ (Badge Monogram)' : 'Text Monogram Badge'}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {language === 'th' ? 'แสดงตัวย่อ 2-4 ตัวอักษร เช่น OMC, GLG, RPM บนพื้นหลังไล่เฉดสีทันสมัย' : 'Displays clean 2-4 letter short code badge with gradient fill'}
                      </p>
                    </div>
                  </label>

                  <label className={`p-4 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                    logoType === 'image' 
                      ? 'border-blue-600 bg-blue-50/40 text-blue-900' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="logoType"
                      checked={logoType === 'image'}
                      onChange={() => setLogoType('image')}
                      className="mt-0.5 text-blue-600"
                    />
                    <div>
                      <div className="font-bold text-sm flex items-center gap-1.5 text-slate-900">
                        <ImageIcon className="w-4 h-4 text-blue-600" />
                        <span>{language === 'th' ? 'รูปภาพโลโก้กำหนดเอง (Custom Image Logo)' : 'Custom Image URL Logo'}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {language === 'th' ? 'ใส่ลิงก์ URL ของรูปภาพโลโก้บริษัทของคุณ เช่น ไฟล์ .png, .svg หรือ .webp' : 'Provide direct URL to your corporate logo image file (.png, .svg)'}
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Conditional Logo Input Details */}
              {logoType === 'text' ? (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      {language === 'th' ? 'ตัวย่อโลโก้ (Short Code 2-5 ตัวอักษร):' : 'Logo Badge Short Code:'}
                    </label>
                    <input
                      type="text"
                      maxLength={5}
                      value={shortCode}
                      onChange={(e) => setShortCode(e.target.value.toUpperCase())}
                      placeholder="เช่น OMC หรือ RPM"
                      className="w-full max-w-xs px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono font-bold text-slate-900 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      {language === 'th' ? 'ลิงก์รูปภาพโลโก้ (Logo Image URL):' : 'Logo Image URL:'}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        placeholder="https://example.com/logo.png หรือ /src/assets/images/..."
                        className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {language === 'th' 
                        ? 'แนะนำให้ใช้รูปทรงสี่เหลี่ยมจัตุรัส หรือสัดส่วน 1:1 พื้นหลังโปร่งใส (.png)' 
                        : 'Recommended: Square 1:1 aspect ratio with transparent PNG background.'}
                    </p>
                  </div>

                  {logoUrl.trim() && (
                    <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
                      <span className="text-slate-600 font-medium">{language === 'th' ? 'ตัวอย่างภาพที่ตรวจพบ:' : 'Preview:'}</span>
                      <img
                        src={logoUrl.trim()}
                        alt="Logo URL Preview"
                        className="w-10 h-10 object-contain rounded bg-white p-1 border border-slate-300 shadow-2xs"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Company & Website Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'th' ? 'ชื่อบริษัท/ระบบ (English Name):' : 'Company / System Name (EN):'}
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="เช่น OMC MLM System"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'th' ? 'ชื่อบริษัทภาษาไทย (Thai Name):' : 'Company Name (TH):'}
                  </label>
                  <input
                    type="text"
                    value={companyNameTh}
                    onChange={(e) => setCompanyNameTh(e.target.value)}
                    placeholder="เช่น โอเอ็มซี ซิสเต็มส์ (ประเทศไทย)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'th' ? 'ชื่อหัวเว็บสมาชิก (Portal Title EN):' : 'Member Portal Title (EN):'}
                  </label>
                  <input
                    type="text"
                    value={portalTitle}
                    onChange={(e) => setPortalTitle(e.target.value)}
                    placeholder="เช่น OMC Member Portal"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'th' ? 'ชื่อหัวเว็บสมาชิกภาษาไทย (Portal Title TH):' : 'Member Portal Title (TH):'}
                  </label>
                  <input
                    type="text"
                    value={portalTitleTh}
                    onChange={(e) => setPortalTitleTh(e.target.value)}
                    placeholder="เช่น ระบบสมาชิกนักธุรกิจ OMC"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'th' ? 'โดเมนเนม / ที่อยู่เว็บไซต์จำลอง (Domain text):' : 'Displayed Subdomain / Domain Name:'}
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={domainName}
                      onChange={(e) => setDomainName(e.target.value)}
                      placeholder="เช่น demomlm.omc.co.th"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {language === 'th' ? 'การตั้งค่าจะถูกจัดเก็บและมีผลทันที' : 'Settings save to persistent state instantly'}
                </span>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>{language === 'th' ? 'บันทึกชื่อและโลโก้ (Save Changes)' : 'Save Website Branding'}</span>
                </button>
              </div>

            </form>
          </div>

        </div>
      )}

      {/* --- TAB 3: COMPENSATION PLAN SETTINGS --- */}
      {activeSubTab === 'compensation' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          
          <div className="p-5 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-600" />
              <span>{language === 'th' ? 'ตั้งค่าแผนการจ่ายผลตอบแทน (Compensation Plan Settings)' : 'Compensation Plan Configuration'}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'th' 
                ? 'กำหนดสูตรคำนวณ เปอร์เซ็นต์โบนัส และเพดานรายได้สูงสุดสำหรับแต่ละตำแหน่งธุรกิจ' 
                : 'Configure matching multipliers, daily binary income caps, and tax parameters.'}
            </p>
          </div>

          <form onSubmit={handleSaveCompensation} className="p-6 space-y-6 text-xs">
            
            {/* Section 1: Bonus Rates */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 pb-2 border-b border-slate-100">
                {language === 'th' ? '1. อัตราเปอร์เซ็นต์โบนัสหลัก' : '1. Core Bonus Rates'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'th' ? 'โบนัสค่าแนะนำสายตรง Fast Start (% ของ PV):' : 'Fast Start Bonus Rate (% of PV):'}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={fastStart}
                      onChange={(e) => setFastStart(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'th' ? 'โบนัสจับคู่ไบนารี่ขาอ่อน Pairing (% ของ PV):' : 'Binary Weak Leg Pairing Rate (% of PV):'}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={pairingRate}
                      onChange={(e) => setPairingRate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Daily Caps */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 pb-2 border-b border-slate-100">
                {language === 'th' ? '2. เพดานรายได้จับคู่ต่อวันสูงสุด (Daily Max Cap)' : '2. Maximum Daily Pairing Income Caps'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'th' ? 'เพดานตำแหน่ง Diamond (บาท/วัน):' : 'Diamond Daily Cap (THB/day):'}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={capDiamond}
                      onChange={(e) => setCapDiamond(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">THB</span>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'th' ? 'เพดานตำแหน่ง Gold (บาท/วัน):' : 'Gold Daily Cap (THB/day):'}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={capGold}
                      onChange={(e) => setCapGold(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">THB</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Autoship & Deductions */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 pb-2 border-b border-slate-100">
                {language === 'th' ? '3. เงื่อนไขรักษายอดและการหักภาษี' : '3. Autoship & Statutory Deductions'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'th' ? 'รักษายอดขั้นต่ำ (PV/เดือน):' : 'Autoship PV / Month:'}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={autoshipPv}
                      onChange={(e) => setAutoshipPv(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">PV</span>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'th' ? 'ภาษีหัก ณ ที่จ่าย (%):' : 'Withholding Tax Rate (%):'}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={taxRate}
                      onChange={(e) => setTaxRate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">%</span>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'th' ? 'ค่าธรรมเนียมโอนธนาคาร:' : 'Bank Transfer Fee:'}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={transferFee}
                      onChange={(e) => setTransferFee(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">THB</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>{language === 'th' ? 'บันทึกการตั้งค่าแผนรายได้' : 'Save Compensation Plan Settings'}</span>
              </button>
            </div>

          </form>

        </div>
      )}

      {/* --- TAB 4: SOURCE CODE GUIDE --- */}
      {activeSubTab === 'code_guide' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6 text-xs text-slate-700">
          
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200 text-slate-900">
            <Code className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold">
              {language === 'th' ? 'คู่มือการแก้ไขข้อมูลในไฟล์ซอร์สโค้ด (Source Code Developer Guide)' : 'How to Edit Bank, QR Code & Transfers in Code'}
            </h2>
          </div>

          <p className="leading-relaxed text-slate-600">
            {language === 'th'
              ? 'หากคุณต้องการกำหนดค่าบัญชีธนาคาร, รูปภาพ QR Code หรือตรรกะการโอนเงิน/ถอนเงิน E-Wallet ถาวรในระดับไฟล์โค้ดของโปรเจกต์ สามารถแก้ไขได้ตามจุดต่างๆ ดังนี้:'
              : 'If you want to permanently update bank details, QR code images, and transfer limits directly within the source repository files:'}
          </p>

          {/* Guide Item 1: Bank & QR Mock Data */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-900">
              <span className="text-emerald-700 font-mono text-sm">1. /src/data/mockMlmData.ts (กำหนดบัญชี & QR เริ่มต้น)</span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">ค่าเริ่มต้นบัญชีธนาคาร</span>
            </div>
            <p className="text-slate-600">
              ค้นหาอ็อบเจกต์ <code className="bg-slate-200 px-1.5 py-0.5 rounded font-mono text-slate-800">DEFAULT_BANK_SETTINGS</code> เพื่อกำหนดเลขบัญชีธนาคาร และ PromptPay ของบริษัทคุณ:
            </p>
            <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-[11px] overflow-x-auto">
{`export const DEFAULT_BANK_SETTINGS: CompanyBankSettings = {
  bankName: 'ธนาคารกสิกรไทย (Kasikornbank)', // ชื่อธนาคารของคุณ
  bankCode: 'KBANK',                        // รหัสย่อธนาคาร
  accountNumber: '045-8-91234-5',           // เลขที่บัญชีของบริษัทคุณ
  accountName: 'บริษัท ของคุณ จำกัด',          // ชื่อบัญชีบริษัทสำหรับรับเงิน
  branch: 'สาขา สำนักงานใหญ่',
  promptPayId: '0105562018899',             // เลขพร้อมเพย์ (เลขประจำตัวผู้เสียภาษี 13 หลัก หรือเบอร์โทร)
  promptPayType: 'tax_id',                  // หรือ 'phone'
  qrCodeType: 'generated',                  // หรือ 'custom_image'
  customQrImageUrl: '/src/assets/images/my_promptpay_qr.png', // กรณีใช้ภาพจริง
  minTransferAmount: 100,                   // โอนขั้นต่ำระหว่างสมาชิก
  minWithdrawAmount: 300,                   // ถอนขั้นต่ำเข้าบัญชี
  transferFee: 30                           // ค่าธรรมเนียมโอนถอน
};`}
            </pre>
          </div>

          {/* Guide Item 2: Placing Custom QR Image File */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-900">
              <span className="text-emerald-700 font-mono text-sm">2. /src/assets/images/ (วางไฟล์รูปภาพ QR Code พร้อมเพย์จริง)</span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-200 text-slate-700">ไฟล์รูปภาพ</span>
            </div>
            <p className="text-slate-600">
              หากคุณมีภาพ QR Code จากแอปพลิเคชันธนาคารของคุณ (เช่น บัญชีธนาคารธุรกิจ SCB Business Anywhere หรือ K BIZ):
            </p>
            <ol className="list-decimal pl-5 space-y-1 text-slate-600">
              <li>นำไฟล์รูปภาพมาวางในโฟลเดอร์ <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">/src/assets/images/my_promptpay_qr.png</code></li>
              <li>ในหน้า Admin ตั้งค่า ให้เลือกรูปแบบเป็น <strong>"ใช้รูปภาพ QR Code ของคุณเอง"</strong> แล้วใส่ URL เป็น <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">/src/assets/images/my_promptpay_qr.png</code></li>
            </ol>
          </div>

          {/* Guide Item 3: Transfer & Withdrawal Logic */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-900">
              <span className="text-indigo-600 font-mono text-sm">3. /src/context/MlmContext.tsx (ฟังก์ชันโอนและถอนเงิน)</span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">Business Logic</span>
            </div>
            <p className="text-slate-600">
              ฟังก์ชัน <code className="bg-slate-200 px-1.5 py-0.5 rounded font-mono text-slate-800">transferWallet</code> และ <code className="bg-slate-200 px-1.5 py-0.5 rounded font-mono text-slate-800">withdrawWallet</code> จะตรวจสอบยอดเงินคงเหลือ, รหัส PIN 6 หลัก, ตรวจสอบผู้รับในผังองค์กร และบันทึกลงในรายการเดินบัญชี Ledger โดยอัตโนมัติ
            </p>
          </div>

          {/* Guide Item 4: Real Payment Gateway Integration Note */}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-2">
            <div className="font-bold text-blue-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>การเชื่อมต่อ Payment Gateway จริงในอนาคต (Production Integration)</span>
            </div>
            <p className="text-blue-800 leading-relaxed">
              หากต้องการเชื่อมต่อระบบตัดเงินและตรวจจับสลิปอัตโนมัติในระดับ Production สามารถใช้ Webhook และ API ของผู้ให้บริการชำระเงินในไทย เช่น <strong>GB Prime Pay, Omise, 2C2P, หรือ SlipOK</strong> โดยสร้าง Route ฝั่ง Backend ใน <code className="bg-blue-100 px-1 py-0.5 rounded font-mono">/api/payment/webhook</code> เพื่ออัปเดตยอด E-Wallet ให้สมาชิกแบบอัตโนมัติเมื่อลูกค้าสแกน QR เสร็จสิ้น
            </p>
          </div>

        </div>
      )}

      {/* --- TAB 4: ADMIN PASSWORD & SECURITY SETTINGS --- */}
      {activeSubTab === 'security' && (
        <div className="space-y-6">

          {/* Header Banner */}
          <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-red-950 rounded-2xl p-6 text-white border border-rose-800/60 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold border border-rose-500/30">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <span>{language === 'th' ? 'เปลี่ยนรหัสผ่านผู้ดูแลระบบ (Admin Password)' : 'Change Admin Password'}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Super Administrator
                      </span>
                    </h2>
                    <p className="text-xs text-rose-200/80">
                      {language === 'th'
                        ? 'กำหนดชื่อผู้ใช้ (Username) และรหัสผ่านใหม่ (Password) สำหรับเข้าสู่ระบบหลังบ้าน Admin Console'
                        : 'Manage Administrator credentials for accessing the backend control panel.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetAdminPassword}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{language === 'th' ? 'รีเซ็ตเป็น admin / admin123' : 'Reset to Default'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Current Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {language === 'th' ? 'ชื่อผู้ใช้ Admin ปัจจุบัน' : 'Current Admin Username'}
                  </div>
                  <div className="text-base font-bold font-mono text-slate-900">
                    {adminCredentials.username}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {language === 'th' ? 'ระดับสิทธิ์การใช้งาน' : 'Permission Level'}
                  </div>
                  <div className="text-sm font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Super Administrator</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {language === 'th' ? 'สถานะการบันทึก' : 'Storage Status'}
                  </div>
                  <div className="text-xs font-semibold text-slate-700">
                    {language === 'th' ? 'บันทึกอัตโนมัติ (Persistent)' : 'Persistent & Active'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Change Password Form */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-rose-600" />
                <span>{language === 'th' ? 'แบบฟอร์มเปลี่ยนรหัสผ่าน Admin' : 'Admin Credentials Update Form'}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'th'
                  ? 'หลังจากกดบันทึก ท่านสามารถใช้รหัสผ่านใหม่นี้เข้าสู่ระบบผ่านหน้า Login ได้ทันที'
                  : 'Once saved, you can immediately login using these new credentials from the login screen.'}
              </p>
            </div>

            <form onSubmit={handleSaveAdminPassword} className="p-6 space-y-5">
              
              {/* Alert Messages */}
              {passwordError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span className="font-medium">{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">{passwordSuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Admin Username Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {language === 'th' ? 'ชื่อผู้ใช้ Admin (Username)' : 'Admin Username'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      placeholder="admin"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {language === 'th' ? 'ชื่อบัญชีสำหรับล็อกอิน (ค่าเริ่มต้น: admin)' : 'Login username (default: admin)'}
                  </p>
                </div>

                {/* Current Password Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {language === 'th' ? 'รหัสผ่านปัจจุบัน (Current Password)' : 'Current Password'}
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showCurrentPass ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {language === 'th' ? 'รหัสผ่านเดิม (ค่าเริ่มต้น: admin123)' : 'Current password (default: admin123)'}
                  </p>
                </div>

                {/* New Password Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {language === 'th' ? 'รหัสผ่านใหม่ (New Password)' : 'New Password'}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder={language === 'th' ? 'กำหนดรหัสผ่านใหม่ (ขั้นต่ำ 4-6 ตัว)' : 'Enter new password'}
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {newPassword && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">{language === 'th' ? 'ความปลอดภัย:' : 'Strength:'}</span>
                        <span className={`font-bold ${
                          newPassword.length < 6 
                            ? 'text-red-500' 
                            : newPassword.length < 9 
                            ? 'text-amber-500' 
                            : 'text-emerald-600'
                        }`}>
                          {newPassword.length < 6 
                            ? (language === 'th' ? 'ง่ายเกินไป (ควรมี 6 ตัวขึ้นไป)' : 'Weak') 
                            : newPassword.length < 9 
                            ? (language === 'th' ? 'ปานกลาง (Medium)' : 'Medium') 
                            : (language === 'th' ? 'ปลอดภัยสูง (Strong)' : 'Strong')}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                        <div className={`h-full transition-all ${
                          newPassword.length < 6 
                            ? 'w-1/3 bg-red-500' 
                            : newPassword.length < 9 
                            ? 'w-2/3 bg-amber-500' 
                            : 'w-full bg-emerald-500'
                        }`} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm New Password Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {language === 'th' ? 'ยืนยันรหัสผ่านใหม่ (Confirm Password)' : 'Confirm New Password'}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showConfirmPass ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={language === 'th' ? 'กรอกรหัสผ่านใหม่อีกครั้ง' : 'Re-enter new password'}
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-[11px] text-red-500 mt-1">
                      {language === 'th' ? '⚠️ รหัสผ่านไม่ตรงกัน' : 'Passwords do not match'}
                    </p>
                  )}
                  {confirmPassword && newPassword === confirmPassword && (
                    <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-medium">
                      <Check className="w-3.5 h-3.5" />
                      {language === 'th' ? 'รหัสผ่านตรงกัน' : 'Passwords match'}
                    </p>
                  )}
                </div>

              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setPasswordError('');
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                >
                  {language === 'th' ? 'ล้างข้อมูล' : 'Clear'}
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white rounded-lg text-xs font-bold shadow-md shadow-rose-600/20 flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{language === 'th' ? 'บันทึกรหัสผ่านใหม่' : 'Save New Password'}</span>
                </button>
              </div>

            </form>
          </div>

          {/* MySQL & Code Reference Guide */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* MySQL Database Reference */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-mono text-xs">
                  SQL
                </div>
                <span>{language === 'th' ? 'การตั้งค่าบนฐานข้อมูล MySQL / phpMyAdmin' : 'MySQL Database Configuration'}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'th'
                  ? 'หากติดตั้งระบบกับฐานข้อมูล MySQL (XAMPP / cPanel / MariaDB) ข้อมูลผู้ดูแลระบบสามารถกำหนดผ่านตาราง mlm_system_settings ดังนี้:'
                  : 'For production MySQL servers, you can configure system settings via SQL query:'}
              </p>
              <pre className="bg-slate-900 text-emerald-400 p-3 rounded-lg text-xs font-mono overflow-x-auto border border-slate-800">
{`-- บันทึกหรืออัปเดตรหัสผ่าน Admin ในตารางการตั้งค่า
INSERT INTO \`mlm_system_settings\` 
  (\`setting_key\`, \`setting_value\`, \`description\`) 
VALUES 
  ('admin_password', 'your_new_password', 'Admin Master Password')
ON DUPLICATE KEY UPDATE 
  \`setting_value\` = 'your_new_password';`}
              </pre>
            </div>

            {/* Source Code Reference */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Code className="w-4 h-4" />
                </div>
                <span>{language === 'th' ? 'ตำแหน่งไฟล์ใน Source Code' : 'Source Code Files'}</span>
              </div>
              <ul className="text-xs space-y-2 text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="font-mono bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-[11px] font-semibold">
                    src/context/MlmContext.tsx
                  </span>
                  <span className="text-slate-500 text-[11px]">ฟังก์ชัน <code>login()</code> & <code>adminCredentials</code></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-[11px] font-semibold">
                    src/components/views/LoginView.tsx
                  </span>
                  <span className="text-slate-500 text-[11px]">หน้าจอเข้าสู่ระบบ (สวิตช์โหมด Admin)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-[11px] font-semibold">
                    deployment_package/omc_mlm_database.sql
                  </span>
                  <span className="text-slate-500 text-[11px]">ไฟล์สคริปต์ฐานข้อมูล DDL & Seed Data</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

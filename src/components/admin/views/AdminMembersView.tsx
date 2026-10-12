import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Award, 
  Wallet, 
  Sparkles, 
  Edit3, 
  Plus, 
  Check, 
  X, 
  Building2, 
  CreditCard,
  Trash2,
  UserPlus,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Save,
  ShieldCheck,
  ShieldAlert,
  ChevronDown
} from 'lucide-react';
import { useMlm } from '../../../context/MlmContext';
import { MemberRank, BinaryNode } from '../../../types/mlm';
import { THAI_BANKS, THAI_BANKS_ONLY, LAO_BANKS, SUPPORTED_BANKS } from '../../../data/mockMlmData';

const RANK_BADGES: Record<MemberRank, { bg: string; text: string; border: string }> = {
  'Member': { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' },
  'Bronze': { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
  'Silver': { bg: 'bg-slate-200', text: 'text-slate-800', border: 'border-slate-400' },
  'Gold': { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
  'Platinum': { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-300' },
  'Diamond': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
  'Crown Diamond': { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
};

interface MemberEditFormState {
  memberCode: string;
  name: string;
  rank: MemberRank;
  personalPv: number;
  leftPv: number;
  rightPv: number;
  sponsorName: string;
  sponsorCode: string;
  isActive: boolean;
}

export const AdminMembersView: React.FC = () => {
  const { 
    language, 
    binaryNodes, 
    updateMemberRank, 
    adjustMemberWallet, 
    adjustMemberPv, 
    toggleMemberStatus,
    updateMemberFullDetails,
    deleteMember,
    addNewMemberDirect,
    resetMembersToDefault,
    showToast 
  } = useMlm();

  const [search, setSearch] = useState('');
  const [selectedRank, setSelectedRank] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Full Edit Modal State
  const [editModalMember, setEditModalMember] = useState<BinaryNode | null>(null);
  const [editFormData, setEditFormData] = useState<MemberEditFormState>({
    memberCode: '',
    name: '',
    rank: 'Member',
    personalPv: 0,
    leftPv: 0,
    rightPv: 0,
    sponsorName: '',
    sponsorCode: '',
    isActive: true
  });

  // Inline Row Edit State
  const [inlineEditingId, setInlineEditingId] = useState<string | null>(null);
  const [inlineFormData, setInlineFormData] = useState<MemberEditFormState>({
    memberCode: '',
    name: '',
    rank: 'Member',
    personalPv: 0,
    leftPv: 0,
    rightPv: 0,
    sponsorName: '',
    sponsorCode: '',
    isActive: true
  });

  // Add Member Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addFormData, setAddFormData] = useState<MemberEditFormState>({
    memberCode: '',
    name: '',
    rank: 'Member',
    personalPv: 1000,
    leftPv: 0,
    rightPv: 0,
    sponsorName: 'กิตติศักดิ์ เจริญสุขสวัสดิ์',
    sponsorCode: 'TH889214',
    isActive: true
  });

  // Delete Confirm State
  const [deleteConfirmMember, setDeleteConfirmMember] = useState<BinaryNode | null>(null);

  // Quick Action Modals State
  const [rankModalNode, setRankModalNode] = useState<BinaryNode | null>(null);
  const [newRankVal, setNewRankVal] = useState<MemberRank>('Diamond');

  const [walletModalNode, setWalletModalNode] = useState<BinaryNode | null>(null);
  const [walletAmount, setWalletAmount] = useState('');
  const [walletNote, setWalletNote] = useState('');

  const [pvModalNode, setPvModalNode] = useState<BinaryNode | null>(null);
  const [pvAmount, setPvAmount] = useState('');

  // Member Bank Account Modal State
  const [bankModalNode, setBankModalNode] = useState<BinaryNode | null>(null);
  const [memberBankCode, setMemberBankCode] = useState('KBANK');
  const [memberBankName, setMemberBankName] = useState('ธนาคารกสิกรไทย (Kasikornbank)');
  const [memberAccountNum, setMemberAccountNum] = useState('');
  const [memberAccountName, setMemberAccountName] = useState('');
  const [memberBranch, setMemberBranch] = useState('สำนักงานใหญ่');
  const [isAddingNewBankToMember, setIsAddingNewBankToMember] = useState(false);

  const ranks: MemberRank[] = ['Member', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Crown Diamond'];
  const allMembers = Object.values(binaryNodes);

  // Filter members
  const filtered = allMembers.filter(m => {
    const matchSearch = !search.trim() || 
      m.memberCode.toLowerCase().includes(search.toLowerCase()) || 
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.sponsorName.toLowerCase().includes(search.toLowerCase()) ||
      m.sponsorCode.toLowerCase().includes(search.toLowerCase());
    const matchRank = selectedRank === 'all' || m.rank === selectedRank;
    const matchStatus = selectedStatus === 'all' || 
      (selectedStatus === 'active' && m.isActive) ||
      (selectedStatus === 'suspended' && !m.isActive);
    return matchSearch && matchRank && matchStatus;
  });

  const activeCount = allMembers.filter(m => m.isActive).length;
  const suspendedCount = allMembers.filter(m => !m.isActive).length;
  const totalSystemPv = allMembers.reduce((sum, m) => sum + (m.personalPv || 0), 0);

  // Open Full Edit Modal
  const handleOpenEditModal = (member: BinaryNode) => {
    setEditModalMember(member);
    setEditFormData({
      memberCode: member.memberCode,
      name: member.name,
      rank: member.rank,
      personalPv: member.personalPv || 0,
      leftPv: member.leftPv || 0,
      rightPv: member.rightPv || 0,
      sponsorName: member.sponsorName || '',
      sponsorCode: member.sponsorCode || '',
      isActive: member.isActive
    });
  };

  // Save Full Edit Modal
  const handleSaveEditModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModalMember) return;

    if (!editFormData.memberCode.trim()) {
      showToast(language === 'th' ? 'กรุณาระบุรหัสสมาชิก' : 'Please enter Member Code', 'error');
      return;
    }
    if (!editFormData.name.trim()) {
      showToast(language === 'th' ? 'กรุณาระบุชื่อ-นามสกุล' : 'Please enter Full Name', 'error');
      return;
    }

    const result = updateMemberFullDetails(editModalMember.memberCode, {
      ...editFormData,
      memberCode: editFormData.memberCode.trim().toUpperCase(),
      name: editFormData.name.trim(),
      personalPv: Number(editFormData.personalPv) || 0,
      leftPv: Number(editFormData.leftPv) || 0,
      rightPv: Number(editFormData.rightPv) || 0,
    });

    if (result.success) {
      setEditModalMember(null);
    }
  };

  // Start Inline Editing for a row
  const handleStartInlineEdit = (member: BinaryNode) => {
    setInlineEditingId(member.memberCode);
    setInlineFormData({
      memberCode: member.memberCode,
      name: member.name,
      rank: member.rank,
      personalPv: member.personalPv || 0,
      leftPv: member.leftPv || 0,
      rightPv: member.rightPv || 0,
      sponsorName: member.sponsorName || '',
      sponsorCode: member.sponsorCode || '',
      isActive: member.isActive
    });
  };

  // Save Inline Editing
  const handleSaveInline = (originalCode: string) => {
    if (!inlineFormData.memberCode.trim()) {
      showToast(language === 'th' ? 'กรุณาระบุรหัสสมาชิก' : 'Please enter Member Code', 'error');
      return;
    }
    if (!inlineFormData.name.trim()) {
      showToast(language === 'th' ? 'กรุณาระบุชื่อ-นามสกุล' : 'Please enter Full Name', 'error');
      return;
    }

    const result = updateMemberFullDetails(originalCode, {
      ...inlineFormData,
      memberCode: inlineFormData.memberCode.trim().toUpperCase(),
      name: inlineFormData.name.trim(),
      personalPv: Number(inlineFormData.personalPv) || 0,
      leftPv: Number(inlineFormData.leftPv) || 0,
      rightPv: Number(inlineFormData.rightPv) || 0,
    });

    if (result.success) {
      setInlineEditingId(null);
    }
  };

  // Handle Add Member
  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addFormData.memberCode.trim()) {
      showToast(language === 'th' ? 'กรุณาระบุรหัสสมาชิกใหม่' : 'Please enter Member Code', 'error');
      return;
    }
    if (!addFormData.name.trim()) {
      showToast(language === 'th' ? 'กรุณาระบุชื่อ-นามสกุล' : 'Please enter Full Name', 'error');
      return;
    }

    const result = addNewMemberDirect({
      ...addFormData,
      memberCode: addFormData.memberCode.trim().toUpperCase(),
      name: addFormData.name.trim(),
      personalPv: Number(addFormData.personalPv) || 0,
      leftPv: Number(addFormData.leftPv) || 0,
      rightPv: Number(addFormData.rightPv) || 0,
    });

    if (result.success) {
      setIsAddModalOpen(false);
      setAddFormData({
        memberCode: '',
        name: '',
        rank: 'Member',
        personalPv: 1000,
        leftPv: 0,
        rightPv: 0,
        sponsorName: 'กิตติศักดิ์ เจริญสุขสวัสดิ์',
        sponsorCode: 'TH889214',
        isActive: true
      });
    }
  };

  // Handle Delete Member
  const handleDeleteMember = () => {
    if (!deleteConfirmMember) return;
    deleteMember(deleteConfirmMember.memberCode);
    setDeleteConfirmMember(null);
  };

  // Bank Modal Handlers
  const handleOpenMemberBankModal = (member: BinaryNode) => {
    setBankModalNode(member);
    setMemberAccountName(member.name);
    setMemberBankCode('KBANK');
    setMemberBankName('ธนาคารกสิกรไทย (Kasikornbank)');
    setMemberAccountNum('045-8-91234-5');
    setMemberBranch('สาขา สยามพารากอน');
    setIsAddingNewBankToMember(false);
  };

  const handleSaveMemberBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberAccountNum.trim()) {
      showToast(language === 'th' ? 'กรุณากรอกเลขที่บัญชีธนาคาร' : 'Please enter account number', 'error');
      return;
    }
    showToast(
      language === 'th' 
        ? `เพิ่มบัญชีธนาคาร ${memberBankName} (${memberAccountNum}) ให้สมาชิก ${bankModalNode?.name} สำเร็จ!` 
        : `Added bank account for ${bankModalNode?.name} successfully!`,
      'success'
    );
    setIsAddingNewBankToMember(false);
  };

  // Rank Submit
  const handleRankSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rankModalNode) return;
    updateMemberRank(rankModalNode.memberCode, newRankVal);
    setRankModalNode(null);
  };

  // Wallet Submit
  const handleWalletSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletModalNode) return;
    const amt = parseFloat(walletAmount);
    if (isNaN(amt)) return;
    adjustMemberWallet(walletModalNode.memberCode, amt, walletNote || 'Admin Wallet Adjustment');
    setWalletModalNode(null);
    setWalletAmount('');
    setWalletNote('');
  };

  // PV Submit
  const handlePvSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pvModalNode) return;
    const pv = parseInt(pvAmount, 10);
    if (isNaN(pv)) return;
    adjustMemberPv(pvModalNode.memberCode, pv);
    setPvModalNode(null);
    setPvAmount('');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      
      {/* Top Header and Controls */}
      <div className="p-5 border-b border-slate-100 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shadow-2xs">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>{language === 'th' ? 'จัดการข้อมูลสมาชิกและตำแหน่งทางธุรกิจ' : 'Member & Rank Administration'}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">
                    Admin Edit Mode
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === 'th' 
                    ? `ผู้ดูแลระบบสามารถแก้ไขได้ทุกคอลัมน์: รหัสสมาชิก, ชื่อ-นามสกุล, ตำแหน่ง, คะแนน PV (ส่วนตัว/ซ้าย/ขวา), ผู้แนะนำ, สถานะ และการจัดการ`
                    : `Admin can edit all columns: Member Code, Full Name, Rank, Personal PV, Left PV, Right PV, Sponsor, Status & Actions`}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Header Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                const autoCode = `TH88${Math.floor(1000 + Math.random() * 9000)}`;
                setAddFormData(prev => ({ ...prev, memberCode: autoCode }));
                setIsAddModalOpen(true);
              }}
              className="px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>{language === 'th' ? '+ เพิ่มสมาชิกรหัสใหม่' : '+ Add New Member'}</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm(language === 'th' ? 'ต้องการรีเซ็ตข้อมูลสมาชิกทั้งหมดกลับเป็นค่าเริ่มต้นหรือไม่?' : 'Reset all members to default data?')) {
                  resetMembersToDefault();
                }
              }}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              title={language === 'th' ? 'รีเซ็ตข้อมูลสมาชิก' : 'Reset Members'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'th' ? 'รีเซ็ตข้อมูล' : 'Reset Demo'}</span>
            </button>
          </div>
        </div>

        {/* Status Counters Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-medium">{language === 'th' ? 'สมาชิกทั้งหมด' : 'Total Members'}</span>
            <span className="font-mono font-bold text-slate-900 text-sm">{allMembers.length}</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 flex items-center justify-between">
            <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {language === 'th' ? 'เปิดใช้งาน (Active)' : 'Active'}
            </span>
            <span className="font-mono font-bold text-emerald-800 text-sm">{activeCount}</span>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 flex items-center justify-between">
            <span className="text-[11px] text-red-700 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              {language === 'th' ? 'ระงับ (Suspended)' : 'Suspended'}
            </span>
            <span className="font-mono font-bold text-red-800 text-sm">{suspendedCount}</span>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-2.5 flex items-center justify-between">
            <span className="text-[11px] text-indigo-700 font-medium">{language === 'th' ? 'PV รวมในระบบ' : 'Total System PV'}</span>
            <span className="font-mono font-bold text-indigo-800 text-sm">{totalSystemPv.toLocaleString()}</span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={language === 'th' ? 'ค้นหารหัส TH..., ชื่อสมาชิก, หรือผู้แนะนำ...' : 'Search code, name, or sponsor...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Rank Filter */}
          <select
            value={selectedRank}
            onChange={(e) => setSelectedRank(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer font-medium"
          >
            <option value="all">{language === 'th' ? 'ทุกตำแหน่ง (All Ranks)' : 'All Ranks'}</option>
            {ranks.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer font-medium"
          >
            <option value="all">{language === 'th' ? 'ทุกสถานะ (All Status)' : 'All Status'}</option>
            <option value="active">{language === 'th' ? 'เฉพาะใช้งานปกติ (Active)' : 'Active Only'}</option>
            <option value="suspended">{language === 'th' ? 'เฉพาะระงับชั่วคราว (Suspended)' : 'Suspended Only'}</option>
          </select>
        </div>
      </div>

      {/* Members Directory Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-600 font-semibold text-[11px] uppercase tracking-wider">
              <th className="py-3 px-3 min-w-[120px]">{language === 'th' ? 'รหัสสมาชิก (Member Code)' : 'Member Code'}</th>
              <th className="py-3 px-3 min-w-[170px]">{language === 'th' ? 'ชื่อ-นามสกุล (Full Name)' : 'Full Name'}</th>
              <th className="py-3 px-3 min-w-[110px]">{language === 'th' ? 'ตำแหน่ง (Rank)' : 'Rank'}</th>
              <th className="py-3 px-3 text-right min-w-[110px]">{language === 'th' ? 'PV ส่วนตัว (Personal PV)' : 'Personal PV'}</th>
              <th className="py-3 px-3 text-right min-w-[100px]">{language === 'th' ? 'PV ซ้าย (Left PV)' : 'Left PV'}</th>
              <th className="py-3 px-3 text-right min-w-[100px]">{language === 'th' ? 'PV ขวา (Right PV)' : 'Right PV'}</th>
              <th className="py-3 px-3 min-w-[150px]">{language === 'th' ? 'ผู้แนะนำ (Sponsor)' : 'Sponsor'}</th>
              <th className="py-3 px-3 text-center min-w-[100px]">{language === 'th' ? 'สถานะ (Status)' : 'Status'}</th>
              <th className="py-3 px-3 text-center min-w-[210px] bg-slate-100">{language === 'th' ? 'การจัดการ (Actions)' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400 text-xs">
                  {language === 'th' ? 'ไม่พบข้อมูลสมาชิกที่ตรงกับการค้นหา' : 'No members found matching your search.'}
                </td>
              </tr>
            ) : (
              filtered.map(member => {
                const isInline = inlineEditingId === member.memberCode;
                const badge = RANK_BADGES[member.rank] || RANK_BADGES['Member'];

                // --------------------- INLINE EDIT ROW ---------------------
                if (isInline) {
                  return (
                    <tr key={member.id} className="bg-amber-50/60 border-y-2 border-amber-300">
                      {/* 1. Member Code */}
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={inlineFormData.memberCode}
                          onChange={(e) => setInlineFormData(prev => ({ ...prev, memberCode: e.target.value.toUpperCase() }))}
                          className="w-full px-2 py-1 bg-white border border-indigo-400 rounded font-mono font-bold text-xs text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                          placeholder="TH..."
                        />
                      </td>

                      {/* 2. Full Name */}
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={inlineFormData.name}
                          onChange={(e) => setInlineFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                          placeholder="ชื่อ-นามสกุล"
                        />
                      </td>

                      {/* 3. Rank */}
                      <td className="py-2.5 px-3">
                        <select
                          value={inlineFormData.rank}
                          onChange={(e) => setInlineFormData(prev => ({ ...prev, rank: e.target.value as MemberRank }))}
                          className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-[11px] font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                        >
                          {ranks.map(r => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </td>

                      {/* 4. Personal PV */}
                      <td className="py-2.5 px-3 text-right">
                        <input
                          type="number"
                          value={inlineFormData.personalPv}
                          onChange={(e) => setInlineFormData(prev => ({ ...prev, personalPv: Number(e.target.value) || 0 }))}
                          className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-right font-mono font-bold text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                        />
                      </td>

                      {/* 5. Left PV */}
                      <td className="py-2.5 px-3 text-right">
                        <input
                          type="number"
                          value={inlineFormData.leftPv}
                          onChange={(e) => setInlineFormData(prev => ({ ...prev, leftPv: Number(e.target.value) || 0 }))}
                          className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-right font-mono text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                        />
                      </td>

                      {/* 6. Right PV */}
                      <td className="py-2.5 px-3 text-right">
                        <input
                          type="number"
                          value={inlineFormData.rightPv}
                          onChange={(e) => setInlineFormData(prev => ({ ...prev, rightPv: Number(e.target.value) || 0 }))}
                          className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-right font-mono text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                        />
                      </td>

                      {/* 7. Sponsor */}
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={inlineFormData.sponsorName}
                          onChange={(e) => setInlineFormData(prev => ({ ...prev, sponsorName: e.target.value }))}
                          className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                          placeholder="ชื่อผู้แนะนำ"
                        />
                      </td>

                      {/* 8. Status */}
                      <td className="py-2.5 px-3 text-center">
                        <select
                          value={inlineFormData.isActive ? 'active' : 'suspended'}
                          onChange={(e) => setInlineFormData(prev => ({ ...prev, isActive: e.target.value === 'active' }))}
                          className={`px-2 py-1 rounded text-[11px] font-bold border focus:outline-none ${
                            inlineFormData.isActive ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-red-50 text-red-800 border-red-300'
                          }`}
                        >
                          <option value="active">Active</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </td>

                      {/* 9. Actions (Save / Cancel Inline) */}
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleSaveInline(member.memberCode)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                            title={language === 'th' ? 'บันทึกการแก้ไข' : 'Save'}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{language === 'th' ? 'บันทึก' : 'Save'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setInlineEditingId(null)}
                            className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                            title={language === 'th' ? 'ยกเลิก' : 'Cancel'}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }

                // --------------------- NORMAL DISPLAY ROW ---------------------
                return (
                  <tr key={member.id} className="hover:bg-slate-50/80 transition-colors h-13 group">
                    {/* 1. Member Code */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-indigo-700 bg-indigo-50/70 px-2 py-0.5 rounded border border-indigo-100">
                          {member.memberCode}
                        </span>
                      </div>
                    </td>

                    {/* 2. Full Name */}
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-900 truncate max-w-[180px]">
                        {member.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {member.joinDate ? `Joined: ${member.joinDate}` : ''}
                      </div>
                    </td>

                    {/* 3. Rank */}
                    <td className="py-2.5 px-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                        {member.rank}
                      </span>
                    </td>

                    {/* 4. Personal PV */}
                    <td className="py-2.5 px-3 text-right">
                      <span className="font-mono font-bold text-slate-900 tabular-nums text-xs">
                        {member.personalPv.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400 ml-1">PV</span>
                    </td>

                    {/* 5. Left PV */}
                    <td className="py-2.5 px-3 text-right">
                      <span className="font-mono text-slate-700 tabular-nums">
                        {member.leftPv.toLocaleString()}
                      </span>
                    </td>

                    {/* 6. Right PV */}
                    <td className="py-2.5 px-3 text-right">
                      <span className="font-mono text-slate-700 tabular-nums">
                        {member.rightPv.toLocaleString()}
                      </span>
                    </td>

                    {/* 7. Sponsor */}
                    <td className="py-2.5 px-3">
                      <div className="text-slate-800 font-medium truncate max-w-[150px]" title={member.sponsorName}>
                        {member.sponsorName}
                      </div>
                      {member.sponsorCode && (
                        <div className="text-[10px] font-mono text-slate-400">
                          {member.sponsorCode}
                        </div>
                      )}
                    </td>

                    {/* 8. Status */}
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => toggleMemberStatus(member.memberCode)}
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                          member.isActive 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                            : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                        }`}
                        title={member.isActive ? (language === 'th' ? 'คลิกเพื่อระงับ' : 'Click to Suspend') : (language === 'th' ? 'คลิกเพื่อเปิดใช้งาน' : 'Click to Activate')}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${member.isActive ? 'bg-emerald-500' : 'bg-red-400'}`} />
                        <span>{member.isActive ? 'Active' : 'Suspended'}</span>
                      </button>
                    </td>

                    {/* 9. Actions Column (Comprehensive Toolset) */}
                    <td className="py-2.5 px-3 text-center bg-slate-50/50">
                      <div className="flex items-center justify-center gap-1">
                        
                        {/* Primary FULL EDIT Button (Requested!) */}
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(member)}
                          className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-[11px] font-bold flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                          title={language === 'th' ? 'แก้ไขข้อมูลสมาชิกทั้งหมด 8 รายการ (Edit All Fields)' : 'Edit Member Details'}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{language === 'th' ? 'แก้ไข' : 'Edit'}</span>
                        </button>

                        {/* Inline Quick Edit Toggle Button */}
                        <button
                          type="button"
                          onClick={() => handleStartInlineEdit(member)}
                          className="p-1 bg-white hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 border border-slate-200 rounded transition-colors cursor-pointer"
                          title={language === 'th' ? 'แก้ไขด่วนในตาราง (Quick Inline Edit)' : 'Quick Inline Edit'}
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>

                        {/* Change Rank button */}
                        <button
                          onClick={() => {
                            setRankModalNode(member);
                            setNewRankVal(member.rank);
                          }}
                          className="p-1 bg-white hover:bg-amber-50 text-slate-600 hover:text-amber-700 border border-slate-200 rounded transition-colors cursor-pointer"
                          title={language === 'th' ? 'ปรับตำแหน่ง' : 'Change Rank'}
                        >
                          <Award className="w-3 h-3" />
                        </button>

                        {/* Adjust Wallet button */}
                        <button
                          onClick={() => {
                            setWalletModalNode(member);
                            setWalletAmount('');
                          }}
                          className="p-1 bg-white hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200 rounded transition-colors cursor-pointer"
                          title={language === 'th' ? 'เติม/หักเงิน E-Wallet' : 'Adjust Wallet'}
                        >
                          <Wallet className="w-3 h-3" />
                        </button>

                        {/* Adjust PV button */}
                        <button
                          onClick={() => {
                            setPvModalNode(member);
                            setPvAmount('');
                          }}
                          className="p-1 bg-white hover:bg-purple-50 text-slate-600 hover:text-purple-700 border border-slate-200 rounded transition-colors cursor-pointer"
                          title={language === 'th' ? 'เติมคะแนน PV' : 'Add PV'}
                        >
                          <Sparkles className="w-3 h-3" />
                        </button>

                        {/* Manage Bank Accounts button */}
                        <button
                          onClick={() => handleOpenMemberBankModal(member)}
                          className="p-1 bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 rounded transition-colors cursor-pointer"
                          title={language === 'th' ? 'ดู / เพิ่มบัญชีธนาคารรับเงิน' : 'Manage Bank Accounts'}
                        >
                          <Building2 className="w-3 h-3" />
                        </button>

                        {/* Delete Member Button */}
                        <button
                          onClick={() => setDeleteConfirmMember(member)}
                          className="p-1 bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-200 rounded transition-colors cursor-pointer"
                          title={language === 'th' ? 'ลบรหัสสมาชิกนี้' : 'Delete Member'}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: FULL MEMBER EDIT MODAL (THE MAIN EDIT FEATURE)                   */}
      {/* ========================================================================= */}
      {editModalMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 text-slate-900 shadow-2xl border border-slate-200 my-8 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {language === 'th' ? 'แก้ไขข้อมูลสมาชิกและสายงาน' : 'Edit Member Profile & Business Data'}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    {editModalMember.name} · {editModalMember.memberCode}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditModalMember(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveEditModal} className="space-y-4 text-xs">
              
              {/* Row 1: Member Code & Full Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {language === 'th' ? 'รหัสสมาชิก (Member Code):' : 'Member Code:'}
                  </label>
                  <input
                    type="text"
                    value={editFormData.memberCode}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, memberCode: e.target.value.toUpperCase() }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="เช่น TH889214"
                    required
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    {language === 'th' ? '* หากแก้ไขรหัส ระบบจะอัปเดตสายงานที่เกี่ยวข้องให้อัตโนมัติ' : '* Changing code updates all downline links'}
                  </p>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {language === 'th' ? 'ชื่อ-นามสกุล (Full Name):' : 'Full Name:'}
                  </label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="ชื่อและนามสกุล"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Rank & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {language === 'th' ? 'ตำแหน่งทางธุรกิจ (Rank):' : 'Business Rank:'}
                  </label>
                  <select
                    value={editFormData.rank}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, rank: e.target.value as MemberRank }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {ranks.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {language === 'th' ? 'สถานะสมาชิก (Status):' : 'Account Status:'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setEditFormData(prev => ({ ...prev, isActive: true }))}
                      className={`py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        editFormData.isActive 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-400 ring-1 ring-emerald-400' 
                          : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Active</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditFormData(prev => ({ ...prev, isActive: false }))}
                      className={`py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        !editFormData.isActive 
                          ? 'bg-red-50 text-red-700 border-red-400 ring-1 ring-red-400' 
                          : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-red-400" />
                      <span>Suspended</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 3: PV Management Strip (Personal PV, Left PV, Right PV) */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>{language === 'th' ? 'ข้อมูลคะแนนสะสม (PV Points Management)' : 'PV Points Management'}</span>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1 text-[11px]">
                      {language === 'th' ? 'PV ส่วนตัว:' : 'Personal PV:'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editFormData.personalPv}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, personalPv: Number(e.target.value) || 0 }))}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold text-slate-900 text-right focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1 text-[11px]">
                      {language === 'th' ? 'PV สายงานซ้าย:' : 'Left Leg PV:'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editFormData.leftPv}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, leftPv: Number(e.target.value) || 0 }))}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-semibold text-slate-800 text-right focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1 text-[11px]">
                      {language === 'th' ? 'PV สายงานขวา:' : 'Right Leg PV:'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editFormData.rightPv}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, rightPv: Number(e.target.value) || 0 }))}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-semibold text-slate-800 text-right focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Quick PV Preset Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-500 font-medium">⚡ เติมด่วน:</span>
                  <button
                    type="button"
                    onClick={() => setEditFormData(prev => ({ ...prev, personalPv: prev.personalPv + 500 }))}
                    className="px-2 py-0.5 bg-white hover:bg-purple-50 border border-slate-200 rounded text-[10px] font-semibold text-purple-700 cursor-pointer"
                  >
                    +500 PV ส่วนตัว
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditFormData(prev => ({ ...prev, personalPv: prev.personalPv + 1000 }))}
                    className="px-2 py-0.5 bg-white hover:bg-purple-50 border border-slate-200 rounded text-[10px] font-semibold text-purple-700 cursor-pointer"
                  >
                    +1,000 PV ส่วนตัว
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditFormData(prev => ({ ...prev, leftPv: prev.leftPv + 10000, rightPv: prev.rightPv + 10000 }))}
                    className="px-2 py-0.5 bg-white hover:bg-blue-50 border border-slate-200 rounded text-[10px] font-semibold text-blue-700 cursor-pointer"
                  >
                    +10,000 PV ซ้าย/ขวา
                  </button>
                </div>
              </div>

              {/* Row 4: Sponsor (Name & Code) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {language === 'th' ? 'ชื่อผู้แนะนำ (Sponsor Name):' : 'Sponsor Name:'}
                  </label>
                  <input
                    type="text"
                    value={editFormData.sponsorName}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, sponsorName: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="เช่น วรพจน์ ธนบูลย์"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {language === 'th' ? 'รหัสผู้แนะนำ (Sponsor Code):' : 'Sponsor Code:'}
                  </label>
                  <input
                    type="text"
                    value={editFormData.sponsorCode}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, sponsorCode: e.target.value.toUpperCase() }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="เช่น TH880001"
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-lg font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{language === 'th' ? 'บันทึกการแก้ไขทั้งหมด' : 'Save Changes'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditModalMember(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors cursor-pointer"
                >
                  {language === 'th' ? 'ยกเลิก' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD NEW MEMBER MODAL                                             */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 text-slate-900 shadow-2xl border border-slate-200 my-8 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {language === 'th' ? 'เพิ่มสมาชิกรหัสใหม่โดยผู้ดูแลระบบ' : 'Add New Member Directly'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {language === 'th' ? 'กำหนดรหัส ชื่อ ตำแหน่ง คะแนน PV และผู้แนะนำได้ทันที' : 'Configure code, name, rank, PV points and sponsor'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMemberSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {language === 'th' ? 'รหัสสมาชิก (Member Code):' : 'Member Code:'}
                  </label>
                  <input
                    type="text"
                    value={addFormData.memberCode}
                    onChange={(e) => setAddFormData(prev => ({ ...prev, memberCode: e.target.value.toUpperCase() }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="เช่น TH889901"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {language === 'th' ? 'ชื่อ-นามสกุล (Full Name):' : 'Full Name:'}
                  </label>
                  <input
                    type="text"
                    value={addFormData.name}
                    onChange={(e) => setAddFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="เช่น สมชาย ใจมั่น"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {language === 'th' ? 'ตำแหน่งทางธุรกิจ (Rank):' : 'Rank:'}
                  </label>
                  <select
                    value={addFormData.rank}
                    onChange={(e) => setAddFormData(prev => ({ ...prev, rank: e.target.value as MemberRank }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {ranks.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {language === 'th' ? 'สถานะ (Status):' : 'Status:'}
                  </label>
                  <select
                    value={addFormData.isActive ? 'active' : 'suspended'}
                    onChange={(e) => setAddFormData(prev => ({ ...prev, isActive: e.target.value === 'active' }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="active">Active (เปิดใช้งานปกติ)</option>
                    <option value="suspended">Suspended (ระงับชั่วคราว)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-3 gap-2.5">
                <div>
                  <label className="font-bold text-slate-700 block mb-1 text-[11px]">Personal PV:</label>
                  <input
                    type="number"
                    min="0"
                    value={addFormData.personalPv}
                    onChange={(e) => setAddFormData(prev => ({ ...prev, personalPv: Number(e.target.value) || 0 }))}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold text-right text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1 text-[11px]">Left PV:</label>
                  <input
                    type="number"
                    min="0"
                    value={addFormData.leftPv}
                    onChange={(e) => setAddFormData(prev => ({ ...prev, leftPv: Number(e.target.value) || 0 }))}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-right text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1 text-[11px]">Right PV:</label>
                  <input
                    type="number"
                    min="0"
                    value={addFormData.rightPv}
                    onChange={(e) => setAddFormData(prev => ({ ...prev, rightPv: Number(e.target.value) || 0 }))}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-right text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {language === 'th' ? 'ชื่อผู้แนะนำ:' : 'Sponsor Name:'}
                  </label>
                  <input
                    type="text"
                    value={addFormData.sponsorName}
                    onChange={(e) => setAddFormData(prev => ({ ...prev, sponsorName: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                    placeholder="กิตติศักดิ์ เจริญสุขสวัสดิ์"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {language === 'th' ? 'รหัสผู้แนะนำ:' : 'Sponsor Code:'}
                  </label>
                  <input
                    type="text"
                    value={addFormData.sponsorCode}
                    onChange={(e) => setAddFormData(prev => ({ ...prev, sponsorCode: e.target.value.toUpperCase() }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900"
                    placeholder="TH889214"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{language === 'th' ? 'เพิ่มสมาชิกเข้าระบบ' : 'Add Member to System'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors cursor-pointer"
                >
                  {language === 'th' ? 'ยกเลิก' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: DELETE CONFIRMATION                                              */}
      {/* ========================================================================= */}
      {deleteConfirmMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-slate-900 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-base text-slate-900">
                {language === 'th' ? 'ยืนยันการลบรหัสสมาชิก?' : 'Confirm Member Deletion'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'th' 
                  ? `คุณแน่ใจหรือไม่ว่าต้องการลบรหัส ${deleteConfirmMember.memberCode} (${deleteConfirmMember.name}) ออกจากระบบ?` 
                  : `Are you sure you want to delete ${deleteConfirmMember.memberCode} (${deleteConfirmMember.name})?`}
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleDeleteMember}
                className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold text-xs cursor-pointer"
              >
                {language === 'th' ? 'ลบข้อมูลทันที' : 'Delete Now'}
              </button>
              <button
                type="button"
                onClick={() => setDeleteConfirmMember(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                {language === 'th' ? 'ยกเลิก' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: ADJUST RANK QUICK MODAL                                          */}
      {/* ========================================================================= */}
      {rankModalNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-slate-900 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base mb-1">
              {language === 'th' ? 'ปรับเปลี่ยนตำแหน่งทางธุรกิจ' : 'Adjust Member Business Rank'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {rankModalNode.name} ({rankModalNode.memberCode})
            </p>

            <form onSubmit={handleRankSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {language === 'th' ? 'เลือกตำแหน่งใหม่:' : 'Select New Rank:'}
                </label>
                <select
                  value={newRankVal}
                  onChange={(e) => setNewRankVal(e.target.value as MemberRank)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {ranks.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold cursor-pointer"
                >
                  {language === 'th' ? 'บันทึกการปรับตำแหน่ง' : 'Update Rank'}
                </button>
                <button
                  type="button"
                  onClick={() => setRankModalNode(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                >
                  {language === 'th' ? 'ยกเลิก' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: ADJUST WALLET MODAL                                              */}
      {/* ========================================================================= */}
      {walletModalNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-slate-900 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base mb-1">
              {language === 'th' ? 'ปรับยอดเงิน E-Wallet' : 'Adjust Member E-Wallet'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {walletModalNode.name} ({walletModalNode.memberCode})
            </p>

            <form onSubmit={handleWalletSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {language === 'th' ? 'จำนวนเงิน (+ เพื่อเติม, - เพื่อหัก):' : 'Amount (+ to credit, - to debit):'}
                </label>
                <input
                  type="number"
                  placeholder="เช่น 5000 หรือ -2000"
                  value={walletAmount}
                  onChange={(e) => setWalletAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {language === 'th' ? 'เหตุผลการปรับปรุง:' : 'Adjustment Reason:'}
                </label>
                <input
                  type="text"
                  placeholder={language === 'th' ? 'เช่น โบนัสโปรโมชั่นพิเศษ' : 'e.g. Special promotional bonus'}
                  value={walletNote}
                  onChange={(e) => setWalletNote(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold cursor-pointer"
                >
                  {language === 'th' ? 'บันทึกยอดเงิน' : 'Update Wallet'}
                </button>
                <button
                  type="button"
                  onClick={() => setWalletModalNode(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                >
                  {language === 'th' ? 'ยกเลิก' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: ADJUST PV QUICK MODAL                                            */}
      {/* ========================================================================= */}
      {pvModalNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-slate-900 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base mb-1">
              {language === 'th' ? 'เพิ่มคะแนน PV ส่วนตัว' : 'Credit Personal PV Points'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {pvModalNode.name} ({pvModalNode.memberCode}) · ปัจจุบัน {pvModalNode.personalPv.toLocaleString()} PV
            </p>

            <form onSubmit={handlePvSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {language === 'th' ? 'จำนวน PV ที่ต้องการเพิ่ม:' : 'PV Points to Add:'}
                </label>
                <input
                  type="number"
                  placeholder="เช่น 500"
                  value={pvAmount}
                  onChange={(e) => setPvAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold cursor-pointer"
                >
                  {language === 'th' ? 'เพิ่มคะแนน PV ทันที' : 'Credit PV'}
                </button>
                <button
                  type="button"
                  onClick={() => setPvModalNode(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                >
                  {language === 'th' ? 'ยกเลิก' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 7: MEMBER BANK ACCOUNTS MODAL                                       */}
      {/* ========================================================================= */}
      {bankModalNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 text-slate-900 shadow-2xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {language === 'th' ? 'บัญชีธนาคารสำหรับรับเงินของสมาชิก' : 'Member Bank Accounts'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {bankModalNode.name} ({bankModalNode.memberCode}) · ตำแหน่ง {bankModalNode.rank}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBankModalNode(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Existing Accounts List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  {language === 'th' ? 'บัญชีที่ผูกไว้ในระบบ:' : 'Linked Accounts:'}
                </span>
                
                <button
                  type="button"
                  onClick={() => setIsAddingNewBankToMember(!isAddingNewBankToMember)}
                  className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{language === 'th' ? '+ เพิ่มบัญชีธนาคาร (+ Add Bank Account)' : '+ Add Bank Account'}</span>
                </button>
              </div>

              {/* Sample Linked Bank Card */}
              <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">
                      KB
                    </span>
                    <span className="font-bold text-slate-900">ธนาคารกสิกรไทย (Kasikornbank)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                    ★ บัญชีหลัก
                  </span>
                </div>
                <div className="flex items-center justify-between font-mono pt-1">
                  <span className="font-bold text-slate-800 text-sm">045-8-91234-5</span>
                  <span className="text-[10px] text-slate-500">สาขา สยามสแควร์</span>
                </div>
                <div className="text-[11px] text-slate-600">
                  ชื่อบัญชี: <strong>{bankModalNode.name}</strong>
                </div>
              </div>
            </div>

            {/* Form to Add New Bank if toggled */}
            {isAddingNewBankToMember && (
              <form onSubmit={handleSaveMemberBank} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
                <div className="font-bold text-slate-900 text-xs border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-blue-600" />
                  <span>{language === 'th' ? 'กรอกข้อมูลบัญชีธนาคารใหม่' : 'New Bank Account Details'}</span>
                </div>

                {/* Quick 1-Click Bank Buttons Bar */}
                <div className="space-y-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-700">⚡ {language === 'th' ? 'เลือกธนาคารด่วน:' : 'Quick Bank:'}</span>
                    <span className="text-[10px] text-slate-400">🇱🇦 ลาว / 🇹🇭 ไทย</span>
                  </div>

                  {/* Lao Banks */}
                  <div>
                    <span className="text-[10px] font-bold text-red-700 flex items-center gap-1 mb-1">
                      <span>🇱🇦</span> {language === 'th' ? 'สปป.ลาว:' : 'Lao Banks:'}
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
                      {LAO_BANKS.map(b => (
                        <button
                          key={b.code}
                          type="button"
                          onClick={() => {
                            setMemberBankCode(b.code);
                            setMemberBankName(b.name);
                          }}
                          className={`p-1.5 rounded border text-left transition-all cursor-pointer flex items-center gap-1.5 ${
                            memberBankCode === b.code
                              ? 'border-red-500 bg-red-50 ring-1 ring-red-400'
                              : 'border-slate-200 bg-white hover:bg-slate-50'
                          }`}
                        >
                          <div className={`w-4 h-4 shrink-0 rounded ${b.color} text-white font-bold text-[8px] flex items-center justify-center`}>
                            {b.code.slice(0, 3)}
                          </div>
                          <div className="font-bold text-[10px] text-slate-900 truncate">{b.code}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Thai Banks */}
                  <div>
                    <span className="text-[10px] font-bold text-blue-700 flex items-center gap-1 mb-1">
                      <span>🇹🇭</span> {language === 'th' ? 'ไทย:' : 'Thai Banks:'}
                    </span>
                    <div className="grid grid-cols-5 gap-1">
                      {THAI_BANKS_ONLY.map(b => (
                        <button
                          key={b.code}
                          type="button"
                          onClick={() => {
                            setMemberBankCode(b.code);
                            setMemberBankName(b.name);
                          }}
                          className={`p-1 rounded border text-center transition-all cursor-pointer ${
                            memberBankCode === b.code
                              ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-400'
                              : 'border-slate-200 bg-white hover:bg-slate-50'
                          }`}
                        >
                          <div className="font-bold text-[9px] text-slate-800 truncate">{b.code}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {language === 'th' ? 'เลือกธนาคาร (Select Bank):' : 'Bank:'}
                  </label>
                  <select
                    value={memberBankCode}
                    onChange={(e) => {
                      setMemberBankCode(e.target.value);
                      const f = SUPPORTED_BANKS.find(b => b.code === e.target.value) || THAI_BANKS.find(b => b.code === e.target.value);
                      if (f) setMemberBankName(f.name);
                    }}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900"
                    required
                  >
                    <optgroup label="🇱🇦 ธนาคารแห่ง สปป.ลาว (Lao Banks)">
                      {LAO_BANKS.map(b => (
                        <option key={b.code} value={b.code}>🇱🇦 {b.name} ({b.code})</option>
                      ))}
                    </optgroup>
                    <optgroup label="🇹🇭 ธนาคารไทย (Thailand Banks)">
                      {THAI_BANKS_ONLY.map(b => (
                        <option key={b.code} value={b.code}>🇹🇭 {b.name} ({b.code})</option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      {language === 'th' ? 'เลขที่บัญชี:' : 'Account Number:'}
                    </label>
                    <input
                      type="text"
                      value={memberAccountNum}
                      onChange={(e) => setMemberAccountNum(e.target.value)}
                      placeholder="เช่น 045-8-91234-5"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-slate-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      {language === 'th' ? 'สาขา:' : 'Branch:'}
                    </label>
                    <input
                      type="text"
                      value={memberBranch}
                      onChange={(e) => setMemberBranch(e.target.value)}
                      placeholder="เช่น สำนักงานใหญ่"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {language === 'th' ? 'ชื่อบัญชี:' : 'Account Name:'}
                  </label>
                  <input
                    type="text"
                    value={memberAccountName}
                    onChange={(e) => setMemberAccountName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingNewBankToMember(false)}
                    className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
                  >
                    {language === 'th' ? 'ยกเลิก' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-xs cursor-pointer"
                  >
                    {language === 'th' ? 'บันทึกบัญชีธนาคาร' : 'Save Account'}
                  </button>
                </div>
              </form>
            )}

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setBankModalNode(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-xs cursor-pointer"
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

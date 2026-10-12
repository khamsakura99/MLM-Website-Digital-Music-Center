import React, { useState } from 'react';
import { 
  ArrowDownToLine, 
  CheckCircle, 
  XCircle, 
  Search, 
  Clock, 
  Building2,
  DollarSign
} from 'lucide-react';
import { useMlm } from '../../../context/MlmContext';

export const AdminWithdrawalsView: React.FC = () => {
  const { 
    language, 
    withdrawalRequests, 
    approveWithdrawal, 
    rejectWithdrawal 
  } = useMlm();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const filtered = withdrawalRequests.filter(w => {
    const matchSearch = !search.trim() || 
      w.memberCode.toLowerCase().includes(search.toLowerCase()) || 
      w.memberName.toLowerCase().includes(search.toLowerCase()) || 
      w.accountNumber.includes(search);
    const matchStatus = statusFilter === 'all' || w.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingId) return;
    rejectWithdrawal(rejectingId, rejectReason || 'ข้อมูลบัญชีธนาคารไม่ถูกต้อง');
    setRejectingId(null);
    setRejectReason('');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      
      {/* Header */}
      <div className="p-5 border-b border-slate-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ArrowDownToLine className="w-5 h-5 text-indigo-600" />
              <span>{language === 'th' ? 'อนุมัติคำขอถอนเงินเข้าบัญชีธนาคาร' : 'Member Bank Withdrawal Authorizations'}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'th' ? `พบรายการถอนเงินทั้งหมด ${filtered.length} รายการ` : `Showing ${filtered.length} withdrawal requests`}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={language === 'th' ? 'ค้นหารหัส, ชื่อ หรือเลขที่บัญชี...' : 'Search code, name, or account...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded transition-colors ${statusFilter === 'all' ? 'bg-white font-semibold text-slate-900 shadow-2xs' : 'text-slate-600'}`}
            >
              {language === 'th' ? 'ทั้งหมด' : 'All'}
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1 rounded transition-colors ${statusFilter === 'pending' ? 'bg-white font-semibold text-amber-700 shadow-2xs' : 'text-slate-600'}`}
            >
              {language === 'th' ? 'รออนุมัติ' : 'Pending'}
            </button>
            <button
              onClick={() => setStatusFilter('approved')}
              className={`px-3 py-1 rounded transition-colors ${statusFilter === 'approved' ? 'bg-white font-semibold text-emerald-700 shadow-2xs' : 'text-slate-600'}`}
            >
              {language === 'th' ? 'อนุมัติแล้ว' : 'Approved'}
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
              <th className="py-2.5 px-4">{language === 'th' ? 'รหัสสมาชิก' : 'Member ID'}</th>
              <th className="py-2.5 px-4">{language === 'th' ? 'ชื่อผู้ขอถอน' : 'Member Name'}</th>
              <th className="py-2.5 px-4">{language === 'th' ? 'บัญชีธนาคารรับเงิน' : 'Destination Bank'}</th>
              <th className="py-2.5 px-3 text-right">{language === 'th' ? 'ยอดที่ขอถอน' : 'Gross Amount'}</th>
              <th className="py-2.5 px-3 text-right">{language === 'th' ? 'ค่าธรรมเนียม' : 'Fee'}</th>
              <th className="py-2.5 px-3 text-right">{language === 'th' ? 'ยอดโอนสุทธิ' : 'Net Transfer'}</th>
              <th className="py-2.5 px-4">{language === 'th' ? 'วัน-เวลาขอถอน' : 'Request Date'}</th>
              <th className="py-2.5 px-3 text-center">{language === 'th' ? 'สถานะ' : 'Status'}</th>
              <th className="py-2.5 px-4 text-center">{language === 'th' ? 'การจัดการ' : 'Action'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(w => (
              <tr key={w.id} className="hover:bg-slate-50/80 transition-colors h-12">
                <td className="py-2 px-4 font-mono font-bold text-indigo-700">
                  {w.memberCode}
                </td>
                <td className="py-2 px-4 font-medium text-slate-900 truncate max-w-[150px]">
                  {w.memberName}
                </td>
                <td className="py-2 px-4 text-slate-800">
                  <span className="font-semibold block">{w.bankName}</span>
                  <span className="font-mono text-slate-500 text-[11px]">{w.accountNumber} ({w.accountName})</span>
                </td>
                <td className="py-2 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                  ฿{w.amount.toLocaleString()}
                </td>
                <td className="py-2 px-3 text-right font-mono text-slate-500 tabular-nums">
                  ฿{w.fee}
                </td>
                <td className="py-2 px-3 text-right font-mono font-bold text-emerald-700 tabular-nums">
                  ฿{w.netAmount.toLocaleString()}
                </td>
                <td className="py-2 px-4 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                  {w.requestDate}
                </td>
                <td className="py-2 px-3 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    w.status === 'approved' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : w.status === 'rejected' 
                      ? 'bg-red-50 text-red-700 border border-red-200' 
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {w.status === 'approved' ? (language === 'th' ? 'โอนแล้ว' : 'Approved') : w.status === 'rejected' ? (language === 'th' ? 'ปฏิเสธ' : 'Rejected') : (language === 'th' ? 'รออนุมัติ' : 'Pending')}
                  </span>
                </td>
                <td className="py-2 px-4 text-center">
                  {w.status === 'pending' ? (
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => approveWithdrawal(w.id)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        {language === 'th' ? 'อนุมัติ' : 'Approve'}
                      </button>
                      <button
                        onClick={() => setRejectingId(w.id)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-red-100 text-slate-700 hover:text-red-700 rounded text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        {language === 'th' ? 'ปฏิเสธ' : 'Reject'}
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-mono">
                      {w.processedDate || '-'}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reject Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-slate-900 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base mb-1">
              {language === 'th' ? 'ระบุเหตุผลการปฏิเสธคำขอถอนเงิน' : 'Reject Withdrawal Request'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {language === 'th' ? 'ยอดเงินจะถูกคืนกลับเข้ากระเป๋า E-Wallet ของสมาชิก' : 'Funds will remain in the member wallet balance.'}
            </p>

            <form onSubmit={handleConfirmReject} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {language === 'th' ? 'เหตุผล:' : 'Reason:'}
                </label>
                <input
                  type="text"
                  placeholder="เช่น ข้อมูลเลขที่บัญชีไม่ตรงกับชื่อผู้สมัคร"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold"
                >
                  {language === 'th' ? 'ยืนยันปฏิเสธคำขอ' : 'Confirm Reject'}
                </button>
                <button
                  type="button"
                  onClick={() => setRejectingId(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
                >
                  {language === 'th' ? 'ยกเลิก' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

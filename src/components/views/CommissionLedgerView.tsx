import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShoppingBag,
  DollarSign
} from 'lucide-react';
import { useMlm } from '../../context/MlmContext';

export const CommissionLedgerView: React.FC = () => {
  const { language, transactions, showToast } = useMlm();
  const [filterType, setFilterType] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = transactions.filter(tx => {
    const matchType = filterType === 'all' || tx.type === filterType;
    const matchSearch = !search.trim() || 
      tx.description.toLowerCase().includes(search.toLowerCase()) || 
      tx.refCode.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const handleExportCsv = () => {
    showToast(language === 'th' ? 'กำลังดาวน์โหลดรายการเดินบัญชี (CSV)...' : 'Exporting ledger CSV...', 'info');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      
      {/* Header & Filter Controls */}
      <div className="p-5 border-b border-slate-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>{language === 'th' ? 'รายการเดินบัญชีการเงิน (Financial Ledger)' : 'Transaction Ledger'}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'th' ? `ประวัติการเคลื่อนไหวทางบัญชีทั้งหมด ${filtered.length} รายการ` : `Showing ${filtered.length} transaction entries`}
            </p>
          </div>

          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>{language === 'th' ? 'ส่งออก Statement' : 'Export Statement'}</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={language === 'th' ? 'ค้นหาเลขอ้างอิง หรือคำอธิบาย...' : 'Search reference code or memo...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs overflow-x-auto">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${filterType === 'all' ? 'bg-white font-semibold text-slate-900 shadow-2xs' : 'text-slate-600'}`}
            >
              {language === 'th' ? 'ทั้งหมด' : 'All'}
            </button>
            <button
              onClick={() => setFilterType('commission')}
              className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${filterType === 'commission' ? 'bg-white font-semibold text-emerald-700 shadow-2xs' : 'text-slate-600'}`}
            >
              {language === 'th' ? 'คอมมิชชั่น' : 'Commissions'}
            </button>
            <button
              onClick={() => setFilterType('transfer_out')}
              className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${filterType === 'transfer_out' ? 'bg-white font-semibold text-blue-700 shadow-2xs' : 'text-slate-600'}`}
            >
              {language === 'th' ? 'โอนออก' : 'Transfer Out'}
            </button>
            <button
              onClick={() => setFilterType('order_payment')}
              className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${filterType === 'order_payment' ? 'bg-white font-semibold text-slate-900 shadow-2xs' : 'text-slate-600'}`}
            >
              {language === 'th' ? 'ชำระค่าสินค้า' : 'Purchases'}
            </button>
            <button
              onClick={() => setFilterType('withdraw')}
              className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${filterType === 'withdraw' ? 'bg-white font-semibold text-amber-700 shadow-2xs' : 'text-slate-600'}`}
            >
              {language === 'th' ? 'ถอนเงิน' : 'Withdrawals'}
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
              <th className="py-2.5 px-4">{language === 'th' ? 'วัน-เวลา' : 'Timestamp'}</th>
              <th className="py-2.5 px-4">{language === 'th' ? 'ประเภท' : 'Type'}</th>
              <th className="py-2.5 px-4">{language === 'th' ? 'รายละเอียดรายการ' : 'Description'}</th>
              <th className="py-2.5 px-4 font-mono">{language === 'th' ? 'เลขอ้างอิง' : 'Ref Code'}</th>
              <th className="py-2.5 px-4 text-right">{language === 'th' ? 'จำนวนเงิน (บาท)' : 'Amount (THB)'}</th>
              <th className="py-2.5 px-4 text-right">{language === 'th' ? 'ยอดคงเหลือ' : 'Balance After'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(tx => (
              <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors h-11">
                <td className="py-2 px-4 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                  {tx.timestamp}
                </td>
                <td className="py-2 px-4 whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    tx.amount > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {tx.type.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td className="py-2 px-4 font-medium text-slate-800 max-w-xs truncate">
                  {tx.description}
                </td>
                <td className="py-2 px-4 font-mono text-slate-500 text-[11px]">
                  {tx.refCode}
                </td>
                <td className={`py-2 px-4 text-right font-mono font-bold tabular-nums ${
                  tx.amount > 0 ? 'text-emerald-600' : 'text-slate-900'
                }`}>
                  {tx.amount > 0 ? `+${tx.amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}` : tx.amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-2 px-4 text-right font-mono text-slate-600 tabular-nums">
                  ฿{tx.balanceAfter.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

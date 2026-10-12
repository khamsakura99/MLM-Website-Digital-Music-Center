import React, { useState } from 'react';
import { 
  DollarSign, 
  Calendar, 
  Printer, 
  Download, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  FileText,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useMlm } from '../../context/MlmContext';
import { CommissionCycle } from '../../types/mlm';

interface CommissionStatementsViewProps {
  onOpenSlipModal: (cycle: CommissionCycle) => void;
}

export const CommissionStatementsView: React.FC<CommissionStatementsViewProps> = ({ onOpenSlipModal }) => {
  const { language, commissionCycles } = useMlm();
  const [selectedCycleId, setSelectedCycleId] = useState<string>(commissionCycles[0]?.id || '');

  const activeCycle = commissionCycles.find(c => c.id === selectedCycleId) || commissionCycles[0];

  return (
    <div className="space-y-6">
      
      {/* Title & Cycle Selector */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <span>{language === 'th' ? 'ใบแจ้งยอดรอบการจ่ายโบนัส (Commission Statements)' : 'Commission Cycle Statements'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'th' 
              ? 'สรุปผลตอบแทนแผนรายได้ 5 ช่องทาง พร้อมรายการหักภาษี ณ ที่จ่าย 3% และค่าธรรมเนียมโอน' 
              : 'Detailed earnings breakdown across 5 bonus tiers with 3% withholding tax calculation'}
          </p>
        </div>

        {/* Cycle selector dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">
            {language === 'th' ? 'เลือกรอบคำนวณ:' : 'Select Cycle:'}
          </label>
          <select
            value={selectedCycleId}
            onChange={(e) => setSelectedCycleId(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {commissionCycles.map(c => (
              <option key={c.id} value={c.id}>
                {c.periodName} ({c.status === 'paid' ? (language === 'th' ? 'จ่ายแล้ว' : 'Paid') : (language === 'th' ? 'รอโอน' : 'Pending')})
              </option>
            ))}
          </select>
        </div>
      </div>

      {activeCycle && (
        <>
          {/* Cycle Highlight Hero */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-xl p-6 text-white border border-slate-700 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded border border-blue-400/30">
                    {activeCycle.cycleNumber}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                    activeCycle.status === 'paid' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {activeCycle.status === 'paid' ? (language === 'th' ? '✓ โอนเข้า E-Wallet แล้ว' : '✓ Settled to E-Wallet') : (language === 'th' ? '⏳ รอโอนตามรอบ' : '⏳ Pending Settlement')}
                  </span>
                </div>
                <h3 className="text-lg font-bold mt-2">
                  {activeCycle.periodName}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {language === 'th' ? 'กำหนดวันโอนเงิน:' : 'Payout Date:'} <span className="font-mono text-slate-200">{activeCycle.payoutDate}</span>
                </p>
              </div>

              {/* Net Payout Box */}
              <div className="bg-white/10 backdrop-blur-xs p-4 rounded-xl border border-white/10 text-right min-w-[200px]">
                <span className="text-xs text-slate-300 block">{language === 'th' ? 'ยอดจ่ายสุทธิ (Net Payout)' : 'Net Payout Total'}</span>
                <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                  ฿{activeCycle.netPayout.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                </div>
                <button
                  onClick={() => onOpenSlipModal(activeCycle)}
                  className="mt-2 w-full py-1.5 px-3 bg-white hover:bg-slate-100 text-slate-900 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5 text-blue-600" />
                  <span>{language === 'th' ? 'ดู / พิมพ์สลิปเงินได้' : 'Print Statement Voucher'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 5-Tier Bonus Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Tier 1: Fast Start */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-blue-600 block uppercase tracking-wider">
                Bonus 1
              </span>
              <h4 className="font-bold text-slate-900 text-sm mt-0.5">
                {language === 'th' ? 'โบนัสค่าแนะนำ (Fast Start)' : 'Fast Start Bonus'}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                {language === 'th' ? 'ค่าแนะนำสายตรง G1 - G3 จากการเปิดรหัสสมาชิกใหม่' : 'Direct sponsor bonus from new downline pack activations'}
              </p>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-baseline justify-between">
                <span className="text-xs text-slate-500">{language === 'th' ? 'ยอดเงิน:' : 'Amount:'}</span>
                <span className="text-lg font-bold font-mono text-slate-900 tabular-nums">
                  ฿{activeCycle.breakdown.fastStart.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Tier 2: Binary Pairing */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-indigo-600 block uppercase tracking-wider">
                Bonus 2
              </span>
              <h4 className="font-bold text-slate-900 text-sm mt-0.5">
                {language === 'th' ? 'โบนัสบริหารทีม (Binary Pairing)' : 'Binary Pairing Bonus'}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                {language === 'th' ? 'คำนวณ 30% จากคะแนนฝั่งขาอ่อน (Weak Leg Balance)' : '30% team volume match against weak leg volume'}
              </p>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-baseline justify-between">
                <span className="text-xs text-slate-500">{language === 'th' ? 'ยอดเงิน:' : 'Amount:'}</span>
                <span className="text-lg font-bold font-mono text-slate-900 tabular-nums">
                  ฿{activeCycle.breakdown.binaryPairing.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Tier 3: Matching Bonus */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-purple-600 block uppercase tracking-wider">
                Bonus 3
              </span>
              <h4 className="font-bold text-slate-900 text-sm mt-0.5">
                {language === 'th' ? 'โบนัสแมชชิ่งสายเลือด (Matching)' : 'Generation Matching Bonus'}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                {language === 'th' ? 'เปอร์เซ็นต์ส่วนแบ่งจากโบนัสจับคู่ของสายเลือด 5 ชั้น' : 'Percentage matching from binary bonus of G1-G5 generations'}
              </p>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-baseline justify-between">
                <span className="text-xs text-slate-500">{language === 'th' ? 'ยอดเงิน:' : 'Amount:'}</span>
                <span className="text-lg font-bold font-mono text-slate-900 tabular-nums">
                  ฿{activeCycle.breakdown.matching.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Tier 4: Autoship Pool */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-amber-600 block uppercase tracking-wider">
                Bonus 4
              </span>
              <h4 className="font-bold text-slate-900 text-sm mt-0.5">
                {language === 'th' ? 'โบนัสกองทุนออโต้ชิพ (Autoship Pool)' : 'Autoship Sharing Pool'}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                {language === 'th' ? 'ส่วนแบ่งยอดซื้อซ้ำรักษายอดของทีมงานใต้สายงาน' : 'Re-order maintenance volume revenue share pool'}
              </p>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-baseline justify-between">
                <span className="text-xs text-slate-500">{language === 'th' ? 'ยอดเงิน:' : 'Amount:'}</span>
                <span className="text-lg font-bold font-mono text-slate-900 tabular-nums">
                  ฿{activeCycle.breakdown.autoshipPool.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Tier 5: All Sale Pool */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-emerald-600 block uppercase tracking-wider">
                Bonus 5
              </span>
              <h4 className="font-bold text-slate-900 text-sm mt-0.5">
                {language === 'th' ? 'โบนัสออลเซลล์ทั่วโลก (All-Sale Pool)' : 'Global All-Sale Pool'}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                {language === 'th' ? 'ส่วนแบ่งยอดขายรวมทั้งบริษัทสำหรับผู้นำ Diamond ขึ้นไป' : 'Company-wide global revenue pool for Diamond Leaders'}
              </p>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-baseline justify-between">
                <span className="text-xs text-slate-500">{language === 'th' ? 'ยอดเงิน:' : 'Amount:'}</span>
                <span className="text-lg font-bold font-mono text-slate-900 tabular-nums">
                  ฿{activeCycle.breakdown.allSaleBonus.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Deduction Summary Card */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2 flex flex-col justify-between">
              <div>
                <span className="font-bold text-slate-900 block text-sm">
                  {language === 'th' ? 'สรุปยอดเงินและการหักภาษี' : 'Tax & Fee Deductions'}
                </span>
                <div className="mt-2 space-y-1.5 text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>{language === 'th' ? 'ยอดรวมก่อนหัก (Gross):' : 'Gross Total:'}</span>
                    <span className="font-mono font-bold text-slate-800">฿{activeCycle.totalGross.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-red-600">
                    <span>{language === 'th' ? 'หักภาษี ณ ที่จ่าย (3%):' : 'Tax 3% (Withholding):'}</span>
                    <span className="font-mono font-semibold">-฿{activeCycle.withholdingTax.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>{language === 'th' ? 'ค่าธรรมเนียมโอนธนาคาร:' : 'Transfer Fee:'}</span>
                    <span className="font-mono">-฿{activeCycle.transferFee}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-baseline justify-between">
                <span className="font-bold text-slate-900">{language === 'th' ? 'ยอดจ่ายสุทธิ:' : 'Net Payable:'}</span>
                <span className="font-mono font-bold text-base text-emerald-700">
                  ฿{activeCycle.netPayout.toLocaleString()}
                </span>
              </div>
            </div>

          </div>
        </>
      )}

    </div>
  );
};

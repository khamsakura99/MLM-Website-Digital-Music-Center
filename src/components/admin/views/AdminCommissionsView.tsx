import React, { useState } from 'react';
import { 
  Calculator, 
  Play, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  Layers,
  Sparkles
} from 'lucide-react';
import { useMlm } from '../../../context/MlmContext';
import { CommissionCycle } from '../../../types/mlm';

export const AdminCommissionsView: React.FC = () => {
  const { 
    language, 
    commissionCycles, 
    calculateNewCommissionCycle, 
    showToast 
  } = useMlm();

  const [isProcessing, setIsProcessing] = useState(false);

  const handleRunCycle = () => {
    setIsProcessing(true);
    setTimeout(() => {
      calculateNewCommissionCycle();
      setIsProcessing(false);
    }, 800);
  };

  const handleApprovePayout = (cycleId: string) => {
    showToast(
      language === 'th' ? `อนุมัติโอนเงินคอมมิชชั่นรอบ ${cycleId} เข้า E-Wallet สมาชิกทั้งหมดสำเร็จ` : `Cycle ${cycleId} payout settled into member wallets`,
      'success'
    );
  };

  const totalCompanyGross = commissionCycles.reduce((sum, c) => sum + c.totalGross, 0);
  const totalTaxWithheld = commissionCycles.reduce((sum, c) => sum + c.withholdingTax, 0);
  const totalNetPaid = commissionCycles.reduce((sum, c) => sum + c.netPayout, 0);

  return (
    <div className="space-y-6">
      
      {/* Top Engine Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 rounded-2xl p-6 text-white border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/30 text-purple-200 border border-purple-400/40 uppercase tracking-wider">
              Cycle Engine
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Auto Binary & Unilevel Match
            </span>
          </div>
          <h2 className="text-lg font-bold mt-1">
            {language === 'th' ? 'ระบบประมวลผลคำนวณและตัดจ่ายคอมมิชชั่น' : 'Commission Calculation & Settlement Engine'}
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            {language === 'th' 
              ? 'คำนวณโบนัส 5 ช่องทาง (Fast Start, จับคู่ Binary, แมชชิ่ง, Autoship, All-Sale) พร้อมหักภาษี ณ ที่จ่าย 3%' 
              : 'Executes automated 5-tier commission reconciliation, weak leg matching, and tax withholding.'}
          </p>
        </div>

        <button
          disabled={isProcessing}
          onClick={handleRunCycle}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer whitespace-nowrap"
        >
          {isProcessing ? (
            <span className="animate-spin">⚙️</span>
          ) : (
            <Play className="w-4 h-4 fill-current" />
          )}
          <span>{isProcessing ? (language === 'th' ? 'กำลังประมวลผล...' : 'Computing...') : (language === 'th' ? 'ประมวลผลคำนวณรอบใหม่' : 'Run Cycle Calculation')}</span>
        </button>
      </div>

      {/* 3 Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">
            {language === 'th' ? 'ยอดโบนัสรวมก่อนหักภาษี (Gross)' : 'Total Gross Volume'}
          </span>
          <div className="text-xl font-bold font-mono text-slate-900 mt-2 tabular-nums">
            ฿{totalCompanyGross.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {commissionCycles.length} {language === 'th' ? 'รอบการคำนวณสะสม' : 'total computed cycles'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">
            {language === 'th' ? 'ภาษีเงินได้หัก ณ ที่จ่าย 3% สะสม' : 'Total 3% Tax Withheld'}
          </span>
          <div className="text-xl font-bold font-mono text-red-600 mt-2 tabular-nums">
            ฿{totalTaxWithheld.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {language === 'th' ? 'เตรียมนำส่งกรมสรรพากร (ภ.ง.ด.3/53)' : 'Ready for Revenue Dept filing'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">
            {language === 'th' ? 'ยอดโอนเข้า E-Wallet สุทธิ' : 'Total Net Disbursed'}
          </span>
          <div className="text-xl font-bold font-mono text-emerald-600 mt-2 tabular-nums">
            ฿{totalNetPaid.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {language === 'th' ? 'โอนเข้ากระเป๋าสมาชิกสำเร็จ' : 'Successfully credited to wallets'}
          </span>
        </div>
      </div>

      {/* Cycles History Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">
            {language === 'th' ? 'ประวัติรอบการคำนวณคอมมิชชั่น' : 'Commission Cycle Execution Records'}
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            {commissionCycles.length} {language === 'th' ? 'รอบ' : 'cycles'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-4">{language === 'th' ? 'รหัสรอบ' : 'Cycle ID'}</th>
                <th className="py-2.5 px-4">{language === 'th' ? 'ชื่อรอบ / ช่วงเวลา' : 'Cycle Description'}</th>
                <th className="py-2.5 px-3 text-right">{language === 'th' ? 'ค่าแนะนำ' : 'Fast Start'}</th>
                <th className="py-2.5 px-3 text-right">{language === 'th' ? 'จับคู่ไบนารี่' : 'Pairing'}</th>
                <th className="py-2.5 px-3 text-right">{language === 'th' ? 'แมชชิ่ง' : 'Matching'}</th>
                <th className="py-2.5 px-3 text-right">{language === 'th' ? 'ยอดรวมสุทธิ' : 'Net Total'}</th>
                <th className="py-2.5 px-3 text-center">{language === 'th' ? 'สถานะ' : 'Status'}</th>
                <th className="py-2.5 px-4 text-center">{language === 'th' ? 'การจัดการ' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {commissionCycles.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors h-12">
                  <td className="py-2 px-4 font-mono font-bold text-slate-900">
                    {c.cycleNumber}
                  </td>
                  <td className="py-2 px-4 font-medium text-slate-900 truncate max-w-xs">
                    {c.periodName}
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-slate-600 tabular-nums">
                    ฿{c.breakdown.fastStart.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-slate-600 tabular-nums">
                    ฿{c.breakdown.binaryPairing.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-slate-600 tabular-nums">
                    ฿{c.breakdown.matching.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-emerald-700 tabular-nums">
                    ฿{c.netPayout.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      c.status === 'paid'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {c.status === 'paid' ? (language === 'th' ? 'โอนแล้ว' : 'Paid') : (language === 'th' ? 'รอโอน' : 'Pending')}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-center">
                    {c.status === 'pending' ? (
                      <button
                        onClick={() => handleApprovePayout(c.cycleNumber)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        {language === 'th' ? 'อนุมัติจ่ายโบนัส' : 'Disburse Payout'}
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-mono">
                        {c.payoutDate}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

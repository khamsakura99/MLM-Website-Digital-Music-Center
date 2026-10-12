import React from 'react';
import { X, Printer, Download, ShieldCheck } from 'lucide-react';
import { CommissionCycle, MemberProfile, Language } from '../../types/mlm';

interface CommissionSlipModalProps {
  cycle: CommissionCycle | null;
  member: MemberProfile;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const CommissionSlipModal: React.FC<CommissionSlipModalProps> = ({
  cycle,
  member,
  isOpen,
  onClose,
  language
}) => {
  if (!isOpen || !cycle) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 text-slate-900 shadow-2xl border border-slate-200 relative my-8 print:m-0 print:p-4 print:shadow-none print:border-none">
        
        {/* Close & Print buttons (hidden in print) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {language === 'th' ? 'ใบแจ้งยอดผลตอบแทนและหนังสือรับรองหักภาษี ณ ที่จ่าย' : 'Official Commission Statement Voucher'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{language === 'th' ? 'พิมพ์เอกสาร' : 'Print Voucher'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet */}
        <div className="mt-4 space-y-6">
          
          {/* Company Header */}
          <div className="text-center border-b pb-4 border-slate-200">
            <div className="w-12 h-12 bg-blue-600 text-white font-bold text-xl rounded-xl mx-auto flex items-center justify-center mb-2 shadow-sm">
              OMC
            </div>
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">
              บริษัท ออนไลน์ มาร์เก็ตติ้ง คอมมิวนิเคชั่น จำกัด
            </h2>
            <p className="text-xs text-slate-500 font-mono">
              ONLINE MARKETING COMMUNICATION CO., LTD. (OMC DEMO SYSTEM)
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              เลขประจำตัวผู้เสียภาษีอากร: 0-1055-58012-34-5 | สำนักงานใหญ่ กรุงเทพมหานคร
            </p>
            <div className="mt-2 inline-block px-3 py-0.5 bg-slate-100 rounded text-xs font-bold text-slate-800">
              {language === 'th' ? 'ใบแจ้งยอดรายได้และภาษีหัก ณ ที่จ่าย (COMMISSION VOUCHER)' : 'COMMISSION PAYMENT VOUCHER'}
            </div>
          </div>

          {/* Member & Statement Meta info */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="space-y-1">
              <div>
                <span className="text-slate-400">{language === 'th' ? 'รหัสสมาชิก:' : 'Member ID:'} </span>
                <span className="font-mono font-bold text-blue-700">{member.memberCode}</span>
              </div>
              <div>
                <span className="text-slate-400">{language === 'th' ? 'ชื่อ-นามสกุล:' : 'Full Name:'} </span>
                <span className="font-bold text-slate-900">{member.fullName}</span>
              </div>
              <div>
                <span className="text-slate-400">{language === 'th' ? 'เลขบัตรประชาชน:' : 'ID Card No:'} </span>
                <span className="font-mono text-slate-700">{member.idCardNumber}</span>
              </div>
              <div>
                <span className="text-slate-400">{language === 'th' ? 'ตำแหน่งธุรกิจ:' : 'Business Rank:'} </span>
                <span className="font-semibold text-slate-800">{member.rank}</span>
              </div>
            </div>

            <div className="space-y-1 text-right sm:text-left">
              <div>
                <span className="text-slate-400">{language === 'th' ? 'รอบคำนวณ:' : 'Cycle Ref:'} </span>
                <span className="font-mono font-bold text-slate-900">{cycle.cycleNumber}</span>
              </div>
              <div>
                <span className="text-slate-400">{language === 'th' ? 'ระยะเวลารอบ:' : 'Period:'} </span>
                <span className="font-mono text-slate-700">{cycle.startDate} ~ {cycle.endDate}</span>
              </div>
              <div>
                <span className="text-slate-400">{language === 'th' ? 'บัญชีรับเงิน:' : 'Bank Target:'} </span>
                <span className="text-slate-800">{member.bankAccount.bankName}</span>
              </div>
              <div>
                <span className="text-slate-400">{language === 'th' ? 'เลขที่บัญชี:' : 'Account No:'} </span>
                <span className="font-mono text-slate-800">{member.bankAccount.accountNumber}</span>
              </div>
            </div>
          </div>

          {/* Table of Bonus items */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 border-b border-slate-200 font-semibold text-slate-700">
                <tr>
                  <th className="py-2.5 px-4">{language === 'th' ? 'ลำดับ' : 'No.'}</th>
                  <th className="py-2.5 px-4">{language === 'th' ? 'รายการผลตอบแทน (Bonus Items)' : 'Bonus Description'}</th>
                  <th className="py-2.5 px-4 text-right">{language === 'th' ? 'จำนวนเงิน (บาท)' : 'Amount (THB)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2 px-4 font-mono text-slate-400">1</td>
                  <td className="py-2 px-4 font-medium">{language === 'th' ? 'โบนัสค่าแนะนำเปิดรหัสสมาชิก (Fast Start Bonus)' : 'Direct Fast Start Bonus'}</td>
                  <td className="py-2 px-4 text-right font-mono tabular-nums">{cycle.breakdown.fastStart.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-mono text-slate-400">2</td>
                  <td className="py-2 px-4 font-medium">{language === 'th' ? 'โบนัสบริหารทีมจับคู่ไบนารี่ (Binary Pairing Balance Bonus)' : 'Binary Leg Pairing Bonus'}</td>
                  <td className="py-2 px-4 text-right font-mono tabular-nums">{cycle.breakdown.binaryPairing.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-mono text-slate-400">3</td>
                  <td className="py-2 px-4 font-medium">{language === 'th' ? 'โบนัสแมชชิ่งองค์กรสายเลือด (Generation Matching Bonus)' : 'Unilevel Matching Bonus'}</td>
                  <td className="py-2 px-4 text-right font-mono tabular-nums">{cycle.breakdown.matching.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-mono text-slate-400">4</td>
                  <td className="py-2 px-4 font-medium">{language === 'th' ? 'โบนัสกองทุนรักษายอดซื้อซ้ำ (Autoship Pool Sharing)' : 'Autoship Maintenance Pool'}</td>
                  <td className="py-2 px-4 text-right font-mono tabular-nums">{cycle.breakdown.autoshipPool.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-mono text-slate-400">5</td>
                  <td className="py-2 px-4 font-medium">{language === 'th' ? 'โบนัสส่วนแบ่งยอดขายทั่วโลก (Global All-Sale Pool)' : 'Global All-Sale Pool'}</td>
                  <td className="py-2 px-4 text-right font-mono tabular-nums">{cycle.breakdown.allSaleBonus.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-50 border-t border-slate-200 font-semibold">
                <tr>
                  <td colSpan={2} className="py-2 px-4 text-right text-slate-700">{language === 'th' ? 'รวมยอดรายได้ก่อนหักภาษี (Gross Total):' : 'Gross Income Total:'}</td>
                  <td className="py-2 px-4 text-right font-mono tabular-nums">{cycle.totalGross.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr className="text-red-700">
                  <td colSpan={2} className="py-1.5 px-4 text-right">{language === 'th' ? 'หัก ภาษีเงินได้หัก ณ ที่จ่าย 3% (Withholding Tax):' : 'Less 3% Withholding Tax:'}</td>
                  <td className="py-1.5 px-4 text-right font-mono tabular-nums">-{cycle.withholdingTax.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr className="text-slate-500">
                  <td colSpan={2} className="py-1.5 px-4 text-right">{language === 'th' ? 'หัก ค่าธรรมเนียมโอนธนาคาร (Bank Transfer Fee):' : 'Bank Transfer Fee:'}</td>
                  <td className="py-1.5 px-4 text-right font-mono tabular-nums">-{cycle.transferFee.toFixed(2)}</td>
                </tr>
                <tr className="bg-blue-50/70 border-t-2 border-blue-600 text-slate-900 font-bold text-sm">
                  <td colSpan={2} className="py-2.5 px-4 text-right text-blue-900">{language === 'th' ? 'ยอดเงินโอนสุทธิ (NET PAYOUT):' : 'NET PAYOUT AMOUNT:'}</td>
                  <td className="py-2.5 px-4 text-right font-mono text-blue-900 tabular-nums">฿{cycle.netPayout.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Signatures & Certification */}
          <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs">
            <div className="space-y-10">
              <p className="text-slate-500">{language === 'th' ? 'ผู้มีอำนาจลงนาม / ฝ่ายการเงิน' : 'Authorized Signatory / Finance'}</p>
              <div className="border-t border-dashed border-slate-300 pt-1 text-slate-600">
                ( บจก. ออนไลน์ มาร์เก็ตติ้ง คอมมิวนิเคชั่น )
              </div>
            </div>
            <div className="space-y-10">
              <p className="text-slate-500">{language === 'th' ? 'ผู้รับเงิน / สมาชิกนักธุรกิจ' : 'Payee / Member Acknowledgement'}</p>
              <div className="border-t border-dashed border-slate-300 pt-1 text-slate-600">
                ( {member.fullName} )
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 text-center italic">
            * เอกสารนี้จัดทำขึ้นโดยระบบอัตโนมัติของ OMC MLM Software Demo เพื่อใช้เป็นหลักฐานแสดงการรับเงินและภาษีหัก ณ ที่จ่าย
          </p>

        </div>

      </div>
    </div>
  );
};

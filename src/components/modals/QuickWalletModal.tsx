import React, { useState } from 'react';
import { X, Send, ArrowDownCircle, Wallet, Check, Lock } from 'lucide-react';
import { useMlm } from '../../context/MlmContext';

interface QuickWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickWalletModal: React.FC<QuickWalletModalProps> = ({ isOpen, onClose }) => {
  const { language, currentMember, binaryNodes, transferWallet, withdrawWallet, showToast } = useMlm();
  const [mode, setMode] = useState<'transfer' | 'withdraw'>('transfer');

  const [targetCode, setTargetCode] = useState('');
  const [recipientName, setRecipientName] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('123456');

  if (!isOpen) return null;

  const handleVerify = () => {
    const code = targetCode.trim().toUpperCase();
    const node = Object.values(binaryNodes).find(n => n.memberCode.toUpperCase() === code);
    if (node) {
      setRecipientName(node.name);
      showToast(language === 'th' ? `พบสมาชิก: ${node.name}` : `Found: ${node.name}`, 'info');
    } else {
      setRecipientName(null);
      showToast(language === 'th' ? 'ไม่พบรหัสสมาชิกนี้' : 'Member not found', 'error');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return;

    if (mode === 'transfer') {
      const res = transferWallet(targetCode, val, 'Quick Transfer', pin);
      if (res.success) onClose();
      else showToast(res.message, 'error');
    } else {
      const res = withdrawWallet(val, pin);
      if (res.success) onClose();
      else showToast(res.message, 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 text-slate-900 shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-base">
              {language === 'th' ? 'จัดการ E-Wallet ด่วน' : 'Quick E-Wallet Action'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Balance Display */}
        <div className="mt-3 p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between">
          <span className="text-xs text-slate-300">{language === 'th' ? 'ยอดเงินคงเหลือ:' : 'Balance:'}</span>
          <span className="font-mono font-bold text-emerald-400 text-lg tabular-nums">
            ฿{currentMember.walletBalance.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Toggle Mode */}
        <div className="flex bg-slate-100 p-1 rounded-lg mt-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode('transfer')}
            className={`flex-1 py-1.5 rounded-md transition-colors flex items-center justify-center gap-1.5 ${
              mode === 'transfer' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>{language === 'th' ? 'โอนให้สมาชิก' : 'Transfer'}</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('withdraw')}
            className={`flex-1 py-1.5 rounded-md transition-colors flex items-center justify-center gap-1.5 ${
              mode === 'withdraw' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            <ArrowDownCircle className="w-3.5 h-3.5" />
            <span>{language === 'th' ? 'ถอนเข้าธนาคาร' : 'Withdraw'}</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
          {mode === 'transfer' ? (
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {language === 'th' ? 'รหัสสมาชิกผู้รับ:' : 'Recipient Code:'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="เช่น TH889502"
                  value={targetCode}
                  onChange={(e) => {
                    setTargetCode(e.target.value);
                    setRecipientName(null);
                  }}
                  className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={handleVerify}
                  className="px-3 py-1.5 bg-slate-800 text-white rounded-lg font-medium"
                >
                  {language === 'th' ? 'ตรวจ' : 'Check'}
                </button>
              </div>
              {recipientName && (
                <div className="mt-1 text-[11px] text-emerald-700 font-medium">
                  ✓ {recipientName}
                </div>
              )}
            </div>
          ) : (
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-[11px]">
              <span className="text-slate-400 block">{language === 'th' ? 'ถอนเข้า:' : 'Destination:'}</span>
              <strong className="text-slate-800">{currentMember.bankAccount.bankName}</strong>
              <div className="font-mono text-slate-600">{currentMember.bankAccount.accountNumber} ({currentMember.bankAccount.accountName})</div>
              <div className="text-slate-400 mt-1">{language === 'th' ? 'ค่าธรรมเนียม: 30 บาท' : 'Fee: 30 THB'}</div>
            </div>
          )}

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              {language === 'th' ? 'จำนวนเงิน (บาท):' : 'Amount (THB):'}
            </label>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-base font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1 flex items-center justify-between">
              <span>{language === 'th' ? 'รหัส PIN (6 หลัก):' : 'PIN (6 digits):'}</span>
              <span className="text-slate-400 font-mono text-[10px]">123456</span>
            </label>
            <input
              type="password"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2.5 rounded-lg text-white font-bold transition-colors ${
              mode === 'transfer' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-emerald-600 hover:bg-emerald-500'
            }`}
          >
            {mode === 'transfer' ? (language === 'th' ? 'ยืนยันการโอนเงิน' : 'Confirm Transfer') : (language === 'th' ? 'ยืนยันการถอนเงิน' : 'Confirm Withdrawal')}
          </button>
        </form>

      </div>
    </div>
  );
};

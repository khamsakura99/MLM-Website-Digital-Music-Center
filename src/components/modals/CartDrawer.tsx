import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Wallet, 
  QrCode, 
  Check, 
  ShoppingBag,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useMlm } from '../../context/MlmContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { 
    language, 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart, 
    placeOrder, 
    currentMember 
  } = useMlm();

  const [orderType, setOrderType] = useState<'topup' | 'autoship' | 'general'>('autoship');
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'promptpay'>('wallet');
  const [pin, setPin] = useState('123456');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const totalAmount = cart.reduce((sum, item) => sum + item.product.memberPrice * item.quantity, 0);
  const totalPv = cart.reduce((sum, item) => sum + item.product.pv * item.quantity, 0);
  const isWalletSufficient = currentMember.walletBalance >= totalAmount;

  const handleCheckout = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const ok = placeOrder(orderType, paymentMethod);
      setIsSubmitting(false);
      if (ok) {
        onClose();
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">
                {language === 'th' ? 'ตะกร้าสินค้า (Cart)' : 'Shopping Cart'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
            {cart.length === 0 ? (
              <div className="py-16 text-center text-slate-400 space-y-3">
                <ShoppingBag className="w-12 h-12 mx-auto stroke-1 text-slate-300" />
                <p className="text-sm font-medium text-slate-600">
                  {language === 'th' ? 'ยังไม่มีสินค้าในตะกร้า' : 'Your cart is empty'}
                </p>
                <p className="text-xs text-slate-400">
                  {language === 'th' ? 'เลือกสินค้าจากแคตตาล็อกเพื่อเริ่มสั่งซื้อ' : 'Add items from the store to continue'}
                </p>
              </div>
            ) : (
              <>
                {/* Items List */}
                <div className="divide-y divide-slate-100 space-y-3">
                  {cart.map((item) => (
                    <div key={item.product.id} className="pt-3 first:pt-0 flex gap-3 text-xs">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-900 truncate">
                          {language === 'th' ? item.product.nameTh : item.product.name}
                        </h4>
                        <div className="mt-0.5 text-slate-500 font-mono text-[11px] flex items-center gap-2">
                          <span>฿{item.product.memberPrice.toLocaleString()}</span>
                          <span>·</span>
                          <span className="text-blue-600 font-bold">+{item.product.pv * item.quantity} PV</span>
                        </div>

                        {/* Quantity adjust */}
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center border border-slate-200 rounded-md bg-slate-50">
                            <button
                              onClick={() => updateCartQuantity(item.product.id, -1)}
                              className="p-1 text-slate-600 hover:text-slate-900"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 font-mono font-bold text-slate-900 text-xs">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.product.id, 1)}
                              className="p-1 text-slate-600 hover:text-slate-900"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-slate-400 hover:text-red-600 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bill Type Selector */}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <label className="text-xs font-semibold text-slate-700 block">
                    {language === 'th' ? 'ประเภทการสั่งซื้อ:' : 'Order Type:'}
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                    <button
                      type="button"
                      onClick={() => setOrderType('autoship')}
                      className={`p-2 rounded-lg border font-medium transition-colors ${
                        orderType === 'autoship' 
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold' 
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      {language === 'th' ? 'บิลรักษายอด' : 'Autoship'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderType('topup')}
                      className={`p-2 rounded-lg border font-medium transition-colors ${
                        orderType === 'topup' 
                          ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold' 
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      {language === 'th' ? 'เปิดรหัส/อัปเกรด' : 'Top-up'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderType('general')}
                      className={`p-2 rounded-lg border font-medium transition-colors ${
                        orderType === 'general' 
                          ? 'border-slate-800 bg-slate-50 text-slate-900 font-bold' 
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      {language === 'th' ? 'บิลทั่วไป' : 'General'}
                    </button>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 block">
                    {language === 'th' ? 'วิธีการชำระเงิน:' : 'Payment Method:'}
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('wallet')}
                      className={`p-3 rounded-lg border flex flex-col items-center justify-center text-center transition-colors ${
                        paymentMethod === 'wallet'
                          ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 font-bold'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      <Wallet className="w-4 h-4 mb-1 text-emerald-600" />
                      <span>E-Wallet</span>
                      <span className="font-mono text-[10px] text-slate-500 mt-0.5">
                        ฿{currentMember.walletBalance.toLocaleString()}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('promptpay')}
                      className={`p-3 rounded-lg border flex flex-col items-center justify-center text-center transition-colors ${
                        paymentMethod === 'promptpay'
                          ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      <QrCode className="w-4 h-4 mb-1 text-blue-600" />
                      <span>QR PromptPay</span>
                      <span className="text-[10px] text-slate-500 mt-0.5">
                        {language === 'th' ? 'สแกนจ่ายทันที' : 'Scan & Pay'}
                      </span>
                    </button>
                  </div>

                  {paymentMethod === 'wallet' && !isWalletSufficient && (
                    <p className="text-[11px] text-red-600 font-medium">
                      ⚠️ {language === 'th' ? 'ยอดเงินใน E-Wallet ไม่เพียงพอ กรุณาเลือกวิธีชำระอื่น' : 'Insufficient E-Wallet balance'}
                    </p>
                  )}
                </div>

                {/* Delivery Recipient Info Box */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                  <span className="font-semibold text-slate-700 block">
                    {language === 'th' ? 'ที่อยู่จัดส่งพัสดุ:' : 'Shipping Address:'}
                  </span>
                  <p className="text-slate-800 font-medium">{currentMember.fullName} ({currentMember.phone})</p>
                  <p className="text-slate-500 text-[11px]">{currentMember.address} {currentMember.province} {currentMember.postcode}</p>
                </div>
              </>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-500">
                  <span>{language === 'th' ? 'คะแนน PV ที่จะได้รับ:' : 'PV Earned:'}</span>
                  <span className="font-mono font-bold text-blue-600 tabular-nums">+{totalPv.toLocaleString()} PV</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>{language === 'th' ? 'ค่าจัดส่ง:' : 'Shipping:'}</span>
                  <span className="text-emerald-600 font-medium">{language === 'th' ? 'ฟรี' : 'Free'}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-baseline justify-between">
                  <span className="font-bold text-sm text-slate-900">{language === 'th' ? 'ยอดชำระสุทธิ:' : 'Total Payable:'}</span>
                  <span className="font-mono font-bold text-lg text-slate-900 tabular-nums">
                    ฿{totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                disabled={isSubmitting || (paymentMethod === 'wallet' && !isWalletSufficient)}
                onClick={handleCheckout}
                className={`w-full py-2.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs ${
                  paymentMethod === 'wallet' && !isWalletSufficient
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                {isSubmitting ? (
                  <span>{language === 'th' ? 'กำลังทำรายการ...' : 'Processing...'}</span>
                ) : (
                  <>
                    <span>{language === 'th' ? 'ยืนยันและชำระเงิน' : 'Confirm & Pay Now'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

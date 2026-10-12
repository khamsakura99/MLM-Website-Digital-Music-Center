import React, { useState } from 'react';
import { 
  Receipt, 
  Search, 
  Truck, 
  CheckCircle, 
  Clock, 
  ExternalLink,
  Package,
  Calendar,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useMlm } from '../../context/MlmContext';
import { getCarrierTrackingUrl } from '../admin/views/AdminOrdersView';

export const OrderHistoryView: React.FC = () => {
  const { language, orders } = useMlm();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedOrderId(prev => prev === id ? null : id);
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'shipping':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  const getOrderTypeLabel = (type: string) => {
    switch (type) {
      case 'autoship':
        return language === 'th' ? 'บิลรักษายอด (Autoship)' : 'Autoship';
      case 'topup':
        return language === 'th' ? 'บิลเปิดรหัส/อัปเกรด' : 'Top-up';
      default:
        return language === 'th' ? 'บิลทั่วไป' : 'General';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      
      {/* Table Header */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-blue-600" />
            <span>{language === 'th' ? 'ประวัติคำสั่งซื้อและใบเสร็จ (Order History)' : 'Order History & Invoices'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'th' ? `พบประวัติการสั่งซื้อทั้งหมด ${orders.length} รายการ` : `Showing ${orders.length} total orders`}
          </p>
        </div>
      </div>

      {/* Orders List */}
      <div className="divide-y divide-slate-100">
        {orders.map((order) => {
          const isExpanded = expandedOrderId === order.id;
          return (
            <div key={order.id} className="p-4 sm:p-5 hover:bg-slate-50/50 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                
                {/* Left: Order Info */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-sm text-slate-900">
                      {order.orderNumber}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-slate-100 text-slate-700">
                      {getOrderTypeLabel(order.orderType)}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${getOrderStatusBadge(order.status)}`}>
                      {order.status === 'completed' ? (language === 'th' ? 'จัดส่งสำเร็จ' : 'Delivered') : (language === 'th' ? 'กำลังจัดส่ง' : 'In Transit')}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                    <span>{order.date}</span>
                    <span>·</span>
                    <span>{language === 'th' ? 'ชำระผ่าน:' : 'Payment:'} {order.paymentMethod.toUpperCase()}</span>
                  </div>
                </div>

                {/* Right: Amounts & Toggle */}
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-right">
                    <div className="text-sm font-bold font-mono text-slate-900 tabular-nums">
                      ฿{order.totalAmount.toLocaleString()}
                    </div>
                    <div className="text-xs font-mono font-semibold text-blue-600">
                      +{order.totalPv.toLocaleString()} PV
                    </div>
                  </div>

                  <button
                    onClick={() => toggleExpand(order.id)}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 text-xs bg-slate-50/70 p-4 rounded-xl">
                  {/* Tracking info if shipping */}
                  {order.trackingNumber && (
                    <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>
                          {language === 'th' ? 'ขนส่งโดย:' : 'Courier:'} <strong>{order.shippingCompany || 'Anousith Logistics'}</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="font-bold text-slate-800">{order.trackingNumber}</span>
                        {getCarrierTrackingUrl(order.shippingCompany || '', order.trackingNumber) ? (
                          <a
                            href={getCarrierTrackingUrl(order.shippingCompany || '', order.trackingNumber)!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] bg-blue-600 hover:bg-blue-700 text-white px-2 py-0.5 rounded font-sans font-semibold transition-colors"
                          >
                            <span>{language === 'th' ? 'เช็คสถานะพัสดุ' : 'Track Parcel'}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ) : (
                          <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-sans font-semibold">
                            {language === 'th' ? 'เช็คสถานะพัสดุ' : 'Track Parcel'}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Order items */}
                  <div className="space-y-2">
                    <span className="font-semibold text-slate-700 block">
                      {language === 'th' ? 'รายการสินค้าในคำสั่งซื้อ:' : 'Items in this order:'}
                    </span>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between py-1 bg-white px-3 rounded border border-slate-100">
                        <span className="text-slate-800 font-medium">
                          {item.productName} <span className="text-slate-400 font-mono">x{item.quantity}</span>
                        </span>
                        <div className="text-right font-mono">
                          <span className="text-slate-900 font-semibold">฿{(item.memberPrice * item.quantity).toLocaleString()}</span>
                          <span className="text-blue-600 text-[11px] ml-2">({item.pv * item.quantity} PV)</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping address */}
                  <div className="pt-2 border-t border-slate-200 text-slate-500 text-[11px]">
                    <span className="text-slate-700 font-semibold">{language === 'th' ? 'ผู้รับ:' : 'Recipient:'} </span>
                    {order.shippingAddress.fullName} ({order.shippingAddress.phone}) — {order.shippingAddress.address} {order.shippingAddress.province} {order.shippingAddress.postcode}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};

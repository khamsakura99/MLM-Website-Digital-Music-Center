import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Truck, 
  CheckCircle, 
  Clock, 
  ExternalLink,
  ChevronDown,
  Edit2,
  Edit3,
  Plus,
  Trash2,
  RotateCcw,
  Check,
  X,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Copy,
  MapPin,
  CreditCard,
  Package,
  Layers,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { useMlm } from '../../../context/MlmContext';
import { Order } from '../../../types/mlm';

export const CARRIERS = [
  'Anousith Logistics (ອານຸສິດ ຂົນສົ່ງ)',
  'HAL Express (ຮຸ່ງອາລຸນ ຂົນສົ່ງ)',
  'Local Delivery (ຈັດສົ່ງພາຍໃນ / ຈັດສົ່ງເອງ)',
  'Flash Express',
  'Kerry Express (KEX)',
  'J&T Express',
  'Thailand Post (EMS)',
  'Ninja Van',
  'DHL eCommerce',
  'Best Express',
  'SCG Express'
];

export const getCarrierTrackingUrl = (carrier: string, trackingNumber: string): string | null => {
  if (!trackingNumber) return null;
  const c = carrier.toLowerCase();
  if (c.includes('anousith')) {
    return `https://anousithexpress.com/track?no=${encodeURIComponent(trackingNumber)}`;
  }
  if (c.includes('hal') || c.includes('ຮຸ່ງອາລຸນ')) {
    return `https://hal-logistics.la/tracking?id=${encodeURIComponent(trackingNumber)}`;
  }
  if (c.includes('flash')) {
    return `https://www.flashexpress.co.th/tracking/?se=${encodeURIComponent(trackingNumber)}`;
  }
  if (c.includes('kerry') || c.includes('kex')) {
    return `https://th.kerryexpress.com/th/track/?track=${encodeURIComponent(trackingNumber)}`;
  }
  if (c.includes('j&t') || c.includes('jt')) {
    return `https://www.jtexpress.co.th/tracking?billcode=${encodeURIComponent(trackingNumber)}`;
  }
  if (c.includes('thailand post') || c.includes('ems')) {
    return `https://track.thailandpost.co.th/?trackNumber=${encodeURIComponent(trackingNumber)}`;
  }
  return null;
};

export const AdminOrdersView: React.FC = () => {
  const { 
    language, 
    orders, 
    updateOrderStatus, 
    updateOrderFullDetails, 
    deleteOrder, 
    addNewOrderDirect, 
    resetOrdersToDefault,
    showToast 
  } = useMlm();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Full Edit Modal State
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [formOrderId, setFormOrderId] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formCustomerName, setFormCustomerName] = useState('');
  const [formCustomerPhone, setFormCustomerPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formProvince, setFormProvince] = useState('');
  const [formPostcode, setFormPostcode] = useState('');
  const [formOrderType, setFormOrderType] = useState<'topup' | 'autoship' | 'general'>('general');
  const [formAmount, setFormAmount] = useState<number>(0);
  const [formPv, setFormPv] = useState<number>(0);
  const [formTracking, setFormTracking] = useState('');
  const [formCarrier, setFormCarrier] = useState('Anousith Logistics (ອານຸສິດ ຂົນສົ່ງ)');
  const [formStatus, setFormStatus] = useState<'paid' | 'shipping' | 'completed'>('shipping');

  // Inline Row Edit State (order.id -> draft)
  const [inlineEditId, setInlineEditId] = useState<string | null>(null);
  const [inlineDraft, setInlineDraft] = useState<{
    orderNumber: string;
    date: string;
    customerName: string;
    customerPhone: string;
    orderType: 'topup' | 'autoship' | 'general';
    totalAmount: number;
    totalPv: number;
    trackingNumber: string;
    shippingCompany: string;
    status: 'paid' | 'shipping' | 'completed';
  }>({
    orderNumber: '',
    date: '',
    customerName: '',
    customerPhone: '',
    orderType: 'general',
    totalAmount: 0,
    totalPv: 0,
    trackingNumber: '',
    shippingCompany: 'Anousith Logistics (ອານຸສິດ ຂົນສົ່ງ)',
    status: 'shipping'
  });

  // Create Order Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newOrderForm, setNewOrderForm] = useState({
    orderNumber: `INV${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(1000 + Math.random() * 9000))}`,
    date: new Date().toISOString().replace('T', ' ').slice(0, 16),
    customerName: '',
    customerPhone: '081-234-5678',
    customerAddress: '99/1 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย',
    province: 'กรุงเทพมหานคร',
    postcode: '10110',
    orderType: 'general' as 'topup' | 'autoship' | 'general',
    totalAmount: 1500,
    totalPv: 300,
    trackingNumber: '',
    shippingCompany: 'Flash Express',
    status: 'paid' as 'paid' | 'shipping' | 'completed'
  });

  // Delete Confirm Modal State
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  // Statistics
  const totalOrdersCount = orders.length;
  const totalSalesAmount = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalPvSum = orders.reduce((sum, o) => sum + (o.totalPv || 0), 0);
  const shippingCount = orders.filter(o => o.status === 'shipping').length;
  const completedCount = orders.filter(o => o.status === 'completed').length;
  const paidCount = orders.filter(o => o.status === 'paid').length;

  // Filtered orders
  const filtered = orders.filter(o => {
    const q = search.trim().toLowerCase();
    const matchSearch = !q || 
      o.orderNumber.toLowerCase().includes(q) || 
      o.shippingAddress.fullName.toLowerCase().includes(q) ||
      o.shippingAddress.phone.toLowerCase().includes(q) ||
      (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q)) ||
      (o.shippingCompany && o.shippingCompany.toLowerCase().includes(q));
    
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchType = typeFilter === 'all' || o.orderType === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  // Open Full Edit Modal
  const handleOpenEditModal = (order: Order) => {
    setEditingOrder(order);
    setFormOrderId(order.orderNumber);
    setFormDate(order.date);
    setFormCustomerName(order.shippingAddress.fullName);
    setFormCustomerPhone(order.shippingAddress.phone || '');
    setFormAddress(order.shippingAddress.address || '');
    setFormProvince(order.shippingAddress.province || '');
    setFormPostcode(order.shippingAddress.postcode || '');
    setFormOrderType(order.orderType);
    setFormAmount(order.totalAmount);
    setFormPv(order.totalPv);
    setFormTracking(order.trackingNumber || '');
    setFormCarrier(order.shippingCompany || 'Anousith Logistics (ອານຸສິດ ຂົນສົ່ງ)');
    setFormStatus(order.status);
  };

  // Submit Full Edit Modal
  const handleSaveEditModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    if (!formOrderId.trim()) {
      showToast(language === 'th' ? 'กรุณาระบุเลขที่คำสั่งซื้อ' : 'Please provide Order ID', 'error');
      return;
    }
    if (!formCustomerName.trim()) {
      showToast(language === 'th' ? 'กรุณาระบุชื่อลูกค้า' : 'Please provide customer name', 'error');
      return;
    }

    const res = updateOrderFullDetails(editingOrder.id, {
      orderNumber: formOrderId,
      date: formDate,
      customerName: formCustomerName,
      customerPhone: formCustomerPhone,
      customerAddress: formAddress,
      province: formProvince,
      postcode: formPostcode,
      orderType: formOrderType,
      totalAmount: formAmount,
      totalPv: formPv,
      trackingNumber: formTracking,
      shippingCompany: formCarrier,
      status: formStatus
    });

    if (res.success) {
      setEditingOrder(null);
    }
  };

  // Start Inline Edit
  const handleStartInlineEdit = (order: Order) => {
    setInlineEditId(order.id);
    setInlineDraft({
      orderNumber: order.orderNumber,
      date: order.date,
      customerName: order.shippingAddress.fullName,
      customerPhone: order.shippingAddress.phone,
      orderType: order.orderType,
      totalAmount: order.totalAmount,
      totalPv: order.totalPv,
      trackingNumber: order.trackingNumber || '',
      shippingCompany: order.shippingCompany || 'Anousith Logistics (ອານຸສິດ ຂົນສົ່ງ)',
      status: order.status
    });
  };

  // Save Inline Edit
  const handleSaveInlineEdit = (orderId: string) => {
    if (!inlineDraft.orderNumber.trim()) {
      showToast(language === 'th' ? 'กรุณาระบุเลขที่คำสั่งซื้อ' : 'Order ID is required', 'error');
      return;
    }
    if (!inlineDraft.customerName.trim()) {
      showToast(language === 'th' ? 'กรุณาระบุชื่อลูกค้า' : 'Customer name is required', 'error');
      return;
    }

    const res = updateOrderFullDetails(orderId, {
      orderNumber: inlineDraft.orderNumber,
      date: inlineDraft.date,
      customerName: inlineDraft.customerName,
      customerPhone: inlineDraft.customerPhone,
      orderType: inlineDraft.orderType,
      totalAmount: inlineDraft.totalAmount,
      totalPv: inlineDraft.totalPv,
      trackingNumber: inlineDraft.trackingNumber,
      shippingCompany: inlineDraft.shippingCompany,
      status: inlineDraft.status
    });

    if (res.success) {
      setInlineEditId(null);
    }
  };

  // Cancel Inline Edit
  const handleCancelInlineEdit = () => {
    setInlineEditId(null);
  };

  // Submit Create Order
  const handleCreateOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrderForm.orderNumber.trim()) {
      showToast(language === 'th' ? 'กรุณาระบุเลขที่บิล' : 'Please provide Order ID', 'error');
      return;
    }
    if (!newOrderForm.customerName.trim()) {
      showToast(language === 'th' ? 'กรุณาระบุชื่อลูกค้า' : 'Please enter customer name', 'error');
      return;
    }

    const res = addNewOrderDirect(newOrderForm);
    if (res.success) {
      setIsCreateModalOpen(false);
      setNewOrderForm({
        orderNumber: `INV${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(1000 + Math.random() * 9000))}`,
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
        customerName: '',
        customerPhone: '081-234-5678',
        customerAddress: '99/1 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย',
        province: 'กรุงเทพมหานคร',
        postcode: '10110',
        orderType: 'general',
        totalAmount: 1500,
        totalPv: 300,
        trackingNumber: '',
        shippingCompany: 'Anousith Logistics (ອານຸສິດ ຂົນສົ່ງ)',
        status: 'paid'
      });
    }
  };

  // Copy tracking number to clipboard
  const handleCopyTracking = (tracking: string) => {
    if (!tracking) return;
    navigator.clipboard.writeText(tracking);
    showToast(language === 'th' ? `คัดลอกเลขพัสดุ ${tracking} แล้ว` : `Copied tracking ${tracking}`, 'info');
  };

  return (
    <div className="space-y-4">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-medium">{language === 'th' ? 'คำสั่งซื้อทั้งหมด' : 'Total Orders'}</span>
            <ShoppingBag className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-lg font-bold text-slate-900 font-mono">{totalOrdersCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{language === 'th' ? 'รายการในระบบ' : 'In system'}</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-medium">{language === 'th' ? 'ยอดขายรวม' : 'Total Sales'}</span>
            <CreditCard className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-lg font-bold text-emerald-700 font-mono">฿{totalSalesAmount.toLocaleString()}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{language === 'th' ? 'รายได้รวมทั้งหมด' : 'Gross revenue'}</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-medium">{language === 'th' ? 'ยอดคะแนนรวม' : 'Total PV'}</span>
            <Layers className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-lg font-bold text-blue-700 font-mono">{totalPvSum.toLocaleString()} <span className="text-xs font-normal">PV</span></div>
          <div className="text-[10px] text-slate-400 mt-0.5">{language === 'th' ? 'คะแนนคำนวณโบนัส' : 'Calculated points'}</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-amber-200/80 bg-amber-50/20 shadow-2xs">
          <div className="flex items-center justify-between text-amber-700 mb-1">
            <span className="text-[11px] font-medium">{language === 'th' ? 'รอแพ็ค / ชำระแล้ว' : 'Paid / Packing'}</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-lg font-bold text-amber-800 font-mono">{paidCount}</div>
          <div className="text-[10px] text-amber-600/80 mt-0.5">{language === 'th' ? 'เตรียมจัดส่ง' : 'Awaiting dispatch'}</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-blue-200/80 bg-blue-50/20 shadow-2xs">
          <div className="flex items-center justify-between text-blue-700 mb-1">
            <span className="text-[11px] font-medium">{language === 'th' ? 'กำลังจัดส่ง' : 'In Transit'}</span>
            <Truck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-lg font-bold text-blue-800 font-mono">{shippingCount}</div>
          <div className="text-[10px] text-blue-600/80 mt-0.5">{language === 'th' ? 'อยู่ระหว่างนำจ่าย' : 'En route'}</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-emerald-200/80 bg-emerald-50/20 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-700 mb-1">
            <span className="text-[11px] font-medium">{language === 'th' ? 'จัดส่งสำเร็จ' : 'Delivered'}</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-lg font-bold text-emerald-800 font-mono">{completedCount}</div>
          <div className="text-[10px] text-emerald-600/80 mt-0.5">{language === 'th' ? 'ผู้รับได้รับแล้ว' : 'Completed'}</div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Header with Title and Action Buttons */}
        <div className="p-4 sm:p-5 border-b border-slate-100 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-indigo-600" />
                <span>{language === 'th' ? 'จัดการคำสั่งซื้อและการจัดส่งพัสดุ (Admin Orders)' : 'Order Fulfillment Administration'}</span>
                <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {language === 'th' ? 'แก้ไขได้ทุกคอลัมน์' : 'Fully Editable'}
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'th' 
                  ? `แสดงคำสั่งซื้อ ${filtered.length} จากทั้งหมด ${orders.length} รายการ (คลิก 'แก้ไข' เพื่อเปิดฟอร์ม หรือคลิกไอคอนดินสอเพื่อแก้ไขในตารางทันที)`
                  : `Showing ${filtered.length} of ${orders.length} orders (Click Edit for full form or pencil icon for inline table editing)`}
              </p>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'th' ? '+ สร้างคำสั่งซื้อใหม่' : '+ New Order'}</span>
              </button>
              <button
                onClick={resetOrdersToDefault}
                title={language === 'th' ? 'รีเซ็ตข้อมูลคำสั่งซื้อกลับเป็นค่าเริ่มต้น' : 'Reset orders to default'}
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {/* Search */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={language === 'th' ? 'ค้นหาเลขที่บิล, ชื่อผู้รับ, เบอร์โทร, เลขพัสดุ, หรือขนส่ง...' : 'Search Order ID, customer, phone, tracking, carrier...'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
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

            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
              <span className="text-[10px] text-slate-400 px-1 font-semibold uppercase">{language === 'th' ? 'สถานะ:' : 'Status:'}</span>
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded transition-colors ${statusFilter === 'all' ? 'bg-white font-semibold text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                {language === 'th' ? 'ทั้งหมด' : 'All'}
              </button>
              <button
                onClick={() => setStatusFilter('paid')}
                className={`px-2.5 py-1 rounded transition-colors ${statusFilter === 'paid' ? 'bg-white font-semibold text-amber-700 shadow-2xs' : 'text-slate-600 hover:text-amber-700'}`}
              >
                {language === 'th' ? 'รอแพ็ค' : 'Paid'}
              </button>
              <button
                onClick={() => setStatusFilter('shipping')}
                className={`px-2.5 py-1 rounded transition-colors ${statusFilter === 'shipping' ? 'bg-white font-semibold text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-blue-700'}`}
              >
                {language === 'th' ? 'กำลังจัดส่ง' : 'Shipping'}
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-2.5 py-1 rounded transition-colors ${statusFilter === 'completed' ? 'bg-white font-semibold text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-emerald-700'}`}
              >
                {language === 'th' ? 'สำเร็จ' : 'Done'}
              </button>
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
              <span className="text-[10px] text-slate-400 px-1 font-semibold uppercase">{language === 'th' ? 'ประเภท:' : 'Type:'}</span>
              <button
                onClick={() => setTypeFilter('all')}
                className={`px-2 py-1 rounded transition-colors ${typeFilter === 'all' ? 'bg-white font-semibold text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                {language === 'th' ? 'ทั้งหมด' : 'All'}
              </button>
              <button
                onClick={() => setTypeFilter('autoship')}
                className={`px-2 py-1 rounded transition-colors ${typeFilter === 'autoship' ? 'bg-white font-semibold text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-indigo-700'}`}
              >
                Autoship
              </button>
              <button
                onClick={() => setTypeFilter('topup')}
                className={`px-2 py-1 rounded transition-colors ${typeFilter === 'topup' ? 'bg-white font-semibold text-purple-700 shadow-2xs' : 'text-slate-600 hover:text-purple-700'}`}
              >
                Topup
              </button>
              <button
                onClick={() => setTypeFilter('general')}
                className={`px-2 py-1 rounded transition-colors ${typeFilter === 'general' ? 'bg-white font-semibold text-slate-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                General
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table - Requested columns: Order ID, Date, Customer, Type, Amount, PV, Tracking, Status, Action */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-600 font-bold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3.5 whitespace-nowrap">{language === 'th' ? 'เลขที่คำสั่งซื้อ' : 'Order ID'}</th>
                <th className="py-3 px-3 whitespace-nowrap">{language === 'th' ? 'วัน-เวลา' : 'Date'}</th>
                <th className="py-3 px-3.5 whitespace-nowrap">{language === 'th' ? 'ลูกค้า / ผู้รับ' : 'Customer'}</th>
                <th className="py-3 px-2.5 whitespace-nowrap text-center">{language === 'th' ? 'ประเภท' : 'Type'}</th>
                <th className="py-3 px-3 text-right whitespace-nowrap">{language === 'th' ? 'ยอดเงิน' : 'Amount'}</th>
                <th className="py-3 px-3 text-right whitespace-nowrap">{language === 'th' ? 'คะแนน' : 'PV'}</th>
                <th className="py-3 px-3.5 whitespace-nowrap">{language === 'th' ? 'ขนส่ง / เลขพัสดุ' : 'Tracking'}</th>
                <th className="py-3 px-3 text-center whitespace-nowrap">{language === 'th' ? 'สถานะ' : 'Status'}</th>
                <th className="py-3 px-3 text-center whitespace-nowrap min-w-[130px]">{language === 'th' ? 'การจัดการ' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-medium">{language === 'th' ? 'ไม่พบคำสั่งซื้อที่ตรงกับเงื่อนไข' : 'No orders found'}</p>
                    <p className="text-[11px] mt-0.5">{language === 'th' ? 'ลองเปลี่ยนคำค้นหา หรือรีเซ็ตตัวกรอง' : 'Try clearing filters or search keyword'}</p>
                  </td>
                </tr>
              ) : (
                filtered.map(order => {
                  const isInlineEditing = inlineEditId === order.id;

                  if (isInlineEditing) {
                    // Inline Edit Row
                    return (
                      <tr key={order.id} className="bg-indigo-50/30 border-2 border-indigo-400 transition-colors">
                        {/* 1. Order ID Inline */}
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={inlineDraft.orderNumber}
                            onChange={(e) => setInlineDraft({ ...inlineDraft, orderNumber: e.target.value.toUpperCase() })}
                            className="w-full px-2 py-1 bg-white border border-indigo-300 rounded font-mono font-bold text-indigo-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
                            placeholder="INV..."
                          />
                        </td>

                        {/* 2. Date Inline */}
                        <td className="py-2.5 px-2.5">
                          <input
                            type="text"
                            value={inlineDraft.date}
                            onChange={(e) => setInlineDraft({ ...inlineDraft, date: e.target.value })}
                            className="w-full px-2 py-1 bg-white border border-indigo-300 rounded font-mono text-slate-800 text-[11px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="YYYY-MM-DD HH:mm"
                          />
                        </td>

                        {/* 3. Customer Inline */}
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={inlineDraft.customerName}
                            onChange={(e) => setInlineDraft({ ...inlineDraft, customerName: e.target.value })}
                            className="w-full px-2 py-1 bg-white border border-indigo-300 rounded font-medium text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-1"
                            placeholder="ชื่อลูกค้า"
                          />
                          <input
                            type="text"
                            value={inlineDraft.customerPhone}
                            onChange={(e) => setInlineDraft({ ...inlineDraft, customerPhone: e.target.value })}
                            className="w-full px-2 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px] text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="เบอร์โทร"
                          />
                        </td>

                        {/* 4. Type Inline */}
                        <td className="py-2.5 px-2 text-center">
                          <select
                            value={inlineDraft.orderType}
                            onChange={(e) => setInlineDraft({ ...inlineDraft, orderType: e.target.value as any })}
                            className="px-2 py-1 bg-white border border-indigo-300 rounded text-[11px] font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="general">GENERAL</option>
                            <option value="autoship">AUTOSHIP</option>
                            <option value="topup">TOPUP</option>
                          </select>
                        </td>

                        {/* 5. Amount Inline */}
                        <td className="py-2.5 px-2.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <span className="text-slate-400 text-xs">฿</span>
                            <input
                              type="number"
                              value={inlineDraft.totalAmount}
                              onChange={(e) => setInlineDraft({ ...inlineDraft, totalAmount: Number(e.target.value) || 0 })}
                              className="w-20 px-2 py-1 bg-white border border-indigo-300 rounded font-mono font-bold text-slate-900 text-xs text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        </td>

                        {/* 6. PV Inline */}
                        <td className="py-2.5 px-2.5 text-right">
                          <input
                            type="number"
                            value={inlineDraft.totalPv}
                            onChange={(e) => setInlineDraft({ ...inlineDraft, totalPv: Number(e.target.value) || 0 })}
                            className="w-16 px-2 py-1 bg-white border border-indigo-300 rounded font-mono font-semibold text-blue-700 text-xs text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </td>

                        {/* 7. Tracking & Carrier Inline */}
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={inlineDraft.trackingNumber}
                            onChange={(e) => setInlineDraft({ ...inlineDraft, trackingNumber: e.target.value.toUpperCase() })}
                            className="w-full px-2 py-1 bg-white border border-indigo-300 rounded font-mono text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase mb-1"
                            placeholder="เลขพัสดุ Tracking"
                          />
                          <select
                            value={inlineDraft.shippingCompany}
                            onChange={(e) => setInlineDraft({ ...inlineDraft, shippingCompany: e.target.value })}
                            className="w-full px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-600 focus:outline-none"
                          >
                            {CARRIERS.map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </td>

                        {/* 8. Status Inline */}
                        <td className="py-2.5 px-2 text-center">
                          <select
                            value={inlineDraft.status}
                            onChange={(e) => setInlineDraft({ ...inlineDraft, status: e.target.value as any })}
                            className="px-2 py-1 bg-white border border-indigo-300 rounded text-[11px] font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="paid">{language === 'th' ? 'รอแพ็ค (Paid)' : 'Paid'}</option>
                            <option value="shipping">{language === 'th' ? 'จัดส่ง (Shipping)' : 'Shipping'}</option>
                            <option value="completed">{language === 'th' ? 'สำเร็จ (Done)' : 'Completed'}</option>
                          </select>
                        </td>

                        {/* 9. Action Inline Buttons */}
                        <td className="py-2.5 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleSaveInlineEdit(order.id)}
                              title={language === 'th' ? 'บันทึกการแก้ไข' : 'Save changes'}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium text-xs flex items-center gap-1 shadow-2xs cursor-pointer transition-colors"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>{language === 'th' ? 'บันทึก' : 'Save'}</span>
                            </button>
                            <button
                              onClick={handleCancelInlineEdit}
                              title={language === 'th' ? 'ยกเลิก' : 'Cancel'}
                              className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  // Normal View Row
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/90 transition-colors h-14 group">
                      
                      {/* 1. Order ID */}
                      <td className="py-2.5 px-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-slate-900 text-xs">
                            {order.orderNumber}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          ID: {order.id.slice(-6)}
                        </span>
                      </td>

                      {/* 2. Date */}
                      <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                        <div className="flex items-center gap-1 text-slate-700">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{order.date}</span>
                        </div>
                      </td>

                      {/* 3. Customer */}
                      <td className="py-2.5 px-3.5">
                        <div className="font-semibold text-slate-900 text-xs truncate max-w-[170px]" title={order.shippingAddress.fullName}>
                          {order.shippingAddress.fullName}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                          <span>{order.shippingAddress.phone || '-'}</span>
                          {order.shippingAddress.province && (
                            <span className="text-slate-400 truncate max-w-[90px]">· {order.shippingAddress.province}</span>
                          )}
                        </div>
                      </td>

                      {/* 4. Type */}
                      <td className="py-2.5 px-2.5 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${
                          order.orderType === 'autoship'
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : order.orderType === 'topup'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {order.orderType}
                        </span>
                      </td>

                      {/* 5. Amount */}
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 text-xs tabular-nums">
                        ฿{order.totalAmount.toLocaleString()}
                      </td>

                      {/* 6. PV */}
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-blue-600 text-xs tabular-nums">
                        +{order.totalPv.toLocaleString()} <span className="text-[10px] font-medium text-blue-400">PV</span>
                      </td>

                      {/* 7. Tracking */}
                      <td className="py-2.5 px-3.5">
                        {order.trackingNumber ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-semibold text-slate-800 text-[11px]">
                              {order.trackingNumber}
                            </span>
                            <button
                              onClick={() => handleCopyTracking(order.trackingNumber!)}
                              title={language === 'th' ? 'คัดลอกเลขพัสดุ' : 'Copy tracking'}
                              className="text-slate-400 hover:text-indigo-600 cursor-pointer p-0.5"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">- ยังไม่ระบุ -</span>
                        )}
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <span>{order.shippingCompany || 'Anousith Logistics'}</span>
                          {order.trackingNumber && getCarrierTrackingUrl(order.shippingCompany || '', order.trackingNumber) && (
                            <a
                              href={getCarrierTrackingUrl(order.shippingCompany || '', order.trackingNumber)!}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-800 inline-flex items-center"
                              title="เปิดเว็บเช็คสถานะพัสดุ"
                            >
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </span>
                      </td>

                      {/* 8. Status */}
                      <td className="py-2.5 px-3 text-center">
                        <div className="inline-block relative">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border cursor-pointer appearance-none pr-5 transition-all text-center ${
                              order.status === 'completed'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                                : order.status === 'shipping'
                                ? 'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100'
                                : 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
                            }`}
                          >
                            <option value="paid">{language === 'th' ? 'รอแพ็ค / ชำระแล้ว' : 'Paid'}</option>
                            <option value="shipping">{language === 'th' ? 'กำลังจัดส่ง' : 'Shipping'}</option>
                            <option value="completed">{language === 'th' ? 'จัดส่งสำเร็จ' : 'Completed'}</option>
                          </select>
                          <ChevronDown className="w-2.5 h-2.5 text-current absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                        </div>
                      </td>

                      {/* 9. Action Buttons */}
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Full Edit Modal button */}
                          <button
                            onClick={() => handleOpenEditModal(order)}
                            title={language === 'th' ? 'เปิดฟอร์มแก้ไขข้อมูลคำสั่งซื้อทั้งหมด' : 'Full Edit Order Modal'}
                            className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer border border-indigo-200 hover:border-indigo-600"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>{language === 'th' ? 'แก้ไข' : 'Edit'}</span>
                          </button>

                          {/* Quick Inline Edit toggle button */}
                          <button
                            onClick={() => handleStartInlineEdit(order)}
                            title={language === 'th' ? 'แก้ไขในตารางทันที (Inline)' : 'Inline Edit'}
                            className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 rounded transition-colors cursor-pointer border border-slate-200"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Order button */}
                          <button
                            onClick={() => setOrderToDelete(order)}
                            title={language === 'th' ? 'ลบคำสั่งซื้อ' : 'Delete Order'}
                            className="p-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded transition-colors cursor-pointer border border-rose-200"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

        {/* Table Footer Summary */}
        <div className="p-3.5 bg-slate-50/70 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-3">
            <span>{language === 'th' ? 'สรุปในหน้านี้:' : 'Page Summary:'}</span>
            <span className="font-semibold text-slate-800">{filtered.length} {language === 'th' ? 'รายการ' : 'orders'}</span>
            <span>·</span>
            <span className="font-mono font-bold text-slate-900">
              ฿{filtered.reduce((s, o) => s + (o.totalAmount || 0), 0).toLocaleString()}
            </span>
            <span>·</span>
            <span className="font-mono font-bold text-blue-600">
              +{filtered.reduce((s, o) => s + (o.totalPv || 0), 0).toLocaleString()} PV
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            {language === 'th' ? '* การแก้ไขทั้งหมดจะถูกบันทึกในเครื่องอัตโนมัติ (LocalStorage)' : '* All edits auto-saved to local storage'}
          </div>
        </div>

      </div>

      {/* FULL EDIT ORDER MODAL */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 text-slate-900 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {language === 'th' ? 'แก้ไขข้อมูลคำสั่งซื้อ (Edit Order)' : 'Edit Order Details'}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    #{editingOrder.orderNumber} · ID: {editingOrder.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingOrder(null)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveEditModal} className="space-y-4 text-xs">
              
              {/* Row 1: Order ID & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'th' ? '1. เลขที่คำสั่งซื้อ (Order ID) *' : '1. Order ID / Invoice No *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formOrderId}
                    onChange={(e) => setFormOrderId(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    placeholder="INV202610-0089"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'th' ? '2. วัน-เวลาทำรายการ (Date) *' : '2. Date & Time *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    placeholder="2026-10-12 14:30"
                  />
                </div>
              </div>

              {/* Row 2: Customer Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'th' ? '3. ชื่อลูกค้า / ผู้รับ (Customer) *' : '3. Customer / Recipient Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formCustomerName}
                    onChange={(e) => setFormCustomerName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    placeholder="ชื่อ-นามสกุล ผู้รับ"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'th' ? 'เบอร์โทรศัพท์ (Phone)' : 'Phone Number'}
                  </label>
                  <input
                    type="text"
                    value={formCustomerPhone}
                    onChange={(e) => setFormCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    placeholder="089-123-4567"
                  />
                </div>
              </div>

              {/* Row 3: Customer Address Details */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <div className="font-semibold text-slate-700 flex items-center gap-1.5 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{language === 'th' ? 'ที่อยู่จัดส่งพัสดุ (Shipping Address)' : 'Shipping Destination Address'}</span>
                </div>
                <div>
                  <input
                    type="text"
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="บ้านเลขที่, หมู่, ถนน, แขวง/ตำบล, เขต/อำเภอ"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={formProvince}
                    onChange={(e) => setFormProvince(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="จังหวัด"
                  />
                  <input
                    type="text"
                    value={formPostcode}
                    onChange={(e) => setFormPostcode(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="รหัสไปรษณีย์"
                  />
                </div>
              </div>

              {/* Row 4: Type, Amount, PV */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'th' ? '4. ประเภทบิล (Type)' : '4. Order Type'}
                  </label>
                  <select
                    value={formOrderType}
                    onChange={(e) => setFormOrderType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  >
                    <option value="general">GENERAL (ทั่วไป)</option>
                    <option value="autoship">AUTOSHIP (รักษายอด)</option>
                    <option value="topup">TOPUP (เปิดแพ็คเกจ)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'th' ? '5. ยอดเงินรวม (Amount ฿)' : '5. Total Amount (THB)'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">฿</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={formAmount}
                      onChange={(e) => setFormAmount(Number(e.target.value) || 0)}
                      className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900 text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'th' ? '6. คะแนน (PV)' : '6. Points (PV)'}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="10"
                      value={formPv}
                      onChange={(e) => setFormPv(Number(e.target.value) || 0)}
                      className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-blue-600 text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 text-[10px] font-bold">PV</span>
                  </div>
                </div>
              </div>

              {/* Row 5: Tracking & Carrier */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'th' ? '7. เลขพัสดุ (Tracking No)' : '7. Tracking Number'}
                  </label>
                  <input
                    type="text"
                    value={formTracking}
                    onChange={(e) => setFormTracking(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    placeholder="เช่น TH01928472910B"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'th' ? 'บริษัทขนส่ง (Carrier)' : 'Shipping Carrier'}
                  </label>
                  <select
                    value={formCarrier}
                    onChange={(e) => setFormCarrier(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  >
                    {CARRIERS.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 6: Status */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {language === 'th' ? '8. สถานะคำสั่งซื้อ (Status) *' : '8. Order Status *'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormStatus('paid')}
                    className={`py-2 px-3 rounded-lg border text-center transition-all cursor-pointer font-bold ${
                      formStatus === 'paid'
                        ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {language === 'th' ? 'รอแพ็ค / ชำระแล้ว' : 'Paid'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormStatus('shipping')}
                    className={`py-2 px-3 rounded-lg border text-center transition-all cursor-pointer font-bold ${
                      formStatus === 'shipping'
                        ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {language === 'th' ? 'กำลังจัดส่ง' : 'In Transit'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormStatus('completed')}
                    className={`py-2 px-3 rounded-lg border text-center transition-all cursor-pointer font-bold ${
                      formStatus === 'completed'
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {language === 'th' ? 'จัดส่งสำเร็จ' : 'Delivered'}
                  </button>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{language === 'th' ? 'บันทึกการแก้ไขคำสั่งซื้อ' : 'Save Changes'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors cursor-pointer"
                >
                  {language === 'th' ? 'ยกเลิก' : 'Cancel'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* CREATE NEW ORDER MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 text-slate-900 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {language === 'th' ? 'สร้างบิลคำสั่งซื้อใหม่ (Create Order)' : 'Create New Order'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {language === 'th' ? 'กรอกข้อมูลคำสั่งซื้อเพื่อเพิ่มเข้าระบบ' : 'Enter order parameters to add to system'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateOrderSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'th' ? 'เลขที่คำสั่งซื้อ (Order ID) *' : 'Order ID *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newOrderForm.orderNumber}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, orderNumber: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'th' ? 'วัน-เวลา (Date) *' : 'Date *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newOrderForm.date}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'th' ? 'ชื่อลูกค้า / ผู้รับ (Customer) *' : 'Customer Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newOrderForm.customerName}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, customerName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="เช่น สมชาย ใจดี"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'th' ? 'เบอร์โทร (Phone)' : 'Phone'}
                  </label>
                  <input
                    type="text"
                    value={newOrderForm.customerPhone}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, customerPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="081-xxx-xxxx"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'th' ? 'ประเภทบิล (Type)' : 'Type'}
                  </label>
                  <select
                    value={newOrderForm.orderType}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, orderType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="general">GENERAL (ทั่วไป)</option>
                    <option value="autoship">AUTOSHIP (รักษายอด)</option>
                    <option value="topup">TOPUP (เปิดแพ็คเกจ)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'th' ? 'ยอดเงิน (Amount ฿)' : 'Amount (THB)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newOrderForm.totalAmount}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, totalAmount: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900 text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'th' ? 'คะแนน (PV)' : 'PV'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newOrderForm.totalPv}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, totalPv: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-blue-600 text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'th' ? 'เลขพัสดุ (Tracking No)' : 'Tracking No'}
                  </label>
                  <input
                    type="text"
                    value={newOrderForm.trackingNumber}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, trackingNumber: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="TH01928..."
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'th' ? 'บริษัทขนส่ง' : 'Carrier'}
                  </label>
                  <select
                    value={newOrderForm.shippingCompany}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, shippingCompany: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {CARRIERS.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {language === 'th' ? 'สถานะเริ่มต้น (Status)' : 'Status'}
                </label>
                <select
                  value={newOrderForm.status}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, status: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="paid">{language === 'th' ? 'รอแพ็ค / ชำระแล้ว (Paid)' : 'Paid'}</option>
                  <option value="shipping">{language === 'th' ? 'กำลังจัดส่ง (In Transit)' : 'Shipping'}</option>
                  <option value="completed">{language === 'th' ? 'จัดส่งสำเร็จ (Delivered)' : 'Completed'}</option>
                </select>
              </div>

              <div className="flex gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{language === 'th' ? 'สร้างคำสั่งซื้อ' : 'Create Order'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors cursor-pointer"
                >
                  {language === 'th' ? 'ยกเลิก' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {orderToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-slate-900 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-center mb-1 text-slate-900">
              {language === 'th' ? 'ยืนยันการลบคำสั่งซื้อ?' : 'Confirm Delete Order?'}
            </h3>
            <p className="text-xs text-slate-500 text-center mb-4 font-mono">
              #{orderToDelete.orderNumber} ({orderToDelete.shippingAddress.fullName})
            </p>
            <p className="text-xs text-rose-600 text-center mb-5 bg-rose-50 p-2.5 rounded-lg border border-rose-100">
              {language === 'th' 
                ? 'คำเตือน: การลบรายการนี้จะลบออกจากระบบทันที ไม่สามารถกู้คืนได้' 
                : 'Warning: This order will be permanently removed from the system.'}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  deleteOrder(orderToDelete.id);
                  setOrderToDelete(null);
                }}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs cursor-pointer transition-colors shadow-2xs"
              >
                {language === 'th' ? 'ยืนยันลบ' : 'Yes, Delete'}
              </button>
              <button
                onClick={() => setOrderToDelete(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-xs cursor-pointer transition-colors"
              >
                {language === 'th' ? 'ยกเลิก' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

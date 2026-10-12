import React from 'react';
import { 
  Users, 
  DollarSign, 
  ShoppingBag, 
  Calculator, 
  ArrowDownToLine, 
  TrendingUp, 
  Sparkles, 
  ShieldAlert, 
  Clock, 
  ChevronRight,
  Package,
  Layers
} from 'lucide-react';
import { useMlm } from '../../../context/MlmContext';

export const AdminDashboardView: React.FC = () => {
  const { 
    language, 
    binaryNodes, 
    orders, 
    commissionCycles, 
    withdrawalRequests, 
    products, 
    setAdminTab,
    calculateNewCommissionCycle 
  } = useMlm();

  const allMembers = Object.values(binaryNodes);
  const totalMembersCount = allMembers.length;
  const activeMembersCount = allMembers.filter(m => m.isActive).length;

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0) + 1850000; // base company revenue
  const totalPvVolume = allMembers.reduce((sum, m) => sum + m.personalPv + m.accumulatedPv, 0);

  const totalCommissionsPaid = commissionCycles
    .filter(c => c.status === 'paid')
    .reduce((sum, c) => sum + c.netPayout, 0) + 1240000;

  const pendingWithdrawals = withdrawalRequests.filter(w => w.status === 'pending');
  const pendingWithdrawalSum = pendingWithdrawals.reduce((sum, w) => sum + w.amount, 0);

  const pendingOrders = orders.filter(o => o.status === 'paid' || o.status === 'shipping');

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 rounded-2xl p-6 text-white border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/30 text-purple-200 border border-purple-400/40 uppercase tracking-wider">
              Control Panel v4.2
            </span>
            <span className="text-xs text-slate-400 font-mono">
              OMC Central Headquarters
            </span>
          </div>
          <h2 className="text-xl font-bold mt-1 tracking-tight">
            {language === 'th' ? 'แผงควบคุมระบบบริหารขายตรง (Administrator Console)' : 'OMC MLM System Administration Console'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {language === 'th' 
              ? 'ระบบมอนิเตอร์ภาพรวมธุรกิจ ยอดขาย สมาชิก ผังองค์กร และประมวลผลคำนวณคอมมิชชั่น' 
              : 'Real-time corporate oversight of revenue, network volume, fulfillment, and commission engines.'}
          </p>
        </div>

        {/* Quick Operations Button */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => calculateNewCommissionCycle()}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>{language === 'th' ? 'กดคำนวณโบนัสรอบใหม่' : 'Run Cycle Calculation'}</span>
          </button>
        </div>
      </div>

      {/* 4 Core Corporate Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Revenue */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">{language === 'th' ? 'ยอดขายสะสมทั้งบริษัท' : 'Total Company Revenue'}</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              ฿{totalRevenue.toLocaleString()}
            </div>
            <div className="mt-1 text-xs text-slate-500 flex items-center justify-between">
              <span>{language === 'th' ? 'คำสั่งซื้อทั้งหมด:' : 'Total Orders:'}</span>
              <span className="font-mono font-medium text-slate-800 tabular-nums">{orders.length + 342} บิล</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% {language === 'th' ? 'เทียบเดือนก่อน' : 'vs last month'}</span>
          </div>
        </div>

        {/* Metric 2: Members Count */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">{language === 'th' ? 'สมาชิกในระบบทั้งหมด' : 'Total Network Members'}</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {totalMembersCount + 285} <span className="text-sm font-normal text-slate-500">{language === 'th' ? 'รหัส' : 'members'}</span>
            </div>
            <div className="mt-1 text-xs text-slate-500 flex items-center justify-between">
              <span>{language === 'th' ? 'สถานะ Active:' : 'Active Status:'}</span>
              <span className="font-mono font-medium text-emerald-700 tabular-nums">{activeMembersCount + 260} รหัส</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              onClick={() => setAdminTab('admin_members')}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>{language === 'th' ? 'จัดการสมาชิก' : 'Manage Members'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Metric 3: Total PV Circulating */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">{language === 'th' ? 'คะแนน PV หมุนเวียน' : 'Total System PV Volume'}</span>
            <Layers className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-purple-700 tabular-nums">
              {totalPvVolume.toLocaleString()} <span className="text-sm font-normal text-slate-500">PV</span>
            </div>
            <div className="mt-1 text-xs text-slate-500 flex items-center justify-between">
              <span>{language === 'th' ? 'อัตราค่าคอมมิชชั่นเฉลี่ย:' : 'Payout Ratio:'}</span>
              <span className="font-mono font-medium text-slate-800 tabular-nums">54.2%</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>{language === 'th' ? 'สิทธิประโยชน์ 5 ช่องทาง' : '5-Tier Compensation'}</span>
            <span className="text-indigo-600 font-medium">Safe Cap</span>
          </div>
        </div>

        {/* Metric 4: Pending Withdrawals */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">{language === 'th' ? 'คำขอถอนเงินรออนุมัติ' : 'Pending Withdrawals'}</span>
            <ArrowDownToLine className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-amber-700 tabular-nums">
              ฿{pendingWithdrawalSum.toLocaleString()}
            </div>
            <div className="mt-1 text-xs text-slate-500 flex items-center justify-between">
              <span>{language === 'th' ? 'จำนวนคำขอ:' : 'Pending Requests:'}</span>
              <span className="font-mono font-bold text-amber-600 tabular-nums">{pendingWithdrawals.length} รายการ</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              onClick={() => setAdminTab('admin_withdrawals')}
              className="text-amber-700 hover:text-amber-800 font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>{language === 'th' ? 'ตรวจสอบ & อนุมัติ' : 'Review & Approve'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Grid: Pending Workflows & Cycle Execution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Orders & Fulfillment Queue */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-indigo-600" />
                <span>{language === 'th' ? 'รายการคำสั่งซื้อล่าสุดที่ต้องจัดส่ง' : 'Fulfillment Dispatch Queue'}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'th' ? 'อัปเดตสถานะและใส่หมายเลขพัสดุจัดส่งให้สมาชิก' : 'Assign courier tracking and update dispatch states'}
              </p>
            </div>
            <button
              onClick={() => setAdminTab('admin_orders')}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer"
            >
              {language === 'th' ? 'ดูคำสั่งซื้อทั้งหมด' : 'View All Orders'}
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {orders.slice(0, 4).map(o => (
              <div key={o.id} className="py-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{o.orderNumber}</span>
                    <span className="px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 font-medium text-[10px]">
                      {o.orderType.toUpperCase()}
                    </span>
                    <span className={`px-2 py-0.2 rounded text-[10px] font-semibold ${
                      o.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {o.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1">
                    {o.shippingAddress.fullName} · {o.items.length} รายการ ({o.totalPv} PV)
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {language === 'th' ? 'ขนส่ง:' : 'Courier:'} {o.shippingCompany || 'Anousith Logistics'} · {o.trackingNumber || 'รอเลขพัสดุ'}
                  </p>
                </div>

                <div className="text-right sm:self-center">
                  <div className="font-mono font-bold text-slate-900 text-sm tabular-nums">
                    ฿{o.totalAmount.toLocaleString()}
                  </div>
                  <button
                    onClick={() => setAdminTab('admin_orders')}
                    className="mt-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    {language === 'th' ? 'แก้ไขพัสดุ' : 'Update Tracking'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Commission Engine Status */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-purple-600" />
                <span>{language === 'th' ? 'สถานะรอบการตัดจ่ายโบนัส' : 'Commission Engine'}</span>
              </h3>
              <span className="text-xs text-purple-600 font-mono font-bold">Cycle Engine</span>
            </div>

            <div className="mt-3 space-y-3 text-xs">
              <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 space-y-1">
                <span className="text-[11px] text-purple-800 font-semibold block">
                  {language === 'th' ? 'รอบที่กำลังคำนวณปัจจุบัน:' : 'Active Cycle Period:'}
                </span>
                <p className="font-bold text-slate-900 text-sm">
                  {commissionCycles[0]?.periodName}
                </p>
                <div className="flex items-center justify-between text-slate-600 pt-1 text-[11px]">
                  <span>{language === 'th' ? 'ยอดรอจ่ายสุทธิ:' : 'Pending Net Payout:'}</span>
                  <span className="font-mono font-bold text-purple-700 tabular-nums">
                    ฿{commissionCycles[0]?.netPayout.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-slate-600">
                <div className="flex justify-between">
                  <span>{language === 'th' ? 'ตัดรอบเวลา:' : 'Cut-off Time:'}</span>
                  <span className="font-mono font-medium text-slate-900">23:59:59 (Daily)</span>
                </div>
                <div className="flex justify-between">
                  <span>{language === 'th' ? 'หักภาษี ณ ที่จ่าย:' : 'Withholding Tax:'}</span>
                  <span className="font-mono font-medium text-slate-900">3.00%</span>
                </div>
                <div className="flex justify-between">
                  <span>{language === 'th' ? 'รอบที่จ่ายแล้ว:' : 'Completed Cycles:'}</span>
                  <span className="font-mono font-medium text-slate-900">{commissionCycles.length} รอบ</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => setAdminTab('admin_commissions')}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <span>{language === 'th' ? 'เปิดระบบคำนวณและตัดรอบ' : 'Open Commission Center'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

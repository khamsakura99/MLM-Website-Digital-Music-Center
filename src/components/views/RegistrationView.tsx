import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Check, 
  ShieldCheck, 
  CreditCard, 
  Building2, 
  MapPin, 
  User, 
  Sparkles,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useMlm } from '../../context/MlmContext';
import { MemberRank } from '../../types/mlm';

export const RegistrationView: React.FC = () => {
  const { 
    language, 
    currentMember, 
    binaryNodes, 
    registerNewMember, 
    registrationPreFill, 
    setRegistrationPreFill,
    setActiveTab,
    showToast 
  } = useMlm();

  // Form states
  const [sponsorCode, setSponsorCode] = useState(currentMember.memberCode);
  const [sponsorName, setSponsorName] = useState(currentMember.fullName);
  const [uplineCode, setUplineCode] = useState(registrationPreFill?.uplineCode || currentMember.memberCode);
  const [uplineName, setUplineName] = useState(currentMember.fullName);
  const [position, setPosition] = useState<'L' | 'R'>(registrationPreFill?.position || 'L');

  // Applicant info
  const [fullName, setFullName] = useState('');
  const [idCardNumber, setIdCardNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [province, setProvince] = useState('กรุงเทพมหานคร');
  const [postcode, setPostcode] = useState('10900');

  // Bank Info
  const [bankName, setBankName] = useState('ธนาคารกสิกรไทย (KBANK)');
  const [accountNumber, setAccountNumber] = useState('');

  // Package Rank selection
  const [selectedRank, setSelectedRank] = useState<MemberRank>('Bronze');
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'promptpay'>('wallet');

  // Success state
  const [createdMemberCode, setCreatedMemberCode] = useState<string | null>(null);

  useEffect(() => {
    if (registrationPreFill?.uplineCode) {
      setUplineCode(registrationPreFill.uplineCode);
      const node = binaryNodes[registrationPreFill.uplineCode];
      if (node) setUplineName(node.name);
    }
    if (registrationPreFill?.position) {
      setPosition(registrationPreFill.position);
    }
  }, [registrationPreFill, binaryNodes]);

  const packages: {
    rank: MemberRank;
    pv: number;
    price: number;
    titleTh: string;
    descTh: string;
    color: string;
  }[] = [
    {
      rank: 'Bronze',
      pv: 500,
      price: 2500,
      titleTh: 'Bronze Package (เริ่มต้น)',
      descTh: 'สินค้า 2 ชิ้น รับโบนัสจับคู่สูงสุด 5,000 บ./วัน',
      color: 'border-amber-800/40 bg-amber-50/40'
    },
    {
      rank: 'Silver',
      pv: 1000,
      price: 4900,
      titleTh: 'Silver Package (เติบโต)',
      descTh: 'สินค้า 4 ชิ้น รับโบนัสจับคู่สูงสุด 15,000 บ./วัน',
      color: 'border-slate-300 bg-slate-50'
    },
    {
      rank: 'Gold',
      pv: 2500,
      price: 11900,
      titleTh: 'Gold Package (ผู้นำ)',
      descTh: 'สินค้า 8 ชิ้น รับโบนัสจับคู่สูงสุด 40,000 บ./วัน + แมชชิ่ง 3 ชั้น',
      color: 'border-amber-400 bg-amber-50/60'
    },
    {
      rank: 'Diamond',
      pv: 5000,
      price: 23500,
      titleTh: 'Diamond VIP (สูงสุด)',
      descTh: 'สินค้า 16 ชิ้น รับโบนัสจับคู่สูงสุด 80,000 บ./วัน + แมชชิ่ง 5 ชั้น + All-Sale',
      color: 'border-blue-400 bg-blue-50/60'
    }
  ];

  const currentPkg = packages.find(p => p.rank === selectedRank) || packages[0];

  const handleVerifyUpline = () => {
    const code = uplineCode.trim().toUpperCase();
    const node = Object.values(binaryNodes).find(n => n.memberCode.toUpperCase() === code);
    if (node) {
      setUplineName(node.name);
      showToast(language === 'th' ? `พบอัพไลน์: ${node.name}` : `Found upline: ${node.name}`, 'info');
    } else {
      setUplineName('');
      showToast(language === 'th' ? 'ไม่พบรหัสอัพไลน์นี้ในสายงาน' : 'Upline not found', 'error');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !phone.trim()) {
      showToast(language === 'th' ? 'กรุณากรอกข้อมูลผู้สมัครให้ครบถ้วน' : 'Please fill all fields', 'error');
      return;
    }

    const res = registerNewMember({
      fullName: fullName.trim(),
      idCardNumber: idCardNumber.trim() || '1-1020-00123-45-6',
      phone: phone.trim(),
      email: email.trim() || 'member@omc.th',
      address: address.trim() || '99/1 ถ.พหลโยธิน',
      province,
      postcode,
      sponsorCode,
      uplineCode,
      position,
      rank: selectedRank,
      packagePv: currentPkg.pv,
      packageAmount: currentPkg.price,
      paymentMethod
    });

    if (res.success) {
      setCreatedMemberCode(res.newMemberCode);
      setRegistrationPreFill(null);
    } else {
      showToast(res.message, 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Title */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-blue-600" />
          <span>{language === 'th' ? 'สมัครสมาชิกใหม่ในสายงาน (Downline Enrollment)' : 'Enroll New Downline Member'}</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {language === 'th' 
            ? 'คีย์ข้อมูลผู้สมัคร วางผังสายงานไบนารี่ และตัดชำระชุดเปิดรหัสธุรกิจทันที สมาชิกใหม่จะปรากฏในผังองค์กรแบบเรียลไทม์' 
            : 'Fill applicant profile, assign placement leg, select starter franchise package, and settle instantly.'}
        </p>
      </div>

      {/* Success Notification Card */}
      {createdMemberCode ? (
        <div className="bg-white rounded-2xl p-8 border border-emerald-200 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <Check className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            {language === 'th' ? 'ลงทะเบียนและเปิดรหัสสมาชิกสำเร็จ!' : 'Member Enrollment Successful!'}
          </h3>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 max-w-sm mx-auto text-xs space-y-1">
            <p className="text-slate-500">{language === 'th' ? 'รหัสสมาชิกใหม่:' : 'New Member ID:'}</p>
            <p className="text-2xl font-bold font-mono text-blue-700">{createdMemberCode}</p>
            <p className="font-semibold text-slate-800">{fullName}</p>
            <p className="text-slate-500 font-mono">
              {language === 'th' ? 'ตำแหน่ง:' : 'Rank:'} {selectedRank} ({currentPkg.pv} PV)
            </p>
            <p className="text-slate-500">
              {language === 'th' ? 'อัพไลน์:' : 'Upline:'} {uplineCode} ({position === 'L' ? 'Left' : 'Right'})
            </p>
          </div>

          <div className="flex gap-3 justify-center pt-2">
            <button
              onClick={() => setActiveTab('genealogy_binary')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors"
            >
              {language === 'th' ? 'ดูในผังองค์กรไบนารี่' : 'View in Binary Tree'}
            </button>
            <button
              onClick={() => {
                setCreatedMemberCode(null);
                setFullName('');
                setPhone('');
              }}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
            >
              {language === 'th' ? 'ลงทะเบียนคนถัดไป' : 'Register Another'}
            </button>
          </div>
        </div>
      ) : (
        /* Registration Form */
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Placement & Sponsor */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">1</span>
              <span>{language === 'th' ? 'ข้อมูลผู้แนะนำและตำแหน่งวางสายงาน' : 'Sponsor & Placement Structure'}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {language === 'th' ? 'รหัสผู้แนะนำตรง (Sponsor):' : 'Sponsor ID:'}
                </label>
                <input
                  type="text"
                  value={sponsorCode}
                  onChange={(e) => setSponsorCode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg font-mono text-slate-800 font-bold"
                  readOnly
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  {sponsorName}
                </span>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {language === 'th' ? 'รหัสอัพไลน์ต่อสายงาน (Upline):' : 'Upline ID:'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={uplineCode}
                    onChange={(e) => setUplineCode(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleVerifyUpline}
                    className="px-3 py-2 bg-slate-800 text-white rounded-lg font-medium"
                  >
                    {language === 'th' ? 'ตรวจ' : 'Check'}
                  </button>
                </div>
                {uplineName && (
                  <span className="text-[11px] text-emerald-700 mt-1 block font-medium">
                    ✓ {uplineName}
                  </span>
                )}
              </div>
            </div>

            {/* Position Leg Selector */}
            <div className="pt-2">
              <label className="font-semibold text-slate-700 block mb-1 text-xs">
                {language === 'th' ? 'เลือกข้างต่อสายงาน (Placement Leg):' : 'Placement Leg:'}
              </label>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setPosition('L')}
                  className={`p-3 rounded-lg border font-semibold flex items-center justify-center gap-2 transition-colors ${
                    position === 'L' 
                      ? 'border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-500/10' 
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  <span>◀ {language === 'th' ? 'สายงานฝั่งซ้าย (Left Leg)' : 'Left Leg'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPosition('R')}
                  className={`p-3 rounded-lg border font-semibold flex items-center justify-center gap-2 transition-colors ${
                    position === 'R' 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-800 ring-2 ring-indigo-500/10' 
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  <span>{language === 'th' ? 'สายงานฝั่งขวา (Right Leg)' : 'Right Leg'} ▶</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Applicant Personal Details */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">2</span>
              <span>{language === 'th' ? 'ข้อมูลส่วนตัวผู้สมัคร' : 'Applicant Personal Details'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {language === 'th' ? 'ชื่อ-นามสกุล (ตรงตามบัตรประชาชน):' : 'Full Legal Name:'}
                </label>
                <input
                  type="text"
                  placeholder="เช่น สมชาย ใจดี"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {language === 'th' ? 'เลขประจำตัวประชาชน (13 หลัก):' : 'National ID (13 digits):'}
                </label>
                <input
                  type="text"
                  placeholder="1-XXXX-XXXXX-XX-X"
                  value={idCardNumber}
                  onChange={(e) => setIdCardNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {language === 'th' ? 'เบอร์โทรศัพท์ติดต่อ:' : 'Mobile Phone:'}
                </label>
                <input
                  type="tel"
                  placeholder="08X-XXX-XXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {language === 'th' ? 'อีเมล (ถ้ามี):' : 'Email:'}
                </label>
                <input
                  type="email"
                  placeholder="example@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-700 block mb-1">
                  {language === 'th' ? 'ที่อยู่สำหรับจัดส่งชุดสินค้าเปิดรหัส:' : 'Delivery Address:'}
                </label>
                <textarea
                  rows={2}
                  placeholder="บ้านเลขที่, หมู่, ถนน, แขวง/ตำบล, เขต/อำเภอ"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Package Selection */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">3</span>
              <span>{language === 'th' ? 'เลือกชุดสมัครเปิดรหัสธุรกิจ (Starter Franchise Package)' : 'Franchise Starter Package'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {packages.map(pkg => (
                <button
                  key={pkg.rank}
                  type="button"
                  onClick={() => setSelectedRank(pkg.rank)}
                  className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    selectedRank === pkg.rank
                      ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{pkg.titleTh}</span>
                    <span className="font-mono text-xs font-bold text-blue-700 block mt-1">+{pkg.pv} PV</span>
                    <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">{pkg.descTh}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/60 font-mono font-bold text-slate-900 text-base">
                    ฿{pkg.price.toLocaleString()}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Payment Confirmation */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">4</span>
              <span>{language === 'th' ? 'ยืนยันการชำระเงินค่าชุดเปิดรหัส' : 'Settlement & Payment Method'}</span>
            </h3>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block">{language === 'th' ? 'แพ็กเกจที่เลือก:' : 'Selected Package:'}</span>
                <span className="text-base font-bold text-slate-900">{currentPkg.titleTh}</span>
                <span className="text-blue-600 font-mono ml-2 font-bold">({currentPkg.pv} PV)</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block">{language === 'th' ? 'ยอดที่ต้องชำระ:' : 'Total Payable:'}</span>
                <span className="text-xl font-bold font-mono text-slate-900">฿{currentPkg.price.toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMethod('wallet')}
                className={`p-3 rounded-lg border font-medium flex items-center justify-center gap-2 transition-colors ${
                  paymentMethod === 'wallet'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <span>{language === 'th' ? 'หักผ่าน E-Wallet ของฉัน' : 'Deduct My E-Wallet'}</span>
                <span className="font-mono text-[10px] text-slate-500">
                  (฿{currentMember.walletBalance.toLocaleString()})
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('promptpay')}
                className={`p-3 rounded-lg border font-medium flex items-center justify-center gap-2 transition-colors ${
                  paymentMethod === 'promptpay'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <span>{language === 'th' ? 'สแกน QR PromptPay' : 'Scan PromptPay QR'}</span>
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span>{language === 'th' ? 'ยืนยันการสมัครและเปิดรหัสสมาชิกทันที' : 'Confirm Enrollment & Activate Code'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>
      )}

    </div>
  );
};

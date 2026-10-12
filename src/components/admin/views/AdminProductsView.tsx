import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Edit2, 
  Edit3, 
  Trash2, 
  Check, 
  X,
  RotateCcw,
  Sparkles,
  Layers,
  Image as ImageIcon,
  DollarSign,
  AlertTriangle,
  Upload,
  ExternalLink,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { useMlm } from '../../../context/MlmContext';
import { Product } from '../../../types/mlm';

const PRESET_PRODUCT_IMAGES = [
  { label: 'Supplement (อาหารเสริมถั่งเช่า)', url: '/src/assets/images/mlm_product_supplement_1791310634193.jpg' },
  { label: 'Collagen (คอลลาเจนไดเปปไทด์)', url: '/src/assets/images/mlm_product_collagen_1791310650397.jpg' },
  { label: 'Arabica Coffee (กาแฟอาราบิก้า)', url: '/src/assets/images/mlm_product_coffee_1791310665459.jpg' },
  { label: 'Golden Serum (เซรั่มสเต็มเซลล์ทองคำ)', url: '/src/assets/images/mlm_product_serum_1791310681702.jpg' },
];

export const AdminProductsView: React.FC = () => {
  const { 
    language, 
    products, 
    addProduct, 
    updateProductStock, 
    updateProductFullDetails,
    deleteProduct,
    resetProductsToDefault,
    showToast 
  } = useMlm();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Stock Quick-edit Modal State
  const [editingStockProduct, setEditingStockProduct] = useState<Product | null>(null);
  const [newStockVal, setNewStockVal] = useState('');

  // Full Edit Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formSku, setFormSku] = useState('');
  const [formNameTh, setFormNameTh] = useState('');
  const [formCategory, setFormCategory] = useState<'health' | 'beauty' | 'beverage' | 'package'>('health');
  const [formMemberPrice, setFormMemberPrice] = useState<number>(0);
  const [formRetailPrice, setFormRetailPrice] = useState<number>(0);
  const [formPv, setFormPv] = useState<number>(0);
  const [formStock, setFormStock] = useState<number>(0);
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formDescriptionTh, setFormDescriptionTh] = useState('');

  // Inline Row Edit State (product.id -> inlineDraft)
  const [inlineEditId, setInlineEditId] = useState<string | null>(null);
  const [inlineDraft, setInlineDraft] = useState<{
    code: string;
    nameTh: string;
    category: 'health' | 'beauty' | 'beverage' | 'package';
    memberPrice: number;
    retailPrice: number;
    pv: number;
    stock: number;
    imageUrl: string;
  }>({
    code: '',
    nameTh: '',
    category: 'health',
    memberPrice: 0,
    retailPrice: 0,
    pv: 0,
    stock: 0,
    imageUrl: ''
  });

  // Add New Product Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newNameTh, setNewNameTh] = useState('');
  const [newCategory, setNewCategory] = useState<'health' | 'beauty' | 'beverage' | 'package'>('health');
  const [newMemberPrice, setNewMemberPrice] = useState('1250');
  const [newRetailPrice, setNewRetailPrice] = useState('1850');
  const [newPv, setNewPv] = useState('250');
  const [newStock, setNewStock] = useState('100');
  const [newImageUrl, setNewImageUrl] = useState('/src/assets/images/mlm_product_supplement_1791310634193.jpg');
  const [newDescriptionTh, setNewDescriptionTh] = useState('');

  // Delete Confirm Modal State
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // Filtered Products
  const filtered = products.filter(p => {
    const q = search.trim().toLowerCase();
    const matchSearch = !q || 
      p.code.toLowerCase().includes(q) || 
      p.nameTh.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);
    const matchCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  // Summary Metrics
  const totalStockCount = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const totalCatalogPv = products.reduce((sum, p) => sum + (p.pv || 0), 0);
  const lowStockCount = products.filter(p => p.stock < 100).length;

  // Open Full Edit Modal
  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormSku(product.code);
    setFormNameTh(product.nameTh);
    setFormCategory(product.category);
    setFormMemberPrice(product.memberPrice);
    setFormRetailPrice(product.retailPrice);
    setFormPv(product.pv);
    setFormStock(product.stock);
    setFormImageUrl(product.imageUrl);
    setFormDescriptionTh(product.descriptionTh || '');
  };

  // Submit Full Edit Modal
  const handleSaveEditModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (!formSku.trim()) {
      showToast(language === 'th' ? 'กรุณาระบุรหัสสินค้า (SKU)' : 'Please provide SKU', 'error');
      return;
    }
    if (!formNameTh.trim()) {
      showToast(language === 'th' ? 'กรุณาระบุชื่อสินค้า' : 'Please provide Product Name', 'error');
      return;
    }

    const res = updateProductFullDetails(editingProduct.id, {
      code: formSku,
      nameTh: formNameTh,
      category: formCategory,
      memberPrice: formMemberPrice,
      retailPrice: formRetailPrice,
      pv: formPv,
      stock: formStock,
      imageUrl: formImageUrl || editingProduct.imageUrl,
      descriptionTh: formDescriptionTh
    });

    if (res.success) {
      setEditingProduct(null);
    }
  };

  // Start Inline Edit
  const handleStartInlineEdit = (product: Product) => {
    setInlineEditId(product.id);
    setInlineDraft({
      code: product.code,
      nameTh: product.nameTh,
      category: product.category,
      memberPrice: product.memberPrice,
      retailPrice: product.retailPrice,
      pv: product.pv,
      stock: product.stock,
      imageUrl: product.imageUrl
    });
  };

  // Save Inline Edit
  const handleSaveInlineEdit = (productId: string) => {
    if (!inlineDraft.code.trim()) {
      showToast(language === 'th' ? 'กรุณาระบุรหัสสินค้า (SKU)' : 'SKU is required', 'error');
      return;
    }
    if (!inlineDraft.nameTh.trim()) {
      showToast(language === 'th' ? 'กรุณาระบุชื่อสินค้า' : 'Product name is required', 'error');
      return;
    }

    const res = updateProductFullDetails(productId, {
      code: inlineDraft.code,
      nameTh: inlineDraft.nameTh,
      category: inlineDraft.category,
      memberPrice: inlineDraft.memberPrice,
      retailPrice: inlineDraft.retailPrice,
      pv: inlineDraft.pv,
      stock: inlineDraft.stock,
      imageUrl: inlineDraft.imageUrl
    });

    if (res.success) {
      setInlineEditId(null);
    }
  };

  // Cancel Inline Edit
  const handleCancelInlineEdit = () => {
    setInlineEditId(null);
  };

  // Quick Stock Submit
  const handleStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStockProduct) return;
    const val = parseInt(newStockVal, 10);
    if (isNaN(val)) return;
    updateProductStock(editingStockProduct.id, val);
    setEditingStockProduct(null);
  };

  // Add Product Submit
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newNameTh.trim()) {
      showToast(language === 'th' ? 'กรุณากรอกรหัสสินค้าและชื่อสินค้า' : 'SKU and Name are required', 'error');
      return;
    }

    addProduct({
      code: newCode.trim().toUpperCase(),
      name: newNameTh.trim(),
      nameTh: newNameTh.trim(),
      category: newCategory,
      memberPrice: parseFloat(newMemberPrice) || 1000,
      retailPrice: parseFloat(newRetailPrice) || 1500,
      pv: parseInt(newPv, 10) || 200,
      stock: parseInt(newStock, 10) || 100,
      imageUrl: newImageUrl || '/src/assets/images/mlm_product_supplement_1791310634193.jpg',
      description: newDescriptionTh || 'Official catalog product item.',
      descriptionTh: newDescriptionTh || 'สินค้าแท้จากระบบ OMC จัดจำหน่ายอย่างเป็นทางการ'
    });

    setShowAddModal(false);
    setNewCode('');
    setNewNameTh('');
    setNewMemberPrice('1250');
    setNewRetailPrice('1850');
    setNewPv('250');
    setNewStock('100');
    setNewDescriptionTh('');
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!deletingProduct) return;
    deleteProduct(deletingProduct.id);
    setDeletingProduct(null);
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'health':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'beauty':
        return 'bg-pink-50 text-pink-700 border-pink-200';
      case 'beverage':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'package':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <Package className="w-4 h-4 text-indigo-600" />
            <span>{language === 'th' ? 'รายการสินค้าทั้งหมด' : 'Total Products'}</span>
          </div>
          <div className="mt-1 font-mono font-bold text-slate-900 text-lg">
            {products.length} <span className="text-xs font-normal text-slate-500 font-sans">{language === 'th' ? 'รายการ' : 'SKUs'}</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>{language === 'th' ? 'สต็อกคงเหลือรวม' : 'Total Stock In Hand'}</span>
          </div>
          <div className="mt-1 font-mono font-bold text-slate-900 text-lg">
            {totalStockCount.toLocaleString()} <span className="text-xs font-normal text-slate-500 font-sans">{language === 'th' ? 'ชิ้น' : 'Units'}</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>{language === 'th' ? 'แต้ม PV สะสมรวม' : 'Total Catalog PV'}</span>
          </div>
          <div className="mt-1 font-mono font-bold text-blue-600 text-lg">
            {totalCatalogPv.toLocaleString()} <span className="text-xs font-normal text-blue-500 font-sans">PV</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>{language === 'th' ? 'สต็อกใกล้หมด (<100)' : 'Low Stock Items'}</span>
          </div>
          <div className="mt-1 font-mono font-bold text-amber-600 text-lg">
            {lowStockCount} <span className="text-xs font-normal text-slate-500 font-sans">{language === 'th' ? 'รายการ' : 'SKUs'}</span>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-indigo-600" />
              <span>{language === 'th' ? 'จัดการแคตตาล็อกสินค้า & สต็อกคงคลัง' : 'Products & Stock Inventory Control'}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'th' 
                ? `แสดงสินค้า ${filtered.length} จากทั้งหมด ${products.length} รายการ (Admin สามารถแก้ไขได้ทุกคอลัมน์)` 
                : `Showing ${filtered.length} of ${products.length} active catalog products (Admin can edit all columns)`}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={resetProductsToDefault}
              title={language === 'th' ? 'รีเซ็ตข้อมูลสินค้ากลับเป็นค่าเริ่มต้น' : 'Reset to Default Products'}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'th' ? 'เพิ่มสินค้าใหม่' : 'Add New Product'}</span>
            </button>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="p-3.5 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={language === 'th' ? 'ค้นหารหัสสินค้า (SKU), ชื่อสินค้า, หมวดหมู่...' : 'Search SKU, product name, category...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
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

          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 text-xs">
            <span className="text-[10px] text-slate-400 px-1 font-semibold uppercase">{language === 'th' ? 'หมวด:' : 'Category:'}</span>
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-2.5 py-1 rounded transition-colors ${categoryFilter === 'all' ? 'bg-indigo-50 font-bold text-indigo-700' : 'text-slate-600 hover:text-slate-900'}`}
            >
              {language === 'th' ? 'ทั้งหมด' : 'All'}
            </button>
            <button
              onClick={() => setCategoryFilter('health')}
              className={`px-2.5 py-1 rounded transition-colors ${categoryFilter === 'health' ? 'bg-emerald-50 font-bold text-emerald-700' : 'text-slate-600 hover:text-emerald-700'}`}
            >
              {language === 'th' ? 'สุขภาพ (Health)' : 'Health'}
            </button>
            <button
              onClick={() => setCategoryFilter('beauty')}
              className={`px-2.5 py-1 rounded transition-colors ${categoryFilter === 'beauty' ? 'bg-pink-50 font-bold text-pink-700' : 'text-slate-600 hover:text-pink-700'}`}
            >
              {language === 'th' ? 'ความงาม (Beauty)' : 'Beauty'}
            </button>
            <button
              onClick={() => setCategoryFilter('beverage')}
              className={`px-2.5 py-1 rounded transition-colors ${categoryFilter === 'beverage' ? 'bg-amber-50 font-bold text-amber-700' : 'text-slate-600 hover:text-amber-700'}`}
            >
              {language === 'th' ? 'เครื่องดื่ม (Beverage)' : 'Beverage'}
            </button>
            <button
              onClick={() => setCategoryFilter('package')}
              className={`px-2.5 py-1 rounded transition-colors ${categoryFilter === 'package' ? 'bg-purple-50 font-bold text-purple-700' : 'text-slate-600 hover:text-purple-700'}`}
            >
              {language === 'th' ? 'ชุดสมัคร (Package)' : 'Package'}
            </button>
          </div>
        </div>

        {/* Products Table with Full Inline & Modal Editing */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3 w-16 text-center">{language === 'th' ? 'รูปภาพ' : 'Image'}</th>
                <th className="py-3 px-3 w-32">{language === 'th' ? 'รหัสสินค้า' : 'SKU'}</th>
                <th className="py-3 px-3">{language === 'th' ? 'ชื่อสินค้า' : 'Product Name'}</th>
                <th className="py-3 px-3 w-28 text-center">{language === 'th' ? 'หมวดหมู่' : 'Category'}</th>
                <th className="py-3 px-3 w-28 text-right">{language === 'th' ? 'ราคาสมาชิก' : 'Member Price'}</th>
                <th className="py-3 px-3 w-28 text-right">{language === 'th' ? 'ราคาปลีก' : 'Retail Price'}</th>
                <th className="py-3 px-3 w-24 text-right">{language === 'th' ? 'คะแนน PV' : 'PV Points'}</th>
                <th className="py-3 px-3 w-28 text-right">{language === 'th' ? 'สต็อกคงเหลือ' : 'Stock'}</th>
                <th className="py-3 px-3 w-36 text-center">{language === 'th' ? 'การจัดการ' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Package className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="font-medium">{language === 'th' ? 'ไม่พบข้อมูลสินค้าตรงกับเงื่อนไข' : 'No products found'}</p>
                  </td>
                </tr>
              ) : (
                filtered.map(p => {
                  const isInlineEditing = inlineEditId === p.id;

                  if (isInlineEditing) {
                    return (
                      <tr key={p.id} className="bg-indigo-50/40 border-y-2 border-indigo-400 transition-colors">
                        {/* 1. Image Inline */}
                        <td className="py-2.5 px-3 text-center">
                          <div className="relative group inline-block">
                            <img
                              src={inlineDraft.imageUrl}
                              alt="preview"
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-lg object-cover bg-white border border-indigo-300 mx-auto shadow-2xs"
                            />
                            <select
                              value={inlineDraft.imageUrl}
                              onChange={(e) => setInlineDraft({ ...inlineDraft, imageUrl: e.target.value })}
                              className="mt-1 w-20 text-[9px] bg-white border border-indigo-200 rounded px-1 py-0.5 focus:outline-none"
                              title="เปลี่ยนรูปภาพ"
                            >
                              {PRESET_PRODUCT_IMAGES.map((img, i) => (
                                <option key={i} value={img.url}>
                                  รูปที่ {i + 1}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>

                        {/* 2. SKU Inline */}
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={inlineDraft.code}
                            onChange={(e) => setInlineDraft({ ...inlineDraft, code: e.target.value.toUpperCase() })}
                            className="w-full px-2 py-1 bg-white border border-indigo-300 rounded font-mono font-bold text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
                            placeholder="SKU"
                          />
                        </td>

                        {/* 3. Product Name Inline */}
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={inlineDraft.nameTh}
                            onChange={(e) => setInlineDraft({ ...inlineDraft, nameTh: e.target.value })}
                            className="w-full px-2 py-1 bg-white border border-indigo-300 rounded font-medium text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="ชื่อสินค้าภาษาไทย"
                          />
                        </td>

                        {/* 4. Category Inline */}
                        <td className="py-2.5 px-3 text-center">
                          <select
                            value={inlineDraft.category}
                            onChange={(e) => setInlineDraft({ ...inlineDraft, category: e.target.value as any })}
                            className="w-full px-2 py-1 bg-white border border-indigo-300 rounded text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 capitalize"
                          >
                            <option value="health">Health</option>
                            <option value="beauty">Beauty</option>
                            <option value="beverage">Beverage</option>
                            <option value="package">Package</option>
                          </select>
                        </td>

                        {/* 5. Member Price Inline */}
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end">
                            <span className="text-slate-400 mr-1">฿</span>
                            <input
                              type="number"
                              min="0"
                              value={inlineDraft.memberPrice}
                              onChange={(e) => setInlineDraft({ ...inlineDraft, memberPrice: Math.max(0, Number(e.target.value) || 0) })}
                              className="w-20 px-2 py-1 bg-white border border-indigo-300 rounded font-mono font-bold text-slate-900 text-xs text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        </td>

                        {/* 6. Retail Price Inline */}
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end">
                            <span className="text-slate-400 mr-1">฿</span>
                            <input
                              type="number"
                              min="0"
                              value={inlineDraft.retailPrice}
                              onChange={(e) => setInlineDraft({ ...inlineDraft, retailPrice: Math.max(0, Number(e.target.value) || 0) })}
                              className="w-20 px-2 py-1 bg-white border border-indigo-300 rounded font-mono text-slate-600 text-xs text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        </td>

                        {/* 7. PV Points Inline */}
                        <td className="py-2.5 px-3 text-right">
                          <input
                            type="number"
                            min="0"
                            value={inlineDraft.pv}
                            onChange={(e) => setInlineDraft({ ...inlineDraft, pv: Math.max(0, Number(e.target.value) || 0) })}
                            className="w-16 px-2 py-1 bg-white border border-indigo-300 rounded font-mono font-bold text-blue-700 text-xs text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </td>

                        {/* 8. Stock Inline */}
                        <td className="py-2.5 px-3 text-right">
                          <input
                            type="number"
                            min="0"
                            value={inlineDraft.stock}
                            onChange={(e) => setInlineDraft({ ...inlineDraft, stock: Math.max(0, Number(e.target.value) || 0) })}
                            className="w-20 px-2 py-1 bg-white border border-indigo-300 rounded font-mono font-bold text-slate-900 text-xs text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </td>

                        {/* 9. Action Buttons Inline */}
                        <td className="py-2.5 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleSaveInlineEdit(p.id)}
                              title={language === 'th' ? 'บันทึกการแก้ไข' : 'Save changes'}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium text-xs flex items-center gap-1 shadow-2xs cursor-pointer transition-colors"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>{language === 'th' ? 'บันทึก' : 'Save'}</span>
                            </button>
                            <button
                              onClick={handleCancelInlineEdit}
                              title={language === 'th' ? 'ยกเลิก' : 'Cancel'}
                              className="p-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded cursor-pointer transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  // Normal View Mode Row
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors h-14 group">
                      {/* 1. Image */}
                      <td className="py-2 px-3 text-center">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200 mx-auto shadow-2xs"
                        />
                      </td>

                      {/* 2. SKU */}
                      <td className="py-2 px-3 font-mono font-bold text-slate-900">
                        {p.code}
                      </td>

                      {/* 3. Product Name */}
                      <td className="py-2 px-3 font-medium text-slate-900 max-w-[240px]">
                        <div className="truncate font-semibold">{p.nameTh}</div>
                        <div className="truncate text-[10px] text-slate-400">{p.name}</div>
                      </td>

                      {/* 4. Category */}
                      <td className="py-2 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize ${getCategoryBadge(p.category)}`}>
                          {p.category}
                        </span>
                      </td>

                      {/* 5. Member Price */}
                      <td className="py-2 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                        ฿{p.memberPrice.toLocaleString()}
                      </td>

                      {/* 6. Retail Price */}
                      <td className="py-2 px-3 text-right font-mono text-slate-500 tabular-nums">
                        ฿{p.retailPrice.toLocaleString()}
                      </td>

                      {/* 7. PV Points */}
                      <td className="py-2 px-3 text-right font-mono font-bold text-blue-600 tabular-nums">
                        +{p.pv} PV
                      </td>

                      {/* 8. Stock */}
                      <td className="py-2 px-3 text-right font-mono font-bold tabular-nums">
                        <span className={p.stock < 100 ? 'text-amber-600' : 'text-slate-900'}>
                          {p.stock.toLocaleString()} {language === 'th' ? 'ชิ้น' : 'pcs'}
                        </span>
                      </td>

                      {/* 9. Action Buttons */}
                      <td className="py-2 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Full Edit Modal */}
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            title={language === 'th' ? 'แก้ไขข้อมูลสินค้าครบทุกช่อง (Modal)' : 'Edit product details'}
                            className="p-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Quick Inline Edit */}
                          <button
                            onClick={() => handleStartInlineEdit(p)}
                            title={language === 'th' ? 'แก้ไขด่วนในแถวนี้ (Inline)' : 'Inline quick edit'}
                            className="p-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-600 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Quick Stock Edit Button */}
                          <button
                            onClick={() => {
                              setEditingStockProduct(p);
                              setNewStockVal(p.stock.toString());
                            }}
                            title={language === 'th' ? 'ปรับสต็อกด่วน' : 'Edit stock quick'}
                            className="px-2 py-1 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 rounded text-[10px] font-semibold transition-colors cursor-pointer hidden sm:inline-block"
                          >
                            {language === 'th' ? 'สต็อก' : 'Stock'}
                          </button>

                          {/* Delete Product */}
                          <button
                            onClick={() => setDeletingProduct(p)}
                            title={language === 'th' ? 'ลบสินค้านี้' : 'Delete product'}
                            className="p-1.5 bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
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
      </div>

      {/* Full Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 text-slate-900 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                <span>{language === 'th' ? 'แก้ไขข้อมูลสินค้าครบทุกช่อง (Edit Product)' : 'Edit Product Details'}</span>
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditModal} className="mt-4 space-y-3.5 text-xs">
              {/* Image Preview & URL */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {language === 'th' ? '1. รูปภาพสินค้า (Image URL):' : '1. Product Image:'}
                </label>
                <div className="flex items-center gap-3">
                  <img
                    src={formImageUrl || editingProduct.imageUrl}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="text"
                      value={formImageUrl}
                      onChange={(e) => setFormImageUrl(e.target.value)}
                      placeholder="/src/assets/images/... หรือ URL"
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="flex flex-wrap gap-1 text-[10px]">
                      {PRESET_PRODUCT_IMAGES.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFormImageUrl(img.url)}
                          className={`px-2 py-0.5 rounded border transition-colors ${
                            formImageUrl === img.url 
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-300 font-bold' 
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          ภาพตัวอย่าง {idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SKU & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'th' ? '2. รหัสสินค้า (SKU) *' : '2. Product SKU *'}
                  </label>
                  <input
                    type="text"
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="เช่น OMC-NUTRI-01"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'th' ? '4. หมวดหมู่ (Category) *' : '4. Category *'}
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="health">Health / อาหารเสริม</option>
                    <option value="beauty">Beauty / ความงาม</option>
                    <option value="beverage">Beverage / เครื่องดื่ม</option>
                    <option value="package">Package / ชุดสมัคร</option>
                  </select>
                </div>
              </div>

              {/* Product Name */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {language === 'th' ? '3. ชื่อสินค้า (Product Name) *' : '3. Product Name *'}
                </label>
                <input
                  type="text"
                  value={formNameTh}
                  onChange={(e) => setFormNameTh(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="เช่น โอเอ็มซี ไบโอ-แอคทีฟ มัลติวิตามิน"
                  required
                />
              </div>

              {/* Member Price & Retail Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'th' ? '5. ราคาสมาชิก (Member Price ฿) *' : '5. Member Price (฿) *'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formMemberPrice}
                    onChange={(e) => setFormMemberPrice(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'th' ? '6. ราคาขายปลีก (Retail Price ฿) *' : '6. Retail Price (฿) *'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formRetailPrice}
                    onChange={(e) => setFormRetailPrice(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* PV Points & Stock */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'th' ? '7. คะแนน PV (PV Points) *' : '7. PV Points *'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formPv}
                    onChange={(e) => setFormPv(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'th' ? '8. สต็อกคงเหลือ (Stock) *' : '8. Stock Quantity *'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formStock}
                    onChange={(e) => setFormStock(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {language === 'th' ? 'คำอธิบายสินค้า:' : 'Product Description:'}
                </label>
                <textarea
                  rows={2}
                  value={formDescriptionTh}
                  onChange={(e) => setFormDescriptionTh(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="รายละเอียดสรรพคุณ ขนาดบรรจุ หรือจุดเด่นของสินค้า..."
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>{language === 'th' ? 'บันทึกการเปลี่ยนแปลงทั้งหมด' : 'Save All Changes'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-xs cursor-pointer transition-colors"
                >
                  {language === 'th' ? 'ยกเลิก' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 text-slate-900 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-600" />
                <span>{language === 'th' ? 'เพิ่มสินค้าใหม่เข้าแคตตาล็อก' : 'Add New Product to Catalog'}</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-3.5 text-xs">
              {/* Image Preview & Selection */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {language === 'th' ? 'รูปภาพสินค้า (Image):' : 'Product Image:'}
                </label>
                <div className="flex items-center gap-3">
                  <img
                    src={newImageUrl}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="text"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="/src/assets/images/... หรือ URL"
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="flex flex-wrap gap-1 text-[10px]">
                      {PRESET_PRODUCT_IMAGES.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setNewImageUrl(img.url)}
                          className={`px-2 py-0.5 rounded border transition-colors ${
                            newImageUrl === img.url 
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-300 font-bold' 
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          ภาพตัวอย่าง {idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SKU & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'th' ? 'รหัสสินค้า (SKU) *' : 'Product SKU *'}
                  </label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="เช่น OMC-HERB-05"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'th' ? 'หมวดหมู่ (Category) *' : 'Category *'}
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="health">Health / อาหารเสริม</option>
                    <option value="beauty">Beauty / ความงาม</option>
                    <option value="beverage">Beverage / เครื่องดื่ม</option>
                    <option value="package">Package / ชุดสมัคร</option>
                  </select>
                </div>
              </div>

              {/* Product Name */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {language === 'th' ? 'ชื่อสินค้าภาษาไทย *' : 'Product Name *'}
                </label>
                <input
                  type="text"
                  value={newNameTh}
                  onChange={(e) => setNewNameTh(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="เช่น โอเอ็มซี ชาเขียวสกัดเข้มข้น"
                  required
                />
              </div>

              {/* Member Price & Retail Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'th' ? 'ราคาสมาชิก (฿) *' : 'Member Price (฿) *'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newMemberPrice}
                    onChange={(e) => setNewMemberPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'th' ? 'ราคาขายปลีก (฿) *' : 'Retail Price (฿) *'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newRetailPrice}
                    onChange={(e) => setNewRetailPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* PV & Stock */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'th' ? 'คะแนน PV *' : 'PV Points *'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newPv}
                    onChange={(e) => setNewPv(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'th' ? 'สต็อกเริ่มต้น (ชิ้น) *' : 'Initial Stock *'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {language === 'th' ? 'คำอธิบายสินค้า:' : 'Product Description:'}
                </label>
                <textarea
                  rows={2}
                  value={newDescriptionTh}
                  onChange={(e) => setNewDescriptionTh(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="รายละเอียดสรรพคุณ หรือจุดเด่นของสินค้า..."
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>{language === 'th' ? 'บันทึกสินค้าใหม่' : 'Create Product'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-xs cursor-pointer transition-colors"
                >
                  {language === 'th' ? 'ยกเลิก' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Stock Modal */}
      {editingStockProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-slate-900 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base mb-1 flex items-center gap-2">
              <Package className="w-4 h-4 text-indigo-600" />
              <span>{language === 'th' ? 'ปรับปรุงจำนวนสต็อกสินค้า' : 'Update Stock Quantity'}</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4 truncate font-medium">
              {editingStockProduct.nameTh} ({editingStockProduct.code})
            </p>

            <form onSubmit={handleStockSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {language === 'th' ? 'จำนวนสต็อกคงเหลือใหม่ (ชิ้น):' : 'New Stock Inventory:'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={newStockVal}
                  onChange={(e) => setNewStockVal(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold cursor-pointer transition-colors"
                >
                  {language === 'th' ? 'บันทึกสต็อก' : 'Update Stock'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingStockProduct(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition-colors"
                >
                  {language === 'th' ? 'ยกเลิก' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-slate-900 shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base mb-1">
              {language === 'th' ? 'ยืนยันการลบสินค้า?' : 'Confirm Delete Product?'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {language === 'th' 
                ? `คุณต้องการลบ "${deletingProduct.nameTh}" (${deletingProduct.code}) ออกจากแคตตาล็อกหรือไม่?` 
                : `Are you sure you want to remove "${deletingProduct.code}" from the product catalog?`}
            </p>

            <div className="flex gap-2 text-xs">
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold cursor-pointer transition-colors"
              >
                {language === 'th' ? 'ยืนยันลบ' : 'Yes, Delete'}
              </button>
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium cursor-pointer transition-colors"
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

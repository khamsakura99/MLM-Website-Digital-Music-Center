import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Sparkles, 
  Tag, 
  Check, 
  Plus, 
  Minus, 
  Filter, 
  ShieldCheck, 
  Layers
} from 'lucide-react';
import { useMlm } from '../../context/MlmContext';
import { Product } from '../../types/mlm';

interface ShopCatalogViewProps {
  onOpenCart: () => void;
}

export const ShopCatalogView: React.FC<ShopCatalogViewProps> = ({ onOpenCart }) => {
  const { language, products, cart, addToCart } = useMlm();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [billType, setBillType] = useState<'topup' | 'autoship' | 'general'>('autoship');

  const filteredProducts = products.filter(p => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  const getQuantityInCart = (prodId: string) => {
    const item = cart.find(i => i.product.id === prodId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Bill Type Selection */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              <span>{language === 'th' ? 'สั่งซื้อสินค้า & รักษายอดรายเดือน' : 'Online Store & Autoship Catalog'}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'th' 
                ? 'สั่งซื้อสินค้าคุณภาพแท้จากบริษัท พร้อมรับคะแนน PV สะสม และรักษาสถานะรักษายอดทันที' 
                : 'Purchase authentic OMC healthcare & beauty products. All orders credit PV directly to your member account.'}
            </p>
          </div>

          <button
            onClick={onOpenCart}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors self-start sm:self-auto shadow-xs"
          >
            <span>{language === 'th' ? 'ดูตะกร้าสินค้า' : 'View Cart'}</span>
            <span className="px-1.5 py-0.2 bg-white/20 rounded font-mono font-bold">
              {cart.reduce((sum, i) => sum + i.quantity, 0)}
            </span>
          </button>
        </div>

        {/* Bill Type Selector (Important for MLM software) */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">{language === 'th' ? 'เลือกประเภทบิล:' : 'Select Bill Type:'}</span>
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setBillType('autoship')}
                className={`px-3 py-1 rounded-md transition-colors ${billType === 'autoship' ? 'bg-white font-semibold text-emerald-800 shadow-xs' : 'text-slate-600'}`}
              >
                {language === 'th' ? 'บิลรักษายอด (Autoship)' : 'Autoship Maintenance'}
              </button>
              <button
                type="button"
                onClick={() => setBillType('topup')}
                className={`px-3 py-1 rounded-md transition-colors ${billType === 'topup' ? 'bg-white font-semibold text-blue-800 shadow-xs' : 'text-slate-600'}`}
              >
                {language === 'th' ? 'บิลเปิดรหัส/อัปเกรด (Top-up)' : 'Rank Upgrade'}
              </button>
              <button
                type="button"
                onClick={() => setBillType('general')}
                className={`px-3 py-1 rounded-md transition-colors ${billType === 'general' ? 'bg-white font-semibold text-slate-900 shadow-xs' : 'text-slate-600'}`}
              >
                {language === 'th' ? 'บิลทั่วไป/ซื้อซ้ำ' : 'Regular Re-order'}
              </button>
            </div>
          </div>

          <div className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
            {billType === 'autoship' && (language === 'th' ? '✓ บิลนี้ต่ออายุรักษายอดอัตโนมัติ 30 วัน' : '✓ Extends autoship eligibility for 30 days')}
            {billType === 'topup' && (language === 'th' ? '✓ คะแนน PV จะถูกสะสมเพื่อปรับตำแหน่งธุรกิจ' : '✓ PV counts towards business rank elevation')}
            {billType === 'general' && (language === 'th' ? '✓ สั่งซื้อเพื่อจำหน่ายปลีกหรือบริโภคทั่วไป' : '✓ Standard retail replenishment')}
          </div>
        </div>

      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', labelTh: 'สินค้าทั้งหมด', labelEn: 'All Products' },
          { id: 'package', labelTh: 'ชุดเปิดรหัสธุรกิจ (Package)', labelEn: 'Starter Packs' },
          { id: 'health', labelTh: 'อาหารเสริมเพื่อสุขภาพ', labelEn: 'Health & Supplements' },
          { id: 'beauty', labelTh: 'สกินแคร์ & ความงาม', labelEn: 'Skincare & Beauty' },
          { id: 'beverage', labelTh: 'เครื่องดื่มสุขภาพ', labelEn: 'Healthy Beverages' },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
              selectedCategory === cat.id 
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {language === 'th' ? cat.labelTh : cat.labelEn}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredProducts.map(product => {
          const inCart = getQuantityInCart(product.id);
          return (
            <div 
              key={product.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Product Image */}
                <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={language === 'th' ? product.nameTh : product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-blue-600 text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded shadow-xs">
                    +{product.pv} PV
                  </div>
                  {product.packageRank && (
                    <div className="absolute top-2 right-2 bg-amber-500 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded uppercase shadow-xs">
                      {product.packageRank}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>{product.code}</span>
                    <span>{language === 'th' ? `คงเหลือ ${product.stock} ชิ้น` : `${product.stock} in stock`}</span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2">
                    {language === 'th' ? product.nameTh : product.name}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {language === 'th' ? product.descriptionTh : product.description}
                  </p>
                </div>
              </div>

              {/* Price & Add to Cart footer */}
              <div className="p-4 pt-2 border-t border-slate-100 space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">{language === 'th' ? 'ราคาสมาชิก' : 'Member Price'}</span>
                    <span className="text-lg font-bold font-mono text-slate-900 tabular-nums">
                      ฿{product.memberPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">{language === 'th' ? 'ราคาปลีก' : 'Retail'}</span>
                    <span className="text-xs text-slate-400 line-through font-mono">
                      ฿{product.retailPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => addToCart(product, 1)}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{language === 'th' ? 'หยิบใส่ตะกร้า' : 'Add to Cart'}</span>
                  {inCart > 0 && (
                    <span className="ml-1 bg-blue-600 px-1.5 py-0.2 rounded-full text-[10px] font-mono">
                      {inCart}
                    </span>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

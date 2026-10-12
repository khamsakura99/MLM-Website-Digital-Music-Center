import React, { useState } from 'react';
import { 
  GitFork, 
  Search, 
  UserPlus, 
  ChevronRight, 
  RotateCcw, 
  User, 
  Info, 
  ZoomIn, 
  ZoomOut,
  Sparkles,
  ShieldCheck,
  Award,
  ArrowUp
} from 'lucide-react';
import { useMlm } from '../../context/MlmContext';
import { BinaryNode, MemberRank } from '../../types/mlm';

export const BinaryTreeView: React.FC = () => {
  const { 
    language, 
    currentMember, 
    binaryNodes, 
    setActiveTab, 
    setRegistrationPreFill,
    showToast 
  } = useMlm();

  // Root node currently being viewed
  const [rootNodeId, setRootNodeId] = useState<string>(currentMember.memberCode);
  const [breadcrumb, setBreadcrumb] = useState<string[]>([currentMember.memberCode]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNodeForModal, setSelectedNodeForModal] = useState<BinaryNode | null>(null);

  const currentRoot = binaryNodes[rootNodeId] || binaryNodes[currentMember.memberCode];

  // Breadcrumb navigation
  const handleDrillDown = (nodeId: string) => {
    if (!binaryNodes[nodeId]) return;
    setRootNodeId(nodeId);
    setBreadcrumb(prev => [...prev, nodeId]);
  };

  const handleBreadcrumbClick = (index: number) => {
    const targetId = breadcrumb[index];
    setRootNodeId(targetId);
    setBreadcrumb(breadcrumb.slice(0, index + 1));
  };

  const handleResetToTop = () => {
    setRootNodeId(currentMember.memberCode);
    setBreadcrumb([currentMember.memberCode]);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.trim().toUpperCase();
    const found = Object.values(binaryNodes).find(
      n => n.memberCode.toUpperCase().includes(query) || n.name.toLowerCase().includes(query.toLowerCase())
    );

    if (found) {
      setRootNodeId(found.id);
      setBreadcrumb([currentMember.memberCode, found.id]);
      showToast(
        language === 'th' ? `พบสมาชิก: ${found.name} (${found.memberCode})` : `Found member: ${found.name}`,
        'info'
      );
    } else {
      showToast(
        language === 'th' ? 'ไม่พบรหัสหรือชื่อสมาชิกนี้ในสายงาน' : 'Member not found in downline',
        'error'
      );
    }
  };

  const handleEmptySlotClick = (uplineCode: string, pos: 'L' | 'R') => {
    setRegistrationPreFill({ uplineCode, position: pos });
    setActiveTab('registration');
    showToast(
      language === 'th' 
        ? `เตรียมวางสายงานใต้ ${uplineCode} ฝั่ง ${pos === 'L' ? 'ซ้าย' : 'ขวา'}` 
        : `Ready to place under ${uplineCode} on ${pos === 'L' ? 'Left' : 'Right'} leg`,
      'info'
    );
  };

  const getRankBadge = (rank: MemberRank) => {
    switch (rank) {
      case 'Diamond':
        return 'bg-blue-600 text-white';
      case 'Platinum':
        return 'bg-purple-600 text-white';
      case 'Gold':
        return 'bg-amber-500 text-slate-900';
      case 'Silver':
        return 'bg-slate-400 text-slate-900';
      case 'Bronze':
        return 'bg-amber-800 text-amber-100';
      default:
        return 'bg-slate-600 text-white';
    }
  };

  // Node rendering helper
  const renderNodeCard = (nodeId?: string, parentId?: string, position?: 'L' | 'R') => {
    if (!nodeId) {
      // Empty Slot
      return (
        <div className="w-56 p-4 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/60 hover:bg-blue-50/50 hover:border-blue-400 transition-all flex flex-col items-center justify-center text-center group cursor-pointer shadow-2xs">
          <div className="w-10 h-10 rounded-full bg-slate-200 group-hover:bg-blue-200 group-hover:text-blue-700 text-slate-400 flex items-center justify-center transition-colors mb-2">
            <UserPlus className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-600 group-hover:text-blue-700">
            {language === 'th' ? 'ตำแหน่งว่าง (Empty)' : 'Empty Slot'}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {position === 'L' ? (language === 'th' ? 'ฝั่งซ้าย' : 'Left Leg') : (language === 'th' ? 'ฝั่งขวา' : 'Right Leg')}
          </p>
          <button
            onClick={() => parentId && position && handleEmptySlotClick(parentId, position)}
            className="mt-3 px-3 py-1 bg-white group-hover:bg-blue-600 group-hover:text-white border border-slate-300 group-hover:border-blue-600 text-slate-700 text-[11px] font-medium rounded-md shadow-2xs transition-colors"
          >
            + {language === 'th' ? 'สมัครตรงนี้' : 'Register Here'}
          </button>
        </div>
      );
    }

    const node = binaryNodes[nodeId];
    if (!node) return null;

    const isCurrentRoot = node.id === currentRoot?.id;

    return (
      <div 
        className={`w-60 rounded-xl border transition-all text-xs shadow-xs relative bg-white ${
          isCurrentRoot 
            ? 'border-blue-500 ring-2 ring-blue-500/20' 
            : 'border-slate-200 hover:border-blue-300 hover:shadow-md'
        }`}
      >
        {/* Card Header with Rank and Position */}
        <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${getRankBadge(node.rank)}`}>
              {node.rank}
            </span>
            {node.position !== 'ROOT' && (
              <span className="text-[10px] font-mono text-slate-500">
                ({node.position === 'L' ? 'Left' : 'Right'})
              </span>
            )}
          </div>
          <span className="font-mono text-[11px] font-bold text-blue-700">
            {node.memberCode}
          </span>
        </div>

        {/* Card Body */}
        <div className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-semibold text-xs shrink-0">
              {node.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-slate-900 truncate" title={node.name}>
                {node.name}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {language === 'th' ? 'ผู้แนะนำ:' : 'Sponsor:'} {node.sponsorName}
              </p>
            </div>
          </div>

          {/* PV Metric mini-grid */}
          <div className="bg-slate-50 rounded-lg p-2 border border-slate-100 space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500">{language === 'th' ? 'PV ส่วนตัว:' : 'Personal PV:'}</span>
              <span className="font-mono font-bold text-slate-800 tabular-nums">
                {node.personalPv.toLocaleString()} PV
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1 pt-1 border-t border-slate-200/60 text-[10px] font-mono text-center">
              <div className="bg-white rounded px-1.5 py-1 border border-slate-100">
                <span className="text-blue-700 block font-semibold">{language === 'th' ? 'ซ้าย (L)' : 'Left'}</span>
                <span className="font-bold tabular-nums text-slate-800">{node.leftPv.toLocaleString()}</span>
                <span className="block text-[9px] text-slate-400 font-sans">{node.leftMembers} คน</span>
              </div>
              <div className="bg-white rounded px-1.5 py-1 border border-slate-100">
                <span className="text-indigo-700 block font-semibold">{language === 'th' ? 'ขวา (R)' : 'Right'}</span>
                <span className="font-bold tabular-nums text-slate-800">{node.rightPv.toLocaleString()}</span>
                <span className="block text-[9px] text-slate-400 font-sans">{node.rightMembers} คน</span>
              </div>
            </div>
          </div>

          {/* Action buttons on card */}
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1.5">
            <button
              onClick={() => setSelectedNodeForModal(node)}
              className="flex-1 py-1 px-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors"
            >
              {language === 'th' ? 'ดูข้อมูล' : 'Details'}
            </button>
            {!isCurrentRoot && (
              <button
                onClick={() => handleDrillDown(node.id)}
                className="py-1 px-2 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-medium transition-colors flex items-center gap-1"
                title={language === 'th' ? 'ดูผังสายงานของสมาชิกนี้' : 'Drill down'}
              >
                <span>{language === 'th' ? 'ส่องสายงาน' : 'Drill Down'}</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      
      {/* Top Header Controls: Title, Search, Breadcrumbs */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <GitFork className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              {language === 'th' ? 'ผังองค์กรไบนารี่ 2 สายงาน (Binary Tree)' : 'Interactive Binary Tree (2 Legs)'}
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            {language === 'th' 
              ? 'ระบบจำลองการวางสายงาน ซ้าย (Left) - ขวา (Right) สามารถคลิกเพื่อดูสมาชิกลึกกี่ชั้นก็ได้' 
              : 'Interactive 2-leg structure. Click any node to drill down or click empty slots to register downlines.'}
          </p>
        </div>

        {/* Search bar & Reset button */}
        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="flex items-center gap-1.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={language === 'th' ? 'ค้นหารหัส TH... หรือชื่อ' : 'Search Member Code/Name'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 sm:w-56"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors"
            >
              {language === 'th' ? 'ค้นหา' : 'Search'}
            </button>
          </form>

          <button
            onClick={handleResetToTop}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
            title={language === 'th' ? 'กลับสู่ตำแหน่งบนสุด' : 'Reset to Top'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Breadcrumb Trail */}
      <div className="bg-slate-50 px-4 py-2.5 rounded-lg border border-slate-200 text-xs flex items-center gap-1.5 flex-wrap overflow-x-auto">
        <span className="text-slate-400">{language === 'th' ? 'ตำแหน่งที่กำลังดู:' : 'Viewing:'}</span>
        {breadcrumb.map((code, idx) => {
          const node = binaryNodes[code];
          const isLast = idx === breadcrumb.length - 1;
          return (
            <React.Fragment key={code}>
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
              <button
                onClick={() => handleBreadcrumbClick(idx)}
                className={`font-mono px-2 py-0.5 rounded transition-colors ${
                  isLast 
                    ? 'bg-blue-600 text-white font-bold' 
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {node ? `${node.memberCode} (${node.name.split(' ')[0]})` : code}
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {/* Visual Binary Tree Canvas (Scrollable Container) */}
      <div className="bg-slate-100/70 border border-slate-200 rounded-2xl p-6 overflow-x-auto min-h-[560px] flex flex-col items-center">
        
        {/* Tier 1: Current Root Node */}
        <div className="flex flex-col items-center">
          <div className="mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-white shadow-2xs">
              {language === 'th' ? 'หัวสายงาน (Current Top)' : 'Current Root'}
            </span>
          </div>

          {renderNodeCard(currentRoot?.id)}

          {/* Stem downwards */}
          <div className="w-0.5 h-8 bg-slate-300" />
        </div>

        {/* Tier 2: Split to Left and Right */}
        <div className="relative w-full max-w-4xl flex flex-col items-center">
          
          {/* Horizontal crossbar connecting L and R branches */}
          <div className="w-1/2 border-t-2 border-slate-300 h-6 relative">
            {/* Left drop line */}
            <div className="absolute left-0 top-0 w-0.5 h-6 bg-slate-300" />
            {/* Right drop line */}
            <div className="absolute right-0 top-0 w-0.5 h-6 bg-slate-300" />
          </div>

          {/* Tier 2 Nodes Container */}
          <div className="w-full flex justify-between gap-6 px-4">
            
            {/* Left Subtree (Level 1 Left) */}
            <div className="flex-1 flex flex-col items-center">
              <div className="mb-1 text-[11px] font-bold text-blue-700">
                ◀ {language === 'th' ? 'สายงานฝั่งซ้าย (Left Leg)' : 'Left Leg'}
              </div>

              {renderNodeCard(currentRoot?.leftChildId, currentRoot?.id, 'L')}

              {/* Stem down to Level 2 Left if child exists */}
              {currentRoot?.leftChildId && (
                <>
                  <div className="w-0.5 h-8 bg-slate-300" />
                  
                  {/* Tier 3 Left branch crossbar */}
                  <div className="w-48 border-t-2 border-slate-300 h-6 relative">
                    <div className="absolute left-0 top-0 w-0.5 h-6 bg-slate-300" />
                    <div className="absolute right-0 top-0 w-0.5 h-6 bg-slate-300" />
                  </div>

                  {/* Tier 3 Left Nodes */}
                  <div className="flex justify-center gap-4">
                    {renderNodeCard(
                      binaryNodes[currentRoot.leftChildId]?.leftChildId, 
                      currentRoot.leftChildId, 
                      'L'
                    )}
                    {renderNodeCard(
                      binaryNodes[currentRoot.leftChildId]?.rightChildId, 
                      currentRoot.leftChildId, 
                      'R'
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Right Subtree (Level 1 Right) */}
            <div className="flex-1 flex flex-col items-center">
              <div className="mb-1 text-[11px] font-bold text-indigo-700">
                {language === 'th' ? 'สายงานฝั่งขวา (Right Leg)' : 'Right Leg'} ▶
              </div>

              {renderNodeCard(currentRoot?.rightChildId, currentRoot?.id, 'R')}

              {/* Stem down to Level 2 Right if child exists */}
              {currentRoot?.rightChildId && (
                <>
                  <div className="w-0.5 h-8 bg-slate-300" />
                  
                  {/* Tier 3 Right branch crossbar */}
                  <div className="w-48 border-t-2 border-slate-300 h-6 relative">
                    <div className="absolute left-0 top-0 w-0.5 h-6 bg-slate-300" />
                    <div className="absolute right-0 top-0 w-0.5 h-6 bg-slate-300" />
                  </div>

                  {/* Tier 3 Right Nodes */}
                  <div className="flex justify-center gap-4">
                    {renderNodeCard(
                      binaryNodes[currentRoot.rightChildId]?.leftChildId, 
                      currentRoot.rightChildId, 
                      'L'
                    )}
                    {renderNodeCard(
                      binaryNodes[currentRoot.rightChildId]?.rightChildId, 
                      currentRoot.rightChildId, 
                      'R'
                    )}
                  </div>
                </>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Member Details Modal */}
      {selectedNodeForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-slate-900 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${getRankBadge(selectedNodeForModal.rank)}`}>
                  {selectedNodeForModal.rank}
                </span>
                <span className="font-mono font-bold text-sm text-blue-700">
                  {selectedNodeForModal.memberCode}
                </span>
              </div>
              <button
                onClick={() => setSelectedNodeForModal(null)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block">{language === 'th' ? 'ชื่อ-นามสกุล:' : 'Full Name:'}</span>
                <span className="text-sm font-bold text-slate-900">{selectedNodeForModal.name}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                  <span className="text-slate-400 block">{language === 'th' ? 'ผู้แนะนำตรง:' : 'Sponsor:'}</span>
                  <span className="font-medium text-slate-800">{selectedNodeForModal.sponsorName}</span>
                  <span className="font-mono text-[10px] text-slate-500 block">({selectedNodeForModal.sponsorCode})</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{language === 'th' ? 'วันที่สมัคร:' : 'Join Date:'}</span>
                  <span className="font-mono font-medium text-slate-800">{selectedNodeForModal.joinDate}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{language === 'th' ? 'PV ส่วนตัว:' : 'Personal PV:'}</span>
                  <span className="font-mono font-bold text-slate-900">{selectedNodeForModal.personalPv.toLocaleString()} PV</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{language === 'th' ? 'PV สะสมรวม:' : 'Accumulated PV:'}</span>
                  <span className="font-mono font-bold text-slate-900">{selectedNodeForModal.accumulatedPv.toLocaleString()} PV</span>
                </div>
                <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-center">
                  <div className="bg-white p-2 rounded border border-slate-100">
                    <span className="text-[10px] text-blue-700 block font-semibold">{language === 'th' ? 'คะแนนทีมซ้าย (L)' : 'Left Leg PV'}</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">{selectedNodeForModal.leftPv.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400 block">{selectedNodeForModal.leftMembers} คน</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-100">
                    <span className="text-[10px] text-indigo-700 block font-semibold">{language === 'th' ? 'คะแนนทีมขวา (R)' : 'Right Leg PV'}</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">{selectedNodeForModal.rightPv.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400 block">{selectedNodeForModal.rightMembers} คน</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => {
                  handleDrillDown(selectedNodeForModal.id);
                  setSelectedNodeForModal(null);
                }}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <span>{language === 'th' ? 'ตั้งเป็นหัวสายงาน (Drill Down)' : 'Set as Tree Root'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setSelectedNodeForModal(null)}
                className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
              >
                {language === 'th' ? 'ปิด' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState } from 'react';
import { 
  Network, 
  Users, 
  Filter, 
  CheckCircle, 
  AlertCircle, 
  ChevronDown, 
  Sparkles,
  Award
} from 'lucide-react';
import { useMlm } from '../../context/MlmContext';
import { MemberRank } from '../../types/mlm';

export const UnilevelTreeView: React.FC = () => {
  const { language, currentMember, unilevelMembers } = useMlm();
  const [selectedGen, setSelectedGen] = useState<number | 'all'>('all');
  const [searchFilter, setSearchFilter] = useState('');

  const filteredMembers = unilevelMembers.filter(m => {
    const matchGen = selectedGen === 'all' || m.generation === selectedGen;
    const matchSearch = !searchFilter.trim() || 
      m.name.toLowerCase().includes(searchFilter.toLowerCase()) || 
      m.memberCode.toLowerCase().includes(searchFilter.toLowerCase());
    return matchGen && matchSearch;
  });

  const genStats = [1, 2, 3].map(gen => {
    const membersInGen = unilevelMembers.filter(m => m.generation === gen);
    const totalPv = membersInGen.reduce((sum, m) => sum + m.personalPv, 0);
    const activeCount = membersInGen.filter(m => m.isActive).length;
    return { gen, count: membersInGen.length, totalPv, activeCount };
  });

  const getRankBadge = (rank: MemberRank) => {
    switch (rank) {
      case 'Diamond':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Platinum':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Gold':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Silver':
        return 'bg-slate-200 text-slate-800 border-slate-300';
      case 'Bronze':
        return 'bg-amber-900/10 text-amber-900 border-amber-800/30';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-5">
      
      {/* Title & Info Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Network className="w-5 h-5 text-indigo-600" />
              <span>{language === 'th' ? 'ผังสายเลือดผู้แนะนำ (Unilevel Sponsor Tree)' : 'Unilevel Sponsor Generation Tree'}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'th' 
                ? 'โครงสร้างการแนะนำตรงตามลำดับชั้น G1 (ลูก), G2 (หลาน), G3 (เหลน) สำหรับคำนวณโบนัสค่าแนะนำและโบนัสแมชชิ่ง' 
                : 'Direct sponsorship lineage across generations for fast start and matching bonus tier calculation'}
            </p>
          </div>

          <div className="text-xs text-slate-500 font-mono bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            {language === 'th' ? 'แนะนำตรง (G1):' : 'Direct G1:'} <strong className="text-slate-800 font-bold">{unilevelMembers.filter(m => m.generation === 1).length} คน</strong>
          </div>
        </div>

        {/* 3 Generation summary statistics pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100">
          {genStats.map(stat => (
            <button
              key={stat.gen}
              onClick={() => setSelectedGen(selectedGen === stat.gen ? 'all' : stat.gen)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedGen === stat.gen 
                  ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/10' 
                  : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/70'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-900">
                  {language === 'th' ? `รุ่นที่ ${stat.gen} (G${stat.gen})` : `Generation ${stat.gen} (G${stat.gen})`}
                </span>
                <span className="font-mono text-[11px] text-slate-500">
                  {stat.activeCount}/{stat.count} {language === 'th' ? 'Active' : 'Active'}
                </span>
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-lg font-bold font-mono text-slate-900 tabular-nums">
                  {stat.count} <span className="text-xs font-normal text-slate-500">{language === 'th' ? 'สมาชิก' : 'members'}</span>
                </span>
                <span className="text-xs font-mono font-semibold text-indigo-700 tabular-nums">
                  {stat.totalPv.toLocaleString()} PV
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Member Grid */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
        
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-medium">
            <button
              onClick={() => setSelectedGen('all')}
              className={`px-3 py-1.5 rounded-md transition-colors ${selectedGen === 'all' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              {language === 'th' ? 'ทุกรุ่น (All Gens)' : 'All Gens'}
            </button>
            <button
              onClick={() => setSelectedGen(1)}
              className={`px-3 py-1.5 rounded-md transition-colors ${selectedGen === 1 ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              G1 ({language === 'th' ? 'ลูก' : 'Direct'})
            </button>
            <button
              onClick={() => setSelectedGen(2)}
              className={`px-3 py-1.5 rounded-md transition-colors ${selectedGen === 2 ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              G2 ({language === 'th' ? 'หลาน' : 'Gen 2'})
            </button>
            <button
              onClick={() => setSelectedGen(3)}
              className={`px-3 py-1.5 rounded-md transition-colors ${selectedGen === 3 ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              G3 ({language === 'th' ? 'เหลน' : 'Gen 3'})
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder={language === 'th' ? 'ค้นหารหัสหรือชื่อสมาชิก...' : 'Filter by code or name...'}
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
            />
          </div>
        </div>

        {/* Member cards list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredMembers.map(member => (
            <div 
              key={member.id} 
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all text-xs space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-slate-900 text-sm">{member.memberCode}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${getRankBadge(member.rank)}`}>
                    {member.rank}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 font-mono">
                  G{member.generation}
                </span>
              </div>

              <div>
                <p className="font-bold text-slate-900 text-sm truncate">{member.name}</p>
                <p className="text-[11px] text-slate-500 truncate">
                  {language === 'th' ? 'ผู้แนะนำ:' : 'Sponsor:'} {member.directSponsorName} ({member.directSponsorCode})
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-center bg-slate-50 p-2 rounded-lg">
                <div>
                  <span className="text-[10px] text-slate-400 block">{language === 'th' ? 'PV ส่วนตัว' : 'Personal PV'}</span>
                  <span className="font-mono font-bold text-slate-800 tabular-nums">{member.personalPv.toLocaleString()} PV</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">{language === 'th' ? 'PV ทีมรวม' : 'Team PV'}</span>
                  <span className="font-mono font-bold text-indigo-700 tabular-nums">{member.teamPv.toLocaleString()} PV</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>{language === 'th' ? 'วันที่สมัคร:' : 'Joined:'} <span className="font-mono">{member.joinDate}</span></span>
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Active
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};

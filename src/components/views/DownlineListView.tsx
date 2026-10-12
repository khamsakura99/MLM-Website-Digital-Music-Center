import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Download, 
  Filter, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useMlm } from '../../context/MlmContext';
import { MemberRank } from '../../types/mlm';

export const DownlineListView: React.FC = () => {
  const { language, binaryNodes, showToast } = useMlm();
  const [search, setSearch] = useState('');
  const [legFilter, setLegFilter] = useState<'all' | 'L' | 'R'>('all');
  const [rankFilter, setRankFilter] = useState<string>('all');

  const allMembers = Object.values(binaryNodes);

  const filtered = allMembers.filter(m => {
    const matchSearch = !search.trim() || 
      m.memberCode.toLowerCase().includes(search.toLowerCase()) || 
      m.name.toLowerCase().includes(search.toLowerCase());
    const matchLeg = legFilter === 'all' || m.position === legFilter;
    const matchRank = rankFilter === 'all' || m.rank === rankFilter;
    return matchSearch && matchLeg && matchRank;
  });

  const handleExportCsv = () => {
    showToast(
      language === 'th' ? 'กำลังดาวน์โหลดรายงานรายชื่อสายงาน (CSV)...' : 'Downloading downline roster report (CSV)...',
      'info'
    );
  };

  const getRankBadgeClass = (rank: MemberRank) => {
    switch (rank) {
      case 'Diamond':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Platinum':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'Gold':
        return 'text-amber-800 bg-amber-50 border-amber-200';
      case 'Silver':
        return 'text-slate-700 bg-slate-100 border-slate-300';
      case 'Bronze':
        return 'text-amber-900 bg-amber-100/60 border-amber-300';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      
      {/* Table Header and Control bar */}
      <div className="p-5 border-b border-slate-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>{language === 'th' ? 'รายชื่อสมาชิกในสายงาน (Downline Directory)' : 'Downline Member Directory'}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'th' ? `พบสมาชิกทั้งหมด ${filtered.length} รหัสในสายงาน` : `Showing ${filtered.length} downline members`}
            </p>
          </div>

          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>{language === 'th' ? 'ส่งออก Excel / CSV' : 'Export CSV'}</span>
          </button>
        </div>

        {/* Filter controls row */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={language === 'th' ? 'ค้นหารหัส TH... หรือชื่อสมาชิก' : 'Search code or name...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Leg filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
            <button
              onClick={() => setLegFilter('all')}
              className={`px-2.5 py-1 rounded transition-colors ${legFilter === 'all' ? 'bg-white font-semibold text-slate-900 shadow-2xs' : 'text-slate-600'}`}
            >
              {language === 'th' ? 'ทุกสายงาน' : 'All Legs'}
            </button>
            <button
              onClick={() => setLegFilter('L')}
              className={`px-2.5 py-1 rounded transition-colors ${legFilter === 'L' ? 'bg-white font-semibold text-blue-700 shadow-2xs' : 'text-slate-600'}`}
            >
              {language === 'th' ? 'ทีมซ้าย (L)' : 'Left Leg'}
            </button>
            <button
              onClick={() => setLegFilter('R')}
              className={`px-2.5 py-1 rounded transition-colors ${legFilter === 'R' ? 'bg-white font-semibold text-indigo-700 shadow-2xs' : 'text-slate-600'}`}
            >
              {language === 'th' ? 'ทีมขวา (R)' : 'Right Leg'}
            </button>
          </div>

          {/* Rank filter */}
          <select
            value={rankFilter}
            onChange={(e) => setRankFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">{language === 'th' ? 'ทุกตำแหน่ง (All Ranks)' : 'All Ranks'}</option>
            <option value="Diamond">Diamond</option>
            <option value="Platinum">Platinum</option>
            <option value="Gold">Gold</option>
            <option value="Silver">Silver</option>
            <option value="Bronze">Bronze</option>
            <option value="Member">Member</option>
          </select>

        </div>
      </div>

      {/* High-density Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
              <th className="py-2.5 px-4">{language === 'th' ? 'รหัสสมาชิก' : 'Member Code'}</th>
              <th className="py-2.5 px-4">{language === 'th' ? 'ชื่อ-นามสกุล' : 'Full Name'}</th>
              <th className="py-2.5 px-3">{language === 'th' ? 'ตำแหน่ง' : 'Rank'}</th>
              <th className="py-2.5 px-3">{language === 'th' ? 'ฝั่งสายงาน' : 'Leg'}</th>
              <th className="py-2.5 px-4 text-right">{language === 'th' ? 'PV ส่วนตัว' : 'Personal PV'}</th>
              <th className="py-2.5 px-4 text-right">{language === 'th' ? 'PV ซ้าย (L)' : 'Left PV'}</th>
              <th className="py-2.5 px-4 text-right">{language === 'th' ? 'PV ขวา (R)' : 'Right PV'}</th>
              <th className="py-2.5 px-4">{language === 'th' ? 'ผู้แนะนำตรง' : 'Sponsor'}</th>
              <th className="py-2.5 px-4 text-center">{language === 'th' ? 'สถานะ' : 'Status'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((member) => (
              <tr 
                key={member.id} 
                className="hover:bg-slate-50/80 transition-colors h-11"
              >
                <td className="py-2 px-4 font-mono font-bold text-blue-700">
                  {member.memberCode}
                </td>
                <td className="py-2 px-4 font-medium text-slate-900 truncate max-w-[180px]">
                  {member.name}
                </td>
                <td className="py-2 px-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getRankBadgeClass(member.rank)}`}>
                    {member.rank}
                  </span>
                </td>
                <td className="py-2 px-3">
                  <span className={`font-mono text-xs font-bold ${
                    member.position === 'L' ? 'text-blue-600' : member.position === 'R' ? 'text-indigo-600' : 'text-slate-400'
                  }`}>
                    {member.position === 'ROOT' ? 'ROOT' : member.position === 'L' ? 'Left' : 'Right'}
                  </span>
                </td>
                <td className="py-2 px-4 text-right font-mono font-semibold text-slate-800 tabular-nums">
                  {member.personalPv.toLocaleString()}
                </td>
                <td className="py-2 px-4 text-right font-mono text-slate-600 tabular-nums">
                  {member.leftPv.toLocaleString()}
                </td>
                <td className="py-2 px-4 text-right font-mono text-slate-600 tabular-nums">
                  {member.rightPv.toLocaleString()}
                </td>
                <td className="py-2 px-4 text-slate-600 truncate max-w-[140px]">
                  {member.sponsorName}
                </td>
                <td className="py-2 px-4 text-center">
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

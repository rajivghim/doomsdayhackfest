import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Building2,
  Plus,
  Compass,
  ArrowRight
} from 'lucide-react';
import { ComplaintReport, ReportStatus, ActiveTab } from '../types';
import { getStoredReports } from '../utils/reportsStorage';

interface MyReportsViewProps {
  onReportNew: () => void;
  onSelectReport: (report: ComplaintReport) => void;
  onNavigateTab?: (tab: ActiveTab) => void;
  refreshTrigger?: number;
}


type FilterStatus = 'ALL' | ReportStatus;

const FILTER_TABS: { id: FilterStatus; label: string }[] = [
  { id: 'ALL', label: 'All Reports' },
  { id: 'REPORTED', label: 'Submitted' },
  { id: 'VERIFIED', label: 'Verified' },
  { id: 'ASSIGNED', label: 'Assigned' },
  { id: 'IN_PROGRESS', label: 'In Progress' },
  { id: 'RESOLVED', label: 'Resolved' },
];

export const MyReportsView: React.FC<MyReportsViewProps> = ({
  onReportNew,
  onSelectReport,
  onNavigateTab,
  refreshTrigger,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterStatus>('ALL');

  const reports = useMemo(() => {
    return getStoredReports();
  }, [refreshTrigger]);

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      // Filter by status
      if (selectedFilter !== 'ALL' && r.status !== selectedFilter) {
        return false;
      }
      // Search by Report ID, Category, Location, Ward, Title
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = r.id.toLowerCase().includes(q);
        const matchCat = r.category.toLowerCase().includes(q);
        const matchLoc = r.location.toLowerCase().includes(q);
        const matchWard = (r.ward || '').toLowerCase().includes(q);
        const matchTitle = r.title.toLowerCase().includes(q);
        if (!matchId && !matchCat && !matchLoc && !matchWard && !matchTitle) {
          return false;
        }
      }
      return true;
    });
  }, [reports, selectedFilter, searchQuery]);

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'RESOLVED':
        return {
          text: 'Resolved',
          badge: 'text-emerald-300 border-emerald-400/30 bg-emerald-500/10',
          symbol: '✓',
        };
      case 'IN_PROGRESS':
        return {
          text: 'In Progress',
          badge: 'text-cyan-300 border-cyan-400/30 bg-cyan-500/10',
          symbol: '●',
        };
      case 'ASSIGNED':
        return {
          text: 'Assigned',
          badge: 'text-sky-300 border-sky-400/30 bg-sky-500/10',
          symbol: '✓',
        };
      case 'VERIFIED':
        return {
          text: 'Verified',
          badge: 'text-amber-300 border-amber-400/30 bg-amber-500/10',
          symbol: '✓',
        };
      case 'REPORTED':
      default:
        return {
          text: 'Submitted',
          badge: 'text-neutral-300 border-white/20 bg-white/5',
          symbol: '✓',
        };
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 flex-1 px-6 sm:px-10 md:px-12 py-12 max-w-5xl mx-auto w-full text-white bg-black select-none"
    >
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-cyan-300 uppercase tracking-widest">
              Public Accountability
            </span>
          </div>
          <h2 className="font-serif-display text-4xl sm:text-5xl text-white font-normal">
            Citizen Grievance Dashboard
          </h2>
          <p className="font-sans-ui text-neutral-400 text-sm sm:text-base mt-1">
            Track every complaint in real time from report to verified resolution.
          </p>
        </div>

        <button
          id="my-reports-new-issue-btn"
          onClick={onReportNew}
          className="rounded-full px-6 py-3 text-sm text-black bg-white hover:bg-neutral-200 transition-all font-medium flex items-center gap-2 cursor-pointer shadow-lg active:scale-95"
        >
          <Plus size={16} />
          <span>Report New Issue</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-4 mb-8">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by Report ID (e.g. SS-1048), Category, or Ward/Location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/[0.03] border border-white/15 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyan-400 transition-colors"
          />
          <Search size={18} className="absolute left-4 top-3.5 text-neutral-400" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3 text-xs text-neutral-400 hover:text-white px-2 py-1"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-neutral-500 text-[11px] font-mono mr-1 uppercase flex items-center gap-1">
            <Filter size={12} />
            Filter:
          </span>
          {FILTER_TABS.map((tab) => {
            const isActive = selectedFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-4 py-1.5 rounded-full border transition-all cursor-pointer whitespace-nowrap font-medium ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-sm'
                    : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Reports Listing */}
      {filteredReports.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white/[0.01] border border-white/10 space-y-3">
          <AlertCircle size={32} className="text-neutral-500 mx-auto" />
          <h4 className="font-serif-display text-xl text-neutral-300">No complaints found</h4>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            No reports match your current filter or search criteria. Try clearing the search or submit a new report.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedFilter('ALL');
            }}
            className="text-xs text-cyan-300 hover:underline pt-2 inline-block cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report, idx) => {
            const badge = getStatusBadge(report.status);

            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
                onClick={() => onSelectReport(report)}
                className="group p-6 rounded-3xl bg-neutral-950 hover:bg-neutral-900 border border-white/10 hover:border-cyan-400/40 transition-all cursor-pointer shadow-xl relative overflow-hidden"
              >
                {/* Top Row: Report ID, Location, Status */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-mono font-bold">
                      {report.id}
                    </span>
                    <span className="text-xs text-neutral-400 font-sans-ui">
                      {report.category}
                    </span>
                  </div>

                  <span className={`px-3 py-0.5 rounded-full border text-xs font-sans-ui font-medium flex items-center gap-1.5 ${badge.badge}`}>
                    <span>{badge.symbol}</span>
                    <span>{badge.text}</span>
                  </span>
                </div>

                {/* Complaint Title */}
                <h3 className="font-serif-display text-xl sm:text-2xl text-white group-hover:text-cyan-200 transition-colors font-normal mb-2 flex items-center justify-between">
                  <span>{report.title}</span>
                  <ArrowUpRight size={18} className="text-neutral-500 group-hover:text-cyan-300 transition-colors shrink-0 ml-2" />
                </h3>

                {/* Description snippet */}
                <p className="text-xs sm:text-sm text-neutral-400 line-clamp-2 mb-4 font-sans-ui">
                  {report.description}
                </p>

                {/* Tracking Progress Ribbon */}
                <div className="py-2.5 px-3.5 rounded-xl bg-black/50 border border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-neutral-300">
                    <MapPin size={13} className="text-cyan-400" />
                    <span>{report.location}</span>
                  </div>

                  <div className="flex items-center gap-3 text-neutral-400">
                    <div className="flex items-center gap-1">
                      <Building2 size={13} className="text-neutral-500" />
                      <span>{report.department || 'Awaiting Routing'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-neutral-500">
                      <Clock size={11} />
                      <span>{report.createdAt}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Bottom Next Page Navigation Bar */}
      <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans-ui">
        <div className="flex items-center gap-2 text-neutral-400 font-mono">
          <Compass size={14} className="text-cyan-300" />
          <span className="text-cyan-300 font-bold uppercase">Next Page:</span>
          <span>Explore other sections</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-center">
          <button
            onClick={() => onNavigateTab && onNavigateTab('home')}
            className="px-4 py-2 rounded-full bg-white/[0.04] hover:bg-white/15 border border-white/15 hover:border-white/30 text-neutral-200 hover:text-white transition-colors cursor-pointer font-medium"
          >
            ← Home
          </button>
          <button
            onClick={onReportNew}
            className="px-4 py-2 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 hover:text-cyan-200 transition-colors cursor-pointer font-medium flex items-center gap-1.5"
          >
            <Plus size={13} />
            <span>Report New Issue</span>
          </button>
          <button
            onClick={() => onNavigateTab && onNavigateTab('contact')}
            className="px-4 py-2 rounded-full bg-white/[0.04] hover:bg-white/15 border border-white/15 hover:border-white/30 text-neutral-200 hover:text-white transition-colors cursor-pointer font-medium flex items-center gap-1"
          >
            <span>Contact Us</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </motion.section>
  );
};

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Building2, 
  UserCheck, 
  Send, 
  ChevronRight, 
  ArrowLeft, 
  MapPin, 
  AlertTriangle,
  FileEdit,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { ComplaintReport, ReportStatus } from '../types';
import { getStoredReports, updateReportStatus } from '../utils/reportsStorage';

interface AuthorityDashboardProps {
  authorityName: string;
  authorityRole: string;
  onLogout: () => void;
  onViewCitizenView: () => void;
  onReportsUpdated?: () => void;
}

const DEPARTMENTS = [
  'Department of Roads & Transport',
  'Water Supply & Sanitation Division (KUKL)',
  'Nepal Electricity & Public Lighting Board',
  'Solid Waste Management Bureau',
  'Drainage & Stormwater Dept',
  'Urban Infrastructure & Parks Board',
];

export const AuthorityDashboard: React.FC<AuthorityDashboardProps> = ({
  authorityName,
  authorityRole,
  onLogout,
  onViewCitizenView,
  onReportsUpdated,
}) => {
  const [reports, setReports] = useState<ComplaintReport[]>(() => getStoredReports());
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'ALL' | ReportStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected report management states
  const [actionNote, setActionNote] = useState('');
  const [assignDept, setAssignDept] = useState(DEPARTMENTS[0]);
  const [assignOfficer, setAssignOfficer] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const refreshData = () => {
    const fresh = getStoredReports();
    setReports(fresh);
    if (onReportsUpdated) onReportsUpdated();
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const selectedReport = useMemo(() => {
    return reports.find((r) => r.id === selectedReportId) || null;
  }, [reports, selectedReportId]);

  const stats = useMemo(() => {
    return {
      total: reports.length,
      reported: reports.filter((r) => r.status === 'REPORTED').length,
      verified: reports.filter((r) => r.status === 'VERIFIED').length,
      assigned: reports.filter((r) => r.status === 'ASSIGNED').length,
      inProgress: reports.filter((r) => r.status === 'IN_PROGRESS').length,
      resolved: reports.filter((r) => r.status === 'RESOLVED').length,
    };
  }, [reports]);

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      if (filterStatus !== 'ALL' && r.status !== filterStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.id.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [reports, filterStatus, searchQuery]);

  // Authority Actions
  const handleVerify = (reportId: string) => {
    const note = actionNote.trim() || 'Complaint verified on-site by municipal intake inspector.';
    const updated = updateReportStatus(reportId, 'VERIFIED', note, authorityName);
    setReports(updated);
    setActionNote('');
    showToast(`Report ${reportId} marked as VERIFIED ✓`);
    refreshData();
  };

  const handleAssign = (reportId: string) => {
    const officer = assignOfficer.trim() || authorityName;
    const note = actionNote.trim() || `Assigned to ${assignDept}. Dispatched officer: ${officer}.`;
    const updated = updateReportStatus(reportId, 'ASSIGNED', note, authorityName, {
      department: assignDept,
      assignedOfficer: officer,
    });
    setReports(updated);
    setActionNote('');
    setAssignOfficer('');
    showToast(`Report ${reportId} assigned to ${assignDept} ✓`);
    refreshData();
  };

  const handleUpdateProgress = (reportId: string) => {
    if (!actionNote.trim()) {
      showToast('Please enter a progress note before updating.');
      return;
    }
    const updated = updateReportStatus(reportId, 'IN_PROGRESS', actionNote.trim(), authorityName);
    setReports(updated);
    setActionNote('');
    showToast(`Progress update added for ${reportId} ●`);
    refreshData();
  };

  const handleResolve = (reportId: string) => {
    const note = actionNote.trim() || 'Work order completed. Issue resolved and verified by inspection crew.';
    const updated = updateReportStatus(reportId, 'RESOLVED', note, authorityName);
    setReports(updated);
    setActionNote('');
    showToast(`Report ${reportId} marked as RESOLVED ✓`);
    refreshData();
  };

  return (
    <div className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-6 sm:px-10 py-10 text-neutral-900 bg-white select-none">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-8 z-50 px-5 py-3 rounded-2xl bg-neutral-900 text-white font-medium text-xs shadow-2xl flex items-center gap-2"
          >
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-900 border border-cyan-300 text-xs font-mono font-semibold flex items-center gap-1">
              <ShieldCheck size={13} />
              AUTHORITY CONTROL DESK
            </span>
            <span className="text-xs text-neutral-600 font-mono">
              Logged in: <strong className="text-neutral-900">{authorityName}</strong> ({authorityRole})
            </span>
          </div>
          <h1 className="font-sans-ui text-2xl sm:text-3xl text-neutral-900 font-bold tracking-tight">
            Administrative Grievance Workflow
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onViewCitizenView}
            className="px-4 py-2 rounded-full border border-neutral-300 hover:border-neutral-400 bg-white text-xs text-neutral-700 hover:text-neutral-900 transition-colors cursor-pointer shadow-xs"
          >
            Switch to Citizen View
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-full border border-red-200 hover:border-red-300 bg-red-50 text-xs text-red-700 transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 shadow-xs">
          <span className="text-[11px] text-neutral-500 font-mono uppercase block mb-1 font-semibold">Total Complaints</span>
          <span className="font-sans-ui text-3xl text-neutral-900 font-bold tracking-tight">{stats.total}</span>
        </div>
        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 shadow-xs">
          <span className="text-[11px] text-amber-800 font-mono uppercase block mb-1 font-semibold">To Verify</span>
          <span className="font-sans-ui text-3xl text-amber-900 font-bold tracking-tight">{stats.reported}</span>
        </div>
        <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 shadow-xs">
          <span className="text-[11px] text-blue-800 font-mono uppercase block mb-1 font-semibold">Verified</span>
          <span className="font-sans-ui text-3xl text-blue-900 font-bold tracking-tight">{stats.verified}</span>
        </div>
        <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 shadow-xs">
          <span className="text-[11px] text-purple-800 font-mono uppercase block mb-1 font-semibold">Assigned</span>
          <span className="font-sans-ui text-3xl text-purple-900 font-bold tracking-tight">{stats.assigned}</span>
        </div>
        <div className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-200 shadow-xs">
          <span className="text-[11px] text-cyan-800 font-mono uppercase block mb-1 font-semibold">In Progress</span>
          <span className="font-sans-ui text-3xl text-cyan-900 font-bold tracking-tight">{stats.inProgress}</span>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 shadow-xs">
          <span className="text-[11px] text-emerald-800 font-mono uppercase block mb-1 font-semibold">Resolved</span>
          <span className="font-sans-ui text-3xl text-emerald-900 font-bold tracking-tight">{stats.resolved}</span>
        </div>
      </div>

      {/* Main Layout: Split Table & Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Complaint Reports List */}
        <div className={`space-y-4 ${selectedReport ? 'lg:col-span-6' : 'lg:col-span-12'}`}>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by ID, title, category, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-cyan-600 shadow-xs"
              />
              <Search size={15} className="absolute left-3 top-3 text-neutral-400" />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 text-[11px] overflow-x-auto pb-1">
              {(['ALL', 'REPORTED', 'VERIFIED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1 rounded-full border transition-colors cursor-pointer whitespace-nowrap font-mono ${
                    filterStatus === st
                      ? 'bg-neutral-900 text-white border-neutral-900 font-semibold'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {st === 'ALL' ? 'All' : st}
                </button>
              ))}
            </div>
          </div>

          {/* List items */}
          <div className="space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
            {filteredReports.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-neutral-50 border border-neutral-200 text-neutral-500 text-xs">
                No matching complaints found.
              </div>
            ) : (
              filteredReports.map((item) => {
                const isSelected = item.id === selectedReportId;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedReportId(item.id);
                      if (item.department) setAssignDept(item.department);
                      if (item.assignedOfficer) setAssignOfficer(item.assignedOfficer);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-cyan-50/70 border-cyan-600 shadow-sm ring-1 ring-cyan-600'
                        : 'bg-neutral-50 hover:bg-white border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-cyan-800">
                          {item.id}
                        </span>
                        <span className="text-[11px] text-neutral-500 font-medium">
                          {item.category}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-neutral-300 bg-white text-neutral-700 font-medium">
                        {item.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-medium text-neutral-900 line-clamp-1 mb-1">
                      {item.title}
                    </h4>

                    <div className="flex items-center justify-between text-[11px] text-neutral-500 font-mono pt-2 border-t border-neutral-200">
                      <span>{item.location}</span>
                      <span>{item.createdAt}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Authority Actions & Details Panel */}
        {selectedReport && (
          <div className="lg:col-span-6 space-y-4">
            <div className="p-6 rounded-3xl bg-neutral-50 border border-neutral-300 shadow-lg space-y-6 text-left relative">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-neutral-200">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-900 border border-cyan-300 font-bold">
                      {selectedReport.id}
                    </span>
                    <span className="text-xs text-neutral-600 font-medium">{selectedReport.category}</span>
                  </div>
                  <h3 className="font-sans-ui text-xl text-neutral-900 font-bold tracking-tight">
                    {selectedReport.title}
                  </h3>
                </div>

                <button
                  onClick={() => setSelectedReportId(null)}
                  className="text-xs text-neutral-500 hover:text-neutral-900 p-1.5 rounded-full hover:bg-neutral-200 cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>

              {/* Status Stepper Summary */}
              <div className="p-3 rounded-xl bg-white border border-neutral-200 text-xs font-mono flex items-center justify-between shadow-xs">
                <span>Current Status: <strong className="text-cyan-800">{selectedReport.status}</strong></span>
                <span>Priority: <strong className="text-neutral-900">{selectedReport.priority}</strong></span>
              </div>

              {/* Description & Location */}
              <div className="space-y-2 text-xs">
                <div className="text-neutral-600 font-mono uppercase tracking-wider text-[11px] font-semibold">
                  Citizen Description
                </div>
                <p className="p-3 rounded-xl bg-white border border-neutral-200 text-neutral-700 leading-relaxed font-sans-ui shadow-xs">
                  {selectedReport.description}
                </p>
                <div className="flex items-center gap-2 text-neutral-600 pt-1 font-mono">
                  <MapPin size={13} className="text-cyan-700" />
                  <span>{selectedReport.location}</span>
                </div>
              </div>

              {/* ACTION TOOLBAR: Verify → Assign → Update Progress → Resolve */}
              <div className="space-y-4 pt-4 border-t border-neutral-200">
                <div className="text-xs font-mono uppercase tracking-wider text-cyan-900 font-semibold flex items-center gap-1.5">
                  <Sparkles size={14} className="text-cyan-700" />
                  <span>Authority Action Controls:</span>
                </div>

                {/* Progress / Action Note Input */}
                <div>
                  <label className="block text-[11px] text-neutral-600 mb-1 font-semibold font-mono">
                    Official Note / Progress Update / Resolution Log
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Enter status update description or notes for the citizen timeline..."
                    value={actionNote}
                    onChange={(e) => setActionNote(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-300 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-cyan-600 resize-none font-sans-ui shadow-xs"
                  />
                </div>

                {/* Assignment Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-neutral-600 mb-1 font-semibold font-mono">Department</label>
                    <select
                      value={assignDept}
                      onChange={(e) => setAssignDept(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl bg-white border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-cyan-600 shadow-xs"
                    >
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-600 mb-1 font-semibold font-mono">Assign Officer</label>
                    <input
                      type="text"
                      placeholder="e.g. Er. Rajesh (Roads)"
                      value={assignOfficer}
                      onChange={(e) => setAssignOfficer(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl bg-white border border-neutral-300 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-cyan-600 shadow-xs"
                    />
                  </div>
                </div>

                {/* 4 Action Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                  {/* Verify */}
                  <button
                    type="button"
                    onClick={() => handleVerify(selectedReport.id)}
                    className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-300 text-blue-900 text-xs font-semibold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-xs"
                  >
                    <CheckCircle2 size={16} />
                    <span>Verify</span>
                  </button>

                  {/* Assign */}
                  <button
                    type="button"
                    onClick={() => handleAssign(selectedReport.id)}
                    className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-300 text-purple-900 text-xs font-semibold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-xs"
                  >
                    <Building2 size={16} />
                    <span>Assign</span>
                  </button>

                  {/* Update Progress */}
                  <button
                    type="button"
                    onClick={() => handleUpdateProgress(selectedReport.id)}
                    className="p-2.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 border border-cyan-300 text-cyan-900 text-xs font-semibold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-xs"
                  >
                    <Send size={16} />
                    <span>Add Update</span>
                  </button>

                  {/* Mark as Resolved */}
                  <button
                    type="button"
                    onClick={() => handleResolve(selectedReport.id)}
                    className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-semibold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-xs"
                  >
                    <CheckCircle2 size={16} />
                    <span>Resolve</span>
                  </button>
                </div>
              </div>

              {/* Timeline log */}
              <div className="pt-4 border-t border-neutral-200">
                <div className="text-[11px] font-mono text-neutral-600 uppercase mb-2 font-semibold">
                  Timeline History:
                </div>
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {selectedReport.timeline.map((log) => (
                    <div key={log.id} className="p-2 rounded-xl bg-white border border-neutral-200 text-xs shadow-xs">
                      <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono">
                        <span className="text-cyan-800 font-semibold">{log.status}</span>
                        <span>{log.timestamp}</span>
                      </div>
                      <p className="text-neutral-800 mt-0.5 text-[11px]">{log.note}</p>
                      <span className="text-[10px] text-neutral-500 font-mono">By: {log.actor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

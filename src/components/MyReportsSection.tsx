import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  ArrowUpRight, 
  AlertCircle, 
  Plus,
  ThumbsUp,
  ChevronRight,
  Navigation,
  Crosshair,
  Compass,
  CheckCircle2,
  SlidersHorizontal,
  X,
  Building2,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';
import { ComplaintReport, ReportStatus, IssueCategory } from '../types';
import { 
  getStoredReports, 
  upvoteReport, 
  getUserUpvotes, 
  calculateDistanceKm 
} from '../utils/reportsStorage';

interface MyReportsSectionProps {
  onReportNew: () => void;
  onSelectReport: (report: ComplaintReport) => void;
  refreshTrigger?: number;
}

type FilterStatus = 'ALL' | ReportStatus;
type FilterDepartment = 'ALL' | 'ROADS' | 'ELECTRIC' | 'WASTE';
type DistanceRadius = 'ALL' | 'NEAREST' | '1' | '3' | '5' | '10';

const LIFECYCLE_SEQUENCE: { status: ReportStatus; label: string }[] = [
  { status: 'REPORTED', label: 'Reported' },
  { status: 'VERIFIED', label: 'Verified' },
  { status: 'ASSIGNED', label: 'Assigned' },
  { status: 'IN_PROGRESS', label: 'In Progress' },
  { status: 'RESOLVED', label: 'Resolved' },
];

const STATUS_ORDER: Record<ReportStatus, number> = {
  REPORTED: 0,
  VERIFIED: 1,
  ASSIGNED: 2,
  IN_PROGRESS: 3,
  RESOLVED: 4,
};

const DEPARTMENT_TABS: { id: FilterDepartment; label: string; icon: string; desc: string; countCat?: IssueCategory }[] = [
  { id: 'ALL', label: 'All Departments', icon: '🏛️', desc: 'All civic municipal complaints' },
  { id: 'ROADS', label: 'Roads & Potholes Dept', icon: '🚧', desc: 'Department of Roads (DoR) & Ward Infra', countCat: 'Roads & Potholes' },
  { id: 'ELECTRIC', label: 'NEA Electric Wires Dept', icon: '⚡', desc: 'Nepal Electricity Authority & Cables', countCat: 'Electric Wires' },
  { id: 'WASTE', label: 'Solid Waste Dept', icon: '♻️', desc: 'Municipal Sanitation & Refuse', countCat: 'Garbage & Waste' },
];

const STATUS_FILTERS: { id: FilterStatus; label: string }[] = [
  { id: 'ALL', label: 'All Statuses' },
  { id: 'REPORTED', label: 'Reported' },
  { id: 'VERIFIED', label: 'Verified' },
  { id: 'ASSIGNED', label: 'Assigned' },
  { id: 'IN_PROGRESS', label: 'In Progress' },
  { id: 'RESOLVED', label: 'Resolved' },
];

const DEFAULT_CENTER = { lat: 27.7172, lng: 85.3240 };

export const MyReportsSection: React.FC<MyReportsSectionProps> = ({
  onReportNew,
  onSelectReport,
  refreshTrigger,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>('ALL');
  const [selectedDept, setSelectedDept] = useState<FilterDepartment>('ALL');
  const [localReports, setLocalReports] = useState<ComplaintReport[]>(() => getStoredReports());
  const [upvotedIds, setUpvotedIds] = useState<string[]>(() => getUserUpvotes());

  // Proximity State
  const [nearMeActive, setNearMeActive] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [selectedRadius, setSelectedRadius] = useState<DistanceRadius>('NEAREST');

  // Sync state
  useEffect(() => {
    setLocalReports(getStoredReports());
    setUpvotedIds(getUserUpvotes());
  }, [refreshTrigger]);

  const handleUpvote = (e: React.MouseEvent, reportId: string) => {
    e.stopPropagation();
    const { updatedReports, success } = upvoteReport(reportId);
    if (success) {
      setLocalReports(updatedReports);
      setUpvotedIds(getUserUpvotes());
    }
  };

  const handleToggleNearMe = () => {
    if (nearMeActive) {
      setNearMeActive(false);
      return;
    }

    setLocating(true);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setNearMeActive(true);
          setLocating(false);
        },
        () => {
          setUserCoords(DEFAULT_CENTER);
          setNearMeActive(true);
          setLocating(false);
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    } else {
      setUserCoords(DEFAULT_CENTER);
      setNearMeActive(true);
      setLocating(false);
    }
  };

  // Compute reports with distance
  const reportsWithDistance = useMemo(() => {
    const effectiveCoords = userCoords || (nearMeActive ? DEFAULT_CENTER : null);

    return localReports.map((report) => {
      let distanceKm: number | null = null;
      if (effectiveCoords && report.coordinates) {
        distanceKm = calculateDistanceKm(
          effectiveCoords.lat,
          effectiveCoords.lng,
          report.coordinates.lat,
          report.coordinates.lng
        );
      }
      return {
        ...report,
        distanceKm,
      };
    });
  }, [localReports, userCoords, nearMeActive]);

  // Counts per department
  const deptCounts = useMemo(() => {
    const counts = {
      ALL: localReports.length,
      ROADS: localReports.filter((r) => r.category === 'Roads & Potholes').length,
      ELECTRIC: localReports.filter((r) => r.category === 'Electric Wires').length,
      WASTE: localReports.filter((r) => r.category === 'Garbage & Waste').length,
    };
    return counts;
  }, [localReports]);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reportsWithDistance
      .filter((r) => {
        // Status filter
        if (selectedStatus !== 'ALL' && r.status !== selectedStatus) return false;
        
        // Department filter
        if (selectedDept === 'ROADS' && r.category !== 'Roads & Potholes') return false;
        if (selectedDept === 'ELECTRIC' && r.category !== 'Electric Wires') return false;
        if (selectedDept === 'WASTE' && r.category !== 'Garbage & Waste') return false;
        
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchId = r.id.toLowerCase().includes(q);
          const matchCat = r.category.toLowerCase().includes(q);
          const matchLoc = r.location.toLowerCase().includes(q);
          const matchWard = (r.ward || '').toLowerCase().includes(q);
          const matchTitle = r.title.toLowerCase().includes(q);
          const matchDesc = r.description.toLowerCase().includes(q);
          if (!matchId && !matchCat && !matchLoc && !matchWard && !matchTitle && !matchDesc) {
            return false;
          }
        }

        // Near me radius filter
        if (nearMeActive && selectedRadius !== 'ALL' && selectedRadius !== 'NEAREST') {
          const maxRadius = parseFloat(selectedRadius);
          if (r.distanceKm !== null && r.distanceKm > maxRadius) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (nearMeActive) {
          if (a.distanceKm !== null && b.distanceKm !== null) {
            return a.distanceKm - b.distanceKm;
          }
          if (a.distanceKm !== null) return -1;
          if (b.distanceKm !== null) return 1;
        }
        return (b.upvotes || 0) - (a.upvotes || 0);
      });
  }, [reportsWithDistance, selectedStatus, selectedDept, searchQuery, nearMeActive, selectedRadius]);

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'RESOLVED':
        return {
          label: 'Resolved',
          dot: 'bg-red-600',
          badge: 'bg-red-50 text-red-800 border-red-200'
        };
      case 'IN_PROGRESS':
        return {
          label: 'In Progress',
          dot: 'bg-emerald-600 animate-pulse',
          badge: 'bg-emerald-50 text-emerald-900 border-emerald-300 font-semibold'
        };
      case 'ASSIGNED':
        return {
          label: 'Assigned',
          dot: 'bg-emerald-500',
          badge: 'bg-emerald-50/80 text-emerald-800 border-emerald-200'
        };
      case 'VERIFIED':
        return {
          label: 'Verified',
          dot: 'bg-emerald-500',
          badge: 'bg-emerald-50/60 text-emerald-800 border-emerald-200'
        };
      case 'REPORTED':
      default:
        return {
          label: 'Reported',
          dot: 'bg-neutral-500',
          badge: 'bg-neutral-100 text-neutral-800 border-neutral-200'
        };
    }
  };

  return (
    <section
      id="my-reports-section"
      className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-8 py-14 text-neutral-900 bg-white select-none border-t border-neutral-200"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-50 text-red-900 border border-red-200 text-xs font-semibold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              Live Civic Directory
            </span>

            {nearMeActive && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-300 text-xs font-semibold animate-in fade-in">
                <Navigation size={11} className="text-emerald-700 fill-emerald-700" />
                <span>Near You Active</span>
              </span>
            )}
          </div>

          <h2 className="font-sans-ui text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
            Public Complaints Directory
          </h2>
          <p className="text-neutral-600 text-xs sm:text-sm mt-1 max-w-xl">
            Browse and track citizen reports categorized by municipal authority and ward status.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          <button
            type="button"
            onClick={handleToggleNearMe}
            disabled={locating}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border shadow-2xs active:scale-95 ${
              nearMeActive
                ? 'bg-emerald-700 text-white border-emerald-700 hover:bg-emerald-800'
                : 'bg-white hover:bg-neutral-50 text-neutral-800 border-neutral-300'
            }`}
          >
            {locating ? (
              <span className="w-3.5 h-3.5 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Compass size={14} className={nearMeActive ? 'text-white' : 'text-red-700'} />
            )}
            <span>{nearMeActive ? 'Problems Near Me (ON)' : 'Problems Near Me'}</span>
          </button>

          <button
            onClick={onReportNew}
            className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            <Plus size={15} />
            <span>Report Issue</span>
          </button>
        </div>
      </div>

      {/* Clean Department Groups / Tabs */}
      <div className="mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {DEPARTMENT_TABS.map((dept) => {
            const isSelected = selectedDept === dept.id;
            const count = deptCounts[dept.id];

            return (
              <button
                key={dept.id}
                type="button"
                onClick={() => setSelectedDept(dept.id)}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-red-50/80 border-red-600 shadow-xs ring-1 ring-red-600'
                    : 'bg-neutral-50 hover:bg-neutral-100/80 border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-base">{dept.icon}</span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-bold ${
                      isSelected
                        ? 'bg-red-700 text-white'
                        : 'bg-white text-neutral-700 border border-neutral-200'
                    }`}
                  >
                    {count}
                  </span>
                </div>
                <div>
                  <h3 className={`text-xs font-bold leading-tight ${
                    isSelected ? 'text-red-950' : 'text-neutral-900'
                  }`}>
                    {dept.label}
                  </h3>
                  <p className="text-[10px] text-neutral-500 truncate mt-0.5">
                    {dept.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Near Me Active Filter Bar */}
      {nearMeActive && (
        <div className="mb-6 p-3 rounded-2xl bg-emerald-50/90 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2 text-xs text-emerald-950">
            <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0">
              <Crosshair size={14} />
            </div>
            <div>
              <span className="font-bold">Filtering issues around your location</span>
              <span className="text-[11px] text-emerald-800 block">Sorted closest to furthest</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap self-end sm:self-auto text-xs font-mono">
            <span className="text-emerald-900 text-[11px] font-semibold">Radius:</span>
            {(['NEAREST', '1', '3', '5', 'ALL'] as DistanceRadius[]).map((rad) => {
              const active = selectedRadius === rad;
              const label = rad === 'NEAREST' ? 'Closest' : rad === 'ALL' ? 'Any Distance' : `< ${rad} km`;
              return (
                <button
                  key={rad}
                  type="button"
                  onClick={() => setSelectedRadius(rad)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer border ${
                    active
                      ? 'bg-emerald-800 text-white border-emerald-800'
                      : 'bg-white text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                  }`}
                >
                  {label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setNearMeActive(false)}
              className="p-1 text-emerald-700 hover:text-emerald-900 rounded-md hover:bg-emerald-200 ml-1 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by issue title, location (e.g. Maitighar, Ward 4) or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:border-red-700 transition-colors"
          />
          <Search size={14} className="absolute left-3 top-2.5 text-neutral-400" />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          {STATUS_FILTERS.map((status) => {
            const active = selectedStatus === status.id;
            const isResolved = status.id === 'RESOLVED';
            return (
              <button
                key={status.id}
                onClick={() => setSelectedStatus(status.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border ${
                  active
                    ? isResolved
                      ? 'bg-red-700 text-white border-red-700 font-semibold'
                      : 'bg-emerald-100 text-emerald-950 border-emerald-400 font-semibold'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:text-neutral-900'
                }`}
              >
                {status.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Reports Directory Grid */}
      {filteredReports.length === 0 ? (
        <div className="p-12 rounded-2xl bg-neutral-50 border border-neutral-200 text-center space-y-2">
          <AlertCircle size={28} className="text-neutral-400 mx-auto" />
          <h3 className="text-sm font-semibold text-neutral-800">No complaints found</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            {searchQuery
              ? `No matching issues found for "${searchQuery}".`
              : 'There are currently no reports in this department or filter.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReports.map((report) => {
            const statusInfo = getStatusBadge(report.status);
            const hasUpvoted = upvotedIds.includes(report.id);
            const currentStepIdx = STATUS_ORDER[report.status];
            const isResolved = report.status === 'RESOLVED';

            return (
              <div
                key={report.id}
                onClick={() => onSelectReport(report)}
                className="group relative p-4 rounded-2xl bg-white hover:bg-neutral-50/70 border border-neutral-200 hover:border-neutral-300 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs flex flex-col justify-between"
              >
                <div>
                  {/* Card Top: Thumbnail + Header */}
                  <div className="flex items-start gap-3.5 mb-3">
                    <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden shrink-0 bg-neutral-100 border border-neutral-200">
                      <img
                        src={report.imageUrl}
                        alt={report.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[11px] font-mono font-bold text-neutral-500">
                          {report.id}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {report.distanceKm !== null && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <Navigation size={9} className="text-emerald-700 fill-emerald-700" />
                              <span>{report.distanceKm} km</span>
                            </span>
                          )}

                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border ${statusInfo.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                            {statusInfo.label}
                          </span>
                        </div>
                      </div>

                      <h3 className="font-sans-ui text-sm font-bold text-neutral-900 group-hover:text-red-800 transition-colors line-clamp-1">
                        {report.title}
                      </h3>

                      <span className="inline-block text-[11px] font-medium text-neutral-600 mt-0.5">
                        {report.category}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed mb-3">
                    {report.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="my-2.5 p-2 rounded-xl bg-neutral-50 border border-neutral-100">
                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mb-1">
                      <span>Status Flow</span>
                      <span className={`font-bold ${isResolved ? 'text-red-700' : 'text-emerald-700'}`}>
                        {isResolved ? '✓ Resolved' : `Stage ${currentStepIdx + 1} of 5`}
                      </span>
                    </div>

                    <div className="grid grid-cols-5 gap-1">
                      {LIFECYCLE_SEQUENCE.map((stg, sIdx) => {
                        const isReached = sIdx <= currentStepIdx;
                        const isCurrent = sIdx === currentStepIdx;
                        const isResolvedStage = stg.status === 'RESOLVED';
                        
                        let barColor = 'bg-neutral-200';
                        if (isReached) {
                          barColor = isResolvedStage ? 'bg-red-600' : 'bg-emerald-600';
                        }

                        return (
                          <div key={stg.status} className="flex flex-col gap-0.5 items-center">
                            <div
                              className={`h-1.5 w-full rounded-full transition-colors ${barColor} ${
                                isCurrent && !isResolvedStage ? 'animate-pulse' : ''
                              }`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1 text-neutral-600 min-w-0">
                    <MapPin size={13} className="text-red-700 shrink-0" />
                    <span className="truncate text-xs">{report.location}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => handleUpvote(e, report.id)}
                      title={hasUpvoted ? 'You upvoted this complaint (Click to undo)' : 'Upvote to raise municipal priority'}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                        hasUpvoted
                          ? 'bg-red-700 text-white border-red-700 shadow-2xs'
                          : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                      }`}
                    >
                      <ThumbsUp size={12} className={hasUpvoted ? 'fill-white text-white' : 'text-neutral-500'} />
                      <span>{report.upvotes}</span>
                    </button>

                    <span className="text-neutral-400 group-hover:text-red-700 group-hover:translate-x-0.5 transition-all">
                      <ArrowUpRight size={15} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

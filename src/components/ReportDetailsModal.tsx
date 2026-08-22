import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  MapPin, 
  Building2, 
  User, 
  Calendar,
  ThumbsUp,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { ComplaintReport, ReportStatus } from '../types';
import { upvoteReport, getUserUpvotes } from '../utils/reportsStorage';

interface ReportDetailsModalProps {
  report: ComplaintReport | null;
  onClose: () => void;
  onReportUpdated?: (updated: ComplaintReport) => void;
}

const LIFECYCLE_STEPS: { status: ReportStatus; label: string }[] = [
  { status: 'REPORTED', label: 'REPORTED' },
  { status: 'VERIFIED', label: 'VERIFIED' },
  { status: 'ASSIGNED', label: 'ASSIGNED' },
  { status: 'IN_PROGRESS', label: 'IN PROGRESS' },
  { status: 'RESOLVED', label: 'RESOLVED' },
];

const STATUS_ORDER: Record<ReportStatus, number> = {
  REPORTED: 0,
  VERIFIED: 1,
  ASSIGNED: 2,
  IN_PROGRESS: 3,
  RESOLVED: 4,
};

export const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({ 
  report, 
  onClose,
  onReportUpdated
}) => {
  const [currentReport, setCurrentReport] = useState<ComplaintReport | null>(report);
  const [upvotedIds, setUpvotedIds] = useState<string[]>(() => getUserUpvotes());

  React.useEffect(() => {
    setCurrentReport(report);
  }, [report]);

  if (!currentReport) return null;

  const currentStepIndex = STATUS_ORDER[currentReport.status];
  const hasUpvoted = upvotedIds.includes(currentReport.id);

  const handleUpvote = () => {
    const { updatedReports, success } = upvoteReport(currentReport.id);
    if (success) {
      const fresh = updatedReports.find((r) => r.id === currentReport.id) || null;
      if (fresh) {
        setCurrentReport(fresh);
        setUpvotedIds(getUserUpvotes());
        if (onReportUpdated) onReportUpdated(fresh);
      }
    }
  };

  const getStepVisual = (idx: number, stepStatus: ReportStatus) => {
    const isCompleted = idx < currentStepIndex;
    const isCurrent = idx === currentStepIndex;
    const isResolved = stepStatus === 'RESOLVED';
    const isReached = idx <= currentStepIndex;

    if (isResolved && isReached) {
      return {
        badgeBg: 'bg-red-700 text-white shadow-xs border-red-700 font-bold',
        textColor: 'text-red-700 font-bold',
        pillBg: 'bg-red-50 border-red-200 text-red-900',
        barColor: 'bg-red-600',
      };
    }

    if (isCurrent) {
      return {
        badgeBg: 'bg-emerald-600 text-white shadow-xs border-emerald-600 font-bold animate-pulse',
        textColor: 'text-emerald-800 font-bold',
        pillBg: 'bg-emerald-50 border-emerald-300 text-emerald-950',
        barColor: 'bg-emerald-600',
      };
    }

    if (isCompleted) {
      return {
        badgeBg: 'bg-emerald-600 text-white border-emerald-600 font-bold',
        textColor: 'text-emerald-800 font-semibold',
        pillBg: 'bg-emerald-50/70 border-emerald-200 text-emerald-900',
        barColor: 'bg-emerald-600',
      };
    }

    return {
      badgeBg: 'bg-neutral-100 text-neutral-400 border-neutral-200',
      textColor: 'text-neutral-400 font-normal',
      pillBg: 'bg-white border-neutral-200 text-neutral-400',
      barColor: 'bg-neutral-200',
    };
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl rounded-3xl bg-white border border-neutral-200 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col text-neutral-900"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-white">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-800 border border-neutral-200">
                {currentReport.id}
              </span>
              <span className="text-xs text-neutral-500 font-medium">
                {currentReport.category}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleUpvote}
                title={hasUpvoted ? 'You upvoted this complaint (Click to undo)' : 'Upvote this complaint to raise its priority'}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                  hasUpvoted
                    ? 'bg-red-700 text-white border-red-700 shadow-2xs'
                    : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                }`}
              >
                <ThumbsUp size={13} className={hasUpvoted ? 'fill-white text-white' : 'text-neutral-500'} />
                <span>{hasUpvoted ? 'Upvoted' : 'Upvote'}</span>
                <span className="font-mono text-[11px] font-bold">({currentReport.upvotes})</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {/* Title & Date */}
            <div>
              <h2 className="font-sans-ui text-xl font-bold text-neutral-900 tracking-tight mb-1.5">
                {currentReport.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <Calendar size={13} />
                <span>Reported on {currentReport.createdAt}</span>
              </div>
            </div>

            {/* Lifecycle Progress Flow: REPORTED → VERIFIED → ASSIGNED → IN PROGRESS → RESOLVED */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/90 shadow-xs">
              <div className="flex items-center justify-between text-[11px] font-mono font-semibold uppercase text-neutral-500 mb-3">
                <span>Progress Workflow</span>
                <span className="text-neutral-700 font-bold">
                  Stage {currentStepIndex + 1} of 5
                </span>
              </div>

              {/* Connected Stage Nodes */}
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2 text-center">
                {LIFECYCLE_STEPS.map((step, idx) => {
                  const visual = getStepVisual(idx, step.status);
                  const isLast = idx === LIFECYCLE_STEPS.length - 1;
                  const isCompleted = idx < currentStepIndex;

                  return (
                    <div key={step.status} className="flex flex-col items-center gap-1.5">
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl border flex items-center justify-center text-xs font-mono font-bold transition-all ${visual.badgeBg}`}
                      >
                        {isCompleted ? '✓' : idx + 1}
                      </div>
                      <span className={`text-[9px] sm:text-[10px] font-mono leading-tight ${visual.textColor}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Continuous Progress Bar with Stage Colors */}
              <div className="mt-3.5 pt-3 border-t border-neutral-200/70 grid grid-cols-5 gap-1">
                {LIFECYCLE_STEPS.map((stg, sIdx) => {
                  const isReached = sIdx <= currentStepIndex;
                  const isResolved = stg.status === 'RESOLVED';
                  let barBg = 'bg-neutral-200';

                  if (isReached) {
                    barBg = isResolved ? 'bg-red-600' : 'bg-emerald-600';
                  }

                  return (
                    <div
                      key={stg.status}
                      className={`h-2 rounded-full transition-all ${barBg}`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Description & Photo */}
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
                  Details
                </h4>
                <p className="text-sm text-neutral-700 leading-relaxed bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                  {currentReport.description}
                </p>
              </div>

              {currentReport.imageUrl && (
                <div className="rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-100">
                  <img
                    src={currentReport.imageUrl}
                    alt={currentReport.title}
                    referrerPolicy="no-referrer"
                    className="w-full max-h-64 object-cover"
                  />
                </div>
              )}
            </div>

            {/* Location & Routing Info */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin size={15} className="text-red-700 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="text-neutral-500 block text-[11px]">Location</span>
                  <span className="font-semibold text-neutral-900">{currentReport.location}</span>
                  {currentReport.coordinates && (
                    <a
                      href={`https://www.openstreetmap.org/?mlat=${currentReport.coordinates.lat}&mlon=${currentReport.coordinates.lng}#map=17/${currentReport.coordinates.lat}/${currentReport.coordinates.lng}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1 text-[11px] text-red-700 hover:text-red-900 underline mt-0.5"
                    >
                      <span>Open on Map</span>
                      <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-2.5 border-t border-neutral-200/60">
                <Building2 size={15} className="text-neutral-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-neutral-500 block text-[11px]">Department</span>
                  <span className="font-semibold text-neutral-900">
                    {currentReport.department || 'Assigned to Municipal Field Works'}
                  </span>
                </div>
              </div>

              {currentReport.assignedOfficer && (
                <div className="flex items-start gap-2.5 pt-2.5 border-t border-neutral-200/60">
                  <User size={15} className="text-neutral-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Assigned Officer</span>
                    <span className="font-semibold text-neutral-900">{currentReport.assignedOfficer}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

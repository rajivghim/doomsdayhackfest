import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Circle, ChevronRight, ArrowLeft } from 'lucide-react';

interface HeroProps {
  onReportIssue: () => void;
  onViewMyReports: () => void;
  onTrackSampleReport?: (reportId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  onReportIssue, 
  onViewMyReports, 
  onTrackSampleReport,
}) => {
  return (
    <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 sm:px-8 md:px-12 pt-16 pb-20 max-w-5xl mx-auto w-full select-none bg-white">
      {/* Top Heritage Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-5"
      >
        <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-red-50 text-red-900 border border-red-200 text-xs sm:text-sm font-semibold tracking-wide shadow-xs">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          तपाईंको गुनासो हराउँदैन।
        </span>
      </motion.div>

      {/* Main High-Contrast Headline with Crimson Resolve Accent */}
      <motion.h1
        id="hero-headline"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="font-serif-display text-4xl sm:text-6xl md:text-7xl lg:text-[5.2rem] text-neutral-900 font-normal tracking-[-0.02em] leading-[1.08] sm:leading-[1.1] mb-6 max-w-4xl"
      >
        REPORT • TRACK • <span className="text-red-700">RESOLVE</span>
      </motion.h1>

      {/* Subtitle Description */}
      <motion.p
        id="hero-subheading"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        className="font-sans-ui text-neutral-600 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl text-center mb-10 sm:mb-12 font-normal"
      >
        Track every complaint from report to resolution.
      </motion.p>

      {/* Hero Buttons: Primary (← REPORT AN ISSUE) & Secondary (MY REPORT) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 w-full max-w-md mx-auto"
      >
        {/* Primary CTA Button -> Smooth Scroll to Report Section */}
        <button
          id="hero-report-issue-btn"
          onClick={onReportIssue}
          className="w-full sm:w-auto min-w-[200px] group relative inline-flex items-center justify-center rounded-full px-8 py-3.5 text-base font-semibold text-white bg-red-700 hover:bg-red-800 border border-red-700 hover:border-red-800 transition-all duration-200 shadow-md shadow-red-900/15 cursor-pointer focus:outline-none active:scale-[0.98]"
        >
          <span className="relative z-10 flex items-center gap-2 tracking-wide">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>REPORT AN ISSUE</span>
          </span>
        </button>

        {/* Secondary CTA Button -> Smooth Scroll to My Reports Section */}
        <button
          id="hero-my-report-btn"
          onClick={onViewMyReports}
          className="w-full sm:w-auto min-w-[170px] inline-flex items-center justify-center rounded-full px-8 py-3.5 text-base font-semibold text-neutral-800 hover:text-red-900 bg-white hover:bg-red-50/50 border border-neutral-300 hover:border-red-300 transition-all duration-200 cursor-pointer focus:outline-none active:scale-[0.98]"
        >
          <span>MY REPORT</span>
        </button>
      </motion.div>

      {/* Interactive Report Tracking Showcase Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-3xl rounded-3xl bg-neutral-50 border border-neutral-200/90 p-6 sm:p-8 text-left shadow-lg relative overflow-hidden"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-900 border border-red-200 text-xs font-mono font-semibold">
                LIVE COMPLAINT TRACKER
              </span>
              <span className="text-xs text-neutral-500 font-mono">ID: SS-1048</span>
            </div>
            <h3 className="font-sans-ui text-xl text-neutral-900 font-bold tracking-tight">
              Road Damage & Asphalt Crack
            </h3>
          </div>
          <button
            onClick={() => onTrackSampleReport ? onTrackSampleReport('SS-1048') : onViewMyReports()}
            className="text-xs text-red-700 hover:text-red-900 flex items-center gap-1 font-mono font-semibold uppercase tracking-wider cursor-pointer"
          >
            <span>View Full Details</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* 5-Step Lifecycle Progress Tracker */}
        <div className="space-y-4">
          <div className="text-xs text-neutral-500 font-sans-ui uppercase tracking-wider mb-2 font-medium">
            Complaint Lifecycle:
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-1.5">
            {/* Step 1: REPORTED */}
            <div className="flex flex-col items-center sm:items-start p-3 rounded-2xl bg-white border border-neutral-200">
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mb-1">
                <CheckCircle2 size={14} />
                <span>Reported</span>
              </div>
              <span className="text-[11px] text-neutral-500 font-mono">Aug 20, 9:30 AM</span>
            </div>

            {/* Step 2: VERIFIED */}
            <div className="flex flex-col items-center sm:items-start p-3 rounded-2xl bg-white border border-neutral-200">
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mb-1">
                <CheckCircle2 size={14} />
                <span>Verified</span>
              </div>
              <span className="text-[11px] text-neutral-500 font-mono">Aug 20, 11:15 AM</span>
            </div>

            {/* Step 3: ASSIGNED */}
            <div className="flex flex-col items-center sm:items-start p-3 rounded-2xl bg-white border border-neutral-200">
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mb-1">
                <CheckCircle2 size={14} />
                <span>Assigned</span>
              </div>
              <span className="text-[11px] text-neutral-500 font-mono">Aug 20, 2:40 PM</span>
            </div>

            {/* Step 4: IN PROGRESS (Active) */}
            <div className="flex flex-col items-center sm:items-start p-3 rounded-2xl bg-emerald-50 border border-emerald-400 relative">
              <div className="flex items-center gap-1.5 text-xs text-emerald-900 font-semibold mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping inline-block" />
                <span>In Progress</span>
              </div>
              <span className="text-[11px] text-emerald-900 font-mono">Work Crew on Site</span>
            </div>

            {/* Step 5: RESOLVED */}
            <div className="flex flex-col items-center sm:items-start p-3 rounded-2xl bg-red-50/50 border border-red-200">
              <div className="flex items-center gap-1.5 text-xs text-red-700 font-semibold mb-1">
                <Circle size={14} />
                <span>Resolved</span>
              </div>
              <span className="text-[11px] text-red-900/70 font-mono">Final Target</span>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-neutral-200 flex flex-wrap items-center justify-between text-xs text-neutral-600 gap-2">
          <span>Location: <strong className="text-neutral-800">Kathmandu, Ward 4</strong></span>
          <span>Department: <strong className="text-neutral-800">Dept. of Roads & Transport</strong></span>
          <span className="text-neutral-600 font-medium">Priority: <strong className="text-red-800 bg-red-50 px-2 py-0.5 rounded-md border border-red-200 text-[11px] font-mono">High Priority</strong></span>
        </div>
      </motion.div>
    </section>
  );
};

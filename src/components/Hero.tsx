import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onReportIssue: () => void;
  onViewMyReports: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  onReportIssue, 
  onViewMyReports, 
}) => {
  return (
    <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 sm:px-8 md:px-12 pt-16 pb-12 max-w-5xl mx-auto w-full select-none bg-white">
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

      {/* Hero Buttons: Primary (REPORT AN ISSUE →) & Secondary (MY REPORT) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 w-full max-w-md mx-auto"
      >
        {/* Primary CTA Button -> Smooth Scroll to Report Section */}
        <button
          id="hero-report-issue-btn"
          onClick={onReportIssue}
          className="w-full sm:w-auto min-w-[200px] group relative inline-flex items-center justify-center rounded-full px-8 py-3.5 text-base font-semibold text-white bg-red-700 hover:bg-red-800 border border-red-700 hover:border-red-800 transition-all duration-200 shadow-md shadow-red-900/15 cursor-pointer focus:outline-none active:scale-[0.98]"
        >
          <span className="relative z-10 flex items-center gap-2 tracking-wide">
            <span>REPORT AN ISSUE</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
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
    </section>
  );
};

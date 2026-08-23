import React from 'react';
import { motion } from 'motion/react';

export const AboutView: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 flex-1 px-6 sm:px-12 py-16 max-w-4xl mx-auto w-full text-center select-none"
    >
      <span className="font-sans-ui text-xs uppercase tracking-widest text-cyan-300/80 mb-4 inline-block">
        The SewaSathi Mission
      </span>

      <h2 className="font-sans-ui text-3xl sm:text-4xl md:text-5xl text-neutral-900 font-bold tracking-tight leading-tight mb-8">
        Bridging the gap between citizen voices and administrative action.
      </h2>

      <div className="space-y-6 text-neutral-600 font-sans-ui text-base sm:text-lg leading-relaxed text-left max-w-2xl mx-auto">
        <p>
          Too often, civic problems get lost in endless paperwork, unanswered phone lines, and lack of transparency. Citizens feel ignored, while municipal teams lack clear, organized telemetry on what matters most.
        </p>
        <p>
          SewaSathi provides a transparent, accountable platform where every reported issue is categorized, routed to the responsible department, and publicly tracked from submission to resolution.
        </p>
        <p className="font-sans-ui font-medium italic text-lg text-neutral-800 pt-4 text-center">
          "Where your complaint finally gets seen."
        </p>
      </div>
    </motion.section>
  );
};

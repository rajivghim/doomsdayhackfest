import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Moon, Compass, Feather, ShieldCheck, ArrowRight } from 'lucide-react';

interface ProductViewProps {
  onStartCreating: () => void;
}

export const ProductView: React.FC<ProductViewProps> = ({ onStartCreating }) => {
  const tools = [
    {
      icon: Feather,
      title: 'Starlight Editor',
      tag: 'Core Suite',
      desc: 'A distraction-free writing environment tuned for late-night insights, typography fidelity, and organic thought flow.',
    },
    {
      icon: Compass,
      title: 'Constellation Canvas',
      tag: 'Visual Thinking',
      desc: 'Map concepts, brainstorm threads, and interlinked ideas as celestial constellations in deep space.',
    },
    {
      icon: Moon,
      title: 'Cosmic Ambient Flow',
      tag: 'Binaural Audio',
      desc: 'Harmonic synthesized audio frequencies and starlight hum designed to trigger effortless creative flow states.',
    },
    {
      icon: ShieldCheck,
      title: 'Sovereign Privacy',
      tag: 'Zero Telemetry',
      desc: 'Your deepest musings remain strictly yours. Local-first architecture with private encrypted sync.',
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 flex-1 px-6 sm:px-12 py-12 max-w-6xl mx-auto w-full"
    >
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-xs mb-4">
          <Sparkles size={12} />
          <span>The Lunora Ecosystem</span>
        </div>
        <h2 className="font-serif-display text-4xl sm:text-5xl text-white font-normal mb-4">
          Crafted for quiet brilliance.
        </h2>
        <p className="font-sans-ui text-neutral-400 text-base leading-relaxed">
          Every pixel and interaction is calibrated to remove clutter and elevate your clearest thinking.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {tools.map((tool, idx) => {
          const Icon = tool.icon;
          return (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="group p-8 rounded-3xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 hover:border-cyan-400/30 transition-all duration-300 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-300 group-hover:scale-105 group-hover:bg-cyan-500/10 transition-all">
                  <Icon size={18} />
                </div>
                <span className="text-[11px] uppercase tracking-wider font-mono px-2.5 py-0.5 rounded-full bg-white/5 text-neutral-400 border border-white/10">
                  {tool.tag}
                </span>
              </div>
              <h3 className="font-serif-display text-2xl text-white font-normal mb-2.5">
                {tool.title}
              </h3>
              <p className="font-sans-ui text-neutral-400 text-sm leading-relaxed">
                {tool.desc}
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="text-center">
        <button
          onClick={onStartCreating}
          className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-base font-normal text-white bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 transition-all cursor-pointer"
        >
          <span>Launch Workspace</span>
          <ArrowRight size={16} className="text-cyan-300" />
        </button>
      </div>
    </motion.section>
  );
};

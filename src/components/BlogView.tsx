import React from 'react';
import { motion } from 'motion/react';
import { Clock, ArrowUpRight } from 'lucide-react';

export const BlogView: React.FC = () => {
  const articles = [
    {
      title: 'The Architecture of Quiet Software',
      date: 'Aug 18, 2026',
      readTime: '5 min read',
      excerpt: 'Why software designed with low cognitive friction and dark celestial aesthetics stimulates deeper flow states.',
      category: 'Design Philosophy',
    },
    {
      title: 'Why We Think Better Under the Stars',
      date: 'Aug 04, 2026',
      readTime: '7 min read',
      excerpt: 'A neuroscience look at nocturnal cognition, visual negative space, and associative thinking.',
      category: 'Cognition',
    },
    {
      title: 'Non-Linear Thought: Constellations vs Folders',
      date: 'Jul 22, 2026',
      readTime: '4 min read',
      excerpt: 'Moving away from hierarchical trees toward organic relational nodes that mimic how the brain connects breakthroughs.',
      category: 'Systems',
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 flex-1 px-6 sm:px-12 py-14 max-w-4xl mx-auto w-full"
    >
      <div className="text-center mb-14">
        <h2 className="font-serif-display text-4xl sm:text-5xl text-white font-normal mb-3">
          Starlight Dispatches
        </h2>
        <p className="font-sans-ui text-neutral-400 text-base">
          Essays on deep work, slow computing, and the craft of creation.
        </p>
      </div>

      <div className="space-y-6">
        {articles.map((item, idx) => (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            className="group p-6 sm:p-8 rounded-3xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-cyan-400/30 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs text-neutral-400 font-mono mb-3">
              <span className="text-cyan-300 uppercase tracking-wider">{item.category}</span>
              <div className="flex items-center gap-3">
                <span>{item.date}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {item.readTime}
                </span>
              </div>
            </div>
            <h3 className="font-serif-display text-2xl sm:text-3xl text-white group-hover:text-cyan-200 transition-colors font-normal mb-2 flex items-center justify-between">
              <span>{item.title}</span>
              <ArrowUpRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity text-cyan-300" />
            </h3>
            <p className="font-sans-ui text-neutral-400 text-sm sm:text-base leading-relaxed">
              {item.excerpt}
            </p>
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
};

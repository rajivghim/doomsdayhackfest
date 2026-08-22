import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Volume2, VolumeX, Sparkles, Copy, Check, Clock, Download, Plus, Trash2 } from 'lucide-react';
import { cosmicAudio } from '../utils/audioSynth';

interface FocusWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FocusWorkspaceModal: React.FC<FocusWorkspaceModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerActive, setTimerActive] = useState(false);
  const [ideas, setIdeas] = useState<Array<{ id: string; text: string; x: number; y: number }>>([
    { id: '1', text: 'Pothole on Main St (Under Review)', x: 20, y: 35 },
    { id: '2', text: 'Streetlight outage Ward 4 (Assigned)', x: 60, y: 25 },
    { id: '3', text: 'Water pipe leak (Solved)', x: 45, y: 70 },
  ]);
  const [newIdeaInput, setNewIdeaInput] = useState('');
  const [activeTab, setActiveTab] = useState<'writer' | 'constellation'>('writer');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  const toggleSound = () => {
    const playing = cosmicAudio.toggle();
    setIsAudioPlaying(playing);
  };

  const copyToClipboard = () => {
    const fullText = `${title ? title + '\n\n' : ''}${content}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadText = () => {
    const fullText = `${title ? title + '\n\n' : ''}${content}`;
    const blob = new Blob([fullText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(title || 'starlight-thought').toLowerCase().replace(/\s+/g, '-')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const addConstellationNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdeaInput.trim()) return;
    const newNode = {
      id: Date.now().toString(),
      text: newIdeaInput.trim(),
      x: 15 + Math.random() * 70,
      y: 20 + Math.random() * 60,
    };
    setIdeas((prev) => [...prev, newNode]);
    setNewIdeaInput('');
  };

  const removeNode = (id: string) => {
    setIdeas((prev) => prev.filter((item) => item.id !== id));
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl h-[90vh] bg-neutral-950/90 border border-white/15 rounded-3xl flex flex-col shadow-[0_0_80px_rgba(112,214,255,0.08)] overflow-hidden"
        >
          {/* Top Bar Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="font-serif-display text-xl text-white">SewaSathi</span>
                <span className="text-cyan-300 text-xs">✦</span>
                <span className="text-xs text-neutral-400 font-sans-ui ml-2 px-2 py-0.5 rounded-full border border-white/10 bg-white/5">
                  Report Portal
                </span>
              </div>

              {/* Mode switch */}
              <div className="hidden sm:flex items-center bg-white/5 p-0.5 rounded-full border border-white/10 text-xs">
                <button
                  id="tab-writer"
                  onClick={() => setActiveTab('writer')}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                    activeTab === 'writer' ? 'bg-white/15 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  File Report
                </button>
                <button
                  id="tab-constellation"
                  onClick={() => setActiveTab('constellation')}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1 ${
                    activeTab === 'constellation' ? 'bg-white/15 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Sparkles size={11} className="text-cyan-300" />
                  Live Issue Map
                </button>
              </div>
            </div>

            {/* Actions: Timer, Ambient Drone Sound, Copy, Close */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Pomodoro Focus Timer */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-neutral-300">
                <Clock size={13} className={timerActive ? 'text-cyan-300 animate-pulse' : 'text-neutral-400'} />
                <span className="font-mono">{formatTime(timerSeconds)}</span>
                <button
                  id="toggle-focus-timer-btn"
                  onClick={() => setTimerActive(!timerActive)}
                  className="ml-1 text-[11px] text-cyan-300 hover:text-cyan-200 uppercase font-semibold cursor-pointer"
                >
                  {timerActive ? 'Pause' : 'Start'}
                </button>
              </div>

              {/* Ambient Soundscape Synthesizer */}
              <button
                id="ambient-sound-btn"
                onClick={toggleSound}
                className={`p-2 rounded-full border transition-all cursor-pointer ${
                  isAudioPlaying
                    ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300 shadow-[0_0_12px_rgba(112,214,255,0.3)]'
                    : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                }`}
                title={isAudioPlaying ? 'Mute Starlight Ambient Sound' : 'Play Starlight Ambient Drone'}
              >
                {isAudioPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>

              {/* Copy & Download */}
              <button
                id="copy-text-btn"
                onClick={copyToClipboard}
                className="p-2 rounded-full bg-white/5 border border-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title="Copy markdown to clipboard"
              >
                {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              </button>

              <button
                id="download-note-btn"
                onClick={downloadText}
                className="p-2 rounded-full bg-white/5 border border-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title="Download as Markdown file"
              >
                <Download size={16} />
              </button>

              {/* Close Modal */}
              <button
                id="close-workspace-btn"
                onClick={onClose}
                className="p-2 rounded-full bg-white/5 border border-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer ml-1"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Workspace Body */}
          <div className="flex-1 overflow-y-auto relative p-6 sm:p-10 flex flex-col">
            {activeTab === 'writer' ? (
              <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col">
                {/* Title Input in elegant serif font */}
                <input
                  id="note-title-input"
                  type="text"
                  placeholder="Issue Title (e.g. Broken streetlight on 5th Ave)..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full font-serif-display text-2xl sm:text-4xl text-white placeholder:text-neutral-600 bg-transparent border-none outline-none mb-6 font-normal tracking-wide"
                />

                {/* Content Editor */}
                <textarea
                  id="note-content-input"
                  placeholder="Describe what's broken, the precise location, severity, and any details for authorities to solve it..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full flex-1 min-h-[360px] bg-transparent text-neutral-200 placeholder:text-neutral-600 font-sans-ui text-base sm:text-lg leading-relaxed outline-none resize-none border-none selection:bg-cyan-500/20 selection:text-cyan-200"
                />
              </div>
            ) : (
              /* Constellation Idea Visualizer */
              <div className="relative w-full h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-neutral-400">
                    Track citizen reports moving across status nodes from reported to solved.
                  </span>
                  <form onSubmit={addConstellationNode} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add an issue node..."
                      value={newIdeaInput}
                      onChange={(e) => setNewIdeaInput(e.target.value)}
                      className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs hover:bg-cyan-500/30 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={13} />
                      Add Node
                    </button>
                  </form>
                </div>

                {/* Constellation Canvas View */}
                <div className="relative flex-1 rounded-2xl bg-black/60 border border-white/10 overflow-hidden">
                  {/* Connective constellation lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {ideas.map((node, i) => {
                      if (i === 0) return null;
                      const prev = ideas[i - 1];
                      return (
                        <line
                          key={`line-${node.id}`}
                          x1={`${prev.x}%`}
                          y1={`${prev.y}%`}
                          x2={`${node.x}%`}
                          y2={`${node.y}%`}
                          stroke="rgba(112, 214, 255, 0.25)"
                          strokeWidth="1.2"
                          strokeDasharray="4 4"
                        />
                      );
                    })}
                  </svg>

                  {/* Nodes */}
                  {ideas.map((node) => (
                    <motion.div
                      key={node.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                      style={{ top: `${node.y}%`, left: `${node.x}%` }}
                    >
                      <div className="relative flex items-center gap-2 bg-neutral-900/90 border border-cyan-400/30 px-3.5 py-2 rounded-full shadow-[0_0_15px_rgba(56,189,248,0.2)] hover:border-cyan-300 transition-all">
                        <span className="w-2 h-2 rounded-full bg-cyan-300 animate-pulse shadow-[0_0_8px_#38bdf8]" />
                        <span className="text-xs text-neutral-200 font-sans-ui whitespace-nowrap">
                          {node.text}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNode(node.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-red-400 transition-opacity ml-1"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Footer Info */}
          <div className="px-6 py-3 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs text-neutral-500 font-mono">
            <div className="flex items-center gap-4">
              <span>{wordCount} words</span>
              <span>{charCount} characters</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Autosaved to memory</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

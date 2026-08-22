import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Send, 
  CheckCircle2, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare, 
  AlertCircle,
  Compass,
  ArrowRight,
  Plus
} from 'lucide-react';
import { ActiveTab } from '../types';

interface ContactViewProps {
  onNavigateTab?: (tab: ActiveTab) => void;
  onReportNew?: () => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onNavigateTab, onReportNew }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Question about a Report');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSent(true);
  };


  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 flex-1 px-6 sm:px-12 py-14 max-w-4xl mx-auto w-full text-white bg-black select-none"
    >
      <div className="text-center mb-10">
        <span className="text-xs font-mono text-cyan-300 uppercase tracking-widest block mb-2">
          CITIZEN SUPPORT & HELP
        </span>
        <h2 className="font-serif-display text-4xl sm:text-5xl text-white font-normal mb-3">
          Contact SewaSathi Grievance Desk
        </h2>
        <p className="font-sans-ui text-neutral-400 text-sm sm:text-base max-w-xl mx-auto">
          Need assistance with a submitted complaint, tracking updates, or have questions for municipal authorities? We are here to support you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Contact Info Cards */}
        <div className="md:col-span-2 space-y-4 text-left">
          <div className="p-5 rounded-3xl bg-neutral-950 border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-cyan-300 text-xs font-mono uppercase tracking-wider">
              <Phone size={14} />
              <span>Municipal Toll-Free</span>
            </div>
            <div className="text-xl font-serif-display text-white">
              1100 <span className="text-xs font-sans-ui text-neutral-400 font-normal">(24/7 Helpline)</span>
            </div>
            <p className="text-xs text-neutral-400">
              Direct emergency civic dispatch for water pipe bursts, road hazards, or power line emergencies.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-neutral-950 border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-cyan-300 text-xs font-mono uppercase tracking-wider">
              <Mail size={14} />
              <span>Email Support</span>
            </div>
            <div className="text-base font-mono text-white">
              support@sewasathi.gov.np
            </div>
            <p className="text-xs text-neutral-400">
              Send audit inquiries, appeals, or evidence attachments to the central desk.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-neutral-950 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-cyan-300 text-xs font-mono uppercase tracking-wider">
              <MapPin size={14} />
              <span>Central Office</span>
            </div>
            <p className="text-xs text-neutral-300 font-medium">
              Kathmandu Metropolitan City Office, Civic Grievance Wing, Ward 4
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 font-mono pt-1">
              <Clock size={11} />
              <span>Sun – Fri: 09:00 AM – 05:00 PM</span>
            </div>
          </div>
        </div>

        {/* Feedback / Question Form */}
        <div className="md:col-span-3">
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 rounded-3xl bg-neutral-950 border border-cyan-400/40 text-center space-y-4 shadow-xl"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-400/30">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="font-serif-display text-2xl text-white">Inquiry Submitted Successfully</h3>
              <p className="font-sans-ui text-neutral-300 text-sm max-w-md mx-auto">
                Thank you, {name || 'Citizen'}. Your message has been routed to the SewaSathi Citizen Desk. A response will be provided to {email || 'your contact'}.
              </p>
              <button
                onClick={() => {
                  setSent(false);
                  setMessage('');
                }}
                className="text-xs font-mono uppercase tracking-wider text-cyan-300 hover:text-cyan-200 cursor-pointer pt-2"
              >
                Send another message →
              </button>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-4 p-7 sm:p-8 rounded-3xl bg-neutral-950 border border-white/10 text-left shadow-xl"
            >
              <h3 className="font-serif-display text-2xl text-white mb-2">
                Submit Question / Feedback
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maya Shrestha"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/15 text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-400 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="maya@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/15 text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-400 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="9841000000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/15 text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-400 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                    Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Question about a Report">Question about a Report</option>
                    <option value="Escalate Pending Issue">Escalate Pending Issue</option>
                    <option value="Platform Feedback">Platform Feedback</option>
                    <option value="Authority Coordination">Authority Coordination</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                  Message / Question *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Type your message, query, or report reference number..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/15 text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-400 text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-white hover:bg-neutral-200 text-black font-medium text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95"
              >
                <Send size={15} />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>

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
            onClick={() => onReportNew ? onReportNew() : onNavigateTab && onNavigateTab('report')}
            className="px-4 py-2 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 hover:text-cyan-200 transition-colors cursor-pointer font-medium flex items-center gap-1.5"
          >
            <Plus size={13} />
            <span>Report Issue</span>
          </button>
          <button
            onClick={() => onNavigateTab && onNavigateTab('my-reports')}
            className="px-4 py-2 rounded-full bg-white/[0.04] hover:bg-white/15 border border-white/15 hover:border-white/30 text-neutral-200 hover:text-white transition-colors cursor-pointer font-medium flex items-center gap-1"
          >
            <span>My Reports</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </motion.section>
  );
};

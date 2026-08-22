import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Upload, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles,
  Layers,
  Compass,
  FileText,
  X
} from 'lucide-react';
import { IssueCategory, ComplaintReport, ActiveTab } from '../types';
import { createNewReport } from '../utils/reportsStorage';

interface ReportIssueViewProps {
  onReportSubmitted: (newReport: ComplaintReport) => void;
  onNavigateTab: (tab: ActiveTab) => void;
}

const CATEGORIES: { id: IssueCategory; label: string; icon: string; desc: string }[] = [
  { id: 'Roads & Potholes', label: 'Roads & Potholes', icon: '🛣️', desc: 'Crater potholes, broken asphalt, sunken utility cuts' },
  { id: 'Electric Wires', label: 'Electric Wires', icon: '⚡', desc: 'Dark streetlights, sparking poles, low-hanging cables' },
  { id: 'Garbage & Waste', label: 'Garbage & Waste', icon: '🗑️', desc: 'Overflowing dumpsters, uncollected waste, litter pile' },
];

const SAMPLE_PRESET_IMAGES = [
  {
    name: 'Road Pothole Photo',
    url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Electric Wire Hazard',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Garbage Heap Photo',
    url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80'
  }
];

export const ReportIssueView: React.FC<ReportIssueViewProps> = ({
  onReportSubmitted,
  onNavigateTab,
}) => {
  const [category, setCategory] = useState<IssueCategory>('Roads & Potholes');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [ward, setWard] = useState('Ward 4');
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [citizenEmail, setCitizenEmail] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  
  // Submission success state
  const [submittedReport, setSubmittedReport] = useState<ComplaintReport | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setImageUrl(uploadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please enter an issue title or summary.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Please describe the problem in detail.');
      return;
    }
    if (!location.trim()) {
      setErrorMsg('Please specify the exact location or street landmark.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    setTimeout(() => {
      const created = createNewReport({
        title: title.trim(),
        category,
        description: description.trim(),
        location: location.trim(),
        ward: ward.trim(),
        citizenName: citizenName.trim() || 'Anonymous Citizen',
        citizenPhone: citizenPhone.trim(),
        citizenEmail: citizenEmail.trim(),
        imageUrl: imageUrl || undefined,
      });

      setIsSubmitting(false);
      setSubmittedReport(created);
    }, 400);
  };

  const handleViewInMyReports = () => {
    if (submittedReport) {
      onReportSubmitted(submittedReport);
    } else {
      onNavigateTab('my-reports');
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 flex-1 px-6 sm:px-10 md:px-12 py-12 max-w-4xl mx-auto w-full text-white bg-black select-none"
    >
      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="font-mono text-xs text-cyan-300 uppercase tracking-widest">
            CIVIC GRIEVANCE LODGING
          </span>
        </div>
        <h1 className="font-serif-display text-4xl sm:text-5xl text-white font-normal mb-3">
          Report a Public Issue
        </h1>
        <p className="font-sans-ui text-neutral-400 text-sm sm:text-base max-w-xl mx-auto">
          Submit civic breakdowns directly to municipal authorities. Every report is audited and tracked to verified resolution.
        </p>
      </div>

      {submittedReport ? (
        /* Submission Success Page View */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 sm:p-12 rounded-3xl bg-neutral-950 border border-cyan-400/40 text-center space-y-6 shadow-2xl"
        >
          <div className="w-18 h-18 rounded-full bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 size={40} />
          </div>

          <div>
            <h2 className="font-serif-display text-3xl sm:text-4xl text-white mb-2">
              Your complaint has been submitted successfully.
            </h2>
            <p className="text-neutral-300 text-sm max-w-lg mx-auto">
              Your grievance has been assigned a unique tracking token and dispatched to the intake verification desk.
            </p>
          </div>

          {/* Report Token Details Card */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-cyan-400/30 max-w-lg mx-auto text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-400 uppercase tracking-wider font-mono">Unique Tracking ID</span>
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-sm font-mono font-bold">
                {submittedReport.id}
              </span>
            </div>
            <div className="text-xl font-serif-display text-white">
              {submittedReport.title}
            </div>
            <div className="text-xs text-neutral-300 flex flex-wrap items-center justify-between pt-3 border-t border-white/10 gap-2 font-mono">
              <span>Category: <strong>{submittedReport.category}</strong></span>
              <span>Ward: <strong>{submittedReport.ward}</strong></span>
              <span className="text-emerald-300">Status: REPORTED ✓</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={handleViewInMyReports}
              className="w-full sm:w-auto rounded-full px-8 py-3.5 text-sm font-medium text-black bg-cyan-300 hover:bg-cyan-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95"
            >
              <span>Track in My Reports</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => {
                setSubmittedReport(null);
                setTitle('');
                setDescription('');
                setLocation('');
                setImageUrl('');
                setSelectedFileName('');
              }}
              className="w-full sm:w-auto rounded-full px-7 py-3.5 text-sm text-neutral-300 hover:text-white border border-white/20 hover:border-white/40 transition-all cursor-pointer"
            >
              Submit Another Report
            </button>
          </div>
        </motion.div>
      ) : (
        /* Standalone Report Issue Form */
        <form onSubmit={handleSubmit} className="space-y-6 p-6 sm:p-10 rounded-3xl bg-neutral-950 border border-white/10 text-left shadow-2xl">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-400/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Category Selection */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-2.5 font-medium font-mono">
              1. Choose Complaint Category *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-md'
                        : 'bg-white/[0.02] border-white/10 text-neutral-300 hover:border-white/25 hover:text-white'
                    }`}
                  >
                    <span className="text-xl shrink-0 mt-0.5">{cat.icon}</span>
                    <div>
                      <div className="text-xs font-semibold">{cat.label}</div>
                      <div className="text-[11px] text-neutral-400 line-clamp-1">{cat.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Issue Title */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 font-medium font-mono">
              2. Complaint Title / Summary *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Deep pothole causing hazard near crossroad"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/15 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          {/* 3. Detailed Description */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 font-medium font-mono">
              3. Detailed Description of the Breakdown *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Explain the problem in detail: how severe it is, when it occurred, safety hazards for pedestrians or vehicles..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/15 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
            />
          </div>

          {/* 4. Location & Ward */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 font-medium font-mono">
                4. Location / Street Landmark *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Baluwatar Junction, near Nepal Bank"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/[0.03] border border-white/15 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
                <MapPin size={18} className="absolute left-3.5 top-3.5 text-cyan-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 font-medium font-mono">
                Ward Number
              </label>
              <select
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                className="w-full px-3 py-3 rounded-2xl bg-neutral-900 border border-white/15 text-sm text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="Ward 1">Ward 1</option>
                <option value="Ward 2">Ward 2</option>
                <option value="Ward 3">Ward 3</option>
                <option value="Ward 4">Ward 4</option>
                <option value="Ward 5">Ward 5</option>
                <option value="Ward 6">Ward 6</option>
                <option value="Ward 7">Ward 7</option>
                <option value="Ward 8">Ward 8</option>
                <option value="Ward 9">Ward 9</option>
                <option value="Ward 10">Ward 10</option>
              </select>
            </div>
          </div>

          {/* 5. Image / Evidence Upload */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 font-medium font-mono">
              5. Photo / Visual Proof (Optional)
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="flex-1 flex flex-col items-center justify-center p-5 rounded-2xl border border-dashed border-white/20 hover:border-cyan-400/50 bg-white/[0.01] hover:bg-white/[0.03] transition-colors cursor-pointer text-center">
                <Upload size={22} className="text-neutral-400 mb-1.5" />
                <span className="text-xs text-neutral-300">
                  {selectedFileName ? selectedFileName : 'Click to upload photographic evidence from device'}
                </span>
                <span className="text-[11px] text-neutral-500 mt-0.5">PNG, JPG, WEBP supported</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Sample Presets */}
              <div className="flex sm:flex-col gap-1.5 justify-center">
                {SAMPLE_PRESET_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setImageUrl(preset.url);
                      setSelectedFileName(preset.name);
                    }}
                    className={`text-[11px] px-3 py-1.5 rounded-xl border text-left truncate transition-colors cursor-pointer font-sans-ui ${
                      imageUrl === preset.url
                        ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300'
                        : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                    }`}
                  >
                    + {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {imageUrl && (
              <div className="mt-3 relative rounded-2xl overflow-hidden border border-white/15 h-36 max-w-sm">
                <img src={imageUrl} alt="Evidence preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setImageUrl('');
                    setSelectedFileName('');
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-red-500 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* 6. Citizen Info & Urgency */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                Your Full Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Maya Shrestha"
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/15 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="e.g. 9841000000"
                value={citizenPhone}
                onChange={(e) => setCitizenPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/15 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-neutral-400 font-mono">
              ✓ Encrypted public grievance audit log
            </span>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto rounded-full px-8 py-3.5 text-sm font-medium text-black bg-white hover:bg-neutral-200 transition-all cursor-pointer disabled:opacity-50 active:scale-95 shadow-xl flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Generating Report ID...</span>
              ) : (
                <>
                  <span>Submit Complaint</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Bottom Next Page Navigation Bar */}
      <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans-ui">
        <div className="flex items-center gap-2 text-neutral-400 font-mono">
          <Compass size={14} className="text-cyan-300" />
          <span className="text-cyan-300 font-bold uppercase">Next Page:</span>
          <span>Explore other sections</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-center">
          <button
            onClick={() => onNavigateTab('home')}
            className="px-4 py-2 rounded-full bg-white/[0.04] hover:bg-white/15 border border-white/15 hover:border-white/30 text-neutral-200 hover:text-white transition-colors cursor-pointer font-medium"
          >
            ← Home
          </button>
          <button
            onClick={() => onNavigateTab('my-reports')}
            className="px-4 py-2 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 hover:text-cyan-200 transition-colors cursor-pointer font-medium flex items-center gap-1.5"
          >
            <Layers size={13} />
            <span>My Reports</span>
          </button>
          <button
            onClick={() => onNavigateTab('contact')}
            className="px-4 py-2 rounded-full bg-white/[0.04] hover:bg-white/15 border border-white/15 hover:border-white/30 text-neutral-200 hover:text-white transition-colors cursor-pointer font-medium flex items-center gap-1"
          >
            <span>Contact Us</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </motion.section>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Upload, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Image as ImageIcon,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles
} from 'lucide-react';
import { IssueCategory, ComplaintReport } from '../types';
import { createNewReport } from '../utils/reportsStorage';

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReportSubmitted: (newReport: ComplaintReport) => void;
}

const CATEGORIES: { id: IssueCategory; label: string; icon: string }[] = [
  { id: 'Roads & Potholes', label: 'Roads & Potholes', icon: '🛣️' },
  { id: 'Electric Wires', label: 'Electric Wires', icon: '⚡' },
  { id: 'Garbage & Waste', label: 'Garbage & Waste', icon: '🗑️' },
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

export const ReportIssueModal: React.FC<ReportIssueModalProps> = ({
  isOpen,
  onClose,
  onReportSubmitted,
}) => {
  const [category, setCategory] = useState<IssueCategory>('Roads & Potholes');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [ward, setWard] = useState('Ward 4');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Emergency'>('Medium');
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [citizenEmail, setCitizenEmail] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  
  // Submission success state
  const [submittedReport, setSubmittedReport] = useState<ComplaintReport | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

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
      setErrorMsg('Please specify the exact location.');
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

  const handleResetAndClose = () => {
    setSubmittedReport(null);
    setTitle('');
    setDescription('');
    setLocation('');
    setImageUrl('');
    setSelectedFileName('');
    onClose();
  };

  const handleViewInMyReports = () => {
    if (submittedReport) {
      onReportSubmitted(submittedReport);
    }
    handleResetAndClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-2xl rounded-3xl bg-neutral-950 border border-white/15 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col text-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-neutral-900/60">
            <div className="flex items-center gap-2.5">
              <span className="font-sans-ui text-xl font-bold tracking-tight text-white">SewaSathi</span>
              <span className="text-cyan-400 text-xs">✦</span>
              <span className="text-xs text-neutral-400 px-2.5 py-0.5 rounded-full border border-white/10 bg-white/5 font-mono">
                Citizen Grievance Portal
              </span>
            </div>
            <button
              onClick={handleResetAndClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {submittedReport ? (
              /* Success Confirmation Screen */
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-6 text-center space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 size={36} />
                </div>

                <div>
                  <h3 className="font-sans-ui text-2xl font-bold tracking-tight text-white mb-2">
                    Your complaint has been submitted successfully.
                  </h3>
                  <p className="text-neutral-300 text-sm max-w-md mx-auto">
                    Your issue has been logged into the municipal grid and sent to the intake verification officer.
                  </p>
                </div>

                {/* Unique Generated Report ID Card */}
                <div className="p-6 rounded-2xl bg-white/[0.03] border border-cyan-400/30 max-w-md mx-auto text-left space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-400 uppercase tracking-wider font-mono">Unique Report ID</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold">
                      {submittedReport.id}
                    </span>
                  </div>
                  <div className="text-base font-sans-ui font-semibold text-white">
                    {submittedReport.title}
                  </div>
                  <div className="text-xs text-neutral-400 flex items-center justify-between pt-2 border-t border-white/5">
                    <span>Category: {submittedReport.category}</span>
                    <span>Status: Reported ✓</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleViewInMyReports}
                    className="w-full sm:w-auto rounded-full px-7 py-3 text-sm font-medium text-black bg-cyan-300 hover:bg-cyan-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <span>Track in My Reports</span>
                    <ArrowRight size={16} />
                  </button>
                  <button
                    onClick={() => setSubmittedReport(null)}
                    className="w-full sm:w-auto rounded-full px-6 py-3 text-sm text-neutral-300 hover:text-white border border-white/20 hover:border-white/40 transition-all cursor-pointer"
                  >
                    Submit Another Report
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Report Input Form */
              <form onSubmit={handleSubmit} className="space-y-5 text-left">
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-400/30 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle size={15} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* 1. Category Selection */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-2 font-medium">
                    1. Select Issue Category *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {CATEGORIES.map((cat) => {
                      const isSelected = category === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.id)}
                          className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all text-xs font-sans-ui cursor-pointer ${
                            isSelected
                              ? 'bg-cyan-500/15 border-cyan-400/60 text-white shadow-sm'
                              : 'bg-white/[0.02] border-white/10 text-neutral-300 hover:border-white/25 hover:text-white'
                          }`}
                        >
                          <span className="text-base">{cat.icon}</span>
                          <span className="font-medium">{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Issue Title */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">
                    2. Complaint Title / Summary *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Deep pothole causing hazard near crossroad"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/15 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>

                {/* 3. Detailed Description */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">
                    3. Detailed Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Explain what is broken, when it started, safety risks, and any instructions for the repair team..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/15 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                  />
                </div>

                {/* 4. Location & Ward */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">
                      4. Location / Street Landmark *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="e.g. Baluwatar Junction, near Nepal Bank"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/15 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                      <MapPin size={16} className="absolute left-3 top-3 text-cyan-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">
                      Ward Number
                    </label>
                    <select
                      value={ward}
                      onChange={(e) => setWard(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-sm text-white focus:outline-none focus:border-cyan-400"
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
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">
                    5. Photo / Evidence (Optional)
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <label className="flex-1 flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-white/20 hover:border-cyan-400/50 bg-white/[0.01] hover:bg-white/[0.03] transition-colors cursor-pointer text-center">
                      <Upload size={20} className="text-neutral-400 mb-1" />
                      <span className="text-xs text-neutral-300">
                        {selectedFileName ? selectedFileName : 'Click or drop photo here to upload'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    {/* Quick sample photo selector */}
                    <div className="flex sm:flex-col gap-1.5 justify-center">
                      {SAMPLE_PRESET_IMAGES.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setImageUrl(preset.url);
                            setSelectedFileName(preset.name);
                          }}
                          className={`text-[11px] px-2.5 py-1 rounded-lg border text-left truncate transition-colors cursor-pointer ${
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
                    <div className="mt-2.5 relative rounded-xl overflow-hidden border border-white/15 h-28 max-w-xs">
                      <img src={imageUrl} alt="Evidence preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setImageUrl('');
                          setSelectedFileName('');
                        }}
                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/70 text-white hover:bg-red-500/80 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* 6. Citizen Contact (Optional) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Your Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Aarav Sharma"
                      value={citizenName}
                      onChange={(e) => setCitizenName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="e.g. 9841234567"
                      value={citizenPhone}
                      onChange={(e) => setCitizenPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Urgency Priority</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Emergency">Emergency</option>
                    </select>
                  </div>
                </div>

                {/* Submit Action Button */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-neutral-400 font-mono">
                    Official SewaSathi Civic Resolution Pipeline
                  </span>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-full px-7 py-3 text-sm font-medium text-black bg-white hover:bg-neutral-200 transition-all duration-200 cursor-pointer disabled:opacity-50 active:scale-[0.98] shadow-md flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Generating Report ID...</span>
                    ) : (
                      <>
                        <span>Submit Complaint</span>
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

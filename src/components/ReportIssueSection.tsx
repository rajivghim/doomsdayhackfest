import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Camera, 
  Phone,
  X
} from 'lucide-react';
import { IssueCategory, ComplaintReport } from '../types';
import { 
  createNewReport, 
  CATEGORY_DEMO_IMAGES,
  DEMO_PRESET_IMAGES,
  getRandomCategoryDemoImage
} from '../utils/reportsStorage';
import { OpenSourceLocationPicker, SelectedLocationData } from './OpenSourceLocationPicker';

interface ReportIssueSectionProps {
  onReportSubmitted: (newReport: ComplaintReport) => void;
  onScrollToReports?: () => void;
}

const CATEGORIES: { id: IssueCategory; label: string; icon: string; desc: string }[] = [
  { 
    id: 'Roads & Potholes', 
    label: 'Roads & Potholes', 
    icon: '🛣️',
    desc: 'Damaged asphalt, craters, sinkholes & road breakage' 
  },
  { 
    id: 'Electric Wires', 
    label: 'Electric Wires', 
    icon: '⚡',
    desc: 'Low-hanging cables, broken utility poles & sparking wires' 
  },
  { 
    id: 'Garbage & Waste', 
    label: 'Garbage & Waste', 
    icon: '🗑️',
    desc: 'Uncollected trash piles, street littering & overflowing bins' 
  },
  { 
    id: 'Tax Bill Complaint', 
    label: 'No Bill Given', 
    icon: '🧾',
    desc: 'Shop/vendor refused to issue VAT/PAN fiscal bill (Bill Jitnuhos)' 
  },
];

export const ReportIssueSection: React.FC<ReportIssueSectionProps> = ({
  onReportSubmitted,
  onScrollToReports,
}) => {
  const [category, setCategory] = useState<IssueCategory>('Roads & Potholes');
  const [issueDescription, setIssueDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | undefined>(undefined);
  const [ward, setWard] = useState('Ward 4');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');

  // Tax bill specific fields
  const [vendorName, setVendorName] = useState('');
  const [vendorPAN, setVendorPAN] = useState('');
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [billDemanded, setBillDemanded] = useState(true);
  
  // Submission state
  const [submittedReport, setSubmittedReport] = useState<ComplaintReport | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLocationPicked = (locData: SelectedLocationData) => {
    setLocationName(locData.address);
    setCoordinates(locData.coordinates);
    if (locData.ward) {
      setWard(locData.ward);
    }
  };

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
    if (category === 'Tax Bill Complaint' && !vendorName.trim()) {
      setErrorMsg('Please enter the vendor / shop name.');
      return;
    }
    if (!issueDescription.trim()) {
      setErrorMsg('Please describe what is broken or what tax violation occurred.');
      return;
    }
    if (!locationName.trim()) {
      setErrorMsg('Please select or verify the location on the map.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    setTimeout(() => {
      const isTaxComplaint = category === 'Tax Bill Complaint';
      const parsedAmount = purchaseAmount ? parseFloat(purchaseAmount) : undefined;

      const created = createNewReport({
        title: isTaxComplaint && vendorName ? `No Tax Bill Issued by ${vendorName}` : undefined,
        category,
        description: issueDescription.trim(),
        location: locationName.trim(),
        ward: ward.trim(),
        coordinates: coordinates,
        citizenName: 'Citizen',
        citizenPhone: citizenPhone.trim(),
        imageUrl: imageUrl || getRandomCategoryDemoImage(category),
        vendorName: isTaxComplaint ? vendorName.trim() : undefined,
        vendorPAN: isTaxComplaint ? vendorPAN.trim() : undefined,
        purchaseAmount: isTaxComplaint && parsedAmount && !isNaN(parsedAmount) ? parsedAmount : undefined,
        purchaseDate: isTaxComplaint ? purchaseDate : undefined,
        billDemanded: isTaxComplaint ? billDemanded : undefined,
        rewardStatus: isTaxComplaint ? 'Pending Review' : 'Not Applicable',
      });

      setIsSubmitting(false);
      setSubmittedReport(created);
      onReportSubmitted(created);
    }, 350);
  };

  return (
    <section
      id="report-issue-section"
      className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-16 text-neutral-900 bg-white select-none border-t border-neutral-200"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="font-mono text-xs text-red-900 font-semibold uppercase tracking-widest bg-red-50 px-3.5 py-1 rounded-full border border-red-200 shadow-xs flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-700 animate-pulse" />
            DIRECT CITIZEN COMPLAINT LODGING
          </span>
        </div>
        <h2 className="font-sans-ui text-3xl sm:text-4xl text-neutral-900 font-bold tracking-tight mb-2">
          Report a Problem in Your Area
        </h2>
        <p className="font-sans-ui text-neutral-600 text-xs sm:text-sm max-w-lg mx-auto">
          Choose between Roads & Potholes, Electric Wires, or Garbage & Waste to report issues directly to the concerned municipal department.
        </p>
      </div>

      {submittedReport ? (
        /* Submission Success Notification */
        <div className="p-8 sm:p-10 rounded-3xl bg-neutral-50 border border-emerald-300 text-center space-y-5 shadow-lg max-w-2xl mx-auto">
          <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle2 size={32} />
          </div>

          <div>
            <h3 className="font-sans-ui text-2xl text-neutral-900 font-bold tracking-tight mb-1.5">
              Complaint Registered Successfully!
            </h3>
            <p className="text-neutral-600 text-xs sm:text-sm max-w-md mx-auto">
              Your grievance has been assigned tracking token{' '}
              <strong className="text-red-800 font-mono">
                {submittedReport.id}
              </strong>.
            </p>
          </div>

          {/* Details Card */}
          <div className="p-4 rounded-2xl bg-white border border-neutral-200 text-left space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-mono">
                Tracking Token: <strong className="text-neutral-900">{submittedReport.id}</strong>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white font-mono text-xs font-bold">
                {submittedReport.priority} Priority
              </span>
            </div>

            <div className="text-sm font-sans-ui font-bold text-neutral-900">
              {submittedReport.title}
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-neutral-600 pt-2 border-t border-neutral-100">
              <span className="text-red-900 font-semibold">👥 {submittedReport.reportCount} citizens reported</span>
              <span>•</span>
              <span className="text-amber-800 font-semibold">🔥 {submittedReport.upvotes} community upvotes</span>
            </div>

            <div className="text-xs text-neutral-600 flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-1 font-mono">
              <span className="truncate">📍 {submittedReport.location}</span>
              <span className="text-emerald-700 font-medium shrink-0">Status: {submittedReport.status} ✓</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {onScrollToReports && (
              <button
                type="button"
                onClick={onScrollToReports}
                className="w-full sm:w-auto rounded-full px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-red-700 hover:bg-red-800 border border-red-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-red-900/15 active:scale-95"
              >
                <span>View in My Reports</span>
                <ArrowRight size={15} />
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setSubmittedReport(null);
                setIssueDescription('');
                setLocationName('');
                setCoordinates(undefined);
                setImageUrl('');
                setSelectedFileName('');
                setCitizenPhone('');
              }}
              className="w-full sm:w-auto rounded-full px-5 py-3 text-xs sm:text-sm text-neutral-700 hover:text-neutral-900 bg-white border border-neutral-300 hover:border-neutral-400 transition-all cursor-pointer shadow-xs"
            >
              Report Another Problem
            </button>
          </div>
        </div>
      ) : (
        /* Fast Form with OpenStreetMap */
        <form onSubmit={handleSubmit} className="space-y-6 p-6 sm:p-8 rounded-3xl bg-neutral-50 border border-neutral-200 text-left shadow-md">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Category Selector */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-2 font-semibold">
              1. Select Problem Category *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex flex-col p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-red-50 border-red-700 ring-2 ring-red-700/80 text-neutral-900 font-bold shadow-xs'
                        : 'bg-white border-neutral-200 text-neutral-700 hover:border-red-300 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl shrink-0">{cat.icon}</span>
                      <span className="text-sm font-bold text-neutral-900">{cat.label}</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 font-normal leading-snug">
                      {cat.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conditional Fields for Tax Bill Complaint (Bill Jitnuhos Scheme) */}
          {category === 'Tax Bill Complaint' && (
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-red-200 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-red-900">
                  <span>🧾</span>
                  <span>Vendor & Invoice Refusal Information (IRD Compliance Scheme)</span>
                </div>
                <span className="text-[10px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded-md bg-red-100 text-red-800 border border-red-300">
                  Bill Jitnuhos Scheme
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-700 mb-1 font-semibold">
                    Vendor / Shop Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. New Road Electronics / Bhatbhateni Outlet"
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-red-700 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-700 mb-1 font-semibold">
                    Vendor PAN / VAT (Optional if known)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 601239845"
                    value={vendorPAN}
                    onChange={(e) => setVendorPAN(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-red-700 shadow-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-700 mb-1 font-semibold">
                    Purchase Amount (NPR)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 2500"
                    value={purchaseAmount}
                    onChange={(e) => setPurchaseAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-red-700 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-700 mb-1 font-semibold">
                    Date of Purchase
                  </label>
                  <input
                    type="date"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-red-700 shadow-xs"
                  />
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2.5 text-xs text-neutral-800 cursor-pointer select-none font-medium">
                  <input
                    type="checkbox"
                    checked={billDemanded}
                    onChange={(e) => setBillDemanded(e.target.checked)}
                    className="w-4 h-4 rounded-md border-neutral-300 text-red-700 focus:ring-0 cursor-pointer"
                  />
                  <span>Citizen specifically requested an official VAT/PAN tax bill and was refused</span>
                </label>
              </div>
            </div>
          )}

          {/* 2. Issue Description */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1.5 font-semibold">
              2. Describe the Problem {category === 'Tax Bill Complaint' ? '/ Violation' : ''} *
            </label>
            <textarea
              required
              rows={3}
              placeholder={
                category === 'Tax Bill Complaint'
                  ? 'Describe the transaction, items purchased, what the cashier said when refusing the bill, and whether they issued a non-tax estimate slip instead...'
                  : `Describe the ${category.toLowerCase()} issue... (e.g. Deep pothole causing bike skidding, or sparking hanging wire near pole #14)`
              }
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white border border-neutral-300 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700 transition-colors resize-none shadow-xs"
            />
          </div>

          {/* 3. Open Source Map & Geolocation */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 font-semibold">
                3. Pin Location (OpenStreetMap) *
              </label>
              <span className="text-[11px] font-mono text-red-800 font-medium">
                GPS Geolocation Supported
              </span>
            </div>

            <OpenSourceLocationPicker
              initialLocationName={locationName}
              initialCoordinates={coordinates}
              onLocationSelect={handleLocationPicked}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  required
                  placeholder="Street / Landmark address"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-red-700 shadow-xs"
                />
              </div>
              <div>
                <select
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-red-700 shadow-xs"
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
          </div>

          {/* 4. Photo & Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-200">
            {/* Photo Upload & Online Demo Image Selection */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1.5 font-semibold">
                Photo Evidence (Auto-Assigned Online Demo If Empty)
              </label>
              
              <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-neutral-300 hover:border-red-500 bg-white hover:bg-red-50/20 transition-colors cursor-pointer text-xs text-neutral-600">
                <Camera size={15} className="text-neutral-500" />
                <span className="truncate">
                  {selectedFileName ? selectedFileName : 'Upload Real Photo / Camera'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Online Demo Photo Presets */}
              <div className="mt-3">
                <span className="text-[11px] font-medium text-neutral-600 block mb-1.5">
                  Or select a demo photo for civic proof:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {DEMO_PRESET_IMAGES.map((preset) => {
                    const isSelected = imageUrl === preset.url;
                    return (
                      <button
                        key={preset.category}
                        type="button"
                        onClick={() => {
                          setImageUrl(preset.url);
                          setSelectedFileName(preset.tag);
                          setCategory(preset.category);
                        }}
                        className={`group relative flex flex-col p-1.5 rounded-xl border text-left cursor-pointer transition-all bg-white ${
                          isSelected 
                            ? 'ring-2 ring-red-700 border-red-700 shadow-xs' 
                            : 'border-neutral-200 hover:border-neutral-300 hover:shadow-xs'
                        }`}
                      >
                        <div className="relative w-full h-20 sm:h-22 rounded-xl overflow-hidden bg-neutral-100 mb-1.5 shadow-2xs">
                          <img 
                            src={preset.url} 
                            alt={preset.label} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105" 
                          />
                          {isSelected && (
                            <div className="absolute inset-0 bg-red-900/40 flex items-center justify-center text-white text-sm font-bold">
                              ✓
                            </div>
                          )}
                        </div>
                        <span className="text-[11px] font-semibold text-neutral-800 truncate leading-tight">
                          {preset.tag}
                        </span>
                        <span className="text-[10px] text-neutral-500 truncate">
                          {preset.category}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {imageUrl && (
                <div className="mt-3 relative rounded-2xl overflow-hidden border border-neutral-300 h-44 sm:h-52 bg-neutral-900/10 shadow-inner">
                  <img 
                    src={imageUrl} 
                    alt="Evidence preview" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain sm:object-cover bg-neutral-950/5" 
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-2.5 text-white text-[11px] font-mono flex items-center justify-between">
                    <span className="truncate">✓ Evidence Photo Attached: {selectedFileName || 'Civic Proof'}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl('');
                        setSelectedFileName('');
                      }}
                      className="p-1.5 rounded-full bg-red-600/90 text-white hover:bg-red-700 transition-colors cursor-pointer shrink-0 ml-2"
                      title="Remove image"
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Optional Phone for SMS Updates */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1.5 font-semibold">
                Phone Number (Optional for SMS Updates)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="e.g. 9841000000"
                  value={citizenPhone}
                  onChange={(e) => setCitizenPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-red-700 shadow-xs"
                />
                <Phone size={14} className="absolute left-3 top-3 text-neutral-400" />
              </div>
              <p className="text-[11px] text-neutral-500 mt-1.5 leading-relaxed">
                Receive live SMS notifications when ward technicians inspect the site and complete repairs.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-[11px] text-neutral-500 font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Priority Algorithm & Duplicate Clustering Active</span>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto rounded-full px-8 py-3.5 text-xs sm:text-sm font-semibold text-white bg-red-700 hover:bg-red-800 border border-red-700 hover:border-red-800 transition-all cursor-pointer disabled:opacity-50 active:scale-95 shadow-md shadow-red-900/15 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Registering Complaint...</span>
              ) : (
                <>
                  <span>File New Complaint</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </section>
  );
};

import React from 'react';
import { 
  Phone, 
  Mail, 
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  return (
    <section
      id="contact-section"
      className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-8 md:px-12 py-16 text-neutral-900 bg-white select-none border-t border-neutral-200"
    >
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="font-mono text-xs text-red-900 font-semibold uppercase tracking-widest bg-red-50 px-3.5 py-1 rounded-full border border-red-200 shadow-xs">
            DIRECT CITIZEN ASSISTANCE DIRECTORY
          </span>
        </div>
        <h2 className="font-sans-ui text-3xl sm:text-4xl text-neutral-900 font-bold tracking-tight mb-3">
          Official Helplines & Contacts
        </h2>
        <p className="font-sans-ui text-neutral-600 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          Direct telephone lines, emergency dispatch units, and department contacts for prompt assistance.
        </p>
      </div>

      {/* 1. Emergency Helplines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {/* Toll-Free 24/7 */}
        <div className="p-5 rounded-2xl bg-red-50/80 border border-red-200 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold uppercase text-red-900 bg-red-100/80 px-2 py-0.5 rounded">
                24/7 TOLL-FREE
              </span>
              <Phone size={18} className="text-red-700" />
            </div>
            <div className="text-2xl font-mono font-bold text-neutral-900 tracking-tight">
              1100
            </div>
            <p className="text-xs text-neutral-700 font-medium mt-1">
              National Civic Grievance Hotline
            </p>
          </div>
          <div className="text-[11px] text-neutral-500 font-mono mt-3 pt-2 border-t border-red-200/60">
            Free from NTC, Ncell & SmartCell
          </div>
        </div>

        {/* Emergency Hazard Dispatch */}
        <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold uppercase text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded">
                RAPID DISPATCH
              </span>
              <AlertTriangle size={18} className="text-amber-700" />
            </div>
            <div className="text-2xl font-mono font-bold text-neutral-900 tracking-tight">
              01-4412345
            </div>
            <p className="text-xs text-neutral-700 font-medium mt-1">
              Hazard Response (Potholes, Landslides, Floods)
            </p>
          </div>
          <div className="text-[11px] text-neutral-500 font-mono mt-3 pt-2 border-t border-amber-200/60">
            Available 24 Hours Daily
          </div>
        </div>
      </div>

      {/* 2. Departmental Contacts */}
      <div>
        <h3 className="font-sans-ui text-lg text-neutral-900 font-bold tracking-tight mb-4 flex items-center gap-2">
          <ShieldCheck size={18} className="text-red-700" />
          <span>Department Direct Lines</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Dept 1 */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-900">Department of Roads & Infrastructure</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-neutral-200 text-neutral-600">Ext. 201</span>
            </div>
            <div className="text-xs text-neutral-600 space-y-1 font-mono">
              <div className="flex items-center gap-2 text-neutral-900 font-semibold">
                <Phone size={13} className="text-red-700" />
                <span>01-4261188 / 01-4261189</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-600">
                <Mail size={13} className="text-neutral-400" />
                <span>roads.complaints@sewasathi.gov.np</span>
              </div>
            </div>
          </div>

          {/* Dept 2 */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-900">Water Supply & Sewerage Management</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-neutral-200 text-neutral-600">Ext. 305</span>
            </div>
            <div className="text-xs text-neutral-600 space-y-1 font-mono">
              <div className="flex items-center gap-2 text-neutral-900 font-semibold">
                <Phone size={13} className="text-red-700" />
                <span>01-4411122 / 9801234567</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-600">
                <Mail size={13} className="text-neutral-400" />
                <span>water.board@sewasathi.gov.np</span>
              </div>
            </div>
          </div>

          {/* Dept 3 */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-900">Solid Waste & Urban Sanitation</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-neutral-200 text-neutral-600">Ext. 118</span>
            </div>
            <div className="text-xs text-neutral-600 space-y-1 font-mono">
              <div className="flex items-center gap-2 text-neutral-900 font-semibold">
                <Phone size={13} className="text-red-700" />
                <span>01-4245600 / 01-4245601</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-600">
                <Mail size={13} className="text-neutral-400" />
                <span>sanitation@sewasathi.gov.np</span>
              </div>
            </div>
          </div>

          {/* Dept 4 */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-900">Electrical & Streetlight Maintenance</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-neutral-200 text-neutral-600">Ext. 402</span>
            </div>
            <div className="text-xs text-neutral-600 space-y-1 font-mono">
              <div className="flex items-center gap-2 text-neutral-900 font-semibold">
                <Phone size={13} className="text-red-700" />
                <span>01-4155990 / 01-4155991</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-600">
                <Mail size={13} className="text-neutral-400" />
                <span>streetlights@sewasathi.gov.np</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

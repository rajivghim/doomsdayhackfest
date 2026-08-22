import React, { useState } from 'react';
import { ArrowUp, ShieldCheck } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ReportIssueSection } from './components/ReportIssueSection';
import { MyReportsSection } from './components/MyReportsSection';
import { ContactSection } from './components/ContactSection';
import { ReportDetailsModal } from './components/ReportDetailsModal';
import { AuthorityLoginModal } from './components/AuthorityLoginModal';
import { AuthorityDashboard } from './components/AuthorityDashboard';
import { SewaSathiLogo } from './components/SewaSathiLogo';
import { ComplaintReport } from './types';
import { getStoredReports } from './utils/reportsStorage';

export const App: React.FC = () => {
  const [authLoginModalOpen, setAuthLoginModalOpen] = useState(false);
  const [selectedReportForDetail, setSelectedReportForDetail] = useState<ComplaintReport | null>(null);
  const [showAuthorityDashboard, setShowAuthorityDashboard] = useState(false);
  
  // Authority auth state
  const [authorityUser, setAuthorityUser] = useState<{ name: string; role: string } | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const scrollToSection = (sectionId: string) => {
    if (showAuthorityDashboard) {
      setShowAuthorityDashboard(false);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleReportSubmitted = (newReport: ComplaintReport) => {
    setRefreshTrigger((prev) => prev + 1);
    setSelectedReportForDetail(newReport);
  };

  const handleSelectReport = (report: ComplaintReport) => {
    setSelectedReportForDetail(report);
  };

  const handleTrackSampleReport = (reportId: string) => {
    const all = getStoredReports();
    const found = all.find((r) => r.id === reportId);
    if (found) {
      setSelectedReportForDetail(found);
    } else {
      scrollToSection('my-reports-section');
    }
  };

  const handleAuthorityButtonClick = () => {
    if (authorityUser) {
      setShowAuthorityDashboard(true);
    } else {
      setAuthLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = (name: string, role: string) => {
    setAuthorityUser({ name, role });
    setShowAuthorityDashboard(true);
  };

  const handleLogoutAuthority = () => {
    setAuthorityUser(null);
    setShowAuthorityDashboard(false);
  };

  return (
    <div className="relative min-h-screen w-full bg-white text-neutral-900 flex flex-col justify-between overflow-x-hidden selection:bg-cyan-500/20 selection:text-cyan-900 scroll-smooth">
      {/* Sticky Top Navigation Bar */}
      <Navbar
        onScrollToSection={scrollToSection}
        onOpenAuthorityLogin={handleAuthorityButtonClick}
        isAuthorityLoggedIn={!!authorityUser}
        onLogoutAuthority={handleLogoutAuthority}
        isDashboardActive={showAuthorityDashboard}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-start w-full">
        {showAuthorityDashboard && authorityUser ? (
          /* Authority Management Dashboard View */
          <div className="w-full">
            <AuthorityDashboard
              authorityName={authorityUser.name}
              authorityRole={authorityUser.role}
              onLogout={handleLogoutAuthority}
              onViewCitizenView={() => setShowAuthorityDashboard(false)}
              onReportsUpdated={() => setRefreshTrigger((prev) => prev + 1)}
            />
          </div>
        ) : (
          /* Single Seamless Scrollable Page with all 3 Points */
          <div className="w-full flex flex-col items-center">
            {/* 1. Hero Showcase Section */}
            <Hero
              onReportIssue={() => scrollToSection('report-issue-section')}
              onViewMyReports={() => scrollToSection('my-reports-section')}
              onTrackSampleReport={handleTrackSampleReport}
            />

            {/* 2. Scroll Down -> Point 1: Report Issue Form Section */}
            <ReportIssueSection
              onReportSubmitted={handleReportSubmitted}
              onScrollToReports={() => scrollToSection('my-reports-section')}
            />

            {/* 3. Scroll Down -> Point 2: My Reports Grid & Audit Board Section */}
            <MyReportsSection
              onReportNew={() => scrollToSection('report-issue-section')}
              onSelectReport={handleSelectReport}
              refreshTrigger={refreshTrigger}
            />

            {/* 4. Scroll Down -> Point 3: Contact Authorities & Helplines Section */}
            <ContactSection />
          </div>
        )}
      </main>

      {/* Clean, Executive Footer */}
      <footer className="relative z-20 w-full bg-neutral-50/90 border-t border-neutral-200/90 text-neutral-600">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-neutral-200/70">
            {/* Left: Brand info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3.5">
              <SewaSathiLogo size="md" />
              <div className="sm:border-l sm:border-neutral-300 sm:pl-3.5 sm:my-auto">
                <span className="text-xs font-semibold text-neutral-800 block">
                  Citizen Grievance & Public Redressal Platform
                </span>
                <span className="text-[11px] text-neutral-500 font-normal">
                  Ward-level municipal accountability across Nepal
                </span>
              </div>
            </div>

            {/* Right: Clean Navigation Links & Back to Top */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs">
              <button
                type="button"
                onClick={() => scrollToSection('report-issue-section')}
                className="px-3 py-1.5 rounded-lg bg-white border border-neutral-200 hover:border-neutral-300 text-neutral-700 hover:text-red-900 transition-colors font-medium whitespace-nowrap cursor-pointer shadow-2xs"
              >
                Report Issue
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('my-reports-section')}
                className="px-3 py-1.5 rounded-lg bg-white border border-neutral-200 hover:border-neutral-300 text-neutral-700 hover:text-red-900 transition-colors font-medium whitespace-nowrap cursor-pointer shadow-2xs"
              >
                My Reports
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('contact-section')}
                className="px-3 py-1.5 rounded-lg bg-white border border-neutral-200 hover:border-neutral-300 text-neutral-700 hover:text-red-900 transition-colors font-medium whitespace-nowrap cursor-pointer shadow-2xs"
              >
                Helplines & Contacts
              </button>

              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100/80 border border-red-200 text-red-800 font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer shadow-2xs"
              >
                <span>Back to Top</span>
                <ArrowUp size={13} className="text-red-700" />
              </button>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-500 font-mono text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              <span>SewaSathi Civic Infrastructure Active • Toll-Free Hotline 1100</span>
            </div>
            <div>
              © 2026 SewaSathi Portal. Public Service Redressal for Nepal.
            </div>
          </div>
        </div>
      </footer>

      {/* Report Detail / Progress Tracker Modal */}
      <ReportDetailsModal
        report={selectedReportForDetail}
        onClose={() => setSelectedReportForDetail(null)}
        onReportUpdated={(updated) => {
          setSelectedReportForDetail(updated);
          setRefreshTrigger((prev) => prev + 1);
        }}
      />

      {/* Authority Login Modal */}
      <AuthorityLoginModal
        isOpen={authLoginModalOpen}
        onClose={() => setAuthLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default App;

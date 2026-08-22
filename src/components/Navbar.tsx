import React, { useState, useEffect } from 'react';
import { ShieldCheck, LogOut, Menu, X } from 'lucide-react';
import { SewaSathiLogo } from './SewaSathiLogo';

interface NavbarProps {
  onScrollToSection: (sectionId: string) => void;
  onOpenAuthorityLogin: () => void;
  isAuthorityLoggedIn: boolean;
  onLogoutAuthority: () => void;
  isDashboardActive?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onScrollToSection,
  onOpenAuthorityLogin,
  isAuthorityLoggedIn,
  onLogoutAuthority,
  isDashboardActive = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'home' | 'report-issue-section' | 'my-reports-section' | 'contact-section'>('home');

  useEffect(() => {
    if (isDashboardActive) return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      const reportSec = document.getElementById('report-issue-section');
      const myReportsSec = document.getElementById('my-reports-section');
      const contactSec = document.getElementById('contact-section');

      if (contactSec && scrollPos >= contactSec.offsetTop) {
        setActiveSection('contact-section');
      } else if (myReportsSec && scrollPos >= myReportsSec.offsetTop) {
        setActiveSection('my-reports-section');
      } else if (reportSec && scrollPos >= reportSec.offsetTop) {
        setActiveSection('report-issue-section');
      } else {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDashboardActive]);

  const navLinks = [
    { id: 'report-issue-section', label: 'REPORT ISSUE' },
    { id: 'my-reports-section', label: 'MY REPORTS' },
    { id: 'contact-section', label: 'CONTACT US' },
  ];

  const handleNavClick = (sectionId: string) => {
    onScrollToSection(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-8 md:px-12 py-3 select-none bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Scroll to Top */}
        <button
          id="nav-brand-logo"
          onClick={() => handleNavClick('home')}
          className="flex items-center group text-left cursor-pointer focus:outline-none"
        >
          <SewaSathiLogo size="md" />
        </button>

        {/* Center Nav Items: Smooth Scroll Anchors */}
        {!isDashboardActive && (
          <nav className="hidden md:flex items-center space-x-7 lg:space-x-9 text-[13.5px] font-sans-ui tracking-wide">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  className={`transition-colors duration-200 cursor-pointer focus:outline-none relative py-1 uppercase font-medium ${
                    isActive
                      ? 'text-neutral-900 font-bold'
                      : 'text-neutral-500 hover:text-red-800'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-red-700" />
                  )}
                </button>
              );
            })}
          </nav>
        )}

        {/* Right Side: Distinct Authority Button in a Box */}
        <div className="flex items-center gap-3">
          {isAuthorityLoggedIn ? (
            <div className="flex items-center gap-2">
              <button
                id="nav-authority-active-btn"
                onClick={onOpenAuthorityLogin}
                className={`px-3.5 py-2 rounded-lg border transition-all duration-200 cursor-pointer flex items-center gap-2 font-mono text-xs font-semibold ${
                  isDashboardActive
                    ? 'bg-cyan-600 text-white border-cyan-700 shadow-sm'
                    : 'bg-cyan-50 border-cyan-300 text-cyan-800 hover:bg-cyan-600 hover:text-white hover:border-cyan-600'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <ShieldCheck size={14} />
                <span>{isDashboardActive ? 'Authority Desk Active' : 'Authority Desk'}</span>
              </button>

              <button
                id="nav-logout-btn"
                onClick={onLogoutAuthority}
                title="Log Out Authority"
                className="p-2 text-neutral-500 hover:text-red-600 rounded-lg border border-neutral-200 hover:border-red-300 transition-colors cursor-pointer"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button
              id="nav-authority-login-btn"
              onClick={onOpenAuthorityLogin}
              className="group px-3.5 py-2 rounded-lg bg-neutral-50 hover:bg-neutral-100 border border-neutral-300 hover:border-neutral-400 text-neutral-900 transition-all duration-200 cursor-pointer flex items-center gap-2.5 font-mono text-xs font-semibold shadow-2xs active:scale-98"
            >
              <div className="w-5 h-5 rounded-md bg-neutral-200/80 flex items-center justify-center text-neutral-700 group-hover:bg-red-700 group-hover:text-white transition-colors">
                <ShieldCheck size={13} />
              </div>
              <span>Authority Login</span>
              <span className="text-neutral-400 group-hover:text-neutral-800 transition-colors">→</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Nav Links Strip */}
      {!isDashboardActive && (
        <div className="flex md:hidden items-center justify-center gap-4 pt-3 mt-2 border-t border-neutral-100 text-xs font-sans-ui overflow-x-auto">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`py-1 px-2.5 rounded-full uppercase tracking-wider font-medium whitespace-nowrap ${
                activeSection === link.id
                  ? 'text-neutral-900 bg-neutral-100 font-semibold'
                  : 'text-neutral-500'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

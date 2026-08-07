import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { ConnectionBanner } from './ConnectionBanner';
import { useLocation, Link } from 'react-router-dom';
import { Menu, X, Flame } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  // Determine Title based on current route
  const getPageTitle = (path: string) => {
    if (path.startsWith('/dashboard')) return 'Station Queue Dashboard';
    if (path === '/patients') return 'Patient Directory';
    if (path === '/patients/new') return 'New Patient Registration';
    if (path.startsWith('/patients/')) return 'Patient Profile & Medical History';
    if (path.startsWith('/encounters/new')) return 'New Station Check-in';
    if (path.startsWith('/vitals/new')) return 'Triage Vitals Entry';
    if (path.startsWith('/consultations/new')) return 'Doctor Consultation';
    if (path.startsWith('/consultations/')) return 'Consultation Record Detail';
    if (path.startsWith('/medications')) return 'Medication Stock Inventory';
    if (path.startsWith('/prescriptions')) return 'Pharmacy Prescriptions Queue';
    if (path.startsWith('/dispensing/new')) return 'Medication Dispensing Station';
    if (path.startsWith('/staff')) return 'Clinic Staff Management';
    if (path.startsWith('/settings')) return 'System Settings & Connectivity';
    if (path === '/help') return 'Help & Orientation Center';
    if (path.startsWith('/help/tutorials')) return 'Role-Based Staff Tutorials';
    if (path.startsWith('/help/docs')) return 'Module Reference Documentation';
    if (path.startsWith('/help/faq')) return 'Frequently Asked Questions';
    if (path.startsWith('/help/contact')) return 'On-site Contact & Support';
    return 'Missions Clinic System';
  };

  const title = getPageTitle(location.pathname);

  return (
    <div className="min-h-screen bg-[var(--cream)] flex flex-col text-[var(--ink)] font-sans antialiased">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block fixed top-0 left-0 bottom-0 z-30">
        <Sidebar />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-[270px] h-full bg-[#0B4530]">
            <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Wrap */}
      <div className="flex-1 flex flex-col lg:ml-[270px] min-w-0">
        {/* Top Header Strip */}
        <header className="sticky top-0 z-20 bg-[var(--cream)]/95 backdrop-blur-md border-b border-[var(--line)] px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[var(--emerald-900)] hover:bg-[var(--cream-deep)] lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center border border-[var(--line)]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div>
              <div className="flex items-center gap-2 lg:hidden mb-0.5">
                <Flame className="w-4 h-4 text-[var(--gold-600)]" />
                <span className="font-serif font-bold text-xs text-[var(--emerald-900)]">
                  Missions Clinic
                </span>
              </div>
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-[var(--emerald-900)] tracking-tight">
                {title}
              </h1>
            </div>
          </div>

          {user && (
            <div className="hidden sm:flex items-center gap-2 bg-[var(--cream-deep)] px-3 py-1.5 rounded-full border border-[var(--line)]">
              <span className="w-2 h-2 rounded-full bg-[var(--emerald-600)]"></span>
              <span className="text-xs font-bold text-[var(--emerald-900)]">{user.name}</span>
            </div>
          )}
        </header>

        {/* Non-blocking Connection Status Banner */}
        <ConnectionBanner />

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

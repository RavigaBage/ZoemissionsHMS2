import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  UserPlus,
  ClipboardList,
  Activity,
  Stethoscope,
  Pill,
  ShieldAlert,
  Settings,
  LogOut,
  Menu,
  X,
  PlusCircle,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isAuthenticated || !user) {
    return (
      <header className="sticky top-0 z-50 bg-[var(--cream)]/95 backdrop-blur-sm border-b border-[var(--line)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 font-serif font-semibold text-xl text-[var(--emerald-900)]">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--gold-600)] inline-block"></span>
              <span>Missions Clinic</span>
            </Link>
            <Link
              to="/login"
              className="bg-[var(--emerald-700)] text-[var(--cream)] hover:bg-[var(--emerald-900)] font-bold text-sm px-5 py-2.5 rounded-full transition-all duration-150 shadow-sm"
            >
              Log in
            </Link>
          </div>
        </div>
      </header>
    );
  }

  const roleLabels: Record<string, string> = {
    registration: 'Registration Clerk',
    triage: 'Triage Nurse',
    doctor: 'Medical Doctor',
    pharmacy: 'Pharmacy Tech',
    admin: 'Clinic Admin',
  };

  const navItems = [
    {
      label: 'Queue Dashboard',
      path: '/dashboard',
      roles: ['registration', 'triage', 'doctor', 'pharmacy', 'admin'],
      icon: ClipboardList,
    },
    {
      label: 'Patients',
      path: '/patients',
      roles: ['registration', 'triage', 'doctor', 'admin'],
      icon: Users,
    },
    {
      label: 'Register Patient',
      path: '/patients/new',
      roles: ['registration', 'admin'],
      icon: UserPlus,
    },
    {
      label: 'New Check-in',
      path: '/encounters/new',
      roles: ['registration', 'triage', 'admin'],
      icon: PlusCircle,
    },
    {
      label: 'Medications',
      path: '/medications',
      roles: ['pharmacy', 'admin'],
      icon: Pill,
    },
    {
      label: 'Prescriptions',
      path: '/prescriptions',
      roles: ['pharmacy', 'doctor', 'admin'],
      icon: Stethoscope,
    },
    {
      label: 'Staff',
      path: '/staff',
      roles: ['admin'],
      icon: ShieldAlert,
    },
    {
      label: 'Settings',
      path: '/settings',
      roles: ['registration', 'triage', 'doctor', 'pharmacy', 'admin'],
      icon: Settings,
    },
  ];

  const allowedNav = navItems.filter((item) => item.roles.includes(user.role));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-[var(--cream)]/95 backdrop-blur-md border-b border-[var(--line)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link to="/dashboard" className="flex items-center gap-2.5 font-serif font-semibold text-xl text-[var(--emerald-900)]">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--gold-600)] inline-block"></span>
            <span className="tracking-tight">Missions Clinic</span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {allowedNav.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full font-bold text-xs transition-colors ${
                    isActive
                      ? 'bg-[var(--emerald-700)] text-[var(--cream)]'
                      : 'text-[var(--ink-soft)] hover:bg-[var(--emerald-100)] hover:text-[var(--emerald-900)]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Logout */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[var(--cream-deep)] px-3 py-1.5 rounded-full border border-[var(--line)]">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span className="font-bold text-xs text-[var(--emerald-900)]">{user.name}</span>
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--emerald-100)] text-[var(--emerald-700)] font-extrabold">
                {roleLabels[user.role] || user.role}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-bold text-[var(--ink-soft)] hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-full border border-transparent hover:border-red-200 transition-all cursor-pointer min-h-[38px]"
              title="Log out of clinic system"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[var(--emerald-900)] hover:bg-[var(--cream-deep)] min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[var(--line)] bg-[var(--cream)] px-4 pt-3 pb-6 space-y-3">
          <div className="flex items-center justify-between p-3 bg-[var(--cream-deep)] rounded-xl border border-[var(--line)]">
            <div>
              <p className="font-bold text-sm text-[var(--emerald-900)]">{user.name}</p>
              <p className="text-xs text-[var(--emerald-700)] font-semibold">{roleLabels[user.role]}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full"
            >
              <LogOut className="w-3.5 h-3.5" />
              Log out
            </button>
          </div>

          <div className="grid grid-cols-1 gap-1">
            {allowedNav.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm min-h-[44px] ${
                    isActive
                      ? 'bg-[var(--emerald-700)] text-[var(--cream)]'
                      : 'text-[var(--ink)] hover:bg-[var(--emerald-100)]'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

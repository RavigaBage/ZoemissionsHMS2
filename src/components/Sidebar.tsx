import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ClipboardList,
  Users,
  Cross,
  UserPlus,
  PlusCircle,
  Activity,
  Stethoscope,
  Pill,
  FileText,
  HelpCircle,
  ShieldAlert,
  Settings,
  LogOut,
  Flame,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const roleLabels: Record<string, string> = {
    registration: 'Registration Clerk',
    triage: 'Triage Nurse',
    doctor: 'Medical Doctor',
    pharmacy: 'Pharmacy Tech',
    admin: 'Clinic Admin',
  };

  const navGroups = [
    {
      groupTitle: 'Core Queue',
      items: [
        {
          label: 'Station Dashboard',
          path: '/dashboard',
          roles: ['registration', 'triage', 'doctor', 'pharmacy', 'admin'],
          icon: ClipboardList,
        },
        {
          label: 'Queue List',
          path: '/queue',
          roles: ['registration', 'triage', 'doctor', 'pharmacy', 'admin'],
          icon: ClipboardList,
        },
      ],
    },
    {
      groupTitle: 'Patients & Care',
      items: [
        {
          label: 'Patient Records',
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
          label: 'Vitals List',
          path: '/vitals',
          roles: ['triage', 'doctor', 'admin'],
          icon: Activity,
        },
        {
          label: 'Record Vitals',
          path: '/vitals/new',
          roles: ['triage', 'doctor', 'admin'],
          icon: Activity,
        },
        {
          label: 'Consultations List',
          path: '/consultations',
          roles: ['doctor', 'admin'],
          icon: Stethoscope,
        },
        {
          label: 'New Consultation',
          path: '/consultations/new',
          roles: ['doctor', 'admin'],
          icon: Stethoscope,
        },
      ],
    },
    {
      groupTitle: 'Pharmacy',
      items: [
        {
          label: 'Medications Stock',
          path: '/medications',
          roles: ['pharmacy', 'doctor', 'admin'],
          icon: Pill,
        },
        {
          label: 'Pharmacy Queue',
          path: '/dispensing',
          roles: ['pharmacy', 'doctor', 'admin'],
          icon: FileText,
        },
        {
          label: 'Dispensing History',
          path: '/dispensing/history',
          roles: ['pharmacy', 'admin'],
          icon: FileText,
        },
      ],
    },
    {
      groupTitle: 'Support & Admin',
      items: [
        {
          label: 'Help & Training',
          path: '/help',
          roles: ['registration', 'triage', 'doctor', 'pharmacy', 'admin'],
          icon: HelpCircle,
        },
        {
          label: 'Staff Management',
          path: '/staff',
          roles: ['admin'],
          icon: ShieldAlert,
        },
        {
          label: 'System Settings',
          path: '/settings',
          roles: ['registration', 'triage', 'doctor', 'pharmacy', 'admin'],
          icon: Settings,
        },
      ],
    },
  ];

  // Section Scripture Resolver
  const getSectionScripture = (path: string) => {
    if (path.startsWith('/dashboard')) {
      return { verse: '"Let your light so shine before men."', ref: 'Matthew 5:16' };
    }
    if (path.startsWith('/patients') || path.startsWith('/encounters')) {
      return {
        verse: '"Inasmuch as ye have done it unto one of the least of these... ye have done it unto me."',
        ref: 'Matthew 25:40',
      };
    }
    if (path.startsWith('/vitals') || path.startsWith('/consultations')) {
      return {
        verse: '"Is any sick among you? ... the prayer of faith shall save the sick."',
        ref: 'James 5:14 to 15',
      };
    }
    if (path.startsWith('/medications') || path.startsWith('/prescriptions') || path.startsWith('/dispensing')) {
      return {
        verse: '"He healeth the broken in heart, and bindeth up their wounds."',
        ref: 'Psalm 147:3',
      };
    }
    if (path.startsWith('/staff') || path.startsWith('/settings')) {
      return { verse: '"Let us not be weary in well doing."', ref: 'Galatians 6:9' };
    }
    if (path.startsWith('/help')) {
      return {
        verse: '"Trust in the Lord with all thine heart, and lean not unto thine own understanding."',
        ref: 'Proverbs 3:5',
      };
    }
    return { verse: '"Be strong and of a good courage."', ref: 'Joshua 1:9' };
  };

  const currentScripture = getSectionScripture(location.pathname);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-[270px] bg-[#0B4530] text-[#FBF7EC] flex flex-col h-full border-r border-[#135C3D] select-none">
      {/* Top Brand Mark */}
      <div className="p-6 border-b border-[#135C3D]/80 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#C99A2E] flex items-center justify-center text-[#0B4530] shadow-sm shrink-0">
          <Cross className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-serif font-bold text-lg tracking-tight text-white leading-tight">
            Missions Clinic
          </h1>
          <p className="text-[11px] font-semibold text-[#F3DFA0] opacity-85 uppercase tracking-wider">
            Field Medical System
          </p>
        </div>
      </div>

      {/* Navigation Links Grouped */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-[#135C3D]">
        {navGroups.map((group, idx) => {
          const visibleItems = group.items.filter((item) =>
            item.roles.includes(user.role)
          );

          if (visibleItems.length === 0) return null;

          return (
            <div key={idx} className="space-y-1">
              <div className="px-3 pb-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[#F3DFA0]/70">
                {group.groupTitle}
              </div>
              {visibleItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== '/dashboard' &&
                    item.path !== '/help' &&
                    location.pathname.startsWith(item.path));

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onCloseMobile}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all min-h-[44px] ${
                      isActive
                        ? 'bg-[#135C3D] text-white  shadow-xs'
                        : 'text-[#FBF7EC]/80 hover:bg-[#135C3D]/60 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#F3DFA0]' : 'text-[#FBF7EC]/70'}`} />
                    <span className="flex-1">{item.label}</span>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#F3DFA0]" />}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Rotating Scripture Box */}
      <div className="px-4 py-3 mx-3 bg-[#083525] rounded-xl border border-[#135C3D] space-y-1 my-2">
        <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-[#C99A2E] uppercase tracking-wider">
          <BookOpen className="w-3 h-3" />
          <span>Scripture Promise</span>
        </div>
        <p className="font-serif italic text-xs text-[#FBF7EC]/90 leading-snug">
          {currentScripture.verse}
        </p>
        <p className="text-[10px] font-bold text-[#F3DFA0] text-right">
          {currentScripture.ref}
        </p>
      </div>

      {/* Bottom User Card & Logout */}
      <div className="p-4 border-t border-[#135C3D] bg-[#083525]/60 flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-bold text-xs text-white truncate">{user.name}</p>
          <span className="inline-block px-2 py-0.5 rounded-full bg-[#E4F1E9]/15 text-[#F3DFA0] font-extrabold text-[10px] uppercase tracking-wider mt-0.5">
            {roleLabels[user.role] || user.role}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="p-2.5 rounded-xl bg-[#135C3D]/80 hover:bg-red-900/80 text-[#FBF7EC] hover:text-white transition-all min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer shrink-0"
          title="Log out of clinic system"
          aria-label="Log out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};

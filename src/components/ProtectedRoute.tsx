import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-2xl border border-[var(--line)] text-center shadow-xs">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-50 text-[var(--gold-700)] border border-[var(--gold-200)] flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif text-[var(--emerald-900)] font-bold mb-2">Role Access Restricted</h2>
        <p className="text-[var(--ink-soft)] text-base mb-6 max-w-md mx-auto">
          Your current account role (<strong className="text-[var(--emerald-700)] capitalize">{user.role}</strong>) doesn't have access to this station screen.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 bg-[var(--emerald-700)] text-[var(--cream)] hover:bg-[var(--emerald-900)] font-bold text-sm px-6 py-3 rounded-full transition-all min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Queue Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

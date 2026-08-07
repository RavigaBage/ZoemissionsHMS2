import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, KeyRound, Shield, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError('Please enter your staff name.');
      return;
    }
    if (!pin.trim()) {
      setError('Please enter your staff numeric PIN.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(name, pin);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Name or PIN did not match an active staff account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickLogins = [
    { name: 'Dr. Sarah Jenkins', pin: '1234', role: 'Doctor' },
    { name: 'Joseph Kwesi', pin: '5678', role: 'Triage' },
    { name: 'Mary Amankwah', pin: '1111', role: 'Registration' },
    { name: 'Paul Mensah', pin: '2222', role: 'Pharmacy' },
    { name: 'Grace Osei (Admin)', pin: '9999', role: 'Admin' },
  ];

  const handleQuickLogin = (sName: string, sPin: string) => {
    setName(sName);
    setPin(sPin);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[var(--cream)] flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--emerald-100)] text-[var(--emerald-700)] mb-4 border border-[#C2E3D0]">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-[var(--emerald-900)] tracking-tight">Missions Clinic</h1>
          <p className="mt-2 text-sm text-[var(--ink-soft)] font-medium">
            Field Patient Care & Pharmacy System
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-[var(--line)] rounded-2xl p-8 shadow-sm">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Login Error</p>
                <p className="mt-0.5">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="staff-name" className="block text-sm font-bold text-[var(--emerald-900)] mb-2">
                Staff Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--ink-soft)]">
                  <User className="w-5 h-5" />
                </div>
                <input
                  id="staff-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Sarah Jenkins"
                  required
                  className="block w-full pl-11 pr-4 py-3 border border-[var(--line)] rounded-xl text-base text-[var(--ink)] bg-white focus:outline-none focus:border-[var(--emerald-700)] focus:ring-2 focus:ring-[var(--emerald-100)] min-h-[48px]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="staff-pin" className="block text-sm font-bold text-[var(--emerald-900)] mb-2">
                Staff PIN (Numeric)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--ink-soft)]">
                  <KeyRound className="w-5 h-5" />
                </div>
                <input
                  id="staff-pin"
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter 4-digit PIN"
                  required
                  className="block w-full pl-11 pr-4 py-3 border border-[var(--line)] rounded-xl text-base text-[var(--ink)] bg-white focus:outline-none focus:border-[var(--emerald-700)] focus:ring-2 focus:ring-[var(--emerald-100)] tracking-widest min-h-[48px]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[var(--emerald-700)] hover:bg-[var(--emerald-900)] text-[var(--cream)] font-bold text-base py-3.5 px-6 rounded-full transition-all duration-150 min-h-[48px] shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Signing in…</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Log in to Station</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Staff Selection for Field Convenience */}
          <div className="mt-8 pt-6 border-t border-[var(--line)]">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--gold-700)] mb-3">
              Quick Select Staff Account
            </p>
            <div className="grid grid-cols-1 gap-2">
              {quickLogins.map((s) => (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => handleQuickLogin(s.name, s.pin)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--cream)] hover:bg-[var(--emerald-100)] text-left transition-colors min-h-[44px]"
                >
                  <div>
                    <span className="font-bold text-xs text-[var(--emerald-900)] block">{s.name}</span>
                    <span className="text-[10px] text-[var(--ink-soft)] font-medium">Role: {s.role}</span>
                  </div>
                  <span className="font-mono font-bold text-xs bg-[var(--gold-100)] text-[var(--gold-700)] px-2 py-0.5 rounded-md">
                    PIN: {s.pin}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-[var(--ink-soft)] mt-8">
        Missions Clinic System &bull; Local Host Network Connected
      </div>
    </div>
  );
};

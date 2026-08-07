import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Staff, Role } from '../types';
import { Shield, UserPlus, KeyRound, RefreshCw, X, AlertCircle, CheckCircle2 } from 'lucide-react';

export const StaffPage: React.FC = () => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add Staff Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('doctor');
  const [pin, setPin] = useState('');

  // Reset PIN Modal
  const [resetTarget, setResetTarget] = useState<Staff | null>(null);
  const [newPin, setNewPin] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchStaff = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<any>('/api/staff');
      const list = Array.isArray(data) ? data : (data?.items || data?.staff || data?.data || []);
      setStaffList(list);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch staff members.');
      setStaffList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    if (!name.trim()) {
      setModalError('Staff name is required.');
      return;
    }
    if (!pin.trim()) {
      setModalError('Numeric PIN is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/api/staff', { name: name.trim(), role, pin: pin.trim() });
      setShowAddModal(false);
      setName('');
      setPin('');
      setSuccessMsg('New staff account created.');
      setTimeout(() => setSuccessMsg(null), 4000);
      fetchStaff();
    } catch (err: any) {
      setModalError(err.message || 'Failed to create staff account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTarget) return;
    setModalError(null);

    if (!newPin.trim()) {
      setModalError('New PIN is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.patch(`/api/staff/${resetTarget.id}/pin`, { pin: newPin.trim() });
      setResetTarget(null);
      setNewPin('');
      setSuccessMsg(`PIN reset for ${resetTarget.name}.`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setModalError(err.message || 'Failed to reset PIN.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold tracking-widest uppercase text-[var(--gold-700)] mb-1">
            Admin Control Panel
          </div>
          <h1 className="font-serif text-3xl font-bold text-[var(--emerald-900)]">
            Staff & Access Accounts
          </h1>
          <p className="text-sm text-[var(--ink-soft)] mt-1">
            Manage station field personnel, roles, and security authentication PINs
          </p>
        </div>

        <button
          onClick={() => {
            setName('');
            setPin('');
            setModalError(null);
            setShowAddModal(true);
          }}
          className="inline-flex items-center gap-2 bg-[var(--emerald-700)] hover:bg-[var(--emerald-900)] text-[var(--cream)] font-bold text-sm px-6 py-3 rounded-full transition-all shadow-xs min-h-[44px] cursor-pointer self-start md:self-auto"
        >
          <UserPlus className="w-5 h-5" />
          <span>Add New Staff Account</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Staff Table */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-[var(--line)] p-12 text-center text-[var(--ink-soft)]">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-[var(--emerald-700)]" />
          <p className="font-bold text-base">Loading staff records…</p>
        </div>
      ) : (
        <div className="bg-white border border-[var(--line)] rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[var(--cream)] border-b border-[var(--line)] text-xs font-bold uppercase tracking-wider text-[var(--emerald-900)]">
                  <th className="p-4">Staff Member</th>
                  <th className="p-4">Assigned Role</th>
                  <th className="p-4">Staff ID</th>
                  <th className="p-4 text-right">Security Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {staffList.map((st) => (
                  <tr key={st.id} className="hover:bg-[var(--cream)] transition-colors">
                    <td className="p-4 font-bold text-[var(--emerald-900)]">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[var(--emerald-100)] text-[var(--emerald-700)] flex items-center justify-center font-bold text-sm">
                          {st.name[0]}
                        </div>
                        <span>{st.name}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full bg-[var(--cream)] border border-[var(--line)] text-[var(--emerald-900)]">
                        {st.role}
                      </span>
                    </td>

                    <td className="p-4 font-mono text-xs text-[var(--ink-soft)] font-bold">
                      #{st.id}
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          setResetTarget(st);
                          setNewPin('');
                          setModalError(null);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--gold-700)] hover:text-white bg-[var(--gold-100)] hover:bg-[var(--gold-600)] px-3.5 py-1.5 rounded-full border border-[var(--gold-200)] transition-colors cursor-pointer min-h-[36px]"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Reset PIN</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[var(--line)] rounded-2xl max-w-md w-full p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
              <h3 className="font-serif font-bold text-xl text-[var(--emerald-900)]">
                Create Staff Account
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-[var(--ink-soft)] hover:bg-[var(--cream)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold">
                {modalError}
              </div>
            )}

            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[var(--emerald-900)] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Samuel Boateng"
                  required
                  className="block w-full px-3.5 py-2.5 border border-[var(--line)] rounded-xl text-sm focus:outline-none focus:border-[var(--emerald-700)] min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[var(--emerald-900)] mb-1">
                  Assigned Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="block w-full px-3.5 py-2.5 border border-[var(--line)] rounded-xl text-sm focus:outline-none min-h-[44px]"
                >
                  <option value="registration">registration</option>
                  <option value="triage">triage</option>
                  <option value="doctor">doctor</option>
                  <option value="pharmacy">pharmacy</option>
                  <option value="admin">admin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[var(--emerald-900)] mb-1">
                  Numeric PIN
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter 4-digit PIN"
                  required
                  className="block w-full px-3.5 py-2.5 border border-[var(--line)] rounded-xl text-sm tracking-widest focus:outline-none focus:border-[var(--emerald-700)] min-h-[44px]"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[var(--line)]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-[var(--ink-soft)] border border-[var(--line)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[var(--emerald-700)] hover:bg-[var(--emerald-900)] text-[var(--cream)] font-bold text-xs px-6 py-2.5 rounded-full min-h-[40px]"
                >
                  {isSubmitting ? 'Creating…' : 'Create Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset PIN Modal */}
      {resetTarget && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[var(--line)] rounded-2xl max-w-md w-full p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
              <h3 className="font-serif font-bold text-xl text-[var(--emerald-900)]">
                Reset PIN: {resetTarget.name}
              </h3>
              <button
                onClick={() => setResetTarget(null)}
                className="p-1 rounded-lg text-[var(--ink-soft)] hover:bg-[var(--cream)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold">
                {modalError}
              </div>
            )}

            <form onSubmit={handleResetPin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[var(--emerald-900)] mb-1">
                  New Numeric PIN
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="Enter new 4-digit PIN"
                  required
                  className="block w-full px-3.5 py-2.5 border border-[var(--line)] rounded-xl text-sm tracking-widest focus:outline-none focus:border-[var(--emerald-700)] min-h-[44px]"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[var(--line)]">
                <button
                  type="button"
                  onClick={() => setResetTarget(null)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-[var(--ink-soft)] border border-[var(--line)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[var(--gold-600)] hover:bg-[var(--gold-700)] text-white font-bold text-xs px-6 py-2.5 rounded-full min-h-[40px]"
                >
                  {isSubmitting ? 'Updating…' : 'Update PIN'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

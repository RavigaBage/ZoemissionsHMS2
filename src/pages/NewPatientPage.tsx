import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import { Patient, Lane, TriageFlag } from '../types';
import { useToast } from '../context/ToastContext';
import { TriageBadge } from '../components/TriageBadge';
import { UserPlus, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export const NewPatientPage: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError: showToastError } = useToast();

  const [firstName, setFirstName] = useState('');
  const [otherName, setOtherName] = useState('');
  const [approxAge, setApproxAge] = useState<string>('');
  const [gender, setGender] = useState<string>('Male');
  const [village, setVillage] = useState('');
  const [phone, setPhone] = useState('');

  // Auto Check-in Option
  const [autoCheckIn, setAutoCheckIn] = useState(true);
  const [lane, setLane] = useState<Lane>('general');
  const [triageFlag, setTriageFlag] = useState<TriageFlag>('green');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firstName.trim()) {
      setError('First name is required.');
      return;
    }
    if (!otherName.trim()) {
      setError('Other name(s) is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const patientPayload = {
        first_name: firstName.trim(),
        Other_name: otherName.trim(),
        approx_age: approxAge !== '' ? parseInt(approxAge, 10) : null,
        gender,
        lane: lane,
        triageFlag: triageFlag,
        village: village.trim() || null,
        phone: phone.trim() || null,
      };

      const newPatient = await api.post<Patient>('/api/patients', patientPayload);

      if (autoCheckIn) {
        const encounter = await api.post<any>('/api/encounters', {
          patient_id: newPatient.id,
          lane,
          triage_flag: triageFlag,
        });
        showSuccess(
          'Patient Registered & Ticket Issued',
          `${newPatient.first_name} ${newPatient.Other_name} was issued ${encounter.ticket_number}.`
        );
        navigate(`/vitals/new?encounter_id=${encounter.id}`);
        return;
      }

      showSuccess('Patient Registered', `${newPatient.first_name} ${newPatient.Other_name} registered successfully.`);
      navigate(`/patients/${newPatient.id}`);
    } catch (err: any) {
      const msg = err.detail || 'Failed to register patient.';
      setError(msg);
      showToastError('Registration Failed', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Navigation & Header */}
      <div className="mb-6">
        <Link
          to="/patients"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--ink-soft)] hover:text-[var(--emerald-900)] mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Patient Directory</span>
        </Link>
        <div className="text-xs font-bold tracking-widest uppercase text-[var(--gold-700)] mb-1">
          Registration Station
        </div>
        <h1 className="font-serif text-3xl font-bold text-[var(--emerald-900)]">
          Register New Patient
        </h1>
        <p className="text-sm text-[var(--ink-soft)] mt-1">
          Enter patient demographical details. Age is approximate. No exact birthdate required.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Registration Failed</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-[var(--line)] rounded-2xl p-8 shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label className="block text-sm font-bold text-[var(--emerald-900)] mb-2">
              First Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="e.g. Emanuel"
              required
              className="block w-full px-4 py-3 border border-[var(--line)] rounded-xl text-base text-[var(--ink)] bg-white focus:outline-none focus:border-[var(--emerald-700)] focus:ring-2 focus:ring-[var(--emerald-100)] min-h-[48px]"
            />
          </div>

          {/* Other Name(s) */}
          <div>
            <label className="block text-sm font-bold text-[var(--emerald-900)] mb-2">
              Other Name(s) <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={otherName}
              onChange={(e) => setOtherName(e.target.value)}
              placeholder="e.g. Kwabena Asante"
              required
              className="block w-full px-4 py-3 border border-[var(--line)] rounded-xl text-base text-[var(--ink)] bg-white focus:outline-none focus:border-[var(--emerald-700)] focus:ring-2 focus:ring-[var(--emerald-100)] min-h-[48px]"
            />
          </div>

          {/* Approximate Age */}
          <div>
            <label className="block text-sm font-bold text-[var(--emerald-900)] mb-2">
              Approximate Age (Years)
            </label>
            <input
              type="number"
              min="0"
              max="120"
              step="1"
              value={approxAge}
              onChange={(e) => setApproxAge(e.target.value)}
              placeholder="e.g. 34"
              className="block w-full px-4 py-3 border border-[var(--line)] rounded-xl text-base text-[var(--ink)] bg-white focus:outline-none focus:border-[var(--emerald-700)] focus:ring-2 focus:ring-[var(--emerald-100)] min-h-[48px]"
            />
            <p className="text-xs text-[var(--ink-soft)] mt-1">Estimate age if unknown.</p>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-bold text-[var(--emerald-900)] mb-2">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="block w-full px-4 py-3 border border-[var(--line)] rounded-xl text-base text-[var(--ink)] bg-white focus:outline-none focus:border-[var(--emerald-700)] focus:ring-2 focus:ring-[var(--emerald-100)] min-h-[48px]"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Village / Community */}
          <div>
            <label className="block text-sm font-bold text-[var(--emerald-900)] mb-2">
              Village / Community
            </label>
            <input
              type="text"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              placeholder="e.g. Kofiase"
              className="block w-full px-4 py-3 border border-[var(--line)] rounded-xl text-base text-[var(--ink)] bg-white focus:outline-none focus:border-[var(--emerald-700)] focus:ring-2 focus:ring-[var(--emerald-100)] min-h-[48px]"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-bold text-[var(--emerald-900)] mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 0241234567"
              className="block w-full px-4 py-3 border border-[var(--line)] rounded-xl text-base text-[var(--ink)] bg-white focus:outline-none focus:border-[var(--emerald-700)] focus:ring-2 focus:ring-[var(--emerald-100)] min-h-[48px]"
            />
          </div>
        </div>

        {/* Instant Check-in Section */}
        <div className="pt-6 border-t border-[var(--line)] space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={autoCheckIn}
              onChange={(e) => setAutoCheckIn(e.target.checked)}
              className="w-5 h-5 rounded border-[var(--line)] text-[var(--emerald-700)] focus:ring-[var(--emerald-100)] cursor-pointer"
            />
            <span className="font-bold text-sm text-[var(--emerald-900)]">
              Check-in patient to queue immediately after saving
            </span>
          </label>

          {autoCheckIn && (
            <div className="p-5 rounded-2xl bg-[var(--cream)] border border-[var(--line)] space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Lane */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-2">
                    Arrival Lane
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setLane('general')}
                      className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs border transition-all cursor-pointer min-h-[44px] ${
                        lane === 'general'
                          ? 'bg-[var(--emerald-700)] text-white border-[var(--emerald-700)] shadow-xs'
                          : 'bg-white text-[var(--ink-soft)] border-[var(--line)]'
                      }`}
                    >
                      General Lane
                    </button>
                    <button
                      type="button"
                      onClick={() => setLane('emergency')}
                      className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs border transition-all cursor-pointer min-h-[44px] ${
                        lane === 'emergency'
                          ? 'bg-red-700 text-white border-red-700 shadow-xs'
                          : 'bg-white text-[var(--ink-soft)] border-[var(--line)]'
                      }`}
                    >
                      Emergency Lane
                    </button>
                  </div>
                </div>

                {/* Initial Triage Flag */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-2">
                    Initial Triage Flag
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(['red', 'yellow', 'green', 'none'] as TriageFlag[]).map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setTriageFlag(f)}
                        className={`p-1 rounded-full cursor-pointer transition-transform ${
                          triageFlag === f ? 'ring-2 ring-[var(--emerald-700)] scale-105' : 'opacity-80'
                        }`}
                      >
                        <TriageBadge flag={f} size="sm" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="pt-4 flex items-center justify-end gap-3">
          <Link
            to="/patients"
            className="px-6 py-3 rounded-full text-sm font-bold text-[var(--ink-soft)] hover:bg-[var(--cream)] border border-[var(--line)]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[var(--emerald-700)] hover:bg-[var(--emerald-900)] text-[var(--cream)] font-bold text-base px-8 py-3 rounded-full transition-all min-h-[48px] shadow-sm cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            <span>{isSubmitting ? 'Saving Patient…' : 'Save Patient Record'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

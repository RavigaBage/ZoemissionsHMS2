import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { Queue, QueueStatus} from '../types';
import { TriageBadge } from '../components/TriageBadge';
import { useAuth } from '../context/AuthContext';
import {
  Activity,
  Stethoscope,
  Pill,
  UserPlus,
  RefreshCw,
  Clock,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  User,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [Queue, setQueue] = useState<Queue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedLane, setSelectedLane] = useState<string>('all');
  const [selectedFlag, setSelectedFlag] = useState<string>('all');

  const fetchQueue = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<[Queue]>('/api/queue');
      const list = Array.isArray(data) ? data : [];
      console.log(list);
      setQueue(list);
    } catch (err: any) {
      setError(err.message || 'Failed to load clinic queue.');
      setQueue([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
    // Refresh queue periodically every 15 seconds
    const interval = setInterval(fetchQueue, 15000);
    return () => clearInterval(interval);
  }, []);

  const safeQueue = Array.isArray(Queue) ? Queue : [];

  const filteredQueue = safeQueue.filter((e) => {
    if (selectedStatus !== 'all' && e.current_stage !== selectedStatus) 
      return false;
    return true;
  });
  console.log(filteredQueue,selectedStatus);
  // Metrics
  const totalQueue = safeQueue.filter((e) => e.status !== 'completed').length;
  const emergencyCount = safeQueue.filter((e) => e.emergency_flag === 'red' && e.status !== 'completed').length;
  const redCount = safeQueue.filter((e) => e.emergency_flag === 'red' && e.status !== 'completed').length;
  const awaitingDoctor = safeQueue.filter((e) => e.current_stage === 'consultation').length;
  const awaitingPharmacy = safeQueue.filter((e) => e.current_stage === 'dispensing').length;

  const statusLabels: Record<QueueStatus, { label: string; color: string }> = {
    registered: { label: 'Awaiting Vitals', color: 'bg-blue-100 text-blue-800' },
    vitals: { label: 'Awaiting Doctor', color: 'bg-amber-100 text-amber-800' },
    consultation: { label: 'Awaiting Pharmacy', color: 'bg-purple-100 text-purple-800' },
    dispensing: { label: 'Dispensed', color: 'bg-emerald-100 text-emerald-800' },
    completed: { label: 'Completed', color: 'bg-gray-100 text-gray-700' },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Quick Action Trigger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-bold tracking-widest uppercase text-[var(--gold-700)] mb-1">
            Live Station Queue
          </div>
          <h1 className="font-serif text-3xl font-bold text-[var(--emerald-900)]">
            Patient Flow Queue
          </h1>
          <p className="text-sm text-[var(--ink-soft)] mt-1">
            Real-time tracking across Registration, Triage, Consultation, and Pharmacy
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={fetchQueue}
            disabled={isLoading}
            className="inline-flex items-center gap-2 bg-[var(--cream-deep)] hover:bg-[var(--emerald-100)] text-[var(--emerald-900)] font-bold text-sm px-4 py-2.5 rounded-full border border-[var(--line)] transition-all min-h-[44px]"
            title="Refresh Queue"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          {(user?.role === 'registration' || user?.role === 'admin') && (
            <Link
              to="/patients/new"
              className="inline-flex items-center gap-2 bg-[var(--emerald-700)] hover:bg-[var(--emerald-900)] text-[var(--cream)] font-bold text-sm px-5 py-2.5 rounded-full transition-all min-h-[44px] shadow-xs"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register Patient</span>
            </Link>
          )}

          {(user?.role === 'triage' || user?.role === 'registration' || user?.role === 'admin') && (
            <Link
              to="/Queue/new"
              className="inline-flex items-center gap-2 bg-[var(--gold-600)] hover:bg-[var(--gold-700)] text-white font-bold text-sm px-5 py-2.5 rounded-full transition-all min-h-[44px] shadow-xs"
            >
              <Activity className="w-4 h-4" />
              <span>New Patient Check-in</span>
            </Link>
          )}
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-[var(--line)] shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] block">Total Active Queue</span>
          <span className="text-3xl font-serif font-bold text-[var(--emerald-900)] mt-1 block">{totalQueue}</span>
          <span className="text-xs text-[var(--ink-soft)] mt-1 block">In process</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-red-200 bg-red-50/30 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-red-700 block">Emergency Lane</span>
          <span className="text-3xl font-serif font-bold text-red-800 mt-1 block">{emergencyCount}</span>
          <span className="text-xs text-red-600 mt-1 block flex items-center gap-1 font-semibold">
            <AlertTriangle className="w-3 h-3" /> Priority care
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-red-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-red-700 block">Red Triage Flag</span>
          <span className="text-3xl font-serif font-bold text-red-800 mt-1 block">{redCount}</span>
          <span className="text-xs text-red-600 mt-1 block font-semibold">Immediate attention</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--gold-700)] block">Awaiting Doctor</span>
          <span className="text-3xl font-serif font-bold text-[var(--gold-700)] mt-1 block">{awaitingDoctor}</span>
          <span className="text-xs text-[var(--ink-soft)] mt-1 block">Consultation queue</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-purple-200 bg-purple-50/20 shadow-xs col-span-2 md:col-span-1">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 block">Awaiting Pharmacy</span>
          <span className="text-3xl font-serif font-bold text-purple-900 mt-1 block">{awaitingPharmacy}</span>
          <span className="text-xs text-[var(--ink-soft)] mt-1 block">Prescription dispensing</span>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[var(--line)] shadow-xs mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] flex items-center gap-1 mr-2">
            <Filter className="w-3.5 h-3.5" /> Station:
          </span>
          {[
            { id: 'all', label: 'All Active' },
            { id: 'registered', label: '1. Awaiting Vitals' },
            { id: 'triaged', label: '2. Awaiting Doctor' },
            { id: 'consulted', label: '3. Awaiting Pharmacy' },
            { id: 'completed', label: '4. Completed' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedStatus(st.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all min-h-[36px] cursor-pointer ${
                selectedStatus === st.id
                  ? 'bg-[var(--emerald-700)] text-[var(--cream)] shadow-xs'
                  : 'bg-[var(--cream)] text-[var(--ink-soft)] hover:bg-[var(--emerald-100)]'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-[var(--line)]">
          {/* Lane Filter */}
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-bold text-[var(--ink-soft)]">Lane:</label>
            <select
              value={selectedLane}
              onChange={(e) => setSelectedLane(e.target.value)}
              className="bg-[var(--cream)] border border-[var(--line)] rounded-lg text-xs font-bold px-3 py-1.5 text-[var(--ink)] focus:outline-none min-h-[36px]"
            >
              <option value="all">All Lanes</option>
              <option value="emergency">Emergency Lane</option>
              <option value="general">General Lane</option>
            </select>
          </div>

          {/* Triage Flag Filter */}
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-bold text-[var(--ink-soft)]">Triage Flag:</label>
            <select
              value={selectedFlag}
              onChange={(e) => setSelectedFlag(e.target.value)}
              className="bg-[var(--cream)] border border-[var(--line)] rounded-lg text-xs font-bold px-3 py-1.5 text-[var(--ink)] focus:outline-none min-h-[36px]"
            >
              <option value="all">All Flags</option>
              <option value="red">Red (Emergency)</option>
              <option value="yellow">Yellow (Urgent)</option>
              <option value="green">Green (Routine)</option>
              <option value="none">None (Unflagged)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Queue List / Grid */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm mb-6">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-[var(--line)] p-12 text-center text-[var(--ink-soft)]">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-[var(--emerald-700)]" />
          <p className="font-bold text-base">Loading station queue…</p>
        </div>
      ) : filteredQueue.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[var(--line)] p-12 text-center">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-[var(--emerald-600)]" />
          <h3 className="font-serif text-xl font-bold text-[var(--emerald-900)]">No patients in this queue filter</h3>
          <p className="text-sm text-[var(--ink-soft)] mt-1 max-w-md mx-auto">
            All patients in this filter have been processed or no check-ins exist currently.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQueue.map((enc) => {
            const stInfo = statusLabels[enc.status] || { label: enc.current_stage, color: 'bg-gray-100 text-gray-800' };

            return (
              <div
                key={enc.id}
                className={`bg-white rounded-2xl border p-5 transition-all shadow-xs hover:border-[var(--emerald-700)] ${
                  enc.emergency_flag === 'red' ? 'border-l-8 border-l-red-600 border-[var(--line)] bg-red-50/10' : 'border-[var(--line)]'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Patient Primary Details */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <TriageBadge flag="yellow" size="md" />

                      {enc.emergency_flag === 'emergency' && (
                        <span className="bg-red-700 text-white font-extrabold text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          Emergency Lane
                        </span>
                      )}

                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${stInfo.color}`}>
                        {stInfo.label}
                      </span>
                    </div>

                    <div>
                      <Link
                        to={`/patients/${enc.patient_id}`}
                        className="font-serif font-bold text-xl text-[var(--emerald-900)] hover:underline inline-flex items-center gap-2"
                      >
                        <User className="w-5 h-5 text-[var(--emerald-700)]" />
                        <span>
                          {enc.patient ? `${enc.patient.first_name} ${enc.patient.Other_name}` : 'Unknown Patient'}
                        </span>
                      </Link>

                      <div className="text-xs text-[var(--ink-soft)] font-medium flex flex-wrap gap-x-4 gap-y-1 mt-1">
                        {enc.patient?.approx_age !== undefined && enc.patient?.approx_age !== null && (
                          <span>Age: <strong>{enc.patient.approx_age} yrs</strong></span>
                        )}
                        {enc.patient?.gender && <span>Gender: <strong>{enc.patient.gender}</strong></span>}
                        {enc.patient?.village && <span>Village: <strong>{enc.patient.village}</strong></span>}
                        {enc.patient?.phone && <span>Phone: <strong>{enc.patient.phone}</strong></span>}
                        <span>Checked in: <strong>{new Date(enc.created_at || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Actions according to station / role */}
                  <div className="flex flex-wrap items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-[var(--line)]">
                    {/* Vitals Button */}
                    <Link
                      to={`/vitals/new?encounter_id=${enc.id}`}
                      className="inline-flex items-center gap-1.5 bg-[var(--emerald-100)] hover:bg-[var(--emerald-600)] hover:text-white text-[var(--emerald-900)] font-bold text-xs px-4 py-2.5 rounded-full border border-[#C2E3D0] transition-all min-h-[40px]"
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>{enc.status === 'registered' ? 'Record Vitals' : 'View Vitals'}</span>
                    </Link>

                    {/* Consult Button */}
                    <Link
                      to={`/consultations/new?encounter_id=${enc.id}`}
                      className="inline-flex items-center gap-1.5 bg-[var(--gold-100)] hover:bg-[var(--gold-600)] hover:text-white text-[var(--gold-700)] font-bold text-xs px-4 py-2.5 rounded-full border border-[var(--gold-200)] transition-all min-h-[40px]"
                    >
                      <Stethoscope className="w-3.5 h-3.5" />
                      <span>{enc.current_stage === 'consultation' ? 'Start Consult' : 'Consult Record'}</span>
                    </Link>

                    {/* Pharmacy Button */}
                    <Link
                      to="/prescriptions"
                      className="inline-flex items-center gap-1.5 bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-800 font-bold text-xs px-4 py-2.5 rounded-full border border-purple-200 transition-all min-h-[40px]"
                    >
                      <Pill className="w-3.5 h-3.5" />
                      <span>Pharmacy Queue</span>
                    </Link>

                    {/* View Patient Details */}
                    <Link
                      to={`/patients/${enc.patient_id}`}
                      className="inline-flex items-center gap-1 text-[var(--ink-soft)] hover:text-[var(--emerald-900)] font-bold text-xs px-3 py-2 rounded-full hover:bg-[var(--cream)]"
                      title="Full Patient History"
                    >
                      <span>Profile</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

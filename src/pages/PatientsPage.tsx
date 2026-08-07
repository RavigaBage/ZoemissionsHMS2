import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { Patient } from '../types';
import { TriageBadge } from '../components/TriageBadge';
import { Search, UserPlus, User, MapPin, Phone, Calendar, ArrowRight, RefreshCw, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const PatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<(Patient & { latest_encounter?: any })[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) return;
    try {
      await api.delete(`/api/patients/${id}`);
      showSuccess('Deleted', 'Patient removed successfully.');
      fetchPatients(searchQuery);
    } catch (err: any) {
      showError('Error', err.message || 'Failed to delete patient.');
    }
  };

  const fetchPatients = async (query = '') => {
    setIsLoading(true);
    setError(null);
    try {
      const endpoint = query ? `/api/patients?search=${encodeURIComponent(query)}` : '/api/patients';
      const data = await api.get<any>(endpoint);
      const list = Array.isArray(data) ? data : (data?.items || data?.patients || data?.data || []);
      setPatients(list);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch patients.');
      setPatients([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients(searchQuery);
  }, [searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-bold tracking-widest uppercase text-[var(--gold-700)] mb-1">
            Patient Directory
          </div>
          <h1 className="font-serif text-3xl font-bold text-[var(--emerald-900)]">
            All Registered Patients
          </h1>
          <p className="text-sm text-[var(--ink-soft)] mt-1">
            Search, view history, or check in existing patients for care
          </p>
        </div>

        <Link
          to="/patients/new"
          className="inline-flex items-center gap-2 bg-[var(--emerald-700)] hover:bg-[var(--emerald-900)] text-[var(--cream)] font-bold text-sm px-6 py-3 rounded-full transition-all shadow-xs min-h-[44px] self-start md:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Patient</span>
        </Link>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[var(--line)] shadow-xs mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--ink-soft)]">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patients by first name, other names, village, or phone number…"
            className="block w-full pl-11 pr-4 py-3 border border-[var(--line)] rounded-xl text-base text-[var(--ink)] bg-[var(--cream)] focus:bg-white focus:outline-none focus:border-[var(--emerald-700)] focus:ring-2 focus:ring-[var(--emerald-100)] min-h-[48px]"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm mb-6">
          {error}
        </div>
      )}

      {/* Patients Table / Grid */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-[var(--line)] p-12 text-center text-[var(--ink-soft)]">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-[var(--emerald-700)]" />
          <p className="font-bold text-base">Searching patient records…</p>
        </div>
      ) : patients.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[var(--line)] p-12 text-center">
          <User className="w-12 h-12 mx-auto mb-3 text-[var(--ink-soft)]" />
          <h3 className="font-serif text-xl font-bold text-[var(--emerald-900)]">No patients found</h3>
          <p className="text-sm text-[var(--ink-soft)] mt-1 max-w-md mx-auto">
            {searchQuery ? `No records match "${searchQuery}". Try a different spelling or register a new patient.` : 'No registered patients in the database yet.'}
          </p>
          <Link
            to="/patients/new"
            className="inline-flex items-center gap-2 bg-[var(--emerald-700)] text-[var(--cream)] font-bold text-sm px-6 py-2.5 rounded-full mt-4"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register New Patient Now</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map((pat) => (
            <div
              key={pat.id}
              className="bg-white rounded-2xl border border-[var(--line)] p-6 hover:border-[var(--emerald-700)] transition-all shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--emerald-100)] text-[var(--emerald-700)] flex items-center justify-center font-bold text-base shrink-0">
                    {pat.first_name[0]}
                  </div>

                  {pat.latest_encounter?.triage_flag && (
                    <TriageBadge flag={pat.latest_encounter.triage_flag} size="sm" />
                  )}
                </div>

                <h3 className="font-serif font-bold text-xl text-[var(--emerald-900)]">
                  {pat.first_name} {pat.Other_name}
                </h3>

                <div className="mt-4 space-y-2 text-xs text-[var(--ink-soft)]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[var(--emerald-700)] shrink-0" />
                    <span>Age: <strong>{pat.approx_age !== undefined && pat.approx_age !== null ? `${pat.approx_age} years` : 'Not specified'}</strong></span>
                    {pat.gender && <span className="ml-2 font-bold px-2 py-0.5 rounded-full bg-[var(--cream)] border border-[var(--line)] text-[var(--emerald-900)]">{pat.gender}</span>}
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[var(--emerald-700)] shrink-0" />
                    <span>Village / Community: <strong>{pat.village || 'Not specified'}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[var(--emerald-700)] shrink-0" />
                    <span>Phone: <strong>{pat.phone || 'No phone recorded'}</strong></span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--line)] flex items-center justify-between">
                <Link
                  to={`/patients/${pat.id}`}
                  className="font-bold text-xs text-[var(--emerald-700)] hover:text-[var(--emerald-900)] inline-flex items-center gap-1.5"
                >
                  <span>View Profile & History</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  to={`/encounters/new?patient_id=${pat.id}`}
                  className="bg-[var(--gold-100)] hover:bg-[var(--gold-600)] hover:text-white text-[var(--gold-700)] font-bold text-xs px-3 py-1.5 rounded-full border border-[var(--gold-200)] transition-all min-h-[36px] flex items-center"
                >
                  Check-in
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import { Patient, Lane, TriageFlag, Encounter} from '../types';
import { TriageBadge } from '../components/TriageBadge';
import { TicketCard } from '../components/TicketCard';
import { PlusCircle, ArrowLeft, Search, User, AlertCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const NewEncounterPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialPatientId = searchParams.get('patient_id') || '';
  const encounterId = searchParams.get('encounter_id') || '';

  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string>(initialPatientId);
  const [lane, setLane] = useState<Lane>('general');
  const [triageFlag, setTriageFlag] = useState<TriageFlag>('green');

  const [isLoadingPatients, setIsLoadingPatients] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdEncounter, setCreatedEncounter] = useState<Encounter | null>(null);
  const { showSuccess } = useToast();
  useEffect(() => {
    const loadPatients = async () => {
      if (encounterId) {
        try {
           const enc = await api.get<Encounter>(`/api/encounters/${encounterId}`);
           if (enc) {
              setSelectedPatientId(enc.patient_id);
              setLane(enc.lane);
              setTriageFlag(enc.triage_flag || 'green');
           }
        } catch (e) {
           console.error(e);
        }
      }
      setIsLoadingPatients(true);
      try {
        const data = await api.get<Patient[]>('/api/patients');
        setPatients(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load patients list.');
      } finally {
        setIsLoadingPatients(false);
      }
    };
    loadPatients();
  }, []);

  const filteredPatients = patients.filter((p) => {
    if (!patientSearch.trim()) return true;
    const q = patientSearch.toLowerCase();
    return (
      p.first_name.toLowerCase().includes(q) ||
      p.Other_name.toLowerCase().includes(q) ||
      (p.village && p.village.toLowerCase().includes(q)) ||
      (p.phone && p.phone.includes(q))
    );
  });

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedPatientId) {
      setError('Please select an existing patient for check-in.');
      return;
    }

    setIsSubmitting(true);
    try {
      const encounter = await api.post<Encounter>('/api/encounters', {
        patient_id: selectedPatientId,
        lane,
        triage_flag: triageFlag,
      });
      setCreatedEncounter(encounter);
      showSuccess('Ticket Issued', `${selectedPatient?.first_name || 'Patient'} was issued ${encounter.ticket_number}.`);
      navigate(`/vitals/new?encounter_id=${encounter.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create patient check-in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header */}
      <div className="mb-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--ink-soft)] hover:text-[var(--emerald-900)] mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Queue Dashboard</span>
        </Link>
        <div className="text-xs font-bold tracking-widest uppercase text-[var(--gold-700)] mb-1">
          Check-in Station
        </div>
        <h1 className="font-serif text-3xl font-bold text-[var(--emerald-900)]">
          Patient Check-in (New Visit)
        </h1>
        <p className="text-sm text-[var(--ink-soft)] mt-1">
          Add an existing patient to the station queue with arrival lane and initial triage status
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Check-in Error</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-[var(--line)] rounded-2xl p-8 shadow-xs space-y-6">
        {/* Step 1: Select Patient */}
        <div>
          <label className="block text-sm font-bold text-[var(--emerald-900)] mb-2">
            Select Patient <span className="text-red-600">*</span>
          </label>

          {selectedPatient ? (
            <div className="p-4 rounded-xl bg-[var(--cream)] border border-[var(--line)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--emerald-700)] text-[var(--cream)] font-bold flex items-center justify-center">
                  {selectedPatient.first_name[0]}
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-[var(--emerald-900)]">
                    {selectedPatient.first_name} {selectedPatient.Other_name}
                  </h4>
                  <span className="text-xs text-[var(--ink-soft)] font-medium">
                    Age: {selectedPatient.approx_age ?? 'N/A'} yrs &bull; Village: {selectedPatient.village || 'N/A'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPatientId('')}
                className="text-xs font-bold text-red-700 hover:underline px-3 py-1 bg-red-50 rounded-full border border-red-200"
              >
                Change Patient
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[var(--ink-soft)] pointer-events-none" />
                <input
                  type="text"
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  placeholder="Type name, village or phone to search registered patients…"
                  className="block w-full pl-10 pr-4 py-3 border border-[var(--line)] rounded-xl text-sm bg-white text-[var(--ink)] focus:outline-none focus:border-[var(--emerald-700)] min-h-[48px]"
                />
              </div>

              <div className="max-h-56 overflow-y-auto border border-[var(--line)] rounded-xl divide-y divide-[var(--line)] bg-[var(--cream)]">
                {isLoadingPatients ? (
                  <p className="p-4 text-xs font-bold text-[var(--ink-soft)] text-center">Loading patients list…</p>
                ) : filteredPatients.length === 0 ? (
                  <div className="p-4 text-center">
                    <p className="text-xs font-bold text-[var(--ink-soft)]">No matching patient found.</p>
                    <Link
                      to="/patients/new"
                      className="inline-block text-xs font-bold text-[var(--emerald-700)] hover:underline mt-2"
                    >
                      + Register a new patient
                    </Link>
                  </div>
                ) : (
                  filteredPatients.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPatientId(p.id)}
                      className="w-full text-left p-3 hover:bg-[var(--emerald-100)] flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <div>
                        <span className="font-serif font-bold text-sm text-[var(--emerald-900)] block">
                          {p.first_name} {p.Other_name}
                        </span>
                        <span className="text-xs text-[var(--ink-soft)]">
                          Age: {p.approx_age ?? 'N/A'} &bull; Village: {p.village || 'N/A'} &bull; Phone: {p.phone || 'N/A'}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[var(--emerald-700)] bg-white px-3 py-1 rounded-full border border-[var(--line)]">
                        Select
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Arrival Lane */}
        <div>
          <label className="block text-sm font-bold text-[var(--emerald-900)] mb-2">
            Arrival Lane
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setLane('general')}
              className={`p-4 rounded-xl border text-left font-bold transition-all cursor-pointer min-h-[52px] ${
                lane === 'general'
                  ? 'bg-[var(--emerald-700)] text-[var(--cream)] border-[var(--emerald-700)] shadow-xs'
                  : 'bg-white text-[var(--ink)] border-[var(--line)] hover:bg-[var(--cream)]'
              }`}
            >
              <div className="text-base font-serif">General Lane</div>
              <div className="text-xs opacity-80 font-sans font-normal mt-0.5">Routine clinic consultations</div>
            </button>

            <button
              type="button"
              onClick={() => setLane('emergency')}
              className={`p-4 rounded-xl border text-left font-bold transition-all cursor-pointer min-h-[52px] ${
                lane === 'emergency'
                  ? 'bg-red-700 text-white border-red-700 shadow-xs'
                  : 'bg-white text-[var(--ink)] border-[var(--line)] hover:bg-red-50'
              }`}
            >
              <div className="text-base font-serif">Emergency Lane</div>
              <div className="text-xs opacity-80 font-sans font-normal mt-0.5">High priority / critical care</div>
            </button>
          </div>
        </div>

        {/* Step 3: Initial Triage Flag */}
        <div>
          <label className="block text-sm font-bold text-[var(--emerald-900)] mb-2">
            Initial Triage Flag Status
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(['red', 'yellow', 'green', 'none'] as TriageFlag[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setTriageFlag(f)}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                  triageFlag === f ? 'ring-2 ring-[var(--emerald-700)] bg-[var(--cream)]' : 'bg-white border-[var(--line)]'
                }`}
              >
                <TriageBadge flag={f} size="md" />
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-[var(--line)]">
          <Link
            to="/dashboard"
            className="px-6 py-3 rounded-full text-sm font-bold text-[var(--ink-soft)] hover:bg-[var(--cream)] border border-[var(--line)]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || !selectedPatientId}
            className="bg-[var(--emerald-700)] hover:bg-[var(--emerald-900)] text-[var(--cream)] font-bold text-base px-8 py-3 rounded-full transition-all min-h-[48px] shadow-sm cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            <span>{isSubmitting ? 'Checking in…' : 'Complete Check-in & Enter Vitals'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

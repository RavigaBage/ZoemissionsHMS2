import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import { Patient, Encounter, Vitals, Consultation } from '../types';
import { TriageBadge } from '../components/TriageBadge';
import {
  User,
  MapPin,
  Phone,
  Calendar,
  Activity,
  Stethoscope,
  Pill,
  ArrowLeft,
  PlusCircle,
  Clock,
  RefreshCw,
  FileText,
} from 'lucide-react';

export const PatientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [patientData, setPatientData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatient = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<any>(`/api/patients/${id}`);
      setPatientData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load patient history.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchPatient();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-[var(--emerald-700)]" />
        <p className="font-bold text-base text-[var(--ink-soft)]">Retrieving patient medical record…</p>
      </div>
    );
  }

  if (error || !patientData) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-800 mb-6">
          <p className="font-bold text-lg">Unable to load patient</p>
          <p className="text-sm mt-1">{error || 'Patient record not found.'}</p>
        </div>
        <Link
          to="/patients"
          className="inline-flex items-center gap-2 bg-[var(--emerald-700)] text-[var(--cream)] font-bold text-sm px-6 py-2.5 rounded-full"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Patients Directory</span>
        </Link>
      </div>
    );
  }

  const encounters: any[] = patientData.encounters || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Bar */}
      <div>
        <Link
          to="/patients"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--ink-soft)] hover:text-[var(--emerald-900)] mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Patients Directory</span>
        </Link>

        <div className="bg-white border border-[var(--line)] rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-[var(--emerald-100)] text-[var(--emerald-700)] flex items-center justify-center font-bold text-2xl shrink-0">
              {patientData.first_name?.[0]}
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--gold-700)] mb-1">
                Patient Profile #{patientData.id}
              </div>
              <h1 className="font-serif text-3xl font-bold text-[var(--emerald-900)]">
                {patientData.first_name} {patientData.Other_name}
              </h1>

              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-sm text-[var(--ink-soft)]">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[var(--emerald-700)]" />
                  Age: <strong>{patientData.approx_age !== undefined && patientData.approx_age !== null ? `${patientData.approx_age} yrs` : 'Not recorded'}</strong>
                </span>
                {patientData.gender && (
                  <span className="flex items-center gap-1.5">
                    Gender: <strong>{patientData.gender}</strong>
                  </span>
                )}
                {patientData.village && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[var(--emerald-700)]" />
                    Village: <strong>{patientData.village}</strong>
                  </span>
                )}
                {patientData.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-[var(--emerald-700)]" />
                    Phone: <strong>{patientData.phone}</strong>
                  </span>
                )}
              </div>
            </div>
          </div>

          <Link
            to={`/encounters/new?patient_id=${patientData.id}`}
            className="inline-flex items-center gap-2 bg-[var(--gold-600)] hover:bg-[var(--gold-700)] text-white font-bold text-sm px-6 py-3 rounded-full shadow-xs transition-all min-h-[48px] shrink-0"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Check-in New Visit</span>
          </Link>
        </div>
      </div>

      {/* Medical History Timeline */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-[var(--emerald-900)]">
            Medical Encounters & Visit History ({encounters.length})
          </h2>
        </div>

        {encounters.length === 0 ? (
          <div className="bg-white border border-[var(--line)] rounded-2xl p-8 text-center text-[var(--ink-soft)]">
            <Clock className="w-10 h-10 mx-auto mb-2 text-[var(--gold-600)]" />
            <p className="font-bold text-base">No active or past clinic encounters recorded for this patient.</p>
            <p className="text-xs mt-1">Click "Check-in New Visit" above to start triage or consultation.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {encounters.map((enc, idx) => (
              <div
                key={enc.id}
                className="bg-white border border-[var(--line)] rounded-2xl p-6 shadow-xs space-y-6"
              >
                {/* Encounter Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[var(--line)]">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[var(--emerald-700)] text-[var(--cream)] font-bold text-sm flex items-center justify-center">
                      #{encounters.length - idx}
                    </span>
                    <div>
                      <span className="font-serif font-bold text-lg text-[var(--emerald-900)] block">
                        Clinic Visit &bull; {new Date(enc.created_at).toLocaleDateString()} at {new Date(enc.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-xs text-[var(--ink-soft)] uppercase tracking-wider font-semibold">
                        Lane: <strong className="text-[var(--emerald-900)]">{enc.lane}</strong> &bull; Status: <strong className="text-[var(--emerald-900)]">{enc.status}</strong>
                      </span>
                    </div>
                  </div>

                  <TriageBadge flag={enc.triage_flag} size="md" />
                </div>

                {/* Vitals Block */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-sm text-[var(--emerald-900)] flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[var(--emerald-700)]" />
                      Recorded Vitals ({enc.vitals?.length || 0})
                    </h4>
                    <Link
                      to={`/vitals/new?encounter_id=${enc.id}`}
                      className="text-xs font-bold text-[var(--emerald-700)] hover:underline"
                    >
                      + Record / Update Vitals
                    </Link>
                  </div>

                  {enc.vitals && enc.vitals.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[var(--cream)] p-4 rounded-xl border border-[var(--line)]">
                      <div>
                        <span className="text-[10px] font-bold text-[var(--ink-soft)] uppercase block">Temperature</span>
                        <span className="text-base font-bold text-[var(--emerald-900)]">
                          {enc.vitals[0].temp_c !== null ? `${enc.vitals[0].temp_c} °C` : '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-[var(--ink-soft)] uppercase block">Blood Pressure</span>
                        <span className="text-base font-bold text-[var(--emerald-900)]">
                          {enc.vitals[0].bp_systolic && enc.vitals[0].bp_diastolic
                            ? `${enc.vitals[0].bp_systolic}/${enc.vitals[0].bp_diastolic} mmHg`
                            : '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-[var(--ink-soft)] uppercase block">Pulse Rate</span>
                        <span className="text-base font-bold text-[var(--emerald-900)]">
                          {enc.vitals[0].pulse !== null ? `${enc.vitals[0].pulse} bpm` : '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-[var(--ink-soft)] uppercase block">Oxygen SpO2</span>
                        <span className="text-base font-bold text-[var(--emerald-900)]">
                          {enc.vitals[0].spo2 !== null ? `${enc.vitals[0].spo2} %` : '—'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-[var(--ink-soft)] italic bg-[var(--cream)] p-3 rounded-xl border border-[var(--line)]">
                      No vitals recorded yet for this encounter.
                    </p>
                  )}
                </div>

                {/* Consultations Block */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-sm text-[var(--emerald-900)] flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-[var(--emerald-700)]" />
                      Doctor's Consultation ({enc.consultations?.length || 0})
                    </h4>
                    <Link
                      to={`/consultations/new?encounter_id=${enc.id}`}
                      className="text-xs font-bold text-[var(--emerald-700)] hover:underline"
                    >
                      + Start Consultation
                    </Link>
                  </div>

                  {enc.consultations && enc.consultations.length > 0 ? (
                    <div className="space-y-4">
                      {enc.consultations.map((cns: any) => (
                        <div key={cns.id} className="bg-[var(--cream)] p-4 rounded-xl border border-[var(--line)] space-y-3">
                          <div className="flex justify-between items-center text-xs text-[var(--ink-soft)] font-bold">
                            <span>Doctor: {cns.doctor_name || 'Medical Doctor'}</span>
                            <Link to={`/consultations/${cns.id}`} className="text-[var(--emerald-700)] hover:underline">
                              Edit Note &rarr;
                            </Link>
                          </div>

                          {cns.chief_complaint && (
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--gold-700)] block">Chief Complaint</span>
                              <p className="text-sm font-semibold text-[var(--ink)]">{cns.chief_complaint}</p>
                            </div>
                          )}

                          {cns.diagnosis && (
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--gold-700)] block">Diagnosis</span>
                              <p className="text-sm font-bold text-[var(--emerald-900)]">{cns.diagnosis}</p>
                            </div>
                          )}

                          {cns.prescriptions && cns.prescriptions.length > 0 && (
                            <div className="pt-2 border-t border-[var(--line)]">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 block mb-1">Prescribed Medications</span>
                              <ul className="space-y-1 text-xs">
                                {cns.prescriptions.map((pr: any) => (
                                  <li key={pr.id} className="flex justify-between items-center text-[var(--ink)] font-semibold">
                                    <span>&bull; {pr.medication?.name || 'Medication'} ({pr.dosage_instructions || 'Take as instructed'})</span>
                                    <span className="bg-purple-100 text-purple-900 font-bold px-2 py-0.5 rounded-full text-[10px]">
                                      Qty: {pr.quantity_prescribed} ({pr.status})
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[var(--ink-soft)] italic bg-[var(--cream)] p-3 rounded-xl border border-[var(--line)]">
                      No doctor consultation notes recorded for this visit yet.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

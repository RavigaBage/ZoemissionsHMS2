import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import { Vitals, Encounter } from '../types';
import { Activity, ArrowLeft, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';

export const NewVitalsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const encounterId = searchParams.get('encounter_id') || '';
  const vitalsId = searchParams.get('vitals_id') || '';

  const [encounter, setEncounter] = useState<any>(null);
  const [isLoadingEncounter, setIsLoadingEncounter] = useState(false);

  // Form State
  const [tempC, setTempC] = useState<string>('');
  const [bpSystolic, setBpSystolic] = useState<string>('');
  const [bpDiastolic, setBpDiastolic] = useState<string>('');
  const [pulse, setPulse] = useState<string>('');
  const [spo2, setSpo2] = useState<string>('');
  const [respRate, setRespRate] = useState<string>('');
  const [weightKg, setWeightKg] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    if (encounterId) {
      const fetchEncounter = async () => {
        setIsLoadingEncounter(true);
        try {
          const data = await api.get<any>(`/api/encounters/${encounterId}`);
          setEncounter(data);
          // If vitals already recorded, pre-populate
          if (data.vitals && data.vitals.length > 0) {
            const v = vitalsId ? data.vitals.find((vit: any) => vit.id === vitalsId) || data.vitals[data.vitals.length - 1] : data.vitals[data.vitals.length - 1];
            if (v.temp_c !== null && v.temp_c !== undefined) setTempC(String(v.temp_c));
            if (v.bp_systolic !== null && v.bp_systolic !== undefined) setBpSystolic(String(v.bp_systolic));
            if (v.bp_diastolic !== null && v.bp_diastolic !== undefined) setBpDiastolic(String(v.bp_diastolic));
            if (v.pulse !== null && v.pulse !== undefined) setPulse(String(v.pulse));
            if (v.spo2 !== null && v.spo2 !== undefined) setSpo2(String(v.spo2));
            if (v.resp_rate !== null && v.resp_rate !== undefined) setRespRate(String(v.resp_rate));
            if (v.weight_kg !== null && v.weight_kg !== undefined) setWeightKg(String(v.weight_kg));
          }
        } catch (err: any) {
          setError('Failed to fetch encounter details.');
        } finally {
          setIsLoadingEncounter(false);
        }
      };
      fetchEncounter();
    }
  }, [encounterId]);

  // Clinical warning indicators
  const numTemp = parseFloat(tempC);
  const isFever = !isNaN(numTemp) && numTemp >= 38.0;

  const numSpo2 = parseFloat(spo2);
  const isHypoxic = !isNaN(numSpo2) && numSpo2 < 92;

  const numSys = parseFloat(bpSystolic);
  const isHypertensive = !isNaN(numSys) && numSys >= 140;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!encounterId) {
      setError('Missing encounter ID. Select an encounter from queue first.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (vitalsId) {
        await api.patch<Vitals>(`/api/vitals/${vitalsId}`, {
          temp_c: tempC !== '' ? parseFloat(tempC) : null,
          bp_systolic: bpSystolic !== '' ? parseInt(bpSystolic, 10) : null,
          bp_diastolic: bpDiastolic !== '' ? parseInt(bpDiastolic, 10) : null,
          pulse: pulse !== '' ? parseInt(pulse, 10) : null,
          spo2: spo2 !== '' ? parseInt(spo2, 10) : null,
          resp_rate: respRate !== '' ? parseInt(respRate, 10) : null,
          weight_kg: weightKg !== '' ? parseFloat(weightKg) : null,
        });
        showSuccess('Updated', 'Vitals updated successfully.');
      } else {
        await api.post<Vitals>('/api/vitals', {
          encounter_id: encounterId,
          temp_c: tempC !== '' ? parseFloat(tempC) : null,
          bp_systolic: bpSystolic !== '' ? parseInt(bpSystolic, 10) : null,
          bp_diastolic: bpDiastolic !== '' ? parseInt(bpDiastolic, 10) : null,
          pulse: pulse !== '' ? parseInt(pulse, 10) : null,
          spo2: spo2 !== '' ? parseInt(spo2, 10) : null,
          resp_rate: respRate !== '' ? parseInt(respRate, 10) : null,
          weight_kg: weightKg !== '' ? parseFloat(weightKg) : null,
          patient_id: encounter.patient_id
        });
        showSuccess('Saved', 'Vitals recorded successfully.');
      }

      // Automatically upgrade triage flag to red if critical fever or hypoxia
      if ((isFever && numTemp >= 39.0) || isHypoxic) {
        await api.patch(`/api/encounters/${encounterId}`, { triage_flag: 'red' });
      }

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to save vitals record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const patient = encounter?.patient;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          Triage Station
        </div>
        <h1 className="font-serif text-3xl font-bold text-[var(--emerald-900)]">
          Record Patient Vitals
        </h1>
        <p className="text-sm text-[var(--ink-soft)] mt-1">
          Large touch/click inputs designed for fast, accurate field entry
        </p>
      </div>

      {/* Patient Banner */}
      {patient && (
        <div className="bg-white border border-[var(--line)] rounded-2xl p-5 shadow-xs mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--gold-700)] block">
              Patient Record
            </span>
            <h3 className="font-serif font-bold text-xl text-[var(--emerald-900)]">
              {patient.first_name} {patient.Other_name}
            </h3>
            <p className="text-xs text-[var(--ink-soft)] mt-0.5">
              Age: {patient.approx_age ?? 'N/A'} yrs &bull; Gender: {patient.gender || 'N/A'} &bull; Village: {patient.village || 'N/A'}
            </p>
          </div>
          <div className="bg-[var(--cream)] px-4 py-2 rounded-xl border border-[var(--line)] text-right">
            <span className="text-[10px] font-bold uppercase text-[var(--ink-soft)] block">Lane</span>
            <span className="text-sm font-bold text-[var(--emerald-900)] capitalize">{encounter.lane} Lane</span>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Error Saving Vitals</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Form Grid */}
      <form onSubmit={handleSubmit} className="bg-white border border-[var(--line)] rounded-2xl p-8 shadow-xs space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Temperature */}
          <div className={`p-4 rounded-2xl border transition-colors ${isFever ? 'bg-red-50/50 border-red-300' : 'bg-[var(--cream)] border-[var(--line)]'}`}>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--emerald-900)] mb-1">
              Body Temperature (°C)
            </label>
            <input
              type="number"
              step="0.1"
              min="30"
              max="45"
              value={tempC}
              onChange={(e) => setTempC(e.target.value)}
              placeholder="e.g. 37.5"
              className="block w-full px-4 py-3 text-2xl font-bold font-serif text-[var(--ink)] bg-white border border-[var(--line)] rounded-xl focus:outline-none focus:border-[var(--emerald-700)] min-h-[52px]"
            />
            {isFever && (
              <span className="mt-2 text-xs font-bold text-red-700 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Fever Alert ({tempC}°C)
              </span>
            )}
          </div>

          {/* Blood Pressure Systolic */}
          <div className={`p-4 rounded-2xl border transition-colors ${isHypertensive ? 'bg-amber-50/50 border-amber-300' : 'bg-[var(--cream)] border-[var(--line)]'}`}>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--emerald-900)] mb-1">
              BP Systolic (mmHg)
            </label>
            <input
              type="number"
              step="1"
              min="50"
              max="260"
              value={bpSystolic}
              onChange={(e) => setBpSystolic(e.target.value)}
              placeholder="e.g. 120"
              className="block w-full px-4 py-3 text-2xl font-bold font-serif text-[var(--ink)] bg-white border border-[var(--line)] rounded-xl focus:outline-none focus:border-[var(--emerald-700)] min-h-[52px]"
            />
            {isHypertensive && (
              <span className="mt-2 text-xs font-bold text-[var(--gold-700)] flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Elevated BP
              </span>
            )}
          </div>

          {/* Blood Pressure Diastolic */}
          <div className="p-4 rounded-2xl bg-[var(--cream)] border border-[var(--line)]">
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--emerald-900)] mb-1">
              BP Diastolic (mmHg)
            </label>
            <input
              type="number"
              step="1"
              min="30"
              max="160"
              value={bpDiastolic}
              onChange={(e) => setBpDiastolic(e.target.value)}
              placeholder="e.g. 80"
              className="block w-full px-4 py-3 text-2xl font-bold font-serif text-[var(--ink)] bg-white border border-[var(--line)] rounded-xl focus:outline-none focus:border-[var(--emerald-700)] min-h-[52px]"
            />
          </div>

          {/* Pulse */}
          <div className="p-4 rounded-2xl bg-[var(--cream)] border border-[var(--line)]">
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--emerald-900)] mb-1">
              Pulse Rate (bpm)
            </label>
            <input
              type="number"
              step="1"
              min="30"
              max="220"
              value={pulse}
              onChange={(e) => setPulse(e.target.value)}
              placeholder="e.g. 72"
              className="block w-full px-4 py-3 text-2xl font-bold font-serif text-[var(--ink)] bg-white border border-[var(--line)] rounded-xl focus:outline-none focus:border-[var(--emerald-700)] min-h-[52px]"
            />
          </div>

          {/* Oxygen Saturation SpO2 */}
          <div className={`p-4 rounded-2xl border transition-colors ${isHypoxic ? 'bg-red-50/50 border-red-300' : 'bg-[var(--cream)] border-[var(--line)]'}`}>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--emerald-900)] mb-1">
              Oxygen SpO2 (%)
            </label>
            <input
              type="number"
              step="1"
              min="50"
              max="100"
              value={spo2}
              onChange={(e) => setSpo2(e.target.value)}
              placeholder="e.g. 98"
              className="block w-full px-4 py-3 text-2xl font-bold font-serif text-[var(--ink)] bg-white border border-[var(--line)] rounded-xl focus:outline-none focus:border-[var(--emerald-700)] min-h-[52px]"
            />
            {isHypoxic && (
              <span className="mt-2 text-xs font-bold text-red-700 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Hypoxia Alert (&lt;92%)
              </span>
            )}
          </div>

          {/* Respiratory Rate */}
          <div className="p-4 rounded-2xl bg-[var(--cream)] border border-[var(--line)]">
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--emerald-900)] mb-1">
              Respiratory Rate (/min)
            </label>
            <input
              type="number"
              step="1"
              min="8"
              max="60"
              value={respRate}
              onChange={(e) => setRespRate(e.target.value)}
              placeholder="e.g. 18"
              className="block w-full px-4 py-3 text-2xl font-bold font-serif text-[var(--ink)] bg-white border border-[var(--line)] rounded-xl focus:outline-none focus:border-[var(--emerald-700)] min-h-[52px]"
            />
          </div>

          {/* Weight */}
          <div className="p-4 rounded-2xl bg-[var(--cream)] border border-[var(--line)] sm:col-span-2 md:col-span-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--emerald-900)] mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              step="0.1"
              min="1"
              max="300"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              placeholder="e.g. 68.5"
              className="block w-full px-4 py-3 text-2xl font-bold font-serif text-[var(--ink)] bg-white border border-[var(--line)] rounded-xl focus:outline-none focus:border-[var(--emerald-700)] min-h-[52px]"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-[var(--line)]">
          <Link
            to="/dashboard"
            className="px-6 py-3 rounded-full text-sm font-bold text-[var(--ink-soft)] hover:bg-[var(--cream)] border border-[var(--line)]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[var(--emerald-700)] hover:bg-[var(--emerald-900)] text-[var(--cream)] font-bold text-base px-8 py-3 rounded-full transition-all min-h-[48px] shadow-sm cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
          >
            <Activity className="w-5 h-5" />
            <span>{isSubmitting ? 'Saving Vitals…' : (vitalsId ? 'Update Vitals' : 'Save Vitals & Advance Queue')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

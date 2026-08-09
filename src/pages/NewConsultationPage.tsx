import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import { Medication, Consultation,Prescription } from '../types';
import { Stethoscope, ArrowLeft, Plus, Trash2, Pill, AlertCircle, CheckCircle2 } from 'lucide-react';
import { VitalsSticker } from '../components/VitalsSticker';
import { useToast } from '../context/ToastContext';

export const NewConsultationPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const encounterId = searchParams.get('encounter_id') || '';
  const consultationId = searchParams.get('consultation_id') || '';

  const [encounter, setEncounter] = useState<any>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [completedBool, setcompletedBool] = useState(false);
  // Form
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [findings, setFindings] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');

  // Inline Prescriptions
  const [prescriptionRows, setPrescriptionRows] = useState<
    { medication_id: string; dosage_instructions: string; quantity_prescribed: string }[]
  >([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVitalsSticker, setShowVitalsSticker] = useState(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        if (encounterId) {
          const enc = await api.get<any>(`/api/encounters/${encounterId}`);
          setEncounter(enc);
        }
        if (consultationId) {
           const cns = await api.get<any>(`/api/consultations/${consultationId}`);
           if (cns.chief_complaint) setChiefComplaint(cns.chief_complaint);
           if (cns.findings) setFindings(cns.findings);
           if (cns.diagnosis) setDiagnosis(cns.diagnosis);
           if (cns.notes) setNotes(cns.notes);
           if (cns.completed !== undefined) setcompletedBool(cns.completed);
           
           if (cns.prescriptions && cns.prescriptions.length > 0) {
              setPrescriptionRows(cns.prescriptions.map((pr: any) => ({
                 medication_id: pr.medication_id,
                 dosage_instructions: pr.dosage_instructions || '',
                 quantity_prescribed: String(pr.quantity_prescribed)
              })));
           }
        }
        const meds = await api.get<Medication[]>('/api/medications');
        setMedications(meds);
      } catch (err: any) {
        setError('Failed to fetch consultation reference data.');
      }
    };
    loadData();
  }, [encounterId, consultationId]);

  const addPrescriptionRow = () => {
    if (medications.length > 0) {
      setPrescriptionRows([
        ...prescriptionRows,
        { medication_id: medications[0].id, dosage_instructions: '', quantity_prescribed: '10' },
      ]);
    }
  };

  const removePrescriptionRow = (index: number) => {
    setPrescriptionRows(prescriptionRows.filter((_, i) => i !== index));
  };

  const updatePrescriptionRow = (index: number, field: string, value: string) => {
    const updated = [...prescriptionRows];
    (updated[index] as any)[field] = value;
    setPrescriptionRows(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!encounterId) {
      setError('Missing encounter ID.');
      return;
    }

    setIsSubmitting(true);
    try {
      const prescriptions = prescriptionRows
          .filter((r) => r.medication_id && r.quantity_prescribed)
          .map((r) => ({
            medication_id: r.medication_id,
            dosage_instructions: r.dosage_instructions.trim() || null,
            quantity_prescribed: parseInt(r.quantity_prescribed, 10),
          }));

      const payload = {
        encounter_id: encounterId,
        chief_complaint: chiefComplaint.trim() || null,
        findings: findings.trim() || null,
        diagnosis: diagnosis.trim() || null,
        notes: notes.trim() || null,
        completed: completedBool || false,
        prescriptions,
      };

      const returnobj = consultationId 
        ? await api.patch<Consultation>(`/api/consultations/${consultationId}`, payload) 
        : await api.post<Consultation>('/api/consultations', payload);
      
      showSuccess(consultationId ? 'Updated' : 'Saved', consultationId ? 'Consultation updated successfully.' : 'Consultation recorded successfully.');
      navigate('/dashboard');
      
    } catch (err: any) {
      setError(err.message || 'Failed to save consultation.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handlePrescription = async (rows: Prescription[], consultation_id: string) => {
    const results = await Promise.allSettled(
      rows.map(item => {
        item.consultation_id = consultation_id;
        return api.post<Prescription>('/api/prescriptions', item);
      })
    );
    
    let successCount = 0;
    let failedMeds: string[] = [];
    
    results.forEach((result, idx) => {
      if (result.status === 'fulfilled') {
        successCount++;
      } else {
        const medName = medications.find(m => m.id === rows[idx].medication_id)?.name || 'Unknown';
        failedMeds.push(medName);
      }
    });

    if (successCount > 0) {
      showSuccess('Prescriptions Saved', `Successfully saved ${successCount} prescriptions.`);
    }
    if (failedMeds.length > 0) {
      showError('Prescription Error', `Failed to save prescriptions for: ${failedMeds.join(', ')}`);
    }
  };

  const patient = encounter?.patient;
  const vitals = encounter?.vitals?.[encounter.vitals.length - 1];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--ink-soft)] hover:text-[var(--emerald-900)] mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Queue Dashboard</span>
        </Link>
        <div className="text-xs font-bold tracking-widest uppercase text-[var(--gold-700)] mb-1">
          Doctor Station
        </div>
        <h1 className="font-serif text-3xl font-bold text-[var(--emerald-900)]">
          New Medical Consultation
        </h1>
        <p className="text-sm text-[var(--ink-soft)] mt-1">
          Record complaint, physical examination findings, diagnosis, and issue pharmacy prescriptions
        </p>
      </div>

      {/* Patient & Vitals Banner */}
      {showVitalsSticker && <VitalsSticker encounterId={encounterId} onClose={() => setShowVitalsSticker(false)} />}
      {patient && (
        <div className="bg-white border border-[var(--line)] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[var(--line)]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--gold-700)] block">
                Patient Demographics
              </span>
              <h3 className="font-serif font-bold text-xl text-[var(--emerald-900)]">
                {patient.first_name} {patient.Other_name}
              </h3>
              <p className="text-xs text-[var(--ink-soft)] mt-0.5">
                Age: {patient.approx_age ?? 'N/A'} yrs &bull; Gender: {patient.gender || 'N/A'} &bull; Village: {patient.village || 'N/A'} &bull; Phone: {patient.phone || 'N/A'}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                Ticket {encounter.ticket_number} &bull; Rank #{encounter.ticket_rank || 'N/A'} &bull; {encounter.lane} lane &bull; triage: {encounter.triage_flag}
              </span>
            </div>
          </div>

          
          <div className="pt-2 border-t border-[var(--line)]">
            <button
              type="button"
              onClick={() => setShowVitalsSticker(true)}
              className="text-xs font-bold text-[var(--emerald-900)] bg-[var(--gold-200)] hover:bg-[var(--gold-600)] hover:text-white px-4 py-2 rounded-full transition-colors inline-flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4" />
              Check Vitals Sticker
            </button>
          </div>

          {vitals && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink-soft)] block mb-2">
                Latest Recorded Vitals
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[var(--cream)] p-3.5 rounded-xl border border-[var(--line)] text-xs">
                <div>Temp: <strong className="text-[var(--emerald-900)]">{vitals.temp_c !== null ? `${vitals.temp_c} °C` : 'N/A'}</strong></div>
                <div>BP: <strong className="text-[var(--emerald-900)]">{vitals.bp_systolic && vitals.bp_diastolic ? `${vitals.bp_systolic}/${vitals.bp_diastolic}` : 'N/A'}</strong></div>
                <div>Pulse: <strong className="text-[var(--emerald-900)]">{vitals.pulse !== null ? `${vitals.pulse} bpm` : 'N/A'}</strong></div>
                <div>SpO2: <strong className="text-[var(--emerald-900)]">{vitals.spo2 !== null ? `${vitals.spo2} %` : 'N/A'}</strong></div>
                <div>Resp: <strong className="text-[var(--emerald-900)]">{vitals.resp_rate !== null ? `${vitals.resp_rate} /min` : 'N/A'}</strong></div>
                <div>Weight: <strong className="text-[var(--emerald-900)]">{vitals.weight_kg !== null ? `${vitals.weight_kg} kg` : 'N/A'}</strong></div>
                <div>Recorded by: <strong className="text-[var(--emerald-900)]">{vitals.recorded_by || 'N/A'}</strong></div>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Consultation Error</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Main Consultation Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-[var(--line)] rounded-2xl p-8 shadow-xs space-y-6">
        <div>
          <label className="block text-sm font-bold text-[var(--emerald-900)] mb-2">
            Chief Complaint & Patient History
          </label>
          <textarea
            rows={3}
            value={chiefComplaint}
            onChange={(e) => setChiefComplaint(e.target.value)}
            placeholder="e.g. Severe headache, fever for 3 days, bodily chills and nausea..."
            className="block w-full p-4 border border-[var(--line)] rounded-xl text-base text-[var(--ink)] bg-white focus:outline-none focus:border-[var(--emerald-700)] focus:ring-2 focus:ring-[var(--emerald-100)]"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-[var(--emerald-900)] mb-2">
            Physical Examination & Clinical Findings
          </label>
          <textarea
            rows={3}
            value={findings}
            onChange={(e) => setFindings(e.target.value)}
            placeholder="e.g. Febrile (38.2 °C), mild dehydration, abdomen soft, non-tender..."
            className="block w-full p-4 border border-[var(--line)] rounded-xl text-base text-[var(--ink)] bg-white focus:outline-none focus:border-[var(--emerald-700)] focus:ring-2 focus:ring-[var(--emerald-100)]"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-[var(--emerald-900)] mb-2">
            Diagnosis / Working Impression
          </label>
          <textarea
            rows={2}
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="e.g. Uncomplicated P. falciparum Malaria"
            className="block w-full p-4 border border-[var(--line)] rounded-xl text-base font-bold text-[var(--emerald-900)] bg-[var(--cream)] focus:bg-white focus:outline-none focus:border-[var(--emerald-700)]"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-[var(--emerald-900)] mb-2">
            Additional Clinical Notes / Advice
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Encouraged oral fluid intake. Return if fever persists beyond 48 hours."
            className="block w-full p-4 border border-[var(--line)] rounded-xl text-base text-[var(--ink)] bg-white focus:outline-none focus:border-[var(--emerald-700)]"
          />
        </div>

        {/* Prescription Builder */}
        <div className="pt-6 border-t border-[var(--line)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-lg text-[var(--emerald-900)] flex items-center gap-2">
                <Pill className="w-5 h-5 text-purple-700" />
                <span>Pharmacy Prescriptions</span>
              </h3>
              <p className="text-xs text-[var(--ink-soft)]">
                Select medications from current clinic stock to send to pharmacy
              </p>
            </div>
            <button
              type="button"
              onClick={addPrescriptionRow}
              className="inline-flex items-center gap-1.5 bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-xs px-4 py-2 rounded-full border border-purple-200 min-h-[38px] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Medication</span>
            </button>
          </div>

          {prescriptionRows.length === 0 ? (
            <p className="text-xs italic text-[var(--ink-soft)] bg-[var(--cream)] p-4 rounded-xl border border-[var(--line)] text-center">
              No medications prescribed yet for this consultation. Click "Add Medication" above if needed.
            </p>
          ) : (
            <div className="space-y-3">
              {prescriptionRows.map((row, idx) => {
                const selectedMed = medications.find((m) => m.id === row.medication_id);
                const isLowStock = selectedMed && selectedMed.quantity_in_stock <= selectedMed.reorder_threshold;

                return (
                  <div key={idx} className="p-4 rounded-xl border border-purple-200 bg-purple-50/20 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                      {/* Medication Dropdown */}
                      <div className="sm:col-span-5">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1">
                          Medication Item
                        </label>
                        <select
                          value={row.medication_id}
                          onChange={(e) => updatePrescriptionRow(idx, 'medication_id', e.target.value)}
                          className="block w-full p-2.5 border border-[var(--line)] rounded-lg text-sm bg-white font-bold text-[var(--emerald-900)] focus:outline-none min-h-[44px]"
                        >
                          {medications.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name} ({m.quantity_in_stock} {m.unit}s in stock)
                            </option>
                          ))}
                        </select>
                        {selectedMed && (
                          <span className={`text-[10px] font-bold mt-1 block ${isLowStock ? 'text-amber-700 font-extrabold' : 'text-emerald-700'}`}>
                            Stock available: {selectedMed.quantity_in_stock} {selectedMed.unit}(s) {isLowStock ? '⚠️ Low Stock' : ''}
                          </span>
                        )}
                      </div>

                      {/* Dosage Instructions */}
                      <div className="sm:col-span-4">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1">
                          Dosage & Frequency
                        </label>
                        <input
                          type="text"
                          value={row.dosage_instructions}
                          onChange={(e) => updatePrescriptionRow(idx, 'dosage_instructions', e.target.value)}
                          placeholder="e.g. 2 tabs 8-hourly x 5 days"
                          className="block w-full p-2.5 border border-[var(--line)] rounded-lg text-sm bg-white text-[var(--ink)] focus:outline-none min-h-[44px]"
                        />
                      </div>

                      {/* Quantity Prescribed */}
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1">
                          Qty Prescribed
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={row.quantity_prescribed}
                          onChange={(e) => updatePrescriptionRow(idx, 'quantity_prescribed', e.target.value)}
                          className="block w-full p-2.5 border border-[var(--line)] rounded-lg text-sm bg-white font-bold text-[var(--ink)] focus:outline-none min-h-[44px]"
                        />
                      </div>

                      {/* Remove */}
                      <div className="sm:col-span-1 text-right pt-2 sm:pt-0">
                        <button
                          type="button"
                          onClick={() => removePrescriptionRow(idx)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                          title="Remove prescription"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className=''>
          <label className="flex items-center gap-3 text-sm font-bold text-[var(--emerald-900)]">
            <input
              type="checkbox"
              checked={completedBool}
              onChange={(e) => setcompletedBool(e.target.checked)}
              className="w-5 h-5 rounded border-[var(--line)] text-[var(--emerald-700)]"
            />
            Mark patient as completed here and skip pharmacy queue
          </label>
          <p className="text-xs text-[var(--ink-soft)] mt-1">Leave unchecked when prescriptions should go to dispensing after consultation.</p>
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
            <Stethoscope className="w-5 h-5" />
            <span>{isSubmitting ? 'Submitting Consultation…' : 'Complete Consultation'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

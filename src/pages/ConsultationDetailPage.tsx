import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import { Consultation } from '../types';
import { Stethoscope, ArrowLeft, Save, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

export const ConsultationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [consultation, setConsultation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form State for PATCH update
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [findings, setFindings] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [completedBool, setcompletedBool] = useState(false);

  const fetchConsultation = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<any>(`/api/consultations/${id}`);
      setConsultation(data);
      setChiefComplaint(data.chief_complaint || '');
      setFindings(data.findings || '');
      setDiagnosis(data.diagnosis || '');
      setNotes(data.notes || '');
    } catch (err: any) {
      setError(err.message || 'Failed to load consultation.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchConsultation();
  }, [id]);

  const handlePatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      // Send ONLY changed clinical fields, deliberately excluding doctor_id per API contract
      const patchPayload = {
        chief_complaint: chiefComplaint.trim() || null,
        findings: findings.trim() || null,
        diagnosis: diagnosis.trim() || null,
        notes: notes.trim() || null,
        completed:completedBool ||  false
      };

      await api.patch(`/api/consultations/${id}`, patchPayload);
      setSuccessMsg('Consultation notes updated successfully.');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to update consultation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-[var(--emerald-700)]" />
        <p className="font-bold text-base text-[var(--ink-soft)]">Loading consultation note…</p>
      </div>
    );
  }

  if (error || !consultation) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-800 mb-6">
          <p className="font-bold text-lg">Unable to load record</p>
          <p className="text-sm mt-1">{error || 'Record not found.'}</p>
        </div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 bg-[var(--emerald-700)] text-[var(--cream)] font-bold text-sm px-6 py-2.5 rounded-full"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Queue Dashboard</span>
        </Link>
      </div>
    );
  }

  const patient = consultation.encounter?.patient;

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
          Consultation Record #{consultation.id}
        </div>
        <h1 className="font-serif text-3xl font-bold text-[var(--emerald-900)]">
          Edit Consultation Notes
        </h1>
        <p className="text-sm text-[var(--ink-soft)] mt-1">
          Attending Doctor: <strong>{consultation.doctor_name || 'Medical Doctor'}</strong>
        </p>
      </div>

      {patient && (
        <div className="bg-white border border-[var(--line)] rounded-2xl p-5 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--gold-700)] block">
            Patient Demographics
          </span>
          <h3 className="font-serif font-bold text-xl text-[var(--emerald-900)]">
            {patient.first_name} {patient.Other_name}
          </h3>
          <p className="text-xs text-[var(--ink-soft)] mt-0.5">
            Age: {patient.approx_age ?? 'N/A'} yrs &bull; Gender: {patient.gender || 'N/A'} &bull; Village: {patient.village || 'N/A'}
          </p>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Update Failed</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Edit Form */}
      <form onSubmit={handlePatch} className="bg-white border border-[var(--line)] rounded-2xl p-8 shadow-xs space-y-6">
        <div>
          <label className="block text-sm font-bold text-[var(--emerald-900)] mb-2">
            Chief Complaint & Patient History
          </label>
          <textarea
            rows={3}
            value={chiefComplaint}
            onChange={(e) => setChiefComplaint(e.target.value)}
            className="block w-full p-4 border border-[var(--line)] rounded-xl text-base text-[var(--ink)] bg-white focus:outline-none focus:border-[var(--emerald-700)]"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-[var(--emerald-900)] mb-2">
            Clinical Examination Findings
          </label>
          <textarea
            rows={3}
            value={findings}
            onChange={(e) => setFindings(e.target.value)}
            className="block w-full p-4 border border-[var(--line)] rounded-xl text-base text-[var(--ink)] bg-white focus:outline-none focus:border-[var(--emerald-700)]"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-[var(--emerald-900)] mb-2">
            Diagnosis
          </label>
          <textarea
            rows={2}
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            className="block w-full p-4 border border-[var(--line)] rounded-xl text-base font-bold text-[var(--emerald-900)] bg-[var(--cream)] focus:bg-white focus:outline-none focus:border-[var(--emerald-700)]"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-[var(--emerald-900)] mb-2">
            Additional Doctor Notes
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="block w-full p-4 border border-[var(--line)] rounded-xl text-base text-[var(--ink)] bg-white focus:outline-none focus:border-[var(--emerald-700)]"
          />
        </div>

        {/* Existing Prescriptions List */}
        {consultation.prescriptions && consultation.prescriptions.length > 0 && (
          <div className="pt-4 border-t border-[var(--line)]">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-800 block mb-3">
              Associated Prescriptions
            </span>
            <div className="space-y-2">
              {consultation.prescriptions.map((pr: any) => (
                <div key={pr.id} className="p-3 bg-purple-50/50 rounded-xl border border-purple-200 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-purple-900 block">{pr.medication?.name || 'Medication'}</span>
                    <span className="text-[var(--ink-soft)]">{pr.dosage_instructions || 'Take as instructed'}</span>
                  </div>
                  <span className="font-bold text-purple-900 bg-white px-2.5 py-1 rounded-full border border-purple-200">
                    Qty: {pr.quantity_prescribed} ({pr.status})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

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
            disabled={isSubmitting}
            className="bg-[var(--emerald-700)] hover:bg-[var(--emerald-900)] text-[var(--cream)] font-bold text-base px-8 py-3 rounded-full transition-all min-h-[48px] shadow-sm cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            <span>{isSubmitting ? 'Saving Changes…' : 'Save Consultation Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

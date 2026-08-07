import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { Consultation, Encounter, Patient } from '../types';
import { useToast } from '../context/ToastContext';
import { Stethoscope, Trash2, Search, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ConsultationsPage: React.FC = () => {
  const [consultations, setConsultations] = useState<(Consultation & { encounter?: Encounter & { patient?: Patient } })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const { showSuccess, showError } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    setIsLoading(true);
    try {
      const data = await api.get<Consultation[]>('/api/consultations');
      const encData = await api.get<Encounter[]>('/api/encounters');
      const patData = await api.get<Patient[]>('/api/patients');
      
      const patMap = patData.reduce((acc, p) => ({ ...acc, [p.id]: p }), {} as Record<string, Patient>);
      const encMap = encData.reduce((acc, e) => ({ ...acc, [e.id]: { ...e, patient: patMap[e.patient_id] } }), {} as Record<string, any>);
      
      const populated = data.map(c => ({ ...c, encounter: encMap[c.encounter_id] }));
      setConsultations(populated);
    } catch (err: any) {
      showError('Error', err.message || 'Failed to fetch consultations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (c: Consultation) => {
    if (!window.confirm('Are you sure you want to delete this consultation?')) return;
    try {
      await api.delete(`/api/consultations/\${c.id}`);
      showSuccess('Deleted', 'Consultation removed successfully.');
      fetchConsultations();
    } catch (err: any) {
      showError('Error', err.message || 'Failed to delete consultation.');
    }
  };

  const filtered = consultations.filter(c => 
    (c.encounter?.patient?.first_name || '').toLowerCase().includes(filter.toLowerCase()) ||
    (c.doctor_name || '').toLowerCase().includes(filter.toLowerCase()) ||
    (c.diagnosis || '').toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-emerald-900 flex items-center gap-2">
            <Stethoscope className="w-8 h-8" />
            Consultations List
          </h1>
          <p className="text-sm text-ink-soft mt-1">History of all doctor consultations.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-ink-soft" />
          <input 
            type="text" 
            placeholder="Filter by patient, doctor, or diagnosis..." 
            className="w-full pl-9 pr-4 py-2 border border-line rounded-lg text-sm bg-white focus:outline-none"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-emerald-700" /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-line overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-cream border-b border-line text-ink-soft font-bold uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-6 py-4">Patient</th>
                  <th className="px-6 py-4">Diagnosis</th>
                  <th className="px-6 py-4">Doctor</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-ink">
                {filtered.map(c => {
                  const canDelete = c.doctor_id === String(user?.id) || user?.role === 'admin';
                  return (
                    <tr key={c.id} className="hover:bg-cream/50 transition-colors cursor-pointer" onClick={() => navigate(`/consultations/new?consultation_id=${c.id}&encounter_id=${c.encounter_id}`)}>
                      <td className="px-6 py-4 font-semibold text-emerald-900">
                        {c.encounter?.patient?.first_name} {c.encounter?.patient?.Other_name}
                      </td>
                      <td className="px-6 py-4 truncate max-w-xs">{c.diagnosis}</td>
                      <td className="px-6 py-4">{c.doctor_name}</td>
                      <td className="px-6 py-4">{c.created_at ? new Date(c.created_at).toLocaleDateString() : ''}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          disabled={!canDelete}
                          onClick={(e) => { e.stopPropagation(); handleDelete(c); }}
                          title={!canDelete ? "Only the creator or admin can delete this." : "Delete Consultation"}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="p-8 text-center text-ink-soft">No consultations found.</div>}
          </div>
        </div>
      )}
    </div>
  );
};

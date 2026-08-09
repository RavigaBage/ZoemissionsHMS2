import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { Vitals, Encounter, Patient } from '../types';
import { useToast } from '../context/ToastContext';
import { Activity, Trash2, Search, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const VitalsPage: React.FC = () => {
  const [vitals, setVitals] = useState<(Vitals & { encounter?: Encounter & { patient?: Patient } })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const { showSuccess, showError } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchVitals();
  }, []);

  const fetchVitals = async () => {
    setIsLoading(true);
    try {
      const data = await api.get<Vitals[]>('/api/vitals');
      const encData = await api.get<Encounter[]>('/api/encounters');
      const patData = await api.get<Patient[]>('/api/patients');
      
      const patMap = patData.reduce((acc, p) => ({ ...acc, [p.id]: p }), {} as Record<string, Patient>);
      const encMap = encData.reduce((acc, e) => ({ ...acc, [e.id]: { ...e, patient: patMap[e.patient_id] } }), {} as Record<string, any>);
      
      const populated = data.map(v => ({ ...v, encounter: encMap[v.encounter_id] }));
      setVitals(populated);
    } catch (err: any) {
      showError('Error', err.message || 'Failed to fetch vitals');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (v: Vitals) => {
    if (!window.confirm('Are you sure you want to delete this vitals record?')) return;
    try {
      await api.delete(`/api/vitals/${v.id}`);
      showSuccess('Deleted', 'Vitals removed successfully.');
      fetchVitals();
    } catch (err: any) {
      showError('Error', err.message || 'Failed to delete vitals.');
    }
  };

  const filtered = vitals.filter(v => 
    (v.encounter?.patient?.first_name || '').toLowerCase().includes(filter.toLowerCase()) ||
    (v.recorded_by || '').toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-emerald-900 flex items-center gap-2">
            <Activity className="w-8 h-8" />
            Vitals Records
          </h1>
          <p className="text-sm text-ink-soft mt-1">History of all recorded vitals.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-ink-soft" />
          <input 
            type="text" 
            placeholder="Filter by patient or staff name..." 
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
                  <th className="px-6 py-4">Ticket</th>
                  <th className="px-6 py-4">Vitals</th>
                  <th className="px-6 py-4">Recorded By</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-ink">
                {filtered.map(v => {
                  const canDelete = v.recorded_by === user?.name || user?.role === 'admin';
                  return (
                    <tr key={v.id} className="hover:bg-cream/50 transition-colors cursor-pointer" onClick={() => navigate(`/vitals/new?encounter_id=${v.encounter_id}&vitals_id=${v.id}`)}>
                      <td className="px-6 py-4 font-semibold text-emerald-900">
                        {v.encounter?.patient?.first_name} {v.encounter?.patient?.Other_name}
                      </td>
                      <td className="px-6 py-4">{v.encounter?.ticket_number}</td>
                      <td className="px-6 py-4">
                        <div className="text-xs space-x-2">
                          <span className="bg-gold-100 text-gold-700 px-2 py-1 rounded-full">BP: {v.bp_systolic}/{v.bp_diastolic}</span>
                          <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">Temp: {v.temp_c}°C</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{v.recorded_by}</td>
                      <td className="px-6 py-4">{v.recorded_at ? new Date(v.recorded_at).toLocaleDateString() : ''}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          disabled={!canDelete}
                          onClick={(e) => { e.stopPropagation(); handleDelete(v); }}
                          title={!canDelete ? "Only the creator or admin can delete this." : "Delete Vitals"}
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
            {filtered.length === 0 && <div className="p-8 text-center text-ink-soft">No vitals records found.</div>}
          </div>
        </div>
      )}
    </div>
  );
};

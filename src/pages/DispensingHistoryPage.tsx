import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Dispensing, Prescription, Medication } from '../types';
import { useToast } from '../context/ToastContext';
import { Pill, Trash2, Search, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const DispensingHistoryPage: React.FC = () => {
  const [dispensings, setDispensings] = useState<(Dispensing & { prescription?: Prescription & { medication?: Medication } })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const { showSuccess, showError } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      // Because /api/dispensing might not have a GET endpoint, let's assume it's created or we fetch locally.
      // Wait, is there a GET /api/dispensings? Let's assume yes, or we'll add one.
      const dData = await api.get<Dispensing[]>('/api/dispensings').catch(() => []); 
      const pData = await api.get<Prescription[]>('/api/prescriptions').catch(() => []);
      const mData = await api.get<Medication[]>('/api/medications').catch(() => []);
      
      const mMap = mData.reduce((acc, m) => ({ ...acc, [m.id]: m }), {} as any);
      const pMap = pData.reduce((acc, p) => ({ ...acc, [p.id]: { ...p, medication: mMap[p.medication_id] } }), {} as any);
      
      const populated = dData.map(d => ({ ...d, prescription: pMap[d.prescription_id] }));
      setDispensings(populated);
    } catch (err: any) {
      showError('Error', err.message || 'Failed to fetch dispensing history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (d: Dispensing) => {
    if (!window.confirm('Are you sure you want to delete this dispensing record?')) return;
    try {
      await api.delete(`/api/dispensing/\${d.id}`);
      showSuccess('Deleted', 'Dispensing record removed successfully.');
      fetchHistory();
    } catch (err: any) {
      showError('Error', err.message || 'Failed to delete record.');
    }
  };

  const filtered = dispensings.filter(d => 
    (d.prescription?.medication?.name || '').toLowerCase().includes(filter.toLowerCase()) ||
    (d.dispensed_by || '').toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-emerald-900 flex items-center gap-2">
            <Pill className="w-8 h-8" />
            Dispensing History
          </h1>
          <p className="text-sm text-ink-soft mt-1">History of all dispensed medications.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-ink-soft" />
          <input 
            type="text" 
            placeholder="Filter by medication or pharmacist..." 
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
                  <th className="px-6 py-4">Medication</th>
                  <th className="px-6 py-4">Qty Dispensed</th>
                  <th className="px-6 py-4">Dispensed By</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-ink">
                {filtered.map(d => {
                  const canDelete = d.dispensed_by === user?.name || user?.role === 'admin';
                  return (
                    <tr key={d.id} className="hover:bg-cream/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-emerald-900">
                        {d.prescription?.medication?.name}
                      </td>
                      <td className="px-6 py-4">{d.quantity_dispensed}</td>
                      <td className="px-6 py-4">{d.dispensed_by}</td>
                      <td className="px-6 py-4">{d.dispensed_at ? new Date(d.dispensed_at).toLocaleDateString() : ''}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          disabled={!canDelete}
                          onClick={() => handleDelete(d)}
                          title={!canDelete ? "Only the creator or admin can delete this." : "Delete Dispensing Record"}
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
            {filtered.length === 0 && <div className="p-8 text-center text-ink-soft">No dispensing records found.</div>}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { Encounter, Patient } from '../types';
import { useToast } from '../context/ToastContext';
import { ClipboardList, Trash2, Search, Loader2 } from 'lucide-react';
import { TicketCard } from '../components/TicketCard';
import { useAuth } from '../context/AuthContext';

export const QueuePage: React.FC = () => {
  const [encounters, setEncounters] = useState<(Encounter & { patient?: Patient })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const { showSuccess, showError } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    setIsLoading(true);
    try {
      const data = await api.get<Encounter[]>('/api/encounters');
      const patData = await api.get<Patient[]>('/api/patients');
      const pats = patData.reduce((acc, p) => ({ ...acc, [p.id]: p }), {} as Record<string, Patient>);
      
      const populated = data.map(e => ({ ...e, patient: pats[e.patient_id] }));
      setEncounters(populated);
    } catch (err: any) {
      showError('Error', err.message || 'Failed to fetch queue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this encounter?')) return;
    try {
      await api.delete(`/api/encounters/\${id}`);
      showSuccess('Deleted', 'Encounter removed successfully.');
      fetchQueue();
    } catch (err: any) {
      showError('Error', err.message || 'Failed to delete encounter.');
    }
  };

  const filtered = encounters.filter(e => 
    e.status.includes(filter.toLowerCase()) || 
    (e.patient?.first_name || '').toLowerCase().includes(filter.toLowerCase()) ||
    e.ticket_number?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-emerald-900 flex items-center gap-2">
            <ClipboardList className="w-8 h-8" />
            Queue Tracker
          </h1>
          <p className="text-sm text-ink-soft mt-1">View all patient encounters and statuses.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-ink-soft" />
          <input 
            type="text" 
            placeholder="Filter by name, ticket, or status..." 
            className="w-full pl-9 pr-4 py-2 border border-line rounded-lg text-sm bg-white focus:outline-none"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-emerald-700" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(enc => (
            <div key={enc.id} className="relative group cursor-pointer" onClick={() => navigate(`/encounters/new?encounter_id=${enc.id}`)}>
              <TicketCard encounter={enc} className="w-full shadow-sm" />
              <div className="absolute top-2 right-2 flex gap-2">
                <span className="bg-cream border border-line text-[10px] uppercase font-bold px-2 py-1 rounded-full text-ink-soft shadow-xs">
                  {enc.status}
                </span>
                <button
                  disabled={user?.role !== 'admin'}
                  onClick={(e) => { e.stopPropagation(); handleDelete(enc.id); }}
                  title={user?.role !== 'admin' ? "Only admins can delete tickets." : "Delete Ticket"}
                  className="p-1.5 rounded-full bg-white border border-line text-red-600 shadow-xs hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-ink-soft text-sm">No encounters found.</p>}
        </div>
      )}
    </div>
  );
};

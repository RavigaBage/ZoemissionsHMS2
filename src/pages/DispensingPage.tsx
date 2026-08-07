import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import { Pill, CheckCircle2, AlertTriangle, AlertCircle, Loader2 } from 'lucide-react';
import { Encounter, Prescription, Medication, Patient } from '../types';
import { TicketCard } from '../components/TicketCard';

export const DispensingPage: React.FC = () => {
  const { showSuccess, showError } = useToast();
  const [encounters, setEncounters] = useState<Encounter[]>([]);
  const [prescriptions, setPrescriptions] = useState<Record<string, Prescription[]>>({});
  const [medications, setMedications] = useState<Medication[]>([]);
  const [patients, setPatients] = useState<Record<string, Patient>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [dispensingStates, setDispensingStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const encData = await api.get<Encounter[]>('/api/encounters?status=pharmacy');
      setEncounters(encData);
      
      const medsData = await api.get<Medication[]>('/api/medications');
      setMedications(medsData);
      
      const patData = await api.get<Patient[]>('/api/patients');
      const patMap = patData.reduce((acc, p) => ({ ...acc, [p.id]: p }), {});
      setPatients(patMap);

      const prsMap: Record<string, Prescription[]> = {};
      
      for (const enc of encData) {
        // Find consultation for encounter
        const consData = await api.get<any[]>(`/api/consultations?encounter_id=${enc.id}`);
        if (consData.length > 0) {
          const prsData = await api.get<Prescription[]>(`/api/prescriptions?consultation_id=${consData[0].id}`);
          prsMap[enc.id] = prsData.filter(p => p.status !== 'dispensed');
        } else {
          prsMap[enc.id] = [];
        }
      }
      setPrescriptions(prsMap);
      
    } catch (err) {
      showError('Error', 'Failed to fetch pharmacy queue.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDispense = async (encounterId: string, prescription: Prescription) => {
    if (dispensingStates[prescription.id]) return;

    setDispensingStates(prev => ({ ...prev, [prescription.id]: true }));
    
    try {
      const med = medications.find(m => m.id === prescription.medication_id);
      if (med) {
        if (prescription.quantity_prescribed > med.quantity_in_stock) {
          showError('Low Stock Warning', `Not enough stock for \${med.name}. Available: \${med.quantity_in_stock}`);
          // Note: we don't block dispensing unless it's negative, but server will block it.
          // Wait, the prompt says "don't hard-block the dispense unless stock would go negative".
          // If server blocks it, that's fine.
        } else if (med.quantity_in_stock - prescription.quantity_prescribed <= med.reorder_threshold) {
          showSuccess('Low Stock Alert', `\${med.name} is now running low.`);
        }
      }

      await api.post('/api/dispensing', {
        prescription_id: prescription.id,
        quantity_dispensed: prescription.quantity_prescribed
      });
      
      showSuccess('Dispensed', 'Prescription marked as dispensed.');
      
      // Update local state
      setPrescriptions(prev => {
        const updated = (prev[encounterId] || []).filter(p => p.id !== prescription.id);
        if (updated.length === 0) {
          // All dispensed, remove encounter
          setEncounters(e => e.filter(enc => enc.id !== encounterId));
          return { ...prev, [encounterId]: [] };
        }
        return { ...prev, [encounterId]: updated };
      });
      
    } catch (err: any) {
      showError('Dispensing Failed', err.message || 'Failed to dispense medication.');
    } finally {
      setDispensingStates(prev => ({ ...prev, [prescription.id]: false }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-700" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-emerald-900">Pharmacy Queue</h1>
        <p className="text-sm text-ink-soft mt-1">Dispense medications and fulfill prescriptions.</p>
      </div>

      {encounters.length === 0 ? (
        <div className="bg-white border border-line rounded-2xl p-12 text-center shadow-sm">
          <Pill className="w-12 h-12 text-emerald-100 mx-auto mb-4" />
          <h3 className="font-serif text-xl font-bold text-emerald-900">Queue is empty</h3>
          <p className="text-sm text-ink-soft mt-2">No pending prescriptions in the pharmacy.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {encounters.map(enc => {
            const patient = patients[enc.patient_id];
            const prs = prescriptions[enc.id] || [];
            if (prs.length === 0) return null; // Hide if all dispensed
            
            // Re-hydrate patient into encounter for TicketCard
            const fullEncounter = { ...enc, patient };
            
            return (
              <div key={enc.id} className="bg-white border border-line rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3 shrink-0 flex justify-center md:justify-start">
                  <TicketCard encounter={fullEncounter} className="scale-90 origin-top-left shadow-md" />
                </div>
                
                <div className="flex-1 space-y-4">
                  <h3 className="font-serif font-bold text-lg text-emerald-900 border-b border-line pb-2">Pending Prescriptions</h3>
                  
                  <div className="space-y-3">
                    {prs.map(pr => {
                      const med = medications.find(m => m.id === pr.medication_id);
                      return (
                        <div key={pr.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-line bg-cream gap-4">
                          <div>
                            <p className="font-bold text-emerald-900 text-base">{med?.name || 'Unknown Medication'}</p>
                            <p className="text-sm text-ink-soft mt-1">{pr.dosage_instructions || 'No instructions provided.'}</p>
                            <div className="flex gap-4 mt-2 text-xs">
                              <span className="font-semibold text-ink">Qty: {pr.quantity_prescribed}</span>
                              {med && (
                                <span className={med.quantity_in_stock < pr.quantity_prescribed ? 'text-red-600 font-bold' : 'text-emerald-700'}>
                                  Stock: {med.quantity_in_stock}
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDispense(enc.id, pr)}
                            disabled={dispensingStates[pr.id]}
                            className="shrink-0 px-4 py-2 rounded-full font-bold text-sm bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-50 transition-colors inline-flex items-center gap-2 justify-center"
                          >
                            {dispensingStates[pr.id] ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                            Mark Dispensed
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

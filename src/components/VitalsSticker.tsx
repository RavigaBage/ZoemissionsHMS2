import React, { useEffect, useState } from 'react';
import { Vitals } from '../types';
import { api } from '../api/client';
import { X, Activity } from 'lucide-react';

interface VitalsStickerProps {
  encounterId: string;
  onClose: () => void;
}

export function VitalsSticker({ encounterId, onClose }: VitalsStickerProps) {
  const [vitals, setVitals] = useState<Vitals | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVitals = async () => {
      try {
        const data = await api.get<Vitals[]>(`/api/vitals?encounter_id=${encounterId}`);
        if (data && data.length > 0) {
          setVitals(data[0]);
        }
      } catch (err) {
        console.error('Error fetching vitals:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVitals();
  }, [encounterId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/20 backdrop-blur-sm">
      <div 
        className="relative bg-cream rounded-[2rem] border-4 border-gold-200 shadow-xl p-6 w-72 transform -rotate-2"
      >
        <button 
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-white border-2 border-line text-ink-soft rounded-full p-1 hover:bg-cream hover:text-ink transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-emerald-900 mb-4 border-b border-line pb-2">
          <Activity className="w-5 h-5" />
          <h4 className="font-serif font-bold text-lg leading-none">Vitals Sticker</h4>
        </div>

        {loading ? (
          <p className="text-sm text-ink-soft text-center py-4">Loading vitals...</p>
        ) : vitals ? (
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-soft">BP:</span>
              <span className="font-bold text-ink">{vitals.bp_systolic || '--'}/{vitals.bp_diastolic || '--'} mmHg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">Heart Rate:</span>
              <span className="font-bold text-ink">{vitals.pulse || '--'} bpm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">Temp:</span>
              <span className="font-bold text-ink">{vitals.temp_c || '--'} °C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">SpO2:</span>
              <span className="font-bold text-ink">{vitals.spo2 || '--'} %</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">Resp Rate:</span>
              <span className="font-bold text-ink">{vitals.resp_rate || '--'} /min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">Weight:</span>
              <span className="font-bold text-ink">{vitals.weight_kg || '--'} kg</span>
            </div>
            
            <div className="mt-4 pt-3 border-t border-line text-xs text-ink-soft text-center">
              Recorded by <span className="font-semibold">{vitals.recorded_by || 'Unknown'}</span>
              <br />
              {vitals.recorded_at ? new Date(vitals.recorded_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm font-medium text-ink">No vitals recorded.</p>
            <p className="text-xs text-ink-soft mt-1">Triage may have been skipped.</p>
          </div>
        )}
      </div>
    </div>
  );
}

import React from 'react';
import { Encounter } from '../types';

interface TicketCardProps {
  encounter: Encounter;
  className?: string;
}

export function TicketCard({ encounter, className = '' }: TicketCardProps) {
  return (
    <div className={`relative flex w-full max-w-sm bg-white rounded-lg shadow-sm overflow-hidden border border-line ${className}`}>
      {/* Left decorative edge representing the perforated stub */}
      <div className="w-8 bg-emerald-700 flex flex-col justify-between items-center py-4 relative border-r border-dashed border-emerald-900/30">
        <div className="w-3 h-3 rounded-full bg-cream -ml-2"></div>
        <div className="transform -rotate-90 text-gold-200 text-xs font-semibold tracking-widest whitespace-nowrap">
          {encounter.lane === 'emergency' ? 'EMERGENCY' : 'GENERAL'}
        </div>
        <div className="w-3 h-3 rounded-full bg-cream -ml-2"></div>
      </div>
      
      {/* Main Ticket Content */}
      <div className="flex-1 p-4 flex flex-col justify-center">
        <p className="text-xs text-ink-soft uppercase tracking-wider font-semibold mb-1">Ticket No.</p>
        {encounter.ticket_rank && (
          <p className="text-[10px] font-bold uppercase tracking-wider text-gold-700 mb-1">
            Queue Rank #{encounter.ticket_rank}
          </p>
        )}
        <h3 className="font-serif text-3xl text-emerald-900 leading-none mb-2">
          {encounter.ticket_number}
        </h3>
        
        <div className="mt-2 pt-2 border-t border-line flex justify-between items-end">
          <div>
            <p className="text-xs text-ink-soft">Patient Name</p>
            <p className="font-semibold text-ink">
              {encounter.patient?.first_name} {encounter.patient?.Other_name}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-ink-soft">Date</p>
            <p className="text-sm font-medium text-ink">
              {encounter.created_at ? new Date(encounter.created_at).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

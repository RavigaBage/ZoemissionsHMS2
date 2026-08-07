import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, PhoneCall, ShieldAlert, BookOpen, UserCheck, Radio, AlertCircle } from 'lucide-react';

export const HelpContactPage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Return Link */}
      <div className="flex items-center justify-between">
        <Link
          to="/help"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--emerald-700)] hover:text-[var(--emerald-900)] bg-white px-3 py-1.5 rounded-full border border-[var(--line)]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Help Center</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-[var(--line)] p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-3 text-[var(--gold-700)]">
          <BookOpen className="w-5 h-5" />
          <span className="font-serif italic text-sm font-semibold">
            "Be strong and of a good courage." Joshua 1:9
          </span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--emerald-900)]">
          On-Site Support and Contact Directory
        </h2>
        <p className="text-xs text-[var(--ink-soft)] leading-relaxed max-w-2xl">
          Use this directory to locate assistance during your shift. The contact fields below are formatted for your on-site team lead to populate before clinic operations begin.
        </p>
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* On-site Tech Admin */}
        <div className="bg-white rounded-2xl border border-[var(--line)] p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--emerald-100)] text-[var(--emerald-700)] flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[var(--emerald-900)]">
              On-Site Technical Admin
            </h3>
            <p className="text-xs text-[var(--ink-soft)] leading-relaxed">
              Contact for login problems, PIN resets, router signal issues, or host laptop restarts.
            </p>
          </div>

          <div className="bg-[var(--cream)] p-4 rounded-xl border border-[var(--line)] space-y-2 text-xs">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-[var(--ink-soft)] block">Primary Contact:</span>
              <span className="font-bold text-[var(--emerald-900)]">[On-site technical admin name]</span>
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase text-[var(--ink-soft)] block">Station Location:</span>
              <span className="font-bold text-[var(--emerald-900)]">[Tech desk or registration laptop]</span>
            </div>
          </div>
        </div>

        {/* Mission Leadership */}
        <div className="bg-white rounded-2xl border border-[var(--line)] p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--gold-100)] text-[var(--gold-700)] flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[var(--emerald-900)]">
              Mission Leadership
            </h3>
            <p className="text-xs text-[var(--ink-soft)] leading-relaxed">
              Reach out for clinical policy decisions, emergency escalations, or medical transport guidance.
            </p>
          </div>

          <div className="bg-[var(--cream)] p-4 rounded-xl border border-[var(--line)] space-y-2 text-xs">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-[var(--ink-soft)] block">Team Leader:</span>
              <span className="font-bold text-[var(--emerald-900)]">[Mission team lead name]</span>
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase text-[var(--ink-soft)] block">Radio / Phone Channel:</span>
              <span className="font-bold text-[var(--emerald-900)]">[Contact radio channel or phone number]</span>
            </div>
          </div>
        </div>

        {/* Bug Procedure */}
        <div className="bg-white rounded-2xl border border-[var(--line)] p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[var(--emerald-900)]">
              Software Bug Procedure
            </h3>
            <p className="text-xs text-[var(--ink-soft)] leading-relaxed">
              If an error occurs, note what you were doing and inform the technical admin on duty.
            </p>
          </div>

          <div className="bg-[var(--cream)] p-4 rounded-xl border border-[var(--line)] space-y-2 text-xs">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-[var(--ink-soft)] block">Log Book Location:</span>
              <span className="font-bold text-[var(--emerald-900)]">[On-site station log book]</span>
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase text-[var(--ink-soft)] block">Post-Trip Sync:</span>
              <span className="font-bold text-[var(--emerald-900)]">[Sync procedure upon returning online]</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

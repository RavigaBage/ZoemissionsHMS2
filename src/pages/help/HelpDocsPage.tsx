import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, BookOpen, Layers } from 'lucide-react';

interface ModuleDoc {
  id: string;
  moduleName: string;
  purpose: string;
  rules: string[];
  fields: { name: string; type: string; required: boolean; notes: string }[];
}

export const HelpDocsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const modules: ModuleDoc[] = [
    {
      id: 'patients',
      moduleName: 'Patient Records Module',
      purpose: 'Stores patient demographic profiles and serves as the master record for encounter histories.',
      rules: [
        'Patients are identified by First Name and Other Names.',
        'Approximate age is captured as an integer in years; exact date of birth is not required.',
        'Phone numbers and village names assist with identity verification on field trips.',
      ],
      fields: [
        { name: 'first_name', type: 'Text', required: true, notes: 'Primary given name.' },
        { name: 'Other_name', type: 'Text', required: true, notes: 'Surname or family names. Labeled as Other name(s) in the user interface.' },
        { name: 'approx_age', type: 'Number', required: false, notes: 'Estimated age in years.' },
        { name: 'gender', type: 'Select', required: false, notes: 'Gender specification (Male, Female, Other).' },
        { name: 'village', type: 'Text', required: false, notes: 'Home community or village location.' },
        { name: 'phone', type: 'Text', required: false, notes: 'Contact phone number.' },
      ],
    },
    {
      id: 'encounters',
      moduleName: 'Station Encounters & Check-ins',
      purpose: 'Tracks a patient movement through the clinic stations during a single visit.',
      rules: [
        'General lane is used for standard queues; Emergency lane is prioritized for critical cases.',
        'Triage flags indicate severity level: Red (Emergency), Yellow (Urgent), Green (Routine), or None.',
        'Encounter status advances automatically from Registered to Triaged, Consulted, Dispensed, and Completed.',
      ],
      fields: [
        { name: 'patient_id', type: 'Select', required: true, notes: 'Selected from registered patient directory.' },
        { name: 'lane', type: 'Select', required: true, notes: 'General or Emergency lane.' },
        { name: 'triage_flag', type: 'Select', required: false, notes: 'Triage severity flag indicator.' },
        { name: 'status', type: 'Status Enum', required: false, notes: 'Current station location in patient flow.' },
      ],
    },
    {
      id: 'vitals',
      moduleName: 'Triage Vitals Module',
      purpose: 'Records physiological body measurements captured by triage nurses.',
      rules: [
        'Vitals records are linked directly to an active station encounter.',
        'Temperature is recorded in degrees Celsius to one decimal place.',
        'Oxygen saturation (SpO2) is entered as a percentage from 0 to 100.',
      ],
      fields: [
        { name: 'temp_c', type: 'Number', required: false, notes: 'Body temperature in Celsius.' },
        { name: 'bp_systolic', type: 'Number', required: false, notes: 'Systolic blood pressure.' },
        { name: 'bp_diastolic', type: 'Number', required: false, notes: 'Diastolic blood pressure.' },
        { name: 'pulse', type: 'Number', required: false, notes: 'Heart rate pulse beats per minute.' },
        { name: 'spo2', type: 'Number', required: false, notes: 'Blood oxygen saturation percentage.' },
        { name: 'resp_rate', type: 'Number', required: false, notes: 'Respiration rate breaths per minute.' },
        { name: 'weight_kg', type: 'Number', required: false, notes: 'Body weight in kilograms.' },
      ],
    },
    {
      id: 'consultations',
      moduleName: 'Doctor Consultations Module',
      purpose: 'Captures clinical findings, primary diagnoses, and medical doctor examination notes.',
      rules: [
        'Consultations are created for an active encounter after vitals are taken.',
        'Doctor identity is set automatically from the active logged in session.',
        'Partial updates allow doctors to save examination notes progressively.',
      ],
      fields: [
        { name: 'chief_complaint', type: 'Textarea', required: false, notes: 'Primary symptoms reported by patient.' },
        { name: 'findings', type: 'Textarea', required: false, notes: 'Physical examination observations.' },
        { name: 'diagnosis', type: 'Textarea', required: false, notes: 'Primary clinical diagnosis.' },
        { name: 'notes', type: 'Textarea', required: false, notes: 'Additional treatment recommendations.' },
      ],
    },
    {
      id: 'medications',
      moduleName: 'Pharmacy Inventory Module',
      purpose: 'Manages field pharmacy medication stock levels, reorder alerts, and batch numbers.',
      rules: [
        'Reorder threshold triggers a visual yellow warning when stock quantity falls to or below this level.',
        'Units describe packaging such as tablet, vial, or ml.',
        'Quantity in stock decreases automatically when prescriptions are dispensed.',
      ],
      fields: [
        { name: 'name', type: 'Text', required: true, notes: 'Medication name.' },
        { name: 'unit', type: 'Text', required: true, notes: 'Unit format e.g. tablet or ml.' },
        { name: 'quantity_in_stock', type: 'Number', required: true, notes: 'Current available stock count.' },
        { name: 'reorder_threshold', type: 'Number', required: false, notes: 'Low stock warning trigger level. Default is 10.' },
        { name: 'expiry_date', type: 'Date', required: false, notes: 'Expiration date.' },
        { name: 'batch_no', type: 'Text', required: false, notes: 'Manufacturer batch lot number.' },
      ],
    },
    {
      id: 'prescriptions',
      moduleName: 'Prescriptions Module',
      purpose: 'Allows doctors to order specific medications from available stock during consultation.',
      rules: [
        'Prescription queues are paginated for fast loading over local networks.',
        'Current inventory stock is displayed during selection to prevent over prescribing.',
      ],
      fields: [
        { name: 'medication_id', type: 'Select', required: true, notes: 'Selected from active stock list.' },
        { name: 'dosage_instructions', type: 'Text', required: false, notes: 'Specific dosage instructions for patient.' },
        { name: 'quantity_prescribed', type: 'Number', required: true, notes: 'Total units prescribed.' },
      ],
    },
    {
      id: 'dispensing',
      moduleName: 'Dispensing Station Module',
      purpose: 'Records the physical handover of prescribed medications to patients.',
      rules: [
        'Quantity dispensed cannot exceed available stock.',
        'Dispensing automatically deducts stock from inventory and updates encounter status.',
      ],
      fields: [
        { name: 'quantity_dispensed', type: 'Number', required: true, notes: 'Quantity physically handed to patient.' },
        { name: 'dispensed_by', type: 'Hidden', required: true, notes: 'Logged in pharmacy staff member.' },
      ],
    },
    {
      id: 'staff',
      moduleName: 'Staff & Roles Module',
      purpose: 'Controls system access, assigned roles, and numeric PIN credentials for team members.',
      rules: [
        'Only Clinic Admin accounts can access Staff Management.',
        'Roles define page permissions: Registration, Triage, Doctor, Pharmacy, or Admin.',
        'Accounts can be deactivated without deleting past clinical records.',
      ],
      fields: [
        { name: 'name', type: 'Text', required: true, notes: 'Staff member full name.' },
        { name: 'role', type: 'Select', required: true, notes: 'Role access assignment.' },
        { name: 'pin', type: 'PIN Password', required: true, notes: 'Numeric security PIN.' },
        { name: 'active', type: 'Toggle', required: false, notes: 'Active status indicator.' },
      ],
    },
  ];

  const filteredModules = modules.filter((m) => {
    const term = searchTerm.toLowerCase();
    if (!term) return true;
    return (
      m.moduleName.toLowerCase().includes(term) ||
      m.purpose.toLowerCase().includes(term) ||
      m.fields.some((f) => f.name.toLowerCase().includes(term) || f.notes.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-8">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/help"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--emerald-700)] hover:text-[var(--emerald-900)] bg-white px-3 py-1.5 rounded-full border border-[var(--line)]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Help Center</span>
        </Link>

        {/* Live Filter Input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-soft)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search module or field name…"
            className="w-full bg-white border border-[var(--line)] rounded-full pl-9 pr-4 py-2 text-xs font-bold focus:outline-none focus:border-[var(--emerald-700)] shadow-xs"
          />
        </div>
      </div>

      {/* Scripture Banner */}
      <div className="bg-white rounded-2xl border border-[var(--line)] p-4 flex items-center gap-3">
        <BookOpen className="w-5 h-5 text-[var(--gold-700)] shrink-0" />
        <p className="font-serif italic text-xs text-[var(--emerald-900)] font-semibold">
          "Be strong and of a good courage." Joshua 1:9
        </p>
      </div>

      {/* Module Reference Grid */}
      <div className="space-y-6">
        {filteredModules.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[var(--line)] p-8 text-center text-[var(--ink-soft)]">
            <p className="font-bold text-sm">No documentation records match your search query.</p>
          </div>
        ) : (
          filteredModules.map((mod) => (
            <div key={mod.id} className="bg-white rounded-2xl border border-[var(--line)] p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-[var(--line)]">
                <div className="w-9 h-9 rounded-xl bg-[var(--emerald-100)] text-[var(--emerald-700)] flex items-center justify-center shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-[var(--emerald-900)]">
                    {mod.moduleName}
                  </h3>
                  <p className="text-xs text-[var(--ink-soft)] mt-0.5">
                    {mod.purpose}
                  </p>
                </div>
              </div>

              {/* Module Rules */}
              <div className="bg-[var(--cream)] p-4 rounded-xl border border-[var(--line)] space-y-1.5">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--emerald-900)]">
                  Module Clinical Rules:
                </p>
                <ul className="list-disc list-inside text-xs text-[var(--ink-soft)] space-y-1">
                  {mod.rules.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                </ul>
              </div>

              {/* Fields Table */}
              <div className="overflow-x-auto border border-[var(--line)] rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[var(--cream-deep)] border-b border-[var(--line)] text-[var(--ink-soft)] font-bold uppercase text-[10px] tracking-wider">
                      <th className="p-3">Field Name</th>
                      <th className="p-3">Input Type</th>
                      <th className="p-3">Required</th>
                      <th className="p-3">Field Usage Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--line)]">
                    {mod.fields.map((f, idx) => (
                      <tr key={idx} className="hover:bg-[var(--cream)]/50">
                        <td className="p-3 font-mono font-bold text-[var(--emerald-900)]">{f.name}</td>
                        <td className="p-3 text-[var(--ink-soft)]">{f.type}</td>
                        <td className="p-3">
                          {f.required ? (
                            <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Required</span>
                          ) : (
                            <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Optional</span>
                          )}
                        </td>
                        <td className="p-3 text-[var(--ink-soft)]">{f.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

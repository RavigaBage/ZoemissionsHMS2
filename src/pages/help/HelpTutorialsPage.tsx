import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, UserCheck, Activity, Stethoscope, Pill, ShieldAlert, BookOpen } from 'lucide-react';

export const HelpTutorialsPage: React.FC = () => {
  const [activeRole, setActiveRole] = useState<'registration' | 'triage' | 'doctor' | 'pharmacy' | 'admin'>('registration');

  const tutorials = {
    registration: {
      roleTitle: 'Registration Clerk Workflow',
      icon: UserCheck,
      scripture: '"Inasmuch as ye have done it unto one of the least of these... ye have done it unto me." Matthew 25:40',
      description: 'Your primary duty is welcoming patients, entering demographic information, and initiating check-ins.',
      steps: [
        {
          num: 1,
          title: 'Search for Existing Patients',
          detail: 'Open Patient Records from the sidebar. Type the patient first name or village in the search bar to confirm if they have a previous record.',
          slot: 'registration-step-1-search',
        },
        {
          num: 2,
          title: 'Register New Patient Record',
          detail: 'If no match exists, click Register Patient. Enter first name, other names, approximate age in years, gender, village, and phone number.',
          slot: 'registration-step-2-form',
        },
        {
          num: 3,
          title: 'Initiate Station Check-in',
          detail: 'Click New Check-in. Select the registered patient, assign General or Emergency lane, and set initial triage level.',
          slot: 'registration-step-3-[#135C3D]checkin',
        },
        {
          num: 4,
          title: 'Handover to Triage Station',
          detail: 'Direct the patient to the Triage waiting area. Their entry will immediately appear on the Station Dashboard.',
          slot: 'registration-step-4-handover',
        },
      ],
    },
    triage: {
      roleTitle: 'Triage Nurse Workflow',
      icon: Activity,
      scripture: '"Is any sick among you? ... the prayer of faith shall save the sick." James 5:14 to 15',
      description: 'Your role is measuring baseline physiological vitals and categorizing severity flags to ensure urgent cases are seen first.',
      steps: [
        {
          num: 1,
          title: 'Monitor Dashboard Queue',
          detail: 'Review the Live Station Queue on the Dashboard. Look for patients marked as Awaiting Vitals.',
          slot: 'triage-step-1-dashboard',
        },
        {
          num: 2,
          title: 'Open Record Vitals Form',
          detail: 'Click Record Vitals next to the patient. Enter body temperature in Celsius, blood pressure systolic and diastolic, pulse, oxygen saturation percentage, respiration rate, and weight in kilograms.',
          slot: 'triage-step-2-vitals-form',
        },
        {
          num: 3,
          title: 'Confirm or Escalate Triage Severity Flag',
          detail: 'Select Red for Emergency cases requiring immediate attention, Yellow for Urgent care, Green for Routine care, or None if unflagged.',
          slot: 'triage-step-3-flag-selection',
        },
        {
          num: 4,
          title: 'Direct Patient to Consultation Area',
          detail: 'Save the vitals form. The patient encounter status updates to Awaiting Doctor automatically.',
          slot: 'triage-step-4-routing',
        },
      ],
    },
    doctor: {
      roleTitle: 'Medical Doctor Workflow',
      icon: Stethoscope,
      scripture: '"He healeth the broken in heart, and bindeth up their wounds." Psalm 147:3',
      description: 'You conduct clinical examinations, document complaints, record diagnoses, and issue medication prescriptions.',
      steps: [
        {
          num: 1,
          title: 'Select Patient from Doctor Queue',
          detail: 'On the Dashboard, filter by Awaiting Doctor. Click Start Consult on the next waiting patient.',
          slot: 'doctor-step-1-queue-select',
        },
        {
          num: 2,
          title: 'Review Vitals and Medical History',
          detail: 'Examine the recorded vitals and past encounter timeline before documenting current clinical findings.',
          slot: 'doctor-step-2-vitals-review',
        },
        {
          num: 3,
          title: 'Record Clinical Notes and Diagnosis',
          detail: 'Fill in chief complaint, physical examination findings, primary diagnosis, and treatment plan notes.',
          slot: 'doctor-step-3-consultation-notes',
        },
        {
          num: 4,
          title: 'Issue Prescriptions from Available Stock',
          detail: 'Add prescription items by selecting medications from the live inventory list. Dosages and quantities are specified before submitting.',
          slot: 'doctor-step-4-prescriptions',
        },
      ],
    },
    pharmacy: {
      roleTitle: 'Pharmacy Tech Workflow',
      icon: Pill,
      scripture: '"Let your light so shine before men." Matthew 5:16',
      description: 'You fulfill prescriptions, dispense medications, and manage the field pharmacy inventory levels.',
      steps: [
        {
          num: 1,
          title: 'Check Prescriptions Queue',
          detail: 'Navigate to Prescriptions Queue from the sidebar to review pending medication orders from doctors.',
          slot: 'pharmacy-step-1-queue',
        },
        {
          num: 2,
          title: 'Dispense Prescribed Medication',
          detail: 'Click Dispense next to an order. Verify prescribed dosage, check physical pill count, enter quantity dispensed, and save.',
          slot: 'pharmacy-step-2-dispensing',
        },
        {
          num: 3,
          title: 'Monitor Stock Inventory Levels',
          detail: 'Check Medications Stock regularly. Take note of yellow low stock warnings when items reach reorder thresholds.',
          slot: 'pharmacy-step-3-stock-monitoring',
        },
        {
          num: 4,
          title: 'Update Stock Shipments',
          detail: 'Add new medication shipments or edit quantity in stock when new mission supplies arrive on site.',
          slot: 'pharmacy-step-4-add-inventory',
        },
      ],
    },
    admin: {
      roleTitle: 'Clinic Admin Workflow',
      icon: ShieldAlert,
      scripture: '"Let us not be weary in well doing." Galatians 6:9',
      description: 'Admins oversee staff access, system health, server connectivity, and field station configuration.',
      steps: [
        {
          num: 1,
          title: 'Manage Staff Accounts and Roles',
          detail: 'Open Staff Management from the sidebar. Register new staff members with their assigned role and numeric login PIN.',
          slot: 'admin-step-1-staff-creation',
        },
        {
          num: 2,
          title: 'Deactivate Inactive Accounts',
          detail: 'Toggle staff account status to inactive when shifts end or team members rotate out, maintaining security without deleting history.',
          slot: 'admin-step-2-[#135C3D]status-toggle',
        },
        {
          num: 3,
          title: 'Monitor Local LAN Connectivity',
          detail: 'Check System Settings to verify connection to the host laptop server and router signal status.',
          slot: 'admin-step-3-system-check',
        },
      ],
    },
  };

  const current = tutorials[activeRole];
  const Icon = current.icon;

  return (
    <div className="space-y-8">
      {/* Top Breadcrumb & Return Link */}
      <div className="flex items-center justify-between">
        <Link
          to="/help"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--emerald-700)] hover:text-[var(--emerald-900)] bg-white px-3 py-1.5 rounded-full border border-[var(--line)]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Help Center</span>
        </Link>
      </div>

      {/* Role Selection Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-[var(--line)] shadow-xs flex flex-wrap gap-1">
        {[
          { id: 'registration', label: '1. Registration' },
          { id: 'triage', label: '2. Triage Nurse' },
          { id: 'doctor', label: '3. Medical Doctor' },
          { id: 'pharmacy', label: '4. Pharmacy Tech' },
          { id: 'admin', label: '5. Clinic Admin' },
        ].map((role) => (
          <button
            key={role.id}
            onClick={() => setActiveRole(role.id as any)}
            className={`flex-1 min-w-[120px] px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer text-center ${
              activeRole === role.id
                ? 'bg-[var(--emerald-700)] text-white shadow-xs'
                : 'text-[var(--ink-soft)] hover:bg-[var(--emerald-100)]'
            }`}
          >
            {role.label}
          </button>
        ))}
      </div>

      {/* Main Walkthrough Card */}
      <div className="bg-white rounded-2xl border border-[var(--line)] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--line)] pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--emerald-100)] text-[var(--emerald-700)] flex items-center justify-center shrink-0">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-2xl text-[var(--emerald-900)]">
                {current.roleTitle}
              </h2>
              <p className="text-xs text-[var(--ink-soft)] mt-0.5">
                {current.description}
              </p>
            </div>
          </div>
        </div>

        {/* Step List */}
        <div className="space-y-6">
          {current.steps.map((step) => (
            <div
              key={step.num}
              className="p-5 rounded-2xl bg-[var(--cream)] border border-[var(--line)] space-y-3"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[var(--gold-600)] text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {step.num}
                </span>
                <h3 className="font-serif font-bold text-lg text-[var(--emerald-900)]">
                  {step.title}
                </h3>
              </div>
              <p className="text-xs text-[var(--ink-soft)] leading-relaxed pl-10">
                {step.detail}
              </p>

              {/* Placeholder Screenshot Slot */}
              <div className="ml-10 my-2 p-3 bg-[var(--cream-deep)] border border-dashed border-[var(--line)] rounded-xl text-center text-xs font-mono text-[var(--ink-soft)]">
                [ Screenshot Placeholder: {step.slot} ]
              </div>
            </div>
          ))}
        </div>

        {/* Closing Scripture Encouragement */}
        <div className="mt-8 pt-6 border-t border-[var(--line)] flex items-center gap-3 bg-[var(--emerald-100)]/50 p-4 rounded-xl">
          <BookOpen className="w-5 h-5 text-[var(--gold-700)] shrink-0" />
          <p className="font-serif italic text-xs text-[var(--emerald-900)] font-semibold">
            {current.scripture}
          </p>
        </div>
      </div>
    </div>
  );
};

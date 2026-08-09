export type Role = 'registration' | 'triage' | 'doctor' | 'pharmacy' | 'admin';

export type TriageFlag = 'red' | 'yellow' | 'green' | 'none';

export type Lane = 'general' | 'emergency';

export type EncounterStatus = 'registered' | 'triaged' | 'consulted' | 'pharmacy' | 'completed';
export type QueueStatus = 'registered' | 'vitals' | 'consultation' | 'dispensing' | 'completed';
export interface Patient {
  id: string;
  first_name: string;
  Other_name: string;
  approx_age?: number | null;
  gender?: string | null;
  village?: string | null;
  phone?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Staff {
  id: string;
  name: string;
  role: Role;
  active: boolean;
  created_at?: string;
}

export interface Encounter {
  id: string;
  patient_id: string;
  patient?: Patient;
  ticket_number: string;
  ticket_rank?: number;
  lane: Lane;
  status: EncounterStatus;
  triage_flag: TriageFlag;
  created_at?: string;
  updated_at?: string;
}
export interface Queue{
    patient_id: string,
    encounter_id: string,
    queue_number: string,
    ticket_number: string,
    ticket_rank?: number,
    current_stage: QueueStatus,
    status: EncounterStatus,
    lane: Lane,
    emergency_flag: TriageFlag,
    triage_flag: TriageFlag,
    assigned_staff_id: number | null,
    id: string,
    created_at: string,
    updated_at: string,
    patient:Patient | null
}
export interface Vitals {
  id: string;
  encounter_id: string;
  temp_c?: number | null;
  bp_systolic?: number | null;
  bp_diastolic?: number | null;
  pulse?: number | null;
  spo2?: number | null;
  resp_rate?: number | null;
  weight_kg?: number | null;
  recorded_by?: string | null;
  recorded_at?: string;
}

export interface Consultation {
  id: string;
  encounter_id: string;
  encounter?: Encounter;
  chief_complaint?: string | null;
  findings?: string | null;
  diagnosis?: string | null;
  notes?: string | null;
  doctor_id?: string | null;
  doctor_name?: string | null;
  created_at?: string;
  updated_at?: string;
  prescriptions?: Prescription[];
}

export interface Medication {
  id: string;
  name: string;
  unit: string;
  quantity_in_stock: number;
  reorder_threshold: number;
  expiry_date?: string | null;
  batch_no?: string | null;
  created_at?: string;
}

export interface Prescription {
  id: string;
  consultation_id: string;
  medication_id: string;
  medication?: Medication;
  dosage_instructions?: string | null;
  quantity_prescribed: number;
  quantity_dispensed?: number;
  status?: 'pending' | 'dispensed' | 'partial';
  created_at?: string;
}

export interface Dispensing {
  id: string;
  prescription_id: string;
  quantity_dispensed: number;
  dispensed_by?: string | null;
  dispensed_at?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    role: Role;
  };
}

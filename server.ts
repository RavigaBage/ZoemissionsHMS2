import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

interface StaffItem {
  id: string;
  name: string;
  role: 'registration' | 'triage' | 'doctor' | 'pharmacy' | 'admin';
  pin: string;
  active: boolean;
  created_at: string;
}

interface PatientItem {
  id: string;
  first_name: string;
  Other_name: string;
  approx_age?: number | null;
  gender?: string | null;
  village?: string | null;
  phone?: string | null;
  created_at: string;
  updated_at: string;
}

interface EncounterItem {
  id: string;
  patient_id: string;
  ticket_number: string;
  ticket_rank: number;
  lane: 'general' | 'emergency';
  status: 'registered' | 'triaged' | 'consulted' | 'pharmacy' | 'completed';
  triage_flag: 'red' | 'yellow' | 'green' | 'none';
  created_at: string;
  updated_at: string;
}

interface VitalsItem {
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
  recorded_at: string;
}

interface ConsultationItem {
  id: string;
  encounter_id: string;
  chief_complaint?: string | null;
  findings?: string | null;
  diagnosis?: string | null;
  notes?: string | null;
  doctor_id?: string | null;
  doctor_name?: string | null;
  created_at: string;
  updated_at: string;
}

interface MedicationItem {
  id: string;
  name: string;
  unit: string;
  quantity_in_stock: number;
  reorder_threshold: number;
  expiry_date?: string | null;
  batch_no?: string | null;
  created_at: string;
}

interface PrescriptionItem {
  id: string;
  consultation_id: string;
  medication_id: string;
  dosage_instructions?: string | null;
  quantity_prescribed: number;
  quantity_dispensed: number;
  status: 'pending' | 'dispensed' | 'partial';
  created_at: string;
}

interface DispensingItem {
  id: string;
  prescription_id: string;
  quantity_dispensed: number;
  dispensed_by?: string | null;
  dispensed_at: string;
}

// Memory Database
const db = {
  staff: [
    { id: 'stf_1', name: 'Dr. Sarah Jenkins', role: 'doctor', pin: '1234', active: true, created_at: new Date().toISOString() },
    { id: 'stf_2', name: 'Joseph Kwesi', role: 'triage', pin: '5678', active: true, created_at: new Date().toISOString() },
    { id: 'stf_3', name: 'Mary Amankwah', role: 'registration', pin: '1111', active: true, created_at: new Date().toISOString() },
    { id: 'stf_4', name: 'Paul Mensah', role: 'pharmacy', pin: '2222', active: true, created_at: new Date().toISOString() },
    { id: 'stf_5', name: 'Grace Osei (Admin)', role: 'admin', pin: '9999', active: true, created_at: new Date().toISOString() },
  ] as StaffItem[],

  patients: [
    {
      id: 'pat_1',
      first_name: 'Emanuel',
      Other_name: 'Kwabena Asante',
      approx_age: 34,
      gender: 'Male',
      village: 'Kofiase',
      phone: '0241234567',
      created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
    {
      id: 'pat_2',
      first_name: 'Amina',
      Other_name: 'Fatima Ibrahim',
      approx_age: 28,
      gender: 'Female',
      village: 'Sabon Zongo',
      phone: '0558765432',
      created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'pat_3',
      first_name: 'Kofi',
      Other_name: 'Yaw Boateng',
      approx_age: 62,
      gender: 'Male',
      village: 'Kofiase',
      phone: '0209998877',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'pat_4',
      first_name: 'Abena',
      Other_name: 'Serwaa Akosua',
      approx_age: 4,
      gender: 'Female',
      village: 'Nsuta',
      phone: '0243332211',
      created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 1).toISOString(),
    },
  ] as PatientItem[],

  encounters: [
    {
      id: 'enc_1',
      patient_id: 'pat_1',
      lane: 'emergency',
      status: 'triaged',
      triage_flag: 'red',
      created_at: new Date(Date.now() - 3600000 * 2.5).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'enc_2',
      patient_id: 'pat_2',
      lane: 'general',
      status: 'consulted',
      triage_flag: 'yellow',
      created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    },
    {
      id: 'enc_3',
      patient_id: 'pat_3',
      lane: 'general',
      status: 'registered',
      triage_flag: 'green',
      created_at: new Date(Date.now() - 3600000 * 1.8).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 1.8).toISOString(),
    },
    {
      id: 'enc_4',
      patient_id: 'pat_4',
      lane: 'emergency',
      status: 'registered',
      triage_flag: 'yellow',
      created_at: new Date(Date.now() - 3600000 * 0.8).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 0.8).toISOString(),
    },
  ] as EncounterItem[],

  vitals: [
    {
      id: 'vit_1',
      encounter_id: 'enc_1',
      temp_c: 39.4,
      bp_systolic: 142,
      bp_diastolic: 88,
      pulse: 118,
      spo2: 91,
      resp_rate: 26,
      weight_kg: 68.5,
      recorded_by: 'Joseph Kwesi',
      recorded_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'vit_2',
      encounter_id: 'enc_2',
      temp_c: 38.2,
      bp_systolic: 118,
      bp_diastolic: 76,
      pulse: 84,
      spo2: 98,
      resp_rate: 18,
      weight_kg: 58.0,
      recorded_by: 'Joseph Kwesi',
      recorded_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
  ] as VitalsItem[],

  consultations: [
    {
      id: 'cns_1',
      encounter_id: 'enc_2',
      chief_complaint: 'Severe headache and high fever for 3 days, body weakness and chills.',
      findings: 'Febrile (38.2°C), mild dehydation, tenderness in upper abdomen. Chest clear.',
      diagnosis: 'Acute Uncomplicated Malaria (P. falciparum) + Tension Headache',
      notes: 'Advised oral fluids and rest. Follow up if fever persists beyond 48 hours.',
      doctor_id: 'stf_1',
      doctor_name: 'Dr. Sarah Jenkins',
      created_at: new Date(Date.now() - 3600000 * 1.5).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    },
  ] as ConsultationItem[],

  medications: [
    {
      id: 'med_1',
      name: 'Amoxicillin 500mg',
      unit: 'capsule',
      quantity_in_stock: 450,
      reorder_threshold: 50,
      batch_no: 'AMX-2026-A',
      expiry_date: '2027-06-30',
      created_at: new Date().toISOString(),
    },
    {
      id: 'med_2',
      name: 'Paracetamol 500mg',
      unit: 'tablet',
      quantity_in_stock: 1200,
      reorder_threshold: 200,
      batch_no: 'PCM-2026-B',
      expiry_date: '2028-12-31',
      created_at: new Date().toISOString(),
    },
    {
      id: 'med_3',
      name: 'Artemether/Lumefantrine (Coartem)',
      unit: 'tablet',
      quantity_in_stock: 180,
      reorder_threshold: 30,
      batch_no: 'AL-2026-09',
      expiry_date: '2027-04-15',
      created_at: new Date().toISOString(),
    },
    {
      id: 'med_4',
      name: 'ORS (Oral Rehydration Salts)',
      unit: 'sachet',
      quantity_in_stock: 8,
      reorder_threshold: 25,
      batch_no: 'ORS-2025-11',
      expiry_date: '2026-11-20',
      created_at: new Date().toISOString(),
    },
    {
      id: 'med_5',
      name: 'Ciprofloxacin 500mg',
      unit: 'tablet',
      quantity_in_stock: 12,
      reorder_threshold: 20,
      batch_no: 'CIP-2026-01',
      expiry_date: '2027-01-10',
      created_at: new Date().toISOString(),
    },
    {
      id: 'med_6',
      name: 'Salbutamol Inhaler 100mcg',
      unit: 'canister',
      quantity_in_stock: 24,
      reorder_threshold: 10,
      batch_no: 'SAL-2026-04',
      expiry_date: '2027-09-30',
      created_at: new Date().toISOString(),
    },
  ] as MedicationItem[],

  prescriptions: [
    {
      id: 'prc_1',
      consultation_id: 'cns_1',
      medication_id: 'med_3',
      dosage_instructions: 'Take 4 tablets twice daily with meals for 3 days.',
      quantity_prescribed: 24,
      quantity_dispensed: 0,
      status: 'pending',
      created_at: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    },
    {
      id: 'prc_2',
      consultation_id: 'cns_1',
      medication_id: 'med_2',
      dosage_instructions: 'Take 2 tablets 8-hourly for pain/fever as needed.',
      quantity_prescribed: 18,
      quantity_dispensed: 0,
      status: 'pending',
      created_at: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    },
  ] as PrescriptionItem[],

  dispensings: [] as DispensingItem[],
};

// Helper token generator / store
const getEncounterTime = (encounter: EncounterItem) => new Date(encounter.created_at).getTime();

const sortByTicketRank = (a: EncounterItem, b: EncounterItem) => {
  const rankA = a.ticket_rank ?? Number.MAX_SAFE_INTEGER;
  const rankB = b.ticket_rank ?? Number.MAX_SAFE_INTEGER;
  if (rankA !== rankB) return rankA - rankB;
  return getEncounterTime(a) - getEncounterTime(b);
};

let ticketRankCounter = 0;
for (const encounter of [...db.encounters].sort((a, b) => getEncounterTime(a) - getEncounterTime(b))) {
  ticketRankCounter += 1;
  encounter.ticket_rank = encounter.ticket_rank ?? ticketRankCounter;
  encounter.ticket_number = encounter.ticket_number || `TKT-${String(encounter.ticket_rank).padStart(4, '0')}`;
}

const nextTicketRank = () => {
  ticketRankCounter += 1;
  return ticketRankCounter;
};

const nextTicketNumber = () => `TKT-${String(ticketRankCounter + 1).padStart(4, '0')}`;

const tokens: Record<string, StaffItem> = {
  'token_doctor_sarah': db.staff[0],
  'token_triage_joseph': db.staff[1],
  'token_registration_mary': db.staff[2],
  'token_pharmacy_paul': db.staff[3],
  'token_admin_grace': db.staff[4],
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Middleware auth check helper
  const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Your session ended. Please log in again.' });
    }
    const token = authHeader.split(' ')[1];
    const user = tokens[token];
    if (!user) {
      return res.status(401).json({ message: 'Your session ended. Please log in again.' });
    }
    (req as any).user = user;
    next();
  };

  // API Routes
  // Auth
  app.post('/api/auth/login', (req, res) => {
    const { name, pin } = req.body;
    if (!name || !pin) {
      return res.status(422).json({ message: 'Something required was left blank. Check the highlighted field.' });
    }

    const trimmedName = String(name).trim().toLowerCase();
    const staff = db.staff.find(
      (s) => s.active && s.pin === String(pin).trim() && (s.name.toLowerCase().includes(trimmedName) || trimmedName.includes(s.name.toLowerCase().split(' ')[0]))
    ) || db.staff.find(s => s.active && s.pin === String(pin).trim());

    if (!staff) {
      return res.status(401).json({ message: 'Invalid credentials. Name or PIN did not match an active staff account.' });
    }

    const token = `token_${staff.role}_${staff.id}`;
    tokens[token] = staff;

    return res.json({
      token,
      user: {
        id: staff.id,
        name: staff.name,
        role: staff.role,
      },
    });
  });

  app.get('/api/auth/me', authMiddleware, (req, res) => {
    const user = (req as any).user;
    return res.json({
      id: user.id,
      name: user.name,
      role: user.role,
    });
  });

  // Staff (Admin only)
  app.get('/api/staff', authMiddleware, (req, res) => {
    return res.json(db.staff.map(({ pin, ...rest }) => rest));
  });

  app.post('/api/staff', authMiddleware, (req, res) => {
    const { name, role, pin, active } = req.body;
    if (!name || !role || !pin) {
      return res.status(422).json({ message: 'Something required was left blank. Check the highlighted field.' });
    }
    const newStaff: StaffItem = {
      id: `stf_${Date.now()}`,
      name: String(name).trim(),
      role,
      pin: String(pin).trim(),
      active: active !== undefined ? Boolean(active) : true,
      created_at: new Date().toISOString(),
    };
    db.staff.push(newStaff);
    const { pin: _p, ...safeStaff } = newStaff;
    return res.status(201).json(safeStaff);
  });

  app.patch('/api/staff/:id', authMiddleware, (req, res) => {
    const staff = db.staff.find((s) => s.id === req.params.id);
    if (!staff) {
      return res.status(404).json({ message: "That record doesn't exist — it may have been removed." });
    }
    const { name, role, pin, active } = req.body;
    if (name) staff.name = String(name).trim();
    if (role) staff.role = role;
    if (pin) staff.pin = String(pin).trim();
    if (active !== undefined) staff.active = Boolean(active);
    const { pin: _p, ...safeStaff } = staff;
    return res.json(safeStaff);
  });

  // Patients
  app.get('/api/patients', authMiddleware, (req, res) => {
    const search = req.query.search ? String(req.query.search).toLowerCase() : '';
    let result = db.patients;
    if (search) {
      result = result.filter(
        (p) =>
          p.first_name.toLowerCase().includes(search) ||
          p.Other_name.toLowerCase().includes(search) ||
          (p.village && p.village.toLowerCase().includes(search)) ||
          (p.phone && p.phone.includes(search))
      );
    }
    // enrich with latest encounter status
    const enriched = result.map((p) => {
      const patientEncounters = db.encounters.filter((e) => e.patient_id === p.id);
      patientEncounters.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      const latestEncounter = patientEncounters[0];
      return {
        ...p,
        latest_encounter: latestEncounter || null,
      };
    });
    return res.json(enriched);
  });

  app.post('/api/patients', authMiddleware, (req, res) => {
    const { first_name, Other_name, approx_age, gender, village, phone } = req.body;
    if (!first_name || !Other_name) {
      return res.status(422).json({ message: 'Something required was left blank. Check the highlighted field.' });
    }
    const newPatient: PatientItem = {
      id: `pat_${Date.now()}`,
      first_name: String(first_name).trim(),
      Other_name: String(Other_name).trim(),
      approx_age: approx_age !== undefined && approx_age !== null && approx_age !== '' ? Number(approx_age) : null,
      gender: gender ? String(gender).trim() : null,
      village: village ? String(village).trim() : null,
      phone: phone ? String(phone).trim() : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    db.patients.unshift(newPatient);
    return res.status(201).json(newPatient);
  });

  app.get('/api/patients/:id', authMiddleware, (req, res) => {
    const patient = db.patients.find((p) => p.id === req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "That record doesn't exist — it may have been removed." });
    }
    // Get all encounters for patient
    const encounters = db.encounters
      .filter((e) => e.patient_id === patient.id)
      .map((enc) => {
        const vitals = db.vitals.filter((v) => v.encounter_id === enc.id);
        const consultations = db.consultations
          .filter((c) => c.encounter_id === enc.id)
          .map((c) => {
            const prescriptions = db.prescriptions
              .filter((pr) => pr.consultation_id === c.id)
              .map((pr) => ({
                ...pr,
                medication: db.medications.find((m) => m.id === pr.medication_id),
              }));
            return { ...c, prescriptions };
          });
        return {
          ...enc,
          vitals,
          consultations,
        };
      });

    return res.json({
      ...patient,
      encounters,
    });
  });

  // Encounters / Queue
  app.get('/api/encounters', authMiddleware, (req, res) => {
    const { status, lane, triage_flag } = req.query;
    let list = db.encounters;
    if (status) {
      list = list.filter((e) => e.status === String(status));
    }
    if (lane) {
      list = list.filter((e) => e.lane === String(lane));
    }
    if (triage_flag) {
      list = list.filter((e) => e.triage_flag === String(triage_flag));
    }

    const rankedList = [...list].sort(sortByTicketRank);

    const enriched = rankedList.map((enc) => {
      const patient = db.patients.find((p) => p.id === enc.patient_id);
      const vitals = db.vitals.filter((v) => v.encounter_id === enc.id);
      const consultation = db.consultations.find((c) => c.encounter_id === enc.id);
      return {
        ...enc,
        patient,
        latest_vitals: vitals.length > 0 ? vitals[vitals.length - 1] : null,
        consultation: consultation || null,
      };
    });

    return res.json(enriched);
  });

  app.post('/api/encounters', authMiddleware, (req, res) => {
    const { patient_id, lane, triage_flag, status } = req.body;
    if (!patient_id) {
      return res.status(422).json({ message: 'Something required was left blank. Check the highlighted field.' });
    }
    const patient = db.patients.find((p) => p.id === patient_id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    const newEncounter: EncounterItem = {
      id: `enc_${Date.now()}`,
      patient_id,
      ticket_number: nextTicketNumber(),
      ticket_rank: nextTicketRank(),
      lane: lane === 'emergency' ? 'emergency' : 'general',
      status: status || 'registered',
      triage_flag: triage_flag || 'none',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    db.encounters.unshift(newEncounter);
    return res.status(201).json({ ...newEncounter, patient });
  });

  app.get('/api/encounters/:id', authMiddleware, (req, res) => {
    const enc = db.encounters.find((e) => e.id === req.params.id);
    if (!enc) {
      return res.status(404).json({ message: "That record doesn't exist — it may have been removed." });
    }
    const patient = db.patients.find((p) => p.id === enc.patient_id);
    const vitals = db.vitals.filter((v) => v.encounter_id === enc.id);
    const consultation = db.consultations.find((c) => c.encounter_id === enc.id);
    return res.json({
      ...enc,
      patient,
      vitals,
      consultation: consultation || null,
    });
  });

  app.patch('/api/encounters/:id', authMiddleware, (req, res) => {
    const enc = db.encounters.find((e) => e.id === req.params.id);
    if (!enc) {
      return res.status(404).json({ message: "That record doesn't exist — it may have been removed." });
    }
    const { status, triage_flag, lane } = req.body;
    if (status) enc.status = status;
    if (triage_flag) enc.triage_flag = triage_flag;
    if (lane) enc.lane = lane;
    enc.updated_at = new Date().toISOString();
    return res.json(enc);
  });

  // Vitals
  app.get('/api/vitals', authMiddleware, (req, res) => {
    const encounter_id = req.query.encounter_id;
    if (encounter_id) {
      const list = db.vitals.filter((v) => v.encounter_id === String(encounter_id));
      return res.json(list);
    }
    return res.json(db.vitals);
  });

  app.patch('/api/vitals/:id', authMiddleware, (req, res) => {
    const { id } = req.params;
    const { temp_c, bp_systolic, bp_diastolic, pulse, spo2, resp_rate, weight_kg } = req.body;
    
    const idx = db.vitals.findIndex(v => v.id === id);
    if (idx === -1) return res.status(404).json({ message: 'Vitals not found' });
    
    const currentUser = (req as any).user;
    if (db.vitals[idx].recorded_by !== currentUser.name && currentUser.role !== 'admin') {
       return res.status(403).json({ message: 'Forbidden' });
    }

    db.vitals[idx] = {
      ...db.vitals[idx],
      temp_c: temp_c !== undefined && temp_c !== null && temp_c !== '' ? Number(temp_c) : null,
      bp_systolic: bp_systolic !== undefined && bp_systolic !== null && bp_systolic !== '' ? Number(bp_systolic) : null,
      bp_diastolic: bp_diastolic !== undefined && bp_diastolic !== null && bp_diastolic !== '' ? Number(bp_diastolic) : null,
      pulse: pulse !== undefined && pulse !== null && pulse !== '' ? Number(pulse) : null,
      spo2: spo2 !== undefined && spo2 !== null && spo2 !== '' ? Number(spo2) : null,
      resp_rate: resp_rate !== undefined && resp_rate !== null && resp_rate !== '' ? Number(resp_rate) : null,
      weight_kg: weight_kg !== undefined && weight_kg !== null && weight_kg !== '' ? Number(weight_kg) : null,
    };
    return res.json(db.vitals[idx]);
  });

  app.post('/api/vitals', authMiddleware, (req, res) => {
    const { encounter_id, temp_c, bp_systolic, bp_diastolic, pulse, spo2, resp_rate, weight_kg } = req.body;
    if (!encounter_id) {
      return res.status(422).json({ message: 'Something required was left blank. Check the highlighted field.' });
    }
    const enc = db.encounters.find((e) => e.id === encounter_id);
    if (!enc) {
      return res.status(404).json({ message: "Encounter record doesn't exist." });
    }

    const currentUser = (req as any).user;
    const newVitals: VitalsItem = {
      id: `vit_${Date.now()}`,
      encounter_id,
      temp_c: temp_c !== undefined && temp_c !== null && temp_c !== '' ? Number(temp_c) : null,
      bp_systolic: bp_systolic !== undefined && bp_systolic !== null && bp_systolic !== '' ? Number(bp_systolic) : null,
      bp_diastolic: bp_diastolic !== undefined && bp_diastolic !== null && bp_diastolic !== '' ? Number(bp_diastolic) : null,
      pulse: pulse !== undefined && pulse !== null && pulse !== '' ? Number(pulse) : null,
      spo2: spo2 !== undefined && spo2 !== null && spo2 !== '' ? Number(spo2) : null,
      resp_rate: resp_rate !== undefined && resp_rate !== null && resp_rate !== '' ? Number(resp_rate) : null,
      weight_kg: weight_kg !== undefined && weight_kg !== null && weight_kg !== '' ? Number(weight_kg) : null,
      recorded_by: currentUser.name,
      recorded_at: new Date().toISOString(),
    };
    db.vitals.push(newVitals);

    // Advance encounter status to triaged if currently registered
    if (enc.status === 'registered') {
      enc.status = 'triaged';
      enc.updated_at = new Date().toISOString();
    }

    return res.status(201).json(newVitals);
  });

  // Consultations
  app.get('/api/consultations', authMiddleware, (req, res) => {
    const encounter_id = req.query.encounter_id;
    let list = db.consultations;
    if (encounter_id) {
      list = list.filter((c) => c.encounter_id === String(encounter_id));
    }
    return res.json(list);
  });

  app.post('/api/consultations', authMiddleware, (req, res) => {
    const { encounter_id, chief_complaint, findings, diagnosis, notes, prescriptions, completed } = req.body;
    if (!encounter_id) {
      return res.status(422).json({ message: 'Something required was left blank. Check the highlighted field.' });
    }
    const enc = db.encounters.find((e) => e.id === encounter_id);
    if (!enc) {
      return res.status(404).json({ message: "Encounter record doesn't exist." });
    }

    const currentUser = (req as any).user;
    const newConsultation: ConsultationItem = {
      id: `cns_${Date.now()}`,
      encounter_id,
      chief_complaint: chief_complaint || null,
      findings: findings || null,
      diagnosis: diagnosis || null,
      notes: notes || null,
      doctor_id: currentUser.id,
      doctor_name: currentUser.name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    db.consultations.push(newConsultation);

    // Add optional inline prescriptions
    const createdPrescriptions: PrescriptionItem[] = [];
    if (Array.isArray(prescriptions)) {
      for (const pr of prescriptions) {
        if (pr.medication_id && pr.quantity_prescribed) {
          const newP: PrescriptionItem = {
            id: `prc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            consultation_id: newConsultation.id,
            medication_id: pr.medication_id,
            dosage_instructions: pr.dosage_instructions || null,
            quantity_prescribed: Number(pr.quantity_prescribed),
            quantity_dispensed: 0,
            status: 'pending',
            created_at: new Date().toISOString(),
          };
          db.prescriptions.push(newP);
          createdPrescriptions.push(newP);
        }
      }
    }

    // Advance encounter status based on the doctor's decision.
    // Patients with prescriptions go to pharmacy unless the doctor explicitly completes the visit.
    if (completed || createdPrescriptions.length === 0) {
      enc.status = 'completed';
    } else {
      enc.status = 'pharmacy';
    }
    enc.updated_at = new Date().toISOString();

    return res.status(201).json({ ...newConsultation, prescriptions: createdPrescriptions });
  });

  app.get('/api/consultations/:id', authMiddleware, (req, res) => {
    const cns = db.consultations.find((c) => c.id === req.params.id);
    if (!cns) {
      return res.status(404).json({ message: "That record doesn't exist — it may have been removed." });
    }
    const enc = db.encounters.find((e) => e.id === cns.encounter_id);
    const patient = enc ? db.patients.find((p) => p.id === enc.patient_id) : null;
    const prescriptions = db.prescriptions
      .filter((pr) => pr.consultation_id === cns.id)
      .map((pr) => ({
        ...pr,
        medication: db.medications.find((m) => m.id === pr.medication_id),
      }));

    return res.json({
      ...cns,
      encounter: enc ? { ...enc, patient } : null,
      prescriptions,
    });
  });

  // PATCH consultation (excludes doctor_id per API schema spec)
  app.patch('/api/consultations/:id', authMiddleware, (req, res) => {
    const cns = db.consultations.find((c) => c.id === req.params.id);
    if (!cns) {
      return res.status(404).json({ message: "That record doesn't exist — it may have been removed." });
    }
    const { chief_complaint, findings, diagnosis, notes, prescriptions, completed } = req.body;
    if (chief_complaint !== undefined) cns.chief_complaint = chief_complaint;
    if (findings !== undefined) cns.findings = findings;
    if (diagnosis !== undefined) cns.diagnosis = diagnosis;
    if (notes !== undefined) cns.notes = notes;
    cns.updated_at = new Date().toISOString();

    const enc = db.encounters.find((e) => e.id === cns.encounter_id);
    if (Array.isArray(prescriptions)) {
      db.prescriptions = db.prescriptions.filter((pr) => pr.consultation_id !== cns.id);
      for (const pr of prescriptions) {
        if (pr.medication_id && pr.quantity_prescribed) {
          db.prescriptions.push({
            id: `prc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            consultation_id: cns.id,
            medication_id: pr.medication_id,
            dosage_instructions: pr.dosage_instructions || null,
            quantity_prescribed: Number(pr.quantity_prescribed),
            quantity_dispensed: 0,
            status: 'pending',
            created_at: new Date().toISOString(),
          });
        }
      }
    }

    const activePrescriptions = db.prescriptions.filter((pr) => pr.consultation_id === cns.id);
    if (enc) {
      if (completed || activePrescriptions.length === 0) {
        enc.status = 'completed';
      } else {
        enc.status = 'pharmacy';
      }
      enc.updated_at = new Date().toISOString();
    }

    return res.json({ ...cns, prescriptions: activePrescriptions });
  });

  // Medications
  app.get('/api/medications', authMiddleware, (req, res) => {
    return res.json(db.medications);
  });

  app.post('/api/medications', authMiddleware, (req, res) => {
    const { name, unit, quantity_in_stock, reorder_threshold, expiry_date, batch_no } = req.body;
    if (!name || !unit) {
      return res.status(422).json({ message: 'Something required was left blank. Check the highlighted field.' });
    }
    const newMed: MedicationItem = {
      id: `med_${Date.now()}`,
      name: String(name).trim(),
      unit: String(unit).trim(),
      quantity_in_stock: quantity_in_stock !== undefined ? Number(quantity_in_stock) : 0,
      reorder_threshold: reorder_threshold !== undefined ? Number(reorder_threshold) : 10,
      expiry_date: expiry_date ? String(expiry_date) : null,
      batch_no: batch_no ? String(batch_no) : null,
      created_at: new Date().toISOString(),
    };
    db.medications.push(newMed);
    return res.status(201).json(newMed);
  });

  app.patch('/api/medications/:id', authMiddleware, (req, res) => {
    const med = db.medications.find((m) => m.id === req.params.id);
    if (!med) {
      return res.status(404).json({ message: "That record doesn't exist — it may have been removed." });
    }
    const { name, unit, quantity_in_stock, reorder_threshold, expiry_date, batch_no } = req.body;
    if (name) med.name = String(name).trim();
    if (unit) med.unit = String(unit).trim();
    if (quantity_in_stock !== undefined) med.quantity_in_stock = Number(quantity_in_stock);
    if (reorder_threshold !== undefined) med.reorder_threshold = Number(reorder_threshold);
    if (expiry_date !== undefined) med.expiry_date = expiry_date;
    if (batch_no !== undefined) med.batch_no = batch_no;

    return res.json(med);
  });

  // Prescriptions (Paginated server-side)
  app.get('/api/prescriptions', authMiddleware, (req, res) => {
    const page = parseInt(String(req.query.page || '1'), 10);
    const limit = parseInt(String(req.query.limit || '10'), 10);
    const status = req.query.status ? String(req.query.status) : null;
    const consultationId = req.query.consultation_id ? String(req.query.consultation_id) : null;

    let filtered = db.prescriptions;
    if (consultationId) {
      filtered = filtered.filter((p) => p.consultation_id === consultationId);
      return res.json(filtered.map((pr) => ({
        ...pr,
        medication: db.medications.find((m) => m.id === pr.medication_id),
      })));
    }
    if (status) {
      filtered = filtered.filter((p) => p.status === status);
    }

    const total = filtered.length;
    const total_pages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedData = filtered.slice(startIndex, startIndex + limit).map((pr) => {
      const consultation = db.consultations.find((c) => c.id === pr.consultation_id);
      const encounter = consultation ? db.encounters.find((e) => e.id === consultation.encounter_id) : null;
      const patient = encounter ? db.patients.find((pt) => pt.id === encounter.patient_id) : null;
      const medication = db.medications.find((m) => m.id === pr.medication_id);
      return {
        ...pr,
        consultation,
        patient,
        medication,
      };
    });

    return res.json({
      data: paginatedData,
      total,
      page,
      limit,
      total_pages,
    });
  });

  app.post('/api/prescriptions', authMiddleware, (req, res) => {
    const { consultation_id, medication_id, dosage_instructions, quantity_prescribed } = req.body;
    if (!consultation_id || !medication_id || !quantity_prescribed) {
      return res.status(422).json({ message: 'Something required was left blank. Check the highlighted field.' });
    }
    const newPr: PrescriptionItem = {
      id: `prc_${Date.now()}`,
      consultation_id,
      medication_id,
      dosage_instructions: dosage_instructions || null,
      quantity_prescribed: Number(quantity_prescribed),
      quantity_dispensed: 0,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    db.prescriptions.push(newPr);
    return res.status(201).json(newPr);
  });

  // Dispensing
  app.get('/api/dispensings', authMiddleware, (req, res) => {
    return res.json(db.dispensings);
  });

  app.post('/api/dispensing', authMiddleware, (req, res) => {
    const { prescription_id, quantity_dispensed } = req.body;
    if (!prescription_id || quantity_dispensed === undefined) {
      return res.status(422).json({ message: 'Something required was left blank. Check the highlighted field.' });
    }
    const pr = db.prescriptions.find((p) => p.id === prescription_id);
    if (!pr) {
      return res.status(404).json({ message: "Prescription record doesn't exist." });
    }

    const qty = Number(quantity_dispensed);
    const med = db.medications.find((m) => m.id === pr.medication_id);
    if (!med) {
      return res.status(404).json({ message: "Medication item doesn't exist." });
    }

    if (qty > med.quantity_in_stock) {
      return res.status(422).json({
        message: `Insufficient stock! Requested ${qty} ${med.unit}(s), but only ${med.quantity_in_stock} in stock.`,
      });
    }

    // Deduct stock
    med.quantity_in_stock -= qty;

    // Update prescription
    pr.quantity_dispensed = (pr.quantity_dispensed || 0) + qty;
    if (pr.quantity_dispensed >= pr.quantity_prescribed) {
      pr.status = 'dispensed';
    } else {
      pr.status = 'partial';
    }

    // Record dispensing
    const currentUser = (req as any).user;
    const newDispensing: DispensingItem = {
      id: `dsp_${Date.now()}`,
      prescription_id,
      quantity_dispensed: qty,
      dispensed_by: currentUser.name,
      dispensed_at: new Date().toISOString(),
    };
    db.dispensings.push(newDispensing);

    // Check if encounter can be marked dispensed/completed
    const cns = db.consultations.find((c) => c.id === pr.consultation_id);
    if (cns) {
      const enc = db.encounters.find((e) => e.id === cns.encounter_id);
      if (enc) {
        const allPrs = db.prescriptions.filter((p) => p.consultation_id === cns.id);
        const allDispensed = allPrs.every((p) => p.status === 'dispensed');
        if (allDispensed) {
          enc.status = 'completed';
          enc.updated_at = new Date().toISOString();
        } else {
          enc.status = 'pharmacy';
          enc.updated_at = new Date().toISOString();
        }
      }
    }

    return res.status(201).json({
      dispensing: newDispensing,
      prescription: pr,
      remaining_stock: med.quantity_in_stock,
    });
  });

  // OpenAPI spec route for frontend inspection
  app.delete('/api/consultations/:id', authMiddleware, (req, res) => {
    const { id } = req.params;
    const currentUser = (req as any).user;
    const idx = db.consultations.findIndex(c => c.id === id);
    if (idx === -1) return res.status(404).json({ message: 'Not found' });
    if (db.consultations[idx].doctor_id !== currentUser.id && currentUser.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    db.consultations.splice(idx, 1);
    return res.status(200).json({ message: 'Deleted' });
  });

  app.delete('/api/vitals/:id', authMiddleware, (req, res) => {
    const { id } = req.params;
    const currentUser = (req as any).user;
    const idx = db.vitals.findIndex(v => v.id === id);
    if (idx === -1) return res.status(404).json({ message: 'Not found' });
    if (db.vitals[idx].recorded_by !== currentUser.name && currentUser.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    db.vitals.splice(idx, 1);
    return res.status(200).json({ message: 'Deleted' });
  });

  app.delete('/api/dispensing/:id', authMiddleware, (req, res) => {
    const { id } = req.params;
    const currentUser = (req as any).user;
    const idx = db.dispensings.findIndex(d => d.id === id);
    if (idx === -1) return res.status(404).json({ message: 'Not found' });
    if (db.dispensings[idx].dispensed_by !== currentUser.name && currentUser.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    db.dispensings.splice(idx, 1);
    return res.status(200).json({ message: 'Deleted' });
  });

  app.delete('/api/patients/:id', authMiddleware, (req, res) => {
    const currentUser = (req as any).user;
    if (currentUser.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const idx = db.patients.findIndex(p => p.id === req.params.id);
    if (idx !== -1) db.patients.splice(idx, 1);
    return res.status(200).json({ message: 'Deleted' });
  });

  app.delete('/api/encounters/:id', authMiddleware, (req, res) => {
    const currentUser = (req as any).user;
    if (currentUser.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const idx = db.encounters.findIndex(e => e.id === req.params.id);
    if (idx !== -1) db.encounters.splice(idx, 1);
    return res.status(200).json({ message: 'Deleted' });
  });

  app.delete('/api/medications/:id', authMiddleware, (req, res) => {
    const currentUser = (req as any).user;
    if (currentUser.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const idx = db.medications.findIndex(m => m.id === req.params.id);
    if (idx !== -1) db.medications.splice(idx, 1);
    return res.status(200).json({ message: 'Deleted' });
  });
  app.get('/openapi.json', (req, res) => {
    res.json({
      openapi: '3.0.0',
      info: { title: 'Missions Clinic API', version: '1.0.0' },
      paths: {
        '/api/auth/login': { post: { summary: 'Staff PIN login' } },
        '/api/patients': { get: { summary: 'List/search patients' }, post: { summary: 'Create patient' } },
        '/api/patients/{id}': { get: { summary: 'Get patient history' } },
        '/api/encounters': { get: { summary: 'List queue encounters' }, post: { summary: 'Create encounter' } },
        '/api/vitals': { post: { summary: 'Create vitals record' } },
        '/api/consultations': { post: { summary: 'Create consultation' } },
        '/api/consultations/{id}': { patch: { summary: 'Update consultation' } },
        '/api/medications': { get: { summary: 'Inventory' }, post: { summary: 'Add medication' } },
        '/api/prescriptions': { get: { summary: 'Paginated prescriptions list' } },
        '/api/dispensing': { post: { summary: 'Dispense medication' } },
        '/api/staff': { get: { summary: 'List staff' }, post: { summary: 'Create staff' } },
      },
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Missions Clinic server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

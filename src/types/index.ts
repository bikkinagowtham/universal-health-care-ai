export type UserRole = 'patient' | 'doctor' | 'hospital_admin' | 'platform_admin' | 'admin';

export type VerificationStatus =
  | 'VERIFIED'
  | 'PENDING_VERIFICATION'
  | 'NOT_VERIFIED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'INFORMATION_OUTDATED';

export type AppointmentStatus = 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled' | 'Rescheduled';

export type QueueStatus =
  | 'Waiting'
  | 'Serving'
  | 'Completed'
  | 'Delayed'
  | 'Absent'
  | 'Cancelled'
  | 'WAITING'
  | 'SERVING'
  | 'COMPLETED'
  | 'DELAYED'
  | 'ABSENT'
  | 'CANCELLED';

export type NotificationChannel = 'SMS' | 'Push' | 'Both' | 'None';

export interface NotificationPreference {
  channel: NotificationChannel;
  advanceMinutes: number[]; // e.g. [30, 20, 15, 10, 5]
  customMinutes?: number;
  smsConsent: boolean;
  phone?: string;
  gatewayDeliveryStatus?: 'QUEUED_LOCAL' | 'DELIVERED_TEST' | 'GATEWAY_UNCONFIGURED';
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  medical_registration_number: string;
  registration_council: string;
  qualifications: string[];
  specialization: string;
  experience_years: number;
  hospital_id?: string;
  hospital_name?: string;
  clinic_address: string;
  city: string;
  district?: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  official_phone: string;
  consultation_fee: number;
  languages_spoken: string[];
  verification_status: VerificationStatus;
  last_verified_at: string | null;
  consultation_timings: string;
  bio: string;
  available_slots: string[];
}

export interface HospitalBedInfo {
  general_total: number;
  general_available: number;
  icu_total: number;
  icu_available: number;
  emergency_total: number;
  emergency_available: number;
  ventilator_total?: number;
  ventilator_available?: number;
  oxygen_beds_available?: number;
  last_updated: string;
  updated_by?: string;
}

export interface Hospital {
  id: string;
  name: string;
  official_email: string;
  phone: string;
  emergency_phone: string;
  ambulance_phone?: string;
  website: string;
  address: string;
  pincode?: string;
  city: string;
  district?: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  verification_status: VerificationStatus;
  last_verified_at: string | null;
  departments: string[];
  operating_hours: string;
  opd_timings?: string;
  facilities: string[];
  consultation_fee_min: number;
  consultation_fee_max?: number;
  registration_number?: string;
  accreditation?: string[];
  total_beds?: number;
  icu_beds?: number;
  bed_availability?: HospitalBedInfo;
  overview?: string;
  verified_source?: string;
}

export interface SpecializationInfo {
  id: string;
  name: string;
  teluguName?: string;
  hindiName?: string;
  category: 'Medical' | 'Surgical' | 'Diagnostic' | 'Supportive';
  description: string;
  commonSymptoms: string[];
  departmentKey: string;
  iconName?: string;
}

export interface SymptomMatchResult {
  symptomQuery: string;
  recommendedSpecialties: string[];
  matchingHospitals: Hospital[];
  matchingDoctors: Doctor[];
  triageGuidance: string;
  isEmergencyAlert: boolean;
}

export interface Appointment {
  id: string;
  booking_reference: string;
  patient_id: string;
  patient_name: string;
  patient_phone: string;
  doctor_id: string;
  doctor_name: string;
  doctor_specialization: string;
  hospital_name?: string;
  clinic_address: string;
  city?: string;
  state?: string;
  appointment_date: string;
  appointment_time: string;
  status: AppointmentStatus;
  consultation_fee: number;
  symptoms_reason?: string;
  family_member_name?: string;
  notification_preferences?: NotificationPreference;
  opd_token_number?: number;
  token_code?: string; // e.g. A025
  payment_status?: 'Paid' | 'Pending' | 'Refunded';
  payment_method?: 'PhonePe' | 'Google Pay' | 'UPI' | 'Card / Netbanking' | 'Cash at Counter';
  created_at: string;
}

export interface QueueToken {
  id: string;
  hospital_id: string;
  hospitalId?: string;
  hospital_name: string;
  department: string;
  doctor_id?: string;
  doctorId?: string;
  doctor_name: string;
  token_number: number;
  tokenNumber?: number;
  token_code?: string; // e.g. A025
  patient_id?: string;
  patient_name: string;
  patientName?: string;
  queue_date: string;
  session: 'Morning OPD' | 'Evening OPD' | 'Emergency OPD';
  status: QueueStatus;
  estimated_wait_minutes: number;
  notification_channel?: NotificationChannel;
  created_at: string;
}

export interface MedicalRecord {
  id: string;
  patient_id: string;
  patient_name: string;
  family_member_name?: string;
  document_type: 'Lab Report' | 'Prescription' | 'Discharge Summary' | 'Vaccination';
  title: string;
  doctor_name?: string;
  hospital_name?: string;
  record_date: string;
  file_name: string;
  file_size: string;
  notes?: string;
  uploaded_at: string;
}

export interface FamilyMember {
  id: string;
  user_id?: string;
  name: string;
  relation: string;
  age: number;
  gender: string;
  blood_group?: string;
  bloodGroup?: string;
  dob?: string;
  phone?: string;
  allergies?: string;
  chronic_conditions?: string[];
  ongoing_medications?: string[];
  emergency_contact?: {
    name: string;
    phone: string;
    relation: string;
  };
  consent_level?: 'Full Guardian Access' | 'View-Only Access' | 'Emergency-Only Access';
  consent_granted: boolean;
  caregiver_name?: string;
  created_at?: string;
}

// Module 1: AI Medical Report Explainer Types
export interface MedicalParameter {
  name: string;
  category: string;
  measured_value: string | number;
  reference_range: string;
  unit: string;
  status: 'NORMAL' | 'HIGH' | 'LOW' | 'CRITICAL' | 'BORDERLINE';
  simple_explanation: string;
}

export interface AnalyzedReport {
  id: string;
  patient_id: string;
  patient_name: string;
  family_member_id?: string;
  family_member_name?: string;
  report_title: string;
  lab_name?: string;
  test_date: string;
  file_name?: string;
  file_type?: string;
  summary: string;
  parameters: MedicalParameter[];
  questions_for_doctor: string[];
  extracted_medicines?: ExtractedPrescriptionItem[];
  disclaimer: string;
  language: string;
  created_at: string;
}

export interface ExtractedPrescriptionItem {
  medicine_name: string;
  dosage: string;
  instructions: 'Before Food' | 'After Food' | 'With Food' | 'Empty Stomach' | 'As Needed';
  frequency?: string;
  morning?: boolean;
  afternoon?: boolean;
  evening?: boolean;
  night?: boolean;
  duration?: string;
  prescribed_by?: string;
}

// Module 3: Emergency Coordination Types
export interface EmergencyServiceContact {
  id: string;
  name: string;
  number: string;
  category: 'Ambulance' | 'Police' | 'National' | 'Helpline' | 'Poison Control' | 'Cardiac / Trauma';
  description: string;
  tollFree: boolean;
  available24x7: boolean;
  dialPrompt?: string;
}

// Module 4: Smart Medicine Reminder Types
export type DoseTimeSlot = 'Morning' | 'Afternoon' | 'Evening' | 'Night';

export interface MedicineSchedule {
  slot: DoseTimeSlot;
  time: string; // e.g. "08:00 AM"
  takenToday?: boolean;
  skippedToday?: boolean;
}

export interface DoseLogEntry {
  date: string; // YYYY-MM-DD
  slot: DoseTimeSlot;
  status: 'Taken' | 'Skipped';
  timestamp: string;
}

export interface MedicineReminder {
  id: string;
  patient_id: string;
  family_member_id?: string;
  family_member_name?: string;
  medicine_name: string;
  dosage: string; // e.g. "500 mg", "1 tablet"
  prescribed_by?: string;
  frequency: string; // "Daily", "Twice daily", "Three times daily"
  instructions: 'Before Food' | 'After Food' | 'With Food' | 'Empty Stomach' | 'As Needed';
  schedule: MedicineSchedule[];
  start_date: string;
  end_date?: string;
  is_chronic?: boolean;
  current_stock: number;
  refill_reminder_at: number;
  history: DoseLogEntry[];
  created_at: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  city?: string;
  state?: string;
  country: string;
  verified: boolean;
}

export interface SubscriptionTier {
  id: string;
  roleTarget: 'patient' | 'doctor' | 'hospital';
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  limitations: string[];
  popular?: boolean;
}

export interface ServerStatus {
  status: string;
  appName: string;
  version: string;
  geminiConfigured: boolean;
  supabaseConfigured: boolean;
  smsGatewayConfigured: boolean;
  mode: string;
  stats: {
    doctorsCount: number;
    verifiedDoctorsCount: number;
    hospitalsCount: number;
    verifiedHospitalsCount: number;
    appointmentsCount: number;
    queueTokensActive: number;
  };
}

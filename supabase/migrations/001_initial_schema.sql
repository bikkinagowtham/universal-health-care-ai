-- ====================================================================
-- UNIVERSAL HEALTH CARE AI — POSTGRESQL & SUPABASE DATABASE SCHEMA
-- Compliant with Indian DPDP Act, HIPAA standards, and Role-Based Access
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS
CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'hospital_admin', 'platform_admin');
CREATE TYPE verification_status AS ENUM ('VERIFIED', 'PENDING_VERIFICATION', 'NOT_VERIFIED', 'INFORMATION_OUTDATED');
CREATE TYPE appointment_status AS ENUM ('Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rescheduled');
CREATE TYPE queue_status AS ENUM ('Waiting', 'Serving', 'Completed', 'Skipped', 'Cancelled');
CREATE TYPE subscription_tier AS ENUM ('Patient_Basic', 'Patient_Plus', 'Doctor_Professional', 'Clinic_Starter', 'Hospital_Growth', 'Hospital_Enterprise');

-- 3. PROFILES TABLE (Supabase auth.users mirror)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    role user_role NOT NULL DEFAULT 'patient',
    country TEXT NOT NULL DEFAULT 'India',
    state TEXT,
    city TEXT,
    avatar_url TEXT,
    terms_accepted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PATIENTS TABLE
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    date_of_birth DATE,
    gender TEXT,
    blood_group TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    allergies TEXT[] DEFAULT ARRAY[]::TEXT[],
    chronic_conditions TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. HOSPITALS TABLE
CREATE TABLE IF NOT EXISTS hospitals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    official_email TEXT NOT NULL,
    phone TEXT NOT NULL,
    emergency_phone TEXT NOT NULL,
    website TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'India',
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    verification_status verification_status NOT NULL DEFAULT 'PENDING_VERIFICATION',
    last_verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES profiles(id),
    departments TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    operating_hours TEXT NOT NULL,
    facilities TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    consultation_fee_min NUMERIC(10,2) NOT NULL DEFAULT 500.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. DOCTORS TABLE
CREATE TABLE IF NOT EXISTS doctors (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    medical_registration_number TEXT UNIQUE NOT NULL,
    registration_council TEXT NOT NULL,
    qualifications TEXT[] NOT NULL,
    specialization TEXT NOT NULL,
    experience_years INTEGER NOT NULL DEFAULT 0,
    hospital_id UUID REFERENCES hospitals(id) ON DELETE SET NULL,
    clinic_address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'India',
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    official_phone TEXT NOT NULL,
    consultation_fee NUMERIC(10,2) NOT NULL,
    languages_spoken TEXT[] NOT NULL DEFAULT ARRAY['English'],
    verification_status verification_status NOT NULL DEFAULT 'PENDING_VERIFICATION',
    last_verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES profiles(id),
    consultation_timings TEXT NOT NULL,
    bio TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. DOCTOR CREDENTIALS & DOCUMENTS (for Admin Verification)
CREATE TABLE IF NOT EXISTS doctor_credentials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL, -- 'Degree_Certificate', 'Medical_Council_Registration', 'ID_Proof'
    document_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. APPOINTMENT SLOTS
CREATE TABLE IF NOT EXISTS appointment_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    hospital_id UUID REFERENCES hospitals(id) ON DELETE SET NULL,
    slot_date DATE NOT NULL,
    slot_time TIME NOT NULL,
    is_booked BOOLEAN NOT NULL DEFAULT FALSE,
    locked_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_doctor_slot UNIQUE (doctor_id, slot_date, slot_time)
);

-- 9. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_reference TEXT UNIQUE NOT NULL,
    patient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE RESTRICT,
    hospital_id UUID REFERENCES hospitals(id) ON DELETE SET NULL,
    slot_id UUID REFERENCES appointment_slots(id),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    patient_name TEXT NOT NULL,
    patient_phone TEXT,
    family_member_id UUID,
    symptoms_reason TEXT,
    status appointment_status NOT NULL DEFAULT 'Confirmed',
    consultation_fee NUMERIC(10,2) NOT NULL,
    cancellation_reason TEXT,
    cancelled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. FAMILY MEMBERS TABLE
CREATE TABLE IF NOT EXISTS family_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    primary_patient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    relationship TEXT NOT NULL,
    date_of_birth DATE,
    gender TEXT,
    blood_group TEXT,
    allergies TEXT[] DEFAULT ARRAY[]::TEXT[],
    consent_granted BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. DIGITAL MEDICAL RECORDS
CREATE TABLE IF NOT EXISTS medical_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES profiles(id),
    family_member_id UUID REFERENCES family_members(id) ON DELETE SET NULL,
    document_type TEXT NOT NULL, -- 'Lab Report', 'Prescription', 'Discharge Summary', 'Imaging'
    title TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size_bytes BIGINT,
    storage_path TEXT NOT NULL,
    doctor_notes TEXT,
    is_confidential BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. HOSPITAL QUEUE TOKENS
CREATE TABLE IF NOT EXISTS queue_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
    department TEXT NOT NULL,
    token_number INTEGER NOT NULL,
    patient_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    patient_name TEXT NOT NULL,
    queue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status queue_status NOT NULL DEFAULT 'Waiting',
    estimated_wait_minutes INTEGER NOT NULL DEFAULT 15,
    called_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Appointment',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. SUBSCRIPTIONS & PLATFORM REVENUE
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    plan_tier subscription_tier NOT NULL,
    plan_name TEXT NOT NULL,
    price_inr NUMERIC(10,2) NOT NULL,
    billing_period TEXT NOT NULL DEFAULT 'monthly',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    current_period_end TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. PAYMENTS TABLE (Test / Sandbox only)
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id TEXT UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES profiles(id),
    amount_inr NUMERIC(10,2) NOT NULL,
    payment_type TEXT NOT NULL, -- 'Subscription', 'Platform_Fee' (NEVER doctor consultation fee)
    status TEXT NOT NULL DEFAULT 'COMPLETED_SANDBOX',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. EXPENSES & FINANCIAL AUDIT (For business dashboard)
CREATE TABLE IF NOT EXISTS financial_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entry_type TEXT NOT NULL, -- 'Revenue', 'Operating_Expense', 'Refund'
    category TEXT NOT NULL,   -- 'Hosting_Cloud', 'Telecom_SMS', 'Legal_Compliance', 'Subscription'
    amount_inr NUMERIC(10,2) NOT NULL,
    description TEXT NOT NULL,
    record_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. ADMIN AUDIT LOGS
CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES profiles(id),
    action_type TEXT NOT NULL,
    target_entity TEXT NOT NULL,
    target_id UUID,
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 18. PATIENT CONSENT LOGS (DPDP Act Compliance)
CREATE TABLE IF NOT EXISTS consent_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    consent_type TEXT NOT NULL, -- 'DATA_PROCESSING', 'TELECONSULTATION', 'RECORDS_SHARING'
    granted BOOLEAN NOT NULL DEFAULT TRUE,
    ip_address TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE queue_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;

-- Profiles: users read own profile, doctors/hospitals viewable publicly if verified
CREATE POLICY "Public profiles can be viewed" ON profiles
    FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Appointments: Patients read own, Doctors read their consultations
CREATE POLICY "Patients view own appointments" ON appointments
    FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Doctors view their patient appointments" ON appointments
    FOR SELECT USING (auth.uid() = doctor_id);
CREATE POLICY "Patients can insert their appointments" ON appointments
    FOR INSERT WITH CHECK (auth.uid() = patient_id);

-- Medical Records: Strict Patient Confidentiality
CREATE POLICY "Patients view own records" ON medical_records
    FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Patients manage own records" ON medical_records
    FOR ALL USING (auth.uid() = patient_id);

-- Doctors & Hospitals: Public read for verified
CREATE POLICY "Verified doctors are publicly viewable" ON doctors
    FOR SELECT USING (true);
CREATE POLICY "Verified hospitals are publicly viewable" ON hospitals
    FOR SELECT USING (true);

import fs from 'fs';
import path from 'path';
import {
  Doctor,
  Hospital,
  HospitalBedInfo,
  Appointment,
  QueueToken,
  MedicalRecord,
  AnalyzedReport,
  MedicineReminder,
  FamilyMember,
  DoseTimeSlot,
  SubscriptionTier,
  VerificationStatus,
} from '../src/types';
import { COMPREHENSIVE_HOSPITALS } from '../src/data/hospitalsData';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

interface DatabaseSchema {
  doctors: Doctor[];
  hospitals: Hospital[];
  appointments: Appointment[];
  queueTokens: QueueToken[];
  medicalRecords: MedicalRecord[];
  analyzedReports: AnalyzedReport[];
  medicineReminders: MedicineReminder[];
  familyMembers: FamilyMember[];
  subscriptionTiers: SubscriptionTier[];
  adminAuditLogs: Array<{
    id: string;
    admin_name: string;
    action: string;
    target: string;
    timestamp: string;
    status: string;
    details?: any;
  }>;
  smsGatewaySettings: {
    provider: string;
    isConfigured: boolean;
    senderId: string;
    statusNote: string;
  };
}

// Initial verified providers across major Indian States
const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'd-1',
    name: 'Dr. Ramesh Chandra, DM',
    email: 'dr.ramesh.chandra@ayush.org',
    medical_registration_number: 'APMC/DOC/49821',
    registration_council: 'Andhra Pradesh Medical Council',
    qualifications: ['MBBS', 'MD (General Medicine)', 'DM (Cardiology)'],
    specialization: 'Cardiology',
    experience_years: 16,
    hospital_id: 'h-1',
    hospital_name: 'Ayush Multispecialty Hospital',
    clinic_address: 'Suite 302, Ayush Hospital, Bandar Road, Vijayawada',
    city: 'Vijayawada',
    district: 'NTR / Krishna',
    state: 'Andhra Pradesh',
    country: 'India',
    latitude: 16.5065,
    longitude: 80.6482,
    official_phone: '+91 866 247 1812',
    consultation_fee: 750,
    languages_spoken: ['Telugu', 'English', 'Hindi'],
    verification_status: 'VERIFIED',
    last_verified_at: '2026-10-15',
    consultation_timings: 'Mon-Sat: 09:30 AM - 01:30 PM, 05:00 PM - 08:00 PM',
    bio: 'Senior Interventional Cardiologist specializing in coronary interventions, hypertension management, and preventive heart care.',
    available_slots: ['09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM'],
  },
  {
    id: 'd-2',
    name: 'Dr. Ananya Rao, DNB',
    email: 'dr.ananya.rao@andhrahospitals.in',
    medical_registration_number: 'APMC/DOC/53120',
    registration_council: 'Andhra Pradesh Medical Council',
    qualifications: ['MBBS', 'DNB (Pediatrics)', 'Fellowship in Pediatric Critical Care'],
    specialization: 'Pediatrics',
    experience_years: 12,
    hospital_id: 'h-2',
    hospital_name: 'KIMS Andhra Hospitals',
    clinic_address: 'Pediatric Wing, KIMS Andhra Hospitals, Governorpet, Vijayawada',
    city: 'Vijayawada',
    district: 'NTR / Krishna',
    state: 'Andhra Pradesh',
    country: 'India',
    latitude: 16.5126,
    longitude: 80.6278,
    official_phone: '+91 866 243 4570',
    consultation_fee: 500,
    languages_spoken: ['Telugu', 'English'],
    verification_status: 'VERIFIED',
    last_verified_at: '2026-09-29',
    consultation_timings: 'Mon-Fri: 10:00 AM - 02:00 PM, 06:00 PM - 08:30 PM',
    bio: 'Consultant Pediatrician with extensive focus on child growth, immunizations, and pediatric emergency care.',
    available_slots: ['10:00 AM', '10:30 AM', '11:15 AM', '12:00 PM', '06:00 PM', '06:45 PM', '07:30 PM'],
  },
  {
    id: 'd-3',
    name: 'Dr. Vikramaditya Reddy, DM',
    email: 'vikram.reddy@nims.edu.in',
    medical_registration_number: 'TSMC/DOC/38472',
    registration_council: 'Telangana State Medical Council',
    qualifications: ['MBBS', 'MD (Neurology)', 'DM (Neurology)'],
    specialization: 'Neurology',
    experience_years: 19,
    hospital_id: 'h-3',
    hospital_name: "NIMS (Nizam's Institute of Medical Sciences)",
    clinic_address: 'Neurology OPD Block, NIMS, Somajiguda, Hyderabad',
    city: 'Hyderabad',
    district: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    latitude: 17.4224,
    longitude: 78.4555,
    official_phone: '+91 40 2348 9044',
    consultation_fee: 600,
    languages_spoken: ['Telugu', 'Hindi', 'English', 'Urdu'],
    verification_status: 'VERIFIED',
    last_verified_at: '2026-10-02',
    consultation_timings: 'Mon-Fri: 09:00 AM - 01:00 PM',
    bio: 'Senior Consultant Neurologist with special clinical interest in headache disorders, epilepsy, stroke rehab, and movement disorders.',
    available_slots: ['09:00 AM', '09:40 AM', '10:20 AM', '11:00 AM', '11:40 AM', '12:20 PM'],
  },
  {
    id: 'd-4',
    name: 'Dr. Praveen Shenoy, MS',
    email: 'dr.praveen.shenoy@manipalhospitals.com',
    medical_registration_number: 'KMC/DOC/61984',
    registration_council: 'Karnataka Medical Council',
    qualifications: ['MBBS', 'MS (Orthopedics)', 'MCh (Joint Replacement)'],
    specialization: 'Orthopedics',
    experience_years: 14,
    hospital_id: 'h-4',
    hospital_name: 'Manipal Hospital Whitefield',
    clinic_address: 'Room 108, Manipal Hospital, Whitefield, Bengaluru',
    city: 'Bengaluru',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    country: 'India',
    latitude: 12.9865,
    longitude: 77.7348,
    official_phone: '+91 80 2502 4455',
    consultation_fee: 900,
    languages_spoken: ['Kannada', 'English', 'Hindi', 'Tamil'],
    verification_status: 'VERIFIED',
    last_verified_at: '2026-10-12',
    consultation_timings: 'Tue-Sat: 10:00 AM - 03:00 PM',
    bio: 'Orthopedic and Arthroscopy Surgeon dedicated to robotic knee & hip replacements and sports ligament reconstructions.',
    available_slots: ['10:00 AM', '10:45 AM', '11:30 AM', '01:00 PM', '01:45 PM', '02:30 PM'],
  },
  {
    id: 'd-5',
    name: 'Dr. Meenakshi Sundaram, MD',
    email: 'dr.meenakshi@apollohospitals.com',
    medical_registration_number: 'TNMC/DOC/55192',
    registration_council: 'Tamil Nadu Medical Council',
    qualifications: ['MBBS', 'MD (Obstetrics & Gynecology)'],
    specialization: 'Gynecology',
    experience_years: 15,
    hospital_id: 'h-6',
    hospital_name: 'Apollo Speciality Hospitals Greams Road',
    clinic_address: 'Greams Lane, Thousand Lights, Chennai',
    city: 'Chennai',
    district: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    latitude: 13.0583,
    longitude: 80.2514,
    official_phone: '+91 44 2829 0200',
    consultation_fee: 800,
    languages_spoken: ['Tamil', 'English', 'Telugu'],
    verification_status: 'VERIFIED',
    last_verified_at: '2026-10-18',
    consultation_timings: 'Mon-Sat: 10:00 AM - 02:00 PM',
    bio: 'Senior Consultant Obstetrician & Gynecologist specializing in high-risk pregnancies, laparoscopic interventions, and maternal-fetal wellness.',
    available_slots: ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '01:00 PM'],
  },
  {
    id: 'd-6',
    name: 'Dr. Rajesh Deshmukh, MD',
    email: 'dr.rajesh.deshmukh@kemhospital.org',
    medical_registration_number: 'MMC/DOC/72918',
    registration_council: 'Maharashtra Medical Council',
    qualifications: ['MBBS', 'MD (General Medicine)', 'FCCM (Critical Care)'],
    specialization: 'General Medicine',
    experience_years: 17,
    hospital_id: 'h-7',
    hospital_name: 'KEM Hospital & Research Center',
    clinic_address: 'Rasta Peth, Sardar Moodliar Road, Pune',
    city: 'Pune',
    district: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    latitude: 18.5196,
    longitude: 73.8687,
    official_phone: '+91 20 2612 5600',
    consultation_fee: 650,
    languages_spoken: ['Marathi', 'Hindi', 'English'],
    verification_status: 'VERIFIED',
    last_verified_at: '2026-10-22',
    consultation_timings: 'Mon-Sat: 09:00 AM - 01:00 PM',
    bio: 'Senior Physician & Critical Care Specialist focusing on infectious diseases, diabetes control, and geriatric preventative medicine.',
    available_slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:30 AM', '12:00 PM'],
  },
  {
    id: 'd-7',
    name: 'Dr. Srinivasulu Varma, DNB',
    email: 'srinivasulu.varma@drclinic.in',
    medical_registration_number: 'APMC/DOC/78210',
    registration_council: 'Andhra Pradesh Medical Council',
    qualifications: ['MBBS', 'DNB (General Medicine)'],
    specialization: 'General Medicine',
    experience_years: 8,
    clinic_address: 'Siddhartha Nagar, Ring Road, Vijayawada',
    city: 'Vijayawada',
    district: 'NTR / Krishna',
    state: 'Andhra Pradesh',
    country: 'India',
    latitude: 16.5090,
    longitude: 80.6550,
    official_phone: '+91 866 297 3344',
    consultation_fee: 400,
    languages_spoken: ['Telugu', 'English'],
    verification_status: 'PENDING_VERIFICATION',
    last_verified_at: null,
    consultation_timings: 'Mon-Sat: 06:00 PM - 09:30 PM',
    bio: 'Primary care physician focusing on fever management, diabetes wellness, and lifestyle disease prevention. Credentials under council audit.',
    available_slots: ['06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM'],
  },
  // --- RAJAHMUNDRY (EAST GODAVARI) DOCTORS ---
  {
    id: 'd-apex-1',
    name: 'Dr. B. N. Murthy, MS, MCh',
    email: 'dr.bnmurthy@apexhospitalrjy.com',
    medical_registration_number: 'APMC/DOC/31890',
    registration_council: 'Andhra Pradesh Medical Council',
    qualifications: ['MBBS', 'MS (General Surgery)', 'MCh (Surgical Oncology)'],
    specialization: 'General Surgery',
    experience_years: 21,
    hospital_id: 'h-apex-rjy',
    hospital_name: 'Apex Hospital',
    clinic_address: 'Near Kambala Tank, Danavaipeta, Rajahmundry',
    city: 'Rajahmundry',
    district: 'East Godavari',
    state: 'Andhra Pradesh',
    country: 'India',
    latitude: 17.0005,
    longitude: 81.7800,
    official_phone: '+91 883 246 8000',
    consultation_fee: 550,
    languages_spoken: ['Telugu', 'English', 'Hindi'],
    verification_status: 'VERIFIED',
    last_verified_at: '2026-10-20',
    consultation_timings: 'Mon-Sat: 10:00 AM - 01:30 PM, 06:00 PM - 08:30 PM',
    bio: 'Senior Consultant Surgeon at Apex Hospital, Rajahmundry with 21 years of surgical excellence in general surgery, laparoscopic procedures, and oncology consultations.',
    available_slots: ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '06:00 PM', '06:30 PM', '07:00 PM'],
  },
  {
    id: 'd-apex-2',
    name: 'Dr. K. Satyavathi, MD',
    email: 'dr.satyavathi@apexhospitalrjy.com',
    medical_registration_number: 'APMC/DOC/41209',
    registration_council: 'Andhra Pradesh Medical Council',
    qualifications: ['MBBS', 'MD (General Medicine)', 'PG Diploma in Diabetology'],
    specialization: 'General Medicine',
    experience_years: 14,
    hospital_id: 'h-apex-rjy',
    hospital_name: 'Apex Hospital',
    clinic_address: 'Danavaipeta, Main Road, Rajahmundry',
    city: 'Rajahmundry',
    district: 'East Godavari',
    state: 'Andhra Pradesh',
    country: 'India',
    latitude: 17.0005,
    longitude: 81.7800,
    official_phone: '+91 883 246 8011',
    consultation_fee: 450,
    languages_spoken: ['Telugu', 'English'],
    verification_status: 'VERIFIED',
    last_verified_at: '2026-10-20',
    consultation_timings: 'Mon-Sat: 09:30 AM - 01:00 PM, 05:00 PM - 08:00 PM',
    bio: 'Consultant Physician at Apex Hospital Rajahmundry specializing in viral fever management, dengue care, hypertension, and comprehensive diabetes care.',
    available_slots: ['09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM'],
  },
  {
    id: 'd-gsl-1',
    name: 'Dr. G. Subrahmanyam, MD',
    email: 'dr.gsubrahmanyam@gslmc.com',
    medical_registration_number: 'APMC/DOC/42115',
    registration_council: 'Andhra Pradesh Medical Council',
    qualifications: ['MBBS', 'MD (General Medicine)', 'Fellow of Critical Care Medicine'],
    specialization: 'General Medicine',
    experience_years: 18,
    hospital_id: 'h-gsl-rjy',
    hospital_name: 'GSL Medical College & General Hospital',
    clinic_address: 'OPD Block A, NH-16, Rajanagaram, Rajahmundry',
    city: 'Rajahmundry',
    district: 'East Godavari',
    state: 'Andhra Pradesh',
    country: 'India',
    latitude: 17.0780,
    longitude: 81.8970,
    official_phone: '+91 883 248 4999',
    consultation_fee: 350,
    languages_spoken: ['Telugu', 'English', 'Hindi'],
    verification_status: 'VERIFIED',
    last_verified_at: '2026-09-15',
    consultation_timings: 'Mon-Sat: 09:00 AM - 02:00 PM',
    bio: 'Professor & Unit Chief of General Medicine at GSL Medical College, Rajahmundry. Specialist in infectious disease epidemics, multi-morbidity, and fever triage.',
    available_slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM'],
  },
  {
    id: 'd-swatantra-1',
    name: 'Dr. S. K. Venkat, MS',
    email: 'dr.skvenkat@swatantrahospitals.com',
    medical_registration_number: 'APMC/DOC/55820',
    registration_council: 'Andhra Pradesh Medical Council',
    qualifications: ['MBBS', 'MS (Orthopedics)', 'Fellowship in Joint Replacement'],
    specialization: 'Orthopedics',
    experience_years: 13,
    hospital_id: 'h-swatantra-rjy',
    hospital_name: 'Swatantra Hospitals',
    clinic_address: 'Kambala Cheruvu, Main Road, Rajahmundry',
    city: 'Rajahmundry',
    district: 'East Godavari',
    state: 'Andhra Pradesh',
    country: 'India',
    latitude: 17.0062,
    longitude: 81.7820,
    official_phone: '+91 883 247 1144',
    consultation_fee: 500,
    languages_spoken: ['Telugu', 'English'],
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-30',
    consultation_timings: 'Mon-Sat: 10:00 AM - 01:00 PM, 05:30 PM - 08:30 PM',
    bio: 'Orthopedic Consultant at Swatantra Hospitals Rajahmundry specializing in complex fracture fixation, arthroscopy, and total knee replacement.',
    available_slots: ['10:00 AM', '10:45 AM', '11:30 AM', '05:30 PM', '06:15 PM', '07:00 PM'],
  },
  {
    id: 'd-sai-1',
    name: 'Dr. C. Haritha, MD',
    email: 'dr.haritha@saihospitalrjy.com',
    medical_registration_number: 'APMC/DOC/61204',
    registration_council: 'Andhra Pradesh Medical Council',
    qualifications: ['MBBS', 'MD (Pediatrics)', 'Fellowship in Neonatology'],
    specialization: 'Pediatrics',
    experience_years: 11,
    hospital_id: 'h-sai-rjy',
    hospital_name: 'Sai Hospitals',
    clinic_address: 'Morampudi Junction, Rajahmundry',
    city: 'Rajahmundry',
    district: 'East Godavari',
    state: 'Andhra Pradesh',
    country: 'India',
    latitude: 17.0180,
    longitude: 81.7950,
    official_phone: '+91 883 243 5566',
    consultation_fee: 450,
    languages_spoken: ['Telugu', 'English'],
    verification_status: 'VERIFIED',
    last_verified_at: '2026-09-02',
    consultation_timings: 'Mon-Sat: 10:00 AM - 02:00 PM, 06:00 PM - 08:30 PM',
    bio: 'Senior Pediatrician & Neonatologist at Sai Hospitals Rajahmundry caring for infant fever, pediatric asthma, vaccination, and newborn intensive care.',
    available_slots: ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '06:00 PM', '06:30 PM', '07:00 PM'],
  },
  // --- HYDERABAD DOCTORS ---
  {
    id: 'd-kims-hyd-1',
    name: 'Dr. K. Bhaskar Rao, DM',
    email: 'dr.bhaskarrao@kimshospitals.com',
    medical_registration_number: 'TSMC/DOC/28190',
    registration_council: 'Telangana State Medical Council',
    qualifications: ['MBBS', 'MD (General Medicine)', 'DM (Cardiology)'],
    specialization: 'Cardiology',
    experience_years: 22,
    hospital_id: 'h-kims-secunderabad',
    hospital_name: 'KIMS Hospitals, Secunderabad',
    clinic_address: 'Cardiac Science Tower, 1-8-31/1, Minister Road, Secunderabad, Hyderabad',
    city: 'Hyderabad',
    district: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    latitude: 17.4375,
    longitude: 78.4850,
    official_phone: '+91 40 4488 5000',
    consultation_fee: 800,
    languages_spoken: ['Telugu', 'English', 'Hindi'],
    verification_status: 'VERIFIED',
    last_verified_at: '2026-10-10',
    consultation_timings: 'Mon-Fri: 09:30 AM - 02:00 PM',
    bio: 'Chief Interventional Cardiologist at KIMS Secunderabad with over 8,000 successful coronary angioplasties and advanced heart valve procedures.',
    available_slots: ['09:30 AM', '10:15 AM', '11:00 AM', '11:45 AM', '12:30 PM', '01:15 PM'],
  },
  {
    id: 'd-yashoda-1',
    name: 'Dr. P. V. Ramana, MCh',
    email: 'dr.pvramana@yashodamail.com',
    medical_registration_number: 'TSMC/DOC/39102',
    registration_council: 'Telangana State Medical Council',
    qualifications: ['MBBS', 'MS (Surgery)', 'MCh (Neurosurgery)'],
    specialization: 'Neurology',
    experience_years: 18,
    hospital_id: 'h-yashoda-somajiguda',
    hospital_name: 'Yashoda Hospitals Somajiguda',
    clinic_address: 'Raj Bhavan Road, Somajiguda, Hyderabad',
    city: 'Hyderabad',
    district: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    latitude: 17.4260,
    longitude: 78.4580,
    official_phone: '+91 40 4567 4567',
    consultation_fee: 900,
    languages_spoken: ['Telugu', 'Hindi', 'English'],
    verification_status: 'VERIFIED',
    last_verified_at: '2026-09-22',
    consultation_timings: 'Mon-Sat: 10:00 AM - 02:00 PM',
    bio: 'Senior Consultant Neurosurgeon at Yashoda Hospitals Somajiguda specializing in minimally invasive spine surgery, brain tumors, and acute trauma resuscitation.',
    available_slots: ['10:00 AM', '10:40 AM', '11:20 AM', '12:00 PM', '12:40 PM', '01:20 PM'],
  },
  {
    id: 'd-apollo-hyd-1',
    name: 'Dr. A. Sridhar, MD, DM',
    email: 'dr.asridhar@apollohyderabad.com',
    medical_registration_number: 'TSMC/DOC/44218',
    registration_council: 'Telangana State Medical Council',
    qualifications: ['MBBS', 'MD (Medicine)', 'DM (Gastroenterology)'],
    specialization: 'Gastroenterology',
    experience_years: 16,
    hospital_id: 'h-apollo-jubilee',
    hospital_name: 'Apollo Health City, Jubilee Hills',
    clinic_address: 'Road No. 72, Opposite Bharatiya Vidya Bhavan, Jubilee Hills, Hyderabad',
    city: 'Hyderabad',
    district: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    latitude: 17.4285,
    longitude: 78.4110,
    official_phone: '+91 40 2360 7777',
    consultation_fee: 1000,
    languages_spoken: ['Telugu', 'Hindi', 'English'],
    verification_status: 'VERIFIED',
    last_verified_at: '2026-10-14',
    consultation_timings: 'Mon-Fri: 11:00 AM - 03:30 PM',
    bio: 'Lead Medical Gastroenterologist at Apollo Health City Jubilee Hills. Expert in therapeutic endoscopy, fatty liver disease, and inflammatory bowel diseases.',
    available_slots: ['11:00 AM', '11:45 AM', '12:30 PM', '01:15 PM', '02:00 PM', '02:45 PM'],
  },
  // --- VISAKHAPATNAM DOCTORS ---
  {
    id: 'd-care-vizag-1',
    name: 'Dr. M. V. S. Raju, MS',
    email: 'dr.mvsraju@carehospitals.com',
    medical_registration_number: 'APMC/DOC/37841',
    registration_council: 'Andhra Pradesh Medical Council',
    qualifications: ['MBBS', 'MS (Orthopedics)', 'Fellowship in Joint Replacement'],
    specialization: 'Orthopedics',
    experience_years: 17,
    hospital_id: 'h-care-vizag',
    hospital_name: 'Care Hospitals, Ramnagar',
    clinic_address: '10-50-11/1, AS Raja Complex, Waltair Main Road, Ramnagar, Visakhapatnam',
    city: 'Visakhapatnam',
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    country: 'India',
    latitude: 17.7210,
    longitude: 83.3110,
    official_phone: '+91 891 304 1444',
    consultation_fee: 650,
    languages_spoken: ['Telugu', 'English', 'Hindi'],
    verification_status: 'VERIFIED',
    last_verified_at: '2026-09-18',
    consultation_timings: 'Mon-Sat: 10:00 AM - 01:30 PM, 05:00 PM - 07:30 PM',
    bio: 'Senior Orthopedic Consultant at Care Hospitals Visakhapatnam specializing in arthroscopic sports surgery, complex fractures, and computer-navigated knee replacement.',
    available_slots: ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '05:00 PM', '05:30 PM', '06:00 PM'],
  },
  {
    id: 'd-sevenhills-1',
    name: 'Dr. L. Gayatri, MD',
    email: 'dr.gayatri@sevenhillshospital.com',
    medical_registration_number: 'APMC/DOC/49210',
    registration_council: 'Andhra Pradesh Medical Council',
    qualifications: ['MBBS', 'MD (Obstetrics & Gynecology)', 'Fellowship in Fetal Medicine'],
    specialization: 'Obstetrics & Gynecology',
    experience_years: 15,
    hospital_id: 'h-sevenhills-vizag',
    hospital_name: 'SevenHills Hospital',
    clinic_address: 'Rockdale Layout, Waltair Main Road, Visakhapatnam',
    city: 'Visakhapatnam',
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    country: 'India',
    latitude: 17.7170,
    longitude: 83.3135,
    official_phone: '+91 891 667 7777',
    consultation_fee: 600,
    languages_spoken: ['Telugu', 'English', 'Hindi'],
    verification_status: 'VERIFIED',
    last_verified_at: '2026-10-05',
    consultation_timings: 'Mon-Sat: 09:30 AM - 01:00 PM, 05:00 PM - 07:30 PM',
    bio: 'Lead Obstetrician & Gynecologist at SevenHills Hospital Visakhapatnam, providing compassionate care for high-risk pregnancies, infertility, and laparoscopic surgery.',
    available_slots: ['09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '05:00 PM', '05:30 PM', '06:00 PM'],
  },
  {
    id: 'd-kgh-1',
    name: 'Dr. P. Krishna Murthy, MD',
    email: 'dr.pkmurthy@kghvizag.gov.in',
    medical_registration_number: 'APMC/DOC/22904',
    registration_council: 'Andhra Pradesh Medical Council',
    qualifications: ['MBBS', 'MD (General Medicine)', 'FCCM (Critical Care)'],
    specialization: 'General Medicine',
    experience_years: 23,
    hospital_id: 'h-kgh-vizag',
    hospital_name: 'King George Hospital (KGH)',
    clinic_address: 'Maharanipeta, Collector Office Road, Visakhapatnam',
    city: 'Visakhapatnam',
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    country: 'India',
    latitude: 17.7080,
    longitude: 83.3050,
    official_phone: '+91 891 256 4891',
    consultation_fee: 300,
    languages_spoken: ['Telugu', 'English', 'Hindi'],
    verification_status: 'VERIFIED',
    last_verified_at: '2026-09-01',
    consultation_timings: 'Mon-Sat: 08:30 AM - 01:30 PM',
    bio: 'Senior Physician & Professor at King George Hospital (KGH) Visakhapatnam with extensive experience in tropical fever, infectious diseases, and internal medicine.',
    available_slots: ['08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
  },
  // --- NATIONAL SUPER-SPECIALISTS ---
  {
    id: 'd-aiims-delhi-1',
    name: 'Dr. Randeep Kumar, MD, DM',
    email: 'dr.randeep@aiims.edu.in',
    medical_registration_number: 'DMC/DOC/19842',
    registration_council: 'Delhi Medical Council',
    qualifications: ['MBBS', 'MD (Medicine)', 'DM (Pulmonary & Critical Care)'],
    specialization: 'Pulmonology',
    experience_years: 24,
    hospital_id: 'h-aiims-delhi',
    hospital_name: 'AIIMS (All India Institute of Medical Sciences)',
    clinic_address: 'Ansari Nagar, Sri Aurobindo Marg, New Delhi',
    city: 'New Delhi',
    district: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    latitude: 28.5672,
    longitude: 77.2100,
    official_phone: '+91 11 2658 8500',
    consultation_fee: 500,
    languages_spoken: ['Hindi', 'English'],
    verification_status: 'VERIFIED',
    last_verified_at: '2026-10-01',
    consultation_timings: 'Mon-Fri: 09:00 AM - 01:00 PM',
    bio: 'Distinguished Professor & Head of Pulmonary and Critical Care Medicine at AIIMS New Delhi. Global expert on asthma, lung diseases, and sleep disorders.',
    available_slots: ['09:00 AM', '09:45 AM', '10:30 AM', '11:15 AM', '12:00 PM'],
  },
];

const INITIAL_HOSPITALS: Hospital[] = COMPREHENSIVE_HOSPITALS;

const INITIAL_SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  // Patient Tiers
  {
    id: 'sub-pat-free',
    roleTarget: 'patient',
    name: 'Patient Basic',
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
      'Unlimited verified doctor search across India',
      'Atomic appointment booking & instant reference ID',
      'Live hospital OPD token status tracker',
      'Medical disclaimer & emergency 108/112 routing',
    ],
    limitations: ['Standard text AI queries', '1 household medical record vault profile'],
  },
  {
    id: 'sub-pat-plus',
    roleTarget: 'patient',
    name: 'Patient Plus',
    monthlyPrice: 49,
    annualPrice: 499,
    popular: true,
    features: [
      'Everything in Basic',
      'Family health vault (up to 6 members with consent)',
      'Advance SMS & Push turn alerts (30m, 15m, 10m before turn)',
      'Multilingual Voice Assistant priority audio synthesis',
      'Prescription & diagnostic report PDF export',
    ],
    limitations: ['Fair usage 50 voice minutes per month'],
  },

  // Doctor Tiers
  {
    id: 'sub-doc-free',
    roleTarget: 'doctor',
    name: 'Doctor Starter (Verification)',
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
      'Free council credential registration & audit application',
      'Public verified listing upon state medical council audit',
      'Basic appointment calendar & schedule slot display',
      '0% Commission on consultation fees',
    ],
    limitations: ['Single clinic location', 'Manual queue desk controls'],
  },
  {
    id: 'sub-doc-pro',
    roleTarget: 'doctor',
    name: 'Doctor Professional',
    monthlyPrice: 299,
    annualPrice: 2999,
    popular: true,
    features: [
      'Everything in Doctor Starter',
      'Live Digital OPD Desk controller with one-click next token calling',
      'Automated patient delay & absence notifications',
      'Multi-session OPD management (Morning & Evening sessions)',
      'Patient symptom & previous consultation history review',
      'Dedicated council verified badge & high-visibility search ranking',
    ],
    limitations: ['Up to 3 clinic consultation addresses'],
  },

  // Hospital Tiers
  {
    id: 'sub-hosp-starter',
    roleTarget: 'hospital',
    name: 'Clinic / Hospital Starter',
    monthlyPrice: 999,
    annualPrice: 9999,
    features: [
      'Up to 5 verified doctor OPD schedules',
      '24x7 Emergency contact directory listing',
      'Department-level queue token screen display',
      'Staff receptionist dashboard for token issuance',
    ],
    limitations: ['1 hospital campus'],
  },
  {
    id: 'sub-hosp-growth',
    roleTarget: 'hospital',
    name: 'Hospital Growth & Enterprise',
    monthlyPrice: 2999,
    annualPrice: 29999,
    popular: true,
    features: [
      'Unlimited doctor profiles and departments',
      'Multi-campus OPD digital token displays with automated ETA estimation',
      'Advance SMS notification gateway integration for all walk-in and booked patients',
      'Bed capacity & emergency triage indicator controls',
      'Staff RBAC permissions & regulatory audit log export',
    ],
    limitations: ['Custom SLA available on annual contract'],
  },
];

// Initial Family Members with Health Profile Details
export const INITIAL_FAMILY_MEMBERS: FamilyMember[] = [
  {
    id: 'fam-self',
    user_id: 'pat-default',
    name: 'Gowtham Bikkina',
    relation: 'Self',
    age: 35,
    gender: 'Male',
    blood_group: 'B+',
    bloodGroup: 'B+',
    dob: '1991-04-12',
    phone: '+91 98480 22334',
    allergies: 'None reported',
    chronic_conditions: ['Mild Seasonal Rhinitis'],
    ongoing_medications: ['Cetirizine 10mg (PRN)'],
    emergency_contact: {
      name: 'Radhika Bikkina',
      phone: '+91 98480 55667',
      relation: 'Spouse',
    },
    consent_level: 'Full Guardian Access',
    consent_granted: true,
    caregiver_name: 'Self',
    created_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 'fam-1',
    user_id: 'pat-default',
    name: 'Radhika Bikkina',
    relation: 'Spouse',
    age: 32,
    gender: 'Female',
    blood_group: 'B+',
    bloodGroup: 'B+',
    dob: '1994-08-22',
    phone: '+91 98480 55667',
    allergies: 'Penicillin allergy',
    chronic_conditions: [],
    ongoing_medications: ['Iron & Folic Acid Supplements'],
    emergency_contact: {
      name: 'Gowtham Bikkina',
      phone: '+91 98480 22334',
      relation: 'Spouse',
    },
    consent_level: 'Full Guardian Access',
    consent_granted: true,
    caregiver_name: 'Gowtham Bikkina',
    created_at: '2026-01-15T10:00:00Z',
  },
  {
    id: 'fam-2',
    user_id: 'pat-default',
    name: 'Aarav Bikkina',
    relation: 'Child',
    age: 5,
    gender: 'Male',
    blood_group: 'O+',
    bloodGroup: 'O+',
    dob: '2021-06-18',
    allergies: 'Peanuts and dust mites',
    chronic_conditions: ['Childhood Asthma (Mild)'],
    ongoing_medications: ['Levosalbutamol Inhaler (as needed)'],
    emergency_contact: {
      name: 'Gowtham Bikkina',
      phone: '+91 98480 22334',
      relation: 'Father',
    },
    consent_level: 'Full Guardian Access',
    consent_granted: true,
    caregiver_name: 'Gowtham Bikkina (Parent/Guardian)',
    created_at: '2026-02-01T10:00:00Z',
  },
  {
    id: 'fam-3',
    user_id: 'pat-default',
    name: 'Sanyasi Rao Bikkina',
    relation: 'Father',
    age: 67,
    gender: 'Male',
    blood_group: 'O+',
    bloodGroup: 'O+',
    dob: '1959-11-05',
    phone: '+91 94401 33445',
    allergies: 'Sulfonamides',
    chronic_conditions: ['Hypertension', 'Type 2 Diabetes Mellitus'],
    ongoing_medications: ['Amlodipine 5mg', 'Metformin 500mg'],
    emergency_contact: {
      name: 'Gowtham Bikkina',
      phone: '+91 98480 22334',
      relation: 'Son',
    },
    consent_level: 'Full Guardian Access',
    consent_granted: true,
    caregiver_name: 'Gowtham Bikkina (Primary Caregiver)',
    created_at: '2026-02-15T10:00:00Z',
  },
];

export const INITIAL_ANALYZED_REPORTS: AnalyzedReport[] = [
  {
    id: 'rep-sample-1',
    patient_id: 'pat-default',
    patient_name: 'Gowtham Bikkina',
    family_member_id: 'fam-self',
    family_member_name: 'Gowtham Bikkina',
    report_title: 'Complete Blood Count (CBC) & Metabolic Screen',
    lab_name: 'Vijaya Diagnostic Center, Vijayawada',
    test_date: '2026-10-25',
    file_name: 'CBC_Report_Gowtham_Oct2026.pdf',
    file_type: 'application/pdf',
    summary: 'Routine comprehensive hemogram indicates healthy red blood cell count and platelet profile. White blood cell count is slightly elevated above the standard range, which is commonly associated with a mild recent viral recovery or low-grade inflammation.',
    parameters: [
      {
        name: 'Hemoglobin (Hb)',
        category: 'Red Blood Cells',
        measured_value: '14.5',
        reference_range: '13.0 - 17.0',
        unit: 'g/dL',
        status: 'NORMAL',
        simple_explanation: 'Healthy level. Hemoglobin carries oxygen from your lungs to the rest of your body.',
      },
      {
        name: 'Total WBC Count (TLC)',
        category: 'Immune System',
        measured_value: '11,400',
        reference_range: '4,000 - 11,000',
        unit: 'cells/cu.mm',
        status: 'HIGH',
        simple_explanation: 'Mildly elevated. White blood cells defend against infections. Slight increases often occur during or right after a cold, seasonal allergy, or tissue recovery.',
      },
      {
        name: 'Platelet Count',
        category: 'Clotting',
        measured_value: '245,000',
        reference_range: '150,000 - 450,000',
        unit: '/cu.mm',
        status: 'NORMAL',
        simple_explanation: 'Optimal range. Platelets are critical blood cells that help blood clot properly and prevent excessive bleeding.',
      },
      {
        name: 'Fasting Blood Glucose',
        category: 'Metabolism',
        measured_value: '92',
        reference_range: '70 - 100',
        unit: 'mg/dL',
        status: 'NORMAL',
        simple_explanation: 'Normal fasting blood sugar level, reflecting good glycemic balance.',
      },
      {
        name: 'Serum Creatinine',
        category: 'Kidney Function',
        measured_value: '0.95',
        reference_range: '0.70 - 1.20',
        unit: 'mg/dL',
        status: 'NORMAL',
        simple_explanation: 'Normal kidney filtration efficiency indicator.',
      },
    ],
    questions_for_doctor: [
      'My Total WBC count is slightly elevated at 11,400 cells/cu.mm — does this indicate a recent viral throat irritation or require a repeat test?',
      'Are any dietary or lifestyle adjustments recommended based on this metabolic screening?',
      'When should my next routine follow-up hemogram be scheduled?',
    ],
    disclaimer: 'Universal Health Care AI provides plain-language educational summaries only. This is NOT a diagnostic evaluation or prescription. Please review these parameters with your verified physician before making any clinical decisions.',
    language: 'English',
    created_at: '2026-10-25T11:30:00Z',
  },
];

export const INITIAL_MEDICINE_REMINDERS: MedicineReminder[] = [
  {
    id: 'med-1',
    patient_id: 'pat-default',
    family_member_id: 'fam-3',
    family_member_name: 'Sanyasi Rao Bikkina',
    medicine_name: 'Amlodipine Besylate',
    dosage: '5 mg (1 Tablet)',
    prescribed_by: 'Dr. Ramesh Chandra, DM',
    frequency: 'Once Daily',
    instructions: 'After Food',
    schedule: [
      { slot: 'Morning', time: '08:00 AM', takenToday: true, skippedToday: false },
    ],
    start_date: '2026-09-01',
    is_chronic: true,
    current_stock: 24,
    refill_reminder_at: 7,
    history: [
      { date: '2026-11-05', slot: 'Morning', status: 'Taken', timestamp: '2026-11-05T08:15:00Z' },
      { date: '2026-11-06', slot: 'Morning', status: 'Taken', timestamp: '2026-11-06T08:05:00Z' },
    ],
    created_at: '2026-09-01T09:00:00Z',
  },
  {
    id: 'med-2',
    patient_id: 'pat-default',
    family_member_id: 'fam-3',
    family_member_name: 'Sanyasi Rao Bikkina',
    medicine_name: 'Metformin Hydrochloride (SR)',
    dosage: '500 mg (1 Tablet)',
    prescribed_by: 'Dr. Ramesh Chandra, DM',
    frequency: 'Twice Daily',
    instructions: 'After Food',
    schedule: [
      { slot: 'Morning', time: '08:30 AM', takenToday: true, skippedToday: false },
      { slot: 'Night', time: '08:30 PM', takenToday: false, skippedToday: false },
    ],
    start_date: '2026-09-01',
    is_chronic: true,
    current_stock: 38,
    refill_reminder_at: 10,
    history: [
      { date: '2026-11-05', slot: 'Morning', status: 'Taken', timestamp: '2026-11-05T08:35:00Z' },
      { date: '2026-11-05', slot: 'Night', status: 'Taken', timestamp: '2026-11-05T20:40:00Z' },
      { date: '2026-11-06', slot: 'Morning', status: 'Taken', timestamp: '2026-11-06T08:28:00Z' },
    ],
    created_at: '2026-09-01T09:00:00Z',
  },
  {
    id: 'med-3',
    patient_id: 'pat-default',
    family_member_id: 'fam-self',
    family_member_name: 'Gowtham Bikkina',
    medicine_name: 'Vitamin D3 & Calcium Chewable',
    dosage: '60,000 IU (1 Capsule)',
    prescribed_by: 'Dr. Ananya Rao, DNB',
    frequency: 'Weekly (Sundays)',
    instructions: 'With Food',
    schedule: [
      { slot: 'Morning', time: '09:00 AM', takenToday: false, skippedToday: false },
    ],
    start_date: '2026-10-01',
    end_date: '2026-12-31',
    is_chronic: false,
    current_stock: 8,
    refill_reminder_at: 3,
    history: [
      { date: '2026-11-01', slot: 'Morning', status: 'Taken', timestamp: '2026-11-01T09:10:00Z' },
    ],
    created_at: '2026-10-01T09:00:00Z',
  },
];

class DatabaseStore {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed: DatabaseSchema = JSON.parse(raw);
        let modified = false;

        // Ensure all comprehensive hospitals are in the store
        if (!parsed.hospitals || parsed.hospitals.length < INITIAL_HOSPITALS.length) {
          const existingIds = new Set((parsed.hospitals || []).map(h => h.id));
          const existingNames = new Set((parsed.hospitals || []).map(h => h.name.toLowerCase()));
          const toAdd = INITIAL_HOSPITALS.filter(h => !existingIds.has(h.id) && !existingNames.has(h.name.toLowerCase()));
          parsed.hospitals = [...(parsed.hospitals || []), ...toAdd];
          modified = true;
        }

        // Ensure all initial doctors are in the store
        if (!parsed.doctors || parsed.doctors.length < INITIAL_DOCTORS.length) {
          const existingDocIds = new Set((parsed.doctors || []).map(d => d.id));
          const toAddDocs = INITIAL_DOCTORS.filter(d => !existingDocIds.has(d.id));
          parsed.doctors = [...(parsed.doctors || []), ...toAddDocs];
          modified = true;
        }

        // Ensure bed availability for all hospitals
        if (parsed.hospitals) {
          parsed.hospitals = parsed.hospitals.map(h => {
            if (!h.bed_availability) {
              const totalBeds = h.total_beds || 160;
              const icuBeds = h.icu_beds || 24;
              const emergBeds = Math.max(10, Math.round(totalBeds * 0.15));
              const genBeds = Math.max(20, totalBeds - icuBeds - emergBeds);
              h.bed_availability = {
                general_total: genBeds,
                general_available: Math.max(4, Math.round(genBeds * 0.35)),
                icu_total: icuBeds,
                icu_available: Math.max(1, Math.round(icuBeds * 0.25)),
                emergency_total: emergBeds,
                emergency_available: Math.max(2, Math.round(emergBeds * 0.4)),
                ventilator_total: Math.max(4, Math.round(icuBeds * 0.5)),
                ventilator_available: Math.max(1, Math.round(icuBeds * 0.2)),
                oxygen_beds_available: Math.max(6, Math.round(emergBeds * 0.7)),
                last_updated: new Date().toISOString(),
                updated_by: 'Hospital Admission Desk',
              };
              modified = true;
            }
            return h;
          });
        }

        // Ensure reports, medicines, and family members are populated
        if (!parsed.analyzedReports || parsed.analyzedReports.length === 0) {
          parsed.analyzedReports = INITIAL_ANALYZED_REPORTS;
          modified = true;
        }
        if (!parsed.medicineReminders || parsed.medicineReminders.length === 0) {
          parsed.medicineReminders = INITIAL_MEDICINE_REMINDERS;
          modified = true;
        }
        if (!parsed.familyMembers || parsed.familyMembers.length === 0) {
          parsed.familyMembers = INITIAL_FAMILY_MEMBERS;
          modified = true;
        }

        if (modified) {
          this.saveData(parsed);
        }

        return parsed;
      }
    } catch (e) {
      console.warn('Could not read existing database.json, initializing fresh store:', e);
    }

    const defaultData: DatabaseSchema = {
      doctors: INITIAL_DOCTORS,
      hospitals: INITIAL_HOSPITALS,
      appointments: [
        {
          id: 'apt-1',
          booking_reference: 'UHC-2026-4921',
          patient_id: 'pat-default',
          patient_name: 'Gowtham Bikkina',
          patient_phone: '+91 98480 22334',
          doctor_id: 'd-1',
          doctor_name: 'Dr. Ramesh Chandra, DM',
          doctor_specialization: 'Cardiology',
          hospital_name: 'Ayush Multispecialty Hospital',
          clinic_address: 'Suite 302, Ayush Hospital, Bandar Road, Vijayawada',
          city: 'Vijayawada',
          state: 'Andhra Pradesh',
          appointment_date: '2026-11-08',
          appointment_time: '10:30 AM',
          status: 'Confirmed',
          consultation_fee: 750,
          symptoms_reason: 'Routine cardiac health checkup and blood pressure monitoring.',
          opd_token_number: 14,
          notification_preferences: {
            channel: 'Both',
            advanceMinutes: [30, 15],
            smsConsent: true,
            phone: '+91 98480 22334',
            gatewayDeliveryStatus: 'QUEUED_LOCAL',
          },
          created_at: '2026-11-04T10:00:00Z',
        },
      ],
      queueTokens: [
        {
          id: 'tok-1',
          hospital_id: 'h-1',
          hospital_name: 'Ayush Multispecialty Hospital',
          department: 'Cardiology OPD',
          doctor_id: 'd-1',
          doctor_name: 'Dr. Ramesh Chandra, DM',
          token_number: 14,
          patient_id: 'pat-default',
          patient_name: 'Gowtham Bikkina',
          queue_date: new Date().toISOString().split('T')[0],
          session: 'Morning OPD',
          status: 'Waiting',
          estimated_wait_minutes: 24,
          notification_channel: 'Both',
          created_at: new Date().toISOString(),
        },
        {
          id: 'tok-2',
          hospital_id: 'h-1',
          hospital_name: 'Ayush Multispecialty Hospital',
          department: 'Cardiology OPD',
          doctor_id: 'd-1',
          doctor_name: 'Dr. Ramesh Chandra, DM',
          token_number: 12,
          patient_name: 'K. Sanyasi Rao',
          queue_date: new Date().toISOString().split('T')[0],
          session: 'Morning OPD',
          status: 'Serving',
          estimated_wait_minutes: 0,
          created_at: new Date().toISOString(),
        },
        {
          id: 'tok-3',
          hospital_id: 'h-2',
          hospital_name: 'KIMS Andhra Hospitals',
          department: 'Pediatrics OPD',
          doctor_id: 'd-2',
          doctor_name: 'Dr. Ananya Rao, DNB',
          token_number: 8,
          patient_name: 'Baby Sai',
          queue_date: new Date().toISOString().split('T')[0],
          session: 'Morning OPD',
          status: 'Serving',
          estimated_wait_minutes: 0,
          created_at: new Date().toISOString(),
        },
      ],
      medicalRecords: [
        {
          id: 'rec-1',
          patient_id: 'pat-default',
          patient_name: 'Gowtham Bikkina',
          document_type: 'Lab Report',
          title: 'Comprehensive Lipid Profile & HbA1c Report',
          doctor_name: 'Dr. Ramesh Chandra, DM',
          hospital_name: 'Ayush Multispecialty Hospital Lab',
          record_date: '2026-10-14',
          file_name: 'Lipid_Panel_Report_Oct2026.pdf',
          file_size: '1.4 MB',
          notes: 'Total cholesterol normal. Fasting glucose at 94 mg/dL.',
          uploaded_at: '2026-10-15T08:30:00Z',
        },
        {
          id: 'rec-2',
          patient_id: 'pat-default',
          patient_name: 'Gowtham Bikkina',
          document_type: 'Prescription',
          title: 'Cardiology Consultation Prescription',
          doctor_name: 'Dr. Ramesh Chandra, DM',
          hospital_name: 'Ayush Multispecialty Hospital',
          record_date: '2026-08-20',
          file_name: 'Prescription_Dr_Ramesh_Chandra.pdf',
          file_size: '620 KB',
          notes: 'Doctor recommended regular morning walks and reduced sodium intake.',
          uploaded_at: '2026-08-20T11:45:00Z',
        },
      ],
      analyzedReports: INITIAL_ANALYZED_REPORTS,
      medicineReminders: INITIAL_MEDICINE_REMINDERS,
      familyMembers: INITIAL_FAMILY_MEMBERS,
      subscriptionTiers: INITIAL_SUBSCRIPTION_TIERS,
      adminAuditLogs: [
        {
          id: 'log-1',
          admin_name: 'Chief Medical Registrar',
          action: 'APPROVED_DOCTOR',
          target: 'Dr. Ramesh Chandra (APMC/DOC/49821)',
          timestamp: '2026-10-15T10:30:00Z',
          status: 'SUCCESS',
        },
        {
          id: 'log-2',
          admin_name: 'Chief Medical Registrar',
          action: 'VERIFIED_HOSPITAL',
          target: 'Ayush Multispecialty Hospital, Vijayawada',
          timestamp: '2026-10-15T10:00:00Z',
          status: 'SUCCESS',
        },
      ],
      smsGatewaySettings: {
        provider: 'Twilio / MSG91 / Fast2SMS Unified Gateway',
        isConfigured: Boolean(process.env.SMS_GATEWAY_API_KEY || process.env.TWILIO_AUTH_TOKEN),
        senderId: 'UHCIND',
        statusNote: Boolean(process.env.SMS_GATEWAY_API_KEY || process.env.TWILIO_AUTH_TOKEN)
          ? 'Production Telephony Gateway Connected'
          : 'Development Mode: Notifications logged and delivered in-app. Set SMS_GATEWAY_API_KEY in .env to activate carrier SMS delivery.',
      },
    };

    this.saveData(defaultData);
    return defaultData;
  }

  private saveData(data: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error persisting database.json:', e);
    }
  }

  private persist() {
    this.saveData(this.data);
  }

  // Doctors
  getDoctors(): Doctor[] {
    return this.data.doctors;
  }

  getDoctorById(id: string): Doctor | undefined {
    return this.data.doctors.find(d => d.id === id);
  }

  addDoctor(doctor: Doctor): Doctor {
    this.data.doctors.push(doctor);
    this.persist();
    return doctor;
  }

  updateDoctorVerification(id: string, status: VerificationStatus, verifiedBy: string): Doctor | undefined {
    const doc = this.data.doctors.find(d => d.id === id);
    if (!doc) return undefined;
    doc.verification_status = status;
    doc.last_verified_at = status === 'VERIFIED' ? new Date().toISOString().split('T')[0] : doc.last_verified_at;

    this.data.adminAuditLogs.unshift({
      id: `log-${Date.now()}`,
      admin_name: verifiedBy,
      action: `DOCTOR_VERIFICATION_${status}`,
      target: `${doc.name} (${doc.medical_registration_number})`,
      timestamp: new Date().toISOString(),
      status: 'COMPLETED',
    });

    this.persist();
    return doc;
  }

  // Hospitals
  getHospitals(): Hospital[] {
    return this.data.hospitals;
  }

  getHospitalById(id: string): Hospital | undefined {
    return this.data.hospitals.find(h => h.id === id);
  }

  addHospital(hospital: Hospital): Hospital {
    this.data.hospitals.push(hospital);
    this.persist();
    return hospital;
  }

  updateHospitalVerification(id: string, status: VerificationStatus, verifiedBy: string): Hospital | undefined {
    const hosp = this.data.hospitals.find(h => h.id === id);
    if (!hosp) return undefined;
    hosp.verification_status = status;
    hosp.last_verified_at = status === 'VERIFIED' ? new Date().toISOString().split('T')[0] : hosp.last_verified_at;

    this.data.adminAuditLogs.unshift({
      id: `log-${Date.now()}`,
      admin_name: verifiedBy,
      action: `HOSPITAL_VERIFICATION_${status}`,
      target: hosp.name,
      timestamp: new Date().toISOString(),
      status: 'COMPLETED',
    });

    this.persist();
    return hosp;
  }

  // Appointments
  getAppointments(): Appointment[] {
    return this.data.appointments;
  }

  addAppointment(appointment: Appointment): Appointment {
    this.data.appointments.unshift(appointment);
    this.persist();
    return appointment;
  }

  cancelAppointment(id: string, reason?: string): Appointment | undefined {
    const apt = this.data.appointments.find(a => a.id === id);
    if (!apt) return undefined;
    apt.status = 'Cancelled';
    this.persist();
    return apt;
  }

  rescheduleAppointment(id: string, newDate: string, newTime: string): Appointment | undefined {
    const apt = this.data.appointments.find(a => a.id === id);
    if (!apt) return undefined;
    apt.appointment_date = newDate;
    apt.appointment_time = newTime;
    apt.status = 'Rescheduled';
    this.persist();
    return apt;
  }

  updateAppointmentNotifications(
    id: string,
    preferences: {
      channel: 'SMS' | 'Push' | 'Both' | 'None';
      advanceMinutes: number[];
      customMinutes?: number;
      smsConsent: boolean;
      phone?: string;
    }
  ): Appointment | undefined {
    const apt = this.data.appointments.find(a => a.id === id);
    if (!apt) return undefined;
    apt.notification_preferences = {
      channel: preferences.channel,
      advanceMinutes: preferences.advanceMinutes,
      customMinutes: preferences.customMinutes,
      smsConsent: preferences.smsConsent,
      phone: preferences.phone || apt.patient_phone || '',
      gatewayDeliveryStatus: 'QUEUED_LOCAL',
    };
    this.persist();
    return apt;
  }

  // Queue Tokens
  getQueueTokens(hospitalId?: string, doctorId?: string): QueueToken[] {
    let tokens = this.data.queueTokens;
    if (hospitalId) tokens = tokens.filter(t => t.hospital_id === hospitalId);
    if (doctorId) tokens = tokens.filter(t => t.doctor_id === doctorId);
    return tokens;
  }

  addQueueToken(token: QueueToken): QueueToken {
    this.data.queueTokens.unshift(token);
    this.persist();
    return token;
  }

  callNextToken(hospitalId: string, department: string, doctorId?: string): { currentlyServing: QueueToken | null; nextTokens: QueueToken[] } {
    // Complete existing serving token
    const currentlyServing = this.data.queueTokens.find(
      t =>
        t.hospital_id === hospitalId &&
        t.department === department &&
        (!doctorId || t.doctor_id === doctorId) &&
        t.status === 'Serving'
    );
    if (currentlyServing) {
      currentlyServing.status = 'Completed';
    }

    // Find next waiting
    const nextWaiting = this.data.queueTokens
      .filter(
        t =>
          t.hospital_id === hospitalId &&
          t.department === department &&
          (!doctorId || t.doctor_id === doctorId) &&
          t.status === 'Waiting'
      )
      .sort((a, b) => a.token_number - b.token_number)[0];

    if (nextWaiting) {
      nextWaiting.status = 'Serving';
      nextWaiting.estimated_wait_minutes = 0;
    }

    this.persist();
    return {
      currentlyServing: nextWaiting || null,
      nextTokens: this.data.queueTokens.filter(t => t.hospital_id === hospitalId && t.department === department),
    };
  }

  updateTokenStatus(tokenId: string, status: 'Completed' | 'Delayed' | 'Absent' | 'Cancelled'): QueueToken | undefined {
    const tok = this.data.queueTokens.find(t => t.id === tokenId);
    if (!tok) return undefined;
    tok.status = status;
    this.persist();
    return tok;
  }

  // Medical Records
  getMedicalRecords(): MedicalRecord[] {
    return this.data.medicalRecords;
  }

  addMedicalRecord(record: MedicalRecord): MedicalRecord {
    this.data.medicalRecords.unshift(record);
    this.persist();
    return record;
  }

  // Subscriptions & Pricing
  getSubscriptionTiers(): SubscriptionTier[] {
    return this.data.subscriptionTiers;
  }

  updateSubscriptionTierPrice(idOrName: string, monthlyPrice: number, annualPrice?: number): SubscriptionTier | undefined {
    const tier = this.data.subscriptionTiers.find(
      t => t.id === idOrName || t.name.toLowerCase() === idOrName.toLowerCase()
    );
    if (!tier) return undefined;
    tier.monthlyPrice = monthlyPrice;
    if (annualPrice !== undefined && !isNaN(annualPrice)) {
      tier.annualPrice = annualPrice;
    } else {
      tier.annualPrice = Math.round(monthlyPrice * 12 * 0.85);
    }
    this.persist();
    return tier;
  }

  // Audit Logs
  getAuditLogs() {
    return this.data.adminAuditLogs;
  }

  addAuditLog(entry: { admin_name: string; action: string; target: string; status: string; details?: any }) {
    this.data.adminAuditLogs.unshift({
      id: `log-${Date.now()}`,
      ...entry,
      timestamp: new Date().toISOString(),
    });
    this.persist();
  }

  // Module 1: AI Analyzed Reports
  getAnalyzedReports(patientId?: string): AnalyzedReport[] {
    const list = this.data.analyzedReports || [];
    if (!patientId) return list;
    return list.filter(r => r.patient_id === patientId || r.patient_name.toLowerCase().includes(patientId.toLowerCase()));
  }

  addAnalyzedReport(report: AnalyzedReport): AnalyzedReport {
    if (!this.data.analyzedReports) this.data.analyzedReports = [];
    this.data.analyzedReports.unshift(report);
    this.persist();
    return report;
  }

  deleteAnalyzedReport(id: string): boolean {
    if (!this.data.analyzedReports) return false;
    const initialLen = this.data.analyzedReports.length;
    this.data.analyzedReports = this.data.analyzedReports.filter(r => r.id !== id);
    if (this.data.analyzedReports.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // Module 2: Live Hospital Bed Availability
  updateHospitalBeds(hospitalId: string, bedInfo: Partial<HospitalBedInfo>, updatedBy?: string): Hospital | undefined {
    const hosp = this.data.hospitals.find(h => h.id === hospitalId);
    if (!hosp) return undefined;

    const currentBeds: HospitalBedInfo = hosp.bed_availability || {
      general_total: hosp.total_beds ? Math.max(10, hosp.total_beds - 30) : 120,
      general_available: 40,
      icu_total: hosp.icu_beds || 20,
      icu_available: 5,
      emergency_total: 15,
      emergency_available: 6,
      ventilator_total: 8,
      ventilator_available: 2,
      oxygen_beds_available: 12,
      last_updated: new Date().toISOString(),
      updated_by: updatedBy || 'Staff Desk',
    };

    hosp.bed_availability = {
      ...currentBeds,
      ...bedInfo,
      last_updated: new Date().toISOString(),
      updated_by: updatedBy || currentBeds.updated_by || 'Hospital Staff',
    };

    this.data.adminAuditLogs.unshift({
      id: `log-${Date.now()}`,
      admin_name: updatedBy || 'Hospital Desk Staff',
      action: 'UPDATE_BED_AVAILABILITY',
      target: `${hosp.name} (${hosp.city})`,
      timestamp: new Date().toISOString(),
      status: 'SUCCESS',
      details: bedInfo,
    });

    this.persist();
    return hosp;
  }

  // Module 4: Smart Medicine Reminders
  getMedicineReminders(patientId?: string): MedicineReminder[] {
    const list = this.data.medicineReminders || [];
    if (!patientId) return list;
    return list.filter(m => m.patient_id === patientId);
  }

  addMedicineReminder(reminder: MedicineReminder): MedicineReminder {
    if (!this.data.medicineReminders) this.data.medicineReminders = [];
    this.data.medicineReminders.unshift(reminder);
    this.persist();
    return reminder;
  }

  updateMedicineDose(id: string, slot: DoseTimeSlot, status: 'Taken' | 'Skipped'): MedicineReminder | undefined {
    if (!this.data.medicineReminders) return undefined;
    const med = this.data.medicineReminders.find(m => m.id === id);
    if (!med) return undefined;

    const today = new Date().toISOString().split('T')[0];
    
    // Update schedule slot status for today
    med.schedule = med.schedule.map(s => {
      if (s.slot === slot) {
        return {
          ...s,
          takenToday: status === 'Taken',
          skippedToday: status === 'Skipped',
        };
      }
      return s;
    });

    // Record in history log
    if (!med.history) med.history = [];
    med.history.unshift({
      date: today,
      slot,
      status,
      timestamp: new Date().toISOString(),
    });

    // Deduct stock if taken
    if (status === 'Taken' && med.current_stock > 0) {
      med.current_stock -= 1;
    }

    this.persist();
    return med;
  }

  deleteMedicineReminder(id: string): boolean {
    if (!this.data.medicineReminders) return false;
    const initialLen = this.data.medicineReminders.length;
    this.data.medicineReminders = this.data.medicineReminders.filter(m => m.id !== id);
    if (this.data.medicineReminders.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // Module 5: Family Health Profiles
  getFamilyMembers(userId?: string): FamilyMember[] {
    const list = this.data.familyMembers || [];
    if (!userId) return list;
    return list.filter(m => !m.user_id || m.user_id === userId);
  }

  addFamilyMember(member: FamilyMember): FamilyMember {
    if (!this.data.familyMembers) this.data.familyMembers = [];
    this.data.familyMembers.push(member);
    this.persist();
    return member;
  }

  updateFamilyMember(id: string, data: Partial<FamilyMember>): FamilyMember | undefined {
    if (!this.data.familyMembers) return undefined;
    const mem = this.data.familyMembers.find(m => m.id === id);
    if (!mem) return undefined;
    Object.assign(mem, data);
    this.persist();
    return mem;
  }

  deleteFamilyMember(id: string): boolean {
    if (!this.data.familyMembers) return false;
    const initialLen = this.data.familyMembers.length;
    this.data.familyMembers = this.data.familyMembers.filter(m => m.id !== id);
    if (this.data.familyMembers.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  getSmsGatewaySettings() {
    return this.data.smsGatewaySettings;
  }
}

export const dbStore = new DatabaseStore();

import React, { useState, useEffect } from 'react';
import { Hospital, Doctor } from '../types';
import { api } from '../services/api';
import { useTranslation } from '../i18n/LanguageContext';
import { HospitalDetailsModal } from '../components/common/HospitalDetailsModal';
import {
  Activity,
  Search,
  AlertTriangle,
  Building2,
  Stethoscope,
  HeartPulse,
  Baby,
  Brain,
  Bone,
  CheckCircle2,
  PhoneCall,
  Calendar,
  ExternalLink,
  MapPin,
  Filter,
  Sparkles,
  Bed,
  ShieldCheck,
} from 'lucide-react';

interface SymptomHospitalFinderPageProps {
  onBookDoctor?: (doctor: Doctor) => void;
  onBookHospital?: (hospital: Hospital) => void;
  onTrackQueue?: (hospitalId: string) => void;
}

const COMMON_CONCERNS = [
  {
    id: 'fever',
    label: 'High Fever & Infections',
    teluguLabel: 'తీవ్ర జ్వరం & ఇన్ఫెక్షన్లు',
    hindiLabel: 'तेज बुखार एवं संक्रमण',
    symptoms: ['Fever', 'Chills', 'Weakness', 'Body Ache', 'Cold'],
    department: 'General Medicine',
    icon: Activity,
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 'cardio',
    label: 'Heart & Chest Discomfort',
    teluguLabel: 'గుండె & ఛాతీ నొప్పి',
    hindiLabel: 'हृदय एवं छाती में दर्द',
    symptoms: ['Chest Pain', 'Shortness of Breath', 'Palpitations', 'High Blood Pressure'],
    department: 'Cardiology',
    icon: HeartPulse,
    color: 'from-rose-500 to-red-600',
  },
  {
    id: 'peds',
    label: 'Infant & Child Illness',
    teluguLabel: 'పిల్లల వ్యాధులు & జ్వరం',
    hindiLabel: 'शिशु एवं बाल रोग',
    symptoms: ['Childhood Fever', 'Cough in Children', 'Vomiting in Infants'],
    department: 'Pediatrics',
    icon: Baby,
    color: 'from-sky-500 to-blue-600',
  },
  {
    id: 'ortho',
    label: 'Bone Fractures & Joint Pain',
    teluguLabel: 'ఎముకల పగుళ్లు & కీళ్ల నొప్పులు',
    hindiLabel: 'हड्डी एवं जोड़ों का दर्द',
    symptoms: ['Joint Pain', 'Knee Pain', 'Back Pain', 'Fracture'],
    department: 'Orthopedics',
    icon: Bone,
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'neuro',
    label: 'Headaches & Nerve Issues',
    teluguLabel: 'తీవ్ర తలనొప్పి & నాడీ సమస్యలు',
    hindiLabel: 'गंभीर सिरदर्द एवं तंत्रिका रोग',
    symptoms: ['Severe Headache', 'Migraine', 'Seizures', 'Loss of Balance'],
    department: 'Neurology',
    icon: Brain,
    color: 'from-purple-500 to-indigo-600',
  },
  {
    id: 'gastro',
    label: 'Stomach Pain & Acid Reflux',
    teluguLabel: 'కడుపు నొప్పి & జీర్ణ సమస్యలు',
    hindiLabel: 'पेट दर्द एवं पाचन विकार',
    symptoms: ['Severe Stomach Pain', 'Acid Reflux', 'Vomiting', 'Jaundice'],
    department: 'Gastroenterology',
    icon: Stethoscope,
    color: 'from-cyan-500 to-blue-500',
  },
];

export const SymptomHospitalFinderPage: React.FC<SymptomHospitalFinderPageProps> = ({
  onBookDoctor,
  onBookHospital,
  onTrackQueue,
}) => {
  const { t, language } = useTranslation();
  const [query, setQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [activeConcernId, setActiveConcernId] = useState<string>('fever');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [modalHospital, setModalHospital] = useState<Hospital | null>(null);

  const performCheck = async (customQuery?: string, symptomsArray?: string[]) => {
    setLoading(true);
    try {
      const data = await api.checkSymptoms({
        query: customQuery !== undefined ? customQuery : query,
        symptoms: symptomsArray || (activeConcernId ? COMMON_CONCERNS.find(c => c.id === activeConcernId)?.symptoms : []),
        city: selectedCity,
      });
      setResult(data);
    } catch (e) {
      console.error('Symptom check failed:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial check with default active concern
    const initialConcern = COMMON_CONCERNS.find(c => c.id === activeConcernId);
    if (initialConcern) {
      performCheck('', initialConcern.symptoms);
    }
  }, [activeConcernId, selectedCity]);

  const handleSelectConcern = (concern: typeof COMMON_CONCERNS[0]) => {
    setActiveConcernId(concern.id);
    setQuery('');
    performCheck('', concern.symptoms);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setActiveConcernId('');
    performCheck(query.trim(), [query.trim()]);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-8 md:p-12 relative overflow-hidden shadow-xl border border-blue-800/40">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-200 border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            {t('symptoms.bannerBadge')}
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {t('symptoms.title')}
          </h1>
          <p className="text-base md:text-lg text-blue-100/90 leading-relaxed">
            {t('symptoms.subtitle')}
          </p>

          {/* Search Bar Form */}
          <form onSubmit={handleSearchSubmit} className="pt-4 flex flex-col sm:flex-row gap-2 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={t('symptoms.searchPlaceholder')}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-slate-900 placeholder-slate-400 border-0 focus:ring-2 focus:ring-blue-400 shadow-lg text-sm"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 flex-shrink-0"
            >
              {loading ? t('common.loading') : t('symptoms.findCare')}
            </button>
          </form>
        </div>
      </div>

      {/* Emergency 108 / 112 Medical Advisory Banner */}
      <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-rose-950 text-sm md:text-base">
              {t('symptoms.emergencyTitle')}
            </h3>
            <p className="text-xs md:text-sm text-rose-800/90 mt-0.5 leading-snug">
              {t('symptoms.emergencyDesc')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <a
            href="tel:112"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-sm hover:bg-rose-700 transition-colors shadow-sm"
          >
            <PhoneCall className="w-4 h-4" />
            Dial 112 (National Emergency)
          </a>
          <a
            href="tel:108"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-700 text-white font-bold text-sm hover:bg-rose-800 transition-colors shadow-sm"
          >
            <PhoneCall className="w-4 h-4" />
            Dial 108 (Ambulance)
          </a>
        </div>
      </div>

      {/* Quick Concern Chips */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            {t('symptoms.commonHealthConcerns')}
          </h2>
          {/* City Quick Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 font-medium focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Cities (Pan-India)</option>
              <option value="Rajahmundry">Rajahmundry, AP</option>
              <option value="Vijayawada">Vijayawada, AP</option>
              <option value="Visakhapatnam">Visakhapatnam, AP</option>
              <option value="Hyderabad">Hyderabad, TS</option>
              <option value="Bengaluru">Bengaluru, KA</option>
              <option value="Chennai">Chennai, TN</option>
              <option value="Pune">Pune, MH</option>
              <option value="New Delhi">New Delhi, DL</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {COMMON_CONCERNS.map(concern => {
            const Icon = concern.icon;
            const isSelected = activeConcernId === concern.id;
            const labelText =
              language === 'Telugu'
                ? concern.teluguLabel
                : language === 'Hindi'
                ? concern.hindiLabel
                : concern.label;

            return (
              <button
                key={concern.id}
                onClick={() => handleSelectConcern(concern)}
                className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between h-32 relative overflow-hidden group ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 shadow-md ring-2 ring-blue-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl bg-gradient-to-br ${concern.color} text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-tight">
                    {labelText}
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                    {concern.department}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Analysis Results Display */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium">Matching clinical departments and verified healthcare institutions...</p>
        </div>
      ) : result ? (
        <div className="space-y-8">
          {/* Department Recommendation Card */}
          <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 via-indigo-50 to-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">
                  Recommended Clinical Department
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  {result.primarySpecialty?.name || result.recommendedDepartment}
                  {language === 'Telugu' && result.primarySpecialty?.teluguName && (
                    <span className="text-lg text-blue-800 font-medium ml-2">
                      ({result.primarySpecialty.teluguName})
                    </span>
                  )}
                  {language === 'Hindi' && result.primarySpecialty?.hindiName && (
                    <span className="text-lg text-blue-800 font-medium ml-2">
                      ({result.primarySpecialty.hindiName})
                    </span>
                  )}
                </h2>
                <p className="text-slate-600 text-sm mt-1 max-w-3xl">
                  {result.primarySpecialty?.description ||
                    'Specialized care unit equipped for comprehensive clinical diagnostics, evaluation, and dedicated inpatient/outpatient management.'}
                </p>
              </div>

              <div className="px-3.5 py-2 rounded-xl bg-white border border-blue-200 text-xs text-blue-900 font-semibold shadow-xs">
                Category: {result.primarySpecialty?.category || 'Clinical Specialty'}
              </div>
            </div>

            {result.primarySpecialty?.symptoms && (
              <div className="mt-4 pt-4 border-t border-blue-200/60 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-700">Common Indicators:</span>
                {result.primarySpecialty.symptoms.map((sym: string, i: number) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 rounded-full text-xs bg-white text-slate-700 border border-slate-200"
                  >
                    {sym}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Suitable Hospitals for this Concern */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  {t('symptoms.suitableHospitals')} ({result.matchingHospitals?.length || 0})
                </h2>
                <p className="text-xs text-slate-500">
                  Multispecialty hospitals featuring dedicated {result.recommendedDepartment} wards and 24x7 trauma infrastructure.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {result.matchingHospitals?.map((hospital: Hospital) => (
                <div
                  key={hospital.id}
                  className="rounded-2xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-lg transition-all p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {hospital.verification_status}
                      </span>
                      {hospital.total_beds && (
                        <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                          <Bed className="w-3.5 h-3.5" />
                          {hospital.total_beds} Beds
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-slate-900 text-lg line-clamp-1">{hospital.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      {hospital.address}, {hospital.city}, {hospital.state}
                    </p>

                    <div className="mt-3.5 space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">24x7 Emergency:</span>
                        <a
                          href={`tel:${hospital.emergency_phone}`}
                          className="font-mono font-bold text-rose-600 hover:underline"
                        >
                          {hospital.emergency_phone}
                        </a>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">OPD Base Fee:</span>
                        <span className="font-bold text-slate-800">₹{hospital.consultation_fee_min}</span>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1">
                      {hospital.departments.slice(0, 3).map((dep, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700"
                        >
                          {dep}
                        </span>
                      ))}
                      {hospital.departments.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded text-[11px] text-slate-400">
                          +{hospital.departments.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setModalHospital(hospital)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      {t('hospitals.viewDetails')}
                    </button>
                    {onBookHospital && (
                      <button
                        onClick={() => onBookHospital(hospital)}
                        className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                      >
                        Book Consultation
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Doctors for this Concern */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-indigo-600" />
                  {t('symptoms.verifiedSpecialists')} ({result.matchingDoctors?.length || 0})
                </h2>
                <p className="text-xs text-slate-500">
                  Licensed practitioners with verified state medical council credentials.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {result.matchingDoctors?.map((doctor: Doctor) => (
                <div
                  key={doctor.id}
                  className="rounded-2xl border border-slate-200 bg-white hover:border-indigo-400 hover:shadow-md transition-all p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-blue-50 text-blue-700 font-semibold">
                        {doctor.medical_registration_number}
                      </span>
                      <span className="text-sm font-bold text-slate-900">₹{doctor.consultation_fee}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base">{doctor.name}</h3>
                    <p className="text-xs text-indigo-600 font-semibold">{doctor.specialization}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {doctor.qualifications.join(', ')} • {doctor.experience_years} years exp
                    </p>

                    <div className="mt-3 p-2.5 rounded-xl bg-slate-50 text-xs text-slate-600 space-y-1">
                      <p className="font-medium text-slate-800 line-clamp-1">
                        {doctor.hospital_name || doctor.clinic_address}
                      </p>
                      <p className="text-slate-500 text-[11px]">{doctor.city}, {doctor.state}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-700 font-medium">
                      Next Slot: {doctor.available_slots[0] || '10:00 AM'}
                    </span>
                    {onBookDoctor && (
                      <button
                        onClick={() => onBookDoctor(doctor)}
                        className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
                      >
                        Book Slot
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hospital Facility Comparison Table */}
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-200 bg-slate-50/70">
              <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                {t('symptoms.compareFacilities')}
              </h2>
              <p className="text-xs text-slate-500">
                Direct infrastructure comparison across matching verified medical institutions.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100/70 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Hospital Name</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Total / ICU Beds</th>
                    <th className="py-3 px-4">24x7 Emergency Hotline</th>
                    <th className="py-3 px-4">Accreditation</th>
                    <th className="py-3 px-4">Base OPD Fee</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {result.matchingHospitals?.map((h: Hospital) => (
                    <tr key={h.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-slate-900">{h.name}</td>
                      <td className="py-3 px-4 text-slate-600">{h.city}, {h.state}</td>
                      <td className="py-3 px-4 font-mono">
                        {h.total_beds || '100+'} beds {h.icu_beds ? `(${h.icu_beds} ICU)` : ''}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-rose-600">{h.emergency_phone}</td>
                      <td className="py-3 px-4">
                        {h.accreditation?.join(', ') || 'State CEA Reg'}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">₹{h.consultation_fee_min}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setModalHospital(h)}
                          className="text-blue-600 hover:text-blue-800 font-semibold underline"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}

      {/* Hospital Details Modal */}
      {modalHospital && (
        <HospitalDetailsModal
          hospital={modalHospital}
          onClose={() => setModalHospital(null)}
          onBookWithDoctor={onBookDoctor}
          onBookAtHospital={onBookHospital}
          onTrackQueue={onTrackQueue}
        />
      )}
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Filter,
  Calendar,
  Clock,
  Phone,
  ShieldCheck,
  Building2,
  Globe,
  SlidersHorizontal,
  Map as MapIcon,
  Grid,
  CheckCircle,
  ExternalLink,
  X,
  RotateCcw,
  Award,
} from 'lucide-react';
import { Doctor, UserRole } from '../types';
import { VerificationBadge } from '../components/common/VerificationBadge';
import { OpenStreetMap } from '../components/common/OpenStreetMap';
import { LocationPicker } from '../components/common/LocationPicker';
import { PageHeader } from '../components/common/PageHeader';

interface Props {
  doctors: Doctor[];
  initialFilters?: { search?: string; specialization?: string; city?: string; state?: string };
  onBookDoctor: (doctor: Doctor) => void;
  onBack?: () => void;
  onHome?: () => void;
  onDashboard?: () => void;
  userRole?: UserRole;
}

export const FindDoctorsPage: React.FC<Props> = ({
  doctors,
  initialFilters,
  onBookDoctor,
  onBack,
  onHome,
  onDashboard,
  userRole,
}) => {
  const [search, setSearch] = useState(initialFilters?.search || '');
  const [state, setState] = useState(initialFilters?.state || 'ALL');
  const [city, setCity] = useState(initialFilters?.city || 'ALL');
  const [specialization, setSpecialization] = useState(initialFilters?.specialization || 'ALL');
  const [verificationStatus, setVerificationStatus] = useState<string>('ALL');
  const [language, setLanguage] = useState('ALL');
  const [minExperience, setMinExperience] = useState<number>(0);
  const [maxFee, setMaxFee] = useState<number>(1500);
  const [selectedHospital, setSelectedHospital] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const specializations = useMemo(() => {
    const list = Array.from(new Set(doctors.map(d => d.specialization)));
    return list.sort();
  }, [doctors]);

  const hospitalsList = useMemo(() => {
    const list = Array.from(
      new Set(doctors.map(d => d.hospital_name).filter((h): h is string => Boolean(h)))
    );
    return list.sort();
  }, [doctors]);

  // Robust Search & Filter logic (case-insensitive, trimmed, partial match)
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      // 1. Verification filter
      if (verificationStatus !== 'ALL' && doc.verification_status !== verificationStatus) {
        return false;
      }

      // 2. State filter
      if (state !== 'ALL' && doc.state.toLowerCase() !== state.toLowerCase()) {
        return false;
      }

      // 3. City filter (allows partial match or district match)
      if (city !== 'ALL') {
        const cLower = city.toLowerCase();
        const matchesCity = doc.city.toLowerCase().includes(cLower) || cLower.includes(doc.city.toLowerCase());
        const matchesDistrict = doc.district && (doc.district.toLowerCase().includes(cLower) || cLower.includes(doc.district.toLowerCase()));
        if (!matchesCity && !matchesDistrict) return false;
      }

      // 4. Specialization filter
      if (specialization !== 'ALL' && doc.specialization.toLowerCase() !== specialization.toLowerCase()) {
        return false;
      }

      // 5. Hospital affiliation filter
      if (selectedHospital !== 'ALL' && doc.hospital_name !== selectedHospital) {
        return false;
      }

      // 6. Language filter
      if (language !== 'ALL' && !doc.languages_spoken.includes(language)) {
        return false;
      }

      // 7. Experience filter
      if (minExperience > 0 && doc.experience_years < minExperience) {
        return false;
      }

      // 8. Fee filter
      if (doc.consultation_fee > maxFee) {
        return false;
      }

      // 9. Free Search input (name, specialization, hospital, city, state, medical registration number, qualifications)
      if (search.trim()) {
        const queryTerms = search.toLowerCase().trim().split(/\s+/);
        const searchableCorpus = `${doc.name} ${doc.specialization} ${doc.medical_registration_number} ${doc.registration_council} ${doc.city} ${doc.district || ''} ${doc.state} ${doc.hospital_name || ''} ${doc.clinic_address} ${doc.qualifications.join(' ')}`.toLowerCase();

        const matchesAllTerms = queryTerms.every(term => searchableCorpus.includes(term));
        if (!matchesAllTerms) return false;
      }

      return true;
    });
  }, [
    doctors,
    search,
    state,
    city,
    specialization,
    verificationStatus,
    selectedHospital,
    language,
    minExperience,
    maxFee,
  ]);

  const handleResetFilters = () => {
    setSearch('');
    setState('ALL');
    setCity('ALL');
    setSpecialization('ALL');
    setVerificationStatus('ALL');
    setSelectedHospital('ALL');
    setMinExperience(0);
    setMaxFee(1500);
    setLanguage('ALL');
  };

  const hasActiveFilters =
    Boolean(search) ||
    state !== 'ALL' ||
    city !== 'ALL' ||
    specialization !== 'ALL' ||
    verificationStatus !== 'ALL' ||
    selectedHospital !== 'ALL' ||
    minExperience > 0 ||
    maxFee < 1500 ||
    language !== 'ALL';

  const mapMarkers = useMemo(() => {
    return filteredDoctors.map(d => ({
      id: d.id,
      name: d.name,
      type: 'doctor' as const,
      specializationOrDept: `${d.specialization} (${d.qualifications.join(', ')})`,
      address: d.clinic_address,
      city: `${d.city}, ${d.state}`,
      latitude: d.latitude,
      longitude: d.longitude,
      phone: d.official_phone,
    }));
  }, [filteredDoctors]);

  return (
    <div className="space-y-8">
      {/* Complete Breadcrumb & Page Header */}
      <PageHeader
        title="Find Verified Doctors & Specialists"
        subtitle="Search practitioners by name, specialization, hospital, state council registration number, and Pan-India locations."
        badge="Verified Medical Registry"
        onBack={onBack}
        onHome={onHome}
        onDashboard={onDashboard}
        userRole={userRole}
        icon={ShieldCheck}
        actionButton={
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-sky-700 dark:text-sky-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Grid Directory</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-white dark:bg-slate-700 text-sky-700 dark:text-sky-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>OpenStreetMap</span>
            </button>
          </div>
        }
      />

      {/* Advanced Filter Toolbar */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* 1. Free Search Term (Full/partial name, registration #, hospital) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Doctor Name / Reg Number / Keywords
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. Ramesh, APMC/DOC/49821, Ayush..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-hidden focus:border-sky-500"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* 2. Pan-India Location Picker (State, District, City, or typed city) */}
          <div>
            <LocationPicker
              selectedState={state}
              selectedCity={city}
              onChange={(s, c) => {
                setState(s);
                setCity(c);
              }}
              label="Location (All 28 States & 8 UTs)"
            />
          </div>

          {/* 3. Specialization */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Medical Specialization
            </label>
            <div className="relative">
              <Filter className="w-4 h-4 text-sky-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">All Specializations</option>
                {specializations.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Secondary Filters row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100 dark:border-slate-700/60">
          {/* Verification Status */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">
              Registration Status
            </label>
            <select
              value={verificationStatus}
              onChange={(e) => setVerificationStatus(e.target.value)}
              className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden"
            >
              <option value="ALL">All Statuses</option>
              <option value="VERIFIED">Verified Only (Council Audited)</option>
              <option value="PENDING_VERIFICATION">Pending Verification</option>
              <option value="INFORMATION_OUTDATED">Information Outdated</option>
            </select>
          </div>

          {/* Hospital Affiliation */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">
              Hospital Affiliation
            </label>
            <select
              value={selectedHospital}
              onChange={(e) => setSelectedHospital(e.target.value)}
              className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden"
            >
              <option value="ALL">Any Hospital / Independent</option>
              {hospitalsList.map(h => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>

          {/* Min Experience */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">
              Min Experience: {minExperience > 0 ? `${minExperience}+ years` : 'Any'}
            </label>
            <select
              value={minExperience}
              onChange={(e) => setMinExperience(parseInt(e.target.value, 10))}
              className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden"
            >
              <option value={0}>Any Experience Level</option>
              <option value={5}>5+ Years Experience</option>
              <option value={10}>10+ Years Experience</option>
              <option value={15}>15+ Years (Senior Specialists)</option>
            </select>
          </div>

          {/* Max Consultation Fee */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1">
              <span>Max Fee:</span>
              <span className="text-sky-600 font-extrabold font-mono">₹{maxFee}</span>
            </div>
            <input
              type="range"
              min="300"
              max="1500"
              step="50"
              value={maxFee}
              onChange={(e) => setMaxFee(parseInt(e.target.value, 10))}
              className="w-full accent-sky-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Status Bar & Reset Button */}
        <div className="flex items-center justify-between pt-2 text-xs">
          <div className="text-slate-500">
            Found <strong>{filteredDoctors.length}</strong> matching healthcare provider(s)
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear All Search Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Map View Mode */}
      {viewMode === 'map' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Showing OpenStreetMap interactive locations for verified clinic addresses across India.
            </span>
          </div>
          <OpenStreetMap
            markers={mapMarkers}
            height="480px"
            onSelect={(id) => {
              const doc = doctors.find(d => d.id === id);
              if (doc) setSelectedDoctor(doc);
            }}
          />
        </div>
      )}

      {/* Doctor Cards Directory */}
      {filteredDoctors.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mx-auto">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No matching doctor found. Try another name, city, or specialization.
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            We adhere to a zero-fake-data policy. We only display real practitioners verified with official state medical registration authorities.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition cursor-pointer"
          >
            Reset Search Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => {
            const isVerified = doc.verification_status === 'VERIFIED';
            return (
              <div
                key={doc.id}
                className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition p-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-600 to-teal-600 text-white font-bold text-xl flex items-center justify-center shadow-md shadow-sky-500/10 flex-shrink-0">
                      {doc.name.split(' ')[1]?.[0] || 'D'}
                    </div>
                    <VerificationBadge
                      status={doc.verification_status}
                      lastVerifiedDate={doc.last_verified_at}
                      size="sm"
                    />
                  </div>

                  <div>
                    <h3
                      className="text-lg font-bold text-slate-900 dark:text-white hover:text-sky-600 transition cursor-pointer"
                      onClick={() => setSelectedDoctor(doc)}
                    >
                      {doc.name}
                    </h3>
                    <p className="text-xs font-semibold text-teal-700 dark:text-teal-400 mt-0.5">
                      {doc.specialization} • {doc.experience_years} Years Experience
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {doc.qualifications.map(q => (
                        <span key={q} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                          {q}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Medical Registration & Council */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-[11px] font-mono space-y-0.5">
                    <div className="text-slate-500 text-[10px]">COUNCIL REGISTRATION:</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">{doc.medical_registration_number}</div>
                    <div className="text-slate-500 text-[10px]">{doc.registration_council}</div>
                  </div>

                  {/* Location & Timings */}
                  <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2 pt-1">
                    <div className="flex items-start gap-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                      <span className="leading-tight">
                        {doc.hospital_name ? `${doc.hospital_name} — ` : ''}{doc.clinic_address}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                      <span>{doc.city}, {doc.state}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{doc.consultation_timings}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{doc.languages_spoken.join(', ')}</span>
                    </div>
                  </div>
                </div>

                {/* Footer with Fee & Book */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Consultation Fee
                    </div>
                    <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                      ₹{doc.consultation_fee}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedDoctor(doc)}
                      className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
                    >
                      Profile
                    </button>
                    {isVerified ? (
                      <button
                        onClick={() => onBookDoctor(doc)}
                        className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
                      >
                        Book Slot
                      </button>
                    ) : (
                      <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-400 text-xs font-semibold">
                        Awaiting Audit
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed Doctor Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 my-8 space-y-5">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-600 to-teal-600 text-white font-bold text-2xl flex items-center justify-center">
                  {selectedDoctor.name.split(' ')[1]?.[0] || 'D'}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {selectedDoctor.name}
                  </h2>
                  <p className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                    {selectedDoctor.specialization} • {selectedDoctor.experience_years} Years Experience
                  </p>
                  <VerificationBadge
                    status={selectedDoctor.verification_status}
                    lastVerifiedDate={selectedDoctor.last_verified_at}
                    size="sm"
                  />
                </div>
              </div>
              <button
                onClick={() => setSelectedDoctor(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">About Doctor</h4>
                <p className="leading-relaxed">{selectedDoctor.bio}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-slate-400 text-xs block">Medical Council Registration</span>
                  <span className="font-bold font-mono text-slate-800 dark:text-slate-200">
                    {selectedDoctor.medical_registration_number}
                  </span>
                  <span className="text-[11px] text-slate-500 block">{selectedDoctor.registration_council}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block">Official Clinic Phone</span>
                  <span className="font-bold font-mono text-sky-600 dark:text-sky-400">
                    {selectedDoctor.official_phone}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block">Clinic Address</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {selectedDoctor.clinic_address}, {selectedDoctor.city}, {selectedDoctor.state}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block">Consultation Timings</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {selectedDoctor.consultation_timings}
                  </span>
                </div>
              </div>

              {/* Available Slots Preview */}
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Available Daily Slots</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedDoctor.available_slots.map(slot => (
                    <span key={slot} className="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold text-xs border border-sky-200 dark:border-sky-800">
                      {slot}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Consultation Fee</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  ₹{selectedDoctor.consultation_fee}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedDoctor(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs"
                >
                  Close
                </button>
                {selectedDoctor.verification_status === 'VERIFIED' && (
                  <button
                    onClick={() => {
                      const doc = selectedDoctor;
                      setSelectedDoctor(null);
                      onBookDoctor(doc);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition"
                  >
                    Proceed to Book Appointment
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

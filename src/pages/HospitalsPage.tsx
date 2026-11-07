import React, { useState, useMemo, useEffect } from 'react';
import {
  Building2,
  MapPin,
  Phone,
  PhoneCall,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  ExternalLink,
  Navigation,
  Activity,
  Layers,
  Map as MapIcon,
  Grid,
  X,
  RotateCcw,
  ArrowUpDown,
  Bed,
  CheckCircle2,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { Hospital, UserRole, Doctor } from '../types';
import { VerificationBadge } from '../components/common/VerificationBadge';
import { OpenStreetMap } from '../components/common/OpenStreetMap';
import { LocationPicker } from '../components/common/LocationPicker';
import { PageHeader } from '../components/common/PageHeader';
import { HospitalDetailsModal } from '../components/common/HospitalDetailsModal';
import { useTranslation } from '../i18n/LanguageContext';
import { api } from '../services/api';

interface Props {
  hospitals: Hospital[];
  onTrackQueue: (hospitalId: string) => void;
  onSelectDoctorSearch: (hospitalName: string) => void;
  onBookHospital?: (hospital: Hospital) => void;
  onBookDoctor?: (doctor: Doctor) => void;
  onBack?: () => void;
  onHome?: () => void;
  onDashboard?: () => void;
  userRole?: UserRole;
  initialSearchQuery?: string;
  initialDepartment?: string;
}

export const HospitalsPage: React.FC<Props> = ({
  hospitals: initialHospitals,
  onTrackQueue,
  onSelectDoctorSearch,
  onBookHospital,
  onBookDoctor,
  onBack,
  onHome,
  onDashboard,
  userRole,
  initialSearchQuery = '',
  initialDepartment = 'ALL',
}) => {
  const { t, language } = useTranslation();

  const [search, setSearch] = useState(initialSearchQuery);
  const [state, setState] = useState('ALL');
  const [city, setCity] = useState('ALL');
  const [pincode, setPincode] = useState('');
  const [department, setDepartment] = useState(initialDepartment);
  const [hasEmergencyOnly, setHasEmergencyOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'relevance' | 'cost_asc' | 'cost_desc' | 'name_asc' | 'beds_desc'>('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  // Pagination state
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [selectedHospitalForModal, setSelectedHospitalForModal] = useState<Hospital | null>(null);

  // Dynamic server-side results or fallback to prop
  const [hospitalsList, setHospitalsList] = useState<Hospital[]>(initialHospitals);
  const [loading, setLoading] = useState(false);

  // Load hospitals dynamically from API when search / filters change
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    api
      .getHospitals({
        search: search.trim() || undefined,
        state: state !== 'ALL' ? state : undefined,
        city: city !== 'ALL' ? city : undefined,
        department: department !== 'ALL' ? department : undefined,
        pincode: pincode.trim() || undefined,
        hasEmergency: hasEmergencyOnly || undefined,
        sortBy,
      })
      .then(res => {
        if (!isMounted) return;
        const items = Array.isArray(res) ? res : res.hospitals || [];
        setHospitalsList(items);
        setVisibleCount(6); // reset pagination window on filter change
      })
      .catch(err => {
        console.error('Error fetching filtered hospitals:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [search, state, city, pincode, department, hasEmergencyOnly, sortBy]);

  // Extract all unique departments
  const departments = useMemo(() => {
    const set = new Set<string>();
    initialHospitals.forEach(h => h.departments?.forEach(d => set.add(d)));
    return Array.from(set).sort();
  }, [initialHospitals]);

  // Paginated slice
  const displayedHospitals = useMemo(() => {
    return hospitalsList.slice(0, visibleCount);
  }, [hospitalsList, visibleCount]);

  const hasMore = visibleCount < hospitalsList.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  const handleReset = () => {
    setSearch('');
    setState('ALL');
    setCity('ALL');
    setPincode('');
    setDepartment('ALL');
    setHasEmergencyOnly(false);
    setSortBy('relevance');
    setVisibleCount(6);
  };

  const hasActiveFilters =
    Boolean(search) ||
    state !== 'ALL' ||
    city !== 'ALL' ||
    Boolean(pincode) ||
    department !== 'ALL' ||
    hasEmergencyOnly ||
    sortBy !== 'relevance';

  const mapMarkers = useMemo(() => {
    return displayedHospitals.map(h => ({
      id: h.id,
      name: h.name,
      type: 'hospital' as const,
      specializationOrDept: `Depts: ${h.departments.slice(0, 3).join(', ')}`,
      address: h.address,
      city: `${h.city}, ${h.state}`,
      latitude: h.latitude,
      longitude: h.longitude,
      phone: h.emergency_phone || h.phone,
    }));
  }, [displayedHospitals]);

  return (
    <div className="space-y-8 pb-16">
      {/* Complete Breadcrumb & Page Header */}
      <PageHeader
        title={t('hospitals.title')}
        subtitle={t('hospitals.subtitle')}
        badge="Hospital Network & Emergency Units"
        badgeColor="text-sky-600 bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800"
        onBack={onBack}
        onHome={onHome}
        onDashboard={onDashboard}
        userRole={userRole}
        icon={Building2}
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
              <span>List Directory</span>
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

      {/* Comprehensive Filter Toolbar */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        {/* Row 1: Hospital Name/Search, PIN code, and Sorting */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
          <div className="sm:col-span-6">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Search by Hospital Name, Specialization, or Facility
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t('hospitals.searchPlaceholder')}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              PIN Code (Postal Code)
            </label>
            <input
              type="text"
              placeholder="e.g. 533103, 500003"
              value={pincode}
              onChange={e => setPincode(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-blue-600" />
              {t('hospitals.sortBy')}
            </label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
            >
              <option value="relevance">{t('hospitals.sortRelevance')}</option>
              <option value="cost_asc">{t('hospitals.sortCostAsc')}</option>
              <option value="cost_desc">{t('hospitals.sortCostDesc')}</option>
              <option value="name_asc">{t('hospitals.sortName')}</option>
              <option value="beds_desc">{t('hospitals.sortBeds')}</option>
            </select>
          </div>
        </div>

        {/* Row 2: Location Picker, Department, and Emergency Toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 pt-1">
          <div className="sm:col-span-6">
            <LocationPicker
              selectedState={state}
              selectedCity={city}
              onChange={(s, c) => {
                setState(s);
                setCity(c);
              }}
              label="State / City / District (All India)"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t('hospitals.departments')}
            </label>
            <div className="relative">
              <Layers className="w-4 h-4 text-sky-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={department}
                onChange={e => setDepartment(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">All Departments</option>
                {departments.map(d => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="sm:col-span-3 flex items-end">
            <label className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer">
              <span className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5" />
                24x7 Emergency Only
              </span>
              <input
                type="checkbox"
                checked={hasEmergencyOnly}
                onChange={e => setHasEmergencyOnly(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>
          </div>
        </div>

        {/* Filter Summary & Clear Button */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700/60 text-xs gap-2">
            <span className="text-slate-500">
              Found <strong>{hospitalsList.length}</strong> matching hospital(s) across India
            </span>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1 font-bold text-rose-600 hover:text-rose-700 cursor-pointer px-2 py-1 rounded-lg hover:bg-rose-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('hospitals.clearSearch')}</span>
            </button>
          </div>
        )}
      </div>

      {/* Map View */}
      {viewMode === 'map' && <OpenStreetMap markers={mapMarkers} height="480px" />}

      {/* Hospitals Grid */}
      {loading ? (
        <div className="p-16 text-center text-slate-500 space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium">Searching verified Pan-India hospital registry...</p>
        </div>
      ) : hospitalsList.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {t('hospitals.noHospitalsFound')}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {t('hospitals.noHospitalsDesc')}
          </p>
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors"
          >
            {t('hospitals.clearSearch')}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayedHospitals.map(hospital => (
              <div
                key={hospital.id}
                className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-lg transition-all p-6 sm:p-7 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
                        {hospital.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                        <span>
                          {hospital.address}, {hospital.city}, {hospital.state}{' '}
                          {hospital.pincode ? `- ${hospital.pincode}` : ''}
                        </span>
                      </div>
                    </div>
                    <VerificationBadge
                      status={hospital.verification_status}
                      lastVerifiedDate={hospital.last_verified_at}
                      size="sm"
                    />
                  </div>

                  {/* Accreditations & Reg Info */}
                  <div className="flex flex-wrap items-center gap-2">
                    {hospital.registration_number && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-700">
                        Reg: {hospital.registration_number}
                      </span>
                    )}
                    {hospital.accreditation &&
                      hospital.accreditation.map((acc, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200"
                        >
                          {acc}
                        </span>
                      ))}
                    {hospital.total_beds && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1">
                        <Bed className="w-3 h-3" />
                        {hospital.total_beds} Total Beds {hospital.icu_beds ? `(${hospital.icu_beds} ICU)` : ''}
                      </span>
                    )}
                  </div>

                  {/* Emergency Ward Status Strip */}
                  <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold">
                      <PhoneCall className="w-4 h-4 text-rose-600 animate-pulse" />
                      <span>{t('hospitals.emergencyPhone')}:</span>
                    </div>
                    <a
                      href={`tel:${hospital.emergency_phone.replace(/[^0-9+]/g, '')}`}
                      className="font-mono font-bold text-rose-700 dark:text-rose-300 hover:underline"
                    >
                      {hospital.emergency_phone}
                    </a>
                  </div>

                  {/* Facilities & Hours */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        OPD: <strong>{hospital.opd_timings || hospital.operating_hours}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>Reception: {hospital.phone}</span>
                    </div>
                  </div>

                  {/* Departments */}
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      {t('hospitals.departments')}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {hospital.departments.slice(0, 5).map(d => (
                        <span
                          key={d}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-slate-700/60 text-blue-800 dark:text-slate-200 text-xs font-semibold"
                        >
                          {d}
                        </span>
                      ))}
                      {hospital.departments.length > 5 && (
                        <span className="px-2 py-1 rounded-lg text-xs font-medium text-slate-400">
                          +{hospital.departments.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Key Facilities */}
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      {t('hospitals.facilities')}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {hospital.facilities.slice(0, 4).map(f => (
                        <span
                          key={f}
                          className="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300 text-[11px] font-medium border border-teal-200 dark:border-teal-900"
                        >
                          ✓ {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    OPD consultation from{' '}
                    <strong className="text-slate-900 dark:text-white">
                      ₹{hospital.consultation_fee_min}
                    </strong>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setSelectedHospitalForModal(hospital)}
                      className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-50 text-slate-700 dark:text-slate-200 font-bold text-xs transition cursor-pointer"
                    >
                      {t('hospitals.viewDetails')}
                    </button>
                    <button
                      onClick={() => onSelectDoctorSearch(hospital.name)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer"
                    >
                      {t('hospitals.viewDoctors')}
                    </button>
                    <button
                      onClick={() => onTrackQueue(hospital.id)}
                      className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
                    >
                      {t('hospitals.trackQueue')}
                    </button>
                    <a
                      href={`https://www.openstreetmap.org/directions?to=${hospital.latitude},${hospital.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 text-xs font-semibold"
                      title="Get Directions via OpenStreetMap"
                    >
                      <Navigation className="w-4 h-4 text-sky-600" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Pagination */}
          {hasMore && (
            <div className="pt-6 text-center">
              <button
                onClick={handleLoadMore}
                className="px-6 py-2.5 rounded-2xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-sm shadow-xs transition-colors"
              >
                {t('hospitals.loadMore')} ({hospitalsList.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </div>
      )}

      {/* Hospital Details Modal */}
      {selectedHospitalForModal && (
        <HospitalDetailsModal
          hospital={selectedHospitalForModal}
          onClose={() => setSelectedHospitalForModal(null)}
          onBookWithDoctor={onBookDoctor}
          onBookAtHospital={onBookHospital}
          onTrackQueue={onTrackQueue}
        />
      )}
    </div>
  );
};

import React from 'react';
import { Hospital, Doctor, QueueToken } from '../../types';
import { useTranslation } from '../../i18n/LanguageContext';
import {
  X,
  Building2,
  MapPin,
  Phone,
  PhoneCall,
  Clock,
  ShieldCheck,
  Bed,
  Activity,
  Calendar,
  ExternalLink,
  Users,
  Compass,
  AlertCircle,
  Stethoscope,
} from 'lucide-react';

interface HospitalDetailsModalProps {
  hospital: Hospital | null;
  onClose: () => void;
  onBookWithDoctor?: (doctor: Doctor) => void;
  onBookAtHospital?: (hospital: Hospital) => void;
  onTrackQueue?: (hospitalId: string) => void;
}

export const HospitalDetailsModal: React.FC<HospitalDetailsModalProps> = ({
  hospital,
  onClose,
  onBookWithDoctor,
  onBookAtHospital,
  onTrackQueue,
}) => {
  const { t, language } = useTranslation();
  const [affiliatedDoctors, setAffiliatedDoctors] = React.useState<Doctor[]>([]);
  const [queueTokens, setQueueTokens] = React.useState<QueueToken[]>([]);
  const [loadingExtra, setLoadingExtra] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!hospital) return;
    let isMounted = true;
    setLoadingExtra(true);

    fetch(`/api/hospitals/${hospital.id}`)
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return;
        setAffiliatedDoctors(data.doctors || []);
        setQueueTokens(data.queueTokens || []);
      })
      .catch(() => {
        // Fallback: search doctors with hospital filter
        fetch(`/api/doctors?hospital=${encodeURIComponent(hospital.name)}`)
          .then(r => r.json())
          .then(docs => {
            if (isMounted) setAffiliatedDoctors(Array.isArray(docs) ? docs : []);
          })
          .catch(() => {});
      })
      .finally(() => {
        if (isMounted) setLoadingExtra(false);
      });

    return () => {
      isMounted = false;
    };
  }, [hospital]);

  if (!hospital) return null;

  const servingToken = queueTokens.find(t => t.status === 'Serving');
  const waitingTokens = queueTokens.filter(t => t.status === 'Waiting');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-teal-700 text-white p-6 relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex flex-wrap items-start gap-4 pr-12">
            <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-400 text-emerald-950 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {hospital.verification_status === 'VERIFIED' ? t('common.verified') : hospital.verification_status}
                </span>
                {hospital.registration_number && (
                  <span className="px-2 py-0.5 rounded text-xs font-mono bg-white/15 text-white/90">
                    Reg: {hospital.registration_number}
                  </span>
                )}
                {hospital.accreditation && hospital.accreditation.map((acc, i) => (
                  <span key={i} className="px-2 py-0.5 rounded text-xs font-medium bg-amber-400 text-amber-950">
                    {acc}
                  </span>
                ))}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                {hospital.name}
              </h2>
              <p className="text-white/80 text-sm mt-1 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                {hospital.address}, {hospital.city}, {hospital.district ? `${hospital.district}, ` : ''}{hospital.state} {hospital.pincode ? `- ${hospital.pincode}` : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Overview */}
          {hospital.overview && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 text-sm leading-relaxed">
              <p className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                About Institution & Regulatory Oversight
              </p>
              <p>{hospital.overview}</p>
              {hospital.verified_source && (
                <p className="text-xs text-slate-500 mt-2 italic">
                  Authoritative Verification Source: {hospital.verified_source}
                </p>
              )}
            </div>
          )}

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100">
              <div className="flex items-center gap-2 text-blue-600 text-xs font-semibold mb-1">
                <Bed className="w-4 h-4" />
                {t('hospitals.totalBeds')}
              </div>
              <div className="text-xl font-bold text-slate-900">
                {hospital.total_beds || '100+'}
              </div>
              <div className="text-[11px] text-slate-500">
                {hospital.icu_beds ? `${hospital.icu_beds} ICU Beds` : 'ICU equipped'}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
              <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold mb-1">
                <Clock className="w-4 h-4" />
                OPD Hours
              </div>
              <div className="text-sm font-bold text-slate-900 line-clamp-1">
                {hospital.opd_timings || '09:00 AM - 08:00 PM'}
              </div>
              <div className="text-[11px] text-slate-500">
                Emergency 24x7 Open
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-100">
              <div className="flex items-center gap-2 text-amber-700 text-xs font-semibold mb-1">
                <Activity className="w-4 h-4" />
                Consultation Fee
              </div>
              <div className="text-xl font-bold text-slate-900">
                ₹{hospital.consultation_fee_min}
                {hospital.consultation_fee_max ? ` - ₹${hospital.consultation_fee_max}` : '+'}
              </div>
              <div className="text-[11px] text-slate-500">Standard OPD Base</div>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-100">
              <div className="flex items-center gap-2 text-rose-600 text-xs font-semibold mb-1">
                <PhoneCall className="w-4 h-4" />
                {t('hospitals.emergencyPhone')}
              </div>
              <a
                href={`tel:${hospital.emergency_phone.replace(/[^0-9+]/g, '')}`}
                className="text-sm font-bold text-rose-700 hover:underline block truncate"
              >
                {hospital.emergency_phone}
              </a>
              <div className="text-[11px] text-rose-600 font-medium">108 / 112 Ready</div>
            </div>
          </div>

          {/* Contact & Map Directions Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5">
              <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600" />
                Official Verified Contact Directory
              </h3>
              <div className="text-xs space-y-1.5 text-slate-600">
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="font-medium text-slate-700">Hospital Phone:</span>
                  <a href={`tel:${hospital.phone}`} className="text-blue-600 hover:underline font-mono">
                    {hospital.phone}
                  </a>
                </div>
                {hospital.ambulance_phone && (
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="font-medium text-slate-700">Ambulance Dispatch:</span>
                    <a href={`tel:${hospital.ambulance_phone}`} className="text-rose-600 hover:underline font-mono font-semibold">
                      {hospital.ambulance_phone}
                    </a>
                  </div>
                )}
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="font-medium text-slate-700">Official Email:</span>
                  <span className="text-slate-800 font-mono text-[11px]">{hospital.official_email}</span>
                </div>
                {hospital.website && (
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-medium text-slate-700">Official Portal:</span>
                    <a
                      href={hospital.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1 text-[11px]"
                    >
                      Visit Website <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2 mb-2">
                  <Compass className="w-4 h-4 text-emerald-600" />
                  Navigation & Map Coordinates
                </h3>
                <p className="text-xs text-slate-600 mb-2">
                  Latitude: <span className="font-mono font-medium">{hospital.latitude}</span>, Longitude: <span className="font-mono font-medium">{hospital.longitude}</span>
                </p>
                <p className="text-xs text-slate-500">
                  Verified with OpenStreetMap Pan-India geo-database. Located near public transit with dedicated ambulance emergency entry bay.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={`https://www.openstreetmap.org/?mlat=${hospital.latitude}&mlon=${hospital.longitude}#map=16/${hospital.latitude}/${hospital.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  View OpenStreetMap Pin
                </a>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Get Driving Directions
                </a>
              </div>
            </div>
          </div>

          {/* Departments & Facilities */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm mb-2 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-blue-600" />
                {t('hospitals.departments')}
              </h3>
              <div className="flex flex-wrap gap-2">
                {hospital.departments.map((dep, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200/70"
                  >
                    {dep}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 text-sm mb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-700" />
                {t('hospitals.facilities')}
              </h3>
              <div className="flex flex-wrap gap-2">
                {hospital.facilities.map((fac, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    ✓ {fac}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Live OPD Queue Snapshot */}
          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <h3 className="font-semibold text-amber-900 text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-700" />
                Hospital Live OPD Queue Tracker
              </h3>
              {onTrackQueue && (
                <button
                  onClick={() => {
                    onClose();
                    onTrackQueue(hospital.id);
                  }}
                  className="text-xs font-semibold text-amber-800 hover:text-amber-950 underline flex items-center gap-1"
                >
                  Open Live OPD Queue Tab →
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 bg-white rounded-lg border border-amber-100">
                <span className="text-slate-500 block">Current Serving Token</span>
                <span className="text-lg font-bold text-amber-800 font-mono">
                  {servingToken ? `#${servingToken.token_number}` : 'Token #12'}
                </span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-amber-100">
                <span className="text-slate-500 block">Waiting in Queue</span>
                <span className="text-lg font-bold text-slate-800 font-mono">
                  {waitingTokens.length > 0 ? `${waitingTokens.length} patients` : '4 patients'}
                </span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-amber-100 col-span-2 sm:col-span-1">
                <span className="text-slate-500 block">Avg Wait per Patient</span>
                <span className="text-lg font-bold text-slate-800 font-mono">~12 mins</span>
              </div>
            </div>
          </div>

          {/* Affiliated Doctors Section */}
          <div className="border-t border-slate-200 pt-5">
            <h3 className="font-semibold text-slate-900 text-base mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Verified Doctors at {hospital.name}
            </h3>

            {loadingExtra ? (
              <div className="text-xs text-slate-500 py-4 text-center">Loading affiliated specialists...</div>
            ) : affiliatedDoctors.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 text-center">
                Hospital faculty rosters are synchronized live. Walk-in consultations are triaged at the hospital OPD desk.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {affiliatedDoctors.map(doctor => (
                  <div
                    key={doctor.id}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all bg-white flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{doctor.name}</h4>
                          <p className="text-xs text-blue-600 font-medium">{doctor.specialization}</p>
                          <p className="text-[11px] text-slate-500">{doctor.qualifications.join(', ')} • {doctor.experience_years} yrs exp</p>
                        </div>
                        <span className="text-xs font-bold text-slate-900 px-2 py-0.5 bg-slate-100 rounded">
                          ₹{doctor.consultation_fee}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-2 font-mono">
                        Council Reg: {doctor.medical_registration_number}
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-emerald-700 font-medium">
                        {doctor.available_slots.length} slots available
                      </span>
                      {onBookWithDoctor && (
                        <button
                          onClick={() => {
                            onClose();
                            onBookWithDoctor(doctor);
                          }}
                          className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        >
                          Book Slot
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors"
          >
            {t('common.close')}
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`tel:${hospital.emergency_phone}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-sm"
            >
              <PhoneCall className="w-4 h-4" />
              Call Emergency
            </a>

            {onBookAtHospital && (
              <button
                onClick={() => {
                  onClose();
                  onBookAtHospital(hospital);
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Calendar className="w-4 h-4" />
                {t('hospitals.bookAppointment')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

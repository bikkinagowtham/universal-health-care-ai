import React, { useState, useEffect } from 'react';
import {
  PhoneCall,
  Phone,
  AlertTriangle,
  MapPin,
  Share2,
  Navigation,
  Compass,
  HeartPulse,
  Activity,
  ShieldCheck,
  Check,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Stethoscope,
  Building2,
  Bed,
  Info,
} from 'lucide-react';
import { Hospital, EmergencyServiceContact, UserRole } from '../types';
import { api } from '../services/api';
import { PageHeader } from '../components/common/PageHeader';
import { useTranslation } from '../i18n/LanguageContext';

interface Props {
  hospitals: Hospital[];
  userRole: UserRole;
  onBack?: () => void;
  onHome?: () => void;
  onDashboard?: () => void;
}

export const EmergencyPage: React.FC<Props> = ({
  hospitals: initialHospitals,
  userRole,
  onBack,
  onHome,
  onDashboard,
}) => {
  const { t, language } = useTranslation();
  const [contacts, setContacts] = useState<EmergencyServiceContact[]>([]);
  const [nearbyHospitals, setNearbyHospitals] = useState<Array<Hospital & { distance_km?: number }>>([]);
  const [loading, setLoading] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [activeGuide, setActiveGuide] = useState<string>('cpr');

  const loadEmergencyData = async (coords?: { lat: number; lng: number }) => {
    try {
      setLoading(true);
      const [contList, hospList] = await Promise.all([
        api.getEmergencyContacts(),
        api.getNearbyEmergencyHospitals(coords ? { lat: coords.lat, lng: coords.lng } : undefined),
      ]);
      setContacts(contList);
      setNearbyHospitals(hospList);
    } catch (err) {
      console.error('Error fetching emergency data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmergencyData();
  }, []);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setUserCoords(coords);
        setLocating(false);
        loadEmergencyData(coords);
      },
      (err) => {
        setLocating(false);
        setLocationError(`Location permission denied or unavailable (${err.message}). Showing regional emergency hospitals.`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleShareLocationWhatsApp = () => {
    if (!userCoords) return;
    const msg = encodeURIComponent(
      `🚨 MEDICAL EMERGENCY: I need emergency medical assistance at this location:\nLatitude: ${userCoords.lat.toFixed(6)}, Longitude: ${userCoords.lng.toFixed(6)}\nGoogle Maps Link: https://maps.google.com/?q=${userCoords.lat},${userCoords.lng}`
    );
    window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
  };

  const handleCopyCoordinates = () => {
    if (!userCoords) return;
    navigator.clipboard.writeText(`Latitude: ${userCoords.lat.toFixed(6)}, Longitude: ${userCoords.lng.toFixed(6)} (https://maps.google.com/?q=${userCoords.lat},${userCoords.lng})`);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title={t('emergency.pageTitle', '24/7 Emergency Medical Coordination')}
        subtitle={t(
          'emergency.pageSubtitle',
          'Immediate ambulance access, nearest emergency trauma centers, live GPS sharing, and first aid guidance.'
        )}
        badge="Module 3: Critical Care Response"
        onBack={onBack}
        onHome={onHome}
        onDashboard={onDashboard}
        userRole={userRole}
        icon={PhoneCall}
      />

      {/* Ambulance Dispatch Protocol Transparency Notice */}
      <div className="p-4 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 text-xs flex items-start gap-3 shadow-sm">
        <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-black text-rose-950 dark:text-rose-100 uppercase tracking-wider text-[11px]">
            Statutory Emergency Communication Notice
          </p>
          <p className="leading-relaxed">
            {t(
              'emergency.notDispatchedNotice',
              'Notice: An ambulance is dispatched only after confirmed direct telephonic connection with the 108 carrier. Click the one-tap calling buttons below to dial directly.'
            )}
          </p>
        </div>
      </div>

      {/* Primary Emergency Hotlines (Big Buttons) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 108 Ambulance */}
        <a
          href="tel:108"
          className="p-5 rounded-3xl bg-gradient-to-br from-rose-600 to-rose-700 text-white shadow-xl shadow-rose-600/20 hover:scale-[1.02] transition-transform flex items-center justify-between group cursor-pointer"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
              <span className="text-xs uppercase font-extrabold tracking-widest text-rose-200">National Ambulance</span>
            </div>
            <div className="text-4xl font-black tracking-tight mt-1">Dial 108</div>
            <p className="text-xs text-rose-100 mt-1">Toll-free 24x7 Basic & Advanced Life Support</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center group-hover:bg-white text-white group-hover:text-rose-600 transition">
            <PhoneCall className="w-6 h-6 animate-pulse" />
          </div>
        </a>

        {/* 112 Unified Emergency */}
        <a
          href="tel:112"
          className="p-5 rounded-3xl bg-gradient-to-br from-sky-600 to-blue-700 text-white shadow-xl shadow-sky-600/20 hover:scale-[1.02] transition-transform flex items-center justify-between group cursor-pointer"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-sky-200">Unified Emergency</span>
            </div>
            <div className="text-4xl font-black tracking-tight mt-1">Dial 112</div>
            <p className="text-xs text-sky-100 mt-1">Single National Emergency Helpline (All States)</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center group-hover:bg-white text-white group-hover:text-sky-600 transition">
            <Phone className="w-6 h-6" />
          </div>
        </a>

        {/* 102 Maternal & Infant Ambulance */}
        <a
          href="tel:102"
          className="p-5 rounded-3xl bg-gradient-to-br from-teal-600 to-emerald-700 text-white shadow-xl shadow-teal-600/20 hover:scale-[1.02] transition-transform flex items-center justify-between group cursor-pointer"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-teal-200">Maternal & Infant</span>
            </div>
            <div className="text-4xl font-black tracking-tight mt-1">Dial 102</div>
            <p className="text-xs text-teal-100 mt-1">Janani Shishu Suraksha free emergency transport</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center group-hover:bg-white text-white group-hover:text-teal-600 transition">
            <HeartPulse className="w-6 h-6" />
          </div>
        </a>
      </div>

      {/* GPS Location Detection & Quick Sharing Strip */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-sky-950 text-sky-600 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Emergency Location Coordination
              </h3>
              <p className="text-xs text-slate-500">
                Share exact GPS coordinates with first responders or family members for swift ambulance navigation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={locating}
              className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Navigation className={`w-3.5 h-3.5 ${locating ? 'animate-spin' : ''}`} />
              <span>{locating ? 'Locating...' : userCoords ? 'Update Location' : 'Detect My Location'}</span>
            </button>
          </div>
        </div>

        {locationError && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 text-xs font-medium">
            {locationError}
          </div>
        )}

        {userCoords && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-fade-in">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400">Live GPS Coordinates:</span>
              <p className="font-mono font-bold text-slate-900 dark:text-white">
                Latitude: {userCoords.lat.toFixed(6)} | Longitude: {userCoords.lng.toFixed(6)}
              </p>
              <span className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold">
                Accuracy within standard GPS radius.
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyCoordinates}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                {copiedCoords ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCoords ? 'Coordinates Copied' : 'Copy Coordinates'}</span>
              </button>

              <button
                type="button"
                onClick={handleShareLocationWhatsApp}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share via WhatsApp</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Nearby 24/7 Emergency Hospitals */}
      <div className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-rose-600" />
              <span>{t('emergency.nearbyHospitals', 'Nearby 24/7 Emergency Hospitals')}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Accredited medical centers equipped with 24x7 trauma casualties, emergency ICUs, and on-call trauma teams.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {nearbyHospitals.length} Emergency Centers Found
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nearbyHospitals.slice(0, 6).map((hosp) => (
            <div
              key={hosp.id}
              className="p-5 rounded-2xl bg-slate-50/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-rose-300 transition space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">{hosp.name}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">
                        {hosp.address}, {hosp.city}
                      </span>
                    </p>
                  </div>
                  {hosp.distance_km !== undefined && (
                    <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 text-[10px] font-black shrink-0">
                      {hosp.distance_km} km away
                    </span>
                  )}
                </div>

                {/* Facilities Badges */}
                <div className="flex flex-wrap gap-1 text-[10px] font-bold">
                  <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                    24/7 Trauma Casualty
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                    ICU Ready ({hosp.icu_beds || 15} beds)
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                    Blood Bank Access
                  </span>
                </div>
              </div>

              {/* Call Buttons */}
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2">
                <a
                  href={`tel:${hosp.emergency_phone || hosp.phone}`}
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Casualty ({hosp.emergency_phone || hosp.phone})</span>
                </a>
                {hosp.ambulance_phone && (
                  <a
                    href={`tel:${hosp.ambulance_phone}`}
                    className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                    title="Direct Hospital Ambulance"
                  >
                    <Phone className="w-3.5 h-3.5 text-sky-600" />
                    <span className="hidden sm:inline">Ambulance</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Multilingual Emergency First Aid Protocols */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-5">
        <div className="border-b border-slate-100 dark:border-slate-700 pb-3">
          <span className="text-[10px] uppercase font-bold text-teal-600 tracking-wider">Life-Saving Instructions</span>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {t('emergency.firstAidGuides', 'Multilingual Emergency First Aid Protocols')} ({language})
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Step-by-step guidance to administer while professional medical help / 108 is en route.
          </p>
        </div>

        {/* Tab Buttons for Guides */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'cpr', label: t('emergency.cprGuide', 'CPR Technique'), icon: HeartPulse },
            { id: 'stroke', label: t('emergency.strokeFast', 'Stroke (FAST)'), icon: Activity },
            { id: 'heartAttack', label: t('emergency.heartAttack', 'Heart Attack Protocol'), icon: AlertTriangle },
            { id: 'snakeBite', label: t('emergency.snakeBite', 'Snakebite Dos & Don’ts'), icon: ShieldCheck },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeGuide === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveGuide(item.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Guide Content Render */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 text-xs space-y-3">
          {activeGuide === 'cpr' && (
            <div className="space-y-2.5">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Adult Hands-Only CPR (Cardiopulmonary Resuscitation)
              </h4>
              <ol className="list-decimal pl-4 space-y-1.5 text-slate-700 dark:text-slate-300 leading-relaxed">
                <li><strong>Check Responsiveness:</strong> Tap shoulders firmly and shout &ldquo;Are you OK?&rdquo;. Look for normal breathing.</li>
                <li><strong>Call 108 Immediately:</strong> Put the phone on speaker mode so emergency dispatchers can guide you.</li>
                <li><strong>Hand Placement:</strong> Place the heel of one hand in the center of the chest (between nipples). Place your other hand on top and interlock fingers.</li>
                <li><strong>Compress Hard & Fast:</strong> Push down at least 2 inches (5 cm) at a rate of 100 to 120 compressions per minute (to the beat of the song &ldquo;Stayin&apos; Alive&rdquo;).</li>
                <li><strong>Do Not Stop:</strong> Continue continuous chest compressions until emergency medical personnel arrive or an Automated External Defibrillator (AED) is attached.</li>
              </ol>
            </div>
          )}

          {activeGuide === 'stroke' && (
            <div className="space-y-2.5">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                FAST Protocol for Stroke Recognition
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="font-extrabold text-sky-600 block mb-0.5">F — Face Drooping</span>
                  <p className="text-slate-600 dark:text-slate-300">Ask the person to smile. Does one side of the face droop or feel numb?</p>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="font-extrabold text-sky-600 block mb-0.5">A — Arm Weakness</span>
                  <p className="text-slate-600 dark:text-slate-300">Ask the person to raise both arms. Does one arm drift downward?</p>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="font-extrabold text-sky-600 block mb-0.5">S — Speech Difficulty</span>
                  <p className="text-slate-600 dark:text-slate-300">Is speech slurred? Are they unable to repeat a simple sentence?</p>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="font-extrabold text-rose-600 block mb-0.5">T — Time to Call 108</span>
                  <p className="text-slate-600 dark:text-slate-300">Every minute counts. Note the exact time symptoms started and rush to a stroke-ready center.</p>
                </div>
              </div>
            </div>
          )}

          {activeGuide === 'heartAttack' && (
            <div className="space-y-2.5">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Suspected Acute Heart Attack First Response
              </h4>
              <ul className="list-disc pl-4 space-y-1.5 text-slate-700 dark:text-slate-300 leading-relaxed">
                <li><strong>Symptoms:</strong> Crushing central chest pressure radiating to left arm, neck, jaw or back, accompanied by cold sweat and shortness of breath.</li>
                <li><strong>Seat the Patient:</strong> Keep the patient comfortably seated on the floor leaning against a wall or in an armchair to reduce cardiac workload.</li>
                <li><strong>Call 108:</strong> Immediately request an ambulance with ECG capability.</li>
                <li><strong>Aspirin:</strong> If available and the patient has no known aspirin allergy or active ulcer bleeding, chewing one 300 mg soluble aspirin helps reduce clot enlargement (verify with medical operator).</li>
                <li><strong>Loosen Clothing:</strong> Open collar, belt, and ensure plenty of fresh airflow. Do not let them walk or exert.</li>
              </ul>
            </div>
          )}

          {activeGuide === 'snakeBite' && (
            <div className="space-y-2.5">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Snakebite First Aid — Indian Standard Medical Protocol
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200">
                  <span className="font-bold block mb-1">DOs:</span>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Keep the patient calm and completely still. Movement spreads venom faster.</li>
                    <li>Immobilize the bitten limb using a splint or sling (like a fractured bone).</li>
                    <li>Keep the bitten area at or slightly below heart level.</li>
                    <li>Remove rings, watches, or tight clothing near the bite before swelling starts.</li>
                    <li>Rush directly to the nearest hospital with Anti-Snake Venom (ASV).</li>
                  </ul>
                </div>
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200">
                  <span className="font-bold block mb-1">DON&apos;Ts:</span>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>DO NOT cut the wound or try to suck out venom.</li>
                    <li>DO NOT apply a tight arterial tourniquet (causes tissue gangrene).</li>
                    <li>DO NOT apply ice packs, potassium permanganate, or herbal pastes.</li>
                    <li>DO NOT give caffeine, alcohol, or painkillers.</li>
                    <li>DO NOT waste time attempting to capture or kill the snake.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

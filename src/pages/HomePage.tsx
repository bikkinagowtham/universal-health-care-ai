import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Sparkles,
  ShieldCheck,
  Calendar,
  Building2,
  Clock,
  ArrowRight,
  PhoneCall,
  CheckCircle2,
  HeartPulse,
  Award,
  Users,
  Compass,
  Bed,
  Pill,
  FileText,
} from 'lucide-react';
import { Doctor, Hospital } from '../types';
import { VerificationBadge } from '../components/common/VerificationBadge';
import { SupportedLanguage } from '../hooks/useSpeech';
import { LocationPicker } from '../components/common/LocationPicker';
import { useTranslation } from '../i18n/LanguageContext';

interface Props {
  doctors: Doctor[];
  hospitals: Hospital[];
  onNavigate: (tab: string, filter?: any) => void;
  onBookDoctor: (doctor: Doctor) => void;
  language: SupportedLanguage;
}

export const HomePage: React.FC<Props> = ({
  doctors,
  hospitals,
  onNavigate,
  onBookDoctor,
  language,
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedCity, setSelectedCity] = useState('ALL');

  const verifiedDoctors = doctors.filter(d => d.verification_status === 'VERIFIED');
  const verifiedHospitals = hospitals.filter(h => h.verification_status === 'VERIFIED');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('doctors', {
      search: searchQuery,
      city: selectedCity !== 'ALL' ? selectedCity : undefined,
      state: selectedState !== 'ALL' ? selectedState : undefined,
    });
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* HERO SECTION */}
      <section className="relative pt-6 sm:pt-12 pb-16 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-br from-sky-100/60 via-teal-100/40 to-transparent dark:from-sky-950/20 dark:via-teal-950/10 pointer-events-none rounded-3xl blur-3xl -z-10" />

        <div className="max-w-5xl mx-auto text-center px-4">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-6 shadow-xs animate-fade-in">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>State Medical Council Verified Directory • India Launch Phase 1</span>
          </div>

          {/* Master Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]">
            Healthcare for Everyone,{' '}
            <span className="bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
              Everywhere.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Discover verified healthcare providers, book appointments, and access trusted healthcare services through one intelligent platform.
          </p>

          {/* Unified Search Engine Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-10 p-2.5 sm:p-3 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-700 max-w-4xl mx-auto flex flex-col md:flex-row items-stretch md:items-center gap-2"
          >
            {/* Query Input */}
            <div className="flex-1 flex items-center gap-3 px-4 py-2">
              <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Doctor name, specialization (e.g. Cardiology), or hospital..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden font-medium"
              />
            </div>

            <div className="hidden md:block h-8 w-px bg-slate-200 dark:bg-slate-700" />

            {/* Pan-India Location Picker */}
            <div className="w-full md:w-64 px-1 py-1">
              <LocationPicker
                selectedState={selectedState}
                selectedCity={selectedCity}
                onChange={(s, c) => {
                  setSelectedState(s);
                  setSelectedCity(c);
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="rounded-xl sm:rounded-2xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold px-6 py-3.5 text-sm sm:text-base shadow-md shadow-sky-600/20 flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer flex-shrink-0"
            >
              <span>Search Providers</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Specialization Tags */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span className="text-slate-400 font-normal">Popular searches:</span>
            {[
              { name: 'Cardiology (Heart)', spec: 'Cardiology' },
              { name: 'Pediatrics (Child)', spec: 'Pediatrics' },
              { name: 'Neurology (Brain & Spine)', spec: 'Neurology' },
              { name: 'Orthopedics (Bones)', spec: 'Orthopedics' },
              { name: 'General Medicine', spec: 'General Medicine' },
            ].map((tag) => (
              <button
                key={tag.spec}
                type="button"
                onClick={() => onNavigate('doctors', { specialization: tag.spec })}
                className="px-3 py-1 rounded-full bg-slate-100 hover:bg-sky-100 dark:bg-slate-800 dark:hover:bg-slate-700 hover:text-sky-700 dark:hover:text-sky-300 transition cursor-pointer"
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        {/* Live Key Metrics Banner */}
        <div className="max-w-6xl mx-auto mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-black text-slate-900 dark:text-white">100%</div>
              <div className="text-xs text-slate-500 font-medium">Council Verified Doctors</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-black text-slate-900 dark:text-white">{verifiedHospitals.length} Hospitals</div>
              <div className="text-xs text-slate-500 font-medium">24x7 Emergency Units</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-black text-slate-900 dark:text-white">Live OPD</div>
              <div className="text-xs text-slate-500 font-medium">Digital Queue Tokens</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-black text-slate-900 dark:text-white">Multilingual</div>
              <div className="text-xs text-slate-500 font-medium">Telugu • Hindi • English</div>
            </div>
          </div>
        </div>
      </section>

      {/* MULTILINGUAL AI VOICE ASSISTANT TEASER BANNER */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-sky-950 to-teal-950 text-white p-6 sm:p-10 shadow-2xl border border-sky-900/50">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Multilingual AI Voice Health Assistant</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Speak or Type in Telugu, Hindi, or English
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Need a cardiologist in Vijayawada or want to check hospital queue status? Ask our voice assistant. Powered by Gemini with grounded verified directory checks.
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2 text-xs text-slate-400">
                <span className="bg-white/10 px-2.5 py-1 rounded-lg font-mono">
                  &ldquo;I need a heart specialist near Vijayawada&rdquo;
                </span>
                <span className="bg-white/10 px-2.5 py-1 rounded-lg font-mono">
                  &ldquo;విజయవాడలో గుండె డాక్టర్&rdquo;
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('ai-assistant')}
              className="flex-shrink-0 px-6 py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/30 flex items-center gap-2.5 transition active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Launch Voice Assistant</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 5 ADVANCED HEALTH MODULES SHOWCASE */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              <Sparkles className="w-4 h-4" /> Comprehensive Patient Intelligence
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Advanced Clinical Care & Emergency Services
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Integrated real-time tools for reports, live bed counts, immediate trauma dispatch, dose streaks, and family profiles.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Module 1: AI Medical Report Explainer */}
          <div
            onClick={() => onNavigate('report-explainer')}
            className="group cursor-pointer rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-xs hover:shadow-xl hover:border-sky-300 dark:hover:border-sky-700 transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-105 transition">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500 text-white uppercase tracking-wider">
                  AI Powered
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition">
                AI Medical Report Explainer
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Upload PDF, JPG, or PNG lab reports (CBC, Lipid, HbA1c). Get simplified Telugu, English, or Hindi explanations, lab reference ranges, and questions for your doctor.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-sky-600 dark:text-sky-400">
              <span>Explain My Report</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Module 2: Live Bed Availability */}
          <div
            onClick={() => onNavigate('bed-availability')}
            className="group cursor-pointer rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-xs hover:shadow-xl hover:border-emerald-300 dark:hover:border-emerald-700 transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition">
                  <Bed className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  <span>Live Counts</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                Live Hospital Bed Availability
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Verified general ward, ICU, emergency, and ventilator availability across regional hospitals. 10-second automatic polling and hospital staff updates.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>Check Bed Status</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Module 3: 24/7 Emergency Coordination */}
          <div
            onClick={() => onNavigate('emergency')}
            className="group cursor-pointer rounded-3xl bg-gradient-to-br from-rose-50/50 via-white to-rose-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border border-rose-200/70 dark:border-rose-900/40 p-6 shadow-xs hover:shadow-xl hover:border-rose-300 transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-105 transition">
                  <PhoneCall className="w-6 h-6 animate-pulse" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white uppercase tracking-wider">
                  Instant 108 / 112
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-rose-600 transition">
                Emergency Assistance & SOS
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                One-tap 108/112/102 dispatch, GPS emergency location sharing via WhatsApp, nearest trauma centers sorted by km, and multilingual CPR & FAST protocols.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-rose-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-rose-600">
              <span>Emergency SOS Tools</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Module 4: Smart Medicine Reminder */}
          <div
            onClick={() => onNavigate('medicine-reminder')}
            className="group cursor-pointer rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-xs hover:shadow-xl hover:border-amber-300 dark:hover:border-amber-700 transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition">
                  <Pill className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white uppercase tracking-wider">
                  Dose Tracker
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                Smart Medicine Reminders
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Set Morning, Afternoon, Evening, and Night doses with meal directions. Track daily adherence streaks, stock count depletion, and automated refill warnings.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400">
              <span>Track Prescriptions</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Module 5: Family Health Profiles */}
          <div
            onClick={() => onNavigate('family-profiles')}
            className="group cursor-pointer rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-xs hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-700 transition flex flex-col justify-between sm:col-span-2 lg:col-span-2"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-105 transition">
                  <Users className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-600 text-white uppercase tracking-wider">
                  DPDP Act Compliant
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
                Family Health Profiles & Caregiver Consent
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Manage distinct health records, appointments, chronic conditions, and allergy rosters for yourself, your spouse, children, and elderly parents. Complete DPDP Act caregiver authorization controls with Full Guardian, View-Only, or Emergency-Only consent levels.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400">
              <span>Open Family Health Vault</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>
      </section>

      {/* QUICK DISCOVERY: SYMPTOMS FINDER & CLINICAL SPECIALTIES */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Symptom & Concern Finder */}
          <div className="rounded-3xl bg-gradient-to-br from-rose-50 via-white to-orange-50/40 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border border-rose-200/60 dark:border-rose-900/40 p-6 sm:p-8 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 text-xs font-bold border border-rose-200 dark:border-rose-800">
                <HeartPulse className="w-3.5 h-3.5" />
                <span>Find by Health Concern</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                Find the Right Hospital for Your Condition
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Unsure which department or hospital to visit? Select common concerns like High Fever, Chest Pain, Pediatric illness, or Joint pain to instantly find equipped hospitals and verified specialists.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['High Fever', 'Chest Pain', 'Child Cough', 'Knee Pain', 'Headache'].map(tag => (
                  <span key={tag} className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-rose-100 dark:border-slate-700/60 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Emergency 108/112 advisory included</span>
              <button
                onClick={() => onNavigate('symptoms')}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <span>Find by Symptoms</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: 26+ Clinical Specialties Directory */}
          <div className="rounded-3xl bg-gradient-to-br from-sky-50 via-white to-teal-50/40 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border border-sky-200/60 dark:border-sky-900/40 p-6 sm:p-8 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 text-xs font-bold border border-sky-200 dark:border-sky-800">
                <Building2 className="w-3.5 h-3.5" />
                <span>26+ Medical Disciplines</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                Clinical Specialization Directory
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Explore comprehensive clinical descriptions, treated symptoms, and diagnostic scopes across Cardiology, Neurology, Pediatrics, Orthopedics, Oncology, and more.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['Cardiology', 'Pediatrics', 'Neurology', 'Orthopedics', 'Gastroenterology'].map(spec => (
                  <span key={spec} className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-sky-100 dark:border-slate-700/60 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">1-click Hospital & Doctor lookup</span>
              <button
                onClick={() => onNavigate('specialties')}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <span>Browse Specialties</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED VERIFIED DOCTORS */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              <ShieldCheck className="w-4 h-4" /> Real Verified Providers
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Featured Verified Specialists
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Active medical registration numbers verified against State Medical Councils.
            </p>
          </div>

          <button
            onClick={() => onNavigate('doctors')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 group cursor-pointer"
          >
            <span>View All Verified Doctors</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {verifiedDoctors.slice(0, 3).map((doctor) => (
            <div
              key={doctor.id}
              className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-teal-600 text-white font-bold text-xl flex items-center justify-center shadow-md shadow-sky-500/20 flex-shrink-0">
                    {doctor.name.split(' ')[1]?.[0] || 'D'}
                  </div>
                  <VerificationBadge status={doctor.verification_status} lastVerifiedDate={doctor.last_verified_at} size="sm" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {doctor.name}
                  </h3>
                  <p className="text-xs font-semibold text-teal-700 dark:text-teal-400 mt-0.5">
                    {doctor.specialization} • {doctor.experience_years} Years Experience
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                    Council Reg: {doctor.medical_registration_number}
                  </p>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{doctor.hospital_name || doctor.clinic_address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{doctor.city}, {doctor.state}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{doctor.consultation_timings}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Consultation Fee</div>
                  <div className="text-lg font-extrabold text-slate-900 dark:text-white">
                    ₹{doctor.consultation_fee}
                  </div>
                </div>

                <button
                  onClick={() => onBookDoctor(doctor)}
                  className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
                >
                  Book Slot
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED HOSPITALS */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              <Building2 className="w-4 h-4" /> Multi-Specialty Network
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Featured Hospitals
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Equipped with 24x7 Emergency Units, Cath Labs, and verified operating hours.
            </p>
          </div>

          <button
            onClick={() => onNavigate('hospitals')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 group cursor-pointer"
          >
            <span>View All Hospitals</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {verifiedHospitals.slice(0, 2).map((hospital) => (
            <div
              key={hospital.id}
              className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {hospital.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{hospital.address}, {hospital.city}</span>
                  </div>
                </div>
                <VerificationBadge status={hospital.verification_status} size="sm" />
              </div>

              {/* Emergency indicator */}
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center justify-between text-xs">
                <span className="font-semibold text-rose-800 dark:text-rose-300 flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-rose-600 animate-pulse" />
                  24x7 Emergency Line:
                </span>
                <span className="font-bold font-mono text-rose-700 dark:text-rose-300">
                  {hospital.emergency_phone}
                </span>
              </div>

              {/* Departments */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Specialty Departments
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {hospital.departments.map((dep) => (
                    <span
                      key={dep}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium"
                    >
                      {dep}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  OPD Consultation from <strong>₹{hospital.consultation_fee_min}</strong>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate('queue', { hospitalId: hospital.id })}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 text-xs font-bold transition cursor-pointer"
                  >
                    Track OPD Queue
                  </button>
                  <button
                    onClick={() => onNavigate('hospitals', { search: hospital.name })}
                    className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition cursor-pointer"
                  >
                    View Map & Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            How Universal Health Care AI Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            A reliable end-to-end healthcare workflow with verified information and zero simulated booking.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Search & Verify',
              desc: 'Find verified doctors and hospitals by council registration, city, and specialization.',
              icon: Search,
            },
            {
              step: '02',
              title: 'Atomic Slot Reservation',
              desc: 'Select guaranteed available doctor time slots protected against double-booking.',
              icon: Calendar,
            },
            {
              step: '03',
              title: 'Digital OPD Queue',
              desc: 'Receive live token estimates to avoid waiting in crowded hospital waiting rooms.',
              icon: Clock,
            },
            {
              step: '04',
              title: 'Encrypted Records',
              desc: 'Safely organize prescriptions and diagnostic reports under strict DPDP consent.',
              icon: ShieldCheck,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs relative"
              >
                <div className="text-3xl font-black text-slate-200 dark:text-slate-700 mb-3">
                  {item.step}
                </div>
                <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* TRUST & SAFETY COMPLIANCE BANNER */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero Fake Data Policy & Healthcare Security</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Built with Healthcare Ethics & Digital Data Protection
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Universal Health Care AI strictly complies with the Indian Digital Personal Data Protection (DPDP) Act. We never invent fake reviews, fake statistics, or doctor profiles. Registered doctors undergo council credential verification before receiving the verified seal.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>0% Commission on Doctor Consultation Fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Atomic Database Slot Reservation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>State Medical Council Verification Audit</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Private Health Document Encryption</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3 text-center">
              <Award className="w-10 h-10 text-teal-400 mx-auto" />
              <div className="text-base font-bold text-white">Healthcare Provider?</div>
              <p className="text-xs text-slate-400">
                Join our verified network in Andhra Pradesh, Telangana, Karnataka, or register your clinic.
              </p>
              <button
                onClick={() => onNavigate('admin')}
                className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition cursor-pointer"
              >
                Provider Registration Portal
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

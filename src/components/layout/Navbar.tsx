import React, { useState } from 'react';
import {
  Activity,
  Search,
  Building2,
  Calendar,
  Sparkles,
  Clock,
  FileText,
  DollarSign,
  ShieldAlert,
  User,
  Globe,
  Menu,
  X,
  PhoneCall,
  Check,
  HeartPulse,
  Stethoscope,
  Bed,
  Pill,
  Users,
  ChevronDown,
} from 'lucide-react';
import { UserRole } from '../../types';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { SupportedLanguage } from '../../hooks/useSpeech';
import { useTranslation } from '../../i18n/LanguageContext';

interface Props {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  onOpenAuth: () => void;
  userName?: string;
}

export const Navbar: React.FC<Props> = ({
  currentTab,
  setCurrentTab,
  userRole,
  setUserRole,
  language,
  setLanguage,
  onOpenAuth,
  userName = 'Gowtham Bikkina',
}) => {
  const { t, setLanguage: setGlobalLang } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [moreToolsOpen, setMoreToolsOpen] = useState(false);

  const handleSelectLanguage = (lang: SupportedLanguage) => {
    setLanguage(lang);
    setGlobalLang(lang);
    setLangMenuOpen(false);
  };

  // Primary visible items on desktop
  const primaryNavItems = [
    { id: 'home', label: t('nav.home'), icon: Activity },
    { id: 'doctors', label: t('nav.doctors'), icon: Search },
    { id: 'hospitals', label: t('nav.hospitals'), icon: Building2 },
    { id: 'appointments', label: t('nav.appointments'), icon: Calendar },
    { id: 'emergency', label: t('nav.emergency'), icon: PhoneCall, badge: '24/7', badgeColor: 'bg-rose-500' },
    { id: 'bed-availability', label: t('nav.bedAvailability'), icon: Bed, badge: 'Live', badgeColor: 'bg-emerald-500' },
    { id: 'report-explainer', label: t('nav.reportExplainer'), icon: FileText, badge: 'AI', badgeColor: 'bg-sky-500' },
    { id: 'ai-assistant', label: t('nav.assistant'), icon: Sparkles, badge: 'Voice', badgeColor: 'bg-teal-500' },
  ];

  // Secondary tools available in the dropdown
  const secondaryNavItems = [
    { id: 'medicine-reminder', label: t('nav.medicineReminder'), icon: Pill, desc: 'Dose schedules & refill alarms' },
    { id: 'family-profiles', label: t('nav.familyProfiles'), icon: Users, desc: 'DPDP consent & family dossiers' },
    { id: 'symptoms', label: t('nav.symptomFinder'), icon: HeartPulse, desc: 'Condition & symptom matcher' },
    { id: 'specialties', label: t('nav.specialties'), icon: Stethoscope, desc: '26+ medical disciplines' },
    { id: 'queue', label: t('nav.queue'), icon: Clock, desc: 'Live hospital OPD token status' },
    { id: 'revenue', label: t('nav.revenue'), icon: DollarSign, desc: 'Doctor payouts & clinic finance' },
    { id: 'admin', label: t('nav.admin'), icon: ShieldAlert, desc: 'Council credentials & audits' },
  ];

  // All items for mobile drawer
  const allNavItems = [...primaryNavItems, ...secondaryNavItems];

  const roleLabels: Record<UserRole, { title: string; color: string; badge: string }> = {
    patient: { title: 'Patient View', color: 'bg-sky-100 text-sky-800 border-sky-300', badge: 'Patient' },
    doctor: { title: 'Doctor View', color: 'bg-teal-100 text-teal-800 border-teal-300', badge: 'Doctor' },
    hospital_admin: { title: 'Hospital Admin', color: 'bg-indigo-100 text-indigo-800 border-indigo-300', badge: 'Hospital' },
    platform_admin: { title: 'Platform Admin', color: 'bg-purple-100 text-purple-800 border-purple-300', badge: 'SuperAdmin' },
    admin: { title: 'Platform Admin', color: 'bg-purple-100 text-purple-800 border-purple-300', badge: 'SuperAdmin' },
  };

  const languages: Array<{ code: SupportedLanguage; label: string; native: string }> = [
    { code: 'English', label: 'English', native: 'English' },
    { code: 'Telugu', label: 'Telugu', native: 'తెలుగు' },
    { code: 'Hindi', label: 'Hindi', native: 'हिंदी' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Emergency Strip */}
      <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-rose-600 text-white text-[11px] sm:text-xs font-semibold py-1 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
          <span>Medical Emergency Helpline:</span>
          <span className="bg-white/20 px-2 py-0.5 rounded font-bold">Dial 108 (Ambulance)</span>
          <span className="bg-white/20 px-2 py-0.5 rounded font-bold hidden xs:inline">112 (National Emergency)</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[11px] opacity-90">
          <span>Non-emergency medical consultation & verified directory platform</span>
          <span className="font-mono">DPDP Act Compliant</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-sky-600 via-teal-600 to-emerald-600 p-0.5 shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Activity className="w-6 h-6 text-teal-600" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
                  UNIVERSAL HEALTH
                </span>
                <span className="text-xs font-extrabold uppercase px-1.5 py-0.2 rounded bg-gradient-to-r from-sky-600 to-teal-600 text-white tracking-widest">
                  AI
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 -mt-0.5 tracking-tight">
                Healthcare for Everyone, Everywhere.
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`ml-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded-full text-white ${item.badgeColor || 'bg-teal-500'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* More Tools Dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreToolsOpen(!moreToolsOpen)}
                className={`relative flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  secondaryNavItems.some(i => i.id === currentTab)
                    ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>More Care Tools</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {moreToolsOpen && (
                <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-fade-in">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                    Clinical & Patient Tools
                  </div>
                  {secondaryNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setCurrentTab(item.id);
                          setMoreToolsOpen(false);
                        }}
                        className={`w-full px-3 py-2.5 text-left text-xs font-medium flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer ${
                          isActive ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300' : 'text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-600 dark:text-slate-300">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white leading-tight">{item.label}</div>
                          <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{item.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Actions & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* PWA Install Button */}
            <PWAInstallButton />

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                title="Change Language"
              >
                <Globe className="w-3.5 h-3.5 text-teal-600" />
                <span className="hidden sm:inline">{languages.find(l => l.code === language)?.native || language}</span>
                <span className="sm:hidden">{language.slice(0, 2).toUpperCase()}</span>
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 py-1 z-50 animate-fade-in">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                    Language / భాష / भाषा
                  </div>
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => handleSelectLanguage(l.code)}
                      className="w-full px-3 py-2 text-left text-xs font-medium flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <div>
                        <span className="font-semibold text-slate-800 dark:text-slate-100">{l.native}</span>
                        <span className="text-[10px] text-slate-400 ml-1.5">({l.label})</span>
                      </div>
                      {language === l.code && <Check className="w-3.5 h-3.5 text-teal-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Role Demo Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold shadow-xs cursor-pointer ${roleLabels[userRole].color}`}
                title="Switch Role Perspective"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{roleLabels[userRole].badge}</span>
                <span className="text-[10px] opacity-75">▾</span>
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 py-1 z-50 animate-fade-in">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                    Active Role Perspective
                  </div>
                  {(['patient', 'doctor', 'hospital_admin', 'platform_admin'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setUserRole(r);
                        setRoleMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-xs font-medium flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {roleLabels[r].title}
                      </span>
                      {userRole === r && <Check className="w-3.5 h-3.5 text-sky-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Profile / Auth Button */}
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-3.5 py-2 text-xs font-bold hover:bg-slate-800 transition shadow-xs cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{userName ? userName.split(' ')[0] : 'Sign In'}</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 max-h-[80vh] overflow-y-auto space-y-3">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-3">
              Primary Care
            </div>
            <div className="space-y-1">
              {primaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                      isActive
                        ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-5 h-5 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${item.badgeColor || 'bg-teal-500'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-3">
              Advanced Clinical & Family Tools
            </div>
            <div className="space-y-1">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                      isActive
                        ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-5 h-5 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                      <div className="text-left">
                        <div>{item.label}</div>
                        <div className="text-[11px] font-normal text-slate-400">{item.desc}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

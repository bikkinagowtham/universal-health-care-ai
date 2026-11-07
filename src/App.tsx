import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { FindDoctorsPage } from './pages/FindDoctorsPage';
import { HospitalsPage } from './pages/HospitalsPage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { VoiceAssistantPage } from './pages/VoiceAssistantPage';
import { QueuePage } from './pages/QueuePage';
import { MedicalRecordsPage } from './pages/MedicalRecordsPage';
import { RevenueDashboardPage } from './pages/RevenueDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { SymptomHospitalFinderPage } from './pages/SymptomHospitalFinderPage';
import { SpecializationsPage } from './pages/SpecializationsPage';
import { ReportExplainerPage } from './pages/ReportExplainerPage';
import { MedicalReportAnalyzerPage } from './pages/MedicalReportAnalyzerPage';
import { BedAvailabilityPage } from './pages/BedAvailabilityPage';
import { EmergencyPage } from './pages/EmergencyPage';
import { MedicineReminderPage } from './pages/MedicineReminderPage';
import { FamilyProfilesPage } from './pages/FamilyProfilesPage';
import { AuthModal } from './components/common/AuthModal';
import { FamilyModal } from './components/common/FamilyModal';
import { FloatingAIAssistant } from './components/common/FloatingAIAssistant';
import { LanguageProvider } from './i18n/LanguageContext';
import { Doctor, Hospital, Appointment, MedicalRecord, FamilyMember, UserRole, ServerStatus } from './types';
import { SupportedLanguage } from './hooks/useSpeech';
import { api } from './services/api';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [userRole, setUserRole] = useState<UserRole>('patient');
  const [language, setLanguage] = useState<SupportedLanguage>('English');
  const [userName, setUserName] = useState<string>('Gowtham Bikkina');

  // Application Data States
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);

  // Modals & Navigation Passing
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [familyModalOpen, setFamilyModalOpen] = useState(false);
  const [doctorFilters, setDoctorFilters] = useState<any>(undefined);
  const [hospitalFilters, setHospitalFilters] = useState<{ search?: string; department?: string } | undefined>(undefined);
  const [queueHospitalId, setQueueHospitalId] = useState<string | undefined>(undefined);
  const [prefillMedicine, setPrefillMedicine] = useState<any>(undefined);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  // Initial Family Members
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    {
      id: 'fam-1',
      name: 'Radhika Bikkina',
      relation: 'Spouse',
      age: 32,
      gender: 'Female',
      bloodGroup: 'B+',
      consent_granted: true,
    },
    {
      id: 'fam-2',
      name: 'Aarav Bikkina',
      relation: 'Child',
      age: 5,
      gender: 'Male',
      bloodGroup: 'O+',
      allergies: 'Peanuts',
      consent_granted: true,
    },
  ]);

  // Online / Offline connectivity listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadData = async () => {
    try {
      const [docs, hosps, apts, recs, status, fams] = await Promise.allSettled([
        api.getDoctors(),
        api.getHospitals(),
        api.getAppointments(),
        api.getMedicalRecords(),
        api.getStatus(),
        api.getFamilyMembers(),
      ]);

      if (docs.status === 'fulfilled') setDoctors(docs.value);
      if (hosps.status === 'fulfilled') setHospitals(hosps.value);
      if (apts.status === 'fulfilled') setAppointments(apts.value);
      if (recs.status === 'fulfilled') setMedicalRecords(recs.value);
      if (status.status === 'fulfilled') setServerStatus(status.value);
      if (fams.status === 'fulfilled' && fams.value.length > 0) setFamilyMembers(fams.value);
    } catch (err) {
      console.error('Error loading initial app data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Navigation History Stack for Back/Home/Dashboard buttons
  const [navHistory, setNavHistory] = useState<string[]>(['home']);

  const handleNavigate = (tab: string, filter?: any) => {
    if (tab === 'doctors' && filter) {
      setDoctorFilters(filter);
    }
    if (tab === 'hospitals' && filter) {
      setHospitalFilters(filter);
    }
    if (tab === 'queue' && filter?.hospitalId) {
      setQueueHospitalId(filter.hospitalId);
    }
    if (tab === 'medicine-reminder' && filter?.prefillMedicine) {
      setPrefillMedicine(filter.prefillMedicine);
    }
    setNavHistory(prev => (prev[prev.length - 1] === tab ? prev : [...prev, tab]));
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setNavHistory(prev => {
      if (prev.length <= 1) {
        setCurrentTab('home');
        return ['home'];
      }
      const newHistory = [...prev];
      newHistory.pop(); // remove current tab
      const previousTab = newHistory[newHistory.length - 1] || 'home';
      setCurrentTab(previousTab);
      return newHistory;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHome = () => {
    setNavHistory(prev => [...prev, 'home']);
    setCurrentTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDashboard = () => {
    const dashTab = (userRole === 'admin' || userRole === 'platform_admin') ? 'admin' : userRole === 'doctor' ? 'revenue' : 'appointments';
    handleNavigate(dashTab);
  };

  const handleBookDoctor = (doc: Doctor) => {
    setBookingDoctor(doc);
    handleNavigate('appointments');
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
        {/* Offline Connectivity Indicator */}
        {!isOnline && (
          <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-500 text-white px-3.5 py-2 text-xs font-bold shadow-lg animate-fade-in">
            <span className="h-2.5 w-2.5 rounded-full bg-white animate-ping" />
            <span>Offline Mode — Cached healthcare data is being used.</span>
          </div>
        )}

        {/* Primary Navigation Bar */}
        <Navbar
          currentTab={currentTab}
          setCurrentTab={(tab) => handleNavigate(tab)}
          userRole={userRole}
          setUserRole={setUserRole}
          language={language}
          setLanguage={setLanguage}
          onOpenAuth={() => setAuthModalOpen(true)}
          userName={userName}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {currentTab === 'home' && (
            <HomePage
              doctors={doctors}
              hospitals={hospitals}
              onNavigate={handleNavigate}
              onBookDoctor={handleBookDoctor}
              language={language}
            />
          )}

          {currentTab === 'doctors' && (
            <FindDoctorsPage
              doctors={doctors}
              initialFilters={doctorFilters}
              onBookDoctor={handleBookDoctor}
              onBack={handleBack}
              onHome={handleHome}
              onDashboard={handleDashboard}
              userRole={userRole}
            />
          )}

          {currentTab === 'hospitals' && (
            <HospitalsPage
              hospitals={hospitals}
              initialSearchQuery={hospitalFilters?.search || ''}
              initialDepartment={hospitalFilters?.department || 'ALL'}
              onTrackQueue={(hid) => {
                setQueueHospitalId(hid);
                handleNavigate('queue', { hospitalId: hid });
              }}
              onSelectDoctorSearch={(hospName) => {
                handleNavigate('doctors', { search: hospName });
              }}
              onBookDoctor={handleBookDoctor}
              onBookHospital={(hosp) => {
                handleNavigate('doctors', { search: hosp.name });
              }}
              onBack={handleBack}
              onHome={handleHome}
              onDashboard={handleDashboard}
              userRole={userRole}
            />
          )}

          {currentTab === 'symptoms' && (
            <SymptomHospitalFinderPage
              onBookDoctor={handleBookDoctor}
              onBookHospital={(hosp) => {
                setHospitalFilters({ search: hosp.name, department: 'ALL' });
                handleNavigate('hospitals');
              }}
              onTrackQueue={(hid) => {
                setQueueHospitalId(hid);
                handleNavigate('queue', { hospitalId: hid });
              }}
            />
          )}

          {currentTab === 'specialties' && (
            <SpecializationsPage
              onSelectSpecialtyForHospitals={(dep) => {
                setHospitalFilters({ department: dep, search: '' });
                handleNavigate('hospitals');
              }}
              onSelectSpecialtyForDoctors={(spec) => {
                setDoctorFilters({ specialization: spec });
                handleNavigate('doctors');
              }}
            />
          )}

          {currentTab === 'appointments' && (
            <AppointmentsPage
              appointments={appointments}
              doctors={doctors}
              hospitals={hospitals}
              familyMembers={familyMembers}
              onRefresh={loadData}
              bookingDoctor={bookingDoctor}
              onCloseBookingModal={() => setBookingDoctor(null)}
              onTrackQueue={(hid) => {
                setQueueHospitalId(hid);
                handleNavigate('queue', { hospitalId: hid });
              }}
              onViewDoctor={(docName) => {
                handleNavigate('doctors', { search: docName });
              }}
              onBack={handleBack}
              onHome={handleHome}
              onDashboard={handleDashboard}
              userRole={userRole}
            />
          )}

          {currentTab === 'ai-assistant' && (
            <VoiceAssistantPage
              language={language}
              setLanguage={setLanguage}
              onNavigateTab={handleNavigate}
              onBack={handleBack}
              onHome={handleHome}
              onDashboard={handleDashboard}
              userRole={userRole}
            />
          )}

          {currentTab === 'queue' && (
            <QueuePage
              hospitals={hospitals}
              doctors={doctors}
              initialHospitalId={queueHospitalId}
              userRole={userRole}
              onBack={handleBack}
              onHome={handleHome}
              onDashboard={handleDashboard}
            />
          )}

          {currentTab === 'records' && (
            <MedicalRecordsPage
              records={medicalRecords}
              familyMembers={familyMembers}
              onRefresh={loadData}
              onOpenFamilyModal={() => setFamilyModalOpen(true)}
              onBack={handleBack}
              onHome={handleHome}
              onDashboard={handleDashboard}
              userRole={userRole}
            />
          )}

          {currentTab === 'revenue' && (
            <RevenueDashboardPage
              onBack={handleBack}
              onHome={handleHome}
              onDashboard={handleDashboard}
              userRole={userRole}
            />
          )}

          {currentTab === 'admin' && (
            <AdminDashboardPage
              doctors={doctors}
              hospitals={hospitals}
              onRefresh={loadData}
              onBack={handleBack}
              onHome={handleHome}
              onDashboard={handleDashboard}
              userRole={userRole}
            />
          )}

          {(currentTab === 'report-explainer' || currentTab === 'report-analyzer') && (
            <MedicalReportAnalyzerPage
              userRole={userRole}
              familyMembers={familyMembers}
              onBack={handleBack}
              onHome={handleHome}
              onDashboard={handleDashboard}
              onBookDoctor={(doc) => {
                if (doc) handleBookDoctor(doc);
                else handleNavigate('doctors');
              }}
              onNavigateTab={handleNavigate}
            />
          )}

          {currentTab === 'bed-availability' && (
            <BedAvailabilityPage
              hospitals={hospitals}
              userRole={userRole}
              onTrackQueue={(hid) => {
                setQueueHospitalId(hid);
                handleNavigate('queue', { hospitalId: hid });
              }}
              onBookHospital={(hosp) => {
                handleNavigate('doctors', { search: hosp.name });
              }}
              onBack={handleBack}
              onHome={handleHome}
              onDashboard={handleDashboard}
            />
          )}

          {currentTab === 'emergency' && (
            <EmergencyPage
              hospitals={hospitals}
              userRole={userRole}
              onBack={handleBack}
              onHome={handleHome}
              onDashboard={handleDashboard}
            />
          )}

          {currentTab === 'medicine-reminder' && (
            <MedicineReminderPage
              userRole={userRole}
              familyMembers={familyMembers}
              initialPrefillMedicine={prefillMedicine}
              onBack={handleBack}
              onHome={handleHome}
              onDashboard={handleDashboard}
            />
          )}

          {currentTab === 'family-profiles' && (
            <FamilyProfilesPage
              userRole={userRole}
              familyMembers={familyMembers}
              appointments={appointments}
              medicalRecords={medicalRecords}
              onRefresh={loadData}
              onNavigateTab={handleNavigate}
              onBack={handleBack}
              onHome={handleHome}
              onDashboard={handleDashboard}
            />
          )}
        </main>

        {/* Global Footer */}
        <Footer />

        {/* Authentication & Identity Modal */}
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          userRole={userRole}
          setUserRole={setUserRole}
          onAuthSuccess={(name, role) => {
            setUserName(name);
            setUserRole(role);
          }}
        />

        {/* Family Healthcare Management Modal */}
        <FamilyModal
          isOpen={familyModalOpen}
          onClose={() => setFamilyModalOpen(false)}
          familyMembers={familyMembers}
          onAddMember={(member) => setFamilyMembers(prev => [...prev, member])}
          onRemoveMember={(id) => setFamilyMembers(prev => prev.filter(m => m.id !== id))}
        />

        {/* Floating AI Ask Assistant - Fixed across every page */}
        <FloatingAIAssistant
          currentLanguage={language}
          onNavigateTab={handleNavigate}
        />
      </div>
    </LanguageProvider>
  );
}

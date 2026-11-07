import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  User,
  Heart,
  ShieldCheck,
  Calendar,
  FileText,
  Pill,
  Plus,
  Trash2,
  Edit2,
  AlertCircle,
  Phone,
  CheckCircle2,
  Lock,
  ChevronRight,
  Activity,
  HeartPulse,
  Save,
  X,
  Stethoscope,
  Volume2,
} from 'lucide-react';
import { FamilyMember, Appointment, MedicalRecord, MedicineReminder, UserRole } from '../types';
import { api } from '../services/api';
import { PageHeader } from '../components/common/PageHeader';
import { useTranslation } from '../i18n/LanguageContext';
import { useMedicineVoiceReminder } from '../hooks/useMedicineVoiceReminder';

interface Props {
  userRole: UserRole;
  familyMembers: FamilyMember[];
  appointments: Appointment[];
  medicalRecords: MedicalRecord[];
  onRefresh?: () => void;
  onNavigateTab?: (tab: string, filter?: any) => void;
  onBack?: () => void;
  onHome?: () => void;
  onDashboard?: () => void;
}

export const FamilyProfilesPage: React.FC<Props> = ({
  userRole,
  familyMembers: initialMembers,
  appointments,
  medicalRecords,
  onRefresh,
  onNavigateTab,
  onBack,
  onHome,
  onDashboard,
}) => {
  const { t } = useTranslation();
  const [members, setMembers] = useState<FamilyMember[]>(initialMembers);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('fam-self');
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'records' | 'medicines' | 'consent'>('overview');
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [medicineReminders, setMedicineReminders] = useState<MedicineReminder[]>([]);
  const [loading, setLoading] = useState(false);
  const { speakReminder } = useMedicineVoiceReminder('Telugu');

  // Form State
  const [formData, setFormData] = useState<Partial<FamilyMember>>({
    name: '',
    relation: 'Spouse',
    age: 30,
    gender: 'Female',
    blood_group: 'B+',
    dob: '',
    phone: '+91 98480 00000',
    allergies: 'None reported',
    chronic_conditions: [],
    ongoing_medications: [],
    consent_level: 'Full Guardian Access',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [mems, meds] = await Promise.all([
        api.getFamilyMembers(),
        api.getMedicineReminders(),
      ]);
      setMembers(mems);
      setMedicineReminders(meds);
      if (mems.length > 0 && !mems.some((m) => m.id === selectedMemberId)) {
        setSelectedMemberId(mems[0].id);
      }
    } catch (err) {
      console.error('Error loading family profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const activeMember = useMemo(() => {
    return members.find((m) => m.id === selectedMemberId) || members[0];
  }, [members, selectedMemberId]);

  // Appointments for this specific family member
  const memberAppointments = useMemo(() => {
    if (!activeMember) return [];
    return appointments.filter(
      (a) =>
        a.family_member_name?.toLowerCase() === activeMember.name.toLowerCase() ||
        a.patient_name.toLowerCase() === activeMember.name.toLowerCase()
    );
  }, [appointments, activeMember]);

  // Records for this specific family member
  const memberRecords = useMemo(() => {
    if (!activeMember) return [];
    return medicalRecords.filter(
      (r) =>
        r.family_member_name?.toLowerCase() === activeMember.name.toLowerCase() ||
        r.patient_name.toLowerCase() === activeMember.name.toLowerCase()
    );
  }, [medicalRecords, activeMember]);

  // Medicines for this specific family member
  const memberMedicines = useMemo(() => {
    if (!activeMember) return [];
    return medicineReminders.filter(
      (m) =>
        m.family_member_id === activeMember.id ||
        m.family_member_name?.toLowerCase() === activeMember.name.toLowerCase()
    );
  }, [medicineReminders, activeMember]);

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.relation) {
      alert('Name and relation are required');
      return;
    }

    try {
      if (editingMember) {
        await api.updateFamilyMember(editingMember.id, formData);
        setEditingMember(null);
      } else {
        await api.addFamilyMember({
          ...formData,
          consent_granted: true,
          caregiver_name: 'Gowtham Bikkina',
        });
        setIsAddingMember(false);
      }
      setFormData({
        name: '',
        relation: 'Spouse',
        age: 30,
        gender: 'Female',
        blood_group: 'B+',
        dob: '',
        phone: '+91 98480 00000',
        allergies: 'None reported',
        chronic_conditions: [],
        ongoing_medications: [],
        consent_level: 'Full Guardian Access',
      });
      await loadData();
      if (onRefresh) onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error saving family member profile');
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (id === 'fam-self') {
      alert('Primary account holder profile cannot be deleted.');
      return;
    }
    if (!confirm('Are you sure you want to remove this family member profile?')) return;
    try {
      await api.deleteFamilyMember(id);
      setSelectedMemberId('fam-self');
      await loadData();
      if (onRefresh) onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error deleting family member');
    }
  };

  const handleUpdateConsent = async (memberId: string, level: FamilyMember['consent_level']) => {
    try {
      await api.updateFamilyMember(memberId, { consent_level: level });
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Error updating consent level');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title={t('family.pageTitle', 'Family Health Profiles & Dashboard')}
        subtitle={t(
          'family.pageSubtitle',
          'Separate individual health profiles, medical records, appointments, and caregiver consent management.'
        )}
        badge="Module 5: Family Care Vault"
        onBack={onBack}
        onHome={onHome}
        onDashboard={onDashboard}
        userRole={userRole}
        icon={Users}
        actionButton={
          <button
            onClick={() => {
              setEditingMember(null);
              setIsAddingMember(!isAddingMember);
            }}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>{isAddingMember ? 'Cancel' : t('family.addMember', 'Add Family Member')}</span>
          </button>
        }
      />

      {/* DPDP Act Privacy Notice */}
      <div className="p-4 rounded-3xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-indigo-950 dark:text-indigo-200 text-xs flex items-start gap-3 shadow-xs">
        <Lock className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold text-indigo-900 dark:text-indigo-100">
            DPDP Act Data Privacy & Guardian Compliance
          </p>
          <p className="leading-relaxed">
            {t(
              'family.dpdpNotice',
              'All family member records are maintained separately and protected under the Digital Personal Data Protection (DPDP) Act. Authorized caregivers access records under explicit consent levels.'
            )}
          </p>
        </div>
      </div>

      {/* Add / Edit Family Member Modal / Card */}
      {(isAddingMember || editingMember) && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border-2 border-teal-500 shadow-xl space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-teal-600" />
              <span>{editingMember ? 'Edit Profile: ' + editingMember.name : t('family.addMember', 'Add Family Member Profile')}</span>
            </h3>
            <button
              onClick={() => {
                setIsAddingMember(false);
                setEditingMember(null);
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSaveMember} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Radhika Bikkina"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Relationship *</label>
                <select
                  value={formData.relation || 'Spouse'}
                  onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold"
                >
                  <option value="Spouse">Spouse (భార్య/భర్త / जीवनसाथी)</option>
                  <option value="Child">Child (కుమారుడు/కుమార్తె / बच्चा)</option>
                  <option value="Father">Father (తండ్రి / पिता)</option>
                  <option value="Mother">Mother (తల్లి / माता)</option>
                  <option value="Grandparent">Grandparent (తాత/నానమ్మ / दादा/दादी)</option>
                  <option value="Sibling">Sibling (సోదరుడు/సోదరి / भाई/बहन)</option>
                  <option value="Other">Other Dependent</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Age / Gender</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min="1"
                    max="115"
                    placeholder="Age"
                    value={formData.age || ''}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold"
                  />
                  <select
                    value={formData.gender || 'Female'}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Blood Group</label>
                <select
                  value={formData.blood_group || formData.bloodGroup || 'O+'}
                  onChange={(e) => setFormData({ ...formData, blood_group: e.target.value, bloodGroup: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold"
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Known Allergies</label>
                <input
                  type="text"
                  placeholder="e.g. Penicillin, Peanuts, Sulfa"
                  value={formData.allergies || ''}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Caregiver Consent Level</label>
                <select
                  value={formData.consent_level || 'Full Guardian Access'}
                  onChange={(e) => setFormData({ ...formData, consent_level: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-indigo-700 dark:text-indigo-400"
                >
                  <option value="Full Guardian Access">Full Guardian Access (Book, View, Manage)</option>
                  <option value="View-Only Access">View-Only Access (Records & Alerts)</option>
                  <option value="Emergency-Only Access">Emergency-Only Access</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsAddingMember(false);
                  setEditingMember(null);
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold cursor-pointer shadow-md flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Family Member Profile</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Member Profiles Selector Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {members.map((m) => {
          const isSelected = selectedMemberId === m.id;
          return (
            <div
              key={m.id}
              onClick={() => setSelectedMemberId(m.id)}
              className={`p-4 rounded-3xl border text-left cursor-pointer transition flex flex-col justify-between space-y-2 ${
                isSelected
                  ? 'bg-gradient-to-br from-teal-50 to-sky-50 dark:from-teal-950/60 dark:to-sky-950/60 border-teal-500 shadow-md ring-2 ring-teal-500/20'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-teal-600">{m.relation}</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-[10px] font-black text-slate-700 dark:text-slate-300">
                  {m.blood_group || m.bloodGroup || 'O+'}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">{m.name}</h4>
                <p className="text-xs text-slate-500">
                  {m.age} yrs • {m.gender}
                </p>
              </div>
              <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-200/50 dark:border-slate-700/50">
                <span className="truncate">{m.consent_level?.split(' ')[0] || 'Guardian'}</span>
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Member Health Dossier & Tabs */}
      {activeMember && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-6">
          {/* Dossier Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-black text-lg">
                {activeMember.name[0]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">{activeMember.name}</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-[10px] font-extrabold uppercase">
                    {activeMember.relation}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Blood Group: <strong className="text-slate-800 dark:text-slate-200">{activeMember.blood_group || activeMember.bloodGroup || 'O+'}</strong> • Age: {activeMember.age} • Allergies: {activeMember.allergies || 'None'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingMember(activeMember);
                  setFormData(activeMember);
                }}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>

              {activeMember.id !== 'fam-self' && (
                <button
                  type="button"
                  onClick={() => handleDeleteMember(activeMember.id)}
                  className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
            {[
              { id: 'overview', label: 'Health Overview', icon: Activity },
              { id: 'appointments', label: `Appointments (${memberAppointments.length})`, icon: Calendar },
              { id: 'records', label: `Lab Reports (${memberRecords.length})`, icon: FileText },
              { id: 'medicines', label: `Prescriptions (${memberMedicines.length})`, icon: Pill },
              { id: 'consent', label: 'Caregiver Consent', icon: Lock },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab 1: Health Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-4 text-xs animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Chronic Conditions</span>
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    {activeMember.chronic_conditions && activeMember.chronic_conditions.length > 0
                      ? activeMember.chronic_conditions.join(', ')
                      : 'No ongoing chronic conditions reported.'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Known Allergies</span>
                  <div className="font-bold text-rose-600 dark:text-rose-400">
                    {activeMember.allergies || 'None reported'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Emergency Contact Phone</span>
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    {activeMember.emergency_contact?.phone || activeMember.phone || '+91 98480 22334'}
                  </div>
                </div>
              </div>

              {/* Quick Action Navigation */}
              <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-teal-900 dark:text-teal-200">Book Doctor Consultation for {activeMember.name}</h4>
                  <p className="text-[11px] text-teal-800/80 dark:text-teal-300/80">
                    Select a specialist and time slot with patient pre-filled.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigateTab) onNavigateTab('appointments');
                  }}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Book Appointment</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Individual Appointments */}
          {activeTab === 'appointments' && (
            <div className="space-y-3 animate-fade-in text-xs">
              {memberAppointments.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  No appointments registered for {activeMember.name} yet.
                </div>
              ) : (
                memberAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{apt.doctor_name}</h4>
                      <p className="text-slate-500">{apt.doctor_specialization} • {apt.hospital_name || 'Medical Center'}</p>
                      <p className="text-[11px] text-teal-600 font-bold mt-1">
                        {apt.appointment_date} at {apt.appointment_time} (Token: {apt.token_code || apt.opd_token_number})
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      {apt.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 3: Medical Records & Reports */}
          {activeTab === 'records' && (
            <div className="space-y-3 animate-fade-in text-xs">
              {memberRecords.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  No lab reports or documents uploaded for {activeMember.name} yet.
                </div>
              ) : (
                memberRecords.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{rec.title}</h4>
                      <p className="text-slate-500">{rec.document_type} • {rec.doctor_name || 'Diagnostic Center'}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{rec.record_date} • {rec.file_name}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                      {rec.file_size}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 4: Medicines */}
          {activeTab === 'medicines' && (
            <div className="space-y-3 animate-fade-in text-xs">
              {memberMedicines.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  No active medicine schedules assigned to {activeMember.name}.
                </div>
              ) : (
                memberMedicines.map((med) => (
                  <div
                    key={med.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{med.medicine_name}</h4>
                      <p className="text-slate-500">{med.dosage} • {med.instructions} • {med.frequency}</p>
                      <p className="text-[11px] text-teal-600 font-semibold mt-0.5">
                        {med.schedule.map((s) => `${s.slot} (${s.time})`).join(', ')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                        {med.current_stock} doses left
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const firstSlot = med.schedule[0]?.slot || 'Afternoon';
                          speakReminder(firstSlot, med.medicine_name);
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-[10px] flex items-center gap-1 transition cursor-pointer shadow-xs active:scale-95"
                        title="Hear Telugu voice reminder"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>🔊 Hear Reminder</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 5: Caregiver Consent Settings */}
          {activeTab === 'consent' && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-4 text-xs animate-fade-in">
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white">
                  Caregiver Access & Consent Level for {activeMember.name}
                </h4>
                <p className="text-slate-500">
                  Configure permission granted to the primary caregiver under DPDP privacy regulations.
                </p>
              </div>

              <div className="space-y-2">
                {[
                  {
                    level: 'Full Guardian Access' as const,
                    desc: 'Caregiver can view medical records, book appointments, receive SMS alerts, and manage prescriptions.',
                  },
                  {
                    level: 'View-Only Access' as const,
                    desc: 'Caregiver can only review lab results and appointment schedules without modification authority.',
                  },
                  {
                    level: 'Emergency-Only Access' as const,
                    desc: 'Access is locked and only released in acute emergency trauma situations.',
                  },
                ].map((item) => (
                  <label
                    key={item.level}
                    className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                      activeMember.consent_level === item.level
                        ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-500'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="consent_level"
                      checked={activeMember.consent_level === item.level}
                      onChange={() => handleUpdateConsent(activeMember.id, item.level)}
                      className="mt-0.5 text-teal-600"
                    />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{item.level}</span>
                      <span className="text-slate-500 text-[11px] leading-relaxed">{item.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

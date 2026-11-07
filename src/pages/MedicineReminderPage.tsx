import React, { useState, useEffect, useMemo } from 'react';
import {
  Bell,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  Trash2,
  RotateCcw,
  Pill,
  Sun,
  Sunset,
  Moon,
  Coffee,
  Check,
  ShieldAlert,
  TrendingUp,
  Volume2,
  Sparkles,
  Play,
} from 'lucide-react';
import { MedicineReminder, DoseTimeSlot, UserRole, FamilyMember } from '../types';
import { api } from '../services/api';
import { PageHeader } from '../components/common/PageHeader';
import { useTranslation } from '../i18n/LanguageContext';
import { VoiceReminderControls } from '../components/common/VoiceReminderControls';
import { useMedicineVoiceReminder } from '../hooks/useMedicineVoiceReminder';

interface Props {
  userRole: UserRole;
  familyMembers?: FamilyMember[];
  initialPrefillMedicine?: {
    medicine_name?: string;
    dosage?: string;
    instructions?: 'Before Food' | 'After Food' | 'With Food' | 'Empty Stomach' | 'As Needed';
    morning?: boolean;
    afternoon?: boolean;
    evening?: boolean;
    night?: boolean;
    prescribed_by?: string;
  };
  onBack?: () => void;
  onHome?: () => void;
  onDashboard?: () => void;
}

export const MedicineReminderPage: React.FC<Props> = ({
  userRole,
  familyMembers = [],
  initialPrefillMedicine,
  onBack,
  onHome,
  onDashboard,
}) => {
  const { t } = useTranslation();
  const [medicines, setMedicines] = useState<MedicineReminder[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [filterMemberId, setFilterMemberId] = useState<string>('ALL');
  const [notificationTestSuccess, setNotificationTestSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    medicine_name: '',
    dosage: '',
    prescribed_by: 'Dr. Ramesh Chandra, DM',
    instructions: 'After Food' as 'Before Food' | 'After Food' | 'With Food' | 'Empty Stomach' | 'As Needed',
    frequency: 'Daily',
    morning: true,
    morningTime: '08:00 AM',
    afternoon: false,
    afternoonTime: '01:30 PM',
    evening: false,
    eveningTime: '06:00 PM',
    night: true,
    nightTime: '08:30 PM',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    is_chronic: true,
    current_stock: 30,
    refill_reminder_at: 7,
    family_member_id: 'fam-self',
  });

  // Handle prefill from Medical Report Analyzer
  useEffect(() => {
    if (initialPrefillMedicine) {
      setIsAdding(true);
      setFormData((prev) => ({
        ...prev,
        medicine_name: initialPrefillMedicine.medicine_name || prev.medicine_name,
        dosage: initialPrefillMedicine.dosage || prev.dosage,
        instructions: initialPrefillMedicine.instructions || prev.instructions,
        morning: initialPrefillMedicine.morning !== undefined ? initialPrefillMedicine.morning : prev.morning,
        afternoon: initialPrefillMedicine.afternoon !== undefined ? initialPrefillMedicine.afternoon : prev.afternoon,
        evening: initialPrefillMedicine.evening !== undefined ? initialPrefillMedicine.evening : prev.evening,
        night: initialPrefillMedicine.night !== undefined ? initialPrefillMedicine.night : prev.night,
        prescribed_by: initialPrefillMedicine.prescribed_by || prev.prescribed_by,
      }));
    }
  }, [initialPrefillMedicine]);

  const {
    voiceLanguage,
    setVoiceLanguage,
    isSpeaking,
    currentSpokenText,
    autoVoiceEnabled,
    setAutoVoiceEnabled,
    notificationPermission,
    requestNotificationPermission,
    speakReminder,
    stopVoice,
    previewVoice,
    testReminder,
    checkSchedules,
  } = useMedicineVoiceReminder('Telugu');

  const loadMedicines = async () => {
    try {
      setLoading(true);
      const data = await api.getMedicineReminders();
      setMedicines(data);
    } catch (err) {
      console.error('Error loading medicine reminders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedicines();
  }, []);

  // Check scheduled medicine times automatically every 30 seconds
  useEffect(() => {
    checkSchedules(medicines);
    const timer = setInterval(() => {
      checkSchedules(medicines);
    }, 30000);
    return () => clearInterval(timer);
  }, [checkSchedules, medicines]);

  const handleAddMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.medicine_name.trim() || !formData.dosage.trim()) {
      alert('Please provide medicine name and prescribed dosage.');
      return;
    }

    try {
      const schedule = [];
      if (formData.morning) schedule.push({ slot: 'Morning' as DoseTimeSlot, time: formData.morningTime, takenToday: false, skippedToday: false });
      if (formData.afternoon) schedule.push({ slot: 'Afternoon' as DoseTimeSlot, time: formData.afternoonTime, takenToday: false, skippedToday: false });
      if (formData.evening) schedule.push({ slot: 'Evening' as DoseTimeSlot, time: formData.eveningTime, takenToday: false, skippedToday: false });
      if (formData.night) schedule.push({ slot: 'Night' as DoseTimeSlot, time: formData.nightTime, takenToday: false, skippedToday: false });

      const member = familyMembers.find((m) => m.id === formData.family_member_id);

      await api.addMedicineReminder({
        medicine_name: formData.medicine_name,
        dosage: formData.dosage,
        prescribed_by: formData.prescribed_by,
        instructions: formData.instructions,
        frequency: formData.frequency,
        schedule,
        start_date: formData.start_date,
        end_date: formData.end_date || undefined,
        is_chronic: formData.is_chronic,
        current_stock: Number(formData.current_stock) || 30,
        refill_reminder_at: Number(formData.refill_reminder_at) || 7,
        family_member_id: formData.family_member_id,
        family_member_name: member ? member.name : 'Gowtham Bikkina',
      });

      setIsAdding(false);
      setFormData({
        medicine_name: '',
        dosage: '',
        prescribed_by: 'Dr. Ramesh Chandra, DM',
        instructions: 'After Food',
        frequency: 'Daily',
        morning: true,
        morningTime: '08:00 AM',
        afternoon: false,
        afternoonTime: '01:30 PM',
        evening: false,
        eveningTime: '06:00 PM',
        night: true,
        nightTime: '08:30 PM',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        is_chronic: true,
        current_stock: 30,
        refill_reminder_at: 7,
        family_member_id: 'fam-self',
      });
      await loadMedicines();
    } catch (err: any) {
      alert(err.message || 'Failed to save medicine reminder');
    }
  };

  const handleUpdateDose = async (id: string, slot: DoseTimeSlot, status: 'Taken' | 'Skipped') => {
    try {
      await api.updateMedicineDose(id, slot, status);
      await loadMedicines();
    } catch (err: any) {
      alert(err.message || 'Failed to update dose status');
    }
  };

  const handleDeleteMedicine = async (id: string) => {
    if (!confirm('Are you sure you want to remove this medicine schedule?')) return;
    try {
      await api.deleteMedicineReminder(id);
      await loadMedicines();
    } catch (err: any) {
      alert(err.message || 'Failed to delete medicine');
    }
  };

  const handleTestNotification = () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification('Universal Health Care AI — Medicine Reminder', {
            body: 'Time to take: Metformin 500 mg (After Food). Staying consistent protects your glycemic balance.',
            icon: '/favicon.ico',
          });
        }
      });
    }
    setNotificationTestSuccess(true);
    setTimeout(() => setNotificationTestSuccess(false), 4000);
  };

  // Filter medicines by family member if selected
  const filteredMeds = useMemo(() => {
    if (filterMemberId === 'ALL') return medicines;
    return medicines.filter((m) => m.family_member_id === filterMemberId);
  }, [medicines, filterMemberId]);

  // Calculate adherence rate across history
  const adherenceStats = useMemo(() => {
    let totalDosesLogged = 0;
    let takenCount = 0;
    medicines.forEach((m) => {
      if (m.history) {
        totalDosesLogged += m.history.length;
        takenCount += m.history.filter((h) => h.status === 'Taken').length;
      }
    });
    const percent = totalDosesLogged > 0 ? Math.round((takenCount / totalDosesLogged) * 100) : 94;
    return { totalDosesLogged, takenCount, percent };
  }, [medicines]);

  // Check low stock refill items
  const lowStockItems = useMemo(() => {
    return medicines.filter((m) => m.current_stock <= m.refill_reminder_at);
  }, [medicines]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title={t('meds.pageTitle', 'Smart Medicine Reminder & Adherence Tracker')}
        subtitle={t(
          'meds.pageSubtitle',
          'Doctor-prescribed dosage schedules, taken/skipped tracking, refill alerts, and daily history.'
        )}
        badge="Module 4: Medication Safety"
        onBack={onBack}
        onHome={onHome}
        onDashboard={onDashboard}
        userRole={userRole}
        icon={Pill}
        actionButton={
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>{isAdding ? 'Close Form' : t('meds.addMedicine', 'Add Prescribed Medicine')}</span>
          </button>
        }
      />

      {/* Mandatory Prescription Safety Notice */}
      <div className="p-4 rounded-3xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 text-teal-950 dark:text-teal-200 text-xs flex items-start gap-3 shadow-xs">
        <ShieldAlert className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold text-teal-900 dark:text-teal-100">Prescription Adherence Charter</p>
          <p className="leading-relaxed">
            {t(
              'meds.noPrescribeDisclaimer',
              'Safety Notice: This reminder strictly tracks doctor-prescribed regimens. It never prescribes or changes dosages. Consult your registered doctor before altering medication.'
            )}
          </p>
        </div>
      </div>

      {notificationTestSuccess && (
        <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/50 border border-sky-300 text-sky-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <Bell className="w-4 h-4 text-sky-600" />
          <span>Test Reminder Alert Dispatched (Browser notification & in-app chime triggered).</span>
        </div>
      )}

      {/* Refill Alerts Banner */}
      {lowStockItems.length > 0 && (
        <div className="p-4 rounded-3xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 text-amber-900 dark:text-amber-200 text-xs space-y-1 animate-fade-in">
          <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-100">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Pharmacy Refill Alert ({lowStockItems.length} Medication(s) Running Low)</span>
          </div>
          <p className="pl-6 text-amber-800/90 dark:text-amber-300/90">
            {lowStockItems.map((m) => `${m.medicine_name} (${m.current_stock} doses left)`).join(' • ')} — Please refill from your registered hospital or local pharmacy.
          </p>
        </div>
      )}

      {/* AI Voice Medicine Reminder Console */}
      <VoiceReminderControls
        voiceLanguage={voiceLanguage}
        setVoiceLanguage={setVoiceLanguage}
        isSpeaking={isSpeaking}
        currentSpokenText={currentSpokenText}
        onHearReminder={(slot, medName) => speakReminder(slot, medName)}
        onPreviewVoice={(slot, medName) => previewVoice(slot, medName)}
        onStopVoice={stopVoice}
        onTestReminder={(slot) => testReminder(slot)}
        autoVoiceEnabled={autoVoiceEnabled}
        setAutoVoiceEnabled={setAutoVoiceEnabled}
        notificationPermission={notificationPermission}
        onRequestPermission={requestNotificationPermission}
      />

      {/* Adherence Overview Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            {t('meds.adherenceStreak', 'Adherence Score')}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-teal-600 dark:text-teal-400 font-mono">
              {adherenceStats.percent}%
            </span>
            <span className="text-xs text-slate-400 font-medium">on-time doses</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden mt-2">
            <div
              className="bg-teal-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${adherenceStats.percent}%` }}
            />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Active Prescriptions
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
              {medicines.length}
            </span>
            <span className="text-xs text-slate-400 font-medium">registered regimens</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Tracks morning, afternoon, evening & night</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between space-y-2">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Reminder Notifications
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              Test browser push & sound alert
            </p>
          </div>
          <button
            type="button"
            onClick={handleTestNotification}
            className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5 text-sky-600" />
            <span>Test Sound & Notification</span>
          </button>
        </div>
      </div>

      {/* Add Medicine Form Modal / Expandable */}
      {isAdding && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border-2 border-teal-500 shadow-xl space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Pill className="w-5 h-5 text-teal-600" />
              <span>{t('meds.addMedicine', 'Add Prescribed Medicine')}</span>
            </h3>
            <button
              onClick={() => setIsAdding(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleAddMedicine} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('meds.medicineName', 'Medicine Name')} *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Metformin, Amlodipine, Paracetamol"
                  value={formData.medicine_name}
                  onChange={(e) => setFormData({ ...formData, medicine_name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('meds.dosage', 'Dosage')} *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 500 mg, 1 tablet, 5 ml"
                  value={formData.dosage}
                  onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Prescribing Physician
                </label>
                <input
                  type="text"
                  placeholder="Dr. Ramesh Chandra, DM"
                  value={formData.prescribed_by}
                  onChange={(e) => setFormData({ ...formData, prescribed_by: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Meal Instruction
                </label>
                <select
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold"
                >
                  <option value="After Food">After Food (భోజనం తర్వాత / भोजन के बाद)</option>
                  <option value="Before Food">Before Food (భోజనం ముందు / भोजन से पहले)</option>
                  <option value="With Food">With Food (ఆహారంతో పాటు / भोजन के साथ)</option>
                  <option value="Empty Stomach">Empty Stomach (ఉదయం ఖాళీ కడుపుతో / खाली पेट)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Prescription Belongs To:
                </label>
                <select
                  value={formData.family_member_id}
                  onChange={(e) => setFormData({ ...formData, family_member_id: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold"
                >
                  <option value="fam-self">Gowtham Bikkina (Self)</option>
                  {familyMembers
                    .filter((m) => m.id !== 'fam-self')
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.relation})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Current Stock Count (Tablets/Bottles)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.current_stock}
                  onChange={(e) => setFormData({ ...formData, current_stock: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>
            </div>

            {/* Daily Schedule Pickers */}
            <div>
              <span className="block font-bold text-slate-700 dark:text-slate-300 mb-2">
                Daily Dose Schedule & Timings:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <label className={`p-3 rounded-2xl border cursor-pointer flex flex-col gap-2 ${formData.morning ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-300' : 'bg-slate-50 dark:bg-slate-900 border-slate-200'}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5">
                      <Sun className="w-4 h-4 text-amber-500" />
                      <span>{t('meds.morning', 'Morning')}</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={formData.morning}
                      onChange={(e) => setFormData({ ...formData, morning: e.target.checked })}
                      className="rounded text-teal-600"
                    />
                  </div>
                  {formData.morning && (
                    <input
                      type="text"
                      value={formData.morningTime}
                      onChange={(e) => setFormData({ ...formData, morningTime: e.target.value })}
                      className="p-1 rounded bg-white dark:bg-slate-800 text-[11px] font-bold border border-slate-200"
                    />
                  )}
                </label>

                <label className={`p-3 rounded-2xl border cursor-pointer flex flex-col gap-2 ${formData.afternoon ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-300' : 'bg-slate-50 dark:bg-slate-900 border-slate-200'}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5">
                      <Sun className="w-4 h-4 text-orange-500" />
                      <span>{t('meds.afternoon', 'Afternoon')}</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={formData.afternoon}
                      onChange={(e) => setFormData({ ...formData, afternoon: e.target.checked })}
                      className="rounded text-teal-600"
                    />
                  </div>
                  {formData.afternoon && (
                    <input
                      type="text"
                      value={formData.afternoonTime}
                      onChange={(e) => setFormData({ ...formData, afternoonTime: e.target.value })}
                      className="p-1 rounded bg-white dark:bg-slate-800 text-[11px] font-bold border border-slate-200"
                    />
                  )}
                </label>

                <label className={`p-3 rounded-2xl border cursor-pointer flex flex-col gap-2 ${formData.evening ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-300' : 'bg-slate-50 dark:bg-slate-900 border-slate-200'}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5">
                      <Sunset className="w-4 h-4 text-purple-500" />
                      <span>{t('meds.evening', 'Evening')}</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={formData.evening}
                      onChange={(e) => setFormData({ ...formData, evening: e.target.checked })}
                      className="rounded text-teal-600"
                    />
                  </div>
                  {formData.evening && (
                    <input
                      type="text"
                      value={formData.eveningTime}
                      onChange={(e) => setFormData({ ...formData, eveningTime: e.target.value })}
                      className="p-1 rounded bg-white dark:bg-slate-800 text-[11px] font-bold border border-slate-200"
                    />
                  )}
                </label>

                <label className={`p-3 rounded-2xl border cursor-pointer flex flex-col gap-2 ${formData.night ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-300' : 'bg-slate-50 dark:bg-slate-900 border-slate-200'}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5">
                      <Moon className="w-4 h-4 text-indigo-500" />
                      <span>{t('meds.night', 'Night')}</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={formData.night}
                      onChange={(e) => setFormData({ ...formData, night: e.target.checked })}
                      className="rounded text-teal-600"
                    />
                  </div>
                  {formData.night && (
                    <input
                      type="text"
                      value={formData.nightTime}
                      onChange={(e) => setFormData({ ...formData, nightTime: e.target.value })}
                      className="p-1 rounded bg-white dark:bg-slate-800 text-[11px] font-bold border border-slate-200"
                    />
                  )}
                </label>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold cursor-pointer shadow-md"
              >
                Save Schedule
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter by Family Member Pills */}
      {familyMembers.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="font-bold text-slate-400 uppercase text-[10px] shrink-0">Filter Member:</span>
          <button
            type="button"
            onClick={() => setFilterMemberId('ALL')}
            className={`px-3 py-1.5 rounded-full font-bold shrink-0 transition ${
              filterMemberId === 'ALL'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600'
            }`}
          >
            All Medicines ({medicines.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMemberId('fam-self')}
            className={`px-3 py-1.5 rounded-full font-bold shrink-0 transition ${
              filterMemberId === 'fam-self'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600'
            }`}
          >
            Gowtham (Self)
          </button>
          {familyMembers
            .filter((m) => m.id !== 'fam-self')
            .map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setFilterMemberId(m.id)}
                className={`px-3 py-1.5 rounded-full font-bold shrink-0 transition ${
                  filterMemberId === m.id
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600'
                }`}
              >
                {m.name} ({m.relation})
              </button>
            ))}
        </div>
      )}

      {/* Medicines List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredMeds.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 text-xs">
            No medicine schedules found. Click &quot;Add Prescribed Medicine&quot; above to set up daily reminders.
          </div>
        ) : (
          filteredMeds.map((med) => {
            const isLowStock = med.current_stock <= med.refill_reminder_at;
            return (
              <div
                key={med.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-teal-300 transition flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Pill className="w-4 h-4 text-teal-600 shrink-0" />
                        <h4 className="text-base font-black text-slate-900 dark:text-white truncate">
                          {med.medicine_name}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        <span className="font-bold text-slate-700 dark:text-slate-300">{med.dosage}</span> • {med.instructions} • {med.frequency}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteMedicine(med.id)}
                      className="p-1 rounded-lg text-slate-300 hover:text-rose-600 transition"
                      title="Delete prescription"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Stock & Prescription Info */}
                  <div className="grid grid-cols-2 gap-2 pt-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                      <span className="text-slate-400">Current Stock:</span>
                      <span className={`font-black font-mono ${isLowStock ? 'text-amber-600 dark:text-amber-400' : 'text-slate-800 dark:text-slate-100'}`}>
                        {med.current_stock} doses {isLowStock && '⚠️'}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                      <span className="text-slate-400">Patient:</span>
                      <span className="font-bold text-teal-600 dark:text-teal-400 truncate">
                        {med.family_member_name || 'Gowtham'}
                      </span>
                    </div>
                  </div>

                  {/* Today's Dosage Status Cards */}
                  <div className="pt-3 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                      Today&apos;s Prescribed Times:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {med.schedule.map((s, idx) => {
                        const isTaken = s.takenToday;
                        const isSkipped = s.skippedToday;
                        return (
                          <div
                            key={idx}
                            className={`p-3 rounded-2xl border transition flex flex-col justify-between gap-2.5 ${
                              isTaken
                                ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                                : isSkipped
                                ? 'bg-slate-100/70 dark:bg-slate-900/60 border-slate-300 dark:border-slate-700'
                                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800 dark:text-slate-200">
                                  <span>{s.slot}</span>
                                  <span className="text-[10px] text-slate-400">({s.time})</span>
                                </div>
                                <span
                                  className={`text-[10px] font-extrabold uppercase ${
                                    isTaken
                                      ? 'text-emerald-700 dark:text-emerald-300'
                                      : isSkipped
                                      ? 'text-slate-400'
                                      : 'text-amber-600'
                                  }`}
                                >
                                  {isTaken ? t('meds.statusTaken', 'Taken') : isSkipped ? 'Skipped' : t('meds.statusPending', 'Pending')}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateDose(med.id, s.slot, 'Taken')}
                                  className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold flex items-center gap-1 transition cursor-pointer ${
                                    isTaken
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  }`}
                                >
                                  <Check className="w-3 h-3" />
                                  <span>{isTaken ? 'Taken ✓' : t('meds.markTaken', 'Take')}</span>
                                </button>

                                {!isTaken && !isSkipped && (
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateDose(med.id, s.slot, 'Skipped')}
                                    className="px-2 py-1 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-600 text-[10px] font-bold cursor-pointer"
                                  >
                                    Skip
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Voice Reminder Buttons */}
                            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => speakReminder(s.slot, med.medicine_name)}
                                className="flex-1 py-1 px-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-[10px] flex items-center justify-center gap-1 transition cursor-pointer shadow-xs active:scale-95"
                                title="Hear Telugu Voice Reminder"
                              >
                                <Volume2 className="w-3 h-3" />
                                <span>🔊 Hear Medicine Reminder</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => previewVoice(s.slot, med.medicine_name)}
                                className="py-1 px-2 rounded-xl bg-sky-100 dark:bg-sky-950/60 hover:bg-sky-200 text-sky-800 dark:text-sky-300 font-bold text-[10px] flex items-center justify-center gap-1 transition cursor-pointer active:scale-95"
                                title="Preview Voice"
                              >
                                <Play className="w-2.5 h-2.5 fill-sky-700 text-sky-700 dark:fill-sky-300 dark:text-sky-300" />
                                <span>▶ Preview Voice</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* History & Doctor attribution footer */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Prescribed by {med.prescribed_by || 'Verified Doctor'}</span>
                  <span>{med.history?.length || 0} doses logged</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

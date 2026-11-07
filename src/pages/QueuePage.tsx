import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  Building2,
  Users,
  CheckCircle2,
  Play,
  RotateCcw,
  Ticket,
  ChevronRight,
  AlertCircle,
  Stethoscope,
  Volume2,
  UserX,
  Clock8,
  Bell,
  Activity,
  CheckCheck,
} from 'lucide-react';
import { QueueToken, Hospital, Doctor, UserRole, QueueStatus } from '../types';
import { api } from '../services/api';
import { PageHeader } from '../components/common/PageHeader';
import { useTranslation } from '../i18n/LanguageContext';

interface Props {
  hospitals: Hospital[];
  doctors: Doctor[];
  initialHospitalId?: string;
  userRole: UserRole;
  onBack?: () => void;
  onHome?: () => void;
  onDashboard?: () => void;
}

export const QueuePage: React.FC<Props> = ({
  hospitals,
  doctors,
  initialHospitalId,
  userRole,
  onBack,
  onHome,
  onDashboard,
}) => {
  const { t } = useTranslation();
  const [selectedHospitalId, setSelectedHospitalId] = useState(
    initialHospitalId || hospitals[0]?.id || ''
  );
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('ALL');
  const [selectedSession, setSelectedSession] = useState<'Morning OPD' | 'Evening OPD'>('Morning OPD');
  const [tokens, setTokens] = useState<QueueToken[]>([]);
  const [loading, setLoading] = useState(false);
  const [patientName, setPatientName] = useState('Gowtham Bikkina');
  const [myToken, setMyToken] = useState<QueueToken | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const activeHospital = hospitals.find(h => h.id === selectedHospitalId) || hospitals[0];

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const data = await api.getQueue(
        selectedHospitalId,
        selectedDoctorId !== 'ALL' ? selectedDoctorId : undefined
      );
      setTokens(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 8000); // Live sync every 8 seconds
    return () => clearInterval(interval);
  }, [selectedHospitalId, selectedDoctorId]);

  // Department / Session tokens
  const activeSessionTokens = useMemo(() => {
    return tokens.filter(t => {
      if (t.hospital_id !== selectedHospitalId) return false;
      if (selectedDoctorId !== 'ALL' && t.doctor_id && t.doctor_id !== selectedDoctorId) return false;
      return true;
    });
  }, [tokens, selectedHospitalId, selectedDoctorId]);

  const currentlyServing = activeSessionTokens.find(t => t.status === 'Serving');
  const waitingTokens = activeSessionTokens
    .filter(t => t.status === 'Waiting')
    .sort((a, b) => a.token_number - b.token_number);
  const completedTokens = activeSessionTokens.filter(t => t.status === 'Completed');
  const totalTokens = activeSessionTokens.length;
  const progressPercent = totalTokens > 0 ? Math.round((completedTokens.length / totalTokens) * 100) : 0;

  const handleGenerateToken = async () => {
    try {
      setLoading(true);
      const doc = doctors.find(d => d.id === selectedDoctorId) || doctors[0];
      const res = await api.generateQueueToken({
        hospitalId: selectedHospitalId,
        department: `${doc.specialization} OPD`,
        doctorId: doc.id,
        doctorName: doc.name,
        patientName: patientName || 'Patient',
        session: selectedSession,
      });
      setMyToken(res.token);
      await fetchQueue();
    } catch (err: any) {
      alert(err.message || 'Error generating token');
    } finally {
      setLoading(false);
    }
  };

  const handleCallNext = async () => {
    try {
      setLoading(true);
      const doc = doctors.find(d => d.id === selectedDoctorId);
      await api.callNextQueueToken(
        selectedHospitalId,
        doc ? `${doc.specialization} OPD` : 'Cardiology OPD',
        selectedDoctorId !== 'ALL' ? selectedDoctorId : undefined
      );
      await fetchQueue();
    } catch (err: any) {
      alert(err.message || 'Error calling next token');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (tokenId: string, status: 'Completed' | 'Delayed' | 'Absent' | 'Cancelled') => {
    try {
      setLoading(true);
      await api.updateTokenStatus(tokenId, status);
      await fetchQueue();
    } catch (err: any) {
      alert(err.message || 'Error updating status');
    } finally {
      setLoading(false);
    }
  };

  // Calculate my wait time & position based on real waiting queue
  const myQueuePosition = useMemo(() => {
    if (!myToken) return null;
    const index = waitingTokens.findIndex(t => t.id === myToken.id);
    return index >= 0 ? index + 1 : null;
  }, [myToken, waitingTokens]);

  const patientsAhead = myQueuePosition !== null ? Math.max(0, myQueuePosition - 1) : 0;
  const estimatedWait = patientsAhead * 12;

  return (
    <div className="space-y-8">
      {/* Complete Breadcrumb & Header */}
      <PageHeader
        title={t('queue_page_title', 'Live Hospital OPD Queue Tracker')}
        subtitle={t('queue_page_subtitle', 'Real-time digital token tracking, calculated waiting times, separate doctor sessions, and hospital desk controls.')}
        badge={t('queue.realtimeTracking', 'Real-Time OPD Queue Tracking')}
        onBack={onBack}
        onHome={onHome}
        onDashboard={onDashboard}
        userRole={userRole}
        icon={Clock}
        actionButton={
          <button
            onClick={fetchQueue}
            disabled={loading}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 hover:bg-slate-50 transition cursor-pointer"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{t('queue.liveSync', 'Live Sync Active')}</span>
          </button>
        }
      />

      {/* Visual Live Queue Progress Bar Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
            <Activity className="w-4 h-4 text-teal-600 animate-pulse" />
            <span>{t('queue.progress', 'Queue Progress')}:</span>
            <span className="text-teal-600 font-extrabold">{progressPercent}% Completed</span>
            <span className="text-slate-400 font-normal">
              ({completedTokens.length} / {totalTokens || 0} tokens today)
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-500 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
              <span>Auto-refreshing live every 8s</span>
            </span>
            <span>•</span>
            <span>Last sync: {lastUpdated.toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full bg-slate-100 dark:bg-slate-700/60 h-3 rounded-full overflow-hidden p-0.5">
          <div
            className="bg-gradient-to-r from-teal-500 to-sky-500 h-full rounded-full transition-all duration-700"
            style={{ width: `${Math.max(5, Math.min(100, progressPercent))}%` }}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">{t('queue_now_serving', 'Currently Serving')}</span>
            <span className="text-base font-black text-sky-600">
              {currentlyServing ? (currentlyServing.token_code || `#${currentlyServing.token_number}`) : '--'}
            </span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">{t('queue_patients_ahead', 'Waiting in Line')}</span>
            <span className="text-base font-black text-amber-600">{waitingTokens.length}</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">{t('queue.patientsCompleted', 'Patients Completed')}</span>
            <span className="text-base font-black text-emerald-600">{completedTokens.length}</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">{t('queue_est_wait_time', 'Est. Waiting Time')}</span>
            <span className="text-base font-black text-teal-600">~{waitingTokens.length * 12} mins</span>
          </div>
        </div>
      </div>

      {/* Hospital, Doctor & Session Selectors */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            {t('queue_select_hospital', 'Select Healthcare Center')}
          </label>
          <select
            value={selectedHospitalId}
            onChange={(e) => setSelectedHospitalId(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
          >
            {hospitals.map(h => (
              <option key={h.id} value={h.id}>
                {h.name} ({h.city}, {h.state})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Doctor Specialist Queue
          </label>
          <select
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
          >
            <option value="ALL">All Doctor OPD Sessions</option>
            {doctors.filter(d => d.verification_status === 'VERIFIED').map(d => (
              <option key={d.id} value={d.id}>
                {d.name} — {d.specialization} ({d.city})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            {t('queue_select_session', 'OPD Session')}
          </label>
          <select
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value as any)}
            className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
          >
            <option value="Morning OPD">Morning OPD (09:00 AM - 01:30 PM)</option>
            <option value="Evening OPD">Evening OPD (05:00 PM - 08:30 PM)</option>
          </select>
        </div>
      </div>

      {/* Main Digital OPD Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Currently Serving Display (Digital Screen style) */}
        <div className="lg:col-span-2 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-white p-6 sm:p-8 shadow-xl border border-sky-900/40 flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <div className="text-xs uppercase font-extrabold tracking-widest text-teal-400">
                Live Hospital OPD Display
              </div>
              <div className="text-lg font-bold text-white mt-0.5">
                {activeHospital.name}
              </div>
              <div className="text-xs text-slate-400">
                Session: <strong>{selectedSession}</strong>
              </div>
            </div>

            <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center gap-2 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>OPD Active</span>
            </div>
          </div>

          {/* Big Token Number */}
          <div className="text-center py-6">
            <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400 block mb-2">
              {t('queue_now_serving', 'Currently Serving Token')}
            </span>
            <div className="text-7xl sm:text-8xl font-black tracking-tight text-white font-mono bg-gradient-to-b from-white via-sky-100 to-teal-300 bg-clip-text text-transparent">
              {currentlyServing ? (currentlyServing.token_code || `#${currentlyServing.token_number}`) : '#--'}
            </div>
            <div className="text-sm font-semibold text-teal-300 mt-2">
              {currentlyServing ? `Consulting: ${currentlyServing.patient_name}` : 'Waiting for next patient to enter'}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-sky-400" />
              <span>Duty Consultant: {currentlyServing?.doctor_name || 'Dr. Ramesh Chandra, DM'}</span>
            </div>
          </div>

          {/* OPD Stats Footer */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10 text-center text-xs">
            <div className="p-2 rounded-xl bg-white/5">
              <div className="text-slate-400">{t('queue_patients_ahead', 'In Waiting Queue')}</div>
              <div className="text-xl font-extrabold text-white">{waitingTokens.length}</div>
            </div>
            <div className="p-2 rounded-xl bg-white/5">
              <div className="text-slate-400">{t('queue.patientsCompleted', 'Completed')}</div>
              <div className="text-xl font-extrabold text-emerald-300">{completedTokens.length}</div>
            </div>
            <div className="p-2 rounded-xl bg-white/5">
              <div className="text-slate-400">Next in Line</div>
              <div className="text-xl font-extrabold text-teal-300">
                {waitingTokens[0] ? (waitingTokens[0].token_code || `#${waitingTokens[0].token_number}`) : '--'}
              </div>
            </div>
          </div>
        </div>

        {/* Patient Dashboard Queue Card */}
        <div className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Ticket className="w-5 h-5 text-teal-600" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Patient Queue Dashboard
              </h3>
            </div>

            {/* Structured patient dashboard card format */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Hospital:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-right truncate max-w-[180px]">
                  {activeHospital.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Doctor:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {currentlyServing?.doctor_name || 'Dr. Ramesh Chandra, DM'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Appointment Date:</span>
                <span className="font-semibold">{new Date().toISOString().split('T')[0]}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-900">
                  <span className="text-[10px] text-teal-700 dark:text-teal-300 font-bold block">
                    {t('queue_your_token', 'YOUR TOKEN')}
                  </span>
                  <span className="text-2xl font-black text-teal-800 dark:text-teal-200 font-mono">
                    {myToken ? (myToken.token_code || `#${myToken.token_number}`) : 'A025'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-900">
                  <span className="text-[10px] text-sky-700 dark:text-sky-300 font-bold block">
                    {t('queue_now_serving', 'SERVING NOW')}
                  </span>
                  <span className="text-2xl font-black text-sky-800 dark:text-sky-200 font-mono">
                    {currentlyServing ? (currentlyServing.token_code || `#${currentlyServing.token_number}`) : 'A022'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-500">{t('queue_patients_ahead', 'Patients Ahead')}:</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-100">
                  {myToken ? patientsAhead : 3} patients
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">{t('queue.patientsCompleted', 'Patients Completed')}:</span>
                <span className="font-extrabold text-emerald-600">
                  {completedTokens.length} patients
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">{t('queue_est_wait_time', 'Estimated Waiting Time')}:</span>
                <span className="font-extrabold text-teal-700 dark:text-teal-400">
                  ~{myToken ? estimatedWait : 36} minutes (Estimate)
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">{t('success.queueStatusLabel', 'Queue Status')}:</span>
                <span className="font-extrabold uppercase text-emerald-600">
                  Active & Flowing
                </span>
              </div>
            </div>

            {/* Quick Generator */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Generate Digital OPD Entry Token
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Patient Name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="flex-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                />
                <button
                  onClick={handleGenerateToken}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                >
                  Get Token
                </button>
              </div>
            </div>
          </div>

          {/* Doctor / Hospital Staff Desk Controller (Role-Based) */}
          {(userRole === 'doctor' || userRole === 'hospital_admin' || userRole === 'platform_admin') && (
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-teal-300 text-[10px] uppercase tracking-wider">
                  {t('queue_staff_controls', 'Staff OPD Desk Controller')}
                </span>
                <span className="text-[10px] text-slate-400">{userRole.toUpperCase()}</span>
              </div>

              <button
                onClick={handleCallNext}
                disabled={loading || waitingTokens.length === 0}
                className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>
                  {t('queue_call_next', 'Call Next Token')} (
                  {waitingTokens[0] ? (waitingTokens[0].token_code || `#${waitingTokens[0].token_number}`) : '--'})
                </span>
              </button>

              {currentlyServing && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleUpdateStatus(currentlyServing.id, 'Completed')}
                    className="py-1.5 rounded-lg bg-emerald-600/80 hover:bg-emerald-600 text-white text-[11px] font-bold"
                  >
                    {t('queue_mark_completed', 'Mark Completed')}
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(currentlyServing.id, 'Absent')}
                    className="py-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white text-[11px] font-bold"
                  >
                    {t('queue_mark_absent', 'Mark Absent')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* OPD Token Sequence Table with Staff Status Actions */}
      <div className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-sky-600" />
            <span>Today&apos;s OPD Token Sequence ({selectedSession})</span>
          </h3>
          <span className="text-xs text-slate-500">
            {waitingTokens.length} patient(s) waiting in line
          </span>
        </div>

        {activeSessionTokens.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No tokens issued for this hospital session yet today.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase text-[10px] font-bold">
                  <th className="py-2.5 px-3">Token #</th>
                  <th className="py-2.5 px-3">Patient Name</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Patients Ahead</th>
                  <th className="py-2.5 px-3">Est. Wait</th>
                  <th className="py-2.5 px-3">Assigned Doctor</th>
                  {(userRole === 'doctor' || userRole === 'hospital_admin' || userRole === 'platform_admin') && (
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 font-medium">
                {activeSessionTokens.map((t) => {
                  const isServing = t.status === 'Serving';
                  const isWaiting = t.status === 'Waiting';
                  const position = waitingTokens.findIndex(w => w.id === t.id);
                  const ahead = position >= 0 ? position : 0;

                  return (
                    <tr
                      key={t.id}
                      className={isServing ? 'bg-teal-50/60 dark:bg-teal-950/30 font-bold' : ''}
                    >
                      <td className="py-2.5 px-3 font-mono font-bold text-sky-600">
                        {t.token_code || `#${t.token_number}`}
                      </td>
                      <td className="py-2.5 px-3 text-slate-800 dark:text-slate-200">
                        {t.patient_name}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            isServing
                              ? 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200'
                              : t.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                              : t.status === 'Absent'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">
                        {isServing ? 'At Doctor Desk' : isWaiting ? `${ahead} patients` : '--'}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">
                        {isServing ? 'Now Consulting' : isWaiting ? `~${ahead * 12} mins` : '--'}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                        {t.doctor_name}
                      </td>

                      {(userRole === 'doctor' || userRole === 'hospital_admin' || userRole === 'platform_admin') && (
                        <td className="py-2.5 px-3 text-right space-x-1">
                          {isWaiting && (
                            <button
                              onClick={() => handleUpdateStatus(t.id, 'Delayed')}
                              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px]"
                            >
                              Delay
                            </button>
                          )}
                          {isWaiting && (
                            <button
                              onClick={() => handleUpdateStatus(t.id, 'Absent')}
                              className="px-2 py-0.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px]"
                            >
                              Absent
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

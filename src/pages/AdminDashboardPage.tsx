import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Clock,
  UserCheck,
  Building2,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  RotateCcw,
  Plus,
  Search,
  Activity,
  Bell,
  DollarSign,
  Smartphone,
  Check,
  Save,
  Send,
  Sparkles,
} from 'lucide-react';
import { Doctor, Hospital, UserRole, QueueToken } from '../types';
import { VerificationBadge } from '../components/common/VerificationBadge';
import { PageHeader } from '../components/common/PageHeader';
import { api } from '../services/api';

interface Props {
  doctors: Doctor[];
  hospitals: Hospital[];
  onRefresh: () => void;
  onBack?: () => void;
  onHome?: () => void;
  onDashboard?: () => void;
  userRole?: UserRole;
}

export const AdminDashboardPage: React.FC<Props> = ({
  doctors,
  hospitals,
  onRefresh,
  onBack,
  onHome,
  onDashboard,
  userRole,
}) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [adminTab, setAdminTab] = useState<'doctors' | 'hospitals' | 'queues' | 'gateway' | 'pricing' | 'audit' | 'register'>('doctors');
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Queue monitoring state
  const [allTokens, setAllTokens] = useState<QueueToken[]>([]);
  const [loadingQueues, setLoadingQueues] = useState(false);

  // Pricing management state
  const [pricingTiers, setPricingTiers] = useState<any[]>([]);
  const [editingTierName, setEditingTierName] = useState<string | null>(null);
  const [newTierPrice, setNewTierPrice] = useState<string>('');

  // SMS Gateway Test simulator state
  const [testPhone, setTestPhone] = useState('+91 98765 43210');
  const [testMsg, setTestMsg] = useState('Your OPD Token #12 is scheduled in 15 minutes at Ayush Hospital.');
  const [gatewayLogs, setGatewayLogs] = useState<Array<{ id: string; time: string; phone: string; message: string; gateway: string; status: string }>>([
    {
      id: 'log-1',
      time: new Date(Date.now() - 1000 * 60 * 12).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      phone: '+91 98480 12345',
      message: 'Token #04 called to Dr. Ramesh Chandra, Consultation Room 2.',
      gateway: 'TRAI-DLT Compliant (Sandbox Mode)',
      status: 'DISPATCH_ACKNOWLEDGED',
    },
    {
      id: 'log-2',
      time: new Date(Date.now() - 1000 * 60 * 35).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      phone: '+91 94401 98765',
      message: 'Token #03 consultation completed at Ayush Hospital.',
      gateway: 'TRAI-DLT Compliant (Sandbox Mode)',
      status: 'DELIVERED',
    },
  ]);

  // New Provider Registration Form State
  const [docName, setDocName] = useState('');
  const [docEmail, setDocEmail] = useState('');
  const [docPhone, setDocPhone] = useState('');
  const [docRegNum, setDocRegNum] = useState('');
  const [docCouncil, setDocCouncil] = useState('Andhra Pradesh Medical Council');
  const [docSpecialization, setDocSpecialization] = useState('Cardiology');
  const [docAddress, setDocAddress] = useState('Governorpet, Vijayawada');
  const [docFee, setDocFee] = useState('600');
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminStats();
      setStats(res);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchQueues = async () => {
    try {
      setLoadingQueues(true);
      const tokens = await api.getQueue();
      setAllTokens(tokens);
    } catch (err) {
      console.error('Failed to load queue tokens in admin:', err);
    } finally {
      setLoadingQueues(false);
    }
  };

  const fetchPricing = async () => {
    try {
      const rev = await api.getRevenueSummary();
      setPricingTiers(rev.subscriptionTiers || []);
    } catch (err) {
      console.error('Failed to load pricing tiers in admin:', err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchQueues();
    fetchPricing();
  }, []);

  const handleVerifyDoctor = async (doctorId: string, action: 'APPROVE' | 'REJECT' | 'OUTDATED') => {
    try {
      setProcessingId(doctorId);
      await api.verifyDoctor(doctorId, action, 'Chief Medical Registrar');
      await onRefresh();
      await fetchStats();
    } catch (err: any) {
      alert(err.message || 'Error updating doctor verification');
    } finally {
      setProcessingId(null);
    }
  };

  const handleVerifyHospital = async (hospitalId: string, action: 'APPROVE' | 'REJECT') => {
    try {
      setProcessingId(hospitalId);
      await api.verifyHospital(hospitalId, action, 'Platform Healthcare Auditor');
      await onRefresh();
      await fetchStats();
    } catch (err: any) {
      alert(err.message || 'Error updating hospital verification');
    } finally {
      setProcessingId(null);
    }
  };

  const handleUpdatePrice = async (planName: string, period: string) => {
    if (!newTierPrice) return;
    try {
      await api.updatePricingTier(planName, Number(newTierPrice), period);
      setEditingTierName(null);
      setNewTierPrice('');
      await fetchPricing();
    } catch (err: any) {
      alert(err.message || 'Failed to update pricing tier');
    }
  };

  const handleSendTestSMS = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog = {
      id: `log-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      phone: testPhone,
      message: testMsg,
      gateway: 'TRAI-DLT Compliant (Sandbox Mode)',
      status: 'DISPATCH_ACKNOWLEDGED',
    };
    setGatewayLogs(prev => [newLog, ...prev]);
    alert(`[SMS GATEWAY DISPATCH]\nRecipient: ${testPhone}\nContent: "${testMsg}"\nCarrier Response: 200 OK — Delivered to Telecom Operator Simulator.`);
  };

  const handleRegisterDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.registerDoctor({
        name: docName,
        email: docEmail,
        phone: docPhone,
        medicalRegistrationNumber: docRegNum,
        registrationCouncil: docCouncil,
        specialization: docSpecialization,
        clinicAddress: docAddress,
        city: 'Vijayawada',
        state: 'Andhra Pradesh',
        consultationFee: docFee,
        qualifications: ['MBBS', 'MD'],
      });

      setRegSuccess(`Registration submitted! Provider placed in PENDING_VERIFICATION queue for official council audit.`);
      setDocName('');
      setDocEmail('');
      setDocPhone('');
      setDocRegNum('');
      onRefresh();
      fetchStats();
    } catch (err: any) {
      alert(err.message || 'Error registering doctor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Complete Breadcrumb & Page Header */}
      <PageHeader
        title="Platform Administration & Provider Audits"
        subtitle="Enforce medical license verification with State Medical Councils before granting public booking seals."
        badge="Medical Registrar Administration"
        badgeColor="text-purple-600 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800"
        onBack={onBack}
        onHome={onHome}
        onDashboard={onDashboard}
        userRole={userRole}
        icon={ShieldAlert}
        actionButton={
          <button
            onClick={() => {
              fetchStats();
              fetchQueues();
              fetchPricing();
              onRefresh();
            }}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 hover:bg-slate-50 cursor-pointer shadow-2xs"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Admin Registry</span>
          </button>
        }
      />

      {/* Metrics Row */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Verified Doctors
            </span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {stats.verifiedDoctors} / {stats.totalDoctors}
            </div>
            <div className="text-[11px] text-amber-600 font-semibold mt-1">
              {stats.pendingDoctors} Pending Audit
            </div>
          </div>

          <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Verified Hospitals
            </span>
            <div className="text-2xl font-black text-sky-600 dark:text-sky-400 mt-1">
              {stats.verifiedHospitals} / {stats.totalHospitals}
            </div>
            <div className="text-[11px] text-amber-600 font-semibold mt-1">
              {stats.pendingHospitals} Pending Audit
            </div>
          </div>

          <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Confirmed Consultations
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {stats.confirmedAppointments}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              {stats.cancelledAppointments} Cancelled
            </div>
          </div>

          <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Registered Patients
            </span>
            <div className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-1">
              {stats.totalPatients}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">
              DPDP Consents Validated
            </div>
          </div>
        </div>
      )}

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: 'doctors', label: `Doctor Audits (${doctors.length})` },
          { id: 'hospitals', label: `Hospital Audits (${hospitals.length})` },
          { id: 'queues', label: `Live OPD Queues (${allTokens.length})` },
          { id: 'gateway', label: 'SMS & Notifications' },
          { id: 'pricing', label: 'Subscription Pricing' },
          { id: 'register', label: '+ Register New Doctor' },
          { id: 'audit', label: 'Security & Audit Logs' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setAdminTab(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              adminTab === tab.id
                ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-900 dark:text-purple-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* DOCTOR AUDIT WORKFLOW */}
      {adminTab === 'doctors' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Medical Practitioner Verification Queue
            </h3>
            <span className="text-xs text-slate-500">
              Doctors with <code>PENDING_VERIFICATION</code> cannot receive confirmed public bookings until approved.
            </span>
          </div>

          <div className="space-y-3">
            {doctors.map((doc) => {
              const isPending = doc.verification_status === 'PENDING_VERIFICATION';
              const isVerified = doc.verification_status === 'VERIFIED';

              return (
                <div
                  key={doc.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5">
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        {doc.name}
                      </h4>
                      <VerificationBadge
                        status={doc.verification_status}
                        lastVerifiedDate={doc.last_verified_at}
                        size="sm"
                      />
                    </div>
                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                      <span>Spec: <strong>{doc.specialization}</strong></span>
                      <span>•</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                        {doc.medical_registration_number}
                      </span>
                      <span>•</span>
                      <span>{doc.registration_council}</span>
                      <span>•</span>
                      <span>{doc.city}, {doc.state}</span>
                    </div>
                  </div>

                  {/* Registrar Decision Actions */}
                  <div className="flex items-center gap-2 self-end md:self-auto">
                    {doc.verification_status !== 'VERIFIED' && (
                      <button
                        onClick={() => handleVerifyDoctor(doc.id, 'APPROVE')}
                        disabled={processingId === doc.id}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve & Verify</span>
                      </button>
                    )}

                    {doc.verification_status === 'VERIFIED' && (
                      <button
                        onClick={() => handleVerifyDoctor(doc.id, 'OUTDATED')}
                        disabled={processingId === doc.id}
                        className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold text-xs cursor-pointer"
                      >
                        Mark Outdated
                      </button>
                    )}

                    {doc.verification_status !== 'NOT_VERIFIED' && (
                      <button
                        onClick={() => handleVerifyDoctor(doc.id, 'REJECT')}
                        disabled={processingId === doc.id}
                        className="px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 font-semibold text-xs cursor-pointer"
                      >
                        Revoke / Reject
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* HOSPITAL AUDIT WORKFLOW */}
      {adminTab === 'hospitals' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Hospital Institutional Verification Queue
            </h3>
          </div>

          <div className="space-y-3">
            {hospitals.map((hosp) => (
              <div
                key={hosp.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {hosp.name}
                    </h4>
                    <VerificationBadge
                      status={hosp.verification_status}
                      lastVerifiedDate={hosp.last_verified_at}
                      size="sm"
                    />
                  </div>
                  <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                    <span>{hosp.address}, {hosp.city}</span>
                    <span>•</span>
                    <span>Emergency: <strong>{hosp.emergency_phone}</strong></span>
                    <span>•</span>
                    <span>{hosp.departments.slice(0, 3).join(', ')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto">
                  {hosp.verification_status !== 'VERIFIED' ? (
                    <button
                      onClick={() => handleVerifyHospital(hosp.id, 'APPROVE')}
                      disabled={processingId === hosp.id}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve Hospital</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleVerifyHospital(hosp.id, 'REJECT')}
                      disabled={processingId === hosp.id}
                      className="px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 font-semibold text-xs cursor-pointer"
                    >
                      Unverify
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LIVE OPD QUEUE MONITOR */}
      {adminTab === 'queues' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-600" />
                <span>Live Hospital OPD Queue Monitor (Central Command)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Real-time visibility into active OPD consultation queues across partner healthcare centers.
              </p>
            </div>
            <button
              onClick={fetchQueues}
              className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${loadingQueues ? 'animate-spin' : ''}`} />
              <span>Refresh Queues</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hospitals.map(hosp => {
              const hospTokens = allTokens.filter(t => (t.hospital_id || t.hospitalId) === hosp.id);
              const servingToken = hospTokens.find(t => String(t.status).toUpperCase() === 'SERVING');
              const waitingTokens = hospTokens.filter(t => String(t.status).toUpperCase() === 'WAITING');

              return (
                <div
                  key={hosp.id}
                  className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{hosp.name}</h4>
                      <span className="text-xs text-slate-400">{hosp.city}, {hosp.state}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-[10px] font-bold">
                      {hospTokens.length} Tokens
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Now Serving</span>
                      <div className="text-lg font-black text-teal-600 mt-0.5">
                        {servingToken ? `#${servingToken.token_number || servingToken.tokenNumber}` : '—'}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Waiting</span>
                      <div className="text-lg font-black text-sky-600 mt-0.5">
                        {waitingTokens.length}
                      </div>
                    </div>
                  </div>

                  {hospTokens.length > 0 ? (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-700 space-y-1.5 max-h-40 overflow-y-auto">
                      {hospTokens.map(tok => (
                        <div
                          key={tok.id}
                          className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-50 dark:bg-slate-900/40"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold font-mono text-slate-800 dark:text-slate-200">
                              #{tok.token_number || tok.tokenNumber}
                            </span>
                            <span className="text-slate-600 dark:text-slate-300 truncate max-w-[110px]">
                              {tok.patient_name || tok.patientName}
                            </span>
                          </div>
                          <span
                            className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase ${
                              String(tok.status).toUpperCase() === 'SERVING'
                                ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                                : String(tok.status).toUpperCase() === 'WAITING'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {tok.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="pt-2 text-[11px] text-slate-400 italic text-center">
                      No active tokens in queue today.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SMS & NOTIFICATION GATEWAY DIAGNOSTICS */}
      {adminTab === 'gateway' && (
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-slate-900 text-white border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-400">
                <Smartphone className="w-4 h-4" />
                <span>TRAI DLT-Compliant SMS & Push Gateway</span>
              </div>
              <h3 className="text-lg font-bold">Carrier Dispatch Transparency Console</h3>
              <p className="text-xs text-slate-300 max-w-xl">
                Universal Health Care AI enforces strict patient notification consent. Deliveries are dispatched through verified telecom SMS operators with verified DLT headers (e.g., <code>UHC-IND</code>).
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 px-4 py-2 rounded-2xl text-xs space-y-0.5">
              <div className="text-slate-400">Gateway Environment:</div>
              <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>TELECOM SIMULATOR (Transparent Mode)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Patient Delivery Consent</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">100%</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Explicit opt-in required at booking</div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Advance Notification Windows</span>
              <div className="text-2xl font-black text-sky-600 mt-1">4 Schedules</div>
              <div className="text-[11px] text-slate-500 mt-0.5">30m, 15m, 10m, and 5m tokens</div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">DLT Template Compliance</span>
              <div className="text-2xl font-black text-teal-600 mt-1">Approved</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Critical Healthcare Priority Category</div>
            </div>
          </div>

          {/* Test SMS Dispatcher */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-sky-600" />
              <span>Carrier Dispatch Diagnostic Test (DLT Template Verification)</span>
            </h4>

            <form onSubmit={handleSendTestSMS} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Recipient Indian Mobile (+91)
                </label>
                <input
                  type="text"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-medium"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Pre-Approved Template Message Content
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testMsg}
                    onChange={(e) => setTestMsg(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold whitespace-nowrap cursor-pointer shadow-sm"
                  >
                    Test Dispatch
                  </button>
                </div>
              </div>
            </form>

            {/* Gateway Dispatch Audit Log */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
              <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Gateway Dispatch Activity Log:
              </h5>
              <div className="space-y-2">
                {gatewayLogs.map(log => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs font-mono"
                  >
                    <div className="space-y-0.5">
                      <div className="text-slate-900 dark:text-slate-100">
                        {log.phone} — &ldquo;{log.message}&rdquo;
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Gateway: {log.gateway}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                        {log.status}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1">{log.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBSCRIPTION PRICING MANAGEMENT */}
      {adminTab === 'pricing' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-teal-600" />
                <span>Platform Software Subscription Rate Controls</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Configure baseline software package rates. Patient consultation fees strictly have a 0% platform surcharge.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pricingTiers.map((tier: any) => {
              const isEditing = editingTierName === tier.name;

              return (
                <div
                  key={tier.name}
                  className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-base">{tier.name}</h4>
                      <span className="text-xs text-slate-400 font-medium">Billing Period: {tier.period}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-[10px] font-bold">
                      Active
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Rate</span>
                    {isEditing ? (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-slate-700">₹</span>
                        <input
                          type="number"
                          value={newTierPrice}
                          onChange={(e) => setNewTierPrice(e.target.value)}
                          className="w-24 px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-sm font-bold font-mono"
                          autoFocus
                        />
                        <button
                          onClick={() => handleUpdatePrice(tier.name, tier.period)}
                          className="px-2 py-1 rounded-lg bg-teal-600 text-white text-xs font-bold cursor-pointer"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingTierName(null)}
                          className="px-2 py-1 rounded-lg border border-slate-300 text-xs font-semibold cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-baseline justify-between mt-1">
                        <div className="text-2xl font-black text-slate-900 dark:text-white">
                          {tier.price === 0 ? 'Free' : `₹${tier.price.toLocaleString('en-IN')}`}
                        </div>
                        <button
                          onClick={() => {
                            setEditingTierName(tier.name);
                            setNewTierPrice(String(tier.price));
                          }}
                          className="text-xs text-teal-600 hover:text-teal-700 font-semibold cursor-pointer"
                        >
                          Change Rate
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-500 space-y-1">
                    {tier.features.slice(0, 3).map((f: string) => (
                      <div key={f} className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-teal-600 flex-shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* REGISTER NEW DOCTOR FORM */}
      {adminTab === 'register' && (
        <div className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Register New Healthcare Provider
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Submit doctor registration details. The provider status is strictly initialized as <code>PENDING_VERIFICATION</code> until council credentials are authenticated.
            </p>
          </div>

          {regSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{regSuccess}</span>
            </div>
          )}

          <form onSubmit={handleRegisterDoctorSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Doctor Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Haritha Krishna, MD"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Official Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="doctor@hospital.org"
                  value={docEmail}
                  onChange={(e) => setDocEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Medical Registration Number (MCI / State Council)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. APMC/DOC/68924"
                  value={docRegNum}
                  onChange={(e) => setDocRegNum(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  State Medical Council
                </label>
                <select
                  value={docCouncil}
                  onChange={(e) => setDocCouncil(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-semibold"
                >
                  <option value="Andhra Pradesh Medical Council">Andhra Pradesh Medical Council (APMC)</option>
                  <option value="Telangana State Medical Council">Telangana State Medical Council (TSMC)</option>
                  <option value="Karnataka Medical Council">Karnataka Medical Council (KMC)</option>
                  <option value="Maharashtra Medical Council">Maharashtra Medical Council (MMC)</option>
                  <option value="Delhi Medical Council">Delhi Medical Council (DMC)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Specialization
                </label>
                <select
                  value={docSpecialization}
                  onChange={(e) => setDocSpecialization(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-semibold"
                >
                  <option value="Cardiology">Cardiology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="General Medicine">General Medicine</option>
                  <option value="Gynecology">Obstetrics & Gynecology</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Consultation Fee (INR)
                </label>
                <input
                  type="number"
                  value={docFee}
                  onChange={(e) => setDocFee(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Clinic Address & City
              </label>
              <input
                type="text"
                value={docAddress}
                onChange={(e) => setDocAddress(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-medium"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md"
              >
                {loading ? 'Submitting...' : 'Register Provider (Starts as Pending)'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* AUDIT LOGS FEED */}
      {adminTab === 'audit' && (
        <div className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 space-y-4 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Administrative Audit & Compliance Trail
          </h3>

          <div className="space-y-2.5">
            {(stats?.auditLogs || []).map((log: any) => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 dark:text-white">
                    {log.action} — <span className="text-sky-600 dark:text-sky-400">{log.target}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Audited by: {log.admin_name}
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                    {log.status}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

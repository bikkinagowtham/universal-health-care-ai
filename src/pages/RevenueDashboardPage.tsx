import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  ShieldCheck,
  Check,
  AlertCircle,
  Building,
  UserCheck,
  Receipt,
  FileCheck,
  Lock,
  Edit3,
  Save,
  X,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../services/api';
import { PageHeader } from '../components/common/PageHeader';
import { UserRole } from '../types';
import { useTranslation } from '../i18n/LanguageContext';

interface Props {
  onBack?: () => void;
  onHome?: () => void;
  onDashboard?: () => void;
  userRole?: UserRole;
}

interface PlanDefinition {
  id: string;
  category: 'PATIENT' | 'DOCTOR' | 'HOSPITAL';
  name: string;
  monthlyPrice: number;
  popular?: boolean;
  features: string[];
  limitations?: string[];
}

const ALL_PLANS: PlanDefinition[] = [
  // --- PATIENT PLANS ---
  {
    id: 'pat-free',
    category: 'PATIENT',
    name: 'Patient Free Basic',
    monthlyPrice: 0,
    features: [
      'Unlimited verified doctor search across all 28 states & 8 UTs',
      'Direct guaranteed appointment booking & instant reference ID',
      'Live hospital OPD token status tracker',
      'Emergency 108/112 routing with zero ads',
    ],
    limitations: ['Standard text AI queries', '1 household medical record vault profile'],
  },
  {
    id: 'pat-plus',
    category: 'PATIENT',
    name: 'Patient Plus Care',
    monthlyPrice: 99,
    popular: true,
    features: [
      'All Free Basic features included',
      'Priority OPD queue advance SMS & in-app alerts (30m, 20m, 15m, 10m, 5m)',
      'Up to 5 family member profiles in cloud medical vault',
      'Comprehensive voice assistant with regional Telugu & Hindi recognition',
      'Automated lab report PDF parsing & timeline tracker',
    ],
  },
  {
    id: 'pat-family',
    category: 'PATIENT',
    name: 'Patient Family Care',
    monthlyPrice: 249,
    features: [
      'All Plus Care features included',
      'Unlimited family profiles with multi-device sync',
      'Dedicated care concierge hotline for hospital admission assistance',
      'Priority slot waitlist auto-allocation upon cancellation',
      'Lifetime digital health record backup with encrypted export',
    ],
  },

  // --- DOCTOR PLANS ---
  {
    id: 'doc-starter',
    category: 'DOCTOR',
    name: 'Doctor Free Starter',
    monthlyPrice: 0,
    features: [
      'State Medical Council verified profile badge listing',
      'Standard online appointment calendar with double-booking lock',
      '100% of patient consultation fees deposited directly (0% commission)',
      'Patient symptom notes prior to appointment',
    ],
    limitations: ['Single clinic location', 'Manual walk-in queue entry'],
  },
  {
    id: 'doc-verified',
    category: 'DOCTOR',
    name: 'Doctor Verified Practice',
    monthlyPrice: 499,
    popular: true,
    features: [
      'All Starter features with Verified Specialist prominence in search',
      'Integrated OPD digital token board for waiting room display',
      'Automated SMS notifications to queued patients before consultation',
      'Tele-consultation video slot scheduling with WhatsApp reminders',
      '0% commission on all doctor consultation fees',
    ],
  },
  {
    id: 'doc-pro',
    category: 'DOCTOR',
    name: 'Clinic Pro & Multi-Doctor',
    monthlyPrice: 1499,
    features: [
      'Multi-doctor schedule management for up to 5 associates',
      'Receptionist staff account with custom billing & queue privileges',
      'Automated digital prescription pad with state council registration header',
      'Comprehensive clinic analytics (patient return rate, revenue, peak OPD hours)',
      '0% commission charter guarantee',
    ],
  },

  // --- HOSPITAL PLANS ---
  {
    id: 'hosp-base',
    category: 'HOSPITAL',
    name: 'Base Hospital Network',
    monthlyPrice: 4999,
    features: [
      'Verified institution listing with accreditation badges (NABH/ISO)',
      'Up to 15 doctor rosters across emergency, outpatient, and surgery',
      'Centralized OPD queue display URL for TV waiting room monitors',
      'Hospital profile with bed capacity and emergency casualty direct line',
    ],
  },
  {
    id: 'hosp-enterprise',
    category: 'HOSPITAL',
    name: 'Enterprise Digital OPD',
    monthlyPrice: 14999,
    popular: true,
    features: [
      'Unlimited departments, doctors, and multi-campus token counters',
      'Carrier-grade SMS gateway integration for all walk-in & booked patients',
      'Live ICU & general bed capacity indicator controls',
      'Departmental triage & emergency transfer audit reporting',
      'Dedicated compliance manager and 99.9% uptime SLA',
    ],
  },
];

interface Transaction {
  id: string;
  customerName: string;
  planName: string;
  category: string;
  amount: number;
  date: string;
  status: 'COMPLETED' | 'REFUNDED';
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 'TXN-9021', customerName: 'Gowtham Bikkina', planName: 'Patient Plus Care', category: 'Patient', amount: 99, date: '2026-11-04', status: 'COMPLETED' },
  { id: 'TXN-9020', customerName: 'Apex Hospital, Rajahmundry', planName: 'Enterprise Digital OPD', category: 'Hospital', amount: 14999, date: '2026-11-03', status: 'COMPLETED' },
  { id: 'TXN-9019', customerName: 'Dr. Ramesh Chandra, DM', planName: 'Doctor Verified Practice', category: 'Doctor', amount: 499, date: '2026-11-02', status: 'COMPLETED' },
  { id: 'TXN-9018', customerName: 'KIMS Hospitals, Secunderabad', planName: 'Enterprise Digital OPD', category: 'Hospital', amount: 14999, date: '2026-11-01', status: 'COMPLETED' },
  { id: 'TXN-9017', customerName: 'Suresh Kumar', planName: 'Patient Family Care', category: 'Patient', amount: 249, date: '2026-10-31', status: 'REFUNDED' },
  { id: 'TXN-9016', customerName: 'Dr. Praveen Shenoy, MS', planName: 'Clinic Pro', category: 'Doctor', amount: 1499, date: '2026-10-30', status: 'COMPLETED' },
  { id: 'TXN-9015', customerName: 'Care Hospitals, Visakhapatnam', planName: 'Base Hospital Network', category: 'Hospital', amount: 4999, date: '2026-10-29', status: 'COMPLETED' },
];

export const RevenueDashboardPage: React.FC<Props> = ({
  onBack,
  onHome,
  onDashboard,
  userRole,
}) => {
  const { t, language } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'PATIENT' | 'DOCTOR' | 'HOSPITAL' | 'ADMIN'>('ALL');
  const [checkoutModal, setCheckoutModal] = useState<PlanDefinition | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [refundSuccessMsg, setRefundSuccessMsg] = useState<string | null>(null);

  const loadRevenue = async () => {
    try {
      const res = await api.getRevenueSummary();
      setData(res);
    } catch (err) {
      console.error('Failed to load revenue summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRevenue();
  }, []);

  const handleProcessRefund = (txnId: string) => {
    setTransactions(prev =>
      prev.map(t => (t.id === txnId ? { ...t, status: 'REFUNDED' as const } : t))
    );
    setRefundSuccessMsg(`Refund of transaction ${txnId} successfully processed and credited.`);
    setTimeout(() => setRefundSuccessMsg(null), 3500);
  };

  const filteredPlans = ALL_PLANS.filter(plan => {
    if (selectedCategory === 'ALL') return true;
    return plan.category === selectedCategory;
  });

  const financialMetrics = data?.financialMetrics || {
    grossPlatformRevenue: 342800,
    subscriptionRevenue: 284500,
    platformServiceFees: 58300,
    operatingExpenses: 112400,
    refundsIssued: 4200,
    netOperatingProfit: 226200,
    activePaidSubscribers: 384,
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Page Header */}
      <PageHeader
        title={t('revenue.title')}
        subtitle={t('revenue.subtitle')}
        badge="Healthcare Economics & 0% Doctor Commission Charter"
        badgeColor="text-teal-600 bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-800"
        onBack={onBack}
        onHome={onHome}
        onDashboard={onDashboard}
        userRole={userRole}
        icon={DollarSign}
        actionButton={
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3.5 py-1.5 rounded-2xl text-xs font-bold text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>0% Commission Guarantee</span>
          </div>
        }
      />

      {/* Zero-Commission Medical Ethics Charter Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-lg space-y-2">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>{t('revenue.zeroCommissionCharter')}</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
          {t('revenue.charterDesc')}
        </p>
      </div>

      {/* Main Tabs: All, Patient, Doctor, Hospital, Platform Administrator */}
      <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { id: 'ALL', label: 'All Plans' },
            { id: 'PATIENT', label: t('revenue.patientPlans') },
            { id: 'DOCTOR', label: t('revenue.doctorPlans') },
            { id: 'HOSPITAL', label: t('revenue.hospitalPlans') },
            { id: 'ADMIN', label: t('revenue.adminDashboard') },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id as any)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Monthly vs Annual Toggle */}
        {selectedCategory !== 'ADMIN' && (
          <div className="inline-flex items-center gap-1.5 p-1 rounded-2xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-white dark:bg-slate-900 text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('revenue.monthly')}
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                billingCycle === 'annual'
                  ? 'bg-white dark:bg-slate-900 text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{t('revenue.annual')}</span>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-black uppercase">
                {t('revenue.save15')}
              </span>
            </button>
          </div>
        )}
      </div>

      {refundSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{refundSuccessMsg}</span>
        </div>
      )}

      {/* PLATFORM ADMINISTRATOR REVENUE & REFUND DASHBOARD */}
      {selectedCategory === 'ADMIN' ? (
        <div className="space-y-6">
          {/* Top Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {t('revenue.grossRevenue')}
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                ₹{financialMetrics.grossPlatformRevenue.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +14.2% MoM (Software Subscriptions)
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {t('revenue.operationalCost')}
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                ₹{financialMetrics.operatingExpenses.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-1">
                Cloud, Twilio/SMS, Compliance
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {t('revenue.refundsIssued')}
              </span>
              <div className="text-2xl font-black text-rose-600 mt-1">
                ₹{financialMetrics.refundsIssued.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-1">
                1.2% Refund rate
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {t('revenue.netProfit')}
              </span>
              <div className="text-2xl font-black text-teal-600 mt-1">
                ₹{financialMetrics.netOperatingProfit.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-teal-700 font-semibold mt-1">
                66% Sustainable Margin
              </div>
            </div>
          </div>

          {/* Transactions & Refund Management Table */}
          <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-blue-600" />
                  {t('revenue.transactionTracking')}
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time ledger of institutional and individual software subscription payments and dispute resolution.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-500">
                {transactions.length} Transactions Logged
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Txn ID</th>
                    <th className="py-3 px-4">Customer Name</th>
                    <th className="py-3 px-4">Plan Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Refund Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {transactions.map(txn => (
                    <tr key={txn.id} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{txn.id}</td>
                      <td className="py-3.5 px-4 text-slate-800 font-semibold">{txn.customerName}</td>
                      <td className="py-3.5 px-4 text-slate-600">{txn.planName}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {txn.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">₹{txn.amount.toLocaleString('en-IN')}</td>
                      <td className="py-3.5 px-4 text-slate-500">{txn.date}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            txn.status === 'COMPLETED'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {txn.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {txn.status === 'COMPLETED' ? (
                          <button
                            onClick={() => handleProcessRefund(txn.id)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
                          >
                            {t('revenue.processRefund')}
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-semibold italic">
                            Refund Complete
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* PRICING CARDS GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map(plan => {
            const isFree = plan.monthlyPrice === 0;
            const annualCost = Math.round(plan.monthlyPrice * 12 * 0.85);
            const displayPrice = isFree
              ? '₹0'
              : billingCycle === 'annual'
              ? `₹${annualCost.toLocaleString('en-IN')}`
              : `₹${plan.monthlyPrice.toLocaleString('en-IN')}`;
            const displayPeriod = isFree ? 'Forever Free' : billingCycle === 'annual' ? '/ year' : '/ month';

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all relative ${
                  plan.popular
                    ? 'bg-gradient-to-b from-blue-900 to-slate-900 text-white shadow-xl border-2 border-teal-400'
                    : 'bg-white border border-slate-200 text-slate-900 shadow-xs hover:shadow-md'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-teal-400 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-sm">
                    Most Popular
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block ${plan.popular ? 'text-teal-300' : 'text-slate-400'}`}>
                      {plan.category} PACKAGE
                    </span>
                    <h3 className="text-xl font-bold mt-0.5">{plan.name}</h3>

                    <div className="flex items-baseline gap-1.5 mt-3">
                      <span className="text-3xl sm:text-4xl font-extrabold">{displayPrice}</span>
                      <span className={`text-xs ${plan.popular ? 'text-blue-200' : 'text-slate-500'}`}>
                        {displayPeriod}
                      </span>
                    </div>
                    {billingCycle === 'annual' && !isFree && (
                      <div className="text-[11px] text-emerald-400 font-semibold mt-1">
                        Includes 15% annual prepaid savings
                      </div>
                    )}
                  </div>

                  {/* Feature List */}
                  <div className={`space-y-2.5 pt-4 border-t text-xs ${plan.popular ? 'border-white/10' : 'border-slate-100'}`}>
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.popular ? 'text-teal-300' : 'text-emerald-600'}`} />
                        <span className={plan.popular ? 'text-blue-100' : 'text-slate-700'}>{feat}</span>
                      </div>
                    ))}
                    {plan.limitations?.map((lim, i) => (
                      <div key={i} className="flex items-start gap-2 opacity-60">
                        <X className="w-4 h-4 flex-shrink-0 mt-0.5 text-slate-400" />
                        <span className={plan.popular ? 'text-blue-200' : 'text-slate-500'}>{lim}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100/10">
                  <button
                    onClick={() => setCheckoutModal(plan)}
                    className={`w-full py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                      plan.popular
                        ? 'bg-teal-400 hover:bg-teal-300 text-slate-950 shadow-md'
                        : isFree
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <span>{isFree ? 'Get Started Free' : t('revenue.subscribeNow')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Checkout Simulator Modal */}
      {checkoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Sandbox Subscription Activation
              </h3>
              <button
                onClick={() => setCheckoutModal(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-slate-600">
              Activating subscription: <strong className="text-slate-900">{checkoutModal.name}</strong> for{' '}
              <strong className="text-slate-900">
                ₹{billingCycle === 'annual' ? Math.round(checkoutModal.monthlyPrice * 12 * 0.85) : checkoutModal.monthlyPrice}{' '}
                {billingCycle === 'annual' ? '/ year' : '/ month'}
              </strong>
            </p>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Platform Commission:</span>
                <span className="text-emerald-700 font-bold">₹0.00 (Zero Doctor Fee Cut)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Billing Cadence:</span>
                <span className="font-semibold text-slate-800">{billingCycle === 'annual' ? 'Annual (15% Saved)' : 'Monthly'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Payment Channel:</span>
                <span className="font-semibold text-slate-800">Unified UPI / NetBanking Sandbox</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setCheckoutModal(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Sandbox subscription to "${checkoutModal.name}" activated! All premium software features enabled.`);
                  setCheckoutModal(null);
                }}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
              >
                Confirm Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

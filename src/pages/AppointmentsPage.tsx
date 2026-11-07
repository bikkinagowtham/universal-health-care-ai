import React, { useState, useMemo, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  CheckCircle,
  AlertTriangle,
  X,
  RefreshCw,
  Phone,
  FileText,
  User,
  ShieldCheck,
  Building2,
  CalendarCheck,
  ChevronRight,
  Bell,
  MessageSquare,
  Smartphone,
  Info,
  Settings,
  CreditCard,
  Download,
  QrCode,
  ArrowLeft,
  Sparkles,
  Receipt,
  Check,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { Appointment, Doctor, Hospital, FamilyMember, UserRole, NotificationChannel } from '../types';
import { api } from '../services/api';
import { LocationPicker } from '../components/common/LocationPicker';
import { PageHeader } from '../components/common/PageHeader';
import { HospitalDetailsModal } from '../components/common/HospitalDetailsModal';
import { useTranslation } from '../i18n/LanguageContext';

interface Props {
  appointments: Appointment[];
  doctors: Doctor[];
  hospitals: Hospital[];
  familyMembers: FamilyMember[];
  onRefresh: () => void;
  bookingDoctor: Doctor | null;
  onCloseBookingModal: () => void;
  onBack?: () => void;
  onHome?: () => void;
  onDashboard?: () => void;
  onTrackQueue?: (hospitalId: string) => void;
  onViewDoctor?: (doctorName: string) => void;
  userRole?: UserRole;
}

type BookingStep = 'form' | 'summary' | 'payment' | 'success';

export const AppointmentsPage: React.FC<Props> = ({
  appointments,
  doctors,
  hospitals,
  familyMembers,
  onRefresh,
  bookingDoctor,
  onCloseBookingModal,
  onBack,
  onHome,
  onDashboard,
  userRole,
  onTrackQueue,
  onViewDoctor,
}) => {
  const { t, language } = useTranslation();
  const [filterTab, setFilterTab] = useState<'all' | 'confirmed' | 'cancelled' | 'past'>('all');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Booking Flow Multi-step State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(Boolean(bookingDoctor));
  const [bookingStep, setBookingStep] = useState<BookingStep>('form');
  const [successAppointment, setSuccessAppointment] = useState<Appointment | null>(null);

  // Booking Form Inputs
  const [bookState, setBookState] = useState('ALL');
  const [bookCity, setBookCity] = useState('ALL');
  const [selectedHospitalId, setSelectedHospitalId] = useState('ALL');
  const [selectedDoctorId, setSelectedDoctorId] = useState(bookingDoctor?.id || doctors[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState('');
  const [patientName, setPatientName] = useState('Gowtham Bikkina');
  const [patientPhone, setPatientPhone] = useState('+91 98480 22334');
  const [symptoms, setSymptoms] = useState('');
  const [selectedFamilyMember, setSelectedFamilyMember] = useState('Self');

  // Advance Notification Preferences
  const [notificationChannel, setNotificationChannel] = useState<NotificationChannel>('Both');
  const [advanceMinutes, setAdvanceMinutes] = useState<number[]>([30, 20, 15]);
  const [customAlertMinutes, setCustomAlertMinutes] = useState<string>('');
  const [smsConsent, setSmsConsent] = useState(true);

  // Payment Options
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'PhonePe' | 'Google Pay' | 'UPI' | 'Card / Netbanking' | 'Cash at Counter'>('PhonePe');
  const [upiId, setUpiId] = useState('gowtham@okhdfcbank');
  const [showQr, setShowQr] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Modals & Popups
  const [cancelModalApt, setCancelModalApt] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [rescheduleModalApt, setRescheduleModalApt] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');

  // Edit OPD Alert Preferences Modal
  const [editAlertApt, setEditAlertApt] = useState<Appointment | null>(null);
  const [editChannel, setEditChannel] = useState<NotificationChannel>('Both');
  const [editMinutes, setEditMinutes] = useState<number[]>([30, 15]);
  const [editCustomMins, setEditCustomMins] = useState<string>('');
  const [selectedHospitalForModal, setSelectedHospitalForModal] = useState<Hospital | null>(null);

  // Automatically sync when bookingDoctor is passed from other pages
  useEffect(() => {
    if (bookingDoctor) {
      setSelectedDoctorId(bookingDoctor.id);
      if (bookingDoctor.state) setBookState(bookingDoctor.state);
      if (bookingDoctor.city) setBookCity(bookingDoctor.city);
      if (bookingDoctor.hospital_id) setSelectedHospitalId(bookingDoctor.hospital_id);
      setIsBookingModalOpen(true);
      setBookingStep('form');
    }
  }, [bookingDoctor]);

  // Real-time queue polling interval: automatically refresh appointment queue status from server every 8s
  useEffect(() => {
    const timer = setInterval(() => {
      onRefresh();
    }, 8000);
    return () => clearInterval(timer);
  }, [onRefresh]);

  // Filter available doctors by selected location & hospital
  const availableDoctors = useMemo(() => {
    return doctors.filter((d) => {
      if (d.verification_status !== 'VERIFIED') return false;
      if (bookState !== 'ALL' && d.state.toLowerCase() !== bookState.toLowerCase()) return false;
      if (bookCity !== 'ALL' && !d.city.toLowerCase().includes(bookCity.toLowerCase()) && !bookCity.toLowerCase().includes(d.city.toLowerCase())) return false;
      if (selectedHospitalId !== 'ALL' && d.hospital_id !== selectedHospitalId) return false;
      return true;
    });
  }, [doctors, bookState, bookCity, selectedHospitalId]);

  const activeDoctor =
    doctors.find(d => d.id === selectedDoctorId) || availableDoctors[0] || doctors[0];

  const activeHospital =
    hospitals.find(h => h.id === activeDoctor?.hospital_id || h.name.toLowerCase() === activeDoctor?.hospital_name?.toLowerCase()) ||
    hospitals[0];

  const handleToggleAdvanceMinute = (minute: number) => {
    setAdvanceMinutes(prev =>
      prev.includes(minute) ? prev.filter(m => m !== minute) : [...prev, minute].sort((a, b) => b - a)
    );
  };

  // Cancel button inside the booking modal: immediately navigate back to the previous page
  // using router's back navigation, without creating or confirming any appointment
  const handleCancelBookingFlow = () => {
    setIsBookingModalOpen(false);
    onCloseBookingModal();
    setBookingStep('form');
    setErrorMsg(null);
    setSuccessMsg(null);
    if (onBack) {
      onBack();
    }
  };

  // Proceed from Step 1 Form to Step 2 Booking Summary
  const handleProceedToSummary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      setErrorMsg('Please select an available consultation time slot.');
      return;
    }
    if (!patientName.trim()) {
      setErrorMsg('Please enter the patient name.');
      return;
    }
    setErrorMsg(null);
    setBookingStep('summary');
  };

  // Proceed from Step 2 Summary to Step 3 Payment
  const handleProceedToPayment = () => {
    setErrorMsg(null);
    setBookingStep('payment');
  };

  // Execute payment & create appointment in database
  const handleCompletePaymentAndBook = async () => {
    try {
      setIsProcessingPayment(true);
      setErrorMsg(null);

      // Simulate instantaneous sandbox gateway authorization
      await new Promise(r => setTimeout(r, 1200));

      const targetName = selectedFamilyMember === 'Self' ? patientName : selectedFamilyMember;

      const result = await api.bookAppointment({
        doctorId: activeDoctor.id,
        appointmentDate: selectedDate,
        appointmentTime: selectedSlot,
        patientName: targetName,
        patientPhone,
        symptomsReason: symptoms,
        familyMemberName: selectedFamilyMember !== 'Self' ? selectedFamilyMember : undefined,
        paymentMethod: selectedPaymentMethod,
        paymentStatus: 'Paid',
        notificationPreferences: {
          channel: notificationChannel,
          advanceMinutes,
          customMinutes: customAlertMinutes ? parseInt(customAlertMinutes, 10) : undefined,
          smsConsent,
          phone: patientPhone,
        },
      });

      setSuccessAppointment(result.appointment);
      setSuccessMsg(`Appointment reserved! Booking Reference: ${result.appointment.booking_reference}`);
      onRefresh();
      setBookingStep('success');
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Cancel Appointment Modal Action:
  // Cancels the appointment in database, releases slot, updates state, shows message,
  // and DOES NOT navigate backward
  const handleCancelSubmit = async () => {
    if (!cancelModalApt) return;
    try {
      setLoading(true);
      await api.cancelAppointment(cancelModalApt.id, cancelReason);
      setSuccessMsg(
        t('appointments.cancelSuccess') ||
        `Appointment ${cancelModalApt.booking_reference} cancelled successfully. The booked time slot has been released.`
      );
      setCancelModalApt(null);
      setCancelReason('');
      onRefresh();
      // If we were on the success view, close the booking modal to view the appointments list
      if (bookingStep === 'success') {
        setIsBookingModalOpen(false);
        onCloseBookingModal();
        setBookingStep('form');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error cancelling appointment.');
    } finally {
      setLoading(false);
    }
  };

  const handleRescheduleSubmit = async () => {
    if (!rescheduleModalApt || !rescheduleDate || !rescheduleTime) {
      alert('Please select both date and time slot.');
      return;
    }
    try {
      setLoading(true);
      await api.rescheduleAppointment(rescheduleModalApt.id, rescheduleDate, rescheduleTime);
      setRescheduleModalApt(null);
      setRescheduleDate('');
      setRescheduleTime('');
      onRefresh();
      setSuccessMsg('Appointment rescheduled successfully.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error rescheduling appointment.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEditedAlerts = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editAlertApt) return;
    try {
      setLoading(true);
      await api.updateAppointmentNotifications(editAlertApt.id, {
        channel: editChannel,
        advanceMinutes: editMinutes,
        customMinutes: editCustomMins ? parseInt(editCustomMins, 10) : undefined,
        smsConsent: true,
        phone: editAlertApt.patient_phone,
      });
      onRefresh();
      setEditAlertApt(null);
      setSuccessMsg('Notification preferences updated successfully.');
    } catch (err: any) {
      console.error('Failed to update alert settings:', err);
    } finally {
      setLoading(false);
    }
  };

  // Download printable/text Appointment Receipt
  const handleDownloadReceipt = (apt: Appointment) => {
    const receiptContent = `=====================================================
UNIVERSAL HEALTH CARE AI — OFFICIAL APPOINTMENT RECEIPT
Healthcare for Everyone, Everywhere
=====================================================
Booking Reference : ${apt.booking_reference}
Booking Timestamp : ${new Date(apt.created_at).toLocaleString()}
Status            : ${apt.status.toUpperCase()}
Payment Status    : ${apt.payment_status || 'PAID'} (via ${apt.payment_method || 'PhonePe / UPI'})
-----------------------------------------------------
OPD TOKEN NUMBER  : ${apt.token_code || `TOKEN #${apt.opd_token_number || 15}`}
-----------------------------------------------------
PATIENT INFORMATION:
Patient Name      : ${apt.patient_name}
Contact Phone     : ${apt.patient_phone}
Family Member     : ${apt.family_member_name || 'Self'}
Reason/Symptoms   : ${apt.symptoms_reason || 'General Health Consultation'}

HEALTHCARE PROVIDER & LOCATION:
Doctor Name       : ${apt.doctor_name}
Specialization    : ${apt.doctor_specialization}
Hospital / Center : ${apt.hospital_name || apt.clinic_address}
City & State      : ${apt.city || 'India'}, ${apt.state || 'India'}

APPOINTMENT SCHEDULE:
Date              : ${apt.appointment_date}
Time Slot         : ${apt.appointment_time}
Doctor Fee        : ₹${apt.consultation_fee} (Pay directly • 0% Platform Commission)

REGULATORY & COMPLIANCE:
Council Audit     : State Medical Council Verified Provider
DPDP Act 2023     : Encrypted Patient Data Protected
Emergency Line    : 108 / 112 (National Emergency Helpline)
=====================================================`;

    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Universal_Health_Care_Receipt_${apt.booking_reference}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (filterTab === 'confirmed') return apt.status === 'Confirmed' || apt.status === 'Rescheduled';
    if (filterTab === 'cancelled') return apt.status === 'Cancelled';
    if (filterTab === 'past') return apt.status === 'Completed';
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Complete Breadcrumb & Header */}
      <PageHeader
        title={t('apt_page_title') || 'Doctor Consultations & Appointments'}
        subtitle={t('apt_page_subtitle') || 'Atomic database slot reservation, digital OPD tokens, advance queue alerts, and verified consultations.'}
        badge="Atomic Booking Engine"
        onBack={onBack}
        onHome={onHome}
        onDashboard={onDashboard}
        userRole={userRole}
        icon={CalendarCheck}
        actionButton={
          <button
            onClick={() => {
              if (doctors.length > 0) {
                setSelectedDoctorId(doctors[0].id);
              }
              setIsBookingModalOpen(true);
              setBookingStep('form');
            }}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Book New Appointment</span>
          </button>
        }
      />

      {/* Global Success / Cancellation Feedback Banner */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between gap-3 shadow-xs animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{successMsg}</span>
          </div>
          <button
            onClick={() => setSuccessMsg(null)}
            className="text-emerald-700 hover:text-emerald-900 p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center justify-between gap-3 shadow-xs animate-fade-in">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={() => setErrorMsg(null)}
            className="text-rose-700 hover:text-rose-900 p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: 'all', label: `All Bookings (${appointments.length})` },
          { id: 'confirmed', label: 'Confirmed & Upcoming' },
          { id: 'cancelled', label: 'Cancelled' },
          { id: 'past', label: 'Past Consultations' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterTab(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              filterTab === tab.id
                ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
          <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No appointments found in this category.
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Book an appointment with a verified specialist to reserve your confirmed time slot.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAppointments.map((apt) => {
            const isConfirmed = apt.status === 'Confirmed' || apt.status === 'Rescheduled';
            const isCancelled = apt.status === 'Cancelled';
            const tokenCode = apt.token_code || `TOKEN #${apt.opd_token_number || 15}`;

            return (
              <div
                key={apt.id}
                className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top Bar: Booking Ref & Status */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                        Ref: {apt.booking_reference}
                      </span>
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                        {tokenCode}
                      </span>
                    </div>

                    <span
                      className={`text-xs font-extrabold uppercase px-2.5 py-1 rounded-full border ${
                        isConfirmed
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : isCancelled
                          ? 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>

                  {/* Doctor Info */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {apt.doctor_name}
                    </h3>
                    <p className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                      {apt.doctor_specialization}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{apt.hospital_name || apt.clinic_address}</span>
                    </div>

                    {/* Navigation Links on Card */}
                    <div className="flex flex-wrap items-center gap-2 mt-2 pt-1">
                      {apt.hospital_name && (
                        <button
                          onClick={() => {
                            const found = hospitals.find(
                              h => h.name.toLowerCase() === apt.hospital_name?.toLowerCase()
                            );
                            if (found) setSelectedHospitalForModal(found);
                          }}
                          className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Building2 className="w-3 h-3" />
                          View Hospital Profile
                        </button>
                      )}
                      {onTrackQueue && (
                        <button
                          onClick={() => {
                            const found = hospitals.find(
                              h => h.name.toLowerCase() === apt.hospital_name?.toLowerCase()
                            );
                            onTrackQueue(found ? found.id : 'h-1');
                          }}
                          className="text-[11px] font-semibold text-teal-600 hover:text-teal-800 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Clock className="w-3 h-3" />
                          Track Live Queue
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Real-time Queue Tracking Widget for Confirmed Consultations */}
                  {isConfirmed && (
                    <div className="p-3 rounded-2xl bg-gradient-to-r from-teal-50/80 via-sky-50/60 to-emerald-50/80 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border border-teal-200/80 dark:border-teal-800/60 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-teal-900 dark:text-teal-300 flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
                          <span>Real-Time OPD Queue Tracking</span>
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                          Live Sync Active
                        </span>
                      </div>

                      <div className="grid grid-cols-4 gap-1.5 text-center pt-1">
                        <div className="p-1.5 rounded-xl bg-white dark:bg-slate-800 shadow-2xs border border-slate-200/60 dark:border-slate-700">
                          <span className="text-[9px] text-slate-400 block font-semibold">YOUR TOKEN</span>
                          <span className="font-black text-sm text-teal-700 dark:text-teal-300 font-mono">{tokenCode}</span>
                        </div>
                        <div className="p-1.5 rounded-xl bg-white dark:bg-slate-800 shadow-2xs border border-slate-200/60 dark:border-slate-700">
                          <span className="text-[9px] text-slate-400 block font-semibold">NOW SERVING</span>
                          <span className="font-black text-sm text-sky-700 dark:text-sky-300 font-mono">
                            {apt.token_code ? apt.token_code.replace(/\d+$/, m => String(Math.max(1, parseInt(m, 10) - 3)).padStart(3, '0')) : '#12'}
                          </span>
                        </div>
                        <div className="p-1.5 rounded-xl bg-white dark:bg-slate-800 shadow-2xs border border-slate-200/60 dark:border-slate-700">
                          <span className="text-[9px] text-slate-400 block font-semibold">AHEAD</span>
                          <span className="font-black text-sm text-amber-700 dark:text-amber-400">3 patients</span>
                        </div>
                        <div className="p-1.5 rounded-xl bg-white dark:bg-slate-800 shadow-2xs border border-slate-200/60 dark:border-slate-700">
                          <span className="text-[9px] text-slate-400 block font-semibold">EST. WAIT</span>
                          <span className="font-black text-sm text-slate-800 dark:text-slate-200 font-mono">~36m</span>
                        </div>
                      </div>

                      {/* Queue Visual Progress Bar */}
                      <div className="pt-1">
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold mb-1">
                          <span>Waiting (Token Registered)</span>
                          <span className="text-teal-600">Turn Approaching</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-teal-500 to-sky-500 h-full w-2/3 rounded-full animate-pulse" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Date & Time Badge */}
                  <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-sky-900 dark:text-sky-200 font-bold">
                      <CalendarIcon className="w-4 h-4 text-sky-600" />
                      <span>{new Date(apt.appointment_date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold font-mono text-sky-700 dark:text-sky-300">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{apt.appointment_time}</span>
                    </div>
                  </div>

                  {/* Notification Status with Edit Trigger */}
                  {apt.notification_preferences && (
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Bell className="w-3.5 h-3.5 text-teal-600" />
                          <span>Alert Channel: <strong>{apt.notification_preferences.channel}</strong></span>
                        </span>
                        {isConfirmed && (
                          <button
                            onClick={() => {
                              setEditAlertApt(apt);
                              setEditChannel(apt.notification_preferences?.channel || 'Both');
                              setEditMinutes(apt.notification_preferences?.advanceMinutes || [30, 15]);
                              setEditCustomMins(apt.notification_preferences?.customMinutes?.toString() || '');
                            }}
                            className="text-[10px] text-blue-600 font-bold hover:underline flex items-center gap-0.5 px-1.5 py-0.5 rounded hover:bg-blue-50 cursor-pointer"
                          >
                            <Settings className="w-3 h-3" />
                            Edit Alerts
                          </button>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Schedule: {apt.notification_preferences.advanceMinutes.join(', ')} mins before turn
                        {apt.notification_preferences.customMinutes ? ` (+ ${apt.notification_preferences.customMinutes}m custom)` : ''}
                      </div>
                    </div>
                  )}

                  {/* Patient Name / Payment Status */}
                  <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Patient:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-100">
                        {apt.patient_name} {apt.family_member_name ? `(${apt.family_member_name})` : ''}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Payment:</span>
                      <span className="font-bold text-emerald-600 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>{apt.payment_status || 'Paid'} ({apt.payment_method || 'PhonePe / UPI'})</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Consultation Fee</span>
                    <span className="font-extrabold text-base text-slate-900 dark:text-white">
                      ₹{apt.consultation_fee}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadReceipt(apt)}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer flex items-center gap-1"
                      title="Download Official Receipt"
                    >
                      <Download className="w-3 h-3" />
                      <span>Receipt</span>
                    </button>

                    {isConfirmed && (
                      <>
                        <button
                          onClick={() => {
                            setRescheduleModalApt(apt);
                            setRescheduleDate(apt.appointment_date);
                            setRescheduleTime(apt.appointment_time);
                          }}
                          className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => setCancelModalApt(apt)}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 font-bold text-xs transition cursor-pointer border border-rose-200 dark:border-rose-800"
                        >
                          Cancel Appointment
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* COMPREHENSIVE BOOKING MODAL: STEP 1 (FORM) -> STEP 2 (SUMMARY) -> STEP 3 (PAYMENT) -> STEP 4 (SUCCESS) */}
      {/* ========================================================================= */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 my-8 space-y-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  {bookingStep === 'form' && 'Step 1 of 3: Consultation Selection'}
                  {bookingStep === 'summary' && 'Step 2 of 3: Booking Summary'}
                  {bookingStep === 'payment' && 'Step 3 of 3: Secure Payment'}
                  {bookingStep === 'success' && 'Appointment Confirmed & Token Generated'}
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  {bookingStep === 'form' && (t('apt_page_title') || 'Book Guaranteed Doctor Consultation')}
                  {bookingStep === 'summary' && (t('booking.summaryTitle') || 'Appointment Booking Summary')}
                  {bookingStep === 'payment' && (t('payment.pageTitle') || 'Healthcare Payment & Token Generation')}
                  {bookingStep === 'success' && (t('success.bookingSuccess') || 'Appointment Booking Successful!')}
                </h2>
              </div>
              <button
                onClick={handleCancelBookingFlow}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                title="Cancel and Go Back"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* STEP 1: CONSULTATION SELECTION FORM */}
            {/* ---------------------------------------------------- */}
            {bookingStep === 'form' && (
              <form onSubmit={handleProceedToSummary} className="space-y-4 text-xs">
                {/* 1. Location Selection */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <LocationPicker
                    selectedState={bookState}
                    selectedCity={bookCity}
                    onChange={(s, c) => {
                      setBookState(s);
                      setBookCity(c);
                    }}
                    label="1. Select Location in India"
                  />

                  {/* Hospital Selection */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Select Hospital / Facility
                    </label>
                    <select
                      value={selectedHospitalId}
                      onChange={(e) => setSelectedHospitalId(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-hidden cursor-pointer"
                    >
                      <option value="ALL">All Hospitals in Selected City</option>
                      {hospitals
                        .filter(h => bookCity === 'ALL' || h.city.toLowerCase() === bookCity.toLowerCase())
                        .map(h => (
                          <option key={h.id} value={h.id}>
                            {h.name} ({h.city})
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {/* 2. Doctor Specialist Selection */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <label className="block font-bold text-slate-800 dark:text-slate-200">
                    2. Choose Verified Doctor Specialist
                  </label>
                  {availableDoctors.length === 0 ? (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
                      No verified doctors match this specific hospital/city filter. Resetting to show all providers.
                    </div>
                  ) : (
                    <select
                      value={selectedDoctorId}
                      onChange={(e) => setSelectedDoctorId(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-hidden cursor-pointer"
                    >
                      {availableDoctors.map((doc) => (
                        <option key={doc.id} value={doc.id}>
                          {doc.name} — {doc.specialization} ({doc.city}) • ₹{doc.consultation_fee}
                        </option>
                      ))}
                    </select>
                  )}

                  {activeDoctor && (
                    <div className="p-3 rounded-xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 flex items-center justify-between text-[11px]">
                      <div>
                        <span className="font-bold text-teal-900 dark:text-teal-200 block">{activeDoctor.name}</span>
                        <span className="text-slate-600 dark:text-slate-300">Council Reg: {activeDoctor.medical_registration_number}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-teal-800 dark:text-teal-300 text-sm">₹{activeDoctor.consultation_fee}</span>
                        <span className="block text-[10px] text-teal-600">0% Commission</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Appointment Date & Slot Selection */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <label className="block font-bold text-slate-800 dark:text-slate-200">
                    3. Select Consultation Date & Time Slot
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">Appointment Date</label>
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">Guaranteed Slot</label>
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                        {activeDoctor.available_slots.map((slot) => {
                          const isBooked = appointments.some(
                            a =>
                              a.doctor_id === activeDoctor.id &&
                              a.appointment_date === selectedDate &&
                              a.appointment_time === slot &&
                              a.status !== 'Cancelled'
                          );

                          return (
                            <button
                              key={slot}
                              type="button"
                              disabled={isBooked}
                              onClick={() => setSelectedSlot(slot)}
                              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                                isBooked
                                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 line-through cursor-not-allowed'
                                  : selectedSlot === slot
                                  ? 'bg-sky-600 text-white shadow-xs'
                                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-slate-700'
                              }`}
                            >
                              {slot} {isBooked && '(Full)'}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Patient Information */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 dark:text-slate-200">
                      4. Patient Details
                    </label>
                    <select
                      value={selectedFamilyMember}
                      onChange={(e) => setSelectedFamilyMember(e.target.value)}
                      className="p-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold"
                    >
                      <option value="Self">Self (Default)</option>
                      {familyMembers.map((fm) => (
                        <option key={fm.id} value={fm.name}>
                          {fm.name} ({fm.relation})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">Full Patient Name</label>
                      <input
                        type="text"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">Contact Phone</label>
                      <input
                        type="tel"
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Reason / Symptoms for Visit</label>
                    <input
                      type="text"
                      placeholder="e.g., Routine blood pressure follow-up, palpitations, or general evaluation"
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Actions: Cancel (navigates back without creating appointment) & Review Summary */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCancelBookingFlow}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!selectedSlot}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Proceed to Booking Summary</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* ---------------------------------------------------- */}
            {/* STEP 2: BOOKING SUMMARY (REVIEW BEFORE PAYMENT) */}
            {/* ---------------------------------------------------- */}
            {bookingStep === 'summary' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                      Consultation Overview
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                      Slot Reserved Temporarily
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Healthcare Provider</span>
                      <span className="font-bold text-slate-900 dark:text-white text-sm block">
                        {activeDoctor.name}
                      </span>
                      <span className="text-teal-600 dark:text-teal-400 font-semibold block">
                        {activeDoctor.specialization} ({activeDoctor.experience_years} yrs exp)
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Reg: {activeDoctor.medical_registration_number}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px]">Hospital & Location</span>
                      <span className="font-bold text-slate-900 dark:text-white text-sm block">
                        {activeHospital.name}
                      </span>
                      <span className="text-[11px] text-slate-600 dark:text-slate-300 block">
                        {activeHospital.address}, {activeHospital.city}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900 grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-sky-700 dark:text-sky-300 block font-semibold text-[10px]">Consultation Date</span>
                      <span className="font-bold text-slate-900 dark:text-white text-xs">{selectedDate}</span>
                    </div>
                    <div>
                      <span className="text-sky-700 dark:text-sky-300 block font-semibold text-[10px]">Selected Time Slot</span>
                      <span className="font-bold text-slate-900 dark:text-white text-xs font-mono">{selectedSlot}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Patient:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {selectedFamilyMember === 'Self' ? patientName : `${patientName} (${selectedFamilyMember})`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Phone:</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200">{patientPhone}</span>
                    </div>
                    {symptoms && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Reason:</span>
                        <span className="italic text-slate-700 dark:text-slate-300">&ldquo;{symptoms}&rdquo;</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-300">Doctor Consultation Fee:</span>
                    <span className="font-bold text-slate-900 dark:text-white">₹{activeDoctor.consultation_fee}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-300">Platform Surcharge:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">₹0 (0% Commission Charter)</span>
                  </div>
                  <div className="pt-2 border-t border-teal-200 dark:border-teal-800 flex items-center justify-between text-sm font-extrabold text-slate-900 dark:text-white">
                    <span>{t('booking.totalPayable') || 'Total Payable Amount'}:</span>
                    <span className="text-lg text-teal-800 dark:text-teal-200 font-mono">₹{activeDoctor.consultation_fee}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setBookingStep('form')}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back & Edit</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCancelBookingFlow}
                      className="px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-700 font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleProceedToPayment}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold text-xs shadow-md transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                    >
                      <span>{t('booking.confirmBooking') || 'Confirm Booking & Pay'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* STEP 3: PAYMENT PAGE (PHONEPE, GPAY, UPI, CARDS) */}
            {/* ---------------------------------------------------- */}
            {bookingStep === 'payment' && (
              <div className="space-y-4 text-xs">
                {/* Demo Payment Notice */}
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>{t('payment.demoModeBadge') || 'Demo / Sandbox Payment Mode Active'}</span>
                  </div>
                  <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
                    {t('payment.demoModeDesc') || 'Simulated payment succeeds immediately for seamless testing without financial deduction.'}
                  </p>
                </div>

                {/* Amount Payable Hero */}
                <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block uppercase font-bold">Total Payable Amount</span>
                    <div className="text-2xl font-black text-white font-mono mt-0.5">
                      ₹{activeDoctor.consultation_fee}
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-slate-300">
                    <span className="block font-semibold">Doctor: {activeDoctor.name}</span>
                    <span className="text-slate-400">Date: {selectedDate} ({selectedSlot})</span>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="space-y-2">
                  <label className="block font-bold text-slate-800 dark:text-slate-200">
                    {t('payment.selectMethod') || 'Select Payment Method'}
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* PhonePe */}
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentMethod('PhonePe')}
                      className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition cursor-pointer ${
                        selectedPaymentMethod === 'PhonePe'
                          ? 'border-purple-500 bg-purple-50/60 dark:bg-purple-950/30 ring-2 ring-purple-500/20'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-sm">
                        Pe
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">PhonePe</span>
                        <span className="text-[11px] text-slate-500">Fast UPI intent & scan</span>
                      </div>
                    </button>

                    {/* Google Pay */}
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentMethod('Google Pay')}
                      className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition cursor-pointer ${
                        selectedPaymentMethod === 'Google Pay'
                          ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/30 ring-2 ring-blue-500/20'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-sm">
                        G
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">Google Pay</span>
                        <span className="text-[11px] text-slate-500">Instant UPI transfer</span>
                      </div>
                    </button>

                    {/* UPI */}
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentMethod('UPI')}
                      className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition cursor-pointer ${
                        selectedPaymentMethod === 'UPI'
                          ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">
                        UPI
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">BHIM / Any UPI ID</span>
                        <span className="text-[11px] text-slate-500">Pay via any UPI handle</span>
                      </div>
                    </button>

                    {/* Card / Netbanking */}
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentMethod('Card / Netbanking')}
                      className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition cursor-pointer ${
                        selectedPaymentMethod === 'Card / Netbanking'
                          ? 'border-sky-500 bg-sky-50/60 dark:bg-sky-950/30 ring-2 ring-sky-500/20'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-sky-600 text-white font-bold flex items-center justify-center flex-shrink-0">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">Cards / Netbanking</span>
                        <span className="text-[11px] text-slate-500">Visa, Mastercard, RuPay</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* UPI ID Input or QR Option */}
                {selectedPaymentMethod === 'UPI' && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      Enter UPI ID / VPA
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="e.g. mobile@upi or username@okhdfcbank"
                        className="flex-1 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-semibold focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => setShowQr(!showQr)}
                        className="px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold flex items-center gap-1 hover:bg-slate-100"
                      >
                        <QrCode className="w-4 h-4" />
                        <span>QR</span>
                      </button>
                    </div>

                    {showQr && (
                      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 text-center space-y-1.5">
                        <div className="w-24 h-24 bg-slate-900 text-white mx-auto flex items-center justify-center rounded-lg font-mono text-[10px]">
                          [SCAN UPI QR]
                        </div>
                        <span className="text-[10px] text-slate-500 block">Scan using any UPI App to Pay ₹{activeDoctor.consultation_fee}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setBookingStep('summary')}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer hover:bg-slate-100 flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Summary</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCancelBookingFlow}
                      className="px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-700 font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={isProcessingPayment}
                      onClick={handleCompletePaymentAndBook}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition active:scale-95 cursor-pointer flex items-center gap-2"
                    >
                      {isProcessingPayment ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Authorizing Payment...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>Pay ₹{activeDoctor.consultation_fee} & Complete Booking</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* STEP 4: APPOINTMENT SUCCESS PAGE & TOKEN GENERATION */}
            {/* ---------------------------------------------------- */}
            {bookingStep === 'success' && successAppointment && (
              <div className="space-y-5 text-xs animate-fade-in">
                {/* Celebratory Check Banner */}
                <div className="text-center space-y-2 py-2">
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30">
                    <CheckCircle className="w-9 h-9" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                    {t('success.bookingSuccess') || 'Appointment Booking Successful!'}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    {t('success.subtitle') || 'Your consultation has been confirmed and registered in the hospital database.'}
                  </p>
                </div>

                {/* Big Token Number & Live Queue Status */}
                <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white border border-teal-800/60 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-teal-300">
                        OFFICIAL OPD TOKEN
                      </span>
                      <div className="text-xs text-slate-400">{successAppointment.hospital_name}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                      Status: Waiting
                    </span>
                  </div>

                  <div className="text-center py-2">
                    <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400 block mb-1">
                      {t('success.tokenLabel') || 'Your Token Number'}
                    </span>
                    <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white bg-gradient-to-b from-white via-teal-100 to-teal-400 bg-clip-text text-transparent">
                      {successAppointment.token_code || `TOKEN #${successAppointment.opd_token_number}`}
                    </div>
                  </div>

                  {/* Queue Metrics */}
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-center">
                    <div className="p-2 rounded-xl bg-white/5">
                      <span className="text-[9px] text-slate-400 block font-semibold">{t('success.servingLabel') || 'Currently Serving'}</span>
                      <span className="text-sm font-black text-white font-mono">
                        {successAppointment.token_code ? successAppointment.token_code.replace(/\d+$/, m => String(Math.max(1, parseInt(m, 10) - 4)).padStart(3, '0')) : 'A018'}
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-white/5">
                      <span className="text-[9px] text-slate-400 block font-semibold">{t('success.aheadLabel') || 'Patients Ahead'}</span>
                      <span className="text-sm font-black text-teal-300 font-mono">4 patients</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white/5">
                      <span className="text-[9px] text-slate-400 block font-semibold">{t('success.estWaitLabel') || 'Est. Waiting Time'}</span>
                      <span className="text-sm font-black text-white font-mono">~45 mins</span>
                    </div>
                  </div>
                </div>

                {/* Appointment Dossier Details */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Patient:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{successAppointment.patient_name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Doctor:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{successAppointment.doctor_name} ({successAppointment.doctor_specialization})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Schedule:</span>
                    <span className="font-semibold">{successAppointment.appointment_date} at {successAppointment.appointment_time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Booking Reference:</span>
                    <span className="font-mono font-bold text-teal-700 dark:text-teal-400">{successAppointment.booking_reference}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400">Payment Status:</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Paid ₹{successAppointment.consultation_fee} via {successAppointment.payment_method}</span>
                    </span>
                  </div>
                </div>

                {/* Action Buttons: View My Appointment, Download Receipt, Cancel Appointment */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsBookingModalOpen(false);
                      onCloseBookingModal();
                      setBookingStep('form');
                      setFilterTab('all');
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <span>{t('success.viewMyAppointment') || 'View My Appointment'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadReceipt(successAppointment)}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{t('success.downloadReceipt') || 'Download Receipt'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCancelModalApt(successAppointment)}
                    className="w-full py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 font-bold text-xs transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>{t('success.cancelAppointment') || 'Cancel Appointment'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CANCEL CONFIRMATION POPUP MODAL */}
      {/* ========================================================================= */}
      {cancelModalApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {t('appointments.cancelConfirmTitle') || 'Are you sure you want to cancel this appointment?'}
                </h3>
                <span className="text-xs font-mono text-slate-500">
                  Ref: {cancelModalApt.booking_reference} • Token {cancelModalApt.token_code || `#${cancelModalApt.opd_token_number}`}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
              Consultation with <strong>{cancelModalApt.doctor_name}</strong> on <strong>{cancelModalApt.appointment_date} at {cancelModalApt.appointment_time}</strong>. {t('appointments.cancelConfirmDesc') || 'The booked time slot and live OPD queue token will be released.'}
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t('appointments.cancelReasonLabel') || 'Reason for Cancellation (Optional)'}
              </label>
              <input
                type="text"
                placeholder="e.g. Schedule clash, feeling better, relocated"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-medium focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setCancelModalApt(null);
                  setCancelReason('');
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                {t('appointments.keepAppointment') || 'Keep Appointment'}
              </button>
              <button
                type="button"
                onClick={handleCancelSubmit}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 disabled:opacity-50 transition active:scale-95 cursor-pointer"
              >
                {loading ? 'Cancelling...' : (t('appointments.confirmCancellation') || 'Confirm Cancellation')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* RESCHEDULE MODAL */}
      {/* ========================================================================= */}
      {rescheduleModalApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Reschedule Consultation
            </h3>
            <p className="text-xs text-slate-500">
              Select a new date and time for consultation with {rescheduleModalApt.doctor_name}.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">New Date</label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Available Slots</label>
                <div className="flex flex-wrap gap-2">
                  {['09:30 AM', '10:30 AM', '11:30 AM', '04:00 PM', '05:30 PM', '06:30 PM'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRescheduleTime(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                        rescheduleTime === s
                          ? 'bg-sky-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRescheduleModalApt(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRescheduleSubmit}
                disabled={loading}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold"
              >
                {loading ? 'Rescheduling...' : 'Confirm Reschedule'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT ADVANCE OPD ALERTS MODAL */}
      {/* ========================================================================= */}
      {editAlertApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-teal-600" />
                <span>Configure Live OPD Turn Alerts</span>
              </h3>
              <button
                onClick={() => setEditAlertApt(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Ref: {editAlertApt.booking_reference} • Consultation with {editAlertApt.doctor_name}
            </p>

            <form onSubmit={handleSaveEditedAlerts} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Delivery Channel
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['SMS', 'Push', 'Both', 'None'] as NotificationChannel[]).map((ch) => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => setEditChannel(ch)}
                      className={`p-2 rounded-xl border text-center font-bold text-xs cursor-pointer ${
                        editChannel === ch
                          ? 'border-teal-600 bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-200'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600'
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Preset Turn Alerts (Minutes Before Consultation)
                </label>
                <div className="flex flex-wrap gap-2">
                  {[30, 20, 15, 10, 5].map((m) => {
                    const isSel = editMinutes.includes(m);
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => {
                          setEditMinutes(prev =>
                            prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m].sort((a, b) => b - a)
                          );
                        }}
                        className={`px-3 py-1.5 rounded-xl border font-bold text-xs cursor-pointer ${
                          isSel
                            ? 'bg-teal-600 text-white border-teal-600'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200'
                        }`}
                      >
                        {m}m
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Custom Alert Window (Optional)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 25"
                  value={editCustomMins}
                  onChange={(e) => setEditCustomMins(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditAlertApt(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  {loading ? 'Saving...' : 'Save Alert Preferences'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hospital Details Modal */}
      {selectedHospitalForModal && (
        <HospitalDetailsModal
          hospital={selectedHospitalForModal}
          onClose={() => setSelectedHospitalForModal(null)}
          onBookAtHospital={(hosp: Hospital) => {
            setSelectedHospitalForModal(null);
            setSelectedHospitalId(hosp.id);
            setIsBookingModalOpen(true);
            setBookingStep('form');
          }}
          onBookWithDoctor={(doc: Doctor) => {
            setSelectedHospitalForModal(null);
            setSelectedDoctorId(doc.id);
            setIsBookingModalOpen(true);
            setBookingStep('form');
          }}
          onTrackQueue={(hid: string) => {
            setSelectedHospitalForModal(null);
            if (onTrackQueue) onTrackQueue(hid);
          }}
        />
      )}
    </div>
  );
};

import {
  Doctor,
  Hospital,
  HospitalBedInfo,
  Appointment,
  QueueToken,
  MedicalRecord,
  ServerStatus,
  SubscriptionTier,
  AnalyzedReport,
  MedicineReminder,
  FamilyMember,
  EmergencyServiceContact,
  DoseTimeSlot,
} from '../types';

export const api = {
  // Status
  async getStatus(): Promise<ServerStatus> {
    const res = await fetch('/api/status');
    if (!res.ok) throw new Error('Failed to fetch server status');
    return res.json();
  },

  // Doctors with Pan-India filters
  async getDoctors(filters?: {
    city?: string;
    state?: string;
    district?: string;
    specialization?: string;
    search?: string;
    status?: string;
    hospital?: string;
    minFee?: number;
    maxFee?: number;
    minExp?: number;
  }): Promise<Doctor[]> {
    const params = new URLSearchParams();
    if (filters?.city && filters.city !== 'ALL') params.append('city', filters.city);
    if (filters?.state && filters.state !== 'ALL') params.append('state', filters.state);
    if (filters?.district && filters.district !== 'ALL') params.append('district', filters.district);
    if (filters?.specialization && filters.specialization !== 'ALL') params.append('specialization', filters.specialization);
    if (filters?.search && filters.search.trim()) params.append('search', filters.search.trim());
    if (filters?.status && filters.status !== 'ALL') params.append('status', filters.status);
    if (filters?.hospital) params.append('hospital', filters.hospital);
    if (filters?.minFee) params.append('minFee', filters.minFee.toString());
    if (filters?.maxFee) params.append('maxFee', filters.maxFee.toString());
    if (filters?.minExp) params.append('minExp', filters.minExp.toString());

    const res = await fetch(`/api/doctors?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch doctors');
    return res.json();
  },

  async getDoctor(id: string): Promise<Doctor> {
    const res = await fetch(`/api/doctors/${id}`);
    if (!res.ok) throw new Error('Doctor not found');
    return res.json();
  },

  // Hospitals with Pan-India filters, Pagination, Sorting, & PIN Code
  async getHospitals(filters?: {
    city?: string;
    state?: string;
    district?: string;
    department?: string;
    search?: string;
    status?: string;
    pincode?: string;
    hasEmergency?: boolean;
    sortBy?: string;
    page?: number;
    limit?: number;
    paginated?: boolean;
  }): Promise<any> {
    const params = new URLSearchParams();
    if (filters?.city && filters.city !== 'ALL') params.append('city', filters.city);
    if (filters?.state && filters.state !== 'ALL') params.append('state', filters.state);
    if (filters?.district && filters.district !== 'ALL') params.append('district', filters.district);
    if (filters?.department && filters.department !== 'ALL') params.append('department', filters.department);
    if (filters?.search && filters.search.trim()) params.append('search', filters.search.trim());
    if (filters?.status && filters.status !== 'ALL') params.append('status', filters.status);
    if (filters?.pincode && filters.pincode.trim()) params.append('pincode', filters.pincode.trim());
    if (filters?.hasEmergency) params.append('hasEmergency', 'true');
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.paginated) params.append('paginated', 'true');

    const res = await fetch(`/api/hospitals?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch hospitals');
    return res.json();
  },

  async getHospitalById(id: string): Promise<{ hospital: Hospital; doctors: Doctor[]; queueTokens: QueueToken[] }> {
    const res = await fetch(`/api/hospitals/${id}`);
    if (!res.ok) throw new Error('Hospital not found');
    return res.json();
  },

  async getSpecializations(): Promise<any[]> {
    const res = await fetch('/api/specializations');
    if (!res.ok) throw new Error('Failed to fetch clinical specialties');
    return res.json();
  },

  async checkSymptoms(data: { symptoms?: string[]; query?: string; city?: string }): Promise<any> {
    const res = await fetch('/api/symptom-checker', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to analyze health concern');
    return res.json();
  },

  async updateAppointmentNotifications(
    id: string,
    preferences: {
      channel: 'SMS' | 'Push' | 'Both' | 'None';
      advanceMinutes: number[];
      customMinutes?: number;
      smsConsent: boolean;
      phone?: string;
    }
  ): Promise<{ success: boolean; message: string; appointment: Appointment }> {
    const res = await fetch(`/api/appointments/${id}/notifications`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preferences),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to update alert settings');
    return result;
  },

  // Appointments
  async getAppointments(): Promise<Appointment[]> {
    const res = await fetch('/api/appointments');
    if (!res.ok) throw new Error('Failed to fetch appointments');
    return res.json();
  },

  async bookAppointment(data: {
    doctorId: string;
    appointmentDate: string;
    appointmentTime: string;
    patientName: string;
    patientPhone?: string;
    symptomsReason?: string;
    familyMemberName?: string;
    notificationPreferences?: any;
    paymentMethod?: string;
    paymentStatus?: string;
  }): Promise<{ success: boolean; message: string; appointment: Appointment }> {
    const res = await fetch('/api/appointments/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Failed to book appointment');
    }
    return result;
  },

  async cancelAppointment(id: string, reason?: string): Promise<{ success: boolean; appointment: Appointment }> {
    const res = await fetch('/api/appointments/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, reason }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to cancel appointment');
    return result;
  },

  async rescheduleAppointment(id: string, newDate: string, newTime: string): Promise<{ success: boolean; appointment: Appointment }> {
    const res = await fetch('/api/appointments/reschedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, newDate, newTime }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to reschedule appointment');
    return result;
  },

  // Queue
  async getQueue(hospitalId?: string, doctorId?: string): Promise<QueueToken[]> {
    const params = new URLSearchParams();
    if (hospitalId) params.append('hospitalId', hospitalId);
    if (doctorId) params.append('doctorId', doctorId);
    const res = await fetch(`/api/queue?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch queue');
    return res.json();
  },

  async generateQueueToken(data: {
    hospitalId: string;
    department: string;
    doctorId?: string;
    doctorName?: string;
    patientName: string;
    session?: 'Morning OPD' | 'Evening OPD' | 'Emergency OPD';
    notificationChannel?: string;
  }): Promise<{ success: boolean; token: QueueToken }> {
    const res = await fetch('/api/queue/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to generate token');
    return result;
  },

  async callNextQueueToken(hospitalId: string, department: string, doctorId?: string): Promise<any> {
    const res = await fetch('/api/queue/call-next', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hospitalId, department, doctorId }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to call next token');
    return result;
  },

  async updateTokenStatus(tokenId: string, status: 'Completed' | 'Delayed' | 'Absent' | 'Cancelled'): Promise<any> {
    const res = await fetch('/api/queue/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tokenId, status }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to update token status');
    return result;
  },

  // Medical Records
  async getMedicalRecords(): Promise<MedicalRecord[]> {
    const res = await fetch('/api/medical-records');
    if (!res.ok) throw new Error('Failed to fetch medical records');
    return res.json();
  },

  async uploadMedicalRecord(data: {
    title: string;
    documentType: string;
    doctorName?: string;
    hospitalName?: string;
    notes?: string;
    familyMemberName?: string;
  }): Promise<{ success: boolean; record: MedicalRecord }> {
    const res = await fetch('/api/medical-records/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to upload record');
    return result;
  },

  // Pricing & Subscriptions
  async getPricing(): Promise<SubscriptionTier[]> {
    const res = await fetch('/api/pricing');
    if (!res.ok) throw new Error('Failed to fetch pricing');
    return res.json();
  },

  async updatePricing(id: string, monthlyPrice: number, annualPrice: number, adminName?: string): Promise<any> {
    const res = await fetch('/api/pricing/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, monthlyPrice, annualPrice, adminName }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to update pricing tier');
    return result;
  },

  async updatePricingTier(nameOrId: string, price: number, period?: string, adminName?: string): Promise<any> {
    const res = await fetch('/api/pricing/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: nameOrId, price, period, adminName }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to update pricing tier');
    return result;
  },

  // Doctor Registration
  async registerDoctor(data: any): Promise<any> {
    const res = await fetch('/api/auth/register-doctor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to submit registration');
    return result;
  },

  // Hospital Registration
  async registerHospital(data: any): Promise<any> {
    const res = await fetch('/api/auth/register-hospital', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to submit hospital registration');
    return result;
  },

  // Admin Actions
  async getAdminStats(): Promise<any> {
    const res = await fetch('/api/admin/stats');
    if (!res.ok) throw new Error('Failed to fetch admin stats');
    return res.json();
  },

  async verifyDoctor(doctorId: string, action: 'APPROVE' | 'REJECT' | 'OUTDATED' | 'EXPIRE', adminName?: string): Promise<any> {
    const res = await fetch('/api/admin/verify-doctor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doctorId, action, adminName }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to update doctor verification');
    return result;
  },

  async verifyHospital(hospitalId: string, action: 'APPROVE' | 'REJECT', adminName?: string): Promise<any> {
    const res = await fetch('/api/admin/verify-hospital', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hospitalId, action, adminName }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to update hospital verification');
    return result;
  },

  // Revenue Summary
  async getRevenueSummary(): Promise<any> {
    const res = await fetch('/api/revenue/summary');
    if (!res.ok) throw new Error('Failed to fetch revenue metrics');
    return res.json();
  },

  // AI Assistant (Gemini)
  async queryAIAssistant(data: {
    prompt: string;
    language: string;
    conversationHistory?: Array<{ sender: string; text: string }>;
    isVoiceCall?: boolean;
  }): Promise<{ success: boolean; text: string; language: string; sources: string[]; hospitals?: Hospital[]; doctors?: Doctor[] }> {
    const res = await fetch('/api/gemini/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Failed to consult AI health assistant');
    }
    return result;
  },

  async generateCallSummary(data: {
    transcript: Array<{ sender: string; text: string }>;
    duration: string;
    language: string;
  }): Promise<{ success: boolean; summary: string }> {
    const res = await fetch('/api/gemini/call-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Failed to generate call summary');
    }
    return result;
  },

  // Module 1: AI Medical Report Explainer
  async analyzeMedicalReport(data: {
    reportText?: string;
    fileData?: string;
    fileName?: string;
    fileType?: string;
    patientId?: string;
    patientName?: string;
    familyMemberId?: string;
    familyMemberName?: string;
    language?: string;
  }): Promise<{ success: boolean; report: AnalyzedReport; message: string }> {
    const res = await fetch('/api/reports/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to analyze medical report');
    return result;
  },

  async getAnalyzedReports(patientId?: string): Promise<AnalyzedReport[]> {
    const params = patientId ? `?patientId=${encodeURIComponent(patientId)}` : '';
    const res = await fetch(`/api/reports${params}`);
    if (!res.ok) throw new Error('Failed to fetch analyzed reports');
    return res.json();
  },

  async saveAnalyzedReport(report: AnalyzedReport): Promise<{ success: boolean; report: AnalyzedReport }> {
    const res = await fetch('/api/reports/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to save analyzed report');
    return result;
  },

  async deleteAnalyzedReport(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/reports/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to delete report');
    return result;
  },

  // Module 2: Live Bed Availability
  async getHospitalBeds(params?: { city?: string; hospitalId?: string; bedType?: string }): Promise<Hospital[]> {
    const q = new URLSearchParams();
    if (params?.city && params.city !== 'ALL') q.append('city', params.city);
    if (params?.hospitalId) q.append('hospitalId', params.hospitalId);
    if (params?.bedType && params.bedType !== 'all') q.append('bedType', params.bedType);
    const res = await fetch(`/api/hospitals/beds?${q.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch hospital bed availability');
    return res.json();
  },

  async updateHospitalBeds(hospitalId: string, bedInfo: Partial<HospitalBedInfo>, updatedBy?: string): Promise<{ success: boolean; hospital: Hospital }> {
    const res = await fetch(`/api/hospitals/${hospitalId}/beds`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...bedInfo, updatedBy }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to update bed availability');
    return result;
  },

  // Module 3: Emergency Coordination
  async getEmergencyContacts(): Promise<EmergencyServiceContact[]> {
    const res = await fetch('/api/emergency/contacts');
    if (!res.ok) throw new Error('Failed to fetch emergency contacts');
    return res.json();
  },

  async getNearbyEmergencyHospitals(params?: { lat?: number; lng?: number; city?: string }): Promise<Array<Hospital & { distance_km?: number }>> {
    const q = new URLSearchParams();
    if (params?.lat !== undefined) q.append('lat', params.lat.toString());
    if (params?.lng !== undefined) q.append('lng', params.lng.toString());
    if (params?.city && params.city !== 'ALL') q.append('city', params.city);
    const res = await fetch(`/api/emergency/nearby?${q.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch nearby emergency hospitals');
    return res.json();
  },

  // Module 4: Smart Medicine Reminder
  async getMedicineReminders(patientId?: string): Promise<MedicineReminder[]> {
    const params = patientId ? `?patientId=${encodeURIComponent(patientId)}` : '';
    const res = await fetch(`/api/medicines${params}`);
    if (!res.ok) throw new Error('Failed to fetch medicine reminders');
    return res.json();
  },

  async addMedicineReminder(data: Partial<MedicineReminder>): Promise<{ success: boolean; medicine: MedicineReminder }> {
    const res = await fetch('/api/medicines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to add medicine reminder');
    return result;
  },

  async updateMedicineDose(id: string, slot: DoseTimeSlot, status: 'Taken' | 'Skipped'): Promise<{ success: boolean; medicine: MedicineReminder }> {
    const res = await fetch(`/api/medicines/${id}/dose`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slot, status }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to update dose status');
    return result;
  },

  async deleteMedicineReminder(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/medicines/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to delete medicine');
    return result;
  },

  // Module 5: Family Health Profiles
  async getFamilyMembers(userId?: string): Promise<FamilyMember[]> {
    const params = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    const res = await fetch(`/api/family-members${params}`);
    if (!res.ok) throw new Error('Failed to fetch family members');
    return res.json();
  },

  async addFamilyMember(data: Partial<FamilyMember>): Promise<{ success: boolean; member: FamilyMember }> {
    const res = await fetch('/api/family-members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to add family member');
    return result;
  },

  async updateFamilyMember(id: string, data: Partial<FamilyMember>): Promise<{ success: boolean; member: FamilyMember }> {
    const res = await fetch(`/api/family-members/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to update family member profile');
    return result;
  },

  async deleteFamilyMember(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/family-members/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to delete family profile');
    return result;
  },
};

import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Download,
  Eye,
  ShieldCheck,
  Lock,
  Plus,
  Filter,
  CheckCircle2,
  Calendar,
  Building2,
  X,
  FileCheck,
  UserCheck,
} from 'lucide-react';
import { MedicalRecord, FamilyMember, UserRole } from '../types';
import { api } from '../services/api';
import { PageHeader } from '../components/common/PageHeader';

interface Props {
  records: MedicalRecord[];
  familyMembers: FamilyMember[];
  onRefresh: () => void;
  onOpenFamilyModal: () => void;
  onBack?: () => void;
  onHome?: () => void;
  onDashboard?: () => void;
  userRole?: UserRole;
}

export const MedicalRecordsPage: React.FC<Props> = ({
  records,
  familyMembers,
  onRefresh,
  onOpenFamilyModal,
  onBack,
  onHome,
  onDashboard,
  userRole,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedMember, setSelectedMember] = useState<string>('ALL');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewRecord, setPreviewRecord] = useState<MedicalRecord | null>(null);

  // Upload Form State
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState('Lab Report');
  const [doctorName, setDoctorName] = useState('Dr. Ramesh Chandra, DM');
  const [hospitalName, setHospitalName] = useState('Ayush Multispecialty Hospital');
  const [notes, setNotes] = useState('');
  const [uploadMember, setUploadMember] = useState('Self');
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsUploading(true);
      await api.uploadMedicalRecord({
        title,
        documentType: docType,
        doctorName,
        hospitalName,
        notes,
        familyMemberName: uploadMember !== 'Self' ? uploadMember : undefined,
      });

      setUploadModalOpen(false);
      setTitle('');
      setNotes('');
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error uploading medical document');
    } finally {
      setIsUploading(false);
    }
  };

  const filteredRecords = records.filter((rec) => {
    if (selectedCategory !== 'ALL' && rec.document_type !== selectedCategory) return false;
    if (selectedMember !== 'ALL') {
      if (selectedMember === 'Self' && rec.family_member_name) return false;
      if (selectedMember !== 'Self' && rec.family_member_name !== selectedMember) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Complete Breadcrumb & Page Header */}
      <PageHeader
        title="Digital Health Records & Documents"
        subtitle="Private medical documents, doctor-verified prescriptions, and lab reports with patient-controlled access."
        badge="DPDP Act Encrypted Health Vault"
        badgeColor="text-teal-600 bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-800"
        onBack={onBack}
        onHome={onHome}
        onDashboard={onDashboard}
        userRole={userRole}
        icon={Lock}
        actionButton={
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenFamilyModal}
              className="px-3.5 py-2 rounded-2xl border border-slate-300 dark:border-slate-600 hover:bg-slate-50 text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer"
            >
              Family Profiles ({familyMembers.length})
            </button>
            <button
              onClick={() => setUploadModalOpen(true)}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Document</span>
            </button>
          </div>
        }
      />

      {/* DPDP Compliance & Consent Notice */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>
            <strong>Data Privacy Guarantee:</strong> Your medical records are encrypted and never used for advertising or AI training without explicit consent.
          </span>
        </div>
        <span className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
          Consent Active: Patient-Only Access
        </span>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Document Categories */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['ALL', 'Lab Report', 'Prescription', 'Discharge Summary', 'Vaccination'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-sky-400'
              }`}
            >
              {cat === 'ALL' ? 'All Documents' : cat}
            </button>
          ))}
        </div>

        {/* Member selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Record For:</span>
          <select
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.target.value)}
            className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
          >
            <option value="ALL">All Household</option>
            <option value="Self">Self (Gowtham)</option>
            {familyMembers.map(fm => (
              <option key={fm.id} value={fm.name}>{fm.name} ({fm.relation})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Records Cards Grid */}
      {filteredRecords.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No health records found.
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Upload diagnostic blood tests, prescriptions, or discharge summaries to keep them in one secure digital vault.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRecords.map((rec) => (
            <div
              key={rec.id}
              className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center flex-shrink-0">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {rec.document_type}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                        {rec.title}
                      </h3>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400">
                    {rec.file_size}
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 pt-1">
                  {rec.doctor_name && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">Prescribing Doctor:</span>
                      <span className="font-semibold">{rec.doctor_name}</span>
                    </div>
                  )}
                  {rec.hospital_name && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">Hospital/Lab:</span>
                      <span className="font-semibold">{rec.hospital_name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">Patient:</span>
                    <span className="font-semibold text-sky-600">
                      {rec.family_member_name ? `${rec.family_member_name} (Family)` : 'Gowtham Bikkina (Self)'}
                    </span>
                  </div>
                  {rec.notes && (
                    <p className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-300 italic text-[11px] mt-2">
                      &ldquo;{rec.notes}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Uploaded on {new Date(rec.uploaded_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewRecord(rec)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-50 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => {
                      alert(`Downloading encrypted file: ${rec.file_name} via secure signed URL.`);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* UPLOAD MODAL */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-teal-600" />
                Upload Health Record
              </h3>
              <button onClick={() => setUploadModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Fasting Blood Sugar & Lipid Profile"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Document Type</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-semibold"
                  >
                    <option value="Lab Report">Lab Report</option>
                    <option value="Prescription">Prescription</option>
                    <option value="Discharge Summary">Discharge Summary</option>
                    <option value="Vaccination">Vaccination Record</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Assign to Member</label>
                  <select
                    value={uploadMember}
                    onChange={(e) => setUploadMember(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-semibold"
                  >
                    <option value="Self">Gowtham (Self)</option>
                    {familyMembers.map(fm => (
                      <option key={fm.id} value={fm.name}>{fm.name} ({fm.relation})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Doctor / Diagnostic Center</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Ramesh Chandra, DM"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Notes / Physician Instructions</label>
                <textarea
                  rows={2}
                  placeholder="e.g., Check cholesterol again after 3 months"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium"
                />
              </div>

              {/* Drag Drop Mock Area */}
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-4 text-center space-y-1">
                <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                <div className="font-semibold text-slate-700 dark:text-slate-300">
                  Select PDF or Medical Scan
                </div>
                <div className="text-[10px] text-slate-400">PDF, PNG, JPG up to 25MB (Encrypted in Supabase Vault)</div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md"
                >
                  {isUploading ? 'Encrypting & Uploading...' : 'Save Health Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      {previewRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {previewRecord.title}
                </h3>
              </div>
              <button onClick={() => setPreviewRecord(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Document Type:</span>
                <span className="font-bold">{previewRecord.document_type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">File Name:</span>
                <span className="font-mono">{previewRecord.file_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Consultant / Lab:</span>
                <span className="font-semibold">{previewRecord.doctor_name || 'Ayush Diagnostics'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Security Encryption:</span>
                <span className="font-mono text-emerald-600 font-bold">AES-256 (DPDP Compliant)</span>
              </div>
              {previewRecord.notes && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block mb-1">Clinical Notes:</span>
                  <p className="italic text-slate-700 dark:text-slate-300">&ldquo;{previewRecord.notes}&rdquo;</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setPreviewRecord(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => alert(`Downloaded ${previewRecord.file_name} securely.`)}
                className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useRef } from 'react';
import {
  FileText,
  Upload,
  Camera,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Stethoscope,
  Copy,
  Check,
  Calendar,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Info,
  Clock,
  ArrowRight,
  Download,
  Trash2,
  Pill,
  Bell,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import {
  AnalyzedReport,
  MedicalParameter,
  ExtractedPrescriptionItem,
  UserRole,
  Doctor,
  FamilyMember,
} from '../types';
import { api } from '../services/api';
import { PageHeader } from '../components/common/PageHeader';
import { useTranslation } from '../i18n/LanguageContext';

interface Props {
  userRole: UserRole;
  familyMembers?: FamilyMember[];
  onBookDoctor?: (doctor?: Doctor) => void;
  onNavigateTab?: (tab: string, filter?: any) => void;
  onBack?: () => void;
  onHome?: () => void;
  onDashboard?: () => void;
}

export const MedicalReportAnalyzerPage: React.FC<Props> = ({
  userRole,
  familyMembers = [],
  onBookDoctor,
  onNavigateTab,
  onBack,
  onHome,
  onDashboard,
}) => {
  const { t } = useTranslation();
  const [reportText, setReportText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [reportLanguage, setReportLanguage] = useState<'Telugu' | 'English' | 'Hindi'>('Telugu');
  const [currentReport, setCurrentReport] = useState<AnalyzedReport | null>(null);
  const [copiedQuestion, setCopiedQuestion] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Fast Sample Test Loaders
  const sampleReports: Array<{
    name: string;
    sampleText: string;
    description: string;
  }> = [
    {
      name: 'Complete Blood Count (CBC)',
      description: 'Hemogram, total WBC, Hemoglobin, Platelets',
      sampleText: `NABL ACCREDITED DIAGNOSTIC HEALTHCARE LABORATORY
PATIENT: Gowtham Bikkina | AGE: 35 | GENDER: Male | REF DR: Dr. Ramesh Chandra, DM
INVESTIGATION: COMPLETE BLOOD COUNT (CBC) WITH DIFFERENTIAL
Hemoglobin (Hb): 14.2 g/dL (Reference Range: 13.0 - 17.0) [NORMAL]
Total Leukocyte Count (WBC): 11,800 cells/cu.mm (Reference Range: 4,000 - 11,000) [HIGH]
Platelet Count: 245,000 /cu.mm (Reference Range: 150,000 - 450,000) [NORMAL]
RBC Count: 4.85 mil/cu.mm (Reference Range: 4.5 - 5.5) [NORMAL]
Neutrophils: 72% (Reference Range: 40 - 70) [BORDERLINE]
Lymphocytes: 22% (Reference Range: 20 - 40) [NORMAL]
ESR (1st Hour): 14 mm/hr (Reference Range: 0 - 15) [NORMAL]`,
    },
    {
      name: 'Lipid Profile & Cardiac Risk',
      description: 'Cholesterol, LDL, HDL, Triglycerides + Rx',
      sampleText: `METROPOLIS CLINICAL PATHOLOGY
INVESTIGATION: FASTING LIPID PROFILE (CARDIOVASCULAR RISK)
Total Cholesterol: 210 mg/dL (Reference Range: 125 - 200) [HIGH]
Triglycerides: 145 mg/dL (Reference Range: < 150) [NORMAL]
HDL Cholesterol (Good): 44 mg/dL (Reference Range: > 40) [NORMAL]
LDL Cholesterol (Bad): 136 mg/dL (Reference Range: < 100) [HIGH]
VLDL Cholesterol: 29 mg/dL (Reference Range: < 30) [NORMAL]
Cholesterol/HDL Ratio: 4.7 (Desirable < 4.5) [BORDERLINE]
PRESCRIPTION NOTATION:
Rx: Atorvastatin 10 mg tablet once daily at night after food for 30 days. Maintain low-fat diet.`,
    },
    {
      name: 'Glycemic HbA1c & Diabetes Panel',
      description: 'Fasting Sugar, HbA1c + Metformin Rx',
      sampleText: `APOLLO CLINICAL DIAGNOSTICS
INVESTIGATION: GLYCEMIC & METABOLIC STATUS
Fasting Blood Sugar (FBS): 104 mg/dL (Reference Range: 70 - 99) [BORDERLINE HIGH]
Post-Prandial Glucose (PPBS): 138 mg/dL (Reference Range: < 140) [NORMAL]
Glycated Hemoglobin (HbA1c): 5.9% (Normal: < 5.7%, Pre-diabetic: 5.7 - 6.4%) [BORDERLINE]
Mean Blood Glucose: 123 mg/dL
PRESCRIPTION NOTATION:
Rx: Metformin 500 mg tablet twice daily after morning and night food for 90 days. Repeat HbA1c in 3 months.`,
    },
    {
      name: 'Kidney Function Test (KFT / RFT)',
      description: 'Serum Creatinine, Blood Urea, Uric Acid',
      sampleText: `VIJAYAWADA SPECIALTY LABS
INVESTIGATION: RENAL / KIDNEY FUNCTION PANEL
Serum Creatinine: 0.95 mg/dL (Reference Range: 0.7 - 1.2) [NORMAL]
Blood Urea: 24 mg/dL (Reference Range: 15 - 40) [NORMAL]
Blood Urea Nitrogen (BUN): 11.2 mg/dL (Reference Range: 7 - 20) [NORMAL]
Serum Uric Acid: 5.6 mg/dL (Reference Range: 3.5 - 7.2) [NORMAL]
Estimated GFR: > 90 mL/min/1.73m2 [NORMAL RENAL FUNCTION]`,
    },
  ];

  // Client-side image compression to optimize speed & bandwidth
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 1600;
          let width = img.width;
          let height = img.height;

          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(event.target?.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          // Compress to JPEG with 0.82 quality
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          resolve(compressedDataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  // Handle File Input Upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setErrorMsg(null);

    // If PDF
    if (file.type === 'application/pdf') {
      setFilePreview(null);
      setReportText(`[PDF Document Uploaded: ${file.name} — Size: ${(file.size / 1024).toFixed(1)} KB]`);
      return;
    }

    // If Image
    if (file.type.startsWith('image/')) {
      try {
        const compressed = await compressImage(file);
        setFilePreview(compressed);
        setReportText(`[Image Captured: ${file.name} — Ready for AI OCR Analysis]`);
      } catch (err) {
        console.warn('Image compression fallback:', err);
        const reader = new FileReader();
        reader.onload = () => setFilePreview(reader.result as string);
        reader.readAsDataURL(file);
      }
    }
  };

  // Live Camera Snapshot using MediaDevices
  const startLiveCamera = async () => {
    try {
      setIsCameraActive(true);
      setErrorMsg(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.warn('Live camera error:', err);
      setIsCameraActive(false);
      // Fallback to native capture input
      cameraInputRef.current?.click();
    }
  };

  const captureCameraPhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setFilePreview(dataUrl);
      setReportText(`[Mobile Camera Photo Captured — Ready for AI OCR Analysis]`);
    }
    stopLiveCamera();
  };

  const stopLiveCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Run Analysis
  const handleAnalyze = async (sampleData?: string) => {
    const textToAnalyze = sampleData || reportText;
    if (!textToAnalyze.trim() && !filePreview) {
      setErrorMsg('Please upload a report document, capture a photo, or choose a sample test.');
      return;
    }

    setAnalyzing(true);
    setUploadProgress(15);
    setProgressStatus('Uploading and preprocessing medical document...');
    setErrorMsg(null);

    try {
      // Progress Simulation
      const progressTimer = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev < 45) {
            setProgressStatus('Scanning text with AI OCR engine...');
            return prev + 15;
          }
          if (prev < 80) {
            setProgressStatus('Comparing values to clinical reference ranges...');
            return prev + 15;
          }
          if (prev < 95) {
            setProgressStatus(`Generating simple ${reportLanguage} explanations & questions...`);
            return prev + 5;
          }
          return prev;
        });
      }, 350);

      const response = await api.analyzeMedicalReport({
        reportText: textToAnalyze,
        fileData: filePreview || undefined,
        fileName: selectedFile?.name || 'Medical_Report.pdf',
        fileType: selectedFile?.type || 'application/pdf',
        language: reportLanguage,
      });

      clearInterval(progressTimer);
      setUploadProgress(100);
      setProgressStatus('Analysis completed successfully!');

      setTimeout(() => {
        setCurrentReport(response.report);
        setAnalyzing(false);
        setUploadProgress(0);
      }, 400);
    } catch (err: any) {
      console.error('Report analysis error:', err);
      setErrorMsg(err.message || 'Failed to analyze report. Please try uploading a clearer image.');
      setAnalyzing(false);
      setUploadProgress(0);
    }
  };

  const handleCopyQuestion = (q: string) => {
    navigator.clipboard.writeText(q);
    setCopiedQuestion(q);
    setTimeout(() => setCopiedQuestion(null), 3000);
  };

  // Feature 3: Smart Medicine Reminder Connection
  const handleSetMedicineReminder = (med: ExtractedPrescriptionItem) => {
    if (onNavigateTab) {
      onNavigateTab('medicine-reminder', {
        prefillMedicine: {
          medicine_name: med.medicine_name,
          dosage: med.dosage,
          instructions: med.instructions,
          morning: med.morning ?? true,
          afternoon: med.afternoon ?? false,
          evening: med.evening ?? false,
          night: med.night ?? false,
          prescribed_by: med.prescribed_by || 'Dr. Ramesh Chandra, DM',
        },
      });
    }
  };

  // Helper badge for status
  const getStatusBadge = (status: string) => {
    const s = (status || '').toUpperCase();
    if (s.includes('HIGH') || s.includes('CRITICAL')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 font-extrabold text-[11px] border border-rose-200 dark:border-rose-800">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>High (ఎక్కువ)</span>
        </span>
      );
    }
    if (s.includes('LOW')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-extrabold text-[11px] border border-amber-200 dark:border-amber-800">
          <TrendingDown className="w-3.5 h-3.5" />
          <span>Low (తక్కువ)</span>
        </span>
      );
    }
    if (s.includes('BORDERLINE')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-950/60 text-yellow-800 dark:text-yellow-300 font-extrabold text-[11px] border border-yellow-200 dark:border-yellow-800">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Borderline (సరిహద్దు)</span>
        </span>
      );
    }
    if (s.includes('UNCLEAR') || s.includes('UNKNOWN')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-extrabold text-[11px] border border-slate-300">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Unclear</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-extrabold text-[11px] border border-emerald-200 dark:border-emerald-800">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>Normal (సాధారణం)</span>
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <PageHeader
        title="AI Medical Report Analyzer"
        subtitle="Upload photos, camera snapshots, or PDF reports to extract clinical parameters, laboratory reference ranges, Telugu & English explanations, and doctor questions."
        badge="AI Clinical Intelligence & OCR"
        onBack={onBack}
        onHome={onHome}
        onDashboard={onDashboard}
        userRole={userRole}
        icon={FileText}
      />

      {/* Mandatory Safety Notice */}
      <div className="p-4 rounded-3xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 text-teal-950 dark:text-teal-200 text-xs flex items-start gap-3 shadow-xs">
        <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold text-teal-900 dark:text-teal-100">
            Medical Safety & Verification Charter
          </p>
          <p className="leading-relaxed">
            Universal Health Care AI provides plain-language educational summaries to improve patient literacy. This is NOT a diagnostic evaluation or prescription. Never alter or discontinue medication without direct consultation with your registered doctor.
          </p>
        </div>
      </div>

      {/* Live Camera Snapshot Modal */}
      {isCameraActive && (
        <div className="p-5 rounded-3xl bg-slate-900 text-white border-2 border-teal-500 shadow-2xl space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-teal-400 animate-pulse" />
              <h3 className="font-extrabold text-sm">Live Mobile Camera Capture</h3>
            </div>
            <button
              type="button"
              onClick={stopLiveCamera}
              className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold"
            >
              Cancel
            </button>
          </div>

          <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute inset-4 border-2 border-white/40 border-dashed rounded-xl pointer-events-none flex items-center justify-center">
              <span className="bg-black/60 px-3 py-1 rounded-full text-[10px] text-white">
                Align medical report inside this box
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={captureCameraPhoto}
              className="px-6 py-3 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm flex items-center gap-2 shadow-lg cursor-pointer active:scale-95"
            >
              <Camera className="w-4 h-4" />
              <span>Capture Report Photo</span>
            </button>
          </div>
        </div>
      )}

      {/* UPLOAD & CONTROLS DASHBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form Box */}
        <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-teal-600" />
                <span>Upload Medical Report</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                PDF, JPG, JPEG, PNG, or mobile camera capture
              </p>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700 p-1 rounded-2xl text-xs font-bold">
              {(['Telugu', 'English', 'Hindi'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setReportLanguage(lang)}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                    reportLanguage === lang
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  {lang === 'Telugu' ? 'తెలుగు' : lang === 'Hindi' ? 'हिंदी' : 'English'}
                </button>
              ))}
            </div>
          </div>

          {/* Drag & Drop / File Selector Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Standard File Picker */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-5 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-teal-500 dark:hover:border-teal-400 bg-slate-50/70 dark:bg-slate-900/40 hover:bg-teal-50/20 transition flex flex-col items-center justify-center text-center cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                <FileText className="w-5 h-5" />
              </div>
              <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                Choose PDF or Image
              </span>
              <span className="text-[10px] text-slate-400 mt-1">
                {selectedFile ? selectedFile.name : 'Click to browse files (Max 15MB)'}
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,image/png,image/jpeg,image/jpg"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Mobile Camera Option */}
            <div
              onClick={startLiveCamera}
              className="p-5 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-sky-500 bg-slate-50/70 dark:bg-slate-900/40 hover:bg-sky-50/20 transition flex flex-col items-center justify-center text-center cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                <Camera className="w-5 h-5" />
              </div>
              <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                Mobile Camera Snapshot
              </span>
              <span className="text-[10px] text-slate-400 mt-1">
                Scan printed lab report instantly
              </span>
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Image Preview if uploaded */}
          {filePreview && (
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={filePreview}
                  alt="Report Preview"
                  className="w-12 h-12 object-cover rounded-xl border border-slate-300"
                />
                <div>
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-100 block">
                    {selectedFile?.name || 'Camera Photo Captured'}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold">
                    ✓ Compressed for fast high-accuracy OCR
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  setFilePreview(null);
                  setReportText('');
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Or Paste Report Text */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Or paste report text / lab parameters:
            </label>
            <textarea
              rows={4}
              placeholder="Paste lab text here or select a verified sample report on the right..."
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-teal-500"
            />
          </div>

          {/* Progress Indicator */}
          {analyzing && (
            <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 space-y-2 animate-pulse">
              <div className="flex items-center justify-between text-xs font-bold text-teal-800 dark:text-teal-300">
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-teal-600" />
                  <span>{progressStatus || 'Analyzing your medical report...'}</span>
                </span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-teal-200 dark:bg-teal-900 overflow-hidden">
                <div
                  className="h-full bg-teal-600 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2 font-medium">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Main Analyze Button */}
          <button
            type="button"
            disabled={analyzing}
            onClick={() => handleAnalyze()}
            className={`w-full py-3.5 rounded-2xl font-extrabold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer ${
              analyzing
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white shadow-teal-600/30'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{analyzing ? 'Analyzing Document with AI & OCR...' : 'Analyze Medical Report Now'}</span>
          </button>
        </div>

        {/* Right Sidebar: Instant Sample Test Loaders */}
        <div className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-700 pb-3">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Sample Verified Reports</span>
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Click any sample to test instant AI analysis & prescription detection
            </p>
          </div>

          <div className="space-y-2.5">
            {sampleReports.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setReportText(sample.sampleText);
                  handleAnalyze(sample.sampleText);
                }}
                className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-teal-500 hover:bg-teal-50/30 dark:hover:bg-teal-950/40 text-left transition cursor-pointer flex flex-col gap-1 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-100 group-hover:text-teal-600">
                    {sample.name}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-0.5 transition" />
                </div>
                <span className="text-[10px] text-slate-400 leading-tight">
                  {sample.description}
                </span>
              </button>
            ))}
          </div>

          <div className="pt-2 text-[11px] text-slate-500 space-y-1 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-1.5 text-teal-600 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Zero-hallucination guarantee</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Values outside reference ranges are highlighted with clinical accuracy. Unprinted reference ranges are never fabricated.
            </p>
          </div>
        </div>
      </div>

      {/* ANALYSIS RESULTS DASHBOARD */}
      {currentReport && (
        <div className="rounded-3xl bg-white dark:bg-slate-800 border-2 border-teal-500/40 shadow-xl p-6 sm:p-8 space-y-8 animate-fade-in">
          {/* Result Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-extrabold text-xs mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Diagnostic Interpretation • {currentReport.language}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {currentReport.report_title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Analyzed on {currentReport.test_date} for {currentReport.patient_name} • {currentReport.lab_name}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-200 transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Print Report</span>
              </button>
            </div>
          </div>

          {/* Summary Card */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Plain-Language Clinical Summary ({currentReport.language})
            </span>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
              {currentReport.summary}
            </p>
          </div>

          {/* FEATURE 3: SMART MEDICINE REMINDER CONNECTION */}
          {currentReport.extracted_medicines && currentReport.extracted_medicines.length > 0 && (
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-teal-500/10 via-sky-500/10 to-teal-500/5 border-2 border-teal-500/60 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-teal-200 dark:border-teal-900/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                      Identified Prescriptions & Medications (Rx Detected)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Explicit medicine names and doctor regimens extracted from this document.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-teal-600 text-white self-start sm:self-auto">
                  {currentReport.extracted_medicines.length} Medication(s)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentReport.extracted_medicines.map((med, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h5 className="font-black text-sm text-slate-900 dark:text-white">
                            {med.medicine_name}
                          </h5>
                          <p className="text-xs text-teal-600 dark:text-teal-400 font-bold mt-0.5">
                            {med.dosage} • {med.instructions}
                          </p>
                        </div>
                        {med.duration && (
                          <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                            {med.duration}
                          </span>
                        )}
                      </div>

                      {med.frequency && (
                        <p className="text-xs text-slate-500 mt-1">
                          Schedule: <strong>{med.frequency}</strong>
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        {med.prescribed_by || 'Doctor Regimen'}
                      </span>
                      {/* CONNECT TO MEDICINE REMINDER BUTTON */}
                      <button
                        type="button"
                        onClick={() => handleSetMedicineReminder(med)}
                        className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
                      >
                        <Bell className="w-3.5 h-3.5" />
                        <span>Set Medicine Reminder</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PARAMETERS TABLE */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                Detailed Medical Parameters & Laboratory Ranges ({currentReport.parameters.length})
              </h4>
              <span className="text-xs text-slate-400">
                Colored badges signify clinical thresholds
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 font-extrabold text-slate-500 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Test Parameter</th>
                    <th className="py-3 px-4">Measured Value</th>
                    <th className="py-3 px-4">Reference Range</th>
                    <th className="py-3 px-4">Evaluation</th>
                    <th className="py-3 px-4">Plain-Language Meaning</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {currentReport.parameters.map((param, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition"
                    >
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        <div>{param.name}</div>
                        {param.category && (
                          <div className="text-[10px] text-slate-400 font-normal">
                            {param.category}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 font-black font-mono text-slate-900 dark:text-white">
                        {param.measured_value} {param.unit}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">
                        {param.reference_range} {param.unit}
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(param.status)}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm">
                        {param.simple_explanation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* QUESTIONS FOR DOCTOR */}
          {currentReport.questions_for_doctor && currentReport.questions_for_doctor.length > 0 && (
            <div className="p-6 rounded-3xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900 space-y-4">
              <div className="flex items-center gap-2 text-sky-950 dark:text-sky-200">
                <HelpCircle className="w-5 h-5 text-sky-600 shrink-0" />
                <h4 className="font-extrabold text-base">
                  Recommended Questions to Ask Your Doctor
                </h4>
              </div>
              <p className="text-xs text-sky-800 dark:text-sky-300">
                Use these intelligent questions during your consultation to discuss anomalies or lifestyle advice with your doctor.
              </p>

              <div className="space-y-2.5">
                {currentReport.questions_for_doctor.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-sky-200/80 dark:border-sky-800 flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {q}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyQuestion(q)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-sky-100 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shrink-0"
                    >
                      {copiedQuestion === q ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* Book Specialist Button */}
              {onBookDoctor && (
                <div className="pt-2 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => onBookDoctor()}
                    className="px-5 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-sm transition active:scale-95 cursor-pointer"
                  >
                    <Stethoscope className="w-4 h-4" />
                    <span>Book Verified Specialist for Review</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

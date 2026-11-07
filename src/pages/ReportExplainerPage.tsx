import React, { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
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
} from 'lucide-react';
import { AnalyzedReport, MedicalParameter, UserRole, Doctor, FamilyMember } from '../types';
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

export const ReportExplainerPage: React.FC<Props> = ({
  userRole,
  familyMembers = [],
  onBookDoctor,
  onNavigateTab,
  onBack,
  onHome,
  onDashboard,
}) => {
  const { t, language } = useTranslation();
  const [analyzedReports, setAnalyzedReports] = useState<AnalyzedReport[]>([]);
  const [activeReport, setActiveReport] = useState<AnalyzedReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [reportText, setReportText] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [copiedQuestionIndex, setCopiedQuestionIndex] = useState<number | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('fam-self');
  const [saveSuccessBanner, setSaveSuccessBanner] = useState(false);

  // Load existing reports from database
  const loadReports = async () => {
    try {
      const data = await api.getAnalyzedReports();
      setAnalyzedReports(data);
      if (data.length > 0 && !activeReport) {
        setActiveReport(data[0]);
      }
    } catch (err) {
      console.error('Error loading reports:', err);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFileName(file.name);
    // Read preview text if plain text / json or display file name
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setReportText(content.slice(0, 3000));
    };
    reader.readAsText(file);
  };

  const handleAnalyze = async (samplePreset?: 'cbc' | 'lipid' | 'sugar') => {
    try {
      setLoading(true);
      let textToSend = reportText;
      let filename = selectedFileName || 'Lab_Report.pdf';

      if (samplePreset === 'cbc') {
        textToSend = `Complete Blood Count (CBC)
Vijaya Diagnostic Center
Patient: Gowtham Bikkina | Age: 35 | Gender: Male
Hemoglobin: 14.2 g/dL (Reference: 13.0 - 17.0)
Total WBC Count: 11,800 cells/cu.mm (Reference: 4,000 - 11,000)
Platelet Count: 260,000 /cu.mm (Reference: 150,000 - 450,000)
RBC Count: 4.8 mill/cu.mm (Reference: 4.5 - 5.5)
Neutrophils: 68% (Reference: 40 - 75)
Lymphocytes: 24% (Reference: 20 - 40)`;
        filename = 'Sample_Complete_Blood_Count.pdf';
      } else if (samplePreset === 'lipid') {
        textToSend = `Lipid Profile Report
Vijaya Diagnostic Center
Patient: Gowtham Bikkina | Age: 35
Total Cholesterol: 210 mg/dL (Reference: 125 - 200)
HDL Cholesterol: 48 mg/dL (Reference: 40 - 60)
LDL Cholesterol: 136 mg/dL (Reference: < 100)
Triglycerides: 145 mg/dL (Reference: < 150)`;
        filename = 'Sample_Lipid_Profile.pdf';
      } else if (samplePreset === 'sugar') {
        textToSend = `Glycemic Evaluation & Diabetic Screen
Vijaya Diagnostic Center
Fasting Blood Sugar (Glucose): 104 mg/dL (Reference: 70 - 99)
HbA1c (Glycated Hemoglobin): 5.9 % (Reference: < 5.7 Normal, 5.7 - 6.4 Prediabetes)`;
        filename = 'Sample_Diabetes_HbA1c.pdf';
      }

      const activeMember = familyMembers.find((m) => m.id === selectedMemberId);

      const res = await api.analyzeMedicalReport({
        reportText: textToSend,
        fileName: filename,
        fileType: filename.endsWith('.jpg') || filename.endsWith('.png') ? 'image' : 'application/pdf',
        patientId: 'pat-default',
        patientName: activeMember ? activeMember.name : 'Gowtham Bikkina',
        familyMemberId: selectedMemberId,
        familyMemberName: activeMember ? activeMember.name : 'Gowtham Bikkina',
        language: language,
      });

      setActiveReport(res.report);
      setSaveSuccessBanner(true);
      setTimeout(() => setSaveSuccessBanner(false), 5000);
      await loadReports();
    } catch (err: any) {
      alert(err.message || 'Error analyzing medical report.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyQuestion = (q: string, idx: number) => {
    navigator.clipboard.writeText(q);
    setCopiedQuestionIndex(idx);
    setTimeout(() => setCopiedQuestionIndex(null), 2500);
  };

  const handleDeleteReport = async (id: string) => {
    if (!confirm('Are you sure you want to delete this saved analysis?')) return;
    try {
      await api.deleteAnalyzedReport(id);
      if (activeReport?.id === id) {
        setActiveReport(null);
      }
      await loadReports();
    } catch (err: any) {
      alert(err.message || 'Failed to delete report');
    }
  };

  const getStatusBadge = (status: MedicalParameter['status']) => {
    switch (status) {
      case 'NORMAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3" />
            <span>{t('report.statusNormal', 'Normal')}</span>
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
            <TrendingUp className="w-3 h-3" />
            <span>{t('report.statusHigh', 'High')}</span>
          </span>
        );
      case 'LOW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
            <TrendingDown className="w-3 h-3" />
            <span>{t('report.statusLow', 'Low')}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <AlertTriangle className="w-3 h-3" />
            <span>{status}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title={t('report.pageTitle', 'AI Medical Report Explainer')}
        subtitle={t(
          'report.pageSubtitle',
          'Upload lab reports to understand clinical parameters, reference ranges, and tailored doctor consultation questions.'
        )}
        badge="Module 1: AI Health Literacy"
        onBack={onBack}
        onHome={onHome}
        onDashboard={onDashboard}
        userRole={userRole}
        icon={FileText}
      />

      {/* Mandatory Medical Safety Disclaimer */}
      <div className="p-4 sm:p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 shadow-xs flex items-start gap-3.5">
        <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="text-xs space-y-1">
          <h4 className="font-bold text-amber-900 dark:text-amber-100">
            {t('report.disclaimerTitle', 'Important Clinical & Safety Disclaimer')}
          </h4>
          <p className="text-amber-800/90 dark:text-amber-200/90 leading-relaxed">
            {t(
              'report.disclaimerText',
              'Universal Health Care AI provides plain-language educational summaries only. This is not a diagnosis or prescription. Always consult a verified physician for clinical decisions.'
            )}
          </p>
        </div>
      </div>

      {saveSuccessBanner && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Report analyzed and saved securely in your patient account vault.</span>
          </div>
          <button
            onClick={() => setSaveSuccessBanner(false)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Upload & Sample Tester */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-sky-600" />
                <span>{t('report.uploadTitle', 'Upload Medical Report')}</span>
              </h3>
              <span className="text-[10px] uppercase font-mono font-bold text-slate-400">PDF / JPG / PNG</span>
            </div>

            {/* Family Member Association */}
            {familyMembers.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Report Belongs To:
                </label>
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
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
            )}

            {/* Drag & Drop Upload Container */}
            <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-sky-500 dark:hover:border-sky-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition bg-slate-50/50 dark:bg-slate-900/40">
              <Upload className="w-8 h-8 text-sky-500 mb-2 animate-bounce" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {selectedFileName || t('report.uploadSubtitle', 'Click to choose file')}
              </span>
              <span className="text-[10px] text-slate-500 mt-1">Supports blood work, lipid, sugar, thyroid, urine & scan summaries</span>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* Quick Demonstration Samples */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Quick Sample Reports (1-Click Test):
              </span>
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => handleAnalyze('cbc')}
                  disabled={loading}
                  className="w-full text-left p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-200 dark:border-sky-900 text-xs font-bold text-sky-800 dark:text-sky-300 flex items-center justify-between transition cursor-pointer"
                >
                  <span>{t('report.sampleCbc', 'Sample CBC Blood Test')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleAnalyze('lipid')}
                  disabled={loading}
                  className="w-full text-left p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100 dark:hover:bg-teal-900/60 border border-teal-200 dark:border-teal-900 text-xs font-bold text-teal-800 dark:text-teal-300 flex items-center justify-between transition cursor-pointer"
                >
                  <span>{t('report.sampleLipid', 'Sample Lipid Profile')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleAnalyze('sugar')}
                  disabled={loading}
                  className="w-full text-left p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-900 text-xs font-bold text-purple-800 dark:text-purple-300 flex items-center justify-between transition cursor-pointer"
                >
                  <span>{t('report.sampleSugar', 'Sample Diabetes HbA1c')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Custom File Analyze Button */}
            {selectedFileName && (
              <button
                type="button"
                onClick={() => handleAnalyze()}
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loading ? t('report.analyzing', 'Analyzing...') : t('report.analyzeBtn', 'Analyze Uploaded File')}</span>
              </button>
            )}
          </div>

          {/* Saved Reports History Sidebar */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {t('report.savedReports', 'Saved Reports')} ({analyzedReports.length})
              </h4>
              <button
                onClick={loadReports}
                className="text-xs text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Sync</span>
              </button>
            </div>

            {analyzedReports.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                No reports saved yet. Analyze a sample above.
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {analyzedReports.map((r) => {
                  const isSelected = activeReport?.id === r.id;
                  return (
                    <div
                      key={r.id}
                      onClick={() => setActiveReport(r)}
                      className={`p-3 rounded-2xl border text-xs cursor-pointer transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-300 dark:border-sky-800'
                          : 'bg-slate-50/60 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <p className="font-bold text-slate-800 dark:text-slate-100 truncate">{r.report_title}</p>
                        <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{r.test_date}</span>
                          {r.family_member_name && <span>• {r.family_member_name}</span>}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteReport(r.id);
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                        title="Delete report"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right 2 Columns: Analysis Results & Doctor Questions */}
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <div className="p-12 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950 text-sky-600 mx-auto flex items-center justify-center animate-spin">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {t('report.analyzing', 'Extracting parameters and analyzing report...')}
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Cross-referencing laboratory parameters against verified standard biological ranges in {language}.
                </p>
              </div>
            </div>
          ) : activeReport ? (
            <div className="space-y-6">
              {/* Report Header Card */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-sky-600">
                      Laboratory Parameter Breakdown
                    </span>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      {activeReport.report_title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                      {activeReport.test_date}
                    </span>
                    {activeReport.family_member_name && (
                      <span className="px-2.5 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-xs font-semibold">
                        {activeReport.family_member_name}
                      </span>
                    )}
                  </div>
                </div>

                {/* Plain-Language Clinical Summary */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-1">
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-sky-600" />
                    <span>Plain-Language Summary ({activeReport.language || language}):</span>
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed pl-5">
                    {activeReport.summary}
                  </p>
                </div>
              </div>

              {/* Parameters Table / Cards */}
              <div className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                    <span>Extracted Parameters & Reference Range Comparison</span>
                  </h4>
                  <span className="text-xs text-slate-500">{activeReport.parameters.length} Parameters</span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {activeReport.parameters.map((p, idx) => {
                    const isAbnormal = p.status === 'HIGH' || p.status === 'LOW' || p.status === 'CRITICAL';
                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border transition ${
                          isAbnormal
                            ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                            : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-700/80'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
                          <div>
                            <span className="text-xs font-black text-slate-900 dark:text-white">{p.name}</span>
                            <span className="text-[10px] text-slate-400 ml-2">({p.category})</span>
                          </div>
                          <div>{getStatusBadge(p.status)}</div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2.5 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase font-bold">
                              {t('report.measuredValue', 'Measured Value')}
                            </span>
                            <span className={`text-sm font-black ${isAbnormal ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-100'}`}>
                              {p.measured_value} {p.unit}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase font-bold">
                              {t('report.referenceRange', 'Standard Reference Range')}
                            </span>
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                              {p.reference_range} {p.unit}
                            </span>
                          </div>
                          <div className="col-span-2 sm:col-span-1">
                            <span className="text-[10px] text-slate-400 block uppercase font-bold">
                              Clinical Interpretation
                            </span>
                            <span className="text-xs text-slate-600 dark:text-slate-300">
                              {p.simple_explanation}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Questions for Doctor Section */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-teal-950 to-sky-950 text-white shadow-xl border border-teal-800/40 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-teal-400" />
                    <h4 className="text-sm font-bold text-white">
                      {t('report.questionsTitle', 'Questions to Ask Your Doctor')}
                    </h4>
                  </div>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    Patient Consultation Prep
                  </span>
                </div>

                <p className="text-xs text-slate-300">
                  Take these AI-generated questions to your upcoming doctor visit to have a focused, clear conversation:
                </p>

                <div className="space-y-2">
                  {activeReport.questions_for_doctor.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start justify-between gap-3 text-xs"
                    >
                      <span className="text-teal-200 font-bold">{idx + 1}.</span>
                      <p className="flex-1 text-slate-200 leading-relaxed">{q}</p>
                      <button
                        type="button"
                        onClick={() => handleCopyQuestion(q, idx)}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
                        title="Copy question"
                      >
                        {copiedQuestionIndex === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Consultation Navigation Shortcut */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
                  <span className="text-[11px] text-slate-400">
                    Need a specialist to review these results?
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateTab) onNavigateTab('doctors');
                      else if (onBookDoctor) onBookDoctor();
                    }}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Stethoscope className="w-4 h-4" />
                    <span>Find & Consult a Verified Specialist</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs text-center space-y-3">
              <FileText className="w-10 h-10 text-slate-400 mx-auto" />
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
                No Report Currently Selected
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Choose a sample report on the left or upload your own laboratory document to view simple explanations and doctor consultation questions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

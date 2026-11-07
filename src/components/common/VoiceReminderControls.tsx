import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Square,
  Bell,
  Sun,
  Sunset,
  Moon,
  Sparkles,
  CheckCircle2,
  PhoneCall,
  Activity,
} from 'lucide-react';
import { DoseTimeSlot } from '../../types';
import {
  VoiceLanguage,
  VOICE_MESSAGES,
  getVoiceMessage,
} from '../../hooks/useMedicineVoiceReminder';

interface Props {
  voiceLanguage: VoiceLanguage;
  setVoiceLanguage: (lang: VoiceLanguage) => void;
  isSpeaking: boolean;
  currentSpokenText: string;
  onHearReminder: (slot: DoseTimeSlot, medicineName?: string) => void;
  onPreviewVoice: (slot: DoseTimeSlot, medicineName?: string) => void;
  onStopVoice: () => void;
  onTestReminder: (slot: DoseTimeSlot) => void;
  autoVoiceEnabled: boolean;
  setAutoVoiceEnabled: (enabled: boolean) => void;
  notificationPermission: NotificationPermission;
  onRequestPermission: () => void;
}

export const VoiceReminderControls: React.FC<Props> = ({
  voiceLanguage,
  setVoiceLanguage,
  isSpeaking,
  currentSpokenText,
  onHearReminder,
  onPreviewVoice,
  onStopVoice,
  onTestReminder,
  autoVoiceEnabled,
  setAutoVoiceEnabled,
  notificationPermission,
  onRequestPermission,
}) => {
  const [selectedTiming, setSelectedTiming] = useState<DoseTimeSlot>('Afternoon');
  const [sampleMedName, setSampleMedName] = useState<string>('');

  const timings: Array<{
    slot: DoseTimeSlot;
    label: string;
    teluguLabel: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }> = [
    {
      slot: 'Morning',
      label: 'Morning (ఉదయం)',
      teluguLabel: 'ఉదయం 08:00 AM',
      icon: Sun,
      color: 'text-amber-500 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-900',
    },
    {
      slot: 'Afternoon',
      label: 'Afternoon (మధ్యాహ్నం)',
      teluguLabel: 'మధ్యాహ్నం 01:30 PM',
      icon: Sun,
      color: 'text-orange-500 bg-orange-50 border-orange-200 dark:bg-orange-950/40 dark:border-orange-900',
    },
    {
      slot: 'Evening',
      label: 'Evening (సాయంత్రం)',
      teluguLabel: 'సాయంత్రం 06:00 PM',
      icon: Sunset,
      color: 'text-purple-500 bg-purple-50 border-purple-200 dark:bg-purple-950/40 dark:border-purple-900',
    },
    {
      slot: 'Night',
      label: 'Night (రాత్రి)',
      teluguLabel: 'రాత్రి 08:30 PM',
      icon: Moon,
      color: 'text-indigo-500 bg-indigo-50 border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-900',
    },
  ];

  const currentPreviewText = getVoiceMessage(selectedTiming, sampleMedName, voiceLanguage);

  return (
    <div className="rounded-3xl bg-gradient-to-br from-teal-500/10 via-white to-sky-500/10 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-2 border-teal-500/40 shadow-lg p-5 sm:p-6 space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/30">
            <Volume2 className={`w-6 h-6 ${isSpeaking ? 'animate-bounce' : ''}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                AI Voice Medicine Reminder
              </h3>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-teal-600 text-white tracking-wider">
                Telugu & English Voice
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Natural spoken audio alerts for Morning, Afternoon, Evening, and Night prescription doses.
            </p>
          </div>
        </div>

        {/* Language Selection */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setVoiceLanguage('Telugu')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              voiceLanguage === 'Telugu'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <span>తెలుగు (Telugu)</span>
            {voiceLanguage === 'Telugu' && <CheckCircle2 className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => setVoiceLanguage('English')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              voiceLanguage === 'English'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <span>English</span>
            {voiceLanguage === 'English' && <CheckCircle2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Spoken Text Display Box */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>
              {isSpeaking ? 'Now Speaking in ' + voiceLanguage : 'Selected Timing Voice Message'}
            </span>
          </span>
          {isSpeaking && (
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-teal-600 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-ping" />
              <span>Speaking audio...</span>
            </span>
          )}
        </div>

        <p className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 font-sans leading-relaxed">
          &ldquo;{isSpeaking ? currentSpokenText : currentPreviewText}&rdquo;
        </p>
      </div>

      {/* Timing Tabs */}
      <div>
        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
          Select Medicine Timing:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {timings.map((t) => {
            const Icon = t.icon;
            const isSelected = selectedTiming === t.slot;
            return (
              <button
                key={t.slot}
                type="button"
                onClick={() => setSelectedTiming(t.slot)}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-1.5 ${
                  isSelected
                    ? 'border-teal-500 bg-teal-50/80 dark:bg-teal-950/50 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-1.5 rounded-lg border ${t.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && (
                    <span className="text-[10px] font-extrabold text-teal-700 dark:text-teal-400 uppercase">
                      Active
                    </span>
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {t.slot}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {t.teluguLabel}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Buttons: 1. Hear Medicine Reminder, 2. Preview Voice, 3. Stop Voice, 4. Test Reminder */}
      <div className="pt-2 flex flex-wrap items-center gap-2.5">
        {/* Primary Hear Medicine Reminder Button */}
        <button
          type="button"
          onClick={() => onHearReminder(selectedTiming, sampleMedName)}
          className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 active:scale-98 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-teal-600/30 flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <Volume2 className="w-4 h-4" />
          <span>🔊 Hear Medicine Reminder</span>
        </button>

        {/* Preview Voice Button */}
        <button
          type="button"
          onClick={() => onPreviewVoice(selectedTiming, sampleMedName)}
          className="px-4 py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-600/20 flex items-center justify-center gap-1.5 transition cursor-pointer"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>▶ Preview Voice</span>
        </button>

        {/* Stop Voice Button */}
        <button
          type="button"
          onClick={onStopVoice}
          disabled={!isSpeaking}
          className={`px-3.5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition ${
            isSpeaking
              ? 'bg-rose-600 hover:bg-rose-500 text-white cursor-pointer shadow-md shadow-rose-600/20'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Square className="w-3.5 h-3.5 fill-current" />
          <span>Stop Voice</span>
        </button>

        {/* Test Reminder Button */}
        <button
          type="button"
          onClick={() => onTestReminder(selectedTiming)}
          className="px-4 py-3 rounded-2xl bg-slate-900 dark:bg-white dark:text-slate-900 text-white hover:bg-slate-800 active:scale-98 font-bold text-xs sm:text-sm shadow-sm flex items-center justify-center gap-1.5 transition cursor-pointer"
        >
          <Bell className="w-3.5 h-3.5 text-amber-400 dark:text-amber-600" />
          <span>Test Reminder</span>
        </button>
      </div>

      {/* Auto Trigger & Phone Notification Bar */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        {/* Toggle Automatic Scheduled Voice */}
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={autoVoiceEnabled}
            onChange={(e) => setAutoVoiceEnabled(e.target.checked)}
            className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
          />
          <span className="font-bold text-slate-700 dark:text-slate-300">
            Automatic voice reminder at scheduled prescription times
          </span>
        </label>

        {/* Notification Permission Status */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Phone Notification:</span>
          {notificationPermission === 'granted' ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-[11px]">
              <CheckCircle2 className="w-3 h-3" />
              <span>Permission Active</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={onRequestPermission}
              className="px-2.5 py-1 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold text-[11px] transition cursor-pointer"
            >
              Enable Phone Notifications
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

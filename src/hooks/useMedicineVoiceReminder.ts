import { useState, useEffect, useRef, useCallback } from 'react';
import { DoseTimeSlot, MedicineReminder } from '../types';

export type VoiceLanguage = 'Telugu' | 'English';

export interface VoiceReminderMessages {
  Morning: { telugu: string; english: string };
  Afternoon: { telugu: string; english: string };
  Evening: { telugu: string; english: string };
  Night: { telugu: string; english: string };
}

export const VOICE_MESSAGES: VoiceReminderMessages = {
  Morning: {
    telugu: 'మీరు ఉదయం వేసుకోవాల్సిన మందు సమయం అయింది. దయచేసి మీ మందును వేసుకోండి.',
    english: 'It is time to take your morning medicine. Please take your medicine on time.',
  },
  Afternoon: {
    telugu: 'మీరు మధ్యాహ్నం వేసుకోవాల్సిన టాబ్లెట్ సమయం అయింది. దయచేసి మీ మందును వేసుకోండి.',
    english: 'It is time to take your afternoon tablet. Please take your medicine.',
  },
  Evening: {
    telugu: 'మీరు సాయంత్రం వేసుకోవాల్సిన మందు సమయం అయింది. దయచేసి మీ మందును వేసుకోండి.',
    english: 'It is time to take your evening medicine. Please take your medicine on time.',
  },
  Night: {
    telugu: 'మీరు రాత్రి వేసుకోవాల్సిన మందు సమయం అయింది. దయచేసి మీ మందును వేసుకోండి.',
    english: 'It is time to take your night medicine. Please take your medicine on time.',
  },
};

export function getVoiceMessage(
  slot: DoseTimeSlot,
  medicineName?: string,
  lang: VoiceLanguage = 'Telugu'
): string {
  const base = VOICE_MESSAGES[slot] || VOICE_MESSAGES.Morning;
  if (!medicineName || medicineName.trim() === '') {
    return lang === 'Telugu' ? base.telugu : base.english;
  }

  // Personalized with medicine name
  if (lang === 'Telugu') {
    switch (slot) {
      case 'Morning':
        return `మీరు ఉదయం వేసుకోవాల్సిన మందు ${medicineName} సమయం అయింది. దయచేసి మీ మందును వేసుకోండి.`;
      case 'Afternoon':
        return `మీరు మధ్యాహ్నం వేసుకోవాల్సిన టాబ్లెట్ ${medicineName} సమయం అయింది. దయచేసి మీ మందును వేసుకోండి.`;
      case 'Evening':
        return `మీరు సాయంత్రం వేసుకోవాల్సిన మందు ${medicineName} సమయం అయింది. దయచేసి మీ మందును వేసుకోండి.`;
      case 'Night':
        return `మీరు రాత్రి వేసుకోవాల్సిన మందు ${medicineName} సమయం అయింది. దయచేసి మీ మందును వేసుకోండి.`;
    }
  }

  return `It is time to take your ${slot.toLowerCase()} medicine ${medicineName}. Please take your medicine on time.`;
}

// Gentle hospital alert chime using Web Audio API
export function playChimeAlert() {
  try {
    if (typeof window === 'undefined') return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Pleasant ascending chime: F5 (698Hz) to A5 (880Hz) to C6 (1046Hz)
    osc.frequency.setValueAtTime(698.46, now);
    osc.frequency.setValueAtTime(880.0, now + 0.12);
    osc.frequency.setValueAtTime(1046.5, now + 0.24);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.25, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.6);
  } catch (err) {
    console.warn('Audio chime notice:', err);
  }
}

export function useMedicineVoiceReminder(defaultLanguage: VoiceLanguage = 'Telugu') {
  const [voiceLanguage, setVoiceLanguage] = useState<VoiceLanguage>(defaultLanguage);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpokenText, setCurrentSpokenText] = useState<string>('');
  const [lastSpokenSlot, setLastSpokenSlot] = useState<DoseTimeSlot | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [autoVoiceEnabled, setAutoVoiceEnabled] = useState<boolean>(true);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );

  // Track fired reminders today so we don't spam every second
  const firedRemindersRef = useRef<Set<string>>(new Set());

  // Load browser voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const updateVoices = () => {
      const v = window.speechSynthesis.getVoices();
      setAvailableVoices(v);
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Request browser notification permission
  const requestNotificationPermission = useCallback(async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setNotificationPermission(perm);
        return perm === 'granted';
      } catch (e) {
        console.warn('Notification permission error:', e);
      }
    }
    return false;
  }, []);

  // Stop voice
  const stopVoice = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentSpokenText('');
    }
  }, []);

  // Speak a reminder
  const speakReminder = useCallback(
    (slot: DoseTimeSlot, medicineName?: string, lang: VoiceLanguage = voiceLanguage) => {
      if (typeof window === 'undefined') return;

      // Stop any prior speech
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }

      // 1. Play alerting chime first
      playChimeAlert();

      const message = getVoiceMessage(slot, medicineName, lang);
      setCurrentSpokenText(message);
      setLastSpokenSlot(slot);

      if (!('speechSynthesis' in window)) {
        console.warn('Speech synthesis not available in this browser');
        return;
      }

      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = lang === 'Telugu' ? 0.9 : 0.95;
      utterance.pitch = 1.0;

      // Assign language code and select best matching voice
      if (lang === 'Telugu') {
        utterance.lang = 'te-IN';
        const teluguVoice =
          availableVoices.find((v) => v.lang.toLowerCase() === 'te-in') ||
          availableVoices.find((v) => v.lang.toLowerCase().startsWith('te')) ||
          availableVoices.find((v) => v.lang.includes('IN')) ||
          null;
        if (teluguVoice) utterance.voice = teluguVoice;
      } else {
        utterance.lang = 'en-IN';
        const englishVoice =
          availableVoices.find((v) => v.lang.toLowerCase() === 'en-in') ||
          availableVoices.find((v) => v.lang.toLowerCase().startsWith('en')) ||
          null;
        if (englishVoice) utterance.voice = englishVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (err) => {
        console.warn('SpeechSynthesis error:', err);
        setIsSpeaking(false);
      };

      // Slight delay so chime sounds clearly first
      setTimeout(() => {
        try {
          window.speechSynthesis.speak(utterance);
        } catch (e) {
          console.error('Failed to trigger speech synthesis:', e);
          setIsSpeaking(false);
        }
      }, 350);
    },
    [availableVoices, voiceLanguage]
  );

  // Preview Voice Button Handler
  const previewVoice = useCallback(
    (slot: DoseTimeSlot, medicineName?: string) => {
      speakReminder(slot, medicineName, voiceLanguage);
    },
    [speakReminder, voiceLanguage]
  );

  // Dispatch Phone / Browser Notification
  const dispatchPhoneNotification = useCallback(
    (slot: DoseTimeSlot, medicineName?: string, lang: VoiceLanguage = voiceLanguage) => {
      const message = getVoiceMessage(slot, medicineName, lang);

      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          try {
            const notif = new Notification('🔊 AI Voice Medicine Reminder', {
              body: message,
              icon: '/favicon.ico',
              badge: '/favicon.ico',
              tag: `med-reminder-${slot}`,
              requireInteraction: true,
            });

            notif.onclick = () => {
              window.focus();
              speakReminder(slot, medicineName, lang);
              notif.close();
            };
          } catch (e) {
            console.warn('Notification construction error:', e);
          }
        }
      }
    },
    [speakReminder, voiceLanguage]
  );

  // Test Reminder Handler
  const testReminder = useCallback(
    async (slot: DoseTimeSlot = 'Afternoon', medicineName: string = 'Amlodipine 5mg') => {
      await requestNotificationPermission();
      dispatchPhoneNotification(slot, medicineName, voiceLanguage);
      speakReminder(slot, medicineName, voiceLanguage);
    },
    [requestNotificationPermission, dispatchPhoneNotification, speakReminder, voiceLanguage]
  );

  // Background Automatic Voice Reminder Engine (Scheduled Time Checker)
  const checkSchedules = useCallback(
    (medicines: MedicineReminder[]) => {
      if (!autoVoiceEnabled || medicines.length === 0) return;

      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const todayDateStr = now.toISOString().split('T')[0];

      medicines.forEach((med) => {
        med.schedule.forEach((item) => {
          if (item.takenToday) return; // already taken

          // Determine target time
          let targetHour = 8;
          let targetMinute = 0;

          // Parse time string e.g. "08:00 AM", "01:30 PM", "13:30", "08:30 PM"
          if (item.time) {
            const timeLower = item.time.toLowerCase();
            const isPM = timeLower.includes('pm');
            const isAM = timeLower.includes('am');
            const clean = item.time.replace(/[^\d:]/g, '');
            const parts = clean.split(':');
            let h = parseInt(parts[0], 10) || 0;
            const m = parseInt(parts[1], 10) || 0;

            if (isPM && h < 12) h += 12;
            if (isAM && h === 12) h = 0;

            targetHour = h;
            targetMinute = m;
          } else {
            // Default slot standards
            switch (item.slot) {
              case 'Morning':
                targetHour = 8;
                break;
              case 'Afternoon':
                targetHour = 13;
                targetMinute = 30;
                break;
              case 'Evening':
                targetHour = 18;
                break;
              case 'Night':
                targetHour = 20;
                targetMinute = 30;
                break;
            }
          }

          // Check if current time matches target hour and minute
          if (currentHours === targetHour && currentMinutes === targetMinute) {
            const reminderKey = `${todayDateStr}-${med.id}-${item.slot}-${targetHour}:${targetMinute}`;
            if (!firedRemindersRef.current.has(reminderKey)) {
              firedRemindersRef.current.add(reminderKey);

              // 1. Send push notification
              dispatchPhoneNotification(item.slot, med.medicine_name, voiceLanguage);

              // 2. Play chime & speak voice
              speakReminder(item.slot, med.medicine_name, voiceLanguage);
            }
          }
        });
      });
    },
    [autoVoiceEnabled, dispatchPhoneNotification, speakReminder, voiceLanguage]
  );

  return {
    voiceLanguage,
    setVoiceLanguage,
    isSpeaking,
    currentSpokenText,
    lastSpokenSlot,
    autoVoiceEnabled,
    setAutoVoiceEnabled,
    notificationPermission,
    requestNotificationPermission,
    speakReminder,
    stopVoice,
    previewVoice,
    testReminder,
    checkSchedules,
  };
}

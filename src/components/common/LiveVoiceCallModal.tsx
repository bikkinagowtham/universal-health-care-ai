import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bot,
  User,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  PhoneCall,
  Activity,
  Globe,
  Radio,
  RotateCcw,
} from 'lucide-react';
import { api } from '../../services/api';
import { SupportedLanguage } from '../../hooks/useSpeech';

// Web Speech API interface declarations
interface IWindow extends Window {
  webkitSpeechRecognition?: any;
  SpeechRecognition?: any;
}

export interface CallTurn {
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCallEnded: (summaryText: string) => void;
  initialLanguage: SupportedLanguage;
}

type CallStatus = 'connecting' | 'listening' | 'thinking' | 'speaking' | 'reconnecting' | 'ended';

export const LiveVoiceCallModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onCallEnded,
  initialLanguage,
}) => {
  // Call States
  const [callStatus, setCallStatus] = useState<CallStatus>('connecting');
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [callLanguage, setCallLanguage] = useState<SupportedLanguage>(
    initialLanguage === 'Telugu' ? 'Telugu' : 'English'
  );
  const [languageMode, setLanguageMode] = useState<'Auto' | 'Telugu' | 'English'>('Auto');
  const [liveTranscript, setLiveTranscript] = useState('');
  const [aiSpeechText, setAiSpeechText] = useState('');
  const [turns, setTurns] = useState<CallTurn[]>([]);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showRetry, setShowRetry] = useState(false);

  // References
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);
  const isCallActiveRef = useRef<boolean>(false);
  const isSpeakingRef = useRef<boolean>(false);
  const isProcessingTurnRef = useRef<boolean>(false);
  const speechStartTimeRef = useRef<number>(0);
  const silenceTimerRef = useRef<any>(null);
  const noSpeechTimerRef = useRef<any>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const durationTimerRef = useRef<any>(null);
  const safetyEndTimerRef = useRef<any>(null);
  const turnsRef = useRef<CallTurn[]>([]);
  const accumulatedTranscriptRef = useRef<string>('');

  // Function ref bridges to eliminate circular closures & TDZ
  const commitUserTurnRef = useRef<(text: string) => Promise<void>>(null as any);
  const speakAiResponseRef = useRef<(text: string, lang: SupportedLanguage) => void>(null as any);
  const restartRecognitionRef = useRef<(lang: SupportedLanguage) => void>(null as any);

  // Keep turnsRef in sync
  useEffect(() => {
    turnsRef.current = turns;
  }, [turns]);

  // Format Duration string MM:SS
  const formatDuration = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Play pleasant acoustic tone via Web Audio API
  const playTone = useCallback((type: 'connect' | 'disconnect' | 'bargein') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'connect') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(660, now + 0.15);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.3);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === 'disconnect') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(660, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.2);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'bargein') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(360, now);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      }
      setTimeout(() => {
        try {
          ctx.close();
        } catch (e) {
          // ignore
        }
      }, 600);
    } catch (e) {
      // Audio context might be restricted
    }
  }, []);

  // Detect Telugu or English from speech text
  const detectLanguage = (text: string): SupportedLanguage => {
    if (/[\u0c00-\u0c7f]/.test(text)) {
      return 'Telugu';
    }
    return 'English';
  };

  // Clean audio markdown text for clean speech synthesis
  const cleanSpokenText = (text: string): string => {
    return text
      .replace(/[*_#`~[\]()]/g, ' ')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/•/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Clear silence and no-speech timers
  const clearListeningTimers = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (noSpeechTimerRef.current) {
      clearTimeout(noSpeechTimerRef.current);
      noSpeechTimerRef.current = null;
    }
  }, []);

  // Start 12-second no-speech warning timer
  const scheduleNoSpeechCheck = useCallback((lang: SupportedLanguage) => {
    if (noSpeechTimerRef.current) {
      clearTimeout(noSpeechTimerRef.current);
    }

    noSpeechTimerRef.current = setTimeout(() => {
      if (
        isCallActiveRef.current &&
        !isSpeakingRef.current &&
        !isProcessingTurnRef.current &&
        !accumulatedTranscriptRef.current.trim()
      ) {
        const noSpeechMsg =
          lang === 'Telugu'
            ? 'క్షమించండి, మీ వాయిస్ వినపడటం లేదు. దయచేసి మీ మైక్రోఫోన్‌ను తనిఖీ చేసి మళ్లీ మాట్లాడండి.'
            : 'Sorry, I cannot hear your voice. Please check your microphone and speak again.';

        setAiSpeechText(noSpeechMsg);
        speakAiResponseRef.current(noSpeechMsg, lang);
      }
    }, 12000); // 12 seconds reasonable listening period
  }, []);

  // Safe SpeechRecognition restart helper
  const restartRecognitionSafely = useCallback(
    (lang: SupportedLanguage) => {
      if (!isCallActiveRef.current || isMuted) return;

      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
        recognitionRef.current = null;
      }

      const win = typeof window !== 'undefined' ? (window as unknown as IWindow) : null;
      const SpeechRecognitionClass = win?.SpeechRecognition || win?.webkitSpeechRecognition;
      if (!SpeechRecognitionClass) {
        setShowRetry(true);
        setErrorMessage('Browser speech recognition unavailable. You can retry or use Ask AI chat.');
        return;
      }

      try {
        const recognition = new SpeechRecognitionClass();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        recognition.lang = lang === 'Telugu' ? 'te-IN' : 'en-IN';

        recognition.onstart = () => {
          if (isCallActiveRef.current && !isSpeakingRef.current && !isProcessingTurnRef.current) {
            setCallStatus('listening');
            setShowRetry(false);
            setErrorMessage(null);
            scheduleNoSpeechCheck(lang);
          }
        };

        recognition.onresult = (event: any) => {
          if (!isCallActiveRef.current) return;

          // Barge-in check: If AI is speaking and user speaks after 500ms grace
          if (isSpeakingRef.current) {
            const elapsed = Date.now() - speechStartTimeRef.current;
            if (elapsed > 500) {
              if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
              }
              isSpeakingRef.current = false;
              setCallStatus('listening');
              setAiSpeechText('');
              playTone('bargein');
            } else {
              return;
            }
          }

          if (isProcessingTurnRef.current) return;

          // Collect interim and final segments across all available results
          let interim = '';
          let finalSegment = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const item = event.results[i];
            if (item.isFinal) {
              finalSegment += item[0].transcript;
            } else {
              interim += item[0].transcript;
            }
          }

          if (finalSegment) {
            accumulatedTranscriptRef.current +=
              (accumulatedTranscriptRef.current ? ' ' : '') + finalSegment.trim();
          }

          const currentDisplay = (
            accumulatedTranscriptRef.current + (interim ? ' ' + interim.trim() : '')
          ).trim();

          if (currentDisplay) {
            setLiveTranscript(currentDisplay);
            clearListeningTimers();

            // When user pauses for 1100ms, finalize turn and dispatch!
            silenceTimerRef.current = setTimeout(() => {
              if (isCallActiveRef.current && !isProcessingTurnRef.current) {
                const textToCommit = currentDisplay.trim();
                if (textToCommit.length >= 2) {
                  commitUserTurnRef.current(textToCommit);
                }
              }
            }, 1100);
          }
        };

        recognition.onerror = (event: any) => {
          if (event.error === 'not-allowed') {
            setPermissionError(
              'Microphone permission was denied. Please allow microphone access in your browser site permissions to use Live AI Voice Call.'
            );
            setCallStatus('ended');
          } else if (event.error === 'network') {
            setShowRetry(true);
            setErrorMessage('Network connection lost. Tap Retry to speak again.');
          } else if (event.error !== 'no-speech' && event.error !== 'aborted') {
            setShowRetry(true);
          }
        };

        recognition.onend = () => {
          // Restart recognition if call is active and in listening mode
          if (
            isCallActiveRef.current &&
            !isMuted &&
            !isSpeakingRef.current &&
            !isProcessingTurnRef.current
          ) {
            setTimeout(() => {
              if (
                isCallActiveRef.current &&
                !isSpeakingRef.current &&
                !isProcessingTurnRef.current
              ) {
                try {
                  recognition.start();
                } catch (e) {
                  // already running
                }
              }
            }, 150);
          }
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err) {
        console.warn('Failed to start speech recognition loop:', err);
        setShowRetry(true);
      }
    },
    [isMuted, playTone, scheduleNoSpeechCheck, clearListeningTimers]
  );
  restartRecognitionRef.current = restartRecognitionSafely;

  // Speak AI response and return to listening mode
  const speakAiResponse = useCallback(
    (textToSpeak: string, lang: SupportedLanguage) => {
      if (!isCallActiveRef.current) return;

      clearListeningTimers();

      if (isSpeakerMuted) {
        setTimeout(() => {
          if (isCallActiveRef.current) {
            isSpeakingRef.current = false;
            setCallStatus('listening');
            restartRecognitionRef.current(lang);
          }
        }, 1500);
        return;
      }

      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        setCallStatus('listening');
        restartRecognitionRef.current(lang);
        return;
      }

      // Stop previous utterance
      window.speechSynthesis.cancel();
      if (safetyEndTimerRef.current) {
        clearTimeout(safetyEndTimerRef.current);
      }

      const cleaned = cleanSpokenText(textToSpeak);
      if (!cleaned) {
        isSpeakingRef.current = false;
        setCallStatus('listening');
        restartRecognitionRef.current(lang);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleaned);
      currentUtteranceRef.current = utterance;

      const langCode = lang === 'Telugu' ? 'te-IN' : 'en-IN';
      utterance.lang = langCode;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Select closest matching voice
      const voices = window.speechSynthesis.getVoices();
      const matched =
        voices.find((v) => v.lang.toLowerCase() === langCode.toLowerCase()) ||
        voices.find((v) => v.lang.toLowerCase().startsWith(langCode.split('-')[0])) ||
        voices.find((v) => v.lang.includes('IN')) ||
        null;

      if (matched) {
        utterance.voice = matched;
      }

      const finalizeAiSpeech = () => {
        if (safetyEndTimerRef.current) {
          clearTimeout(safetyEndTimerRef.current);
          safetyEndTimerRef.current = null;
        }
        isSpeakingRef.current = false;
        if (isCallActiveRef.current) {
          setCallStatus('listening');
          setAiSpeechText('');
          accumulatedTranscriptRef.current = '';
          setLiveTranscript('');
          restartRecognitionRef.current(lang);
        }
      };

      utterance.onstart = () => {
        if (!isCallActiveRef.current) {
          window.speechSynthesis.cancel();
          return;
        }
        isSpeakingRef.current = true;
        speechStartTimeRef.current = Date.now();
        setCallStatus('speaking');
        setAiSpeechText(textToSpeak);

        // Safety timeout in case browser drops onend
        const estimatedDurationMs = Math.max(3000, cleaned.split(/\s+/).length * 450 + 2000);
        safetyEndTimerRef.current = setTimeout(() => {
          if (isSpeakingRef.current && isCallActiveRef.current) {
            finalizeAiSpeech();
          }
        }, estimatedDurationMs);
      };

      utterance.onend = () => {
        finalizeAiSpeech();
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis utterance error:', e);
        finalizeAiSpeech();
      };

      window.speechSynthesis.resume();
      window.speechSynthesis.speak(utterance);
    },
    [isSpeakerMuted, clearListeningTimers]
  );
  speakAiResponseRef.current = speakAiResponse;

  // Commit User Turn: User speaks -> AI understands -> AI generates -> AI speaks
  const commitUserTurn = useCallback(
    async (spokenText: string) => {
      if (!isCallActiveRef.current || isProcessingTurnRef.current) return;
      isProcessingTurnRef.current = true;
      clearListeningTimers();

      // Stop recognition while thinking
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
        recognitionRef.current = null;
      }

      // Language detection
      let activeLang = callLanguage;
      if (languageMode === 'Auto') {
        activeLang = detectLanguage(spokenText);
        setCallLanguage(activeLang);
      } else {
        activeLang = languageMode;
      }

      const userTurn: CallTurn = {
        sender: 'user',
        text: spokenText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setTurns((prev) => [...prev, userTurn]);
      setLiveTranscript('');
      accumulatedTranscriptRef.current = '';
      setCallStatus('thinking');
      setErrorMessage(null);
      setShowRetry(false);

      try {
        const historyContext = turnsRef.current.slice(-6).map((t) => ({
          sender: t.sender,
          text: t.text,
        }));

        const response = await api.queryAIAssistant({
          prompt: spokenText,
          language: activeLang,
          conversationHistory: historyContext,
          isVoiceCall: true,
        });

        if (!isCallActiveRef.current) return;

        const aiResponseText =
          response.text ||
          (activeLang === 'Telugu'
            ? 'యూనివర్సల్ హెల్త్ AI మీ వివరాలను సమీక్షించింది. మీకు మరిన్ని వివరాలు కావాలా?'
            : 'I have checked your healthcare query. How else may I assist you?');

        const aiTurn: CallTurn = {
          sender: 'ai',
          text: aiResponseText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setTurns((prev) => [...prev, aiTurn]);
        isProcessingTurnRef.current = false;

        // Automatically speak AI response (Step 5)
        speakAiResponseRef.current(aiResponseText, activeLang);
      } catch (err: any) {
        console.warn('Error in voice call processing:', err);
        isProcessingTurnRef.current = false;
        if (!isCallActiveRef.current) return;

        setShowRetry(true);
        setErrorMessage('Network connection slow. Tap Retry or speak again.');
        const fallbackMsg =
          activeLang === 'Telugu'
            ? 'క్షమించండి, మీ ప్రశ్నను ప్రాసెస్ చేయడంలో స్వల్ప సమస్య ఏర్పడింది. దయచేసి మళ్లీ చెప్పండి.'
            : 'Sorry, I had a momentary interruption. Could you please say that again?';

        speakAiResponseRef.current(fallbackMsg, activeLang);
      }
    },
    [callLanguage, languageMode, clearListeningTimers]
  );
  commitUserTurnRef.current = commitUserTurn;

  // Start Media Stream & Audio Visualizer
  const startMediaAndVisualizer = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        analyser.smoothingTimeConstant = 0.7;
        source.connect(analyser);
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const updateVisualizer = () => {
          if (!isCallActiveRef.current) return;
          analyser.getByteFrequencyData(dataArray);

          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          setAudioLevel(avg);

          animFrameRef.current = requestAnimationFrame(updateVisualizer);
        };

        animFrameRef.current = requestAnimationFrame(updateVisualizer);
      }

      return true;
    } catch (err: any) {
      console.error('Error accessing microphone:', err);
      setPermissionError(
        'Microphone access is required for Live Voice Call. Please allow microphone permissions in your browser address bar settings.'
      );
      return false;
    }
  }, []);

  // Connect Call
  const handleConnectCall = useCallback(async () => {
    setPermissionError(null);
    setErrorMessage(null);
    setShowRetry(false);
    setCallStatus('connecting');
    setDurationSeconds(0);
    setTurns([]);
    setLiveTranscript('');
    setAiSpeechText('');
    accumulatedTranscriptRef.current = '';
    isProcessingTurnRef.current = false;
    isCallActiveRef.current = true;

    // Start Audio Hardware
    const micGranted = await startMediaAndVisualizer();
    if (!micGranted) {
      isCallActiveRef.current = false;
      setCallStatus('ended');
      return;
    }

    // Play connect tone
    playTone('connect');

    // Start Call Timer
    durationTimerRef.current = setInterval(() => {
      setDurationSeconds((sec) => sec + 1);
    }, 1000);

    // Initial Natural AI Greeting
    const isTelugu = initialLanguage === 'Telugu';
    const greeting = isTelugu
      ? 'నమస్కారం! నేను యూనివర్సల్ హెల్త్ AI లైవ్ వాయిస్ అసిస్టెంట్‌ని. ఈరోజు మీకు ఎలా సహాయపడగలను? మీరు తెలుగు లేదా ఇంగ్లీషులో నాతో నేరుగా మాట్లాడవచ్చు.'
      : 'Hello! I am your Universal Health Care AI live voice assistant. How can I help you today? You can speak naturally in Telugu or English.';

    const initialAiTurn: CallTurn = {
      sender: 'ai',
      text: greeting,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setTurns([initialAiTurn]);

    // Speak initial greeting -> utterance.onend then automatically triggers listening
    speakAiResponseRef.current(greeting, isTelugu ? 'Telugu' : 'English');
  }, [initialLanguage, startMediaAndVisualizer, playTone]);

  // End Call & Cleanup
  const handleEndCall = useCallback(async () => {
    if (!isCallActiveRef.current && callStatus === 'ended') {
      onClose();
      return;
    }

    isCallActiveRef.current = false;
    isSpeakingRef.current = false;
    isProcessingTurnRef.current = false;
    setCallStatus('ended');

    clearListeningTimers();

    if (durationTimerRef.current) {
      clearInterval(durationTimerRef.current);
      durationTimerRef.current = null;
    }

    if (safetyEndTimerRef.current) {
      clearTimeout(safetyEndTimerRef.current);
      safetyEndTimerRef.current = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {
        // ignore
      }
      recognitionRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {
        // ignore
      }
      audioContextRef.current = null;
    }

    playTone('disconnect');

    const finalDuration = formatDuration(durationSeconds);
    const recordedTurns = turnsRef.current;

    let summaryText = '';
    try {
      const summaryRes = await api.generateCallSummary({
        transcript: recordedTurns.map((t) => ({ sender: t.sender, text: t.text })),
        duration: finalDuration,
        language: callLanguage,
      });
      summaryText = summaryRes.summary;
    } catch (err) {
      const isTelugu = callLanguage === 'Telugu';
      summaryText = isTelugu
        ? `📞 లైవ్ AI వాయిస్ కాల్ ముగిసింది (వ్యవధి: ${finalDuration})\n\n• చర్చించిన అంశాలు: సాధారణ ఆరోగ్య సమాచారం మరియు మార్గదర్శకత్వం.\n• సూచన: AI సలహా కేవలం సాధారణ సమాచారం కొరకు మాత్రమే. వైద్య చికిత్స లేదా మందుల మార్పులకు ఎల్లప్పుడూ రిజిస్టర్డ్ డాక్టర్‌ను సంప్రదించండి.`
        : `📞 Live AI Voice Call Ended (Duration: ${finalDuration})\n\n• Topics Discussed: General healthcare guidance and verified medical directory information.\n• Notice: Universal Health Care AI guidance is strictly educational. Consult a registered physician for diagnosis or treatment.`;
    }

    onCallEnded(summaryText);
    onClose();
  }, [callStatus, durationSeconds, callLanguage, clearListeningTimers, playTone, onCallEnded, onClose]);

  // Start call when opened
  useEffect(() => {
    if (isOpen) {
      handleConnectCall();
    } else {
      if (isCallActiveRef.current) {
        handleEndCall();
      }
    }

    return () => {
      if (isCallActiveRef.current) {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
        }
        if (durationTimerRef.current) {
          clearInterval(durationTimerRef.current);
        }
        clearListeningTimers();
      }
    };
  }, [isOpen]);

  // Toggle Microphone Mute
  const handleToggleMute = () => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      const nextMuted = !isMuted;
      audioTracks.forEach((t) => {
        t.enabled = !nextMuted;
      });
      setIsMuted(nextMuted);

      if (nextMuted && recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      } else if (!nextMuted && isCallActiveRef.current) {
        restartRecognitionRef.current(callLanguage);
      }
    }
  };

  // Toggle Speaker Output
  const handleToggleSpeaker = () => {
    const next = !isSpeakerMuted;
    setIsSpeakerMuted(next);
    if (next && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      isSpeakingRef.current = false;
      setCallStatus('listening');
      restartRecognitionRef.current(callLanguage);
    }
  };

  // Manual Retry button if speech recognition paused or failed
  const handleRetrySpeech = () => {
    setShowRetry(false);
    setErrorMessage(null);
    clearListeningTimers();
    accumulatedTranscriptRef.current = '';
    setLiveTranscript('');
    restartRecognitionRef.current(callLanguage);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-3 sm:p-6 animate-fade-in select-none">
      {/* Phone Call Card */}
      <div className="relative w-full max-w-lg h-[92vh] max-h-[720px] rounded-[36px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-teal-500/30 shadow-2xl flex flex-col justify-between overflow-hidden text-white shadow-teal-500/10">
        {/* Ambient Glows */}
        <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-teal-500/10 via-emerald-500/5 to-transparent pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Bar */}
        <div className="relative z-10 px-6 pt-6 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-400">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-tight text-white uppercase">
                  Universal Health AI
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500 text-slate-950 uppercase tracking-widest animate-pulse">
                  Live Call
                </span>
              </div>
              <p className="text-[10px] text-teal-300/80 font-medium">
                24x7 Conversational Healthcare Voice
              </p>
            </div>
          </div>

          {/* Language Mode Selector */}
          <div className="flex items-center bg-white/10 rounded-2xl p-1 text-[11px] font-bold border border-white/10">
            <button
              type="button"
              onClick={() => {
                setLanguageMode('Auto');
                setCallLanguage('Telugu');
                restartRecognitionRef.current('Telugu');
              }}
              className={`px-2 py-0.5 rounded-xl transition cursor-pointer ${
                languageMode === 'Auto' ? 'bg-teal-500 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
              title="Automatically detects Telugu or English"
            >
              Auto
            </button>
            <button
              type="button"
              onClick={() => {
                setLanguageMode('Telugu');
                setCallLanguage('Telugu');
                restartRecognitionRef.current('Telugu');
              }}
              className={`px-2.5 py-0.5 rounded-xl transition cursor-pointer ${
                languageMode === 'Telugu' ? 'bg-teal-500 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              తెలుగు
            </button>
            <button
              type="button"
              onClick={() => {
                setLanguageMode('English');
                setCallLanguage('English');
                restartRecognitionRef.current('English');
              }}
              className={`px-2.5 py-0.5 rounded-xl transition cursor-pointer ${
                languageMode === 'English' ? 'bg-teal-500 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Eng
            </button>
          </div>
        </div>

        {/* Center Calling Avatar & Status Animation */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-4 text-center">
          {/* Circular Pulse Rings */}
          <div className="relative mb-6 flex items-center justify-center">
            {/* Outer animated ripple */}
            <div
              className={`absolute rounded-full border-2 transition-all duration-300 ${
                callStatus === 'speaking'
                  ? 'w-48 h-48 border-emerald-400/30 animate-ping'
                  : callStatus === 'listening'
                  ? 'w-44 h-44 border-teal-400/25 animate-pulse'
                  : 'w-36 h-36 border-slate-700/40'
              }`}
              style={{
                transform: `scale(${1 + Math.min(audioLevel / 120, 0.4)})`,
              }}
            />

            {/* Middle glowing orb */}
            <div
              className={`absolute rounded-full transition-all duration-300 ${
                callStatus === 'speaking'
                  ? 'w-36 h-36 bg-gradient-to-tr from-emerald-500/20 via-teal-500/20 to-sky-500/20 blur-md'
                  : 'w-32 h-32 bg-teal-500/10 blur-sm'
              }`}
            />

            {/* Main Center Avatar */}
            <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 border-2 border-teal-400/80 shadow-2xl flex items-center justify-center shadow-teal-500/30">
              <Bot className="w-12 h-12 text-teal-400 animate-pulse" />

              {/* Status Mini Badge */}
              <div className="absolute -bottom-1 px-2.5 py-0.5 rounded-full bg-slate-900 border border-teal-400/60 text-[10px] font-extrabold text-teal-300 flex items-center gap-1 shadow-md">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    callStatus === 'speaking'
                      ? 'bg-emerald-400 animate-ping'
                      : callStatus === 'listening'
                      ? 'bg-teal-400 animate-pulse'
                      : callStatus === 'thinking'
                      ? 'bg-amber-400 animate-spin'
                      : 'bg-slate-400'
                  }`}
                />
                <span className="capitalize">{callStatus}</span>
              </div>
            </div>
          </div>

          {/* Caller Identity & Duration */}
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-1">
            Universal Health Care AI
          </h2>
          <p className="text-xs font-semibold text-teal-300 mb-2 flex items-center gap-1.5 justify-center">
            <span>{callLanguage === 'Telugu' ? 'తెలుగు & ఇంగ్లీష్ లైవ్ వాయిస్' : 'Telugu & English Live Voice'}</span>
            <span>•</span>
            <span className="font-mono text-emerald-400 font-bold">{formatDuration(durationSeconds)}</span>
          </p>

          {/* State Description Strip */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-200 mb-4">
            {callStatus === 'connecting' && <span>Connecting to live voice assistant...</span>}
            {callStatus === 'listening' && (
              <span className="flex items-center gap-1.5 text-teal-300">
                <Radio className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                <span>Listening to you... Speak naturally</span>
              </span>
            )}
            {callStatus === 'thinking' && (
              <span className="flex items-center gap-1.5 text-amber-300">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>AI is thinking & referencing directory...</span>
              </span>
            )}
            {callStatus === 'speaking' && (
              <span className="flex items-center gap-1.5 text-emerald-300 font-semibold">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                <span>AI Speaking (start speaking anytime to interrupt)</span>
              </span>
            )}
            {callStatus === 'ended' && <span>Call ended</span>}
          </div>

          {/* Live Audio Waveform Animation (24 vertical rounded bars) */}
          <div className="w-full max-w-xs h-12 flex items-center justify-center gap-1 my-2 px-2">
            {Array.from({ length: 24 }).map((_, idx) => {
              const baseHeight = 6;
              const isCenter = Math.abs(idx - 12);
              const dynamicFactor = Math.max(0, 1 - isCenter / 12);

              let barHeight = baseHeight;
              if (callStatus === 'speaking') {
                const wave = Math.sin((Date.now() / 150) + idx * 0.5) * 16 + 18;
                barHeight = Math.max(6, wave * dynamicFactor);
              } else if (callStatus === 'listening' && !isMuted) {
                const micWave = (audioLevel / 255) * 44 * dynamicFactor;
                barHeight = Math.max(6, micWave);
              }

              return (
                <div
                  key={idx}
                  className={`w-1.5 rounded-full transition-all duration-75 ${
                    callStatus === 'speaking'
                      ? 'bg-gradient-to-t from-emerald-500 to-teal-300'
                      : callStatus === 'listening'
                      ? 'bg-gradient-to-t from-teal-500 to-sky-300'
                      : 'bg-slate-700'
                  }`}
                  style={{
                    height: `${barHeight}px`,
                  }}
                />
              );
            })}
          </div>

          {/* Live Spoken Captions / AI Speech Text */}
          <div className="w-full max-w-md min-h-[64px] max-h-24 overflow-y-auto px-4 py-2.5 rounded-2xl bg-slate-900/80 border border-teal-500/20 text-xs text-slate-200 leading-relaxed text-center flex items-center justify-center shadow-inner">
            {liveTranscript ? (
              <p className="text-teal-300 font-medium italic">
                "{liveTranscript}"
              </p>
            ) : aiSpeechText ? (
              <p className="text-emerald-200 font-medium">
                {aiSpeechText}
              </p>
            ) : (
              <p className="text-slate-400 text-[11px]">
                {callLanguage === 'Telugu'
                  ? 'మీరు మాట్లాడుతుంటే ఇక్కడ లైవ్ మాటలు కనిపిస్తాయి...'
                  : 'Live spoken transcript will appear here as you talk...'}
              </p>
            )}
          </div>

          {/* Retry / Error Banner */}
          {(errorMessage || showRetry) && (
            <div className="mt-2.5 flex items-center justify-center gap-2">
              <span className="text-[11px] text-amber-300 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage || 'Speech recognition paused.'}</span>
              </span>
              <button
                type="button"
                onClick={handleRetrySpeech}
                className="px-2 py-0.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Retry Mic</span>
              </button>
            </div>
          )}

          {/* Permission Error Banner */}
          {permissionError && (
            <div className="mt-3 p-3 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{permissionError}</span>
            </div>
          )}
        </div>

        {/* Bottom Call Controls & Safety Strip */}
        <div className="relative z-10 px-6 pb-6 pt-2">
          {/* Medical Guidance Safety Strip */}
          <div className="mb-4 flex items-center justify-center gap-1.5 text-[10px] text-amber-300/80 bg-amber-950/30 border border-amber-500/20 py-1.5 px-3 rounded-full text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>AI Health Assistant • Non-diagnostic • Emergency: 108 / 112</span>
          </div>

          {/* Action Buttons: Mute | End Call | Speaker */}
          <div className="flex items-center justify-center gap-6">
            {/* Microphone Mute Toggle */}
            <button
              type="button"
              onClick={handleToggleMute}
              className={`w-14 h-14 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer shadow-lg ${
                isMuted
                  ? 'bg-rose-950 border-2 border-rose-500 text-rose-300'
                  : 'bg-white/10 hover:bg-white/20 border border-white/20 text-white'
              }`}
              title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
              aria-label="Toggle Microphone"
            >
              {isMuted ? <MicOff className="w-6 h-6 text-rose-400" /> : <Mic className="w-6 h-6" />}
              <span className="text-[9px] font-bold mt-0.5">{isMuted ? 'Muted' : 'Mute'}</span>
            </button>

            {/* Big Red End Call Button */}
            <button
              type="button"
              onClick={handleEndCall}
              className="w-18 h-18 rounded-full bg-gradient-to-r from-rose-600 via-rose-700 to-rose-600 hover:from-rose-500 hover:to-rose-600 text-white flex flex-col items-center justify-center shadow-2xl shadow-rose-600/40 border-2 border-rose-400/80 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="End Voice Call"
              aria-label="End Call"
            >
              <PhoneOff className="w-7 h-7" />
              <span className="text-[10px] font-black uppercase tracking-wider mt-0.5">End</span>
            </button>

            {/* Speaker Mute Toggle */}
            <button
              type="button"
              onClick={handleToggleSpeaker}
              className={`w-14 h-14 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer shadow-lg ${
                isSpeakerMuted
                  ? 'bg-amber-950 border-2 border-amber-500 text-amber-300'
                  : 'bg-white/10 hover:bg-white/20 border border-white/20 text-white'
              }`}
              title={isSpeakerMuted ? 'Turn Speaker On' : 'Turn Speaker Off'}
              aria-label="Toggle Speaker"
            >
              {isSpeakerMuted ? (
                <VolumeX className="w-6 h-6 text-amber-400" />
              ) : (
                <Volume2 className="w-6 h-6" />
              )}
              <span className="text-[9px] font-bold mt-0.5">{isSpeakerMuted ? 'Silent' : 'Speaker'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

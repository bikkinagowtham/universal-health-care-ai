import { useState, useEffect, useRef, useCallback } from 'react';

// Web Speech API interface declarations
interface IWindow extends Window {
  webkitSpeechRecognition?: any;
  SpeechRecognition?: any;
}

export type SupportedLanguage = 'English' | 'Telugu' | 'Hindi';

const LANG_CODE_MAP: Record<SupportedLanguage, string> = {
  English: 'en-IN',
  Telugu: 'te-IN',
  Hindi: 'hi-IN',
};

export function useSpeech(currentLanguage: SupportedLanguage) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const recognitionRef = useRef<any>(null);

  // Load available speech synthesis voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        const available = window.speechSynthesis.getVoices();
        setVoices(available);
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Initialize SpeechRecognition
  const startListening = useCallback(
    (onResultCallback?: (result: string) => void) => {
      setSpeechError(null);
      setTranscript('');

      const win = typeof window !== 'undefined' ? (window as unknown as IWindow) : null;
      const SpeechRecognitionClass = win?.SpeechRecognition || win?.webkitSpeechRecognition;

      if (!SpeechRecognitionClass) {
        setSpeechError('Speech recognition is not supported in this browser. Please type your query below.');
        return;
      }

      try {
        const recognition = new SpeechRecognitionClass();
        recognition.lang = LANG_CODE_MAP[currentLanguage] || 'en-IN';
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
          if (event.results[0].isFinal && onResultCallback) {
            onResultCallback(currentTranscript);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error event:', event.error);
          if (event.error === 'not-allowed') {
            setSpeechError('Microphone permission was denied. Please allow microphone access in your browser settings.');
          } else if (event.error === 'no-speech') {
            setSpeechError('No speech was detected. Please tap the microphone and try again.');
          } else {
            setSpeechError(`Speech recognition error: ${event.error}. You can also type your message.`);
          }
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err: any) {
        console.error('Error starting speech recognition:', err);
        setSpeechError('Could not start microphone. You can use text input instead.');
        setIsListening(false);
      }
    },
    [currentLanguage]
  );

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  // Text-To-Speech (SpeechSynthesis)
  const speak = useCallback(
    (text: string, lang: SupportedLanguage = currentLanguage) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        return;
      }

      // Stop previous utterance
      window.speechSynthesis.cancel();
      setIsSpeaking(false);

      if (!text || text.trim().length === 0) return;

      // Clean markdown tags for spoken audio
      const cleanText = text
        .replace(/[*_#`~[\]]/g, ' ')
        .replace(/\n+/g, '. ')
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      const targetLangCode = LANG_CODE_MAP[lang] || 'en-IN';
      utterance.lang = targetLangCode;
      utterance.rate = 0.95; // slightly deliberate for clarity
      utterance.pitch = 1.0;

      // Try finding the closest matching voice
      const targetPrefix = targetLangCode.split('-')[0];
      const matchedVoice =
        voices.find(v => v.lang.toLowerCase() === targetLangCode.toLowerCase()) ||
        voices.find(v => v.lang.toLowerCase().startsWith(targetPrefix)) ||
        voices.find(v => v.lang.includes('IN')) ||
        null;

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (e) => {
        console.warn('Speech synthesis error:', e);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    },
    [voices, currentLanguage]
  );

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    isListening,
    isSpeaking,
    transcript,
    speechError,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    hasSpeechRecognition:
      typeof window !== 'undefined' &&
      Boolean(
        (window as unknown as IWindow).SpeechRecognition ||
          (window as unknown as IWindow).webkitSpeechRecognition
      ),
  };
}

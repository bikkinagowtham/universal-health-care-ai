import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  AlertCircle,
  RotateCcw,
  Languages,
  CheckCircle2,
  PhoneCall,
  User,
  Bot,
  ExternalLink,
  ShieldCheck,
  Building2,
  Calendar,
  Clock,
  MapPin,
  Stethoscope,
} from 'lucide-react';
import { useSpeech, SupportedLanguage } from '../hooks/useSpeech';
import { api } from '../services/api';
import { PageHeader } from '../components/common/PageHeader';
import { UserRole, Hospital, Doctor } from '../types';
import { HospitalDetailsModal } from '../components/common/HospitalDetailsModal';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  language: SupportedLanguage;
  sources?: string[];
  timestamp: string;
  hospitals?: Hospital[];
  doctors?: Doctor[];
}

interface Props {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  onNavigateTab: (tab: string, filter?: any) => void;
  onBack?: () => void;
  onHome?: () => void;
  onDashboard?: () => void;
  userRole?: UserRole;
}

export const VoiceAssistantPage: React.FC<Props> = ({
  language,
  setLanguage,
  onNavigateTab,
  onBack,
  onHome,
  onDashboard,
  userRole,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text:
        language === 'Telugu'
          ? 'నమస్కారం! నేను యూనివర్సల్ హెల్త్ AI అసిస్టెంట్. నేను మీకు విజయవాడ, హైదరాబాద్ మరియు ఇతర నగరాల్లోని ధృవీకరించబడిన వైద్యులను కనుగొనడంలో సహాయం చేయగలను.'
          : language === 'Hindi'
          ? 'नमस्ते! मैं यूनिवर्सल हेल्थ केयर AI असिस्टेंट हूँ। मैं आपको विजयवाड़ा, हैदराबाद और अन्य शहरों में सत्यापित डॉक्टरों और अस्पतालों को खोजने में मदद कर सकता हूँ।'
          : 'Hello! I am the Universal Health AI Assistant. I can help you find verified doctors and hospitals across Vijayawada, Hyderabad, and other cities, check live queue status, or answer general healthcare navigation questions.',
      language,
      sources: ['National Health Authority Provider Registry'],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [selectedHospitalForModal, setSelectedHospitalForModal] = useState<Hospital | null>(null);

  const {
    isListening,
    isSpeaking,
    transcript,
    speechError,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    hasSpeechRecognition,
  } = useSpeech(language);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // When speech transcript completes, put it into input
  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      language,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const response = await api.queryAIAssistant({
        prompt: trimmed,
        language,
        conversationHistory: messages.slice(-4).map(m => ({ sender: m.sender, text: m.text })),
      });

      const assistantMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: response.text,
        language,
        sources: response.sources || ['Universal Health Care AI Directory'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        hospitals: response.hospitals,
        doctors: response.doctors,
      };

      setMessages(prev => [...prev, assistantMsg]);

      // Read aloud via browser speech synthesis if enabled
      if (autoSpeak) {
        speak(response.text, language);
      }
    } catch (err: any) {
      const errorMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text:
          err.message ||
          'Our verified directory is online. You can search verified doctors directly through the Find Doctors tab.',
        language,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
      if (inputText.trim()) {
        handleSendMessage(inputText);
      }
    } else {
      stopSpeaking();
      startListening((finalTranscript) => {
        handleSendMessage(finalTranscript);
      });
    }
  };

  const suggestedQueries = [
    {
      en: 'Apex Hospital, Rajahmundry',
      te: 'అపెక్స్ హాస్పిటల్, రాజమండ్రి',
      hi: 'एपेक्स अस्पताल, राजमुंदरी',
    },
    {
      en: 'KIMS Hospital, Hyderabad',
      te: 'కిమ్స్ హాస్పిటల్, హైదరాబాద్',
      hi: 'किम्स अस्पताल, हैदराबाद',
    },
    {
      en: 'Hospitals in Vijayawada',
      te: 'విజయవాడలో ఉన్న ఆసుపత్రులు',
      hi: 'विजयवाड़ा में अस्पताल',
    },
    {
      en: 'Fever treatment near me',
      te: 'జ్వరం చికిత్స కోసం ఆసుపత్రులు',
      hi: 'बुखार के इलाज के अस्पताल',
    },
    {
      en: 'Find a cardiologist in Vijayawada.',
      te: 'విజయవాడలో కార్డియాలజిస్ట్‌ను కనుగొనండి.',
      hi: 'विजयवाड़ा में कार्डियोलॉजिस्ट खोजें।',
    },
    {
      en: 'What is the current OPD token?',
      te: 'ప్రస్తుత OPD టోకెన్ ఎంత?',
      hi: 'वर्तमान ओपीडी टोकन क्या है?',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Complete Breadcrumb & Page Header */}
      <PageHeader
        title="AI Voice & Health Assistant"
        subtitle="Multilingual voice guidance grounded in verified provider data. Ask in Telugu, Hindi, or English."
        badge="Gemini AI Multilingual Assistant"
        badgeColor="text-teal-600 bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-800"
        onBack={onBack}
        onHome={onHome}
        onDashboard={onDashboard}
        userRole={userRole}
        icon={Sparkles}
      />

      {/* Hero Card with Language Selector & Voice Status */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-sky-900 via-teal-900 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Universal Health AI Voice Assistant</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Multilingual Voice & Chat Health Guide
          </h1>
          <p className="text-xs text-slate-300 max-w-lg">
            Speech-to-text and text-to-speech for seamless navigation in Telugu, Hindi, or English.
          </p>
        </div>

        {/* Language selector buttons */}
        <div className="flex items-center gap-1.5 bg-black/30 p-1.5 rounded-2xl border border-white/10 self-stretch sm:self-auto justify-center">
          {(['English', 'Telugu', 'Hindi'] as SupportedLanguage[]).map((lang) => (
            <button
              key={lang}
              onClick={() => {
                setLanguage(lang);
                stopSpeaking();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                language === lang
                  ? 'bg-teal-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {lang === 'Telugu' ? 'తెలుగు' : lang === 'Hindi' ? 'हिंदी' : 'English'}
            </button>
          ))}
        </div>
      </div>

      {/* Emergency & Non-Diagnostic Clinical Safety Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold leading-relaxed">
            <strong>Clinical Safety Protocol:</strong> The AI Assistant connects you with verified providers and provides public health information. It <strong>never provides medical diagnoses, writes prescriptions, or replaces a qualified doctor</strong>.
          </p>
          <p className="text-amber-800 dark:text-amber-300">
            For emergencies (severe chest pressure, breathing collapse, or stroke), dial <strong>108 (Ambulance)</strong> or <strong>112</strong> immediately.
          </p>
        </div>
      </div>

      {/* Main Conversation Container */}
      <div className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col h-[520px] overflow-hidden">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 text-white font-bold text-xs ${
                    isUser
                      ? 'bg-slate-800 dark:bg-slate-700'
                      : 'bg-gradient-to-br from-sky-600 to-teal-600 shadow-md shadow-sky-500/20'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-5 h-5" />}
                </div>

                <div
                  className={`max-w-[82%] sm:max-w-[75%] rounded-3xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-sky-600 text-white rounded-tr-none'
                      : 'bg-slate-100 dark:bg-slate-700/60 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-slate-600'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Clickable Hospital Cards attached to Assistant Answer */}
                  {!isUser && msg.hospitals && msg.hospitals.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600 space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                        Verified Matching Hospitals:
                      </span>
                      <div className="space-y-2">
                        {msg.hospitals.map(h => (
                          <div
                            key={h.id}
                            className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs text-xs space-y-2"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{h.name}</h4>
                                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-blue-500" />
                                  {h.address}, {h.city}
                                </p>
                              </div>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                                {h.verification_status}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-slate-600">
                              <span>OPD from: <strong>₹{h.consultation_fee_min}</strong></span>
                              <a href={`tel:${h.emergency_phone}`} className="text-rose-600 font-mono font-bold hover:underline flex items-center gap-1">
                                <PhoneCall className="w-3 h-3" /> {h.emergency_phone}
                              </a>
                            </div>

                            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
                              <button
                                onClick={() => setSelectedHospitalForModal(h)}
                                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                              >
                                View Profile
                              </button>
                              <button
                                onClick={() => onNavigateTab('appointments', { hospitalName: h.name })}
                                className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                              >
                                Book Consultation
                              </button>
                              <button
                                onClick={() => onNavigateTab('queue', { hospitalId: h.id })}
                                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-teal-50 text-teal-700 hover:bg-teal-100 transition-colors"
                              >
                                Track Queue
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Clickable Doctor Cards attached to Assistant Answer */}
                  {!isUser && msg.doctors && msg.doctors.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600 space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                        Verified Specialists:
                      </span>
                      <div className="space-y-2">
                        {msg.doctors.map(d => (
                          <div
                            key={d.id}
                            className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs text-xs flex items-center justify-between gap-3"
                          >
                            <div>
                              <h4 className="font-bold text-slate-900 dark:text-white">{d.name}</h4>
                              <p className="text-[11px] text-blue-600 font-medium">{d.specialization} • {d.hospital_name || d.city}</p>
                              <p className="text-[10px] text-slate-400 font-mono">Reg: {d.medical_registration_number}</p>
                            </div>
                            <div className="text-right flex flex-col items-end gap-1">
                              <span className="text-xs font-bold text-slate-800">₹{d.consultation_fee}</span>
                              <button
                                onClick={() => onNavigateTab('appointments', { doctorId: d.id })}
                                className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                              >
                                Book Slot
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sources attribution */}
                  {!isUser && msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-600 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                        <span>Sources: {msg.sources.join(', ')}</span>
                      </span>
                      <button
                        onClick={() => speak(msg.text, msg.language)}
                        className="hover:text-sky-600 cursor-pointer flex items-center gap-1 font-semibold"
                        title="Replay Voice Audio"
                      >
                        <Volume2 className="w-3.5 h-3.5" /> Speak
                      </button>
                    </div>
                  )}

                  <div className="text-[10px] opacity-60 text-right mt-1">
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-teal-600 text-white flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="rounded-3xl p-4 bg-slate-100 dark:bg-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]" />
                <span className="font-medium ml-1">Searching verified directory & synthesizing answer...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Listening Animation Indicator */}
        {isListening && (
          <div className="bg-sky-50 dark:bg-sky-950/60 border-t border-sky-200 dark:border-sky-800 px-4 py-2.5 flex items-center justify-between text-xs text-sky-800 dark:text-sky-300 animate-pulse">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
              <span className="font-bold">Listening now in {language}... Speak clearly into your microphone</span>
            </div>
            <button
              onClick={stopListening}
              className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
            >
              Stop Listening
            </button>
          </div>
        )}

        {/* Speech Error Notification */}
        {speechError && (
          <div className="bg-amber-50 border-t border-amber-200 px-4 py-2 text-xs text-amber-800 flex items-center justify-between">
            <span>{speechError}</span>
            <button onClick={() => {}} className="text-amber-900 font-bold ml-2">Dismiss</button>
          </div>
        )}

        {/* Speech Synthesis Active Banner */}
        {isSpeaking && (
          <div className="bg-teal-50 dark:bg-teal-950/60 border-t border-teal-200 dark:border-teal-800 px-4 py-2 flex items-center justify-between text-xs text-teal-800 dark:text-teal-300">
            <span className="flex items-center gap-2 font-medium">
              <Volume2 className="w-4 h-4 animate-bounce text-teal-600" />
              Reading response aloud in {language}...
            </span>
            <button
              onClick={stopSpeaking}
              className="px-2.5 py-0.5 rounded-lg bg-teal-600 text-white font-bold text-[11px] cursor-pointer"
            >
              Stop Voice
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="flex items-center gap-2"
          >
            {/* Microphone Button with Active Wave Indicator */}
            <button
              type="button"
              onClick={handleMicToggle}
              className={`p-3 rounded-2xl transition active:scale-95 flex items-center justify-center cursor-pointer shadow-sm ${
                isListening
                  ? 'bg-rose-600 text-white ring-4 ring-rose-200 dark:ring-rose-900/50 animate-pulse'
                  : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-teal-600 dark:text-teal-400 hover:bg-teal-50'
              }`}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Input field */}
            <input
              type="text"
              placeholder={
                language === 'Telugu'
                  ? 'మీ ప్రశ్నను టైప్ చేయండి లేదా మాట్లాడండి...'
                  : language === 'Hindi'
                  ? 'अपना प्रश्न टाइप करें या बोलें...'
                  : 'Ask about doctors, hospitals, queues, or symptoms...'
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-hidden focus:border-sky-500"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="p-3 rounded-2xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 disabled:opacity-40 text-white transition active:scale-95 cursor-pointer shadow-md shadow-sky-600/20"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>

          {/* Quick Voice Settings & Clear */}
          <div className="flex items-center justify-between pt-2 px-1 text-[11px] text-slate-500">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoSpeak}
                onChange={(e) => setAutoSpeak(e.target.checked)}
                className="rounded accent-teal-600"
              />
              <span>Read responses aloud automatically</span>
            </label>

            <button
              onClick={() => {
                stopSpeaking();
                setMessages([messages[0]]);
              }}
              className="hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
            >
              Clear conversation
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Suggested Medical & Navigation Queries:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {suggestedQueries.map((item, idx) => {
            const queryText = language === 'Telugu' ? item.te : language === 'Hindi' ? item.hi : item.en;
            return (
              <button
                key={idx}
                onClick={() => handleSendMessage(queryText)}
                className="p-3 text-left rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-500 hover:bg-teal-50/50 dark:hover:bg-teal-950/20 transition text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between group cursor-pointer shadow-2xs"
              >
                <span>&ldquo;{queryText}&rdquo;</span>
                <Sparkles className="w-3.5 h-3.5 text-teal-600 opacity-60 group-hover:opacity-100 flex-shrink-0 ml-2" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Hospital Details Modal */}
      {selectedHospitalForModal && (
        <HospitalDetailsModal
          hospital={selectedHospitalForModal}
          onClose={() => setSelectedHospitalForModal(null)}
          onBookAtHospital={h => onNavigateTab('appointments', { hospitalName: h.name })}
          onTrackQueue={id => onNavigateTab('queue', { hospitalId: id })}
        />
      )}
    </div>
  );
};

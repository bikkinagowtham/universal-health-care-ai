import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  Bot,
  User,
  ShieldCheck,
  ChevronDown,
  MessageSquare,
  AlertCircle,
  Clock,
  Building2,
  Stethoscope,
  PhoneCall,
  Phone,
  Radio,
} from 'lucide-react';
import { api } from '../../services/api';
import { useSpeech, SupportedLanguage } from '../../hooks/useSpeech';
import { LiveVoiceCallModal } from './LiveVoiceCallModal';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  sources?: string[];
  isError?: boolean;
}

interface Props {
  currentLanguage: SupportedLanguage;
  onNavigateTab?: (tab: string, filter?: any) => void;
}

export const FloatingAIAssistant: React.FC<Props> = ({
  currentLanguage,
  onNavigateTab,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [assistantLang, setAssistantLang] = useState<SupportedLanguage>(
    currentLanguage === 'Telugu' ? 'Telugu' : 'English'
  );
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);

  // Sync with global language if changed
  useEffect(() => {
    if (currentLanguage === 'Telugu' || currentLanguage === 'English') {
      setAssistantLang(currentLanguage);
    }
  }, [currentLanguage]);

  // Speech Recognition & TTS Hook
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    isSpeaking,
  } = useSpeech(assistantLang);

  // Initial Conversation Messages
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('uhc_assistant_chat_history');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          // ignore
        }
      }
    }
    return [
      {
        id: 'msg-welcome',
        sender: 'ai',
        text:
          'నమస్కారం! నేను మీ యూనివర్సల్ హెల్త్ AI అసిస్టెంట్. మీరు తెలుగు లేదా ఇంగ్లీషులో నన్ను ఏదైనా ఆరోగ్య సమాచారం, డాక్టర్లు, ఆసుపత్రులు, క్యూ టోకెన్లు లేదా మందుల రిమైండర్ల గురించి అడగవచ్చు.\n\nHello! I am your Universal Health AI Assistant. You can ask me healthcare questions in Telugu or English, check verified doctors, hospitals, or track queue tokens.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: ['Universal Health Care Verified Directory'],
      },
    ];
  });

  // Save history to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('uhc_assistant_chat_history', JSON.stringify(messages.slice(-20)));
    }
  }, [messages]);

  // Handle Voice Input Transcript
  useEffect(() => {
    if (transcript && transcript.trim()) {
      setInputText(transcript);
    }
  }, [transcript]);

  // Auto-scroll to bottom of chat
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Track speech stop
  useEffect(() => {
    if (!isSpeaking) {
      setSpeakingMsgId(null);
    }
  }, [isSpeaking]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    if (isListening) {
      stopListening();
    }

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Prepare previous messages for context
      const historyContext = messages.slice(-4).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const response = await api.queryAIAssistant({
        prompt: query,
        language: assistantLang,
        conversationHistory: historyContext,
      });

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: response.text || 'I have reviewed the medical directory for your query.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: response.sources || ['Universal Health Care AI Registry'],
      };

      setMessages((prev) => [...prev, aiMsg]);

      // If autoSpeak is on, speak the response
      if (autoSpeak) {
        setSpeakingMsgId(aiMsg.id);
        speak(aiMsg.text, assistantLang);
      }
    } catch (err: any) {
      console.error('AI chat error:', err);
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text:
          assistantLang === 'Telugu'
            ? 'క్షమించండి, మీ ప్రశ్నను ప్రాసెస్ చేయడంలో స్వల్ప సమస్య ఏర్పడింది. దయచేసి మళ్లీ ప్రయత్నించండి లేదా మీ ఇంటర్నెట్ కనెక్షన్‌ను తనిఖీ చేయండి.'
            : 'Sorry, I encountered an issue processing your request. Please click retry or try rephrasing your question.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryLast = () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.sender === 'user');
    if (lastUserMsg) {
      handleSendMessage(lastUserMsg.text);
    }
  };

  const handleToggleSpeak = (msg: ChatMessage) => {
    if (speakingMsgId === msg.id && isSpeaking) {
      stopSpeaking();
      setSpeakingMsgId(null);
    } else {
      stopSpeaking();
      setSpeakingMsgId(msg.id);
      speak(msg.text, assistantLang);
    }
  };

  const handleClearHistory = () => {
    if (confirm('Clear chat conversation history?')) {
      const resetMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        text:
          assistantLang === 'Telugu'
            ? 'చాట్ చరిత్ర క్లియర్ చేయబడింది. నేను మీకు ఎలా సహాయపడగలను?'
            : 'Chat history cleared. How can I assist you today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([resetMsg]);
    }
  };

  const handleCallEnded = (summaryText: string) => {
    const summaryMsg: ChatMessage = {
      id: `msg-call-${Date.now()}`,
      sender: 'ai',
      text: summaryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: ['Live AI Voice Call Session'],
    };
    setMessages((prev) => [...prev, summaryMsg]);
    setIsOpen(true);
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const quickPrompts = [
    {
      telugu: 'విజయవాడలో కార్డియాలజిస్ట్ ఎవరు ఉన్నారు?',
      english: 'Find cardiologists in Vijayawada',
    },
    {
      telugu: 'నా అపాయింట్‌మెంట్ మరియు OPD టోకెన్ స్థితి',
      english: 'Check my appointment and OPD queue token',
    },
    {
      telugu: '24/7 ICU & ఎమర్జెన్సీ ఆసుపత్రులు ఎక్కడ ఉన్నాయి?',
      english: 'Find 24x7 ICU & Emergency hospitals',
    },
    {
      telugu: 'మందుల రిమైండర్ ఎలా సెట్ చేయాలి?',
      english: 'How do I set a medicine reminder?',
    },
  ];

  return (
    <>
      {/* 1. FLOATING CIRCULAR "Ask AI" BUTTON (Fixed Bottom-Right on EVERY page) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in group select-none">
          {/* Subtle pulse wave */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-500 to-sky-500 opacity-70 blur-md animate-ping pointer-events-none group-hover:opacity-100 transition-opacity" />

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-slate-950 via-teal-900 to-sky-950 text-white font-extrabold text-xs sm:text-sm shadow-2xl border-2 border-teal-400/80 hover:border-teal-300 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-teal-500/30"
            title="Ask AI Health Assistant (Telugu & English Voice)"
            aria-label="Open AI Assistant"
          >
            <div className="w-6 h-6 rounded-full bg-teal-500 text-slate-950 flex items-center justify-center font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            </div>
            <span className="tracking-wide">Ask AI</span>
            <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        </div>
      )}

      {/* 2. MODERN FLOATING AI CHAT WINDOW */}
      {isOpen && (
        <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 w-[380px] sm:w-[420px] max-w-[calc(100vw-2rem)] h-[580px] max-h-[85vh] rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border-2 border-teal-500/40 flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-950 via-teal-950 to-slate-900 text-white flex items-center justify-between border-b border-teal-800/40">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-teal-400 to-sky-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-teal-500/20">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm text-white tracking-tight">
                    Universal Health AI
                  </h3>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-teal-500 text-slate-950 uppercase tracking-widest">
                    Gemini
                  </span>
                </div>
                <p className="text-[10px] text-teal-300 font-medium">
                  Telugu & English Healthcare Guide
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Call with AI Header Button */}
              <button
                type="button"
                onClick={() => {
                  stopSpeaking();
                  if (isListening) stopListening();
                  setIsCallModalOpen(true);
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-[11px] shadow-sm shadow-emerald-600/30 border border-emerald-400/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title="Start Live Voice Phone Call with AI"
              >
                <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
                <span className="hidden xs:inline">Call with AI</span>
                <span className="xs:hidden">Call</span>
              </button>

              {/* Language Switcher */}
              <div className="flex items-center bg-white/10 rounded-xl p-0.5 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setAssistantLang('Telugu')}
                  className={`px-2 py-0.5 rounded-lg transition ${
                    assistantLang === 'Telugu'
                      ? 'bg-teal-500 text-slate-950'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  తెలుగు
                </button>
                <button
                  type="button"
                  onClick={() => setAssistantLang('English')}
                  className={`px-2 py-0.5 rounded-lg transition ${
                    assistantLang === 'English'
                      ? 'bg-teal-500 text-slate-950'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Eng
                </button>
              </div>

              {/* Auto Speak Toggle */}
              <button
                type="button"
                onClick={() => setAutoSpeak(!autoSpeak)}
                className={`p-1.5 rounded-xl border text-xs transition ${
                  autoSpeak
                    ? 'bg-teal-500 text-slate-950 border-teal-400'
                    : 'bg-white/10 text-slate-300 border-white/10 hover:text-white'
                }`}
                title={autoSpeak ? 'Voice response enabled' : 'Voice response muted'}
              >
                {autoSpeak ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              {/* Clear History */}
              <button
                type="button"
                onClick={handleClearHistory}
                className="p-1.5 rounded-xl bg-white/10 text-slate-300 hover:text-white border border-white/10 transition"
                title="Clear chat history"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  stopSpeaking();
                  if (isListening) stopListening();
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                aria-label="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Medical Safety Disclaimer Strip */}
          <div className="bg-amber-50 dark:bg-amber-950/60 px-3 py-1.5 border-b border-amber-200 dark:border-amber-900/60 text-[10px] text-amber-900 dark:text-amber-200 flex items-center justify-between">
            <span className="font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-amber-600 shrink-0" />
              <span>General health literacy & verified directory only. Not a medical diagnosis.</span>
            </span>
            <span className="font-bold text-rose-600 dark:text-rose-400">Emergency: 108</span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[85%] space-y-1.5`}>
                    <div
                      className={`p-3.5 rounded-2xl whitespace-pre-line leading-relaxed shadow-xs ${
                        isUser
                          ? 'bg-teal-600 text-white rounded-tr-none'
                          : msg.isError
                          ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-900 rounded-tl-none'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700/80 rounded-tl-none'
                      }`}
                    >
                      {msg.text}

                      {/* Retry Button if error */}
                      {msg.isError && (
                        <div className="mt-2 pt-2 border-t border-rose-200 dark:border-rose-800 flex items-center justify-end">
                          <button
                            type="button"
                            onClick={handleRetryLast}
                            className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-[11px] flex items-center gap-1 hover:bg-rose-500 cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Retry</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Metadata & Audio Playback for AI messages */}
                    {!isUser && !msg.isError && (
                      <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                        <span>{msg.timestamp}</span>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleSpeak(msg)}
                            className={`flex items-center gap-1 font-bold px-2 py-0.5 rounded-md transition cursor-pointer ${
                              speakingMsgId === msg.id && isSpeaking
                                ? 'bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300'
                                : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500'
                            }`}
                            title="Listen to this response"
                          >
                            {speakingMsgId === msg.id && isSpeaking ? (
                              <>
                                <VolumeX className="w-3 h-3 text-teal-600 animate-pulse" />
                                <span>Stop Audio</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3 h-3 text-teal-600" />
                                <span>Listen</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="w-7 h-7 rounded-xl bg-slate-900 dark:bg-slate-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-tl-none border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce delay-150" />
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce delay-300" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-500">
                    {assistantLang === 'Telugu'
                      ? 'AI డైరెక్టరీని పరిశీలిస్తోంది...'
                      : 'AI is consulting verified records...'}
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[10px]">
            <span className="text-slate-400 font-bold uppercase shrink-0">Ask:</span>
            {quickPrompts.map((qp, idx) => {
              const label = assistantLang === 'Telugu' ? qp.telugu : qp.english;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(label)}
                  className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold truncate shrink-0 transition cursor-pointer"
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Voice Listening Active Strip */}
          {isListening && (
            <div className="px-4 py-2 bg-rose-50 dark:bg-rose-950/80 border-t border-rose-200 text-rose-800 dark:text-rose-200 text-xs flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                <span className="font-bold">
                  {assistantLang === 'Telugu'
                    ? 'మైక్రోఫోన్ ఆన్‌లో ఉంది... తెలుగులో మాట్లాడండి'
                    : 'Listening... Speak in English'}
                </span>
              </div>
              <button
                type="button"
                onClick={stopListening}
                className="text-[11px] font-extrabold text-rose-700 hover:underline cursor-pointer"
              >
                Stop
              </button>
            </div>
          )}

          {/* Option 3: Call with AI action strip */}
          <div className="px-3 py-1.5 bg-gradient-to-r from-emerald-950/20 via-teal-950/20 to-slate-900/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium text-[11px]">
              <Radio className="w-3 h-3 text-emerald-500 animate-pulse shrink-0" />
              <span>Live Phone Call (తెలుగు & English)</span>
            </div>
            <button
              type="button"
              onClick={() => {
                stopSpeaking();
                if (isListening) stopListening();
                setIsCallModalOpen(true);
              }}
              className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-[10px] flex items-center gap-1 cursor-pointer transition shadow-xs hover:scale-105 active:scale-95"
              title="Start Live Voice Phone Call"
            >
              <PhoneCall className="w-3 h-3" />
              <span>Call with AI</span>
            </button>
          </div>

          {/* Input Box & Mic */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder={
                  assistantLang === 'Telugu'
                    ? 'ఆరోగ్య సమాచారం లేదా ప్రశ్నను టైప్ చేయండి...'
                    : 'Type health query or doctor/hospital search...'
                }
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isLoading}
                className="flex-1 px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500"
              />

              {/* Working Microphone Button */}
              <button
                type="button"
                onClick={() => {
                  if (isListening) {
                    stopListening();
                  } else {
                    startListening((res) => {
                      if (res) handleSendMessage(res);
                    });
                  }
                }}
                className={`p-2.5 rounded-2xl transition cursor-pointer flex items-center justify-center ${
                  isListening
                    ? 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-600/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
                title={isListening ? 'Stop listening' : 'Speak your query'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-teal-600" />}
              </button>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className={`p-2.5 rounded-2xl transition flex items-center justify-center ${
                  inputText.trim() && !isLoading
                    ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-600/30 cursor-pointer active:scale-95'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
                title="Send query"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. LIVE AI VOICE CALL FULL-SCREEN / RESPONSIVE MODAL */}
      <LiveVoiceCallModal
        isOpen={isCallModalOpen}
        onClose={() => {
          setIsCallModalOpen(false);
          setIsOpen(true);
        }}
        onCallEnded={handleCallEnded}
        initialLanguage={assistantLang}
      />
    </>
  );
};

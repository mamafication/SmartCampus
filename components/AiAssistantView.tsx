'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  AlertTriangle,
  BookOpen,
  ExternalLink,
  RotateCcw,
  Info,
  CheckCircle,
  Copy,
  Check,
} from 'lucide-react';
import { ChatMessage, Language, UserRole } from '@/lib/types';
import { TRANSLATIONS } from '@/lib/translations';

export function AiAssistantView({
  language,
  role,
  initialPrompt,
}: {
  language: Language;
  role: UserRole;
  initialPrompt?: string;
}) {
  const t = TRANSLATIONS[language];
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content:
        language === 'hi'
          ? `नमस्ते! मैं **CampusGenie** हूँ, आपका एआई कैंपस साथी।\n\nआप मुझसे कॉलेज के नियम, कक्षा समय सारणी, परीक्षा उपस्थिति शर्तें, पुस्तकालय के समय, हैकाथॉन, अथवा डेटा स्ट्रक्चर्स और डेटाबेस से जुड़े अकादमिक संशय पूछ सकते हैं।`
          : `Hello! I am **CampusGenie**, your AI Campus Companion.\n\nI can answer campus logistics (timetables, 75% attendance policy, library hours, placement cutoffs) grounded in verified university handbooks, or explain academic concepts step-by-step. How can I help you today?`,
      createdAt: 'Just now',
    },
  ]);

  const [input, setInput] = useState(initialPrompt || '');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = React.useCallback(
    async (queryText?: string) => {
      const textToSend = queryText || input;
      if (!textToSend.trim() || isLoading) return;

      const userMsg: ChatMessage = {
        id: `usr-${Date.now()}`,
        role: 'user',
        content: textToSend.trim(),
        createdAt: 'Just now',
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setIsLoading(true);

      try {
        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: textToSend.trim(),
            language,
            role,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Server error occurred');
        }

        const assistantMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: data.answer,
          createdAt: 'Just now',
          citations: data.citations,
          uncertaintyFlag: data.uncertaintyFlag,
          isDemo: data.isDemo,
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err: unknown) {
        console.error('Error querying campus AI:', err);
        const errorMsg: ChatMessage = {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content:
            language === 'hi'
              ? 'क्षमा करें, आपके अनुरोध को संसाधित करते समय एक त्रुटि हुई। कृपया पुनः प्रयास करें।'
              : 'Sorry, I encountered an issue retrieving that campus information. Please try again.',
          createdAt: 'Just now',
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, language, role]
  );

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim().length > 0) {
      const timer = setTimeout(() => {
        handleSend(initialPrompt);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [initialPrompt, handleSend]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content:
          language === 'hi'
            ? 'वार्तालाप साफ़ कर दिया गया है। आप कोई नया प्रश्न पूछ सकते हैं!'
            : 'Conversation reset. Ask any question about campus rules, exams, courses, or events!',
        createdAt: 'Just now',
      },
    ]);
  };

  const suggestedPrompts = [
    t.ai.suggested1,
    t.ai.suggested2,
    t.ai.suggested3,
    t.ai.suggested4,
    t.ai.suggested5,
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-h-[850px] bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Top Header */}
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-slate-900">{t.ai.title}</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                Grounded Knowledge Base
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">{t.ai.subtitle}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClear}
          className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg transition-colors font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Chat</span>
        </button>
      </div>

      {/* Suggested prompts carousel */}
      <div className="px-6 py-2.5 bg-indigo-50/50 border-b border-indigo-100 flex items-center gap-2 overflow-x-auto text-xs whitespace-nowrap scrollbar-none">
        <span className="font-semibold text-indigo-900 shrink-0 flex items-center gap-1">
          <Info className="w-3.5 h-3.5" />
          {t.ai.suggestedQuestionsTitle}:
        </span>
        {suggestedPrompts.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(prompt)}
            className="px-3 py-1 bg-white hover:bg-indigo-600 hover:text-white text-indigo-700 font-medium rounded-full border border-indigo-200 transition-colors shrink-0 shadow-2xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3.5 ${
              msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-semibold ${
                msg.role === 'user'
                  ? 'bg-slate-800 text-white'
                  : 'bg-indigo-600 text-white'
              }`}
            >
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-none'
              }`}
            >
              {/* Message body with preserved line breaks and bolding */}
              <div className="whitespace-pre-wrap font-normal">
                {msg.content}
              </div>

              {/* Citations block if available */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{t.ai.sourcesFound}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {msg.citations.map((cite) => (
                      <a
                        key={cite.id}
                        href={cite.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white p-2.5 rounded-lg border border-slate-200 hover:border-indigo-300 transition-all text-xs group flex items-start justify-between gap-2"
                      >
                        <div>
                          <p className="font-semibold text-slate-900 group-hover:text-indigo-600 leading-tight">
                            {cite.title}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{cite.section}</p>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0 mt-0.5" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Uncertainty Alert */}
              {msg.uncertaintyFlag && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{t.ai.uncertaintyWarning}</span>
                </div>
              )}

              {/* Action row under assistant bubble */}
              {msg.role === 'assistant' && (
                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span>{msg.createdAt}</span>
                    {msg.isDemo && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-200 text-slate-600 font-medium">
                        Demo Mode
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 px-2 py-0.5 rounded transition-colors"
                    aria-label="Copy message"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600 font-medium text-[11px]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Copy</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white shrink-0 flex items-center justify-center animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-none p-4 text-sm text-slate-600 flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs text-slate-500">{t.ai.thinking}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer & Footer */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.ai.inputPlaceholder}
            className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all pr-24"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-xs"
          >
            <span>{t.ai.sendBtn}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        <p className="mt-2 text-[11px] text-center text-slate-400">
          {t.ai.aiDisclaimer}
        </p>
      </div>
    </div>
  );
}

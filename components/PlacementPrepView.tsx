'use client';

import React, { useState } from 'react';
import {
  Briefcase,
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Send,
  RotateCcw,
  BookOpen,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { PlacementSession, Language } from '@/lib/types';
import { TRANSLATIONS } from '@/lib/translations';

export function PlacementPrepView({ language }: { language: Language }) {
  const t = TRANSLATIONS[language];

  const [role, setRole] = useState('Software Engineer');
  const [topic, setTopic] = useState('Data Structures & Algorithms');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');

  const [currentQuestion, setCurrentQuestion] = useState(
    'Design an in-memory Least Recently Used (LRU) Cache with O(1) time complexity for get(key) and put(key, value) operations. How do you handle cache capacity limits, thread concurrency, and eviction order?'
  );
  const [sampleTips, setSampleTips] = useState<string[]>([
    'Combine a Doubly Linked List for access order with a Hash Map for O(1) key indexing.',
    'Explain how node detachment and head insertion work upon cache hits.',
    'Discuss race condition synchronizations or Read-Write locks in multi-threaded environments.',
  ]);

  const [answer, setAnswer] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<PlacementSession['feedback'] | null>(null);

  // Practice history log
  const [history, setHistory] = useState<PlacementSession[]>([
    {
      id: 'session-demo-01',
      targetRole: 'Software Engineer',
      topic: 'Data Structures & Algorithms',
      difficulty: 'Intermediate',
      question: 'Implement a function to detect if a cycle exists in a directed graph using DFS / Kahn algorithm.',
      userAnswer: 'I used a recursion stack visited array with DFS. If a node is currently in the recursion stack, a back edge exists signifying a cycle.',
      feedback: {
        score: 8.5,
        strengths: [
          'Correct intuition regarding back-edges and 3-color node state tracking.',
          'Understood difference between visited nodes and current traversal stack.',
        ],
        improvements: [
          'Could formulate space complexity explicitly O(V + E).',
          'Mentioned Kahn BFS topological sort approach as an alternative.',
        ],
        modelAnswer:
          'In directed graphs, maintain three states: Unvisited (0), Visiting (1), Visited (2). If an adjacent node is in state Visiting during DFS, a back-edge and hence a cycle is confirmed. Alternatively, compute in-degrees with Kahn algorithm (BFS); if count of processed nodes < V, a cycle exists.',
      },
      submittedAt: 'Yesterday',
    },
  ]);

  const handleGenerateQuestion = async () => {
    setIsGenerating(true);
    setFeedback(null);
    setAnswer('');

    try {
      const res = await fetch('/api/placement/practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_question',
          targetRole: role,
          topic,
          difficulty,
          language,
        }),
      });
      const data = await res.json();
      if (data.question) {
        setCurrentQuestion(data.question);
        setSampleTips(data.sampleTips || []);
      }
    } catch (err: unknown) {
      console.error('Error generating question:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/placement/practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'evaluate_answer',
          targetRole: role,
          topic,
          difficulty,
          question: currentQuestion,
          userAnswer: answer,
          language,
        }),
      });

      const data = await res.json();
      if (data.feedback) {
        setFeedback(data.feedback);

        const newSession: PlacementSession = {
          id: `sess-${Date.now()}`,
          targetRole: role,
          topic,
          difficulty,
          question: currentQuestion,
          sampleTips,
          userAnswer: answer,
          feedback: data.feedback,
          submittedAt: 'Just now',
        };
        setHistory((prev) => [newSession, ...prev]);
      }
    } catch (err: unknown) {
      console.error('Error evaluating answer:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 8.0) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (score >= 6.5) return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-rose-100 text-rose-800 border-rose-300';
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">{t.placements.title}</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
              Interactive Mock Chamber
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{t.placements.subtitle}</p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
          <TrendingUp className="w-4 h-4 text-indigo-600" />
          <span>Sessions Completed: {history.length}</span>
        </div>
      </div>

      {/* Configuration Selectors */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            {t.placements.selectRole}
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
          >
            <option value="Software Engineer">Software Engineer (SDE I)</option>
            <option value="Data Analyst">Data Analyst / BI Specialist</option>
            <option value="Product Manager">Associate Product Manager</option>
            <option value="System Design">Distributed Systems Engineer</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            {t.placements.selectTopic}
          </label>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
          >
            <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
            <option value="SQL & Databases">SQL & Relational Schema Design</option>
            <option value="System Design & Architecture">System Design & High Throughput</option>
            <option value="Behavioral STAR Method">Behavioral Leadership (STAR Method)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            {t.placements.selectDifficulty}
          </label>
          <div className="flex items-center gap-2">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
            >
              <option value="Beginner">Beginner (Campus Intern)</option>
              <option value="Intermediate">Intermediate (Tier 1 Entry)</option>
              <option value="Advanced">Advanced (Faang Level)</option>
            </select>
            <button
              type="button"
              onClick={handleGenerateQuestion}
              disabled={isGenerating}
              className="px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shrink-0 transition-colors shadow-xs"
            >
              {isGenerating ? 'Generating...' : 'New Question'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Practice Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Question & Candidate Answer */}
        <div className="lg:col-span-7 space-y-5">
          {/* Question Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-indigo-700 uppercase tracking-wider">
                {role} • {difficulty}
              </span>
              <span className="text-slate-400 font-medium">{topic}</span>
            </div>

            <h3 className="text-base font-semibold text-slate-900 leading-snug">
              {currentQuestion}
            </h3>

            {/* Hint Tips Carousel */}
            {sampleTips && sampleTips.length > 0 && (
              <div className="bg-indigo-50/60 rounded-xl p-3 border border-indigo-100 text-xs">
                <span className="font-semibold text-indigo-900 flex items-center gap-1.5 mb-1.5">
                  <Lightbulb className="w-4 h-4 text-indigo-600" />
                  Key Considerations to Address in Your Answer:
                </span>
                <ul className="space-y-1 text-slate-700 list-disc list-inside">
                  {sampleTips.map((tip, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Answer Form */}
          <form
            onSubmit={handleSubmitAnswer}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-800">
                Your Answer / Technical Rationale:
              </label>
              <span className="text-slate-400">
                {answer.trim().split(/\s+/).filter(Boolean).length} words
              </span>
            </div>

            <textarea
              rows={7}
              required
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={t.placements.answerPlaceholder}
              className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 rounded-xl p-4 text-xs font-mono text-slate-900 placeholder-slate-400 outline-none transition-all leading-relaxed"
            />

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setAnswer('')}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium"
              >
                Clear text
              </button>
              <button
                type="submit"
                disabled={!answer.trim() || isSubmitting}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{t.placements.submitting}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>{t.placements.submitAnswer}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right: AI Evaluation Feedback & Score */}
        <div className="lg:col-span-5 space-y-5">
          {feedback ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 animate-in fade-in slide-in-from-right-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {t.placements.feedbackTitle}
                  </h3>
                  <p className="text-xs text-slate-500">Evaluated against university recruiting rubrics</p>
                </div>
                <div
                  className={`px-3 py-1 rounded-xl font-bold text-sm border flex items-center gap-1.5 ${getScoreBadgeColor(
                    feedback.score
                  )}`}
                >
                  <Award className="w-4 h-4" />
                  <span>{feedback.score} / 10</span>
                </div>
              </div>

              {/* Strengths */}
              <div>
                <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1 mb-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {t.placements.strengths}:
                </span>
                <ul className="space-y-1 text-xs text-slate-700 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
                  {feedback.strengths.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div>
                <span className="text-xs font-semibold text-amber-800 flex items-center gap-1 mb-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  {t.placements.improvements}:
                </span>
                <ul className="space-y-1 text-xs text-slate-700 bg-amber-50/50 p-2.5 rounded-lg border border-amber-100">
                  {feedback.improvements.map((imp, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Model Answer */}
              <div>
                <span className="text-xs font-semibold text-indigo-900 flex items-center gap-1 mb-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  {t.placements.modelAnswer}:
                </span>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs font-mono text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {feedback.modelAnswer}
                </div>
              </div>

              <p className="text-[11px] text-slate-400 italic pt-1">
                {t.placements.disclaimer}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 space-y-2">
              <Award className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-semibold text-slate-700">Ready for Interview Rehearsal</p>
              <p className="text-xs text-slate-500">
                Write your technical reasoning in the editor and click &quot;Submit Response&quot; to receive detailed AI scoring, missing edge cases, and a model answer.
              </p>
            </div>
          )}

          {/* History Drawer */}
          {history.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {t.placements.historyTitle} ({history.length})
              </h4>
              <div className="space-y-2.5 max-h-60 overflow-y-auto">
                {history.map((sess) => (
                  <div
                    key={sess.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between gap-3 hover:border-indigo-300 transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-slate-800 line-clamp-1">
                        {sess.question}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {sess.targetRole} • {sess.submittedAt}
                      </span>
                    </div>
                    {sess.feedback && (
                      <span
                        className={`px-2 py-0.5 rounded-md font-bold text-xs shrink-0 ${getScoreBadgeColor(
                          sess.feedback.score
                        )}`}
                      >
                        {sess.feedback.score}/10
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

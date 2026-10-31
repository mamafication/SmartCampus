import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, targetRole, topic, difficulty, question, userAnswer, language = 'en' } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    // Action 1: Generate an interview question
    if (action === 'generate_question') {
      if (apiKey) {
        try {
          const ai = new GoogleGenAI({
            apiKey,
            httpOptions: {
              headers: { 'User-Agent': 'aistudio-build' },
            },
          });

          const prompt = `Generate a realistic campus placement interview question for the following criteria:
Target Role: ${targetRole || 'Software Engineer'}
Technical/Behavioral Topic: ${topic || 'Data Structures & Algorithms'}
Difficulty Level: ${difficulty || 'Intermediate'}
Language: ${language === 'hi' ? 'Hindi or bilingual Hinglish' : 'English'}

Return a JSON object with:
- "question": A detailed interview scenario or technical challenge prompt (2-4 sentences).
- "sampleTips": Array of 3 short hints or architectural considerations the candidate should address.`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  sampleTips: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['question', 'sampleTips'],
              },
            },
          });

          const parsed = JSON.parse(response.text || '{}');
          if (parsed.question && parsed.sampleTips) {
            return NextResponse.json({
              question: parsed.question,
              sampleTips: parsed.sampleTips,
              isDemo: false,
            });
          }
        } catch (err: unknown) {
          console.warn('Gemini question generation error, falling back:', err);
        }
      }

      // Pre-engineered fallback questions for campus placement interview simulation
      const fallbackQuestions: Record<string, { question: string; sampleTips: string[] }> = {
        'Software Engineer': {
          question:
            'Design an in-memory Least Recently Used (LRU) Cache with O(1) time complexity for get(key) and put(key, value) operations. How do you handle cache capacity limits, thread concurrency, and eviction order?',
          sampleTips: [
            'Combine a Doubly Linked List for order tracking with a Hash Map for O(1) lookups.',
            'Explain how node detachment and head insertion work upon cache hits.',
            'Discuss race condition synchronizations or Read-Write locks in multi-threaded environments.',
          ],
        },
        'Data Analyst': {
          question:
            'Given a university table of student course registrations and grades, write an analytical SQL query using window functions (e.g. DENSE_RANK or ROW_NUMBER) to find the top 3 scoring students per department in Semester 5.',
          sampleTips: [
            'Specify the PARTITION BY department and ORDER BY marks DESC clause.',
            'Distinguish between RANK(), DENSE_RANK(), and ROW_NUMBER() when dealing with ties.',
            'Filter rank <= 3 using a Common Table Expression (CTE) or subquery.',
          ],
        },
        'Product Manager': {
          question:
            'Campus dining halls experience severe queues between 12:30 PM and 1:15 PM. Propose a product feature or smart ordering initiative to minimize student wait times while preventing kitchen overload.',
          sampleTips: [
            'Identify root causes (payment bottlenecks, peak arrival clusters, unbatched prep).',
            'Propose time-slotted pickup windows with live kitchen capacity meters.',
            'Define success metrics: median queue duration, student satisfaction rating, kitchen waste.',
          ],
        },
        'System Design': {
          question:
            'Architect a campus notification broadcast service capable of alerting 25,000 students and faculty within 30 seconds during emergency weather or safety alerts. Address push channels, SMS, and database bottlenecks.',
          sampleTips: [
            'Introduce a distributed message queue (Kafka / RabbitMQ) for worker fanout.',
            'Use rate-limited third-party SMS/Push gateway connection pools.',
            'Implement idempotent delivery and heartbeat monitoring.',
          ],
        },
      };

      const selected = fallbackQuestions[targetRole] || fallbackQuestions['Software Engineer'];
      return NextResponse.json({
        question: selected.question,
        sampleTips: selected.sampleTips,
        isDemo: true,
      });
    }

    // Action 2: Evaluate candidate answer
    if (action === 'evaluate_answer') {
      if (!userAnswer || userAnswer.trim().length < 5) {
        return NextResponse.json(
          { error: 'Please provide a substantive answer before requesting feedback.' },
          { status: 400 }
        );
      }

      if (apiKey) {
        try {
          const ai = new GoogleGenAI({
            apiKey,
            httpOptions: {
              headers: { 'User-Agent': 'aistudio-build' },
            },
          });

          const evaluationPrompt = `You are an expert technical interviewer and placement mentor at a premier engineering university.
Target Role: ${targetRole}
Topic: ${topic}
Difficulty: ${difficulty}

Question:
${question}

Candidate's Submitted Response:
${userAnswer}

Provide a constructive, rigorous, and helpful evaluation in JSON with:
- "strengths": Array of 2-3 specific good points or correct intuitions in their answer.
- "improvements": Array of 2-3 gaps, edge cases missed, suboptimal complexities, or missing trade-offs.
- "modelAnswer": A concise, exemplary standard answer (3-5 sentences or code block).
- "score": A numerical score between 1.0 and 10.0 (one decimal place) reflecting readiness.`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: evaluationPrompt,
            config: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  strengths: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  improvements: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  modelAnswer: { type: Type.STRING },
                  score: { type: Type.NUMBER },
                },
                required: ['strengths', 'improvements', 'modelAnswer', 'score'],
              },
            },
          });

          const parsed = JSON.parse(response.text || '{}');
          return NextResponse.json({
            feedback: parsed,
            isDemo: false,
          });
        } catch (err: unknown) {
          console.warn('Gemini evaluation error, using fallback:', err);
        }
      }

      // High quality structured heuristic feedback fallback
      const wordCount = userAnswer.trim().split(/\s+/).length;
      let score = 7.5;
      const strengths = [
        'Good fundamental understanding of the core concept and clear terminology.',
        'Communicated the high-level operational sequence logically.',
      ];
      const improvements = [
        'Could be improved by explicitly stating the Time & Space complexities (e.g. O(1) or O(log N)).',
        'Consider elaborating on edge cases such as empty input, maximum threshold boundary, or concurrency locks.',
      ];

      if (wordCount > 60) {
        score = 8.5;
        strengths.push('Thorough explanation with specific structural components addressed.');
      } else {
        score = 6.8;
        improvements.push('Answer is somewhat brief; flesh out trade-offs and alternative approaches in live rounds.');
      }

      const modelAnswer = `A high-scoring answer combines Doubly Linked List nodes with a Hash Map where keys map to list nodes. The Hash Map guarantees O(1) access to existing entries, while the Doubly Linked List allows O(1) node removal and re-insertion at the head for the Most Recently Used element. When capacity is exceeded, the node at the tail (Least Recently Used) is evicted in O(1) and purged from the map. For thread safety, synchronize access via Read-Write locks or Java's ConcurrentHashMap with atomic node modifications.`;

      return NextResponse.json({
        feedback: {
          strengths,
          improvements,
          modelAnswer,
          score,
        },
        isDemo: true,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: unknown) {
    console.error('Placement endpoint error:', error);
    return NextResponse.json({ error: 'Failed to process placement request' }, { status: 500 });
  }
}

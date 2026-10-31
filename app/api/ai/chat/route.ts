import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { CAMPUS_KNOWLEDGE_BASE, GroundedDoc } from '@/lib/mockData';
import { SourceCitation } from '@/lib/types';

// Helper to retrieve approved campus documents matching the user query
function retrieveRelevantSources(query: string): { sources: GroundedDoc[]; citations: SourceCitation[] } {
  const normalized = query.toLowerCase();
  const queryTokens = normalized.split(/\W+/).filter((t) => t.length > 2);

  const scored = CAMPUS_KNOWLEDGE_BASE.map((doc) => {
    let score = 0;
    // Check keywords
    for (const kw of doc.keywords) {
      if (normalized.includes(kw.toLowerCase())) {
        score += 3;
      }
    }
    // Check tokens in title and content
    for (const token of queryTokens) {
      if (doc.title.toLowerCase().includes(token)) score += 2;
      if (doc.content.toLowerCase().includes(token)) score += 1;
    }
    return { doc, score };
  });

  // Filter docs with score > 0 and sort by highest score
  const matches = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score);

  const topDocs = matches.slice(0, 3).map((m) => m.doc);
  const citations: SourceCitation[] = topDocs.map((d) => ({
    id: d.id,
    title: d.title,
    category: d.category,
    section: d.section,
    url: d.url,
    updatedAt: 'Fall 2026',
    confidence: 0.95,
  }));

  return { sources: topDocs, citations };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, language = 'en', role = 'student' } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const { sources, citations } = retrieveRelevantSources(message);
    const hasApprovedSources = sources.length > 0;

    // Check if GEMINI_API_KEY is available
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const contextExcerpts = sources
          .map(
            (s, idx) =>
              `[Source ${idx + 1}: ${s.title} (${s.section})]\n${s.content}\nURL: ${s.url}`
          )
          .join('\n\n');

        const systemInstruction = `You are CampusGenie, an intelligent, empathetic, and highly accurate AI campus companion for university students, faculty, and administrators.
Current local time is Fall 2026. The interacting user is a "${role}".
Language setting is "${language === 'hi' ? 'Hindi (हिंदी)' : 'English'}".

CRITICAL GROUNDING RULES:
1. If the user is asking about campus rules, locations, policies, timings, events, hostels, or procedures:
   - Base your answer ONLY on the retrieved approved campus documents provided below.
   - Explicitly cite the sources (e.g. "[Campus Academic Regulations 2026-2027]").
   - If the specific campus fact is NOT present in the provided documents, state clearly: "I could not find an approved campus policy for this specific question in the university handbook. Please check with the respective department office or official notice board."
2. If the user is asking an academic or technical question (e.g., explaining database normalization, algorithms, physics, programming):
   - Provide a clear, step-by-step educational explanation with practical examples and code snippets where helpful.
   - Ensure explanations are conceptually rigorous and pedagogical.
3. If language is Hindi (or user asked in Hindi), respond naturally in high-quality Hindi or Hinglish as appropriate for university students.
4. Keep the tone professional, encouraging, and well-structured with clear headings, bullet points, or numbered steps.

Approved Campus Knowledge Base Excerpts:
${hasApprovedSources ? contextExcerpts : 'No specific approved campus documents matched this query.'}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: message,
          config: {
            systemInstruction,
            temperature: 0.3,
          },
        });

        const answerText = response.text || 'I could not generate an answer at this moment.';
        const uncertaintyFlag = !hasApprovedSources && /attendance|library|hostel|tpo|placement|exam|hall|fee|curfew/i.test(message);

        return NextResponse.json({
          answer: answerText,
          citations,
          uncertaintyFlag,
          isDemo: false,
        });
      } catch (err: unknown) {
        console.warn('Gemini API call failed, using grounded fallback:', err);
      }
    }

    // High-fidelity grounded fallback (Demo Mode) when API key is missing or offline
    const isHindi = language === 'hi';
    let fallbackAnswer = '';
    let uncertainty = false;

    if (sources.length > 0) {
      const top = sources[0];
      if (top.id === 'kb-acad-01') {
        fallbackAnswer = isHindi
          ? `**कैंपस अकादमिक नियमावली (अनुभाग 4.2):**\n\n• सेमेस्टर परीक्षा में उपस्थित होने के लिए प्रत्येक कोर्स में न्यूनतम **75% उपस्थिति** अनिवार्य है।\n• चिकित्सा अवकाश (Medical Leave) या विश्वविद्यालय का प्रतिनिधित्व करने की स्थिति में अधिकतम **10% की छूट (यानी न्यूनतम 65% कुल उपस्थिति)** दी जा सकती है, बशर्ते छात्र विश्वविद्यालय स्वास्थ्य केंद्र का सत्यापित प्रमाणपत्र 5 कार्य दिवसों में जमा करे।\n• 65% से कम उपस्थिति वाले छात्रों को ग्रेड पेनल्टी या ग्रीष्मकालीन सत्र में पुनः पंजीकरण करना होगा।`
          : `**Campus Academic Regulations (Section 4.2):**\n\n• Students must maintain a minimum of **75% attendance** in each registered course to be eligible for the End-Semester Examination.\n• In cases of certified medical illness or authorized university representation, a waiver of up to 10% (requiring a minimum of **65% aggregate attendance**) may be granted by the Dean of Academic Affairs upon submitting verified health center documentation within 5 working days.\n• Attendance falling below 65% results in a mandatory grade deduction or course re-registration.`;
      } else if (top.id === 'kb-lib-01') {
        fallbackAnswer = isHindi
          ? `**केंद्रीय पुस्तकालय (टैगोर नॉलेज पवेलियन):**\n\n• **नियमित समय:** सोमवार से शुक्रवार: सुबह 08:00 से रात 11:00 बजे तक। सप्ताहांत (शनिवार व रविवार): सुबह 09:00 से शाम 06:00 बजे तक।\n• **परीक्षा अवधि में:** परीक्षा के 14 दिन पहले से पठन कक्ष रात 02:00 बजे तक खुले रहते हैं।\n• **किताब जारी करने का नियम:** स्नातक (UG) छात्र एक समय में 4 किताबें 14 दिनों की अवधि के लिए ले सकते हैं (अधिकतम 2 ऑनलाइन नवीनीकरण)।`
          : `**Central Library (Tagore Knowledge Pavilion):**\n\n• **Standard Operational Hours:** Monday to Friday: 08:00 AM – 11:00 PM | Weekends: 09:00 AM – 06:00 PM.\n• **Exam Fortnight Extended Hours:** Reading halls on Floors 1 & 2 remain accessible until **02:00 AM** during examination prep periods.\n• **Borrowing Privileges:** Undergraduate students can check out up to 4 books concurrently for 14 days, with up to 2 online renewals. Overdue fee is $0.50/day.`;
      } else if (top.id === 'kb-place-01') {
        fallbackAnswer = isHindi
          ? `**कैंपस प्लेसमेंट एवं इंटर्नशिप नियमावली (TPO):**\n\n• **स्थान:** कॉर्पोरेट रिलेशंस एवं प्रशासनिक ब्लॉक, तीसरी मंजिल, कक्ष C-302।\n• **पात्रता मानदंड:** बिना किसी सक्रिय बैकलॉग के न्यूनतम **6.0 CGPA** अनिवार्य है।\n• **टियर-1 कंपनियां:** शीर्ष सॉफ्टवेयर एवं कंसल्टिंग कंपनियां प्रायः न्यूनतम **7.0 या 7.5 CGPA** की मांग करती हैं।\n• सभी पंजीकृत छात्रों का TPO पोर्टल पर बायोडाटा (Resume) सत्यापन तथा औपचारिक पोशाक अनिवार्य है।`
          : `**Campus Placement & Training Cell (TPO):**\n\n• **Location:** Corporate Relations Block, 3rd Floor, Room C-302.\n• **General Eligibility:** Minimum cumulative GPA of **6.0 CGPA** with zero active backlogs.\n• **Tier-1 Eligibility:** Premier software engineering and product companies enforce a cutoff of **7.0 or 7.5 CGPA**.\n• Resume verification must be completed on the TPO portal prior to screening rounds. Formal business attire is required for all interview panels.`;
      } else if (top.id === 'kb-hack-01') {
        fallbackAnswer = isHindi
          ? `**हैककैंपस 2026 दिशा-निर्देश:**\n\n• **दिनांक:** 14 से 16 नवंबर 2026 (48 घंटे)।\n• **स्थान:** ट्यूरिंग सेंटर ऑडिटोरियम।\n• **टीम आकार:** 2 से 4 विद्यार्थी।\n• **पुरस्कार राशि:** $5,000 कुल पुरस्कार एवं प्रायोजकों द्वारा सीधे साक्षात्कार के अवसर।\n• **पंजीकरण अंतिम तिथि:** 5 नवंबर 2026, 23:59 IST।`
          : `**HackCampus 2026 Official Guidelines:**\n\n• **Event Dates:** November 14 - 16, 2026 (48-hour continuous hackathon).\n• **Venue:** Turing Center Auditorium & Open Innovation Atrium.\n• **Team Size:** Teams of 2 to 4 eligible university students.\n• **Prize Purse:** $5,000 total prizes plus fast-track interview tracks with tech partners.\n• **Registration Deadline:** November 5, 2026 at 23:59 IST.`;
      } else {
        fallbackAnswer = isHindi
          ? `**सत्यापित कैंपस दस्तावेज (${top.title}):**\n\n${top.content}`
          : `**Verified Campus Document (${top.title}):**\n\n${top.content}`;
      }
    } else if (/normaliz|1nf|2nf|3nf|bcnf|database/i.test(message)) {
      fallbackAnswer = isHindi
        ? `**डेटाबेस सामान्यीकरण (Database Normalization) - चरण-दर-चरण व्याख्या:**\n\n1. **1NF (प्रथम सामान्य रूप):**\n   - प्रत्येक स्तंभ (Column) में केवल एकल (Atomic) मान होने चाहिए, कोई बहुमूल्य या दोहराए जाने वाले समूह नहीं।\n\n2. **2NF (द्वितीय सामान्य रूप):**\n   - संबंध 1NF में होना चाहिए और कोई आंशिक निर्भरता (Partial Dependency) नहीं होनी चाहिए। सभी गैर-कुंजी विशेषताएँ पूर्ण प्राथमिक कुंजी पर निर्भर होनी चाहिए।\n\n3. **3NF (तृतीय सामान्य रूप):**\n   - संबंध 2NF में होना चाहिए और कोई सकर्मक निर्भरता (Transitive Dependency) नहीं होनी चाहिए (X → Y और Y → Z जहां Z गैर-कुंजी है)।\n\n*उदाहरण:* छात्र-पाठ्यक्रम नामांकन तालिका को अलग-अलग \`छात्र(StudentID, Name)\`, \`पाठ्यक्रम(CourseID, Title)\`, और \`नामांकन(StudentID, CourseID, Grade)\` में विभाजित करना।`
        : `**Database Normalization (1NF, 2NF, 3NF) — Step-by-Step Explanation:**\n\n1. **First Normal Form (1NF):**\n   - All column values must be atomic (indivisible single values).\n   - Eliminates repeating groups and comma-separated array cells.\n\n2. **Second Normal Form (2NF):**\n   - Must already be in 1NF.\n   - No partial functional dependency: every non-prime attribute must depend on the *entire* candidate key, not a proper subset of a composite key.\n\n3. **Third Normal Form (3NF):**\n   - Must already be in 2NF.\n   - No transitive dependencies: non-key attributes must not determine other non-key attributes ($X \\to Y$ where $Y$ is non-prime implies $X$ is a superkey).\n\n*Applied Example:* Instead of storing \`StudentEnrollment(StudentID, StudentName, CourseID, CourseName, InstructorOffice)\`, split into:\n- \`Student(StudentID, StudentName)\`\n- \`Course(CourseID, CourseName, InstructorID)\`\n- \`Instructor(InstructorID, InstructorOffice)\`\n- \`Enrollment(StudentID, CourseID, Semester, Grade)\``;
    } else {
      uncertainty = true;
      fallbackAnswer = isHindi
        ? `मुझे इस विशिष्ट प्रश्न के लिए कैंपस नियमावली में कोई आधिकारिक दस्तावेज नहीं मिला। कृपया कैंपस निर्देशिका से संबंधित प्रशासनिक अथवा शैक्षणिक विभाग से संपर्क करें, अथवा नीचे दिए गए सामान्य प्रश्नों में से चयन करें।`
        : `I could not find a verified document in the approved campus handbook matching your inquiry. To ensure accurate academic or administrative guidance, please consult the respective faculty adviser or departmental registrar in Room 105.`;
    }

    return NextResponse.json({
      answer: fallbackAnswer,
      citations,
      uncertaintyFlag: uncertainty,
      isDemo: true,
    });
  } catch (error: unknown) {
    console.error('AI chat endpoint error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your campus query.' },
      { status: 500 }
    );
  }
}

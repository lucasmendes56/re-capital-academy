import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { getLessonById } from "@/lib/curriculum";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface Question {
  type: "multiple_choice" | "calculation" | "short_answer";
  question: string;
  correctAnswer?: string;
  options?: string[];
}

export async function POST(req: NextRequest) {
  try {
    const { lessonId, questions, answers, isCapstone, scenario } = await req.json();
    const lesson = getLessonById(lessonId);

    if (isCapstone) {
      // Grade capstone
      const prompt = `You are a senior real estate finance instructor grading a capstone case study.

SCENARIO PROVIDED TO STUDENT:
${scenario}

STUDENT'S ANSWERS TO ${questions.length} QUESTIONS:
${questions
  .map(
    (q: Question, i: number) => `
Q${i + 1}: ${q.question}
Student Answer: ${answers[i] || "(no answer provided)"}
`
  )
  .join("\n")}

Grade each question on conceptual accuracy, mathematical correctness, and quality of reasoning. Each question is worth ${Math.round(100 / questions.length)} points (adjust last question to make total exactly 100).

For calculation questions: allow minor rounding differences (within 2%) as correct. Award partial credit for correct methodology with minor errors.

Provide:
1. A total score out of 100
2. Detailed feedback for each question
3. An overall assessment paragraph

Respond with valid JSON only:
{
  "totalScore": 75,
  "results": [
    { "question": "...", "userAnswer": "...", "score": 12, "maxScore": 14, "feedback": "..." }
  ],
  "overallFeedback": "Overall assessment..."
}`;

      const response = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 3000,
        messages: [{ role: "user", content: prompt }],
      });

      const text = response.content[0].type === "text" ? response.content[0].text : "{}";
      const data = JSON.parse(text);
      return NextResponse.json(data);
    }

    // Grade regular quiz
    const lessonContext = lesson ? `Lesson ${lesson.number}: ${lesson.title}` : "Real estate finance";

    // Auto-grade multiple choice
    const results = [];

    const mcQuestions = questions.filter((q: Question) => q.type === "calculation" || q.type === "short_answer");
    const needsAiGrading = mcQuestions.length > 0;

    // For multiple choice, grade immediately
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (q.type === "multiple_choice") {
        const correct = q.correctAnswer && answers[i]?.trim().charAt(0) === q.correctAnswer?.trim().charAt(0);
        results.push({
          question: q.question,
          userAnswer: answers[i] || "(no answer)",
          correctAnswer: q.correctAnswer,
          score: correct ? 20 : 0,
          maxScore: 20,
          feedback: correct
            ? "Correct."
            : `Incorrect. The correct answer is: ${q.correctAnswer}`,
        });
      }
    }

    if (needsAiGrading) {
      // Build AI grading prompt for calc and short answer questions
      const aiQuestions = questions
        .map((q: Question, i: number) => ({ ...q, index: i, answer: answers[i] }))
        .filter((q: Question & { index: number }) => q.type !== "multiple_choice");

      const prompt = `You are grading a real estate finance quiz for: ${lessonContext}.

Grade the following student answers. Each calculation question is worth 20 points. The short answer question is worth 20 points.

Award partial credit on calculation questions: correct methodology with minor math error = 12-15/20; correct formula, wrong numbers = 8-12/20; wrong approach = 0-6/20.

For short answers: grade on conceptual accuracy, use of specific reasoning, and professional quality of the answer.

${aiQuestions
  .map(
    (q: Question & { index: number; answer: string }, i: number) => `
QUESTION ${i + 1} (${q.type.replace("_", " ")}, 20 points):
${q.question}
${q.correctAnswer ? `Expected Answer: ${q.correctAnswer}` : ""}
Student Answer: ${q.answer || "(no answer provided)"}
`
  )
  .join("\n")}

Respond with valid JSON only:
{
  "gradedQuestions": [
    { "score": 18, "maxScore": 20, "feedback": "...", "correctAnswer": "..." }
  ]
}`;

      const response = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      });

      const text = response.content[0].type === "text" ? response.content[0].text : "{}";
      const aiData = JSON.parse(text);

      // Merge AI results back into results array
      let aiIdx = 0;
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (q.type !== "multiple_choice") {
          const aiResult = aiData.gradedQuestions[aiIdx];
          results.push({
            question: q.question,
            userAnswer: answers[i] || "(no answer)",
            correctAnswer: aiResult?.correctAnswer || q.correctAnswer,
            score: aiResult?.score ?? 0,
            maxScore: 20,
            feedback: aiResult?.feedback || "No feedback available.",
          });
          aiIdx++;
        }
      }
    }

    // Sort results to match original question order
    const orderedResults: typeof results = [];
    let mcIdx = 0;
    let aiIdx2 = 0;
    const mcResults = results.filter((r) => r.maxScore === 20 && (r.score === 0 || r.score === 20) && (r.feedback === "Correct." || r.feedback?.startsWith("Incorrect.")));
    const aiResults = results.filter((r) => !mcResults.includes(r));

    for (let i = 0; i < questions.length; i++) {
      if (questions[i].type === "multiple_choice") {
        orderedResults.push(mcResults[mcIdx++]);
      } else {
        orderedResults.push(aiResults[aiIdx2++]);
      }
    }

    const totalScore = orderedResults.reduce((sum, r) => sum + (r?.score || 0), 0);

    return NextResponse.json({ results: orderedResults, totalScore });
  } catch (error) {
    console.error("Grade quiz error:", error);
    return NextResponse.json({ error: "Failed to grade quiz" }, { status: 500 });
  }
}

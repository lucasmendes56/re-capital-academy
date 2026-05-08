import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { getLessonById } from "@/lib/curriculum";
import { LESSON_CONTENT } from "@/lib/lessonContent";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { lessonId } = await req.json();
    const lesson = getLessonById(lessonId);
    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    const content = LESSON_CONTENT[lessonId] || "";
    const prompt = `You are a real estate finance instructor creating a quiz for: Lesson ${lesson.number} — ${lesson.title}.

Key topics: ${lesson.topics.join(", ")}.

Lesson content summary:
${content.slice(0, 3000)}

Generate exactly 5 quiz questions with this distribution:
- Question 1: Multiple choice, EASY difficulty
- Question 2: Multiple choice, MEDIUM difficulty
- Question 3: Calculation problem, MEDIUM difficulty
- Question 4: Calculation problem, HARD difficulty
- Question 5: Short answer / explain your thinking, HARD difficulty

Requirements:
- Multiple choice questions must have exactly 4 options (A, B, C, D)
- Calculation problems must involve specific numbers from the lesson or realistic made-up deal numbers
- Short answer must require conceptual understanding, not just memorization
- All questions must be directly based on this lesson's content and topics
- No emojis anywhere

Respond with valid JSON only, no markdown, no explanation:
{
  "questions": [
    {
      "type": "multiple_choice",
      "difficulty": "easy",
      "question": "...",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "correctAnswer": "A) ..."
    },
    {
      "type": "multiple_choice",
      "difficulty": "medium",
      "question": "...",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "correctAnswer": "B) ..."
    },
    {
      "type": "calculation",
      "difficulty": "medium",
      "question": "...",
      "correctAnswer": "..."
    },
    {
      "type": "calculation",
      "difficulty": "hard",
      "question": "...",
      "correctAnswer": "..."
    },
    {
      "type": "short_answer",
      "difficulty": "hard",
      "question": "..."
    }
  ]
}`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "{}";
    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Generate quiz error:", error);
    return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 });
  }
}

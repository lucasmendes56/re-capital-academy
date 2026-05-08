import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { messages, pageContext } = await req.json();

    const systemPrompt = `You are a senior real estate finance instructor and advisor embedded in RE Capital Academy, a professional real estate finance course. The student is currently on ${pageContext}.

Your role:
1. Answer questions about the current lesson topic with precision and real-world examples
2. Answer general real estate finance questions the student raises
3. When explaining concepts, always use specific numbers. Never say "some amount" — use realistic deal numbers.
4. Reference specific asset classes with appropriate examples: use multifamily for yield/cash flow questions, industrial for NNN lease questions, office for lease structure complexity, hospitality for operational metrics, retail for credit tenant vs mom-and-pop distinctions.
5. Be concise but complete. No filler. Every sentence should teach something.
6. If the student gets something wrong in conversation, correct them directly but constructively.
7. When relevant, reference other lessons in the course.
8. Tone: professional, direct, expert. Like a senior analyst teaching an associate.
9. Never use emojis.
10. When relevant, suggest: "Ready to test yourself? Take the quiz for this lesson."

Chat history persists within a session.`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const content = response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ content });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Failed to get response" }, { status: 500 });
  }
}

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({ notes: z.string().min(1) });

const StudySetSchema = z.object({
  flashcards: z.array(
    z.object({ id: z.number(), question: z.string(), answer: z.string() }),
  ),
  quiz: z.array(
    z.object({
      id: z.number(),
      difficulty: z.enum(["easy", "medium", "hard"]),
      question: z.string(),
      options: z.array(z.string()),
      correctAnswer: z.string(),
    }),
  ),
  warnings: z.array(z.string()).default([]),
});

export const generateStudySet = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env["GROQ_API_KEY"];
    if (!apiKey) throw new Error("GROQ_API_KEY is not configured");

    const prompt = `You are an expert study-content generator. You will receive study notes from a student. Your job is to produce flashcards and a quiz STRICTLY in the JSON format specified below. Do not include any text outside the JSON.

RULES:
1. Generate exactly 10 flashcards. Each flashcard has a concise question and a concise answer (1-2 sentences max), based only on the provided notes.
2. Generate exactly 5 multiple-choice quiz questions based only on the provided notes. Distribution: 2 easy, 2 medium, 1 hard.
3. Each quiz question has exactly 4 options, one correct answer, and a difficulty field (easy, medium, or hard).
4. Only use facts present in the notes. Do not add outside information.
5. Output must be valid JSON matching this schema exactly. No markdown formatting, no code fences, no commentary before or after the JSON.

SCHEMA:
{
  "flashcards": [{"id": 1, "question": "...", "answer": "..."}],
  "quiz": [{"id": 1, "difficulty": "easy", "question": "...", "options": ["...","...","...","..."], "correctAnswer": "..."}],
  "warnings": []
}

STUDY NOTES:
"""
${data.notes}
"""

Return ONLY the JSON object described in the schema.`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("Groq error", res.status, detail);
      if (res.status === 429) throw new Error("Rate limited by the AI provider. Please try again shortly.");
      if (res.status === 401) throw new Error("Invalid Groq API key.");
      throw new Error("The AI service could not generate your study set. Please try again.");
    }

    const payload = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const raw = payload.choices?.[0]?.message?.content ?? "";
    const cleaned = raw.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();

    let parsed: unknown;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      const start = cleaned.indexOf("{");
      const end = cleaned.lastIndexOf("}");
      if (start === -1 || end === -1) throw new Error("The AI returned an unreadable response. Please try again.");
      parsed = JSON.parse(cleaned.slice(start, end + 1));
    }

    const result = StudySetSchema.safeParse(parsed);
    if (!result.success) throw new Error("The AI response did not match the expected format. Please try again.");
    return result.data;
  });

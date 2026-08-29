import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { generateStudySet } from "@/lib/generate.functions";
import { saveStudySet } from "@/lib/study-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FlashGenius — Turn Notes Into Flashcards" },
      { name: "description", content: "Paste your notes and instantly study with AI-generated flashcards and quizzes. Minimal, dark, mobile-first." },
      { property: "og:title", content: "FlashGenius — Turn Notes Into Flashcards" },
      { property: "og:description", content: "Paste your notes and instantly study with AI-generated flashcards and quizzes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const generate = useServerFn(generateStudySet);

  const onGenerate = async () => {
    if (!notes.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const set = await generate({ data: { notes: notes.trim() } });
      saveStudySet(set);
      navigate({ to: "/flashcards" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-5 py-10">
      <header className="mb-8">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">Study smarter</span>
        <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight">
          Flash<span className="text-accent">Genius</span>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Paste your notes below. AI turns them into 10 flashcards and a 5-question quiz.
        </p>
      </header>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        disabled={loading}
        placeholder="Paste your lecture notes, textbook paragraphs, or summaries here…"
        className="min-h-[240px] w-full resize-none rounded-2xl border border-border bg-card p-4 text-sm leading-relaxed text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent disabled:opacity-60"
      />

      {error && (
        <p className="mt-4 rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <button
        onClick={onGenerate}
        disabled={loading || !notes.trim()}
        className="mt-5 w-full rounded-2xl bg-accent px-5 py-4 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-40"
      >
        {loading ? "Generating…" : "Generate"}
      </button>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        {loading ? "This can take up to a minute." : "Your notes stay in this session."}
      </p>
    </main>
  );
}

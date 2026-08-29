import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FlashGenius — Turn Notes Into Flashcards" },
      { name: "description", content: "Paste your notes and instantly study with flashcards and quizzes. Minimal, dark, mobile-first." },
      { property: "og:title", content: "FlashGenius — Turn Notes Into Flashcards" },
      { property: "og:description", content: "Paste your notes and instantly study with flashcards and quizzes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-5 py-10">
      <header className="mb-8">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">Study smarter</span>
        <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight">
          Flash<span className="text-accent">Genius</span>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Paste your notes below. We turn them into flashcards and a quick quiz.
        </p>
      </header>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Paste your lecture notes, textbook paragraphs, or summaries here…"
        className="min-h-[240px] w-full resize-none rounded-2xl border border-border bg-card p-4 text-sm leading-relaxed text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent"
      />

      <button
        onClick={() => navigate({ to: "/flashcards" })}
        className="mt-5 w-full rounded-2xl bg-accent px-5 py-4 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 active:opacity-80"
      >
        Generate
      </button>

      <button
        onClick={() => navigate({ to: "/quiz" })}
        className="mt-3 w-full rounded-2xl border border-border px-5 py-4 text-sm font-medium text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
      >
        Skip to quiz
      </button>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Using sample content for now.
      </p>
    </main>
  );
}

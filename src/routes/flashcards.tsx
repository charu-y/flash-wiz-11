import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loadStudySet, type Flashcard } from "@/lib/study-data";

export const Route = createFileRoute("/flashcards")({
  head: () => ({
    meta: [
      { title: "Flashcards — FlashGenius" },
      { name: "description", content: "Flip through AI-generated flashcards from your notes and track your progress card by card." },
      { property: "og:title", content: "Flashcards — FlashGenius" },
      { property: "og:description", content: "Flip through AI-generated flashcards and track your progress." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Flashcards,
});

function Flashcards() {
  const [cards, setCards] = useState<Flashcard[] | null>(null);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setCards(loadStudySet()?.flashcards ?? []);
  }, []);

  if (cards === null) {
    return <main className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Loading…</main>;
  }

  if (cards.length === 0) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center px-5 text-center">
        <p className="text-sm text-muted-foreground">No study set yet. Paste your notes to generate one.</p>
        <Link to="/" className="mt-6 rounded-2xl bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground">
          Go to notes
        </Link>
      </main>
    );
  }

  const card = cards[Math.min(index, cards.length - 1)]!;
  const progress = ((index + 1) / cards.length) * 100;

  const go = (delta: number) => {
    setFlipped(false);
    setIndex((i) => Math.min(Math.max(i + delta, 0), cards.length - 1));
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-5 py-8">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <Link to="/" className="transition-colors hover:text-foreground">← Notes</Link>
        <span>Card {index + 1} of {cards.length}</span>
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-accent transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <button
        onClick={() => setFlipped((f) => !f)}
        className="mt-8 flex min-h-[320px] flex-1 flex-col items-center justify-center rounded-3xl border border-border bg-card p-8 text-center transition-colors hover:border-accent"
      >
        <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {flipped ? "Answer" : "Question"}
        </span>
        <p className="mt-5 text-xl font-medium leading-relaxed">
          {flipped ? card.answer : card.question}
        </p>
        <span className="mt-6 text-xs text-muted-foreground">Tap to flip</span>
      </button>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => go(-1)}
          disabled={index === 0}
          className="flex-1 rounded-2xl border border-border px-5 py-3.5 text-sm font-medium transition-colors hover:border-accent disabled:opacity-40"
        >
          Previous
        </button>
        {index === cards.length - 1 ? (
          <button
            onClick={() => navigate({ to: "/quiz" })}
            className="flex-1 rounded-2xl bg-accent px-5 py-3.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
          >
            Start quiz
          </button>
        ) : (
          <button
            onClick={() => go(1)}
            className="flex-1 rounded-2xl bg-accent px-5 py-3.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
          >
            Next
          </button>
        )}
      </div>
    </main>
  );
}

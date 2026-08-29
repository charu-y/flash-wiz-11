import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loadStudySet, type QuizQuestion } from "@/lib/study-data";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Quiz — FlashGenius" },
      { name: "description", content: "Test yourself with AI-generated multiple-choice questions, instant feedback, and a final score." },
      { property: "og:title", content: "Quiz — FlashGenius" },
      { property: "og:description", content: "Multiple-choice questions with instant feedback and a final score." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Quiz,
});

function Quiz() {
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setQuestions(loadStudySet()?.quiz ?? []);
  }, []);

  if (questions === null) {
    return <main className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Loading…</main>;
  }

  if (questions.length === 0) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center px-5 text-center">
        <p className="text-sm text-muted-foreground">No quiz yet. Paste your notes to generate one.</p>
        <Link to="/" className="mt-6 rounded-2xl bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground">
          Go to notes
        </Link>
      </main>
    );
  }

  const q = questions[Math.min(index, questions.length - 1)]!;
  const progress = ((index + 1) / questions.length) * 100;

  const pick = (opt: string) => {
    if (picked !== null) return;
    setPicked(opt);
    if (opt === q.correctAnswer) setScore((s) => s + 1);
  };

  const next = () => {
    if (index === questions.length - 1) return setDone(true);
    setPicked(null);
    setIndex((i) => i + 1);
  };

  const restart = () => {
    setIndex(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center px-5 py-10 text-center">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Your score</span>
        <p className="mt-4 text-6xl font-semibold tracking-tight text-accent">{pct}%</p>
        <p className="mt-3 text-sm text-muted-foreground">
          {score} of {questions.length} correct
        </p>
        <div className="mt-10 flex w-full flex-col gap-3">
          <button
            onClick={restart}
            className="w-full rounded-2xl bg-accent px-5 py-4 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
          >
            Try again
          </button>
          <Link
            to="/"
            className="w-full rounded-2xl border border-border px-5 py-4 text-sm font-medium text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
          >
            Back to notes
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-5 py-8">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <Link to="/flashcards" className="transition-colors hover:text-foreground">← Cards</Link>
        <span>Question {index + 1} of {questions.length}</span>
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-accent transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <span className="mt-8 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
        {q.difficulty}
      </span>
      <h1 className="mt-2 text-2xl font-medium leading-snug">{q.question}</h1>

      <div className="mt-6 flex flex-col gap-3">
        {q.options.map((opt, i) => {
          const isAnswer = opt === q.correctAnswer;
          const isPicked = picked === opt;
          let cls = "border-border bg-card hover:border-accent";
          if (picked !== null && isAnswer) cls = "border-success bg-success/10 text-success";
          else if (isPicked) cls = "border-destructive bg-destructive/10 text-destructive";
          else if (picked !== null) cls = "border-border bg-card opacity-50";
          return (
            <button
              key={i}
              onClick={() => pick(opt)}
              className={`rounded-2xl border px-5 py-4 text-left text-sm font-medium transition-colors ${cls}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <div className="mt-6">
          <p className="text-sm font-medium">
            {picked === q.correctAnswer ? (
              <span className="text-success">Correct!</span>
            ) : (
              <span className="text-destructive">Not quite — the answer is “{q.correctAnswer}”.</span>
            )}
          </p>
          <button
            onClick={next}
            className="mt-4 w-full rounded-2xl bg-accent px-5 py-4 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
          >
            {index === questions.length - 1 ? "See score" : "Next question"}
          </button>
        </div>
      )}
    </main>
  );
}

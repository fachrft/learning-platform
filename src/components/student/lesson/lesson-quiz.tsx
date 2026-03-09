import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

interface LessonQuizProps {
  lesson: any;
  latestAttempt: any;
  answers: Record<string, string>;
  setAnswers: (answers: Record<string, string>) => void;
  isRetaking: boolean;
  setIsRetaking: (val: boolean) => void;
}

export function LessonQuiz({
  lesson,
  latestAttempt,
  answers,
  setAnswers,
  isRetaking,
  setIsRetaking,
}: LessonQuizProps) {
  return (
    <div className="space-y-6">
      {latestAttempt && (
        <div
          className={`p-5 rounded-2xl border ${
            latestAttempt.passed
              ? "bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400"
              : "bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400"
          }`}
        >
          <h3 className="text-lg font-bold mb-1">Hasil Kuis Sebelumnya</h3>
          <p className="font-medium text-sm md:text-base">
            Skor: {latestAttempt.score} / {latestAttempt.totalPoints} (
            {latestAttempt.passed ? "Lulus" : "Belum Lulus"})
          </p>
          {latestAttempt.passed ? (
            <p className="text-sm mt-2 opacity-80">
              Keren! Kamu udah lulus dan bisa lanjut ke materi berikutnya.
            </p>
          ) : (
            <div className="mt-4">
              <p className="text-sm opacity-80 mb-3">
                Ayo coba jawab lagi dengan benar untuk bisa lanjut materi!
              </p>
              {!isRetaking && (
                <Button
                  onClick={() => {
                    setIsRetaking(true);
                    setAnswers({});
                  }}
                  variant="destructive"
                  size="sm"
                >
                  Kerjakan Ulang
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {lesson.quizzes && lesson.quizzes.length > 0 ? (
        lesson.quizzes.map((q: any, index: number) => (
          <div
            key={q.id}
            className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm"
          >
            <div className="flex justify-between items-start mb-6">
              <span className="font-bold text-sm text-foreground/70 tracking-wider uppercase">
                Pertanyaan {index + 1}
              </span>
              <span className="text-xs font-bold px-3 py-1 bg-muted rounded-full">
                {q.points || 10} Poin
              </span>
            </div>
            <p className="text-lg md:text-xl font-medium mb-8 leading-snug">
              {q.question}
            </p>
            <div className="flex flex-col gap-3">
              {[
                { label: "A", text: q.optionA },
                { label: "B", text: q.optionB },
                { label: "C", text: q.optionC },
                { label: "D", text: q.optionD },
              ].map((opt) => {
                const isSelected = answers[q.id] === opt.label;
                const isReadOnly =
                  (latestAttempt && !isRetaking) || latestAttempt?.passed;

                return (
                  <button
                    key={opt.label}
                    onClick={() => {
                      if (!isReadOnly) {
                        setAnswers({ ...answers, [q.id]: opt.label });
                      }
                    }}
                    className={`text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                      isSelected
                        ? isReadOnly
                          ? latestAttempt?.passed
                            ? "border-green-500 bg-green-500/5 shadow-[0_0_0_2px_rgba(34,197,94,0.2)]"
                            : "border-red-500 bg-red-500/5 shadow-[0_0_0_2px_rgba(239,68,68,0.2)]"
                          : "border-primary bg-primary/5 shadow-[0_0_0_2px_rgba(var(--primary),0.2)]"
                        : "border-border hover:border-border/80 hover:bg-muted/30"
                    } ${isReadOnly ? "cursor-default opacity-80" : ""}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${
                        isSelected
                          ? isReadOnly
                            ? latestAttempt?.passed
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
                            : "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {opt.label}
                    </div>
                    <span className="text-sm md:text-base font-medium">
                      {opt.text}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))
      ) : (
        <div className="w-full py-20 flex flex-col items-center justify-center text-muted-foreground bg-muted/20 rounded-2xl border-2 border-dashed">
          <HelpCircle className="w-12 h-12 mb-4 opacity-50" />
          <p>Belum ada pertanyaan kuis buat materi ini bro.</p>
        </div>
      )}
    </div>
  );
}

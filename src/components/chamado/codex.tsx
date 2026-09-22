import { useEffect, useState } from "react";
import { BrotherSigil, HydrangeaMark } from "@/components/chamado/hydrangea-mark";
import {
  CALLING_NAME,
  CHAPTERS,
  CODEX_TITLE,
  EPIGRAPH,
  type ChapterId,
} from "@/lib/chamado/content";
import { cn } from "@/lib/cn";

const RECEIVED_KEY = "toque-da-luz-recebido";

type CodexProps = {
  onReturnToVeil: () => void;
  onReceived: () => void;
  alreadyReceived: boolean;
};

export function Codex({ onReturnToVeil, onReceived, alreadyReceived }: CodexProps) {
  const [active, setActive] = useState<ChapterId>("chamado");
  const [received, setReceived] = useState(alreadyReceived);
  const chapter = CHAPTERS.find((item) => item.id === active) ?? CHAPTERS[0];
  const index = CHAPTERS.findIndex((item) => item.id === active);
  const prev = index > 0 ? CHAPTERS[index - 1] : null;
  const next = index < CHAPTERS.length - 1 ? CHAPTERS[index + 1] : null;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [active]);

  function receive() {
    try {
      window.localStorage.setItem(RECEIVED_KEY, "1");
    } catch {
      /* private mode */
    }
    setReceived(true);
    onReceived();
  }

  return (
    <div className="relative min-h-dvh bg-night text-ivory">
      <header className="sticky top-0 z-20 border-b border-line bg-night/92 backdrop-blur-[2px]">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4">
          <button
            type="button"
            onClick={onReturnToVeil}
            className="min-h-11 font-body text-[0.65rem] font-medium uppercase tracking-[0.28em] text-muted transition-colors duration-150 ease-out hover:text-ivory"
          >
            Véu
          </button>
          <div className="flex items-center gap-3">
            <BrotherSigil />
            <div className="text-right">
              <p className="font-body text-[0.62rem] uppercase tracking-[0.32em] text-muted">
                {CALLING_NAME}
              </p>
              <p className="font-display text-base italic text-ivory-dim">{CODEX_TITLE}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-10 px-5 py-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-16 lg:py-16">
        <nav
          aria-label="Capítulos do códice"
          className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
        >
          {CHAPTERS.map((item) => {
            const isActive = item.id === active;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(item.id)}
                className={cn(
                  "flex min-h-11 shrink-0 items-baseline gap-3 rounded-md px-3 py-2 text-left transition-colors duration-150 ease-out",
                  isActive ? "bg-night-2 text-ivory" : "text-muted hover:text-ivory-dim",
                )}
              >
                <span className="font-body text-[0.65rem] tabular-nums tracking-[0.2em]">
                  {item.numeral}
                </span>
                <span className="font-display text-lg italic">{item.title}</span>
              </button>
            );
          })}
        </nav>

        <article key={chapter.id} className="max-w-2xl pb-24">
          <p className="chapter-enter stagger-1 font-body text-[0.68rem] font-medium uppercase tracking-[0.36em] text-hortensia">
            {chapter.numeral} · {chapter.kicker}
          </p>
          <h2 className="chapter-enter stagger-2 mt-4 font-display text-4xl font-medium leading-none tracking-[-0.03em] text-ivory sm:text-5xl">
            {chapter.title}
          </h2>
          <div className="chapter-enter stagger-3 mt-10 space-y-6">
            {chapter.body.map((paragraph) => (
              <p
                key={paragraph}
                className="font-body text-base font-light leading-relaxed text-ivory-dim sm:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {chapter.id === "luz" && (
            <div className="chapter-enter stagger-4 mt-12 border-t border-line pt-10">
              <blockquote className="font-display text-2xl italic leading-snug text-ivory">
                {EPIGRAPH}
              </blockquote>
              <p className="mt-3 font-body text-xs uppercase tracking-[0.28em] text-muted">
                Roger Luft
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                {received ? (
                  <p className="flex min-h-11 items-center gap-3 font-body text-sm text-ivory">
                    <HydrangeaMark />
                    Chamado recebido. Os irmãos estão na mesa.
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={receive}
                    className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-ivory px-6 font-body text-sm font-medium tracking-wide text-night transition-transform duration-150 ease-out active:scale-[0.96]"
                  >
                    <HydrangeaMark className="size-7" />
                    Eu recebi o chamado
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="chapter-enter stagger-5 mt-14 flex items-center justify-between gap-4 border-t border-line pt-6">
            {prev ? (
              <button
                type="button"
                onClick={() => setActive(prev.id)}
                className="min-h-11 text-left font-body text-xs uppercase tracking-[0.22em] text-muted transition-colors hover:text-ivory"
              >
                {prev.numeral} {prev.title}
              </button>
            ) : (
              <span />
            )}
            {next ? (
              <button
                type="button"
                onClick={() => setActive(next.id)}
                className="min-h-11 text-right font-body text-xs uppercase tracking-[0.22em] text-hortensia transition-colors hover:text-ivory"
              >
                {next.numeral} {next.title}
              </button>
            ) : (
              <span className="font-body text-xs uppercase tracking-[0.22em] text-muted">Fim do códice</span>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}

export function readReceived(): boolean {
  try {
    return window.localStorage.getItem(RECEIVED_KEY) === "1";
  } catch {
    return false;
  }
}

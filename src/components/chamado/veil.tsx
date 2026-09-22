import { useCallback, useEffect, useRef, useState } from "react";
import { BrotherSigil } from "@/components/chamado/hydrangea-mark";
import { CALLING_NAME, CODEX_TITLE } from "@/lib/chamado/content";
import { cn } from "@/lib/cn";

const HOLD_MS = 1400;

type VeilProps = {
  onCrystallize: (x: number, y: number) => void;
  onHoldChange: (gain: number, x: number, y: number) => void;
  alreadyReceived: boolean;
};

export function Veil({ onCrystallize, onHoldChange, alreadyReceived }: VeilProps) {
  const [fill, setFill] = useState(0);
  const holdingRef = useRef(false);
  const rafRef = useRef(0);
  const startRef = useRef(0);
  const originRef = useRef({ x: 0.5, y: 0.5 });
  const reducedRef = useRef(false);

  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const stopHold = useCallback(
    (crystallize: boolean) => {
      holdingRef.current = false;
      cancelAnimationFrame(rafRef.current);
      if (crystallize) {
        setFill(1);
        onHoldChange(1, originRef.current.x, originRef.current.y);
        onCrystallize(originRef.current.x, originRef.current.y);
        return;
      }
      setFill(0);
      onHoldChange(0.12, originRef.current.x, originRef.current.y);
    },
    [onCrystallize, onHoldChange],
  );

  const beginHold = useCallback(
    (clientX: number, clientY: number) => {
      if (holdingRef.current) return;
      originRef.current = { x: clientX, y: clientY };
      if (reducedRef.current) {
        stopHold(true);
        return;
      }
      holdingRef.current = true;
      startRef.current = performance.now();
      const tick = (now: number) => {
        if (!holdingRef.current) return;
        const t = Math.min(1, (now - startRef.current) / HOLD_MS);
        setFill(t);
        onHoldChange(0.2 + t * 0.8, originRef.current.x, originRef.current.y);
        if (t >= 1) {
          stopHold(true);
          return;
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    },
    [onHoldChange, stopHold],
  );

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const circumference = 2 * Math.PI * 42;
  const offset = circumference * (1 - fill);

  return (
    <section
      className="relative isolate flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-night px-6 py-16 text-center"
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        try {
          event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
          /* untrusted or already captured */
        }
        beginHold(event.clientX, event.clientY);
      }}
      onPointerUp={() => {
        if (fill < 1) stopHold(false);
      }}
      onPointerCancel={() => stopHold(false)}
      onLostPointerCapture={() => {
        if (holdingRef.current && fill < 1) stopHold(false);
      }}
      onContextMenu={(event) => event.preventDefault()}
      style={{ touchAction: "none" }}
    >
      <div className="veil-grain" />
      <div className="vignette" />

      <p className="relative z-10 mb-8 font-body text-[0.68rem] font-medium uppercase tracking-[0.42em] text-muted">
        {CODEX_TITLE}
      </p>

      <div className="relative z-10 mb-10">
        <BrotherSigil />
      </div>

      <h1 className="relative z-10 max-w-[14ch] font-display text-5xl font-medium leading-[0.95] tracking-[-0.03em] text-ivory sm:text-7xl">
        {CALLING_NAME}
      </h1>

      <p className="relative z-10 mt-6 max-w-sm font-display text-lg italic leading-snug text-ivory-dim sm:text-xl">
        {alreadyReceived
          ? "O chamado já foi recebido. Toque de novo se quiser entrar."
          : "Um chamado. Não um jogo. Toque e segure para cristalizar."}
      </p>

      <div className="relative z-10 mt-14 flex flex-col items-center gap-4">
        <div
          className={cn(
            "relative grid size-[7.5rem] place-items-center rounded-full border border-line",
            fill > 0 && "border-hortensia/40",
          )}
        >
          <svg className="hold-ring absolute inset-2" viewBox="0 0 100 100" aria-hidden="true">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              className="text-line"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              className="text-ivory"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <span className="font-body text-[0.65rem] font-medium uppercase tracking-[0.28em] text-ivory">
            Toque
          </span>
        </div>
        <p className="font-body text-xs tracking-wide text-muted">Segure até a luz fechar o anel</p>
      </div>
    </section>
  );
}

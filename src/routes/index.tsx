import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bloom } from "@/components/chamado/bloom";
import { Codex, readReceived } from "@/components/chamado/codex";
import { LightField } from "@/components/chamado/light-field";
import { Veil } from "@/components/chamado/veil";

export const Route = createFileRoute("/")({ component: Home });

type Phase = "veil" | "bloom" | "codex";

function Home() {
  const [phase, setPhase] = useState<Phase>("veil");
  const [gain, setGain] = useState(0.14);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const [received, setReceived] = useState(false);

  useEffect(() => {
    setReceived(readReceived());
  }, []);

  const onHoldChange = useCallback((nextGain: number, x: number, y: number) => {
    setGain(nextGain);
    const field = document.querySelector(".light-field") as HTMLElement | null;
    if (field) {
      field.style.setProperty("--lx", `${x}px`);
      field.style.setProperty("--ly", `${y}px`);
    }
  }, []);

  return (
    <main className="relative min-h-dvh bg-night">
      <LightField gain={gain} />

      {phase === "veil" && (
        <Veil
          alreadyReceived={received}
          onHoldChange={onHoldChange}
          onCrystallize={(x, y) => {
            setOrigin({ x, y });
            setGain(1);
            setPhase("bloom");
          }}
        />
      )}

      {phase === "bloom" && (
        <Bloom
          x={origin.x}
          y={origin.y}
          onDone={() => {
            setGain(0.35);
            setPhase("codex");
          }}
        />
      )}

      {phase === "codex" && (
        <Codex
          alreadyReceived={received}
          onReceived={() => setReceived(true)}
          onReturnToVeil={() => {
            setGain(0.14);
            setPhase("veil");
          }}
        />
      )}
    </main>
  );
}

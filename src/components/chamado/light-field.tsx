import { useEffect, useRef } from "react";

type LightFieldProps = {
  gain: number;
};

export function LightField({ gain }: LightFieldProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--light-gain", String(gain));
  }, [gain]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (event: PointerEvent) => {
      el.style.setProperty("--lx", `${event.clientX}px`);
      el.style.setProperty("--ly", `${event.clientY}px`);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return <div ref={ref} className="light-field" aria-hidden="true" />;
}

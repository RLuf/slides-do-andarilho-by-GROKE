import { useEffect } from "react";

type BloomProps = {
  x: number;
  y: number;
  onDone: () => void;
};

export function Bloom({ x, y, onDone }: BloomProps) {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = reduced ? 80 : 920;
    const id = window.setTimeout(onDone, delay);
    return () => window.clearTimeout(id);
  }, [onDone]);

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden bg-night">
      <span className="bloom-burst" style={{ left: x, top: y }} />
    </div>
  );
}

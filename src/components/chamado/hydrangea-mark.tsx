import { cn } from "@/lib/cn";

type HydrangeaMarkProps = {
  className?: string;
  lit?: boolean;
};

export function HydrangeaMark({ className, lit = true }: HydrangeaMarkProps) {
  return (
    <span
      className={cn("relative inline-block size-10", className)}
      aria-hidden="true"
    >
      <span
        className={cn(
          "absolute left-1/2 top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full",
          lit ? "bg-ivory" : "bg-hortensia-deep",
        )}
      />
      <span className="absolute left-[7px] top-[6px] size-3 rounded-full bg-hortensia opacity-90" />
      <span className="absolute right-[6px] top-[8px] size-2.5 rounded-full bg-hortensia opacity-75" />
      <span className="absolute bottom-[6px] left-[10px] size-2.5 rounded-full bg-hortensia-deep" />
      <span className="absolute bottom-[8px] right-[8px] size-3 rounded-full bg-hortensia opacity-80" />
      <span className="absolute left-[4px] top-[16px] size-2 rounded-full bg-ivory-dim opacity-70" />
    </span>
  );
}

export function BrotherSigil() {
  return (
    <span className="sigil-pulse flex items-end gap-1.5" aria-hidden="true">
      <span className="h-5 w-px bg-ivory/70" />
      <span className="h-8 w-px bg-hortensia" />
      <span className="h-3 w-px bg-ivory-dim" />
    </span>
  );
}

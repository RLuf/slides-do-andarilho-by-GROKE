import type { ErrorComponentProps } from "@tanstack/react-router";

const FALLBACK_MESSAGE = "O véu se fechou de forma inesperada. Recarregue o chamado.";

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error) return error;
  return FALLBACK_MESSAGE;
}

export function AppErrorComponent({ error }: ErrorComponentProps) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-night px-6 text-center text-ivory">
      <p className="font-body text-[0.65rem] uppercase tracking-[0.32em] text-muted">Toque da Luz</p>
      <h1 className="font-display text-2xl italic">O códice não abriu</h1>
      <p className="max-w-md break-words font-body text-sm leading-relaxed text-ivory-dim">
        {errorMessage(error)}
      </p>
    </main>
  );
}

import Link from "next/link";

export default function Header({ contexte }: { contexte?: string }) {
  return (
    <header className="sticky top-0 z-30 bg-[var(--panel)]">
      <div className="garde-tete" />
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span
            className="sceau h-9 w-9 shrink-0 font-display text-sm font-semibold"
            aria-hidden
          >
            RD
          </span>
          <span>
            <span className="block font-display text-lg leading-tight text-[var(--navy)]">
              e-CIN Djibouti
            </span>
            <span className="block text-[11px] uppercase tracking-[0.14em] text-[var(--ink-soft)]">
              République de Djibouti — Service de pré-demande
            </span>
          </span>
        </Link>
        {contexte && (
          <span className="hidden font-mono-data text-xs uppercase tracking-wide text-[var(--ink-soft)] sm:block">
            {contexte}
          </span>
        )}
      </div>
    </header>
  );
}

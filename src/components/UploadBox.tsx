"use client";

import { useRef, useState } from "react";

export default function UploadBox({
  label,
  aide,
  onFichier,
  accept = "image/*,.pdf",
}: {
  label: string;
  aide?: string;
  onFichier: (fichier: File) => void;
  accept?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [nomFichier, setNomFichier] = useState<string | null>(null);
  const [survole, setSurvole] = useState(false);

  function traiter(fichier: File | undefined) {
    if (!fichier) return;
    setNomFichier(fichier.name);
    onFichier(fichier);
  }

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-[var(--ink)]">{label}</p>
      {aide && <p className="mb-2 text-xs text-[var(--ink-soft)]">{aide}</p>}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setSurvole(true);
        }}
        onDragLeave={() => setSurvole(false)}
        onDrop={(e) => {
          e.preventDefault();
          setSurvole(false);
          traiter(e.dataTransfer.files?.[0]);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed px-4 py-6 text-center transition-colors ${
          survole ? "border-[var(--navy)] bg-[var(--green-soft)]" : "border-[var(--line)] bg-[var(--panel)]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => traiter(e.target.files?.[0])}
        />
        {nomFichier ? (
          <>
            <span className="font-mono-data text-xs text-[var(--green)]">✓ {nomFichier}</span>
            <span className="mt-1 text-xs text-[var(--ink-soft)]">Cliquez pour remplacer</span>
          </>
        ) : (
          <>
            <span className="text-sm text-[var(--ink-soft)]">
              Glissez un fichier ici ou cliquez pour sélectionner
            </span>
            <span className="mt-1 text-xs text-[var(--ink-soft)]">JPG, PNG ou PDF</span>
          </>
        )}
      </div>
    </div>
  );
}

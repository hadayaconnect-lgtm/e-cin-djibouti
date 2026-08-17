"use client";

import { useState } from "react";
import {
  Langue,
  MESSAGE_ACCUEIL,
  NOMS_LANGUES,
  SUGGESTIONS,
  repondreAssistant,
} from "@/lib/cin/assistant-data";

interface Message {
  auteur: "citoyen" | "assistant";
  texte: string;
}

const LANGUES: Langue[] = ["fr", "ar", "so"];

const LIBELLE_ENTETE: Record<Langue, string> = {
  fr: "Assistant e-CIN",
  ar: "مساعد e-CIN",
  so: "Kaaliyaha e-CIN",
};

const LIBELLE_SOUS_ENTETE: Record<Langue, string> = {
  fr: "Répond à partir des procédures enregistrées uniquement",
  ar: "يجيب فقط استنادًا إلى الإجراءات المسجلة",
  so: "Wuxuu uun ka jawaabaa hababka la diiwaan geliyey",
};

const PLACEHOLDER_SAISIE: Record<Langue, string> = {
  fr: "Posez votre question…",
  ar: "اطرح سؤالك…",
  so: "Su'aashaada qor…",
};

const LIBELLE_ENVOYER: Record<Langue, string> = {
  fr: "Envoyer",
  ar: "إرسال",
  so: "Dir",
};

export default function AssistantWidget() {
  const [ouvert, setOuvert] = useState(false);
  const [langue, setLangue] = useState<Langue>("fr");
  const [saisie, setSaisie] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { auteur: "assistant", texte: MESSAGE_ACCUEIL.fr },
  ]);

  const rtl = langue === "ar";

  function changerLangue(nouvelle: Langue) {
    setLangue(nouvelle);
    // Le contenu de la conversation dépend entièrement de la langue active :
    // on relance donc l'échange dans la langue choisie, plutôt que de mélanger
    // des messages de langues différentes dans le même fil.
    setMessages([{ auteur: "assistant", texte: MESSAGE_ACCUEIL[nouvelle] }]);
  }

  function envoyer(texte: string) {
    if (!texte.trim()) return;
    const reponse = repondreAssistant(texte, langue);
    setMessages((m) => [...m, { auteur: "citoyen", texte }, { auteur: "assistant", texte: reponse }]);
    setSaisie("");
  }

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {ouvert && (
        <div
          dir={rtl ? "rtl" : "ltr"}
          className="mb-3 flex h-[30rem] w-[22rem] max-w-[90vw] flex-col overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--panel)] shadow-xl"
        >
          <div className="garde-tete" />
          <div className="flex items-center justify-between border-b border-[var(--line)] px-4 py-3">
            <div>
              <p className="font-display text-sm font-semibold text-[var(--navy)]">
                {LIBELLE_ENTETE[langue]}
              </p>
              <p className="text-[11px] text-[var(--ink-soft)]">{LIBELLE_SOUS_ENTETE[langue]}</p>
            </div>
            <button
              onClick={() => setOuvert(false)}
              aria-label="Fermer l'assistant"
              className="text-[var(--ink-soft)] hover:text-[var(--ink)]"
            >
              ✕
            </button>
          </div>

          <div className="flex items-center gap-1 border-b border-[var(--line)] px-3 py-2">
            {LANGUES.map((l, i) => (
              <span key={l} className="flex items-center gap-1">
                <button
                  onClick={() => changerLangue(l)}
                  className={`rounded px-1.5 py-0.5 text-xs ${
                    langue === l
                      ? "font-semibold text-[var(--navy)] underline"
                      : "text-[var(--ink-soft)] hover:text-[var(--navy)]"
                  }`}
                >
                  {NOMS_LANGUES[l]}
                </button>
                {i < LANGUES.length - 1 && <span className="text-[var(--line)]">|</span>}
              </span>
            ))}
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-md px-3 py-2 text-sm ${
                  m.auteur === "citoyen"
                    ? `bg-[var(--navy)] text-white ${rtl ? "mr-auto" : "ml-auto"}`
                    : "bg-[var(--paper)] text-[var(--ink)]"
                }`}
              >
                {m.texte}
              </div>
            ))}
          </div>

          <div className="border-t border-[var(--line)] px-3 py-2">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {SUGGESTIONS[langue].map((s) => (
                <button
                  key={s}
                  onClick={() => envoyer(s)}
                  className="rounded-full border border-[var(--line)] px-2.5 py-1 text-[11px] text-[var(--ink-soft)] hover:border-[var(--navy)] hover:text-[var(--navy)]"
                >
                  {s}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                envoyer(saisie);
              }}
              className="flex gap-2"
            >
              <input
                value={saisie}
                onChange={(e) => setSaisie(e.target.value)}
                placeholder={PLACEHOLDER_SAISIE[langue]}
                className="flex-1 rounded-md border border-[var(--line)] px-3 py-1.5 text-sm outline-none focus:border-[var(--navy)]"
              />
              <button
                type="submit"
                className="rounded-md bg-[var(--navy)] px-3 py-1.5 text-sm font-medium text-white hover:bg-[var(--navy-strong)]"
              >
                {LIBELLE_ENVOYER[langue]}
              </button>
            </form>
          </div>
        </div>
      )}
      <button
        onClick={() => setOuvert((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--navy)] text-white shadow-lg hover:bg-[var(--navy-strong)]"
        aria-label="Ouvrir l'assistant e-CIN"
      >
        <span className="font-display text-lg">?</span>
      </button>
    </div>
  );
}

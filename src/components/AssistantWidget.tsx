"use client";

import { useState } from "react";
import { repondreAssistant } from "@/lib/cin/assistant-data";

interface Message {
  auteur: "citoyen" | "assistant";
  texte: string;
}

const SUGGESTIONS = [
  "Quels documents dois-je fournir ?",
  "Comment renouveler ma CIN ?",
  "J'ai perdu ma carte, que dois-je faire ?",
  "Que dois-je apporter à mon rendez-vous ?",
];

export default function AssistantWidget() {
  const [ouvert, setOuvert] = useState(false);
  const [saisie, setSaisie] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      auteur: "assistant",
      texte:
        "Bonjour, je suis l'assistant e-CIN. Je réponds à partir des procédures officiellement enregistrées. Comment puis-je vous aider ?",
    },
  ]);

  function envoyer(texte: string) {
    if (!texte.trim()) return;
    const reponse = repondreAssistant(texte);
    setMessages((m) => [...m, { auteur: "citoyen", texte }, { auteur: "assistant", texte: reponse }]);
    setSaisie("");
  }

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {ouvert && (
        <div className="mb-3 flex h-[28rem] w-[22rem] max-w-[90vw] flex-col overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--panel)] shadow-xl">
          <div className="garde-tete" />
          <div className="flex items-center justify-between border-b border-[var(--line)] px-4 py-3">
            <div>
              <p className="font-display text-sm font-semibold text-[var(--navy)]">
                Assistant e-CIN
              </p>
              <p className="text-[11px] text-[var(--ink-soft)]">
                Répond à partir des procédures enregistrées uniquement
              </p>
            </div>
            <button
              onClick={() => setOuvert(false)}
              aria-label="Fermer l'assistant"
              className="text-[var(--ink-soft)] hover:text-[var(--ink)]"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-md px-3 py-2 text-sm ${
                  m.auteur === "citoyen"
                    ? "ml-auto bg-[var(--navy)] text-white"
                    : "bg-[var(--paper)] text-[var(--ink)]"
                }`}
              >
                {m.texte}
              </div>
            ))}
          </div>
          <div className="border-t border-[var(--line)] px-3 py-2">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
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
                placeholder="Posez votre question…"
                className="flex-1 rounded-md border border-[var(--line)] px-3 py-1.5 text-sm outline-none focus:border-[var(--navy)]"
              />
              <button
                type="submit"
                className="rounded-md bg-[var(--navy)] px-3 py-1.5 text-sm font-medium text-white hover:bg-[var(--navy-strong)]"
              >
                Envoyer
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

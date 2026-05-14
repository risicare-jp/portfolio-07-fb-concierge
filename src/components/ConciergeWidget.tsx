import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { askConcierge } from "@/lib/concierge.functions";
import { OrderAssistant } from "@/components/OrderAssistant";
import { SakePairing } from "@/components/SakePairing";
import { ChefsRecommendation } from "@/components/ChefsRecommendation";

const ORDER_INTENT = /\[INTENT:\s*ORDER_ASSISTANT\]/;
const SAKE_INTENT = /\[INTENT:\s*SAKE_PAIRING:([a-z0-9-]+)\]/i;
const CHEF_INTENT = /\[INTENT:\s*CHEFS_REC\]/;

type Intent =
  | { kind: "none" }
  | { kind: "order" }
  | { kind: "sake"; dishId: string }
  | { kind: "chef" };

type Msg = {
  role: "user" | "assistant";
  content: string;
  intent?: Intent;
};

const WELCOME: Msg = {
  role: "assistant",
  content:
    "Hi — I'm the Concierge for Tomoko's Toronto. Ask me anything about hours, location, our menu, allergens, or recommendations. I speak English, 日本語, and 中文.",
};

type Mode = "chat" | "order" | "sake" | "chef";

export function ConciergeWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [mode, setMode] = useState<Mode>("chat");
  const [sakeDishId, setSakeDishId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const ask = useServerFn(askConcierge);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, pending, open]);

  const parseIntent = (raw: string): { text: string; intent: Intent } => {
    let text = raw;
    let intent: Intent = { kind: "none" };
    const sake = raw.match(SAKE_INTENT);
    if (sake) {
      intent = { kind: "sake", dishId: sake[1] };
      text = text.replace(SAKE_INTENT, "").trim();
    } else if (CHEF_INTENT.test(raw)) {
      intent = { kind: "chef" };
      text = text.replace(CHEF_INTENT, "").trim();
    } else if (ORDER_INTENT.test(raw)) {
      intent = { kind: "order" };
      text = text.replace(ORDER_INTENT, "").trim();
    }
    return { text, intent };
  };

  const send = async () => {
    const text = input.trim();
    if (!text || pending) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setPending(true);
    try {
      const apiMessages = next
        .filter((m) => m !== WELCOME)
        .map((m) => ({ role: m.role, content: m.content }));
      let fx: { USD?: number; JPY?: number; CNY?: number; EUR?: number; fetched_at?: string } | undefined;
      try {
        const raw = localStorage.getItem("tomokos_fx_cache_v1");
        if (raw) {
          const parsed = JSON.parse(raw) as { rates?: Record<string, number>; fetched_at?: string };
          if (parsed?.rates) {
            fx = {
              USD: parsed.rates.USD,
              JPY: parsed.rates.JPY,
              CNY: parsed.rates.CNY,
              EUR: parsed.rates.EUR,
              fetched_at: parsed.fetched_at,
            };
          }
        }
      } catch { /* noop */ }
      const result = await ask({ data: { messages: apiMessages, fx } });
      if (result.ok) {
        const { text: cleaned, intent } = parseIntent(result.reply);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: cleaned, intent },
        ]);
      } else if (result.error === "unauthorized") {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Concierge is offline for maintenance — please contact reserve@tomokos.to directly.",
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "I'm having trouble reaching my notes right now — please email us at reserve@tomokos.to and we'll get back to you within a few hours.",
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm having trouble reaching my notes right now — please email us at reserve@tomokos.to and we'll get back to you within a few hours.",
        },
      ]);
    } finally {
      setPending(false);
    }
  };

  const launchIntent = (intent: Intent) => {
    if (intent.kind === "order") setMode("order");
    else if (intent.kind === "chef") setMode("chef");
    else if (intent.kind === "sake") {
      setSakeDishId(intent.dishId);
      setMode("sake");
    }
  };

  const returnToChat = () => {
    setMode("chat");
    setSakeDishId(null);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "Anything else I can help with?" },
    ]);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Ask the Concierge"
        title="Ask the Concierge"
        className="group fixed bottom-5 right-5 z-[100] flex h-12 w-12 items-center justify-center rounded-full bg-accent text-cream shadow-lg shadow-black/40 ring-1 ring-amber-glow/40 transition-all hover:scale-110 hover:shadow-xl hover:shadow-amber-glow/30 md:bottom-6 md:right-6 md:h-14 md:w-14"
        style={{ backgroundColor: "hsl(var(--accent, 25 50% 40%))" }}
      >
        {open ? (
          <X className="h-5 w-5 md:h-6 md:w-6" />
        ) : (
          <MessageCircle className="h-5 w-5 md:h-6 md:w-6" />
        )}
      </button>

      <div
        className={`fixed z-[99] transition-all duration-300 ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        } inset-0 md:inset-auto md:bottom-24 md:right-6 md:h-[560px] md:w-[380px]`}
      >
        <div className="flex h-full w-full flex-col overflow-hidden border border-cream/10 bg-background shadow-2xl shadow-black/60 md:rounded-2xl">
          <div className="flex items-start justify-between border-b border-cream/10 bg-background/80 px-5 py-4 backdrop-blur">
            <div>
              <div className="font-display text-lg tracking-wide text-cream">
                AI Concierge
              </div>
              <div className="text-[0.7rem] uppercase tracking-[0.2em] text-cream/50">
                Hours · Menu · Allergens · Pairings
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="rounded-full p-1 text-cream/60 transition hover:bg-cream/5 hover:text-cream"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {mode === "order" && <OrderAssistant onClose={returnToChat} />}
          {mode === "sake" && sakeDishId && (
            <SakePairing dishId={sakeDishId} onBack={returnToChat} />
          )}
          {mode === "chef" && <ChefsRecommendation onClose={returnToChat} />}

          {mode === "chat" && (
            <>
              <div
                ref={scrollRef}
                className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
              >
                {messages.map((m, i) => (
                  <Bubble
                    key={i}
                    msg={m}
                    onLaunchIntent={launchIntent}
                  />
                ))}
                {pending && (
                  <div className="flex items-center gap-2 px-2 text-xs text-cream/50">
                    <span className="inline-flex gap-1">
                      <Dot delay="0ms" />
                      <Dot delay="150ms" />
                      <Dot delay="300ms" />
                    </span>
                    Concierge is typing…
                  </div>
                )}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void send();
                }}
                className="flex items-center gap-2 border-t border-cream/10 bg-background px-3 py-3"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask the Concierge…"
                  disabled={pending}
                  className="flex-1 rounded-full border border-cream/15 bg-transparent px-4 py-2 text-sm text-cream placeholder:text-cream/40 focus:border-amber-glow/60 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || pending}
                  aria-label="Send"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-glow text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function intentLabel(intent?: Intent): string | null {
  if (!intent || intent.kind === "none") return null;
  if (intent.kind === "order") return "Continue to Order Assistant →";
  if (intent.kind === "sake") return "View Sake Pairing →";
  if (intent.kind === "chef") return "Continue to Chef's Recommendation →";
  return null;
}

function Bubble({
  msg,
  onLaunchIntent,
}: {
  msg: Msg;
  onLaunchIntent: (intent: Intent) => void;
}) {
  const isUser = msg.role === "user";
  const label = intentLabel(msg.intent);
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} gap-2`}>
      {!isUser && (
        <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-amber-glow/40 bg-background font-display text-xs text-amber-glow">
          知
        </div>
      )}
      <div className="flex max-w-[78%] flex-col items-start gap-2">
        <div
          className={`whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
            isUser ? "bg-cream/10 text-cream" : "bg-amber-glow/10 text-cream/90"
          }`}
        >
          {msg.content}
        </div>
        {label && msg.intent && (
          <button
            onClick={() => onLaunchIntent(msg.intent!)}
            className="rounded-full bg-amber-glow px-3.5 py-1.5 text-xs font-medium text-background transition hover:opacity-90"
          >
            {label}
          </button>
        )}
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-cream/50"
      style={{ animationDelay: delay }}
    />
  );
}

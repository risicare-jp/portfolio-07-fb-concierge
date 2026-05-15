import { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { askConcierge } from "@/lib/concierge.functions";
import { OrderAssistant } from "@/components/OrderAssistant";
import { SakePairing } from "@/components/SakePairing";
import { ChefsRecommendation } from "@/components/ChefsRecommendation";
import { ReservationAssistant } from "@/components/ReservationAssistant";
import { useI18n } from "@/lib/i18n";

const ORDER_INTENT = /\[INTENT:\s*ORDER_ASSISTANT\]/;
const SAKE_INTENT = /\[INTENT:\s*SAKE_PAIRING:([a-z0-9-]+)\]/i;
const CHEF_INTENT = /\[INTENT:\s*CHEFS_REC\]/;
const RESERVATION_INTENT = /\[INTENT:\s*RESERVATION_ASSISTANT\]/;

type Intent =
  | { kind: "none" }
  | { kind: "order" }
  | { kind: "sake"; dishId: string }
  | { kind: "chef" }
  | { kind: "reservation" };

type Msg = {
  role: "user" | "assistant";
  content: string;
  intent?: Intent;
  isWelcome?: boolean;
  isFollowup?: boolean;
};

type Mode = "chat" | "order" | "sake" | "chef" | "reservation";

export function ConciergeWidget() {
  const { t, locale } = useI18n();
  const [open, setOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showProactive, setShowProactive] = useState(false);
  const welcomeMsg = useMemo<Msg>(
    () => ({ role: "assistant", content: t("concierge.welcome"), isWelcome: true }),
    [t],
  );
  const [messages, setMessages] = useState<Msg[]>([welcomeMsg]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [mode, setMode] = useState<Mode>("chat");
  const [sakeDishId, setSakeDishId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const ask = useServerFn(askConcierge);

  // Listen for external open requests (e.g., Hero CTA)
  useEffect(() => {
    const onOpen = () => {
      setOpen(true);
      setShowProactive(false);
      setShowTooltip(false);
    };
    window.addEventListener("hinokami:open-concierge", onOpen);
    return () => window.removeEventListener("hinokami:open-concierge", onOpen);
  }, []);

  // First-load tooltip after user scrolls past hero (~600px)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("concierge_tooltip_shown_v1")) return;
    let shown = false;
    const onScroll = () => {
      if (shown || open) return;
      if (window.scrollY > 600) {
        shown = true;
        setShowTooltip(true);
        sessionStorage.setItem("concierge_tooltip_shown_v1", "1");
        setTimeout(() => setShowTooltip(false), 3000);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  // Proactive bubble after 10s idle, once per session
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("concierge_proactive_shown_v1")) return;
    const id = window.setTimeout(() => {
      if (open) return;
      setShowProactive(true);
      sessionStorage.setItem("concierge_proactive_shown_v1", "1");
      window.setTimeout(() => setShowProactive(false), 5000);
    }, 10000);
    return () => window.clearTimeout(id);
  }, [open]);

  // Refresh welcome and follow-up bubbles when locale changes
  useEffect(() => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.isWelcome) return { ...m, content: t("concierge.welcome") };
        if (m.isFollowup) return { ...m, content: t("concierge.followup") };
        return m;
      }),
    );
  }, [t]);

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
    } else if (RESERVATION_INTENT.test(raw)) {
      intent = { kind: "reservation" };
      text = text.replace(RESERVATION_INTENT, "").trim();
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
        .filter((m) => !m.isWelcome && !m.isFollowup)
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
      const result = await ask({ data: { messages: apiMessages, fx, locale } });
      if (result.ok) {
        const { text: cleaned, intent } = parseIntent(result.reply);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: cleaned, intent },
        ]);
      } else if (result.error === "unauthorized") {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: t("concierge.error_unauthorized") },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: t("concierge.error_network") },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: t("concierge.error_network") },
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
      { role: "assistant", content: t("concierge.followup"), isFollowup: true },
    ]);
  };

  const intentLabel = (intent?: Intent): string | null => {
    if (!intent || intent.kind === "none") return null;
    if (intent.kind === "order") return t("concierge.continue_order_assistant");
    if (intent.kind === "sake") return t("concierge.continue_sake_pairing");
    if (intent.kind === "chef") return t("concierge.continue_chefs_rec");
    return null;
  };

  return (
    <>
      {/* Tooltip + proactive bubble, anchored above the floating button */}
      {!open && (showTooltip || showProactive) && (
        <div className="fixed bottom-[80px] right-5 z-[100] max-w-[260px] animate-fade-up md:bottom-[96px] md:right-6">
          <div className="rounded-2xl rounded-br-sm border border-amber-glow/40 bg-charcoal/95 px-4 py-3 text-xs text-cream shadow-lg shadow-black/40 backdrop-blur">
            {showProactive ? (
              <button onClick={() => { setOpen(true); setShowProactive(false); }} className="text-left">
                {t("concierge.proactive")}
              </button>
            ) : (
              <span>{t("concierge.tooltip_hint")}</span>
            )}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("concierge.button_tooltip")}
        title={t("concierge.button_tooltip")}
        className="group fixed bottom-5 right-5 z-[100] flex h-12 w-12 items-center justify-center rounded-full border-[1.5px] border-amber-glow/80 bg-charcoal/90 text-amber-glow shadow-md shadow-black/40 backdrop-blur transition-all hover:scale-105 hover:brightness-110 md:bottom-6 md:right-6 md:h-14 md:w-14"
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
                {t("concierge.header_title")}
              </div>
              <div className="text-[0.7rem] uppercase tracking-[0.2em] text-cream/50">
                {t("concierge.header_subtitle")}
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
                {messages.map((m, i) => {
                  const isUser = m.role === "user";
                  const label = intentLabel(m.intent);
                  return (
                    <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"} gap-2`}>
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
                          {m.content}
                        </div>
                        {label && m.intent && (
                          <button
                            onClick={() => launchIntent(m.intent!)}
                            className="rounded-full bg-amber-glow px-3.5 py-1.5 text-xs font-medium text-background transition hover:opacity-90"
                          >
                            {label}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                {pending && (
                  <div className="flex items-center gap-2 px-2 text-xs text-cream/50">
                    <span className="inline-flex gap-1">
                      <Dot delay="0ms" />
                      <Dot delay="150ms" />
                      <Dot delay="300ms" />
                    </span>
                    {t("concierge.typing")}
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
                  placeholder={t("concierge.input_placeholder")}
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

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-cream/50"
      style={{ animationDelay: delay }}
    />
  );
}

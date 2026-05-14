import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { askConcierge } from "@/lib/concierge.functions";
import { OrderAssistant } from "@/components/OrderAssistant";

const ORDER_INTENT = "[INTENT: ORDER_ASSISTANT]";

type Msg = {
  role: "user" | "assistant";
  content: string;
  hasOrderIntent?: boolean;
};

const WELCOME: Msg = {
  role: "assistant",
  content:
    "Hi — I'm the Concierge for Tomoko's Toronto. Ask me anything about hours, location, our menu, allergens, or recommendations. I speak English, 日本語, and 中文.",
};

export function ConciergeWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [showOrderAssistant, setShowOrderAssistant] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const ask = useServerFn(askConcierge);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, pending, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || pending) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setPending(true);
    try {
      // Send only real conversation (skip the local welcome message)
      const apiMessages = next.filter((m) => m !== WELCOME);
      const result = await ask({ data: { messages: apiMessages } });
      if (result.ok) {
        setMessages((prev) => [...prev, { role: "assistant", content: result.reply }]);
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

  return (
    <>
      {/* Floating button */}
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

      {/* Panel */}
      <div
        className={`fixed z-[99] transition-all duration-300 ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        } inset-0 md:inset-auto md:bottom-24 md:right-6 md:h-[560px] md:w-[380px]`}
      >
        <div className="flex h-full w-full flex-col overflow-hidden border border-cream/10 bg-background shadow-2xl shadow-black/60 md:rounded-2xl">
          {/* Header */}
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

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
          >
            {messages.map((m, i) => (
              <Bubble key={i} msg={m} />
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

          {/* Input */}
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
        </div>
      </div>
    </>
  );
}

function Bubble({ msg }: { msg: Msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} gap-2`}>
      {!isUser && (
        <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-amber-glow/40 bg-background font-display text-xs text-amber-glow">
          知
        </div>
      )}
      <div
        className={`max-w-[78%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
          isUser
            ? "bg-cream/10 text-cream"
            : "bg-amber-glow/10 text-cream/90"
        }`}
      >
        {msg.content}
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

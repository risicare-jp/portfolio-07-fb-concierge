import { useEffect, useRef, useState } from "react";
import { CURRENCIES, useCurrency, type Currency } from "@/lib/currency";

export function CurrencySelector({ className = "" }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1 text-[0.65rem] uppercase tracking-[0.25em] text-cream/60 transition hover:text-amber-glow md:text-xs"
      >
        {currency} <span aria-hidden>▾</span>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-50 mt-2 min-w-[5.5rem] rounded-sm border border-amber-glow/30 bg-charcoal/95 py-1 text-[0.7rem] uppercase tracking-[0.25em] shadow-glow backdrop-blur"
        >
          {CURRENCIES.map((c: Currency) => (
            <li key={c}>
              <button
                type="button"
                onClick={() => {
                  setCurrency(c);
                  setOpen(false);
                }}
                className={`block w-full px-4 py-1.5 text-left transition hover:text-amber-glow ${
                  currency === c
                    ? "font-semibold text-amber-glow"
                    : "text-cream/70"
                }`}
              >
                {c}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

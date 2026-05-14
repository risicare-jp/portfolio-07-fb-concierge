import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Currency = "CAD" | "USD" | "JPY" | "CNY" | "EUR";

export const CURRENCIES: Currency[] = ["CAD", "USD", "JPY", "CNY", "EUR"];

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  CAD: "$",
  USD: "$",
  JPY: "¥",
  CNY: "¥",
  EUR: "€",
};

export type Rates = Partial<Record<Exclude<Currency, "CAD">, number>>;

const FALLBACK_RATES: Required<Rates> = {
  USD: 0.74,
  JPY: 110.5,
  CNY: 5.32,
  EUR: 0.68,
};

const CACHE_KEY = "tomokos_fx_cache_v1";
const CURRENCY_KEY = "tomokos_currency_v1";
const TTL_MS = 86_400_000;

type CachedFx = {
  rates: Rates;
  fetched_at: string;
  source: string;
};

function safeRead<T>(key: string): T | null {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : null;
  } catch {
    return null;
  }
}

function safeWrite(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* noop */
  }
}

function safeReadString(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeWriteString(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* noop */
  }
}

type Ctx = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  rates: Rates;
  format: (cad: number) => string;
};

const CurrencyCtx = createContext<Ctx | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("CAD");
  const [rates, setRates] = useState<Rates>(FALLBACK_RATES);

  // Load persisted currency + cached rates after mount
  useEffect(() => {
    const stored = safeReadString(CURRENCY_KEY);
    if (stored && (CURRENCIES as string[]).includes(stored)) {
      setCurrencyState(stored as Currency);
    }
    const cached = safeRead<CachedFx>(CACHE_KEY);
    const fresh =
      cached &&
      Date.now() - new Date(cached.fetched_at).getTime() < TTL_MS &&
      cached.rates;
    if (fresh) {
      setRates({ ...FALLBACK_RATES, ...cached.rates });
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/CAD");
        if (!res.ok) throw new Error("fx fetch failed");
        const json = (await res.json()) as {
          result?: string;
          rates?: Record<string, number>;
        };
        if (json.result !== "success" || !json.rates) throw new Error("bad payload");
        const next: Rates = {
          USD: json.rates.USD ?? FALLBACK_RATES.USD,
          JPY: json.rates.JPY ?? FALLBACK_RATES.JPY,
          CNY: json.rates.CNY ?? FALLBACK_RATES.CNY,
          EUR: json.rates.EUR ?? FALLBACK_RATES.EUR,
        };
        if (cancelled) return;
        setRates(next);
        safeWrite(CACHE_KEY, {
          rates: next,
          fetched_at: new Date().toISOString(),
          source: "open.er-api.com",
        } satisfies CachedFx);
      } catch {
        // silent fallback to bundled rates already in state
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    safeWriteString(CURRENCY_KEY, c);
  }, []);

  const format = useCallback(
    (cad: number) => formatPrice(cad, currency, rates),
    [currency, rates],
  );

  const value = useMemo(
    () => ({ currency, setCurrency, rates, format }),
    [currency, setCurrency, rates, format],
  );

  return <CurrencyCtx.Provider value={value}>{children}</CurrencyCtx.Provider>;
}

export function useCurrency(): Ctx {
  const ctx = useContext(CurrencyCtx);
  if (!ctx) {
    // Safe fallback for components rendered outside the provider (e.g., during SSR shell)
    return {
      currency: "CAD",
      setCurrency: () => {},
      rates: FALLBACK_RATES,
      format: (cad: number) => formatPrice(cad, "CAD", FALLBACK_RATES),
    };
  }
  return ctx;
}

export function formatPrice(cad: number, currency: Currency, rates: Rates): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  if (currency === "CAD") {
    return `${symbol}${cad.toFixed(2)} CAD`;
  }
  const rate = rates[currency];
  if (rate == null) {
    return `${CURRENCY_SYMBOLS.CAD}${cad.toFixed(2)} CAD`;
  }
  const converted = cad * rate;
  if (currency === "JPY" || currency === "CNY") {
    return `${symbol}${Math.round(converted).toLocaleString()} ${currency}`;
  }
  return `${symbol}${converted.toFixed(2)} ${currency}`;
}

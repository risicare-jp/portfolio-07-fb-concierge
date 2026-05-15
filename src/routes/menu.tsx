import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { MENU, type Dish } from "@/data/menu";
import { useCurrency } from "@/lib/currency";
import { useI18n, pickLocalized, LOCALES, type Locale } from "@/lib/i18n";

export const Route = createFileRoute("/menu")({
  component: MenuPage,
  head: () => ({
    meta: [
      { title: "Full Menu — HINOKAMI Toronto" },
      { name: "description", content: "The full HINOKAMI Toronto menu — robata, sashimi, donabe & sake." },
    ],
  }),
});

const LOCALE_LABELS: Record<Locale, string> = { en: "EN", ja: "日本語", cn: "中文" };

type TabKey = "all" | "robata" | "sashimi" | "donabe_sake";

function MenuPage() {
  const { t, locale, setLocale } = useI18n();
  const { format } = useCurrency();
  const [tab, setTab] = useState<TabKey>("all");
  const [localeOpen, setLocaleOpen] = useState(false);

  const tabs: Array<{ key: TabKey; label: string }> = [
    { key: "all", label: t("fullmenu.tab_all") },
    { key: "robata", label: t("counter.robata.name") },
    { key: "sashimi", label: t("counter.sashimi.name") },
    { key: "donabe_sake", label: t("counter.donabe_sake.name") },
  ];

  const dishes: Dish[] = tab === "all" ? MENU : MENU.filter((d) => d.counter === tab);

  const goBack = () => {
    if (typeof window === "undefined") return;
    if (window.history.length > 1) window.history.back();
    else window.location.href = "/";
  };

  return (
    <main className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-charcoal/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-4 md:px-8 md:py-5">
          <button
            onClick={goBack}
            className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.25em] text-amber-glow transition hover:text-cream"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t("nav.back")}
          </button>
          <div className="flex flex-col items-center font-display text-cream">
            <span className="whitespace-nowrap text-[16px] leading-[1.1] tracking-[0.05em] md:text-[18px]">
              鎮座ヒノカミ
            </span>
            <span className="hidden text-[10px] uppercase tracking-[0.25em] text-cream/70 md:inline-block">
              HINOKAMI
            </span>
          </div>
          <div className="relative">
            <button
              onClick={() => setLocaleOpen((o) => !o)}
              className="flex items-center gap-1 text-[0.65rem] uppercase tracking-[0.25em] text-cream/60 transition hover:text-amber-glow md:text-xs"
            >
              {LOCALE_LABELS[locale]} <span aria-hidden>▾</span>
            </button>
            {localeOpen && (
              <ul className="absolute right-0 top-full z-50 mt-2 min-w-[6rem] rounded-sm border border-amber-glow/30 bg-charcoal/95 py-1 text-[0.7rem] uppercase tracking-[0.25em] shadow-glow backdrop-blur">
                {LOCALES.map((l) => (
                  <li key={l}>
                    <button
                      onClick={() => { setLocale(l); setLocaleOpen(false); }}
                      className={`block w-full px-4 py-1.5 text-left transition hover:text-amber-glow ${
                        locale === l ? "font-semibold text-amber-glow" : "text-cream/70"
                      }`}
                    >
                      {LOCALE_LABELS[l]}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 pt-16 md:px-12">
        <h1 className="font-display text-4xl font-light text-cream md:text-6xl">
          {t("fullmenu.title")}
        </h1>
        <p className="mt-4 text-[0.7rem] tracking-[0.2em] text-cream/50">
          {t("menu.legend")}
        </p>

        {/* Tabs */}
        <div className="mt-10 flex flex-wrap gap-2 border-b border-border/60 pb-1">
          {tabs.map((tb) => (
            <button
              key={tb.key}
              onClick={() => setTab(tb.key)}
              className={`px-4 py-2 text-[0.7rem] uppercase tracking-[0.25em] transition ${
                tab === tb.key
                  ? "border-b-2 border-amber-glow text-amber-glow"
                  : "border-b-2 border-transparent text-cream/60 hover:text-cream"
              }`}
            >
              {tb.label}
            </button>
          ))}
        </div>

        {/* Dish list */}
        <ul className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
          {dishes.map((d) => (
            <li key={d.id} className="border-b border-border/40 pb-8">
              <div className="flex items-baseline justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {d.is_signature && (
                      <span className="text-amber-glow" aria-label="Signature">⭐</span>
                    )}
                    {d.is_seasonal && (
                      <span className="text-pink-300" aria-label="Seasonal">🌸</span>
                    )}
                    <h3 className="font-display text-xl font-light text-cream md:text-2xl">
                      {pickLocalized(d.names, locale)}
                    </h3>
                  </div>
                  {locale !== "ja" && (
                    <p className="mt-0.5 text-xs tracking-wide text-cream/45">{d.names.ja}</p>
                  )}
                </div>
                <span className="font-display text-sm text-amber-glow md:text-base">
                  {format(d.price_cad)}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-cream/70">
                {pickLocalized(d.descriptions, locale)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

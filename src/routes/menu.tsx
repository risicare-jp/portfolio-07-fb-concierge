import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MENU, type Dish } from "@/data/menu";
import { DRINKS, type Drink } from "@/data/drinks";
import { SAKE, type Sake } from "@/data/sake";
import { useCurrency } from "@/lib/currency";
import { useI18n, pickLocalized } from "@/lib/i18n";
import { DetailModal, openDetail } from "@/components/DetailModal";
import { Nav } from "@/routes/index";

type TabKey = "all" | "robata" | "sashimi" | "donabe" | "drinks";

const TAB_KEYS: TabKey[] = ["all", "robata", "sashimi", "donabe", "drinks"];

export const Route = createFileRoute("/menu")({
  component: MenuPage,
  validateSearch: (search: Record<string, unknown>): { counter?: TabKey } => {
    const c = search.counter;
    if (typeof c === "string" && (TAB_KEYS as string[]).includes(c)) {
      return { counter: c as TabKey };
    }
    return {};
  },
  head: () => ({
    meta: [
      { title: "Full Menu — HINOKAMI Toronto" },
      { name: "description", content: "The full HINOKAMI Toronto menu — robata, sashimi, donabe & sake, and drinks." },
    ],
  }),
});

function MenuPage() {
  const { t, locale } = useI18n();
  const { format } = useCurrency();
  const { counter } = Route.useSearch();
  const [tab, setTab] = useState<TabKey>(counter ?? "all");

  const tabs: Array<{ key: TabKey; label: string }> = [
    { key: "all", label: t("fullmenu.tab_all") },
    { key: "robata", label: t("counter.robata.name") },
    { key: "sashimi", label: t("counter.sashimi.name") },
    { key: "donabe", label: t("counter.donabe.name") },
    { key: "drinks", label: t("counter.drinks.name") },
  ];

  const showDishes = tab === "all" || tab === "robata" || tab === "sashimi" || tab === "donabe";
  const showDrinks = tab === "all" || tab === "drinks";

  const dishes: Dish[] = tab === "all" || tab === "drinks"
    ? (tab === "drinks" ? [] : MENU)
    : MENU.filter((d) => d.counter === tab);

  const goBackToMenuSection = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window === "undefined") return;
    try { sessionStorage.setItem("hinokami_pending_anchor", "menu"); } catch { /* noop */ }
    window.location.href = "/#menu";
  };

  const drinkCategories: Array<{ key: Drink["category"] | "sake"; items: Array<Drink | Sake> }> = [
    { key: "sake", items: SAKE },
    { key: "beer", items: DRINKS.filter((d) => d.category === "beer") },
    { key: "highball", items: DRINKS.filter((d) => d.category === "highball") },
    { key: "wine", items: DRINKS.filter((d) => d.category === "wine") },
    { key: "soft", items: DRINKS.filter((d) => d.category === "soft") },
  ];

  return (
    <main className="min-h-screen bg-background pb-24">
      <Nav />

      <div className="mx-auto max-w-5xl px-6 pt-32 md:px-12 md:pt-40">
        <div className="sticky top-20 z-30 mb-8 md:top-24">
          <a
            href="/#menu"
            onClick={goBackToMenuSection}
            className="inline-flex items-center rounded-full border border-amber-glow/60 bg-charcoal/85 px-4 py-2 text-[0.65rem] uppercase tracking-[0.25em] text-amber-glow shadow-md backdrop-blur transition hover:bg-amber-glow hover:text-charcoal"
          >
            {t("gallery.back_button")}
          </a>
        </div>

        <h1 className="font-display text-4xl font-light text-cream md:text-6xl">
          {t("fullmenu.title")}
        </h1>

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

        {showDishes && dishes.length > 0 && (
          <ul className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
            {dishes.map((d) => (
              <li key={d.id}>
                <button
                  type="button"
                  onClick={() => openDetail({ kind: "dish", id: d.id })}
                  className="group block w-full text-left border-b border-border/40 pb-8"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-display text-xl font-light text-cream group-hover:text-amber-glow md:text-2xl">
                        {pickLocalized(d.names, locale)}
                      </h3>
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
                </button>
              </li>
            ))}
          </ul>
        )}

        {showDrinks && (
          <div className="mt-16 space-y-12">
            {drinkCategories.map((cat) => (
              <div key={cat.key}>
                <h2 className="mb-6 font-display text-2xl font-light text-cream md:text-3xl">
                  {t(`drinks.cat.${cat.key}`)}
                </h2>
                <ul className="grid gap-x-10 gap-y-6 md:grid-cols-2">
                  {cat.items.map((item) => {
                    const isSake = cat.key === "sake";
                    const id = item.id;
                    const price = isSake
                      ? (item as Sake).price_glass_cad
                      : (item as Drink).price_cad;
                    return (
                      <li key={id}>
                        <button
                          type="button"
                          onClick={() =>
                            openDetail(
                              isSake
                                ? { kind: "drink", id: id }
                                : { kind: "drink", id },
                            )
                          }
                          className="group block w-full text-left border-b border-border/40 pb-5"
                        >
                          <div className="flex items-baseline justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="font-display text-base font-light text-cream group-hover:text-amber-glow md:text-lg">
                                {pickLocalized(item.names, locale)}
                              </h3>
                              {locale !== "ja" && (
                                <p className="mt-0.5 text-[11px] tracking-wide text-cream/45">
                                  {item.names.ja}
                                </p>
                              )}
                            </div>
                            <span className="font-display text-sm text-amber-glow">
                              {format(price)}
                            </span>
                          </div>
                          <p className="mt-2 text-xs leading-relaxed text-cream/65">
                            {isSake ? (item as Sake).flavor : (item as Drink).flavor}
                          </p>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
      <DetailModal />
    </main>
  );
}

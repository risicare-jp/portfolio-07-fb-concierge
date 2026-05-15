import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  ALLERGEN_KEYS,
  dishById,
  dishOrigin,
  type AllergenKey,
  type Dish,
} from "@/data/menu";
import { drinkById, drinksPairedWithDish, DRINKS, type Drink } from "@/data/drinks";
import { SAKE, sakeById, type Sake } from "@/data/sake";
import { pairForDish } from "@/lib/sake-pairing";
import { useCurrency } from "@/lib/currency";
import { useI18n, pickLocalized, ALLERGEN_LABELS_I18N } from "@/lib/i18n";

export type DetailRequest =
  | { kind: "dish"; id: string }
  | { kind: "drink"; id: string };

const EVENT = "hinokami:open-detail";

export function openDetail(req: DetailRequest) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(EVENT, { detail: req }));
}

export function DetailModal() {
  const { t, locale } = useI18n();
  const { format } = useCurrency();
  const [req, setReq] = useState<DetailRequest | null>(null);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const ce = e as CustomEvent<DetailRequest>;
      if (ce.detail) setReq(ce.detail);
    };
    window.addEventListener(EVENT, onOpen as EventListener);
    return () => window.removeEventListener(EVENT, onOpen as EventListener);
  }, []);

  useEffect(() => {
    if (!req) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setReq(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [req]);

  if (!req) return null;

  const dish = req.kind === "dish" ? dishById(req.id) : undefined;
  const drink = req.kind === "drink" ? drinkById(req.id) : undefined;
  if (!dish && !drink) return null;

  const close = () => setReq(null);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center"
      onClick={close}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-xl border border-amber-glow/25 bg-charcoal shadow-glow sm:rounded-xl"
        style={{ animation: "fadeIn 200ms ease-out" }}
      >
        <button
          type="button"
          aria-label={t("modal.close")}
          onClick={close}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-amber-glow/30 bg-charcoal/70 text-cream transition hover:text-amber-glow"
        >
          <X className="h-4 w-4" />
        </button>
        {dish ? <DishBody dish={dish} format={format} t={t} locale={locale} setReq={setReq} /> : null}
        {drink ? <DrinkBody drink={drink} format={format} t={t} locale={locale} setReq={setReq} /> : null}
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-[0.6rem] uppercase tracking-[0.4em] text-amber-glow/80">
      {children}
    </p>
  );
}

function DishBody({
  dish,
  format,
  t,
  locale,
  setReq,
}: {
  dish: Dish;
  format: (n: number) => string;
  t: ReturnType<typeof useI18n>["t"];
  locale: ReturnType<typeof useI18n>["locale"];
  setReq: (r: DetailRequest | null) => void;
}) {
  const origin = dishOrigin(dish.id);
  const { pairings } = pairForDish(dish);
  const otherDrinks = drinksPairedWithDish(dish.id, 2);
  const contains = ALLERGEN_KEYS.filter((k) => dish.allergens[k] === "contains");
  const trace = ALLERGEN_KEYS.filter((k) => dish.allergens[k] === "trace");
  const allergenLabels = ALLERGEN_LABELS_I18N[locale];

  return (
    <div className="space-y-7 px-6 py-8 md:px-9 md:py-10">
      <header className="pr-10">
        <p className="mb-3 text-[0.6rem] uppercase tracking-[0.4em] text-amber-glow/70">
          {t("modal.counter_label")} · {t(`counter.${dish.counter}.name`)}
        </p>
        <h2 className="font-display text-2xl font-light leading-tight text-cream md:text-3xl">
          {pickLocalized(dish.names, locale)}
        </h2>
        {locale !== "ja" && (
          <p className="mt-1 text-sm tracking-wide text-cream/55">{dish.names.ja}</p>
        )}
        <p className="mt-3 font-display text-lg text-amber-glow">{format(dish.price_cad)}</p>
      </header>

      {origin && (
        <section>
          <SectionLabel>{t("modal.origin_label")}</SectionLabel>
          <p className="text-sm leading-relaxed text-cream/80">
            {pickLocalized(origin, locale)}
          </p>
        </section>
      )}

      <section>
        <SectionLabel>{t("modal.description_label")}</SectionLabel>
        <p className="text-sm leading-relaxed text-cream/80">
          {pickLocalized(dish.descriptions, locale)}
        </p>
      </section>

      {(pairings.length > 0 || otherDrinks.length > 0) && (
        <section className="border-t border-border/50 pt-6">
          <SectionLabel>{t("modal.pairings_label")}</SectionLabel>
          {pairings.length > 0 && (
            <div className="mt-2">
              <p className="mb-2 text-[0.65rem] uppercase tracking-[0.3em] text-cream/55">
                {t("modal.sake_label")}
              </p>
              <ul className="space-y-2">
                {pairings.map((p) => (
                  <li key={p.sake.id}>
                    <SakeRow sake={p.sake} format={format} locale={locale} t={t} />
                  </li>
                ))}
              </ul>
            </div>
          )}
          {otherDrinks.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-[0.65rem] uppercase tracking-[0.3em] text-cream/55">
                {t("modal.other_drinks_label")}
              </p>
              <ul className="space-y-2">
                {otherDrinks.map((d) => (
                  <li key={d.id}>
                    <button
                      type="button"
                      onClick={() => setReq({ kind: "drink", id: d.id })}
                      className="block w-full text-left text-sm text-cream/85 transition hover:text-amber-glow"
                    >
                      <span className="text-cream">{pickLocalized(d.names, locale)}</span>
                      <span className="text-cream/50"> · {format(d.price_cad)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      <section className="border-t border-border/50 pt-6">
        <SectionLabel>{t("modal.allergens_label")}</SectionLabel>
        {contains.length === 0 && trace.length === 0 ? (
          <p className="text-sm text-cream/65">{t("modal.allergens_none")}</p>
        ) : (
          <div className="space-y-2 text-sm text-cream/80">
            {contains.length > 0 && (
              <p>
                <span className="text-cream/55">{t("modal.allergens_contains")}: </span>
                {contains.map((k) => allergenLabels[k as AllergenKey]).join(", ")}
              </p>
            )}
            {trace.length > 0 && (
              <p>
                <span className="text-cream/55">{t("modal.allergens_trace")}: </span>
                {trace.map((k) => allergenLabels[k as AllergenKey]).join(", ")}
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function SakeRow({
  sake,
  format,
  locale,
  t,
}: {
  sake: Sake;
  format: (n: number) => string;
  locale: ReturnType<typeof useI18n>["locale"];
  t: ReturnType<typeof useI18n>["t"];
}) {
  return (
    <div className="text-sm text-cream/85">
      <span className="text-cream">{pickLocalized(sake.names, locale)}</span>
      <span className="text-cream/50">
        {" "}
        · {t("modal.glass_label")} {format(sake.price_glass_cad)}
      </span>
    </div>
  );
}

function DrinkBody({
  drink,
  format,
  t,
  locale,
  setReq,
}: {
  drink: Drink;
  format: (n: number) => string;
  t: ReturnType<typeof useI18n>["t"];
  locale: ReturnType<typeof useI18n>["locale"];
  setReq: (r: DetailRequest | null) => void;
}) {
  return (
    <div className="space-y-7 px-6 py-8 md:px-9 md:py-10">
      <header className="pr-10">
        <p className="mb-3 text-[0.6rem] uppercase tracking-[0.4em] text-amber-glow/70">
          {t("modal.category_label")} · {t(`drinks.cat.${drink.category}`)}
        </p>
        <h2 className="font-display text-2xl font-light leading-tight text-cream md:text-3xl">
          {pickLocalized(drink.names, locale)}
        </h2>
        {locale !== "ja" && (
          <p className="mt-1 text-sm tracking-wide text-cream/55">{drink.names.ja}</p>
        )}
        <p className="mt-3 font-display text-lg text-amber-glow">{format(drink.price_cad)}</p>
      </header>

      <section>
        <SectionLabel>{t("modal.origin_label")}</SectionLabel>
        <p className="text-sm leading-relaxed text-cream/80">
          {pickLocalized(drink.origin, locale)}
        </p>
      </section>

      <section>
        <SectionLabel>{t("modal.flavor_label")}</SectionLabel>
        <p className="text-sm leading-relaxed text-cream/80">{drink.flavor}</p>
      </section>

      {drink.abv > 0 && (
        <section>
          <SectionLabel>{t("modal.abv_label")}</SectionLabel>
          <p className="text-sm text-cream/80">{drink.abv}%</p>
        </section>
      )}

      {drink.pairing_dishes.length > 0 && (
        <section className="border-t border-border/50 pt-6">
          <SectionLabel>{t("modal.best_with_label")}</SectionLabel>
          <ul className="space-y-2">
            {drink.pairing_dishes.slice(0, 3).map((id) => {
              const d = dishById(id);
              if (!d) return null;
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => setReq({ kind: "dish", id })}
                    className="block w-full text-left text-sm text-cream/85 transition hover:text-amber-glow"
                  >
                    <span className="text-cream">{pickLocalized(d.names, locale)}</span>
                    <span className="text-cream/50"> · {format(d.price_cad)}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}

// Suppress unused warnings for SAKE/DRINKS imports kept for future re-use
void SAKE;
void DRINKS;
void sakeById;

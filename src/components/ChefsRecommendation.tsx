import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ALLERGEN_KEYS,
  MENU,
  type AllergenKey,
  type Dish,
} from "@/data/menu";
import { pairForDish } from "@/lib/sake-pairing";
import type { Sake } from "@/data/sake";
import { useCurrency } from "@/lib/currency";
import { useI18n, pickLocalized, ALLERGEN_LABELS_I18N } from "@/lib/i18n";

type Vibe = "casual" | "sake" | "occasion" | "vegan";
type Budget = "open" | "60" | "90" | "120" | "any";

const VIBE_KEYS: { id: Vibe; labelKey: string; subKey: string }[] = [
  { id: "casual", labelKey: "cr.step2.casual", subKey: "cr.step2.casual_sub" },
  { id: "sake", labelKey: "cr.step2.sake_focused", subKey: "cr.step2.sake_focused_sub" },
  { id: "occasion", labelKey: "cr.step2.special", subKey: "cr.step2.special_sub" },
  { id: "vegan", labelKey: "cr.step2.vegan", subKey: "cr.step2.vegan_sub" },
];

const BUDGETS: { id: Budget; labelKey: string; cap: number | null }[] = [
  { id: "open", labelKey: "cr.step3.budget_open", cap: null },
  { id: "60", labelKey: "cr.step3.budget_60", cap: 60 },
  { id: "90", labelKey: "cr.step3.budget_90", cap: 90 },
  { id: "120", labelKey: "cr.step3.budget_120", cap: 120 },
  { id: "any", labelKey: "cr.step3.budget_any", cap: null },
];

type Course = { dish: Dish; reasonKey: string; reasonVars?: Record<string, string>; sake?: Sake };

function dishSafe(d: Dish, allergens: Set<AllergenKey>): boolean {
  for (const a of allergens) if (d.allergens[a] === "contains") return false;
  return true;
}

function reasonForDish(d: Dish): { key: string; vars?: Record<string, string> } {
  if (d.is_signature) return { key: "cr.reason.signature" };
  if (d.is_seasonal) return { key: "cr.reason.seasonal", vars: { s: d.is_seasonal } };
  if (d.is_dessert) return { key: "cr.reason.dessert" };
  if (d.counter === "donabe_sake") return { key: "cr.reason.donabe" };
  if (d.counter === "robata") return { key: "cr.reason.robata" };
  return { key: "cr.reason.sashimi" };
}

function buildCourse(
  vibe: Vibe,
  allergens: Set<AllergenKey>,
  budgetCap: number | null,
  partySize: number,
): { courses: Course[]; perPerson: number; total: number } {
  const safe = MENU.filter((d) => dishSafe(d, allergens));
  const within = (d: Dish) =>
    budgetCap == null || d.price_cad / Math.max(1, partySize === 1 ? 1 : 2) <= budgetCap;

  const pickFrom = (pool: Dish[], n: number, requireCounters?: Dish["counter"][]): Dish[] => {
    const chosen: Dish[] = [];
    const seen = new Set<string>();
    const push = (d?: Dish) => {
      if (!d || seen.has(d.id) || chosen.length >= n) return;
      chosen.push(d);
      seen.add(d.id);
    };
    pool.filter((d) => d.is_signature && within(d)).forEach((d) => push(d));
    for (const c of [...chosen]) {
      for (const id of c.balance_partners.mode_balance) {
        const d = pool.find((x) => x.id === id);
        if (d && within(d)) push(d);
      }
    }
    pool.filter((d) => within(d)).forEach((d) => push(d));
    if (requireCounters) {
      for (const ctr of requireCounters) {
        if (!chosen.some((d) => d.counter === ctr)) {
          const sub = pool.find((d) => d.counter === ctr && within(d));
          if (sub) {
            chosen.pop();
            chosen.push(sub);
          }
        }
      }
    }
    return chosen.slice(0, n);
  };

  let dishes: Dish[] = [];
  if (vibe === "vegan") {
    dishes = pickFrom(safe.filter((d) => d.is_vegan_capable), 4);
  } else if (vibe === "casual") {
    dishes = pickFrom(safe, 4);
    if (!dishes.some((d) => d.id === "dish-012" || d.id === "dish-016")) {
      const sub =
        safe.find((d) => d.id === "dish-012" && within(d)) ||
        safe.find((d) => d.id === "dish-016" && within(d));
      if (sub) {
        dishes.pop();
        dishes.push(sub);
      }
    }
  } else if (vibe === "sake") {
    dishes = pickFrom(safe, 5);
  } else {
    dishes = pickFrom(safe, 6, ["robata", "sashimi", "donabe_sake"]);
    const dessert = safe.find((d) => d.is_dessert && within(d));
    if (dessert && !dishes.some((d) => d.id === dessert.id)) {
      dishes.pop();
      dishes.push(dessert);
    }
  }

  const courses: Course[] = dishes.map((d) => {
    const r = reasonForDish(d);
    const c: Course = { dish: d, reasonKey: r.key, reasonVars: r.vars };
    if (vibe === "sake" && !d.is_dessert) {
      const p = pairForDish(d);
      if (p.pairings.length > 0) c.sake = p.pairings[0].sake;
    }
    return c;
  });

  const total = courses.reduce(
    (sum, c) => sum + c.dish.price_cad + (c.sake?.price_glass_cad ?? 0) * partySize,
    0,
  );
  const perPerson = Math.round(total / Math.max(1, partySize));
  return { courses, perPerson, total };
}

type Props = { onClose: () => void };
type Step = 1 | 2 | 3 | 4;

export function ChefsRecommendation({ onClose }: Props) {
  const { format } = useCurrency();
  const { t, locale } = useI18n();
  const allergenLabels = ALLERGEN_LABELS_I18N[locale];
  const [step, setStep] = useState<Step>(1);
  const [partySize, setPartySize] = useState(2);
  const [vibe, setVibe] = useState<Vibe>("casual");
  const [allergens, setAllergens] = useState<AllergenKey[]>([]);
  const [budget, setBudget] = useState<Budget>("open");

  const stepLabel = useMemo(() => {
    const stepName =
      step === 1
        ? t("cr.step1.name")
        : step === 2
          ? t("cr.step2.name")
          : step === 3
            ? t("cr.step3.name")
            : t("cr.step4.name");
    return t("oa.step_label", { n: step, step_name: stepName });
  }, [step, t]);

  const budgetCap = BUDGETS.find((b) => b.id === budget)?.cap ?? null;

  const result = useMemo(() => {
    if (step !== 4) return null;
    return buildCourse(vibe, new Set(allergens), budgetCap, partySize);
  }, [step, vibe, allergens, budgetCap, partySize]);

  const vibeLabel = t(VIBE_KEYS.find((v) => v.id === vibe)?.labelKey ?? "");

  const toggleAllergen = (a: AllergenKey) => {
    setAllergens((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center justify-between border-b border-cream/10 bg-background/80 px-4 py-2 backdrop-blur">
        <div className="text-[0.65rem] uppercase tracking-[0.2em] text-cream/50">{stepLabel}</div>
        <button
          onClick={onClose}
          className="text-[0.65rem] uppercase tracking-[0.18em] text-cream/40 hover:text-cream/80"
        >
          {t("oa.exit")}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {step === 1 && (
          <div className="space-y-4">
            <Bubble>{t("cr.step1.prompt")}</Bubble>
            <div className="flex flex-wrap gap-2 pl-9">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <button
                  key={n}
                  onClick={() => {
                    setPartySize(n);
                    setStep(2);
                  }}
                  className={`h-10 w-10 rounded-full border text-sm transition ${
                    partySize === n
                      ? "border-amber-glow bg-amber-glow text-background"
                      : "border-amber-glow/40 bg-amber-glow/5 text-cream hover:bg-amber-glow hover:text-background"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Bubble>{t("cr.step2.prompt")}</Bubble>
            <div className="space-y-2 pl-9">
              {VIBE_KEYS.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setVibe(v.id);
                    setStep(3);
                  }}
                  className={`w-full rounded-lg border px-3 py-2 text-left transition ${
                    vibe === v.id
                      ? "border-amber-glow bg-amber-glow/10"
                      : "border-cream/15 hover:border-amber-glow/60"
                  }`}
                >
                  <div className="text-sm text-cream">{t(v.labelKey)}</div>
                  <div className="text-[0.7rem] text-cream/50">{t(v.subKey)}</div>
                </button>
              ))}
            </div>
            <div className="flex justify-start pl-9">
              <button
                onClick={() => setStep(1)}
                className="text-[0.7rem] uppercase tracking-wider text-cream/50 hover:text-cream"
              >
                {t("cr.back")}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <Bubble>{t("cr.step3.prompt")}</Bubble>
            <div className="space-y-3 pl-9">
              <div>
                <div className="mb-1.5 text-[0.7rem] uppercase tracking-wider text-cream/50">
                  {t("cr.step3.allergens_label")}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setAllergens([])}
                    className={`rounded-full border px-3 py-1 text-xs transition ${
                      allergens.length === 0
                        ? "border-amber-glow bg-amber-glow text-background"
                        : "border-cream/20 text-cream/70 hover:border-amber-glow/60"
                    }`}
                  >
                    {t("oa.step2.none")}
                  </button>
                  {ALLERGEN_KEYS.map((a) => {
                    const active = allergens.includes(a);
                    return (
                      <button
                        key={a}
                        onClick={() => toggleAllergen(a)}
                        className={`rounded-full border px-3 py-1 text-xs transition ${
                          active
                            ? "border-amber-glow bg-amber-glow text-background"
                            : "border-amber-glow/40 bg-transparent text-cream/80 hover:border-amber-glow"
                        }`}
                      >
                        {allergenLabels[a]}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <div className="mb-1.5 text-[0.7rem] uppercase tracking-wider text-cream/50">
                  {t("cr.step3.budget_label")}
                </div>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value as Budget)}
                  className="w-full rounded-md border border-cream/15 bg-background px-3 py-2 text-sm text-cream focus:border-amber-glow/60 focus:outline-none"
                >
                  {BUDGETS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {t(b.labelKey)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 pl-9 pt-1">
              <button
                onClick={() => setStep(2)}
                className="text-[0.7rem] uppercase tracking-wider text-cream/50 hover:text-cream"
              >
                {t("cr.back")}
              </button>
              <button
                onClick={() => setStep(4)}
                className="rounded-full bg-amber-glow px-4 py-1.5 text-xs font-medium text-background transition hover:opacity-90"
              >
                {t("cr.step3.see_course")}
              </button>
            </div>
          </div>
        )}

        {step === 4 && result && (
          <div className="space-y-3">
            <Bubble>{t("cr.step4.heading", { n: partySize, vibe: vibeLabel })}</Bubble>
            <div className="space-y-2.5 pl-9">
              {result.courses.map(({ dish, reasonKey, reasonVars, sake }) => (
                <div
                  key={dish.id}
                  className="rounded-lg border border-amber-glow/30 bg-background/60 p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="text-sm text-cream">
                        {pickLocalized(dish.names, locale)}
                      </div>
                      {locale !== "ja" && (
                        <div className="text-[0.7rem] text-cream/40">{dish.names.ja}</div>
                      )}
                    </div>
                    <div className="text-sm text-cream/70">{format(dish.price_cad)}</div>
                  </div>
                  <div className="mt-1.5 text-[0.72rem] leading-relaxed text-cream/70">
                    {t(reasonKey, reasonVars)}
                  </div>
                  {sake && (
                    <div className="mt-2 border-t border-cream/10 pt-2 text-[0.7rem] text-cream/65">
                      {t("cr.paired_with", {
                        sake: sake.names.en,
                        price: format(sake.price_glass_cad),
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="ml-9 mt-2 rounded-lg border border-cream/10 bg-background/40 px-3 py-2 text-[0.72rem] text-cream/75">
              {t("cr.estimate", { total: format(result.total), per: format(result.perPerson) })}
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2 pl-9 pt-2">
              <button
                onClick={() => toast(t("cr.forward_toast"))}
                className="rounded-full border border-amber-glow/60 px-3 py-1.5 text-xs text-amber-glow transition hover:bg-amber-glow/10"
              >
                {t("cr.action.forward_kitchen")}
              </button>
              <button
                onClick={() => setStep(2)}
                className="rounded-full border border-cream/20 px-3 py-1.5 text-xs text-cream/70 transition hover:border-cream/50 hover:text-cream"
              >
                {t("cr.action.adjust")}
              </button>
              <button
                onClick={onClose}
                className="rounded-full bg-amber-glow px-4 py-1.5 text-xs font-medium text-background transition hover:opacity-90"
              >
                {t("cr.action.done")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Bubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-start gap-2">
      <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-amber-glow/40 bg-background font-display text-xs text-amber-glow">
        知
      </div>
      <div className="max-w-[78%] whitespace-pre-wrap rounded-2xl bg-amber-glow/10 px-3.5 py-2 text-sm leading-relaxed text-cream/90">
        {children}
      </div>
    </div>
  );
}

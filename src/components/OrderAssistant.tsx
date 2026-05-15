import { useMemo, useState } from "react";
import {
  ALLERGEN_KEYS,
  COUNTERS,
  MENU,
  dishById,
  type AllergenKey,
  type Dish,
  type Verdict,
} from "@/data/menu";
import { useCurrency } from "@/lib/currency";
import { useI18n, pickLocalized, ALLERGEN_LABELS_I18N } from "@/lib/i18n";

type Step = 1 | 2 | 3 | 4;

type Props = {
  onClose: () => void;
};

type DishVerdict = {
  dish: Dish;
  verdict: Verdict;
  details: { person: number; allergen: AllergenKey; level: "contains" | "trace" }[];
  alternatives: Dish[];
};

function partyAllergens(perPerson: AllergenKey[][]): Set<AllergenKey> {
  const s = new Set<AllergenKey>();
  perPerson.forEach((arr) => arr.forEach((a) => s.add(a)));
  return s;
}

function isDishSafeForParty(dish: Dish, perPerson: AllergenKey[][]): boolean {
  const all = partyAllergens(perPerson);
  for (const a of all) {
    const v = dish.allergens[a];
    if (v === "contains" || v === "trace") return false;
  }
  return true;
}

function computeVerdict(dish: Dish, perPerson: AllergenKey[][]): DishVerdict {
  const details: DishVerdict["details"] = [];
  let worst: Verdict = "safe";
  perPerson.forEach((list, idx) => {
    list.forEach((a) => {
      const v = dish.allergens[a];
      if (v === "contains") {
        details.push({ person: idx + 1, allergen: a, level: "contains" });
        worst = "contains";
      } else if (v === "trace") {
        details.push({ person: idx + 1, allergen: a, level: "trace" });
        if (worst !== "contains") worst = "trace";
      }
    });
  });

  let alternatives: Dish[] = [];
  if (worst !== "safe") {
    const partnerIds = [
      ...dish.balance_partners.mode_balance,
      ...dish.balance_partners.mode_echo,
    ];
    const seen = new Set<string>();
    for (const id of partnerIds) {
      const d = dishById(id);
      if (d && !seen.has(d.id) && isDishSafeForParty(d, perPerson)) {
        alternatives.push(d);
        seen.add(d.id);
        if (alternatives.length >= 2) break;
      }
    }
    if (alternatives.length === 0) {
      for (const d of MENU) {
        if (d.id === dish.id) continue;
        if (isDishSafeForParty(d, perPerson)) {
          alternatives.push(d);
          if (alternatives.length >= 2) break;
        }
      }
    }
  }

  return { dish, verdict: worst, details, alternatives };
}

export function OrderAssistant({ onClose }: Props) {
  const { format } = useCurrency();
  const { t, locale } = useI18n();
  const allergenLabels = ALLERGEN_LABELS_I18N[locale];
  const [step, setStep] = useState<Step>(1);
  const [partySize, setPartySize] = useState(0);
  const [currentPerson, setCurrentPerson] = useState(0); // 0-indexed
  const [allergensPerPerson, setAllergensPerPerson] = useState<AllergenKey[][]>([]);
  const [counterTab, setCounterTab] = useState<"all" | Dish["counter"]>("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [forwarded, setForwarded] = useState(false);

  const stepLabel = useMemo(() => {
    const stepName =
      step === 1
        ? t("oa.step1.name")
        : step === 2
          ? t("oa.step2.name")
          : step === 3
            ? t("oa.step3.name")
            : t("oa.step4.name");
    return t("oa.step_label", { n: step, step_name: stepName });
  }, [step, t]);

  const choosePartySize = (n: number) => {
    setPartySize(n);
    setAllergensPerPerson(Array.from({ length: n }, () => []));
    setCurrentPerson(0);
    setStep(2);
  };

  const toggleAllergen = (a: AllergenKey) => {
    setAllergensPerPerson((prev) => {
      const next = prev.map((x) => [...x]);
      const arr = next[currentPerson];
      const i = arr.indexOf(a);
      if (i >= 0) arr.splice(i, 1);
      else arr.push(a);
      return next;
    });
  };

  const clearCurrent = () => {
    setAllergensPerPerson((prev) => {
      const next = prev.map((x) => [...x]);
      next[currentPerson] = [];
      return next;
    });
    advancePerson();
  };

  const advancePerson = () => {
    if (currentPerson + 1 < partySize) {
      setCurrentPerson(currentPerson + 1);
    } else {
      setStep(3);
    }
  };

  const goBackPerson = () => {
    if (currentPerson === 0) {
      setStep(1);
    } else {
      setCurrentPerson(currentPerson - 1);
    }
  };

  const filteredMenu = useMemo(
    () => (counterTab === "all" ? MENU : MENU.filter((d) => d.counter === counterTab)),
    [counterTab],
  );

  const verdicts = useMemo(() => {
    if (step !== 4) return [];
    return selected
      .map((id) => dishById(id))
      .filter((d): d is Dish => !!d)
      .map((d) => computeVerdict(d, allergensPerPerson));
  }, [step, selected, allergensPerPerson]);

  const goBack = () => {
    if (step === 1) onClose();
    else if (step === 2) goBackPerson();
    else if (step === 3) setStep(2);
    else if (step === 4) setStep(3);
  };

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      {/* Step indicator */}
      <div className="flex items-center justify-between border-b border-cream/10 bg-background/80 px-4 py-2 backdrop-blur">
        <div className="text-[0.65rem] uppercase tracking-[0.2em] text-cream/50">
          {stepLabel}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="text-[0.65rem] uppercase tracking-[0.18em] text-amber-glow hover:text-amber-glow/80"
          >
            {t("flow.back")}
          </button>
          <button
            onClick={onClose}
            className="text-[0.65rem] uppercase tracking-[0.18em] text-amber-glow hover:text-amber-glow/80"
          >
            {t("flow.exit")}
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 pt-4">
        {step === 1 && (
          <div className="space-y-4">
            <AssistantBubble>{t("oa.step1.prompt")}</AssistantBubble>
            <div className="flex flex-wrap gap-2 pl-9">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <button
                  key={n}
                  onClick={() => choosePartySize(n)}
                  className="h-10 w-10 rounded-full border border-amber-glow/40 bg-amber-glow/5 text-sm text-cream transition hover:bg-amber-glow hover:text-background"
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <AssistantBubble>
              {t("oa.step2.prompt", { n: currentPerson + 1 })}
            </AssistantBubble>
            <div className="flex flex-wrap gap-2 pl-9">
              {ALLERGEN_KEYS.map((a) => {
                const active = allergensPerPerson[currentPerson]?.includes(a);
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
            <div className="flex flex-wrap items-center justify-between gap-2 pl-9 pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={goBackPerson}
                  className="rounded-full border border-amber-glow/50 px-3 py-1.5 text-xs text-amber-glow transition hover:bg-amber-glow/10"
                >
                  {t("oa.step2.back")}
                </button>
                <button
                  onClick={clearCurrent}
                  className="rounded-full border border-cream/20 px-3 py-1.5 text-xs text-cream/70 transition hover:border-cream/50 hover:text-cream"
                >
                  {t("oa.step2.none")}
                </button>
              </div>
              <button
                onClick={advancePerson}
                className="rounded-full bg-amber-glow px-4 py-1.5 text-xs font-medium text-background transition hover:opacity-90"
              >
                {currentPerson + 1 < partySize
                  ? t("oa.step2.next_person")
                  : t("oa.step2.see_dishes")}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <AssistantBubble>{t("oa.step3.prompt")}</AssistantBubble>
            <div className="flex flex-wrap gap-1.5 pl-9">
              {(
                [
                  { id: "all", label: t("oa.step3.tab_all") },
                  ...COUNTERS.map((c) => ({
                    id: c.id,
                    label: t(`counter.${c.id}.name`),
                  })),
                ] as { id: typeof counterTab; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCounterTab(tab.id)}
                  className={`rounded-full border px-3 py-1 text-[0.7rem] uppercase tracking-wider transition ${
                    counterTab === tab.id
                      ? "border-amber-glow bg-amber-glow text-background"
                      : "border-cream/20 text-cream/70 hover:border-amber-glow/60"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="space-y-1.5 pl-9 pt-2">
              {filteredMenu.map((d) => {
                const checked = selected.includes(d.id);
                return (
                  <label
                    key={d.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2 transition ${
                      checked
                        ? "border-amber-glow/60 bg-amber-glow/10"
                        : "border-cream/10 hover:border-cream/25"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setSelected((prev) =>
                          prev.includes(d.id)
                            ? prev.filter((x) => x !== d.id)
                            : [...prev, d.id],
                        )
                      }
                      className="mt-1 h-4 w-4 accent-amber-glow"
                    />
                    <div className="flex-1">
                      <span className="text-sm text-cream">
                        {pickLocalized(d.names, locale)}
                      </span>
                      {locale !== "ja" && (
                        <div className="text-[0.7rem] text-cream/40">{d.names.ja}</div>
                      )}
                    </div>
                    <div className="text-sm text-cream/70">{format(d.price_cad)}</div>
                  </label>
                );
              })}
            </div>
            <div className="flex justify-end pl-9 pt-2">
              <button
                disabled={selected.length === 0}
                onClick={() => setStep(4)}
                className="rounded-full bg-amber-glow px-4 py-1.5 text-xs font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
              >
                {t("oa.step3.check_allergens")}
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-3">
            <AssistantBubble>{t("oa.step4.intro")}</AssistantBubble>
            <div className="space-y-2.5 pl-9">
              {verdicts.map(({ dish, verdict, details, alternatives }) => {
                const cfg =
                  verdict === "safe"
                    ? {
                        dot: "bg-emerald-400",
                        border: "border-emerald-400/40",
                        label: t("oa.verdict.safe"),
                        text: "text-emerald-300",
                      }
                    : verdict === "trace"
                      ? {
                          dot: "bg-amber-glow",
                          border: "border-amber-glow/50",
                          label: t("oa.verdict.trace"),
                          text: "text-amber-glow",
                        }
                      : {
                          dot: "bg-red-400",
                          border: "border-red-400/50",
                          label: t("oa.verdict.contains"),
                          text: "text-red-300",
                        };

                const byPerson = new Map<
                  number,
                  { allergen: AllergenKey; level: "contains" | "trace" }[]
                >();
                details.forEach((d) => {
                  if (!byPerson.has(d.person)) byPerson.set(d.person, []);
                  byPerson.get(d.person)!.push({ allergen: d.allergen, level: d.level });
                });

                return (
                  <div
                    key={dish.id}
                    className={`rounded-lg border ${cfg.border} bg-background/60 p-3`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="text-sm text-cream">
                          {pickLocalized(dish.names, locale)}
                        </div>
                      </div>
                      <div className="text-sm text-cream/60">{format(dish.price_cad)}</div>
                    </div>
                    <div className={`mt-1.5 flex items-center gap-2 text-xs ${cfg.text}`}>
                      <span className={`inline-block h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </div>
                    {byPerson.size > 0 && (
                      <ul className="mt-2 space-y-0.5 text-[0.7rem] text-cream/60">
                        {[...byPerson.entries()].map(([p, items]) => (
                          <li key={p}>
                            {t("oa.person_label", { n: p })}:{" "}
                            {items
                              .map(
                                (i) => `${allergenLabels[i.allergen]} (${i.level})`,
                              )
                              .join(", ")}
                          </li>
                        ))}
                      </ul>
                    )}
                    {alternatives.length > 0 && (
                      <div className="mt-2 border-t border-cream/10 pt-2 text-[0.7rem] text-cream/70">
                        {alternatives.map((alt) => (
                          <div key={alt.id}>
                            {t("oa.verdict.consider", {
                              dish: pickLocalized(alt.names, locale),
                              price: format(alt.price_cad),
                            })}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2 pl-9 pt-2">
              <button
                onClick={() => setStep(3)}
                className="rounded-full border border-cream/20 px-3 py-1.5 text-xs text-cream/70 transition hover:border-cream/50 hover:text-cream"
              >
                {t("oa.action.adjust")}
              </button>
              <button
                onClick={() => {
                  setForwarded(true);
                  setTimeout(() => setForwarded(false), 4000);
                }}
                className="rounded-full border border-amber-glow/60 px-3 py-1.5 text-xs text-amber-glow transition hover:bg-amber-glow/10"
              >
                {t("oa.action.forward")}
              </button>
              <button
                onClick={onClose}
                className="rounded-full bg-amber-glow px-4 py-1.5 text-xs font-medium text-background transition hover:opacity-90"
              >
                {t("oa.action.done")}
              </button>
            </div>
            {forwarded && (
              <div className="ml-9 mt-2 rounded-lg border border-amber-glow/40 bg-amber-glow/10 px-3 py-2 text-[0.72rem] text-cream/85">
                {t("oa.forward_toast")}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function AssistantBubble({ children }: { children: React.ReactNode }) {
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

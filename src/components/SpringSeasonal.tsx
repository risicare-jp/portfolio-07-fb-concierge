import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCurrency } from "@/lib/currency";
import { useI18n, pickLocalized } from "@/lib/i18n";
import { dishById, type Dish } from "@/data/menu";

type SlideDef = {
  dishId: string;
  // When JP uploads the real images at /src/assets/seasonal/*, set `image` to the
  // imported asset (e.g. import img from "@/assets/seasonal/spring-002-vegetables.jpg")
  // and the carousel will use it automatically. Until then it falls back to a styled
  // gradient placeholder.
  image?: string;
};

const SLIDES: SlideDef[] = [
  { dishId: "dish-002" },
  { dishId: "dish-009" },
  { dishId: "dish-014" },
];

const AUTO_MS = 6000;

export function SpringSeasonal() {
  const { t, locale } = useI18n();
  const { format } = useCurrency();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);

  const slides = SLIDES.map((s) => ({ ...s, dish: dishById(s.dishId) })).filter(
    (s): s is SlideDef & { dish: Dish } => !!s.dish,
  );
  const count = slides.length;

  useEffect(() => {
    if (paused || count < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [paused, count]);

  const go = (i: number) => setIndex(((i % count) + count) % count);

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
    setPaused(true);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
    touchX.current = null;
    setTimeout(() => setPaused(false), 1500);
  };

  return (
    <section
      id="spring-seasonal"
      className="bg-gradient-warm px-6 py-32 md:px-12 md:py-44"
    >
      <div className="mx-auto max-w-6xl">
        <p className="mb-6 text-[0.65rem] uppercase tracking-[0.45em] text-amber-glow">
          {t("spring.section_label")}
        </p>
        <h2 className="mb-12 max-w-3xl font-display text-4xl font-light leading-[1.05] text-cream md:text-6xl">
          {t("spring.heading")}
        </h2>

        <div
          className="relative overflow-hidden border border-amber-glow/20"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="relative aspect-[16/9] w-full bg-charcoal">
            {slides.map((s, i) => {
              const active = i === index;
              const dish = s.dish;
              return (
                <div
                  key={s.dishId}
                  aria-hidden={!active}
                  className={`absolute inset-0 transition-opacity duration-[600ms] ease-in-out ${
                    active ? "opacity-100" : "pointer-events-none opacity-0"
                  }`}
                >
                  {s.image ? (
                    <img
                      src={s.image}
                      alt={pickLocalized(dish.names, locale)}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center"
                      style={{
                        backgroundImage:
                          "linear-gradient(135deg, hsl(28 50% 20%) 0%, hsl(20 60% 12%) 50%, hsl(0 0% 6%) 100%)",
                      }}
                    >
                      <p className="font-display text-2xl font-light text-cream md:text-4xl">
                        {pickLocalized(dish.names, locale)}
                      </p>
                      <p className="mt-6 text-[0.65rem] uppercase tracking-[0.4em] text-cream/40">
                        {t("spring.image_coming_soon")}
                      </p>
                    </div>
                  )}
                  {/* Bottom gradient + overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent px-6 pb-6 pt-20 md:px-10 md:pb-10">
                    <div className="flex items-end justify-between gap-6">
                      <div className="flex-1 text-cream">
                        <p className="font-display text-lg font-light leading-snug md:text-2xl">
                          {pickLocalized(dish.names, locale)}
                        </p>
                        {locale !== "ja" && (
                          <p className="mt-1 text-[0.7rem] tracking-wide text-cream/55">
                            {dish.names.ja}
                          </p>
                        )}
                        <p className="mt-3 max-w-xl text-xs leading-relaxed text-cream/75 md:text-sm">
                          {pickLocalized(dish.descriptions, locale)}
                        </p>
                      </div>
                      <span className="font-display text-base text-amber-glow md:text-xl">
                        {format(dish.price_cad)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Prev / Next */}
          <button
            type="button"
            aria-label={t("spring.prev")}
            onClick={() => go(index - 1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-amber-glow/40 bg-charcoal/40 p-2 text-amber-glow opacity-0 backdrop-blur transition group-hover:opacity-100 hover:bg-charcoal/70 md:opacity-0 md:hover:opacity-100"
            style={{ opacity: undefined }}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label={t("spring.next")}
            onClick={() => go(index + 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-amber-glow/40 bg-charcoal/40 p-2 text-amber-glow backdrop-blur transition hover:bg-charcoal/70"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dots */}
          <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Slide ${i + 1}`}
                onClick={() => go(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index
                    ? "w-6 bg-amber-glow"
                    : "w-1.5 border border-amber-glow/60 bg-transparent"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

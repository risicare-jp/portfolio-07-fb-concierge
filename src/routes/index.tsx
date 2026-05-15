import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink, MessageCircle, Menu as MenuIcon, X as XIcon, Instagram, Facebook } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import heroImg from "@/assets/hero-izakaya.jpg";
import robataImg from "@/assets/robata.jpg";
import roomCounterImg from "@/assets/room-counter.jpeg";
import roomPrivateImg from "@/assets/room-private.jpeg";
import interiorImg from "@/assets/reserve/interior-dining.jpg";
import { ReservationWidget } from "@/components/ReservationWidget";
import { SpringSeasonal } from "@/components/SpringSeasonal";
import { DetailModal, openDetail } from "@/components/DetailModal";
import { useCurrency } from "@/lib/currency";
import { useI18n, pickLocalized, LOCALES, type Locale } from "@/lib/i18n";
import { dishById, type Dish } from "@/data/menu";
import { drinkById, type Drink } from "@/data/drinks";
import { sakeById } from "@/data/sake";

const openConcierge = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("hinokami:open-concierge"));
  }
};

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "HINOKAMI Toronto — A modern izakaya, opening Spring 2026" },
      {
        name: "description",
        content:
          "From Vancouver to Toronto. HINOKAMI brings its acclaimed izakaya — robata grill, sushi counter, and rare sake — to King West. Reservations open Spring 2026.",
      },
      { property: "og:title", content: "HINOKAMI Toronto — A modern izakaya, opening Spring 2026" },
      { property: "og:site_name", content: "HINOKAMI Toronto" },
      { property: "og:description", content: "Vancouver's beloved izakaya arrives in Toronto." },
      { property: "og:image", content: heroImg },
    ],
  }),
});

const LOCALE_LABELS: Record<Locale, string> = { en: "EN", ja: "日本語", cn: "中文" };

function LocaleDropdown({
  locale,
  setLocale,
  className = "",
}: {
  locale: Locale;
  setLocale: (l: Locale) => void;
  className?: string;
}) {
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
        className="flex items-center gap-1 text-[0.65rem] uppercase tracking-[0.25em] text-cream/60 transition hover:text-amber-glow md:text-xs"
      >
        {LOCALE_LABELS[locale]} <span aria-hidden>▾</span>
      </button>
      {open && (
        <ul className="absolute right-0 top-full z-50 mt-2 min-w-[6rem] rounded-sm border border-amber-glow/30 bg-charcoal/95 py-1 text-[0.7rem] uppercase tracking-[0.25em] shadow-glow backdrop-blur">
          {LOCALES.map((l) => (
            <li key={l}>
              <button
                type="button"
                onClick={() => { setLocale(l); setOpen(false); }}
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
  );
}

function XMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M18.244 2H21l-6.52 7.45L22 22h-6.81l-4.77-6.24L4.8 22H2.04l6.97-7.96L2 2h6.94l4.31 5.7L18.244 2Zm-2.39 18h1.88L8.23 4H6.27l9.584 16Z" />
    </svg>
  );
}

function SocialIcons({ size = "h-5 w-5", gap = "gap-6" }: { size?: string; gap?: string }) {
  const { t } = useI18n();
  const cls = `text-amber-glow transition-transform hover:scale-110 hover:brightness-125`;
  return (
    <div className={`flex items-center ${gap}`}>
      <a href="#" aria-label={t("nav.social_instagram")} className={cls}><Instagram className={size} /></a>
      <a href="#" aria-label={t("nav.social_facebook")} className={cls}><Facebook className={size} /></a>
      <a href="#" aria-label={t("nav.social_x")} className={cls}><XMark className={size} /></a>
    </div>
  );
}

export function Nav() {
  const { locale, setLocale, t } = useI18n();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setDrawerOpen(false); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  const drawerLinks: Array<{ href: string; label: string; route?: string }> = [
    { href: "#story", label: t("nav.story").toUpperCase() },
    { href: "#menu", label: t("nav.menu").toUpperCase() },
    { href: "#room", label: t("nav.room").toUpperCase() },
    { href: "#visit", label: t("nav.visit").toUpperCase() },
    { href: "/gallery", label: t("nav.gallery").toUpperCase(), route: "/gallery" },
    { href: "#reserve", label: t("nav.reserve").toUpperCase() },
  ];

  return (
    <>
      <nav className="fixed top-0 z-[100] w-full border-b border-white/[0.08] bg-charcoal/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-4 md:gap-4 md:px-8 md:py-6">
          <a
            href="#top"
            className="flex shrink-0 flex-col items-start font-display text-cream"
            style={{ maxWidth: "200px" }}
          >
            <span className="whitespace-nowrap text-[18px] leading-[1.1] tracking-[0.05em] md:text-[20px]">
              鎮座ヒノカミ
            </span>
            <span className="mt-[2px] hidden whitespace-nowrap text-[10px] uppercase leading-[1.1] tracking-[0.25em] text-cream/70 md:inline-block md:text-[11px]">
              HINOKAMI
            </span>
          </a>
          <div className="flex items-center gap-3 md:gap-4">
            <LocaleDropdown locale={locale} setLocale={setLocale} />
            <a
              href="#reserve"
              className="shrink-0 whitespace-nowrap rounded-none border border-amber-glow/60 px-3 py-2 text-[0.6rem] uppercase tracking-[0.25em] text-amber-glow transition hover:bg-amber-glow hover:text-charcoal md:px-5 md:py-2.5 md:text-xs"
            >
              {t("nav.reserve")}
            </a>
            <button
              type="button"
              aria-label={t("nav.open_menu")}
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(true)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-amber-glow/40 text-cream transition hover:text-amber-glow"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      {drawerOpen && (
        <>
          <button
            type="button"
            aria-label={t("nav.close_menu")}
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          />
          <aside
            className="fixed right-0 top-0 z-[120] flex h-full w-full flex-col border-l border-amber-glow/20 bg-charcoal/95 backdrop-blur-xl shadow-2xl animate-in slide-in-from-right duration-300 sm:w-[320px]"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex justify-end p-4">
              <button
                type="button"
                aria-label={t("nav.close_menu")}
                onClick={() => setDrawerOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-sm text-cream/80 transition hover:text-amber-glow"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-8 px-8 pt-4">
              {drawerLinks.map((l) =>
                l.route ? (
                  <Link
                    key={l.href}
                    to={l.route}
                    onClick={() => setDrawerOpen(false)}
                    className="font-display text-2xl tracking-[0.15em] text-amber-glow transition hover:text-cream"
                  >
                    {l.label}
                  </Link>
                ) : (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setDrawerOpen(false)}
                    className="font-display text-2xl tracking-[0.15em] text-amber-glow transition hover:text-cream"
                  >
                    {l.label}
                  </a>
                ),
              )}
            </nav>
            <div className="px-6 pb-8">
              <div className="mx-auto mb-6 h-px w-full bg-amber-glow/40" />
              <div className="flex justify-center">
                <SocialIcons size="h-6 w-6" gap="gap-8" />
              </div>
              <p className="mt-6 text-center text-[0.65rem] italic tracking-[0.2em] text-cream/50">
                {t("nav.drawer_caption")}
              </p>
            </div>
          </aside>
        </>
      )}
    </>
  );
}

function Hero() {
  const { t } = useI18n();
  return (
    <section id="top" className="vignette relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      <img
        src={heroImg}
        alt="Intimate izakaya counter glowing with amber lantern light"
        width={1920}
        height={1280}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/20 to-charcoal" />

      <div className="relative z-10 flex h-full flex-col items-center justify-end pb-20 text-center md:pb-28">
        <p className="animate-fade-up mb-6 text-[0.65rem] uppercase tracking-[0.5em] text-amber-glow md:text-xs">
          {t("hero.subhead")}
        </p>
        <h1
          className="animate-fade-up font-display text-[clamp(3rem,10vw,8.5rem)] font-light leading-[0.95] text-cream"
          style={{ animationDelay: "0.15s" }}
        >
          {t("hero.wordmark")}
        </h1>
        <div
          className="animate-fade-up mt-6 flex items-center gap-4 text-[0.7rem] uppercase tracking-[0.45em] text-cream/70"
          style={{ animationDelay: "0.3s" }}
        >
          <span className="h-px w-10 bg-amber-glow/60" />
          <span>{t("hero.brand_line")}</span>
          <span className="h-px w-10 bg-amber-glow/60" />
        </div>
        <p
          className="animate-fade-up mt-10 max-w-md px-6 text-balance text-base font-light leading-relaxed text-cream/80 md:text-lg"
          style={{ animationDelay: "0.45s" }}
        >
          {t("hero.tagline")}
        </p>
        <button
          type="button"
          onClick={openConcierge}
          className="animate-fade-up mt-6 inline-flex items-center gap-2 text-[0.75rem] uppercase tracking-[0.3em] text-amber-glow transition hover:text-cream"
          style={{ animationDelay: "0.6s" }}
        >
          <MessageCircle className="h-3.5 w-3.5" />
          {t("hero.try_concierge")}
        </button>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-[0.6rem] uppercase tracking-[0.4em] text-cream/50">
        {t("hero.scroll")}
      </div>
    </section>
  );
}

function Story() {
  const { t } = useI18n();
  return (
    <section id="story" className="bg-gradient-warm px-6 py-32 md:px-12 md:py-48">
      <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-12 md:gap-20">
        <div className="md:col-span-5">
          <p className="mb-8 text-[0.65rem] uppercase tracking-[0.45em] text-amber-glow">
            {t("story.section_label")}
          </p>
          <h2 className="font-display text-4xl font-light leading-[1.05] text-cream md:text-6xl">
            {t("story.heading_line1")}
            <em className="block italic text-amber-glow/90">{t("story.heading_line2")}</em>
          </h2>
        </div>
        <div className="space-y-6 text-base leading-relaxed text-cream/75 md:col-span-6 md:col-start-7 md:text-lg">
          <p>{t("story.body1")}</p>
          <p>{t("story.body2")}</p>
          <div className="hairline mt-12 w-24" />
          <p className="font-display text-xl italic text-cream/90 md:text-2xl">
            {t("story.quote")}
          </p>
          <p className="text-xs uppercase tracking-[0.3em] text-cream/50">
            {t("story.quote_attribution")}
          </p>
        </div>
      </div>
    </section>
  );
}

type CounterKey = "robata" | "sashimi" | "donabe";

type CounterDef = {
  num: string;
  key: CounterKey;
  dishIds: string[];
};

const COUNTERS_HOME: CounterDef[] = [
  { num: "i", key: "robata", dishIds: ["dish-001", "dish-003"] },
  { num: "ii", key: "sashimi", dishIds: ["dish-007", "dish-008"] },
  { num: "iii", key: "donabe", dishIds: ["dish-012", "dish-013"] },
];

const FEATURED_DRINK_IDS = [
  "sake-005",
  "beer-003",
  "highball-001",
  "wine-002",
  "soft-002",
];

function Menu() {
  const { format } = useCurrency();
  const { t, locale } = useI18n();
  const featuredDrinks = FEATURED_DRINK_IDS.map((id) => {
    if (id.startsWith("sake-")) {
      const s = sakeById(id);
      if (!s) return null;
      const drink: Drink = {
        id: s.id,
        category: "sake",
        names: s.names,
        origin: {
          en: `${s.prefecture_en}, Japan — ${s.brewery}`,
          ja: `${s.prefecture_ja}、日本 — ${s.brewery}`,
          cn: `${s.prefecture_ja}，日本 — ${s.brewery}`,
        },
        abv: s.abv,
        flavor: s.flavor,
        price_cad: s.price_glass_cad,
        pairing_dishes: [],
        is_featured: true,
      };
      return drink;
    }
    return drinkById(id) ?? null;
  }).filter((d): d is Drink => !!d);

  return (
    <section id="menu" className="bg-charcoal px-6 py-32 md:px-12 md:py-48">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col items-start justify-between gap-6 md:mb-20 md:flex-row md:items-end">
          <div>
            <p className="mb-6 text-[0.65rem] uppercase tracking-[0.45em] text-amber-glow">
              {t("menu.section_label")}
            </p>
            <h2 className="max-w-2xl font-display text-4xl font-light leading-[1.05] text-cream md:text-6xl">
              {t("menu.heading_line1")} <em className="italic text-amber-glow/90">{t("menu.heading_line2")}</em>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-cream/60">
            {t("menu.intro")}
          </p>
        </div>

        {/* Seasonal carousel — visual hook for the menu */}
        <div className="mb-24 md:mb-32">
          <SpringSeasonal embedded />
        </div>

        <div className="space-y-24 md:space-y-32">
          {COUNTERS_HOME.map((c) => {
            const dishes = c.dishIds
              .map((id) => dishById(id))
              .filter((d): d is Dish => !!d);
            return (
              <div key={c.key}>
                <div className="mb-10 flex flex-col gap-4 md:mb-12">
                  <div className="flex items-baseline gap-5">
                    <span className="font-display text-sm uppercase tracking-[0.4em] text-amber-glow/70">
                      {c.num}
                    </span>
                    <h3 className="font-display text-3xl font-light text-cream md:text-5xl">
                      {t(`counter.${c.key}.name`)}
                    </h3>
                  </div>
                  <p className="max-w-2xl text-sm leading-relaxed text-cream/65 md:text-base">
                    {t(`counter.${c.key}.tagline`)}
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 md:gap-8">
                  {dishes.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => openDetail({ kind: "dish", id: d.id })}
                      className="group block w-full text-left border border-border/60 bg-card/40 p-8 transition duration-500 hover:border-amber-glow/50 md:p-10"
                    >
                      <div className="flex items-start justify-between gap-6">
                        <div className="flex-1">
                          <h4 className="font-display text-2xl font-light text-cream group-hover:text-amber-glow md:text-3xl">
                            {pickLocalized(d.names, locale)}
                          </h4>
                          {locale !== "ja" && (
                            <p className="mt-1 text-xs tracking-wide text-cream/45">{d.names.ja}</p>
                          )}
                        </div>
                        <span className="font-display text-base text-amber-glow md:text-lg">
                          {format(d.price_cad)}
                        </span>
                      </div>
                      <p className="mt-5 text-sm leading-relaxed text-cream/70">
                        {pickLocalized(d.descriptions, locale)}
                      </p>
                    </button>
                  ))}
                </div>

                <div className="mt-8">
                  <Link
                    to="/menu"
                    search={{ counter: c.key }}
                    className="text-[0.7rem] uppercase tracking-[0.3em] text-amber-glow/80 transition hover:text-cream"
                  >
                    {t(`menu.view_${c.key}`)}
                  </Link>
                </div>
              </div>
            );
          })}

          {/* IV — Drinks */}
          <div>
            <div className="mb-10 flex flex-col gap-4 md:mb-12">
              <div className="flex items-baseline gap-5">
                <span className="font-display text-sm uppercase tracking-[0.4em] text-amber-glow/70">
                  iv
                </span>
                <h3 className="font-display text-3xl font-light text-cream md:text-5xl">
                  {t("counter.drinks.name")}
                </h3>
              </div>
              <p className="max-w-2xl text-sm leading-relaxed text-cream/65 md:text-base">
                {t("counter.drinks.tagline")}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {featuredDrinks.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => openDetail({ kind: "drink", id: d.id })}
                  className="group block w-full text-left border border-border/60 bg-card/40 p-6 transition duration-500 hover:border-amber-glow/50"
                >
                  <p className="text-[0.6rem] uppercase tracking-[0.35em] text-amber-glow/70">
                    {t(`drinks.cat.${d.category}`)}
                  </p>
                  <div className="mt-3 flex items-start justify-between gap-4">
                    <h4 className="flex-1 font-display text-lg font-light text-cream group-hover:text-amber-glow md:text-xl">
                      {pickLocalized(d.names, locale)}
                    </h4>
                    <span className="font-display text-sm text-amber-glow md:text-base">
                      {format(d.price_cad)}
                    </span>
                  </div>
                  {locale !== "ja" && (
                    <p className="mt-1 text-[11px] tracking-wide text-cream/45">{d.names.ja}</p>
                  )}
                  <p className="mt-3 text-xs leading-relaxed text-cream/65">{d.flavor}</p>
                </button>
              ))}
            </div>

            <div className="mt-8">
              <Link
                to="/menu"
                search={{ counter: "drinks" }}
                className="text-[0.7rem] uppercase tracking-[0.3em] text-amber-glow/80 transition hover:text-cream"
              >
                {t("menu.view_drinks")}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 md:mt-20">
          <Link
            to="/menu"
            className="text-[0.7rem] uppercase tracking-[0.35em] text-amber-glow transition hover:text-cream"
          >
            {t("menu.view_full")}
          </Link>
        </div>
      </div>
    </section>
  );
}

type RoomSpaceKey = "counter" | "private";

const ROOM_SPACE_CONTENT: Record<
  RoomSpaceKey,
  {
    heading: Record<Locale, string>;
    body: Record<Locale, string>;
    image: string;
    alt: Record<Locale, string>;
  }
> = {
  counter: {
    heading: {
      en: "12-seat Counter",
      ja: "12 席カウンター",
      cn: "12 座吧台",
    },
    body: {
      en: "Twelve counter seats facing the open robata. The straw flame, the chef's hands, the chū-toro arriving on a single palm. Books first; the rest of the room waits.",
      ja: "オープン焚き火を真正面に見据える 12 席カウンター。わらの炎、職人の手、片手で運ばれてくる中トロ。最初に埋まる席です。",
      cn: "面对开放式焚火炉的 12 个吧台座位。稻草烈焰、厨师之手、单手送上的中腹。最先订满的位置。",
    },
    image: roomCounterImg,
    alt: {
      en: "Counter seats facing the open robata grill with flames and a chef at work",
      ja: "オープン焚き火を望むカウンター席と職人",
      cn: "面对开放式焚火炉的吧台座位与厨师",
    },
  },
  private: {
    heading: {
      en: "8-seat Private Tatami Room",
      ja: "8 人用個室の畳の間",
      cn: "8 人私人榻榻米房间",
    },
    body: {
      en: "An eight-seat private tatami room behind sliding shoji doors. A low table, a single hanging lantern, the same fire just on the other side of the wall. For your most important nights.",
      ja: "障子の引き戸の向こうにある 8 人用個室の畳の間。低い座卓、一灯の提灯、壁の向こうには同じ炎。一番大切な夜のために。",
      cn: "障子滑门后的 8 人私人榻榻米房间。一张矮桌、一盏提灯，墙的另一侧仍是那炉火。为您最重要的夜晚。",
    },
    image: roomPrivateImg,
    alt: {
      en: "Private tatami room with shoji sliding doors, low wooden table and a paper lantern",
      ja: "障子の引き戸、低い座卓と提灯のある畳の個室",
      cn: "带障子滑门、矮木桌与纸灯笼的榻榻米私人房间",
    },
  },
};

function Room() {
  const { t, locale } = useI18n();
  const [openSpace, setOpenSpace] = useState<RoomSpaceKey | null>(null);

  const stats: Array<{ n: string; label: string; key: RoomSpaceKey | null }> = [
    { n: "64", label: t("room.stats.seats"), key: null },
    { n: "12", label: t("room.stats.counter"), key: "counter" },
    { n: "8", label: t("room.stats.private"), key: "private" },
  ];

  return (
    <section id="room" className="relative overflow-hidden bg-charcoal">
      <div className="grid md:grid-cols-2">
        <div className="vignette relative aspect-[4/5] md:aspect-auto md:min-h-[700px]">
          <img
            src={robataImg}
            alt="Glowing robata grill with skewers cooking over white-oak coals"
            loading="lazy"
            width={1920}
            height={1080}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div className="flex items-center bg-gradient-warm px-6 py-24 md:px-20 md:py-32">
          <div className="max-w-md">
            <p className="mb-6 text-[0.65rem] uppercase tracking-[0.45em] text-amber-glow">
              {t("room.section_label")}
            </p>
            <h2 className="font-display text-4xl font-light leading-[1.05] text-cream md:text-5xl">
              {t("room.heading")}
            </h2>
            <p className="mt-8 text-base leading-relaxed text-cream/70">
              {t("room.body")}
            </p>

            <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-border/60 pt-10">
              {stats.map(({ n, label, key }) =>
                key ? (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setOpenSpace(key)}
                    className="group text-left transition"
                  >
                    <dt className="font-display text-3xl text-amber-glow md:text-4xl">{n}</dt>
                    <dd className="mt-2 flex items-center gap-1 text-[0.65rem] uppercase tracking-[0.3em] text-cream/50 transition group-hover:text-amber-glow">
                      <span>{label}</span>
                      <span aria-hidden className="opacity-0 transition group-hover:opacity-100">→</span>
                    </dd>
                  </button>
                ) : (
                  <div key={label}>
                    <dt className="font-display text-3xl text-amber-glow md:text-4xl">{n}</dt>
                    <dd className="mt-2 text-[0.65rem] uppercase tracking-[0.3em] text-cream/50">
                      {label}
                    </dd>
                  </div>
                ),
              )}
            </dl>
          </div>
        </div>
      </div>

      {openSpace && (
        <RoomSpaceModal
          spaceKey={openSpace}
          locale={locale}
          closeLabel={t("modal.close")}
          onClose={() => setOpenSpace(null)}
        />
      )}
    </section>
  );
}

function RoomSpaceModal({
  spaceKey,
  locale,
  closeLabel,
  onClose,
}: {
  spaceKey: RoomSpaceKey;
  locale: Locale;
  closeLabel: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const content = ROOM_SPACE_CONTENT[spaceKey];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-xl border border-amber-glow/25 bg-charcoal shadow-glow sm:rounded-xl"
        style={{ animation: "fadeIn 200ms ease-out" }}
      >
        <button
          type="button"
          aria-label={closeLabel}
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-amber-glow/30 bg-charcoal/70 text-cream transition hover:text-amber-glow"
        >
          <span aria-hidden className="text-lg leading-none">×</span>
        </button>
        <img
          src={content.image}
          alt={content.alt[locale]}
          loading="lazy"
          className="aspect-[16/10] w-full object-cover"
        />
        <div className="space-y-5 px-6 py-8 md:px-9 md:py-10">
          <h2 className="font-display text-2xl font-light leading-tight text-cream md:text-3xl">
            {content.heading[locale]}
          </h2>
          <p className="text-base leading-relaxed text-cream/80">
            {content.body[locale]}
          </p>
        </div>
      </div>
    </div>
  );
}


function Visit() {
  const { t } = useI18n();
  const cols = [
    { h: t("visit.address_label"), b: ["482 King Street West", "Toronto, ON M5V 1L7"] },
    {
      h: t("visit.hours_label"),
      b: [t("visit.hours_tuesat"), t("visit.hours_sun"), t("visit.hours_closed")],
    },
    { h: t("visit.contact_label"), b: ["reserve@hinokami.to", "+1 416 555 0188"] },
  ];
  return (
    <section id="visit" className="bg-gradient-warm px-6 py-32 md:px-12 md:py-48">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="mb-6 text-[0.65rem] uppercase tracking-[0.45em] text-amber-glow">
            {t("visit.section_label")}
          </p>
          <h2 className="font-display text-4xl font-light leading-[1.05] text-cream md:text-6xl">
            {t("visit.heading_line1")} <em className="italic text-amber-glow/90">{t("visit.heading_line2")}</em>
          </h2>
        </div>

        <div className="grid gap-12 border-y border-border/60 py-14 md:grid-cols-3 md:gap-16">
          {cols.map((c, i) => (
            <div key={i}>
              <p className="mb-4 text-[0.65rem] uppercase tracking-[0.4em] text-amber-glow">
                {c.h}
              </p>
              <div className="space-y-1 text-base leading-relaxed text-cream/80">
                {c.b.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reserve() {
  const { t } = useI18n();
  const [tab, setTab] = useState<"waitlist" | "table">("waitlist");

  const tabBase =
    "flex-1 px-6 py-3 text-[0.7rem] uppercase tracking-[0.3em] transition border-b-2 cursor-pointer";
  const activeCls = "border-amber-glow text-amber-glow";
  const inactiveCls = "border-transparent text-cream/50 hover:text-cream/80";

  return (
    <section id="reserve" className="bg-gradient-warm px-6 pb-32 md:px-12 md:pb-48">
      {/* Interior photo — full-width hero. */}
      <div className="-mx-6 mb-16 md:-mx-12 md:mb-20">
        <div className="relative aspect-[21/9] w-full overflow-hidden">
          <img
            src={interiorImg}
            alt={t("reserve.interior_caption")}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-charcoal/80 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-charcoal/60 to-transparent" />
        </div>
      </div>

      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <p className="max-w-md text-sm leading-relaxed text-cream/60">
          {t("reserve.heading")}
        </p>

        <div className="mt-10 flex w-full">
          <button
            onClick={() => setTab("waitlist")}
            className={`${tabBase} ${tab === "waitlist" ? activeCls : inactiveCls}`}
          >
            {t("reserve.tab_waitlist")}
          </button>
          <button
            onClick={() => setTab("table")}
            className={`${tabBase} ${tab === "table" ? activeCls : inactiveCls}`}
          >
            {t("reserve.tab_reserve_table")}
          </button>
        </div>

        <div className="mt-10 w-full">
          {tab === "waitlist" ? (
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex w-full flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                placeholder={t("reserve.email_placeholder")}
                className="flex-1 rounded-none border border-border bg-transparent px-5 py-4 text-sm text-cream placeholder:text-cream/40 focus:border-amber-glow focus:outline-none"
              />
              <button
                type="submit"
                className="bg-gradient-amber px-8 py-4 text-[0.7rem] uppercase tracking-[0.35em] text-charcoal shadow-glow transition hover:opacity-90"
              >
                {t("reserve.submit_button")}
              </button>
            </form>
          ) : (
            <ReservationWidget />
          )}
        </div>
      </div>
    </section>
  );
}

function AboutThisSite() {
  const { t } = useI18n();
  const stackItems = [
    t("about.stack_item1"),
    t("about.stack_item2"),
    t("about.stack_item3"),
  ];
  const capItems = [
    t("about.cap_concierge"),
    t("about.cap_allergen"),
    t("about.cap_sake"),
    t("about.cap_currency"),
  ];
  const comingSoon = t("about.contact_coming_soon");
  return (
    <section
      id="about-site"
      className="bg-charcoal px-6 py-32 md:px-12 md:py-40"
    >
      <div className="mx-auto max-w-6xl">
        <p className="mb-6 text-[0.65rem] uppercase tracking-[0.45em] text-amber-glow">
          {t("about.section_label")}
        </p>
        <h2 className="mb-16 max-w-3xl font-display text-4xl font-light leading-[1.05] text-cream md:text-6xl">
          {t("about.heading")}
        </h2>

        <div className="grid gap-10 md:grid-cols-2 md:gap-x-16 md:gap-y-14">
          {/* Stack */}
          <div className="border-t border-border/60 pt-8">
            <p className="mb-5 text-[0.65rem] uppercase tracking-[0.4em] text-amber-glow">
              {t("about.stack_label")}
            </p>
            <ul className="space-y-2 font-mono text-sm text-cream/80">
              {stackItems.map((it) => (
                <li key={it} className="border-b border-border/40 pb-2">
                  {it}
                </li>
              ))}
            </ul>
          </div>

          {/* Cost */}
          <div className="border-t border-border/60 pt-8">
            <p className="mb-5 text-[0.65rem] uppercase tracking-[0.4em] text-amber-glow">
              {t("about.cost_label")}
            </p>
            <p className="font-display text-2xl text-cream">
              {t("about.cost_runs_at")}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-cream/60">
              {t("about.cost_vs_agency")}
            </p>
          </div>

          {/* Capabilities */}
          <div className="border-t border-border/60 pt-8">
            <p className="mb-5 text-[0.65rem] uppercase tracking-[0.4em] text-amber-glow">
              {t("about.cap_label")}
            </p>
            <ul className="space-y-2 text-sm text-cream/80">
              {capItems.map((it) => (
                <li key={it} className="border-b border-border/40 pb-2">
                  {it}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="border-t border-border/60 pt-8">
            <p className="mb-3 font-display text-xl text-cream">
              {t("about.contact_heading")}
            </p>
            <p className="mb-5 text-sm leading-relaxed text-cream/60">
              {t("about.contact_body")}
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-baseline gap-3">
                <span className="text-[0.65rem] uppercase tracking-[0.3em] text-cream/50">
                  {t("about.contact_email_label")}
                </span>
                <a
                  href="mailto:risicare929@gmail.com"
                  className="text-amber-glow transition hover:text-cream"
                >
                  risicare929@gmail.com
                </a>
              </li>
              <li className="flex items-baseline gap-3">
                <span className="text-[0.65rem] uppercase tracking-[0.3em] text-cream/50">
                  {t("about.contact_upwork_label")}
                </span>
                <span className="text-cream/50 italic">{comingSoon}</span>
              </li>
              <li className="flex items-baseline gap-3">
                <span className="text-[0.65rem] uppercase tracking-[0.3em] text-cream/50">
                  {t("about.contact_github_label")}
                </span>
                <a
                  href="https://github.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-amber-glow transition hover:text-cream"
                >
                  {comingSoon}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function BackToTopButton() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 800);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={t("nav.back_to_top")}
      className={`fixed bottom-6 left-6 z-40 rounded-full border border-amber-glow/70 bg-charcoal/70 px-4 py-2 text-xs text-amber-glow backdrop-blur-sm transition-all duration-300 hover:bg-charcoal hover:shadow-glow md:px-5 md:text-sm ${
        visible ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {t("nav.back_to_top")}
    </button>
  );
}

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-border/60 bg-charcoal px-6 py-16 md:px-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 md:flex-row">
        <div className="flex flex-col items-center font-display text-cream md:items-start">
          <span className="whitespace-nowrap text-[18px] leading-[1.1] tracking-[0.05em] md:text-[20px]">
            鎮座ヒノカミ
          </span>
          <span className="mt-[2px] whitespace-nowrap text-[10px] uppercase leading-[1.1] tracking-[0.25em] text-cream/70 md:text-[11px]">
            HINOKAMI
          </span>
        </div>
        <div className="flex items-center gap-8 text-[0.65rem] uppercase tracking-[0.35em] text-cream/50">
          <SocialIcons size="h-5 w-5" gap="gap-6" />
          <a href="#" className="transition hover:text-amber-glow">{t("footer.vancouver")}</a>
          <a href="#" className="transition hover:text-amber-glow">{t("footer.press")}</a>
        </div>
        <p className="text-[0.65rem] uppercase tracking-[0.3em] text-cream/40">
          {t("footer.copyright")}
        </p>
      </div>
    </footer>
  );
}

function Index() {
  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "auto";
    }
  }, []);
  return (
    <main className="min-h-screen bg-background">
      <Nav />
      <Hero />
      <Story />
      <Menu />
      <Room />
      <Visit />
      <Reserve />
      <AboutThisSite />
      <Footer />
      <BackToTopButton />
      <DetailModal />
    </main>
  );
}

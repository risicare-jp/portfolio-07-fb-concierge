import { createFileRoute, Link } from "@tanstack/react-router";
import { Star, ExternalLink } from "lucide-react";
import { useState } from "react";
import heroImg from "@/assets/hero-izakaya.jpg";
import robataImg from "@/assets/robata.jpg";
import { CurrencySelector } from "@/components/CurrencySelector";
import { ReservationWidget } from "@/components/ReservationWidget";
import { useCurrency } from "@/lib/currency";
import { useI18n, pickLocalized, LOCALES, type Locale } from "@/lib/i18n";
import { dishById, type Dish } from "@/data/menu";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Hinokami Toronto — A modern izakaya, opening Spring 2026" },
      {
        name: "description",
        content:
          "From Vancouver to Toronto. Hinokami brings its acclaimed izakaya — robata grill, sushi counter, and rare sake — to King West. Reservations open Spring 2026.",
      },
      { property: "og:title", content: "Hinokami Toronto — A modern izakaya, opening Spring 2026" },
      { property: "og:site_name", content: "Hinokami Toronto" },
      { property: "og:description", content: "Vancouver's beloved izakaya arrives in Toronto." },
      { property: "og:image", content: heroImg },
    ],
  }),
});

const LOCALE_LABELS: Record<Locale, string> = { en: "EN", ja: "日本語", cn: "中文" };

function Nav() {
  const { locale, setLocale, t } = useI18n();
  return (
    <nav className="fixed top-0 z-50 w-full">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-6 md:px-12 md:py-8">
        <a href="#top" className="font-display text-xl tracking-[0.2em] text-cream md:text-2xl">
          鎮座ヒノカミ
          <span className="ml-3 hidden text-[0.7em] tracking-[0.4em] text-cream/70 md:inline">
            HINOKAMI
          </span>
        </a>
        <div className="hidden items-center gap-10 text-xs uppercase tracking-[0.25em] text-cream/80 md:flex">
          <a href="#story" className="transition hover:text-amber-glow">{t("nav.story")}</a>
          <a href="#menu" className="transition hover:text-amber-glow">{t("nav.menu")}</a>
          <a href="#room" className="transition hover:text-amber-glow">{t("nav.room")}</a>
          <a href="#visit" className="transition hover:text-amber-glow">{t("nav.visit")}</a>
        </div>
        <div className="flex items-center gap-3 md:gap-5">
          <CurrencySelector />
          <span className="hidden text-cream/30 md:inline">·</span>
          <div className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.25em] text-cream/60 md:text-xs">
            {LOCALES.map((l, i) => (
              <span key={l} className="flex items-center gap-2">
                <button
                  onClick={() => setLocale(l)}
                  className={`transition hover:text-amber-glow ${
                    locale === l ? "font-semibold text-amber-glow underline underline-offset-4" : ""
                  }`}
                >
                  {LOCALE_LABELS[l]}
                </button>
                {i < LOCALES.length - 1 && <span className="text-cream/30">·</span>}
              </span>
            ))}
          </div>
          <a
            href="#reserve"
            className="rounded-none border border-amber-glow/60 px-5 py-2.5 text-[0.65rem] uppercase tracking-[0.3em] text-amber-glow transition hover:bg-amber-glow hover:text-charcoal md:px-6 md:text-xs"
          >
            {t("nav.reserve")}
          </a>
        </div>
      </div>
    </nav>
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
          Tomoko&rsquo;s
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

type CounterDef = {
  num: string;
  key: "robata" | "sashimi" | "donabe_sake";
  dishIds: string[];
};

const COUNTERS_HOME: CounterDef[] = [
  { num: "i", key: "robata", dishIds: ["dish-001", "dish-003"] },
  { num: "ii", key: "sashimi", dishIds: ["dish-007", "dish-008"] },
  { num: "iii", key: "donabe_sake", dishIds: ["dish-012", "dish-016"] },
];

function Menu() {
  const { format } = useCurrency();
  const { t, locale } = useI18n();
  return (
    <section id="menu" className="bg-charcoal px-6 py-32 md:px-12 md:py-48">
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 flex flex-col items-start justify-between gap-6 md:mb-24 md:flex-row md:items-end">
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
                    <article
                      key={d.id}
                      className="group border border-border/60 bg-card/40 p-8 transition duration-500 hover:border-amber-glow/50 md:p-10"
                    >
                      <div className="flex items-start justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {d.is_signature && (
                              <Star
                                className="h-4 w-4 fill-amber-glow text-amber-glow"
                                aria-label="Signature"
                              />
                            )}
                            <h4 className="font-display text-2xl font-light text-cream md:text-3xl">
                              {pickLocalized(d.names, locale)}
                            </h4>
                          </div>
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
                    </article>
                  ))}
                </div>

                <div className="mt-8 md:mt-10">
                  <Link
                    to="/menu"
                    className="text-[0.7rem] uppercase tracking-[0.35em] text-amber-glow transition hover:text-cream"
                  >
                    {t("menu.view_full")}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Room() {
  const { t } = useI18n();
  const stats: Array<[string, string]> = [
    ["64", t("room.stats.seats")],
    ["12", t("room.stats.counter")],
    ["24", t("room.stats.sake")],
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
              {stats.map(([n, l]) => (
                <div key={l}>
                  <dt className="font-display text-3xl text-amber-glow md:text-4xl">{n}</dt>
                  <dd className="mt-2 text-[0.65rem] uppercase tracking-[0.3em] text-cream/50">
                    {l}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
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
    { h: t("visit.contact_label"), b: ["reserve@tomokos.to", "+1 416 555 0188"] },
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

function PortfolioNotePill() {
  const { t } = useI18n();
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("about-site");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 left-6 z-40 rounded-full border border-amber-glow/70 bg-charcoal/70 px-4 py-2 text-xs text-cream backdrop-blur-sm transition hover:border-amber-glow hover:bg-charcoal hover:text-amber-glow hover:shadow-glow md:px-5 md:text-sm"
      aria-label={t("nav.portfolio_note")}
    >
      {t("nav.portfolio_note")}
    </button>
  );
}

function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-border/60 bg-charcoal px-6 py-16 md:px-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 md:flex-row">
        <div className="flex items-center gap-4 font-display text-lg tracking-[0.2em] text-cream">
          知子 <span className="text-amber-glow/70">·</span> Tomoko&rsquo;s
        </div>
        <div className="flex gap-8 text-[0.65rem] uppercase tracking-[0.35em] text-cream/50">
          <a href="#" className="transition hover:text-amber-glow">{t("footer.instagram")}</a>
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
      <PortfolioNotePill />
    </main>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Star } from "lucide-react";
import heroImg from "@/assets/hero-izakaya.jpg";
import robataImg from "@/assets/robata.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Tomoko's Toronto — Modern Japanese Izakaya" },
      {
        name: "description",
        content:
          "From Vancouver to Toronto. Tomoko's brings its acclaimed izakaya — robata grill, sushi counter, and rare sake — to King West. Reservations open Spring 2026.",
      },
      { property: "og:title", content: "Tomoko's Toronto — Modern Japanese Izakaya" },
      { property: "og:description", content: "Vancouver's beloved izakaya arrives in Toronto." },
      { property: "og:image", content: heroImg },
    ],
  }),
});

type Lang = "EN" | "JA" | "CN";

function Nav({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const langs: Lang[] = ["EN", "JA", "CN"];
  const labels: Record<Lang, string> = { EN: "EN", JA: "日本語", CN: "中文" };
  return (
    <nav className="fixed top-0 z-50 w-full">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-6 md:px-12 md:py-8">
        <a href="#top" className="font-display text-xl tracking-[0.2em] text-cream md:text-2xl">
          知子
          <span className="ml-3 hidden text-[0.7em] tracking-[0.4em] text-cream/70 md:inline">
            TOMOKO&rsquo;S
          </span>
        </a>
        <div className="hidden items-center gap-10 text-xs uppercase tracking-[0.25em] text-cream/80 md:flex">
          <a href="#story" className="transition hover:text-amber-glow">Story</a>
          <a href="#menu" className="transition hover:text-amber-glow">Menu</a>
          <a href="#room" className="transition hover:text-amber-glow">The Room</a>
          <a href="#visit" className="transition hover:text-amber-glow">Visit</a>
        </div>
        <div className="flex items-center gap-3 md:gap-5">
          <div className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.25em] text-cream/60 md:text-xs">
            {langs.map((l, i) => (
              <span key={l} className="flex items-center gap-2">
                <button
                  onClick={() => setLang(l)}
                  className={`transition hover:text-amber-glow ${
                    lang === l ? "font-semibold text-amber-glow underline underline-offset-4" : ""
                  }`}
                >
                  {labels[l]}
                </button>
                {i < langs.length - 1 && <span className="text-cream/30">·</span>}
              </span>
            ))}
          </div>
          <a
            href="#reserve"
            className="rounded-none border border-amber-glow/60 px-5 py-2.5 text-[0.65rem] uppercase tracking-[0.3em] text-amber-glow transition hover:bg-amber-glow hover:text-charcoal md:px-6 md:text-xs"
          >
            Reserve
          </a>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
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
          Vancouver · est. 2009 — Toronto · Spring 2026
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
          <span>Toronto</span>
          <span className="h-px w-10 bg-amber-glow/60" />
        </div>
        <p
          className="animate-fade-up mt-10 max-w-md px-6 text-balance text-base font-light leading-relaxed text-cream/80 md:text-lg"
          style={{ animationDelay: "0.45s" }}
        >
          A modern izakaya rooted in robata fire, the season's sashimi, and the quiet ritual of
          pouring sake for a friend.
        </p>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-[0.6rem] uppercase tracking-[0.4em] text-cream/50">
        Scroll
      </div>
    </section>
  );
}

function Story() {
  return (
    <section id="story" className="bg-gradient-warm px-6 py-32 md:px-12 md:py-48">
      <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-12 md:gap-20">
        <div className="md:col-span-5">
          <p className="mb-8 text-[0.65rem] uppercase tracking-[0.45em] text-amber-glow">
            01 — The Story
          </p>
          <h2 className="font-display text-4xl font-light leading-[1.05] text-cream md:text-6xl">
            Sixteen years of fire,
            <em className="block italic text-amber-glow/90">now arriving east.</em>
          </h2>
        </div>
        <div className="space-y-6 text-base leading-relaxed text-cream/75 md:col-span-6 md:col-start-7 md:text-lg">
          <p>
            Tomoko Watanabe opened her first izakaya on a quiet Vancouver side street in 2009 with
            eight seats, a charcoal grill, and a single shelf of sake. Three rooms and a Michelin
            recommendation later, the philosophy hasn&rsquo;t moved an inch.
          </p>
          <p>
            In 2026, Tomoko&rsquo;s arrives on King West — a 64-seat room built around the same
            counter, the same fire, the same insistence that an izakaya is, before anything else,
            a place to stay a little longer than you planned.
          </p>
          <div className="hairline mt-12 w-24" />
          <p className="font-display text-xl italic text-cream/90 md:text-2xl">
            &ldquo;The grill is the conversation. Everything else is hospitality.&rdquo;
          </p>
          <p className="text-xs uppercase tracking-[0.3em] text-cream/50">
            — Tomoko Watanabe, Chef &amp; Owner
          </p>
        </div>
      </div>
    </section>
  );
}

type Dish = {
  star?: boolean;
  name: { EN: string; JA: string; CN?: string };
  ja: string;
  price: string;
  desc: { EN: string; JA: string; CN?: string };
};

type Counter = {
  num: string;
  en: string;
  ja: string;
  tagline: { EN: string; JA: string; CN?: string };
  dishes: Dish[];
};

const counters: Counter[] = [
  {
    num: "i",
    en: "The Robata",
    ja: "焚き火",
    tagline: {
      EN: "The grill is the conversation. Straw flame, white-oak charcoal, theater of fire.",
      JA: "炭火が会話。藁の炎、白樫の炭、火の劇場。",
    },
    dishes: [
      {
        star: true,
        name: { EN: "Straw-Flame Bonito Tataki", JA: "わら焼き 戻り鰹のたたき" },
        ja: "わら焼き 戻り鰹のたたき",
        price: "$26",
        desc: {
          EN: "Pacific bonito seared over a pillar of burning rice straw at the counter — smoke-perfumed exterior, ruby-rare interior. Tosa-style ponzu.",
          JA: "目の前で藁火に炙る戻り鰹。香ばしい表面とルビーのような中。土佐風ポン酢で。",
        },
      },
      {
        name: { EN: "Straw-Flame Sablefish Saikyo-yaki", JA: "わら焼き 銀ダラ西京焼き" },
        ja: "わら焼き 銀ダラ西京焼き",
        price: "$32",
        desc: {
          EN: "Black cod marinated 72 hours in Kyoto white miso, finished over straw flame. Buttery, sweet-savory, deeply Kyoto.",
          JA: "京都白味噌に72時間漬け込んだ銀ダラを藁火で仕上げる。バターのように甘く、京の味。",
        },
      },
    ],
  },
  {
    num: "ii",
    en: "The Counter",
    ja: "季節の刺身",
    tagline: {
      EN: "Sashimi cut to order. Today's catch from Pacific suppliers, finished by knife.",
      JA: "注文ごとに引く刺身。今朝の太平洋の魚を、包丁で仕上げる。",
    },
    dishes: [
      {
        star: true,
        name: { EN: "Today's Sashimi Trio", JA: "本日の刺身 三点盛り" },
        ja: "本日の刺身 三点盛り",
        price: "$28",
        desc: {
          EN: "Three fish chosen at this morning's market, cut to order. Today: bluefin chū-toro, king salmon, hirame.",
          JA: "今朝の市場で選んだ三種を注文ごとに引く。本日：本鮪中トロ、キングサーモン、平目。",
        },
      },
      {
        star: true,
        name: { EN: "Aburi Saba-zushi", JA: "炙り 鯖寿司" },
        ja: "炙り 鯖寿司",
        price: "$22",
        desc: {
          EN: "Kyoto-style pressed mackerel sushi, kelp-cured and torch-seared at the counter.",
          JA: "京都風の押し鯖寿司。昆布締めにし、目の前で炙る。",
        },
      },
    ],
  },
  {
    num: "iii",
    en: "Donabe & Sake",
    ja: "土鍋と酒",
    tagline: {
      EN: "Clay pot rice, served one portion at a time. Twenty-four bottles, breweries we know.",
      JA: "土鍋ご飯、一人前ずつ。蔵元を知る二十四本の酒。",
    },
    dishes: [
      {
        star: true,
        name: { EN: "Donabe Silver Rice", JA: "土鍋 銀シャリ" },
        ja: "土鍋 銀シャリ",
        price: "$9",
        desc: {
          EN: "Single bowl cooked at the table in an Iga-ware donabe. Niigata Koshihikari. Order at the start — it takes 25 minutes.",
          JA: "伊賀焼きの土鍋でテーブルにて炊く一人前。新潟コシヒカリ。最初にご注文を、25分かかります。",
        },
      },
      {
        star: true,
        name: { EN: "Takibiya Potato Salad", JA: "名物 ポテトサラダ" },
        ja: "名物 ポテトサラダ",
        price: "$10",
        desc: {
          EN: "Yukon gold potatoes, cured egg yolk, smoked sausage, fried potato strings on top. Our most-ordered side.",
          JA: "ユーコンゴールド、漬け卵黄、燻製ソーセージ、揚げポテトを散らして。一番人気の一品。",
        },
      },
    ],
  },
];

function pick<T extends { EN: string; JA: string; CN?: string }>(field: T, lang: Lang): string {
  if (lang === "CN") return field.CN ?? field.EN;
  return field[lang];
}

function Menu({ lang }: { lang: Lang }) {
  return (
    <section id="menu" className="bg-charcoal px-6 py-32 md:px-12 md:py-48">
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 flex flex-col items-start justify-between gap-6 md:mb-24 md:flex-row md:items-end">
          <div>
            <p className="mb-6 text-[0.65rem] uppercase tracking-[0.45em] text-amber-glow">
              02 — The Menu
            </p>
            <h2 className="max-w-2xl font-display text-4xl font-light leading-[1.05] text-cream md:text-6xl">
              Three counters, <em className="italic text-amber-glow/90">one fire.</em>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-cream/60">
            Choose a stool at the robata, the sashimi counter, or the donabe bar. The menu unfolds
            differently from each.
          </p>
        </div>

        <div className="space-y-24 md:space-y-32">
          {counters.map((c) => (
            <div key={c.en}>
              <div className="mb-10 flex flex-col gap-4 md:mb-12">
                <div className="flex items-baseline gap-5">
                  <span className="font-display text-sm uppercase tracking-[0.4em] text-amber-glow/70">
                    {c.num}
                  </span>
                  <h3 className="font-display text-3xl font-light text-cream md:text-5xl">
                    {c.en}
                  </h3>
                  <span className="font-display text-xl text-amber-glow/80 md:text-2xl">
                    {c.ja}
                  </span>
                </div>
                <p className="max-w-2xl text-sm leading-relaxed text-cream/65 md:text-base">
                  {pick(c.tagline, lang)}
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 md:gap-8">
                {c.dishes.map((d) => (
                  <article
                    key={d.ja}
                    className="group border border-border/60 bg-card/40 p-8 transition duration-500 hover:border-amber-glow/50 md:p-10"
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {d.star && (
                            <Star
                              className="h-4 w-4 fill-amber-glow text-amber-glow"
                              aria-label="Signature"
                            />
                          )}
                          <h4 className="font-display text-2xl font-light text-cream md:text-3xl">
                            {pick(d.name, lang)}
                          </h4>
                        </div>
                        <p className="mt-1 text-xs tracking-wide text-cream/45">{d.ja}</p>
                      </div>
                      <span className="font-display text-xl text-amber-glow md:text-2xl">
                        {d.price}
                      </span>
                    </div>
                    <p className="mt-5 text-sm leading-relaxed text-cream/70">
                      {pick(d.desc, lang)}
                    </p>
                  </article>
                ))}
              </div>

              <div className="mt-8 md:mt-10">
                <Link
                  to="/menu"
                  className="text-[0.7rem] uppercase tracking-[0.35em] text-amber-glow transition hover:text-cream"
                >
                  View Full Menu →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Room() {
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
              03 — The Room
            </p>
            <h2 className="font-display text-4xl font-light leading-[1.05] text-cream md:text-5xl">
              Lantern light, smoked oak, and a copper hood that has done this before.
            </h2>
            <p className="mt-8 text-base leading-relaxed text-cream/70">
              Sixty-four seats arranged around an open robata, a twelve-seat sushi counter, and a
              private tatami room for eight. Designed by Atelier Ito (Kyoto) with reclaimed Douglas
              fir from the Vancouver original.
            </p>

            <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-border/60 pt-10">
              {[
                ["64", "Seats"],
                ["12", "Counter"],
                ["48", "Sake labels"],
              ].map(([n, l]) => (
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
  return (
    <section id="visit" className="bg-gradient-warm px-6 py-32 md:px-12 md:py-48">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="mb-6 text-[0.65rem] uppercase tracking-[0.45em] text-amber-glow">
            04 — Visit
          </p>
          <h2 className="font-display text-4xl font-light leading-[1.05] text-cream md:text-6xl">
            On King West, <em className="italic text-amber-glow/90">opening Spring 2026.</em>
          </h2>
        </div>

        <div className="grid gap-12 border-y border-border/60 py-14 md:grid-cols-3 md:gap-16">
          {[
            { h: "Address", b: ["482 King Street West", "Toronto, ON M5V 1L7"] },
            { h: "Hours", b: ["Tue – Sat · 5pm – late", "Sun · 5pm – 10pm", "Closed Monday"] },
            { h: "Contact", b: ["reserve@tomokos.to", "+1 416 555 0188"] },
          ].map((c) => (
            <div key={c.h}>
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

        <div id="reserve" className="mt-20 flex flex-col items-center text-center">
          <p className="max-w-md text-sm leading-relaxed text-cream/60">
            The waitlist for opening week is now open. Members of our list receive first access two
            weeks before public reservations.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-10 flex w-full max-w-lg flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              placeholder="your@email.com"
              className="flex-1 rounded-none border border-border bg-transparent px-5 py-4 text-sm text-cream placeholder:text-cream/40 focus:border-amber-glow focus:outline-none"
            />
            <button
              type="submit"
              className="bg-gradient-amber px-8 py-4 text-[0.7rem] uppercase tracking-[0.35em] text-charcoal shadow-glow transition hover:opacity-90"
            >
              Join Waitlist
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60 bg-charcoal px-6 py-16 md:px-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 md:flex-row">
        <div className="flex items-center gap-4 font-display text-lg tracking-[0.2em] text-cream">
          知子 <span className="text-amber-glow/70">·</span> Tomoko&rsquo;s
        </div>
        <div className="flex gap-8 text-[0.65rem] uppercase tracking-[0.35em] text-cream/50">
          <a href="#" className="transition hover:text-amber-glow">Instagram</a>
          <a href="#" className="transition hover:text-amber-glow">Vancouver</a>
          <a href="#" className="transition hover:text-amber-glow">Press</a>
        </div>
        <p className="text-[0.65rem] uppercase tracking-[0.3em] text-cream/40">
          © 2026 Tomoko&rsquo;s Restaurant Group
        </p>
      </div>
    </footer>
  );
}

function Index() {
  const [lang, setLang] = useState<Lang>("EN");
  return (
    <main className="min-h-screen bg-background">
      <Nav lang={lang} setLang={setLang} />
      <Hero />
      <Story />
      <Menu lang={lang} />
      <Room />
      <Visit />
      <Footer />
    </main>
  );
}

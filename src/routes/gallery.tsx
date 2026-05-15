import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ImageIcon, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Nav, Footer } from "@/routes/index";
import { useI18n, type Locale } from "@/lib/i18n";
import roomCounterImg from "@/assets/room-counter.jpeg";
import roomPrivateImg from "@/assets/room-private.jpeg";
import interiorImg from "@/assets/reserve/interior-dining.jpg";
import springVeg from "@/assets/seasonal/spring-002-vegetables.jpg";
import springSakuraDai from "@/assets/seasonal/spring-009-sakura-dai.jpg";
import springChawanmushi from "@/assets/seasonal/spring-014-chawanmushi.jpg";

type Cat = "cuisine" | "atmosphere" | "chef";
type FilterKey = "all" | Cat;

type GalleryItem = {
  id: string;
  category: Cat;
  src?: string;
  caption: Record<Locale, string>;
};

const ITEMS: GalleryItem[] = [
  { id: "g-001", category: "atmosphere", src: roomCounterImg, caption: { en: "12-seat counter facing the straw flame", ja: "わら炎に面した12席カウンター", cn: "面对稻草烈焰的12席吧台" } },
  { id: "g-002", category: "atmosphere", src: roomPrivateImg, caption: { en: "8-seat private tatami room", ja: "8人用個室の畳の間", cn: "8人私人榻榻米房间" } },
  { id: "g-003", category: "atmosphere", src: interiorImg, caption: { en: "The dining room at HINOKAMI", ja: "HINOKAMIのダイニング", cn: "HINOKAMI 餐厅内景" } },
  { id: "g-004", category: "cuisine", src: springVeg, caption: { en: "Spring vegetables, binchotan-grilled", ja: "春野菜五種 備長炭焼き", cn: "春日蔬菜五种 备长炭烤" } },
  { id: "g-005", category: "cuisine", src: springSakuraDai, caption: { en: "Sakura-dai carpaccio, spring greens", ja: "桜鯛と春菜のカルパッチョ", cn: "樱鲷与春菜意式生鱼片" } },
  { id: "g-006", category: "cuisine", src: springChawanmushi, caption: { en: "Spring chawanmushi with firefly squid", ja: "ホタルイカの春茶碗蒸し", cn: "萤火鱿春日茶碗蒸" } },
  { id: "g-007", category: "cuisine", caption: { en: "Straw-flame bonito tataki", ja: "わら焼き戻り鰹のたたき", cn: "稻草烟熏秋鲣刺身" } },
  { id: "g-008", category: "cuisine", caption: { en: "Today's sashimi trio", ja: "本日の刺身三点盛り", cn: "本日刺身三品拼盘" } },
  { id: "g-009", category: "cuisine", caption: { en: "Aburi saba-zushi", ja: "炙り鯖寿司", cn: "炙烤鲭鱼寿司" } },
  { id: "g-010", category: "cuisine", caption: { en: "Donabe silver rice", ja: "土鍋銀シャリ", cn: "土锅银饭" } },
  { id: "g-011", category: "cuisine", caption: { en: "Takibiya potato salad", ja: "名物ポテトサラダ", cn: "招牌土豆沙拉" } },
  { id: "g-012", category: "cuisine", caption: { en: "Binchotan Tajima chicken thigh", ja: "但馬鶏もも炭火焼き", cn: "但马鸡腿炭火烧" } },
  { id: "g-013", category: "cuisine", caption: { en: "Charcoal thick-cut beef tongue", ja: "厚切り牛タン炭火焼", cn: "厚切牛舌炭火烧" } },
  { id: "g-014", category: "cuisine", caption: { en: "Donabe salmon-ikura rice", ja: "土鍋 鮭はらこ飯", cn: "土锅鲑鱼鲑鱼籽饭" } },
  { id: "g-015", category: "cuisine", caption: { en: "Hojicha pudding", ja: "ほうじ茶プリン", cn: "焙茶布丁" } },
  { id: "g-016", category: "atmosphere", caption: { en: "The straw flame at the moment of sear", ja: "焼き入れの瞬間のわら炎", cn: "入炙瞬间的稻草烈焰" } },
  { id: "g-017", category: "atmosphere", caption: { en: "Binchotan charcoal at temperature", ja: "温度の上がった備長炭", cn: "升温中的备长炭" } },
  { id: "g-018", category: "atmosphere", caption: { en: "Donabe rice opening at the table", ja: "テーブルで開ける土鍋ご飯", cn: "客席现开土锅米饭" } },
  { id: "g-019", category: "chef", caption: { en: "Tomoko at the counter", ja: "カウンターに立つTomoko", cn: "站于吧台的Tomoko" } },
  { id: "g-020", category: "chef", caption: { en: "Tomoko reading the flame", ja: "炎を読むTomoko", cn: "凝视炉火的Tomoko" } },
];

type Search = { filter?: FilterKey };

export const Route = createFileRoute("/gallery")({
  validateSearch: (s: Record<string, unknown>): Search => {
    const f = s.filter as string | undefined;
    if (f === "cuisine" || f === "atmosphere" || f === "chef" || f === "all") return { filter: f };
    return {};
  },
  head: () => ({
    meta: [
      { title: "Gallery — HINOKAMI Toronto" },
      { name: "description", content: "Sixteen years of fire, served on a plate. Photos of the dining room, the binchotan grill, signature dishes, and the chef." },
      { property: "og:title", content: "Gallery — HINOKAMI Toronto" },
      { property: "og:description", content: "Photos from HINOKAMI Toronto: dining room, binchotan grill, signature dishes, and the chef." },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const { t, locale } = useI18n();
  const navigate = useNavigate({ from: "/gallery" });
  const search = Route.useSearch();
  const filter: FilterKey = search.filter ?? "all";
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const filtered = useMemo(
    () => (filter === "all" ? ITEMS : ITEMS.filter((i) => i.category === filter)),
    [filter],
  );

  const setFilter = (f: FilterKey) => {
    void navigate({ search: f === "all" ? {} : { filter: f } });
  };

  const filters: Array<{ key: FilterKey; label: string }> = [
    { key: "all", label: t("gallery.filter_all") },
    { key: "cuisine", label: t("gallery.filter_cuisine") },
    { key: "atmosphere", label: t("gallery.filter_atmosphere") },
    { key: "chef", label: t("gallery.filter_chef") },
  ];

  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIdx(null);
      if (e.key === "ArrowRight") setOpenIdx((i) => (i === null ? null : (i + 1) % filtered.length));
      if (e.key === "ArrowLeft") setOpenIdx((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIdx, filtered.length]);

  return (
    <main className="min-h-screen bg-background">
      <Nav />
      <section className="bg-charcoal px-6 pb-24 pt-32 md:px-12 md:pt-40">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center rounded-full border border-amber-glow/60 px-4 py-2 text-[0.65rem] uppercase tracking-[0.25em] text-amber-glow transition hover:bg-amber-glow hover:text-charcoal"
            >
              {t("gallery.back_button")}
            </Link>
          </div>
          <div className="mb-12 text-center md:mb-16">
            <p className="mb-4 text-[0.65rem] uppercase tracking-[0.45em] text-amber-glow">HINOKAMI</p>
            <h1 className="font-display text-4xl font-light leading-[1.05] text-cream md:text-6xl">
              {t("gallery.heading")}
            </h1>
            <p className="mx-auto mt-6 max-w-xl font-display text-lg italic text-cream/70 md:text-xl">
              {t("gallery.subheading")}
            </p>
          </div>

          <div className="mb-10 flex flex-wrap justify-center gap-2 md:gap-3">
            {filters.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`rounded-full border px-4 py-2 text-[0.7rem] uppercase tracking-[0.25em] transition md:px-5 ${
                  filter === f.key
                    ? "border-amber-glow bg-amber-glow text-charcoal"
                    : "border-amber-glow/30 text-cream/70 hover:border-amber-glow/60 hover:text-amber-glow"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setOpenIdx(idx)}
                className="group relative aspect-[4/5] overflow-hidden rounded-sm border border-border/60 bg-gradient-warm transition hover:border-amber-glow/50"
              >
                {item.src ? (
                  <img
                    src={item.src}
                    alt={item.caption[locale]}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-amber-glow/10 via-charcoal/60 to-charcoal p-4 text-center">
                    <ImageIcon className="h-8 w-8 text-amber-glow/60" />
                    <p className="text-xs leading-relaxed text-cream/60">
                      {item.caption[locale]} — {t("gallery.image_coming_soon")}
                    </p>
                  </div>
                )}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/95 via-charcoal/40 to-transparent p-3 opacity-0 transition group-hover:opacity-100 md:p-4">
                  <span className="inline-block rounded-sm bg-amber-glow/90 px-2 py-0.5 text-[0.55rem] uppercase tracking-[0.25em] text-charcoal">
                    {t(`gallery.cat.${item.category}`)}
                  </span>
                  <p className="mt-2 text-xs leading-relaxed text-cream md:text-sm">{item.caption[locale]}</p>
                </div>
                <p className="mt-2 px-1 text-xs text-cream/70 sm:hidden">{item.caption[locale]}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {openIdx !== null && (
        <Lightbox
          item={filtered[openIdx]}
          locale={locale}
          tCat={t(`gallery.cat.${filtered[openIdx].category}`)}
          tPrev={t("gallery.prev")}
          tNext={t("gallery.next")}
          tClose={t("gallery.close")}
          tComing={t("gallery.image_coming_soon")}
          onClose={() => setOpenIdx(null)}
          onPrev={() => setOpenIdx((openIdx - 1 + filtered.length) % filtered.length)}
          onNext={() => setOpenIdx((openIdx + 1) % filtered.length)}
        />
      )}

      <Footer />
    </main>
  );
}

function Lightbox({
  item, locale, tCat, tPrev, tNext, tClose, tComing, onClose, onPrev, onNext,
}: {
  item: GalleryItem; locale: Locale;
  tCat: string; tPrev: string; tNext: string; tClose: string; tComing: string;
  onClose: () => void; onPrev: () => void; onNext: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label={tClose}
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-amber-glow/40 bg-charcoal/70 text-cream transition hover:text-amber-glow"
      >
        <X className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label={tPrev}
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-amber-glow/40 bg-charcoal/70 text-cream transition hover:text-amber-glow md:left-6"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label={tNext}
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-amber-glow/40 bg-charcoal/70 text-cream transition hover:text-amber-glow md:right-6"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] max-w-[90vw] flex-col items-center gap-4"
      >
        {item.src ? (
          <img
            src={item.src}
            alt={item.caption[locale]}
            className="max-h-[75vh] max-w-[90vw] object-contain"
          />
        ) : (
          <div className="flex h-[60vh] w-[80vw] max-w-2xl flex-col items-center justify-center gap-3 rounded-sm bg-gradient-to-br from-amber-glow/10 via-charcoal/60 to-charcoal p-8 text-center">
            <ImageIcon className="h-12 w-12 text-amber-glow/60" />
            <p className="text-sm text-cream/70">{item.caption[locale]} — {tComing}</p>
          </div>
        )}
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="rounded-sm bg-amber-glow/90 px-2 py-0.5 text-[0.55rem] uppercase tracking-[0.25em] text-charcoal">
            {tCat}
          </span>
          <p className="text-sm text-cream md:text-base">{item.caption[locale]}</p>
        </div>
      </div>
    </div>
  );
}

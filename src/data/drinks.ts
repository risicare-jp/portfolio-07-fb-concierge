import type { LocalizedText } from "@/data/menu";

export type DrinkCategory = "beer" | "highball" | "wine" | "soft" | "sake";

export type Drink = {
  id: string;
  category: DrinkCategory;
  names: LocalizedText;
  origin: LocalizedText;
  abv: number;
  flavor: string;
  price_cad: number;
  pairing_dishes: string[];
  is_featured: boolean;
};

const raw: Array<Omit<Drink, "origin"> & {
  origin_en: string;
  origin_ja: string;
  origin_cn: string;
}> = [
  { id: "beer-001", category: "beer", names: { en: "Asahi Super Dry (draft)", ja: "アサヒ スーパードライ (生)", cn: "朝日 Super Dry (生啤)" }, origin_en: "Tokyo, Japan — Asahi Breweries", origin_ja: "東京、日本 — アサヒビール", origin_cn: "东京，日本 — 朝日啤酒", abv: 5.0, flavor: "light, crisp, dry-finish", price_cad: 9, pairing_dishes: ["dish-001","dish-006","dish-016"], is_featured: false },
  { id: "beer-002", category: "beer", names: { en: "Sapporo Premium (bottle)", ja: "サッポロ プレミアム (瓶)", cn: "札幌 Premium (瓶装)" }, origin_en: "Hokkaido, Japan — Sapporo Breweries", origin_ja: "北海道、日本 — サッポロビール", origin_cn: "北海道，日本 — 札幌啤酒", abv: 5.0, flavor: "crisp, malty, slightly bitter finish", price_cad: 10, pairing_dishes: ["dish-003","dish-005"], is_featured: false },
  { id: "beer-003", category: "beer", names: { en: "Coedo Beniaka (amber lager)", ja: "コエド 紅赤 (アンバーラガー)", cn: "Coedo 红赤 (琥珀拉格)" }, origin_en: "Saitama, Japan — Coedo Brewery", origin_ja: "埼玉、日本 — コエドブルワリー", origin_cn: "埼玉，日本 — Coedo啤酒厂", abv: 7.0, flavor: "amber, caramelized sweet potato base, malty", price_cad: 13, pairing_dishes: ["dish-006","dish-003"], is_featured: true },
  { id: "beer-004", category: "beer", names: { en: "Yuzu Saison", ja: "柚子セゾン", cn: "柚子赛松" }, origin_en: "Saitama, Japan — Hitachino Nest", origin_ja: "茨城、日本 — 常陸野ネスト", origin_cn: "茨城，日本 — 常陆野Nest", abv: 5.5, flavor: "citrus-bright, herbal, slightly tart", price_cad: 14, pairing_dishes: ["dish-011","dish-009"], is_featured: false },
  { id: "beer-005", category: "beer", names: { en: "Toronto Craft IPA", ja: "トロント クラフト IPA", cn: "多伦多 精酿 IPA" }, origin_en: "Toronto, Canada — Bellwoods Brewery", origin_ja: "トロント、カナダ — Bellwoods Brewery", origin_cn: "多伦多，加拿大 — Bellwoods Brewery", abv: 6.5, flavor: "hoppy, citrus-pine, bitter finish", price_cad: 12, pairing_dishes: ["dish-004","dish-006"], is_featured: false },
  { id: "highball-001", category: "highball", names: { en: "Toki Highball", ja: "響 季 ハイボール", cn: "Toki Highball" }, origin_en: "Suntory Toki Japanese whisky + soda, lemon peel", origin_ja: "サントリー響 季 + ソーダ、レモンピール", origin_cn: "三得利响 季 + 苏打、柠檬皮", abv: 7.0, flavor: "light whisky, crisp soda, citrus", price_cad: 13, pairing_dishes: ["dish-001","dish-004","dish-016"], is_featured: true },
  { id: "highball-002", category: "highball", names: { en: "Hibiki Old Fashioned", ja: "響 オールドファッションド", cn: "响 古典鸡尾酒" }, origin_en: "Hibiki Harmony Japanese whisky + brown sugar + Japanese bitters", origin_ja: "響 ハーモニー + ブラウンシュガー + 和ビターズ", origin_cn: "响 Harmony + 红糖 + 日式苦精", abv: 32, flavor: "rich whisky, caramel-sweet, complex", price_cad: 18, pairing_dishes: ["dish-003","dish-006"], is_featured: false },
  { id: "highball-003", category: "highball", names: { en: "Yuzu Highball", ja: "柚子 ハイボール", cn: "柚子 Highball" }, origin_en: "Suntory Whisky + fresh yuzu + soda", origin_ja: "サントリーウイスキー + 生柚子 + ソーダ", origin_cn: "三得利威士忌 + 鲜柚子 + 苏打", abv: 7.0, flavor: "citrus-bright, slightly tart, refreshing", price_cad: 14, pairing_dishes: ["dish-009","dish-011"], is_featured: false },
  { id: "highball-004", category: "highball", names: { en: "Hakushu Highball", ja: "白州 ハイボール", cn: "白州 Highball" }, origin_en: "Suntory Hakushu single malt + soda, mint leaf", origin_ja: "サントリー白州 シングルモルト + ソーダ、ミント", origin_cn: "三得利白州 单一麦芽 + 苏打、薄荷", abv: 7.0, flavor: "smoky-forest, herbal, deep", price_cad: 18, pairing_dishes: ["dish-005","dish-001"], is_featured: false },
  { id: "wine-001", category: "wine", names: { en: "Tawse Sparkling Brut", ja: "トーズ スパークリング ブリュット", cn: "Tawse 起泡 Brut" }, origin_en: "Niagara, Ontario — Tawse Winery (méthode traditionnelle)", origin_ja: "ナイアガラ、オンタリオ — トーズワイナリー (シャンパーニュ方式)", origin_cn: "尼亚加拉，安大略 — Tawse酒庄 (传统香槟法)", abv: 12.0, flavor: "dry, citrus, fine bubbles, mineral", price_cad: 18, pairing_dishes: ["dish-011","dish-007"], is_featured: false },
  { id: "wine-002", category: "wine", names: { en: "Cave Spring Riesling", ja: "ケイブスプリング リースリング", cn: "Cave Spring 雷司令" }, origin_en: "Niagara, Ontario — Cave Spring Cellars", origin_ja: "ナイアガラ、オンタリオ — ケイブスプリング・セラーズ", origin_cn: "尼亚加拉，安大略 — Cave Spring Cellars", abv: 11.5, flavor: "off-dry, stone fruit, slight petrol, balanced acidity", price_cad: 15, pairing_dishes: ["dish-007","dish-008"], is_featured: true },
  { id: "wine-003", category: "wine", names: { en: "Lailey Pinot Noir", ja: "レイリー ピノ・ノワール", cn: "Lailey 黑皮诺" }, origin_en: "Niagara, Ontario — Lailey Vineyard", origin_ja: "ナイアガラ、オンタリオ — レイリー・ヴィンヤード", origin_cn: "尼亚加拉，安大略 — Lailey葡萄园", abv: 13.0, flavor: "light-bodied, cherry, earth, subtle oak", price_cad: 17, pairing_dishes: ["dish-004","dish-010"], is_featured: false },
  { id: "soft-001", category: "soft", names: { en: "Sencha (hot)", ja: "煎茶 (温)", cn: "煎茶 (热)" }, origin_en: "Shizuoka, Japan — Marukyu Koyamaen", origin_ja: "静岡、日本 — 丸久小山園", origin_cn: "静冈，日本 — 丸久小山园", abv: 0, flavor: "grassy, umami, fresh", price_cad: 6, pairing_dishes: ["dish-007","dish-008","dish-012"], is_featured: false },
  { id: "soft-002", category: "soft", names: { en: "Hojicha (hot)", ja: "ほうじ茶 (温)", cn: "焙茶 (热)" }, origin_en: "Kyoto, Japan — Ippodo", origin_ja: "京都、日本 — 一保堂", origin_cn: "京都，日本 — 一保堂", abv: 0, flavor: "roasted, nutty, warm, low caffeine", price_cad: 6, pairing_dishes: ["dish-018","dish-006"], is_featured: true },
  { id: "soft-003", category: "soft", names: { en: "Genmaicha (hot)", ja: "玄米茶 (温)", cn: "玄米茶 (热)" }, origin_en: "Kyoto, Japan — Ippodo", origin_ja: "京都、日本 — 一保堂", origin_cn: "京都，日本 — 一保堂", abv: 0, flavor: "toasted brown rice + green tea, comforting", price_cad: 6, pairing_dishes: ["dish-012","dish-013"], is_featured: false },
  { id: "soft-004", category: "soft", names: { en: "Calpis Soda", ja: "カルピスソーダ", cn: "可尔必思 苏打" }, origin_en: "Tokyo, Japan — Asahi Beverages", origin_ja: "東京、日本 — アサヒ飲料", origin_cn: "东京，日本 — 朝日饮料", abv: 0, flavor: "fermented milk + soda, sweet-tangy, nostalgic", price_cad: 6, pairing_dishes: ["dish-016","dish-017"], is_featured: false },
  { id: "soft-005", category: "soft", names: { en: "Yuzu Lemonade", ja: "柚子レモネード", cn: "柚子柠檬水" }, origin_en: "House-made — Toronto yuzu syrup + Niagara honey + soda", origin_ja: "自家製 — トロント柚子シロップ + ナイアガラ蜂蜜 + ソーダ", origin_cn: "自家制 — 多伦多柚子糖浆 + 尼亚加拉蜂蜜 + 苏打", abv: 0, flavor: "citrus-bright, honey-sweet, refreshing", price_cad: 7, pairing_dishes: ["dish-011","dish-009"], is_featured: false },
  { id: "soft-006", category: "soft", names: { en: "Sparkling Water", ja: "炭酸水", cn: "气泡水" }, origin_en: "San Pellegrino (or local equivalent)", origin_ja: "サンペレグリノ (もしくは同等品)", origin_cn: "San Pellegrino (或当地同等水)", abv: 0, flavor: "neutral, mineral", price_cad: 5, pairing_dishes: [], is_featured: false },
];

export const DRINKS: Drink[] = raw.map((d) => ({
  id: d.id,
  category: d.category,
  names: d.names,
  origin: { en: d.origin_en, ja: d.origin_ja, cn: d.origin_cn },
  abv: d.abv,
  flavor: d.flavor,
  price_cad: d.price_cad,
  pairing_dishes: d.pairing_dishes,
  is_featured: d.is_featured,
}));

export function drinkById(id: string): Drink | undefined {
  return DRINKS.find((d) => d.id === id);
}

export function drinksPairedWithDish(dishId: string, limit = 2): Drink[] {
  return DRINKS.filter((d) => d.pairing_dishes.includes(dishId)).slice(0, limit);
}

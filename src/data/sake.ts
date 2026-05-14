export type SakeRichness = "light" | "medium" | "full";

export type Sake = {
  id: string;
  names: { en: string; ja: string; cn: string };
  brewery: string;
  prefecture_en: string;
  prefecture_ja: string;
  category: string;
  rice: string;
  smv: number;
  abv: number;
  flavor: string;
  richness: SakeRichness;
  pairing_affinity: string[];
  price_glass_cad: number;
  price_bottle_cad: number;
};

export const SAKE_META = {
  schema_version: "1.0",
  generated: "2026-05-14",
  total_house_labels: 24,
  note: "Featured 6 labels on rotation. Full list of 24 available on request.",
};

export const SAKE: Sake[] = [
  {
    id: "sake-001",
    names: {
      en: "Dewazakura Dewasansan Junmai Ginjo",
      ja: "出羽桜 出羽燦々 純米吟醸",
      cn: "出羽樱 出羽灿灿 纯米吟酿",
    },
    brewery: "Dewazakura Sake Brewery",
    prefecture_en: "Yamagata",
    prefecture_ja: "山形",
    category: "Junmai Ginjo",
    rice: "Dewasansan",
    smv: -2,
    abv: 15.5,
    flavor: "off-dry, melon, soft",
    richness: "light",
    pairing_affinity: ["clean", "umami", "sashimi", "light-vegetable"],
    price_glass_cad: 14,
    price_bottle_cad: 78,
  },
  {
    id: "sake-002",
    names: {
      en: "Tatenokawa Shuryu Junmai Daiginjo",
      ja: "楯野川 主流 純米大吟醸",
      cn: "盾野川 主流 纯米大吟酿",
    },
    brewery: "Tatenokawa",
    prefecture_en: "Yamagata",
    prefecture_ja: "山形",
    category: "Junmai Daiginjo",
    rice: "Dewasansan",
    smv: 3,
    abv: 15,
    flavor: "dry, bright pear, refined",
    richness: "light",
    pairing_affinity: ["clean", "delicate", "kombu-cured", "carpaccio"],
    price_glass_cad: 22,
    price_bottle_cad: 128,
  },
  {
    id: "sake-003",
    names: {
      en: "Hakkaisan Junmai Ginjo",
      ja: "八海山 純米吟醸",
      cn: "八海山 纯米吟酿",
    },
    brewery: "Hakkaisan",
    prefecture_en: "Niigata",
    prefecture_ja: "新潟",
    category: "Junmai Ginjo",
    rice: "Yamada Nishiki",
    smv: 4,
    abv: 15.5,
    flavor: "dry, clean, structured, mineral",
    richness: "medium",
    pairing_affinity: ["smoky", "robata", "charred", "grilled-meat"],
    price_glass_cad: 16,
    price_bottle_cad: 88,
  },
  {
    id: "sake-004",
    names: {
      en: "Kubota Senju Honjozo",
      ja: "久保田 千寿 本醸造",
      cn: "久保田 千寿 本酿造",
    },
    brewery: "Asahi Shuzo (Niigata)",
    prefecture_en: "Niigata",
    prefecture_ja: "新潟",
    category: "Honjozo",
    rice: "Gohyakumangoku",
    smv: 5,
    abv: 15,
    flavor: "dry, light, easy-drinking",
    richness: "light",
    pairing_affinity: ["everyday", "rice-dish", "fried", "casual"],
    price_glass_cad: 12,
    price_bottle_cad: 62,
  },
  {
    id: "sake-005",
    names: {
      en: "Tsukasabotan Funaguchi Hassaku Junmai Chokarakuchi",
      ja: "司牡丹 船中八策 純米超辛口",
      cn: "司牡丹 船中八策 纯米超辛口",
    },
    brewery: "Tsukasabotan (Kōchi)",
    prefecture_en: "Kōchi",
    prefecture_ja: "高知",
    category: "Junmai Chokarakuchi (super dry)",
    rice: "Akebono",
    smv: 8,
    abv: 16,
    flavor: "bone-dry, savory, full",
    richness: "full",
    pairing_affinity: [
      "fatty",
      "buttery",
      "miso-marinated",
      "rich",
      "tongue",
      "sablefish",
    ],
    price_glass_cad: 15,
    price_bottle_cad: 84,
  },
  {
    id: "sake-006",
    names: {
      en: "Suigei Junmai Ginjo",
      ja: "酔鯨 純米吟醸",
      cn: "醉鲸 纯米吟酿",
    },
    brewery: "Suigei (Kōchi)",
    prefecture_en: "Kōchi",
    prefecture_ja: "高知",
    category: "Junmai Ginjo",
    rice: "Yamada Nishiki",
    smv: 6,
    abv: 16,
    flavor: "dry, citrus-bright, refreshing",
    richness: "medium",
    pairing_affinity: [
      "oyster",
      "raw-shellfish",
      "citrus",
      "ponzu",
      "cold-sashimi",
    ],
    price_glass_cad: 16,
    price_bottle_cad: 92,
  },
];

export function sakeById(id: string): Sake | undefined {
  return SAKE.find((s) => s.id === id);
}

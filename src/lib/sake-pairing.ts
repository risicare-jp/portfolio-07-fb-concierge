import { SAKE, type Sake, sakeById } from "@/data/sake";
import type { Dish } from "@/data/menu";

export type Pairing = { sake: Sake; rationale: string };

function dishText(dish: Dish): string {
  const desc = dish.descriptions.en.toLowerCase();
  const name = dish.names.en.toLowerCase();
  return `${name} ${desc}`;
}

function rationaleFor(sake: Sake, reason: string): string {
  return `${sake.names.en} (${sake.prefecture_en}, ${sake.category.toLowerCase()}) — ${reason}`;
}

export function pairForDish(dish: Dish): {
  pairings: Pairing[];
  message?: string;
} {
  if (dish.is_dessert) {
    return {
      pairings: [],
      message:
        "Hojicha pudding pairs best on its own — or with hot hojicha tea.",
    };
  }

  const text = dishText(dish);
  const picks: Pairing[] = [];
  const used = new Set<string>();

  const add = (id: string, reason: string) => {
    if (used.has(id) || picks.length >= 2) return;
    const s = sakeById(id);
    if (!s) return;
    picks.push({ sake: s, rationale: rationaleFor(s, reason) });
    used.add(id);
  };

  // Rule 1: rich/fatty/miso-marinated
  if (
    /miso|saikyo|fatty|buttery|butter|sablefish|cod|tongue|rich/.test(text)
  ) {
    add(
      "sake-005",
      "the bone-dry savor cuts through white-miso sweetness and rich, buttery textures.",
    );
  }

  // Rule 2: raw shellfish / briny
  if (/oyster|shellfish|scallop|briny|raw-shell/.test(text)) {
    add(
      "sake-006",
      "citrus-bright junmai ginjo lifts briny shellfish and ponzu notes.",
    );
  }

  // Rule 3: straw-flame / charcoal / grilled
  if (/straw[- ]flame|grilled|charcoal|robata|binchotan|charred|seared/.test(text)) {
    add(
      "sake-003",
      "structured, mineral profile stands up to smoke and char from the robata.",
    );
  }

  // Rule 4: raw sashimi / kombu-cured
  if (/sashimi|kombu|carpaccio|kelp[- ]cured|kombu-jime|raw/.test(text)) {
    add(
      "sake-001",
      "soft, off-dry junmai ginjo lets the clean umami of raw fish lead.",
    );
    add(
      "sake-002",
      "refined, bright-pear daiginjo flatters delicate, kombu-cured cuts.",
    );
  }

  // Rule 5: donabe rice
  if (/donabe|rice/.test(text)) {
    add(
      "sake-004",
      "an easy-drinking honjozo built for rice dishes and the long table.",
    );
  }

  // Fill from richness if needed
  if (picks.length < 2) {
    const wantRichness =
      dish.is_signature || /beef|pork|tongue|sablefish/.test(text)
        ? "full"
        : "light";
    for (const s of SAKE) {
      if (used.has(s.id)) continue;
      if (s.richness === wantRichness) {
        add(s.id, "a balanced match for this dish's weight and seasoning.");
        if (picks.length >= 2) break;
      }
    }
  }
  if (picks.length < 2) {
    for (const s of SAKE) {
      if (!used.has(s.id)) {
        add(s.id, "a versatile pour from our featured rotation.");
        if (picks.length >= 2) break;
      }
    }
  }

  return { pairings: picks.slice(0, 2) };
}

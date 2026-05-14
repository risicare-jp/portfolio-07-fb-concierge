import { useMemo } from "react";
import { toast } from "sonner";
import { dishById } from "@/data/menu";
import { pairForDish } from "@/lib/sake-pairing";

type Props = {
  dishId: string;
  onBack: () => void;
};

export function SakePairing({ dishId, onBack }: Props) {
  const dish = dishById(dishId);
  const result = useMemo(() => (dish ? pairForDish(dish) : null), [dish]);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center justify-between border-b border-cream/10 bg-background/80 px-4 py-2 backdrop-blur">
        <div className="text-[0.65rem] uppercase tracking-[0.2em] text-cream/50">
          Sake Pairing
        </div>
        <button
          onClick={onBack}
          className="text-[0.65rem] uppercase tracking-[0.18em] text-cream/40 hover:text-cream/80"
        >
          Back to chat
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {!dish ? (
          <Bubble>I couldn't find that dish — please ask the Concierge again.</Bubble>
        ) : (
          <>
            <Bubble>Sake pairings for {dish.names.en}:</Bubble>
            {result?.message && <Bubble>{result.message}</Bubble>}
            <div className="space-y-2.5 pl-9">
              {result?.pairings.map(({ sake, rationale }) => (
                <div
                  key={sake.id}
                  className="rounded-lg border border-amber-glow/40 bg-background/60 p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="text-sm text-cream">{sake.names.en}</div>
                      <div className="text-[0.7rem] text-cream/40">
                        {sake.names.ja}
                      </div>
                    </div>
                  </div>
                  <div className="mt-1 text-[0.7rem] uppercase tracking-wider text-cream/50">
                    {sake.brewery} · {sake.prefecture_en} · {sake.category}
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[0.7rem] text-cream/65">
                    <div>SMV: {sake.smv > 0 ? `+${sake.smv}` : sake.smv}</div>
                    <div>ABV: {sake.abv}%</div>
                    <div className="col-span-2">Flavor: {sake.flavor}</div>
                    <div>Glass ${sake.price_glass_cad}</div>
                    <div>Bottle ${sake.price_bottle_cad}</div>
                  </div>
                  <div className="mt-2 border-t border-cream/10 pt-2 text-[0.72rem] leading-relaxed text-cream/80">
                    {rationale}
                  </div>
                </div>
              ))}
            </div>
            {result && result.pairings.length > 0 && (
              <div className="flex flex-wrap items-center justify-end gap-2 pl-9 pt-2">
                <button
                  onClick={() =>
                    toast(
                      "We've noted your sake preference — let your server know when you arrive.",
                    )
                  }
                  className="rounded-full border border-amber-glow/60 px-3 py-1.5 text-xs text-amber-glow transition hover:bg-amber-glow/10"
                >
                  Add a glass to my order
                </button>
                <button
                  onClick={onBack}
                  className="rounded-full bg-amber-glow px-4 py-1.5 text-xs font-medium text-background transition hover:opacity-90"
                >
                  Back to chat
                </button>
              </div>
            )}
          </>
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

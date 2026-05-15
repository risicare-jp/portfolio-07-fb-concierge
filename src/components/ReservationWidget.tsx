import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const TIME_SLOTS_24 = [
  "17:00", "17:30", "18:00", "18:30", "19:00",
  "19:30", "20:00", "20:30", "21:00", "21:30",
];

function to12h(t: string) {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
}

function shiftTime(t: string, deltaMin: number): string {
  const [h, m] = t.split(":").map(Number);
  const total = h * 60 + m + deltaMin;
  const nh = Math.floor(total / 60);
  const nm = total % 60;
  return `${nh.toString().padStart(2, "0")}:${nm.toString().padStart(2, "0")}`;
}

const MAX_TIME = "21:30";

export function ReservationWidget() {
  const { t, locale } = useI18n();
  const is24h = locale !== "en";

  const dates = useMemo(() => {
    const out: { value: string; label: string }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const value = `${d.getFullYear()}-${(d.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
      let label: string;
      if (i === 0) label = t("reserve.today");
      else if (i === 1) label = t("reserve.tomorrow");
      else {
        const localeTag =
          locale === "ja" ? "ja-JP" : locale === "cn" ? "zh-CN" : "en-US";
        label = d.toLocaleDateString(localeTag, {
          weekday: "short",
          month: "short",
          day: "numeric",
        });
      }
      out.push({ value, label });
    }
    return out;
  }, [t, locale]);

  const formatTime = (t24: string) => (is24h ? t24 : to12h(t24));

  const formatDateLabel = (value: string) => {
    const found = dates.find((d) => d.value === value);
    return found?.label ?? value;
  };

  const [date, setDate] = useState(dates[0].value);
  const [time, setTime] = useState("19:00");
  const [party, setParty] = useState(2);
  const [phase, setPhase] = useState<"form" | "loading" | "slots" | "confirmed">(
    "form",
  );
  const [slots, setSlots] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState<string>("");

  const handleFind = () => {
    setPhase("loading");
    setTimeout(() => {
      const s1 = time;
      const s2 = shiftTime(time, 30);
      const wouldExceed = (x: string) => x > MAX_TIME;
      const s3 = wouldExceed(shiftTime(time, 60))
        ? shiftTime(time, -30)
        : shiftTime(time, 60);
      setSlots([s1, s2, s3].filter((x) => x >= "17:00" && x <= MAX_TIME));
      setPhase("slots");
    }, 800);
  };

  const handleSlotClick = (slot: string) => {
    setConfirmed(slot);
    setPhase("confirmed");
  };

  const partyLabel = (n: number) =>
    t(n === 1 ? "reserve.guest_one" : "reserve.guest_many", { n });

  const selectClass =
    "w-full rounded-md border border-border bg-charcoal/60 px-4 py-3 text-sm text-cream focus:border-amber-glow focus:outline-none cursor-pointer";

  if (phase === "confirmed") {
    return (
      <div className="w-full">
        <div className="rounded-md border border-amber-glow/60 bg-charcoal/60 p-8 shadow-glow">
          <div className="mb-4 flex items-center gap-3 text-amber-glow">
            <Check className="h-5 w-5" />
            <h3 className="font-display text-xl text-cream">
              {t("reserve.confirm_heading")}
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-cream/80">
            {t("reserve.confirm_body", {
              time: formatTime(confirmed),
              date: formatDateLabel(date),
              party_size: party,
            })}
          </p>
          <button
            onClick={() => setPhase("form")}
            className="mt-6 text-[0.7rem] uppercase tracking-[0.3em] text-amber-glow transition hover:text-cream"
          >
            ← {t("reserve.confirm_modify")}
          </button>
        </div>
        <p className="mt-4 text-center text-[0.65rem] italic text-cream/40">
          {t("reserve.powered_by")}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-[0.65rem] uppercase tracking-[0.3em] text-cream/60">
            {t("reserve.date_label")}
          </label>
          <select
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={selectClass}
          >
            {dates.map((d) => (
              <option key={d.value} value={d.value} className="bg-charcoal">
                {d.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-[0.65rem] uppercase tracking-[0.3em] text-cream/60">
            {t("reserve.time_label")}
          </label>
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className={selectClass}
          >
            {TIME_SLOTS_24.map((t24) => (
              <option key={t24} value={t24} className="bg-charcoal">
                {formatTime(t24)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-[0.65rem] uppercase tracking-[0.3em] text-cream/60">
            {t("reserve.party_label")}
          </label>
          <select
            value={party}
            onChange={(e) => setParty(Number(e.target.value))}
            className={selectClass}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n} className="bg-charcoal">
                {partyLabel(n)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleFind}
        disabled={phase === "loading"}
        className="mt-6 w-full bg-gradient-amber px-8 py-4 text-[0.7rem] uppercase tracking-[0.35em] text-charcoal shadow-glow transition hover:opacity-90 disabled:opacity-60"
      >
        {phase === "loading" ? t("reserve.searching") : t("reserve.find_times")}
      </button>

      {phase === "slots" && slots.length > 0 && (
        <div className="mt-8">
          <p className="mb-4 text-[0.7rem] uppercase tracking-[0.3em] text-cream/60">
            {t("reserve.available_slots")}
          </p>
          <div className="flex flex-wrap gap-3">
            {slots.map((s) => (
              <button
                key={s}
                onClick={() => handleSlotClick(s)}
                className="rounded-full border border-amber-glow/70 px-6 py-2.5 text-sm text-amber-glow transition hover:bg-amber-glow hover:text-charcoal"
              >
                {formatTime(s)}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="mt-6 text-center text-[0.65rem] italic text-cream/40">
        {t("reserve.powered_by")}
      </p>
    </div>
  );
}

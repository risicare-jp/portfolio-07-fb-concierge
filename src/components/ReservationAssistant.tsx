import { useEffect, useMemo, useState } from "react";
import { useI18n, type Locale } from "@/lib/i18n";

type Props = {
  onClose: () => void;
};

type SeatingKey = "counter" | "table" | "private";

type State = {
  step: number;
  date: string; // ISO YYYY-MM-DD
  time: string; // 24h "HH:MM"
  partySize: number;
  seating: SeatingKey | null;
  name: string;
  email: string;
  phone: string;
  requests: string;
};

const TIME_SLOTS = [
  "17:00", "17:30", "18:00", "18:30", "19:00",
  "19:30", "20:00", "20:30", "21:00", "21:30",
];

const WEEKDAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS_JA = ["日", "月", "火", "水", "木", "金", "土"];
const WEEKDAYS_CN = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

function pad(n: number) { return n < 10 ? "0" + n : "" + n; }

function isoToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function nextNDays(n: number): Date[] {
  const out: Date[] = [];
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  for (let i = 0; i < n; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    out.push(d);
  }
  return out;
}

function formatDateOption(d: Date, idx: number, locale: Locale): string {
  const wd = d.getDay();
  const mo = d.getMonth();
  const dy = d.getDate();
  if (locale === "ja") {
    const base = `${mo + 1}月${dy}日 ${WEEKDAYS_JA[wd]}`;
    if (idx === 0) return `本日 (${base})`;
    if (idx === 1) return `明日 (${base})`;
    return base;
  }
  if (locale === "cn") {
    const base = `${mo + 1}月${dy}日 ${WEEKDAYS_CN[wd]}`;
    if (idx === 0) return `今日 (${base})`;
    if (idx === 1) return `明日 (${base})`;
    return base;
  }
  const base = `${WEEKDAYS_EN[wd]} ${MONTHS_EN[mo]} ${dy}`;
  if (idx === 0) return `Today (${base})`;
  if (idx === 1) return `Tomorrow (${base})`;
  return base;
}

function formatDateLong(iso: string, locale: Locale): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  if (locale === "ja") return `${y}年${m}月${d}日 (${WEEKDAYS_JA[date.getDay()]})`;
  if (locale === "cn") return `${y}年${m}月${d}日 (${WEEKDAYS_CN[date.getDay()]})`;
  return `${WEEKDAYS_EN[date.getDay()]} ${MONTHS_EN[m - 1]} ${d}, ${y}`;
}

function formatTime(t: string, locale: Locale): string {
  if (locale === "en") {
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${pad(m)} ${ampm}`;
  }
  return t;
}

const isValidEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

function generateConfNum(name: string, email: string, iso: string): string {
  const sum = Array.from(name + email).reduce((s, c) => s + c.charCodeAt(0), 0);
  const hash = sum.toString(36).toUpperCase().padStart(4, "0").slice(-4);
  const [y, m, d] = iso.split("-");
  return `HNK-${y.slice(2)}${m}${d}-${hash}`;
}

export function ReservationAssistant({ onClose }: Props) {
  const { t, locale } = useI18n();
  const [state, setState] = useState<State>({
    step: 1,
    date: isoToday(),
    time: "19:00",
    partySize: 2,
    seating: null,
    name: "",
    email: "",
    phone: "",
    requests: "",
  });
  const [confirming, setConfirming] = useState(false);
  const [confNum, setConfNum] = useState<string | null>(null);

  const dates = useMemo(() => nextNDays(14), []);
  const update = (p: Partial<State>) => setState((s) => ({ ...s, ...p }));
  const goto = (step: number) => setState((s) => ({ ...s, step }));

  const seatingOptions: SeatingKey[] = useMemo(() => {
    const opts: SeatingKey[] = [];
    if (state.partySize >= 1 && state.partySize <= 2) opts.push("counter");
    opts.push("table");
    if (state.partySize >= 4 && state.partySize <= 8) opts.push("private");
    return opts;
  }, [state.partySize]);

  const seatingLabel = (s: SeatingKey) => t(`ra.seat.${s}_name`);
  const cancelNote = state.seating === "private" ? t("ra.cancel_note_private") : t("ra.cancel_note");

  const partyText = (n: number) =>
    n === 1 ? t("ra.guest_one").replace("{n}", String(n)) : t("ra.guest_many").replace("{n}", String(n));

  const handleConfirm = () => {
    setConfirming(true);
    setTimeout(() => {
      setConfNum(generateConfNum(state.name, state.email, state.date));
      setConfirming(false);
      goto(8);
    }, 600);
  };

  // Step header (Concierge avatar + prompt)
  const Prompt = ({ children }: { children: React.ReactNode }) => (
    <div className="flex gap-2">
      <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-amber-glow/40 bg-background font-display text-xs text-amber-glow">
        知
      </div>
      <div className="rounded-2xl bg-amber-glow/10 px-3.5 py-2 text-sm leading-relaxed text-cream/90">
        {children}
      </div>
    </div>
  );

  const BackBtn = ({ to }: { to: number }) => (
    <button
      type="button"
      onClick={() => goto(to)}
      className="rounded-full border border-cream/20 px-3.5 py-1.5 text-xs text-cream/70 transition hover:border-amber-glow/60 hover:text-amber-glow"
    >
      {t("ra.back")}
    </button>
  );

  const PrimaryBtn = ({
    children, onClick, disabled, full,
  }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; full?: boolean }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full bg-amber-glow px-4 py-2 text-xs font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 ${full ? "w-full" : ""}`}
    >
      {children}
    </button>
  );

  // Re-validate seating when party size changes
  useEffect(() => {
    if (state.seating && !seatingOptions.includes(state.seating)) {
      update({ seating: null });
    }
  }, [state.partySize]); // eslint-disable-line react-hooks/exhaustive-deps

  const goBack = () => {
    if (state.step <= 1) onClose();
    else goto(state.step - 1);
  };

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <div className="flex items-center justify-between border-b border-cream/10 bg-background/80 px-4 py-2 backdrop-blur">
        <div className="text-[0.65rem] uppercase tracking-[0.2em] text-cream/50">
          {`STEP ${state.step} OF 8`}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="text-[0.65rem] uppercase tracking-[0.18em] text-amber-glow hover:text-amber-glow/80"
          >
            {t("flow.back")}
          </button>
          <button
            onClick={onClose}
            className="text-[0.65rem] uppercase tracking-[0.18em] text-amber-glow hover:text-amber-glow/80"
          >
            {t("flow.exit")}
          </button>
        </div>
      </div>
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 pb-6 pt-4">
        {state.step === 1 && (
          <>
            <Prompt>{t("ra.step1_prompt")}</Prompt>
            <select
              value={state.date}
              onChange={(e) => update({ date: e.target.value })}
              className="w-full rounded-md border border-cream/15 bg-charcoal px-3 py-2 text-sm text-cream focus:border-amber-glow/60 focus:outline-none"
            >
              {dates.map((d, i) => {
                const iso = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
                return <option key={iso} value={iso}>{formatDateOption(d, i, locale)}</option>;
              })}
            </select>
            <PrimaryBtn full onClick={() => goto(2)}>{t("ra.continue")}</PrimaryBtn>
          </>
        )}

        {state.step === 2 && (
          <>
            <Prompt>{t("ra.step2_prompt")}</Prompt>
            <div className="grid grid-cols-4 gap-2">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => update({ time: slot })}
                  className={`rounded-full border px-2 py-1.5 text-xs transition ${
                    state.time === slot
                      ? "border-amber-glow bg-amber-glow text-background"
                      : "border-cream/15 text-cream/80 hover:border-amber-glow/60 hover:text-amber-glow"
                  }`}
                >
                  {formatTime(slot, locale)}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-end gap-2">
              <PrimaryBtn onClick={() => goto(3)}>{t("ra.continue")}</PrimaryBtn>
            </div>
          </>
        )}

        {state.step === 3 && (
          <>
            <Prompt>{t("ra.step3_prompt")}</Prompt>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => { update({ partySize: n }); goto(4); }}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm transition ${
                    state.partySize === n
                      ? "border-amber-glow bg-amber-glow text-background"
                      : "border-cream/15 text-cream/80 hover:border-amber-glow/60 hover:text-amber-glow"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            
          </>
        )}

        {state.step === 4 && (
          <>
            <Prompt>{t("ra.step4_prompt")}</Prompt>
            <div className="space-y-2">
              {seatingOptions.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => { update({ seating: key }); goto(5); }}
                  className={`block w-full rounded-md border p-3 text-left transition ${
                    state.seating === key
                      ? "border-amber-glow bg-amber-glow/10"
                      : "border-cream/15 hover:border-amber-glow/60"
                  }`}
                >
                  <div className="font-display text-sm text-cream">{t(`ra.seat.${key}_name`)}</div>
                  <div className="mt-0.5 text-[0.65rem] uppercase tracking-[0.2em] text-amber-glow/80">
                    {t(`ra.seat.${key}_capacity`)} · {t(`ra.seat.${key}_price`)}
                  </div>
                  <div className="mt-1.5 text-xs leading-relaxed text-cream/70">{t(`ra.seat.${key}_desc`)}</div>
                </button>
              ))}
            </div>
            <div><BackBtn to={3} /></div>
          </>
        )}

        {state.step === 5 && (
          <>
            <Prompt>{t("ra.step5_prompt")}</Prompt>
            <div className="space-y-3">
              <div>
                <label className="block text-[0.65rem] uppercase tracking-[0.2em] text-cream/60">{t("ra.label_name")}</label>
                <input
                  type="text"
                  value={state.name}
                  onChange={(e) => update({ name: e.target.value })}
                  className="mt-1 w-full rounded-md border border-cream/15 bg-transparent px-3 py-2 text-sm text-cream focus:border-amber-glow/60 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[0.65rem] uppercase tracking-[0.2em] text-cream/60">{t("ra.label_email")}</label>
                <input
                  type="email"
                  value={state.email}
                  onChange={(e) => update({ email: e.target.value })}
                  className="mt-1 w-full rounded-md border border-cream/15 bg-transparent px-3 py-2 text-sm text-cream focus:border-amber-glow/60 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[0.65rem] uppercase tracking-[0.2em] text-cream/60">{t("ra.label_phone")}</label>
                <input
                  type="tel"
                  value={state.phone}
                  onChange={(e) => update({ phone: e.target.value })}
                  className="mt-1 w-full rounded-md border border-cream/15 bg-transparent px-3 py-2 text-sm text-cream focus:border-amber-glow/60 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <BackBtn to={4} />
              <PrimaryBtn
                onClick={() => goto(6)}
                disabled={!state.name.trim() || !isValidEmail(state.email.trim())}
              >
                {t("ra.continue")}
              </PrimaryBtn>
            </div>
          </>
        )}

        {state.step === 6 && (
          <>
            <Prompt>{t("ra.step6_prompt")}</Prompt>
            <textarea
              rows={4}
              value={state.requests}
              onChange={(e) => update({ requests: e.target.value })}
              placeholder={t("ra.step6_placeholder")}
              className="w-full rounded-md border border-cream/15 bg-transparent px-3 py-2 text-sm text-cream placeholder:text-cream/40 focus:border-amber-glow/60 focus:outline-none"
            />
            <div className="flex items-center justify-between gap-2">
              <BackBtn to={5} />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { update({ requests: "" }); goto(7); }}
                  className="rounded-full border border-cream/20 px-3.5 py-1.5 text-xs text-cream/70 transition hover:border-amber-glow/60 hover:text-amber-glow"
                >
                  {t("ra.skip")}
                </button>
                <PrimaryBtn onClick={() => goto(7)}>{t("ra.continue")}</PrimaryBtn>
              </div>
            </div>
          </>
        )}

        {state.step === 7 && (
          <>
            <Prompt>{t("ra.step7_prompt")}</Prompt>
            <div className="space-y-1.5 rounded-md border border-amber-glow/30 bg-amber-glow/5 p-3 text-xs text-cream/80">
              <SummaryRow label={t("ra.summary.date")} value={formatDateLong(state.date, locale)} />
              <SummaryRow label={t("ra.summary.time")} value={formatTime(state.time, locale)} />
              <SummaryRow label={t("ra.summary.party")} value={partyText(state.partySize)} />
              <SummaryRow label={t("ra.summary.seating")} value={state.seating ? seatingLabel(state.seating) : ""} />
              <SummaryRow label={t("ra.summary.name")} value={state.name} />
              <SummaryRow label={t("ra.summary.email")} value={state.email} />
              {state.phone && <SummaryRow label={t("ra.summary.phone")} value={state.phone} />}
              {state.requests && <SummaryRow label={t("ra.summary.requests")} value={state.requests} />}
            </div>
            <p className="text-[0.65rem] italic text-cream/50">{cancelNote}</p>
            <div className="flex items-center justify-between gap-2">
              <BackBtn to={6} />
              <PrimaryBtn onClick={handleConfirm} disabled={confirming}>
                {confirming ? t("ra.confirming") : t("ra.confirm")}
              </PrimaryBtn>
            </div>
          </>
        )}

        {state.step === 8 && confNum && (
          <>
            <Prompt>
              <div className="space-y-2">
                <div className="font-display text-base text-amber-glow">{t("ra.result_heading")}</div>
                <div>
                  {t("ra.result_body")
                    .replace("{date}", formatDateLong(state.date, locale))
                    .replace("{time}", formatTime(state.time, locale))
                    .replace("{party_size}", String(state.partySize))
                    .replace("{seating}", state.seating ? seatingLabel(state.seating) : "")
                    .replace("{email}", state.email)}
                </div>
                <div className="rounded-md border border-amber-glow/40 bg-amber-glow/10 px-3 py-2 text-center font-display text-sm text-amber-glow">
                  {t("ra.result_confirmation_num").replace("{conf_num}", confNum)}
                </div>
                <div className="text-xs text-cream/70">{t("ra.result_next_steps")}</div>
                <div className="text-[0.65rem] italic text-cream/40">{t("ra.mock_notice")}</div>
              </div>
            </Prompt>
            <PrimaryBtn full onClick={onClose}>{t("ra.result_close")}</PrimaryBtn>
          </>
        )}
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="shrink-0 text-[0.65rem] uppercase tracking-[0.2em] text-cream/50">{label}</span>
      <span className="text-right text-cream">{value}</span>
    </div>
  );
}

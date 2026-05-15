import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AllergenKey } from "@/data/menu";

export type Locale = "en" | "ja" | "cn";
export const LOCALES: Locale[] = ["en", "ja", "cn"];
const STORAGE_KEY = "tomokos_locale_v1";

type Dict = Record<string, string>;

const en: Dict = {
  "nav.reserve": "Reserve",
  "nav.story": "Story",
  "nav.menu": "Menu",
  "nav.room": "The Room",
  "nav.visit": "Visit",
  "nav.portfolio_note": "↓ Portfolio note",
  "nav.back_to_top": "↑ Back to top",
  "nav.back": "← Back",

  "fullmenu.title": "Full Menu",
  "fullmenu.tab_all": "All",

  "hero.try_concierge": "Try the AI Concierge ↓",
  "concierge.tooltip_hint": "Try the AI Concierge",
  "concierge.proactive": "Need help with allergens, menu, or sake pairing?",

  "hero.subhead": "Vancouver · est. 2009 — Toronto · Spring 2026",
  "hero.wordmark": "HINOKAMI",
  "hero.brand_line": "Toronto",
  "page.title": "HINOKAMI Toronto — A modern izakaya, opening Spring 2026",
  "hero.tagline":
    "A modern izakaya rooted in robata fire, the season's sashimi, and the quiet ritual of pouring sake for a friend.",
  "hero.scroll": "Scroll",

  "story.section_label": "01 — The Story",
  "story.heading_line1": "Sixteen years of fire,",
  "story.heading_line2": "now arriving east.",
  "story.body1":
    "Tomoko Watanabe opened the first HINOKAMI on a quiet Vancouver side street in 2009 with eight seats, a charcoal grill, and a single shelf of sake. Three rooms and a Michelin recommendation later, the philosophy hasn't moved an inch.",
  "story.body2":
    "In 2026, HINOKAMI arrives on King West — a 64-seat room built around the same counter, the same fire, the same insistence that an izakaya is, before anything else, a place to stay a little longer than you planned.",
  "story.quote": "\u201CThe grill is the conversation. Everything else is hospitality.\u201D",
  "story.quote_attribution": "— Tomoko Watanabe, Chef & Owner",

  "menu.section_label": "02 — The Menu",
  "menu.heading_line1": "Three counters,",
  "menu.heading_line2": "one fire.",
  "menu.intro":
    "Choose a stool at the robata, the sashimi counter, or the donabe bar. The menu unfolds differently from each.",
  "menu.view_full": "View Full Menu →",
  "menu.view_robata": "View all Robata dishes (6) →",
  "menu.view_sashimi": "View all sashimi dishes (5) →",
  "menu.view_donabe_sake": "View all Donabe & Sake (6) →",
  "menu.view_drinks": "View all drinks (24) →",

  "spring.section_label": "02B — Spring 2026 Seasonal",
  "spring.heading": "Three dishes, only until the cherry blossoms fall.",
  "spring.image_coming_soon": "Image coming soon",
  "spring.prev": "Previous slide",
  "spring.next": "Next slide",

  "counter.robata.name": "The Robata",
  "counter.robata.tagline":
    "The grill is the conversation. Straw flame, white-oak charcoal, theater of fire.",
  "counter.sashimi.name": "The Counter",
  "counter.sashimi.tagline":
    "Sashimi cut to order. Today's catch from Pacific suppliers, finished by knife.",
  "counter.donabe_sake.name": "Donabe & Sake",
  "counter.donabe_sake.tagline":
    "Clay pot rice, served one portion at a time. 24 bottles, breweries we know.",
  "counter.drinks.name": "Drinks",
  "counter.drinks.tagline":
    "Sake, beer, highballs, Niagara wine, and tea — to match the fire.",

  "modal.close": "Close",
  "modal.counter_label": "Counter",
  "modal.category_label": "Category",
  "modal.origin_label": "Origin",
  "modal.description_label": "Description",
  "modal.flavor_label": "Flavor",
  "modal.abv_label": "ABV",
  "modal.allergens_label": "Allergens",
  "modal.allergens_none": "No notable allergens.",
  "modal.allergens_contains": "Contains",
  "modal.allergens_trace": "Trace",
  "modal.pairings_label": "Recommended pairings",
  "modal.sake_label": "Sake",
  "modal.other_drinks_label": "Other drinks",
  "modal.best_with_label": "Best paired with",
  "modal.glass_label": "Glass",

  "drinks.cat.sake": "Sake",
  "drinks.cat.beer": "Beer",
  "drinks.cat.highball": "Highball",
  "drinks.cat.wine": "Wine",
  "drinks.cat.soft": "Soft & Tea",

  "reserve.interior_caption": "Interior photo coming soon",

  "room.section_label": "03 — Room",
  "room.heading":
    "Lantern light, smoked oak, and a copper hood that has done this before.",
  "room.body":
    "Sixty-four seats arranged around an open robata, a twelve-seat counter overlooking the straw flame, and a private tatami room for eight. Designed by Atelier Ito (Kyoto) with reclaimed Douglas fir from the Vancouver original.",
  "room.stats.seats": "Seats",
  "room.stats.counter": "Counter",
  "room.stats.sake": "Sake labels",

  "visit.section_label": "04 — Visit",
  "visit.heading_line1": "On King West,",
  "visit.heading_line2": "opening Spring 2026.",
  "visit.address_label": "Address",
  "visit.hours_label": "Hours",
  "visit.hours_tuesat": "Tue – Sat · 5pm – late",
  "visit.hours_sun": "Sun · 5pm – 10pm",
  "visit.hours_closed": "Closed Monday",
  "visit.contact_label": "Contact",

  "reserve.heading":
    "The waitlist for opening week is now open. Members of our list receive first access two weeks before public reservations.",
  "reserve.email_placeholder": "your@email.com",
  "reserve.submit_button": "Join Waitlist",
  "reserve.tab_waitlist": "Join Waitlist",
  "reserve.tab_reserve_table": "Reserve a Table",
  "reserve.date_label": "Date",
  "reserve.time_label": "Time",
  "reserve.party_label": "Party size",
  "reserve.find_times": "Find a Time",
  "reserve.searching": "Searching…",
  "reserve.available_slots": "Available times:",
  "reserve.confirm_heading": "Reservation noted",
  "reserve.confirm_body":
    "We've reserved {time} on {date} for {party_size} guests. Please complete details with our hostess on arrival.",
  "reserve.confirm_modify": "Modify reservation",
  "reserve.powered_by": "Powered by OpenTable (mock for demo)",
  "reserve.today": "Today",
  "reserve.tomorrow": "Tomorrow",
  "reserve.guest_one": "{n} guest",
  "reserve.guest_many": "{n} guests",

  "about.section_label": "05 — ABOUT THIS SITE",
  "about.heading": "Built in 1 day with AI.",
  "about.stack_label": "STACK",
  "about.stack_item1": "Lovable (TanStack Start TS)",
  "about.stack_item2": "Anthropic Claude Haiku 4.5",
  "about.stack_item3": "open.er-api.com (FX)",
  "about.cost_label": "COST",
  "about.cost_runs_at": "Runs at ~$50/month",
  "about.cost_vs_agency": "Agency equivalent: $5–15k initial + $200–500/month",
  "about.cap_label": "CAPABILITIES",
  "about.cap_concierge": "AI Concierge (EN/JA/CN auto-detect)",
  "about.cap_allergen": "Allergen check (17 dishes × 14 dimensions)",
  "about.cap_sake": "Sake pairing + Chef's omakase",
  "about.cap_currency": "5-currency in-chat conversion",
  "about.contact_heading": "Want this for your restaurant?",
  "about.contact_body": "Talk to JP about a custom AI build for your venue.",
  "about.contact_email_label": "Email",
  "about.contact_upwork_label": "Upwork",
  "about.contact_github_label": "GitHub",
  "about.contact_coming_soon": "Coming soon",

  "footer.instagram": "Instagram",
  "footer.vancouver": "Vancouver",
  "footer.press": "Press",
  "footer.brand_line": "鎮座ヒノカミ · HINOKAMI",
  "footer.copyright": "© 2026 HINOKAMI RESTAURANT GROUP",

  "concierge.button_tooltip": "Ask the Concierge",
  "concierge.header_title": "AI Concierge",
  "concierge.header_subtitle": "Hours · Menu · Allergens · Pairings",
  "concierge.welcome":
    "Hi — I'm the Concierge for HINOKAMI Toronto. Ask me anything about hours, location, our menu, allergens, or recommendations. I speak English, 日本語, and 中文.",
  "concierge.input_placeholder": "Ask the Concierge…",
  "concierge.typing": "Concierge is typing…",
  "concierge.error_network":
    "I'm having trouble reaching my notes right now — please email us at reserve@hinokami.to and we'll get back to you within a few hours.",
  "concierge.error_unauthorized":
    "Concierge is offline for maintenance — please contact reserve@hinokami.to directly.",
  "concierge.continue_order_assistant": "Continue to Order Assistant →",
  "concierge.continue_sake_pairing": "View Sake Pairing →",
  "concierge.continue_chefs_rec": "Continue to Chef's Recommendation →",
  "concierge.followup": "Anything else I can help with?",

  "oa.exit": "Exit",
  "oa.step_label": "Step {n} of 4 — {step_name}",
  "oa.step1.name": "Party size",
  "oa.step1.prompt": "How many people will be dining? (1–8)",
  "oa.step2.name": "Allergies",
  "oa.step2.prompt": "Person {n}: Any allergies or dietary restrictions?",
  "oa.step2.next_person": "Next person →",
  "oa.step2.see_dishes": "See dishes →",
  "oa.step2.back": "← Back",
  "oa.step2.none": "None",
  "oa.step3.name": "Dish selection",
  "oa.step3.prompt": "Which dishes are you considering?",
  "oa.step3.tab_all": "All",
  "oa.step3.check_allergens": "Check allergens →",
  "oa.step4.name": "Allergen check",
  "oa.step4.intro": "Here's the allergen check for your party:",
  "oa.verdict.safe": "✓ Safe for your party",
  "oa.verdict.trace": "⚠ Trace risk",
  "oa.verdict.contains": "✗ Contains allergens",
  "oa.verdict.consider":
    "Consider {dish} ({price}) — safe for your party.",
  "oa.action.forward": "Forward to kitchen",
  "oa.action.adjust": "Adjust selections",
  "oa.action.done": "Done",
  "oa.forward_toast":
    "We've noted your allergens — please mention them again to your server when you arrive.",
  "oa.person_label": "Person {n}",

  "sp.label": "Sake Pairing",
  "sp.heading": "Sake pairings for {dish}:",
  "sp.glass_label": "Glass",
  "sp.bottle_label": "Bottle",
  "sp.action.add_glass": "Add a glass to my order",
  "sp.action.back_chat": "Back to chat",
  "sp.add_toast":
    "We've noted your sake preference — let your server know when you arrive.",
  "sp.not_found": "I couldn't find that dish — please ask the Concierge again.",

  "cr.step1.name": "Party size",
  "cr.step2.name": "Vibe",
  "cr.step3.name": "Constraints",
  "cr.step4.name": "Course proposal",
  "cr.step1.prompt": "How many people?",
  "cr.step2.prompt": "What's the vibe tonight?",
  "cr.step2.casual": "Casual evening",
  "cr.step2.casual_sub": "3–4 dishes, signature + comfort",
  "cr.step2.sake_focused": "Sake-focused",
  "cr.step2.sake_focused_sub": "4–5 dishes, sake-forward pairings",
  "cr.step2.special": "Special occasion",
  "cr.step2.special_sub": "5–6 dishes, full signature spread",
  "cr.step2.vegan": "Vegan / vegetarian-friendly",
  "cr.step2.vegan_sub": "3–4 plant-forward dishes",
  "cr.step3.prompt": "Any allergies, budget, or constraints?",
  "cr.step3.allergens_label": "Allergens",
  "cr.step3.budget_label": "Budget per person",
  "cr.step3.budget_open": "Open",
  "cr.step3.budget_60": "Under $60",
  "cr.step3.budget_90": "Under $90",
  "cr.step3.budget_120": "Under $120",
  "cr.step3.budget_any": "Any",
  "cr.step3.see_course": "See course →",
  "cr.back": "← Back",
  "cr.step4.heading": "Course for {n} — {vibe}",
  "cr.reason.signature": "Signature — the kitchen's most-told story.",
  "cr.reason.seasonal": "Seasonal ({s}) — fleeting and worth catching.",
  "cr.reason.dessert": "A quiet, sweet finish.",
  "cr.reason.donabe": "Anchors the meal — order early, it cooks slow.",
  "cr.reason.robata": "From the straw flame and white-oak charcoal.",
  "cr.reason.sashimi": "Cut to order at the sashimi counter.",
  "cr.paired_with": "Paired with {sake} · glass {price}",
  "cr.estimate": "Estimated total: {total} · ~{per} per person",
  "cr.action.forward_kitchen": "Forward to kitchen",
  "cr.action.adjust": "Adjust",
  "cr.action.done": "Done",
  "cr.forward_toast":
    "Your suggested course is noted — please confirm with your server.",
};

const ja: Dict = {
  "nav.reserve": "予約",
  "nav.story": "物語",
  "nav.menu": "お品書き",
  "nav.room": "室",
  "nav.visit": "お越しの方へ",
  "nav.portfolio_note": "↓ ポートフォリオ note",
  "nav.back_to_top": "↑ トップへ",
  "nav.back": "← 戻る",

  "fullmenu.title": "お品書き",
  "fullmenu.tab_all": "すべて",

  "hero.try_concierge": "AI コンシェルジュを試す ↓",
  "concierge.tooltip_hint": "AI コンシェルジュを試す",
  "concierge.proactive": "アレルゲン・メニュー・酒のおすすめなど、お気軽にどうぞ。",

  "hero.subhead": "バンクーバー · 2009 創業 — トロント · 2026 春",
  "hero.wordmark": "鎮座ヒノカミ",
  "hero.brand_line": "トロント",
  "page.title": "鎮座ヒノカミ トロント — 2026 春オープンの現代居酒屋",
  "hero.tagline":
    "焚き火の炎、季節の刺身、そして友のために酒を注ぐ静かな儀式に根ざした、現代の居酒屋。",
  "hero.scroll": "スクロール",

  "story.section_label": "01 — 物語",
  "story.heading_line1": "16 年の炎、",
  "story.heading_line2": "いま東へ。",
  "story.body1":
    "渡邊知子は 2009 年、バンクーバーの静かな脇道に最初の鎮座ヒノカミを開きました。8 席、炭火コンロ、酒の棚 1 つから。3 店舗を経てミシュランに名を連ねた今も、哲学は 1 ミリも動いていません。",
  "story.body2":
    "2026 年、鎮座ヒノカミは King West にやってきます。64 席、同じカウンター、同じ炎、そして居酒屋とは何よりもまず「予定より少し長く居たくなる場所」だという同じ信念。",
  "story.quote": "「炭火が会話。それ以外はすべておもてなし。」",
  "story.quote_attribution": "— 渡邊知子、料理長兼オーナー",

  "menu.section_label": "02 — お品書き",
  "menu.heading_line1": "三つのカウンター、",
  "menu.heading_line2": "ひとつの炎。",
  "menu.intro":
    "焚き火、刺身、土鍋。どのカウンターに腰掛けるかで、お品書きはそれぞれ違って広がります。",
  "menu.view_full": "お品書き全文 →",
  "menu.view_robata": "焚き火の全料理を見る (6 品) →",
  "menu.view_sashimi": "刺身の全料理を見る (5 品) →",
  "menu.view_donabe_sake": "土鍋と酒の全料理を見る (6 品) →",
  "menu.view_drinks": "お飲み物 全 24 種を見る →",

  "spring.section_label": "02B — 2026 春 季節限定",
  "spring.heading": "桜が散るまで、たった三品。",
  "spring.image_coming_soon": "画像準備中",
  "spring.prev": "前のスライド",
  "spring.next": "次のスライド",

  "counter.robata.name": "焚き火",
  "counter.robata.tagline":
    "炭火が会話。わらの炎、白オーク備長炭、火の劇場。",
  "counter.sashimi.name": "季節の刺身",
  "counter.sashimi.tagline":
    "刺身は注文ごとにお切りつけ。本日の太平洋産、包丁で仕上げます。",
  "counter.donabe_sake.name": "土鍋と酒",
  "counter.donabe_sake.tagline":
    "土鍋ご飯、1 人前ずつお炊き上げ。24 銘柄、私たちの知る蔵元から。",
  "counter.drinks.name": "お飲み物",
  "counter.drinks.tagline":
    "日本酒・ビール・ハイボール・ナイアガラワイン・お茶 — 炎に寄り添う一杯を。",

  "modal.close": "閉じる",
  "modal.counter_label": "カウンター",
  "modal.category_label": "カテゴリー",
  "modal.origin_label": "産地",
  "modal.description_label": "説明",
  "modal.flavor_label": "風味",
  "modal.abv_label": "アルコール度数",
  "modal.allergens_label": "アレルゲン",
  "modal.allergens_none": "目立ったアレルゲンなし。",
  "modal.allergens_contains": "含有",
  "modal.allergens_trace": "微量",
  "modal.pairings_label": "おすすめペアリング",
  "modal.sake_label": "日本酒",
  "modal.other_drinks_label": "その他のドリンク",
  "modal.best_with_label": "相性の良い料理",
  "modal.glass_label": "グラス",

  "drinks.cat.sake": "日本酒",
  "drinks.cat.beer": "ビール",
  "drinks.cat.highball": "ハイボール",
  "drinks.cat.wine": "ワイン",
  "drinks.cat.soft": "ソフト & 茶",

  "reserve.interior_caption": "店内写真 準備中",

  "room.section_label": "03 — 室",
  "room.heading":
    "提灯の明かり、燻されたオーク、そして見覚えのある銅製の煙突。",
  "room.body":
    "オープン焚き火を囲む 64 席、わら炎を見下ろす 12 席カウンター、8 人用個室の畳の間。京都のアトリエ伊藤による設計、バンクーバー本店から運んだ古材のダグラスファーを使用。",
  "room.stats.seats": "席",
  "room.stats.counter": "カウンター",
  "room.stats.sake": "銘柄の酒",

  "visit.section_label": "04 — お越しの方へ",
  "visit.heading_line1": "King West にて、",
  "visit.heading_line2": "2026 年春オープン。",
  "visit.address_label": "住所",
  "visit.hours_label": "営業時間",
  "visit.hours_tuesat": "火 – 土 · 17:00 – 深夜",
  "visit.hours_sun": "日 · 17:00 – 22:00",
  "visit.hours_closed": "月曜定休",
  "visit.contact_label": "連絡先",

  "reserve.heading":
    "オープニングウィークのウェイトリストを受付中。リストメンバーには、一般予約の 2 週間前から先行アクセスをご案内します。",
  "reserve.email_placeholder": "メールアドレス",
  "reserve.submit_button": "ウェイトリストに参加",
  "reserve.tab_waitlist": "ウェイトリストに参加",
  "reserve.tab_reserve_table": "テーブルを予約",
  "reserve.date_label": "日付",
  "reserve.time_label": "時間",
  "reserve.party_label": "人数",
  "reserve.find_times": "空き時間を探す",
  "reserve.searching": "検索中…",
  "reserve.available_slots": "空き時間:",
  "reserve.confirm_heading": "予約承りました",
  "reserve.confirm_body":
    "{date} の {time} に {party_size} 名様でご予約を承りました。ご来店時にスタッフとお手続きを完了させてください。",
  "reserve.confirm_modify": "予約を変更",
  "reserve.powered_by": "OpenTable 提供 (デモ用 mock)",
  "reserve.today": "今日",
  "reserve.tomorrow": "明日",
  "reserve.guest_one": "{n} 名",
  "reserve.guest_many": "{n} 名",

  "about.section_label": "05 — このサイトについて",
  "about.heading": "AI で 1 日で制作。",
  "about.stack_label": "スタック",
  "about.stack_item1": "Lovable (TanStack Start TS)",
  "about.stack_item2": "Anthropic Claude Haiku 4.5",
  "about.stack_item3": "open.er-api.com (為替)",
  "about.cost_label": "コスト",
  "about.cost_runs_at": "月額 約 $50 で運用",
  "about.cost_vs_agency": "エージェンシー相当: 初期 $5–15k + 月 $200–500",
  "about.cap_label": "実装機能",
  "about.cap_concierge": "AI コンシェルジュ (EN/JA/CN 自動検出)",
  "about.cap_allergen": "アレルゲン check (17 品 × 14 次元)",
  "about.cap_sake": "酒ペアリング + シェフのおすすめ",
  "about.cap_currency": "5 通貨 チャット内換算",
  "about.contact_heading": "レストラン経営の方へ",
  "about.contact_body": "カスタム AI 実装について JP までお問い合わせください。",
  "about.contact_email_label": "Email",
  "about.contact_upwork_label": "Upwork",
  "about.contact_github_label": "GitHub",
  "about.contact_coming_soon": "近日公開",

  "footer.instagram": "Instagram",
  "footer.vancouver": "バンクーバー",
  "footer.press": "プレス",
  "footer.brand_line": "鎮座ヒノカミ · HINOKAMI",
  "footer.copyright": "© 2026 鎮座ヒノカミ レストラングループ",

  "concierge.button_tooltip": "コンシェルジュに聞く",
  "concierge.header_title": "AI コンシェルジュ",
  "concierge.header_subtitle": "営業時間 · メニュー · アレルゲン · ペアリング",
  "concierge.welcome":
    "こんにちは。鎮座ヒノカミ トロントのコンシェルジュです。営業時間、所在地、メニュー、アレルゲン、おすすめなど、何でもお尋ねください。English / 日本語 / 中文 対応。",
  "concierge.input_placeholder": "コンシェルジュに尋ねる…",
  "concierge.typing": "コンシェルジュが入力中…",
  "concierge.error_network":
    "ただいま情報源に接続できません。reserve@hinokami.to までご連絡いただければ、数時間以内にお返事いたします。",
  "concierge.error_unauthorized":
    "コンシェルジュは現在メンテナンス中です。reserve@hinokami.to まで直接ご連絡ください。",
  "concierge.continue_order_assistant": "アレルゲンチェックへ →",
  "concierge.continue_sake_pairing": "おすすめの酒を見る →",
  "concierge.continue_chefs_rec": "シェフのおすすめへ →",
  "concierge.followup": "他にお手伝いできることはございますか?",

  "oa.exit": "終了",
  "oa.step_label": "ステップ {n} / 4 — {step_name}",
  "oa.step1.name": "ご人数",
  "oa.step1.prompt": "何名様でしょうか? (1–8 名)",
  "oa.step2.name": "アレルギー",
  "oa.step2.prompt": "{n} 番目の方: アレルギーや食事制限はございますか?",
  "oa.step2.next_person": "次の方 →",
  "oa.step2.see_dishes": "料理を見る →",
  "oa.step2.back": "← 戻る",
  "oa.step2.none": "なし",
  "oa.step3.name": "料理選択",
  "oa.step3.prompt": "ご検討中の料理は?",
  "oa.step3.tab_all": "すべて",
  "oa.step3.check_allergens": "アレルゲンを確認 →",
  "oa.step4.name": "アレルゲン確認",
  "oa.step4.intro": "ご一行様のアレルゲン確認結果です:",
  "oa.verdict.safe": "✓ ご一行様に安全",
  "oa.verdict.trace": "⚠ 微量混入リスク",
  "oa.verdict.contains": "✗ アレルゲン含有",
  "oa.verdict.consider": "{dish} ({price}) はご一行様に安全です。",
  "oa.action.forward": "キッチンに伝える",
  "oa.action.adjust": "選択を変更",
  "oa.action.done": "完了",
  "oa.forward_toast":
    "アレルゲン情報を承りました。ご来店時にスタッフへ改めてお伝えください。",
  "oa.person_label": "{n} 番目の方",

  "sp.label": "酒のおすすめ",
  "sp.heading": "{dish} におすすめの酒:",
  "sp.glass_label": "グラス",
  "sp.bottle_label": "ボトル",
  "sp.action.add_glass": "グラスを追加",
  "sp.action.back_chat": "チャットに戻る",
  "sp.add_toast":
    "お酒のご希望を承りました。ご来店時にスタッフへお伝えください。",
  "sp.not_found": "そのお料理が見つかりませんでした — もう一度コンシェルジュにお尋ねください。",

  "cr.step1.name": "ご人数",
  "cr.step2.name": "雰囲気",
  "cr.step3.name": "ご希望",
  "cr.step4.name": "コース提案",
  "cr.step1.prompt": "何名様?",
  "cr.step2.prompt": "今夜の雰囲気は?",
  "cr.step2.casual": "カジュアル",
  "cr.step2.casual_sub": "3–4 品、看板 + 寛ぎ",
  "cr.step2.sake_focused": "酒を中心に",
  "cr.step2.sake_focused_sub": "4–5 品、酒に寄り添うペアリング",
  "cr.step2.special": "特別な日",
  "cr.step2.special_sub": "5–6 品、看板を一通り",
  "cr.step2.vegan": "ヴィーガン・ベジタリアン対応",
  "cr.step2.vegan_sub": "3–4 品、植物中心",
  "cr.step3.prompt": "アレルギーやご予算などのご希望は?",
  "cr.step3.allergens_label": "アレルゲン",
  "cr.step3.budget_label": "お 1 人様あたりのご予算",
  "cr.step3.budget_open": "指定なし",
  "cr.step3.budget_60": "$60 以下",
  "cr.step3.budget_90": "$90 以下",
  "cr.step3.budget_120": "$120 以下",
  "cr.step3.budget_any": "こだわらない",
  "cr.step3.see_course": "コースを見る →",
  "cr.back": "← 戻る",
  "cr.step4.heading": "{n} 名様の {vibe} コース",
  "cr.reason.signature": "看板の一皿 — 厨房が最も語る物語。",
  "cr.reason.seasonal": "季節 ({s}) — はかなく、今だけの味。",
  "cr.reason.dessert": "静かで甘い締めくくり。",
  "cr.reason.donabe": "食事の軸 — ゆっくり炊くので、最初にご注文を。",
  "cr.reason.robata": "わらの炎と白オーク備長炭から。",
  "cr.reason.sashimi": "刺身カウンターで注文ごとにお切りつけ。",
  "cr.paired_with": "{sake} と合わせて · グラス {price}",
  "cr.estimate": "概算合計: {total} · お 1 人様 約 {per}",
  "cr.action.forward_kitchen": "キッチンに伝える",
  "cr.action.adjust": "調整",
  "cr.action.done": "完了",
  "cr.forward_toast":
    "コースのご希望を承りました。ご来店時にスタッフへご確認ください。",
};

const cn: Dict = {
  "nav.reserve": "预订",
  "nav.story": "故事",
  "nav.menu": "菜单",
  "nav.room": "室内",
  "nav.visit": "到访",
  "nav.portfolio_note": "↓ 作品介绍",
  "nav.back_to_top": "↑ 返回顶部",
  "nav.back": "← 返回",

  "fullmenu.title": "菜单",
  "fullmenu.tab_all": "全部",

  "hero.try_concierge": "试用 AI 礼宾 ↓",
  "concierge.tooltip_hint": "试用 AI 礼宾",
  "concierge.proactive": "过敏原、菜单、清酒搭配 — 欢迎询问。",

  "hero.subhead": "温哥华 · 2009 创立 — 多伦多 · 2026 春",
  "hero.wordmark": "镇座火神",
  "hero.brand_line": "多伦多",
  "page.title": "镇座火神 多伦多 — 2026 春开业的现代居酒屋",
  "hero.tagline":
    "扎根于焚火炉、当季刺身，与为友人斟酒之静谧仪式的现代居酒屋。",
  "hero.scroll": "向下滚动",

  "story.section_label": "01 — 故事",
  "story.heading_line1": "十六年炉火，",
  "story.heading_line2": "东渡而来。",
  "story.body1":
    "渡边知子于2009年在温哥华一条静谧的小巷开设了第一家镇座火神——8个座位、一座炭火炉、一柜清酒。三家分店与米其林推荐之后，理念未曾偏移分毫。",
  "story.body2":
    "2026年，镇座火神来到King West街——64个座位，同样的吧台，同样的炉火，同样坚信：居酒屋首先是一处让你不知不觉多待片刻的所在。",
  "story.quote": "\u201C炉火即对话。其余皆是款待。\u201D",
  "story.quote_attribution": "—— 渡边知子，主厨兼店主",

  "menu.section_label": "02 — 菜单",
  "menu.heading_line1": "三处吧台，",
  "menu.heading_line2": "一炉火焰。",
  "menu.intro":
    "在焚火炉、刺身吧台或土锅吧台之间择一落座。从每一处展开的菜单，皆有不同的风景。",
  "menu.view_full": "完整菜单 →",

  "spring.section_label": "02B — 2026 春 季节限定",
  "spring.heading": "仅至樱花飘落之时，三道菜。",
  "spring.image_coming_soon": "图片即将上传",
  "spring.prev": "上一张",
  "spring.next": "下一张",

  "counter.robata.name": "焚火炉",
  "counter.robata.tagline": "炉火即对话。稻草烈焰、白橡备长炭，火之剧场。",
  "counter.sashimi.name": "季节刺身",
  "counter.sashimi.tagline": "刺身现点现切。今日太平洋渔获，以刀工完成。",
  "counter.donabe_sake.name": "土锅与清酒",
  "counter.donabe_sake.tagline":
    "土锅米饭，每次只为一位炊煮。24 款，皆来自我们熟识的酒造。",
  "counter.drinks.name": "饮品",
  "counter.drinks.tagline":
    "清酒、啤酒、Highball、尼亚加拉葡萄酒、茶 — 与炉火相伴的一杯。",

  "modal.close": "关闭",
  "modal.counter_label": "吧台",
  "modal.category_label": "类别",
  "modal.origin_label": "产地",
  "modal.description_label": "描述",
  "modal.flavor_label": "风味",
  "modal.abv_label": "酒精度",
  "modal.allergens_label": "过敏原",
  "modal.allergens_none": "无显著过敏原。",
  "modal.allergens_contains": "含",
  "modal.allergens_trace": "微量",
  "modal.pairings_label": "推荐搭配",
  "modal.sake_label": "清酒",
  "modal.other_drinks_label": "其他饮品",
  "modal.best_with_label": "最佳搭配",
  "modal.glass_label": "单杯",

  "drinks.cat.sake": "清酒",
  "drinks.cat.beer": "啤酒",
  "drinks.cat.highball": "Highball",
  "drinks.cat.wine": "葡萄酒",
  "drinks.cat.soft": "软饮 & 茶",

  "reserve.interior_caption": "店内照片 即将上传",

  "room.section_label": "03 — 室内",
  "room.heading": "灯笼之光、烟熏橡木，与一座做过同样工作的铜烟罩。",
  "room.body":
    "64个座位环绕开放式焚火炉，12个座位的吧台俯瞰稻草烈焰，外加可容8人的私人榻榻米房间。由京都Atelier伊藤设计，使用温哥华本店回收的花旗松木。",
  "room.stats.seats": "座位",
  "room.stats.counter": "吧台",
  "room.stats.sake": "款清酒",

  "visit.section_label": "04 — 到访",
  "visit.heading_line1": "落户 King West，",
  "visit.heading_line2": "2026 年春开业。",
  "visit.address_label": "地址",
  "visit.hours_label": "营业时间",
  "visit.hours_tuesat": "周二 – 周六 · 17:00 – 深夜",
  "visit.hours_sun": "周日 · 17:00 – 22:00",
  "visit.hours_closed": "周一休息",
  "visit.contact_label": "联系方式",

  "reserve.heading":
    "开业首周等候名单现已开放。名单成员将获得比公开预订提前两周的优先访问。",
  "reserve.email_placeholder": "邮箱地址",
  "reserve.submit_button": "加入等候名单",
  "reserve.tab_waitlist": "加入等候名单",
  "reserve.tab_reserve_table": "预订餐桌",
  "reserve.date_label": "日期",
  "reserve.time_label": "时间",
  "reserve.party_label": "人数",
  "reserve.find_times": "查找时间",
  "reserve.searching": "搜索中…",
  "reserve.available_slots": "可用时间:",
  "reserve.confirm_heading": "已记录预订",
  "reserve.confirm_body":
    "我们已为您预订 {date} {time}，共 {party_size} 位。请到店时与接待员完成登记。",
  "reserve.confirm_modify": "修改预订",
  "reserve.powered_by": "由 OpenTable 提供 (演示用 mock)",
  "reserve.today": "今天",
  "reserve.tomorrow": "明天",
  "reserve.guest_one": "{n} 位",
  "reserve.guest_many": "{n} 位",

  "about.section_label": "05 — 关于本站",
  "about.heading": "由 AI 在 1 天内打造。",
  "about.stack_label": "技术栈",
  "about.stack_item1": "Lovable (TanStack Start TS)",
  "about.stack_item2": "Anthropic Claude Haiku 4.5",
  "about.stack_item3": "open.er-api.com (汇率)",
  "about.cost_label": "成本",
  "about.cost_runs_at": "月运行成本约 $50",
  "about.cost_vs_agency": "代理公司同等: 首期 $5–15k + 每月 $200–500",
  "about.cap_label": "实现的功能",
  "about.cap_concierge": "AI 礼宾 (EN/JA/CN 自动检测)",
  "about.cap_allergen": "过敏原检查 (17 道菜 × 14 项)",
  "about.cap_sake": "清酒搭配 + 主厨推荐",
  "about.cap_currency": "5 种货币 聊天内换算",
  "about.contact_heading": "餐厅经营者",
  "about.contact_body": "联系 JP 为您的餐厅定制 AI 实装。",
  "about.contact_email_label": "邮箱",
  "about.contact_upwork_label": "Upwork",
  "about.contact_github_label": "GitHub",
  "about.contact_coming_soon": "即将推出",

  "footer.instagram": "Instagram",
  "footer.vancouver": "温哥华",
  "footer.press": "媒体",
  "footer.brand_line": "鎮座ヒノカミ · HINOKAMI",
  "footer.copyright": "© 2026 镇座火神 餐饮集团",

  "concierge.button_tooltip": "询问礼宾",
  "concierge.header_title": "AI 礼宾",
  "concierge.header_subtitle": "营业时间 · 菜单 · 过敏原 · 搭配",
  "concierge.welcome":
    "您好，我是镇座火神 多伦多的礼宾。营业时间、地址、菜单、过敏原或推荐，请随时询问。我能以 English / 日本語 / 中文 回应。",
  "concierge.input_placeholder": "询问礼宾…",
  "concierge.typing": "礼宾正在输入…",
  "concierge.error_network":
    "我现在无法访问资料库。请发邮件至 reserve@hinokami.to，我们将在数小时内回复您。",
  "concierge.error_unauthorized":
    "礼宾正在维护中。请直接联系 reserve@hinokami.to。",
  "concierge.continue_order_assistant": "继续至点单助手 →",
  "concierge.continue_sake_pairing": "查看推荐清酒 →",
  "concierge.continue_chefs_rec": "继续至主厨推荐 →",
  "concierge.followup": "还有什么可以帮您的吗?",

  "oa.exit": "退出",
  "oa.step_label": "步骤 {n} / 4 — {step_name}",
  "oa.step1.name": "用餐人数",
  "oa.step1.prompt": "请问几位用餐? (1–8 位)",
  "oa.step2.name": "过敏原",
  "oa.step2.prompt": "第 {n} 位: 有什么过敏或饮食限制吗?",
  "oa.step2.next_person": "下一位 →",
  "oa.step2.see_dishes": "查看菜单 →",
  "oa.step2.back": "← 返回",
  "oa.step2.none": "无",
  "oa.step3.name": "选择菜品",
  "oa.step3.prompt": "您考虑哪些菜品?",
  "oa.step3.tab_all": "全部",
  "oa.step3.check_allergens": "检查过敏原 →",
  "oa.step4.name": "过敏原检查",
  "oa.step4.intro": "这是您方的过敏原检查结果:",
  "oa.verdict.safe": "✓ 您方安全",
  "oa.verdict.trace": "⚠ 微量混入风险",
  "oa.verdict.contains": "✗ 含过敏原",
  "oa.verdict.consider": "可考虑 {dish} ({price}) — 您方安全。",
  "oa.action.forward": "告知厨房",
  "oa.action.adjust": "调整选择",
  "oa.action.done": "完成",
  "oa.forward_toast":
    "已记录您的过敏原。请到店时再次告知服务员。",
  "oa.person_label": "第 {n} 位",

  "sp.label": "清酒搭配",
  "sp.heading": "{dish} 的推荐清酒:",
  "sp.glass_label": "单杯",
  "sp.bottle_label": "整瓶",
  "sp.action.add_glass": "加点单杯",
  "sp.action.back_chat": "返回聊天",
  "sp.add_toast":
    "已记录您的清酒偏好。请到店时告知服务员。",
  "sp.not_found": "未找到该菜品 — 请再次询问礼宾。",

  "cr.step1.name": "用餐人数",
  "cr.step2.name": "氛围",
  "cr.step3.name": "要求",
  "cr.step4.name": "套餐建议",
  "cr.step1.prompt": "几位?",
  "cr.step2.prompt": "今晚的氛围?",
  "cr.step2.casual": "轻松小聚",
  "cr.step2.casual_sub": "3–4 道，招牌 + 安心之味",
  "cr.step2.sake_focused": "以清酒为主",
  "cr.step2.sake_focused_sub": "4–5 道，酒为主轴搭配",
  "cr.step2.special": "特别场合",
  "cr.step2.special_sub": "5–6 道，招牌全谱",
  "cr.step2.vegan": "素食 / 纯素友好",
  "cr.step2.vegan_sub": "3–4 道，以植物为主",
  "cr.step3.prompt": "有过敏、预算或其他要求吗?",
  "cr.step3.allergens_label": "过敏原",
  "cr.step3.budget_label": "每位预算",
  "cr.step3.budget_open": "不限",
  "cr.step3.budget_60": "$60 以下",
  "cr.step3.budget_90": "$90 以下",
  "cr.step3.budget_120": "$120 以下",
  "cr.step3.budget_any": "任意",
  "cr.step3.see_course": "查看套餐 →",
  "cr.back": "← 返回",
  "cr.step4.heading": "{n} 位 — {vibe} 套餐",
  "cr.reason.signature": "招牌 — 厨房最常讲述的故事。",
  "cr.reason.seasonal": "时令 ({s}) — 转瞬即逝，值得一尝。",
  "cr.reason.dessert": "静谧而甜美的收尾。",
  "cr.reason.donabe": "全餐之轴 — 慢炊，请先点。",
  "cr.reason.robata": "来自稻草烈焰与白橡备长炭。",
  "cr.reason.sashimi": "刺身吧台现点现切。",
  "cr.paired_with": "搭配 {sake} · 单杯 {price}",
  "cr.estimate": "估算总计: {total} · 每位约 {per}",
  "cr.action.forward_kitchen": "告知厨房",
  "cr.action.adjust": "调整",
  "cr.action.done": "完成",
  "cr.forward_toast":
    "已记录您的建议套餐。请到店时与服务员确认。",
};

const TABLE: Record<Locale, Dict> = { en, ja, cn };

export const ALLERGEN_LABELS_I18N: Record<Locale, Record<AllergenKey, string>> = {
  en: {
    soy: "Soy", egg: "Egg", fish_egg: "Fish Eggs", seafood: "Seafood",
    shellfish: "Shellfish", dairy: "Dairy", gluten: "Gluten", sesame: "Sesame",
    pork: "Pork", beef: "Beef", onion: "Onion", garlic: "Garlic",
    alcohol: "Alcohol", nut: "Nuts",
  },
  ja: {
    soy: "大豆", egg: "卵", fish_egg: "魚卵", seafood: "魚介",
    shellfish: "甲殻類", dairy: "乳製品", gluten: "グルテン", sesame: "ごま",
    pork: "豚", beef: "牛", onion: "玉ねぎ", garlic: "にんにく",
    alcohol: "アルコール", nut: "ナッツ",
  },
  cn: {
    soy: "大豆", egg: "鸡蛋", fish_egg: "鱼籽", seafood: "海鲜",
    shellfish: "贝类", dairy: "乳制品", gluten: "麸质", sesame: "芝麻",
    pork: "猪肉", beef: "牛肉", onion: "洋葱", garlic: "大蒜",
    alcohol: "酒精", nut: "坚果",
  },
};

function interpolate(s: string, vars?: Record<string, string | number>) {
  if (!vars) return s;
  return s.replace(/\{(\w+)\}/g, (_, k) =>
    vars[k] !== undefined ? String(vars[k]) : `{${k}}`,
  );
}

type I18nCtx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && (LOCALES as string[]).includes(stored)) {
        setLocaleState(stored as Locale);
      }
    } catch {
      /* noop */
    }
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const title = TABLE[locale]["page.title"] ?? TABLE.en["page.title"];
    if (title) document.title = title;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* noop */
    }
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const dict = TABLE[locale];
      const raw = dict[key] ?? TABLE.en[key] ?? key;
      return interpolate(raw, vars);
    },
    [locale],
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n(): I18nCtx {
  const ctx = useContext(Ctx);
  if (ctx) return ctx;
  return {
    locale: "en",
    setLocale: () => {},
    t: (k, v) => interpolate(TABLE.en[k] ?? k, v),
  };
}

export function pickLocalized(
  field: { en: string; ja: string; cn: string },
  locale: Locale,
): string {
  return field[locale] ?? field.en;
}

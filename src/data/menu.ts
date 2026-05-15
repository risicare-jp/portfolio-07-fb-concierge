export type AllergenKey =
  | "soy"
  | "egg"
  | "fish_egg"
  | "seafood"
  | "shellfish"
  | "dairy"
  | "gluten"
  | "sesame"
  | "pork"
  | "beef"
  | "onion"
  | "garlic"
  | "alcohol"
  | "nut";

export type Verdict = "safe" | "contains" | "trace";

export type Dish = {
  id: string;
  counter: "robata" | "sashimi" | "donabe" | "sides_sweets";
  names: { en: string; ja: string; cn: string };
  price_cad: number;
  descriptions: { en: string; ja: string; cn: string };
  allergens: Record<AllergenKey, Verdict>;
  balance_partners: { mode_balance: string[]; mode_echo: string[] };
  is_signature?: boolean;
  is_seasonal?: string;
  is_vegan_capable?: boolean;
  is_dessert?: boolean;
};

export const ALLERGEN_LABELS: Record<AllergenKey, string> = {
  soy: "Soy",
  egg: "Egg",
  fish_egg: "Fish Eggs",
  seafood: "Seafood",
  shellfish: "Shellfish",
  dairy: "Dairy",
  gluten: "Gluten",
  sesame: "Sesame",
  pork: "Pork",
  beef: "Beef",
  onion: "Onion",
  garlic: "Garlic",
  alcohol: "Alcohol",
  nut: "Nuts",
};

export const ALLERGEN_KEYS: AllergenKey[] = [
  "soy",
  "egg",
  "fish_egg",
  "seafood",
  "shellfish",
  "dairy",
  "gluten",
  "sesame",
  "pork",
  "beef",
  "onion",
  "garlic",
  "alcohol",
  "nut",
];

export const COUNTERS = [
  { id: "robata" as const, name_en: "The Robata", name_ja: "焚き火" },
  { id: "sashimi" as const, name_en: "The Counter", name_ja: "季節の刺身" },
  { id: "donabe" as const, name_en: "Donabe", name_ja: "土鍋" },
  { id: "sides_sweets" as const, name_en: "Sides & Sweets", name_ja: "小料理 & デザート" },
];

export const MENU: Dish[] = [
  {"id":"dish-001","counter":"robata","names":{"en":"Straw-Flame Bonito Tataki","ja":"わら焼き 戻り鰹のたたき","cn":"稻草烟熏 秋鲣刺身"},"price_cad":26,"descriptions":{"en":"Pacific bonito seared over a pillar of burning rice straw at the counter — smoke-perfumed exterior, ruby-rare interior. Finished with sea salt, ginger, and Tosa-style ponzu.","ja":"目の前で立ち上るわらの炎で炙る戻り鰹。香ばしい焦げ目とレア中心。海塩・生姜・土佐ポン酢で。","cn":"于客席前以稻草烈焰瞬间炙烤的秋鲣。外香里嫩，佐海盐、生姜与土佐风橘醋。"},"allergens":{"soy":"contains","egg":"safe","fish_egg":"safe","seafood":"contains","shellfish":"trace","dairy":"safe","gluten":"contains","sesame":"trace","pork":"safe","beef":"safe","onion":"trace","garlic":"trace","alcohol":"trace","nut":"safe"},"balance_partners":{"mode_balance":["dish-012","dish-014"],"mode_echo":["dish-004"]},"is_signature":true},
  {"id":"dish-002","counter":"robata","names":{"en":"Spring Charcoal Robata Vegetables — 5 Today","ja":"備長炭 春野菜 五種盛り","cn":"备长炭 春日蔬菜五种"},"price_cad":18,"descriptions":{"en":"Five spring vegetables grilled over white-oak binchotan. Spring 2026: Ontario fiddlehead, ramps (wild leek), asparagus, morel mushroom, taranome (Japanese aralia bud) — smoked sea salt and yuzu.","ja":"備長炭で炙る春野菜五種。2026春: オンタリオ・フィドルヘッド、ランプス(野生ニラ)、アスパラ、モリーユ茸、たらの芽。燻製塩と柚子で。","cn":"备长炭烤春日蔬菜五种。2026春: 安大略蕨菜、野生韭葱、芦笋、羊肚菌、楤木芽。烟熏盐佐柚子。"},"allergens":{"soy":"safe","egg":"safe","fish_egg":"safe","seafood":"safe","shellfish":"safe","dairy":"safe","gluten":"safe","sesame":"safe","pork":"safe","beef":"safe","onion":"contains","garlic":"trace","alcohol":"safe","nut":"safe"},"balance_partners":{"mode_balance":["dish-006","dish-013"],"mode_echo":["dish-005"]},"is_signature":false,"is_seasonal":"spring","is_vegan_capable":true},
  {"id":"dish-003","counter":"robata","names":{"en":"Straw-Flame Sablefish Saikyo-yaki","ja":"わら焼き 銀ダラ西京焼き","cn":"稻草炙烤 银鳕鱼西京烧"},"price_cad":32,"descriptions":{"en":"Black cod marinated 72 hours in Kyoto white miso, finished briefly over straw flame to lacquer the surface. Buttery, sweet-savory, deeply Kyoto.","ja":"72時間 京都白味噌に漬け込んだ銀ダラを、最後にわら炎で香り付け。とろける身、甘塩のコク。","cn":"京都白味噌腌渍72小时的银鳕鱼，最后以稻草火焰增添香气。入口即化，甜咸深邃。"},"allergens":{"soy":"contains","egg":"safe","fish_egg":"safe","seafood":"contains","shellfish":"trace","dairy":"safe","gluten":"contains","sesame":"trace","pork":"safe","beef":"safe","onion":"safe","garlic":"safe","alcohol":"contains","nut":"safe"},"balance_partners":{"mode_balance":["dish-008","dish-012"],"mode_echo":["dish-006"]},"is_signature":false},
  {"id":"dish-004","counter":"robata","names":{"en":"Binchotan Tajima Chicken Thigh","ja":"備長炭 但馬鶏もも炭火焼き","cn":"备长炭 但马鸡腿炭火烧"},"price_cad":21,"descriptions":{"en":"Tajima heritage chicken thigh, salt only, over white-oak charcoal. Crisp skin, juicy meat, sansho pepper on the side.","ja":"但馬鶏のもも肉、塩のみで備長炭焼き。皮はパリッ、肉はジューシー、添えは山椒。","cn":"但马鸡腿，仅以盐调味，备长炭烧制。皮脆肉嫩，佐山椒。"},"allergens":{"soy":"safe","egg":"safe","fish_egg":"safe","seafood":"trace","shellfish":"trace","dairy":"safe","gluten":"safe","sesame":"safe","pork":"trace","beef":"trace","onion":"safe","garlic":"safe","alcohol":"safe","nut":"safe"},"balance_partners":{"mode_balance":["dish-007","dish-010"],"mode_echo":["dish-001"]},"is_signature":false},
  {"id":"dish-005","counter":"robata","names":{"en":"Straw-Flame Hokkaido Scallop, Nori Butter","ja":"わら焼き 北海道帆立 海苔バター","cn":"稻草炙烤 北海道扇贝 海苔黄油"},"price_cad":24,"descriptions":{"en":"Single large Hokkaido scallop, straw-flamed to caramelize the edges, finished with nori-infused brown butter.","ja":"北海道産大粒帆立を1個丸ごとわら焼きに。淵をキャラメリゼ、海苔バターで仕上げ。","cn":"北海道大颗扇贝整颗稻草炙烤，边缘焦糖化，佐海苔焦化黄油。"},"allergens":{"soy":"trace","egg":"safe","fish_egg":"safe","seafood":"contains","shellfish":"contains","dairy":"contains","gluten":"trace","sesame":"safe","pork":"safe","beef":"safe","onion":"safe","garlic":"safe","alcohol":"safe","nut":"safe"},"balance_partners":{"mode_balance":["dish-002","dish-013"],"mode_echo":["dish-009"]},"is_signature":false},
  {"id":"dish-006","counter":"robata","names":{"en":"Charcoal Thick-Cut Beef Tongue","ja":"備長炭 焚き火 厚切り牛タン","cn":"备长炭 厚切牛舌"},"price_cad":28,"descriptions":{"en":"Two thick rounds of beef tongue, salt-aged 48 hours, charred deep over binchotan. Squeeze of lemon, side of negi-shio.","ja":"塩で48時間寝かせた牛タン厚切り2枚を備長炭で深く炙る。レモンとネギ塩で。","cn":"盐渍48小时的厚切牛舌两片，备长炭深炙。佐柠檬与葱盐。"},"allergens":{"soy":"safe","egg":"safe","fish_egg":"safe","seafood":"trace","shellfish":"trace","dairy":"safe","gluten":"safe","sesame":"safe","pork":"trace","beef":"contains","onion":"contains","garlic":"trace","alcohol":"safe","nut":"safe"},"balance_partners":{"mode_balance":["dish-002","dish-008"],"mode_echo":["dish-003"]},"is_signature":false},
  {"id":"dish-007","counter":"sashimi","names":{"en":"Today's Sashimi Trio","ja":"本日の刺身 三点盛り","cn":"本日刺身 三品拼盘"},"price_cad":28,"descriptions":{"en":"Three fish chosen at this morning's market, cut to order. Today: bluefin chū-toro, king salmon, hirame. Soy, wasabi grated to order.","ja":"朝市場で選んだ三種を切りつけ。本日: 本鮪中トロ、キングサーモン、平目。醤油・本わさび。","cn":"今晨市场精选三种，现点现切。今日: 蓝鳍中腹、帝王鲑、比目鱼。酱油与现磨山葵。"},"allergens":{"soy":"contains","egg":"safe","fish_egg":"trace","seafood":"contains","shellfish":"trace","dairy":"safe","gluten":"contains","sesame":"safe","pork":"safe","beef":"safe","onion":"safe","garlic":"safe","alcohol":"trace","nut":"safe"},"balance_partners":{"mode_balance":["dish-013","dish-001"],"mode_echo":["dish-008"]},"is_signature":true},
  {"id":"dish-008","counter":"sashimi","names":{"en":"Aburi Saba-zushi","ja":"炙り 鯖寿司","cn":"炙烤 鲭鱼寿司"},"price_cad":22,"descriptions":{"en":"Kyoto-style pressed mackerel sushi, kelp-cured and torch-seared at the counter. Four thick slices, a single piece of pickled ginger.","ja":"京都仕立ての鯖の押し寿司を昆布で締め、目の前で炙る。厚切り4切れ、ガリ少々。","cn":"京都风押寿司，昆布腌渍鲭鱼并于席前炙烤。厚切4片，佐红姜。"},"allergens":{"soy":"contains","egg":"safe","fish_egg":"safe","seafood":"contains","shellfish":"trace","dairy":"safe","gluten":"contains","sesame":"trace","pork":"safe","beef":"safe","onion":"safe","garlic":"safe","alcohol":"trace","nut":"safe"},"balance_partners":{"mode_balance":["dish-002","dish-014"],"mode_echo":["dish-007"]},"is_signature":true},
  {"id":"dish-009","counter":"sashimi","names":{"en":"Sakura-dai & Spring Greens Carpaccio, Kombu-jime","ja":"桜鯛と春菜 昆布締めカルパッチョ","cn":"樱鲷与春菜 昆布渍意式生鱼片"},"price_cad":26,"descriptions":{"en":"Spring-spawning sea bream cured 4 hours between kombu, sliced thin over Ontario fiddleheads and seri (Japanese parsley). Yuzu olive oil, sea salt, pink peppercorn. Spring 2026 only.","ja":"産卵期の桜鯛を昆布で4時間締め、オンタリオ・フィドルヘッドとせりの上に薄造り。柚子オリーブオイル、海塩、ピンクペッパー。2026春限定。","cn":"产卵期樱鲷昆布渍4小时，薄切于安大略蕨菜与水芹之上。佐柚子橄榄油、海盐、粉红胡椒。2026春限定。"},"allergens":{"soy":"safe","egg":"safe","fish_egg":"safe","seafood":"contains","shellfish":"trace","dairy":"safe","gluten":"safe","sesame":"safe","pork":"safe","beef":"safe","onion":"safe","garlic":"safe","alcohol":"safe","nut":"trace"},"balance_partners":{"mode_balance":["dish-006","dish-012"],"mode_echo":["dish-007"]},"is_signature":false,"is_seasonal":"spring"},
  {"id":"dish-010","counter":"sashimi","names":{"en":"Beef Tataki, Ponzu","ja":"牛タタキ ポン酢","cn":"牛肉炙烤刺身 橘醋"},"price_cad":22,"descriptions":{"en":"Alberta sirloin seared briefly, sliced thin, served with grated daikon, scallion, and house ponzu.","ja":"アルバータ牛サーロインを表面だけ炙り、薄切り。大根おろし・小ネギ・自家製ポン酢で。","cn":"亚伯达牛沙朗表面炙烤后薄切。佐萝卜泥、青葱与自制橘醋。"},"allergens":{"soy":"contains","egg":"safe","fish_egg":"safe","seafood":"trace","shellfish":"trace","dairy":"safe","gluten":"contains","sesame":"safe","pork":"trace","beef":"contains","onion":"contains","garlic":"trace","alcohol":"trace","nut":"safe"},"balance_partners":{"mode_balance":["dish-013","dish-002"],"mode_echo":["dish-006"]},"is_signature":false},
  {"id":"dish-011","counter":"sashimi","names":{"en":"Fresh Oysters, Yuzu Mignonette","ja":"生牡蠣 柚子ミニョネット","cn":"生蚝 柚子醋"},"price_cad":24,"descriptions":{"en":"Three Kusshi oysters from BC, served with yuzu-shallot mignonette. Half-shell, on ice.","ja":"BC産クッシー牡蠣3個、柚子エシャロットミニョネットで。氷の上に殻ごと。","cn":"卑诗省Kusshi生蚝3颗，佐柚子红葱醋。原壳冰盘上桌。"},"allergens":{"soy":"safe","egg":"safe","fish_egg":"safe","seafood":"contains","shellfish":"contains","dairy":"safe","gluten":"safe","sesame":"safe","pork":"safe","beef":"safe","onion":"contains","garlic":"safe","alcohol":"trace","nut":"safe"},"balance_partners":{"mode_balance":["dish-003","dish-006"],"mode_echo":["dish-007"]},"is_signature":false},
  {"id":"dish-012","counter":"donabe_sake","names":{"en":"Donabe Silver Rice","ja":"土鍋 銀シャリ","cn":"土锅 银饭"},"price_cad":9,"descriptions":{"en":"Single bowl of rice cooked at the table in an Iga-ware donabe. Niigata Koshihikari, finished with a pinch of crystal salt. Order at the start of your meal — it takes 25 minutes.","ja":"伊賀焼の土鍋で席にて炊き上げる銀シャリ1膳。新潟コシヒカリ、結晶塩を一つまみ。25分かかるので注文は最初に。","cn":"伊贺烧土锅在客席现炊银饭1碗。新潟越光米，撒结晶盐少许。需25分钟，请于用餐开始时点选。"},"allergens":{"soy":"safe","egg":"safe","fish_egg":"safe","seafood":"safe","shellfish":"safe","dairy":"safe","gluten":"safe","sesame":"safe","pork":"safe","beef":"safe","onion":"safe","garlic":"safe","alcohol":"safe","nut":"safe"},"balance_partners":{"mode_balance":["dish-001","dish-006"],"mode_echo":["dish-013"]},"is_signature":true,"is_vegan_capable":true},
  {"id":"dish-013","counter":"donabe_sake","names":{"en":"Donabe Salmon-Ikura Rice","ja":"土鍋 鮭はらこ飯","cn":"土锅 鲑鱼鲑鱼籽饭"},"price_cad":22,"descriptions":{"en":"Donabe rice cooked with salt-cured BC king salmon, finished with house-cured ikura. Serves 2-3.","ja":"BC産キングサーモンを塩で締めて土鍋で炊き込み、最後に自家製いくらをのせる。2-3人前。","cn":"BC帝王鲑以盐渍后土锅炊饭，最后铺上自制鲑鱼籽。2-3人份。"},"allergens":{"soy":"trace","egg":"safe","fish_egg":"contains","seafood":"contains","shellfish":"trace","dairy":"safe","gluten":"trace","sesame":"safe","pork":"safe","beef":"safe","onion":"safe","garlic":"safe","alcohol":"trace","nut":"safe"},"balance_partners":{"mode_balance":["dish-002","dish-009"],"mode_echo":["dish-012"]},"is_signature":false},
  {"id":"dish-014","counter":"donabe_sake","names":{"en":"Spring Chawanmushi — Firefly Squid & Rapeseed Greens","ja":"春の茶碗蒸し ホタルイカと菜の花","cn":"春日茶碗蒸 萤火鱿与油菜花"},"price_cad":13,"descriptions":{"en":"Warm chawanmushi with whole firefly squid from Toyama Bay and blanched nanohana. Dashi-egg custard, finished with a thin layer of clear ankake. Spring 2026 only.","ja":"富山湾のホタルイカを丸ごと、菜の花を浮かべた温かい茶碗蒸し。出汁玉子のカスタード、上にあっさり餡。2026春限定。","cn":"富山湾整只萤火鱿与油菜花，温热茶碗蒸。高汤蛋液炖制，上覆清淡芡汁。2026春限定。"},"allergens":{"soy":"contains","egg":"contains","fish_egg":"safe","seafood":"contains","shellfish":"contains","dairy":"safe","gluten":"trace","sesame":"safe","pork":"safe","beef":"safe","onion":"trace","garlic":"safe","alcohol":"trace","nut":"safe"},"balance_partners":{"mode_balance":["dish-001","dish-006"],"mode_echo":["dish-018"]},"is_signature":false,"is_seasonal":"spring"},
  {"id":"dish-016","counter":"donabe_sake","names":{"en":"Takibiya Potato Salad","ja":"名物 ポテトサラダ","cn":"招牌 土豆沙拉"},"price_cad":10,"descriptions":{"en":"Yukon gold potatoes, cured egg yolk, smoked sausage, dill, fried potato strings on top. Our most-ordered side.","ja":"ユーコンゴールド・じゃがいも、塩漬け卵黄、燻製ソーセージ、ディル、上には揚げポテト。一番出る一皿。","cn":"育空黄金土豆、盐渍蛋黄、烟熏香肠、莳萝，顶层为炸薯丝。出单最多的招牌小菜。"},"allergens":{"soy":"trace","egg":"contains","fish_egg":"safe","seafood":"trace","shellfish":"trace","dairy":"contains","gluten":"trace","sesame":"safe","pork":"contains","beef":"safe","onion":"contains","garlic":"contains","alcohol":"safe","nut":"safe"},"balance_partners":{"mode_balance":["dish-001","dish-007"],"mode_echo":["dish-017"]},"is_signature":true},
  {"id":"dish-017","counter":"donabe_sake","names":{"en":"House Fluffy Satsuma-age","ja":"自家製 ふわとろ さつまあげ","cn":"自家制 软嫩萨摩扬"},"price_cad":13,"descriptions":{"en":"House-made fish cake, fried to order, fluffy interior. Two pieces with grated ginger and house soy.","ja":"自家製さつまあげ、注文ごとに揚げ、中はふわとろ。2個、すりおろし生姜と自家製醤油。","cn":"自家制鱼浆炸物，现点现炸，内里软嫩。2个，佐姜泥与自制酱油。"},"allergens":{"soy":"contains","egg":"contains","fish_egg":"safe","seafood":"contains","shellfish":"trace","dairy":"trace","gluten":"contains","sesame":"trace","pork":"trace","beef":"safe","onion":"trace","garlic":"trace","alcohol":"trace","nut":"safe"},"balance_partners":{"mode_balance":["dish-007","dish-002"],"mode_echo":["dish-016"]},"is_signature":false},
  {"id":"dish-018","counter":"donabe_sake","names":{"en":"Hojicha Pudding","ja":"ほうじ茶プリン","cn":"焙茶布丁"},"price_cad":9,"descriptions":{"en":"Roasted-green-tea custard, kuromitsu (Okinawan brown sugar syrup), kinako dust.","ja":"ほうじ茶のカスタード、沖縄黒蜜、きな粉。","cn":"焙茶卡仕达，冲绳黑糖蜜，黄豆粉。"},"allergens":{"soy":"contains","egg":"contains","fish_egg":"safe","seafood":"safe","shellfish":"safe","dairy":"contains","gluten":"safe","sesame":"safe","pork":"safe","beef":"safe","onion":"safe","garlic":"safe","alcohol":"safe","nut":"trace"},"balance_partners":{"mode_balance":[],"mode_echo":["dish-014"]},"is_signature":false,"is_dessert":true}
];

export function dishById(id: string): Dish | undefined {
  return MENU.find((d) => d.id === id);
}

export type LocalizedText = { en: string; ja: string; cn: string };

export const DISH_ORIGINS: Record<string, LocalizedText> = {
  "dish-001": { en: "Pacific bonito caught off the BC coast, seared at the counter over a pillar of locally-sourced rice straw.", ja: "BC沖の太平洋戻り鰹を、目の前で地元産わらの炎で炙る。", cn: "于BC沿岸捕获的太平洋秋鲣，于客席前以本地稻草烈焰瞬间炙烤。" },
  "dish-002": { en: "Five spring vegetables foraged in Ontario, charred over white-oak binchotan imported from Wakayama.", ja: "オンタリオ産の春野菜五種を、和歌山産の白オーク備長炭で炙る。", cn: "五种产自安大略的春日野菜，以和歌山产白橡备长炭烤制。" },
  "dish-003": { en: "Wild Alaskan black cod, marinated 72 hours in Kyoto white miso (Saikyo).", ja: "アラスカ産の天然銀ダラを、京都の白味噌(西京)で 72 時間漬け込む。", cn: "阿拉斯加野生银鳕鱼，京都白味噌(西京)腌渍72小时。" },
  "dish-004": { en: "Tajima heritage chicken from Hyogo bloodline, salt-only.", ja: "兵庫血統の但馬鶏、塩のみで。", cn: "兵库血统的但马鸡，仅以盐调味。" },
  "dish-005": { en: "Single large hotategai diver-caught off Hokkaido, straw-flamed.", ja: "北海道で潜水漁された大粒帆立を、わら焼きで。", cn: "北海道潜水捕捞的大颗扇贝，稻草炙烤。" },
  "dish-006": { en: "Alberta-raised beef tongue, salt-aged 48 hours, charred over binchotan.", ja: "アルバータ産の牛タン、48時間塩熟成、備長炭で深く炙る。", cn: "阿尔伯塔产牛舌，盐渍48小时，备长炭深炙。" },
  "dish-007": { en: "Three fish chosen at this morning's Pacific market: today, bluefin chu-toro, BC king salmon, hirame.", ja: "今朝の太平洋市場で選んだ三種: 本日は本鮪中トロ・BC産キングサーモン・平目。", cn: "今晨太平洋市场精选三种: 今日为蓝鳍中腹、BC帝王鲑、比目鱼。" },
  "dish-008": { en: "Japanese mackerel cured in Kyoto-style kombu, torch-seared at the counter.", ja: "日本産の鯖を京都仕立ての昆布で締め、目の前で炙る。", cn: "日本鲭鱼以京都风昆布腌渍，于客席前炙烤。" },
  "dish-009": { en: "Spring-spawning sea bream cured 4 hours between Hokkaido kombu, paired with Ontario fiddleheads.", ja: "産卵期の桜鯛を北海道産昆布で 4 時間締め、オンタリオ・フィドルヘッドと合わせる。", cn: "产卵期樱鲷以北海道昆布渍4小时，搭配安大略蕨菜。" },
  "dish-010": { en: "Alberta sirloin, surface-seared, sliced thin.", ja: "アルバータ産サーロインを表面だけ炙り、薄切り。", cn: "阿尔伯塔产沙朗，表面炙烤后薄切。" },
  "dish-011": { en: "BC Kusshi oysters, hand-shucked at the counter.", ja: "BC産Kusshi牡蠣を、目の前で殻剥き。", cn: "BC产Kusshi生蚝，于客席前现剥。" },
  "dish-012": { en: "Niigata Koshihikari rice, cooked at your table in an Iga-ware donabe (clay pot).", ja: "新潟コシヒカリを、伊賀焼の土鍋で席にて炊き上げる。", cn: "新潟越光米，于客席现以伊贺烧土锅炊煮。" },
  "dish-013": { en: "BC king salmon salt-cured in-house, donabe-cooked with rice, finished with house-cured ikura.", ja: "BC産キングサーモンを自家塩漬けし土鍋で炊き込み、自家製いくらで仕上げ。", cn: "BC帝王鲑自家盐渍后土锅炊饭，最后铺以自家鲑鱼籽。" },
  "dish-014": { en: "Toyama Bay firefly squid (hotaru-ika) and nanohana in a dashi-egg custard.", ja: "富山湾のホタルイカと菜の花を、出汁玉子のカスタードで蒸す。", cn: "富山湾萤火鱿与油菜花，高汤蛋液炖制。" },
  "dish-016": { en: "Yukon gold potatoes, cured egg yolk, smoked sausage, dill, fried potato strings.", ja: "ユーコンゴールド・じゃがいも、塩漬け卵黄、燻製ソーセージ、ディル、揚げポテト。", cn: "育空黄金土豆、盐渍蛋黄、烟熏香肠、莳萝、炸薯丝。" },
  "dish-017": { en: "House-ground white fish, fried to order, fluffy interior.", ja: "自家擂りの白身魚を、注文ごとに揚げる。中はふわとろ。", cn: "自家研磨白身鱼，现点现炸，内里软嫩。" },
  "dish-018": { en: "Roasted-green-tea custard, Okinawa kuromitsu syrup, kinako dust.", ja: "ほうじ茶のカスタード、沖縄黒蜜、きな粉。", cn: "焙茶卡仕达，冲绳黑糖蜜，黄豆粉。" },
};

export function dishOrigin(id: string): LocalizedText | undefined {
  return DISH_ORIGINS[id];
}

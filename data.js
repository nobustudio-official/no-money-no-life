// =========================
// お金 contents
// =========================

const MONEY_CONTENTS = {

    1: {

        rewards: [
            {
                amount: 100,
                probability: 50
            },
            {
                amount: 300,
                probability: 25
            },
            {
                amount: 500,
                probability: 15
            },
            {
                amount: 1000,
                probability: 10
            }
        ]

    }

};

// =========================
// モンスター contents
// =========================

const MONSTER_CONTENTS = {

    1: {
        name: "ゴブリン",
        icon: "👾",
        hp: 150,
        attack: 120
    },

    2: {
        name: "ゾンビ",
        icon: "🧟‍♂️",
        hp: 110,
        attack: 180
    },

    3: {
        name: "ワーウルフ",
        icon: "🐺",
        hp: 300,
        attack: 250
    }

};

// =========================
// アイテム contents
// =========================

const ITEM_CONTENTS = {

     1: {
        name: "人力車",
        price: 1000,
        category: "move",
        effect: "サイコロを2個振れる",
        rank: 1
    },

    2: {
        name: "タクシーチケット",
        price: 5000,
        category: "move",
        effect: "サイコロを3個振れる",
        rank: 1
    },

    3: {
        name: "グリーン車",
        price: 8000,
        category: "move",
        effect: "サイコロを4個振れる",
        rank: 1
    },

    4: {
        name: "ビジネスクラス",
        price: 15000,
        category: "move",
        effect: "サイコロを5個振れる",
        rank: 2
    },

    5: {
        name: "ファーストクラス",
        price: 25000,
        category: "move",
        effect: "サイコロを6個振れる",
        rank: 2
    },

    6: {
        name: "プライベートジェット",
        price: 50000,
        category: "move",
        effect: "サイコロを8個振れる",
        rank: 3
    },

    7: {
        name: "走れ、メロス",
        price: 80000,
        category: "move",
        effect: "サイコロを10個振れる",
        rank: 3
    },

    8: {
        name: "どんぴ車",
        price: 100000,
        category: "move",
        effect: "6マス以内の好きなマスに止まれる",
        rank: 3
    },

    9: {
        name: "お守り",
        price: 1000,
        category: "passive",
        effect: "相手から受けるダメージ－10",
        effectType: "damageReduction",
        effectTarget: "self",
        effectValue: 10,
        effectDuration: "permanent",
        rank: 1
    },

    10: {
        name: "ダンベル",
        price: 500,
        category: "passive",
        effect: "相手に与えるダメージ＋10",
        effectType: "damageBonus",
        effectTarget: "self",
        effectValue: 10,
        effectDuration: "permanent",
        rank: 1
    },

    11: {
        name: "幸運の財布",
        price: 800,
        category: "passive",
        effect: "ターン開始時に500G獲得",
        effectType: "goldGain",
        effectTarget: "self",
        effectValue: 500,
        effectDuration: "5turn",
        rank: 1
    },

    12: {
        name: "魔法の靴",
        price: 1200,
        category: "passive",
        effect: "サイコロの出目＋1",
        effectType: "diceBonus",
        effectTarget: "self",
        effectValue: 1,
        effectDuration: "5turn",
        rank: 1
    }

};

// =========================
// 魔法 contents
// =========================

const MAGIC_CONTENTS = {

    1: {
        name: "ファイア",
        type: "attack",
        effect: "魔力の100%で攻撃",
        powerRate: 1.0,
        buffTarget: null,
        buffStat: null,
        buffRate: null,
        buffDuration: null,
        price: 0,
        cost: 100,
        actionAfterUse: "end",
        rank: 0
    },

    2: {
        name: "ブリザド",
        type: "attack",
        effect: "魔力の150％で攻撃",
        powerRate: 1.5,
        buffTarget: null,
        buffStat: null,
        buffRate: null,
        buffDuration: null,
        price: 200,
        cost: 150,
        actionAfterUse: "end",
        rank: 0
    },

    3: {
        name: "ダークスパイク",
        type: "attack",
        effect: "魔力の500％で攻撃",
        powerRate: 5.0,
        buffTarget: null,
        buffStat: null,
        buffRate: null,
        buffDuration: null,
        price: 5000,
        cost: 800,
        actionAfterUse: "end",
        rank: 0
    },

    4: {
        name: "メテオ",
        type: "attack",
        effect: "魔力の1000％で攻撃",
        powerRate: 10.0,
        buffTarget: null,
        buffStat: null,
        buffRate: null,
        buffDuration: null,
        price: 100000,
        cost: 5000,
        actionAfterUse: "end",
        rank: 0
    },

    5: {
        name: "パワアプ",
        type: "buff",
        effect: "次のターンの魔力が3倍",
        powerRate: null,
        buffTarget: "self",
        buffStat: "magicPower",
        buffRate: 3,
        buffDuration: "1turn",
        price: 500,
        cost: 1000,
        actionAfterUse: "continue",
        rank: 0
    },

    6: {
        name: "ディフェアプ",
        type: "buff",
        effect: "このターンの相手の攻撃力を半分",
        powerRate: null,
        buffTarget: "enemy",
        buffStat: "attackPower",
        buffRate: 0.5,
        buffDuration: "1turn",
        price: 500,
        cost: 1000,
        actionAfterUse: "continue",
        rank: 0
    }

};

// =========================
// 魔力 contents
// =========================

const POWER_CONTENTS = {

    1: {
        effect: "魔力＋10",
        price: 1000,
        rank: 1
    },

    2: {
        effect: "魔力＋100",
        price: 10000,
        rank: 2
    },

    3: {
        effect: "魔力＋1000",
        price: 100000,
        rank: 3
    }

};

// =========================
// 資産 contents
// =========================

const ASSET_CONTENTS = {

    1: {
        name: "キャサリン",
        price: 100,
        yield: 100,
        owner: null
    },

    2: {
        name: "キャサリン",
        price: 100,
        yield: 100,
        owner: null
    },

    3: {
        name: "キャサリン",
        price: 100,
        yield: 100,
        owner: null
    },

    4: {
        name: "キャサリン",
        price: 100,
        yield: 100,
        owner: null
    },

    5: {
        name: "キャサリン",
        price: 100,
        yield: 100,
        owner: null
    },

    6: {
        name: "キャサリン",
        price: 100,
        yield: 100,
        owner: null
    },

    7: {
        name: "キャサリン",
        price: 100,
        yield: 100,
        owner: null
    },

    8: {
        name: "キャサリン",
        price: 100,
        yield: 100,
        owner: null
    },

    9: {
        name: "キャサリン",
        price: 100,
        yield: 100,
        owner: null
    },

    10: {
        name: "キャサリン",
        price: 100,
        yield: 100,
        owner: null
    },

    11: {
        name: "笑みリア",
        price: 5000000000,
        yield: 1,
        owner: null
    },

    12: {
        name: "檸夢",
        price: 30000000,
        yield: 1,
        owner: null
    },

    13: {
        name: "羅夢",
        price: 30000000,
        yield: 1,
        owner: null
    },

    14: {
        name: "ベアトニス",
        price: 20000000,
        yield: 1,
        owner: null
    },

    15: {
        name: "ヌバル",
        price: 1000000,
        yield: 5,
        owner: null
    },

    16: {
        name: "ガーフィーヌ",
        price: 80000000,
        yield: 1,
        owner: null
    },

    17: {
        name: "オズワーリ",
        price: 4000000,
        yield: 1,
        owner: null
    }

};

// =========================
// バイト contents
// =========================

const JOB_CONTENTS = {

    1: {
        name: "居酒屋",
        unitPrice: 1000
    },

    2: {
        name: "叩き",
        unitPrice: 50000,
        specialEffect: "arrest"
    },

    3: {
        name: "パン屋",
        unitPrice: 1500
    },

    4: {
        name: "引っ越し",
        unitPrice: 2000
    }

};

// =========================
// ボス contents
// =========================

const BOSS_CONTENTS = {

    1: {
        name: "デーモンロード",
        hp: 200,
        attack: 50
    },

    2: {
        name: "いただきリリィ",
        hp: 500,
        attack: 500
    }

    3: {
        name: "ギャング",
        hp: 1000,
        attack: 1000
    }

    
};


// =========================
// 宝箱 type ID
// =========================

const TREASURE_BOXES = {

    1: {
        name: "木の宝箱",
        rank: 1
    },

    2: {
        name: "銀の宝箱",
        rank: 2
    },

    3: {
        name: "金の宝箱",
        rank: 3
    }

};

// =========================
// ショップ type ID
// =========================

const SHOP_BOXES = {

    1: {
        name: "タカツ警察署",
        magicContents: [1, 2, 3, 4],
        powerContents: [1, 2, 3],
        itemContents: [1, 2, 3, 10, 11]
    },

    2: {
        name: "鷹島屋",
        magicContents: [5, 6],
        powerContents: [1, 2, 3],
        itemContents: [1, 2, 3, 10, 11]
    },

    3: {
        name: "スターバック",
        magicContents: [6],
        powerContents: [1, 2, 3],
        itemContents: [4, 5, 6, 12]
    }

};

// =========================
// 資産 type ID
// =========================

const ASSET_BOXES = {

    1: {
        name: "エイフル",
        contents: [1, 2, 3]
    },

    2: {
        name: "タウンハウシング",
        contents: [4, 5, 6]
    },

    3: {
        name: "西急リバブル",
        contents: [7, 8, 9, 10]
    },

    4: {
        name: "ロリの賃貸",
        contents: [11, 12, 13, 14, 15, 16, 17]
    }

};

// =========================
// プレイヤーcontents
// =========================

const　PLAYER_CONTENTS = {

   1: {
        name: "かずま",
        icon: "images/characters/player-male-icon.png",
        sprite: "images/characters/player-male.png"
    },
    2: {
        name: "めぐみ",
        icon: "images/characters/player-female-icon.png",
        sprite: "images/characters/player-female.png"
    },

    3: {
        name: "聖職者",
        icon: "images/characters/player-w-aqua-icon.png",
        sprite: "images/characters/player-w-aqua.png"
    },

    4: {
        name: "剣士",
        icon: "images/characters/player-w-red-icon.png",
        sprite: "images/characters/player-w-red.png"
    },

    5: {
        name: "騎士",
        icon: "images/characters/player-w-yellow-icon.png",
        sprite: "images/characters/player-w-yellow.png"
    },
    
    6: {
        name: "魔術師",
        icon: "images/characters/player-w-purple-icon.png",
        sprite: "images/characters/player-w-purple.png"
    },

    7: {
        name: "盗賊",
        icon: "images/characters/player-w-green-icon.png",
        sprite: "images/characters/player-w-green.png"
    },

    8: {
        name: "看護師",
        icon: "images/characters/player-w-pink-icon.png",
        sprite: "images/characters/player-w-pink.png"
    },

    9: {
        name: "獣人",
        icon: "images/characters/player-w-cat-icon.png",
        sprite: "images/characters/player-w-cat.png"
    },

    10: {
        name: "エルフ",
        icon: "images/characters/player-w-white-icon.png",
        sprite: "images/characters/player-w-white.png"
    }

}

// =========================
// お金 contents
// =========================

const MONEY_CONTENTS = {

    1: {

        rewards: [
            {
                amount: 1000,
                probability: 20
            },
            {
                amount: 2000,
                probability: 20
            },
            {
                amount: 3000,
                probability: 20
            },
            {
                amount: 5000,
                probability: 15
            },
            {
                amount: 7000,
                probability: 10
            },
            {
                amount: 8000,
                probability: 9
            },
            {
                amount: 10000,
                probability: 5
            },
            {
                amount: 50000,
                probability: 1
            }
        ]

    }

};

// =========================
// モンスター contents
// =========================

const MONSTER_CONTENTS = {

   1: {
        name: "スライム",
        icon: "images/characters/enemy/normal/スライム.png",
        hp: 1100,
        attack: 1000,
        magicReward: 20,
        goldReward: 3500
    },

    2: {
        name: "アンデット",
        icon: "images/characters/enemy/normal/アンデット.png",
        hp: 1300,
        attack: 1800,
        magicReward: 20,
        goldReward: 4000
    },

    3: {
        name: "デビルこうもり",
        icon:  "images/characters/enemy/normal/デビルこうもり.png",
        hp: 2500,
        attack: 1500,
        magicReward: 40,
        goldReward: 8000
    },
    4: {
        name: "パックン",
        icon:  "images/characters/enemy/normal/パックン.png",
        hp: 2000,
        attack: 1800,
        magicReward: 30,
        goldReward: 6000
    },
    5: {
        name: "マッシュル",
        icon:  "images/characters/enemy/normal/マッシュル.png",
        hp: 1300,
        attack: 1300,
        magicReward: 20,
        goldReward: 4500
    },
    6: {
        name: "ウッディオ",
        icon:  "images/characters/enemy/normal/ウッディオ.png",
        hp: 2200,
        attack: 1600,
        magicReward: 40,
        goldReward: 7000
    },
    7: {
        name: "チビリン",
        icon:  "images/characters/enemy/normal/チビリン.png",
        hp: 1900,
        attack: 1500,
        magicReward: 30,
        goldReward: 6000
    },
    8: {
        name: "メタルゴーレム",
        icon:  "images/characters/enemy/normal/メタルゴーレム.png",
        hp: 4000,
        attack: 3000,
        magicReward: 60,
        goldReward: 12000
    },
    9: {
        name: "アイソル",
        icon:  "images/characters/enemy/normal/アイソル.png",
        hp: 2300,
        attack: 1800,
        magicReward: 40,
        goldReward: 7000
    },
    10: {
        name: "ゴースハット",
        icon:  "images/characters/enemy/normal/ゴースハット.png",
        hp: 2000,
        attack: 2500,
        magicReward: 30,
        goldReward: 7500
    }

};

// =========================
// アイテム contents
// =========================

const ITEM_CONTENTS = {

     1: {
        name: "人力車",
        price: 10000,
        category: "move",
        effect: "サイコロを2個振れる",
        rank: 1
    },

    2: {
        name: "タクシーチケット",
        price: 40000,
        category: "move",
        effect: "サイコロを3個振れる",
        rank: 1
    },

    3: {
        name: "グリーン車",
        price: 70000,
        category: "move",
        effect: "サイコロを4個振れる",
        rank: 1
    },

    4: {
        name: "ビジネスクラス",
        price: 100000,
        category: "move",
        effect: "サイコロを5個振れる",
        rank: 2
    },

    5: {
        name: "ファーストクラス",
        price: 150000,
        category: "move",
        effect: "サイコロを6個振れる",
        rank: 2
    },

    6: {
        name: "プライベートジェット",
        price: 300000,
        category: "move",
        effect: "サイコロを8個振れる",
        rank: 3
    },

    7: {
        name: "走れ、メロス",
        price: 500000,
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
        price: 10000,
        category: "passive",
        effect: "相手から受けるダメージ－100",
        effectType: "damageReduction",
        effectTarget: "self",
        effectValue: 100,
        effectDuration: "permanent",
        rank: 1
    },

    10: {
        name: "ダンベル",
        price: 10000,
        category: "passive",
        effect: "相手に与えるダメージ＋100",
        effectType: "damageBonus",
        effectTarget: "self",
        effectValue: 100,
        effectDuration: "permanent",
        rank: 1
    },

    11: {
        name: "幸運の財布",
        price: 0,
        category: "passive",
        effect: "ターン開始時に3000G獲(5ターンで消滅)",
        effectType: "goldGain",
        effectTarget: "self",
        effectValue: 3000,
        effectDuration: "5turn",
        rank: 1
    },


};

// =========================
// 魔法 contents
// =========================

const MAGIC_CONTENTS = {

    1: {
        name: "ファイア",
        type: "attack",
        icon: "images/magic/ファイア.png",
        effect: "魔力の100%で攻撃",
        sound: "sounds/戦闘/火炎魔法1.mp3",
        powerRate: 1.0,
        costRate: 1.0,
        buffTarget: null,
        buffStat: null,
        buffRate: null,
        buffDuration: null,
        price: 0,
        actionAfterUse: "end",
        rank: 0
    },

    2: {
        name: "ブリザド",
        icon: "images/magic/ブリザド.png",
        type: "attack",
        effect: "魔力の150％で攻撃",
        sound: "sounds/戦闘/氷魔法1.mp3",
        powerRate: 1.5,
        costRate: 1.5,
        buffTarget: null,
        buffStat: null,
        buffRate: null,
        buffDuration: null,
        price: 2000,
        actionAfterUse: "end",
        rank: 0
    },

    3: {
        name: "ダークスパイク",
        type: "attack",
        icon: "images/magic/ダークスパイク.png",
        effect: "魔力の300％で攻撃",
        sound: "sounds/戦闘/ダークスパイク.mp3",
        powerRate: 3.0,
        costRate: 4.0,
        buffTarget: null,
        buffStat: null,
        buffRate: null,
        buffDuration: null,
        price: 50000,
        actionAfterUse: "end",
        rank: 0
    },

    4: {
        name: "メテオ",
        type: "attack",
        icon: "未設定",
        effect: "魔力の500％で攻撃",
        icon: "images/magic/メテオ.png",
        sound: "sounds/戦闘/爆発1.mp3",
        powerRate: 5.0,
        costRate: 6.0,
        buffTarget: null,
        buffStat: null,
        buffRate: null,
        buffDuration: null,
        price: 100000,
        actionAfterUse: "end",
        rank: 0
    },

    5: {
        name: "パワアプ",
        type: "buff",
        icon: "images/magic/パワアプ.png",
        effect: "戦闘中の魔法の威力が2倍になる",
        sound: "sounds/戦闘/パワーチャージ.mp3",
        powerRate: null,
        costRate: 2.0,
        buffTarget: "self",
        buffStat: "magicPower",
        buffRate: 2.0,
        buffDuration: "1turn",
        price: 100000,
        actionAfterUse: "continue",
        rank: 0
    },

    6: {
        name: "ディフェアプ",
        type: "buff",
        icon: "images/magic/ディフェアプ.png",
        effect: "戦闘中の相手の攻撃力を半分",
        sound: "sounds/戦闘/詠唱1.mp3",
        powerRate: null,
        costRate: 0.5,
        buffTarget: "enemy",
        buffStat: "attackPower",
        buffRate: 0.5,
        buffDuration: "1turn",
        price: 100000,
        actionAfterUse: "continue",
        rank: 0
    },
    7: {
        name: "スピッファ",
        type: "attack",
        icon: "images/magic/スピファ.png",
        effect: "魔力の800％で攻撃",
        sound: "sounds/戦闘/重機関銃を乱射1.mp3",
        powerRate: 8.0,
        costRate: 11.0,
        buffTarget: null,
        buffStat: null,
        buffRate: null,
        buffDuration: null,
        price: 100000,
        actionAfterUse: "end",
        rank: 0
    },

    8: {
        name: "クレーバー",
        type: "attack",
        icon: "images/magic/クレーバー.png",
        effect: "魔力の1000％で攻撃",
        sound: "sounds/戦闘/クレーバー.mp3",
        powerRate: 10.0,
        costRate: 1.0,
        buffTarget: null,
        buffStat: null,
        buffRate: null,
        buffDuration: null,
        price: 0,
        actionAfterUse: "end",
        rank: 4
    }
    

};

// =========================
// 魔力 contents
// =========================

const POWER_CONTENTS = {

    1: {
        effect: "魔力＋50",
        price: 10000,
        rank: 0
    },

    2: {
        effect: "魔力＋500",
        price: 100000,
        rank: 0
    },

    3: {
        effect: "魔力＋5000",
        price: 1000000,
        rank: 0
    }

};

// =========================
// 資産 contents
// =========================

const ASSET_CONTENTS = {

    1: {
        name: "キャサリン",
        price: 10000,
        yield: 25,
        owner: null
    },

    2: {
        name: "キャサリン",
        price: 10000,
        yield: 25,
        owner: null
    },

    3: {
        name: "キャサリン",
        price: 10000,
        yield: 25,
        owner: null
    },

    4: {
        name: "ナンシー",
        price: 50000,
        yield: 25,
        owner: null
    },

    5: {
        name: "ロシシー",
        price: 200000,
        yield: 20,
        owner: null
    },

    6: {
        name: "エシス",
        price: 400000,
        yield: 25,
        owner: null
    },

    7: {
        name: "シルフィネット",
        price: 500000,
        yield: 20,
        owner: null
    },

    8: {
        name: "足立",
        price: 30000,
        yield: 25,
        owner: null
    },

    9: {
        name: "市原",
        price: 100000,
        yield: 20,
        owner: null
    },

    10: {
        name: "山田",
        price: 100000,
        yield: 20,
        owner: null
    },

    11: {
        name: "笑みリア",
        price: 50000000,
        yield: 1,
        owner: null
    },

    12: {
        name: "檸夢",
        price: 300000,
        yield: 1,
        owner: null
    },

    13: {
        name: "羅夢",
        price: 300000,
        yield: 1,
        owner: null
    },

    14: {
        name: "ベアトニス",
        price: 200000,
        yield: 10,
        owner: null
    },

    15: {
        name: "ヌバル",
        price: 100000,
        yield: 20,
        owner: null
    },

    16: {
        name: "ガーフィーヌ",
        price: 800000,
        yield: 10,
        owner: null
    },

    17: {
        name: "オズワーリ",
        price: 40000,
        yield: 50,
        owner: null
    },

    18: {
        name: "ヤニ猫",
        price: 200000,
        yield: 20,
        owner: null
    },

    19: {
        name: "ヤク猫",
        price: 100000,
        yield: 20,
        owner: null
    },

    20: {
        name: "ハメ猫",
        price: 80000,
        yield: 20,
        owner: null
    },

    21: {
        name: "アル猫",
        price: 40000,
        yield: 20,
        owner: null
    },

    22: {
        name: "かんさい",
        price: 5000,
        yield: 200,
        owner: null
    }

};

// =========================
// バイト contents
// =========================

const JOB_CONTENTS = {

    1: {
        name: "居酒屋",
        unitPrice: 13000
    },

    2: {
        name: "叩き",
        unitPrice: 80000,
        specialEffect: "arrest"
    },

    3: {
        name: "パン屋",
        unitPrice: 15000
    },

    4: {
        name: "引っ越し",
        unitPrice: 18000
    }

};

// =========================
// ボス contents
// =========================

const BOSS_CONTENTS = {

    1: {
        name: "デビルロード",
        icon: "images/characters/enemy/boss/デビルロード.png",
        hp: 2000,
        attack: 1000,
        counterDamage: 1000,
        reward: 10000
    },

    2: {
        name: "アイスクイーン",
        icon: "images/characters/enemy/boss/アイスクイーン.png",
        hp: 5000,
        attack: 2500,
        counterDamage: 1500,
        reward: 20000
    },

    3: {
        name: "いただきリリィ",
        icon: "images/characters/enemy/boss/いただきリリィ.png",
        hp: 7000,
        attack: 3000,
        counterDamage: 2000,
        reward: 30000
    },

    4: {
        name: "スカルゴースト",
        icon: "images/characters/enemy/boss/スカルゴースト.png",
        hp: 80000,
        attack: 4000,
        counterDamage: 3000,
        reward: 50000
    },

    5: {
        name: "水原二平",
        icon: "images/characters/enemy/boss/水原二平.png",
        hp: 10000,
        attack: 5000,
        counterDamage: 4000,
        reward: 80000
    },

    6: {
        name: "ロックス",
        icon: "images/characters/enemy/boss/ロックス.png",
        hp: 12000,
        attack: 7000,
        counterDamage: 5000,
        reward: 100000
    },

    7: {
        name: "野々村",
        icon: "images/characters/enemy/boss/野々村.png",
        hp: 20000,
        attack: 10000,
        counterDamage: 8000,
        reward: 150000
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
        rank: [2]
    },

    3: {
        name: "金の宝箱",
        rank: [3]
    },
    4: {
        name: "ミシックの宝箱",
        rank: 4
    }

};

// =========================
// ショップ type ID
// =========================

const SHOP_BOXES = {

    1: {
        name: "タカツ警察署",
        magicContents: [2, 3, 4, 7],
        powerContents: [1, 2, 3],
        itemContents: [1, 2, 3, 9, 10]
    },

    2: {
        name: "鷹島屋",
        magicContents: [5, 6],
        powerContents: [1, 2, 3],
        itemContents: [4, 5, 6, 9, 10]
    },

    3: {
        name: "スターバック",
        magicContents: [2, 3, 4, 7],
        powerContents: [1, 2, 3],
        itemContents: [1, 2, 3, 9, 10]
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
        contents: [4, 5, 6, 7]
    },

    3: {
        name: "西急リバブル",
        contents: [8, 9, 10]
    },

    4: {
        name: "Re:０から始まる異世界ライフ",
        contents: [11, 12, 13, 14, 15, 16, 17]
    },
    
    5: {
        name: "西急ストア",
        contents: [18, 19, 20, 21, 22]
    }

};

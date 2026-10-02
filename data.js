// =========================
// プレイヤーcontents
// =========================

const　PLAYER_CONTENTS = {

   1: {
        name: "戦士",
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
                amount: 1500,
                probability: 20
            },
            {
                amount: 3000,
                probability: 20
            },
            {
                amount: 5000,
                probability: 20
            },
            {
                amount: 7000,
                probability: 15
            },
            {
                amount: 8000,
                probability: 10
            },
            {
                amount: 10000,
                probability: 9
            },
            {
                amount: 15000,
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
        attack: 500,
        magicReward: 20,
        goldReward: 4000
    },

    2: {
        name: "アンデット",
        icon: "images/characters/enemy/normal/アンデット.png",
        hp: 1300,
        attack: 1000,
        magicReward: 20,
        goldReward: 5000
    },

    3: {
        name: "デビルこうもり",
        icon:  "images/characters/enemy/normal/デビルこうもり.png",
        hp: 2100,
        attack: 800,
        magicReward: 40,
        goldReward: 9000
    },
    4: {
        name: "パックン",
        icon:  "images/characters/enemy/normal/パックン.png",
        hp: 2000,
        attack: 1200,
        magicReward: 40,
        goldReward: 8000
    },
    5: {
        name: "マッシュル",
        icon:  "images/characters/enemy/normal/マッシュル.png",
        hp: 1300,
        attack: 1000,
        magicReward: 30,
        goldReward: 6000
    },
    6: {
        name: "ウッディオ",
        icon:  "images/characters/enemy/normal/ウッディオ.png",
        hp: 2200,
        attack: 1100,
        magicReward: 40,
        goldReward: 9000
    },
    7: {
        name: "チビリン",
        icon:  "images/characters/enemy/normal/チビリン.png",
        hp: 1900,
        attack: 900,
        magicReward: 30,
        goldReward: 7000
    },
    8: {
        name: "メタルゴーレム",
        icon:  "images/characters/enemy/normal/メタルゴーレム.png",
        hp: 3500,
        attack: 1500,
        magicReward: 70,
        goldReward: 15000
    },
    9: {
        name: "アイソル",
        icon:  "images/characters/enemy/normal/アイソル.png",
        hp: 2300,
        attack: 1000,
        magicReward: 40,
        goldReward: 9000
    },
    10: {
        name: "ゴースハット",
        icon:  "images/characters/enemy/normal/ゴースハット.png",
        hp: 2000,
        attack: 1200,
        magicReward: 40,
        goldReward: 8500
    },
    11: {
        name: "きっくん",
        icon:  "images/characters/enemy/normal/きっくん.png",
        hp: 1000000,
        attack: 900000,
        magicReward: 1000,
        goldReward: 5000000
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
        price: 20000,
        category: "move",
        effect: "サイコロを3個振れる",
        rank: 1
    },

    3: {
        name: "グリーン車",
        price: 30000,
        category: "move",
        effect: "サイコロを4個振れる",
        rank: 1
    },

    4: {
        name: "ビジネスクラス",
        price: 40000,
        category: "move",
        effect: "サイコロを5個振れる",
        rank: 2
    },

    5: {
        name: "ファーストクラス",
        price: 60000,
        category: "move",
        effect: "サイコロを6個振れる",
        rank: 2
    },

    6: {
        name: "プライベートジェット",
        price: 80000,
        category: "move",
        effect: "サイコロを8個振れる",
        rank: 3
    },

    7: {
        name: "走れ、メロス",
        price: 100000,
        category: "move",
        effect: "サイコロを10個振れる",
        rank: 3
    },

    8: {
        name: "どんぴ車",
        price: 100000,
        category: "move",
        effect: "6マス以内の好きなマスに止まれる",
        rank: 1
    },

    9: {
        name: "お守り",
        price: 10000,
        category: "passive",
        effect: "相手から受けるダメージ－200",
        effectType: "damageReduction",
        effectTarget: "self",
        effectValue: 200,
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
        effect: "5ターンの間、開始時8000G獲得",
        effectType: "goldGain",
        effectTarget: "self",
        effectValue: 8000,
        effectDuration: "5turn",
        rank: 1
    },

    12: {
        name: "免罪符",
        price: 20000,
        category: "passive",
        effect: "3ターンの間ボスカウンター無効化",
        effectType: "bossCounterImmunity",
        effectTarget: "self",
        effectDuration: "3turn",
        rank: 2
    },
    13: {
        name: "ロスノート",
        price: 50000,
        category: "special",
        effect: "このノートに名前を書かれた者は〇ぬ",
        effectType: "bossCounterImmunity",
        effectTarget: "lossNote",
        effectDuration: "playe",
        rank: 4
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
        costRate: 3.2,
        buffTarget: null,
        buffStat: null,
        buffRate: null,
        buffDuration: null,
        price: 30000,
        actionAfterUse: "end",
        rank: 0
    },

    4: {
        name: "メテオ",
        type: "attack",
        icon: "images/magic/メテオ.png",
        effect: "魔力の500％で攻撃",
        icon: "images/magic/メテオ.png",
        sound: "sounds/戦闘/爆発1.mp3",
        powerRate: 5.0,
        costRate: 5.5,
        buffTarget: null,
        buffStat: null,
        buffRate: null,
        buffDuration: null,
        price: 50000,
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
        costRate: 10.0,
        buffTarget: null,
        buffStat: null,
        buffRate: null,
        buffDuration: null,
        price: 80000,
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
        costRate: 2.0,
        buffTarget: null,
        buffStat: null,
        buffRate: null,
        buffDuration: null,
        price: 0,
        actionAfterUse: "end",
        rank: 4
    },
    9: {
        name: "サンダー",
        type: "attack",
        icon: "images/magic/サンダー.png",
        effect: "魔力の250％で攻撃",
        sound: "sounds/戦闘/雷魔法2.mp3",
        powerRate: 2.5,
        costRate: 2.5,
        buffTarget: null,
        buffStat: null,
        buffRate: null,
        buffDuration: null,
        price: 10000,
        actionAfterUse: "end",
        rank: 0
    },
    10: {
        name: "トルネード",
        type: "attack",
        icon: "images/magic/トルネード.png",
        effect: "魔力の400％で攻撃",
        sound: "sounds/戦闘/風魔法1.mp3",
        powerRate: 4.0,
        costRate: 4.0,
        buffTarget: null,
        buffStat: null,
        buffRate: null,
        buffDuration: null,
        price: 5000,
        actionAfterUse: "end",
        rank: 2
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
// モブ資産生成
// =========================

function createMobAssets(startId, endId) {

    const assets = {};

    for (let id = startId; id <= endId; id++) {

        assets[id] = {
            name: "モブ",
            price: 10000,
            yield: 25,
            owner: null
        };

    }

    return assets;
}

// =========================
// 資産 contents
// =========================

const ASSET_CONTENTS = {

    1: {
        name: "フリーレソ",
        price: 50000,
        yield: 25,
        owner: null
    },

    2: {
        name: "フェルソ",
        price: 30000,
        yield: 25,
        owner: null
    },

    3: {
        name: "ショタルク",
        price: 20000,
        yield: 25,
        owner: null
    },

    4: {
        name: "ナナボシ",
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
        price: 10000,
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
        yield: 2,
        owner: null
    },

    12: {
        name: "檸夢",
        price: 300000,
        yield: 10,
        owner: null
    },

    13: {
        name: "羅夢",
        price: 300000,
        yield: 10,
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
        yield: 10,
        owner: null
    },

    16: {
        name: "ガーフィーヌ",
        price: 800000,
        yield: 5,
        owner: null
    },

    17: {
        name: "オズワーリ",
        price: 40000,
        yield: 25,
        owner: null
    },

    18: {
        name: "煙猫",
        price: 200000,
        yield: 20,
        owner: null
    },

    19: {
        name: "薬猫",
        price: 100000,
        yield: 20,
        owner: null
    },

    20: {
        name: "＊猫",
        price: 80000,
        yield: 20,
        owner: null
    },

    21: {
        name: "酒猫",
        price: 40000,
        yield: 20,
        owner: null
    },

    22: {
        name: "笑猫",
        price: 5000,
        yield: 200,
        owner: null
    },

    23: {
        name: "アクア",
        price: 20000,
        yield: 20,
        owner: null
    },
    24: {
        name: "ルビー",
        price: 20000,
        yield: 20,
        owner: null
    },
    25: {
        name: "あれまかな",
        price: 50000,
        yield: 20,
        owner: null
    },
    26: {
        name: "白川あかね",
        price: 40000,
        yield: 20,
        owner: null
    },
    27: {
        name: "Mちょ",
        price: 20000,
        yield: 20,
        owner: null
    },
    28: {
        name: "ルフェ",
        price: 300000000,
        yield: 1,
        owner: null
    },
    29: {
        name: "ゾノ",
        price: 100000000,
        yield: 1,
        owner: null
    },
    30: {
        name: "ナミィ",
        price: 100000000,
        yield: 1,
        owner: null
    },
    31: {
        name: "サンシ",
        price: 100000000,
        yield: 1,
        owner: null
    },
    32: {
        name: "ウンップ",
       price: 100000000,
        yield: 1,
        owner: null
    },
    33: {
        name: "ロビソ",
        price: 100000000,
        yield: 1,
        owner: null
    },
    34: {
        name: "ハソコック",
        price: 100000000,
        yield: 1,
        owner: null
    },
    35: {
        name: "ブルッブル",
        price: 100000,
        yield: 10,
        owner: null
    },
    36: {
        name: "ナルコ",
        price: 200000,
        yield: 10,
        owner: null
    },
    37: {
        name: "サステ",
        price: 200000,
        yield: 10,
        owner: null
    },
    38: {
        name: "サクハ",
        price: 100000,
        yield: 10,
        owner: null
    },
    39: {
        name: "かかし",
        price: 100000,
        yield: 10,
        owner: null
    },
    40: {
        name: "我愛裸",
        price: 100000,
        yield: 10,
        owner: null
    },
    41: {
        name: "デクノボウ",
        price: 300000,
        yield: 10,
        owner: null
    },
    42: {
        name: "お茶の子",
        price: 300000,
        yield: 10,
        owner: null
    },
    43: {
        name: "爆音",
        price: 300000,
        yield: 10,
        owner: null
    },
    44: {
        name: "轟消灯",
        price: 300000,
        yield: 10,
        owner: null
    },
    45: {
        name: "オールナイト",
        price: 5000000,
        yield: 1,
        owner: null
    },
    46: {
        name: "坂田銀",
        price: 1000000,
        yield: 1,
        owner: null
    },
    47: {
        name: "KAGURA",
        price: 500000,
        yield: 1,
        owner: null
    },
    48: {
        name: "めがね",
        price: 1000,
        yield: 500,
        owner: null
    },
    49: {
        name: "ズラ",
        price: 50000,
        yield: 20,
        owner: null
    },
    50: {
        name: "まるでダメなおっさん",
        price: 2000,
        yield: 300,
        owner: null
    },
    51: {
        name: "エレ",
        price: 50000,
        yield: 20,
        owner: null
    },
    52: {
        name: "ミサカ",
        price: 80000,
        yield: 20,
        owner: null
    },
    53: {
        name: "ナイミン",
        price: 40000,
        yield: 20,
        owner: null
    },
    54: {
        name: "リヴァイアサン",
        price: 10000000,
        yield: 1,
        owner: null
    },
    55: {
        name: "芋喰女",
        price: 10000,
        yield: 50,
        owner: null
    },
    56: {
        name: "青狸",
        price: 100000,
        yield: 10,
        owner: null
    },
    57: {
        name: "0点",
        price: 50000,
        yield: 20,
        owner: null
    },
    58: {
        name: "風呂好き",
        price: 40000,
        yield: 20,
        owner: null
    },
    59: {
        name: "小金持ち",
        price: 30000,
        yield: 20,
        owner: null
    },
    60: {
        name: "映画版",
        price: 200000,
        yield: 5,
        owner: null
    },
    61: {
        name: "サーニャ",
        price: 100000,
        yield: 10,
        owner: null
    },
    62: {
        name: "ロイホ",
        price: 200000,
        yield: 8,
        owner: null
    },
    63: {
        name: "夜",
        price: 200000,
        yield: 8,
        owner: null
    },
    64: {
        name: "ポンド",
        price: 50000,
        yield: 10,
        owner: null
    },
    65: {
        name: "エレガント",
        price: 20000,
        yield: 20,
        owner: null
    },
    



    ...createMobAssets(5000, 5999)


};

// =========================
// バイト contents
// =========================

const JOB_CONTENTS = {

    1: {
        name: "居酒屋",
        unitPrice: 30000
    },

    2: {
        name: "ガスト",
        unitPrice: 35000,
        specialEffect: "arrest"
    },

    3: {
        name: "パン屋",
        unitPrice: 33000
    },

    4: {
        name: "引っ越し",
        unitPrice: 32000
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
        counterDamage: 200,
        reward: 15000
    },

    2: {
        name: "野々村",
        icon: "images/characters/enemy/boss/野々村.png",
        hp: 4000,
        attack: 1500,
        counterDamage: 300,
        reward: 25000
    },

    3: {
        name: "アイスクイーン",
        icon: "images/characters/enemy/boss/アイスクイーン.png",
        hp: 5000,
        attack: 2000,
        counterDamage: 400,
        reward: 30000
    },

    4: {
        name: "スカルゴースト",
        icon: "images/characters/enemy/boss/スカルゴースト.png",
        hp: 6000,
        attack: 2500,
        counterDamage: 500,
        reward: 40000
    },

    5: {
        name: "いただきリリィ",
        icon: "images/characters/enemy/boss/いただきリリィ.png",
        hp: 8000,
        attack: 3000,
        counterDamage: 800,
        reward: 50000
    },

    6: {
        name: "ロックス",
        icon: "images/characters/enemy/boss/ロックス.png",
        hp: 10000,
        attack: 4000,
        counterDamage: 900,
        reward: 70000
    },

    7: {
        name: "ウッドビット",
        icon: "images/characters/enemy/boss/ウッドビット.png",
        hp: 12000,
        attack: 5000,
        counterDamage: 1000,
        reward: 100000
    },
    8: {
        name: "ダークドラゴン",
        icon: "images/characters/enemy/boss/ダークドラゴン.png",
        hp: 15000,
        attack: 6000,
        counterDamage: 1100,
        reward: 120000
    },
    9: {
        name: "シャイニングナイト",
        icon: "images/characters/enemy/boss/シャイニングナイト.png",
        hp: 17000,
        attack: 8000,
        counterDamage: 1200,
        reward: 150000
    },
    10: {
        name: "水原二平",
        icon: "images/characters/enemy/boss/水原二平.png",
        hp: 20000,
        attack: 10000,
        counterDamage: 1300,
        reward: 200000
    },
    11: {
        name: "オクトパン",
        icon: "images/characters/enemy/boss/オクトパン.png",
        hp: 22000,
        attack: 11000,
        counterDamage: 1350,
        reward: 220000
    },
    12: {
        name: "フレイムナイト",
        icon: "images/characters/enemy/boss/フレイムナイト.png",
        hp: 24000,
        attack: 12000,
        counterDamage: 1500,
        reward: 250000
    },
    13: {
        name: "リーフウィッチ",
        icon: "images/characters/enemy/boss/リーフウィッチ.png",
        hp: 27000,
        attack: 14000,
        counterDamage: 1600,
        reward: 280000
    },
    14: {
        name: "メタルスカイ",
        icon: "images/characters/enemy/boss/メタルスカイ.png",
        hp: 30000,
        attack: 15000,
        counterDamage: 1700,
        reward: 300000
    },
    15: {
        name: "魔王",
        icon: "images/characters/enemy/boss/デビルロード.png",
        hp: 50000,
        attack: 20000,
        counterDamage: 2000,
        reward: 500000
    },


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
        magicContents: [2, 9, 3, 4, 7],
        powerContents: [1, 2, 3],
        itemContents: [1, 2, 3, 9, 10, 12]
    },

    2: {
        name: "鷹島屋",
        magicContents: [2, 9, 3, 5, 6],
        powerContents: [1, 2, 3],
        itemContents: [4, 5, 6, 9, 10, 12]
    },

    3: {
        name: "スターバック",
        magicContents: [2, 9, 3, 4, 7],
        powerContents: [1, 2, 3],
        itemContents: [1, 2, 3, 9, 10, 12]
    }

};

// =========================
// 資産 type ID
// =========================

const ASSET_BOXES = {

    1: {
        name: "曹操のフリーレソ",
        contents: [1, 2, 3,5001,5002,5003,5004,5005]
    },

    2: {
        name: "無職確定",
        contents: [4, 5, 6, 7, 5006, 5007, 5008, 5009, 5010]
    },

    3: {
        name: "ぼくヤババ",
        contents: [8, 9, 10, 5011, 5012, 5013, 5014, 5015]
    },

    4: {
        name: "Re:０から始まる異世界ライフ",
        contents: [11, 12, 13, 14, 15, 16, 17,5016, 5017, 5018, 5019, 5020]
    },
    
    5: {
        name: "ボキバキメキ",
        contents: [18, 19, 20, 21, 22,5021, 5022, 5023, 5024, 5025]
    },

    6: {
        name: "押忍の子",
        contents: [23, 24, 25, 26, 27,  5026, 5027, 5028, 5029, 5030]
    },
    7: {
        name: "太陽号",
        contents: [28,29,30,31,32,33,34,35,5031, 5032, 5033, 5034, 5035]
    },
    8: {
        name: "葉の里",
        contents: [36,37,38,39,40, 5036, 5037, 5038, 5039, 5040]
    },
    9: {
        name: "アカデミア",
        contents: [41,42,43,44,45,5041, 5042, 5043, 5044, 5045]
    },
    10: {
        name: "銀多摩",
        contents: [46,47,48,49,50,5046, 5047, 5048, 5049, 5050]
    },
    11: {
        name: "進撃の人",
        contents: [51,52,53,54,55, 5051, 5052, 5053, 5054, 5055]
    },
    12: {
        name: "SFアニメ",
        contents: [56,57,58,59,60, 5056, 5057, 5058, 5059, 5060]
    },
    13: {
        name: "スパイアクション",
        contents: [61,62,63,64,65, 5061, 5062, 5063, 5064, 5065]
    },
    14: {
        name: "○○店",
        contents: [5066, 5067, 5068, 5069, 5070]
    },
    15: {
        name: "○○店",
        contents: [5071, 5072, 5073, 5074, 5075]
    },
    16: {   
        name: "○○店",
        contents: [5076, 5077, 5078, 5079, 5080]
    },
    17: {
        name: "○○店",
        contents: [5081, 5082, 5083, 5084, 5085]
    },
    18: {
        name: "○○店",
        contents: [5086, 5087, 5088, 5089, 5090]
    },
    19: {
        name: "○○店",
        contents: [5091, 5092, 5093, 5094, 5095]
    },
    20: {
        name: "○○店",
        contents: [5096, 5097, 5098, 5099, 5100]
    },
    21: {
        name: "○○店",
        contents: [5101, 5102, 5103, 5104, 5105]
    },
    22: {
        name: "○○店",
        contents: [5106, 5107, 5108, 5109, 5110]
    },
    23: {
        name: "○○店",
        contents: [5111, 5112, 5113, 5114, 5115]
    },
    24: {
        name: "○○店",
        contents: [5116, 5117, 5118, 5119, 5120]
    },
    25: {
        name: "○○店",
        contents: [5121, 5122, 5123, 5124, 5125]
    },
    26: {
        name: "○○店",
        contents: [5126, 5127, 5128, 5129, 5130]
    },
    27: {
        name: "○○店",
        contents: [5131, 5132, 5133, 5134, 5135]
    },
    28: {
        name: "○○店",
        contents: [5136, 5137, 5138, 5139, 5140]
    },
    29: {
        name: "○○店",
        contents: [5141, 5142, 5143, 5144, 5145]
    },
    30: {
        name: "○○店",
        contents: [5146, 5147, 5148, 5149, 5150]
    }

};

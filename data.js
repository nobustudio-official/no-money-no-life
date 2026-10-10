// =========================
// プレイヤーcontents
// =========================

const　PLAYER_CONTENTS = {

   1: {
        name: "戦士",
        icon: "images/characters/戦士-icon.png",
        sprite: "images/characters/戦士.png"
    },
    2: {
        name: "めぐみ",
        icon: "images/characters/めぐみ-icon.png",
        sprite: "images/characters/めぐみ.png"
    },

    3: {
        name: "聖職者",
        icon: "images/characters/聖職者-icon.png",
        sprite: "images/characters/聖職者.png"
    },

    4: {
        name: "剣士",
        icon: "images/characters/剣士-icon.png",
        sprite: "images/characters/剣士.png"
    },

    5: {
        name: "騎士",
        icon: "images/characters/騎士-icon.png",
        sprite: "images/characters/騎士.png"
    },
    
    6: {
        name: "魔術師",
        icon: "images/characters/魔術師-icon.png",
        sprite: "images/characters/魔術師.png"
    },

    7: {
        name: "鍛冶士",
        icon: "images/characters/鍛冶士-icon.png",
        sprite: "images/characters/鍛冶士.png"
    },

    8: {
        name: "看護師",
        icon: "images/characters/看護師-icon.png",
        sprite: "images/characters/看護師.png"
    },

    9: {
        name: "獣人",
        icon: "images/characters/獣人-icon.png",
        sprite: "images/characters/獣人.png"
    },

    10: {
        name: "エルフ",
        icon: "images/characters/エルフ-icon.png",
        sprite: "images/characters/エルフ.png"
    },
    11: {
        name: "義賊",
        icon: "images/characters/義賊-icon.png",
        sprite: "images/characters/義賊.png"
    },
    12: {
        name: "拳法",
        icon: "images/characters/拳法-icon.png",
        sprite: "images/characters/拳法.png"
    }

}   

// =========================
// お金 contents
// =========================

const MONEY_CONTENTS = {

    1: {

        rewards: [
            {
                amount: 2000,
                probability: 20
            },
            {
                amount: 5000,
                probability: 20
            },
            {
                amount: 8000,
                probability: 20
            },
            {
                amount: 10000,
                probability: 15
            },
            {
                amount: 15000,
                probability: 10
            },
            {
                amount: 20000,
                probability: 9
            },
            {
                amount: 30000,
                probability: 5
            },
            {
                amount: 100000,
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
        hp: 1000,
        attack: 500,
        magicReward: 30,
        goldReward: 5000
    },

    2: {
        name: "アンデット",
        icon: "images/characters/enemy/normal/アンデット.png",
        hp: 1100,
        attack: 1000,
        magicReward: 30,
        goldReward: 6000
    },

    3: {
        name: "デビルこうもり",
        icon:  "images/characters/enemy/normal/デビルこうもり.png",
        hp: 1600,
        attack: 800,
        magicReward: 50,
        goldReward: 10000
    },
    4: {
        name: "パックン",
        icon:  "images/characters/enemy/normal/パックン.png",
        hp: 1800,
        attack: 1200,
        magicReward: 60,
        goldReward: 12000
    },
    5: {
        name: "マッシュル",
        icon:  "images/characters/enemy/normal/マッシュル.png",
        hp: 1300,
        attack: 1000,
        magicReward: 40,
        goldReward: 8000
    },
    6: {
        name: "ウッディオ",
        icon:  "images/characters/enemy/normal/ウッディオ.png",
        hp: 1700,
        attack: 1100,
        magicReward: 60,
        goldReward: 13000
    },
    7: {
        name: "チビリン",
        icon:  "images/characters/enemy/normal/チビリン.png",
        hp: 1500,
        attack: 900,
        magicReward: 40,
        goldReward: 9000
    },
    8: {
        name: "メタルゴーレム",
        icon:  "images/characters/enemy/normal/メタルゴーレム.png",
        hp: 2700,
        attack: 1500,
        magicReward: 100,
        goldReward: 20000
    },
    9: {
        name: "アイソル",
        icon:  "images/characters/enemy/normal/アイソル.png",
        hp: 1900,
        attack: 1000,
        magicReward: 70,
        goldReward: 14000
    },
    10: {
        name: "ゴースハット",
        icon:  "images/characters/enemy/normal/ゴースハット.png",
        hp: 1500,
        attack: 1200,
        magicReward: 50,
        goldReward: 11000
    },
    11: {
        name: "きっくん",
        icon:  "images/characters/enemy/normal/きっくん.png",
        hp: 1000000,
        attack: 100000,
        magicReward: 1000,
        goldReward: 2500000
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
        price: 30000,
        category: "move",
        effect: "サイコロを3個振れる",
        rank: 1
    },

    3: {
        name: "グリーン車",
        price: 50000,
        category: "move",
        effect: "サイコロを4個振れる",
        rank: 1
    },

    4: {
        name: "ビジネスクラス",
        price: 70000,
        category: "move",
        effect: "サイコロを5個振れる",
        rank: 2
    },

    5: {
        name: "ファーストクラス",
        price: 100000,
        category: "move",
        effect: "サイコロを6個振れる",
        rank: 2
    },

    6: {
        name: "プライベートジェット",
        price: 150000,
        category: "move",
        effect: "サイコロを8個振れる",
        rank: 3
    },

    7: {
        name: "走れ、メロス",
        price: 200000,
        category: "move",
        effect: "サイコロを10個振れる",
        rank: 3
    },

    8: {
        name: "どんぴ車",
        price: 100000,
        category: "move",
        effect: "6マス以内の好きなマスに止まれる",
        rank: 2
    },

    9: {
        name: "お守り",
        price: 10000,
        category: "passive",
        effect: "相手から受けるダメージ－500",
        effectType: "damageReduction",
        effectTarget: "self",
        effectValue: 500,
        effectDuration: "permanent",
        rank: 1
    },

    10: {
        name: "ダンベル",
        price: 20000,
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
        effect: "3ターンの間、開始時8000G獲得",
        effectType: "goldGain",
        effectTarget: "self",
        effectValue: 8000,
        effectDuration: "3turn",
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
        rank: 1
    },
    13: {
        name: "ロスノート",
        price: 500000,
        category: "special",
        effect: "このノートに名前を書かれた者は〇ぬ",
        effectType: "bossCounterImmunity",
        effectTarget: "lossNote",
        effectDuration: "playe",
        rank: 2
    },
    14: {
    name: "瞬間移動",
    price: 200000,
    category: "warp",
    effect: "ボスマスまであと1マスの場所へ移動する",
    effectType: "warpToBoss",
    effectTarget: "self",
    effectValue: 1,
    effectDuration: "instant",
    rank: 1
    },
    15: {
        name: "不運な財布",
        price: 0,
        category: "passive",
        effect: "3ターンの間、開始時-8000G",
        effectType: "goldGain",
        effectTarget: "self",
        effectValue:-8000,
        effectDuration: "3turn",
        rank: 1
    },
    16: {
        name: "強運の財布",
        price: 0,
        category: "passive",
        effect: "3ターンの間、開始時20000G獲得",
        effectType: "goldGain",
        effectTarget: "self",
        effectValue: 20000,
        effectDuration: "3turn",
        rank: 2
    },
    17: {
        name: "叩き派遣",
        price: 500000,
        category: "special",
        effect: "他のプレイヤーのアイテムをランダムで破壊",
        effectType: "destroyItems",
        effectTarget: "others",
        effectDuration: "instant",
        rank: 2
    },
    18: {
        name: "ロストマジック",
        price: 500000,
        category: "special",
        effect: "指定したプレイヤーの魔法を1つ選んで消失させる",
        effectType: "magicLoss",
        effectTarget: "otherPlayer",
        effectDuration: "instant",
        rank: 2
    },
    19: {
        name: "闇みずほ",
        price: 0,
        category: "special",
        effect: "指定プレイヤーに対しゴールドを送金または強奪",
        effectType: "moneyTransfer",
        effectTarget: "otherPlayer",
        effectDuration: "instant",
        rank: 2
    },
     20: {
        name: "飛んできマス",
        price: 200000,
        category: "warp",
        effect: "マップのどこかしらにワープする",
        effectType: "warpToRandom",
        effectTarget: "self",
        effectValue: 1,
        effectDuration: "instant",
        rank: 1
    },
    21: {
        name: "闇ヤマト",
        price: 150000,
        category: "special",
        effect: "指定プレイヤーにアイテムを送付または強奪",
        effectType: "itemTransfer",
        effectTarget: "otherPlayer",
        effectDuration: "instant",
        rank: 2
    },
    22: {
        name: "闇スーモ",
        price: 0,
        category: "special",
        effect: "指定プレイヤーに資産を贈与または強奪",
        effectType: "assetTransfer",
        effectTarget: "otherPlayer",
        effectDuration: "instant",
        rank: 2
    },
     23: {
        name: "ふっとばしマス",
        price: 50000,
        category: "warp",
        effect: "他プレイヤー全員をどこかのマスに飛ばす",
        effectType: "warpAllPlayersRandom",
        effectTarget: "otherPlayer",
        effectValue: 1,
        effectDuration: "instant",
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
        price: 1000,
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
        price: 11000,
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
        price: 60000,
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
        price: 120000,
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
        price: 200000,
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
        price: 150000,
        actionAfterUse: "continue",
        rank: 0
    },
    7: {
        name: "スピッファ",
        type: "attack",
        icon: "images/magic/スピファ.png",
        effect: "魔力の600％で攻撃",
        sound: "sounds/戦闘/重機関銃を乱射1.mp3",
        powerRate: 6.0,
        costRate: 8.0,
        buffTarget: null,
        buffStat: null,
        buffRate: null,
        buffDuration: null,
        price: 250000,
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
        costRate: 10.0,
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
        price: 25000,
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
        costRate: 3.0,
        buffTarget: null,
        buffStat: null,
        buffRate: null,
        buffDuration: null,
        price: 0,
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
            yield: 20,
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
    yield: 10,
    owner: null
},

2: {
    name: "フェルソ",
    price: 30000,
    yield: 10,
    owner: null
},

3: {
    name: "ショタルク",
    price: 20000,
    yield: 10,
    owner: null
},

4: {
    name: "ナナボシ",
    price: 50000,
    yield: 10,
    owner: null
},

5: {
    name: "ロシシー",
    price: 200000,
    yield: 5,
    owner: null
},

6: {
    name: "エシス",
    price: 200000,
    yield: 5,
    owner: null
},

7: {
    name: "シルフィネット",
    price: 200000,
    yield: 5,
    owner: null
},

8: {
    name: "足立",
    price: 20000,
    yield: 10,
    owner: null
},

9: {
    name: "市原",
    price: 100000,
    yield: 10,
    owner: null
},

10: {
    name: "山田",
    price: 100000,
    yield: 10,
    owner: null
},

11: {
    name: "笑みリア",
    price: 10000000,
    yield: 1,
    owner: null
},

12: {
    name: "檸夢",
    price: 300000,
    yield: 5,
    owner: null
},

13: {
    name: "羅夢",
    price: 300000,
    yield: 5,
    owner: null
},

14: {
    name: "ベアトニス",
    price: 200000,
    yield: 5,
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
    price: 80000,
    yield: 10,
    owner: null
},

17: {
    name: "オズワーリ",
    price: 40000,
    yield: 10,
    owner: null
},

18: {
    name: "煙猫",
    price: 200000,
    yield: 5,
    owner: null
},

19: {
    name: "薬猫",
    price: 100000,
    yield: 10,
    owner: null
},

20: {
    name: "＊猫",
    price: 80000,
    yield: 10,
    owner: null
},

21: {
    name: "酒猫",
    price: 40000,
    yield: 10,
    owner: null
},

22: {
    name: "笑猫",
    price: 5000,
    yield: 100,
    owner: null
},

23: {
    name: "アクア",
    price: 30000,
    yield: 10,
    owner: null
},

24: {
    name: "ルビー",
    price: 30000,
    yield: 10,
    owner: null
},

25: {
    name: "あれまかな",
    price: 50000,
    yield: 10,
    owner: null
},

26: {
    name: "白川あかね",
    price: 40000,
    yield: 10,
    owner: null
},

27: {
    name: "Mちょ",
    price: 20000,
    yield: 10,
    owner: null
},

28: {
    name: "ルフェ",
    price: 3000000,
    yield: 1,
    owner: null
},

29: {
    name: "ゾノ",
    price: 100000,
    yield: 10,
    owner: null
},

30: {
    name: "ナミィ",
    price: 100000,
    yield: 10,
    owner: null
},

31: {
    name: "サンシ",
    price: 100000,
    yield: 10,
    owner: null
},

32: {
    name: "ウンップ",
    price: 50000,
    yield: 10,
    owner: null
},

33: {
    name: "ロビソ",
    price: 50000,
    yield: 10,
    owner: null
},

34: {
    name: "ハソコック",
    price: 50000,
    yield: 10,
    owner: null
},

35: {
    name: "ブルッブル",
    price: 30000,
    yield: 10,
    owner: null
},

36: {
    name: "ナルコ",
    price: 200000,
    yield: 5,
    owner: null
},

37: {
    name: "サステ",
    price: 200000,
    yield: 5,
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
    yield: 5,
    owner: null
},

42: {
    name: "お茶の子",
    price: 300000,
    yield: 5,
    owner: null
},

43: {
    name: "爆音",
    price: 300000,
    yield: 5,
    owner: null
},

44: {
    name: "轟消灯",
    price: 300000,
    yield: 5,
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
    yield: 2,
    owner: null
},

47: {
    name: "KAGURA",
    price: 500000,
    yield: 5,
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
    yield: 10,
    owner: null
},

50: {
    name: "まるでダメなおっさん",
    price: 2000,
    yield: 200,
    owner: null
},
51: {
    name: "エレ",
    price: 50000,
    yield: 10,
    owner: null
},

52: {
    name: "ミサカ",
    price: 80000,
    yield: 10,
    owner: null
},

53: {
    name: "ナイミン",
    price: 40000,
    yield: 10,
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
    yield: 10,
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
    yield: 10,
    owner: null
},

58: {
    name: "風呂好き",
    price: 40000,
    yield: 10,
    owner: null
},

59: {
    name: "小金持ち",
    price: 30000,
    yield: 10,
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
    yield: 5,
    owner: null
},

63: {
    name: "夜",
    price: 200000,
    yield: 5,
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
    yield: 10,
    owner: null
},

66: {
    name: "日向翔陰",
    price: 20000,
    yield: 10,
    owner: null
},

67: {
    name: "影山飛雌",
    price: 20000,
    yield: 10,
    owner: null
},

68: {
    name: "月島小樽",
    price: 20000,
    yield: 10,
    owner: null
},

69: {
    name: "西谷朝",
    price: 20000,
    yield: 10,
    owner: null
},

70: {
    name: "澤村平地",
    price: 20000,
    yield: 10,
    owner: null
},

71: {
    name: "チェンソー男",
    price: 30000,
    yield: 10,
    owner: null
},

72: {
    name: "力",
    price: 30000,
    yield: 10,
    owner: null
},

73: {
    name: "速河アキ",
    price: 30000,
    yield: 10,
    owner: null
},

74: {
    name: "マキマキ",
    price: 300000,
    yield: 5,
    owner: null
},

75: {
    name: "爆弾美女",
    price: 300000,
    yield: 5,
    owner: null
},

76: {
    name: "二刀流黒剣士チートニキ",
    price: 200000,
    yield: 5,
    owner: null
},

77: {
    name: "明日までな",
    price: 200000,
    yield: 5,
    owner: null
},

78: {
    name: "結衣",
    price: 30000,
    yield: 10,
    owner: null
},

79: {
    name: "シオン",
    price: 30000,
    yield: 10,
    owner: null
},

80: {
    name: "リファ",
    price: 30000,
    yield: 10,
    owner: null
},

81: {
    name: "ヒキニート",
    price: 100000,
    yield: 10,
    owner: null
},

82: {
    name: "トイレの女神様",
    price: 200000,
    yield: 5,
    owner: null
},

83: {
    name: "爆裂娘",
    price: 300000,
    yield: 5,
    owner: null
},

84: {
    name: "ララティー",
    price: 200000,
    yield: 5,
    owner: null
},

85: {
    name: "貧乏店主",
    price: 100000,
    yield: 10,
    owner: null
},

86: {
    name: "アインス",
    price: 500000,
    yield: 5,
    owner: null
},

87: {
    name: "アルベドン",
    price: 400000,
    yield: 5,
    owner: null
},

88: {
    name: "シャルティアン",
    price: 300000,
    yield: 5,
    owner: null
},

89: {
    name: "コキュートスン",
    price: 200000,
    yield: 5,
    owner: null
},

90: {
    name: "デミウルゴスン",
    price: 100000,
    yield: 10,
    owner: null
},

91: {
    name: "リムルン",
    price: 500000,
    yield: 5,
    owner: null
},

92: {
    name: "ベニマルン",
    price: 400000,
    yield: 5,
    owner: null
},

93: {
    name: "シュナン",
    price: 300000,
    yield: 5,
    owner: null
},

94: {
    name: "シオンソ",
    price: 300000,
    yield: 5,
    owner: null
},

95: {
    name: "ディアブロン",
    price: 300000,
    yield: 5,
    owner: null
},

96: {
    name: "五宮かぐや",
    price: 1000000,
    yield: 2.5,
    owner: null
},

97: {
    name: "白金御行",
    price: 1000000,
    yield: 2.5,
    owner: null
},

98: {
    name: "IQ３",
    price: 300000,
    yield: 5,
    owner: null
},

99: {
    name: "石上祐",
    price: 300000,
    yield: 5,
    owner: null
},

100: {
    name: "伊井野巫女",
    price: 300000,
    yield: 2.5,
    owner: null
},
101: {
    name: "高倉ケン",
    price: 50000,
    yield: 10,
    owner: null
},
102: {
    name: "綾瀬モモ",
    price: 50000,
    yield: 10,
    owner: null
},
103: {
    name: "霊媒師",
    price: 80000,
    yield: 10,
    owner: null
},
104: {
    name: "ジェット婆さん",
    price: 200000,
    yield: 5,
    owner: null
},
105: {
    name: "黒鳥愛羅",
    price: 50000,
    yield: 10,
    owner: null
},
106: {
    name: "ねこねこ",
    price: 80000,
    yield: 10,
    owner: null
},
107: {
    name: "しんし",
    price: 200000,
    yield: 5,
    owner: null
},
108: {
    name: "きょくようひ",
    price: 300000,
    yield: 5,
    owner: null
},
109: {
    name: "かおしゅん",
    price: 50000,
    yield: 10,
    owner: null
},
110: {
    name: "りはぐ",
    price: 400000,
    yield: 5,
    owner: null
},
111: {
    name: "ゾンビ-0号",
    price: 20000,
    yield: 10,
    owner: null
},
112: {
    name: "ゾンビ-1号",
    price: 30000,
    yield: 10,
    owner: null
},
113: {
    name: "ゾンビ-2号",
    price: 40000,
    yield: 10,
    owner: null
},
114: {
    name: "ゾンビ-3号",
    price: 50000,
    yield: 10,
    owner: null
},
115: {
    name: "ゾンビ-4号",
    price: 60000,
    yield: 10,
    owner: null
},
116: {
    name: "ゾンビ-5号",
    price: 70000,
    yield: 10,
    owner: null
},
117: {
    name: "ゾンビ-6号",
    price: 80000,
    yield: 10,
    owner: null
},
118: {
    name: "謎のプロデューサー",
    price: 600000,
    yield: 2.5,
    owner: null
},
119: {
    name: "デス叔父C",
    price: 100000,
    yield: 10,
    owner: null
},
120: {
    name: "デス叔父D",
    price: 120000,
    yield: 5,
    owner: null
},
121: {
    name: "夜神太陽",
    price: 700000,
    yield: 2.5,
    owner: null
},
122: {
    name: "R",
    price: 900000,
    yield: 2.5,
    owner: null
},
123: {
    name: "天音海砂",
    price: 500000,
    yield: 5,
    owner: null
},
124: {
    name: "ニアニア",
    price: 400000,
    yield: 5,
    owner: null
},
125: {
    name: "メロメロ",
    price: 300000,
    yield: 5,
    owner: null
},
126: {
    name: "喜多川マリ",
    price: 200000,
    yield: 5,
    owner: null
},
127: {
    name: "五条ワカ",
    price: 200000,
    yield: 5,
    owner: null
},
128: {
    name: "犬井紗寿叶",
    price: 300000,
    yield: 5,
    owner: null
},
129: {
    name: "アキラ",
    price: 500000,
    yield: 5,
    owner: null
},
130: {
    name: "姫野あま",
    price: 100000,
    yield: 10,
    owner: null
},
131: {
    name: "仲野一香",
    price: 50000,
    yield: 10,
    owner: null
},
132: {
    name: "仲野二之",
    price: 50000,
    yield: 10,
    owner: null
},
133: {
    name: "仲野三来",
    price: 50000,
    yield: 10,
    owner: null
},
134: {
    name: "仲野四覇",
    price: 50000,
    yield: 10,
    owner: null
},
135: {
    name: "仲野五木",
    price: 50000,
    yield: 10,
    owner: null
},
136: {
    name: "江戸川コウナン",
    price: 800000,
    yield: 2.5,
    owner: null
},
137: {
    name: "毛李蘭",
    price: 300000,
    yield: 5,
    owner: null
},
138: {
    name: "毛李大五郎",
    price: 200000,
    yield: 5,
    owner: null
},
139: {
    name: "灰波良愛",
    price: 400000,
    yield: 5,
    owner: null
},
140: {
    name: "真っ黒の人",
    price: 1000000,
    yield: 2.5,
    owner: null
},
141: {
    name: "ごっくん",
    price: 20000,
    yield: 10,
    owner: null
},
142: {
    name: "ベジタ",
    price: 700000,
    yield: 2.5,
    owner: null
},
143: {
    name: "ピコロ",
    price: 500000,
    yield: 5,
    owner: null
},
144: {
    name: "クリリリン",
    price: 300000,
    yield: 5,
    owner: null
},
145: {
    name: "フリーサ",
    price: 900000,
    yield: 2.5,
    owner: null
},
146: {
    name: "釜戸炭士郎",
    price: 60000,
    yield: 10,
    owner: null
},
147: {
    name: "釜戸寝子",
    price: 100000,
    yield: 10,
    owner: null
},
148: {
    name: "我妻善一",
    price: 100000,
    yield: 10,
    owner: null
},
149: {
    name: "嘴平之助",
    price: 400000,
    yield: 5,
    owner: null
},
150: {
    name: "富山義裕",
    price: 1000000,
    yield: 1,
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
        name: "ファミレス",
        unitPrice: 32000,
        specialEffect: "arrest"
    },

    3: {
        name: "パン屋",
        unitPrice: 33000
    },

    4: {
        name: "引っ越し",
        unitPrice: 35000
    },
    5: {
        name: "ラーメン屋",
        unitPrice: 31000
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
        counterDamage: 500,
        reward: 15000
    },

    2: {
        name: "ショートスリーパー",
        icon: "images/characters/enemy/boss/ショートスリーパー.png",
        hp: 4000,
        attack: 1500,
        counterDamage: 650,
        reward: 20000
    },

    3: {
        name: "アイスクイーン",
        icon: "images/characters/enemy/boss/アイスクイーン.png",
        hp: 5000,
        attack: 2000,
        counterDamage: 800,
        reward: 25000
    },

    4: {
        name: "スカルゴースト",
        icon: "images/characters/enemy/boss/スカルゴースト.png",
        hp: 6000,
        attack: 2500,
        counterDamage: 1000,
        reward: 30000
    },

    5: {
        name: "青眼の白龍",
        icon: "images/characters/enemy/boss/青眼の白龍.png",
        hp: 8000,
        attack: 3000,
        counterDamage: 1200,
        reward: 40000
    },

    6: {
        name: "ロックス",
        icon: "images/characters/enemy/boss/ロックス.png",
        hp: 10000,
        attack: 4000,
        counterDamage: 1350,
        reward: 50000
    },

    7: {
        name: "ウッドビット",
        icon: "images/characters/enemy/boss/ウッドビット.png",
        hp: 12000,
        attack: 5000,
        counterDamage: 1500,
        reward:60000
    },
    8: {
        name: "いただきリリィ",
        icon: "images/characters/enemy/boss/いただきリリィ.png",
        hp: 15000,
        attack: 6000,
        counterDamage: 1700,
        reward: 80000
    },
    9: {
        name: "シャイニングナイト",
        icon: "images/characters/enemy/boss/シャイニングナイト.png",
        hp: 17000,
        attack: 8000,
        counterDamage: 1850,
        reward: 120000
    },
    10: {
        name: "水原二平",
        icon: "images/characters/enemy/boss/水原二平.png",
        hp: 20000,
        attack: 10000,
        counterDamage: 2000,
        reward: 150000
    },
    11: {
        name: "オクトパン",
        icon: "images/characters/enemy/boss/オクトパン.png",
        hp: 22000,
        attack: 11000,
        counterDamage: 2250,
        reward: 180000
    },
    12: {
        name: "フレイムナイト",
        icon: "images/characters/enemy/boss/フレイムナイト.png",
        hp: 24000,
        attack: 12000,
        counterDamage: 2500,
        reward: 200000
    },
    13: {
        name: "リーフウィッチ",
        icon: "images/characters/enemy/boss/リーフウィッチ.png",
        hp: 25000,
        attack: 14000,
        counterDamage: 2750,
        reward: 220000
    },
    14: {
        name: "メタルスカイ",
        icon: "images/characters/enemy/boss/メタルスカイ.png",
        hp: 30000,
        attack: 15000,
        counterDamage: 3000,
        reward: 250000
    },
    15: {
        name: "ライオンナイト",
        icon: "images/characters/enemy/boss/ライオンナイト.png",
        hp: 33000,
        attack: 18000,
        counterDamage: 3300,
        reward: 280000
    },
     16: {
        name: "少林パンダ",
        icon: "images/characters/enemy/boss/少林パンダ.png",
        hp: 36000,
        attack: 20000,
        counterDamage: 3600,
        reward: 310000
    },
    17: {
        name: "クリスタルウルフ",
        icon: "images/characters/enemy/boss/クリスタルウルフ.png",
        hp: 40000,
        attack: 22000,
        counterDamage: 3800,
        reward: 350000
    },
    18: {
        name: "イーグルウォーリアー",
        icon: "images/characters/enemy/boss/イーグルウォーリアー.png",
        hp: 45000,
        attack: 24000,
        counterDamage: 4000,
        reward: 380000
    },
     19: {
        name: "リーフバード",
        icon: "images/characters/enemy/boss/リーフバード.png",
        hp: 47000,
        attack: 27000,
        counterDamage: 4000,
        reward: 420000
    },
    20: {
        name: "ダークユニコーン",
        icon: "images/characters/enemy/boss/ダークユニコーン.png",
        hp: 50000,
        attack: 30000,
        counterDamage: 4000,
        reward: 460000
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
        magicContents: [1, 2, 9, 3, 4, 7],
        powerContents: [1, 2, 3],
        itemContents: [1, 2, 3, 8, 9 ,12, 13]
    },

    2: {
        name: "鷹島屋",
        magicContents: [1, 2, 9, 3, 5, 6],
        powerContents: [1, 2, 3],
        itemContents: [1, 2, 3, 8, 9, 14, 20, 21]
    },

    3: {
        name: "スターバック",
        magicContents: [1, 2, 9, 3, 4, 7],
        powerContents: [1, 2, 3],
        itemContents: [1, 2, 3, 8, 9, 13, 17]
    },
    4: {
        name: "伊瀬たん",
        magicContents: [1, 2, 9, 3, 5, 6],
        powerContents: [1, 2, 3],
        itemContents: [1, 2, 3, 8, 9, 13, 18]
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
        name: "バレーボール部",
        contents: [66,67,68,69,70,5066, 5067, 5068, 5069, 5070]
    },
    15: {
        name: "悪魔との契約店",
        contents: [71, 72, 73, 74, 75,5071, 5072, 5073, 5074, 5075]
    },
    16: {   
        name: "ソードアートオフライン",
        contents: [76, 77, 78, 79, 80,5076, 5077, 5078, 5079, 5080]
    },
    17: {
        name: "この素晴らしい人生に祝福を",
        contents: [81, 82, 83, 84, 85,5081, 5082, 5083, 5084, 5085]
    },
    18: {
        name: "オーバーロー",
        contents: [86, 87, 88, 89, 90,5086, 5087, 5088, 5089, 5090]
    },
    19: {
        name: "転生したら塗消しだった",
        contents: [91, 92, 93, 94, 95,5091, 5092, 5093, 5094, 5095]
    },
    20: {
        name: "かぐや様は告られたい",
        contents: [96, 97, 98, 99, 100,5096, 5097, 5098, 5099, 5100]
    },
    21: {
        name: "タンタタン",
        contents: [101, 102, 103, 104, 105,5101, 5102, 5103, 5104, 5105]
    },
    22: {
        name: "口の軽い薬屋",
        contents: [106, 107, 108, 109, 110,5106, 5107, 5108, 5109, 5110]
    },
    23: {
        name: "ゾンビパーク佐賀",
        contents: [111, 112, 113, 114, 115,116, 117, 118, 119, 120,5111, 5112, 5113, 5114, 5115]
    },
    24: {
        name: "ロスノート",
        contents: [121, 122, 123, 124, 125,5116, 5117, 5118, 5119, 5120]
    },
    25: {
        name: "着せ替え人形店",
        contents: [126, 127, 128, 129, 130,5121, 5122, 5123, 5124, 5125]
    },
    26: {
        name: "五等分の花束",
        contents: [131, 132, 133, 134, 135,5126, 5127, 5128, 5129, 5130]
    },
    27: {
        name: "殺人事件多すぎ街",
        contents: [136, 137, 138, 139, 140,5131, 5132, 5133, 5134, 5135]
    },
    28: {
        name: "ドラゴンホール",
        contents: [141, 142, 143, 144, 145,5136, 5137, 5138, 5139, 5140]
    },
    29: {
        name: "鬼にすぎて滅!!",
        contents: [146, 147, 148, 149, 150, 5141, 5142, 5143, 5144, 5145]
    },
    30: {
        name: "モブ店",
        contents: [5146, 5147, 5148, 5149, 5150, 5151, 5152, 5153, 5154, 5155]
    }

};

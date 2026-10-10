/* =========================================================
   maou.js

   魔王イベント専用ロジック。

   通常戦闘のUI・ラウンド管理・プレイヤー側の魔法処理は
   battle-ui.js の既存システムを利用します。
   ========================================================= */

(function () {

    "use strict";

    // =====================================================
    // 設定
    // =====================================================

    // 魔王登場条件の設定
    const MAOU_CONFIG = {
        //これまでに倒したボスの数
        requiredBossDefeatedCount: 10,
        //プレイヤー全員の総資産額の平均
        requiredAverageAssetValue: 300000,
        //「めぐみ」のキャラクターID
        megumiCharacterId: 2,
        // モブ資産の購入数
        requiredMobAssetCount: 5,
        // モブ以外の資産の購入数
        requiredNonMobAssetCount: 5,


        // 魔王を「次のボス」にするための内部ID。
        id: 9999,

        appearanceSquareId: 139,

        // 内容は後から調整できるようにここへ集約。
        firstForm: {
            name: "魔王",
            icon: "images/characters/enemy/魔王/魔王-1.png",
            hp: 30000,
            attack: 15000,
            counterDamage: 2500,
            reward: 0
        },

       secondForm: {
    name: "魔王",
    icon: "images/characters/enemy/魔王/魔王-2.png",
    hp: 300000,
    magicPower: 4000,
    reward: 0
},

// =====================================================
// 魔王報酬
// =====================================================

// 最初に魔王へ到達したプレイヤーへの先着報酬
firstReward: 200000,

// 最後に魔王を倒したプレイヤーへの撃破報酬
defeatReward: 200000,

        // 会話表示設定
        dialogue: {
            background: "",
            charInterval: 50,
            initialDelay: 0,
            clickDelay: 0,

     beforeFirstBattle: [
    { text: "" },
    { text: "・・・" },
    { text: "・・・" },
    { text: "あなた、沢山の資産を持っているのね" },
    { text: "中にはお気に入りの子もいるんじゃないかしら" },
    { text: "自然と顔や名前が浮かんだりして" },
    { text: "きっとあなたにとって魅力的なんでしょう" },
    { text: "・・・" },
    { text: "ところで、『モブ』に浮かんだ顔はあったかしら" },
    { text: "浮かんだ名前はあったかしら" },
    { text: "・・・" },
    { text: "浮かばないわよね、だって『モブ』だもの" },
    { text: "・・・" },
    { text: "でもね" },
    { text: "きっとその子にだって顔や名前はあったはず" },
    { text: "・・・" },
    { text: "あなたは・・・" },
    { text: "そうやって忘れられた子の気持ちが分かる？" },
    { text: "誰からも選ばれないことが、どんなに悲しいか・・・" },
    { text: "・・・" },
    { text: "だから、こうすることにしたの・・・" },
    { text: "・・・" },
    { text: "あなたは、自分の選んだ道で強くなった" },
    { text: "好きな魔法を選んで" },
    { text: "好きなアイテムを選んで" },
    { text: "好きな子を選んで・・・" },
    { text: "それがこの世界の・・・ルールだから" },
    { text: "・・・" },
    { text: "どうして、あのとき・・・" },
    { text: "・・・" },
    { text: "私は・・・" },
    { text: "私は・・・『モブ』なんかじゃない！", 
    startBGM: true },
    { text: "・・・" },
    { text: "なのに私は・・・" },
    { text: "誰かの一番にはなれない" },
    { text: "・・・" },
    { text: "だからいっそ、あなたの全部を奪って" },
    { text: "私だけを見てもらえるように" },
    { text: "全てを懸けるわ" },
    { text: "・・・" },
    { text: "・・・それが私の・・・選択",
    image: "images/characters/enemy/魔王/魔王-1.png"
    }
    ],
    beforeSecondBattle: [   
    { text: "" },
    { text: "・・・まだよ" },
    { text: "まだ終われない" },
    { text: "・・・" },
    { text: "私がここにいるってこと" },
    { text: "最後まで証明して見せる！",
        image: "images/characters/enemy/魔王/魔王-2.png",
    secondFormSound: true}
        ],
    ending: [
    { text: "" },
    { text: "・・・勝てなかった" },
    { text: "悔しいけど、もう私に力は残ってないわ" },
    { text: "結局、あなたには敵わないのね" },
    { text: "沢山の魅力的な子達には、敵わないのね" },
    { text: "・・・" },
    { text: "でも最後に、私の事を見てくれたかしら" },
    { text: "" },
    { text: "・・・ねえ、覚えてる？" },
    { text: "初めて会った時のこと" },
    { text: "あなたは私の名前を呼んでくれた" },
    { text: "それだけで、どんなに嬉しかったことか" },
    { text: "・・・" },
    { text: "でも・・・私は選んでもらえなかった" },
    { text: "・・・" },
    { text: "・・・まだ、覚えてる？" },
    { text: "" },
    { text: "私の名前・・・" },
    { text: "" },
    { text: "私の名前はね・・・" },
    {  text: "・・・",
    hideImage: true},
    {text: "　　めぐみ　　っていうの",
    image: "images/characters/enemy/魔王/魔王-4.png"},
    { text: "" ,fadeOutImage: true}
            ]
        },

        images: {
            firstBattle: "images/characters/enemy/魔王/魔王-1.png",
            secondBattle: "images/characters/enemy/魔王/魔王-1.png",
            endingStart: "images/characters/enemy/魔王/魔王-3.png",
            endingFinal: "images/characters/enemy/魔王/魔王-4.png"
        }
    };


    // =====================================================
    // 状態
    // =====================================================

  let assetConditionReached = false;
let encounterPending = false;
let maouActive = false;

// 魔王をゲーム中に一度でも討伐したか
let maouDefeated = false;

// 魔王第一形態の初回エンカウント演出を
// すでに再生したか
let maouPreviousBossId = null;
let maouFirstEncountered = false;
let maouCurrentForm = 1;

let dialogueTimer = null;
let dialogueIndex = 0;
let dialogueChars = 0;
let dialogueBusy = false;

    // =====================================================
    // めぐみがいるか
    // =====================================================

    function hasMegumiPlayer() {

        if (
            !window.players ||
            window.players.length === 0
        ) {
            return false;
        }

        return window.players.some(
            function (player) {
                return Number(player.characterId) ===
                    MAOU_CONFIG.megumiCharacterId;
            }
        );
    }


    // =====================================================
    // 平均総資産
    // =====================================================

    function getAverageAssetValue() {

        if (
            !window.players ||
            window.players.length === 0 ||
            typeof calculateTotalAssetValue !== "function"
        ) {
            return 0;
        }

        const total = window.players.reduce(
            function (sum, player) {
                return sum + Number(calculateTotalAssetValue(player) || 0);
            },
            0
        );

        return total / window.players.length;
    }

    function getMobAssetCount() {
    if (!window.players || window.players.length === 0) return 0;

    return window.players.reduce(function (count, player) {
        if (!Array.isArray(player.assets)) return count;

        return count + player.assets.filter(function (assetId) {
            const asset = ASSET_CONTENTS[assetId];
            return asset && asset.name === "モブ";
        }).length;
    }, 0);
}

function getNonMobAssetCount() {
    if (!window.players || window.players.length === 0) return 0;

    return window.players.reduce(function (count, player) {
        if (!Array.isArray(player.assets)) return count;

        return count + player.assets.filter(function (assetId) {
            const asset = ASSET_CONTENTS[assetId];
            return asset && asset.name !== "モブ";
        }).length;
    }, 0);
}

        // =====================================================
    // モブ資産購入数
    // =====================================================

    function getMobAssetCount() {

        if (
            !window.players ||
            window.players.length === 0 ||
            typeof ASSET_CONTENTS === "undefined"
        ) {
            return 0;
        }

        let count = 0;

        window.players.forEach(
            function (player) {

                (player.assets || []).forEach(
                    function (assetId) {

                        const asset =
                            ASSET_CONTENTS[assetId];

                        if (
                            asset &&
                            asset.name === "モブ"
                        ) {
                            count += 1;
                        }

                    }
                );

            }
        );

        return count;
    }


    // =====================================================
    // モブ以外の資産購入数
    // =====================================================

    function getNonMobAssetCount() {

        if (
            !window.players ||
            window.players.length === 0 ||
            typeof ASSET_CONTENTS === "undefined"
        ) {
            return 0;
        }

        let count = 0;

        window.players.forEach(
            function (player) {

                (player.assets || []).forEach(
                    function (assetId) {

                        const asset =
                            ASSET_CONTENTS[assetId];

                        if (
                            asset &&
                            asset.name !== "モブ"
                        ) {
                            count += 1;
                        }

                    }
                );

            }
        );

        return count;
    }


    // =====================================================
    // 条件確認
    // =====================================================

      function updateEncounterCondition() {

    if (maouDefeated) return;
    if (maouActive || encounterPending) return;
    if (typeof bossDefeatedCount === "undefined") return;


        // =================================================
        // 平均総資産額
        // =================================================
    if (getAverageAssetValue() > MAOU_CONFIG.requiredAverageAssetValue) {
        assetConditionReached = true;
    }


        // =================================================
        // モブ資産購入数
        // =================================================

         const mobAssetCount = getMobAssetCount();
    const mobAssetConditionMet =
        mobAssetCount >= MAOU_CONFIG.requiredMobAssetCount;


        // =================================================
        // モブ以外の資産購入数
        // =================================================

        const nonMobAssetCount = getNonMobAssetCount();
    const nonMobAssetConditionMet =
        nonMobAssetCount >= MAOU_CONFIG.requiredNonMobAssetCount;


        // =================================================
        // 全条件確認
        // =================================================

        const conditionsMet =

            // ボス撃破数
             bossDefeatedCount >= MAOU_CONFIG.requiredBossDefeatedCount 
             &&
            // 平均総資産額を一度でも超えた
             bossDefeatedCount >= MAOU_CONFIG.requiredBossDefeatedCount 
             &&
            // モブ資産購入数
            mobAssetConditionMet 
            &&
            // モブ以外の資産購入数
           nonMobAssetConditionMet
            &&
            // めぐみがいない
           !hasMegumiPlayer();


       if (conditionsMet) {
        encounterPending = true;

        console.log(
            "【魔王】出現条件成立。現在のボス撃破後に魔王へ移行します。"
        );
    }
}


    // =====================================================
    // 魔王データ
    // =====================================================

    function createMaouBoss(form) {

        const source =
            form === 2
                ? MAOU_CONFIG.secondForm
                : MAOU_CONFIG.firstForm;

        return {
            name: source.name,
            icon: source.icon,
            hp: Number(source.hp || 0),
            attack: Number(source.attack || 0),
            counterDamage: Number(source.counterDamage || 0),
            reward: Number(source.reward || 0),
            specialBoss: true,
            maouForm: form
        };
    }


    // =====================================================
    // 魔王専用UI
    // =====================================================

    function ensureMaouDialogueUI() {

        let root = document.getElementById("maouDialogueRoot");

        if (root) {
            return root;
        }

        root = document.createElement("div");
        root.id = "maouDialogueRoot";
        root.style.cssText = [
            "position:fixed",
            "inset:0",
            "z-index:30000",
            "display:none",
            "background:#080808",
            "align-items:center",
            "justify-content:center"
        ].join(";");

        root.innerHTML = `
            <div id="maouDialogueScreen" style="position:relative;width:min(100vw,900px);height:min(100vh,700px);overflow:hidden;background:#111;display:flex;align-items:flex-end;justify-content:center;">
                <div id="maouDialogueBackground" style="position:absolute;inset:0;background-position:center;background-size:cover;background-repeat:no-repeat;"></div>
                <img id="maouDialogueImage" alt="" style="position:absolute;left:50%;bottom:110px;transform:translateX(-50%);max-width:70%;max-height:65%;object-fit:contain;display:none;pointer-events:none;">
                <div id="maouDialogueMessage" style="position:absolute;left:5%;right:5%;bottom:20px;min-height:72px;padding:16px 20px;box-sizing:border-box;border:2px solid rgba(255,215,120,.8);border-radius:14px;background:rgba(10,10,18,.9);color:#fff;font-size:22px;line-height:1.6;white-space:pre-wrap;cursor:pointer;"></div>
            </div>
        `;

        document.body.appendChild(root);

        root.addEventListener("click", function () {
            advanceDialogue();
        });

        return root;
    }


    function showDialogueImage(path) {
        const image = document.getElementById("maouDialogueImage");
        if (!image) return;

        if (path) {
            image.src = path;
            image.style.display = "block";
        } else {
            image.removeAttribute("src");
            image.style.display = "none";
        }
    }


    function getDialogueLineText(line) {
        if (typeof line === "string") {
            return line;
        }
        return line && typeof line.text === "string"
            ? line.text
            : "";
    }


    function getDialogueLine(line) {
        if (typeof line === "string") {
            return {
                text: line,
                charInterval: MAOU_CONFIG.dialogue.charInterval,
                initialDelay: MAOU_CONFIG.dialogue.initialDelay,
                pauses: []
            };
        }

        return Object.assign({
            text: "",
            charInterval: MAOU_CONFIG.dialogue.charInterval,
            initialDelay: MAOU_CONFIG.dialogue.initialDelay,
            pauses: []
        }, line || {});
    }

    let dialogueFadeBusy = false;

    function playDialogue(lines, options, callback) {

        options = options || {};
        ensureMaouDialogueUI();

        const root = document.getElementById("maouDialogueRoot");
        const background = document.getElementById("maouDialogueBackground");

        if (MAOU_CONFIG.dialogue.background) {
            background.style.backgroundImage =
                `url("${MAOU_CONFIG.dialogue.background}")`;
        }

        root.style.display = "flex";
        dialogueIndex = 0;
        dialogueChars = 0;
        dialogueBusy = false;

        showDialogueImage(options.image || "");

        if (!Array.isArray(lines) || lines.length === 0) {
            root.style.display = "none";
            if (callback) callback();
            return;
        }

        renderDialogueLine(lines, options, callback);
    }


 function renderDialogueLine(lines, options, callback) {

        dialogueFadeBusy = false;

        if (dialogueTimer) {
            clearTimeout(dialogueTimer);
            dialogueTimer = null;
        }

        if (dialogueIndex >= lines.length) {
            const root = document.getElementById("maouDialogueRoot");
            if (root) root.style.display = "none";
            if (callback) callback();
            return;
        }

               const line = getDialogueLine(lines[dialogueIndex]);
        const message = document.getElementById("maouDialogueMessage");
        const text = getDialogueLineText(line);

        if (
            line.startBGM &&
            typeof playMaouFastBGM === "function"
        ) {
            playMaouFastBGM();
        }

        dialogueChars = 0;
        dialogueBusy = true;
        message.textContent = "";

        const imageAtEnd =
            line.imageAtEnd ||
            (dialogueIndex === lines.length - 1 && options.imageAtEnd);

           if (line.hideImage) {
    showDialogueImage("");
}

const dialogueImage =
    document.getElementById("maouDialogueImage");

if (line.image) {
    showDialogueImage(line.image);
} else if (imageAtEnd && options.image) {
    showDialogueImage(options.image);
}

if (dialogueImage) {
    dialogueImage.style.transition = "none";
    dialogueImage.style.filter = "none";
    dialogueImage.style.opacity = "1";
}

// 魔王の仮面が割れるSE
if (
    line.hideImage &&
    typeof kamenSound !== "undefined"
) {
    kamenSound.currentTime = 0;
    kamenSound.play().catch(function (error) {
        console.error(
            "仮面割れるSEの再生に失敗しました:",
            error
        );
    });
}

// 魔王第二形態SE
if (
    line.secondFormSound &&
    typeof secondFormSound !== "undefined"
) {
    secondFormSound.currentTime = 0;
    secondFormSound.play().catch(function (error) {
        console.error(
            "魔王第二形態SEの再生に失敗しました:",
            error
        );
    });
}

        const initialDelay = Math.max(0, Number(line.initialDelay || 0));
        const interval = Math.max(0, Number(line.charInterval));
        const pauses = Array.isArray(line.pauses) ? line.pauses : [];

              function typeNext() {

            if (dialogueChars >= text.length) {

                dialogueBusy = false;

                // =================================================
                // 最後の魔王-4をフェードアウト
                // 完全に消えるまでクリックを無効化
                // =================================================

                if (
                    line.fadeOutImage &&
                    dialogueImage
                ) {

                    dialogueFadeBusy = true;

                    setTimeout(
                        function () {

                            dialogueImage.style.transition =
                                "opacity 3000ms ease";

                            setTimeout(
                                function () {

                                    dialogueImage.style.opacity =
                                        "0";

                                    setTimeout(
                                        function () {

                                            dialogueFadeBusy =
                                                false;

                                        },
                                        3000
                                    );

                                },
                                0
                            );

                        },
                        0
                    );

                }

                return;
            }

            const nextIndex = dialogueChars + 1;

            message.textContent =
                text.slice(
                    0,
                    nextIndex
                );

            dialogueChars =
                nextIndex;

            const pause =
                pauses.find(
                    function (item) {
                        return Number(item.after) ===
                            dialogueChars;
                    }
                );

            if (pause) {

                dialogueTimer =
                    setTimeout(
                        typeNext,
                        Math.max(
                            0,
                            Number(pause.delay || 0)
                        )
                    );

                return;
            }

            dialogueTimer =
                setTimeout(
                    typeNext,
                    interval
                );
        }

        dialogueTimer = setTimeout(typeNext, initialDelay);
    }


      function advanceDialogue() {

        if (dialogueBusy) {
            return;
        }

        if (dialogueFadeBusy) {
            return;
        }

        const message = document.getElementById("maouDialogueMessage");
        if (!message) return;

        dialogueIndex += 1;

        // 現在のlines/options/callbackはDOMへ一時保存せず、
        // 進行用クロージャをrootに持たせます。
        const state = window.__maouDialogueState;
        if (!state) return;

        renderDialogueLine(
            state.lines,
            state.options,
            state.callback
        );
    }


    // playDialogueの状態をadvanceDialogueから参照できるようにする。
    const originalPlayDialogue = playDialogue;
    playDialogue = function (lines, options, callback) {
        window.__maouDialogueState = {
            lines: lines,
            options: options || {},
            callback: callback
        };
        originalPlayDialogue(lines, options, callback);
    };


    // =====================================================
    // BGM
    // =====================================================

    function playMaouFastBGM() {
        if (typeof setupBGM === "function") {
            setupBGM(
                maouFastBGM,
                maouFastBGMGain,
                setMaouFastBGMGain
            );
        }
    }

    function playMaouFinalBGM() {
        if (typeof setupBGM === "function") {
            setupBGM(
                maouFinalBGM,
                maouFinalBGMGain,
                setMaouFinalBGMGain
            );
        }
    }

    function playMaouEndBGM() {
        if (typeof setupBGM === "function") {
            setupBGM(
                maouEndBGM,
                maouEndBGMGain,
                setMaouEndBGMGain
            );
        }
    }

   function fadeMaouBGM() {
        if (typeof fadeOutAllBGM === "function") {
            fadeOutAllBGM(800);
        } else if (typeof stopAllBGM === "function") {
            stopAllBGM();
        }
    }


// =====================================================
// 魔王BGMフェードアウトを外部から実行
// =====================================================

window.fadeMaouBGM =
    function () {
        fadeMaouBGM();
    };


// =====================================================
// 第一形態開始
// =============================================================================================

    function startMaouFirstForm(player) {
        
    const boss = createMaouBoss(1);

    // =====================================================
    // 魔王・先着プレイヤーを記録
    // =====================================================

    if (bossFirstPlayer === null) {
        bossFirstPlayer = player;
    }

    maouCurrentForm = 1;
    currentBossId = MAOU_CONFIG.id;
    currentBossSquareId = MAOU_CONFIG.appearanceSquareId;
    maouActive = true;

    // 魔王のボスデータを既存のBOSS_CONTENTSへ登録し、
    // 既存のボス目的地・ボス挑戦システムから扱えるようにします。
    BOSS_CONTENTS[MAOU_CONFIG.id] = boss;


    // =====================================================
    // 初回エンカウント
    // 魔王の登場演出は最初の到着時だけ再生
    // =====================================================

    if (!maouFirstEncountered) {

        maouFirstEncountered = true;

        currentBossHP = boss.hp;

        fadeMaouBGM();

              playDialogue(
            MAOU_CONFIG.dialogue.beforeFirstBattle,
            {},
            function () {

                if (typeof window.startSpecialBossBattle === "function") {
                    window.startSpecialBossBattle(player, boss, {
                        enableBossCounter: true
                    });
                }
            }
        );

        return;
    }


    // =====================================================
// 2人目以降
// 登場演出・BGM再生は行わず、残りHPを引き継いで戦闘開始
// =====================================================

if (typeof window.startSpecialBossBattle === "function") {
    window.startSpecialBossBattle(player, boss, {
        enableBossCounter: true
    });
}
}


    // =====================================================
    // 第一形態撃破 → 第二形態
    // =====================================================

    function handleFirstFormDefeat(activeBattle, boss) {

        const player = activeBattle.player;

        const battlePopup = document.getElementById("battleMainPopup");
        if (battlePopup) battlePopup.style.display = "none";

        fadeMaouBGM();

        playDialogue(
            MAOU_CONFIG.dialogue.beforeSecondBattle,
            {
                image: MAOU_CONFIG.images.secondBattle,
                imageAtEnd: true
            },
            function () {

                const secondBoss =
    createMaouBoss(2);

// ================================================
// 第二形態へ移行したことを記録
// ================================================

maouCurrentForm = 2;

currentBossId =
    MAOU_CONFIG.id;

currentBossHP =
    secondBoss.hp;

currentBossSquareId =
    MAOU_CONFIG.appearanceSquareId;

BOSS_CONTENTS[
    MAOU_CONFIG.id
] =
    secondBoss;

                playMaouFinalBGM();

                if (typeof window.startSpecialBossBattle === "function") {
                    window.startSpecialBossBattle(player, secondBoss, {
                        enableBossCounter: true,
                        enemyTurn: maouEnemyTurn
                    });
                }
            }
        );
    }


    // =====================================================
    // 魔王第二形態AI
    // =====================================================

    function getRandomMagic(type) {

        const ids = Object.keys(MAGIC_CONTENTS).filter(function (id) {
            return MAGIC_CONTENTS[id] && MAGIC_CONTENTS[id].type === type;
        });

        if (ids.length === 0) {
            return null;
        }

        const id = ids[Math.floor(Math.random() * ids.length)];
        return MAGIC_CONTENTS[id];
    }


    function maouEnemyTurn(activeBattle, ui) {

        if (!activeBattle.maouBattleState) {
        activeBattle.maouBattleState = {
            magicPowerRate: 1,
            enemyAttackRate: 1,
            damageTakenRate: 1
        };
    }

    const player = activeBattle.player;
        const round = Number(activeBattle.round || 1);
        const type = round === 1 ? "buff" : "attack";
        const magic = getRandomMagic(type);

        if (!magic) {
            finishMaouEnemyTurn(activeBattle, ui, `${activeBattle.monster.name}は何もしなかった！　＞＞`);
            return;
        }

        const maouCaster = {
            name: activeBattle.monster.name,
            money: Number(activeBattle.monsterHP || 0),
            magicPower: Number(MAOU_CONFIG.secondForm.magicPower || 2000),
            inventory: []
        };

        const cost = calculateMagicCost(
            maouCaster,
            magic,
            activeBattle.battleState
        );

        // 魔王HPが魔法コストに足りない場合はパス。
        if (activeBattle.monsterHP < cost) {
            finishMaouEnemyTurn(
                activeBattle,
                ui,
                `${activeBattle.monster.name}は魔法を発動できなかった！　＞＞`
            );
            return;
        }

        activeBattle.monsterHP -= cost;
        currentBossHP = activeBattle.monsterHP;

        // 魔法コストによるHP減少を既存HP表示へ反映。
        ui.render();

        // バフ魔法は既存のbattleStateと同じ考え方で適用。
       if (magic.type === "buff") {

    if (
        magic.buffTarget === "self" &&
        magic.buffStat === "magicPower"
    ) {

        if (!activeBattle.maouBattleState) {
            activeBattle.maouBattleState = {
                magicPowerRate: 1,
                enemyAttackRate: 1
            };
        }

        activeBattle.maouBattleState.magicPowerRate =
            Number(magic.buffRate || 1);
    }

   if (
    magic.buffTarget === "enemy" &&
    magic.buffStat === "attackPower"
) {

    if (!activeBattle.maouBattleState) {
        activeBattle.maouBattleState = {
            magicPowerRate: 1,
            enemyAttackRate: 1,
            damageTakenRate: 1
        };
    }

    activeBattle.maouBattleState.damageTakenRate =
        Number(magic.buffRate || 1);
}

    if (magic.sound) {
        const se = new Audio(magic.sound);
        se.currentTime = 0;
        se.play().catch(function () {});
    }

    finishMaouEnemyTurn(
        activeBattle,
        ui,
        `${magic.name}！　＞＞`
    );
    return;
}

        const damage = calculateMagicDamage(
    maouCaster,
    magic,
    activeBattle.maouBattleState || {
        magicPowerRate: 1,
        enemyAttackRate: 1
    }
);

       if (magic.sound) {
    const se = new Audio(magic.sound);
    se.currentTime = 0;
    se.play().catch(function () {});
}


        // =========================
        // 魔王の攻撃ダメージ
        // プレイヤーの防御バフを反映
        // =========================

        const enemyAttackRate = Number(
            activeBattle.battleState?.enemyAttackRate || 1
        );

        const actualDamage = Math.max(
            0,
            Math.floor(Number(damage || 0) * enemyAttackRate)
        );

        console.log(
            "【魔王戦】プレイヤー防御バフ倍率：",
            enemyAttackRate
        );

        console.log(
            "【魔王戦】防御バフ適用後ダメージ：",
            actualDamage
        );

        player.money = Math.max(
            0,
            Number(player.money || 0) - actualDamage
        );

        if (typeof ui.updatePlayerStatus === "function") {
            ui.updatePlayerStatus(player);
        }

        if (typeof ui.renderPlayers === "function") {
            ui.renderPlayers();
        }

        if (typeof ui.render === "function") {
            ui.render();
        }

        ui.flashPlayer();

        finishMaouEnemyTurn(
            activeBattle,
            ui,
            `${magic.name}！ ${actualDamage}Gのダメージ！　＞＞`
        );

    }


         function finishMaouEnemyTurn(activeBattle, ui, message) {

       if (activeBattle.player.money <= 0) {

        // =================================================
        // プレイヤー撃破
        // この時点ではまだ魔王は回復しない
        // 次のクリックで回復処理を行う
        // =================================================

        const maouMaxHP =
            Number(
                MAOU_CONFIG.secondForm.hp || 0
            );

        const maouHealAmount =
            Math.floor(
                maouMaxHP * 0.3
            );

        activeBattle.maouHealAmount =
            maouHealAmount;

        activeBattle.maouMaxHP =
            maouMaxHP;

        activeBattle.busy =
            false;

        activeBattle.phase =
            "waitMaouHeal";

        ui.disableActions();

        ui.showMessage(
            message
        );

        return;
    }

    if (activeBattle.round >= 3) {

        activeBattle.busy = false;
        activeBattle.phase = "waitBattleEnd";
        activeBattle.endWithReward = false;
        ui.disableActions();
        ui.showMessage(message);

        return;
    }

    activeBattle.busy = false;
    activeBattle.phase = "waitNextRound";
    ui.disableActions();
    ui.showMessage(message);
}
    // =====================================================
    // 第二形態撃破 → エンディング
    // =====================================================

      function handleSecondFormDefeat(activeBattle, boss) {

        // =====================================================
        // 魔王はゲーム中に一度だけ
        // 第二形態撃破時点で討伐済みにする
        // =====================================================

        maouDefeated = true;

        const battlePopup =
            document.getElementById("battleMainPopup");

        if (battlePopup) {
            battlePopup.style.display = "none";
        }

        fadeMaouBGM();

        playDialogue(
            MAOU_CONFIG.dialogue.ending,
            {
                image: MAOU_CONFIG.images.endingStart,
                imageAtEnd: false
            },
            function () {

                // =================================================
                // エンディング終了後
                // 魔王報酬ログへ
                // =================================================

                finishMaouGameFlow(
                    activeBattle.player
                );

            }
        );

        playMaouEndBGM();
    }


      // =====================================================
    // 魔王討伐後 → 報酬ログ
    // 報酬処理本体は maou-reward.js に分離
    // =====================================================

    function finishMaouGameFlow(player) {

        maouActive = false;
        encounterPending = false;

        window.showMaouRewardFlow(
            player,
            {
                firstReward:
                    Number(MAOU_CONFIG.firstReward || 0),
                defeatReward:
                    Number(MAOU_CONFIG.defeatReward || 0)
            },
            bossFirstPlayer,
            BOSS_DAMAGE_MULTIPLIER,
            function () {

                continueAfterMaouDefeat(
                    player
                );

            }
        );

    }




    // =====================================================
    // 魔王報酬後 → 通常ゲームへ戻す
    // =====================================================

    function continueAfterMaouDefeat(player) {

        // =====================================================
        // 魔王戦の報酬情報をリセット
        // =====================================================

               bossFirstPlayer =
            null;

        window.players.forEach(
            function (p) {

                p.bossDamage =
                    0;

            }
        );

        // =====================================================
        // 魔王戦状態を完全にリセット
        // =====================================================

        maouActive =
            false;

        encounterPending =
            false;

        maouCurrentForm =
            1;

        maouFirstEncountered =
            false;

        bossCounterEnabled =
            false;


        fadeMaouBGM();

        stopAllBGM();
        setupAdventureBGM();


        // =====================================================
        // 魔王撃破後
        // 通常ボスへ戻す
        // =====================================================

        previousBossSquareId =
            currentBossSquareId;


        // 魔王を現在のボスから外す
        const normalBossIds =
            Object.keys(BOSS_CONTENTS)
                .map(Number)
                .filter(
                    function (id) {

                        return id !==
                            MAOU_CONFIG.id;

                    }
                )
                .sort(
                    function (a, b) {

                        return a - b;

                    }
                );


        // =====================================================
        // 通常ボスが存在する場合
        // =====================================================

        if (
            normalBossIds.length > 0
        ) {

           const currentIndex =
    normalBossIds.indexOf(
        maouPreviousBossId
    );


            if (
                currentIndex >= 0 &&
                currentIndex <
                    normalBossIds.length - 1
            ) {

                currentBossId =
                    normalBossIds[
                        currentIndex + 1
                    ];

            } else {

                currentBossId =
                    normalBossIds[0];

            }


            currentBossHP =
                BOSS_CONTENTS[
                    currentBossId
                ].hp;


            // =================================================
            // 通常ボスの出現マスを再選択
            // =================================================

            if (
                typeof selectBossSquare ===
                "function"
            ) {

                selectBossSquare();

            }


            // =================================================
            // マップ更新
            // =================================================

            if (
                typeof window.renderMap ===
                "function"
            ) {

                window.renderMap();

            }


            // =================================================
            // 通常ボスの目的地表示
            // =================================================

            if (
                typeof window.showBossDestinationPopup ===
                "function"
            ) {

                window.showBossDestinationPopup(
                    function () {

                        if (
                            typeof window.finishTurn ===
                            "function"
                        ) {

                            window.finishTurn(
                                player
                            );

                        }

                    }
                );

                return;

            }

        }


        // =====================================================
        // 通常ボスが見つからない場合
        // =====================================================

        if (
            typeof window.renderMap ===
            "function"
        ) {

            window.renderMap();

        }


        if (
            typeof window.finishTurn ===
            "function"
        ) {

            window.finishTurn(
                player
            );

        }

    }

    // =====================================================
    // 特殊ボス撃破フック
    // =====================================================

    window.handleSpecialBossDefeat =
        function (activeBattle, boss) {

            if (!boss || !boss.specialBoss) {
                return;
            }

            if (boss.maouForm === 1) {
                handleFirstFormDefeat(activeBattle, boss);
                return;
            }

            if (boss.maouForm === 2) {
                handleSecondFormDefeat(activeBattle, boss);
            }
        };


    // =====================================================
    // 条件成立後、現在のボス撃破時に呼ばれる処理
    // =====================================================

    window.handleMaouNextBoss =
        function (player) {

            if (!encounterPending || maouActive) {
                return false;
            }

            encounterPending = false;
maouActive = true;

const boss = createMaouBoss(1);

// 魔王登場前の通常ボスを記録
maouPreviousBossId = currentBossId;

currentBossId = MAOU_CONFIG.id;
            currentBossHP = boss.hp;
            currentBossSquareId = MAOU_CONFIG.appearanceSquareId;
            BOSS_CONTENTS[MAOU_CONFIG.id] = boss;

            if (typeof window.renderMap === "function") {
                window.renderMap();
            }

            // 既存のボス目的地表示をそのまま利用。
            if (typeof window.showBossDestinationPopup === "function") {
                window.showBossDestinationPopup(function () {
                    if (typeof window.finishTurn === "function") {
                        window.finishTurn(player);
                    }
                });
            } else {
                startMaouFirstForm(player);
            }

            // 目的地ポップアップの後、通常ボスと同様にプレイヤーが
            // マスへ到達して挑戦する方式を利用します。
            return true;
        };


    // =====================================================
    // 魔王マス到達時の開始
    // game.js側から呼び出せるように公開。
    // =====================================================

    window.startMaouFirstForm = startMaouFirstForm;


// =====================================================
// 魔王マス到着時の開始
// game.js側から呼び出せるように公開。
// =====================================================

window.handleMaouArrival =
    function (player) {

        // =========================
        // 初回到着
        // =========================

        if (!maouFirstEncountered) {

            startMaouFirstForm(player);

            return;
        }


        // =========================
        // 2回目以降
        // 現在の形態を維持して再挑戦
        // =========================

        if (
            typeof window.showBossChallengePopup ===
            "function"
        ) {

            window.showBossChallengePopup(
                player
            );

            return;
        }

        // 念のためのフォールバック
        window.startMaouBattle(player);
    };

    // =====================================================
    // 魔王が現在有効か
    // game.js側から判定できるように公開。
    // =====================================================

    window.isMaouActive = function () {

        return maouActive;

    };

// =====================================================
// 魔王戦開始
// 現在の形態を維持して再戦する。
// 初回の第一形態だけ専用演出を再生する。
// =====================================================

window.startMaouBattle =
    function (player) {

        // =================================================
        // 第一形態
        // =================================================

        if (maouCurrentForm === 1) {

            startMaouFirstForm(player);

            return;
        }


        // =================================================
        // 第二形態
        // =================================================

        if (maouCurrentForm === 2) {

            const secondBoss =
                createMaouBoss(2);

            currentBossId =
                MAOU_CONFIG.id;

            currentBossSquareId =
                MAOU_CONFIG.appearanceSquareId;

            maouActive =
                true;

            BOSS_CONTENTS[
                MAOU_CONFIG.id
            ] =
                secondBoss;


            // ---------------------------------------------
            // HPは現在の currentBossHP をそのまま使用
            // ---------------------------------------------

            if (
                typeof window.startSpecialBossBattle ===
                "function"
            ) {

                window.startSpecialBossBattle(
                    player,
                    secondBoss,
                    {
                        enableBossCounter: true,
                        enemyTurn: maouEnemyTurn
                    }
                );

            }

            return;
        }
    };


   window.updateEncounterCondition =
    updateEncounterCondition;

// Expose only the persistent gameplay flags needed by online state sync.
// Animation timers and dialogue counters remain local presentation state.
window.getMaouOnlineState = function () {
    return {
        assetConditionReached,
        encounterPending,
        maouActive,
        maouDefeated,
        maouPreviousBossId,
        maouFirstEncountered,
        maouCurrentForm
    };
};
window.applyMaouOnlineState = function (state) {
    if (!state || typeof state !== 'object') return;
    if (typeof state.assetConditionReached === 'boolean') assetConditionReached = state.assetConditionReached;
    if (typeof state.encounterPending === 'boolean') encounterPending = state.encounterPending;
    if (typeof state.maouActive === 'boolean') maouActive = state.maouActive;
    if (typeof state.maouDefeated === 'boolean') maouDefeated = state.maouDefeated;
    if (state.maouPreviousBossId === null || Number.isFinite(Number(state.maouPreviousBossId))) maouPreviousBossId = state.maouPreviousBossId;
    if (typeof state.maouFirstEncountered === 'boolean') maouFirstEncountered = state.maouFirstEncountered;
    if (Number.isInteger(Number(state.maouCurrentForm)) && Number(state.maouCurrentForm) >= 1) maouCurrentForm = Number(state.maouCurrentForm);
};

window.MAOU_CONFIG = MAOU_CONFIG;

})();

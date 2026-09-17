console.log("★ 新しいgame.jsが読み込まれています ★");

// =========================
// 異世界冒険人生ゲーム
// 桃鉄型・ネットワークマップ版
// =========================


// =========================
// プレイヤー設定
// =========================

// プレイヤーごとの色
const playerColors = [
    "#ff4d5a", // プレイヤー1：赤
    "#4da6ff", // プレイヤー2：青
    "#ffd84d", // プレイヤー3：黄
    "#5ee68a", // プレイヤー4：緑
    "#c77dff", // プレイヤー5：紫
    "#ff9f43"  // プレイヤー6：オレンジ
];

// =========================
// Gの3桁区切り表示
// =========================

function formatG(
    amount
) {

    return amount.toLocaleString(
        "ja-JP"
    );

}

// =========================
// お金マス報酬設定
// =========================

const moneyRewardTable = [

    {      

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

];

// =========================
// お金マスのランダム報酬
// =========================

function getRandomGoldReward() {

    // 現在はターン数を使わず、
    // moneyRewardTableの報酬からランダムに選ぶ

    const setting =
        moneyRewardTable[0];


    // 設定がなければ0G

    if (!setting) {

        return 0;

    }


    // 1～100の乱数

    const random =
        Math.random() * 100;


    let total =
        0;


    // 確率を順番に足していく

    for (
        const reward of setting.rewards
    ) {

        total +=
            reward.probability;


        if (
            random < total
        ) {

            return reward.amount;

        }

    }


    return 0;

}
// =========================
// 30マス版 異世界マップ
// =========================
//
// next は「基本となる道」
//
// ゲーム中の移動では、
// next の方向だけでなく、
// 他のマスから現在地へつながっている道も
// 自動的に認識する。
//
// つまりゲーム上では双方向に移動できる。
//
// 例：
//
// 0 → 17
//
// と書いてあれば、ゲーム上では
//
// 0 ↔ 17
//
// として扱う。
//
// これが桃鉄型の移動システム。
// =========================

// =========================
// モンスター一覧
// =========================

const monsterData = [

    {
        id: 1,
        name: "ゴブリン",
        icon: "👾",
        hp: 150,
        attack: 120
    }

];

// =========================
// アイテムデータ
// =========================

const itemData = [
    {
        id: 1,
        name: "人力車",
        price: 1000,
        category: "move",
        effect: "サイコロを2個振れる"
    },
    {
        id: 2,
        name: "タクシーチケット",
        price: 5000,
        category: "move",
        effect: "サイコロを3個振れる"
    },
    {
        id: 3,
        name: "グリーン車",
        price: 8000,
        category: "move",
        effect: "サイコロを4個振れる"
    }
];

// =========================
// 所持品データ、持っているだけで効果があるもの
// =========================

const possessionData = [

    {
        id: 1,
        name: "お守り",
        price: 1000,
        effect: "モンスターから受けるダメージ -10%",
        damageReduction: 0.10
    }

];

// =========================
// 魔法データ
// =========================

const magicData = [

    {
        id: 1,

        name:
            "ファイア",

        icon:
            "🔥",

        type:
            "attack",

        effect:
            "💥 魔力×100%ダメージ",

        // 魔力に対する倍率
        powerRate:
            1.0,

        // 習得価格
        price:
            0,

        // 使用コスト
        cost:
            100,

        // 使用後の行動
        // end = ターン終了
        // continue = 行動継続
        actionAfterUse:
            "end",

        // 効果継続ターン
        duration:
            0,

        
    },


    {
        id: 2,

        name:
            "ブリザド",

        icon:
            "❄️",

        type:
            "attack",

        effect:
            "💥 魔力×150%ダメージ",

        // 魔力に対する倍率
        powerRate:
            1.5,

        // 習得価格
        price:
            200,

        // 使用コスト
        cost:
            150,

        // 使用後の行動
        // end = ターン終了
        // continue = 行動継続
        actionAfterUse:
            "end",

        // 効果継続ターン
        duration:
            0,

        
    }

];

// =========================
// 資産マスター
// =========================

const assetData = [

    {
        id: 1,
        name: "素朴な嫁",
        price: 100,
        yield: 100,
        owner: null
    },

    {
        id: 2,
        name: "素朴な嫁",
        price: 100,
        yield: 100,
        owner: null
    },

    {
        id: 3,
        name: "エミリア",
        price: 5000000000,
        yield: 2,
        owner: null
    },


];

// =========================
// ボス管理
// =========================

let currentBossSquareId = null;
let previousBossSquareId = null;

// =========================
// ボスデータ
// =========================

const bossData = {
    name: "デーモンロード",
    icon: "👹",
    hp: 200,
    attack: 50
};


// =========================
// 現在のボスHP
// =========================

let currentBossHP =
    bossData.hp;

let bossFirstPlayer = null;

let bossRewardGiven = false;

// =========================
// ボス報酬設定
// =========================

const BOSS_FIRST_REWARD =
    10000;

const BOSS_DAMAGE_MULTIPLIER =
    3;

const BOSS_DEFEAT_REWARD =
    10000;

// =========================
// マップデータ
// =========================

const mapData = [

    {
        id: 0,
        name: "START",
        icon: "🏕️",
        type: "start",
        next: [1, 6],
        x: 30,
        y: 80
    },

    {
        id: 1,
        name: "草原",
        icon: "💰",
        type: "money",
        next: [2,7],
        x: 38,
        y: 80
    },

    {
        id: 2,
        name: "居酒屋のバイト",
        icon: "💼",
        type: "job",
        next: [3],
        x: 46,
        y: 80
    },

    {
        id: 3,
        name: "案内所",
        icon: "👩",
        type: "asset",
        assetIds: [1,3],
        next: [4],
        x: 54,
        y: 80
    },

    {
        id: 4,
        name: "最悪",
        icon: "💀",
        type: "worst",
        next: [5],
        x: 62,
        y: 80
    },

    {
        id: 5,
        name: "モンスター",
        icon: "👾",
        type: "monster",
        next: [11],
        x: 70,
        y: 80
    },

    {
        id: 6,
        name: "モンスター",
        icon: "👾",
        type: "monster",
        next: [17],
        x: 30,
        y: 65
    },

    {
        id: 7,
        name: "森",
        icon: "💰",
        type: "money",
        next: [8],
        x: 38,
        y: 65
    },

    {
        id: 8,
        name: "モンスター",
        icon: "👾",
        type: "monster",
        next: [9],
        x: 46,
        y: 65
    },

    {
        id: 9,
        name: "魔法店",
        icon: "🔮",
        type: "magic_shop",
        next: [10],
        x: 54,
        y: 65
    },

    {
        id: 10,
        name: "宝箱",
        icon: "🎁",
        type: "treasure",
        next: [11],
        x: 62,
        y: 65
    },

    {
        id: 11,
        name: "案内所",
        icon: "👩",
        type: "asset",
        assetIds: [2],
        next: [12],
        x: 70,
        y: 65
    },

    {
        id: 12,
        name: "モンスター",
        icon: "👾",
        type: "monster",
        next: [13,23],
        x: 70,
        y: 50
    },

    {
        id: 13,
        name: "草原",
        icon: "💰",
        type: "money",
        next: [14],
        x: 62,
        y: 50
    },

    {
        id: 14,
        name: "運び屋のバイト",
        icon: "💼",
        type: "job",
        next: [15,21],
        x: 54,
        y: 50
    },

    {
        id: 15,
        name: "星の泉",
        icon: "💰",
        type: "money",
        next: [16],
        x: 46,
        y: 50
    },

    {
        id: 16,
        name: "魔法店",
        icon: "🔮",
        type: "magic_shop",
        next: [17],
        x: 38,
        y: 50
    },

    {
        id: 17,
        name: "冒険者",
        icon: "💰",
        type: "money",
        next: [18],
        x: 30,
        y: 50
    },

    {
        id: 18,
        name: "モンスター",
        icon: "👾",
        type: "monster",
        next: [19],
        x: 30,
        y: 35
    },

    {
        id: 19,
        name: "魔法店",
        icon: "🔮",
        type: "magic_shop",
        next: [20,25],
        x: 38,
        y: 35
    },

    {
        id: 20,
        name: "宝箱",
        icon: "🎁",
        type: "treasure",
        next: [21],
        x: 46,
        y: 35
    },

    {
        id: 21,
        name: "パン屋のバイト",
        icon: "💼",
        type: "job",
        next: [22],
        x: 54,
        y: 35
    },

    {
        id: 22,
        name: "山",
        icon: "💰",
        type: "money",
        next: [23],
        x: 62,
        y: 35
    },

    {
        id: 23,
        name: "モンスター",
        icon: "👾",
        type: "monster",
        next: [29],
        x: 70,
        y: 35
    },

    {
        id: 24,
        name: "宝箱",
        icon: "🎁",
        type: "treasure",
        next: [25,18],
        x: 30,
        y: 20
    },

    {
        id: 25,
        name: "宝箱",
        icon: "💰",
        type: "money",
        next: [26],
        x: 38,
        y: 20
    },

    {
        id: 26,
        name: "魔法店",
        icon: "🔮",
        type: "magic_shop",
        next: [27],
        x: 46,
        y: 20
    },

    {
        id: 27,
        name: "モンスター",
        icon: "👾",
        type: "monster",
        next: [28],
        x: 54,
        y: 20
    },

    {
        id: 28,
        name: "魔法店",
        icon: "🔮",
        type: "magic_shop",
        next: [29],
        x: 62,
        y: 20
    },

    {
        id: 29,
        name: "引っ越しバイト",
        icon: "💼",
        type: "job",
        next: [],
        x: 70,
        y: 20
    }

];

// =========================
// ボス出現マスを決定
// =========================

function selectBossSquare() {

    const bossCandidates =
        mapData.filter(function (square) {

            return (
                square.type === "monster" &&
                square.id !== previousBossSquareId
            );

        });

    if (bossCandidates.length === 0) {
        return;
    }

    const randomIndex =
        Math.floor(
            Math.random() * bossCandidates.length
        );

    const selectedBoss =
        bossCandidates[randomIndex];

    currentBossSquareId =
        selectedBoss.id;

    previousBossSquareId =
        null;
}

// =========================
// ボス決定演出
// =========================

function showBossDestinationPopup(
    callback
) {

    const boss =
        mapData.find(function (square) {
            return square.id === currentBossSquareId;
        });

    if (!boss) {
        return;
    }

    // =========================
    // ボス位置へカメラ移動
    // =========================

    setTimeout(
        function () {

            const mapArea =
                document.querySelector(
                    ".game-screen .map-area"
                );

            const bossNode =
                document.querySelector(
                    `.map-node[data-square-id="${boss.id}"]`
                );

            if (
                mapArea &&
                bossNode
            ) {

                const mapRect =
                    mapArea.getBoundingClientRect();

                const bossRect =
                    bossNode.getBoundingClientRect();

                const mapCenterX =
                    mapRect.left +
                    mapRect.width / 2;

                const mapCenterY =
                    mapRect.top +
                    mapRect.height / 2;

                const bossCenterX =
                    bossRect.left +
                    bossRect.width / 2;

                const bossCenterY =
                    bossRect.top +
                    bossRect.height / 2;

                const scrollAmountX =
                    bossCenterX -
                    mapCenterX;

                const scrollAmountY =
                    bossCenterY -
                    mapCenterY;

                mapArea.scrollTo({

                    left:
                        mapArea.scrollLeft +
                        scrollAmountX,

                    top:
                        mapArea.scrollTop +
                        scrollAmountY,

                    behavior:
                        "smooth"

                });

            }

        },
        50
    );

    // =========================
    // ポップアップ表示
    // =========================

    showEventPopup(
        "👹 次の目的地が決定！",
        `
        <div style="font-size: 1.5em; margin-bottom: 15px;">
            🎯 次の目的地は……
        </div>

        <div style="font-size: 2em; font-weight: bold;">
            👹 ${boss.name}
        </div>

        <div style="margin-top: 15px;">
            このマスにボスが待ち受けている！
        </div>
        `,
        function () {

            // =========================
            // 次の処理へ
            // =========================

            if (callback) {

                callback();

            }

        }
    );

}

// =========================
// SE
// =========================

//サイコロ
const diceSound =
    new Audio("sounds/サイコロ.wav");
diceSound.preload = "auto";

//開始音
const startSound =
    new Audio("sounds/シャララン.wav");
startSound.preload = "auto";

//決定音
const buttonSound =
    new Audio("sounds/決定ボタン.mp3");
buttonSound.preload = "auto";

//プレイヤー切り替え
const switchingSound =
    new Audio("sounds/プレイヤー切り替え.mp3");
switchingSound.preload = "auto";

// =========================
// ゲーム開始
// =========================

const startButton =
    document.getElementById("startButton");


startButton.addEventListener(
    "click",
    function () {

        document.querySelector(
            ".game-container"
        ).innerHTML = `

            <h2>プレイヤー設定</h2>

            <p>何人で冒険しますか？</p>

            <div class="player-count-buttons">

                <button
                    class="player-count"
                    data-count="1">
                    1人
                </button>

                <button
                    class="player-count"
                    data-count="2">
                    2人
                </button>

                <button
                    class="player-count"
                    data-count="3">
                    3人
                </button>

                <button
                    class="player-count"
                    data-count="4">
                    4人
                </button>

                <button
                    class="player-count"
                    data-count="5">
                    5人
                </button>

                <button
                    class="player-count"
                    data-count="6">
                    6人
                </button>

            </div>

            <div id="player-names"></div>
        `;


        const playerCountButtons =
            document.querySelectorAll(
                ".player-count"
            );


        playerCountButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const count =
                            Number(
                                button.dataset.count
                            );


                        const playerNames =
                            document.getElementById(
                                "player-names"
                            );


                        playerNames.innerHTML = `

                            <h3>
                                ${count}人の名前を入力してください
                            </h3>

                            ${Array.from(
                                {
                                    length: count
                                },
                                function (_, index) {

                                    return `

                                        <div
                                            class="player-name-input">

                                            <label>

                                                プレイヤー${index + 1}

                                                <input
                                                    type="text"
                                                    class="player-name"
                                                    placeholder="名前を入力"
                                                    maxlength="10"
                                                >

                                            </label>

                                        </div>

                                    `;

                                }
                            ).join("")}


                            <button
                                id="confirmPlayers">
                                決定
                            </button>
                        `;


                        const confirmButton =
                            document.getElementById(
                                "confirmPlayers"
                            );


                        confirmButton.addEventListener(
                            "click",
                            function () {

                                const nameInputs =
                                    document.querySelectorAll(
                                        ".player-name"
                                    );


                                const players = [];


                                nameInputs.forEach(
                                    function (
                                        input,
                                        index
                                    ) {

                           const name =
                               input.value.trim() ||
                              `プレイヤー${index + 1}`;

  players.push({
    name: name,
    money: 500,
    magicPower: 100,
    bossDamage: 0,
    position: 0,
    color: playerColors[index],
    inventory: [],
    assets: [],
    possessions: [1],
    magic: [1],

    // バイト関連
    jobTurnsRemaining: 0,
    jobReward: 0
});


if (index === 0) {

    players[index].inventory = [1];

}


if (index === 1) {

    players[index].inventory = [1];

}


                                    }
                                );


                                showTurnSelectScreen(
                                    players
                                );

                            }
                        );

                    }
                );

            }
        );

    }
);


/// =========================
// プレイターン数選択
// =========================

function showTurnSelectScreen(
    players
) {

    const gameContainer =
        document.querySelector(
            ".game-container"
        );


    gameContainer.innerHTML = `

        <h2>プレイ時間を選択</h2>

        <p>何ターン遊びますか？</p>


        <div class="turn-input-area">

            <input
                type="number"
                id="turnCountInput"
                min="1"
                max="300"
                step="1"
                value="10"
            >

            <span class="turn-input-label">
                ターン
            </span>

        </div>


        <p class="turn-input-hint">
            1～300ターンで設定できます
        </p>


        <button
            id="confirmTurnButton"
        >
            このターン数で開始
        </button>

    `;


    // =========================
    // ターン数入力
    // =========================

    const turnCountInput =
        document.getElementById(
            "turnCountInput"
        );


    // =========================
    // 開始ボタン
    // =========================

    const confirmTurnButton =
        document.getElementById(
            "confirmTurnButton"
        );


    confirmTurnButton.addEventListener(
        "click",
        function () {

            let maxTurns =
                Number(
                    turnCountInput.value
                );


            // =========================
            // 1～300の範囲に調整
            // =========================

            if (
                maxTurns < 1
            ) {

                maxTurns = 1;

            }


            if (
                maxTurns > 300
            ) {

                maxTurns = 300;

            }


            // =========================
            // 小数を防ぐ
            // =========================

            maxTurns =
                Math.floor(
                    maxTurns
                );


            // =========================
            // ゲーム開始
            // =========================
            gameStarted = true;

// 最初のボスを決定
selectBossSquare();

//開始音    
startSound.currentTime = 0;
startSound.play()

showGameScreen(
    players,
    maxTurns
);

// ボス決定演出
setTimeout(function () {
    showBossDestinationPopup();
}, 500);
            
        }
    );

}



// =========================
// ゲーム画面
// =========================

function showGameScreen(
    players,
    maxTurns
) {

    const gameContainer =
        document.querySelector(
            ".game-container"
        );


    gameContainer.innerHTML = `

       <div class="game-screen">

    <!-- =========================
     TURN ＋ プレイヤー ＋ 残りマス ＋ 目的地
    ========================= -->

<div class="game-top-row">

    <div
        id="turnDisplay"
        class="turn-display">
    </div>

    <div
        id="currentPlayerInfo"
        class="current-player-info">
    </div>

    <div
        id="remainingStepsInfo"
        class="remaining-steps-info">
    </div>

    <div
    id="destinationInfo"
    class="destination">
    🎯
</div>

</div>


    <!-- =========================
         マップ
    ========================= -->

    <div class="map-area">

        <div
            id="mapBoard"
            class="map-board">
        </div>

    </div>


    <!-- =========================
         サイコロ・アイテム・所持品・魔法
    ========================= -->

    <div class="roulette-area">

    <div id="rouletteNumber"></div>

    <button id="rouletteButton">
        🎲サイコロ
    </button>

    <button id="inventoryButton">
        🎒
    </button>

    <button id="possessionButton">
        🏆
    </button>

    <button id="magicButton">
        🔮
    </button>

</div>


    <!-- =========================
         全プレイヤー情報
    ========================= -->

    <div
        id="playerStatus"
        class="player-status">
    </div>


    <!-- =========================
         分岐・方向選択
    ========================= -->

    <div
        id="choiceArea"
        class="choice-area">
    </div>

    <!-- =========================
     資産一覧
========================= -->

<div
    id="assetPopup"
    class="inventory-popup"
>

    <div class="inventory-popup-title">
        👩 資産一覧
    </div>


    <div
        id="assetList"
        class="inventory-list"
    ></div>


    <button
        id="assetCloseButton"
        class="inventory-close-button"
        type="button"
    >
        閉じる
    </button>

</div>

<!-- =========================
     資産購入
========================= -->

<div
    id="assetPurchasePopup"
    class="inventory-popup">

    <div class="inventory-popup-title">
        👩 資産購入
    </div>

    <div
        id="assetPurchaseList"
        class="inventory-list">
    </div>

    <button
        id="assetPurchaseCloseButton"
        class="inventory-close-button"
        type="button">
        閉じる
    </button>

</div>

</div>


    `;


    // =========================
    // ターン管理
    // =========================

    let currentPlayer = 0;
    let remainingSteps = 0;
    let currentTurn = 1;

    // =========================
// 配当サイクル
// =========================

const dividendCycle = 3;

    // =========================
    // 所持品の移動アイテム使用処理
    // showGameScreen内の移動関数へ接続する
    // =========================

    window.useMoveItem = function (
        player,
        diceCount
    ) {

        // =========================
        // サイコロボタン、所持品ボタン無効化
        // =========================

        rouletteButton.disabled =   true;

        inventoryButton.disabled = true;

        
// SE:サイコロ
diceSound.currentTime = 0;
diceSound.play()
    
        // =========================
        // 複数サイコロを振る
        // =========================

        showMultiDiceRoulette(
            diceCount,

            function (sum) {

                // =========================
                // 残りマス表示
                // =========================

                remainingSteps =
                    sum;

                renderTurn();


                // =========================
                // 移動開始
                // =========================

                movePlayer(
                    player,
                    sum
                );

            }
        );

    };

// =========================
// 魔法ステータス画面
// =========================

//ボタン音
buttonSound.currentTime = 0;
buttonSound.play();

window.showMagicPopup = function (player) {

    const magicPopup =
        document.getElementById(
            "magicPopup"
        );

    const magicList =
        document.getElementById(
            "magicList"
        );

    magicList.innerHTML = "";


    // 魔法を覚えていない場合

    if (
        player.magic.length === 0
    ) {

        magicList.innerHTML = `
            <div class="magic-empty">
                まだ魔法を覚えていません。
            </div>
        `;

    }


    // 覚えている魔法を表示

    player.magic.forEach(
        function (magicId) {

            const magic =
                magicData.find(
                    function (data) {

                        return data.id === magicId;

                    }
                );


            if (!magic) {
                return;
            }


            const magicElement =
                document.createElement(
                    "div"
                );


            magicElement.className =
                "magic-item";


            magicElement.innerHTML = `

                <div class="magic-item-name">

                    ${magic.icon}
                    ${magic.name}

                </div>

                <div class="magic-item-effect">

                    ${magic.effect}

                </div>

                <div class="magic-item-cost">

                    💰 ${formatG(magic.cost)}G

                </div>

            `;


            magicList.appendChild(
                magicElement
            );

        }
    );


    magicPopup.style.display =
        "block";
};



// =========================
// ★ここに追加★
// 戦闘中 魔法選択画面
// =========================

window.showBattleMagicPopup = function (
    player,
    monster,
    onUseMagic
) {

    const popup =
        document.getElementById(
            "battleMagicPopup"
        );

    const magicList =
        document.getElementById(
            "battleMagicList"
        );

    const closeButton =
        document.getElementById(
            "battleMagicCloseButton"
        );


    magicList.innerHTML = "";


    // =========================
    // 魔法を覚えていない場合
    // =========================

    if (
        player.magic.length === 0
    ) {

        magicList.innerHTML = `
            <div class="magic-empty">
                まだ魔法を覚えていません。
            </div>
        `;

    }


    // =========================
    // 覚えている魔法を表示
    // =========================

    player.magic.forEach(
        function (magicId) {

            const magic =
                magicData.find(
                    function (data) {

                        return data.id ===
                            magicId;

                    }
                );


            if (!magic) {
                return;
            }


            const magicElement =
                document.createElement(
                    "div"
                );


            magicElement.className =
                "battle-magic-item";


            magicElement.innerHTML = `
    <div class="battle-magic-item-info">

        <div class="battle-magic-item-name">
            ${magic.icon} ${magic.name}
        </div>

        <div class="battle-magic-item-effect">
            ${magic.effect}
        </div>

        <div class="battle-magic-item-cost">
            💰 ${formatG(magic.cost)}G
        </div>

    </div>

    <button
        class="battle-magic-use-button"
        type="button"
    >
        使う
    </button>
`;


            const useButton =
                magicElement.querySelector(
                    ".battle-magic-use-button"
                );


            useButton.addEventListener(
                "click",
                function () {

                    if (onUseMagic) {

                        onUseMagic(
                            magic
                        );

                    }

                }
            );


            magicList.appendChild(
                magicElement
            );

        }
    );


    popup.style.display =
        "block";


        closeButton.onclick =
        function () {

            popup.style.display =
                "none";

            // =========================
            // 魔法ボタンを再び有効化
            // =========================

            const battleMagicButton =
                document.getElementById(
                    "battleMagicButton"
                );

            if (
                battleMagicButton
            ) {

                battleMagicButton.disabled =
                    false;

            }

        };

};


// =========================
// 魔法ボタン
// =========================

document
    .getElementById(
        "magicButton"
    )
    .addEventListener(
        "click",
        function () {

            showMagicPopup(
                players[currentPlayer]
            );
//決定音
buttonSound.currentTime = 0;
buttonSound.play()
        }
    );


    

// =========================
// 魔法画面を閉じる
// =========================

document
    .getElementById(
        "magicCloseButton"
    )
    .addEventListener(
        "click",
        function () {

            document
                .getElementById(
                    "magicPopup"
                )
                .style.display =
                    "none";

        }
    );

    // =========================
    // アイテムボタン
    // =========================

    document
        .getElementById(
            "inventoryButton"
        )
        .addEventListener(
            "click",
            function () {

                showInventoryPopup(
                    players[currentPlayer]
                );
//決定音
buttonSound.currentTime = 0;
buttonSound.play()
            }
        );



    // =========================
    // アイテム画面を閉じる
    // =========================

    document
        .getElementById(
            "inventoryCloseButton"
        )
        .addEventListener(
            "click",
            function () {

                document
                    .getElementById(
                        "inventoryPopup"
                    )
                    .style.display =
                        "none";

            }
        );

// =========================
// 🏆 所持品ボタン
// =========================

document
    .getElementById(
        "possessionButton"
    )
    .addEventListener(
        "click",
        function () {

            showPossessionPopup(
                players[currentPlayer]
            );
//決定音
buttonSound.currentTime = 0;
buttonSound.play()
        }
    );


// =========================
// 🏆 所持品画面を閉じる
// =========================

document
    .getElementById(
        "possessionCloseButton"
    )
    .addEventListener(
        "click",
        function () {

            document
                .getElementById(
                    "possessionPopup"
                )
                .style.display =
                    "none";

        }
    );

    // =========================
    // マップ表示
    // =========================

    function renderMap() {

        const mapBoard =
            document.getElementById(
                "mapBoard"
            );


        mapBoard.innerHTML = "";


        // =========================
        // 道を描くSVG
        // =========================

        const svg =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "svg"
            );


        svg.classList.add(
            "map-lines"
        );


        svg.setAttribute(
            "viewBox",
            "0 0 100 100"
        );


        svg.setAttribute(
            "preserveAspectRatio",
            "none"
        );


        // =========================
        // マス同士を線でつなぐ
        // =========================

        mapData.forEach(
            function (square) {

                square.next.forEach(
                    function (nextId) {

                        const nextSquare =
                            mapData.find(
                                function (item) {

                                    return item.id ===
                                        nextId;

                                }
                            );


                        if (!nextSquare) {

                            return;

                        }


                        const line =
                            document.createElementNS(
                                "http://www.w3.org/2000/svg",
                                "line"
                            );


                        line.setAttribute(
                            "x1",
                            square.x
                        );


                        line.setAttribute(
                            "y1",
                            square.y
                        );


                        line.setAttribute(
                            "x2",
                            nextSquare.x
                        );


                        line.setAttribute(
                            "y2",
                            nextSquare.y
                        );


                        line.classList.add(
                            "map-line"
                        );


                        svg.appendChild(
                            line
                        );

                    }
                );

            }
        );


        mapBoard.appendChild(
            svg
        );


        // =========================
        // マスを配置
        // =========================

        mapData.forEach(
            function (square) {

                const node =
                    document.createElement(
                        "div"
                    );


                node.className =
                    "map-node";

                node.dataset.squareId = square.id;

                node.style.left =
                    `${square.x}%`;


                node.style.top =
                    `${square.y}%`;


 // =========================
// マスのアイコン
// =========================

const squareIcon =
    document.createElement(
        "div"
    );


squareIcon.className =
    "square-icon";


// =========================
// ボスマスならボスアイコン
// =========================

if (
    square.id === currentBossSquareId
) {

    squareIcon.textContent =
        "👹";

    node.classList.add(
        "boss-node"
    );

} else {

    squareIcon.textContent =
        square.icon;

}


node.appendChild(
    squareIcon
);


                // =========================
                // マス番号
                // =========================

                const squareNumber =
                    document.createElement(
                        "div"
                    );


                squareNumber.className =
                    "square-number";


                squareNumber.textContent =
                    square.id;


                node.appendChild(
                    squareNumber
                );


                // =========================
                // プレイヤー
                // =========================

                const playersHere =
                    players.filter(
                        function (player) {

                            return player.position ===
                                square.id;

                        }
                    );


                playersHere.forEach(
                    function (
                        player,
                        index
                    ) {

                        const piece =
                            document.createElement(
                                "span"
                            );


                        piece.className =
                            "player-piece";


                        piece.style.setProperty(
                            "background-color",
                            player.color,
                            "important"
                        );


                        // 同じマスならずらす

                        const offsets = [
                            -18,
                            18,
                            -9,
                            9,
                            -27,
                            27
                        ];


                        const offset =
                            offsets[index] || 0;


                        piece.style.setProperty(
                            "margin-left",
                            `${offset}px`,
                            "important"
                        );


                        piece.title =
                            player.name;


                        node.appendChild(
                            piece
                        );

                    }
                );


                mapBoard.appendChild(
                    node
                );

            }
        );

        // =========================
        // 現在プレイヤーを中央へ
        // =========================

        centerCurrentPlayerOnMap();

    }

// =========================
// スマホ：マップ ピンチズーム
// =========================

let mapZoom = 1;

let mapPinchStartDistance = 0;
let mapPinchStartZoom = 1;
let mapPinchInitialized = false;


function getMapPinchDistance(touch1, touch2) {

    const dx =
        touch1.clientX -
        touch2.clientX;

    const dy =
        touch1.clientY -
        touch2.clientY;

    return Math.sqrt(
        dx * dx +
        dy * dy
    );
}


function applyMapZoom() {

    const mapBoard =
        document.getElementById(
            "mapBoard"
        );

    if (!mapBoard) {
        return;
    }

    mapBoard.style.transform =
        `scale(${mapZoom})`;

    mapBoard.style.transformOrigin =
        "center center";
}


function setupMapPinchZoom() {

    if (mapPinchInitialized) {
        return;
    }


    const mapArea =
        document.querySelector(
            ".map-area"
        );

    if (!mapArea) {
        return;
    }


    mapPinchInitialized = true;


    // =========================
    // ピンチ開始
    // =========================

    mapArea.addEventListener(
        "touchstart",
        function (event) {

            if (event.touches.length !== 2) {
                return;
            }


            mapPinchStartDistance =
                getMapPinchDistance(
                    event.touches[0],
                    event.touches[1]
                );


            mapPinchStartZoom =
                mapZoom;

        },
        {
            passive: true
        }
    );


    // =========================
    // ピンチ中
    // =========================

    mapArea.addEventListener(
        "touchmove",
        function (event) {

            if (event.touches.length !== 2) {
                return;
            }


            const currentDistance =
                getMapPinchDistance(
                    event.touches[0],
                    event.touches[1]
                );


            if (mapPinchStartDistance <= 0) {
                return;
            }


            const zoomRatio =
                currentDistance /
                mapPinchStartDistance;


            mapZoom =
                mapPinchStartZoom *
                zoomRatio;


            // 最小70%・最大200%
            mapZoom =
                Math.max(
                    0.05,
                    Math.min(
                        mapZoom,
                        2.0
                    )
                );


            applyMapZoom();

        },
        {
            passive: true
        }
    );


    // =========================
    // ピンチ終了
    // =========================

    mapArea.addEventListener(
        "touchend",
        function (event) {

            if (event.touches.length < 2) {

                mapPinchStartDistance = 0;

            }

        },
        {
            passive: true
        }
    );

}


// =========================
// ピンチズーム開始
// =========================

setupMapPinchZoom();
    
// =========================
// 資産一覧画面
// =========================

function showAssetPopup(
    player
) {

    const assetPopup =
        document.getElementById(
            "assetPopup"
        );


    const assetList =
        document.getElementById(
            "assetList"
        );


    // =========================
    // 一覧を初期化
    // =========================

    assetList.innerHTML =
        "";


    // =========================
    // 保有資産を取得
    // =========================

    const ownedAssets =
        (player.assets || [])
            .map(
                function (assetId) {

                    return assetData.find(
                        function (data) {

                            return data.id ===
                                assetId;

                        }
                    );

                }
            )
            .filter(
                function (asset) {

                    return asset !== undefined;

                }
            );


    // =========================
    // 資産がない場合
    // =========================

    if (
        ownedAssets.length === 0
    ) {

        assetList.innerHTML = `

            <div class="inventory-empty">

                保有資産はありません。

            </div>

        `;


        assetPopup.style.display =
            "block";


        document.getElementById(
            "assetCloseButton"
        ).onclick =
            function () {

                assetPopup.style.display =
                    "none";

            };


        return;

    }


    // =========================
    // 資産額合計
    // =========================

    let totalAssetValue =
        0;


    // =========================
    // 加重平均利回り
    // =========================

    let weightedYieldTotal =
        0;


    ownedAssets.forEach(
        function (asset) {

            totalAssetValue +=
                asset.price;


            weightedYieldTotal +=
                asset.price *
                asset.yield;

        }
    );


    const weightedAverageYield =
        weightedYieldTotal /
        totalAssetValue;


    // =========================
    // 資産サマリー
    // =========================

    const summary =
        document.createElement(
            "div"
        );


    summary.className =
        "asset-summary";


    summary.innerHTML = `

        <div class="asset-summary-item">

            💰
            <strong>
                ${formatG(totalAssetValue)}G
            </strong>

        </div>


        <div class="asset-summary-item">

            📈
            <strong>
                ${weightedAverageYield.toFixed(1)}%
            </strong>

        </div>

    `;


    assetList.appendChild(
        summary
    );


    // =========================
    // 資産一覧
    // =========================

    ownedAssets.forEach(
        function (asset) {

            const assetElement =
                document.createElement(
                    "div"
                );


            assetElement.className =
                "inventory-item";


            assetElement.innerHTML = `

                <div
                    class="inventory-item-name"
                >

                    ${asset.name}

                </div>


                <div
                    class="inventory-item-effect"
                >

                    💰 ${formatG(asset.price)}G
                    　
                    📈 ${asset.yield}%

                </div>

            `;


            assetList.appendChild(
                assetElement
            );

        }
    );


    // =========================
    // Popup表示
    // =========================

    assetPopup.style.display =
        "block";


    // =========================
    // 閉じるボタン
    // =========================

    document.getElementById(
        "assetCloseButton"
    ).onclick =
        function () {

            assetPopup.style.display =
                "none";

        };

}

// =========================
// 資産購入画面
// =========================

function showAssetPurchasePopup(
    player,
    assetIds,
    callback
) {

    const popup =
        document.getElementById(
            "assetPurchasePopup"
        );


    const list =
        document.getElementById(
            "assetPurchaseList"
        );


    const closeButton =
        document.getElementById(
            "assetPurchaseCloseButton"
        );


    // =========================
    // 一覧を初期化
    // =========================

    list.innerHTML = "";


    // =========================
    // 現在の所持金
    // =========================

    const moneyDisplay =
        document.createElement("div");

    moneyDisplay.className =
        "asset-purchase-money";

    moneyDisplay.innerHTML =
        `💰 所持金：<strong>${formatG(player.money)}G</strong>`;

    list.appendChild(
        moneyDisplay
    );


    // =========================
    // 資産一覧
    // =========================

    assetIds.forEach(
        function (assetId) {

            const asset =
                assetData.find(
                    function (data) {

                        return data.id ===
                            assetId;

                    }
                );


            if (!asset) {
                return;
            }


            const item =
                document.createElement("div");


            item.className =
                "asset-purchase-item";


 // =========================
// 所有者アイコン
// =========================

let ownerIcon = "";

const ownerIcons = [
    "🔴",
    "🔵",
    "🟢",
    "🟡",
    "🟣",
    "🟠"
];


if (
    asset.owner !== null &&
    asset.owner !== undefined
) {

    ownerIcon =
        ownerIcons[asset.owner] || "";

}


            // =========================
            // すでに所有されている
            // =========================

            if (
                asset.owner !== null &&
                asset.owner !== undefined
            ) {

                item.innerHTML = `

                    <div
                        class="asset-purchase-info">

                        <div
                            class="asset-purchase-name">

                            ${asset.name}

                        </div>

                        <div
                            class="asset-purchase-detail">

                            💰 ${formatG(asset.price)}G
                           　
                            📈 ${asset.yield}%

                        </div>

                    </div>


                    <div
                        class="asset-purchase-owner">

                        ${ownerIcon}

                    </div>


                    <button
                        class="asset-purchase-button"
                        type="button"
                        disabled>

                        所有済

                    </button>

                `;

            }


            // =========================
            // 未所有
            // =========================

            else {

                item.innerHTML = `

                    <div
                        class="asset-purchase-info">

                        <div
                            class="asset-purchase-name">

                            ${asset.name}

                        </div>

                        <div
                            class="asset-purchase-detail">

                            💰 ${formatG(asset.price)}G
                           　
                            📈 ${asset.yield}%

                        </div>

                    </div>


                    <div
                        class="asset-purchase-owner">

                    </div>


                    <button
                        class="asset-purchase-button"
                        type="button">

                        購入する

                    </button>

                `;


                const buyButton =
                    item.querySelector(
                        ".asset-purchase-button"
                    );


                buyButton.addEventListener(
                    "click",
                    function () {

                        // =========================
                        // お金が足りない
                        // =========================

                        if (
                            player.money <
                            asset.price
                        ) {

                            showEventPopup(
                                "💰 ゴールド不足",

                                `
                                この資産を購入するには
                                <strong>
                                ${formatG(asset.price)}G
                                </strong>
                                必要です。<br><br>

                                現在の所持金：
                                <strong>
                                ${formatG(player.money)}G
                                </strong>
                                `,

                                function () {

                                    showAssetPurchasePopup(
                                        player,
                                        assetIds,
                                        callback
                                    );

                                }
                            );

                            return;

                        }


  // =========================
// 購入処理
// =========================

player.money -= asset.price;


// 資産の所有者を設定
asset.owner =
    players.indexOf(player);


// プレイヤーの保有資産にも追加
if (!player.assets) {
    player.assets = [];
}

if (!player.assets.includes(asset.id)) {
    player.assets.push(asset.id);
}


// =========================
// プレイヤー情報更新
// =========================

renderPlayers();


// =========================
// 購入後の一覧を再表示
// =========================

showAssetPurchasePopup(
    player,
    assetIds,
    callback
);

                    }
                );

            }


            list.appendChild(
                item
            );

        }
    );


    // =========================
    // Popup表示
    // =========================

    popup.style.display =
        "block";


    // =========================
    // 閉じる
    // =========================

    closeButton.onclick =
        function () {

            popup.style.display =
                "none";


            if (callback) {

                callback();

            }

        };

}

 // =========================
// プレイヤー情報表示
// =========================

function renderPlayers() {

    const status =
        document.getElementById(
            "playerStatus"
        );


    status.innerHTML =
        players.map(
            function (
                player,
                index
            ) {

                const isCurrent =
                    index ===
                    currentPlayer;


                return `

                    <div
                        class="
                            player-card
                            ${
                                isCurrent
                                    ? "current-player"
                                    : ""
                            }
                        "
                        data-player-index="${index}"
                    >

                        <span
                            class="player-icon"
                            style="
                                background-color:
                                ${player.color} !important;
                            "
                        ></span>


                        <!-- 資産ボタン -->

                        <button
                            class="player-asset-button"
                            type="button"
                        >
                            👩
                        </button>


                        <!-- 魔力 -->

                        <span>
                            🔮${player.magicPower}
                        </span>


                        <!-- ゴールド -->

                        <span>
                            💰${formatG(player.money)}G
                        </span>

                    </div>

                `;

            }

        ).join("");


    // =========================
    // プレイヤーカードをタップしたら
    // そのプレイヤーの位置へ移動
    // =========================

    const playerCards =
        status.querySelectorAll(
            ".player-card"
        );


    playerCards.forEach(
        function (card) {

                        let lastTapTime = 0;

            card.addEventListener(
                "click",
                function () {

                    const now =
                        Date.now();

                    const isDoubleTap =
                        now - lastTapTime < 300;

                    lastTapTime =
                        now;


                    const playerIndex =
                        Number(
                            card.dataset.playerIndex
                        );


                    const player =
                        players[playerIndex];


                    if (!player) {
                        return;
                    }


                    // =========================
                    // ダブルタップ
                    // マップを100%に戻す
                    // =========================

                    if (isDoubleTap) {

                        mapZoom = 1;

                        applyMapZoom();

                    }


                    // =========================
                    // プレイヤー位置を中央へ
                    // =========================

                    const mapNode =
                        document.querySelector(
                            `.map-node[data-square-id="${player.position}"]`
                        );


                    if (!mapNode) {
                        return;
                    }


                    const mapArea =
                        document.querySelector(
                            ".map-area"
                        );


                    if (!mapArea) {
                        return;
                    }


                    const mapRect =
                        mapArea.getBoundingClientRect();

                    const playerRect =
                        mapNode.getBoundingClientRect();


                    const mapCenterX =
                        mapRect.left +
                        mapRect.width / 2;

                    const mapCenterY =
                        mapRect.top +
                        mapRect.height / 2;


                    const playerCenterX =
                        playerRect.left +
                        playerRect.width / 2;

                    const playerCenterY =
                        playerRect.top +
                        playerRect.height / 2;


                    const scrollAmountX =
                        playerCenterX -
                        mapCenterX;

                    const scrollAmountY =
                        playerCenterY -
                        mapCenterY;


                    mapArea.scrollTo({

                        left:
                            mapArea.scrollLeft +
                            scrollAmountX,

                        top:
                            mapArea.scrollTop +
                            scrollAmountY,

                        behavior:
                            "smooth"

                    });

                   }
            );

        }
    );


    // =========================
    // 👩 資産ボタン
    // =========================

    const assetButtons =
        status.querySelectorAll(
            ".player-asset-button"
        );


    assetButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    // カード全体のクリック処理を止める
                    event.stopPropagation();


                    const card =
                        button.closest(
                            ".player-card"
                        );


                    if (!card) {
                        return;
                    }


                    const playerIndex =
                        Number(
                            card.dataset.playerIndex
                        );


                    const player =
                        players[playerIndex];


                    if (!player) {
                        return;
                    }

                // 資産を持っていなければ何もしない
                if (
                    !player.assets ||
                    player.assets.length === 0
                ) {
                    return;
                }


                // 資産を持っている場合だけ一覧を表示

                    showAssetPopup(
                        player
                    );

                }
            );

        }
    );

}


   // =========================
// 現在のターン表示
// =========================

function renderTurn() {

    const turnDisplay =
        document.getElementById(
            "turnDisplay"
        );

    const currentPlayerInfo =
        document.getElementById(
            "currentPlayerInfo"
        );

    const remainingStepsInfo =
        document.getElementById(
            "remainingStepsInfo"
        );


    // =========================
    // ターン表示
    // =========================

    turnDisplay.textContent =
    `TURN ${currentTurn}/${maxTurns}`;


// =========================
// 現在のプレイヤー
// =========================
    const playerIcons = [
    "🔴",
    "🔵",
    "🟢",
    "🟡",
    "🟣",
    "🟠"
];

    currentPlayerInfo.textContent =
    `${playerIcons[currentPlayer]} ${players[currentPlayer].name}`;
    
    // =========================
    // 残りマス
    // =========================

    remainingStepsInfo.textContent =
        `🎲 残${remainingSteps}マス`;

    // =========================
    // ボスマスまでの最短距離
    // =========================

    const destinationInfo =
        document.getElementById(
            "destinationInfo"
        );


    if (
        destinationInfo
    ) {

        const bossDistance =
            getShortestDistanceToBoss(
                players[currentPlayer].position
            );


        destinationInfo.textContent =
            `🎯 あと${bossDistance}マス`;

    }

}



    // =========================
    // 現在地から移動可能なマスを取得
    // =========================
    //
    // 桃鉄型：
    //
    // ① 現在地から出ている道
    //
    // ② 他のマスから現在地へ
    //    入っている道
    //
    // の両方を取得する。
    //
    // そのため前後どちらにも進める。
    // =========================

    function getConnectedOptions(
        position
    ) {

        const connected = [];


        // =========================
        // 現在地
        // =========================

        const currentSquare =
            mapData.find(
                function (square) {

                    return square.id ===
                        position;

                }
            );


        if (!currentSquare) {

            return connected;

        }


        // =========================
        // 現在地から出る道
        // =========================

        currentSquare.next.forEach(
            function (nextPosition) {

                if (
                    !connected.includes(
                        nextPosition
                    )
                ) {

                    connected.push(
                        nextPosition
                    );

                }

            }
        );


        // =========================
        // 現在地へ入ってくる道
        // =========================

        mapData.forEach(
            function (square) {

                if (
                    square.next.includes(
                        position
                    )
                ) {

                    if (
                        !connected.includes(
                            square.id
                        )
                    ) {

                        connected.push(
                            square.id
                        );

                    }

                }

            }
        );


        return connected;

    }


    // =========================
    // 分岐・方向選択
    // =========================

    function showBranchChoice(
        options,
        callback
    ) {

        // =========================
        // 古い矢印を全部削除
        // =========================

        document
            .querySelectorAll(
                ".branch-arrow-map"
            )
            .forEach(
                function (element) {

                    element.remove();

                }
            );


        const choiceArea =
            document.getElementById(
                "choiceArea"
            );


        const mapBoard =
            document.getElementById(
                "mapBoard"
            );


        // =========================
        // 現在地
        // =========================

        const currentSquare =
            mapData.find(
                function (square) {

                    return square.id ===
                        players[currentPlayer].position;

                }
            );


        if (!currentSquare) {

            return;

        }




        // =========================
        // 各方向に矢印を表示
        // =========================

        options.forEach(
            function (option) {

                const destination =
                    mapData.find(
                        function (square) {

                            return square.id ===
                                option;

                        }
                    );


                if (!destination) {

                    return;

                }


                // =========================
                // 矢印ボタン
                // =========================

                const arrow =
                    document.createElement(
                        "button"
                    );


                arrow.className =
                    "branch-arrow-map";


                // =========================
                // 方向計算
                // =========================

                const dx =
                    destination.x -
                    currentSquare.x;


                const dy =
                    destination.y -
                    currentSquare.y;


                const angle =
                    Math.atan2(
                        dy,
                        dx
                    ) * 180 / Math.PI;


                // =========================
                // 矢印位置
                // =========================

                const arrowPosition =
                    0.35;


                const arrowX =
                    currentSquare.x +
                    dx * arrowPosition;


                const arrowY =
                    currentSquare.y +
                    dy * arrowPosition;


                arrow.style.left =
                    `${arrowX}%`;


                arrow.style.top =
                    `${arrowY}%`;


                arrow.style.transform =
                    `translate(-50%, -50%) rotate(${angle}deg)`;


                // =========================
                // 矢印
                // =========================

                arrow.innerHTML = `

                    <span class="map-arrow-symbol">
                        ➜
                    </span>

                `;


                // =========================
                // 矢印をタップ
                // =========================

                arrow.addEventListener(
                    "click",
                    function () {

                        // すべての矢印を削除

                        document
                            .querySelectorAll(
                                ".branch-arrow-map"
                            )
                            .forEach(
                                function (element) {

                                    element.remove();

                                }
                            );


                        

                        // 選択したマスへ移動

                        callback(option);

                    }
                );


                // =========================
                // マップに追加
                // =========================

                mapBoard.appendChild(
                    arrow
                );

            }
        );

    }


    // =========================
    // 1マス移動
    // =========================

    function moveOneStep(
        player,
        nextPosition
    ) {

        player.position =
            nextPosition;


        renderMap();

        renderPlayers();

    }

    // =========================
// サイコロの出目で
// 止まれるマスを取得
// =========================

function getReachableStopSquares(
    startPosition,
    steps
) {

    const results = new Map();

    const queue = [
        {
            position: startPosition,
            previousPosition: null,
            stepsUsed: 0,
            path: [startPosition]
        }
    ];

    const visited = new Set();


    while (
        queue.length > 0
    ) {

        const state =
            queue.shift();


        // =========================
        // 指定マス数に到達
        // =========================

        if (
            state.stepsUsed ===
            steps
        ) {

            if (
                !results.has(
                    state.position
                )
            ) {

                results.set(
                    state.position,
                    state.path
                );

            }

            continue;

        }


        // =========================
        // 現在地から行けるマス
        // =========================

        const options =
            getConnectedOptions(
                state.position
            );


        // =========================
        // 行ける場所がない
        // =========================

        if (
            options.length === 0
        ) {

            if (
                !results.has(
                    state.position
                )
            ) {

                results.set(
                    state.position,
                    state.path
                );

            }

            continue;

        }


        options.forEach(
            function (nextPosition) {

                // =========================
                // 直前のマスへ戻るのは禁止
                // =========================

                if (
                    nextPosition ===
                    state.previousPosition
                ) {

                    return;

                }


                const nextKey =
                    `${state.position}-${nextPosition}-${state.stepsUsed + 1}`;


                if (
                    visited.has(
                        nextKey
                    )
                ) {

                    return;

                }


                visited.add(
                    nextKey
                );


                queue.push({

                    position:
                        nextPosition,

                    previousPosition:
                        state.position,

                    stepsUsed:
                        state.stepsUsed + 1,

                    path:
                        [
                            ...state.path,
                            nextPosition
                        ]

                });

            }
        );

    }


    return results;

}


// =========================
// 止まれるマスを強調表示
// =========================

function highlightReachableSquares(
    player,
    steps
) {

    const reachable =
        getReachableStopSquares(
            player.position,
            steps
        );


    // =========================
    // 強調表示
    // =========================

    reachable.forEach(
        function (path, squareId) {

            const node =
                document.querySelector(
                    `.map-node[data-square-id="${squareId}"]`
                );


            if (!node) {
                return;
            }


            // =========================
            // 光らせる
            // =========================

            node.style.boxShadow =
                "0 0 0 5px rgba(255,215,0,0.95), 0 0 25px rgba(255,215,0,0.9)";

            node.style.cursor =
                "pointer";


            // =========================
            // タップできることを表示
            // =========================

            node.addEventListener(
                "click",
                function () {

                    // =========================
                    // 強調表示を解除
                    // =========================

                    clearReachableHighlights();


                    // =========================
                    // 分岐矢印を削除
                    // =========================

                    document
                        .querySelectorAll(
                            ".branch-arrow-map"
                        )
                        .forEach(
                            function (element) {

                                element.remove();

                            }
                        );


                    // =========================
                    // 選択したマスへ移動
                    // =========================

                    movePlayerToSquare(
                        player,
                        path
                    );

                },
                {
                    once: true
                }
            );

        }
    );


    return reachable;

}


// =========================
// 止まれるマスの強調を解除
// =========================

function clearReachableHighlights() {

    document
        .querySelectorAll(
            ".map-node"
        )
        .forEach(
            function (node) {

                node.style.boxShadow =
                    "";

                node.style.cursor =
                    "";

            }
        );

}

// =========================
// 選択したマスまで自動移動
// =========================

function movePlayerToSquare(
    player,
    path
) {

    let index = 1;


    function moveNext() {

        // =========================
        // 移動完了
        // =========================

        if (
            index >= path.length
        ) {

            remainingSteps = 0;

            renderTurn();

            document.getElementById(
                "choiceArea"
            ).innerHTML = "";

            handleSquareEvent(
                player
            );

            return;

        }


        // =========================
        // 残りマス表示
        // =========================

        remainingSteps =
            path.length -
            index;

        renderTurn();


        // =========================
        // 1マス移動
        // =========================

        moveOneStep(
            player,
            path[index]
        );


        index += 1;


        // =========================
        // 次のマスへ
        // =========================

        setTimeout(
            moveNext,
            350
        );

    }


    moveNext();

}

// =========================
// ボスマスまでの最短距離
// =========================

function getShortestDistanceToBoss(
    startPosition
) {

    if (
        currentBossSquareId === null ||
        currentBossSquareId === undefined
    ) {

        return 0;

    }


    if (
        startPosition ===
        currentBossSquareId
    ) {

        return 0;

    }


    const queue = [
        {
            position:
                startPosition,

            distance:
                0
        }
    ];


    const visited =
        new Set();

    visited.add(
        startPosition
    );


    while (
        queue.length > 0
    ) {

        const current =
            queue.shift();


        const options =
            getConnectedOptions(
                current.position
            );


        for (
            let i = 0;
            i < options.length;
            i++
        ) {

            const nextPosition =
                options[i];


            if (
                visited.has(
                    nextPosition
                )
            ) {

                continue;

            }


            if (
                nextPosition ===
                currentBossSquareId
            ) {

                return (
                    current.distance +
                    1
                );

            }


            visited.add(
                nextPosition
            );


            queue.push({

                position:
                    nextPosition,

                distance:
                    current.distance +
                    1

            });

        }

    }


    return 0;

}

    // =========================
// プレイヤー移動
// =========================

function movePlayer(
    player,
    diceNumber
) {

    // =========================
    // 現在の残りマス
    // =========================

    remainingSteps =
        diceNumber;

    renderTurn();


    // =========================
    // 止まれるマスを強調
    // =========================

    const reachable =
        highlightReachableSquares(
            player,
            diceNumber
        );


    // =========================
    // 行けるマスがない
    // =========================

    if (
        reachable.size === 0
    ) {

        remainingSteps = 0;

        renderTurn();

        finishTurn(
            player
        );

        return;

    }

}

    // =========================
    // ルーレット
    // =========================

    const rouletteButton =
        document.getElementById(
            "rouletteButton"
        );


    const rouletteNumber =
        document.getElementById(
            "rouletteNumber"
        );

    inventoryButton.disabled = false;

    rouletteButton.addEventListener(
        "click",
        function () {

            // =========================
            // 二重クリック防止、所持品非活性化
            // =========================

            rouletteButton.disabled = true;

            inventoryButton.disabled = true;


            // =========================
            // 1〜6
            // =========================

            const number =
                Math.floor(
                    Math.random() * 6
                ) + 1;
                


            // =========================
            // 出目表示
            // =========================


            // =========================
            // 現在のプレイヤー
            // =========================

            const player =
                players[currentPlayer];


             // =========================
            // サイコロ演出
            // =========================

showDiceRoulette(
    number,
    function () {

        // =========================
        // 残りマス表示
        // =========================

        remainingSteps = number;

        renderTurn();

        

        // =========================
        // 移動開始
        // =========================

        movePlayer(
            player,
            number
        );

    }
);
        // =========================
        // マスイベント
        // =========================



        }
    );

    
// =========================
// イベントポップアップ表示
// =========================

window.showEventPopup = function (
    title,
    message,
    callback
) {

    const popup =
        document.getElementById(
            "eventPopup"
        );

    const popupTitle =
        popup.querySelector(
            ".event-popup-title"
        );

    const popupMessage =
        document.getElementById(
            "eventPopupMessage"
        );

    const popupButton =
        document.getElementById(
            "eventPopupButton"
        );

        popupButton.textContent =
    "OK";

    // =========================
    // 内容を設定
    // =========================

    popupTitle.textContent =
        title;

    popupMessage.innerHTML =
        message;


    // =========================
    // ポップアップ表示
    // =========================

    popup.style.display =
        "block";


    // =========================
    // OKボタン
    // =========================

    popupButton.onclick =
        function () {

            popup.style.display =
                "none";


            if (callback) {

                callback();

            }

        };

}

// =========================
// マスイベント
// =========================

// =========================
// ゴールドルーレット
// =========================

function showGoldRoulette(
    reward,
    callback
) {

    const roulette =
        document.getElementById(
            "goldRoulette"
        );

    const number =
        document.getElementById(
            "goldRouletteNumber"
        );


    // =========================
    // 表示
    // =========================

    roulette.style.display =
        "block";


    roulette.classList.add(
        "spinning"
    );


    // =========================
    // 回転中の数字
    // =========================

    let count = 0;

    const interval =
        setInterval(
            function () {

                const randomAmount =
                    Math.floor(
                        Math.random() * 10
                    ) * 100;

                number.textContent =
                    `${randomAmount}G`;

                count += 1;


                // =========================
                // ルーレット終了
                // =========================

                if (
                    count >= 15
                ) {

                    clearInterval(
                        interval
                    );


                    // 最終結果

                    number.textContent =
                        `${formatG(reward)}G`;


                    roulette.classList.remove(
                        "spinning"
                    );


                    // 少し余韻をつける

                    setTimeout(
                        function () {

                            roulette.style.display =
                                "none";


                            if (
                                callback
                            ) {

                                callback();

                            }

                        },
                        700
                    );

                }

            },
            80
        );

}



// =========================
// サイコロルーレット演出
// =========================

function showDiceRoulette(
    result,
    callback
) {

    const roulette =
        document.getElementById(
            "diceRoulette"
        );

    const number =
        document.getElementById(
            "diceRouletteNumber"
        );

     // =========================
    // サイコロSE
    // =========================

   diceSound.currentTime = 0;

    diceSound
        .play()
        .catch(function (error) {
            console.error(
                "サイコロSEの再生に失敗しました:",
                error
            );
        });

    // =========================
    // 表示
    // =========================

    roulette.style.display =
        "block";


    // =========================
    // 数字を回す
    // =========================

    let count = 0;

    const interval =
        setInterval(
            function () {

                const randomNumber =
                    Math.floor(
                        Math.random() * 6
                    ) + 1;


                number.textContent =
                    randomNumber;


                count += 1;


                // =========================
                // ルーレット終了
                // =========================

                if (
                    count >= 15
                ) {

                    clearInterval(
                        interval
                    );


                    // 最終結果

                    number.textContent =
                        result;


                    // 少し余韻

                    setTimeout(
                        function () {

                            roulette.style.display =
                                "none";


                            if (
                                callback
                            ) {

                                callback();

                            }

                        },
                        700
                    );

                }

            },
            80
        );

}



// =========================
// 宝箱ルーレット開始
// =========================

function showItemRoulette(item, callback) {
    const roulette = document.getElementById("itemRoulette");
    const name = document.getElementById("itemRouletteName");

    roulette.style.display = "block";

    let count = 0;

    const interval = setInterval(function () {
        const randomItem =
            itemData[Math.floor(Math.random() * itemData.length)];

        name.textContent = randomItem.name;

        count += 1;

        if (count >= 20) {
            clearInterval(interval);

            name.textContent = item.name;

            setTimeout(function () {
                roulette.style.display = "none";

                if (callback) {
                    callback();
                }
            }, 800);
        }
    }, 80);
}

// =========================
// モンスターバトル開始
// =========================

function startMonsterBattle(
    player
) {

    // =========================
    // モンスターを選択
    // =========================

    const monster =
        monsterData[
            Math.floor(
                Math.random() *
                monsterData.length
            )
        ];


    // =========================
    // モンスター遭遇選択画面
    // =========================

    const monsterChoicePopup =
        document.getElementById(
            "monsterChoicePopup"
        );

    const monsterChoiceMessage =
        document.getElementById(
            "monsterChoiceMessage"
        );

    const monsterFightButton =
        document.getElementById(
            "monsterFightButton"
        );

    const monsterEscapeButton =
        document.getElementById(
            "monsterEscapeButton"
        );


    // =========================
    // モンスター情報
    // =========================

    monsterChoiceMessage.innerHTML =
        `
        ${monster.icon} ${monster.name}が現れた！

        <div class="monster-choice-stats">

            <div>
                ❤️ HP　${monster.hp}
            </div>

            <div>
                ⚔️ 攻撃　${monster.attack}
            </div>

        </div>
        `;


    // =========================
    // 遭遇画面を表示
    // =========================

    monsterChoicePopup.style.display =
        "block";


    // =========================
    // 戦う
    // =========================

    monsterFightButton.onclick =
        function () {

            // =========================
            // 遭遇画面を閉じる
            // =========================

            monsterChoicePopup.style.display =
                "none";


            // =========================
            // モンスターHP
            // =========================

            let monsterHP =
                monster.hp;


            // =========================
            // ラウンド
            // =========================

            let currentRound =
                1;


            // =========================
            // 戦闘画面
            // =========================

            const battlePopup =
                document.getElementById(
                    "battlePopup"
                );

            battlePopup.style.display =
                "block";


            // =========================
            // プレイヤー表示
            // =========================

            document.getElementById(
                "battlePlayerName"
            ).textContent =
                player.name;


            document.getElementById(
                "battlePlayerStats"
            ).innerHTML =
                `💰${formatG(player.money)}G<br>` +
                `🔮魔力 ${player.magicPower}`;


            // =========================
            // モンスター表示
            // =========================

            document.getElementById(
                "battleMonsterName"
            ).textContent =
                `${monster.icon} ${monster.name}`;


            document.getElementById(
                "battleMonsterStats"
            ).innerHTML =
                `❤️${monsterHP}<br>` +
                `⚔️攻撃 ${monster.attack}`;


            // =========================
            // ラウンド表示
            // =========================

            document.getElementById(
                "battleRound"
            ).textContent =
                "ROUND 1 / 3";


            // =========================
            // 戦闘メッセージ
            // =========================

            document.getElementById(
                "battleMessage"
            ).textContent =
                "👾 モンスターが現れた！";



  // =========================
// パスボタン
// =========================

const passButton =
    document.getElementById(
        "battlePassButton"
    );

passButton.style.display =
    "block";

passButton.disabled =
    false;

passButton.textContent =
    "⏭️ パス";


// =========================
// パス
// =========================

passButton.onclick =
    function () {

        // =========================
        // 二重クリック防止
        // =========================

        passButton.disabled =
            true;

        magicButton.disabled =
            true;


        // =========================
        // モンスターの反撃
        // =========================

        const monsterDamage =
            getMonsterDamage(
                player,
                monster.attack
            );


        player.money -=
            monsterDamage;


        if (
            player.money < 0
        ) {

            player.money =
                0;

        }


        // =========================
        // プレイヤー表示更新
        // =========================

        document.getElementById(
            "battlePlayerStats"
        ).innerHTML =
            `💰${formatG(player.money)}G<br>` +
            `🔮魔力 ${player.magicPower}`;


        renderPlayers();


        // =========================
        // 0Gになった場合
        // =========================

        if (
            player.money <= 0
        ) {

            document.getElementById(
                "battleMessage"
            ).innerHTML =
                `⏭️ パスした！` +
                `<br>` +
                `👾 ${monster.name}の攻撃！ ` +
                `${formatG(monsterDamage)}Gのダメージ！`;


            battlePopup.style.display =
                "none";


            checkPlayerRespawn(
                player,

                function () {

                    finishTurn(
                        player
                    );

                }
            );


            return;

        }


        // =========================
        // パス結果
        // =========================

        document.getElementById(
            "battleMessage"
        ).innerHTML =
            `⏭️ パスした！` +
            `<br>` +
            `👾 ${monster.name}の反撃！ ` +
            `${formatG(monsterDamage)}Gのダメージ！`;


        // =========================
        // 3ラウンド終了
        // =========================

        if (
            currentRound >= 3
        ) {

            document.getElementById(
                "battleMessage"
            ).innerHTML +=
                "⚔️ 3ラウンド終了！";


            passButton.textContent =
                "戦闘終了";

            magicButton.disabled =
                 true;

            passButton.disabled =
                false;


            passButton.onclick =
                function () {

                    passButton.disabled =
                        true;


                    battlePopup.style.display =
                        "none";

                    passButton.style.display =
                      "none";


                    finishTurn(
    player
);

                };


            return;

        }


        // =========================
        // 次のラウンド
        // =========================

        currentRound +=
            1;


        document.getElementById(
            "battleRound"
        ).textContent =
            `ROUND ${currentRound} / 3`;


        // =========================
        // 次のラウンドの操作を有効化
        // =========================

        magicButton.disabled =
            false;

        passButton.disabled =
            false;

    };

            // =========================
            // 魔法ボタン
            // =========================

            const magicButton =
                document.getElementById(
                    "battleMagicButton"
                );

            magicButton.style.display =
                "block";

            magicButton.disabled =
                false;

            magicButton.textContent =
                "🔮 魔法";


            // =========================
            // 魔法ボタン
            // =========================

            magicButton.onclick =
                function () {

                    showBattleMagicPopup(
                        player,
                        monster,

                        function (magic) {

                            // =========================
                            // 魔法選択画面を閉じる
                            // =========================

                            document.getElementById(
                                "battleMagicPopup"
                            ).style.display =
                                "none";


                            // =========================
                            // 必要魔力チェック
                            // =========================

                            if (
                                player.magicPower <
                                magic.requiredMagicPower
                            ) {

                                showEventPopup(
                                    "🔮 魔力不足",

                                    `${magic.icon} ${magic.name}を使うには` +
                                    `<br><br>` +
                                    `🔮 必要魔力：${magic.requiredMagicPower}` +
                                    `<br>` +
                                    `🔮 現在の魔力：${player.magicPower}`,

                                    function () {

                                    }
                                );

                                return;

                            }


                            // =========================
                            // 使用コストチェック
                            // =========================

                            if (
                                player.money <
                                magic.cost
                            ) {

                                showEventPopup(
                                    "💰 G不足",

                                    `${magic.icon} ${magic.name}を使うには` +
                                    `<br><br>` +
                                    `💰 ${formatG(magic.cost)}G 必要です。` +
                                    `<br>` +
                                    `現在の所持金：${formatG(player.money)}G`,

                                    function () {

                                    }
                                );

                                return;

                            }


                            // =========================
                            // 魔法コストを支払う
                            // =========================

                            player.money -=
                                magic.cost;


                            // =========================
                            // ダメージ計算
                            // =========================

                            const magicDamage =
                                Math.floor(
                                    player.magicPower *
                                    magic.powerRate
                                );


                            // =========================
                            // モンスターHPを減らす
                            // =========================

                            monsterHP -=
                                magicDamage;


                            if (
                                monsterHP < 0
                            ) {

                                monsterHP =
                                    0;

                            }


                            // =========================
                            // 表示更新
                            // =========================

                            document.getElementById(
                                "battlePlayerStats"
                            ).innerHTML =
                                `💰${formatG(player.money)}G<br>` +
                                `🔮魔力 ${player.magicPower}`;


                            document.getElementById(
                                "battleMonsterStats"
                            ).innerHTML =
                                `❤️${monsterHP}<br>` +
                                `⚔️攻撃 ${monster.attack}`;


                            renderPlayers();


// =========================
// モンスター撃破
// =========================

if (
    monsterHP === 0
) {

    document.getElementById(
        "battleMessage"
    ).textContent =
        `${magic.icon} ${magic.name}！` +
        ` ${magicDamage}ダメージ！` +
        `　👾 ${monster.name}を倒した！`;


    

    // =========================
    // 戦闘終了ボタン
    // =========================

    magicButton.textContent =
        "戦闘終了";

passButton.style.display =
    "none";

    magicButton.onclick =
        function () {

            magicButton.disabled =
                true;


            battlePopup.style.display =
                "none";


            showRewardPopup(
                player,

                function () {

                    finishTurn(
                        player
                    );

                }
            );

        };


    return;

}

 // =========================
// モンスター反撃
// =========================

const monsterDamage =
    getMonsterDamage(
        player,
        monster.attack
    );

player.money -=
    monsterDamage;

if (player.money <= 0) {

    player.money = 0;

    renderPlayers();

    // 戦闘画面に攻撃結果を表示
    battlePlayerStats.innerHTML =
        `💰${formatG(player.money)}G<br>🔮${player.magicPower}`;

    battleMessage.textContent =
        `👾 ${monster.name}の攻撃！ ${formatG(monsterDamage)}Gのダメージ！`;

    // すぐに閉じず、戦闘画面を見せる
    // 戦闘結果を表示したまま待つ
battleMessage.textContent =
    `👾 ${monster.name}の攻撃！ ${formatG(monsterDamage)}Gのダメージ！`;


}


                            // =========================
                            // プレイヤー表示更新
                            // =========================

                            document.getElementById(
                                "battlePlayerStats"
                            ).innerHTML =
                                `💰${formatG(player.money)}G<br>` +
                                `🔮魔力 ${player.magicPower}`;


                            renderPlayers();


                            // =========================
                            // 戦闘メッセージ
                            // =========================

                            document.getElementById(
                                "battleMessage"
                            ).textContent =
                                `${magic.icon} ${magic.name}！` +
                                ` ${magicDamage}ダメージ！` +
                                `　👾 ${monster.name}の反撃！` +
                                ` ${monsterDamage}ダメージ！`;


                            // =========================
                            // 3ラウンド終了
                            // =========================

                            if (
                                currentRound >= 3
                            ) {

                                document.getElementById(
                                    "battleMessage"
                                ).textContent +=
                                    "　⚔️ 3ラウンド終了！";


                                magicButton.textContent =
                                    "戦闘終了";


                                magicButton.onclick =
                                    function () {

                                        magicButton.disabled =
                                            true;


                                        battlePopup.style.display =
                                            "none";

                                             passButton.style.display =
                                             "none";

                                        finishTurn(
                                            player
                                        );

                                    };


                                return;

                            }


                            // =========================
                            // 次のラウンド
                            // =========================

                            currentRound +=
                                1;


                            document.getElementById(
                                "battleRound"
                            ).textContent =
                                `ROUND ${currentRound} / 3`;

                        }
                    );

                };


            // =========================
            // 魔法ボタンを表示
            // =========================

            magicButton.style.display =
                "block";

        };


    // =========================
    // 逃げる
    // =========================

    monsterEscapeButton.onclick =
        function () {

            monsterChoicePopup.style.display =
                "none";


            showEventPopup(
                "🏃 逃走！",

                `${player.name}は ${monster.name}から逃げ出した！`,

                function () {

                    finishTurn(
                        player
                    );

                }
            );

        };

}

// =========================
// ボス戦開始
// =========================

function startBossBattle(
    player
) {

    // =========================
    // ボスがすでに倒されている場合
    // =========================

    if (
        currentBossHP <= 0
    ) {

        currentBossHP =
            bossData.hp;

    }


    // =========================
    // 戦闘画面
    // =========================

    const battlePopup =
        document.getElementById(
            "battlePopup"
        );

    battlePopup.style.display =
        "block";


    // =========================
    // ラウンド
    // =========================

    let currentRound =
        1;


    // =========================
    // プレイヤー表示
    // =========================

    document.getElementById(
        "battlePlayerName"
    ).textContent =
        player.name;


    document.getElementById(
        "battlePlayerStats"
    ).innerHTML =
        `💰${formatG(player.money)}G<br>` +
        `🔮魔力 ${player.magicPower}`;


    // =========================
    // ボス表示
    // =========================

    document.getElementById(
        "battleMonsterName"
    ).textContent =
        `${bossData.icon} ${bossData.name}`;


    document.getElementById(
        "battleMonsterStats"
    ).innerHTML =
        `❤️${currentBossHP}<br>` +
        `⚔️攻撃 ${bossData.attack}`;


    // =========================
    // ラウンド表示
    // =========================

    document.getElementById(
        "battleRound"
    ).textContent =
        "ROUND 1 / 3";


    // =========================
    // 戦闘メッセージ
    // =========================

    document.getElementById(
        "battleMessage"
    ).textContent =
        "👹 デーモンロードとの戦闘開始！";


       
    // =========================
    // 魔法ボタン
    // =========================

    const magicButton =
        document.getElementById(
            "battleMagicButton"
        );

    magicButton.style.display =
        "block";

    magicButton.disabled =
        false;

    magicButton.textContent =
        "🔮 魔法";


// =========================
// パスボタン
// =========================

const passButton =
    document.getElementById(
        "battlePassButton"
    );

passButton.style.display =
    "block";

passButton.disabled =
    false;

passButton.textContent =
    "⏭️ パス";


// =========================
// パスボタン
// =========================

passButton.onclick =
    function () {

        // =========================
        // 二重クリック防止
        // =========================

        passButton.disabled =
            true;

        magicButton.disabled =
            true;


        // =========================
        // ボスの反撃
        // =========================

        const bossDamage =
            bossData.attack;


        player.money -=
            bossDamage;


        if (
            player.money < 0
        ) {

            player.money =
                0;

        }


        // =========================
        // プレイヤー表示更新
        // =========================

        document.getElementById(
            "battlePlayerStats"
        ).innerHTML =
            `💰${formatG(player.money)}G<br>` +
            `🔮魔力 ${player.magicPower}`;


        renderPlayers();


        // =========================
        // プレイヤーが0G
        // =========================

        if (
            player.money <= 0
        ) {

            document.getElementById(
                "battleMessage"
            ).textContent =
                `⏭️ パスした！` +
                `<br>` +
                `👹 ${bossData.name}の反撃！ ` +
                `${bossDamage}Gのダメージ！`;


            battlePopup.style.display =
                "none";


            checkPlayerRespawn(
                player,

                function () {

                    finishTurn(
                        player
                    );

                }
            );

            return;

        }


        // =========================
        // パス結果
        // =========================

        document.getElementById(
            "battleMessage"
        ).innerHTML =
            `⏭️ パスした！` +
            `<br>` +
            `👹 ${bossData.name}の反撃！ ` +
            `${bossDamage}Gのダメージ！`;


        // =========================
        // 3ラウンド終了
        // =========================

        if (
            currentRound >= 3
        ) {

            document.getElementById(
                "battleMessage"
            ).innerHTML +=
                "⚔️ 3ラウンド終了！";


            passButton.textContent =
                "戦闘終了";

            passButton.disabled =
                false;


            passButton.onclick =
                function () {

                    magicButton.disabled =
                    true;

                    passButton.disabled =
                        true;


                    battlePopup.style.display =
                        "none";

                     passButton.style.display =
                      "none";

                    finishTurn(
                        player
                    );

                };


            return;

        }


        // =========================
        // 次のラウンド
        // =========================

        currentRound +=
            1;


        document.getElementById(
            "battleRound"
        ).textContent =
            `ROUND ${currentRound} / 3`;


        // =========================
        // 次のラウンドの操作を有効化
        // =========================

        magicButton.disabled =
            false;

        passButton.disabled =
            false;

    };

    // =========================
    // 魔法ボタン
    // =========================

    magicButton.onclick =
        function () {

            magicButton.disabled =
                true;


            showBattleMagicPopup(
                player,
                bossData,

                function (magic) {

                    // =========================
                    // 魔法選択画面を閉じる
                    // =========================

                    document.getElementById(
                        "battleMagicPopup"
                    ).style.display =
                        "none";


                    // =========================
                    // 使用コストチェック
                    // =========================

                    if (
                        player.money <
                        magic.cost
                    ) {

                        magicButton.disabled =
                            false;

                        showEventPopup(
                            "💰 G不足",

                            `${magic.icon} ${magic.name}を使うには` +
                            `<br><br>` +
                            `💰 ${formatG(magic.cost)}G 必要です。` +
                            `<br>` +
                            `現在の所持金：${formatG(player.money)}G`,

                            function () {

                            }
                        );

                        return;

                    }


                    // =========================
                    // 魔法コストを支払う
                    // =========================

                    player.money -=
                        magic.cost;


                    // =========================
                    // ダメージ計算
                    // =========================

                    const magicDamage =
                        Math.floor(
                            player.magicPower *
                            magic.powerRate
                        );


 // =========================
// ボスへの実ダメージ計算
// =========================

const actualDamage =
    Math.min(
        magicDamage,
        currentBossHP
    );


// =========================
// ボスHPを減らす
// =========================

currentBossHP -=
    actualDamage;


// =========================
// ボスへの累計ダメージを記録
// =========================

player.bossDamage +=
    actualDamage;

                    


                    // =========================
                    // 表示更新
                    // =========================

                    document.getElementById(
                        "battlePlayerStats"
                    ).innerHTML =
                        `💰${formatG(player.money)}G<br>` +
                        `🔮魔力 ${player.magicPower}`;


                    document.getElementById(
                        "battleMonsterStats"
                    ).innerHTML =
                        `❤️${currentBossHP}<br>` +
                        `⚔️攻撃 ${bossData.attack}`;


                    renderPlayers();


                    // =========================
                    // ボス撃破
                    // =========================

                    if (
                        currentBossHP === 0
                    ) {

                        passButton.style.display =
                        "none";

                        // =========================
// ボス報酬を計算・配布
// =========================

if (
    bossRewardGiven === false
) {

    players.forEach(
        function (p) {

            // ダメージ報酬
            const damageReward =
                p.bossDamage *
                BOSS_DAMAGE_MULTIPLIER;

            p.money +=
                damageReward;

            // 先着報酬
            if (
                p === bossFirstPlayer
            ) {

                p.money +=
                    BOSS_FIRST_REWARD;

            }

        }
    );

    // 撃破報酬
    player.money +=
        BOSS_DEFEAT_REWARD;

    // 報酬配布済みにする
    bossRewardGiven =
        true;

}


                        document.getElementById(
                            "battleMessage"
                        ).textContent =
                            `${magic.icon} ${magic.name}！ ` +
                            `${magicDamage}ダメージ！` +
                            `　👹 ${bossData.name}を倒した！`;


                        magicButton.textContent =
                            "戦闘終了";


                        magicButton.disabled =
                            false;


                        magicButton.onclick =
                            function () {

                                magicButton.disabled =
                                    true;

                                battlePopup.style.display =
                                    "none";

                                // =========================
// ボス報酬表示
// =========================

let bossRewardMessage =
    `${bossData.name}を倒した！<br>`;


// =========================
// 先着報酬
// =========================

bossRewardMessage +=
    `🥇 先着報酬<br>`;

bossRewardMessage +=
    `${bossFirstPlayer.name}：+${formatG(BOSS_FIRST_REWARD)}G<br>`;


// =========================
// ダメージ報酬
// =========================

bossRewardMessage +=
    `⚔️ ダメージ報酬<br>`;

players.forEach(
    function (p) {

        const damageReward =
            p.bossDamage *
            BOSS_DAMAGE_MULTIPLIER;

        bossRewardMessage +=
            `${p.name}：+${formatG(damageReward)}G<br>`;

    }
);


bossRewardMessage +=
    `<br>`;


// =========================
// 撃破報酬
// =========================

bossRewardMessage +=
    `👑 撃破報酬<br>`;

bossRewardMessage +=
    `${player.name}：+${formatG(BOSS_DEFEAT_REWARD)}G`;


// =========================
// ポップアップ表示
// =========================

showEventPopup(
    "👹 ボス撃破！",
    bossRewardMessage,
    function () {

        // =========================
        // 現在のボスを記録
        // =========================

        previousBossSquareId =
            currentBossSquareId;


        // =========================
        // 次のボス位置を決定
        // =========================

        selectBossSquare();


        // =========================
        // ボス報酬データをリセット
        // =========================

        bossFirstPlayer =
            null;

        bossRewardGiven =
            false;


        players.forEach(
            function (p) {

                p.bossDamage =
                    0;

            }
        );


        // =========================
        // マップ表示を更新
        // =========================

        renderMap();


        // =========================
// 次のボス決定演出
// =========================

showBossDestinationPopup(
    function () {

        // =========================
        // ターン終了
        // =========================

        finishTurn(
            player
        );

    }
);

    }
);

                            };


                        return;

                    }


                    // =========================
                    // ボスの反撃
                    // =========================

                    const bossDamage =
                        bossData.attack;


                    player.money -=
                        bossDamage;


                    if (
                        player.money < 0
                    ) {

                        player.money =
                            0;

                    }


                    // =========================
                    // プレイヤー表示更新
                    // =========================

                    document.getElementById(
                        "battlePlayerStats"
                    ).innerHTML =
                        `💰${formatG(player.money)}G<br>` +
                        `🔮魔力 ${player.magicPower}`;


                    renderPlayers();


                    // =========================
                    // プレイヤーが0G
                    // =========================

                    if (
                        player.money <= 0
                    ) {

                        battlePopup.style.display =
                            "none";

                        checkPlayerRespawn(
                            player,

                            function () {

                                finishTurn(
                                    player
                                );

                            }
                        );

                        return;

                    }


                    // =========================
                    // 戦闘メッセージ
                    // =========================

                    document.getElementById(
                        "battleMessage"
                    ).textContent =
                        `${magic.icon} ${magic.name}！ ` +
                        `${magicDamage}ダメージ！` +
                        `　👹 ${bossData.name}の反撃！ ` +
                        `${bossDamage}Gのダメージ！`;


                    // =========================
                    // 3ラウンド終了
                    // =========================

                    if (
                        currentRound >= 3
                    ) {

                        document.getElementById(
                            "battleMessage"
                        ).textContent +=
                            "⚔️ 3ラウンド終了！";

                         passButton.style.display =
                                  "none";

                        magicButton.textContent =
                            "戦闘終了";

                        magicButton.disabled =
                            false;

                        magicButton.onclick =
                            function () {

                                magicButton.disabled =
                                    true;

                                battlePopup.style.display =
                                    "none";

                                


                                finishTurn(
                                    player
                                );

                            };

                        return;

                    }


                    // =========================
                    // 次のラウンド
                    // =========================

                    currentRound +=
                        1;


                    document.getElementById(
                        "battleRound"
                    ).textContent =
                        `ROUND ${currentRound} / 3`;


                    // =========================
                    // 魔法ボタンを再び有効化
                    // =========================

                    magicButton.disabled =
                        false;

                }
            );

        };

}

// =========================
// ボス挑戦確認
// =========================

function showBossChallengePopup(
    player,
    isRechallenge = false
) {

    // =========================
    // ボス先着プレイヤーを記録
    // =========================

    if (
        bossFirstPlayer === null
    ) {

        bossFirstPlayer =
            player;

    }


    const popup =
        document.getElementById(
            "monsterChoicePopup"
        );

    const message =
        document.getElementById(
            "monsterChoiceMessage"
        );

    const fightButton =
        document.getElementById(
            "monsterFightButton"
        );

    const escapeButton =
        document.getElementById(
            "monsterEscapeButton"
        );


    // =========================
    // メッセージ
    // =========================

    message.innerHTML =
        `
        <div style="
            font-size: 2.5em;
            margin-bottom: 15px;
        ">
            👹
        </div>

        <div style="
        font-size: 1.5em;
        font-weight: bold;
    ">
        ${isRechallenge ? "ボスが待っている！" : "ボスが現れた！"}
    </div>

           <div style="
        margin-top: 15px;
        line-height: 1.8;
    ">
        ${isRechallenge
            ? "ボスに再挑戦しますか？"
            : "この先へ進むには<br>このボスを倒さなければならない。"
        }
    </div>
        `;


    // =========================
    // ボタン表示
    // =========================

    fightButton.textContent =
        "⚔️ 挑戦する";

    escapeButton.textContent =
        "🏃 今回はやめる";


    // =========================
    // ポップアップ表示
    // =========================

    popup.style.display =
        "block";


    // =========================
    // 挑戦する
    // =========================

    fightButton.onclick =
        function () {

            popup.style.display =
                "none";

            startBossBattle(
                player
            );

        };


    // =========================
    // 今回はやめる
    // =========================

    escapeButton.onclick =
    function () {

        popup.style.display =
            "none";


        // =========================
        // 初回到着
        // =========================

        if (
            !isRechallenge
        ) {

            showEventPopup(
                "👹 ボスから撤退",

                `
                ${player.name}は
                今回はボスへの挑戦を見送った。
                `,

                function () {

                    finishTurn(
                        player
                    );

                }
            );

            return;

        }


        // =========================
        // 再戦を見送る
        // =========================

        renderTurn();
        renderPlayers();
        centerCurrentPlayerOnMap();


        rouletteButton.disabled =
            false;

    };

}

// =========================
// マスイベント
// =========================

function handleSquareEvent(
    player
) {

    const currentSquare =
        mapData.find(
            function (square) {

                return square.id ===
                    player.position;

            }
        );


    if (
        !currentSquare
    ) {

        finishTurn(
            player
        );

        return;

    }


    switch (
        currentSquare.type
    ) {

// =========================
// 資産マス
// =========================

case "asset":

    showAssetPurchasePopup(
        player,
        currentSquare.assetIds || [],
        function () {

            finishTurn(player);

        }
    );

    break;
        
       // =========================
        // お金マス
        // =========================

        case "money":

            // =========================
            // 獲得額を決定
            // =========================

            const reward =
                getRandomGoldReward();


            // =========================
            // ゴールドルーレット
            // =========================

            showGoldRoulette(
                reward,
                function () {

                    // =========================
                    // ルーレット終了後にゴールドを加算
                    // =========================

                    player.money +=
                        reward;


                    // プレイヤー表示更新
                    renderPlayers();


                    // =========================
                    // 結果ポップアップ
                    // =========================

                    showEventPopup(
                        "💰 " +
                        currentSquare.name,

                        `${formatG(reward)}G 獲得！`,

                        function () {

                            finishTurn(
                                player
                            );

                        }
                    );

                }
            );

            break;

        // =========================
        // 魔法マス
        // =========================

        case "magic_shop":


         showMagicShopPopup(
        player
            );

             break;

             
// =========================
// モンスターマス
// =========================

case "monster":

    // =========================
    // ボスマスか確認
    // =========================

    if (
        player.position ===
        currentBossSquareId
    ) {

        showBossChallengePopup(
            player
        );

    } else {

        startMonsterBattle(
            player
        );

    }

    break;


        // =========================
        // バイトマス
        // =========================

        case "job":

    showJobPopup(
        player,
        currentSquare,
        function () {
            finishTurn(player);
        }
    );

    break;

case "worst":

    player.money -= 10000;

    if (player.money < 0) {
        player.money = 0;
    }

    renderPlayers();

    showEventPopup(
        "💀 最悪マス",
        `${player.name}は最悪のマスに止まってしまった……。<br><br>
        💸 <strong>10,000G</strong>を失った！<br>
        💰 残り ${formatG(player.money)}G`,
        function () {
            finishTurn(player);
        }
    );

    break;

        // =========================
        // 宝箱ルーレット
        // =========================

case "treasure":
    const randomItem =
        itemData[Math.floor(Math.random() * itemData.length)];

    showItemRoulette(
        randomItem,
        function () {
            player.inventory.push(randomItem.id);

            renderPlayers();

            showEventPopup(
                "🎁 宝箱",
                `<strong>${randomItem.name}</strong>を手に入れた！`,
                function () {
                    finishTurn(player);
                }
            );
        }
    );
    break;

        // =========================
        // その他
        // =========================

        default:

            finishTurn(
                player
            );

            break;

    }
    

}

// =========================
// 魔法ショップ
// =========================

function showMagicShopPopup(
    player
) {

    const magicShopPopup =
        document.getElementById(
            "magicShopPopup"
        );

    const magicShopMoney =
        document.getElementById(
            "magicShopMoney"
        );

    const magicShopList =
        document.getElementById(
            "magicShopList"
        );

    const closeButton =
        document.getElementById(
            "magicShopCloseButton"
        );


    // =========================
    // 所持金を表示
    // =========================

    magicShopMoney.textContent =
        `💰 所持金：${formatG(player.money)}G`;


    // =========================
    // 魔法一覧を初期化
    // =========================

    magicShopList.innerHTML =
        "";

 // =========================
// 魔法を表示
// =========================

magicData.forEach(
    function (magic) {

        // ファイアは初期魔法なので販売しない
        if (magic.id === 1) {
            return;
        }


        const magicElement =
            document.createElement(
                "div"
            );

            magicElement.className =
                "magic-shop-item";


            // =========================
            // 習得済みか確認
            // =========================

            const alreadyLearned =
                player.magic.includes(
                    magic.id
                );


            magicElement.innerHTML = `

                <div
                    class="magic-shop-item-name"
                >

                    ${magic.icon}
                    ${magic.name}

                </div>


                <div
                    class="magic-shop-item-effect"
                >

                    ${magic.effect}

                </div>


                <div
                    class="magic-shop-item-price"
                >

                    💰 ${formatG(magic.price)}G

                </div>


                ${
                    alreadyLearned

                    ? `

                        <div
                            class="magic-shop-learned"
                        >
                            ✅ 習得済み
                        </div>

                    `

                    : `

                        <button
                            class="magic-shop-buy-button"
                        >
                            購入
                        </button>

                    `
                }

            `;


            // =========================
            // 購入ボタン
            // =========================

            if (
                !alreadyLearned
            ) {

                const buyButton =
                    magicElement.querySelector(
                        ".magic-shop-buy-button"
                    );


                buyButton.addEventListener(
                    "click",
                    function () {

                        // =========================
                        // 所持金チェック
                        // =========================

                        if (
                            player.money <
                            magic.price
                        ) {

                            showEventPopup(
                                "💰 G不足",
                                `

                                ${magic.icon}
                                ${magic.name}を購入するには
                                <br>

                                <strong>
                                    ${formatG(magic.price)}G
                                </strong>
                                必要です。
                                <br><br>

                                現在の所持金：
                                <strong>
                                    ${formatG(player.money)}G
                                </strong>

                                `,
                                function () {

                                }
                            );

                            return;
                        }


                        // =========================
                        // Gを支払う
                        // =========================

                        player.money -=
                            magic.price;


                        // =========================
                        // 魔法を習得
                        // =========================

                        player.magic.push(
                            magic.id
                        );


                        // =========================
                        // プレイヤー表示更新
                        // =========================

                        renderPlayers();


                        // =========================
                        // 習得メッセージ
                        // =========================

                        showEventPopup(
                            "🔮 魔法習得",
                            `

                            ${magic.icon}
                            <strong>
                                ${magic.name}
                            </strong>
                            を習得した！

                            <br><br>

                            💰
                            ${formatG(magic.price)}G
                            を支払った。

                            `,
                            function () {

                                // =========================
                                // ショップを再表示
                                // =========================

                                showMagicShopPopup(
                                    player
                                );

                            }
                        );

                    }
                );

            }


            magicShopList.appendChild(
                magicElement
            );

        }
    );


    // =========================
    // ショップを表示
    // =========================

    magicShopPopup.style.display =
        "block";


    // =========================
    // やめるボタン
    // =========================

    closeButton.onclick =
        function () {

            magicShopPopup.style.display =
                "none";

            finishTurn(
                player
            );

        };

}



// =========================
// 資産0時のリスポーン
// =========================

function checkPlayerRespawn(player) {

    if (player.money > 0) {
        return false;
    }

    // Gが0になったらSTARTへ戻る
    player.money = 500;
    player.position = 0;

    // 移動履歴をリセット
    movementPath = [];

    renderPlayers();
    renderMap();

    showEventPopup(
        "💀 力尽きた！",
        `${player.name}は資産をすべて失った……。<br><br>
        🏕️ START地点へリスポーン！<br>
        💰 500Gを手に入れた！`,
        function () {
            updateTurnDisplay();
        }
    );

    return true;
}


// =========================
// 0G時のリスポーン
// =========================

function checkPlayerRespawn(player, callback) {

    if (player.money > 0) {
        if (callback) {
            callback();
        }
        return;
    }

    // 1番のマスへリスポーン
    player.money = 500;
    player.position = 0;

    // 移動履歴をリセット
    movementPath = [];

    renderPlayers();
    renderMap();

    showEventPopup(
        "💀 資産0G",
        `${player.name}は資産をすべて失った……。<br><br>
        🏕️ 1番のマスへリスポーン！<br>
        💰 <strong>500G</strong>を手に入れた！`,
        function () {

            if (callback) {
                callback();
            }

        }
    );
}

// =========================
// 最終結果
// =========================

function showGameResult() {

    const resultPopup =
        document.getElementById("resultPopup");

    const resultRanking =
        document.getElementById("resultRanking");


    // =========================
    // Gの多い順に並べる
    // =========================

    const ranking =
        [...players].sort(function (a, b) {

            return b.money - a.money;

        });


    resultRanking.innerHTML = "";


    // =========================
    // ランキング表示
    // =========================

    ranking.forEach(function (player, index) {

        let rankIcon;


        if (index === 0) {

            rankIcon = "🥇";

        } else if (index === 1) {

            rankIcon = "🥈";

        } else if (index === 2) {

            rankIcon = "🥉";

        } else {

            rankIcon = `${index + 1}位`;

        }


        const rankElement =
            document.createElement("div");


        rankElement.className =
            "result-rank";


        rankElement.innerHTML = `

            <span class="result-rank-name">
                ${rankIcon} ${player.name}
            </span>

            <span class="result-rank-money">
                💰 ${formatG(player.money)}G
            </span>

        `;


        resultRanking.appendChild(
            rankElement
        );

    });


    // =========================
    // 結果画面表示
    // =========================

    gameStarted = false;

    resultPopup.style.display =
        "block";


    // =========================
    // もう一度遊ぶ
    // =========================

    document.getElementById(
        "resultButton"
    ).onclick = function () {

        location.reload();

    };

}

// =========================
// 資産配当計算
// =========================

function calculateAssetDividend(player) {

    let dividend = 0;


    // 資産を持っていなければ0G
    if (
        !player.assets ||
        player.assets.length === 0
    ) {

        return 0;

    }


    // 保有している資産を1つずつ計算
    player.assets.forEach(
        function (assetId) {

            const asset =
                assetData.find(
                    function (data) {

                        return data.id === assetId;

                    }
                );


            if (!asset) {

                return;

            }


            // 取得額 × 利回り
            dividend +=
                asset.price *
                (asset.yield / 100);

        }
    );


    // 小数点以下を切り捨て
    return Math.floor(dividend);

}


// =========================
// 配当結果表示
// =========================

function showDividendPopup(
    dividendResults,
    callback
) {

    const message =
        dividendResults
            .map(
                function (result) {

                    return `
                        <div style="
                            display:flex;
                            justify-content:space-between;
                            align-items:center;
                            padding:10px 4px;
                            border-bottom:1px solid rgba(255,255,255,0.15);
                        ">

                            <span>
                                ${result.name}
                            </span>

                            <strong style="
                                color:#f5d76e;
                                font-size:18px;
                            ">
                                ＋${result.dividend.toLocaleString()}G
                            </strong>

                        </div>
                    `;

                }
            )
            .join("");


    showEventPopup(
        "📈 配当",

        `
            <div style="
                margin-bottom:10px;
                text-align:center;
            ">
                資産から配当金を受け取りました！
            </div>

            ${message}
        `,

        function () {

            if (callback) {

                callback();

            }

        }
    );


    // =========================
    // ボタンを「次へ」に変更
    // =========================

    const popupButton =
        document.getElementById(
            "eventPopupButton"
        );


    popupButton.textContent =
        "次へ";

}

// 総資産を計算
function calculateTotalAssetValue(player) {
    let assetValue = 0;

    if (player.assets && player.assets.length > 0) {
        player.assets.forEach(function (assetId) {
            const asset = assetData.find(function (data) {
                return data.id === assetId;
            });

            if (asset) {
                assetValue += asset.price;
            }
        });
    }

    return player.money + assetValue;
}


// 総資産ランキングを表示
function showAssetRankingPopup(callback) {
    const ranking = players.map(function (player) {
        return {
            name: player.name,
            totalAsset: calculateTotalAssetValue(player)
        };
    }).sort(function (a, b) {
        return b.totalAsset - a.totalAsset;
    });

    const rankingHtml = `
        <div style="
            display:grid;
            grid-template-columns:60px 1fr 120px;
            gap:8px;
            align-items:center;
            font-size:14px;
        ">
            <div style="font-weight:bold;text-align:center;">順位</div>
            <div style="font-weight:bold;">名前</div>
            <div style="font-weight:bold;text-align:right;">💰＋👩</div>

            ${ranking.map(function (result, index) {
                return `
                    <div style="
                        padding:10px 4px;
                        text-align:center;
                        border-top:1px solid rgba(255,255,255,0.15);
                    ">
                        ${index + 1}位
                    </div>

                    <div style="
                        padding:10px 4px;
                        border-top:1px solid rgba(255,255,255,0.15);
                    ">
                        ${result.name}
                    </div>

                    <div style="
                        padding:10px 4px;
                        text-align:right;
                        border-top:1px solid rgba(255,255,255,0.15);
                        color:#f5d76e;
                        font-weight:bold;
                    ">
                        ${formatG(result.totalAsset)}G
                    </div>
                `;
            }).join("")}
        </div>
    `;

    showEventPopup(
        "🏆 総資産ランキング",
        rankingHtml,
        function () {
            if (callback) callback();
        }
    );

    const popupButton = document.getElementById("eventPopupButton");
    popupButton.textContent = "次へ";
}


// =========================
// ターン終了
// =========================

function finishTurn(
    player
) {

    console.log(
        "ターン終了！現在のプレイヤー:",
        currentPlayer
    );


    // =========================
    // 資産0Gならリスポーン
    // =========================

    if (
        player.money <= 0
    ) {

        checkPlayerRespawn(
            player,
            function () {

                finishTurn(player);

            }
        );

        return;

    }


    // =========================
    // 全員のターンが終了したか
    // =========================

    if (
        currentPlayer ===
        players.length - 1
    ) {

        // =========================
        // 今終了したターン
        // =========================

        const completedTurn =
            currentTurn;


        // =========================
        // 次のターンへ
        // =========================

        currentTurn +=
            1;


        // =========================
        // 配当タイミング
        // =========================

        if (
            completedTurn %
            dividendCycle ===
            0
        ) {

            console.log(
                `📈 配当タイミング：${completedTurn}ターン終了`
            );


            // =========================
            // 配当結果を保存
            // =========================

            const dividendResults = [];


            // =========================
            // 全プレイヤーへ配当
            // =========================

            players.forEach(
                function (targetPlayer) {

                    const dividend =
                        calculateAssetDividend(
                            targetPlayer
                        );


                    // 配当金を支給
                    targetPlayer.money +=
                        dividend;


                    // 表示用に保存
                    dividendResults.push({

                        name:
                            targetPlayer.name,

                        dividend:
                            dividend

                    });


                    console.log(
                        `📈 ${targetPlayer.name}：${formatG(dividend)}G`
                    );

                }
            );


            // プレイヤー表示更新
            renderPlayers();


            // =========================
            // 配当画面
            // =========================

            showDividendPopup(dividendResults, 
                function () {
    showAssetRankingPopup(function () {

    // =========================
    // 次のプレイヤーへ
    // =========================

    currentPlayer =
        (currentPlayer + 1) %
        players.length;

        //SE:プレイヤー切り替え
        switchingSound.currentTime = 0;
        switchingSound.play()

    inventoryButton.disabled =
        false;


    // =========================
    // 最大ターン数終了
    // =========================

    if (
        currentTurn >
        maxTurns
    ) {

        showGameResult();

        return;

    }


    // =========================
    // 次のプレイヤー
    // =========================

    const nextPlayer =
        players[currentPlayer];


    // =========================
    // 次のプレイヤーが
    // 仕事中か確認
    // =========================

    if (
        nextPlayer.jobTurnsRemaining > 0
    ) {

        nextPlayer.jobTurnsRemaining -=
            1;


        renderTurn();
        renderPlayers();
        centerCurrentPlayerOnMap();


        // =========================
        // 仕事終了
        // =========================

        if (
            nextPlayer.jobTurnsRemaining === 0
        ) {

            const reward =
                nextPlayer.jobReward;


            nextPlayer.money +=
                reward;


            nextPlayer.jobReward =
                0;


            renderPlayers();


            showEventPopup(
                "💰 バイト終了！",

                `${nextPlayer.name}は仕事を終えて<br>` +
                `<strong>${formatG(reward)}G</strong>を獲得！`,

                function () {

                    finishTurn(
                        nextPlayer
                    );

                }
            );


            return;

        }


        // =========================
        // まだ仕事中
        // =========================

        showEventPopup(
            "💼 仕事中",

            `${nextPlayer.name}は現在仕事中です。<br>` +
            `残り ${nextPlayer.jobTurnsRemaining} ターン`,

            function () {

                finishTurn(
                    nextPlayer
                );

            }
        );


        return;

    }


    // =========================
    // 通常プレイヤー
    // =========================

    renderTurn();
    renderPlayers();

    // =========================
// ボスマスにいる場合
// 再戦確認
// =========================

if (
    nextPlayer.position ===
    currentBossSquareId
) {

    showBossChallengePopup(
        nextPlayer,
        true
    );

    return;

}


    // ルーレット使用可能
    rouletteButton.disabled =
        false;

});

                }
            );


            // =========================
            // 配当画面を表示したら
            // ここで一旦終了
            // =========================

            return;

        }


        // =========================
        // 配当がない場合
        // =========================

        // 次のプレイヤーへ
        currentPlayer =
            (
                currentPlayer + 1
            )
            %
            players.length;

         //SE:プレイヤー切り替え
        switchingSound.currentTime = 0;
        switchingSound.play()
        // 所持品ボタンを再び有効化
        inventoryButton.disabled =
            false;


        // =========================
        // 最大ターン数終了
        // =========================

        if (
            currentTurn >
            maxTurns
        ) {

            showGameResult();

            return;

        }


        // =========================
        // 次のプレイヤー
        // =========================

        const nextPlayer =
            players[currentPlayer];


        // =========================
        // 次のプレイヤーが
        // 仕事中か確認
        // =========================

        if (
            nextPlayer.jobTurnsRemaining > 0
        ) {

            nextPlayer.jobTurnsRemaining -=
                1;


            renderTurn();
            renderPlayers();
            centerCurrentPlayerOnMap();


            // =========================
            // 仕事終了
            // =========================

            if (
                nextPlayer.jobTurnsRemaining === 0
            ) {

                const reward =
                    nextPlayer.jobReward;


                nextPlayer.money +=
                    reward;


                nextPlayer.jobReward =
                    0;


                renderPlayers();


                showEventPopup(
                    "💰 バイト終了！",

                    `${nextPlayer.name}は仕事を終えて<br>` +
                    `<strong>${formatG(reward)}G</strong>を獲得！`,

                    function () {

                        finishTurn(
                            nextPlayer
                        );

                    }
                );


                return;

            }


            // =========================
            // まだ仕事中
            // =========================

            showEventPopup(
                "💼 仕事中",

                `${nextPlayer.name}は現在仕事中です。<br>` +
                `残り ${nextPlayer.jobTurnsRemaining} ターン`,

                function () {

                    finishTurn(
                        nextPlayer
                    );

                }
            );


            return;

        }


        // =========================
        // 通常プレイヤー
        // =========================

        renderTurn();
        renderPlayers();
        centerCurrentPlayerOnMap();

 // =========================
// ボスマスにいる場合
// 再戦確認
// =========================

if (
    nextPlayer.position ===
    currentBossSquareId
) {

    showBossChallengePopup(
        nextPlayer,
        true
    );

    return;

}


        // ルーレット使用可能
        rouletteButton.disabled =
            false;

        return;

    }


    // =========================
    // 次のプレイヤーへ
    // =========================

    currentPlayer =
        (
            currentPlayer + 1
        )
        %
        players.length;

//SE:プレイヤー切り替え
switchingSound.currentTime = 0;
switchingSound.play()

    // 所持品ボタンを再び有効化
    inventoryButton.disabled =
        false;


    const nextPlayer =
        players[currentPlayer];


    // =========================
    // 次のプレイヤーが
    // 仕事中か確認
    // =========================

    if (
        nextPlayer.jobTurnsRemaining > 0
    ) {

        nextPlayer.jobTurnsRemaining -=
            1;


        renderTurn();
        renderPlayers();
        centerCurrentPlayerOnMap();


        // =========================
        // 仕事終了
        // =========================

        if (
            nextPlayer.jobTurnsRemaining === 0
        ) {

            const reward =
                nextPlayer.jobReward;


            nextPlayer.money +=
                reward;


            nextPlayer.jobReward =
                0;


            renderPlayers();


            showEventPopup(
                "💰 バイト終了！",

                `${nextPlayer.name}は仕事を終えて<br>` +
                `<strong>${formatG(reward)}G</strong>を獲得！`,

                function () {

                    finishTurn(
                        nextPlayer
                    );

                }
            );


            return;

        }


        // =========================
        // まだ仕事中
        // =========================

        showEventPopup(
            "💼 仕事中",

            `${nextPlayer.name}は現在仕事中です。<br>` +
            `残り ${nextPlayer.jobTurnsRemaining} ターン`,

            function () {

                finishTurn(
                    nextPlayer
                );

            }
        );


        return;

    }


    // =========================
    // 通常プレイヤー
    // =========================

    renderTurn();
    renderPlayers();
    centerCurrentPlayerOnMap();

// =========================
// ボスマスにいる場合
// 再戦確認
// =========================

if (
    nextPlayer.position ===
    currentBossSquareId
) {

    showBossChallengePopup(
        nextPlayer,
        true
    );

    return;

}


    // ルーレット使用可能
    rouletteButton.disabled =
        false;

}

// =========================
// 現在プレイヤーをマップ中央へ
// =========================

function centerCurrentPlayerOnMap() {

    const mapArea =
        document.querySelector(
            ".game-screen .map-area"
        );

    const player =
        players[currentPlayer];

    if (!mapArea || !player) {
        return;
    }

    const playerNode =
        mapArea.querySelector(
            `.map-node[data-square-id="${player.position}"]`
        );

    if (!playerNode) {
        return;
    }

    const mapRect =
        mapArea.getBoundingClientRect();

    const playerRect =
        playerNode.getBoundingClientRect();

    const mapCenterX =
    mapRect.left +
    mapRect.width / 2;

const mapCenterY =
    mapRect.top +
    mapRect.height / 2;

const playerCenterX =
    playerRect.left +
    playerRect.width / 2;

const playerCenterY =
    playerRect.top +
    playerRect.height / 2;

const scrollAmountX =
    playerCenterX -
    mapCenterX;

const scrollAmountY =
    playerCenterY -
    mapCenterY;

mapArea.scrollTo({
    left: mapArea.scrollLeft + scrollAmountX,
    top: mapArea.scrollTop + scrollAmountY,
    behavior: "smooth"
});
}

// =========================
// 🎯 目的地をクリックしたら
// ボスマスを中央へ
// =========================

const destinationButton =
    document.querySelector(
        ".destination"
    );

if (destinationButton) {

    destinationButton.addEventListener(
        "click",
        function () {

            const mapArea =
                document.querySelector(
                    ".game-screen .map-area"
                );

            const bossNode =
                document.querySelector(
                    `.map-node[data-square-id="${currentBossSquareId}"]`
                );

            if (!mapArea || !bossNode) {
                return;
            }

            const mapRect =
                mapArea.getBoundingClientRect();

            const bossRect =
                bossNode.getBoundingClientRect();

            const mapCenterX =
                mapRect.left +
                mapRect.width / 2;

            const mapCenterY =
                mapRect.top +
                mapRect.height / 2;

            const bossCenterX =
                bossRect.left +
                bossRect.width / 2;

            const bossCenterY =
                bossRect.top +
                bossRect.height / 2;

            const scrollAmountX =
                bossCenterX -
                mapCenterX;

            const scrollAmountY =
                bossCenterY -
                mapCenterY;

            mapArea.scrollTo({

                left:
                    mapArea.scrollLeft +
                    scrollAmountX,

                top:
                    mapArea.scrollTop +
                    scrollAmountY,

                behavior:
                    "smooth"

            });

        }
    );

}

// =========================
// 初期表示
// =========================

renderMap();

renderPlayers();

renderTurn();


// =========================
// ゲーム開始時
// プレイヤー1をマップ中央へ
// =========================

setTimeout(function () {

    centerCurrentPlayerOnMap();

}, 10);


// =========================
// 報酬選択画面
// =========================

function showJobPopup(
    player,
    square,
    finishCallback
) {

    const jobPopup =
        document.getElementById(
            "jobPopup"
        );

    const jobMessage =
        document.getElementById(
            "jobMessage"
        );

    const job1Button =
        document.getElementById(
            "job1Button"
        );

    const job2Button =
        document.getElementById(
            "job2Button"
        );

    const job3Button =
        document.getElementById(
            "job3Button"
        );

    const jobNoneButton =
        document.getElementById(
            "jobNoneButton"
        );


    // =========================
    // メッセージ
    // =========================

    jobMessage.innerHTML =
        `💼 ${square.name}で働くことができます。<br><br>` +
        `${player.name}はどうしますか？`;


    // =========================
    // 表示
    // =========================

    jobPopup.style.display =
        "block";


    // =========================
    // 1ターン働く
    // =========================

    job1Button.onclick =
        function () {

            startJob(
                player,
                1,
                1000,
                finishCallback
            );

        };


    // =========================
    // 2ターン働く
    // =========================

    job2Button.onclick =
        function () {

            startJob(
                player,
                2,
                2500,
                finishCallback
            );

        };


    // =========================
    // 3ターン働く
    // =========================

    job3Button.onclick =
        function () {

            startJob(
                player,
                3,
                6000,
                finishCallback
            );

        };


    // =========================
    // 働かない
    // =========================

    jobNoneButton.onclick =
        function () {

            jobPopup.style.display =
                "none";


            finishCallback();

        };

}
function startJob(
    player,
    turns,
    reward,
    finishCallback
) {

    const jobPopup =
        document.getElementById(
            "jobPopup"
        );


    // =========================
    // バイト選択画面を閉じる
    // =========================

    jobPopup.style.display =
        "none";


    // =========================
    // 今のターンを
    // 1ターン目として消費
    // =========================

    player.jobTurnsRemaining =
        turns;


    player.jobReward =
        reward;


    // =========================
    // バイト開始
    // =========================

    showEventPopup(
        "💼 バイト開始",
        `${turns}ターン働きます！`,
        function () {

            // =========================
            // 1ターンだけの場合
            // =========================

            if (
                player.jobTurnsRemaining === 0
            ) {

                const rewardAmount =
                    player.jobReward;


                player.money +=
                    rewardAmount;


                player.jobReward =
                    0;


                renderPlayers();


                showEventPopup(
                    "💰 バイト報酬",
                    `${formatG(rewardAmount)}G 獲得！`,
                    function () {

                        finishCallback();

                    }
                );


                return;

            }


            // =========================
            // 2ターン以上の場合
            // =========================

            finishCallback();

        }
    );

}

}

// =========================
// 報酬選択画面
// =========================

function showRewardPopup(
    player,
    callback
) {

    const rewardPopup =
        document.getElementById(
            "rewardPopup"
        );

    const rewardChoices =
        document.getElementById(
            "rewardChoices"
        );


    // =========================
    // 報酬候補
    // =========================

    const rewards = [

        {
            text:
                "🔮 魔力 +10",

            type:
                "magicPower",

            value:
                10
        },

        {
            text:
                "💰 200G",

            type:
                "money",

            value:
                200
        }

    ];


    // =========================
    // 以前の選択肢を削除
    // =========================

    rewardChoices.innerHTML =
        "";


    // =========================
    // 報酬ボタンを作成
    // =========================

    rewards.forEach(
        function (reward) {

            const button =
                document.createElement(
                    "button"
                );


            // ボタンの標準動作を無効化
            button.type =
                "button";


            button.className =
                "reward-choice-button";


            button.textContent =
                reward.text;


            // =========================
            // 報酬を選択
            // =========================

            button.onclick =
                function () {

                    // =========================
                    // 魔力アップ
                    // =========================

                    if (
                        reward.type ===
                        "magicPower"
                    ) {

                        player.magicPower +=
                            reward.value;

                    }

                    console.log(
    "報酬反映:",
    player.name,
    "魔力:",
    player.magicPower,
    "G:",
    player.money
);

                    // =========================
                    // G獲得
                    // =========================

                    if (
                        reward.type ===
                        "money"
                    ) {

                        player.money +=
                            reward.value;

                    }


                  

                    // =========================
                    // 報酬画面を閉じる
                    // =========================

                    rewardPopup.style.display =
                        "none";


                    // =========================
                    // // 報酬画面を閉じて次へ
                    // // =========================

                rewardPopup.style.display = "none";

                if (callback) {
                    callback();
                    }

                };


            rewardChoices.appendChild(
                button
            );

        }
    );


    // =========================
    // 報酬画面を表示
    // =========================

    rewardPopup.style.display =
        "block";

}

// =========================
// 所持品画面
// =========================

function showInventoryPopup(
    player
) {

    const inventoryPopup =
        document.getElementById(
            "inventoryPopup"
        );

    const inventoryList =
        document.getElementById(
            "inventoryList"
        );


    // =========================
    // 所持品一覧を初期化
    // =========================

    inventoryList.innerHTML =
        "";


    // =========================
    // 所持品がない場合
    // =========================

    if (
        player.inventory.length === 0
    ) {

        inventoryList.innerHTML = `

            <div class="inventory-empty">

                所持品はありません。

            </div>

        `;

    }


    // =========================
    // 所持品を表示
    // =========================

    player.inventory.forEach(
        function (itemId, inventoryIndex) {

            const item =
                itemData.find(
                    function (data) {

                        return data.id ===
                            itemId;

                    }
                );


            if (!item) {

                return;

            }


            // =========================
            // アイテム項目
            // =========================

            const itemElement =
                document.createElement(
                    "div"
                );


            itemElement.className =
                "inventory-item";


            itemElement.innerHTML = `

                <div
                    class="inventory-item-name"
                >
                    ${item.name}
                </div>

                <div
                    class="inventory-item-effect"
                >
                    ${item.effect}
                </div>

                <button
                    class="inventory-item-use-button"
                    type="button"
                >
                    使う
                </button>

            `;


            // =========================
            // 「使う」ボタン
            // =========================

            const useButton =
                itemElement.querySelector(
                    ".inventory-item-use-button"
                );


            useButton.addEventListener(
                "click",
                function () {

                    // =========================
                    // 移動アイテムか確認
                    // =========================

                    if (
                        item.category !==
                        "move"
                    ) {

                        return;

                    }


                    // =========================
                    // サイコロの個数
                    // =========================

                    let diceCount =
                        1;


                    if (
                        item.id === 1
                    ) {

                        diceCount = 2;

                    }


                    if (
                        item.id === 2
                    ) {

                        diceCount = 3;

                    }


                    if (
                        item.id === 3
                    ) {

                        diceCount = 4;

                    }


                    // =========================
                    // アイテムを1個消費
                    // =========================

                    player.inventory.splice(
                        inventoryIndex,
                        1
                    );


                    // =========================
                    // 所持品画面を閉じる
                    // =========================

                    inventoryPopup.style.display =
                        "none";


                    // =========================
                    // ゲーム画面の移動処理へ接続
                    // =========================

                    if (
                        typeof window.useMoveItem !==
                        "function"
                    ) {

                        console.error(
                            "ゲーム画面の移動処理が準備されていません。"
                        );

                        return;

                    }


                    window.useMoveItem(
                        player,
                        diceCount
                    );

                }
            );


            inventoryList.appendChild(
                itemElement
            );

        }
    );


    // =========================
    // 所持品画面を表示
    // =========================

    inventoryPopup.style.display =
        "block";

}

// =========================
// 複数サイコロルーレット
// =========================

function showMultiDiceRoulette(
    diceCount,
    callback
) {

    const roulette =
        document.getElementById(
            "multiDiceRoulette"
        );

    const numbers =
        document.getElementById(
            "multiDiceNumbers"
        );

    const total =
        document.getElementById(
            "multiDiceTotal"
        );


    // =========================
    // 初期表示
    // =========================

    roulette.style.display =
        "block";

    numbers.innerHTML =
        "";

    total.textContent =
        "";


    // =========================
    // サイコロを作成
    // =========================

    const diceElements = [];

    for (
        let i = 0;
        i < diceCount;
        i++
    ) {

        const dice =
            document.createElement(
                "div"
            );

        dice.className =
            "multi-dice-number";

        dice.textContent =
            "1";

        numbers.appendChild(
            dice
        );

        diceElements.push(
            dice
        );

    }


    // =========================
    // ルーレット開始
    // =========================

    let count = 0;

    const interval =
        setInterval(
            function () {

                diceElements.forEach(
                    function (dice) {

                        const randomNumber =
                            Math.floor(
                                Math.random() * 6
                            ) + 1;

                        dice.textContent =
                            randomNumber;

                    }
                );


                count += 1;


                // =========================
                // ルーレット終了
                // =========================

                if (
                    count >= 15
                ) {

                    clearInterval(
                        interval
                    );


                    // =========================
                    // 最終結果
                    // =========================

                    let sum = 0;


                    diceElements.forEach(
                        function (dice) {

                            const result =
                                Math.floor(
                                    Math.random() * 6
                                ) + 1;

                            dice.textContent =
                                result;

                            sum +=
                                result;

                        }
                    );


                    // =========================
                    // 合計表示
                    // =========================

                    total.textContent =
                        `合計 ${sum}`;


                    // =========================
                    // 少し余韻
                    // =========================

                    setTimeout(
                        function () {

                            roulette.style.display =
                                "none";


                            if (
                                callback
                            ) {

                                callback(
                                    sum
                                );

                            }

                        },
                        1000
                    );

                }

            },
            80
        );

}

// =========================
// ゲーム中のページ離脱確認
// =========================

let gameStarted = false;

window.addEventListener("beforeunload", function (event) {

    if (!gameStarted) {
        return;
    }

    event.preventDefault();
    event.returnValue = true;
});

// =========================
// 所持品によるダメージ軽減
// =========================

function getMonsterDamage(
    player,
    damage
) {

    let reduction = 0;


    player.possessions.forEach(
        function (possessionId) {

            const possession =
                possessionData.find(
                    function (data) {

                        return data.id ===
                            possessionId;

                    }
                );


            if (!possession) {
                return;
            }


            if (
                possession.damageReduction
            ) {

                reduction +=
                    possession.damageReduction;

            }

        }
    );


    const finalDamage =
        Math.floor(
            damage *
            (1 - reduction)
        );


    return finalDamage;

}

// =========================
// 所持品画面
// 持っているだけで効果があるもの
// =========================

function showPossessionPopup(
    player
) {

    const possessionPopup =
        document.getElementById(
            "possessionPopup"
        );

    const possessionList =
        document.getElementById(
            "possessionList"
        );


    // =========================
    // 一覧を初期化
    // =========================

    possessionList.innerHTML =
        "";


    // =========================
    // 所持品がない場合
    // =========================

    if (
        player.possessions.length === 0
    ) {

        possessionList.innerHTML = `

            <div class="inventory-empty">
                所持品はありません。
            </div>

        `;

    }


    // =========================
    // 所持品を表示
    // =========================

    player.possessions.forEach(
        function (possessionId) {

            const possession =
                possessionData.find(
                    function (data) {

                        return data.id ===
                            possessionId;

                    }
                );


            if (!possession) {

                return;

            }


            const possessionElement =
                document.createElement(
                    "div"
                );


            possessionElement.className =
                "inventory-item";


            possessionElement.innerHTML = `

                <div
                    class="inventory-item-name"
                >
                     ${possession.name}
                </div>

                <div
                    class="inventory-item-effect"
                >
                    ${possession.effect}
                </div>

            `;


            possessionList.appendChild(
                possessionElement
            );

        }
    );


    // =========================
    // 表示
    // =========================

    possessionPopup.style.display =
        "block";

}

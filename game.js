console.log("★ 新しいgame.jsが読み込まれています ★");

// =========================
// 異世界冒険人生ゲーム
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
// UI・マップ用画像
// =========================
// マスの画像は mapData の type を基準に決定します。
// mapData 側の icon は画像が読み込めない場合の予備表示として残します。

const MAP_TYPE_ICON_PATHS = {
    start: "images/map-icons/start.png",
    money: "images/map-icons/gold.png",
    job: "images/map-icons/job.png",
    shop: "images/map-icons/shop.png",
    worst: "images/map-icons/worst.png",
    monster: "images/map-icons/monster.png",
    magic_shop: "images/map-icons/magic-shop.png",
    asset: "images/map-icons/asset.png",
    treasure: "images/map-icons/treasure.png"
};

const BOSS_MAP_ICON_PATH =
    "images/map-icons/boss.png";

const DICE_MOVEMENT_ARROW_PATH =
    "images/ui-icons/yajirushi.png";

const BOSS_ICON_HTML =
    `<img src="${BOSS_MAP_ICON_PATH}" alt="ボス" style="width:1.2em;height:1.2em;object-fit:contain;vertical-align:middle;">`;

const MAP_TYPE_ICON_FALLBACKS = {
    start: "🏕️",
    money: "💰",
    job: "💼",
    shop: "🏪",
    worst: "💀",
    monster: "👾",
    magic_shop: "🔮",
    asset: "🏰",
    treasure: "🎁"
};

const PLAYER_CHARACTER_IMAGES = [
    "images/characters/player-male.png",
    "images/characters/player-female.png"
];

// 4方向スプライトシートの配置
//
// 元画像は2×2配置です。
// 左上：正面
// 右上：背面
// 左下：左向き
// 右下：右向き
const PLAYER_DIRECTIONS = {
    down:  { row: 0, column: 0 },
    up:    { row: 0, column: 1 },
    left:  { row: 1, column: 0 },
    right: { row: 1, column: 1 }
};

function getPlayerCharacterImage(playerIndex) {

    return PLAYER_CHARACTER_IMAGES[
        playerIndex % PLAYER_CHARACTER_IMAGES.length
    ];

}

// プレイヤーの現在の向きを取得します。
// 未設定のプレイヤーは正面（down）を初期値にします。
function getPlayerDirection(player) {

    if (!player.direction || !PLAYER_DIRECTIONS[player.direction]) {
        player.direction = "down";
    }

    return player.direction;

}

// 4方向スプライトシートから、現在の向きだけを表示します。
function updatePlayerSprite(element, playerIndex, player) {

    if (!element || !player) {
        return;
    }

    const imagePath =
        getPlayerCharacterImage(playerIndex);

    const direction =
        getPlayerDirection(player);

    const spritePosition =
        PLAYER_DIRECTIONS[direction];

    element.style.backgroundImage =
        `url("${imagePath}")`;

    element.dataset.direction =
        direction;

    element.style.backgroundPosition =
        `${spritePosition.column === 0 ? "0%" : "100%"} ${spritePosition.row === 0 ? "0%" : "100%"}`;

}

// =========================
// HUD用プレイヤー顔アイコン
// =========================
// マップ上のプレイヤーとは別管理。
// 常に正面（down）のスプライトを表示します。
function updateHudPlayerAvatar(
    element,
    playerIndex
) {

    if (!element) {
        return;
    }

    element.style.backgroundImage =
        `url("${getPlayerCharacterImage(playerIndex)}")`;

    element.dataset.direction =
        "down";

    element.style.backgroundPosition =
        "16.7% 0%";

}

// =========================
// HUD用プレイヤー名サイズ
// =========================
// 6文字程度までは通常サイズ。
// 長い名前ほど段階的に小さくして枠内へ収めます。
function updateHudPlayerName(
    element,
    name
) {

    if (!element) {
        return;
    }

    const length =
        Array.from(name || "").length;

    let fontSize = 26;

    if (length > 6) {
        fontSize =
            Math.max(14, 26 - ((length - 6) * 2));
    }

    element.style.fontSize =
        `${fontSize}px`;

}

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
// お金マスのランダム報酬
// =========================

function getRandomGoldReward() {

    // MONEY_CONTENTSのcontents ID「1」を使用

    const setting =
        MONEY_CONTENTS[1];


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
// バイトデータ
// =========================


// バイト単価の割増設定

const JOB_WAGE_MAX_TURN = 8;

const JOB_WAGE_RATE_PER_TURN =
    0.10;

// 現在のバイト単価割増率を取得

function getJobWageRate(turn) {
    const wageTurn =
        Math.min(
            Math.max(turn - 1, 0),
            JOB_WAGE_MAX_TURN
        );

    return wageTurn * JOB_WAGE_RATE_PER_TURN;
}

// 現在のバイト単価を取得

function getCurrentJobWage(
    baseWage,
    turn
) {

    const wageRate =
        getJobWageRate(
            turn
        );


    return Math.floor(
        baseWage *
        (1 + wageRate)
    );
}


// バイトIDからデータを取得

function getJobData(jobId) {

    return JOB_CONTENTS[
        jobId
    ];

}


// =========================
// ボス管理
// =========================

let currentBossSquareId = null;
let previousBossSquareId = null;

// 現在のボスID
let currentBossId = 1;

// 現在のボスHP
let currentBossHP =
    BOSS_CONTENTS[
        currentBossId
    ].hp;

let bossFirstPlayer = null;

let bossRewardGiven = false;

// ボス報酬設定

const BOSS_FIRST_REWARD =
    10000;

const BOSS_DAMAGE_MULTIPLIER =
    3;

const BOSS_DEFEAT_REWARD =
    10000;



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

    const popup =
        document.getElementById(
            "eventPopup"
        );

    // =========================
    // ボス決定ポップアップ専用表示
    // =========================

    if (popup) {
        popup.classList.add(
            "boss-destination-popup"
        );
    }

    // =========================
    // ボスマスを中央へ移動
    // =========================
    // ポップアップ表示前に、ボスを
    // マップの中央へきちんと合わせます。
    // =========================

    setTimeout(function () {

        const mapArea =
            document.querySelector(
                ".game-screen .map-area"
            );

        const bossNode =
            document.querySelector(
                `.map-node[data-square-id="${boss.id}"]`
            );

        if (!mapArea || !bossNode) {
            return;
        }

        const bossCenterX =
            bossNode.offsetLeft +
            bossNode.offsetWidth / 2;

        const bossCenterY =
            bossNode.offsetTop +
            bossNode.offsetHeight / 2;

        const targetScrollLeft =
            bossCenterX -
            mapArea.clientWidth / 2;

        const targetScrollTop =
            bossCenterY -
            mapArea.clientHeight / 2;

        const maxScrollLeft =
            Math.max(
                0,
                mapArea.scrollWidth -
                mapArea.clientWidth
            );

        const maxScrollTop =
            Math.max(
                0,
                mapArea.scrollHeight -
                mapArea.clientHeight
            );

        const finalScrollLeft =
            Math.max(
                0,
                Math.min(
                    targetScrollLeft,
                    maxScrollLeft
                )
            );

        const finalScrollTop =
            Math.max(
                0,
                Math.min(
                    targetScrollTop,
                    maxScrollTop
                )
            );

        mapArea.scrollTo({
            left: finalScrollLeft,
            top: finalScrollTop,
            behavior: "smooth"
        });

    }, 50);

    // =========================
    // ポップアップ表示
    // =========================
    // showEventPopup() のタイトルは
    // textContentで処理されるため、
    // HTMLは本文側にだけ入れます。
    // =========================

    setTimeout(function () {

        showEventPopup(
            "次の目的地が決定！",
            `
            <div class="boss-destination-image-wrap">
                <img
                    src="${BOSS_MAP_ICON_PATH}"
                    alt="ボス"
                    class="boss-destination-popup-icon"
                >
            </div>

            <div class="boss-destination-line">
                ${BOSS_CONTENTS[currentBossId].name}
            </div>

            <div class="boss-destination-message">
                がこのマスで待ち受けている！
            </div>
            `,
            function () {

                // =========================
                // 専用クラスを解除
                // =========================

                if (popup) {
                    popup.classList.remove(
                        "boss-destination-popup"
                    );
                }

                // =========================
                // ボス撃破後など
                // =========================

                if (callback) {
                    callback();
                    return;
                }

  

            }
        );

    }, 450);

}


// =========================
// ゲーム開始時の読み込み画面
// =========================

const GAME_LOADING_MIN_TIME = 1200;

const GAME_LOADING_ASSETS = [
    "images/map2.png",
    "images/map-icons/start.png",
    "images/map-icons/gold.png",
    "images/map-icons/job.png",
    "images/map-icons/shop.png",
    "images/map-icons/worst.png",
    "images/map-icons/monster.png",
    "images/map-icons/magic-shop.png",
    "images/map-icons/asset.png",
    "images/map-icons/treasure.png",
    "images/map-icons/boss.png",
    "images/characters/player-male.png",
    "images/characters/player-female.png",
    "images/ui-icons/gold.png",
    "images/ui-icons/mana.png",
    "images/map-icons/boss.png",
    "images/ui-icons/dice.png",
    "images/ui-icons/item.png",
    "images/ui-icons/magic.png",
    "images/ui-icons/settings.png",
    "images/ui-icons/yajirushi.png"
];

function preloadGameImage(path) {

    return new Promise(function (resolve) {

        const image =
            new Image();

        image.onload =
            function () {
                resolve();
            };

        image.onerror =
            function () {
                // 画像がなくてもゲーム開始は止めない
                resolve();
            };

        image.src = path;

    });
}

function showGameLoadingScreen() {

    const gameContainer =
        document.querySelector(
            ".game-container"
        );

    if (!gameContainer) {
        return;
    }

    gameContainer.innerHTML = `

        <style>
            @keyframes gameLoadingBar {
                0% {
                    transform: translateX(-120%);
                }
                100% {
                    transform: translateX(280%);
                }
            }
        </style>

        <div
            class="game-loading-screen"
            style="
                width:100%;
                height:100dvh;
                min-height:100dvh;
                display:flex;
                flex-direction:column;
                align-items:center;
                justify-content:center;
                box-sizing:border-box;
                padding:30px;
                background:
                    radial-gradient(
                        circle at 50% 35%,
                        #344b72 0%,
                        #18233d 50%,
                        #071b3f 100%
                    );
                color:white;
                text-align:center;
            "
        >

            <div
                style="
                    font-size:clamp(28px, 6vw, 52px);
                    font-weight:900;
                    margin-bottom:24px;
                    letter-spacing:0.08em;
                "
            >
                NO MONEY, NO LIFE
            </div>

            <div
                style="
                    font-size:clamp(18px, 3vw, 28px);
                    font-weight:bold;
                    margin-bottom:24px;
                "
            >
                🗺️ マップを読み込んでいます…
            </div>

            <div
                style="
                    width:min(70vw, 420px);
                    height:12px;
                    overflow:hidden;
                    border-radius:999px;
                    background:rgba(255,255,255,0.18);
                    border:1px solid rgba(255,255,255,0.3);
                "
            >
                <div
                    style="
                        width:45%;
                        height:100%;
                        border-radius:999px;
                        background:linear-gradient(90deg,#48bcff,#d4af37);
                        animation:gameLoadingBar 1.1s ease-in-out infinite;
                    "
                ></div>
            </div>

        </div>

    `;
}

function waitForGameAssets() {

    const startTime =
        performance.now();

    const assetPromise =
        Promise.all(
            GAME_LOADING_ASSETS.map(
                preloadGameImage
            )
        );

    const minimumTimePromise =
        new Promise(function (resolve) {

            setTimeout(
                resolve,
                GAME_LOADING_MIN_TIME
            );

        });

    return Promise.all([
        assetPromise,
        minimumTimePromise
    ]).then(function () {

        // ブラウザに読み込み画面を描画させてから切り替える
        return new Promise(function (resolve) {

            requestAnimationFrame(function () {
                requestAnimationFrame(resolve);
            });

        });

    });
}

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
    money: 1000,
    magicPower: 100,
    bossDamage: 0,
    position: 0,
    color: playerColors[index],
    inventory: [],
    assets: [],
    magic: [1],

    // バイト関連
    jobTurnsRemaining: 0,
    jobReward: 0
});

// =========================
// 初期アイテム
// =========================

players[index].inventory = [1, 8];


// =========================
// 初期パッシブアイテム
// =========================

addItems(
    players[index],
    [9, 11],
    1
);


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

// 冒険BGM開始
setupAdventureBGM();

// 最初のボスを決定
selectBossSquare();

// 開始音
startSound.currentTime = 0;
startSound.play();

// =========================
// 読み込み画面を表示
// =========================

showGameLoadingScreen();

// マップ画像などを先に読み込み、
// 最低1.2秒は読み込み画面を表示する
waitForGameAssets().then(function () {

    showGameScreen(
        players,
        maxTurns
    );

    // ボス決定演出
    setTimeout(function () {
        showBossDestinationPopup();
    }, 500);

});
            
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
                 上部固定HUD
            ========================= -->

            <div class="game-hud">

                <div
                    id="currentPlayerInfo"
                    class="hud-box hud-player"
                >
                    <div
                        id="hudPlayerAvatar"
                        class="hud-player-avatar hud-avatar-face"
                        aria-label="プレイヤー"
                    ></div>
                    <span
                        id="hudPlayerName"
                        class="hud-player-name"
                    ></span>
                </div>

                <div class="hud-box hud-gold">
                    <img
                        class="hud-icon"
                        src="images/ui-icons/gold.png"
                        alt="ゴールド"
                        onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-flex';"
                    >
                    <span class="hud-icon-fallback">🪙</span>
                    <span id="hudGoldValue" class="hud-value">0G</span>
                </div>

                <div class="hud-box hud-magic">
                    <img
                        class="hud-icon"
                        src="images/ui-icons/mana.png"
                        alt="魔力"
                        onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-flex';"
                    >
                    <span class="hud-icon-fallback">🔮</span>
                    <span id="hudMagicValue" class="hud-value">0</span>
                </div>

                <div
                    id="destinationInfo"
                    class="hud-box hud-destination destination"
                    title="ボスの位置へ移動"
                >
                    <img
                        class="hud-icon hud-destination-icon"
                        src="${BOSS_MAP_ICON_PATH}"
                        alt="ボス"
                        onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-flex';"
                    >
                    <span class="hud-icon-fallback"></span>
                    <span class="hud-destination-label">目的地まで あと</span>
                    <strong id="hudDestinationValue" class="hud-destination-value">0</strong>
                    <span class="hud-destination-label">マス</span>
                </div>

                <div
                    id="turnDisplay"
                    class="hud-box hud-turn"
                >
                    Tern 1/10
                </div>

                <!-- 既存ロジック互換用。画面には表示しません。 -->
                <div
                    id="remainingStepsInfo"
                    class="remaining-steps-info"
                ></div>

            </div>

            <!-- =========================
                 マップ
            ========================= -->

            <div class="map-area">
                <div id="mapBoard" class="map-board"></div>
            </div>

            <!-- =========================
                 左側固定アクションメニュー
            ========================= -->

            <div class="roulette-area action-menu">

                <div id="rouletteNumber" class="roulette-number-hidden"></div>

                <button id="rouletteButton" class="action-menu-button action-menu-dice" type="button">
                    <img src="images/ui-icons/dice.png" alt="" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                    <span class="action-menu-fallback">🎲</span>
                    <span class="action-menu-label">サイコロ</span>
                </button>

                <button id="inventoryButton" class="action-menu-button" type="button">
                    <img src="images/ui-icons/item.png" alt="" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                    <span class="action-menu-fallback">🎒</span>
                    <span class="action-menu-label">アイテム</span>
                </button>

                <button id="magicButton" class="action-menu-button" type="button">
                    <img src="images/ui-icons/magic.png" alt="" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                    <span class="action-menu-fallback">🪄</span>
                    <span class="action-menu-label">魔法</span>
                </button>

                <button id="otherButton" class="action-menu-button" type="button">
                    <img src="images/ui-icons/settings.png" alt="" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                    <span class="action-menu-fallback">⚙️</span>
                    <span class="action-menu-label">その他</span>
                </button>

<!-- =========================
     サイコロ移動中のみ表示
     出発地点へ戻るボタン
========================= -->

<button
    id="diceMovementReturnButton"
    class="action-menu-button dice-movement-return-button"
    type="button"
    style="display: none;"
>
    <img
        src="images/ui-icons/back.png"
        alt=""
        onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
    >

    <span class="action-menu-fallback">🔙</span>

    <span class="action-menu-label">
        現在地に戻る
    </span>
</button>

            </div>

            <!-- 既存処理との互換用。新UIでは常時表示しません。 -->
            <div id="playerStatus" class="player-status"></div>
            <div id="choiceArea" class="choice-area"></div>

            <!-- =========================
                 その他メニュー
            ========================= -->

            <div id="otherMenuPopup" class="other-menu-popup">
                <div class="other-menu-title">その他</div>
                <button id="otherAssetButton" type="button" class="other-menu-item">🏰 資産を見る</button>
                <button id="otherSoundButton" type="button" class="other-menu-item">⚙️ サウンド設定</button>
                <button id="otherMenuCloseButton" type="button" class="other-menu-close">閉じる</button>
            </div>

            <!-- =========================
                 資産一覧
            ========================= -->

            <div id="assetPopup" class="inventory-popup">
                <div class="inventory-popup-title">🏰 資産一覧</div>
                <div id="assetList" class="inventory-list"></div>
                <button id="assetCloseButton" class="inventory-close-button" type="button">閉じる</button>
            </div>

            <!-- =========================
                 資産購入
            ========================= -->

            <div id="assetPurchasePopup" class="inventory-popup">
                <div class="inventory-popup-title">🏰 資産購入</div>
                <div id="assetPurchaseList" class="inventory-list"></div>
                <button id="assetPurchaseCloseButton" class="inventory-close-button" type="button">閉じる</button>
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
    // サイコロ移動状態
    // =========================
    // 今回のサイコロ移動中に通ったマスを記録します。
    // 直前に通った道を逆方向へ戻った場合は、
    // その1マス分だけ残り歩数を回復します。
    // =========================

    let diceMovementState = {

        active: false,

        player: null,

        startPosition: null,

        history: [],

        // サイコロを振った瞬間の総歩数
        // 「現在地に戻る」でここまで戻します。
        totalSteps: 0,

         // 強調マスをタップして
        // 自動移動している最中かどうか
        autoMoving: false,

        // =========================
        // サイコロを振った瞬間に確定した停止可能マスと、その経路
        // =========================
        
        reachablePaths: new Map()

    };

    // =========================
    // サイコロ移動の強調マス用
    // クリックイベント管理
    // =========================
    // 同じマスに古いクリックイベントが
    // 蓄積しないように、登録したイベントを
    // 自分で解除できるよう管理します。
    const diceReachableClickHandlers =
        new Map();

    // =========================
// サイコロ移動中の残り歩数UI
// =========================
//
// 現在ターンのプレイヤーだけに表示します。
//
// UIの見た目はCSS側へ分離し、
// ここでは
// ・表示
// ・数字の更新
// ・非表示
// だけを担当します。
// =========================

// =========================================================
// サイコロ移動中の残り歩数UI
// =========================================================
//
// 現在ターンのプレイヤーの頭上に、
// 「🎲 3」のような小さな表示を出します。
//
// ・プレイヤーの子要素として生成
// ・プレイヤーと一緒に移動
// ・移動矢印より前面に表示
// ・見た目はCSS側で管理
//
// 今後UIを変更するときは、基本的に
// この関数とCSSだけを修正すればOKです。
// =========================================================


// =========================================================
// 残り歩数カウンターを取得 / 作成
// =========================================================

function ensureDiceMovementCounter(
    playerPiece
) {

    if (!playerPiece) {
        return null;
    }


    let counter =
        playerPiece.querySelector(
            ".dice-movement-counter"
        );


    if (!counter) {

        counter =
            document.createElement(
                "div"
            );

        counter.className =
            "dice-movement-counter";


        // =========================
        // サイコロアイコン
        // =========================

        const diceIcon =
            document.createElement(
                "img"
            );

        diceIcon.className =
            "dice-movement-counter-icon";

        diceIcon.src =
            "images/ui-icons/dice.png";

        diceIcon.alt =
            "";

        diceIcon.draggable =
            false;


        diceIcon.addEventListener(
            "error",
            function () {

                diceIcon.remove();

            },
            {
                once: true
            }
        );


        // =========================
        // 残り歩数
        // =========================

        const value =
            document.createElement(
                "span"
            );

        value.className =
            "dice-movement-counter-value";


        // =========================
        // カウンターへ追加
        // =========================

        counter.appendChild(
            diceIcon
        );

        counter.appendChild(
            value
        );


        playerPiece.appendChild(
            counter
        );

    }


    return counter;

}


// =========================================================
// 残り歩数を表示・更新
// =========================================================

function showDiceMovementCounter() {

    const player =
        players[currentPlayer];


    if (
        !player ||
        !diceMovementState.active ||
        remainingSteps <= 0
    ) {

        hideDiceMovementCounter();

        return;

    }


    // =========================
    // 現在プレイヤーのプレイヤー画像
    // =========================

    const playerPiece =
        document.querySelector(
            `.map-node[data-square-id="${player.position}"] .player-piece[data-player-index="${currentPlayer}"]`
        );


    if (!playerPiece) {
        return;
    }


    const counter =
        ensureDiceMovementCounter(
            playerPiece
        );


    if (!counter) {
        return;
    }


    const value =
        counter.querySelector(
            ".dice-movement-counter-value"
        );


    if (!value) {
        return;
    }


    value.textContent =
        String(remainingSteps);

}


// =========================================================
// 残り歩数を更新
// =========================================================

function updateDiceMovementCounter() {

    showDiceMovementCounter();

}


// =========================================================
// 残り歩数UIを消す
// =========================================================

function hideDiceMovementCounter() {

    document
        .querySelectorAll(
            ".dice-movement-counter"
        )
        .forEach(
            function (counter) {

                counter.remove();

            }
        );

}


 // =========================
// 配当サイクル
// =========================

const dividendCycle = 3;

    // =========================
    // アイテムの移動アイテム使用処理
    // showGameScreen内の移動関数へ接続する
    // =========================

    window.useMoveItem = function (
        player,
        diceCount
    ) {

        // =========================
        // サイコロボタン、アイテムボタン無効化
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
    MAGIC_CONTENTS[
        magicId
    ];

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
    MAGIC_CONTENTS[
        magicId
    ];


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
            ${magic.name}
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
    // その他メニュー
    // =========================

    const otherButton =
        document.getElementById(
            "otherButton"
        );

    const otherMenuPopup =
        document.getElementById(
            "otherMenuPopup"
        );

    const otherMenuCloseButton =
        document.getElementById(
            "otherMenuCloseButton"
        );

    const otherAssetButton =
        document.getElementById(
            "otherAssetButton"
        );

    const otherSoundButton =
        document.getElementById(
            "otherSoundButton"
        );

    if (otherButton) {

        otherButton.addEventListener(
            "click",
            function () {

                if (otherMenuPopup) {
                    otherMenuPopup.style.display = "block";
                }

                buttonSound.currentTime = 0;
                buttonSound.play();

            }
        );

    }

    if (otherMenuCloseButton) {

        otherMenuCloseButton.addEventListener(
            "click",
            function () {

                if (otherMenuPopup) {
                    otherMenuPopup.style.display = "none";
                }

            }
        );

    }

    if (otherAssetButton) {

        otherAssetButton.addEventListener(
            "click",
            function () {

                if (otherMenuPopup) {
                    otherMenuPopup.style.display = "none";
                }

                showAssetPopup(
                    players[currentPlayer]
                );

            }
        );

    }

    if (otherSoundButton) {

        otherSoundButton.addEventListener(
            "click",
            function () {

                if (otherMenuPopup) {
                    otherMenuPopup.style.display = "none";
                }

                const soundPopup =
                    document.getElementById(
                        "soundSettingsPopup"
                    );

                if (soundPopup) {
                    soundPopup.style.display = "block";
                }

            }
        );

    }

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
                node.dataset.mapType = square.type;

                node.style.left =
                    `${square.x}%`;


                node.style.top =
                    `${square.y}%`;


// =========================
// マスのアイコン
// =========================
// マスの画像は type で決定します。
// ボスだけは monster type の中から選ばれた
// currentBossSquareId を優先して表示します。

const squareIcon =
    document.createElement(
        "div"
    );

squareIcon.className =
    "square-icon";

const isBossSquare =
    square.id === currentBossSquareId;

const iconPath =
    isBossSquare
        ? BOSS_MAP_ICON_PATH
        : MAP_TYPE_ICON_PATHS[square.type];

const fallbackIcon =
    isBossSquare
        ? "👹"
        : (MAP_TYPE_ICON_FALLBACKS[square.type] || square.icon || "❔");

if (isBossSquare) {

    node.classList.add(
        "boss-node"
    );

}

if (iconPath) {

    const iconImage =
        document.createElement(
            "img"
        );

    iconImage.className =
        "map-space-icon";

    iconImage.src =
        iconPath;

    iconImage.alt =
        square.name || fallbackIcon;

    iconImage.draggable = false;

    iconImage.addEventListener(
        "error",
        function () {

            iconImage.remove();
            squareIcon.textContent =
                fallbackIcon;

        },
        { once: true }
    );

    squareIcon.appendChild(
        iconImage
    );

} else {

    squareIcon.textContent =
        fallbackIcon;

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
                                "div"
                            );


                        piece.className =
    "player-piece player-sprite";


//現在プレイヤー番号を保持
piece.dataset.playerIndex =
    players.indexOf(player);


piece.setAttribute(
    "aria-label",
    player.name
);

                        piece.draggable = false;

                        updatePlayerSprite(
                            piece,
                            players.indexOf(player),
                            player
                        );


                        // =========================
                        // 同じマスにいる人数に応じて中央基準で配置
                        // =========================
                        // 1人なら完全中央。
                        // 複数人の場合だけ左右対称に分散します。
                        const playerCount =
                            playersHere.length;

                        let offset = 0;

                        if (playerCount > 1) {

                            const spacing = 46;

                            offset =
                                (index - ((playerCount - 1) / 2)) * spacing;

                        }

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


// =========================
// サイコロ移動中の残り歩数
// =========================
//
// 現在ターンのプレイヤーだけに表示します。
// renderMap() は移動のたびにプレイヤーを
// 作り直すため、ここでもUIを復元します。
//

if (
    players.indexOf(player) ===
        currentPlayer &&
    diceMovementState.active &&
    remainingSteps > 0
) {

    ensureDiceMovementCounter(
        piece
    );

}

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

                    return ASSET_CONTENTS[
                     assetId
                    ];

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
            ASSET_CONTENTS[
                assetId
            ];


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

if (!player.assets.includes(assetId)) {
    player.assets.push(assetId);
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
// 現在プレイヤーを画面内へ自動スクロール
// =========================

const currentPlayerCard =
    status.querySelector(
        ".current-player"
    );

if (currentPlayerCard) {

    currentPlayerCard.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
    });

}

    // =========================
    // サウンド設定ボタン
    // =========================

    status.insertAdjacentHTML(
        "beforeend",
        `
        <button
            id="soundSettingsButton"
            type="button"
            class="sound-settings-button"
        >
            ⚙️
        </button>
        `
    );

// サウンド設定を開く

document.getElementById(
    "soundSettingsButton"
).onclick =
    function () {

        const popup =
            document.getElementById(
                "soundSettingsPopup"
            );

        popup.style.display =
            "block";

    };

// サウンド設定を閉じる

document.getElementById(
    "soundSettingsCloseButton"
).onclick =

    function () {

        const popup =
            document.getElementById(
                "soundSettingsPopup"
            );

        popup.style.display =
            "none";

    };

// BGM音量スライダー

const bgmVolumeSlider =
    document.getElementById(
        "bgmVolumeSlider"
    );

const bgmVolumeValue =
    document.getElementById(
        "bgmVolumeValue"
    );

bgmVolumeSlider.oninput =
    function () {

        const volume =
            Number(
                this.value
            ) / 100;

        if (
            location.protocol ===
            "file:"
        ) {

            adventureBGM.volume =
                volume;

        } else if (
            adventureBGMGain
        ) {

            adventureBGMGain.gain.value =
                volume;

        }

        bgmVolumeValue.textContent =
            `${this.value}%`;

    };

// SE音量スライダー

const seVolumeSlider =
    document.getElementById(
        "seVolumeSlider"
    );

const seVolumeValue =
    document.getElementById(
        "seVolumeValue"
    );

seVolumeSlider.oninput =
    function () {

        const volume =
            Number(
                this.value
            ) / 100;

        diceSound.volume =
            volume;

        startSound.volume =
            volume;

        buttonSound.volume =
            volume;

        switchingSound.volume =
            volume;

        seVolumeValue.textContent =
            `${this.value}%`;

    };


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

    const player =
        players[currentPlayer];

    if (!player) {
        return;
    }


    // =========================
    // TURN
    // =========================

    if (turnDisplay) {

        // 完成イメージに合わせて「Tern」表記を維持
        turnDisplay.textContent =
            `Tern ${currentTurn}/${maxTurns}`;

    }


    // =========================
    // プレイヤー名・キャラクター
    // =========================

    if (currentPlayerInfo) {

        currentPlayerInfo.innerHTML = `
            <div
                id="hudPlayerAvatar"
                class="hud-player-avatar hud-avatar-face"
                aria-label="${player.name}"
            ></div>
            <span
                id="hudPlayerName"
                class="hud-player-name"
            >${player.name}</span>
        `;

        const hudPlayerAvatar =
            document.getElementById(
                "hudPlayerAvatar"
            );

        const hudPlayerName =
            document.getElementById(
                "hudPlayerName"
            );

        updateHudPlayerAvatar(
            hudPlayerAvatar,
            currentPlayer
        );

        updateHudPlayerName(
            hudPlayerName,
            player.name
        );

        // =========================
        // プレイヤー顔アイコンをタップ
        // 現在プレイヤーの位置へカメラを戻す
        // =========================

        if (hudPlayerAvatar) {

            hudPlayerAvatar.onclick =
                function () {

                    centerCurrentPlayerOnMap();

                };

        }

        // =========================
        // プレイヤー名をタップ
        // 現在プレイヤーの位置へカメラを移動
        // =========================

        if (hudPlayerName) {

            hudPlayerName.onclick =
                function () {

                    centerCurrentPlayerOnMap();

                };

        }

    }


    // =========================
    // ゴールド
    // =========================

    const hudGoldValue =
        document.getElementById(
            "hudGoldValue"
        );

    if (hudGoldValue) {

        hudGoldValue.textContent =
            `${formatG(player.money)}G`;

    }


    // =========================
    // 魔力
    // =========================

    const hudMagicValue =
        document.getElementById(
            "hudMagicValue"
        );

    if (hudMagicValue) {

        hudMagicValue.textContent =
            formatG(player.magicPower);

    }


    // =========================
    // 既存ロジック互換用：残りマス
    // =========================

    if (remainingStepsInfo) {

        remainingStepsInfo.textContent =
            `🎲 残${remainingSteps}マス`;

    }
// =========================
// サイコロ移動中の残り歩数UI
// =========================

updateDiceMovementCounter();


    // =========================
    // ボスマスまでの最短距離
    // =========================

    const destinationInfo =
        document.getElementById(
            "destinationInfo"
        );

    const hudDestinationValue =
        document.getElementById(
            "hudDestinationValue"
        );

    const bossDistance =
        getShortestDistanceToBoss(
            player.position
        );

    if (hudDestinationValue) {

        hudDestinationValue.textContent =
            bossDistance;

    }

    if (destinationInfo) {

        destinationInfo.dataset.distance =
            String(bossDistance);

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

        const currentSquare =
            mapData.find(
                function (square) {
                    return square.id ===
                        player.position;
                }
            );

        const nextSquare =
            mapData.find(
                function (square) {
                    return square.id ===
                        nextPosition;
                }
            );

        // =========================
        // 移動方向を更新
        // =========================
        if (currentSquare && nextSquare) {

            const dx =
                nextSquare.x - currentSquare.x;

            const dy =
                nextSquare.y - currentSquare.y;

            if (Math.abs(dx) > Math.abs(dy)) {

                player.direction =
                    dx > 0 ? "right" : "left";

            } else if (dy !== 0) {

                player.direction =
                    dy > 0 ? "down" : "up";

            }

        }

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
// サイコロ移動用
// 止まれるマスを取得
// =========================
// 今回のサイコロ移動では、
// 「来た道を戻る」ことが可能です。
// そのため通常の停止可能マス検索とは分けます。
// =========================

function clearDiceReachableClickHandlers() {

    diceReachableClickHandlers.forEach(
        function (handler, node) {

            node.removeEventListener(
                "click",
                handler
            );

        }
    );

    diceReachableClickHandlers.clear();

}

// =========================
// サイコロ移動中の
// 止まれるマスを強調表示
// =========================
//
// 通常サイコロでも複数サイコロアイテムでも、
// 「残り歩数をすべて使った場合に止まれるマス」
// を同じロジックで求めます。
//
// 強調されたマスはタップ可能です。
// タップされた場合は、そのマスに対応する
// path を使って1マスずつ自動移動します。
// =========================

function highlightDiceReachableSquares(
    player,
    steps
) {

    clearDiceReachableClickHandlers();
    clearReachableHighlights();


    if (
        !player ||
        !diceMovementState.active ||
        diceMovementState.player !== player ||
        diceMovementState.autoMoving
    ) {

        return;

    }


    // =========================
    // サイコロを振った瞬間に
    // 確定した停止候補を使用
    // =========================
    //
    // ここでは現在地から再計算しません。
    //
    // これが今回の修正の重要ポイントです。
    //
    // 例えば「3」が出た場合、
    // 最初に確定した3歩先の候補だけを
    // 最後まで基準として使用します。
    //
    const fixedReachable =
        diceMovementState.reachablePaths;


    if (
        !(fixedReachable instanceof Map)
    ) {

        return;

    }


    const history =
        diceMovementState.history || [];


    // =========================
    // 現在までの移動履歴が
    // 候補経路の先頭と一致しているか
    // =========================
    //
    // 例：
    //
    // 候補経路
    // [A, B, C, D]
    //
    // 現在の履歴
    // [A, B]
    //
    // → 一致しているので候補として残す
    //
    // 別ルート
    // [A, E, F, G]
    //
    // → A,Bとは一致しないので消す
    //
    function isHistoryPrefixOfPath(
        currentHistory,
        path
    ) {

        if (
            currentHistory.length >
            path.length
        ) {

            return false;

        }


        for (
            let i = 0;
            i < currentHistory.length;
            i++
        ) {

            if (
                currentHistory[i] !==
                path[i]
            ) {

                return false;

            }

        }


        return true;

    }


    // =========================
    // 現在の進行ルートに
    // 一致する候補だけ残す
    // =========================

    const reachable =
        new Map();


    fixedReachable.forEach(
        function (path, squareId) {

            if (
                !Array.isArray(path) ||
                !isHistoryPrefixOfPath(
                    history,
                    path
                )
            ) {

                return;

            }


            reachable.set(
                squareId,
                path
            );

        }
    );


    // =========================
    // 停止候補を強調表示
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


            node.style.boxShadow =
                "0 0 0 5px rgba(255,215,0,0.95), 0 0 25px rgba(255,215,0,0.9)";

            node.style.cursor =
                "pointer";


            // =========================
            // 強調された停止マスをタップ
            // =========================

            const clickHandler =
                function () {

                    if (
                        !diceMovementState.active ||
                        diceMovementState.autoMoving ||
                        diceMovementState.player !== player
                    ) {

                        return;

                    }


                    // =========================
                    // 最終確認
                    // =========================
                    //
                    // 現在の移動履歴と
                    // 選択した経路が一致しているか確認します。
                    //

                    if (
                        !isHistoryPrefixOfPath(
                            diceMovementState.history,
                            path
                        )
                    ) {

                        return;

                    }


                    // =========================
                    // クリックイベント解除
                    // =========================

                    clearDiceReachableClickHandlers();


                    // =========================
                    // 矢印・強調表示を解除
                    // =========================

                    clearDiceMovementArrows();

                    clearReachableHighlights();


                    // =========================
                    // 選択した停止マスまで
                    // 自動移動
                    // =========================

                    moveDicePlayerToSquare(
                        player,
                        path
                    );

                };


            node.addEventListener(
                "click",
                clickHandler
            );


            diceReachableClickHandlers.set(
                node,
                clickHandler
            );

        }
    );


    return reachable;

}


// =========================
// 指定マス以内で
// 止まれるマスを取得
// =========================

function getReachableStopSquaresWithin(
    startPosition,
    maxSteps
) {

    const results =
        new Map();


    // =========================
    // 1〜maxStepsまで調べる
    // =========================

    for (
        let steps = 1;
        steps <= maxSteps;
        steps++
    ) {

        const reachable =
            getReachableStopSquares(
                startPosition,
                steps
            );


        reachable.forEach(
            function (path, squareId) {

                if (
                    !results.has(
                        squareId
                    )
                ) {

                    results.set(
                        squareId,
                        path
                    );

                }

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

    clearDiceReachableClickHandlers();

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
// 6マス以内の
// 停止可能マスを強調表示
// =========================

function highlightReachableSquaresWithin(
    player,
    maxSteps
) {

    const reachable =
        getReachableStopSquaresWithin(
            player.position,
            maxSteps
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
            // タップ
            // =========================

            node.addEventListener(
                "click",
                function () {

                    // 強調表示を解除

                    clearReachableHighlights();


                    // 分岐矢印を削除

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
// サイコロ移動で選択した停止マスまで
// 1マスずつ自動移動
// =========================
//
// 通常サイコロと複数サイコロアイテムは
// どちらも movePlayer() から同じ
// diceMovementState に入るため、
// この共通処理を利用します。
//
// どんぴ車で使っている movePlayerToSquare() とは
// 別関数にして、既存のどんぴ車の挙動を
// 変更しないようにします。
// =========================

function moveDicePlayerToSquare(
    player,
    path
) {

    if (
        !diceMovementState.active ||
        diceMovementState.player !== player ||
        !Array.isArray(path)
    ) {

        return;

    }


    const history =
        diceMovementState.history || [];


    // =========================
    // 現在の移動履歴と
    // 選択した経路が一致しているか確認
    // =========================

    if (
        history.length === 0 ||
        history[history.length - 1] !==
            player.position
    ) {

        return;

    }


    if (
        history.length >
        path.length
    ) {

        return;

    }


    for (
        let i = 0;
        i < history.length;
        i++
    ) {

        if (
            history[i] !==
            path[i]
        ) {

            return;

        }

    }


    // =========================
    // 自動移動開始
    // =========================

    diceMovementState.autoMoving =
        true;


    // =========================
    // 現在地より後ろだけを取得
    // =========================
    //
    // 例：
    //
    // 元のpath
    // [A, B, C, D]
    //
    // 現在地
    // B
    //
    // ↓
    //
    // [B, C, D]
    //
    const remainingPath =
        path.slice(
            history.length - 1
        );


    // =========================
    // すでに目的地の場合
    // =========================

    if (
        remainingPath.length <= 1
    ) {

        finishDiceMovement(
            player
        );

        return;

    }


    let index = 1;


    function moveNext() {

        // =========================
        // 「現在地に戻る」が押された場合など、
        // 自動移動が中断されていたら終了
        // =========================

        if (
            !diceMovementState.active ||
            !diceMovementState.autoMoving ||
            diceMovementState.player !== player
        ) {

            return;

        }

        // =========================
        // 移動完了
        // =========================

        if (
            index >=
            remainingPath.length
        ) {

            finishDiceMovement(
                player
            );

            return;

        }


        // =========================
        // 残り歩数
        // =========================

        remainingSteps =
            remainingPath.length -
            index;


        // =========================
        // 1マス移動
        // =========================

        moveOneStep(
            player,
            remainingPath[index]
        );


        diceMovementState.history.push(
            remainingPath[index]
        );


        index += 1;


        renderTurn();


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
// 外部から移動処理を呼び出せるようにする
// =========================

window.highlightReachableSquaresWithin =
    function (
        player,
        maxSteps
    ) {

        return highlightReachableSquaresWithin(
            player,
            maxSteps
        );

    };


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
    // サイコロ移動中の矢印を削除
    // =========================

    function clearDiceMovementArrows() {

        document
            .querySelectorAll(
                ".dice-movement-arrow"
            )
            .forEach(
                function (element) {

                    element.remove();

                }
            );

    }

    // =========================
// 「現在地に戻る」ボタンを表示
// =========================

function showDiceMovementReturnButton() {

    const button =
        document.getElementById(
            "diceMovementReturnButton"
        );

    if (!button) {
        return;
    }

    if (
        !diceMovementState.active
    ) {

        button.style.display =
            "none";

        return;

    }

    button.style.display =
        "grid";

}


// =========================
// 「現在地に戻る」ボタンを非表示
// =========================

function hideDiceMovementReturnButton() {

    const button =
        document.getElementById(
            "diceMovementReturnButton"
        );

    if (!button) {
        return;
    }

    button.style.display =
        "none";

}


// =========================
// 「現在地に戻る」ボタンの処理
// =========================
//
// サイコロを振った瞬間の位置へ戻り、
// 同じ出目の歩数で移動をやり直します。
// =========================

function setupDiceMovementReturnButton() {

    const button =
        document.getElementById(
            "diceMovementReturnButton"
        );

    if (!button) {
        return;
    }

    button.onclick =
        function () {

            if (
                !diceMovementState.active
            ) {
                return;
            }

            const player =
                diceMovementState.player;

            const startPosition =
                diceMovementState.startPosition;

            const totalSteps =
                diceMovementState.totalSteps;

            if (
                !player ||
                startPosition === null ||
                startPosition === undefined ||
                totalSteps <= 0
            ) {
                return;
            }

            // =========================
            // 自動移動を中断
            // =========================

            diceMovementState.autoMoving =
                false;

            clearDiceMovementArrows();

            clearDiceReachableClickHandlers();

            clearReachableHighlights();

            // =========================
            // 出発地点へ戻す
            // =========================

            player.position =
                startPosition;

            // =========================
            // 移動履歴を出発地点だけに戻す
            // =========================

            diceMovementState.history = [
                startPosition
            ];

            // =========================
            // 残り歩数を最初の出目へ戻す
            // =========================

            remainingSteps =
                totalSteps;

            // =========================
            // マップ・プレイヤー・残り歩数を更新
            // =========================

            renderMap();

            renderPlayers();

            renderTurn();

            // =========================
            // 改めて矢印と停止候補を表示
            // =========================

            showDiceMovementReturnButton();

            showDiceMovementArrows();

        };

}


// =========================
// サイコロ移動の終了
// =========================

function finishDiceMovement(
    player
) {

    clearDiceMovementArrows();

    clearReachableHighlights();

    clearDiceReachableClickHandlers();

    diceMovementState.active =
        false;

    diceMovementState.player =
        null;

    diceMovementState.startPosition =
        null;

    diceMovementState.history =
        [];

    diceMovementState.reachablePaths =
        new Map();

    diceMovementState.autoMoving =
        false;

    diceMovementState.totalSteps =
        0;

    hideDiceMovementReturnButton();

    hideDiceMovementCounter();

        remainingSteps =
        0;

    // =========================
    // ターン表示を更新
    // =========================
    //
    // renderTurn() に問題があっても、
    // マスイベント処理まで止めない。
    // =========================

    if (
        typeof renderTurn ===
        "function"
    ) {

        renderTurn();

    } else {

        console.warn(
            "【警告】renderTurn が見つからないため、ターン表示更新をスキップしました。"
        );

    }

    const choiceArea =
        document.getElementById(
            "choiceArea"
        );

    if (choiceArea) {

        choiceArea.innerHTML =
            "";

    }

    handleSquareEvent(
        player
    );

}

    // =========================
    // サイコロ移動の矢印を表示
    // =========================
    //
    // 現在地から1マスで移動できる
    // すべての方向を表示します。
    // サイコロ移動中は来た道を戻ることも
    // 選択できるようにします。
    // =========================

    function showDiceMovementArrows() {

        clearDiceMovementArrows();

        if (
            !diceMovementState.active ||
            diceMovementState.autoMoving
        ) {
            return;
        }

        // =========================
        // 今回の残り歩数で
        // 最終的に止まれるマスを強調
        // =========================

        highlightDiceReachableSquares(
            diceMovementState.player,
            remainingSteps
        );

        const player =
            diceMovementState.player;

        const mapBoard =
            document.getElementById(
                "mapBoard"
            );

        if (!player || !mapBoard) {
            return;
        }

        const currentSquare =
            mapData.find(
                function (square) {

                    return square.id ===
                        player.position;

                }
            );

        if (!currentSquare) {
            return;
        }

        const options =
            getConnectedOptions(
                player.position
            );

        // =========================
        // 進める方向がない場合
        // =========================

        if (options.length === 0) {

            finishDiceMovement(
                player
            );

            return;

        }

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

                arrow.type =
                    "button";

                arrow.className =
                    "branch-arrow-map dice-movement-arrow";

                arrow.setAttribute(
                    "aria-label",
                    "この方向へ1マス進む"
                );

                // =========================
                // 画像矢印
                // =========================

                const arrowImage =
                    document.createElement(
                        "img"
                    );

                arrowImage.src =
                    DICE_MOVEMENT_ARROW_PATH;

                arrowImage.alt =
                    "進む";

                arrowImage.draggable =
                    false;

                arrowImage.style.width =
                    "100%";

                arrowImage.style.height =
                    "100%";

                arrowImage.style.objectFit =
                    "contain";

                arrowImage.style.pointerEvents =
                    "none";

                arrow.appendChild(
                    arrowImage
                );

                // =========================
                // 方向計算
                // =========================
                // yajirushi.png は上向きなので、
                // 上方向を0度として回転させます。
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
                    `translate(-50%, -50%) rotate(${angle + 90}deg)`;

                // =========================
                // 既存の分岐矢印CSSを
                // 画像矢印用に上書き
                // =========================

                arrow.style.width =
                    "52px";

                arrow.style.height =
                    "52px";

                arrow.style.padding =
                    "0";

                arrow.style.border =
                    "none";

                arrow.style.borderRadius =
                    "0";

                arrow.style.background =
                    "transparent";

                arrow.style.boxShadow =
                    "none";

                arrow.style.animation =
                    "none";

                arrow.style.appearance =
                    "none";

                arrow.style.webkitAppearance =
                    "none";

                arrow.style.outline =
                    "none";

                arrow.style.backgroundImage =
                    "none";

                arrow.style.color =
                    "transparent";

                // =========================
                // 矢印タップ
                // =========================

                arrow.addEventListener(
                    "click",
                    function () {

                        if (
                            !diceMovementState.active
                        ) {
                            return;
                        }

                        if (
                            diceMovementState.player !==
                            player
                        ) {
                            return;
                        }

                        clearDiceMovementArrows();

                        const history =
                            diceMovementState.history;

                        const previousPosition =
                            history.length >= 2
                                ? history[history.length - 2]
                                : null;

                        const isBacktracking =
                            option ===
                            previousPosition;

                        // =========================
// 移動履歴と残り歩数を先に更新
// =========================
//
// moveOneStep() の中では renderMap() が
// 実行されます。
// そのため、新しい残り歩数を先に確定してから
// プレイヤーを移動させます。
//

if (isBacktracking) {

    history.pop();

    remainingSteps +=
        1;

} else {

    history.push(
        option
    );

    remainingSteps -=
        1;

}


// =========================
// 1マス移動
// =========================

moveOneStep(
    player,
    option
);


renderTurn();

                        // =========================
                        // 残り0なら移動終了
                        // =========================

                        if (
                            remainingSteps <= 0
                        ) {

                            finishDiceMovement(
                                player
                            );

                            return;

                        }

                        // =========================
                        // まだ移動できる場合
                        // =========================

                        showDiceMovementArrows();

                    }
                );

                mapBoard.appendChild(
                    arrow
                );

            }
        );

    }


    // =========================
    // プレイヤー移動
    // =========================
    //
    // サイコロを振った後は自動移動せず、
    // 矢印をタップして1マスずつ移動します。
    // =========================

    function movePlayer(
        player,
        diceNumber
    ) {

        clearReachableHighlights();
        clearDiceMovementArrows();

        diceMovementState.active =
            true;

        diceMovementState.player =
            player;

        diceMovementState.startPosition =
            player.position;

                diceMovementState.history = [
            player.position
        ];

        diceMovementState.autoMoving =
            false;

        diceMovementState.totalSteps =
            diceNumber;

        remainingSteps =
            diceNumber;


        // =========================
        // サイコロを振った瞬間に
        // 停止可能マスを確定
        // =========================
        //
        // ここで一度だけ計算します。
        //
        // 以降、プレイヤーが何マス進んでも
        // 「残り歩数」から新しい候補を
        // 作り直すことはありません。
        //
        diceMovementState.reachablePaths =
            getReachableStopSquares(
                player.position,
                diceNumber
            );

        setupDiceMovementReturnButton();

        renderTurn();

        // =========================
        // 残り0の場合
        // =========================

        if (remainingSteps <= 0) {

            finishDiceMovement(
                player
            );

            return;

        }

        // =========================
        // 「現在地に戻る」を表示
        // =========================

        showDiceMovementReturnButton();

        // =========================
        // 進行方向を表示
        // =========================

        showDiceMovementArrows();

    }

    // =========================
    // ルーレット　ちゃんとみてる？
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
            // 二重クリック防止、アイテム非活性化
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
        const itemIds =
    Object.keys(
        ITEM_CONTENTS
    );

const randomItemId =
    itemIds[
        Math.floor(
            Math.random() *
            itemIds.length
        )
    ];

const randomItem =
    ITEM_CONTENTS[
        randomItemId
    ];

name.textContent =
    randomItem.name;

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

const monsterIds =
    Object.keys(
        MONSTER_CONTENTS
    );

const randomMonsterId =
    monsterIds[
        Math.floor(
            Math.random() *
            monsterIds.length
        )
    ];

const monster =
    MONSTER_CONTENTS[
        randomMonsterId
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

// 戦闘中バフ状態
const battleState = {

    magicPowerRate: 1,

    enemyAttackRate: 1

};


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
// モンスターの反撃ダメージ計算
// =========================

const monsterDamage =
    getMonsterDamage(
        player,
        Math.floor(
            monster.attack *
            battleState.enemyAttackRate
        )
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
                "🪄 魔法";


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

                                    `${magic.name}を使うには` +
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

                                    `${magic.name}を使うには` +
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
// バフ魔法の処理
// =========================

if (
    magic.type === "buff"
) {

    // =========================
    // バフ効果を適用
    // =========================

    const buffResult =
    tryApplyBattleBuff(
        magic,
        battleState
    );


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
    // モンスターの反撃ダメージ計算
    // =========================

    const monsterDamage =
        getMonsterDamage(
            player,
            Math.floor(
                monster.attack *
                battleState.enemyAttackRate
            )
        );


    // =========================
    // プレイヤーの所持金からダメージ
    // =========================

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
    // バフ＋モンスター反撃を表示
    // =========================

    let buffMessage = "";

if (
    buffResult.success
) {

    if (
        magic.buffTarget === "self" &&
        magic.buffStat === "magicPower"
    ) {

        buffMessage =
            `⚡ 魔力が${magic.buffRate}倍になった！`;

    }

    else if (
        magic.buffTarget === "enemy" &&
        magic.buffStat === "attackPower"
    ) {

        buffMessage =
            `🛡️ ${monster.name}の攻撃力が${magic.buffRate}倍になった！`;

    }

    else {

        buffMessage =
            "✨ バフ効果が発動！";

    }

}

else {

    buffMessage =
        "💥 バフに失敗した！";

}


document.getElementById(
    "battleMessage"
).textContent =
    `✨ ${magic.name}！` +
    `　${buffMessage}` +
    `　👾 ${monster.name}の反撃！` +
    ` ${monsterDamage}Gのダメージ！`;


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

         passButton.style.display =
        "none";


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


    return;

}

// =========================
// 攻撃魔法のダメージ計算
// =========================

const magicDamage =
    calculateMagicDamage(
        player,
        magic
    ) *
    battleState.magicPowerRate;

 // =========================
 // モンスターHPを減らす
// =========================

    monsterHP =
    applyMonsterDamage(
        monsterHP,
        magicDamage
    );


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
        `${magic.name}！` +
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
// モンスターの反撃ダメージ計算
// =========================
const monsterDamage =
    getMonsterDamage(
        player,
        Math.floor(
            monster.attack *
            battleState.enemyAttackRate
        )
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
                                `${magic.name}！` +
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

                                passButton.style.display =
                                "none";

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
    BOSS_CONTENTS[
        currentBossId
    ].hp;

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


// 戦闘中バフ状態
const battleState = {

// プレイヤーの魔法攻撃力倍率
    magicPowerRate: 1,

 // ボスの攻撃力倍率
    enemyAttackRate: 1

};


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
    ).innerHTML =
    `${BOSS_ICON_HTML} ${BOSS_CONTENTS[currentBossId].name}`;


    document.getElementById(
        "battleMonsterStats"
    ).innerHTML =
        `❤️${currentBossHP}<br>` +
        `⚔️攻撃 ${BOSS_CONTENTS[currentBossId].attack}`;


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
    ).innerHTML =
        `${BOSS_ICON_HTML} ${BOSS_CONTENTS[currentBossId].name}との戦闘開始！`;


       
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
        "🪄 魔法";


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

const baseBossDamage =
    BOSS_CONTENTS[
        currentBossId
    ].attack;


// =========================
// バフ・アイテムによる被ダメージ補正
// =========================

const bossDamage =
    getMonsterDamage(
        player,
        Math.floor(
            baseBossDamage *
            battleState.enemyAttackRate
        )
    );

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
            ).innerHTML =
                `⏭️ パスした！` +
                `<br>` +
                `${BOSS_ICON_HTML} ${BOSS_CONTENTS[currentBossId].name}の反撃！ ` +
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
            `${BOSS_ICON_HTML} ${BOSS_CONTENTS[currentBossId].name}の反撃！ ` +
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
    BOSS_CONTENTS[
        currentBossId
    ],

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

                            `${magic.name}を使うには` +
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
// バフ魔法の処理
// =========================

if (
    magic.type === "buff"
) {

    // =========================
    // バフ効果を適用
    // =========================

    const buffResult =
        tryApplyBattleBuff(
            magic,
            battleState
        );


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
    // バフ結果メッセージ
    // =========================

    let buffMessage = "";


    if (
        buffResult.success
    ) {

        if (
            magic.buffTarget === "self" &&
            magic.buffStat === "magicPower"
        ) {

            buffMessage =
                `⚡ 魔力が${magic.buffRate}倍になった！`;

        }

        else if (
            magic.buffTarget === "enemy" &&
            magic.buffStat === "attackPower"
        ) {

            buffMessage =
                `🛡️ ${BOSS_CONTENTS[currentBossId].name}` +
                `の攻撃力が${magic.buffRate}倍になった！`;

        }

        else {

            buffMessage =
                "✨ バフ効果が発動！";

        }

    }

    else {

        buffMessage =
            "💥 バフに失敗した！";

    }


    // =========================
    // ボスの反撃ダメージ計算
    // =========================

    const baseBossDamage =
        BOSS_CONTENTS[
            currentBossId
        ].attack;


    const bossDamage =
        getMonsterDamage(
            player,
            Math.floor(
                baseBossDamage *
                battleState.enemyAttackRate
            )
        );


    // =========================
    // プレイヤーの所持金からダメージ
    // =========================

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
        ).innerHTML =
            `✨ ${magic.name}！` +
            `　${buffMessage}` +
            `${BOSS_ICON_HTML} ${BOSS_CONTENTS[currentBossId].name}` +
            `の反撃！` +
            ` ${formatG(bossDamage)}Gのダメージ！`;


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
    // バフ＋ボス反撃を表示
    // =========================

    document.getElementById(
        "battleMessage"
    ).innerHTML =
        `✨ ${magic.name}！` +
        `　${buffMessage}<br>` +
        `${BOSS_ICON_HTML} ${BOSS_CONTENTS[currentBossId].name}` +
        `の反撃！` +
        ` ${formatG(bossDamage)}Gのダメージ！`;


    // =========================
    // 3ラウンド終了
    // =========================

    if (
        currentRound >= 3
    ) {

        document.getElementById(
            "battleMessage"
        ).textContent +=
            `<br>⚔️ 3ラウンド終了！`;


        // =========================
        // パスボタンを即非表示
        // =========================

        passButton.style.display =
            "none";


        // =========================
        // 戦闘終了ボタン
        // =========================

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
    // 次のラウンドの魔法を有効化
    // =========================

    magicButton.disabled =
        false;


    return;

}

// =========================
// 攻撃魔法のダメージ計算
// =========================

const magicDamage =
    calculateMagicDamage(
        player,
        magic
    ) *
    battleState.magicPowerRate;
                   


 // =========================
// ボスへの実ダメージ計算
// =========================

const actualDamage =
    calculateActualDamage(
        magicDamage,
        currentBossHP
    );


// =========================
// ボスHPを減らす
// =========================

currentBossHP =
    applyBossDamage(
        currentBossHP,
        actualDamage
    );


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
                       `⚔️攻撃 ${BOSS_CONTENTS[currentBossId].attack}`;


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
                        ).innerHTML =
                            `${magic.name}！ ` +
                            `${magicDamage}ダメージ！` +
                           `　${BOSS_ICON_HTML} ${BOSS_CONTENTS[currentBossId].name}を倒した！`;

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
    `${BOSS_CONTENTS[currentBossId].name}を倒した！<br>`;


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
    "ボス撃破！",
    bossRewardMessage,
    function () {

        // =========================
        // 現在のボスを記録
        // =========================

        previousBossSquareId =
            currentBossSquareId;

        // =========================
// 次のボスへ変更
// =========================

// デーモンロード撃破後は
// 以降ずっと「いただきリリィ」

if (
    currentBossId === 1
) {

    currentBossId =
        2;

}

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

const baseBossDamage =
    BOSS_CONTENTS[
        currentBossId
    ].attack;


// =========================
// バフ・アイテムによる被ダメージ補正
// =========================

const bossDamage =
    getMonsterDamage(
        player,
        Math.floor(
            baseBossDamage *
            battleState.enemyAttackRate
        )
    );

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
                    ).innerHTML =
                        `${magic.name}！ ` +
                        `${magicDamage}ダメージ！` +
                        `　${BOSS_ICON_HTML}  ${BOSS_CONTENTS[currentBossId].name}の反撃！ ` +
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
            ${BOSS_ICON_HTML} 
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
                "ボスから撤退",

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

console.log(
    "【停止マスイベント】",
    player.position,
    mapData.find(
        function (square) {
            return square.id === player.position;
        }
    )
);
    
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
// スタートマス
// =========================

case "start":

    // 何も起こさずターン終了

    finishTurn(
        player
    );

    break;

// =========================
// 資産マス
// =========================

case "asset":

    const assetIds = [];

    (
        currentSquare.typeIds || []
    ).forEach(
        function (typeId) {

            const assetBox =
                ASSET_BOXES[typeId];

            if (!assetBox) {
                return;
            }

            (
                assetBox.contents || []
            ).forEach(
                function (assetId) {

                    assetIds.push(
                        assetId
                    );

                }
            );

        }
    );


    showAssetPurchasePopup(
        player,
        assetIds,
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
        // ショップマス
        // =========================

       case "shop":

    showShopPopup(
        player
    );

    break;

// =========================
// 魔法店マス
// =========================

case "magic_shop":

    showMagicShopMainMenu(
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
        currentTurn,
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

    // =========================
    // 宝箱BOXを取得
    // =========================

    const treasureBox =
        TREASURE_BOXES[
            currentSquare.treasureBoxId
        ];


    // =========================
    // 宝箱BOXが存在しない場合
    // =========================

    if (!treasureBox) {

        console.error(
            "宝箱BOXが見つかりません:",
            currentSquare.treasureBoxId
        );

        finishTurn(player);

        break;

    }


    // =========================
    // 宝箱のランクを取得
    // =========================

    const treasureRank =
        treasureBox.rank;


    // =========================
    // ランクが一致するcontentsを抽選
    // =========================

    const treasureCandidates = [];


    // アイテム
    Object.entries(ITEM_CONTENTS).forEach(
        function ([contentId, content]) {

            if (content.rank === treasureRank) {

                treasureCandidates.push({
                    category: "item",
                    id: Number(contentId),
                    content: content
                });

            }

        }
    );


    // 魔力
    Object.entries(POWER_CONTENTS).forEach(
        function ([contentId, content]) {

            if (content.rank === treasureRank) {

                treasureCandidates.push({
                    category: "power",
                    id: Number(contentId),
                    content: content
                });

            }

        }
    );


    // 魔法
    Object.entries(MAGIC_CONTENTS).forEach(
        function ([contentId, content]) {

            if (content.rank === treasureRank) {

                treasureCandidates.push({
                    category: "magic",
                    id: Number(contentId),
                    content: content
                });

            }

        }
    );


    // =========================
    // 抽選対象が存在しない場合
    // =========================

    if (treasureCandidates.length === 0) {

        console.error(
            "宝箱ランクに対応するcontentsがありません:",
            treasureRank
        );

        finishTurn(player);

        break;

    }


    // =========================
    // 宝箱ルーレット
    // =========================

    const randomTreasure =
        treasureCandidates[
            Math.floor(
                Math.random() *
                treasureCandidates.length
            )
        ];


    // =========================
// 宝箱contentsの獲得処理
// =========================

if (randomTreasure.category === "item") {

    const randomItem =
        randomTreasure.content;


    showItemRoulette(
        randomItem,

        function () {

            addItem(
                player,
                randomTreasure.id,
                currentTurn
            );


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

}


// =========================
// 魔力
// =========================

if (randomTreasure.category === "power") {

    const power =
        randomTreasure.content;


    player.magicPower +=
        Number(
            power.effect.match(/\d+/)[0]
        );


    renderPlayers();


    showEventPopup(
        "🎁 宝箱",

        `<strong>${power.effect}</strong>を獲得した！`,

        function () {

            finishTurn(player);

        }
    );

    break;

}

// =========================
// 魔法
// =========================

if (randomTreasure.category === "magic") {

    const magic =
        randomTreasure.content;


    player.magic.push(
        randomTreasure.id
    );


    renderPlayers();


    showEventPopup(
        "🎁 宝箱",

        `<strong>${magic.name}</strong>を手に入れた！`,

        function () {

            finishTurn(player);

        }
    );

    break;

}

    }
    

}


// =========================
// ショップ
// =========================

function showShopPopup(
    player
) {

    const shopPopup =
        document.getElementById(
            "shopPopup"
        );

    const shopName =
        document.getElementById(
            "shopName"
        );

    const shopItemList =
        document.getElementById(
            "shopItemList"
        );

    const shopCloseButton =
        document.getElementById(
            "shopCloseButton"
        );


    if (!shopPopup || !shopItemList || !shopCloseButton) {
        return;
    }


    // =========================
    // 現在のマスを取得
    // =========================

    const currentSquare =
        mapData.find(
            function (square) {
                return square.id === player.position;
            }
        );


    if (!currentSquare) {

        finishTurn(player);
        return;

    }


    // =========================
    // ショップBOXを取得
    // =========================

    const shopBox =
        SHOP_BOXES[currentSquare.typeId];


    if (!shopBox) {

        finishTurn(player);
        return;

    }


    // =========================
    // ショップ名・所持金
    // =========================

    shopName.textContent =
        shopBox.name;

    const shopMoney =
        document.getElementById(
            "shopMoney"
        );

    if (shopMoney) {
        shopMoney.textContent =
            `💰 所持金：${formatG(player.money)}G`;
        shopMoney.style.display =
            "block";
    }


    // =========================
    // カテゴリー一覧を確実に用意
    // =========================
    // 最新index.htmlにはカテゴリー用DOMが存在しないため、
    // ここで不足していれば自動生成します。

    let shopCategoryList =
        document.getElementById(
            "shopCategoryList"
        );

    if (!shopCategoryList) {

        shopCategoryList =
            document.createElement(
                "div"
            );

        shopCategoryList.id =
            "shopCategoryList";

        shopCategoryList.className =
            "shop-category-list";

        shopItemList.parentNode.insertBefore(
            shopCategoryList,
            shopItemList
        );

    }


    shopCategoryList.innerHTML =
        "";

    shopCategoryList.style.display =
        "flex";

    shopItemList.innerHTML =
        "";

    shopItemList.style.display =
        "none";


    // =========================
    // カテゴリーボタン作成
    // =========================

    function createCategoryButton(
        id,
        label,
        visible,
        onClick
    ) {

        const button =
            document.createElement(
                "button"
            );

        button.id = id;
        button.type = "button";
        button.className =
            "shop-category-button";
        button.textContent = label;
        button.style.display =
            visible ? "block" : "none";

        button.addEventListener(
            "click",
            onClick
        );

        shopCategoryList.appendChild(
            button
        );

        return button;

    }


    // =========================
    // 通常ショップはアイテムのみ
    // =========================

    createCategoryButton(
        "shopItemButton",
        "🎒 アイテムを購入",
        !!(shopBox.itemContents && shopBox.itemContents.length),
        function () {
            showItemShopPopup(player);
        }
    );


    // =========================
    // ショップを表示
    // =========================

    shopPopup.style.display =
        "block";


    shopCloseButton.textContent =
        "🏃 やめる";


    // =========================
    // ショップ終了
    // =========================

    shopCloseButton.onclick =
        function () {

            shopPopup.style.display =
                "none";

            shopCategoryList.style.display =
                "none";

            shopItemList.style.display =
                "none";

            if (shopMoney) {
                shopMoney.style.display =
                    "none";
            }

            finishTurn(player);

        };

}


// =========================
// 魔法店メインメニュー
// 魔法 / 魔力を選択
// =========================

function showMagicShopMainMenu(
    player
) {

    showMagicShopMenuUI(
        player,

        function () {

            showPowerShopPopup(
                player
            );

        },

        function () {

            showMagicShopPopup(
                player
            );

        },

        function () {

            finishTurn(
                player
            );

        }
    );

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

    const magicShopTitle =
        magicShopPopup.querySelector(
            ".magic-shop-title"
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

    // ボタン表示

    closeButton.textContent =
        "閉じる";

    // =========================
    // 魔法一覧を初期化
    // =========================

    magicShopList.innerHTML =
        "";

    // =========================
    // ショップBOXを取得
    // =========================

    const currentSquare =
        mapData.find(
            square =>
                square.id === player.position
        );

    const shopBox =
        SHOP_BOXES[
            currentSquare.typeId
        ];

    if (!shopBox) {

        console.error(
            "ショップBOXが見つかりません:",
            currentSquare.typeId
        );

        return;
    }

        magicShopTitle.textContent =
        `🏪 ${shopBox.name}`;


// =========================
// 魔法を表示
// =========================

shopBox.magicContents.forEach(
    function (contentId) {

        const magic =
            MAGIC_CONTENTS[contentId];

        if (!magic) {
            console.error(
                "魔法CONTENTSが見つかりません:",
                contentId
            );
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
        Number(contentId)
    );


            magicElement.innerHTML = `

                <div
                    class="magic-shop-item-name"
                >
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
                        Number(contentId)
                        );


                        // =========================
                        // プレイヤー表示更新
                        // =========================

                        renderPlayers();


                        // =========================
                        // 習得メッセージ
                        // =========================

                        showEventPopup(
                            "🪄 魔法習得",
                            `

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
// ショップ一覧へ戻る
// =========================

closeButton.onclick =
    function () {

        // 魔法ショップを閉じる

        magicShopPopup.style.display =
            "none";


        // ショップ一覧を表示

                showMagicShopMainMenu(
            player
        );

    };

}

// =========================
// アイテムショップ
// =========================

function showItemShopPopup(
    player
) {

    const shopPopup =
        document.getElementById(
            "shopPopup"
        );

    const shopName =
        document.getElementById(
            "shopName"
        );

    let shopCategoryList =
        document.getElementById(
            "shopCategoryList"
        );

    const shopItemList =
        document.getElementById(
            "shopItemList"
        );

    const shopMoney =
    document.getElementById(
        "shopMoney"
    );

    const shopCloseButton =
    document.getElementById(
            "shopCloseButton"
        );


    // =========================
    // 現在のショップを取得
    // =========================

    const currentSquare =
        mapData.find(
            square =>
                square.id === player.position
        );


    if (!currentSquare) {

        return;

    }


    const shopBox =
        SHOP_BOXES[
            currentSquare.typeId
        ];


    if (!shopBox) {

        return;

    }


    // =========================
    // ショップ名
    // =========================

    shopName.textContent =
    shopBox.name;

// =========================
// 所持金表示
// =========================

if (shopMoney) {

    shopMoney.textContent =
        `💰 所持金：${formatG(player.money)}G`;

    shopMoney.style.display =
        "block";

}

// =========================
// ボタン表示
// =========================

if (shopCloseButton) {

    shopCloseButton.textContent =
        "閉じる";

}

    // =========================
    // カテゴリーメニューを非表示
    // =========================

    shopCategoryList.style.display =
        "none";


    // =========================
    // 商品一覧を初期化
    // =========================

    shopItemList.innerHTML =
        "";


    shopItemList.style.display =
        "flex";


    // =========================
    // アイテム一覧
    // =========================

    shopBox.itemContents.forEach(
        function (contentId) {

            const item =
                ITEM_CONTENTS[
                    contentId
                ];


            if (!item) {

                console.error(
                    "アイテムCONTENTSが見つかりません:",
                    contentId
                );

                return;

            }


            const itemElement =
                document.createElement(
                    "div"
                );


            itemElement.className =
                "magic-shop-item";


            itemElement.innerHTML = `

                <div
                    class="magic-shop-item-name"
                >

                    ${item.name}

                </div>


                <div
                    class="magic-shop-item-effect"
                >

                    ${item.effect}

                </div>


                <div
                    class="magic-shop-item-price"
                >

                    💰 ${formatG(item.price)}G

                </div>


                <button
                    class="magic-shop-buy-button"
                    type="button"
                >
                    購入
                </button>

            `;


            // =========================
            // 購入ボタン
            // =========================

            const buyButton =
                itemElement.querySelector(
                    ".magic-shop-buy-button"
                );


            buyButton.addEventListener(
                "click",
                function () {

                    // =========================
                    // G不足
                    // =========================

                    if (
                        player.money <
                        item.price
                    ) {

                        showEventPopup(
                            "💰 ゴールド不足",

                            `
                            ${item.name}を購入するには
                            <strong>
                                ${formatG(item.price)}G
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
                        item.price;


                    // =========================
                    // アイテムを追加
                    // =========================

                    addItem(
                        player,
                        Number(contentId),
                        currentTurn
                    );


                    // =========================
                    // プレイヤー情報更新
                    // =========================

                    renderPlayers();


                    // =========================
                    // 購入完了
                    // =========================

                    showEventPopup(
                        "🎒 アイテム購入",

                        `
                        <strong>
                            ${item.name}
                        </strong>
                        を購入した！
                        <br><br>

                        💰
                        ${formatG(item.price)}G
                        を支払った。
                        `,

                        function () {

                            showItemShopPopup(
                                player
                            );

                        }
                    );

                }
            );


            shopItemList.appendChild(
                itemElement
            );

        }
    );

// =========================
// ショップを表示
// =========================

shopPopup.style.display =
    "block";


// =========================
// 閉じるボタン
// ショップを完全に閉じてターン終了
// =========================

shopCloseButton.onclick =
    function () {

        // 商品一覧を非表示

        shopItemList.style.display =
            "none";


        // 所持金表示を非表示

        if (shopMoney) {

            shopMoney.style.display =
                "none";

        }


        // カテゴリー一覧を非表示

        if (shopCategoryList) {

            shopCategoryList.style.display =
                "none";

        }


        // ショップを閉じる

        shopPopup.style.display =
            "none";


        // ショップを閉じたらターン終了

        finishTurn(
            player
        );

    };

}


// =========================
// 魔力ショップ
// =========================

function showPowerShopPopup(
    player
) {

    const powerShopPopup =
        document.getElementById(
            "powerShopPopup"
        );

    const powerShopTitle =
        document.getElementById(
            "powerShopTitle"
        );

    const powerShopMoney =
        document.getElementById(
            "powerShopMoney"
        );

    const powerShopList =
        document.getElementById(
            "powerShopList"
        );

    const closeButton =
        document.getElementById(
            "powerShopCloseButton"
        );


    // =========================
    // 現在のショップを取得
    // =========================

    const currentSquare =
        mapData.find(
            square =>
                square.id === player.position
        );


    if (!currentSquare) {

        return;

    }


    const shopBox =
        SHOP_BOXES[
            currentSquare.typeId
        ];


    if (!shopBox) {

        return;

    }


    // =========================
    // ショップ名
    // =========================

    powerShopTitle.textContent =
        `🏪 ${shopBox.name}`;


    // =========================
    // 所持金表示
    // =========================

    powerShopMoney.textContent =
        `💰 所持金：${formatG(player.money)}G`;


    // =========================
    // 商品一覧を初期化
    // =========================

    powerShopList.innerHTML =
        "";


    // =========================
    // 魔力一覧
    // =========================

    shopBox.powerContents.forEach(
        function (contentId) {

            const power =
                POWER_CONTENTS[
                    contentId
                ];


            if (!power) {

                console.error(
                    "魔力CONTENTSが見つかりません:",
                    contentId
                );

                return;

            }


            const itemElement =
                document.createElement(
                    "div"
                );


            // =========================
            // 商品カードのクラス
            // =========================

            itemElement.className =
                "magic-shop-item";


            // =========================
            // 商品カードの内容
            // =========================

            itemElement.innerHTML = `

                <div
                    class="magic-shop-item-name"
                >

                    魔力アップ

                </div>


                <div
                    class="magic-shop-item-effect"
                >

                    ${power.effect}

                </div>


                <div
                    class="magic-shop-item-price"
                >

                    💰 ${formatG(power.price)}G

                </div>


                <button
                    class="magic-shop-buy-button"
                    type="button"
                >
                    購入
                </button>

            `;


            // =========================
            // 購入ボタン
            // =========================

            const buyButton =
                itemElement.querySelector(
                    ".magic-shop-buy-button"
                );


            buyButton.addEventListener(
                "click",
                function () {

                    // =========================
                    // G不足
                    // =========================

                    if (
                        player.money <
                        power.price
                    ) {

                        showEventPopup(
                            "💰 ゴールド不足",

                            `
                            魔力を購入するには
                            <strong>
                                ${formatG(power.price)}G
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
                        power.price;


                    // =========================
                    // 魔力を追加
                    // =========================

                    if (
                        !player.magicPower
                    ) {

                        player.magicPower =
                            0;

                    }


                    // =========================
                    // 魔力の増加量を取得
                    // =========================

                    const powerValue =
                        Number(
                            power.effect
                                .replace(
                                    "魔力＋",
                                    ""
                                )
                        );


                    player.magicPower +=
                        powerValue;


                    // =========================
                    // プレイヤー情報更新
                    // =========================

                    renderPlayers();


                    // =========================
                    // 購入完了
                    // =========================

                    showEventPopup(
                        "🔮 魔力購入",

                        `
                        <strong>
                            ${power.effect}
                        </strong>
                        した！
                        <br><br>

                        💰
                        ${formatG(power.price)}G
                        を支払った。
                        `,

                        function () {

                            showPowerShopPopup(
                                player
                            );

                        }
                    );

                }
            );


            // =========================
            // 商品カードを一覧に追加
            // =========================

            powerShopList.appendChild(
                itemElement
            );

        }
    );


    // =========================
    // ショップ画面を表示
    // =========================

    powerShopPopup.style.display =
        "block";


    // =========================
    // 閉じるボタン
    // =========================

    closeButton.onclick =
        function () {

            powerShopPopup.style.display =
                "none";

                        showMagicShopMainMenu(
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
            ASSET_CONTENTS[
                assetId
            ];


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
            const asset =
            ASSET_CONTENTS[
            assetId
             ];

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

console.log(
    "【アイテム効果チェック②】",
    nextPlayer.name,
    nextPlayer.inventory,
    nextPlayer.money
);

removeExpiredItems(
    nextPlayer,
    currentTurn
);

applyTurnStartItemEffects(
    nextPlayer,
    currentTurn
);

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

    `${nextPlayer.name}は<br>` +
   `<strong>${formatG(reward)}G</strong>を獲得！`
    ,

    function () {

        renderTurn();
        renderPlayers();
        centerCurrentPlayerOnMap();

        // ルーレット使用可能
        rouletteButton.disabled =
            false;

    }
);


            return;

        }


        // =========================
        // まだ仕事中
        // =========================

        showEventPopup(
            "💼 バイト中",

            `${nextPlayer.name}は現在バイト中です。<br>` +
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
        // アイテムボタンを再び有効化
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

console.log(
    "【アイテム効果チェック③】",
    nextPlayer.name,
    nextPlayer.inventory,
    nextPlayer.money
);

removeExpiredItems(
    nextPlayer,
    currentTurn
);

applyTurnStartItemEffects(
    nextPlayer,
    currentTurn
);

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

    `${nextPlayer.name}は<br>` +
   `<strong>${formatG(reward)}G</strong>を獲得！`
    ,

    function () {

        renderTurn();
        renderPlayers();
        centerCurrentPlayerOnMap();

        // ルーレット使用可能
        rouletteButton.disabled =
            false;

    }
);


                return;

            }


            // =========================
            // まだ仕事中
            // =========================

            showEventPopup(
                "💼 バイト中",

                `${nextPlayer.name}は現在バイト中です。<br>` +
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

    // アイテムボタンを再び有効化
    inventoryButton.disabled =
        false;


    const nextPlayer =
    players[currentPlayer];


// =========================
// ターン開始時のアイテム効果
// =========================

console.log(
    "【アイテム効果チェック①】",
    nextPlayer.name,
    nextPlayer.inventory,
    nextPlayer.money
);

removeExpiredItems(
    nextPlayer,
    currentTurn
);

applyTurnStartItemEffects(
    nextPlayer,
    currentTurn
);


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

    `${nextPlayer.name}は<br>` +
    `<strong>${formatG(reward)}G</strong>を獲得！`
    ,

    function () {

        renderTurn();
        renderPlayers();
        centerCurrentPlayerOnMap();

        // ルーレット使用可能
        rouletteButton.disabled =
            false;

    }
);


            return;

        }


        // =========================
        // まだバイト中
        // =========================

        showEventPopup(
            "💼 バイト中",

            `${nextPlayer.name}は現在バイト中です。<br>` +
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

function centerCurrentPlayerOnMap(
    behavior = "smooth"
) {

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

    // =========================
    // 現在のズーム倍率を取得
    // =========================

    const zoom =
        typeof mapZoom === "number" &&
        mapZoom > 0
            ? mapZoom
            : 1;

    // =========================
    // 現在の表示位置を取得
    // transform(scale)後の
    // 実際の画面上の座標を使用する
    // =========================

    requestAnimationFrame(
        function () {

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

            // =========================
            // 画面上でのズレ
            // =========================

            const visualOffsetX =
                playerCenterX -
                mapCenterX;

            const visualOffsetY =
                playerCenterY -
                mapCenterY;

            // =========================
            // transform(scale)による
            // 表示上の移動量を
            // スクロール量へ変換
            // =========================

            const scrollAmountX =
                visualOffsetX / zoom;

            const scrollAmountY =
                visualOffsetY / zoom;

            const targetScrollLeft =
                mapArea.scrollLeft +
                scrollAmountX;

            const targetScrollTop =
                mapArea.scrollTop +
                scrollAmountY;

            // =========================
            // スクロール可能範囲
            // =========================

            const maxScrollLeft =
                Math.max(
                    0,
                    mapArea.scrollWidth -
                    mapArea.clientWidth
                );

            const maxScrollTop =
                Math.max(
                    0,
                    mapArea.scrollHeight -
                    mapArea.clientHeight
                );

            const finalScrollLeft =
                Math.max(
                    0,
                    Math.min(
                        targetScrollLeft,
                        maxScrollLeft
                    )
                );

            const finalScrollTop =
                Math.max(
                    0,
                    Math.min(
                        targetScrollTop,
                        maxScrollTop
                    )
                );

            // =========================
            // プレイヤー位置へカメラ移動
            // =========================

            mapArea.scrollTo({

                left:
                    finalScrollLeft,

                top:
                    finalScrollTop,

                behavior:
                    behavior

            });

        }
    );

}

// =========================
// プレイヤー1をマップ中央へ
// ボス決定演出終了後専用
// =========================

function centerPlayer1OnMap() {

    const mapArea =
        document.querySelector(
            ".game-screen .map-area"
        );

    const player1 =
        players[0];

    if (
        !mapArea ||
        !player1
    ) {

        return;

    }


    requestAnimationFrame(
        function () {

            const playerNode =
                mapArea.querySelector(
                    `.map-node[data-square-id="${player1.position}"]`
                );

            if (!playerNode) {

                return;

            }


            // =========================
            // プレイヤー1のマップ内中心座標
            // =========================

            const playerCenterX =
                playerNode.offsetLeft +
                playerNode.offsetWidth / 2;

            const playerCenterY =
                playerNode.offsetTop +
                playerNode.offsetHeight / 2;


            // =========================
            // マップ中央へ合わせる
            // =========================

            const targetScrollLeft =
                playerCenterX -
                mapArea.clientWidth / 2;

            const targetScrollTop =
                playerCenterY -
                mapArea.clientHeight / 2;


            // =========================
            // スクロール可能範囲
            // =========================

            const maxScrollLeft =
                mapArea.scrollWidth -
                mapArea.clientWidth;

            const maxScrollTop =
                mapArea.scrollHeight -
                mapArea.clientHeight;


            const finalScrollLeft =
                Math.max(
                    0,
                    Math.min(
                        targetScrollLeft,
                        maxScrollLeft
                    )
                );

            const finalScrollTop =
                Math.max(
                    0,
                    Math.min(
                        targetScrollTop,
                        maxScrollTop
                    )
                );


            // =========================
            // プレイヤー1へカメラ移動
            // =========================

            mapArea.scrollTo({

                left:
                    finalScrollLeft,

                top:
                    finalScrollTop,

                behavior:
                    "smooth"

            });

        }
    );

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

// =========================
// バイト画面
// =========================

function showJobPopup(
    player,
    square,
    turn,
    finishCallback
) {

    // =========================
    // 現在のHTMLで使用している要素
    // =========================

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
    // HTML要素チェック
    // =========================

    if (
        !jobPopup ||
        !jobMessage ||
        !job1Button ||
        !jobNoneButton
    ) {

        console.error(
            "【バイト画面】現在のHTMLに必要なバイト要素がありません。",
            {
                jobPopup:
                    !!jobPopup,

                jobMessage:
                    !!jobMessage,

                job1Button:
                    !!job1Button,

                job2Button:
                    !!job2Button,

                job3Button:
                    !!job3Button,

                jobNoneButton:
                    !!jobNoneButton
            }
        );

        return;
    }


    // =========================
    // 今回の時給
    // =========================

    const currentWage =
        getCurrentJobWage(
            square.jobWage,
            turn
        );


    // =========================
    // バイト内容
    // =========================

    jobMessage.innerHTML =
        `💼 ${square.name}<br>` +
        `💰 時給 ${formatG(currentWage)}G<br><br>` +
        `1ターン働きますか？`;


    // =========================
    // 表示
    // =========================

    jobPopup.style.display =
        "block";


    // =========================
    // 1ターン働く
    // =========================

    job1Button.textContent =
        "働く";

    job1Button.style.display =
        "";


    job1Button.onclick =
        function () {

            startJob(
                player,
                2,
                currentWage,
                finishCallback
            );

        };


    // =========================
    // 2ターン・3ターンは
    // 今回の仕様では使用しない
    // =========================

    if (job2Button) {

        job2Button.style.display =
            "none";

    }

    if (job3Button) {

        job3Button.style.display =
            "none";

    }


    // =========================
    // 働かない
    // =========================

    jobNoneButton.textContent =
        "やめる";


    jobNoneButton.style.display =
        "";


    jobNoneButton.onclick =
        function () {

            jobPopup.style.display =
                "none";

            finishCallback();

        };

}


// =========================
// バイト開始
// =========================
//
// showJobPopup() の「働く」から呼び出される処理。
// マス到着後の type → コンテンツ判定には触れず、
// バイトを選択した後の状態だけを設定します。
//
// turns：今回働くターン数
// reward：1ターンあたりの報酬
// =========================

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

    if (jobPopup) {

        jobPopup.style.display =
            "none";

    }

    // =========================
    // 次の自分のターンから
    // 指定ターン数だけバイトする
    // =========================

    player.jobTurnsRemaining =
        turns;

    player.jobReward =
        reward;

    // =========================
    // バイト開始表示
    // =========================

    showEventPopup(
        "💼 バイト開始",
        `
        1ターン働きます！<br>
        <strong>${formatG(reward)}G</strong>を獲得予定です。
        `,
        function () {

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
// アイテム画面
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
    // アイテム一覧を初期化
    // =========================

    inventoryList.innerHTML =
        "";


    // =========================
    // アイテムがない場合
    // =========================

    if (
        player.inventory.length === 0
    ) {

        inventoryList.innerHTML = `

            <div class="inventory-empty">

                アイテムはありません。

            </div>

        `;

    }


    // =========================
    // アイテムを表示
    // =========================

    player.inventory.forEach(
        function (inventoryData, inventoryIndex) {

            // =========================
            // 個体データ / 通常IDの両方に対応
            // =========================

            const itemId =
                typeof inventoryData ===
                "object"
                    ? inventoryData.id
                    : Number(inventoryData);


            const item =
                ITEM_CONTENTS[itemId];


            if (!item) {

                return;

            }


            const isPassiveItem =
                item.category ===
                "passive";


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

                ${
                    isPassiveItem
                        ? `
                <div
                    class="inventory-item-effect"
                >
                    ✨ 持っているだけで効果発動
                </div>
                        `
                        : `
                <button
                    class="inventory-item-use-button"
                    type="button"
                >
                    使う
                </button>
                        `
                }

            `;


            // =========================
            // パッシブアイテムは
            // 「使う」処理を行わない
            // =========================

            if (
                isPassiveItem
            ) {

                inventoryList.appendChild(
                    itemElement
                );

                return;

            }


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
                    // どんぴ車
                    // 6マス以内の好きなマスへ移動
                    // =========================

                    if (
                        Number(itemId) === 8
                    ) {

                        console.log(
                            "どんぴ車を使用しました"
                        );


                        // アイテムを1個消費

                        player.inventory.splice(
                            inventoryIndex,
                            1
                        );


                        // アイテム画面を閉じる

                        inventoryPopup.style.display =
                            "none";


                        // 6マス以内の停止可能マスを表示

                        window.highlightReachableSquaresWithin(
                            player,
                            6
                        );


                        return;

                    }


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
                        Number(itemId) === 1
                    ) {

                        diceCount = 2;

                    }


                    if (
                        Number(itemId) === 2
                    ) {

                        diceCount = 3;

                    }


                    if (
                        Number(itemId) === 3
                    ) {

                        diceCount = 4;

                    }


                    if (
                        Number(itemId) === 4
                    ) {

                        diceCount = 5;

                    }


                    if (
                        Number(itemId) === 5
                    ) {

                        diceCount = 6;

                    }


                    if (
                        Number(itemId) === 6
                    ) {

                        diceCount = 8;

                    }


                    if (
                        Number(itemId) === 7
                    ) {

                        diceCount = 10;

                    }


                    // =========================
                    // アイテムを1個消費
                    // =========================

                    player.inventory.splice(
                        inventoryIndex,
                        1
                    );


                    // =========================
                    // アイテム画面を閉じる
                    // =========================

                    inventoryPopup.style.display =
                        "none";


                    // =========================
                    // 通常移動
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
    // アイテム画面を表示
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

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


// =========================
// プレイヤー画像取得
// =========================

// マップ移動用の4方向スプライト
function getPlayerCharacterSprite(playerIndex) {

    const player =
        players[playerIndex];

    if (!player) {
        return "";
    }

    const character =
        PLAYER_CONTENTS[player.characterId];

    if (!character) {
        return "";
    }

    return character.sprite;
}


// プレイヤーアイコン表示用
function getPlayerCharacterIcon(playerIndex) {

    const player =
        players[playerIndex];

    if (!player) {
        return "";
    }

    const character =
        PLAYER_CONTENTS[player.characterId];

    if (!character) {
        return "";
    }

    return character.icon;
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
    getPlayerCharacterSprite(playerIndex);

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
    `url("${getPlayerCharacterIcon(playerIndex)}")`;

    element.dataset.direction =
        "down";

    element.style.backgroundPosition =
        "16.7% 0%";

}

// =========================
// HUD文字サイズ自動調整
// =========================

function fitHudText(
    element
) {

    if (!element) {
        return;
    }

    // CSSで指定している最大20pxへ戻す
    element.style.fontSize = "20px";

    let fontSize = 20;

    // レイアウトを確定させてから縮小
    while (
        element.scrollWidth > element.clientWidth &&
        fontSize > 9
    ) {

        fontSize -= 1;

        element.style.fontSize =
            `${fontSize}px`;

    }

}


// =========================
// HUD用プレイヤー名サイズ
// =========================

function updateHudPlayerName(
    element,
    name
) {

    fitHudText(
        element
    );

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

            return Math.floor(
    reward.amount *
    getMonsterInflationMultiplier()
);

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

const JOB_WAGE_RATE_PER_BOSS =
    0.20;

const JOB_WAGE_MAX_BOSS_COUNT =
    5;


// 現在のバイト単価割増率を取得

function getJobWageRate() {

    const wageBossCount =
        Math.min(
            bossDefeatedCount,
            JOB_WAGE_MAX_BOSS_COUNT
        );

    return (
        wageBossCount *
        JOB_WAGE_RATE_PER_BOSS
    );

}


// 現在のバイト単価を取得

function getCurrentJobWage(
    baseWage
) {

    const wageRate =
        getJobWageRate();

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

// ボス撃破数
let bossDefeatedCount = 0;

// =========================
// 通常モンスターのインフレ倍率
// =========================

function getMonsterInflationMultiplier() {

    return Math.pow(
        1.1,
        bossDefeatedCount
    );

}
// 現在のボスID
let currentBossId = 1;

// 現在のボスHP
let currentBossHP =
    BOSS_CONTENTS[
        currentBossId
    ].hp;

let bossFirstPlayer = null;

let bossRewardGiven = false;

let bossCounterEnabled = false;

// ボス報酬設定

const BOSS_DAMAGE_MULTIPLIER =
    5;

// =========================
// ボスカウンター無効判定
// =========================

function hasBossCounterImmunity(
    player
) {

    if (player.jobTurnsRemaining > 0) {
    return true;
}

        inventoryButton.disabled = true;
        rouletteButton.disabled = true;



    if (
        !player.inventory
    ) {

        return false;

    }

    return player.inventory.some(
        function (inventoryData) {

            // 通常アイテムは対象外
            if (
                typeof inventoryData !==
                "object"
            ) {

                return false;

            }

            const item =
                ITEM_CONTENTS[
                    inventoryData.id
                ];

            if (!item) {

                return false;

            }

            return (
                item.effectType ===
                "bossCounterImmunity"
            );

        }
    );

}


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
    // プレイヤーのカメラ移動と同じ方式で、
    // 余白・ズーム倍率を考慮して中央に合わせます。
    // =========================

    setTimeout(function () {

        const mapArea =
            document.querySelector(
                ".game-screen .map-area"
            );

        const mapBoard =
            document.getElementById(
                "mapBoard"
            );

        const bossNode =
            document.querySelector(
                `.map-node[data-square-id="${boss.id}"]`
            );

        if (
            !mapArea ||
            !mapBoard ||
            !bossNode
        ) {
            return;
        }


        // =========================
        // 現在のズーム倍率
        // =========================

        const zoom =
            typeof getMapZoomUI ===
            "function"
                ? getMapZoomUI()
                : 1;


        // =========================
        // マップの余白
        // =========================

        const paddingLeft =
            parseFloat(
                getComputedStyle(
                    mapArea
                ).paddingLeft
            ) || 0;

        const paddingTop =
            parseFloat(
                getComputedStyle(
                    mapArea
                ).paddingTop
            ) || 0;


        // =========================
        // ボスマスの中心座標
        // =========================

        const squareCenterX =
            bossNode.offsetLeft +
            bossNode.offsetWidth / 2;

        const squareCenterY =
            bossNode.offsetTop +
            bossNode.offsetHeight / 2;


        // =========================
        // マップ本体の中心座標
        // =========================

        const boardCenterX =
            mapBoard.clientWidth / 2;

        const boardCenterY =
            mapBoard.clientHeight / 2;


        // =========================
        // ズーム後のボスマス座標
        // =========================

        const zoomedSquareCenterX =
            boardCenterX +
            (
                squareCenterX -
                boardCenterX
            ) *
            zoom;

        const zoomedSquareCenterY =
            boardCenterY +
            (
                squareCenterY -
                boardCenterY
            ) *
            zoom;


        // =========================
        // 画面中央へ合わせる
        // =========================

        const targetScrollLeft =
            paddingLeft +
            zoomedSquareCenterX -
            mapArea.clientWidth / 2;

        const targetScrollTop =
            paddingTop +
            zoomedSquareCenterY -
            mapArea.clientHeight / 2;


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


        // =========================
        // 範囲内に収める
        // =========================

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
        // ボスマス中央へ移動
        // =========================

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
// 凱旋BGMが流れている場合だけ
// 冒険BGMを最初から再生
// =========================

if (
    !bossVictoryBGM.paused ||
    bossVictoryBGM.currentTime > 0
) {

    stopAllBGM();

    setupAdventureBGM();

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

    }, 1200);

}


// =========================
// ゲーム開始時の読み込み画面
// =========================

const GAME_LOADING_MIN_TIME = 1200;

const GAME_LOADING_ASSETS = [
    "images/map-background/①左上.png",
    "images/map-background/②右上.png",
    "images/map-background/③左下.png",
    "images/map-background/④右下.png",
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

// =========================
// マップデータ読み込み
// =========================

function loadMapData() {

    return new Promise(function (resolve, reject) {

        // すでに読み込み済みなら何もしない
        if (
            Array.isArray(window.mapData) &&
            window.mapData.length > 0
        ) {

            resolve();

            return;

        }

        const script =
            document.createElement("script");

        script.src = "map.js";

        script.onload =
            function () {

                if (
                    !Array.isArray(window.mapData) ||
                    window.mapData.length === 0
                ) {

                    reject(
                        new Error(
                            "マップデータが空です。"
                        )
                    );

                    return;

                }

                resolve();

            };

        script.onerror =
            function () {

                reject(
                    new Error(
                        "map.js の読み込みに失敗しました。"
                    )
                );

            };

        document.head.appendChild(script);

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

        <div>
            プレイヤー${index + 1}
        </div>

        <button
            type="button"
            class="player-character-button"
            data-player-index="${index}">

            <img
                class="player-character-preview"
                src="${PLAYER_CONTENTS[1].icon}"
                alt="キャラクター">

        </button>

        <input
            type="text"
            class="player-name"
            placeholder="名前を入力"
            maxlength="8"
        >

    </div>

`;



                                }

                                
                            ).join("")}


                            <button
                                id="confirmPlayers">
                                決定
                            </button>
                        `;

 // =========================
// キャラクター選択ボタン
// =========================

const characterButtons =
    document.querySelectorAll(
        ".player-character-button"
    );


characterButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                // キャラクター選択ウィンドウ
                const characterWindow =
                    document.createElement("div");

                characterWindow.className =
                    "player-character-window";

                characterWindow.innerHTML = `

                    <div
                        class="player-character-window-title">

                        キャラクターを選択

                    </div>

                    <div
                        class="player-character-list">

                        ${Object.entries(
                            PLAYER_CONTENTS
                        ).map(
                            function (
                                [id, character]
                            ) {

                                return `

                                    <button
                                        type="button"
                                        class="player-character-option"
                                        data-character-id="${id}">

                                        <img
                                            src="${character.icon}"
                                            alt="${character.name}">

                                        <span>
                                            ${character.name}
                                        </span>

                                    </button>

                                `;

                            }
                        ).join("")}

                    </div>

                `;

                document.body.appendChild(
                    characterWindow
                );


                // =========================
                // キャラクター選択
                // =========================

                const options =
                    characterWindow.querySelectorAll(
                        ".player-character-option"
                    );


                options.forEach(
                    function (option) {

                        option.addEventListener(
                            "click",
                            function () {

                                const characterId =
                                    Number(
                                        option.dataset.characterId
                                    );

                                const character =
                                    PLAYER_CONTENTS[
                                        characterId
                                    ];


                                // 選択したアイコンを表示
                                const preview =
                                    button.querySelector(
                                        ".player-character-preview"
                                    );

                                preview.src =
                                    character.icon;


                                // 選択したキャラクターIDを保存
                                button.dataset.characterId =
                                    characterId;


                                // ウィンドウを閉じる
                                characterWindow.remove();

                            }
                        );

                    }
                );


                // =========================
                // ウィンドウ外をクリック
                // =========================

                characterWindow.addEventListener(
                    "click",
                    function (event) {

                        if (
                            event.target ===
                            characterWindow
                        ) {

                            characterWindow.remove();

                        }

                    }
                );

            }
        );

    }
);


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
                                window.players = players;

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
    money: 10000,
    magicPower: 1000,
    bossDamage: 0,
    position: 139,   
    color: playerColors[index],
    characterId:
    Number(
        document.querySelectorAll(
            ".player-character-button"
        )[index].dataset.characterId || 1
    ),
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

players[index].inventory = [1];


// =========================
// 初期パッシブアイテム
// =========================

addItems(
    players[index],
    [],
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


// =========================
// 読み込み画面を表示
// =========================

showGameLoadingScreen();


// =========================
// マップデータを読み込む
// =========================

loadMapData()

    .then(function () {

        // =========================
        // マップデータ読み込み確認
        // =========================

        if (
            !Array.isArray(window.mapData) ||
            window.mapData.length === 0
        ) {

            throw new Error(
                "マップデータを確認できませんでした。"
            );

        }


        // =========================
        // 冒険BGM開始
        // =========================

        setupAdventureBGM();


        // =========================
        // 最初のボスを決定
        // =========================

        selectBossSquare();


        // =========================
        // 開始音
        // =========================

        startSound.currentTime = 0;
        startSound.play();


        // =========================
        // マップ画像などを読み込む
        // =========================

        return waitForGameAssets();

    })

    .then(function () {

        // =========================
        // ゲーム画面表示
        // =========================

        showGameScreen(
            players,
            maxTurns
        );

        if (window.onlineGame?.isOnline && typeof window.onlineGame.submitInitialState === 'function') {
            window.onlineGame.submitInitialState();
        }

// =========================
// ボス決定演出
// =========================

setTimeout(function () {

    showBossDestinationPopup(

        function () {

            // =========================
            // 初回ボス決定演出終了後
            // プレイヤーの位置へカメラを戻す
            // =========================

            setTimeout(function () {

                window.centerCurrentPlayerOnMap();

            }, 100);

        }

    );

}, 500);

    })

    .catch(function (error) {

        console.error(
            "ゲーム開始時の読み込みに失敗しました。",
            error
        );


        alert(
            "ゲームの読み込みに失敗しました。\n" +
            "ページを再読み込みして、もう一度お試しください。"
        );

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
    class="hud-destination-icon"
    src="${BOSS_MAP_ICON_PATH}"
    alt="ボス"
>
<span class="hud-destination-label">まであと</span>
<strong
    id="hudDestinationValue"
    class="hud-destination-value"
>0</strong>
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
                <button id="otherAssetButton" type="button" class="other-menu-item">資産を見る</button>
                <button id="otherSoundButton" type="button" class="other-menu-item">サウンド設定</button>
                <button id="otherMenuCloseButton" type="button" class="other-menu-close">閉じる</button>
            </div>

            <!-- =========================
                 資産一覧
            ========================= -->

            <div id="assetPopup" class="inventory-popup">
                <div class="inventory-popup-title">資産一覧</div>
                <div id="assetList" class="inventory-list"></div>
                <button id="assetCloseButton" class="inventory-close-button" type="button">閉じる</button>
            </div>

            <!-- =========================
                 資産購入
            ========================= -->

            <div id="assetPurchasePopup" class="inventory-popup">
                <div class="inventory-popup-title">
    <img
        src="images/map-icons/asset.png"
        alt=""
        class="asset-purchase-title-icon"
    >
    資産購入
</div>
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

    // Online bootstrap: the server stores one canonical initial state (host wins).
    // The browser only applies the server's snapshot; this does not yet move all game rules server-side.
    if (window.onlineGame?.isOnline && window.onlineGame.socket) {
        const onlineSocket = window.onlineGame.socket;
        let applyingOnlineInitialState = false;
        let lastAppliedOnlineRevision = 0;
        // Serialize every plain-data field on each player, not only the fields
        // that happened to be needed by the first synchronization patch.
        // Identity and presentation fields remain local/canonical.
        const cloneOnlineData = value => {
            try {
                const json = JSON.stringify(value);
                return json && json.length <= 30000 ? JSON.parse(json) : null;
            } catch (_) { return null; }
        };
        const buildOnlineSnapshot = () => ({
            players: players.map(player => {
                const data = cloneOnlineData(player) || {};
                delete data.color;
                delete data.id;
                return data;
            }),
            currentBossSquareId, previousBossSquareId, bossDefeatedCount, currentBossId,
            currentBossHP, bossRewardGiven, bossCounterEnabled, gameStarted,
            bossFirstPlayerIndex: players.indexOf(bossFirstPlayer),
            maouState: typeof window.getMaouOnlineState === 'function' ? window.getMaouOnlineState() : null,
            assetOwners: (typeof ASSET_CONTENTS !== 'undefined')
                ? Object.fromEntries(Object.entries(ASSET_CONTENTS).map(([id, asset]) => [id, asset?.owner ?? null]))
                : {}
        });
        const publishOnlineSnapshot = () => {
            if (!window.onlineGame?.isOnline || !onlineSocket.connected || applyingOnlineInitialState) return;
            // A movement path is already committed on the server. Do not let the
            // periodic compatibility snapshot overwrite its destination with an
            // intermediate animation position while the piece is moving.
            if (window.onlineGame._movementRequestPending || (typeof diceMovementState !== 'undefined' && diceMovementState.autoMoving)) return;
            onlineSocket.emit('game:state:publish', buildOnlineSnapshot(), response => {
                if (response && !response.ok && !response.error?.includes('自分の手番以外')) console.warn('[online] 状態同期:', response.error);
            });
        };
        window.onlineGame.publishSnapshot = publishOnlineSnapshot;
        const applyCanonicalInitialState = function (state) {
            if (!state || !Array.isArray(state.players) || state.players.length !== players.length) return;
            applyingOnlineInitialState = true;
            lastAppliedOnlineRevision = Number(state.revision) || lastAppliedOnlineRevision;
            state.players.forEach((source, index) => {
                const target = players[index];
                if (!target || !source) return;
                // Keep room identity and local rendering color stable, while applying
                // all JSON-safe gameplay fields (including newer fields added later).
                for (const [key, value] of Object.entries(source)) {
                    if (['id', 'name', 'characterId', 'color'].includes(key)) continue;
                    const cloned = cloneOnlineData(value);
                    if (cloned !== null) target[key] = cloned;
                }
                if (source.name) target.name = source.name;
                if (source.characterId != null) target.characterId = source.characterId;
            });
            currentBossSquareId = Number.isInteger(state.currentBossSquareId) ? state.currentBossSquareId : null;
            previousBossSquareId = Number.isInteger(state.previousBossSquareId) ? state.previousBossSquareId : null;
            if (Number.isInteger(state.bossFirstPlayerIndex) && state.bossFirstPlayerIndex >= 0 && state.bossFirstPlayerIndex < players.length) {
                bossFirstPlayer = players[state.bossFirstPlayerIndex];
            } else if (state.bossFirstPlayerIndex === -1) {
                bossFirstPlayer = null;
            }
            if (typeof state.gameStarted === 'boolean') gameStarted = state.gameStarted;
            bossDefeatedCount = Number(state.bossDefeatedCount) || 0;
            currentBossId = Number(state.currentBossId) || 1;
            currentBossHP = Number(state.currentBossHP) || 0;
            bossRewardGiven = Boolean(state.bossRewardGiven);
            bossCounterEnabled = Boolean(state.bossCounterEnabled);
            if (state.maouState && typeof window.applyMaouOnlineState === 'function') {
                window.applyMaouOnlineState(state.maouState);
            }
            if (typeof ASSET_CONTENTS !== 'undefined' && state.assetOwners && typeof state.assetOwners === 'object') {
                Object.entries(state.assetOwners).forEach(([id, owner]) => {
                    if (ASSET_CONTENTS[id]) ASSET_CONTENTS[id].owner = owner ?? null;
                });
            }
            currentPlayer = Number.isInteger(state.activePlayerIndex) ? state.activePlayerIndex : 0;
            currentTurn = Number(state.currentTurn) || 1;
            maxTurns = Number(state.maxTurns) || maxTurns;
            if (typeof renderMap === 'function') renderMap();
            if (typeof renderPlayers === 'function') renderPlayers();
            if (typeof renderTurn === 'function') renderTurn();
            players.forEach(player => { if (typeof updatePlayerStatusUI === 'function') updatePlayerStatusUI(player); });
            applyingOnlineInitialState = false;
            window.onlineGame.refreshTurnLock?.();
            console.info('[online] サーバーの初期ゲーム状態を適用しました。revision:', state.revision);
        };
        onlineSocket.on('game:state:init', applyCanonicalInitialState);
        onlineSocket.on('game:state:snapshot', state => {
            if (!state || !Array.isArray(state.players) || state.players.length !== players.length) return;
            const revision = Number(state.revision) || 0;
            if (revision && revision <= lastAppliedOnlineRevision) return;
            applyCanonicalInitialState(state);
            lastAppliedOnlineRevision = revision;
        });
        onlineSocket.on('connect', () => {
            if (!window.onlineGame?.isOnline) return;
            onlineSocket.emit('game:state:request', {}, response => {
                if (response?.ok && response.state) applyCanonicalInitialState(response.state);
            });
            window.onlineGame.refreshTurnLock?.();
        });
        window.onlineGame.submitInitialState = function () {
            const payload = {
                maxTurns,
                currentBossSquareId,
                previousBossSquareId,
                bossDefeatedCount,
                currentBossId,
                currentBossHP,
                bossRewardGiven,
                bossCounterEnabled,
                gameStarted,
                bossFirstPlayerIndex: players.indexOf(bossFirstPlayer),
                maouState: typeof window.getMaouOnlineState === 'function' ? window.getMaouOnlineState() : null,
                assetOwners: (typeof ASSET_CONTENTS !== 'undefined')
                    ? Object.fromEntries(Object.entries(ASSET_CONTENTS).map(([id, asset]) => [id, asset?.owner ?? null]))
                    : {},
                players: players.map(player => {
                    const data = cloneOnlineData(player) || {};
                    delete data.color;
                    delete data.id;
                    return data;
                })
            };
            let attempts = 0;
            const send = () => {
                if (!onlineSocket.connected) {
                    if (attempts++ < 40) return setTimeout(send, 250);
                    console.error('[online] 初期状態を送信できませんでした: サーバー未接続');
                    return;
                }
                onlineSocket.emit('game:state:initialize', payload, response => {
                    if (response?.ok && response.state) return applyCanonicalInitialState(response.state);
                    if (response?.waiting && attempts++ < 40) return setTimeout(send, 250);
                    console.error('[online] 初期状態の同期に失敗:', response?.error || '不明なエラー');
                });
            };
            send();
        };
    }

    // Online sync hooks: server-authoritative dice and movement-path replication.
    if (window.onlineGame && window.onlineGame.isOnline && window.onlineGame.socket) {
        const onlineSocket = window.onlineGame.socket;
        window.onlineGame.applyRemoteMove = function (path, playerIndex = currentPlayer, tries = 25) {
            const targetPlayer = players[playerIndex];
            if (!targetPlayer || !Array.isArray(path) || !path.length) {
                console.warn('[online] 不正な移動経路を受信しました。');
                return;
            }
            // Remote clients do not run the local interactive path-selection flow.
            // Apply the confirmed server path directly so a missing local diceMovementState
            // cannot prevent another player's move from appearing.
            window.onlineGame._applyingRemoteMove = true;
            targetPlayer.position = path[path.length - 1];
            // The remote client has no local route-selection flow to consume these steps.
            // Clear them as soon as the server-confirmed movement is applied.
            remainingSteps = 0;
            if (Number.isInteger(playerIndex)) currentPlayer = playerIndex;
            if (typeof renderMap === 'function') renderMap();
            if (typeof renderPlayers === 'function') renderPlayers();
            if (typeof updatePlayerStatusUI === 'function') updatePlayerStatusUI(targetPlayer);
            if (typeof renderTurn === 'function') renderTurn();
            if (typeof window.centerCurrentPlayerOnMap === 'function') {
                try { window.centerCurrentPlayerOnMap(targetPlayer); } catch (_) {}
            }
            window.onlineGame._applyingRemoteMove = false;
            window.onlineGame.refreshTurnLock?.();
        };
        let remoteDiceRoll = null;
        onlineSocket.on('game:dice:rolling', data => {
            if (!data || data.playerId === onlineSocket.id || data.playerIndex !== currentPlayer) return;
            // 出目はまだ受信せず、数字が回る演出だけを開始する。
            remoteDiceRoll = { playerId: data.playerId, playerIndex: data.playerIndex };
            showDiceRoulette(null, null, { waitForReveal: true });
        });
        onlineSocket.on('game:dice:result', data => {
            if (!data || data.playerId === onlineSocket.id) return;
            if (!remoteDiceRoll || remoteDiceRoll.playerId !== data.playerId) return;
            revealRemoteDiceRoulette(data.result, () => {
                // The active player's client selects the route. Other clients wait for
                // the server-confirmed game:move:path instead of opening a second route UI.
                remainingSteps = data.result;
                renderTurn();
                remoteDiceRoll = null;
            });
        });
        onlineSocket.on('game:turn:update', data => {
            if (!data || !Number.isInteger(data.activePlayerIndex)) return;
            currentPlayer = data.activePlayerIndex;
            currentTurn = Number(data.currentTurn) || currentTurn;
            remainingSteps = 0;
            if (typeof renderTurn === 'function') renderTurn();
            if (typeof renderMap === 'function') renderMap();
            players.forEach(player => { if (typeof updatePlayerStatusUI === 'function') updatePlayerStatusUI(player); });
            window.onlineGame.refreshTurnLock?.();
        });
        onlineSocket.on('game:move:path', data => {
            if (!data || data.playerId === onlineSocket.id) return;
            window.onlineGame.applyRemoteMove(data.path, data.playerIndex);
        });
    }

    // Online turn lock: only the socket owning the active player may interact.
    // This UI guard complements server-side turn validation; it is not the security boundary.
    if (window.onlineGame?.isOnline && window.onlineGame.socket) {
        const onlineSocket = window.onlineGame.socket;
        let turnLockBanner = null;
        const isLocalActivePlayer = () => {
            const online = window.onlineGame;
            const active = online?.startData?.players?.[currentPlayer];
            return Boolean(online?.isOnline && onlineSocket.connected && active?.id === onlineSocket.id);
        };
        const refreshTurnLock = () => {
            const allowed = isLocalActivePlayer();
            document.documentElement.classList.toggle('online-not-my-turn', !allowed);
            if (!turnLockBanner) {
                turnLockBanner = document.createElement('div');
                turnLockBanner.id = 'onlineTurnLockBanner';
                turnLockBanner.textContent = 'ほかのプレイヤーの手番です';
                turnLockBanner.style.cssText = 'position:fixed;z-index:99990;top:8px;left:50%;transform:translateX(-50%);padding:8px 14px;border-radius:8px;background:#202a38;color:#fff;border:1px solid #d5b76b;font-weight:700;box-shadow:0 3px 12px #0005;pointer-events:none;display:none';
                document.body.appendChild(turnLockBanner);
            }
            turnLockBanner.style.display = allowed ? 'none' : 'block';
        };
        window.onlineGame.refreshTurnLock = refreshTurnLock;

        // Mirror visible modal/popup markup so every participant sees the same
        // decision screen. Replicas are read-only; the global turn lock prevents
        // non-active clients from interacting with them.
        const getVisibleOnlinePopupMarkup = () => {
            // Capture top-level overlays as well as known nested game dialogs. This
            // covers the inventory, asset/magic shops, event prompts and the newer
            // battle UI without duplicating a popup that is already inside a captured root.
            const selector = [
                'body > *', '#inventoryPopup', '#battlePopup', '#magicShopPopup',
                '#battleUIRoot', '.inventory-popup', '.other-menu-popup',
                '.item-action-popup', '.popup-overlay', '.event-popup', '.game-popup',
                '.battle-popup', '.battle-new-popup', '.magic-shop-popup',
                '.asset-popup', '.shop-popup', '.boss-counter-popup',
                '.boss-destination-popup', '[role="dialog"]', '[aria-modal="true"]'
            ].join(',');
            const seen = new Set();
            const roots = [];
            const candidates = [...document.querySelectorAll(selector)];
            for (const element of candidates) {
                if (element.id === 'onlineTurnLockBanner' || element.id === 'onlineRemoteUiMirror' ||
                    element.closest('#onlineRemoteUiMirror') || seen.has(element)) continue;
                const style = window.getComputedStyle(element);
                if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) continue;
                const looksLikePopup = element.matches('body > *')
                    ? (style.position === 'fixed' && Number(style.zIndex || 0) >= 10)
                    : true;
                if (!looksLikePopup) continue;
                // If a parent overlay is already selected, its clone includes this node.
                if (candidates.some(parent => parent !== element && parent.contains(element) && seen.has(parent))) continue;
                seen.add(element);
                const clone = element.cloneNode(true);
                const originalFields = element.querySelectorAll('input, textarea, select');
                const clonedFields = clone.querySelectorAll('input, textarea, select');
                originalFields.forEach((field, index) => {
                    const copy = clonedFields[index];
                    if (!copy) return;
                    if (field.tagName === 'SELECT') {
                        [...copy.options].forEach((option, i) => option.selected = Boolean(field.options[i]?.selected));
                    } else if (field.type === 'checkbox' || field.type === 'radio') {
                        copy.checked = field.checked;
                        if (field.checked) copy.setAttribute('checked', 'checked'); else copy.removeAttribute('checked');
                    } else {
                        copy.setAttribute('value', field.value);
                        if (field.tagName === 'TEXTAREA') copy.textContent = field.value;
                    }
                });
                clone.querySelectorAll('script, iframe, object, embed').forEach(node => node.remove());
                clone.querySelectorAll('*').forEach(node => {
                    [...node.attributes].forEach(attr => {
                        if (/^on/i.test(attr.name) || ((attr.name === 'href' || attr.name === 'src') && /^\s*javascript:/i.test(attr.value))) node.removeAttribute(attr.name);
                    });
                });
                [...clone.attributes].forEach(attr => {
                    if (/^on/i.test(attr.name) || ((attr.name === 'href' || attr.name === 'src') && /^\s*javascript:/i.test(attr.value))) clone.removeAttribute(attr.name);
                });
                roots.push(clone.outerHTML);
            }
            return roots.join('');
        };
        let lastPublishedUiMarkup = null;
        let uiPublishQueued = false;
        const publishUiSnapshot = () => {
            uiPublishQueued = false;
            if (!isLocalActivePlayer() || !onlineSocket.connected) return;
            const html = getVisibleOnlinePopupMarkup();
            if (html === lastPublishedUiMarkup) return;
            if (html.length > 100000) {
                console.warn('[online] ポップアップが大きすぎるため画面同期を省略しました。');
                return;
            }
            lastPublishedUiMarkup = html;
            onlineSocket.emit('game:ui:sync', { html }, response => {
                if (response && !response.ok) console.warn('[online] 画面同期:', response.error);
            });
        };
        const queueUiSnapshot = () => {
            if (uiPublishQueued) return;
            uiPublishQueued = true;
            setTimeout(publishUiSnapshot, 80);
        };
        const uiObserver = new MutationObserver(queueUiSnapshot);
        uiObserver.observe(document.body, { childList: true, subtree: true, attributes: true, characterData: true });
        onlineSocket.on('game:ui:sync', payload => {
            if (!payload || typeof payload.html !== 'string' || payload.html.length > 100000 || payload.playerId === onlineSocket.id) return;
            let mirror = document.getElementById('onlineRemoteUiMirror');
            if (!mirror) {
                mirror = document.createElement('div');
                mirror.id = 'onlineRemoteUiMirror';
                mirror.style.cssText = 'position:fixed;inset:0;z-index:99989;pointer-events:none;overflow:visible';
                document.body.appendChild(mirror);
            }
            mirror.replaceChildren();
            if (!payload.html) return;
            const template = document.createElement('template');
            template.innerHTML = payload.html;
            template.content.querySelectorAll('script, iframe, object, embed').forEach(node => node.remove());
            template.content.querySelectorAll('*').forEach(node => {
                [...node.attributes].forEach(attr => {
                    if (/^on/i.test(attr.name) || ((attr.name === 'href' || attr.name === 'src') && /^\s*javascript:/i.test(attr.value))) node.removeAttribute(attr.name);
                });
            });
            mirror.appendChild(template.content.cloneNode(true));
        });
        onlineSocket.on('game:turn:update', () => {
            lastPublishedUiMarkup = null;
            const mirror = document.getElementById('onlineRemoteUiMirror');
            if (mirror) mirror.replaceChildren();
            queueUiSnapshot();
        });
        onlineSocket.on('connect', queueUiSnapshot);

        const blockedTarget = () => !isLocalActivePlayer();
        ['click', 'dblclick', 'pointerdown', 'change', 'submit', 'keydown'].forEach(type => {
            document.addEventListener(type, event => {
                if (!blockedTarget(event.target)) return;
                event.preventDefault();
                event.stopPropagation();
                if (typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation();
            }, true);
        });
        onlineSocket.on('connect', refreshTurnLock);
        onlineSocket.on('disconnect', refreshTurnLock);
        setTimeout(refreshTurnLock, 0);
    }

    // Compatibility snapshot heartbeat: reflects local game mutations to every peer.
    // The server rejects publications from clients that do not own the active turn.
    if (window.onlineGame?.isOnline && window.onlineGame.socket) {
        setInterval(() => window.onlineGame?.publishSnapshot?.(), 500);
    }

    window.getCurrentTurn = function () {
    return currentTurn;
    };

    function notifyOnlineTurnAdvanced() {
        const online = window.onlineGame;
        if (!online?.isOnline || !online.socket?.connected || !Array.isArray(online.startData?.players) || !players.length) return;
        const previousIndex = (currentPlayer + players.length - 1) % players.length;
        const previousOnlinePlayer = online.startData.players[previousIndex];
        if (previousOnlinePlayer?.id !== online.socket.id) return;
        online.socket.emit('game:turn:end', {}, response => {
            if (!response?.ok) console.warn('[online] ターン同期に失敗:', response?.error);
        });
    }

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
    💰 ${formatG(
        calculateMagicCost(
            player,
            magic,
            {
                magicPowerRate: 1
            }
        )
    )}G
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
    battleState,
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
    💰 ${formatG(
        calculateMagicCost(
            player,
            magic,
            battleState
        )
    )}G
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
        // マップ背景
        // =========================

        const background =
            document.createElement(
                "div"
            );

        background.className =
            "map-background";


        const backgroundImages = [
            "images/map-background/①左上.png",
            "images/map-background/②右上.png",
            "images/map-background/③左下.png",
            "images/map-background/④右下.png"
        ];


        backgroundImages.forEach(
            function (imagePath) {

                const image =
                    document.createElement(
                        "img"
                    );

                image.className =
                    "map-background-tile";

                image.src =
                    imagePath;

                image.alt = "";

                background.appendChild(
                    image
                );

            }
        );


        mapBoard.appendChild(
            background
        );


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
         `0 0 ${mapBoard.clientWidth} ${mapBoard.clientHeight}`
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


                        // =========================
// 道の枠線
// =========================

const border =
    document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
    );

border.setAttribute(
    "x1",
    square.x
);

border.setAttribute(
    "y1",
    square.y
);

border.setAttribute(
    "x2",
    nextSquare.x
);

border.setAttribute(
    "y2",
    nextSquare.y
);

border.classList.add(
    "map-line-border"
);

svg.appendChild(
    border
);


// =========================
// 道本体
// =========================

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


drawShortestPathToBoss(
    svg
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

// =========================
// マス詳細表示
// =========================
// クリックから0.3秒待って表示。
// その間にダブルクリックされた場合は
// 詳細表示をキャンセルする。
// =========================

let squareDetailClickTimer =
    null;

node.addEventListener(
    "click",
    function () {

        // 直前の詳細表示予約を解除
        if (
            squareDetailClickTimer !==
            null
        ) {

            clearTimeout(
                squareDetailClickTimer
            );

        }

        // 0.18秒後に詳細表示
        squareDetailClickTimer =
            setTimeout(
                function () {

                    if (
                        typeof window.showSquareDetail !==
                        "function"
                    ) {
                        return;
                    }

                    window.showSquareDetail(
                        square
                    );

                    squareDetailClickTimer =
                        null;

                },
                180
            );

    }
);


// =========================
// ダブルクリック時
// 詳細表示をキャンセル
// =========================

node.addEventListener(
    "dblclick",
    function () {

        if (
            squareDetailClickTimer !==
            null
        ) {

            clearTimeout(
                squareDetailClickTimer
            );

            squareDetailClickTimer =
                null;

        }

    }
);


    node.style.left =
    `${square.x}px`;


    node.style.top =
    `${square.y}px`;


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


                        const playerIndex =
                            players.indexOf(player);


// =========================
// プレイヤーの表示状態
// =========================
//
// 現在ターンのプレイヤー
// → 通常表示
//
// それ以外
// → 薄く・小さく表示
//

if (
    playerIndex === currentPlayer
) {

    piece.className =
        "player-piece player-sprite player-piece-current";

} else {

    piece.className =
        "player-piece player-sprite player-piece-other";

}


// =========================
// 現在プレイヤー番号を保持
// =========================

piece.dataset.playerIndex =
    playerIndex;


piece.setAttribute(
    "aria-label",
    player.name
);

                        piece.draggable = false;

                        updatePlayerSprite(
                            piece,
                            playerIndex,
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
// 作り直すため、ここでもUIを復元します.
//

if (
    playerIndex ===
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

let mapPinchStartDistance = 0;
let mapPinchStartZoom = 1;
let mapPinchInitialized = false;


// =========================
// 2点間の距離を取得
// =========================

function getMapPinchDistance(
    touch1,
    touch2
) {

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


// =========================
// ピンチズーム設定
// =========================

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

            if (
                event.touches.length !==
                2
            ) {

                return;

            }


            mapPinchStartDistance =
                getMapPinchDistance(
                    event.touches[0],
                    event.touches[1]
                );


            mapPinchStartZoom =
                typeof getMapZoomUI ===
                "function"
                    ? getMapZoomUI()
                    : 1;

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

            if (
                event.touches.length !==
                2
            ) {

                return;

            }


            const currentDistance =
                getMapPinchDistance(
                    event.touches[0],
                    event.touches[1]
                );


            if (
                mapPinchStartDistance <=
                0
            ) {

                return;

            }


            const zoomRatio =
                currentDistance /
                mapPinchStartDistance;


            const newZoom =
                mapPinchStartZoom *
                zoomRatio;


            // =========================
            // UI側のズーム管理を使用
            // =========================

            if (
                typeof setMapZoomUI ===
                "function"
            ) {

                setMapZoomUI(
                    newZoom
                );

            }

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

            if (
                event.touches.length <
                2
            ) {

                mapPinchStartDistance =
                    0;

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
// PC：マップ左ドラッグ移動
// =========================

if (
    typeof setupMapMouseDragUI ===
    "function"
) {

    setupMapMouseDragUI();

}


// =========================
// ピンチズーム開始
// =========================

setupMapPinchZoom();


// =========================
// PC：マップ左ドラッグ移動
// =========================

if (
    typeof setupMapMouseDragUI ===
    "function"
) {

    setupMapMouseDragUI();

}

if (
    typeof setupMapMouseWheelZoomUI ===
    "function"
) { 

    setupMapMouseWheelZoomUI();

}

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
// 資産タイプ名
// =========================

const currentSquare =
    mapData.find(
        function (square) {

            return square.id ===
                player.position;

        }
    );

const assetTypeNames =
    (currentSquare?.typeIds || [])
        .map(
            function (typeId) {

                const assetBox =
                    ASSET_BOXES[typeId];

                return assetBox
                    ? assetBox.name
                    : null;

            }
        )
        .filter(
            function (name) {

                return name;

            }
        );

const assetTypeDisplay =
    document.createElement("div");

assetTypeDisplay.className =
    "asset-purchase-type-name";

assetTypeDisplay.textContent =
    assetTypeNames.join(" / ");

list.appendChild(
    assetTypeDisplay
);

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
// 上部バナーと同じプレイヤー画像を使用。
// 正面の顔付近だけを切り出して表示します。
// =========================

let ownerIcon = "";

if (
    asset.owner !== null &&
    asset.owner !== undefined
) {

    ownerIcon = `
        <div
            class="asset-owner-player-icon"
            style="
                background-image: url('${getPlayerCharacterIcon(asset.owner)}');
            "
            aria-label="プレイヤー${asset.owner + 1}"
        ></div>
    `;

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

                           const eventPopup =
    document.getElementById(
        "eventPopup"
    );

if (eventPopup) {
    eventPopup.classList.add(
        "gold-insufficient-popup"
    );
}

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

        if (eventPopup) {
            eventPopup.classList.remove(
                "gold-insufficient-popup"
            );
        }

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

// 購入SE
buttonSound.currentTime = 0;
buttonSound.play().catch(function (error) {
    console.error(
        "資産購入SEの再生に失敗しました:",
        error
    );
});

player.money -= asset.price;

updatePlayerStatusUI(player);


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
    <img
        src="images/map-icons/asset.png"
        alt="資産"
    >
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

        setBGMVolume(
            volume
        );

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

rouletteSound.volume =
    volume;

roulettestopSound.volume =
    volume;

kamenSound.volume =
    volume;

secondFormSound.volume =
    volume;

warpSound.volume =
    volume;

    tatakiSound.volume =
        volume;

seVolumeValue.textContent =
    `${this.value}%`;

};


   // =========================
// プレイヤーカードをタップしたら
// そのプレイヤーがいるマスを中央へ
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

    if (
        typeof setMapZoomUI ===
        "function"
    ) {

        setMapZoomUI(1);

    }

}


                // =========================
                // プレイヤーがいるマスを中央へ
                // =========================

                centerPlayerOnMap(
                    playerIndex
                );
                
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

window.renderPlayers = renderPlayers;
window.renderMap = renderMap;

// =========================
// プレイヤーステータス表示更新
// =========================

function updatePlayerStatusUI(player) {

    if (!player) {
        return;
    }

    // =========================
    // 上部バナー：現在プレイヤーのみ
    // =========================

    if (player === players[currentPlayer]) {

        const hudGoldValue =
            document.getElementById(
                "hudGoldValue"
            );

        if (hudGoldValue) {

    hudGoldValue.textContent =
        `${formatG(player.money)}G`;

    fitHudText(
        hudGoldValue
    );

}

const hudMagicValue =
    document.getElementById(
        "hudMagicValue"
    );

if (hudMagicValue) {

    hudMagicValue.textContent =
        formatG(player.magicPower);

    fitHudText(
        hudMagicValue
    );

}

    }


    
    // =========================
    // 戦闘画面
    // =========================

    const battlePopup =
        document.getElementById(
            "battlePopup"
        );

    const battlePlayerStats =
        document.getElementById(
            "battlePlayerStats"
        );

    if (
        player === players[currentPlayer] &&
        battlePopup &&
        battlePlayerStats &&
        battlePopup.style.display !== "none"
    ) {

        battlePlayerStats.innerHTML =
            `💰${formatG(player.money)}G<br>` +
            `🔮魔力 ${player.magicPower}`;

    }

    // =========================
    // ショップ画面
    // =========================

    const shopMoney =
        document.getElementById(
            "shopMoney"
        );

    if (
        player === players[currentPlayer] &&
        shopMoney &&
        shopMoney.style.display !== "none"
    ) {
        shopMoney.textContent =
            `💰 所持金：${formatG(player.money)}G`;
    }

    const magicShopMoney =
        document.getElementById(
            "magicShopMoney"
        );

    if (
        player === players[currentPlayer] &&
        magicShopMoney &&
        magicShopMoney.style.display !== "none"
    ) {
        magicShopMoney.textContent =
            `💰 所持金：${formatG(player.money)}G`;
    }

    const powerShopMoney =
        document.getElementById(
            "powerShopMoney"
        );

    if (
        player === players[currentPlayer] &&
        powerShopMoney &&
        powerShopMoney.style.display !== "none"
    ) {
        powerShopMoney.textContent =
            `💰 所持金：${formatG(player.money)}G`;
    }

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

    turnDisplay.textContent =
        `Turn ${currentTurn}/${maxTurns}`;

    fitHudText(
        turnDisplay
    );

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
    // プレイヤーステータス表示更新
    // =========================

    updatePlayerStatusUI(player);


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

    fitHudText(
        hudDestinationValue
    );

}

fitHudDestinationLabels();

    if (destinationInfo) {

        destinationInfo.dataset.distance =
            String(bossDistance);

    }

}

    window.updatePlayerStatusUI =
    updatePlayerStatusUI;


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
                `${arrowX}px`;

               arrow.style.top =
                `${arrowY}px`;


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

        refreshShortestPathToBoss();

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
                "dblclick",
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

            node.classList.add("reachable-stop-highlight");

            node.style.cursor =
                "pointer";


            // =========================
            // 強調された停止マスをタップ
            // =========================

           const clickHandler =
    function () {

        // =========================
        // マス詳細を閉じる
        // =========================

        if (
            typeof hideSquareDetail ===
            "function"
        ) {

            hideSquareDetail();

        }


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

                    if (window.onlineGame?.isOnline && window.onlineGame.socket?.connected &&
                        !window.onlineGame._applyingRemoteMove) {
                        window.onlineGame._movementRequestPending = true;
                        window.onlineGame.socket.emit('game:move:request', { path }, response => {
                            window.onlineGame._movementRequestPending = false;
                            if (!response?.ok) {
                                alert(response?.error || '移動を同期できませんでした。');
                                showDiceMovementArrows();
                                return;
                            }
                            moveDicePlayerToSquare(player, path);
                        });
                    } else {
                        moveDicePlayerToSquare(player, path);
                    }

                };


            node.addEventListener(
                "dblclick",
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

           node.classList.add("reachable-stop-highlight");

            node.style.cursor =
                "pointer";


            // =========================
            // タップできることを表示
            // =========================

            node.addEventListener(
                "dblclick",
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

                node.classList.remove("reachable-stop-highlight");
            

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

            node.classList.add("reachable-stop-highlight");

            node.style.cursor =
                "pointer";


            // =========================
            // タップ
            // =========================

           node.addEventListener(
    "dblclick",
    function () {

        // =========================
        // マス詳細を閉じる
        // =========================

        if (
            typeof hideSquareDetail ===
            "function"
        ) {

            hideSquareDetail();

        }


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

        // =========================
        // 1マス移動した後の残り歩数
        // =========================

        remainingSteps =
            remainingPath.length - index;

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
// ボスマスまでの最短ルートを取得
// =========================

function getShortestPathToBoss(
    startPosition
) {

    if (
        currentBossSquareId === null ||
        currentBossSquareId === undefined
    ) {

        return [];

    }

    // =========================
// 外部から最短ルートを取得できるようにする
// =========================

window.getShortestPathToBoss =
    function (
        startPosition
    ) {

        return getShortestPathToBoss(
            startPosition
        );

    };


    if (
        startPosition ===
        currentBossSquareId
    ) {

        return [
            startPosition
        ];

    }


    const queue = [
        startPosition
    ];


    const visited =
        new Set();

    visited.add(
        startPosition
    );


    const previous =
        new Map();


    while (
        queue.length > 0
    ) {

        const currentPosition =
            queue.shift();


        const options =
            getConnectedOptions(
                currentPosition
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


            visited.add(
                nextPosition
            );


            previous.set(
                nextPosition,
                currentPosition
            );


            // =========================
            // ボス到達
            // =========================

            if (
                nextPosition ===
                currentBossSquareId
            ) {

                const path = [];

                let position =
                    currentBossSquareId;


                path.push(
                    position
                );


                while (
                    position !==
                    startPosition
                ) {

                    position =
                        previous.get(
                            position
                        );


                    if (
                        position === undefined
                    ) {

                        return [];

                    }


                    path.push(
                        position
                    );

                }


                path.reverse();


                return path;

            }


            queue.push(
                nextPosition
            );

        }

    }


    return [];

}

// =========================
// 最短ルートだけ再描画
// マップ本体は再描画しない
// =========================

function refreshShortestPathToBoss() {

    const svg =
        document.querySelector(
            "#mapBoard .map-lines"
        );

    if (!svg) {
        return;
    }

    svg
        .querySelectorAll(
            ".map-shortest-path-line"
        )
        .forEach(
            function (line) {
                line.remove();
            }
        );

    drawShortestPathToBoss(svg);

}

// =========================
// ボスまでの最短ルートを
// マップ上に描画
// =========================

function drawShortestPathToBoss(
    svg
) {

    if (!svg) {

        return;

    }


    if (
        typeof currentPlayer !==
        "number"
    ) {

        return;

    }


    if (
        !players ||
        !players[currentPlayer]
    ) {

        return;

    }


    const player =
        players[currentPlayer];


    const path =
        getShortestPathToBoss(
            player.position
        );


    if (
        path.length < 2
    ) {

        return;

    }


    // =========================
    // 最短ルートの各区間を描画
    // =========================

    for (
        let i = 0;
        i < path.length - 1;
        i++
    ) {

        const fromSquare =
            mapData.find(
                function (square) {

                    return square.id ===
                        path[i];

                }
            );


        const toSquare =
            mapData.find(
                function (square) {

                    return square.id ===
                        path[i + 1];

                }
            );


        if (
            !fromSquare ||
            !toSquare
        ) {

            continue;

        }


        const line =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "line"
            );


        line.setAttribute(
            "x1",
            fromSquare.x
        );


        line.setAttribute(
            "y1",
            fromSquare.y
        );


        line.setAttribute(
            "x2",
            toSquare.x
        );


        line.setAttribute(
            "y2",
            toSquare.y
        );


        line.classList.add(
            "map-shortest-path-line"
        );


        svg.appendChild(
            line
        );

    }

}


// =========================
// 現在プレイヤーの
// 最短ルートだけを更新
// =========================

function refreshShortestPathToBoss() {

    const svg =
        document.querySelector(
            "#mapBoard .map-lines"
        );


    if (!svg) {

        return;

    }


    // =========================
    // 前プレイヤーのルートを削除
    // =========================

    svg
        .querySelectorAll(
            ".map-shortest-path-line"
        )
        .forEach(
            function (line) {

                line.remove();

            }
        );


    // =========================
    // 現在プレイヤーのルートを描画
    // =========================

    drawShortestPathToBoss(
        svg
    );

}

// =========================    
// refreshShortestPathToBoss
// inventory.js から呼び出せるように公開
// =========================

window.refreshShortestPathToBoss =
    function () {

        return refreshShortestPathToBoss();

    };

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

            refreshShortestPathToBoss();

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
                 `${arrowX}px`;

                arrow.style.top =
                 `${arrowY}px`;

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

    
inventoryButton.disabled =
    false;


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

            const player = players[currentPlayer];
            const beginDiceRoll = function (number, onReveal) {
                // 魔王出現条件を確認
                window.updateEncounterCondition();
                showDiceRoulette(number, function () {
                    remainingSteps = number;
                    renderTurn();
                    movePlayer(player, number);
                }, { onReveal });
            };

            if (window.onlineGame?.isOnline && window.onlineGame.socket?.connected) {
                window.onlineGame.socket.emit('game:dice:request', {}, response => {
                    if (!response?.ok) {
                        rouletteButton.disabled = false;
                        inventoryButton.disabled = false;
                        alert(response?.error || 'サイコロ結果を取得できませんでした。');
                        return;
                    }
                    beginDiceRoll(response.result, () => {
                        window.onlineGame.socket.emit('game:dice:reveal', {}, revealResponse => {
                            if (!revealResponse?.ok) console.warn('[online] サイコロ結果の公開に失敗:', revealResponse?.error);
                        });
                    });
                });
                return;
            }

            beginDiceRoll(Math.floor(Math.random() * 6) + 1);
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

    popup.style.display = "block";
    popup.style.zIndex = "99999";


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
    // ルーレット回転中SE
    // 0～2秒をループ
    // =========================

    rouletteSound.pause();

rouletteSound.currentTime =
    0;

rouletteSound
    .play()
        .catch(function (error) {

            console.error(
                "ルーレット回転中SEの再生に失敗しました:",
                error
            );

        });


    // =========================
    // 表示
    // =========================

    roulette.style.display =
        "block";

    roulette.classList.add(
        "spinning"
    );


    // =========================
    // 回転中の金額
    // =========================

    const interval =
        setInterval(
            function () {

                const setting =
                    MONEY_CONTENTS[1];

                const candidates =
                    setting.rewards;

                const randomReward =
                    candidates[
                        Math.floor(
                            Math.random() *
                            candidates.length
                        )
                    ];

                number.textContent =
                    `${formatG(randomReward.amount)}G`;

            },
            80
        );


    // =========================
    // 0～2秒ループ
    // =========================

    function loopDiceSound() {

    if (
        rouletteSound.currentTime >= 2
    ) {

        rouletteSound.currentTime =
            0;

    }

}


rouletteSound.addEventListener(
    "timeupdate",
    loopDiceSound
);


    // =========================
    // クリックで停止
    // =========================

    function stopRoulette() {

        clearInterval(
            interval
        );


        roulette.onclick =
            null;


        rouletteSound.removeEventListener(
    "timeupdate",
    loopDiceSound
);


        // =========================
        // 回転中SE停止
        // =========================

        rouletteSound.pause();

        rouletteSound.currentTime = 0;


        // =========================
        // 最終結果
        // =========================

        number.textContent =
            `${formatG(reward)}G`;


        roulette.classList.remove(
            "spinning"
        );


        // =========================
        // 決定音
        // =========================

        roulettestopSound.pause();

roulettestopSound.currentTime =
    0;

roulettestopSound
    .play()
            .catch(function (error) {

                console.error(
                    "ルーレット停止SEの再生に失敗しました:",
                    error
                );

                finishGoldRoulette();

            });


        // =========================
        // 決定音終了後
        // =========================

        roulettestopSound.onended =
    function () {

        roulettestopSound.onended =
            null;

        finishGoldRoulette();

    };

    }


    // =========================
    // ルーレット終了
    // =========================

    function finishGoldRoulette() {

        roulette.style.display =
            "none";


        if (
            callback
        ) {

            callback();

        }

    }


    roulette.onclick =
        stopRoulette;

}



// =========================
// サイコロルーレット演出
// =========================

function showDiceRoulette(
    result,
    callback,
    options = {}
) {
    let finalResult = result;

    const roulette =
        document.getElementById(
            "diceRoulette"
        );

    const number =
        document.getElementById(
            "diceRouletteNumber"
        );


    // =========================
    // ルーレット回転中SE
    // 0～2秒をループ
    // =========================

    diceSound.pause();

    diceSound.currentTime =
        0;

    diceSound
        .play()
        .catch(function (error) {

            console.error(
                "ルーレット回転中SEの再生に失敗しました:",
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

    const interval =
        setInterval(
            function () {

                const randomNumber =
                    Math.floor(
                        Math.random() * 6
                    ) + 1;

                number.textContent =
                    randomNumber;

            },
            80
        );


    // =========================
    // 0～2秒ループ
    // =========================

    function loopDiceSound() {

        if (
            diceSound.currentTime >= 0.83
        ) {

            diceSound.currentTime =
                0;

        }

    }


    diceSound.addEventListener(
        "timeupdate",
        loopDiceSound
    );


    // =========================
    // クリックで停止
    // =========================

    function stopRoulette() {
        if (finalResult === null || finalResult === undefined) return;

        clearInterval(
            interval
        );

        if (typeof options.onReveal === "function") {
            options.onReveal();
        }


        roulette.onclick =
            null;


        diceSound.removeEventListener(
            "timeupdate",
            loopDiceSound
        );


        // =========================
        // 回転中SE停止
        // =========================

        diceSound.pause();

        diceSound.currentTime =
            0;


        // =========================
        // 最終結果
        // =========================

        number.textContent =
            finalResult;


        // =========================
        // 決定音
        // =========================

        stopSound.pause();

        stopSound.currentTime =
            0;

        stopSound
            .play()
            .catch(function (error) {

                console.error(
                    "ルーレット停止SEの再生に失敗しました:",
                    error
                );

                finishDiceRoulette();

            });


        // =========================
        // 決定音終了後
        // =========================

        stopSound.onended =
            function () {

                stopSound.onended =
                    null;

                finishDiceRoulette();

            };

    }


    // =========================
    // ルーレット終了
    // =========================

    function finishDiceRoulette() {

        roulette.style.display =
            "none";


        if (
            callback
        ) {

            callback();

        }

    }


    if (options.waitForReveal) {
        // 振った本人がクリックするまでは、他プレイヤー側で停止できない。
        roulette.onclick = null;
        window._revealActiveRemoteDiceRoulette = function (revealedResult, revealedCallback) {
            finalResult = revealedResult;
            callback = revealedCallback;
            roulette.onclick = stopRoulette;
        };
    } else {
        roulette.onclick = stopRoulette;
    }

}

function revealRemoteDiceRoulette(result, callback) {
    if (typeof window._revealActiveRemoteDiceRoulette === "function") {
        window._revealActiveRemoteDiceRoulette(result, callback);
        // 振った本人がクリックした通知を受けた時点で、他画面も同時に停止・公開する。
        document.getElementById("diceRoulette")?.click();
        window._revealActiveRemoteDiceRoulette = null;
    }
}



// =========================
// 宝箱ルーレット開始
// =========================

function showItemRoulette(
    item,
    callback
) {

    const roulette =
        document.getElementById(
            "itemRoulette"
        );

    const name =
        document.getElementById(
            "itemRouletteName"
        );


    // =========================
    // ルーレット回転中SE
    // 0～2秒をループ
    // =========================

    rouletteSound.pause();

rouletteSound.currentTime =
    0;

rouletteSound
    .play()
        .catch(function (error) {

            console.error(
                "ルーレット回転中SEの再生に失敗しました:",
                error
            );

        });


    // =========================
    // 表示
    // =========================

    roulette.style.display =
        "block";


    // =========================
    // アイテム名を回す
    // =========================

    const interval =
        setInterval(
            function () {

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

            },
            80
        );


    // =========================
    // 0～2秒ループ
    // =========================

    function loopDiceSound() {

    if (
        rouletteSound.currentTime >= 2
    ) {

        rouletteSound.currentTime =
            0;

    }

}


rouletteSound.addEventListener(
    "timeupdate",
    loopDiceSound
);


    // =========================
    // クリックで停止
    // =========================

    function stopRoulette() {

        clearInterval(
            interval
        );


        roulette.onclick =
            null;


        rouletteSound.removeEventListener(
    "timeupdate",
    loopDiceSound
);


        // =========================
        // 回転中SE停止
        // =========================

        rouletteSound.pause();

        rouletteSound.currentTime = 0;


        // =========================
        // 最終結果
        // =========================

        name.textContent =
            item.name;


        // =========================
        // 決定音
        // =========================

        roulettestopSound.pause();

        roulettestopSound.currentTime =
         0;

        roulettestopSound
        .play()
            .catch(function (error) {

                console.error(
                    "ルーレット停止SEの再生に失敗しました:",
                    error
                );

                finishItemRoulette();

            });


        // =========================
        // 決定音終了後
        // =========================

        roulettestopSound.onended =
            function () {

                roulettestopSound.onended =
                    null;

                finishItemRoulette();

            };

    }


    // =========================
    // ルーレット終了
    // =========================

    function finishItemRoulette() {

        roulette.style.display =
            "none";


        if (
            callback
        ) {

            callback();

        }

    }


    roulette.onclick =
        stopRoulette;



// =========================
    // 新バトルUIへ接続
    // =========================
    // game.js はゲーム進行を担当し、
    // 実際の通常モンスター戦UIは battle-ui.js に委譲します。
    // battle-ui.js は game.js 読み込み後に読み込まれるため、
    // 実行時には window.startMonsterBattle が新UI版になります。
    // =========================

    if (
        typeof window.startMonsterBattle === "function" &&
        window.startMonsterBattle !== startMonsterBattle
    ) {

        window.startMonsterBattle(
            player
        );

        return;

    }

    console.error(
        "新バトルUI（battle-ui.js）が読み込まれていません。"
    );

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



bossCounterEnabled = true;

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
        "挑戦する";

    escapeButton.textContent =
        "今回はやめる";


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

        updateNextPlayerView();


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

    // =========================
    // 魔王マス
    // =========================

    if (
        player.position === currentBossSquareId &&
        currentBossId === 9999 &&
        typeof window.handleMaouArrival === "function"
    ) {

        window.handleMaouArrival(
            player
        );

        break;
    }


    // =========================
    // 通常のスタートマス
    // =========================

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

                    updatePlayerStatusUI(player);


                    // プレイヤー表示更新
                    renderPlayers();


                    // =========================
                    // 結果ポップアップ
                    // =========================

                    showEventPopup(
                    "",
                    `💰 ${formatG(reward)}G獲得！`,

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

   // =========================
// 初めてボスマスへ到着した時
// ボスBGMへ切り替える
// =========================

if (
    bossBattleBGM.paused
) {

    setupBGM(
        bossBattleBGM,
        bossBattleBGMGain,
        setBossBattleBGMGain
    );

}

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

    player.money = 0;

    updatePlayerStatusUI(player);

    renderPlayers();

    showEventPopup(
        "💀 最悪マス",
        `${player.name}は最悪のマスに止まってしまった……。<br><br>
         <strong>所持ゴールドが0Gになった…</strong>`,
        function () {

            checkPlayerRespawn(
                player,
                function () {

                    finishTurn(player);

                }
            );

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


    updatePlayerStatusUI(player);


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
    shopName.style.display =
    "none";


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
    

    shopItemList.innerHTML =
        "";

    shopItemList.style.display =
        "none";


// =========================
// 通常ショップはアイテムのみ
// =========================

if (
    shopBox.itemContents &&
    shopBox.itemContents.length
) {

    showItemShopMenuUI(
        function () {

            showItemShopPopup(
                player
            );

        },

        function () {

            shopPopup.style.display =
                "none";

          
            shopItemList.style.display =
                "none";

            finishTurn(
                player
            );

        }
    );

}


    // =========================
    // ショップを表示
    // =========================

   shopCloseButton.textContent =
    "やめる";

shopCloseButton.onclick =
    function () {
        shopPopup.style.display =
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
        `${shopBox.name}`;


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
// すでに習得済みなら購入不可
// 連打による重複購入防止
// =========================

if (
    player.magic.includes(
        Number(contentId)
    )
) {
    return;
}


// =========================
// 購入ボタンを即座に無効化
// =========================

buyButton.disabled = true;

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

                        updatePlayerStatusUI(player);


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

const eventPopup =
    document.getElementById(
        "eventPopup"
    );

if (eventPopup) {
    eventPopup.classList.add(
        "magic-purchase-popup"
    );
}

                        showEventPopup(
                            "魔法習得",
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

                                 if (eventPopup) {
                      eventPopup.classList.remove(
                       "magic-purchase-popup"
                            );
                    }

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
    shopName.style.display =
    "block";
    
    const shopTitle =
    shopPopup.querySelector(
        ".shop-title"
    );

if (shopTitle) {
    shopTitle.style.display =
        "none";
}

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

                       const eventPopup =
    document.getElementById(
        "eventPopup"
    );

if (eventPopup) {
    eventPopup.classList.add(
        "gold-insufficient-popup"
    );
}

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

        if (eventPopup) {
            eventPopup.classList.remove(
                "gold-insufficient-popup"
            );
            }

                            }
                        );

                        return;

                    }


                    // =========================
                    // Gを支払う
                    // =========================

                    player.money -=
                        item.price;

                    updatePlayerStatusUI(player);


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

const eventPopup =
    document.getElementById(
        "eventPopup"
    );

if (eventPopup) {
    eventPopup.classList.add(
        "item-purchase-popup"
    );
}

showEventPopup(
    "アイテム購入",

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

        if (eventPopup) {
            eventPopup.classList.remove(
                "item-purchase-popup"
            );
        }

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


        // アイテムショップのメニューへ戻る

        showShopPopup(
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
        `${shopBox.name}`;


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

                        const eventPopup =
    document.getElementById(
        "eventPopup"
    );

if (eventPopup) {
    eventPopup.classList.add(
        "gold-insufficient-popup"
    );
}

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

        if (eventPopup) {
            eventPopup.classList.remove(
                "gold-insufficient-popup"
            );
        }

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


                    updatePlayerStatusUI(player);


                    // =========================
                    // プレイヤー情報更新
                    // =========================

                    renderPlayers();


                   // =========================
// 購入完了
// =========================

const eventPopup =
    document.getElementById(
        "eventPopup"
    );

if (eventPopup) {
    eventPopup.classList.add(
    "power-purchase-popup"
);
}

showEventPopup(
    "魔力購入",

    `
    <strong>
        ${power.effect}
    </strong>
    増えた！
    <br><br>

    💰
    ${formatG(power.price)}G
    を支払った。
    `,

    function () {

        if (eventPopup) {
           eventPopup.classList.remove(
    "power-purchase-popup"
);
        }

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
// 死亡時の資産強制売却
// =========================

function processForcedAssetSale(
    player,
    callback
) {

    const playerIndex =
        players.indexOf(player);

    // =========================
    // 保有資産を取得
    // owner が一致する資産だけを対象にする
    // =========================

    const candidates =
        Object.entries(ASSET_CONTENTS)
            .filter(
                function ([, asset]) {

                    return (
                        asset &&
                        asset.owner !== null &&
                        asset.owner !== undefined &&
                        asset.owner === playerIndex &&
                        Number(asset.price) > 0
                    );

                }
            )
            .map(
                function ([assetId, asset]) {

                    // 売却処理が終わるまで
                    // 名前・価格・参照先を保持する
                    return {
                        id: Number(assetId),
                        name: asset.name,
                        price: Number(asset.price),
                        asset: asset
                    };

                }
            );

    // =========================
    // 保有資産がない場合
    // =========================

    if (candidates.length === 0) {

        showEventPopup(
            "💸 強制売却なし",

            "強制売却できる資産を保有していません。<br><br>" +
            "今回の資産売却ペナルティは発生しません。",

            function () {

                if (callback) {
                    callback();
                }

            }
        );

        return;

    }

    // =========================
    // 死亡時の資産額を確定
    // =========================

    const totalAssetValue =
        candidates.reduce(
            function (total, entry) {

                return total + entry.price;

            },
            0
        );

    const targetValue =
        totalAssetValue * 0.5;

    // =========================
    // ランダムに売却対象を選択
    // =========================

    const remainingAssets =
        [...candidates];

    const selectedAssets = [];

    let selectedValue = 0;

    while (
    selectedValue < targetValue &&
    remainingAssets.length > 0
) {

        const randomIndex =
            Math.floor(
                Math.random() *
                remainingAssets.length
            );

        const selected =
            remainingAssets.splice(
                randomIndex,
                1
            )[0];

        selectedAssets.push(selected);

        selectedValue += selected.price;

    }

        // =========================
    // 売却対象一覧を作成
    // =========================

    const assetList = `
        <div class="forced-sale-asset-list">
            ${
                selectedAssets.map(
                    function (entry) {

                        return `
                            <div class="forced-sale-asset-item">
                                <strong>${entry.name}</strong>
                                <span>${formatG(entry.price)}G</span>
                            </div>
                        `;

                    }
                ).join("")
            }
        </div>
    `;

    // =========================
    // 強制売却のルール説明
    // =========================

// ルール説明ポップアップ専用の横幅設定
const eventPopup =
    document.getElementById("eventPopup");

eventPopup.classList.add(
    "forced-sale-rule-popup"
);

    showEventPopup(
        "💸 強制売却執行",

        "資産額の50％に達するまで、ランダムで資産が選ばれます。<br>" +
        "（保有資産状況や選ばれる順番によっては100％となる場合があります）<br><br>" +
        "選ばれた資産は強制売却となります。<br>" +
        "売却額は、取得価格の半値（50％）となります。",

        function () {

            eventPopup.classList.remove(
              "forced-sale-rule-popup"
            );

            // =========================
            // 強制売却された資産一覧
            // =========================

            showEventPopup(
                "💸 強制売却された資産",

                "以下の資産が強制売却されました。<br><br>" +
                assetList +
                `<br><strong>強制売却額合計：${formatG(selectedValue)}G</strong>`,

                function () {

                    // =========================
                    // 一覧を閉じた後に所有権を解放
                    // =========================

                    selectedAssets.forEach(
                        function (entry) {

                            entry.asset.owner = null;

                        }
                    );

                    const soldAssetIds =
                        new Set(
                            selectedAssets.map(
                                function (entry) {
                                    return entry.id;
                                }
                            )
                        );

                    if (player.assets) {

                        player.assets =
                            player.assets.filter(
                                function (assetId) {

                                    return !soldAssetIds.has(
                                        Number(assetId)
                                    );

                                }
                            );

                    }

                    // =========================
                    // 売却代金を付与
                    // =========================

                    const saleGold =
                        selectedValue * 0.5;

                    player.money += saleGold;

                    updatePlayerStatusUI(player);
                    renderPlayers();

                    showEventPopup(
                        "💰 強制売却の売却代金",

                        `売却額の半値（50％）として、<br><br>` +
                        `<strong>${formatG(saleGold)}G</strong>` +
                        `を獲得しました！`,

                        function () {

                            if (callback) {
                                callback();
                            }

                        }
                    );

                }
            );

        }
    );
}

window.processForcedAssetSale = processForcedAssetSale;

// =========================
// 0G時のリスポーン
// =========================

function checkPlayerRespawn(
    player,
    callback
) {

    if (player.money > 0) {

        if (callback) {
            callback();
        }

        return;

    }

    // =========================
    // リスポーン時の所持金
    // =========================

    const respawnGold =
        10000 + (bossDefeatedCount * 2500);

    player.money =
        respawnGold;

    player.position =
        139;

    // =========================
    // バイトを強制終了
    // =========================

    player.jobTurnsRemaining =
        0;

    player.jobReward =
        0;

    // =========================
    // リスポーン後は1ターン休み
    // =========================

    player.skipTurn =
        true;

    // =========================
    // リスポーン時の固定アイテム
    // =========================

    addItem(
        player,
        1,
        currentTurn
    );

    addItem(
        player,
        12,
        currentTurn
    );

    updatePlayerStatusUI(player);

    // =========================
    // 移動履歴をリセット
    // =========================

    movementPath = [];

    renderPlayers();
    renderMap();
    refreshShortestPathToBoss();

    // =========================
    // 死亡アナウンス
    // =========================

    showEventPopup(
        "💀 資産0G",

        `${player.name}はゴールドをすべて失った……。<br><br>` +
        `スタート地点へリスポーン！<br>` +
        `💰 <strong>${respawnGold.toLocaleString()}G</strong>を手に入れた！<br>` +
        `アイテムを2個手に入れた！`,

        function () {

            // =========================
            // 死亡アナウンス後に強制売却
            // =========================

            processForcedAssetSale(
                player,

                function () {

                    // =========================
                    // 既存の後続処理へ戻る
                    // =========================

                    if (callback) {
                        callback();
                    }

                }
            );

        }
    );

}

window.checkPlayerRespawn =
    checkPlayerRespawn;

// =========================
// リスポーン後の1ターン休みチェック
// =========================

function checkRespawnSkipTurn(
    player
) {

    if (
        player.skipTurn !== true
    ) {

        return false;

    }

    player.skipTurn =
        false;

    updateNextPlayerView();

    showEventPopup(
        "💀 リスポーン",
        `${player.name}はリスポーン中、<br>` +
        `<strong>このターンはお休みｗ</strong>`,
        function () {

            finishTurn(
                player
            );

        }
    );

    return true;
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
// 総資産の多い順に並べる
// =========================

const ranking =
    [...players].sort(function (a, b) {

        return calculateTotalAssetValue(b)
            - calculateTotalAssetValue(a);

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
    💰 ${formatG(calculateTotalAssetValue(player))}G
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
            <div style="font-weight:bold;text-align:right;">総資産</div>

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
// 次プレイヤー開始時の
// 表示・カメラ・最短ルート更新
// =========================
//
// ターン切り替え時のUI更新を
// ここに統一する。
// =========================

function updateNextPlayerView() {

    // ターン表示を更新
    renderTurn();

    // プレイヤー表示を更新
    renderPlayers();

    // 現在プレイヤーへカメラを移動
    centerCurrentPlayerOnMap();

    // 現在プレイヤーの最短ルートを再描画
    refreshShortestPathToBoss();

}

// =========================
// プレイヤー切り替えSE
// =========================

function playPlayerSwitchingSound() {

    switchingSound.currentTime =
        0;

    switchingSound.play().catch(
        function (error) {

            console.warn(
                "【プレイヤー切り替えSE】再生失敗：",
                error
            );

        }
    );

}

// =========================
// ボスカウンター処理
// =========================

function handleBossCounter(
    callback
) {

if (
    bossCounterEnabled &&
    currentPlayer === 0
) {

    console.log(
        "👹 ボスカウンター発動"
    );
    const boss =
    BOSS_CONTENTS[currentBossId];

    let counterMessage = `
        <div class="boss-counter-image-wrap">
            <img
                src="${BOSS_MAP_ICON_PATH}"
                alt="ボス"
                class="boss-counter-popup-icon"
            >
        </div>

        <div>
            離れたマスに応じてダメージ！
        </div>

        <div class="boss-counter-player-list">
    `;


    players.forEach(
        function (targetPlayer) {

            // =========================
// ボスカウンター無効
// =========================

if (
    hasBossCounterImmunity(
        targetPlayer
    )
) {

    // =========================
    // バイト中による無効
    // =========================

    if (
        targetPlayer.jobTurnsRemaining > 0
    ) {

        counterMessage += `
            <div class="boss-counter-player-row">
                <span>
                    ${targetPlayer.name}
                </span>

                <span>
                    🛡️ バイト中は無効
                </span>
            </div>
        `;

    }

    // =========================
    // アイテムによる無効
    // =========================

    else {

        counterMessage += `
            <div class="boss-counter-player-row">
                <span>
                    ${targetPlayer.name}
                </span>

                <span>
                    🛡️ 免罪符により無効
                </span>
            </div>
        `;

    }

    return;
}

            const distance =
                getShortestDistanceToBoss(
                    targetPlayer.position
                );

            const damage =
                distance * boss.counterDamage;


            console.log(
                "ボスカウンター:",
                targetPlayer.name,
                "現在地:",
                targetPlayer.position,
                "ボスまで:",
                distance,
                "マス",
                "ダメージ:",
                damage + "G"
            );


            if (
                damage > 0
            ) {

                targetPlayer.money -=
                    damage;

            }


            console.log(
                "ボスカウンターG減少:",
                targetPlayer.name,
                "-" + damage + "G",
                "残り:",
                targetPlayer.money + "G"
            );


           counterMessage += `
    <div class="boss-counter-player-row">

        <span class="boss-counter-player-name">
            ${targetPlayer.name}
        </span>

        <span class="boss-counter-player-distance">
            距離${distance}マス
        </span>

        <span class="boss-counter-player-damage">
         −${formatG(damage)}G
        </span>

    </div>
`;

        }
    );


    counterMessage += `
        </div>
    `;

// =========================
// ボスカウンターSE
// =========================

const bossCounterSE =
    new Audio(
        "sounds/戦闘/怪獣の足音.mp3"
    );

bossCounterSE.currentTime = 0;

bossCounterSE.play().catch(
    function (error) {

        console.warn(
            "【ボスカウンター】SE再生失敗：",
            error
        );

    }
);

const popup =
    document.getElementById(
        "eventPopup"
    );

if (popup) {
    popup.classList.add(
        "boss-counter-popup"
    );
}
   showEventPopup(
    "ボスカウンター発動！",
    counterMessage,
    function () {

    if (popup) {
        popup.classList.remove(
            "boss-counter-popup"
        );
    }

    players.forEach(
        function (targetPlayer) {

                if (
                    targetPlayer.money <= 0
                ) {

                    checkPlayerRespawn(
                        targetPlayer
                    );

                }

            }
        );

        renderPlayers();

        // =========================
        // プレイヤー切り替えSE
        // =========================

        playPlayerSwitchingSound();

if (callback) {

            callback();

        }

    }
);

return true;

}

    return false;
}

function showPassiveEffectAnnouncements(
    player,
    appliedEffects,
    expiredItems,
    callback
) {

    const announcements = [];

    // =========================
    // 発動したパッシブ効果
    // =========================

    appliedEffects.forEach(
        function (effect) {

            const gain =
                Number(effect.gain) || 0;

            if (gain > 0) {

                announcements.push({
                    title: "✨ パッシブ効果発動！",
                    message:
                        `${effect.itemName}の恩恵を受けた！<br><br>` +
                        `<strong>${formatG(gain)}G</strong> ゲット！`
                });

            } else if (gain < 0) {

                announcements.push({
                    title: "💸 パッシブ効果発動！",
                    message:
                        `${effect.itemName}の効果で<br><br>` +
                        `<strong>${formatG(Math.abs(gain))}G</strong> 失った！`
                });

            }

        }
    );

    // =========================
    // 効果が切れたアイテム
    // =========================

    expiredItems.forEach(
        function (item) {

            announcements.push({
                title: "⏰ 効果終了",
                message:
                    `<strong>${item.itemName}</strong>の効果が切れた！`
            });

        }
    );

    // =========================
    // アナウンスがない場合
    // =========================

    if (
        announcements.length === 0
    ) {

        if (callback) {
            callback();
        }

        return;
    }

    // =========================
    // 順番に表示
    // =========================

    let index = 0;

    function showNextAnnouncement() {

        if (
            index >=
            announcements.length
        ) {

            if (callback) {
                callback();
            }

            return;
        }

        const announcement =
            announcements[index];

        index += 1;

        showEventPopup(
            announcement.title,
            announcement.message,
            function () {
                showNextAnnouncement();
            }
        );

    }

    showNextAnnouncement();
}

// =========================
// 次プレイヤーのターン開始
// =========================

function startNextPlayerTurn(
    player
) {

    inventoryButton.disabled =
        false;

    // =========================
    // ターン開始時のアイテム効果
    // =========================

    console.log(
        "【ターン開始時・アイテム効果チェック】",
        player.name,
        player.inventory,
        player.money
    );

   const appliedEffects =
    applyTurnStartItemEffects(
        player
    );

const expiredItems =
    removeExpiredItems(
        player,
        currentTurn
    );
// =========================
// パッシブ効果適用後
// プレイヤー表示を先に更新
// =========================

updateNextPlayerView();

showPassiveEffectAnnouncements(
    player,
    appliedEffects,
    expiredItems,
    function () {

        // =========================
        // ターン開始時の効果で
        // 0G以下になった場合は即リスポーン
        // =========================

        if (
            player.money <= 0
        ) {

            checkPlayerRespawn(
                player,
                function () {

                    checkRespawnSkipTurn(
                        player
                    );

                }
            );

            return;

        }

        if (
            checkRespawnSkipTurn(
                player
            )
        ) {

            return;

        }

        // ↓ここから現在の
        // 「次のプレイヤーが仕事中か確認」
        // 以下をそのまま続ける

    
// =========================
// ターン開始時の効果で
// 0G以下になった場合は即リスポーン
// =========================

if (
    player.money <= 0
) {

    checkPlayerRespawn(
        player,
        function () {

            checkRespawnSkipTurn(
                player
            );

        }
    );

    return;

}

    if (
        checkRespawnSkipTurn(
            player
        )
    ) {

        return;

    }

    // =========================
    // 次のプレイヤーが
    // 仕事中か確認
    // =========================

    if (
        player.jobTurnsRemaining > 0
    ) {

        player.jobTurnsRemaining -=
            1;

        updateNextPlayerView();

        // =========================
        // 仕事終了
        // =========================

        if (
            player.jobTurnsRemaining === 0
        ) {

            const reward =
                player.jobReward;

            player.money +=
                reward;

            updatePlayerStatusUI(
                player
            );

            player.jobReward =
                0;

            renderPlayers();

            showEventPopup(
                "💰 バイト終了！",

                `${player.name}は<br>` +
                `<strong>${formatG(reward)}G</strong>を獲得！`,

                function () {

                    updateNextPlayerView();

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

            `${player.name}は現在バイト中です。<br>` +
            `残り ${player.jobTurnsRemaining} ターン`,

            function () {

                finishTurn(
                    player
                );

            }
        );

        return;

    }

    // =========================
    // 通常プレイヤー
    // =========================

    updateNextPlayerView();
    refreshShortestPathToBoss();

    // =========================
    // ボスマスにいる場合
    // 再戦確認
    // =========================

    if (
        player.position ===
        currentBossSquareId
    ) {

        showBossChallengePopup(
            player,
            true
        );

        return;

    }

    // =========================
    // ルーレット使用可能
    // =========================

    rouletteButton.disabled =
        false;

}

 );

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
    // ターン終了時にアイテムボタンを再有効化
    // =========================

    inventoryButton.disabled =
        false;


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

                    updatePlayerStatusUI(targetPlayer);


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
                // 最大ターン数終了
                // 配当・ランキング終了後に判定
                // =========================

                if (
                    currentTurn >
                    maxTurns
                ) {

                    showGameResult();

                    return;

                }

// =========================
// 次のプレイヤーへ
// =========================

currentPlayer =
    (currentPlayer + 1) %
    players.length;

notifyOnlineTurnAdvanced();

// =========================
// 次のプレイヤー表示へ切り替え
// =========================

updateNextPlayerView();


// =========================
// ボスカウンター判定
// =========================

if (
    handleBossCounter(
        function () {

            startNextPlayerTurn(
                players[currentPlayer]
            );

        }
    )
) {

    return;

}


//SE:プレイヤー切り替え
playPlayerSwitchingSound();


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

startNextPlayerTurn(
    nextPlayer
);

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
// 次のプレイヤーへ
// =========================

currentPlayer =
    (
        currentPlayer + 1
    )
    %
    players.length;

notifyOnlineTurnAdvanced();

// =========================
// ボスカウンター判定
// =========================

if (
    handleBossCounter(
        function () {

            startNextPlayerTurn(
                players[currentPlayer]
            );

        }
    )
) {

    return;

}



//SE:プレイヤー切り替え
playPlayerSwitchingSound();




        // =========================
        // 次のプレイヤー
        // =========================

       const nextPlayer =
    players[currentPlayer];

startNextPlayerTurn(
    nextPlayer
);

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
playPlayerSwitchingSound();


    const nextPlayer =
    players[currentPlayer];

startNextPlayerTurn(
    nextPlayer
);

}

// =========================
// 戦闘UI・ゲーム開始処理から呼び出すため公開
// =========================

window.renderMap =
    renderMap;

window.showBossDestinationPopup =
    showBossDestinationPopup;

window.finishTurn =
    finishTurn;

window.centerCurrentPlayerOnMap =
    centerCurrentPlayerOnMap;

// =========================
// 指定プレイヤーのいるマスを
// マップ中央へ移動
// =========================

function centerPlayerOnMap(
    playerIndex,
    behavior = "smooth"
) {

    const mapArea =
        document.querySelector(
            ".game-screen .map-area"
        );

    const mapBoard =
        document.getElementById(
            "mapBoard"
        );

    const player =
        players[playerIndex];

    if (
        !mapArea ||
        !mapBoard ||
        !player
    ) {
        return;
    }


    // =========================
    // プレイヤーがいるマスを取得
    // =========================

    const mapNode =
        mapArea.querySelector(
            `.map-node[data-square-id="${player.position}"]`
        );

    if (!mapNode) {
        return;
    }


// =========================
// 現在のズーム倍率
// =========================

const zoom =
    typeof getMapZoomUI ===
    "function"
        ? getMapZoomUI()
        : 1;


    // =========================
    // 進行中のスクロールを解除
    // =========================

    mapArea.scrollTo({

        left:
            mapArea.scrollLeft,

        top:
            mapArea.scrollTop,

        behavior:
            "auto"

    });


    requestAnimationFrame(
        function () {

            // =========================
            // マスの中心座標
            // mapBoard内の座標
            // =========================

            const squareCenterX =
                mapNode.offsetLeft +
                mapNode.offsetWidth / 2;

            const squareCenterY =
                mapNode.offsetTop +
                mapNode.offsetHeight / 2;


            // =========================
            // mapBoardの中心座標
            // =========================

            const boardCenterX =
                mapBoard.clientWidth / 2;

            const boardCenterY =
                mapBoard.clientHeight / 2;


            // =========================
            // ズーム後の
            // マス中心座標
            //
            // transform-origin:
            // center center
            // に合わせて計算
            // =========================

            const zoomedSquareCenterX =
                boardCenterX +
                (
                    squareCenterX -
                    boardCenterX
                ) *
                zoom;

            const zoomedSquareCenterY =
                boardCenterY +
                (
                    squareCenterY -
                    boardCenterY
                ) *
                zoom;


           // =========================
// 画面中央へ合わせる
// 追加したスクロール余白を考慮
// =========================

// map-area に追加した余白
const paddingLeft =
    parseFloat(
        getComputedStyle(mapArea).paddingLeft
    ) || 0;

const paddingTop =
    parseFloat(
        getComputedStyle(mapArea).paddingTop
    ) || 0;


// =========================
// 画面中央に合わせるスクロール位置
// =========================

const targetScrollLeft =
    paddingLeft +
    zoomedSquareCenterX -
    mapArea.clientWidth / 2;

const targetScrollTop =
    paddingTop +
    zoomedSquareCenterY -
    mapArea.clientHeight / 2;


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


// =========================
// 範囲内に収める
// =========================

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
            // マス中央へ移動
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
// 指定プレイヤー用のカメラ移動関数を公開
window.centerPlayerOnMap = centerPlayerOnMap;

// =========================
// 現在プレイヤーを
// マップ中央へ
// =========================

function centerCurrentPlayerOnMap(
    behavior = "smooth"
) {

    centerPlayerOnMap(
        currentPlayer,
        behavior
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
// バイト内容表示
// =========================

function showJobPopup(
    player,
    square,
    turn,
    finishCallback
) {

    const jobPopup =
        document.getElementById(
            "jobPopup"
        );

    // =========================
    // バイトポップアップ本体が
    // 存在しない場合
    // =========================

    if (!jobPopup) {

        console.error(
            "【バイト画面】jobPopup が見つかりません。"
        );

        return;
    }


    // =========================
    // JOB_CONTENTSから
    // jobIdに対応するバイトを取得
    // =========================

    const jobData =
        getJobData(
            square.jobId
        );


    // =========================
    // JOB_CONTENTSに存在しない
    // jobIdの場合
    // =========================

    if (!jobData) {

        console.error(
            "【バイトエラー】JOB_CONTENTSに存在しないjobIdです:",
            square.jobId
        );

        return;
    }


    // =========================
    // 現在の時給
    // =========================

    const currentWage =
        getCurrentJobWage(
            jobData.unitPrice,
            turn
        );


    // =========================
    // バイト画面をJOB_CONTENTSの
    // 内容から生成
    // =========================

    jobPopup.innerHTML = `

        <div class="job-info-row">

            <div class="job-name">
                ${jobData.name}
            </div>

            <div class="job-wage">
                時給 ${formatG(currentWage)}G
            </div>

        </div>

        <div class="job-question">
            1ターン働きますか？
        </div>

        <div class="job-choices">

            <button
                id="jobWorkButton"
                class="job-choice-button job-work-button"
                type="button"
            >
                働く
            </button>

            <button
                id="jobNoneButton"
                class="job-choice-button job-none-button"
                type="button"
            >
                やめる
            </button>

        </div>

    `;


    // =========================
    // ボタンを取得
    // =========================

    const jobWorkButton =
        document.getElementById(
            "jobWorkButton"
        );

    const jobNoneButton =
        document.getElementById(
            "jobNoneButton"
        );


    // =========================
    // 働く
    // =========================

    jobWorkButton.onclick =
        function () {

            startJob(
                player,
                1,
                currentWage,
                finishCallback
            );

        };


    // =========================
    // やめる
    // =========================

    jobNoneButton.onclick =
        function () {

            jobPopup.style.display =
                "none";

            finishCallback();

        };


    // =========================
    // 表示
    // =========================

    jobPopup.style.display =
        "block";

}

// =========================
// バイト開始
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
    turns + 1;
    
    player.jobReward =
        reward;


    // =========================
    // バイト開始
    // =========================

    showEventPopup(
        "バイト開始",
        `
        1ターン働きます！<br>
        <strong>${formatG(reward)}G</strong>
        を獲得予定
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
    callback,
    turn,
    monster
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
// ボス撃破数に応じた
// モンスター報酬インフレ
// =========================

const monsterInflationMultiplier =
    getMonsterInflationMultiplier();


// =========================
// モンスターの基礎報酬
// =========================

const baseMagicReward =
    monster?.magicReward || 0;

const baseGoldReward =
    monster?.goldReward || 0;


// =========================
// 魔力報酬
// 1の位を切り捨て
// =========================

const magicReward =
    Math.floor(
        (
            baseMagicReward *
            monsterInflationMultiplier
        ) / 10
    ) * 10;


// =========================
// ゴールド報酬
// 1の位を切り捨て
// =========================

const goldReward =
    Math.floor(
        baseGoldReward *
        monsterInflationMultiplier
        / 10
    ) * 10;
    
    // =========================
    // 報酬候補
    // =========================

    const rewards = [

        {
    text:
        `<img src="images/ui-icons/mana.png" class="reward-magic-icon" alt="魔力"> 魔力 +${magicReward}`,

    type:
        "magicPower",

    value:
        magicReward
},

        {
            text:
                `💰 ${formatG(goldReward)}G`,

            type:
                "money",

            value:
                goldReward
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


            // =========================
            // ボタン設定
            // =========================

            button.type =
                "button";

            button.className =
                "reward-choice-button";

            button.innerHTML =
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

                        window.updatePlayerStatusUI(
                            player
                        );

                    }


                    // =========================
                    // ゴールド獲得
                    // =========================

                    if (
                        reward.type ===
                        "money"
                    ) {

                        player.money +=
                            reward.value;

                        window.updatePlayerStatusUI(
                            player
                        );

                    }


     console.log(
    "報酬反映:",
    player.name,
    "魔力:",
    player.magicPower,
    "G:",
    player.money,
    "ターン:",
    turn
);

                    // =========================
                    // 報酬受け取りポップアップ
                    // =========================

                    rewardPopup.style.display =
                        "none";


                    let receivedMessage = "";

                    if (
                        reward.type ===
                        "magicPower"
                    ) {

                        receivedMessage =
                            `<img src="images/ui-icons/mana.png" class="reward-magic-icon" alt="魔力"> ` +
                            `<strong>魔力 ${reward.value}</strong>を受け取った！`;

                    }


                    if (
                        reward.type ===
                        "money"
                    ) {

                        receivedMessage =
                            `💰 <strong>${formatG(reward.value)}G</strong>を受け取った！`;

                    }


                    showEventPopup(
                        "報酬を受け取った！",
                        receivedMessage,
                        function () {

                            if (callback) {

                                callback();

                            }

                        }
                    );

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
    // ルーレット回転中SE
    // 0～2秒をループ
    // =========================

    diceSound.pause();

    diceSound.currentTime =
        0;

    diceSound
        .play()
        .catch(function (error) {

            console.error(
                "ルーレット回転中SEの再生に失敗しました:",
                error
            );

        });


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

            },
            80
        );


    // =========================
    // 0～2秒ループ
    // =========================

    function loopDiceSound() {

        if (
            diceSound.currentTime >= 0.83
        ) {

            diceSound.currentTime =
                0;

        }

    }


    diceSound.addEventListener(
        "timeupdate",
        loopDiceSound
    );


    // =========================
    // クリックで停止
    // =========================

    function stopRoulette() {

        clearInterval(
            interval
        );


        roulette.onclick =
            null;


        diceSound.removeEventListener(
            "timeupdate",
            loopDiceSound
        );


        // =========================
        // 回転中SE停止
        // =========================

        diceSound.pause();

        diceSound.currentTime =
            0;


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
        // 決定音
        // =========================

        stopSound.pause();

        stopSound.currentTime =
            0;

        stopSound
            .play()
            .catch(function (error) {

                console.error(
                    "ルーレット停止SEの再生に失敗しました:",
                    error
                );

                finishMultiDiceRoulette(
                    sum
                );

            });


        // =========================
        // 決定音終了後
        // =========================

        stopSound.onended =
            function () {

                stopSound.onended =
                    null;

                finishMultiDiceRoulette(
                    sum
                );

            };

    }


    // =========================
    // ルーレット終了
    // =========================

    function finishMultiDiceRoulette(
        sum
    ) {

        roulette.style.display =
            "none";


        if (
            callback
        ) {

            callback(
                sum
            );

        }

    }


    roulette.onclick =
        stopRoulette;

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
// HUD：画面サイズ変更時の自動調整
// =========================

window.addEventListener(
    "resize",
    function () {

        fitHudText(
            document.getElementById(
                "hudPlayerName"
            )
        );

        fitHudText(
            document.getElementById(
                "hudGoldValue"
            )
        );

        fitHudText(
            document.getElementById(
                "hudMagicValue"
            )
        );

        fitHudText(
            document.getElementById(
                "hudDestinationValue"
            )
        );

        fitHudText(
            document.getElementById(
                "turnDisplay"
            )
        );

    }
);

// =========================
// HUD：ボス距離ラベルの自動調整
// 「まであと」と「マス」を同じサイズで縮小
// 距離の数字は固定
// =========================

function fitHudDestinationLabels() {

    const destinationInfo =
        document.getElementById(
            "destinationInfo"
        );

    if (!destinationInfo) {
        return;
    }

    const labels =
        destinationInfo.querySelectorAll(
            ".hud-destination-label"
        );

    if (labels.length === 0) {
        return;
    }

    let fontSize = 20;

    labels.forEach(
        function (label) {

            label.style.fontSize =
                `${fontSize}px`;

        }
    );

    while (
        destinationInfo.scrollWidth >
        destinationInfo.clientWidth &&
        fontSize > 9
    ) {

        fontSize -= 1;

        labels.forEach(
            function (label) {

                label.style.fontSize =
                    `${fontSize}px`;

            }
        );

    }

}

// =========================
// ロスノート実行
// =========================

function showLossNotePlayerPopup(
    usingPlayer
) {

    let popup =
        document.getElementById(
            "lossNotePlayerPopup"
        );

    if (!popup) {

        popup =
            document.createElement(
                "div"
            );

        popup.id =
            "lossNotePlayerPopup";

        popup.className =
    "item-action-popup loss-note-player-popup";

        popup.innerHTML = `
           <div class="item-action-title">
    ロスノート
</div>

<div class="item-action-description">
    名前を書くプレイヤーを選択
</div>

<div class="item-action-content loss-note-player-list"></div>

<button
    class="item-action-back-button loss-note-back-button"
    type="button"
>
    戻る
</button>
        `;

        document.body.appendChild(
            popup
        );

    }

    const playerList =
        popup.querySelector(
            ".loss-note-player-list"
        );

    const backButton =
    popup.querySelector(
        ".loss-note-back-button"
    );

    playerList.innerHTML =
        "";

    players.forEach(
        function (targetPlayer) {

            const row =
                document.createElement(
                    "div"
                );

            row.className =
                "loss-note-player-row";

            row.innerHTML = `
                <span class="loss-note-player-name">
                    ${targetPlayer.name}
                </span>

                <button
                    class="loss-note-use-button"
                    type="button"
                >
                    使用する
                </button>
            `;

            const useButton =
                row.querySelector(
                    ".loss-note-use-button"
                );

            useButton.addEventListener(
                "click",
                function () {

                    useButton.disabled =
                        true;

const result =
    useLossNote(
        usingPlayer,
        targetPlayer,
        window.getCurrentTurn()
    );

if (!result) {

    popup.style.display =
        "none";

    return;
}

// ロスノート使用成功
popup.style.display =
    "none";

// ロスノートSE
lostSound.pause();
lostSound.currentTime =
    0;

lostSound.play().catch(
    function (error) {
        console.error(
            "ロスノートSEの再生に失敗しました:",
            error
        );
    }
);

const respawnGold =
    result.respawnGold;

updatePlayerStatusUI(
    targetPlayer
);

// =========================
// 移動履歴をリセット
// =========================

movementPath = [];

renderMap();
renderPlayers();

// =========================
// リスポーン結果
// =========================

showEventPopup(
    "ロスノート",
    `${targetPlayer.name}はゴールドをすべて失った……。<br><br>
    スタート地点へリスポーン！<br>
    💰 <strong>${formatG(respawnGold)}G</strong>を手に入れた！<br>
    アイテムを2個手に入れた！`,
    function () {

        window.processForcedAssetSale(
            targetPlayer,

            function () {

                finishTurn(
                    usingPlayer
                );

            }
        );

    }
);


                }
            );

            playerList.appendChild(
                row
            );

        }
    );

    backButton.onclick =
    function () {

        // ロスノート選択画面を閉じる
        popup.style.display =
            "none";

        // アイテム一覧へ戻る
        showInventoryPopup(
            usingPlayer
        );

    };

    popup.style.display =
        "block";

}


// =========================
// ロストマジック
// =========================

function showLostMagicPlayerPopup(
    usingPlayer
) {

    let popup =
        document.getElementById(
            "lostMagicPlayerPopup"
        );

    if (!popup) {

        popup =
            document.createElement(
                "div"
            );

        popup.id =
            "lostMagicPlayerPopup";

        popup.className =
            "item-action-popup lost-magic-player-popup";

        popup.innerHTML = `
            <div class="item-action-title">
                ロストマジック
            </div>

            <div class="item-action-description">
                魔法を失わせるプレイヤーを選択
            </div>

            <div class="item-action-content lost-magic-player-list"></div>

            <button
                class="item-action-back-button lost-magic-back-button"
                type="button"
            >
                戻る
            </button>
        `;

        document.body.appendChild(
            popup
        );
    }

    const playerList =
        popup.querySelector(
            ".lost-magic-player-list"
        );

    const backButton =
        popup.querySelector(
            ".lost-magic-back-button"
        );

    playerList.innerHTML =
        "";

    players.forEach(
        function (targetPlayer) {

            if (
                targetPlayer ===
                usingPlayer
            ) {
                return;
            }

            const row =
                document.createElement(
                    "div"
                );

            row.className =
                "loss-note-player-row";

            row.innerHTML = `
                <span class="loss-note-player-name">
                    ${targetPlayer.name}
                </span>

                <button
                    class="loss-note-use-button"
                    type="button"
                >
                    選択
                </button>
            `;

            const selectButton =
                row.querySelector(
                    ".loss-note-use-button"
                );

            selectButton.addEventListener(
                "click",
                function () {

                    selectButton.disabled =
                        true;

                    if (
                        !Array.isArray(
                            targetPlayer.magic
                        ) ||
                        targetPlayer.magic.length === 0
                    ) {

                        showEventPopup(
                            "ロストマジック",
                            `
                            ${targetPlayer.name}は
                            <br>
                            魔法を持っていません。
                            `,
                            function () {

                                selectButton.disabled =
                                    false;

                            }
                        );

                        return;
                    }

                    popup.style.display =
                        "none";

                    showLostMagicSelectionPopup(
                        usingPlayer,
                        targetPlayer
                    );

                }
            );

            playerList.appendChild(
                row
            );
        }
    );

    backButton.onclick =
        function () {

            popup.style.display =
                "none";

            showInventoryPopup(
                usingPlayer
            );
        };

    popup.style.display =
        "block";
}

function showLostMagicSelectionPopup(
    usingPlayer,
    targetPlayer
) {

    let popup =
        document.getElementById(
            "lostMagicSelectionPopup"
        );

    if (!popup) {

        popup =
            document.createElement(
                "div"
            );

        popup.id =
            "lostMagicSelectionPopup";

        popup.className =
            "item-action-popup lost-magic-selection-popup";

        popup.innerHTML = `
            <div class="item-action-title">
                ロストマジック
            </div>

            <div class="item-action-description">
                消失させる魔法を選択
            </div>

            <div class="item-action-content lost-magic-list"></div>

            <button
                class="item-action-back-button lost-magic-selection-back-button"
                type="button"
            >
                戻る
            </button>
        `;

        document.body.appendChild(
            popup
        );
    }

    const magicList =
        popup.querySelector(
            ".lost-magic-list"
        );

    const backButton =
        popup.querySelector(
            ".lost-magic-selection-back-button"
        );

    magicList.innerHTML =
        "";

    targetPlayer.magic.forEach(
        function (magicId) {

            const magic =
                MAGIC_CONTENTS[
                    Number(magicId)
                ];

            if (!magic) {
                return;
            }

            const row =
                document.createElement(
                    "div"
                );

            row.className =
            "loss-note-player-row";

            row.innerHTML = `
                <div class="lost-magic-info">

                    <img
                        src="${magic.icon}"
                        class="lost-magic-icon"
                        alt="${magic.name}"
                    >

                    <span class="lost-magic-name">
                        ${magic.name}
                    </span>

                </div>

                <button
    class="loss-note-use-button"
    type="button"
>
    ロスト
</button>
            `;

            const lostButton =
    row.querySelector(
        ".loss-note-use-button"
    );

            lostButton.addEventListener(
                "click",
                function () {

                    lostButton.disabled =
                        true;

                    const result =
                        useLostMagic(
                            usingPlayer,
                            targetPlayer,
                            magicId
                        );

                    if (!result) {

                        lostButton.disabled =
                            false;

                        return;
                    }

                    popup.style.display =
                        "none";

                    lostSound.pause();
                    lostSound.currentTime =
                        0;

                    lostSound.play().catch(
                        function (error) {

                            console.error(
                                "ロストマジックSEの再生に失敗しました:",
                                error
                            );

                        }
                    );

                    renderPlayers();

                    showEventPopup(
                        "ロストマジック",
                        `
                        ${targetPlayer.name}の
                        <br><br>

                        <strong>
                            ${magic.name}
                        </strong>

                        <br><br>

                        が消失した！
                        `,
                        function () {

                            finishTurn(
                                usingPlayer
                            );

                        }
                    );
                }
            );

            magicList.appendChild(
                row
            );
        }
    );

    backButton.onclick =
        function () {

            popup.style.display =
                "none";

            showLostMagicPlayerPopup(
                usingPlayer
            );
        };

    popup.style.display =
        "block";
}

// =========================
// 闇みずほ
// プレイヤー選択画面
// =========================

// =========================
// 共通
// 他プレイヤー選択画面
// =========================

function showTransferPlayerPopup(
    usingPlayer,
    options
) {

    let popup =
        document.getElementById(
            "transferPlayerPopup"
        );

    if (!popup) {

        popup =
            document.createElement(
                "div"
            );

        popup.id =
            "transferPlayerPopup";

        popup.className =
            "item-action-popup transfer-player-popup";

        popup.innerHTML = `
            <div class="item-action-title">
            </div>

            <div class="item-action-description">
            </div>

            <div
                class="item-action-content transfer-player-list"
            ></div>

            <button
                class="item-action-back-button transfer-player-back-button"
                type="button"
            >
                戻る
            </button>
        `;

        document.body.appendChild(
            popup
        );

    }

    const title =
        popup.querySelector(
            ".item-action-title"
        );

    const description =
        popup.querySelector(
            ".item-action-description"
        );

    const playerList =
        popup.querySelector(
            ".transfer-player-list"
        );

    const backButton =
        popup.querySelector(
            ".transfer-player-back-button"
        );

    title.textContent =
        options.title;

    description.textContent =
        options.description;

    playerList.innerHTML =
        "";

    // =========================
    // プレイヤー一覧
    // =========================

    players.forEach(
        function (targetPlayer) {

            if (
                targetPlayer ===
                usingPlayer
            ) {
                return;
            }

            const row =
                document.createElement(
                    "div"
                );

            row.className =
                "loss-note-player-row";

            row.innerHTML = `
                <div class="money-transfer-player-info">

                    <div class="money-transfer-player-name">
                        ${targetPlayer.name}
                    </div>

                    ${
                        options.showMoney
                            ? `
                        <div class="money-transfer-player-money">
                            💰 ${formatG(targetPlayer.money)}G
                        </div>
                        `
                            : ""
                    }

                </div>

                <button
                    class="money-transfer-player-select-button"
                    type="button"
                >
                    選択
                </button>
            `;

            const selectButton =
                row.querySelector(
                    ".money-transfer-player-select-button"
                );

            selectButton.addEventListener(
                "click",
                function () {

                    selectButton.disabled =
                        true;

                    popup.style.display =
                        "none";

                    options.onSelect(
                        targetPlayer
                    );

                }
            );

            playerList.appendChild(
                row
            );

        }
    );

    // =========================
    // 戻る
    // =========================

    backButton.onclick =
        function () {

            popup.style.display =
                "none";

            options.onBack();

        };

    popup.style.display =
        "block";

}


// =========================
// 闇みずほ
// プレイヤー選択
// =========================

function showMoneyTransferPlayerPopup(
    usingPlayer
) {

    showTransferPlayerPopup(
        usingPlayer,
        {
            title:
                "闇みずほ",

            description:
                "送金・奪金するプレイヤーを選択",

            showMoney:
                true,

            onSelect:
                function (
                    targetPlayer
                ) {

                    showMoneyTransferTypePopup(
                        usingPlayer,
                        targetPlayer
                    );

                },

            onBack:
                function () {

                    showInventoryPopup(
                        usingPlayer
                    );

                }
        }
    );

}

// =========================
// 共通
// 送る / 奪う 選択画面
// =========================

function showTransferTypePopup(
    usingPlayer,
    targetPlayer,
    options
) {

    let popup =
        document.getElementById(
            "transferTypePopup"
        );

    if (!popup) {

        popup =
            document.createElement(
                "div"
            );

        popup.id =
            "transferTypePopup";

        popup.className =
            "item-action-popup transfer-type-popup";

        popup.innerHTML = `
            <div class="item-action-title">
            </div>

            <div class="item-action-description">

                <strong class="transfer-target-name">
                </strong>

                <br><br>

                どうする？

            </div>

            <div
                class="item-action-content transfer-type-content"
            >

                <button
                    class="money-transfer-type-button"
                    type="button"
                    data-type="send"
                >
                </button>

                <button
                    class="money-transfer-type-button"
                    type="button"
                    data-type="steal"
                >
                </button>

            </div>

            <button
                class="item-action-back-button transfer-type-back-button"
                type="button"
            >
                戻る
            </button>
        `;

        document.body.appendChild(
            popup
        );

    }

    const title =
        popup.querySelector(
            ".item-action-title"
        );

    const targetName =
        popup.querySelector(
            ".transfer-target-name"
        );

    const sendButton =
        popup.querySelector(
            '[data-type="send"]'
        );

    const stealButton =
        popup.querySelector(
            '[data-type="steal"]'
        );

    const backButton =
        popup.querySelector(
            ".transfer-type-back-button"
        );

    title.textContent =
        options.title;

    targetName.textContent =
        targetPlayer.name;

    sendButton.textContent =
        options.sendLabel;

    stealButton.textContent =
        options.stealLabel;

    sendButton.onclick =
        function () {

            popup.style.display =
                "none";

            options.onSelect(
                "send"
            );

        };

    stealButton.onclick =
        function () {

            popup.style.display =
                "none";

            options.onSelect(
                "steal"
            );

        };

    backButton.onclick =
        function () {

            popup.style.display =
                "none";

            options.onBack();

        };

    popup.style.display =
        "block";

}


// =========================
// 闇みずほ
// 送金 / 奪金 選択
// =========================

function showMoneyTransferTypePopup(
    usingPlayer,
    targetPlayer
) {

    showTransferTypePopup(
        usingPlayer,
        targetPlayer,
        {
            title:
                "闇みずほ",

            sendLabel:
                "💰 送金",

            stealLabel:
                "💸 奪金",

            onSelect:
                function (type) {

                    showMoneyTransferAmountPopup(
                        usingPlayer,
                        targetPlayer,
                        type
                    );

                },

            onBack:
                function () {

                    showMoneyTransferPlayerPopup(
                        usingPlayer
                    );

                }
        }
    );

}

// =========================
// 送金奪金
// 金額入力画面
// =========================

function showMoneyTransferAmountPopup(
    usingPlayer,
    targetPlayer,
    type
) {

    let popup =
        document.getElementById(
            "moneyTransferAmountPopup"
        );

    if (!popup) {

        popup =
            document.createElement(
                "div"
            );

        popup.id =
            "moneyTransferAmountPopup";

        popup.className =
            "item-action-popup money-transfer-amount-popup";

        popup.innerHTML = `
            <div class="item-action-title">
                闇みずほ
            </div>

            <div
    class="item-action-description money-transfer-target-description"
></div>

<div
    class="money-transfer-target-money amount-target-money"
></div>

            <div
                class="item-action-content money-transfer-amount-content"
            >

                <input
                    type="number"
                    class="money-transfer-amount-input"
                    step="1000"
                    min="1000"
                >

                <span
                    class="money-transfer-amount-unit"
                >
                    G
                </span>

            </div>

            <button
                class="money-transfer-confirm-button"
                type="button"
            >
                実行
            </button>

            <button
                class="item-action-back-button money-transfer-amount-back-button"
                type="button"
            >
                戻る
            </button>
        `;

        document.body.appendChild(
            popup
        );

    }


    const description =
        popup.querySelector(
            ".money-transfer-target-description"
        );

    const amountInput =
        popup.querySelector(
            ".money-transfer-amount-input"
        );

    const confirmButton =
        popup.querySelector(
            ".money-transfer-confirm-button"
        );

    const backButton =
        popup.querySelector(
            ".money-transfer-amount-back-button"
        );


    // =========================
    // 上限を決定
    // =========================

    const maxAmount =
        type === "send"
            ? Math.max(
                0,
                Number(
                    usingPlayer.money
                )
            )
            : Math.max(
                0,
                Number(
                    targetPlayer.money
                )
            );


    // =========================
    // 送金 / 奪金の表示
    // =========================

    if (
    type === "send"
) {

    description.innerHTML =
        `${targetPlayer.name}へ送金`;

    confirmButton.textContent =
        "送金する";

} else {

    description.innerHTML =
        `${targetPlayer.name}から奪金`;

    confirmButton.textContent =
        "奪う";

}

const targetMoney =
    popup.querySelector(
        ".amount-target-money"
    );

targetMoney.innerHTML =
    `💰 相手の所持G：${formatG(targetPlayer.money)}G`;


    // =========================
    // 金額入力欄
    // =========================

    amountInput.min =
        1000;

    amountInput.max =
        maxAmount;

    amountInput.step =
        1000;

    amountInput.value =
        maxAmount >= 1000
            ? 1000
            : 0;


    // =========================
    // 実行
    // =========================

    confirmButton.onclick =
        function () {

            const inputAmount =
                Number(
                    amountInput.value
                );


            // =========================
            // 金額チェック
            // =========================

            if (
                !Number.isFinite(
                    inputAmount
                ) ||
                inputAmount <= 0
            ) {

                return;

            }


            // 1,000G単位にする

            if (
                inputAmount % 1000 !== 0
            ) {

                showEventPopup(
                    "闇みずほ",
                    "金額は1,000G単位で入力してください。",
                    function () {}
                );

                return;

            }


            // =========================
            // 上限チェック
            // =========================

            if (
                inputAmount >
                maxAmount
            ) {

                showEventPopup(
                    "闇みずほ",
                    type === "send"
                        ? `所持Gは<strong>${formatG(usingPlayer.money)}G</strong>です。`
                        : `${targetPlayer.name}の所持Gは<strong>${formatG(targetPlayer.money)}G</strong>です。`,
                    function () {}
                );

                return;

            }


            // =========================
            // 送金 / 奪金
            // =========================

            const amount =
                type === "send"
                    ? inputAmount
                    : -inputAmount;


            const result =
                useMoneyTransfer(
                    usingPlayer,
                    targetPlayer,
                    amount
                );


            if (!result) {
                return;
            }


            // =========================
            // 画面を閉じる
            // =========================

            popup.style.display =
                "none";


            // =========================
            // SE
            // =========================

            sendSound.pause();

            sendSound.currentTime =
                0;

            sendSound.play().catch(
                function (error) {

                    console.error(
                        "闇みずほSEの再生に失敗しました:",
                        error
                    );

                }
            );


            // =========================
            // プレイヤー表示更新
            // =========================

            updatePlayerStatusUI(
                usingPlayer
            );

            updatePlayerStatusUI(
                targetPlayer
            );

            renderPlayers();


            // =========================
            // 結果表示
            // =========================

            if (
                result.type ===
                "send"
            ) {

                showEventPopup(
                    "💰 送金",
                    `
                    ${targetPlayer.name}に
                    <br><br>

                    <strong>
                        ${formatG(result.amount)}G
                    </strong>

                    を送った！
                    `,
                    function () {

                        finishTurn(
                            usingPlayer
                        );

                    }
                );

                      } else {

                showEventPopup(
                    "💸 奪金",
                    `
                    ${targetPlayer.name}から
                    <br><br>

                    <strong>
                        ${formatG(result.amount)}G
                    </strong>

                    奪った！
                    `,
                    function () {

                        if (
                            targetPlayer.money <= 0
                        ) {

                            window.checkPlayerRespawn(
                                targetPlayer,
                                function () {

                                    finishTurn(
                                        usingPlayer
                                    );

                                }
                            );

                        } else {

                            finishTurn(
                                usingPlayer
                            );

                        }

                    }
                );

            }

        };


    // =========================
    // 戻る
    // =========================

    backButton.onclick =
        function () {

            popup.style.display =
                "none";

            showMoneyTransferTypePopup(
                usingPlayer,
                targetPlayer
            );

        };


    // =========================
    // 表示
    // =========================

    popup.style.display =
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
    ${
        item.effectDuration &&
        item.effectDuration.endsWith("turn") &&
        typeof inventoryData === "object"
            ? `
            ✨ 残り ${
            Math.max(
                0,
                Number(
                    inventoryData.remainingUses ??
                    item.effectDuration.replace("turn", "")
                )
            )
        }ターン
        `
            : `
        ✨ 持っているだけで効果発動
        `
    }
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
// ロスノート
// =========================

if (
    Number(itemId) === 13
) {

    inventoryPopup.style.display =
        "none";

    showLossNotePlayerPopup(
        player
    );

    return;

}

// =========================
// ロストマジック
// =========================

if (
    Number(itemId) === 18
) {

    inventoryPopup.style.display =
        "none";

    showLostMagicPlayerPopup(
        player
    );

    return;

}

// =========================================================
// 叩き派遣
// 他のプレイヤーのアイテムをランダムで破壊
// =========================================================

if (
    Number(itemId) === 17
) {

    inventoryPopup.style.display =
        "none";

    const results =
        useHatatakiHaken(
            player,
            players
        );

    if (!results) {

        return;

    }


    // =========================================
    // プレイヤーごとに結果を順番に表示
    // =========================================

    function showHatatakiResult(
        resultIndex
    ) {

        // 全員分終わったらターン終了
        if (
            resultIndex >=
            results.length
        ) {

            finishTurn(
                player
            );

            return;

        }


        const result =
            results[resultIndex];

        const targetPlayer =
            result.player;

        const lostItems =
            result.lostItems;


        // =========================================
        // アイテムを失った場合
        // =========================================

 if (
    lostItems.length > 0
) {

    function showLostItems(
        lostItemIndex,
        displayedItems
    ) {

        // =========================
        // すべて表示完了
        // =========================

      if (
    lostItemIndex >=
    lostItems.length
) {

    const lostItemHtml =
        displayedItems
            .map(
                function (itemName) {

                    return (
                        "・" +
                        itemName
                    );

                }
            )
            .join("<br>");


    showEventPopup(
        "💥 叩き派遣",

        `
        <strong>
            ${targetPlayer.name}はアイテムを失った！
        </strong>

        <br><br>

        ${lostItemHtml}

        <br><br>

        <strong>
            以上
        </strong>
        `,

        function () {

            showHatatakiResult(
                resultIndex + 1
            );

        }
    );

    return;
}


        // =========================
        // 今回失ったアイテム
        // =========================

        const itemName =
            lostItems[
                lostItemIndex
            ];


        // =========================
        // 表示済みアイテムに追加
        // =========================

        displayedItems.push(
            itemName
        );


        // =========================
        // 叩き派遣SE
        // =========================

        tatakiSound.pause();

        tatakiSound.currentTime =
            0;

        tatakiSound.play().catch(
            function (error) {

                console.error(
                    "叩き派遣SEの再生に失敗しました:",
                    error
                );

            }
        );


        // =========================
        // ここまでに失った
        // アイテムをすべて表示
        // =========================

        const lostItemHtml =
            displayedItems
                .map(
                    function (itemName) {

                        return (
                            "・" +
                            itemName
                        );

                    }
                )
                .join("<br>");


        showEventPopup(
            "💥 叩き派遣",

            `
            <strong>
                ${targetPlayer.name}はアイテムを失った！
            </strong>

            <br><br>

            ${lostItemHtml}
            `,

            function () {

                showLostItems(
                    lostItemIndex + 1,
                    displayedItems
                );

            }
        );

    }


    // =========================
    // 最初のアイテムから開始
    // =========================

    showLostItems(
        0,
        []
    );

    return;
}


        // =========================================
        // アイテムを失わなかった場合
        // =========================================

        showEventPopup(
            "💥 叩き派遣",
            `
            <strong>
                ${targetPlayer.name}は、攻撃をかわした！
            </strong>

            <br><br>

            ・失ったアイテムはありません。
            `,
            function () {

                showHatatakiResult(
                    resultIndex + 1
                );

            }
        );

    }


    // プレイヤー1人目から開始
    showHatatakiResult(0);

    return;

}

// =========================
// 瞬間移動
// ボスまであと1マスの場所へ移動
// =========================

if (
    item.effectType ===
    "warpToBoss"
) {

    const result =
        useWarpToBoss(
            player
        );


    // =========================
    // 使用できない場合
    // =========================

    if (!result) {

        showEventPopup(
            "瞬間移動",
            "すでにボスマスの近くにいるため、<br>" +
            "瞬間移動は使用できません。",
            function () {

                showInventoryPopup(
                    player
                );

            }
        );

        return;

    }


    // =========================
    // アイテム画面を閉じる
    // =========================

    inventoryPopup.style.display =
        "none";


    
    // =========================
    // 瞬間移動結果
    // =========================

    setTimeout(
        function () {

            showEventPopup(
                "瞬間移動",
                `${player.name}は<br>` +
                `ボスマスまであと1マスの場所へ<br>` +
                `瞬間移動した！`,
                function () {

                    finishTurn(
                        player
                    );

                }
            );

        },
        1000
    );

    return;


}

// =========================
// 飛んできマス
// ランダムなマスへワープ
// =========================

if (
    item.effectType ===
    "warpToRandom"
) {

    const result =
        useWarpToRandom(
            player
        );

    if (!result) {
        return;
    }

    inventoryPopup.style.display =
        "none";

    animateRandomWarp(
        player,
        result.position
    );

    return;
}


 // =========================
 // ふっとばしマス
 // 自分以外の全員を順番にワープ
 // =========================

if (
        item.effectType ===
        "warpAllPlayersRandom"
    ) {

        const results =
            useWarpAllPlayersRandom(player);

        if (!results || results.length === 0) {
            return;
        }

        // アイテム画面を閉じる
        inventoryPopup.style.display =
            "none";

        // 対象プレイヤーを順番に処理
        let warpIndex = 0;

        function warpNextPlayer() {

            // 全員のワープが終わった
            if (
                warpIndex >=
                results.length
            ) {

                // 使用プレイヤーの位置へカメラを戻す
                centerPlayerOnMap(
                    players.indexOf(player),
                    "smooth"
                );

                // カメラが戻ってからアナウンス
                setTimeout(
                    function () {

                        showEventPopup(
                            "ふっとばしマス",
                            "みんなふっとんだ！",
                            function () {

                                finishTurn(player);

                            }
                        );

                    },
                    500
                );

                return;
            }

            const target =
                results[warpIndex];

            warpIndex += 1;

            // 1人のワープが終わってから次の人へ
            animateRandomWarp(
                target.player,
                target.position,
                warpNextPlayer
            );

        }

        // 1人目から開始
        warpNextPlayer();

        return;
    }


// =========================
// 送金奪金
// =========================

if (
    Number(itemId) === 19
) {

    inventoryPopup.style.display =
        "none";

    showMoneyTransferPlayerPopup(
        player
    );

    return;

}


// =========================
// 闇ヤマト
// =========================

if (
    Number(itemId) === 21
) {

    inventoryPopup.style.display =
        "none";

    showItemTransferPlayerPopup(
        player
    );

    return;

}

// =========================
// 闇スーモ
// =========================

if (
    Number(itemId) === 22
) {

    inventoryPopup.style.display = "none";

    showDarkSuumoPlayerPopup(player);

    return;

}

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

                    if ( Number(itemId) === 1
                    ) {
                        diceCount = 2;
                    }
                    if ( Number(itemId) === 2
                    ) {
                        diceCount = 3;
                    }
                    if ( Number(itemId) === 3
                    ) {
                        diceCount = 4;
                    }
                    if ( Number(itemId) === 4
                    ) {
                        diceCount = 5;
                    }
                    if ( Number(itemId) === 5
                    ) {
                        diceCount = 6;
                    }
                    if ( Number(itemId) === 6
                    ) {
                        diceCount = 8;
                    }
                    if (Number(itemId) === 7
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
// ランダムワープ演出
// =========================


 // =========================
 // 飛んできマス
 // ランダムワープ演出
 // =========================

function animateRandomWarp(
    player,
    targetPosition,
    onComplete = null
) {

    const playerIndex =
        players.indexOf(player);

    // =========================
    // 演出終了時の共通処理
    // =========================

    function completeWarp() {

        if (typeof onComplete === "function") {
            onComplete();
            return;
        }

        showEventPopup(
            "飛んできマス",
            `${player.name}は<br>` +
            `ランダムなマスへワープした！`,
            function () {
                finishTurn(player);
            }
        );
    }

    // =========================
    // 現在のプレイヤー表示を取得
    // =========================

    const playerPiece =
        document.querySelector(
            `.map-node[data-square-id="${player.position}"] .player-piece[data-player-index="${playerIndex}"]`
        );

    // =========================
    // 表示できない場合
    // =========================

    if (!playerPiece) {

        player.position = targetPosition;

        renderMap();
        renderPlayers();

        window.centerPlayerOnMap(
            playerIndex,
            "smooth"
        );

        setTimeout(
            completeWarp,
            500
        );

        return;
    }

    // =========================
    // ① 現在位置へカメラ移動
    // =========================

    window.centerPlayerOnMap(
        playerIndex,
        "smooth"
    );

    // カメラ移動を待ってから演出開始
    setTimeout(
        function () {

            // =========================
            // ワープSE
            // =========================

            warpSound.currentTime = 0;

            warpSound.play().catch(
                function () {}
            );

            // =========================
            // ② 現在位置から飛び立つ
            // =========================

            const takeoffAnimation =
                playerPiece.animate(
                    [
                        {
                            transform:
                                "translate(-50%, -50%) scale(1)",
                            opacity: 1
                        },

                        {
                            transform:
                                "translate(-50%, calc(-50% - 120px)) scale(1.15)",
                            opacity: 1
                        },

                        {
                            transform:
                                "translate(-50%, calc(-50% - 300px)) scale(0.8)",
                            opacity: 0
                        }
                    ],
                    {
                        duration: 700,
                        easing: "ease-in",
                        fill: "forwards"
                    }
                );

            // =========================
            // ③ ワープ先へ移動
            // =========================

            
takeoffAnimation.onfinish =
    function () {

        player.position =
            targetPosition;

        renderMap();
        renderPlayers();

        // =========================
        // ④ ワープ先のキャラを取得
        // 描画直後に透明にする
        // =========================

        const newPlayerPiece =
            document.querySelector(
                `.map-node[data-square-id="${targetPosition}"] .player-piece[data-player-index="${playerIndex}"]`
            );

        if (!newPlayerPiece) {
            completeWarp();
            return;
        }

        // ★ここが重要：カメラ移動前に透明にする
        newPlayerPiece.style.opacity =
            "0";

        // =========================
        // ⑤ ワープ先へカメラ移動
        // =========================

        window.centerPlayerOnMap(
            playerIndex,
            "smooth"
        );

        // カメラ移動後に着地
        setTimeout(
            function () {

                // =========================
                // ⑥ 上空から着地
                // =========================

                const landingAnimation =
                    newPlayerPiece.animate(
                        [
                            {
                                transform:
                                    "translate(-50%, -50%) translateY(-350px) scale(0.8)",
                                opacity: 0
                            },

                            {
                                transform:
                                    "translate(-50%, -50%) translateY(20px) scale(1.05)",
                                opacity: 1
                            },

                            {
                                transform:
                                    "translate(-50%, -50%) translateY(0) scale(1)",
                                opacity: 1
                            }
                        ],
                        {
                            duration: 700,
                            easing: "ease-out",
                            fill: "forwards"
                        }
                    );

                // =========================
                // ⑦ 着地後、次の処理へ
                // =========================

               
landingAnimation.onfinish =
    function () {

        // =========================
        // 着地アニメーションの効果を解除
        // キャラクター本来のCSS表示へ戻す
        // =========================

        newPlayerPiece.style.removeProperty(
            "opacity"
        );

        landingAnimation.cancel();

        // =========================
        // 0.5秒後、次の処理へ
        // =========================

        setTimeout(
            completeWarp,
            500
        );

    };


            },
            500
        );

    };


        },
        500
    );

}


// =========================================================
// 闇ヤマト
// アイテム選択画面
// =========================================================

function showItemTransferSelectionPopup(
    usingPlayer,
    targetPlayer,
    type
) {

    let popup =
        document.getElementById(
            "itemTransferSelectionPopup"
        );

    if (!popup) {

        popup =
            document.createElement(
                "div"
            );

        popup.id =
            "itemTransferSelectionPopup";

        popup.className =
            "item-action-popup item-transfer-selection-popup";

        popup.innerHTML = `
            <div class="item-action-title">
                闇ヤマト
            </div>

            <div class="item-action-description">
                <strong class="item-transfer-selection-player">
                </strong>
                のアイテム
            </div>

            <div
                class="item-action-content item-transfer-selection-list"
            ></div>

            <button
                class="item-action-back-button item-transfer-selection-back-button"
                type="button"
            >
                戻る
            </button>
        `;

        document.body.appendChild(
            popup
        );

    }


    const itemList =
        popup.querySelector(
            ".item-transfer-selection-list"
        );

    const playerName =
        popup.querySelector(
            ".item-transfer-selection-player"
        );

    const backButton =
        popup.querySelector(
            ".item-transfer-selection-back-button"
        );


    // =========================
    // アイテム一覧を初期化
    // =========================

    itemList.innerHTML =
        "";


    // =========================
    // アイテムを持っているプレイヤー
    // =========================

    const sourcePlayer =
        type === "send"
            ? usingPlayer
            : targetPlayer;


    playerName.textContent =
        sourcePlayer.name;


    // =========================
    // アイテムがない場合
    // =========================

    if (
        !sourcePlayer.inventory ||
        sourcePlayer.inventory.length === 0
    ) {

        itemList.innerHTML = `
            <div class="inventory-empty">
                ${sourcePlayer.name}は
                アイテムを持っていません。
            </div>
        `;


        backButton.onclick =
            function () {

                popup.style.display =
                    "none";

                showTransferTypePopup(
                    usingPlayer,
                    targetPlayer,
                    {
                        title:
                            "闇ヤマト",

                        sendLabel:
                            "🎁 渡す",

                        stealLabel:
                            "💥 奪う",

                        onSelect:
                            function (nextType) {

                                showItemTransferSelectionPopup(
                                    usingPlayer,
                                    targetPlayer,
                                    nextType
                                );

                            },

                        onBack:
                            function () {

                                showItemTransferPlayerPopup(
                                    usingPlayer
                                );

                            }
                    }
                );

            };


        popup.style.display =
            "block";

        return;

    }


    // =========================
    // アイテム一覧
    // =========================

    sourcePlayer.inventory.forEach(
        function (
            inventoryData,
            inventoryIndex
        ) {

            const itemId =
                typeof inventoryData === "object"
                    ? inventoryData.id
                    : Number(inventoryData);


            const item =
                ITEM_CONTENTS[itemId];


            if (!item) {
                return;
            }

// =========================
 // 闇ヤマト自身は
 // 選択できない
// =========================
// 「渡す」の場合だけ、使用中の闇ヤマト1個を除外
if (
    type === "send" &&
    Number(itemId) === 21
) {
    const giveMeForYouCount =
        sourcePlayer.inventory.filter(
            function (inventoryData) {
                const currentItemId =
                    typeof inventoryData === "object"
                        ? inventoryData.id
                        : Number(inventoryData);

                return Number(currentItemId) === 21;
            }
        ).length;

    // 闇ヤマトが1個だけなら表示しない
    if (giveMeForYouCount <= 1) {
        return;
    }

    // 複数ある場合は、使用中の1個だけ除外する
    const firstGiveMeForYouIndex =
        sourcePlayer.inventory.findIndex(
            function (inventoryData) {
                const currentItemId =
                    typeof inventoryData === "object"
                        ? inventoryData.id
                        : Number(inventoryData);

                return Number(currentItemId) === 21;
            }
        );

    if (
        inventoryIndex === firstGiveMeForYouIndex
    ) {
        return;
    }
}

            const row =
                document.createElement(
                    "div"
                );

            row.className =
                "inventory-item";


            row.innerHTML = `
                <div class="inventory-item-name">
                    ${item.name}
                </div>

                <div class="inventory-item-effect">
                    ${item.effect}
                </div>

                <button
                    class="inventory-item-use-button"
                    type="button"
                >
                    ${
                        type === "send"
                            ? "渡す"
                            : "奪う"
                    }
                </button>
            `;


            const selectButton =
                row.querySelector(
                    ".inventory-item-use-button"
                );


            selectButton.onclick =
                function () {

                    selectButton.disabled =
                        true;


                    const result =
                        useItemTransfer(
                            usingPlayer,
                            targetPlayer,
                            inventoryIndex,
                            type
                        );


                    if (!result) {
                        return;
                    }


                    // =========================
                    // ポップアップを閉じる
                    // =========================

                    popup.style.display =
                        "none";


                    // =========================
                    // SE
                    // =========================

                    send2Sound.pause();

                    send2Sound.currentTime =
                        0;

                    send2Sound.play().catch(
                        function (error) {

                            console.error(
                                "闇ヤマトSEの再生に失敗しました:",
                                error
                            );

                        }
                    );


                    // =========================
                    // プレイヤー表示更新
                    // =========================

                    updatePlayerStatusUI(
                        usingPlayer
                    );

                    updatePlayerStatusUI(
                        targetPlayer
                    );

                    renderPlayers();


                    // =========================
                    // アイテム名
                    // =========================

                    const resultItem =
                        ITEM_CONTENTS[
                            result.itemId
                        ];


                    const resultItemName =
                        resultItem
                            ? resultItem.name
                            : "アイテム";


                    // =========================
                    // 結果表示
                    // =========================

                    if (
                        result.type ===
                        "send"
                    ) {

                        showEventPopup(
                            "🎁 闇ヤマト",
                            `
                            ${targetPlayer.name}に<br><br>

                            <strong>
                                ${resultItemName}
                            </strong>

                            <br><br>

                            を渡した！
                            `,
                            function () {

                                finishTurn(
                                    usingPlayer
                                );

                            }
                        );

                    } else {

                        showEventPopup(
                            "💥 闇ヤマト",
                            `
                            ${targetPlayer.name}から<br><br>

                            <strong>
                                ${resultItemName}
                            </strong>

                            <br><br>

                            を奪った！
                            `,
                            function () {

                                finishTurn(
                                    usingPlayer
                                );

                            }
                        );

                    }

                };


            itemList.appendChild(
                row
            );

        }
    );


    // =========================
    // 戻る
    // =========================

    backButton.onclick =
        function () {

            popup.style.display =
                "none";

            showTransferTypePopup(
                usingPlayer,
                targetPlayer,
                {
                    title:
                        "闇ヤマト",

                    sendLabel:
                        "🎁 渡す",

                    stealLabel:
                        "💥 奪う",

                    onSelect:
                        function (nextType) {

                            showItemTransferSelectionPopup(
                                usingPlayer,
                                targetPlayer,
                                nextType
                            );

                        },

                    onBack:
                        function () {

                            showItemTransferPlayerPopup(
                                usingPlayer
                            );

                        }
                }
            );

        };


    // =========================
    // 表示
    // =========================

    popup.style.display =
        "block";

}


// =========================================================
// 闇ヤマト
// プレイヤー選択
// =========================================================

function showItemTransferPlayerPopup(
    usingPlayer
) {

    showTransferPlayerPopup(
        usingPlayer,
        {
            title:
                "闇ヤマト",

            description:
                "アイテムを渡す・奪うプレイヤーを選択",

            showMoney:
                false,

            onSelect:
                function (
                    targetPlayer
                ) {

                    showTransferTypePopup(
                        usingPlayer,
                        targetPlayer,
                        {
                            title:
                                "闇ヤマト",

                            sendLabel:
                                "🎁 渡す",

                            stealLabel:
                                "💥 奪う",

                            onSelect:
                                function (type) {

                                    showItemTransferSelectionPopup(
                                        usingPlayer,
                                        targetPlayer,
                                        type
                                    );

                                },

                            onBack:
                                function () {

                                    showItemTransferPlayerPopup(
                                        usingPlayer
                                    );

                                }
                        }
                    );

                },

            onBack:
                function () {

                    showInventoryPopup(
                        usingPlayer
                    );

                }
        }
    );

}

// ============================================================
// 闇スーモ
// プレイヤー選択
// ============================================================

function showDarkSuumoPlayerPopup(usingPlayer) {

    showTransferPlayerPopup(
        usingPlayer,
        {
            title: "闇スーモ",
            description: "資産を贈与・強奪するプレイヤーを選択",
            showMoney: false,

            onSelect: function (targetPlayer) {

                showTransferTypePopup(
                    usingPlayer,
                    targetPlayer,
                    {
                        title: "闇スーモ",
                        sendLabel: "🎁 贈与",
                        stealLabel: "💥 強奪",

                        onSelect: function (type) {

                            showDarkSuumoAssetPopup(
                                usingPlayer,
                                targetPlayer,
                                type
                            );

                        },

                        onBack: function () {

                            showDarkSuumoPlayerPopup(usingPlayer);

                        }
                    }
                );

            },

            onBack: function () {

                showInventoryPopup(usingPlayer);

            }
        }
    );

}


// ============================================================
// 闇スーモ
// 資産選択
// ============================================================

function showDarkSuumoAssetPopup(
    usingPlayer,
    targetPlayer,
    type
) {

    let popup =
        document.getElementById("darkSuumoAssetPopup");

    if (!popup) {

        popup = document.createElement("div");
        popup.id = "darkSuumoAssetPopup";
        popup.className = "item-action-popup";

        popup.innerHTML = `
            <div class="item-action-title">闇スーモ</div>

            <div class="item-action-description">
                <strong class="dark-suumo-player-name"></strong>
                の保有資産
            </div>

            <div class="item-action-content dark-suumo-asset-list"></div>

            <button
                class="item-action-back-button dark-suumo-back-button"
                type="button"
            >
                戻る
            </button>
        `;

        document.body.appendChild(popup);

    }

    const assetList =
        popup.querySelector(".dark-suumo-asset-list");

    const playerName =
        popup.querySelector(".dark-suumo-player-name");

    const backButton =
        popup.querySelector(".dark-suumo-back-button");

    const sourcePlayer =
        type === "send"
            ? usingPlayer
            : targetPlayer;

    playerName.textContent = sourcePlayer.name;
    assetList.innerHTML = "";

    const ownedAssets =
        (sourcePlayer.assets || [])
            .map(function (assetId) {

                return {
                    id: Number(assetId),
                    asset: ASSET_CONTENTS[assetId]
                };

            })
            .filter(function (entry) {

                return entry.asset &&
                    entry.asset.owner === players.indexOf(sourcePlayer);

            });

    if (ownedAssets.length === 0) {

        assetList.innerHTML = `
            <div class="inventory-empty">
                移転できる資産はありません。
            </div>
        `;

    }

    ownedAssets.forEach(function (entry) {

        const row = document.createElement("div");
        row.className = "inventory-item";

        row.innerHTML = `
            <div class="inventory-item-name">
                ${entry.asset.name}
            </div>

            <div class="inventory-item-effect">
                ${formatG(entry.asset.price)}G
            </div>

            <button
                class="inventory-item-use-button"
                type="button"
            >
                ${type === "send" ? "贈与" : "強奪"}
            </button>
        `;

        row.querySelector(".inventory-item-use-button").onclick =
            function () {

                const result =
                    useAssetTransfer(
                        usingPlayer,
                        targetPlayer,
                        entry.id,
                        type
                    );

                if (!result) {
                    return;
                }

                popup.style.display = "none";

                send2Sound.pause();
                send2Sound.currentTime = 0;

                send2Sound.play().catch(function (error) {

                    console.error(
                        "闇スーモSEの再生に失敗しました:",
                        error
                    );

                });

                updatePlayerStatusUI(usingPlayer);
                updatePlayerStatusUI(targetPlayer);
                renderPlayers();

                showEventPopup(
                    type === "send"
                        ? "🎁 闇スーモ・贈与"
                        : "💥 闇スーモ・強奪",

                    `${sourcePlayer.name}の資産<br><br>` +
                    `<strong>${result.assetName}（${formatG(result.price)}G）</strong><br><br>` +
                    `${type === "send" ? targetPlayer.name : usingPlayer.name}` +
                    `に移転した！`,

                    function () {

                        finishTurn(usingPlayer);

                    }
                );

            };

        assetList.appendChild(row);

    });

    backButton.onclick = function () {

        popup.style.display = "none";

        showTransferTypePopup(
            usingPlayer,
            targetPlayer,
            {
                title: "闇スーモ",
                sendLabel: "🎁 贈与",
                stealLabel: "💥 強奪",

                onSelect: function (nextType) {

                    showDarkSuumoAssetPopup(
                        usingPlayer,
                        targetPlayer,
                        nextType
                    );

                },

                onBack: function () {

                    showDarkSuumoPlayerPopup(usingPlayer);

                }
            }
        );

    };

    popup.style.display = "block";

}

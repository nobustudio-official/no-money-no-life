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

        // 使用に必要な魔力
        requiredMagicPower:
            0
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

        // 使用に必要な魔力
        requiredMagicPower:
            0
    }

];

// =========================
// マップデータ
// =========================

const mapData = [

    {
        id: 0,
        name: "START",
        icon: "🏕️",
        type: "start",
        next: [1, 17],
        x: 10,
        y: 88
    },

    {
        id: 1,
        name: "草原",
        icon: "💰",
        type: "money",
        next: [2],
        x: 26,
        y: 88
    },

    {
        id: 2,
        name: "居酒屋のバイト",
        icon: "💼",
        type: "job",
        next: [3, 7],
        x: 42,
        y: 88
    },

    {
        id: 3,
        name: "遺跡",
        icon: "💰",
        type: "money",
        next: [4],
        x: 58,
        y: 88
    },

    {
        id: 4,
        name: "最悪",
        icon: "💀",
        type: "worst",
        next: [5],
        x: 74,
        y: 88
    },

    {
        id: 5,
        name: "森",
        icon: "👾",
        type: "monster",
        next: [11],
        x: 90,
        y: 88
    },

    {
        id: 6,
        name: "洞窟",
        icon: "📖",
        type: "event",
        next: [],
        x: 90,
        y: 70
    },

    {
        id: 7,
        name: "森",
        icon: "💰",
        type: "money",
        next: [8],
        x: 42,
        y: 70
    },

    {
        id: 8,
        name: "森",
        icon: "👾",
        type: "monster",
        next: [9],
        x: 54,
        y: 70
    },

    {
        id: 9,
        name: "魔法店",
        icon: "🔮",
        type: "magic_shop",
        next: [10],
        x: 66,
        y: 70
    },

    {
        id: 10,
        name: "宝箱",
        icon: "🎁",
        type: "treasure",       
        next: [11],
        x: 78,
        y: 70
    },

    {
        id: 11,
        name: "城門",
        icon: "💰",
        type: "money",
        next: [12],
        x: 90,
        y: 70
    },

    {
        id: 12,
        name: "丘",
        icon: "👾",
        type: "monster",
        next: [13,23],
        x: 90,
        y: 52
    },

    {
        id: 13,
        name: "草原",
        icon: "💰",
        type: "money",
        next: [14],
        x: 74,
        y: 52
    },

    {
        id: 14,
        name: "運び屋のバイト",
        icon: "💼",
        type: "job",
        next: [15, 19],
        x: 58,
        y: 52
    },

    {
        id: 15,
        name: "星の泉",
        icon: "💰",
        type: "money",
        next: [16],
        x: 42,
        y: 52
    },

    {
        id: 16,
        name: "魔法店",
        icon: "🔮",
        type: "magic_shop",
        next: [17],
        x: 26,
        y: 52
    },

    {
        id: 17,
        name: "冒険者",
        icon: "💰",
        type: "money",
        next: [18],
        x: 10,
        y: 52
    },

    {
        id: 18,
        name: "門",
        icon: "👾",
        type: "monster",
        next: [19],
        x: 10,
        y: 34
    },

    {
        id: 19,
        name: "魔法店",
        icon: "🔮",
        type: "magic_shop",
        next: [20],
        x: 26,
        y: 34
    },

    {
        id: 20,
        name: "宝箱",
        icon: "🎁",
        type: "treasure",
        next: [21],
        x: 42,
        y: 34
    },

    {
        id: 21,
        name: "パン屋のバイト",
        icon: "💼",
        type: "job",
        next: [22],
        x: 58,
        y: 34
    },

    {
        id: 22,
        name: "山",
        icon: "💰",
        type: "money",
        next: [23],
        x: 74,
        y: 34
    },

    {
        id: 23,
        name: "山道",
        icon: "👾",
        type: "monster",
        next: [29],
        x: 90,
        y: 34
    },

    {
        id: 24,
        name: "宝箱",
        icon: "🎁",
        type: "treasure",
        next: [25, 18],
        x: 10,
        y: 16
    },

    {
        id: 25,
        name: "宝箱",
        icon: "💰",
        type: "money",
        next: [26],
        x: 26,
        y: 16
    },

    {
        id: 26,
        name: "魔法店",
        icon: "🔮",
        type: "magic_shop",
        next: [27],
        x: 42,
        y: 16
    },

    {
        id: 27,
        name: "炎の地",
        icon: "👾",
        type: "monster",
        next: [28],
        x: 58,
        y: 16
    },

    {
        id: 28,
        name: "魔法店",
        icon: "🔮",
        type: "magic_shop",
        next: [29],
        x: 74,
        y: 16
    },

    {
        id: 29,
        name: "引っ越しバイト",
        icon: "💼",
        type: "job",
        next: [],
        x: 90,
        y: 16
    }

];
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
    position: 0,
    color: playerColors[index],
    inventory: [],
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

            showGameScreen(
                players,
                maxTurns
            );

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


            <!-- 目的地 -->

            <div class="destination">

                🎯 次の目的地：王都

            </div>


            <!-- マップ -->

            <div class="map-area">

                <h2>
                    🗺️ 異世界マップ
                </h2>

                <div
                    id="mapBoard"
                    class="map-board">
                </div>

            </div>


            <!-- 現在のターン -->

            <div
                id="turnDisplay"
                class="turn-display">
            </div>


            <!-- プレイヤー情報 -->

            <div
                id="playerStatus"
                class="player-status">
            </div>


            <!-- ルーレット -->

            <div class="roulette-area">

                <div id="rouletteNumber">
                    
                </div>

                <button id="rouletteButton">
                    🎲サイコロ
                </button>

                <button id="inventoryButton">
                 🎒 所持品
                </button>

                <button id="magicButton">
                🔮 魔法
                </button>

            </div>


            <!-- 分岐・方向選択 -->

            <div
                id="choiceArea"
                class="choice-area">
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
    // 所持品の移動アイテム使用処理
    // showGameScreen内の移動関数へ接続する
    // =========================

    window.useMoveItem = function (
        player,
        diceCount
    ) {

        // =========================
        // サイコロボタンを無効化
        // =========================

        rouletteButton.disabled =
            true;


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

                    💰 ${magic.cost}G

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

                <div
                    class="battle-magic-item-name"
                >

                    ${magic.icon}
                    ${magic.name}

                </div>


                <div
                    class="battle-magic-item-effect"
                >

                    ${magic.effect}

                </div>


                <div
                    class="battle-magic-item-cost"
                >

                    💰 ${magic.cost}G

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

        }
    );

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
    // 所持品ボタン
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

            }
        );



    // =========================
    // 所持品画面を閉じる
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


                squareIcon.textContent =
                    square.icon;


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
                        >

                            <strong>

                                <span
                                    class="player-icon"
                                    style="
                                        background-color:
                                        ${player.color} !important;
                                    "
                                ></span>

                                ${player.name}

                            </strong>


                            <span></span>


<span>
    💰${player.money}G
</span>

<span>
    🔮${player.magicPower}
</span>

                        </div>

                    `;

                }
            ).join("");

    }


    // =========================
    // 現在のターン表示
    // =========================

   function renderTurn() {

    const turnDisplay =
        document.getElementById("turnDisplay");


    turnDisplay.textContent =
        `TURN ${currentTurn} / ${maxTurns}　🎮 ${players[currentPlayer].name}`;


    if (
        remainingSteps > 0
    ) {

        turnDisplay.textContent +=
            `　🚶 残り ${remainingSteps} マス`;

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
        // メッセージ
        // =========================

        choiceArea.innerHTML = `

            <div class="branch-message">

                ↔️ 進む方向を選択してください

                <div class="branch-hint">

                    行きたい方向の矢印をタップ

                </div>

            </div>

        `;


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
    // プレイヤー移動
    // =========================

   function movePlayer(
    player,
    diceNumber,
    movementPath = [player.position]
) {

    // =========================
    // 消費したマス数
    // =========================

    const usedSteps =
        movementPath.length - 1;


    // =========================
    // 残りマス
    // =========================

    remainingSteps =
        diceNumber - usedSteps;


    renderTurn();


    // =========================
    // 移動終了
    // =========================

    if (
    remainingSteps <= 0
) {

    remainingSteps = 0;

    renderTurn();

    // =========================
    // マスに止まったら
    // 方向選択メッセージを消す
    // =========================

    document.getElementById(
        "choiceArea"
    ).innerHTML = "";

    handleSquareEvent(player);

    return;
}


    // =========================
    // 現在地から行ける場所
    // =========================

    const options =
        getConnectedOptions(
            player.position
        );


    // =========================
    // 行ける場所がない
    // =========================

    if (
        options.length === 0
    ) {

        remainingSteps = 0;

        renderTurn();

        finishTurn(player);

        return;

    }


    // =========================
    // 現在地を記録
    // =========================

    const currentPosition =
        player.position;


    // =========================
    // 1マス移動
    // =========================

    const moveTo =
        function (nextPosition) {

            // 直前のマス
            const previousPosition =
                movementPath[
                    movementPath.length - 2
                ];


            // 戻るかどうか
            const isBacktracking =
                nextPosition === previousPosition;


            // 移動履歴をコピー
            let nextPath =
                [...movementPath];


            // =========================
            // 戻る
            // =========================

            if (
                isBacktracking
            ) {

                nextPath.pop();

            }

            // =========================
            // 前へ進む
            // =========================

            else {

                nextPath.push(
                    nextPosition
                );

            }


            // =========================
            // 実際に移動
            // =========================

            moveOneStep(
                player,
                nextPosition
            );


            // =========================
            // 次の移動
            // =========================

            setTimeout(
                function () {

                    movePlayer(
                        player,
                        diceNumber,
                        nextPath
                    );

                },
                350
            );

        };


    // =========================
    // 一本道
    // =========================

    if (
        options.length === 1
    ) {

        moveTo(
            options[0]
        );

        return;

    }


    // =========================
    // 分岐
    // =========================

    showBranchChoice(
        options,
        function (selectedPosition) {

            moveTo(
                selectedPosition
            );

        }
    );

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


    rouletteButton.addEventListener(
        "click",
        function () {

            // =========================
            // 二重クリック防止
            // =========================

            rouletteButton.disabled =
                true;


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

function showEventPopup(
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
                        `${reward}G`;


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
// サイコロSE
// =========================

const diceSound =
    new Audio("sounds/サイコロ.wav");

diceSound.preload = "auto";

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
                `💰${player.money}G<br>` +
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
            // 攻撃ボタンは使用しない
            // =========================

            const attackButton =
                document.getElementById(
                    "battleAttackButton"
                );

            attackButton.style.display =
                "none";


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
                                    `💰 ${magic.cost}G 必要です。` +
                                    `<br>` +
                                    `現在の所持金：${player.money}G`,

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
                                `💰${player.money}G<br>` +
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


                                magicButton.textContent =
                                    "戦闘終了";


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
    monster.attack;

player.money -=
    monsterDamage;

if (player.money <= 0) {

    player.money = 0;

    renderPlayers();

    // 戦闘画面に攻撃結果を表示
    battlePlayerStats.innerHTML =
        `💰${player.money}G<br>🔮${player.magicPower}`;

    battleMessage.textContent =
        `👾 ${monster.name}の攻撃！ ${monsterDamage}Gのダメージ！`;

    // すぐに閉じず、戦闘画面を見せる
    // 戦闘結果を表示したまま待つ
battleMessage.textContent =
    `👾 ${monster.name}の攻撃！ ${monsterDamage}Gのダメージ！`;

// 戦闘画面に諦めるボタンを表示
let battleResultButton =
    document.getElementById("battleResultButton");

if (!battleResultButton) {

    battleResultButton =
        document.createElement("button");

    battleResultButton.id =
        "battleResultButton";

    battleResultButton.className =
        "battle-magic-button";

    battlePopup.appendChild(
        battleResultButton
    );
}

battleResultButton.textContent =
    "諦める";

battleResultButton.style.display =
    "block";

battleResultButton.onclick =
    function () {

        battleResultButton.style.display =
            "none";

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

    };
}


                            // =========================
                            // プレイヤー表示更新
                            // =========================

                            document.getElementById(
                                "battlePlayerStats"
                            ).innerHTML =
                                `💰${player.money}G<br>` +
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

                        `${reward}G 獲得！`,

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

            startMonsterBattle(
                player
            );

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
        💰 残り ${player.money}G`,
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
        `💰 所持金：${player.money}G`;


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

                    💰 ${magic.price}G

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
                                    ${magic.price}G
                                </strong>
                                必要です。
                                <br><br>

                                現在の所持金：
                                <strong>
                                    ${player.money}G
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
                            ${magic.price}G
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
                💰 ${player.money}G
            </span>

        `;


        resultRanking.appendChild(
            rankElement
        );

    });


    // =========================
    // 結果画面表示
    // =========================

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

    if (player.money <= 0) {

        checkPlayerRespawn(player, function () {
            finishTurn(player);
        });

        return;
    }


    // =========================
    // 全員のターンが終了したか
    // =========================

    if (
        currentPlayer ===
        players.length - 1
    ) {

        currentTurn +=
            1;


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

    }


    // =========================
    // 次のプレイヤー
    // =========================

    currentPlayer =
        (
            currentPlayer + 1
        )
        %
        players.length;


    const nextPlayer =
        players[currentPlayer];


    // =========================
    // 次のプレイヤーが
    // 仕事中か確認
    // =========================

    if (
        nextPlayer.jobTurnsRemaining > 0
    ) {

        // =========================
        // 仕事ターンを1消費
        // =========================

        nextPlayer.jobTurnsRemaining -=
            1;


        renderTurn();

        renderPlayers();


        // =========================
        // 仕事が終了した
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
                `${nextPlayer.name}は仕事を終えて<br><strong>${reward}G</strong>を獲得！`,
                function () {

                    // =========================
                    // このプレイヤーの
                    // ターンは仕事で終了
                    // =========================

                    finishTurn(
                        nextPlayer
                    );

                }
            );


            return;

        }


        // =========================
        // まだ仕事が残っている
        // =========================

        showEventPopup(
            "💼 仕事中",
            `${nextPlayer.name}は現在仕事中です。<br>` +
            `残り ${nextPlayer.jobTurnsRemaining} ターン`,
            function () {

                // =========================
                // このターンも消費
                // =========================

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
    // ルーレット使用可能
    // =========================

    rouletteButton.disabled =
        false;

}


// =========================
// 初期表示
// =========================

renderMap();

renderPlayers();

renderTurn();


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
                    `${rewardAmount}G 獲得！`,
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
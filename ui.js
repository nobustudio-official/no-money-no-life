// =========================
// UI管理
// ショップ関連
// =========================
//
// ショップの表示状態や
// ボタン配置などの「画面側」の処理を
// game.js から分離する。
// =========================


// =========================
// アイテムショップUI
// =========================

function setupItemShopUI(
    shopName,
    money
) {

    const shopPopup =
        document.getElementById(
            "shopPopup"
        );

    const shopNameElement =
        document.getElementById(
            "shopName"
        );

    const shopMoney =
        document.getElementById(
            "shopMoney"
        );

    const shopItemList =
        document.getElementById(
            "shopItemList"
        );

    const shopCloseButton =
        document.getElementById(
            "shopCloseButton"
        );


    if (!shopPopup) {
        return null;
    }


    shopNameElement.textContent =
        shopName;

    shopMoney.textContent =
        `💰 所持金：${formatG(money)}G`;

    shopMoney.style.display =
        "block";

    shopItemList.innerHTML =
        "";

    shopItemList.style.display =
        "flex";

    shopCloseButton.textContent =
        "やめる";


    shopPopup.style.display =
        "block";


    return {

        popup:
            shopPopup,

        list:
            shopItemList,

        money:
            shopMoney,

        closeButton:
            shopCloseButton

    };

}

// =========================
// アイテムショップメニューUI
// 「アイテムを購入」を選択
// =========================

function showItemShopMenuUI(
    onItem,
    onClose
) {

    const popup =
        document.getElementById(
            "shopPopup"
        );

    const list =
    document.getElementById(
        "shopItemList"
    );

    const closeButton =
        document.getElementById(
            "shopCloseButton"
        );


    list.innerHTML =
        "";

    list.style.display =
        "flex";

        const title =
    popup.querySelector(
        ".shop-title"
    );

if (title) {
    title.style.display =
        "block";
}

const shopName =
    document.getElementById(
        "shopName"
    );

if (shopName) {
    shopName.style.display =
        "none";
}


    // =========================
    // アイテム購入
    // =========================

    const itemButton =
        document.createElement(
            "button"
        );

    itemButton.className =
        "shop-category-button";

    itemButton.type =
        "button";

    itemButton.innerHTML = `
        <img
            src="images/ui-icons/item.png"
            class="shop-category-icon"
            alt=""
        >
        <span>
            アイテムを購入
        </span>
    `;

    itemButton.onclick =
        function () {

            onItem();

        };


    list.appendChild(
        itemButton
    );


    closeButton.textContent =
        "やめる";

    closeButton.onclick =
        function () {

            popup.style.display =
                "none";

            onClose();

        };


    popup.style.display =
        "block";

}


// =========================
// 魔法店メニューUI
// 「魔力 / 魔法」を選択
// =========================

function showMagicShopMenuUI(
    player,
    onPower,
    onMagic,
    onClose
) {

    const popup =
        document.getElementById(
            "magicShopPopup"
        );

    const title =
        popup.querySelector(
            ".magic-shop-title"
        );

    const money =
        document.getElementById(
            "magicShopMoney"
        );

    const list =
        document.getElementById(
            "magicShopList"
        );

    const closeButton =
        document.getElementById(
            "magicShopCloseButton"
        );


    title.textContent =
        "魔法店";

    money.textContent =
        `💰 所持金：${formatG(player.money)}G`;

    list.innerHTML =
        "";

    list.style.display =
        "flex";


    // =========================
    // 魔力購入
    // =========================

    const powerButton =
        document.createElement(
            "button"
        );

    powerButton.className =
        "shop-category-button";

    powerButton.type =
        "button";

    powerButton.innerHTML = `

    <img
        class="shop-category-icon"
        src="images/ui-icons/mana.png"
        alt=""
    >

    <span>
        魔力を購入
    </span>

`;

    powerButton.onclick =
        function () {

            onPower();

        };


    // =========================
    // 魔法購入
    // =========================

    const magicButton =
        document.createElement(
            "button"
        );

    magicButton.className =
        "shop-category-button";

    magicButton.type =
        "button";

    magicButton.innerHTML = `

    <img
        class="shop-category-icon"
        src="images/ui-icons/magic.png"
        alt=""
    >

    <span>
        魔法を購入
    </span>

`;

    magicButton.onclick =
        function () {

            onMagic();

        };


    list.appendChild(
        powerButton
    );

    list.appendChild(
        magicButton
    );


    closeButton.textContent =
        "やめる";

    closeButton.onclick =
        function () {

            popup.style.display =
                "none";

            onClose();

        };


    popup.style.display =
        "block";

}


// =========================
// 魔法店UIを閉じる
// =========================

function hideMagicShopUI() {

    const popup =
        document.getElementById(
            "magicShopPopup"
        );

    if (!popup) {
        return;
    }

    popup.style.display =
        "none";

}


// =========================
// アイテムショップUIを閉じる
// =========================

function hideItemShopUI() {

    const popup =
        document.getElementById(
            "shopPopup"
        );

    if (!popup) {
        return;
    }

    popup.style.display =
        "none";

}

// =========================
// PC：マップ左ドラッグ移動
// =========================

let mapMouseDragging = false;
let mapMouseDragMoved = false;

let mapMouseStartX = 0;
let mapMouseStartY = 0;

let mapMouseStartScrollLeft = 0;
let mapMouseStartScrollTop = 0;


function setupMapMouseDragUI() {

    const mapArea =
        document.querySelector(
            ".game-screen .map-area"
        );

    if (!mapArea) {
        return;
    }


    // =========================
    // 左ボタンを押したとき
    // =========================

    mapArea.addEventListener(
        "mousedown",
        function (event) {

            // 左クリック以外は対象外
            if (event.button !== 0) {
                return;
            }


            // マスの上から始めた場合は
            // 既存のマス操作を優先
            if (
                event.target.closest &&
                event.target.closest(".map-node")
            ) {
                return;
            }


            mapMouseDragging = true;
            mapMouseDragMoved = false;

            mapMouseStartX =
                event.clientX;

            mapMouseStartY =
                event.clientY;

            mapMouseStartScrollLeft =
                mapArea.scrollLeft;

            mapMouseStartScrollTop =
                mapArea.scrollTop;


            mapArea.style.cursor =
                "grabbing";

            event.preventDefault();

        }
    );


    // =========================
    // 左ドラッグ中
    // =========================

    mapArea.addEventListener(
        "mousemove",
        function (event) {

            if (!mapMouseDragging) {
                return;
            }


            const deltaX =
                event.clientX -
                mapMouseStartX;

            const deltaY =
                event.clientY -
                mapMouseStartY;


            // 少し動いたら
            // ドラッグ開始と判定
            if (
                Math.abs(deltaX) > 5 ||
                Math.abs(deltaY) > 5
            ) {
                mapMouseDragMoved = true;
            }


            if (!mapMouseDragMoved) {
                return;
            }


            mapArea.scrollLeft =
                mapMouseStartScrollLeft -
                deltaX;

            mapArea.scrollTop =
                mapMouseStartScrollTop -
                deltaY;


            event.preventDefault();

        }
    );


    // =========================
    // マウスを離したとき
    // =========================

    mapArea.addEventListener(
        "mouseup",
        function () {

            if (!mapMouseDragging) {
                return;
            }


            mapMouseDragging = false;

            mapArea.style.cursor =
                "";

        }
    );


    // =========================
    // マップ外で
    // マウスを離した場合
    // =========================

    document.addEventListener(
        "mouseup",
        function () {

            if (!mapMouseDragging) {
                return;
            }


            mapMouseDragging = false;

            mapArea.style.cursor =
                "";

        }
    );


    // =========================
    // ドラッグ終了直後の
    // マスクリック誤発火を防止
    // =========================

    mapArea.addEventListener(
        "click",
        function (event) {

            if (!mapMouseDragMoved) {
                return;
            }


            event.preventDefault();
            event.stopPropagation();

            mapMouseDragMoved = false;

        },
        true
    );

}


// =========================
// PC：マップ左ドラッグ移動開始
// =========================

setupMapMouseDragUI();

// =========================
// PC：マウスホイールでマップ拡大縮小
// =========================

let mapZoomUI = 1;

const MAP_ZOOM_MIN = 0.3;
const MAP_ZOOM_MAX = 2.2;
const MAP_WHEEL_ZOOM_STEP = 0.1;
const MAP_IMPORTANT_ICON_ZOOM_THRESHOLD = 0.5;

let mapMouseWheelZoomInitialized = false;


// =========================
// 現在のズーム倍率を取得
// =========================

function getMapZoomUI() {

    return mapZoomUI;

}


// =========================
// ズーム倍率を設定
// =========================

function setMapZoomUI(zoom) {

    mapZoomUI =
        Math.max(
            MAP_ZOOM_MIN,
            Math.min(
                zoom,
                MAP_ZOOM_MAX
            )
        );

    applyMapZoomUI();

}


// =========================
// マップへズームを反映
// =========================

function applyMapZoomUI() {

    const mapBoard =
        document.getElementById(
            "mapBoard"
        );


    if (!mapBoard) {
        return;
    }


    // =========================
    // マップ全体をズーム
    // =========================

    mapBoard.style.transform =
        `scale(${mapZoomUI})`;


    mapBoard.style.transformOrigin =
        "center center";


    // =========================
    // プレイヤー・ボスの
    // 強調倍率を計算
    // =========================

    let importantScale = 1;


    // =========================
    // 一定倍率以下になったら
    // マップの縮小を打ち消す
    // =========================

    if (
        mapZoomUI <=
        MAP_IMPORTANT_ICON_ZOOM_THRESHOLD
    ) {

        importantScale =
            1 / mapZoomUI;

    }


    // =========================
    // CSSへ強調倍率を渡す
    // =========================

    mapBoard.style.setProperty(
        "--map-important-scale",
        importantScale
    );

}


// =========================
// PC：マウスホイールズーム
// =========================

function setupMapMouseWheelZoomUI() {

    if (mapMouseWheelZoomInitialized) {
        return true;
    }


    // =========================
    // マップへイベントを登録
    // =========================

    function attachMapWheelZoom() {

        const mapArea =
            document.querySelector(
                ".game-screen .map-area"
            );


        if (!mapArea) {
            return false;
        }


        // =========================
        // マップボードが存在するか確認
        // =========================

        const mapBoard =
            document.getElementById(
                "mapBoard"
            );


        if (!mapBoard) {
            return false;
        }


        // =========================
        // 二重登録防止
        // =========================

        if (
            mapArea.dataset
                .mouseWheelZoomInitialized ===
            "true"
        ) {

            return true;

        }


        mapArea.dataset
            .mouseWheelZoomInitialized =
            "true";


                // =========================
        // マウスホイール
        // =========================

        mapArea.addEventListener(
            "wheel",
            function (event) {

                // =========================
                // PCのホイール操作
                // =========================

                if (
                    event.deltaY === 0
                ) {

                    return;

                }


                // =========================
                // Ctrl + ホイールは
                // ブラウザ側に任せる
                // =========================

                if (event.ctrlKey) {

                    return;

                }


                // =========================
                // ブラウザのスクロールを停止
                // =========================

                event.preventDefault();


                // =========================
                // マップボード取得
                // =========================

                const mapBoard =
                    document.getElementById(
                        "mapBoard"
                    );


                if (!mapBoard) {

                    return;

                }


                // =========================
                // マウス位置
                // mapArea基準
                // =========================

                const rect =
                    mapArea.getBoundingClientRect();


                const mouseX =
                    event.clientX -
                    rect.left;

                const mouseY =
                    event.clientY -
                    rect.top;


                // =========================
                // ズーム前の状態
                // =========================

                const oldZoom =
                    mapZoomUI;

                const oldScrollLeft =
                    mapArea.scrollLeft;

                const oldScrollTop =
                    mapArea.scrollTop;


                // =========================
                // 拡大・縮小
                // =========================

                let newZoom =
                    oldZoom;


                if (
                    event.deltaY < 0
                ) {

                    // ホイール上
                    // → 拡大

                    newZoom +=
                        MAP_WHEEL_ZOOM_STEP;

                } else {

                    // ホイール下
                    // → 縮小

                    newZoom -=
                        MAP_WHEEL_ZOOM_STEP;

                }


                // =========================
                // ズーム範囲
                // =========================

                newZoom =
                    Math.max(
                        MAP_ZOOM_MIN,
                        Math.min(
                            newZoom,
                            MAP_ZOOM_MAX
                        )
                    );


                // =========================
                // 変化がなければ終了
                // =========================

                if (
                    newZoom === oldZoom
                ) {

                    return;

                }


                // =========================
                // mapBoardの中心座標
                // =========================
                //
                // mapBoardは
                // transform-origin:
                // center center
                // なので、
                // 左上基準ではなく
                // 中心基準で計算する
                //
                // =========================

                const boardCenterX =
                    mapBoard.offsetLeft +
                    mapBoard.offsetWidth / 2;

                const boardCenterY =
                    mapBoard.offsetTop +
                    mapBoard.offsetHeight / 2;


                // =========================
                // カーソルが指している
                // mapBoard上の座標を取得
                // =========================

                const boardPointX =
                    boardCenterX +
                    (
                        mouseX +
                        oldScrollLeft -
                        boardCenterX
                    ) /
                    oldZoom;


                const boardPointY =
                    boardCenterY +
                    (
                        mouseY +
                        oldScrollTop -
                        boardCenterY
                    ) /
                    oldZoom;


                // =========================
                // ズームを反映
                // =========================

                setMapZoomUI(
                    newZoom
                );


                // =========================
                // ズーム後も
                // カーソル位置に
                // 同じマスを維持する
                // =========================

                requestAnimationFrame(
                    function () {

                        // =========================
                        // ズーム後の
                        // カーソル対象座標
                        // =========================

                        const zoomedPointX =
                            boardCenterX +
                            (
                                boardPointX -
                                boardCenterX
                            ) *
                            newZoom;


                        const zoomedPointY =
                            boardCenterY +
                            (
                                boardPointY -
                                boardCenterY
                            ) *
                            newZoom;


                        // =========================
                        // スクロール位置を調整
                        // =========================

                        const targetScrollLeft =
                            zoomedPointX -
                            mouseX;


                        const targetScrollTop =
                            zoomedPointY -
                            mouseY;


                        // =========================
                        // スクロール
                        // =========================

                        mapArea.scrollLeft =
                            targetScrollLeft;

                        mapArea.scrollTop =
                            targetScrollTop;

                    }
                );

            },
            {
                passive: false
            }
        );


        return true;

    }


    // =========================
    // 現在マップが存在するか確認
    // =========================

    if (
        attachMapWheelZoom()
    ) {

        mapMouseWheelZoomInitialized =
            true;

        return true;

    }


    // =========================
    // マップの生成を監視
    // =========================

    const observer =
        new MutationObserver(
            function () {

                if (
                    attachMapWheelZoom()
                ) {

                    mapMouseWheelZoomInitialized =
                        true;

                    observer.disconnect();

                }

            }
        );


    observer.observe(
        document.body,
        {
            childList: true,
            subtree: true
        }
    );


    return true;

}


// =========================
// 外部から使用できるようにする
// =========================

window.getMapZoomUI =
    getMapZoomUI;

window.setMapZoomUI =
    setMapZoomUI;

window.applyMapZoomUI =
    applyMapZoomUI;


// =========================
// PC：マウスホイールズーム開始
// =========================

setupMapMouseWheelZoomUI();

// =========================
// マス詳細パネル
// =========================

let squareDetailPanel = null;


// =========================
// マス詳細パネルを作成
// =========================

function createSquareDetailPanel() {

    if (squareDetailPanel) {
        return squareDetailPanel;
    }

    squareDetailPanel =
        document.createElement("div");

    squareDetailPanel.id =
        "squareDetailPanel";

    squareDetailPanel.className =
        "square-detail-panel";


    squareDetailPanel.style.display =
        "none";

    squareDetailPanel.innerHTML = `

        <div
            class="square-detail-title"
        ></div>

        <div
            class="square-detail-content"
        ></div>

        <div
            class="square-detail-buttons"
        >

            <button
                type="button"
                class="square-detail-go-button"
                style="display:none;"
            >
                ここに行く
            </button>

            <button
                type="button"
                class="square-detail-close-button"
            >
                閉じる
            </button>

        </div>

    `;

    document.body.appendChild(
        squareDetailPanel
    );

    return squareDetailPanel;
}


// =========================
// マス詳細パネル取得
// =========================

function getSquareDetailPanel() {

    if (
        squareDetailPanel &&
        document.body.contains(
            squareDetailPanel
        )
    ) {
        return squareDetailPanel;
    }

    return createSquareDetailPanel();
}


// =========================
// マス詳細パネルを閉じる
// =========================

function hideSquareDetail() {

    const panel =
        getSquareDetailPanel();

    if (!panel) {
        return;
    }

     panel.style.setProperty(
        "display",
        "none",
        "important"
    );
}


// =========================
// 金額表示
// =========================

function getSquareDetailPrice(
    price
) {

    if (
        typeof price !==
        "number"
    ) {
        return "";
    }

    return (
        ` ${formatG(price)}G`
    );
}


// =========================
// ショップ詳細
// =========================

function buildShopSquareDetail(
    square
) {

    const shopBox =
        SHOP_BOXES[
            square.typeId
        ];

    if (!shopBox) {

        return {
            title: "ショップ",
            content:
                "<div>購入できる商品はありません。</div>"
        };

    }

    const items =
        (shopBox.itemContents || [])
            .map(
                function (itemId) {

                    const item =
                        ITEM_CONTENTS[
                            itemId
                        ];

                    if (!item) {
                        return "";
                    }

                    return `
                        <div class="square-detail-item">
                            <strong>
                                ${item.name}
                            </strong>
                            <span>
                                ${getSquareDetailPrice(item.price)}
                            </span>
                        </div>
                    `;

                }
            )
            .filter(
                function (html) {
                    return html !== "";
                }
            )
            .join("");

    return {

        title:
            shopBox.name || "ショップ",

        content:
            items ||
            "<div>購入できる商品はありません。</div>"

    };
}


// =========================
// 魔法店詳細
// =========================

function buildMagicShopSquareDetail(
    square
) {

    const shopBox =
        SHOP_BOXES[
            square.typeId
        ];

    if (!shopBox) {

        return {
            title: "魔法店",
            content:
                "<div>購入できるものはありません。</div>"
        };

    }

    const powerItems =
        (shopBox.powerContents || [])
            .map(
                function (powerId) {

                    const power =
                        POWER_CONTENTS[
                            powerId
                        ];

                    if (!power) {
                        return "";
                    }

                    return `
                        <div class="square-detail-item">
                            <strong>
                                ${power.effect}
                            </strong>
                            <span>
                                ${getSquareDetailPrice(power.price)}
                            </span>
                        </div>
                    `;

                }
            )
            .filter(
                function (html) {
                    return html !== "";
                }
            )
            .join("");

    const magicItems =
        (shopBox.magicContents || [])
            .map(
                function (magicId) {

                    const magic =
                        MAGIC_CONTENTS[
                            magicId
                        ];

                    if (!magic) {
                        return "";
                    }

                    return `
                        <div class="square-detail-item">
                            <strong>
                                ${magic.name}
                            </strong>
                            <span>
                                ${getSquareDetailPrice(magic.price)}
                            </span>
                        </div>
                    `;

                }
            )
            .filter(
                function (html) {
                    return html !== "";
                }
            )
            .join("");

    return {

        title:
            shopBox.name || "魔法店",

        content: `

            <div class="square-detail-section-title">
    <img
        src="images/ui-icons/mana.png"
        alt="魔力"
        class="square-detail-section-icon"
    >
    魔力
</div>

            ${
                powerItems 
            }

            <div class="square-detail-section-title">
    <img
        src="images/ui-icons/magic.png"
        alt="魔法"
        class="square-detail-section-icon"
    >
    魔法
</div>

            ${
                magicItems 
            }

        `

    };
}


// =========================
// 資産マス詳細
// =========================

function buildAssetSquareDetail(
    square
) {

    const assetIds = [];

    (
        square.typeIds || []
    ).forEach(
        function (typeId) {

            const assetBox =
                ASSET_BOXES[
                    typeId
                ];

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

    const assetTypeNames =
        (
            square.typeIds || []
        )
            .map(
                function (typeId) {

                    const assetBox =
                        ASSET_BOXES[
                            typeId
                        ];

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

   const assetItems =
    assetIds
        .map(
            function (assetId) {

                const asset =
                    ASSET_CONTENTS[
                        assetId
                    ];

                if (!asset) {
                    return "";
                }


                // =========================
                // 所有者アイコン
                // =========================

                let ownerIcon = "";

                if (
                    asset.owner !== null &&
                    asset.owner !== undefined
                ) {

                    ownerIcon = `
                        <div
                            class="square-detail-owner-icon"
                            style="
                                background-image:
                                    url('${getPlayerCharacterIcon(asset.owner)}');
                            "
                            aria-label="プレイヤー${asset.owner + 1}"
                        ></div>
                    `;

                }


                // =========================
                // 資産1行
                // =========================

               return `
    <div class="square-detail-item">

        <strong>
            ${asset.name}
        </strong>

        ${ownerIcon}

        <span>
            ${getSquareDetailPrice(asset.price)}
        </span>

    </div>
`;

            }
        )
        .filter(
            function (html) {
                return html !== "";
            }
        )
        .join("");

    return {

        title:
            assetTypeNames.join(" / ") ||
            "資産",

        content:
            assetItems ||
            "<div>購入できる資産はありません。</div>"

    };
}

// =========================
// バイトマス詳細
// =========================
function buildJobSquareDetail(
    square
) {

    const jobData =
        getJobData(
            square.jobId
        );

    if (!jobData) {

        return {

            title:
                "バイトマス",

            content:
                "<div>バイト情報がありません。</div>"

        };

    }

    const currentWage =
        getCurrentJobWage(
            jobData.unitPrice
        );

    return {

        title:
            "バイトマス",

        content: `

            <div class="square-detail-item">

                <strong>
                    ${jobData.name}
                </strong>

                <span>
                    時給 ${formatG(currentWage)}G
                </span>

            </div>

        `

    };

}

// =========================
// ボスマス詳細
// =========================

function buildBossSquareDetail() {
    return {
        title:
            "ボスマス",
        content:`
            <div class="square-detail-description">
                ボスとの戦闘が行えます。
                <br>
                ◆ 報酬内容
                <br>
                ・到着ボーナス
                <br>
                ・ダメージボーナス
                <br>
                ・撃破ボーナス
            </div>  `
    };
}

// =========================
// 通常マス詳細
// =========================

function buildFixedSquareDetail(
    square
) {

    // =========================
    // マスのタイトル
    // =========================

    const fixedNames = {

        start:
            "スタートマス",

        money:
            "お金マス",

        monster:
            "モンスターマス",

        job:
            "バイトマス",

        treasure:
            "宝箱マス",

        shop:
            "ショップ",

        magic_shop:
            "魔法店",

        asset:
            "資産マス",

        worst:
            "最悪マス"

    };


    // =========================
    // マスの説明文
    // =========================
    // ★ここを自由にカスタマイズできます
    // =========================

    const fixedDescriptions = {

        start:
            "ここからゲームが始まります。<br>止まってもイベントはありません。",

        money:
            "ゴールドをランダムで獲得できます。",

        monster:
            "モンスターとの戦闘が発生します。<br>モンスターの種類はランダムです。<br>倒したあとは魔力またはゴールドの獲得が可能です。",

        job:
            "次の1ターンスキップすることでゴールドを獲得できます。",

        treasure:
            "宝箱からランダムでアイテムなどを獲得できます。",

        shop:
            "アイテムを購入できます。",

        magic_shop:
            "魔法や魔力を購入できます。",

        asset:
            "資産を購入できます。",

        worst:
            "最悪な出来事に遭遇します。"

    };


    // =========================
    // タイトル取得
    // =========================

    const title =
        fixedNames[
            square.type
        ] ||
        "マス";


    // =========================
    // 説明文取得
    // =========================

    const description =
        fixedDescriptions[
            square.type
        ] ||
        "";


    // =========================
    // 詳細データ
    // =========================

    return {

        title:
            title,

        content:
            `<div class="square-detail-description">
                ${description}
            </div>`

    };

}


// =========================
// マス詳細データ作成
// =========================

function buildSquareDetailData(
    square
) {

    if (!square) {
        return null;
    }


    // =========================
    // ボスマスか確認
    // =========================

    if (
        square.id ===
        currentBossSquareId
    ) {

        return buildBossSquareDetail();

    }


    switch (
        square.type
    ) {

        case "shop":

            return buildShopSquareDetail(
                square
            );

        case "magic_shop":

            return buildMagicShopSquareDetail(
                square
            );

        case "asset":

            return buildAssetSquareDetail(
                square
            );

        case "job":

         return buildJobSquareDetail(
        square
          );


        default:

            return buildFixedSquareDetail(
                square
            );

    }
}


// =========================
// マス詳細パネル表示
// =========================

function showSquareDetail(
    square
) {

    if (!square) {
        return;
    }

    const panel =
        getSquareDetailPanel();

    if (!panel) {
        return;
    }

    const title =
        panel.querySelector(
            ".square-detail-title"
        );

    const content =
        panel.querySelector(
            ".square-detail-content"
        );

    const goButton =
        panel.querySelector(
            ".square-detail-go-button"
        );

    const closeButton =
        panel.querySelector(
            ".square-detail-close-button"
        );

    if (
        !title ||
        !content ||
        !goButton ||
        !closeButton
    ) {
        return;
    }

    const detailData =
        buildSquareDetailData(
            square
        );

    if (!detailData) {
        return;
    }

    title.textContent =
        detailData.title;

    content.innerHTML =
        detailData.content;

    // =========================
    // 「ここに行く」は
    // 今回は表示しない
    // =========================

    goButton.style.display =
        "none";

    closeButton.onclick =
        function () {

            hideSquareDetail();

        };

    panel.style.setProperty(
    "display",
    "flex",
    "important"
);
}


// =========================
// 外部公開
// =========================

window.showSquareDetail =
    showSquareDetail;

window.hideSquareDetail =
    hideSquareDetail;
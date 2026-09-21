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
        "🏃 やめる";


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
        "🔮 魔法店";

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

    powerButton.textContent =
        "🔮 魔力を購入";

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

    magicButton.textContent =
        "🪄 魔法を購入";

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
        "🏃 やめる";

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

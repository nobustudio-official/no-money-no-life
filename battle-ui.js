/* =========================================================
   battle-ui.js
   新バトルUI

   役割：
   ・通常モンスター戦のイントロ表示
   ・新バトルUIの生成／表示
   ・魔法選択と詳細表示
   ・攻撃／逃げる操作
   ・3ラウンド制の戦闘進行

   ※ 既存の game.js のデータ・ダメージ計算・報酬処理を利用します。
   ※ 旧 battle.js / battle-ui.js / battle-effect.js には依存しません。
========================================================= */

(function () {

    "use strict";


    const BATTLE_BACKGROUND_PATH =
        "images/back-image/戦闘1.png";

    const BATTLE_ATTACK_ICON_PATH =
        "images/ui-icons/戦う.png";

    const BATTLE_ESCAPE_RATE =
        0.5; // 仮設定：逃げる成功率。正式値決定後ここだけ変更。


    let activeBattle = null;


    function ensureBattleUI() {

        let battleRoot =
            document.getElementById("battleUIRoot");

        if (!battleRoot) {

            battleRoot =
                document.createElement("div");

            battleRoot.id =
                "battleUIRoot";

            document.body.appendChild(
                battleRoot
            );

        }

        battleRoot.innerHTML = `

            <div
                id="battleIntroPopup"
                class="battle-new-popup battle-intro-popup"
                aria-hidden="true"
            >
                <div class="battle-intro-inner">

                    <div
                        id="battleIntroMonster"
                        class="battle-intro-monster"
                    ></div>

                    <div
                        id="battleIntroMessage"
                        class="battle-intro-message"
                    ></div>

                    <div class="battle-intro-hint">
                        　＞＞
                    </div>

                </div>
            </div>


            <div
                id="battleMainPopup"
                class="battle-new-popup battle-main-popup"
                aria-hidden="true"
            >

                <div class="battle-main-screen">

                    
                    <div class="battle-round-badge">
                        <span id="battleNewRound">ROUND 1 / 3</span>
                    </div>


                    <div class="battle-field">


                        <div class="battle-monster-area">

                            <div
                                id="battleNewMonsterName"
                                class="battle-monster-name"
                            ></div>

                            <div class="battle-monster-visual-wrap">
                                <img
                                    id="battleNewMonsterImage"
                                    class="battle-monster-image"
                                    alt="モンスター"
                                >
                                <div
                                    id="battleNewMonsterFallback"
                                    class="battle-monster-fallback"
                                ></div>
                            </div>

                            <div class="battle-hp-bar">
                                <div
                                    id="battleNewMonsterHpFill"
                                    class="battle-hp-fill"
                                ></div>
                            </div>

                            <div
                                id="battleNewMonsterHp"
                                class="battle-monster-hp"
                            ></div>

                        </div>

                    </div>


                    <div class="battle-control-panel">

                        <div class="battle-magic-panel">

        <div class="battle-panel-title">
    <img src="images/ui-icons/magic.png" alt="">
    <span>魔法一覧</span>
</div>

                            <div
                                id="battleNewMagicList"
                                class="battle-new-magic-list"
                            ></div>



                        </div>

<!-- =========================
     プレイヤーHP
========================= -->

<div
    class="battle-player-hp"
>

    <div
        class="battle-player-hp-bar"
    >
        <div
            id="battlePlayerHpFill"
            class="battle-player-hp-fill"
        ></div>
    </div>

    <div
        class="battle-player-hp-status"
    >

        <img
            id="battlePlayerHpIcon"
            class="battle-player-hp-icon"
            src=""
            alt=""
        >

        <div
            id="battlePlayerHpMax"
            class="battle-player-hp-max"
        >
            / 0G
        </div>

    </div>

</div>

                            <div
                            class="battle-selected-magic"
                            style="
                                grid-area: detail;
                                min-width: 0;
                                width: 100%;
                                height: auto;
                                min-height: 116px;
                                margin: 0;
                                padding: 10px 14px;
                                box-sizing: border-box;
                                border: 1px solid rgba(255, 255, 255, 0.35);
                                border-radius: 12px;
                                background: rgba(16, 26, 45, 0.82);
                                box-shadow: 0 5px 18px rgba(0, 0, 0, 0.25);
                                overflow: hidden;
                            "
                        >

                        
                                 <div
                                    id="battleNewSelectedMagicIcon"
                                    class="battle-selected-magic-icon"
                                    style="
                                        flex: 0 0 72px;
                                        width: 72px;
                                        height: 72px;
                                    "
                                ></div>

                            <div class="battle-selected-magic-info">

                                <div class="battle-selected-magic-left">

                                                   <div
                                            id="battleNewSelectedMagicName"
                                            class="battle-selected-magic-name"
                                            style="
                                                font-size: 25px;
                                                line-height: 1.2;
                                            "
                                        >
                                            魔法を選択してください
                                        </div>

                                                                 <div
                                            id="battleNewSelectedMagicEffect"
                                            class="battle-selected-magic-effect"
                                            style="
                                                margin-top: 6px;
                                                font-size: 14px;
                                                line-height: 1.3;
                                            "
                                        ></div>
                                </div>

                                        <div
                                        class="battle-selected-magic-right"
                                        style="
                                            gap: 6px;
                                        "
                                    >

                                        <div
                                            class="battle-selected-magic-cost"
                                            style="
                                                font-size: 18px;
                                                line-height: 1.3;
                                            "
                                        >
                                            <span>コスト</span>
                                            <strong
                                                style="
                                                    font-size: 28px;
                                                    line-height: 1.2;
                                                    white-space: nowrap;
                                                "
                                            >
                                                <span id="battleNewSelectedMagicCost">—</span>G
                                            </strong>
                                        </div>

                                        <div
                                            class="battle-selected-magic-damage"
                                            style="
                                                font-size: 18px;
                                                line-height: 1.3;
                                            "
                                        >
                                            <span>予測ダメージ</span>
                                            <strong
                                                id="battleNewSelectedMagicDamage"
                                                style="
                                                    font-size: 28px;
                                                    line-height: 1.2;
                                                    white-space: nowrap;
                                                "
                                            >—</strong>
                                        </div>

                                    </div>

                            </div>

                        </div>


                    <div
                        id="battleNewMessage"
                        class="battle-new-message"
                    ></div>


                    <div class="battle-action-row">

                        <button
                            id="battleNewAttackButton"
                            class="battle-new-action-button battle-new-attack-button"
                            type="button"
                            disabled
                        >
                            <img
                                src="${BATTLE_ATTACK_ICON_PATH}"
                                alt=""
                            >
                            <span>戦う</span>
                        </button>

                        <button
                            id="battleNewEscapeButton"
                            class="battle-new-action-button battle-new-escape-button"
                            type="button"
                        >
                            <span>逃げる</span>
                        </button>

                    </div>

                </div>

            </div>

        `;

        bindIntroEvents();

        return battleRoot;

    }


    function bindIntroEvents() {

        const intro =
            document.getElementById("battleIntroPopup");

        if (!intro) {
            return;
        }

        intro.onclick =
            function () {

                if (
                    !activeBattle ||
                    intro.getAttribute("aria-hidden") === "true"
                ) {
                    return;
                }

                showBattleMain();

            };

    }


    function showLayer(id) {

        const element =
            document.getElementById(id);

        if (!element) {
            return;
        }

        element.setAttribute(
            "aria-hidden",
            "false"
        );

        element.classList.add("is-visible");

    }


    function hideLayer(id) {

        const element =
            document.getElementById(id);

        if (!element) {
            return;
        }

        element.setAttribute(
            "aria-hidden",
            "true"
        );

        element.classList.remove("is-visible");

    }

    function bringPopupToFront(id) {

    const popup =
        document.getElementById(id);

    if (!popup) {
        return;
    }

    if (popup.parentElement !== document.body) {
        document.body.appendChild(popup);
    }

    popup.style.zIndex = "30000";

}

    function showBattleIntro(player, monster) {


        hideLayer("battleMainPopup");

        const introMonster =
            document.getElementById("battleIntroMonster");

        const introMessage =
            document.getElementById("battleIntroMessage");

        introMonster.innerHTML =
            createMonsterImageHTML(monster, "battle-intro-monster-image");

        introMessage.textContent =
            `${monster.name}が現れた！`;

        showLayer("battleIntroPopup");

    }


    function createMonsterImageHTML(monster, className) {

        const name =
            monster && monster.name
                ? monster.name
                : "";

        const icon =
            monster && monster.icon
                ? monster.icon
                : "👾";

        const imagePath =
            monster.icon || "";

        return `
            <img
                src="${imagePath}"
                alt="${name}"
                class="${className}"
                onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
            >
            <span class="battle-monster-fallback-text">${icon}</span>
        `;

    }


    function showBattleMain() {

    hideLayer("battleIntroPopup");
    showLayer("battleMainPopup");

    if (!activeBattle) {
        return;
    }

    renderBattleMain();

    // エンカウント表示を終了
    document
        .getElementById("battleMainPopup")
        .classList.remove("battle-intro-mode");

}

// =========================
// モンスター被ダメージ点滅
// =========================

function flashMonsterOnDamage(callback) {

    const image =
        document.getElementById(
            "battleNewMonsterImage"
        );

    if (!image) {
        if (callback) {
            callback();
        }
        return;
    }

    image.classList.remove(
        "monster-damage-flash"
    );

    // アニメーションを確実に再実行
    void image.offsetWidth;

    if (callback) {
        image.addEventListener(
            "animationend",
            callback,
            { once: true }
        );
    }

    image.classList.add(
        "monster-damage-flash"
    );

}

// =========================
// プレイヤー被ダメージ点滅
// =========================

function flashPlayerOnDamage() {

   const targets = [
    document.getElementById("battleNewMagicList"),
    document.querySelector("#battleMainPopup .battle-selected-magic"),
    document.querySelector("#battleMainPopup .battle-action-row")
];


    targets.forEach(
        function (target) {

            if (!target) {
                return;
            }

            target.classList.remove(
                "player-damage-flash"
            );

            // アニメーションを確実に再実行
            void target.offsetWidth;

            target.classList.add(
                "player-damage-flash"
            );

        }
    );


    // =========================
// ダメージSE
// =========================

const damageSEPath =
    activeBattle.isBoss
        ? "sounds/戦闘/中パンチ.mp3"
        : "sounds/戦闘/小パンチ.mp3";

        console.log(
    "【被ダメージSE】Boss戦：",
    activeBattle.isBoss,
    "使用SE：",
    damageSEPath
);


const damageSE =
    new Audio(
        damageSEPath
    );

damageSE.currentTime = 0;

damageSE.play().catch(
    function (error) {

        console.warn(
            "【戦闘】ダメージSE再生失敗：",
            error
        );

    }
);

}

    function renderBattleMain() {

        if (!activeBattle) {
            return;
        }

        const player =
            activeBattle.player;

        const monster =
            activeBattle.monster;

       document.getElementById("battleNewRound").textContent =
    `ROUND ${activeBattle.round} / 3`;

        document.getElementById("battleNewMonsterName").textContent =
            monster.name;

        const image =
            document.getElementById("battleNewMonsterImage");

        const fallback =
            document.getElementById("battleNewMonsterFallback");

        image.src =
            monster.icon || "";

        image.alt =
            monster.name;

        image.style.display =
            "block";

        fallback.textContent =
            "👾";

        fallback.style.display =
            "none";

        image.onerror =
            function () {
                image.style.display = "none";
                fallback.style.display = "block";
            };

                const hpRate =
            monster.hp > 0
                ? Math.max(
                    0,
                    Math.min(
                        1,
                        activeBattle.monsterHP / monster.hp
                    )
                )
                : 0;

        document.getElementById(
            "battleNewMonsterHpFill"
        ).style.width =
            `${hpRate * 100}%`;

        document.getElementById(
            "battleNewMonsterHp"
        ).textContent =
            `HP ${activeBattle.monsterHP} / ${monster.hp}`;


        // =========================
        // プレイヤーHP
        // 開始時ゴールドを100%として計算
        // =========================

        const playerStartGold =
            activeBattle.battleStartGold;

        const playerCurrentGold =
            activeBattle.player.money;

        const playerHpRate =
            playerStartGold > 0
                ? Math.max(
                    0,
                    Math.min(
                        1,
                        playerCurrentGold / playerStartGold
                    )
                )
                : 0;


        const playerHpFill =
            document.getElementById(
                "battlePlayerHpFill"
            );

        if (playerHpFill) {

            playerHpFill.style.width =
                `${playerHpRate * 100}%`;

        }


        const playerHpMax =
            document.getElementById(
                "battlePlayerHpMax"
            );

        if (playerHpMax) {

            playerHpMax.textContent =
                `/ ${formatBattleNumber(playerStartGold)}G`;

        }

// =========================
// プレイヤーHPアイコン
// =========================

const playerHpIcon =
    document.getElementById(
        "battlePlayerHpIcon"
    );

if (playerHpIcon) {

    const playerIndex =
        players.indexOf(
            activeBattle.player
        );

    playerHpIcon.src =
        getPlayerCharacterIcon(
            playerIndex
        );

}

        renderMagicList();
        renderSelectedMagic();

        // プレイヤーの行動ターンに戻ったら、前ターンのバトルログを消す。
        if (activeBattle.phase === "playerAction") {
            showBattleMessage("");
        }

    }


    function formatBattleNumber(value) {

        if (
            typeof formatG === "function"
        ) {
            return formatG(value);
        }

        return Number(value || 0).toLocaleString("ja-JP");

    }


    function renderMagicList() {

        const list =
            document.getElementById("battleNewMagicList");

        if (!list || !activeBattle) {
            return;
        }

        list.innerHTML = "";

        const magicIds =
            Array.isArray(activeBattle.player.magic)
                ? activeBattle.player.magic
                : [];

        if (magicIds.length === 0) {

            list.innerHTML =
                `<div class="battle-new-magic-empty">魔法を覚えていません。</div>`;

            return;

        }

        magicIds.forEach(
            function (magicId) {

                const magic =
                    MAGIC_CONTENTS[magicId];

                if (!magic) {
                    return;
                }

               
                const item =
                    document.createElement("button");

                item.type =
                    "button";

                item.className =
                    "battle-new-magic-item";

                if (
                    activeBattle.selectedMagic &&
                    activeBattle.selectedMagic === magic
                ) {
                    item.classList.add("is-selected");
                }

               item.innerHTML = `
    <span class="battle-new-magic-name">${magic.name}</span>
    <span class="battle-new-magic-icon-wrap">
        <img
            src="${magic.image || magic.icon || ""}"
            alt="${magic.name}"
            onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
        >
        <span class="battle-new-magic-fallback">✨</span>
    </span>
`;

                item.addEventListener(
                    "click",
                    function () {
                        activeBattle.selectedMagic = magic;
                        renderBattleMain();
                    }
                );

                list.appendChild(item);

            }
        );

    }


    function renderSelectedMagic() {

        const magic =
            activeBattle
                ? activeBattle.selectedMagic
                : null;

        const icon =
            document.getElementById("battleNewSelectedMagicIcon");

        const name =
            document.getElementById("battleNewSelectedMagicName");

        const cost =
            document.getElementById("battleNewSelectedMagicCost");

        const damage =
            document.getElementById("battleNewSelectedMagicDamage");

        const effect =
            document.getElementById("battleNewSelectedMagicEffect");

        const attackButton =
            document.getElementById("battleNewAttackButton");

        if (!magic) {

            icon.innerHTML = "";
            name.textContent = "魔法を選択してください";
            cost.textContent = "—";
            damage.textContent = "—";
            effect.textContent = "";
            attackButton.disabled = true;
            return;

        }

        const magicCost =
            calculateMagicCost(
                activeBattle.player,
                magic,
                activeBattle.battleState
            );

        const predictedDamage =
            magic.type === "attack"
                ? calculateMagicDamage(
                    activeBattle.player,
                    magic,
                    activeBattle.battleState
                )
                : 0;

        icon.innerHTML = `
            <img
                src="${magic.image || magic.icon || ""}"
                alt="${magic.name}"
                onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
            >
            <span>✨</span>
        `;

       name.textContent =
    magic.name;

cost.textContent =
    formatBattleNumber(magicCost);

damage.textContent =
    magic.type === "attack"
        ? formatBattleNumber(predictedDamage)
        : "—";

effect.textContent =
    magic.effect || "";

if (
    activeBattle.phase === "playerAction" &&
    !activeBattle.busy
) {
    attackButton.disabled = false;
}

}


 function showBattleMessage(message) {

    const element =
        document.getElementById("battleNewMessage");

    if (!element) {
        return;
    }

    const text =
        message || "";

    element.textContent =
        text;

    element.classList.toggle(
        "is-active",
        Boolean(text)
    );

}

function setBattleMagicPanelVisible(visible) {

    const panel =
        document.querySelector(
            "#battleMainPopup .battle-magic-panel"
        );

    if (!panel) {
        return;
    }

    panel.style.visibility =
        visible ? "visible" : "hidden";

    panel.style.pointerEvents =
        visible ? "auto" : "none";
}


  function bindMainButtons() {

    const attackButton =
        document.getElementById("battleNewAttackButton");

    const escapeButton =
        document.getElementById("battleNewEscapeButton");

    const battleScreen =
        document.querySelector(
            "#battleMainPopup .battle-main-screen"
        );


    if (!attackButton || !escapeButton) {

        console.error(
            "【戦闘エラー】戦闘ボタンが見つかりません"
        );

        return;

    }


    attackButton.onclick =
        function (event) {

            event.preventDefault();
            event.stopPropagation();

            console.log(
                "【戦闘】戦うボタン押下"
            );

            performSelectedMagic();

        };


    escapeButton.onclick =
        function (event) {

            event.preventDefault();
            event.stopPropagation();

            console.log(
                "【戦闘】逃げるボタン押下"
            );

            attemptEscape();

        };


    if (battleScreen) {

        battleScreen.onclick =
            function (event) {

                if (
                    event.target.closest(
                        "button, input, select, textarea, a"
                    )
                ) {

                    return;

                }


                handleBattleScreenTap();

            };

    }

}


    function handleBattleScreenTap() {

    if (!activeBattle) {
        return;
    }

    // =========================
    // 戦闘開始メッセージを閉じる
    // =========================

    if (activeBattle.phase === "battleIntro") {

        activeBattle.phase =
            "playerAction";
        
    document
    .getElementById("battleMainPopup")
    .classList.remove("battle-intro-mode");

        showBattleMessage("");

        setBattleMagicPanelVisible(true);

        renderBattleMain();

        enableBattleActions();

        return;
    }

    if (activeBattle.phase === "waitBossReward") {

        activeBattle.busy =
            true;

        showBossRewardPopup(
            activeBattle.player,
            activeBattle.monster,
            activeBattle.bossRewardMessage
        );

        return;

    }

    if (activeBattle.phase === "waitEnemyCounter") {

            activeBattle.phase =
                "enemyCounter";

            enemyCounterAttack();

            return;

        }

        if (
    activeBattle.phase === "waitRespawn"
) {

    const player =
        activeBattle.player;

    hideLayer(
        "battleMainPopup"
    );

    if (
        typeof checkPlayerRespawn === "function"
    ) {

        checkPlayerRespawn(
            player,
            function () {

                activeBattle =
                    null;

                finishTurn(
                    player
                );

            }
        );

    } else {

        activeBattle =
            null;

        finishTurn(
            player
        );

    }

    return;

}

        if (activeBattle.phase === "waitNextRound") {

            activeBattle.round += 1;
            activeBattle.selectedMagic = null;
            activeBattle.busy = false;
            activeBattle.phase = "playerAction";

            renderBattleMain();
            enableBattleActions();

            showBattleMessage("");

        }

        if (activeBattle.phase === "waitBattleEnd") {

            finishBattleNow(
                activeBattle.endWithReward === true
            );

        }

    }


   function performSelectedMagic() {

    console.log("【戦闘】攻撃処理開始");


    // =========================
    // 戦闘データ確認
    // =========================

    if (!activeBattle) {

        console.error(
            "【戦闘エラー】activeBattle がありません"
        );

        return;

    }


    const player =
        activeBattle.player;

    const monster =
        activeBattle.monster;

    const magic =
        activeBattle.selectedMagic;
// =========================
// バフ魔法
// =========================

if (
    magic.type === "buff"
) {

    if (
        magic.buffTarget === "self" &&
        magic.buffStat === "magicPower"
    ) {

        activeBattle.battleState.magicPowerRate =
            Number(
                magic.buffRate || 1
            );

        console.log(
            "【戦闘】魔力バフ適用：",
            activeBattle.battleState.magicPowerRate
        );

    }

    if (
        magic.buffTarget === "enemy" &&
        magic.buffStat === "attackPower"
    ) {

        activeBattle.battleState.enemyAttackRate =
            Number(
                magic.buffRate || 1
            );

        console.log(
            "【戦闘】敵攻撃力バフ適用：",
            activeBattle.battleState.enemyAttackRate
        );

    }

    showBattleMessage(
        `${magic.name}を使った！`
    );

    activeBattle.busy =
        false;

    activeBattle.phase =
        "waitEnemyCounter";

    disableBattleActions();

    return;

}


    console.log(
        "【戦闘】選択魔法：",
        magic
    );


    if (!player) {

        console.error(
            "【戦闘エラー】player がありません"
        );

        return;

    }


    if (!monster) {

        console.error(
            "【戦闘エラー】monster がありません"
        );

        return;

    }


    if (!magic) {

        console.error(
            "【戦闘エラー】魔法が選択されていません"
        );

        return;

    }


    // =========================
    // 連打防止
    // =========================

    if (activeBattle.busy) {

        console.log(
            "【戦闘】現在処理中です"
        );

        return;

    }


    activeBattle.busy =
        true;


    // =========================
    // 魔法コスト
    // =========================

    const magicCost =
        calculateMagicCost(
            player,
            magic,
            activeBattle.battleState
        );


    console.log(
        "【戦闘】魔法コスト：",
        magicCost
    );


    // =========================
    // G不足
    // =========================

    if (
        player.money < magicCost
    ) {

        activeBattle.busy =
            false;

        showBattleMessage(
            "所持金が足りません。"
        );

        return;

    }


    // =========================
    // 魔法コストを消費
    // =========================

    player.money -=
        magicCost;


    if (
        typeof updatePlayerStatusUI === "function"
    ) {

        updatePlayerStatusUI(
            player
        );

    }


    if (
        typeof renderPlayers === "function"
    ) {

        renderPlayers();

    }


    console.log(
        "【戦闘】魔法コスト消費完了"
    );


// =========================
// 魔法SE
// =========================

if (magic.sound) {

    const magicSE =
        new Audio(magic.sound);

    magicSE.currentTime = 0;

    magicSE.play().catch(
        function (error) {
            console.warn(
                "【戦闘】魔法SE再生失敗：",
                error
            );
        }
    );

}

    // =========================
    // ダメージ計算
    // =========================

       const damage =
        calculateMagicDamage(
            player,
            magic,
            activeBattle.battleState
        );


    activeBattle.lastDamage =
        Number(damage);


    console.log(
        "【戦闘】実ダメージ：",
        damage
    );


    // =========================
    // モンスターHP
    // =========================

    const beforeHP =
        Number(
            activeBattle.monsterHP
        );


    activeBattle.monsterHP =
        Math.max(
            0,
            beforeHP - Number(damage)
        );

    if (activeBattle.isBoss) {
        currentBossHP = activeBattle.monsterHP;
        activeBattle.player.bossDamage += Number(damage);
    }


    console.log(
        "【戦闘】モンスターHP：",
        beforeHP,
        "→",
        activeBattle.monsterHP
    );


    
    // =========================
    // 画面だけ更新
    // =========================

    renderBattleMain();


 // =========================    
// 被ダメージ演出
// =========================

if (activeBattle.monsterHP <= 0) {

    // 撃破時だけ、点滅が終わるまで待つ
    flashMonsterOnDamage(function () {

        // 点滅終了後にモンスターを消す
        const monsterImage =
            document.getElementById(
                "battleNewMonsterImage"
            );

        if (monsterImage) {
            monsterImage.style.display =
                "none";
        }

        // ここから先は、既存の撃破処理へ進む
        if (activeBattle.isBoss) {

            currentBossHP =
                0;

            finishBossBattle();

            return;
        }

        activeBattle.busy =
            false;

        activeBattle.phase =
            "waitBattleEnd";

        activeBattle.endWithReward =
            true;

        showBattleMessage(
            `${magic.name}！ ${damage}ダメージ！ ${monster.name}を倒した！　＞＞`
        );

        disableBattleActions();

    });

    return;
}

// HPが残っている場合は、今までどおり点滅だけ
flashMonsterOnDamage();


console.log(
    "【戦闘】画面更新完了"
);


    // =========================
// 撃破判定
// =========================

if (
    activeBattle.monsterHP <= 0
) {

    console.log(
        "【戦闘】モンスター撃破"
    );


    // =========================
    // ボス撃破
    // =========================

    if (activeBattle.isBoss) {

        currentBossHP =
            0;

        finishBossBattle();

        return;

    }


 // =========================
// 通常モンスター撃破
// =========================

activeBattle.busy =
    false;

activeBattle.phase =
    "waitBattleEnd";

activeBattle.endWithReward =
    true;

// モンスターを消す
const monsterImage =
    document.getElementById(
        "battleNewMonsterImage"
    );

if (monsterImage) {
    monsterImage.style.display =
        "none";
}

    showBattleMessage(
        `${magic.name}！ ${damage}ダメージ！ ${monster.name}を倒した！　＞＞`
    );

    disableBattleActions();

    return;

}


    // =========================
    // 攻撃結果表示
    // =========================

    showBattleMessage(
        `${magic.name}！ ${damage}ダメージ！`
    );


    console.log(
        "【戦闘】攻撃結果表示。　画面タップ待ち"
    );

    activeBattle.busy =
        false;

    activeBattle.phase =
        "waitEnemyCounter";

    showBattleMessage(
        `${magic.name}！ ${damage}ダメージ！　＞＞`
    );

    disableBattleActions();

}

  function enemyCounterAttack() {

    console.log(
        "【戦闘】敵反撃開始"
    );


    if (!activeBattle) {

        console.error(
            "【戦闘エラー】activeBattle がありません"
        );

        return;

    }


    const player =
        activeBattle.player;

    const monster =
        activeBattle.monster;


    // =========================
    // 敵の攻撃力
    // =========================

    const enemyAttackRate =
        Number(
            activeBattle.battleState?.enemyAttackRate || 1
        );


    const baseDamage =
        Math.floor(
            Number(monster.attack || 0) *
            enemyAttackRate
        );


    console.log(
        "【戦闘】敵攻撃力：",
        baseDamage
    );


    // =========================
    // 実ダメージ
    // =========================

    const damage =
        getMonsterDamage(
            player,
            baseDamage
        );


    console.log(
        "【戦闘】敵からのダメージ：",
        damage
    );


    // =========================
    // Gを減らす
    // =========================

    player.money -=
    damage;


if (
    player.money < 0
) {

    player.money =
        0;

}
// =========================
// プレイヤーHPバー即時更新
// =========================

const playerStartGold =
    activeBattle.battleStartGold;

const playerCurrentGold =
    player.money;

const playerHpRate =
    playerStartGold > 0
        ? Math.max(
            0,
            Math.min(
                1,
                playerCurrentGold / playerStartGold
            )
        )
        : 0;

const playerHpFill =
    document.getElementById(
        "battlePlayerHpFill"
    );

if (playerHpFill) {

    playerHpFill.style.width =
        `${playerHpRate * 100}%`;

}


// =========================
// プレイヤー被ダメージ演出
// =========================

flashPlayerOnDamage();


    // =========================
    // HUD更新
    // =========================

    if (
        typeof updatePlayerStatusUI === "function"
    ) {

        updatePlayerStatusUI(
            player
        );

    }


    if (
        typeof renderPlayers === "function"
    ) {

        renderPlayers();

    }


    console.log(
        "【戦闘】敵反撃後G：",
        player.money
    );


    // =========================
// プレイヤー0G
// =========================

if (
    player.money <= 0
) {

    // =========================
    // ダメージ表示
    // =========================

    showBattleMessage(
        `${monster.name}の反撃！ ${damage}Gのダメージ！　＞＞`
    );


    activeBattle.busy =
        false;


    activeBattle.phase =
        "waitRespawn";


    disableBattleActions();


    return;

}


    // =========================
    // 3ROUND終了
    // =========================

    if (
        activeBattle.round >= 3
    ) {

        activeBattle.busy =
            false;

        activeBattle.phase =
            "waitBattleEnd";

        activeBattle.endWithReward =
            false;

        showBattleMessage(
            `${monster.name}の反撃！ ${damage}Gのダメージ！　戦闘が終わった！　　＞＞`
        );

        disableBattleActions();

        return;

    }


   // =========================
// 次のROUND
// =========================

activeBattle.busy =
    false;

activeBattle.phase =
    "waitNextRound";

activeBattle.selectedMagic =
    null;

console.log(
    "【戦闘】次ROUND待機"
);

disableBattleActions();

showBattleMessage(
    `${monster.name}の反撃！ ${damage}Gのダメージ！　次のROUNDへ　＞＞`
);

}


    function performBossPass() {

        if (!activeBattle || activeBattle.busy || !activeBattle.isBoss) {
            return;
        }

        activeBattle.busy = true;
        showBattleMessage("パスした！");
        enemyCounterAttack();

    }


    function attemptEscape() {

    if (activeBattle && activeBattle.isBoss) {
        performBossPass();
        return;
    }

    // =========================
    // 戦闘中・連打防止
    // =========================

    if (
        !activeBattle ||
        activeBattle.busy
    ) {
        return;
    }


    activeBattle.busy =
        true;


    const player =
        activeBattle.player;

    const monster =
        activeBattle.monster;


    // =========================
    // 逃走判定
    // =========================

    const escaped =
        Math.random() <
        BATTLE_ESCAPE_RATE;


    // =========================
    // 逃走成功
    // =========================

    if (
        escaped
    ) {

        showBattleMessage(
            `${player.name}は ${monster.name}から逃げ切った！`
        );


        setTimeout(
            function () {

                activeBattle =
                    null;


                hideLayer(
                    "battleMainPopup"
                );


                finishTurn(
                    player
                );

            },
            500
        );


        return;

    }


    // =========================
    // 逃走失敗
    // =========================

    showBattleMessage(
        "逃げられなかった！"
    );


    // 敵の反撃は画面タップ後に実行
    activeBattle.busy =
        false;

    activeBattle.phase =
        "waitEnemyCounter";

    disableBattleActions();

    showBattleMessage(
        "逃げられなかったｗｗｗ　＞＞"
    );

}


       function disableBattleActions() {

        const attackButton =
            document.getElementById("battleNewAttackButton");

        const escapeButton =
            document.getElementById("battleNewEscapeButton");

        const magicList =
            document.getElementById("battleNewMagicList");

        if (attackButton) {
            attackButton.disabled = true;
        }

        if (escapeButton) {
            escapeButton.disabled = true;
        }

        if (magicList) {
            magicList.style.pointerEvents = "none";
            magicList.style.opacity = "0.5";
        }

    }


    function enableBattleActions() {

        const attackButton =
            document.getElementById("battleNewAttackButton");

        const escapeButton =
            document.getElementById("battleNewEscapeButton");

        const magicList =
            document.getElementById("battleNewMagicList");

        if (attackButton) {
            attackButton.disabled = false;
        }

        if (escapeButton) {
            escapeButton.disabled = false;
        }

        if (magicList) {
            magicList.style.pointerEvents = "auto";
            magicList.style.opacity = "1";
        }

    }


 function finishBattleNow(giveReward) {

    if (!activeBattle) {
        return;
    }

    const player =
        activeBattle.player;


    // =========================
    // 通常モンスター撃破
    // 報酬選択が終わるまで
    // 戦闘画面を閉じない
    // =========================

    if (giveReward) {

        showRewardPopup(
    player,
    function () {

        hideLayer(
            "battleMainPopup"
        );

        activeBattle =
            null;

        window.finishTurn(
            player
        );

    },
    window.getCurrentTurn(),
    activeBattle.monster
);

        return;

    }


    // =========================
    // 報酬なしで戦闘終了
    // =========================

    hideLayer(
        "battleMainPopup"
    );

    activeBattle =
        null;

    window.finishTurn(
        player
    );

}


    function showBattleEndButton(giveReward) {

        const attackButton =
            document.getElementById("battleNewAttackButton");

        const escapeButton =
            document.getElementById("battleNewEscapeButton");

        if (!attackButton) {
            return;
        }

        attackButton.disabled = true;
        escapeButton.style.display = "none";

        attackButton.innerHTML =
            "<span>戦闘終了</span>";

        attackButton.disabled = false;

        attackButton.onclick =
            function (event) {

                event.stopPropagation();
                attackButton.disabled = true;

                finishBattleNow(giveReward);

            };

    }

    function finishBattleWithReward() {

        showBattleEndButton(true);

    }


    function getBossData() {

        if (typeof BOSS_CONTENTS === "undefined" ||
            typeof currentBossId === "undefined") {
            return null;
        }

        return BOSS_CONTENTS[currentBossId] || null;

    }


   function finishBossBattle() {

    if (!activeBattle) {
        return;
    }

// =========================
// ボス戦BGM停止
// =========================

bossBattleBGM.pause();

bossBattleBGM.currentTime = 0;

// =========================
// ボスカウンター停止
// =========================

bossCounterEnabled = false;

    const player =
        activeBattle.player;

    const boss =
        activeBattle.monster;


   


    // =========================
    // 戦闘終了状態
    // =========================

    activeBattle.busy =
        true;


    // =========================
    // ボス報酬メッセージ
    // =========================

    let bossRewardMessage =
        `${boss.name}を倒した！<br>`;


    bossRewardMessage +=
        `🥇 先着報酬<br>`;


    if (bossFirstPlayer) {

        bossRewardMessage +=
            `${bossFirstPlayer.name}：+${formatBattleNumber(boss.reward)}G<br>`;

    }


    bossRewardMessage +=
        `⚔️ ダメージ報酬<br>`;


    window.players.forEach(
        function (p) {

            const damageReward =
                p.bossDamage *
                BOSS_DAMAGE_MULTIPLIER;

            bossRewardMessage +=
                `${p.name}：+${formatBattleNumber(damageReward)}G<br>`;

        }
    );


    bossRewardMessage +=
        `👑 撃破報酬<br>`;


    bossRewardMessage +=
        `${player.name}：+${formatBattleNumber(boss.reward)}G`;


       // =========================
    // ボス撃破ログを表示
    // =========================

    activeBattle.phase =
        "waitBossReward";

    activeBattle.busy =
        false;

    activeBattle.bossRewardMessage =
        bossRewardMessage;

    showBattleMessage(
        `${formatBattleNumber(activeBattle.lastDamage)}ダメージ！ ボスを撃破！　＞＞`
    );

    disableBattleActions();

    return;

}

function showBossRewardPopup(
    player,
    boss,
    bossRewardMessage
) {

    // =========================
// 凱旋BGM開始
// =========================

stopAllBGM();

bossVictoryBGM.currentTime = 0;

bossVictoryBGM.play();


    // =========================
    // 報酬内容を作成
    // =========================

    let firstRewardMessage =
        `🥇 先着報酬<br>`;

    if (bossFirstPlayer) {

        firstRewardMessage +=
            `${bossFirstPlayer.name}：+${formatBattleNumber(boss.reward)}G`;

    }


    let damageRewardMessage =
        `⚔️ ダメージ報酬<br>`;

    window.players.forEach(
        function (p) {

            const damageReward =
                p.bossDamage *
                BOSS_DAMAGE_MULTIPLIER;

            damageRewardMessage +=
                `${p.name}：+${formatBattleNumber(damageReward)}G<br>`;

        }
    );


    let defeatRewardMessage =
        `👑 撃破報酬<br>`;

    defeatRewardMessage +=
        `${player.name}：+${formatBattleNumber(boss.reward)}G`;


    // =========================
    // 全報酬
    // =========================

    const allRewardMessage =
        `${boss.name}を倒した！<br><br>` +
        `${firstRewardMessage}<br>` +
        `${damageRewardMessage}<br>` +
        `${defeatRewardMessage}`;


    // =========================
    // ポップアップ取得
    // =========================

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
    // ボス報酬専用クラス
    // =========================

    popup.classList.add(
        "boss-reward-popup"
    );


    // =========================
    // タイトル
    // =========================

    popupTitle.textContent =
        "ボス撃破！";


    // =========================
    // 現在の表示段階
    // =========================

    let rewardStep = 0;


    // =========================
    // 報酬表示更新
    // =========================

    function renderRewardStep() {

        if (rewardStep === 0) {

            popupMessage.innerHTML =
                `${boss.name}を倒した！<br><br>` +
                `${firstRewardMessage}`;

            popupButton.textContent =
                "次へ";

            return;

        }


        if (rewardStep === 1) {

            popupMessage.innerHTML =
                `${boss.name}を倒した！<br><br>` +
                `${damageRewardMessage}`;

            popupButton.textContent =
                "次へ";

            return;

        }


        if (rewardStep === 2) {

            popupMessage.innerHTML =
                `${boss.name}を倒した！<br><br>` +
                `${defeatRewardMessage}`;

            popupButton.textContent =
                "次へ";

            return;

        }


        // =========================
        // 報酬を実際に加算
        // =========================

        if (
            bossRewardGiven === false
        ) {

            window.players.forEach(
                function (p) {

                    const damageReward =
                        p.bossDamage *
                        BOSS_DAMAGE_MULTIPLIER;

                    p.money +=
                        damageReward;


                    if (
                        p ===
                        bossFirstPlayer
                    ) {

                        p.money +=
                            boss.reward;

                    }


                    if (
                        typeof updatePlayerStatusUI ===
                        "function"
                    ) {

                        updatePlayerStatusUI(
                            p
                        );

                    }

                }
            );


            player.money +=
                boss.reward;


            if (
                typeof updatePlayerStatusUI ===
                "function"
            ) {

                updatePlayerStatusUI(
                    player
                );

            }


            if (
                typeof renderPlayers ===
                "function"
            ) {

                renderPlayers();

            }


            bossRewardGiven =
                true;

        }


        // =========================
        // 報酬受け取り完了表示
        // =========================

        popupMessage.innerHTML =
    `プレイヤー達は<br>` +
    `報酬を受け取った！`;

popup.classList.add(
    "boss-reward-complete-popup"
);

popupButton.textContent =
    "OK";

    }


    // =========================
    // ポップアップ表示
    // =========================

    popup.style.display =
        "block";

    popup.style.zIndex =
        "99999";


    renderRewardStep();


    // =========================
    // タップ処理
    // =========================

    popupButton.onclick =
        function () {

            // =========================
            // 最終表示
            // =========================

            if (rewardStep >= 3) {

                popup.style.display =
                    "none";

                popup.classList.remove(
                 "boss-reward-popup"
                );

                popup.classList.remove(
                 "boss-reward-complete-popup"
                );


                // =========================
                // 戦闘画面を閉じる
                // =========================

                hideLayer(
                    "battleMainPopup"
                );


// =========================
// ボス撃破数を更新
// =========================

bossDefeatedCount += 1;


// =========================
// 次のボスを設定
// =========================

previousBossSquareId =
    currentBossSquareId;

const bossIds =
    Object.keys(
        BOSS_CONTENTS
    )
    .map(Number)
    .sort(
        function (a, b) {
            return a - b;
        }
    );


                const currentIndex =
                    bossIds.indexOf(
                        currentBossId
                    );


                if (
                    currentIndex >= 0 &&
                    currentIndex <
                        bossIds.length - 1
                ) {

                    currentBossId =
                        bossIds[
                            currentIndex + 1
                        ];

                }


                currentBossHP =
                    BOSS_CONTENTS[
                        currentBossId
                    ].hp;


                selectBossSquare();


                // =========================
                // ボス戦情報をリセット
                // =========================

                bossFirstPlayer =
                    null;

                bossRewardGiven =
                    false;


                window.players.forEach(
                    function (p) {

                        p.bossDamage =
                            0;

                    }
                );


                // =========================
                // マップ更新
                // =========================

                window.renderMap();


                // =========================
                // 戦闘データを終了
                // =========================

                activeBattle =
                    null;


                // =========================
                // 次のボス目的地を表示
                // =========================

                window.showBossDestinationPopup(
                    function () {

                        window.finishTurn(
                            player
                        );

                    }
                );

                return;

            }


            // =========================
            // 次の報酬へ
            // =========================

            rewardStep +=
                1;


            renderRewardStep();

        };

}


    function startSharedBattle(player, enemy, isBoss) {

       activeBattle = {
    player: player,
    monster: enemy,
    monsterHP: isBoss 
    ? currentBossHP 
    : enemy.hp,

    // =========================
    // 戦闘開始時のゴールド
    // HPバーの100%基準
    // =========================

    battleStartGold:
        player.money,

    round: 1,
    selectedMagic: null,
    busy: false,
    phase: "playerAction",
    isBoss: isBoss,
    battleState: {
        magicPowerRate: 1,
        enemyAttackRate: 1
    }
};

                ensureBattleUI();
        bindMainButtons();

        // =========================
        // 戦闘背景切り替え
        // =========================

        const battleMainPopup =
            document.getElementById(
                "battleMainPopup"
            );

        if (battleMainPopup) {

            battleMainPopup.classList.toggle(
                "boss-battle-mode",
                isBoss
            );

        }

        const actionButton =
            document.getElementById("battleNewEscapeButton");

        if (actionButton) {
            actionButton.textContent = isBoss ? "パス" : "逃げる";
        }

activeBattle.phase = "battleIntro";

showBattleMain();

document
    .getElementById("battleMainPopup")
    .classList.add("battle-intro-mode");

showBattleMessage(
    `${enemy.name}が現れた！　＞＞`
);

setBattleMagicPanelVisible(false);

    }


    function startBossBattle(player) {

    const boss = getBossData();

    if (!boss) {
        console.error("BOSS_CONTENTS または currentBossId が見つかりません。");
        return;
    }

    if (currentBossHP <= 0) {
        currentBossHP = boss.hp;
    }

    // =========================
// ボス戦BGM開始
// まだ再生されていない場合だけ開始
// =========================

if (
    bossBattleBGM.paused
) {

    stopAllBGM();

    bossBattleBGM.play().catch(
        function (error) {

            console.warn(
                "【ボス戦BGM】再生失敗：",
                error
            );

        }
    );

}

// =========================
// ボスカウンター開始
// =========================

bossCounterEnabled = true;

    startSharedBattle(
        player,
        boss,
        true
    );

}


    function startNormalBattle(player, monster) {

        startSharedBattle(player, monster, false);

    }


    window.startBossBattle =
        function (player) {
            startBossBattle(player);
        };


   window.startMonsterBattle =
    function (player) {

        const monsterIds =
            Object.keys(MONSTER_CONTENTS);

        const randomMonsterId =
            monsterIds[
                Math.floor(
                    Math.random() * monsterIds.length
                )
            ];

        const baseMonster =
            MONSTER_CONTENTS[
                randomMonsterId
            ];


        // =========================
        // ボス撃破数に応じた
        // モンスターステータス倍率
        // =========================

        const monsterInflationMultiplier =
            getMonsterInflationMultiplier();


        // =========================
        // 基礎データをコピーして
        // 今回の戦闘用モンスターを作成
        // =========================

        const monster = {

            ...baseMonster,

            hp:
                Math.floor(
                    baseMonster.hp *
                    monsterInflationMultiplier
                ),

            attack:
                Math.floor(
                    baseMonster.attack *
                    monsterInflationMultiplier
                )

        };


        // 旧遭遇選択画面は使わない
        const oldPopup =
            document.getElementById(
                "monsterChoicePopup"
            );

        if (oldPopup) {
            oldPopup.style.display = "none";
        }


        startNormalBattle(
            player,
            monster
        );

    };


    // 既存のHTMLを新UIに置き換え、旧バトル画面を非表示にします。
    function init() {

        ensureBattleUI();

        const oldBattlePopup =
            document.getElementById("battlePopup");

        if (oldBattlePopup) {
            oldBattlePopup.style.display = "none";
        }

        const oldMagicPopup =
            document.getElementById("battleMagicPopup");

        if (oldMagicPopup) {
            oldMagicPopup.style.display = "none";
        }

    }


    if (
        document.readyState === "loading"
    ) {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();

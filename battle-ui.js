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
                        画面をタップして戦闘開始
                    </div>

                </div>
            </div>


            <div
                id="battleMainPopup"
                class="battle-new-popup battle-main-popup"
                aria-hidden="true"
            >

                <div class="battle-main-screen">

                    <div class="battle-hud">

                        <div class="battle-hud-player">
                            <span
                                id="battleNewPlayerName"
                                class="battle-hud-name"
                            ></span>
                        </div>

                        <div class="battle-hud-status">
                            <span class="battle-hud-stat battle-hud-gold">
                                <span class="battle-hud-stat-label">G</span>
                                <strong id="battleNewGold">0</strong>
                            </span>

                            <span class="battle-hud-stat battle-hud-magic">
                                <span class="battle-hud-stat-label">魔力</span>
                                <strong id="battleNewMagic">0</strong>
                            </span>
                        </div>

                    </div>


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
                                魔法
                            </div>

                            <div
                                id="battleNewMagicList"
                                class="battle-new-magic-list"
                            ></div>

                        </div>


                        <div class="battle-detail-panel">

                            <div class="battle-panel-title">
                                選択中の魔法
                            </div>

                            <div class="battle-selected-magic">

                                <div
                                    id="battleNewSelectedMagicIcon"
                                    class="battle-selected-magic-icon"
                                ></div>

                                <div class="battle-selected-magic-info">

                                    <div
                                        id="battleNewSelectedMagicName"
                                        class="battle-selected-magic-name"
                                    >
                                        魔法を選択してください
                                    </div>

                                    <div class="battle-selected-magic-meta">
                                        <span>
                                            コスト
                                            <strong id="battleNewSelectedMagicCost">—</strong>G
                                        </span>
                                        <span>
                                            予測ダメージ
                                            <strong id="battleNewSelectedMagicDamage">—</strong>
                                        </span>
                                    </div>

                                    <div
                                        id="battleNewSelectedMagicEffect"
                                        class="battle-selected-magic-effect"
                                    ></div>

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


    function showBattleIntro(player, monster) {

        ensureBattleUI();

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

    }


    function renderBattleMain() {

        if (!activeBattle) {
            return;
        }

        const player =
            activeBattle.player;

        const monster =
            activeBattle.monster;

        document.getElementById("battleNewPlayerName").textContent =
            player.name;

        document.getElementById("battleNewGold").textContent =
            formatBattleNumber(player.money);

        document.getElementById("battleNewMagic").textContent =
            formatBattleNumber(player.magicPower);

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
                ? Math.max(0, Math.min(1, activeBattle.monsterHP / monster.hp))
                : 0;

        document.getElementById("battleNewMonsterHpFill").style.width =
            `${hpRate * 100}%`;

        document.getElementById("battleNewMonsterHp").textContent =
            `HP ${activeBattle.monsterHP} / ${monster.hp}`;

        renderMagicList();
        renderSelectedMagic();

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

                const cost =
                    calculateMagicCost(
                        activeBattle.player,
                        magic,
                        activeBattle.battleState
                    );

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
                    <span class="battle-new-magic-icon-wrap">
                        <img
                            src="${magic.image || magic.icon || ""}"
                            alt="${magic.name}"
                            onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
                        >
                        <span class="battle-new-magic-fallback">✨</span>
                    </span>
                    <span class="battle-new-magic-name">${magic.name}</span>
                    <span class="battle-new-magic-cost">${formatBattleNumber(cost)}G</span>
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

// 魔法を選択したら「戦う」を押せるようにする。
// 所持金不足の判定は performSelectedMagic() 側で行う。
attackButton.disabled = false;

    }


    function showBattleMessage(message) {

        const element =
            document.getElementById("battleNewMessage");

        if (element) {
            element.textContent =
                message || "";
        }

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

        if (activeBattle.phase === "waitEnemyCounter") {

            activeBattle.phase =
                "enemyCounter";

            enemyCounterAttack();

            return;

        }

        if (activeBattle.phase === "waitNextRound") {

            activeBattle.round += 1;
            activeBattle.selectedMagic = null;
            activeBattle.busy = false;
            activeBattle.phase = "playerAction";

            renderBattleMain();
            enableBattleActions();

            showBattleMessage(
                `ROUND ${activeBattle.round} / 3`
            );

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
    // ダメージ計算
    // =========================

    const damage =
        calculateMagicDamage(
            player,
            magic,
            activeBattle.battleState
        );


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


        if (activeBattle.isBoss) {
            currentBossHP = 0;
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
            `${magic.name}！ ${damage}ダメージ！ ${monster.name}を倒した！　画面をタップして終了`
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
        "【戦闘】攻撃結果表示。画面タップ待ち"
    );

    activeBattle.busy =
        false;

    activeBattle.phase =
        "waitEnemyCounter";

    showBattleMessage(
        `${magic.name}！ ${damage}ダメージ！　画面をタップして反撃`
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

        showBattleMessage(
            `${monster.name}の反撃！ ${damage}Gのダメージ！`
        );


        activeBattle.busy =
            false;


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
            `${monster.name}の反撃！ ${damage}Gのダメージ！　3ラウンド終了！　画面をタップして終了`
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
        `ROUND ${activeBattle.round} 終了　画面をタップして次のROUNDへ`
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
        "逃げられなかった！　画面をタップして反撃"
    );

}


    function disableBattleActions() {

        const attackButton =
            document.getElementById("battleNewAttackButton");

        const escapeButton =
            document.getElementById("battleNewEscapeButton");

        if (attackButton) {
            attackButton.disabled = true;
        }

        if (escapeButton) {
            escapeButton.disabled = true;
        }

    }


    function enableBattleActions() {

        const attackButton =
            document.getElementById("battleNewAttackButton");

        const escapeButton =
            document.getElementById("battleNewEscapeButton");

        if (attackButton) {
            attackButton.disabled = false;
        }

        if (escapeButton) {
            escapeButton.disabled = false;
        }

    }


    function finishBattleNow(giveReward) {

        if (!activeBattle) {
            return;
        }

        const player =
            activeBattle.player;

        hideLayer("battleMainPopup");

        if (giveReward) {

            if (typeof showRewardPopup === "function") {

                showRewardPopup(
                    player,
                    function () {
                        activeBattle = null;
                        finishTurn(player);
                    }
                );

            } else {

                activeBattle = null;
                finishTurn(player);

            }

            return;

        }

        activeBattle = null;
        finishTurn(player);

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

        const player = activeBattle.player;
        const boss = activeBattle.monster;

        if (bossRewardGiven === false) {

            players.forEach(function (p) {
                const damageReward =
                    p.bossDamage * BOSS_DAMAGE_MULTIPLIER;

                p.money += damageReward;

                if (p === bossFirstPlayer) {
                    p.money += boss.reward;
                }
            });

            player.money += boss.reward;
            bossRewardGiven = true;
        }

        activeBattle.busy = true;

        let bossRewardMessage =
            `${boss.name}を倒した！<br>`;

        bossRewardMessage += `🥇 先着報酬<br>`;
        if (bossFirstPlayer) {
            bossRewardMessage +=
                `${bossFirstPlayer.name}：+${formatBattleNumber(boss.reward)}G<br>`;
        }

        bossRewardMessage += `⚔️ ダメージ報酬<br>`;
        players.forEach(function (p) {
            const damageReward =
                p.bossDamage * BOSS_DAMAGE_MULTIPLIER;
            bossRewardMessage +=
                `${p.name}：+${formatBattleNumber(damageReward)}G<br>`;
        });

        bossRewardMessage += `👑 撃破報酬<br>`;
        bossRewardMessage +=
            `${player.name}：+${formatBattleNumber(boss.reward)}G`;

        hideLayer("battleMainPopup");

        showEventPopup(
            "ボス撃破！",
            bossRewardMessage,
            function () {

                previousBossSquareId = currentBossSquareId;

                const bossIds =
                    Object.keys(BOSS_CONTENTS)
                        .map(Number)
                        .sort(function (a, b) { return a - b; });

                const currentIndex =
                    bossIds.indexOf(currentBossId);

                if (currentIndex >= 0 &&
                    currentIndex < bossIds.length - 1) {
                    currentBossId = bossIds[currentIndex + 1];
                }

                currentBossHP = BOSS_CONTENTS[currentBossId].hp;
                selectBossSquare();

                bossFirstPlayer = null;
                bossRewardGiven = false;

                players.forEach(function (p) {
                    p.bossDamage = 0;
                });

                renderMap();
                activeBattle = null;

                showBossDestinationPopup(function () {
                    finishTurn(player);
                });

            }
        );

    }


    function startSharedBattle(player, enemy, isBoss) {

        activeBattle = {
            player: player,
            monster: enemy,
            monsterHP: isBoss ? currentBossHP : enemy.hp,
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

        const actionButton =
            document.getElementById("battleNewEscapeButton");

        if (actionButton) {
            actionButton.textContent = isBoss ? "パス" : "逃げる";
        }

        showBattleIntro(player, enemy);

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

        startSharedBattle(player, boss, true);

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

            const monster =
                MONSTER_CONTENTS[randomMonsterId];

            // 旧遭遇選択画面は使わない
            const oldPopup =
                document.getElementById("monsterChoicePopup");

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

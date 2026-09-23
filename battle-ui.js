/* =========================================================
   battle-ui.js
   戦闘UI共通ヘルパー

   役割：
   ・HP表示
   ・ダメージ数字
   ・ターン表示
   ・戦闘キャラクター表示
   ・予測ダメージ表示

   ※ 現時点では既存の戦闘処理へ接続しません。
========================================================= */

(function () {

    "use strict";


    function getElement(target) {

        if (!target) {
            return null;
        }

        if (typeof target === "string") {
            return document.querySelector(target);
        }

        return target;

    }


    function setText(
        target,
        value
    ) {

        const element =
            getElement(target);

        if (!element) {
            return;
        }

        element.textContent =
            value;

    }


    function updateHP(
        target,
        current,
        max
    ) {

        const element =
            getElement(target);

        if (!element) {
            return;
        }

        const safeMax =
            Math.max(
                1,
                Number(max || 0)
            );

        const safeCurrent =
            Math.max(
                0,
                Math.min(
                    Number(current || 0),
                    safeMax
                )
            );

        const rate =
            safeCurrent /
            safeMax;

        const bar =
            element.querySelector(
                ".battle-hp-fill"
            );

        const value =
            element.querySelector(
                ".battle-hp-value"
            );

        if (bar) {

            bar.style.width =
                `${rate * 100}%`;

        }

        if (value) {

            value.textContent =
                `${safeCurrent} / ${safeMax}`;

        }

    }


    function showDamage(
        target,
        damage,
        options
    ) {

        const element =
            getElement(target);

        if (!element) {
            return;
        }

        const config = {
            duration: 700,
            className: "battle-damage-number",
            ...options
        };

        const rect =
            element.getBoundingClientRect();

        const damageElement =
            document.createElement("div");

        damageElement.className =
            config.className;

        damageElement.textContent =
            `-${Number(damage || 0)}`;

        damageElement.style.position =
            "fixed";

        damageElement.style.left =
            `${rect.left + rect.width / 2}px`;

        damageElement.style.top =
            `${rect.top + rect.height * 0.3}px`;

        damageElement.style.zIndex =
            "31000";

        damageElement.style.pointerEvents =
            "none";

        document.body.appendChild(
            damageElement
        );

        const animation =
            damageElement.animate(
                [
                    {
                        transform:
                            "translate(-50%, 10px) scale(.7)",
                        opacity:
                            0
                    },
                    {
                        transform:
                            "translate(-50%, 0) scale(1.15)",
                        opacity:
                            1
                    },
                    {
                        transform:
                            "translate(-50%, -55px) scale(1)",
                        opacity:
                            0
                    }
                ],
                {
                    duration:
                        config.duration,
                    easing:
                        "ease-out",
                    fill:
                        "forwards"
                }
            );

        animation.finished
            .then(function () {

                if (
                    damageElement.parentNode
                ) {

                    damageElement.remove();

                }

            });

    }


    function showPrediction(
        target,
        damage
    ) {

        const element =
            getElement(target);

        if (!element) {
            return;
        }

        setText(
            element,
            `予測ダメージ ${Number(damage || 0)}`
        );

    }


    function setTurn(
        target,
        turnText
    ) {

        setText(
            target,
            turnText
        );

    }


    function setBattleMessage(
        target,
        message
    ) {

        setText(
            target,
            message
        );

    }


    function setVisible(
        target,
        visible
    ) {

        const element =
            getElement(target);

        if (!element) {
            return;
        }

        element.style.display =
            visible ? "" : "none";

    }


    window.BattleUI = {

        setText,
        updateHP,
        showDamage,
        showPrediction,
        setTurn,
        setBattleMessage,
        setVisible

    };

})();

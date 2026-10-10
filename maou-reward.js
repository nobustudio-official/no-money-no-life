/* =========================================================
   maou-reward.js

   魔王討伐後の報酬表示・報酬加算だけを担当。
   魔王本体の戦闘・第二形態・バフ・SE・通常ゲームへの復帰処理は扱わない。
========================================================= */

(function () {

    "use strict";

    window.showMaouRewardFlow = function (
        player,
        rewardConfig,
        firstRewardPlayer,
        damageMultiplier,
        continueCallback
    ) {

        const BOSS_DAMAGE_MULTIPLIER = Number(
            damageMultiplier || 0
        );


        // =====================================================
        // 報酬金額を確定
        // ※この時点ではまだ所持金へ加算しない
        // =====================================================

        const firstReward =
            firstRewardPlayer &&
            Number(rewardConfig.firstReward || 0) > 0
                ? Number(rewardConfig.firstReward)
                : 0;


        const damageRewards = {};

        window.players.forEach(
            function (p) {

                damageRewards[p.name] =
                    Number(p.bossDamage || 0) *
                    BOSS_DAMAGE_MULTIPLIER;

            }
        );


        const defeatReward =
            Number(rewardConfig.defeatReward || 0);


        // =====================================================
        // 報酬ポップアップ取得
        // =====================================================

        const popup =
            document.getElementById(
                "eventPopup"
            );

        const popupTitle =
            popup
                ? popup.querySelector(
                    ".event-popup-title"
                )
                : null;

        const popupMessage =
            document.getElementById(
                "eventPopupMessage"
            );

        const popupButton =
            document.getElementById(
                "eventPopupButton"
            );


        // =====================================================
        // ポップアップが使えない場合
        // =====================================================

        if (
            !popup ||
            !popupTitle ||
            !popupMessage ||
            !popupButton
        ) {

            applyMaouRewards(
                player,
                firstRewardPlayer,
                firstReward,
                damageRewards,
                defeatReward
            );

            continueCallback();

            return;

        }


              // =====================================================
        // 報酬ポップアップ設定
        // =====================================================

        // 通常ボスと同じ報酬UIを使用
        popup.classList.add(
            "boss-reward-popup"
        );

        popup.classList.remove(
            "boss-reward-complete-popup"
        );

        popup.style.display =
            "block";

        popup.style.zIndex =
            "99999";

        popupTitle.textContent =
            "魔王討伐！";


            // =====================================================
        // 魔王報酬用の金額表示
        // battle-ui.js に依存しない
        // =====================================================

        function formatMaouRewardNumber(value) {

            if (
                typeof formatG ===
                "function"
            ) {

                return formatG(
                    value
                );

            }

            return Number(
                value || 0
            ).toLocaleString(
                "ja-JP"
            );

        }


        // =====================================================
        // 🥇 先着報酬
        // =====================================================

        let firstRewardMessage =
            "🥇 先着報酬<br>";

        if (
            firstRewardPlayer &&
            firstReward > 0
        ) {

            firstRewardMessage +=
                `${firstRewardPlayer.name}：+${formatMaouRewardNumber(firstReward)}G`;

        } else {

            firstRewardMessage +=
                "なし";

        }


        // =====================================================
        // ⚔️ ダメージ報酬
        // =====================================================

        let damageRewardMessage =
            "⚔️ ダメージ報酬<br>";

        window.players.forEach(
            function (p) {

                const damageReward =
                    Number(
                        damageRewards[p.name] || 0
                    );

                damageRewardMessage +=
                    `${p.name}：+${formatMaouRewardNumber(damageReward)}G<br>`;

            }
        );


        // =====================================================
        // 👑 撃破報酬
        // =====================================================

        let defeatRewardMessage =
            "👑 撃破報酬<br>";

        if (
            defeatReward > 0
        ) {

            defeatRewardMessage +=
                `${player.name}：+${formatMaouRewardNumber(defeatReward)}G`;

        } else {

            defeatRewardMessage +=
                "なし";

        }


        // =====================================================
        // 報酬表示段階
        // =====================================================

        let rewardStep = 0;


        function renderMaouRewardStep() {

            // =================================================
            // ① 先着報酬
            // =================================================

            if (
                rewardStep === 0
            ) {

                popupMessage.innerHTML =
                    `魔王を倒した！<br><br>` +
                    firstRewardMessage;

                popupButton.textContent =
                    "次へ";

                return;

            }


            // =================================================
            // ② ダメージ報酬
            // =================================================

            if (
                rewardStep === 1
            ) {

                popupMessage.innerHTML =
                    `魔王を倒した！<br><br>` +
                    damageRewardMessage;

                popupButton.textContent =
                    "次へ";

                return;

            }


            // =================================================
            // ③ 撃破報酬
            // =================================================

            if (
                rewardStep === 2
            ) {

                popupMessage.innerHTML =
                    `魔王を倒した！<br><br>` +
                    defeatRewardMessage;

                popupButton.textContent =
                    "次へ";

                return;

            }


            // =================================================
            // ④ ここで初めて実際に報酬を加算
            // =================================================

            applyMaouRewards(
                player,
                firstRewardPlayer,
                firstReward,
                damageRewards,
                defeatReward
            );


                      popupMessage.innerHTML =
                `プレイヤー達は<br>` +
                `報酬を受け取った！`;

            popup.classList.add(
                "boss-reward-popup"
            );

            popup.classList.add(
                "boss-reward-complete-popup"
            );

            popupButton.textContent =
                "OK";

        }


        // =====================================================
        // 初回表示
        // =====================================================

        renderMaouRewardStep();


        // =====================================================
        // ボタン処理
        // =====================================================

        popupButton.onclick =
            function () {

                // ---------------------------------------------
                // 先着 → ダメージ → 撃破
                // ---------------------------------------------

                if (
                    rewardStep < 3
                ) {

                    rewardStep++;

                    renderMaouRewardStep();

                    return;

                }


                // ---------------------------------------------
                // OK
                // ---------------------------------------------

                popup.style.display =
                    "none";

                popup.classList.remove(
                    "boss-reward-popup"
                );

                popup.classList.remove(
                    "boss-reward-complete-popup"
                );


                continueCallback();

            };

    }


    // =====================================================
    // 魔王報酬を実際に加算
    // =====================================================

    function applyMaouRewards(
        player,
        firstRewardPlayer,
        firstReward,
        damageRewards,
        defeatReward
    ) {

        // =====================================================
        // 🥇 先着報酬
        // =====================================================

        if (
            firstRewardPlayer &&
            firstReward > 0
        ) {

            firstRewardPlayer.money +=
                firstReward;

        }


        // =====================================================
        // ⚔️ ダメージ報酬
        // =====================================================

        window.players.forEach(
            function (p) {

                const damageReward =
                    Number(
                        damageRewards[p.name] || 0
                    );

                p.money +=
                    damageReward;

            }
        );


        // =====================================================
        // 👑 撃破報酬
        // =====================================================

        if (
            defeatReward > 0
        ) {

            player.money +=
                defeatReward;

        }


        // =====================================================
        // プレイヤーUI更新
        // =====================================================

        window.players.forEach(
            function (p) {

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


        if (
            typeof renderPlayers ===
            "function"
        ) {

            renderPlayers();

        }

    }

})();
/* =========================================================
   battle.js
   戦闘進行の新基盤

   役割：
   ・プレイヤー攻撃 → 敵反応 → 敵攻撃 → 次ターン
   ・戦闘演出の順序を管理
   ・既存のダメージ計算や game.js とはまだ接続しない

   今後の統合時に、
   「現在 game.js にある戦闘処理」を
   このControllerへ段階的に移します。
========================================================= */

(function () {

    "use strict";


    class BattleController {

        constructor(options = {}) {

            this.player =
                options.player ||
                null;

            this.enemy =
                options.enemy ||
                null;

            this.maxRounds =
                options.maxRounds ||
                3;

            this.round =
                1;

            this.phase =
                "player";

            this.active =
                false;

        }


        start() {

            this.active =
                true;

            this.round =
                1;

            this.phase =
                "player";

            this.emitPhase();

        }


        async playerAttack(options) {

            if (
                !this.active ||
                this.phase !== "player"
            ) {
                return;
            }

            this.phase =
                "playerAttack";

            this.emitPhase();

            if (
                window.BattleEffect &&
                options
            ) {

                await window.BattleEffect.play(
                    options
                );

            }

            this.phase =
                "monster";

            this.emitPhase();

        }


        async monsterAttack(options) {

            if (
                !this.active ||
                this.phase !== "monster"
            ) {
                return;
            }

            this.phase =
                "monsterAttack";

            this.emitPhase();

            if (
                window.BattleEffect &&
                options
            ) {

                await window.BattleEffect.play(
                    options
                );

            }

            if (
                this.round >=
                this.maxRounds
            ) {

                this.finish();
                return;

            }

            this.round +=
                1;

            this.phase =
                "player";

            this.emitPhase();

        }


        finish() {

            this.active =
                false;

            this.phase =
                "finished";

            this.emitPhase();

        }


        emitPhase() {

            document.dispatchEvent(
                new CustomEvent(
                    "battle:phasechange",
                    {
                        detail: {
                            phase:
                                this.phase,
                            round:
                                this.round
                        }
                    }
                )
            );

        }

    }


    window.BattleController =
        BattleController;

})();

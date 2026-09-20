// =========================================================
// 所持品を追加
// =========================================================

function addPossession(
    player,
    possessionId,
    acquiredTurn = 1
) {

    if (!player.possessions) {

        player.possessions = [];

    }


    const numericPossessionId =
        Number(possessionId);


    const possession =
        POSSESSION_CONTENTS[
            numericPossessionId
        ];


    if (!possession) {

        console.error(
            "所持品CONTENTSが見つかりません:",
            numericPossessionId
        );

        return;

    }


    // =========================
    // 所持品を1個の「個体」として追加
    // =========================

    const possessionData = {

        id:
            numericPossessionId,

        acquiredTurn:
            acquiredTurn

    };


    player.possessions.push(
        possessionData
    );

}


// =========================================================
// 複数の所持品を追加
// =========================================================

function addPossessions(
    player,
    possessionIds,
    acquiredTurn = 1
) {

    possessionIds.forEach(
        function (possessionId) {

            addPossession(
                player,
                possessionId,
                acquiredTurn
            );

        }
    );

}

// =========================================================
// 期限切れ所持品を削除
// =========================================================

function removeExpiredPossessions(
    player,
    currentTurn
) {

    if (
        !player.possessions ||
        player.possessions.length === 0
    ) {

        return;

    }


    player.possessions =
        player.possessions.filter(
            function (possessionData) {

                const possession =
                    POSSESSION_CONTENTS[
                        possessionData.id
                    ];


                // データが存在しない所持品は残す
                // （既存データ保護）
                if (!possession) {

                    return true;

                }


                // 永続効果なら残す
                if (
                    possession.effectDuration ===
                    "permanent"
                ) {

                    return true;

                }


                // =========================
                // 5ターン効果
                // =========================

                if (
                    possession.effectDuration ===
                    "5turn"
                ) {

                    const acquiredTurn =
                        possessionData.acquiredTurn;


                    // 取得ターンが記録されていない
                    // 古い形式のデータは残す
                    if (
                        acquiredTurn === undefined ||
                        acquiredTurn === null
                    ) {

                        return true;

                    }


                    // 取得から5ターン経過したら削除
                    if (
                        currentTurn -
                        acquiredTurn >= 5
                    ) {

                        console.log(
                            `${player.name}：${possession.name}の効果が終了しました`
                        );

                        return false;

                    }

                }


                return true;

            }
        );

}

// =========================================================
// ターン開始時の所持品効果
// =========================================================

function applyTurnStartPossessionEffects(
    player
) {

    if (
        !player.possessions ||
        player.possessions.length === 0
    ) {

        return;

    }


    player.possessions.forEach(
        function (possessionData) {

            const possession =
                POSSESSION_CONTENTS[
                    possessionData.id
                ];


            if (!possession) {

                return;

            }


            // =========================
            // 幸運の財布
            // =========================

            if (
                possession.effectType ===
                "goldGain"
            ) {

                const gain =
                    possession.effectValue || 0;


                player.money += gain;


                console.log(
                    `${player.name}：${possession.name}の効果で ${gain}G獲得`
                );

            }

        }
    );

}

// =========================
// 所持品の効果値を取得
// =========================

function getPossessionEffect(
    player,
    effectType
) {

    let totalValue = 0;


    player.possessions.forEach(
    function (possessionData) {

        const possession =
            POSSESSION_CONTENTS[
                possessionData.id
            ];


            if (!possession) {
                return;
            }


            if (
                possession.effectType ===
                effectType
            ) {

                totalValue +=
                    possession.effectValue || 0;

            }

        }
    );


    return totalValue;

}
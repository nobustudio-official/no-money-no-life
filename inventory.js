// =========================================================
// アイテムを追加
// =========================================================
//
// 通常の「使う」アイテムは ID のまま保存。
// 持っているだけで効果があるアイテムは
// { id, acquiredTurn } の個体データとして保存する。
// =========================================================

function addItem(
    player,
    itemId,
    acquiredTurn = 1
) {

    if (!player.inventory) {

        player.inventory = [];

    }


    const numericItemId =
        Number(itemId);


    const item =
        ITEM_CONTENTS[
            numericItemId
        ];


    if (!item) {

        console.error(
            "アイテムCONTENTSが見つかりません:",
            numericItemId
        );

        return;

    }


    // =========================
    // 持っているだけで効果がある
    // パッシブアイテム
    // =========================

    if (
        item.category ===
        "passive"
    ) {

        player.inventory.push({

            id:
                numericItemId,

            acquiredTurn:
                acquiredTurn

        });

        return;

    }


    // =========================
    // 通常アイテム
    // =========================

    player.inventory.push(
        numericItemId
    );

}


// =========================================================
// 複数のアイテムを追加
// =========================================================

function addItems(
    player,
    itemIds,
    acquiredTurn = 1
) {

    itemIds.forEach(
        function (itemId) {

            addItem(
                player,
                itemId,
                acquiredTurn
            );

        }
    );

}


// =========================================================
// 期限切れアイテムを削除
// =========================================================

function removeExpiredItems(
    player,
    currentTurn
) {

    if (
        !player.inventory ||
        player.inventory.length === 0
    ) {

        return;

    }


    player.inventory =
        player.inventory.filter(
            function (inventoryData) {

                // =========================
                // 通常アイテムはそのまま残す
                // =========================

                if (
                    typeof inventoryData !==
                    "object"
                ) {

                    return true;

                }


                const item =
                    ITEM_CONTENTS[
                        inventoryData.id
                    ];


                // データが存在しないアイテムは残す
                // （既存データ保護）
                if (!item) {

                    return true;

                }


                // パッシブアイテム以外は
                // 期限管理の対象外
                if (
                    item.category !==
                    "passive"
                ) {

                    return true;

                }


                // 永続効果なら残す
                if (
                    item.effectDuration ===
                    "permanent"
                ) {

                    return true;

                }


                // =========================
                // 5ターン効果
                // =========================

                if (
                    item.effectDuration ===
                    "5turn"
                ) {

                    const acquiredTurn =
                        inventoryData.acquiredTurn;


                    // 取得ターンが記録されていない
                    // データは残す
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
                            `${player.name}：${item.name}の効果が終了しました`
                        );

                        return false;

                    }

                }


                return true;

            }
        );

}


// =========================================================
// ターン開始時のアイテム効果
// =========================================================

function applyTurnStartItemEffects(
    player,
    currentTurn
) {

    if (
        !player.inventory ||
        player.inventory.length === 0
    ) {

        return;

    }


    player.inventory.forEach(
        function (inventoryData) {

            // =========================
            // パッシブアイテムだけ処理
            // =========================

            if (
                typeof inventoryData !==
                "object"
            ) {

                return;

            }


            const item =
                ITEM_CONTENTS[
                    inventoryData.id
                ];


            if (!item) {

                return;

            }


            if (
                item.category !==
                "passive"
            ) {

                return;

            }


            // =========================
            // 5ターン効果の有効期限確認
            // =========================

            if (
                item.effectDuration ===
                "5turn"
            ) {

                const acquiredTurn =
                    inventoryData.acquiredTurn;


                if (
                    acquiredTurn === undefined ||
                    acquiredTurn === null
                ) {

                    return;

                }


                if (
                    currentTurn !== undefined &&
                    currentTurn -
                    acquiredTurn >= 5
                ) {

                    return;

                }

            }


            // =========================
            // ターン開始時のG獲得
            // =========================

            if (
                item.effectType ===
                "goldGain"
            ) {

                const gain =
                    item.effectValue || 0;


                player.money +=
                    gain;


                console.log(
                    `${player.name}：${item.name}の効果で ${gain}G獲得`
                );

            }

        }
    );

}


// =========================
// アイテムの効果値を取得
// =========================

function getItemEffect(
    player,
    effectType
) {

    let totalValue = 0;


    if (
        !player.inventory
    ) {

        return totalValue;

    }


    player.inventory.forEach(
        function (inventoryData) {

            // =========================
            // パッシブアイテムだけ対象
            // =========================

            if (
                typeof inventoryData !==
                "object"
            ) {

                return;

            }


            const item =
                ITEM_CONTENTS[
                    inventoryData.id
                ];


            if (!item) {

                return;

            }


            if (
                item.category !==
                "passive"
            ) {

                return;

            }


            if (
                item.effectType ===
                effectType
            ) {

                totalValue +=
                    item.effectValue || 0;

            }

        }
    );


    return totalValue;

}

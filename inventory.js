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

        const duration =
            item.effectDuration &&
            item.effectDuration.endsWith("turn")
                ? Number(
                    item.effectDuration.replace(
                        "turn",
                        ""
                    )
                )
                : null;

        player.inventory.push({

            id:
                numericItemId,

            acquiredTurn:
                acquiredTurn,

            remainingUses:
                duration

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

    const expiredItems = [];

    if (
        !player.inventory ||
        player.inventory.length === 0
    ) {

        return expiredItems;

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
                if (!item) {

                    return true;

                }

                // パッシブアイテム以外は対象外
                if (
                    item.category !==
                    "passive"
                ) {

                    return true;

                }

                // 永続効果は残す
                if (
                    item.effectDuration ===
                    "permanent"
                ) {

                    return true;

                }

                // ターン制限がないアイテムは残す
                if (
                    !item.effectDuration ||
                    !item.effectDuration.endsWith("turn")
                ) {

                    return true;

                }

                // =========================
                // 残り発動回数が0なら削除
                // =========================

                if (
                    Number(inventoryData.remainingUses) <= 0
                ) {

                    expiredItems.push({

                        itemId:
                            Number(inventoryData.id),

                        itemName:
                            item.name

                    });

                    return false;

                }

                return true;

            }
        );

    return expiredItems;

}


// =========================================================
// ターン開始時のアイテム効果
// =========================================================

function applyTurnStartItemEffects(
    player
) {

    const appliedEffects = [];

    if (
        !player.inventory ||
        player.inventory.length === 0
    ) {

        return appliedEffects;

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
            // ターン制限がある場合
            // 残り発動回数を初期化
            // =========================

            if (
                item.effectDuration &&
                item.effectDuration.endsWith("turn")
            ) {

                const duration =
                    Number(
                        item.effectDuration.replace(
                            "turn",
                            ""
                        )
                    );

                // 古い個体データにも対応
                if (
                    inventoryData.remainingUses === undefined ||
                    inventoryData.remainingUses === null
                ) {

                    inventoryData.remainingUses =
                        duration;

                }

                // 発動回数が残っていない場合は
                // 効果を発動しない
                if (
                    Number(inventoryData.remainingUses) <= 0
                ) {

                    return;

                }

            }

            // =========================
            // ターン開始時のG効果
            // =========================

            if (
                item.effectType ===
                "goldGain"
            ) {

                const gain =
                    Number(item.effectValue) || 0;

                // ① ゴールドを増減
                player.money =
                    Number(player.money) + gain;

                // ② アナウンス用データを保存
                appliedEffects.push({

                    itemId:
                        Number(inventoryData.id),

                    itemName:
                        item.name,

                    gain:
                        gain

                });

                if (gain > 0) {

                    console.log(
                        `${player.name}：${item.name}の効果で ${gain}G獲得`
                    );

                } else if (gain < 0) {

                    console.log(
                        `${player.name}：${item.name}の効果で ${Math.abs(gain)}G減少`
                    );

                }

            }

 
// =========================
// ③ ターン開始時に残りターンを減らす
// =========================

if (
    item.effectDuration &&
    item.effectDuration.endsWith("turn") &&
    (
        item.effectType === "goldGain" ||
        item.effectType === "bossCounterImmunity"
    )
) {

    inventoryData.remainingUses -= 1;

}


        }
    );

    return appliedEffects;

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

// ============================================================
// ロスノート使用処理
// ============================================================
function useLossNote(
    usingPlayer,
    targetPlayer,
    currentTurn
) {

    // ロスノートを所持しているか確認
    const inventoryIndex =
        usingPlayer.inventory.findIndex(
            function (inventoryData) {

                const id =
                    typeof inventoryData === "object"
                        ? inventoryData.id
                        : Number(inventoryData);

                return Number(id) === 13;
            }
        );

    // ロスノートを持っていなければ使用不可
    if (inventoryIndex === -1) {
        return null;
    }

    // ロスノートを消費
    usingPlayer.inventory.splice(
        inventoryIndex,
        1
    );

   // リスポーン時のゴールドを計算
const respawnGold =
    10000 + (bossDefeatedCount * 2500);

// =========================
// バイトを強制終了
// =========================

targetPlayer.jobTurnsRemaining =
    0;

targetPlayer.jobReward =
    0;

// =========================
// 対象プレイヤーのゴールドをリセット
// =========================

targetPlayer.money =
    respawnGold;

// =========================
// スタート地点へリスポーン
// =========================

targetPlayer.position =
    139;

// リスポーン後は1ターン休み

targetPlayer.skipTurn =  true;

    // リスポーン時の固定アイテム
    addItem(
        targetPlayer,
        1,
        currentTurn
    );

    addItem(
        targetPlayer,
        12,
        currentTurn
    );

    // 結果を返す
    return {
        respawnGold: respawnGold
    };
}

// ============================================================
// 叩き派遣使用処理
// ============================================================

function useHatatakiHaken(
    usingPlayer,
    allPlayers
) {

    // 叩き派遣を所持しているか確認
    const inventoryIndex =
        usingPlayer.inventory.findIndex(
            function (inventoryData) {

                const id =
                    typeof inventoryData === "object"
                        ? inventoryData.id
                        : Number(inventoryData);

                return Number(id) === 17;

            }
        );

    // 持っていなければ使用不可
    if (inventoryIndex === -1) {

        return null;

    }

    // 叩き派遣を消費
    usingPlayer.inventory.splice(
        inventoryIndex,
        1
    );

    // 他プレイヤーだけを対象にする
    const targetPlayers =
        allPlayers.filter(
            function (targetPlayer) {

                return targetPlayer !== usingPlayer;

            }
        );

    const results = [];

    targetPlayers.forEach(
        function (targetPlayer) {

           // 0～5個をランダムで決定
        let destroyCount =
           Math.floor(
             Math.random() * 6
              );

            // 所持数以上にはしない
            destroyCount =
              Math.min(
                    destroyCount,
                    targetPlayer.inventory.length
             );

            const lostItems = [];

            // ランダムにアイテムを削除
            for (
                let i = 0;
                i < destroyCount;
                i++
            ) {

                const randomIndex =
                    Math.floor(
                        Math.random() *
                        targetPlayer.inventory.length
                    );

                const removedItem =
                    targetPlayer.inventory.splice(
                        randomIndex,
                        1
                    )[0];

                if (
                    removedItem === undefined
                ) {
                    continue;
                }

                const removedItemId =
                    typeof removedItem === "object"
                        ? removedItem.id
                        : Number(removedItem);

                const removedItemData =
                    ITEM_CONTENTS[
                        removedItemId
                    ];

                if (removedItemData) {

                    lostItems.push(
                        removedItemData.name
                    );

                }

            }

            results.push({
                player: targetPlayer,
                lostItems: lostItems
            });

        }
    );

    return results;
}

// ============================================================
// 瞬間移動使用処理
// ============================================================

function useWarpToBoss(
    player
) {

    // =========================
    // 瞬間移動を所持しているか確認
    // =========================

    const inventoryIndex =
        player.inventory.findIndex(
            function (inventoryData) {

                const id =
                    typeof inventoryData === "object"
                        ? inventoryData.id
                        : Number(inventoryData);

                return Number(id) === 14;

            }
        );


    // =========================
    // 持っていなければ使用不可
    // =========================

    if (
        inventoryIndex === -1
    ) {

        return null;

    }


// =========================
// 現在地からボスまでの
// 最短ルートを取得
// =========================

if (
    typeof window.getShortestPathToBoss !==
    "function"
) {
    console.error(
        "最短ルート取得処理が準備されていません。"
    );
    return null;

}

const path =
    window.getShortestPathToBoss(
        player.position
    );


    // =========================
    // 最短ルートが存在しない
    // =========================

    if (
        !path ||
        path.length < 2
    ) {

        return null;

    }


    // =========================
    // ボスまであと1マスの場合
    // =========================
    //
    // path:
    //
    // [現在地, ボス]
    //
    // この場合はすでに目的地なので
    // 使用不可
    // =========================

    if (
        path.length === 2
    ) {

        return null;

    }


    // =========================
    // ボスの1マス手前を取得
    // =========================
    //
    // 例：
    //
    // [現在地, A, B, C, ボス]
    //
    // ↓
    //
    // path[path.length - 2]
    //
    // = C
    // =========================

    const warpPosition =
        path[
            path.length - 2
        ];


    // =========================
    // アイテムを1個消費
    // =========================

    player.inventory.splice(
        inventoryIndex,
        1
    );


    // =========================
    // プレイヤーをワープ
    // =========================

    player.position =
        warpPosition;

    // =========================
// 瞬間移動SE
// =========================

if (
    typeof warpSound !== "undefined"
) {

    warpSound.currentTime = 0;

    warpSound
        .play()
        .catch(
            function (error) {

                console.warn(
                    "【瞬間移動SE】再生失敗：",
                    error
                );

            }
        );

}

    // =========================
    // 移動履歴をリセット
    // =========================

    movementPath = [];


    // =========================
    // マップ・プレイヤー表示更新
    // =========================

    renderMap();
    renderPlayers();


    // =========================
    // 最短ルートを更新
    // =========================

     refreshShortestPathToBoss();


    // =========================
    // 結果を返す
    // =========================

    return {
        warpPosition:
            warpPosition
    };

}

// ============================================================
// ロストマジック使用処理
// ============================================================
function useLostMagic(
    usingPlayer,
    targetPlayer,
    magicId
) {

    // ロストマジックを所持しているか確認
    const inventoryIndex =
        usingPlayer.inventory.findIndex(
            function (inventoryData) {

                const id =
                    typeof inventoryData === "object"
                        ? inventoryData.id
                        : Number(inventoryData);

                return Number(id) === 18;

            }
        );

    // ロストマジックを持っていなければ使用不可
    if (inventoryIndex === -1) {
        return null;
    }

    // 対象の魔法を確認
    const magicIndex =
        targetPlayer.magic.findIndex(
            function (id) {

                return Number(id) ===
                    Number(magicId);

            }
        );

    // 魔法が見つからなければ使用不可
    if (magicIndex === -1) {
        return null;
    }

    // ロストマジックを消費
    usingPlayer.inventory.splice(
        inventoryIndex,
        1
    );

    // 魔法を消失
    targetPlayer.magic.splice(
        magicIndex,
        1
    );

    // 消失した魔法を返す
    return {
        magicId: Number(magicId)
    };
}

// ============================================================
// ID:19 送金奪金 使用処理
// ============================================================
function useMoneyTransfer(
    usingPlayer,
    targetPlayer,
    amount
) {

    // =========================
    // 送金奪金を所持しているか確認
    // =========================

    const inventoryIndex =
        usingPlayer.inventory.findIndex(
            function (inventoryData) {

                const id =
                    typeof inventoryData === "object"
                        ? inventoryData.id
                        : Number(inventoryData);

                return Number(id) === 19;

            }
        );

    if (
        inventoryIndex === -1
    ) {
        return null;
    }


    // =========================
    // 金額を数値化
    // =========================

    amount =
        Number(amount);


    // 0Gは使用不可
    if (
        !Number.isFinite(amount) ||
        amount === 0
    ) {
        return null;
    }


    // =========================
    // 送金
    // =========================

    if (
        amount > 0
    ) {

        // 自分の所持Gを上限にする

        const transferAmount =
            Math.min(
                amount,
                usingPlayer.money
            );

        if (
            transferAmount <= 0
        ) {
            return null;
        }

        usingPlayer.money -=
            transferAmount;

        targetPlayer.money +=
            transferAmount;


        // アイテム消費

        usingPlayer.inventory.splice(
            inventoryIndex,
            1
        );


        return {
            type: "send",
            amount: transferAmount
        };

    }


    // =========================
    // 奪金
    // =========================

    const stealAmount =
        Math.min(
            Math.abs(amount),
            targetPlayer.money
        );

    if (
        stealAmount <= 0
    ) {
        return null;
    }

    targetPlayer.money -=
        stealAmount;

    usingPlayer.money +=
        stealAmount;


    // アイテム消費

    usingPlayer.inventory.splice(
        inventoryIndex,
        1
    );


    return {
        type: "steal",
        amount: stealAmount
    };

}

// ============================================================
// ID:20 飛んできマス使用処理
// マップ上のランダムなマスへワープ
// ============================================================
function useWarpToRandom(
    player
) {

    // 飛んできマスを所持しているか確認
    const inventoryIndex =
        player.inventory.findIndex(
            function (inventoryData) {

                const id =
                    typeof inventoryData === "object"
                        ? inventoryData.id
                        : Number(inventoryData);

                return Number(id) === 20;
            }
        );

    // 飛んできマスを持っていなければ使用不可ssss
    if (inventoryIndex === -1) {
        return null;
    }

    // mapDataからランダムなマスを選択
    if (
        !Array.isArray(mapData) ||
        mapData.length === 0
    ) {
        return null;
    }

    const randomIndex =
        Math.floor(
            Math.random() *
            mapData.length
        );

    const randomSquare =
        mapData[randomIndex];

    if (!randomSquare) {
        return null;
    }

    // 飛んできマスを消費
    player.inventory.splice(
        inventoryIndex,
        1
    );

    return {
        position: randomSquare.id
    };
}


 // ============================================================
 // ID:23 ふっとばしマス使用処理
 // 自分以外の全プレイヤーをランダムなマスへ移動
 // ============================================================

function useWarpAllPlayersRandom(player) {

    // ふっとばしマスを所持しているか確認
    const inventoryIndex =
        player.inventory.findIndex(
            function (inventoryData) {

                const id =
                    typeof inventoryData === "object"
                        ? inventoryData.id
                        : Number(inventoryData);

                return Number(id) === 23;

            }
        );

    if (inventoryIndex === -1) {
        return null;
    }

    // マップを確認
    if (
        !Array.isArray(mapData) ||
        mapData.length === 0
    ) {
        return null;
    }

    // 自分以外のプレイヤーの移動先を決定
    const targets =
        players
            .filter(function (targetPlayer) {
                return targetPlayer !== player;
            })
            .map(function (targetPlayer) {

                const randomIndex =
                    Math.floor(
                        Math.random() * mapData.length
                    );

                return {
                    player: targetPlayer,
                    position: mapData[randomIndex].id
                };

            });

    // アイテムを消費
    player.inventory.splice(
        inventoryIndex,
        1
    );

    return targets;
}


// =========================================================
// 闇ヤマト
// アイテムを送付 / 強奪
// =========================================================

function useItemTransfer(
    usingPlayer,
    targetPlayer,
    inventoryIndex,
    type
) {

    // =========================
    // 闇ヤマト自身を探す
    // =========================

    const transferItemIndex =
        usingPlayer.inventory.findIndex(
            function (inventoryData) {

                const id =
                    typeof inventoryData === "object"
                        ? inventoryData.id
                        : Number(inventoryData);

                return Number(id) === 21;

            }
        );

    if (
        transferItemIndex === -1
    ) {
        return null;
    }


    // =========================
    // 渡す
    // =========================

    if (
        type === "send"
    ) {

        const itemIndex =
            Number(inventoryIndex);

        if (
            !Number.isInteger(itemIndex) ||
            itemIndex < 0 ||
            itemIndex >= usingPlayer.inventory.length ||
            itemIndex === transferItemIndex
        ) {
            return null;
        }


        const transferItem =
            usingPlayer.inventory[
                itemIndex
            ];


      // 選択したアイテム

const sentItem =
    usingPlayer.inventory.splice(
        itemIndex,
        1
    )[0];


if (
    sentItem === undefined
) {
    return null;
}


// 闇ヤマトを消費

usingPlayer.inventory.splice(
    transferItemIndex > itemIndex
        ? transferItemIndex - 1
        : transferItemIndex,
    1
);


// 相手へ追加

targetPlayer.inventory.push(
    sentItem
);

        return {
            type: "send",
            itemId:
                typeof sentItem === "object"
                    ? Number(sentItem.id)
                    : Number(sentItem)
        };

    }


    // =========================
    // 奪う
    // =========================

    if (
        type === "steal"
    ) {

        const itemIndex =
            Number(inventoryIndex);

        if (
            !Number.isInteger(itemIndex) ||
            itemIndex < 0 ||
            itemIndex >= targetPlayer.inventory.length
        ) {
            return null;
        }


        // 選択したアイテム

        const stolenItem =
            targetPlayer.inventory[
                itemIndex
            ];


        // 闇ヤマトを消費

        usingPlayer.inventory.splice(
            transferItemIndex,
            1
        );


        // 相手からアイテムを削除

        targetPlayer.inventory.splice(
            itemIndex,
            1
        );


        // 自分のインベントリへ追加

        usingPlayer.inventory.push(
            stolenItem
        );


        return {
            type: "steal",
            itemId:
                typeof stolenItem === "object"
                    ? Number(stolenItem.id)
                    : Number(stolenItem)
        };

    }


    return null;

}

// ============================================================
// 闇スーモ
// 資産を贈与 / 強奪
// ============================================================

function useAssetTransfer(
    usingPlayer,
    targetPlayer,
    assetId,
    type
) {

    // 闇スーモを所持しているか確認
    const inventoryIndex =
        usingPlayer.inventory.findIndex(
            function (inventoryData) {

                const id =
                    typeof inventoryData === "object"
                        ? inventoryData.id
                        : Number(inventoryData);

                return Number(id) === 22;

            }
        );

    if (inventoryIndex === -1) {
        return null;
    }

    const sourcePlayer =
        type === "send"
            ? usingPlayer
            : targetPlayer;

    const destinationPlayer =
        type === "send"
            ? targetPlayer
            : usingPlayer;

    const sourcePlayerIndex =
        players.indexOf(sourcePlayer);

    const destinationPlayerIndex =
        players.indexOf(destinationPlayer);

    const numericAssetId =
        Number(assetId);

    const asset =
        ASSET_CONTENTS[numericAssetId];

    // 対象資産の所有者を確認
    if (
        !asset ||
        asset.owner !== sourcePlayerIndex ||
        !sourcePlayer.assets ||
        !sourcePlayer.assets.some(
            function (ownedAssetId) {
                return Number(ownedAssetId) === numericAssetId;
            }
        )
    ) {
        return null;
    }

    // 所有者情報を更新
    asset.owner = destinationPlayerIndex;

    // 移転元から資産を削除
    sourcePlayer.assets =
        sourcePlayer.assets.filter(
            function (ownedAssetId) {
                return Number(ownedAssetId) !== numericAssetId;
            }
        );

    // 移転先に資産を追加
    if (!destinationPlayer.assets) {
        destinationPlayer.assets = [];
    }

    if (
        !destinationPlayer.assets.some(
            function (ownedAssetId) {
                return Number(ownedAssetId) === numericAssetId;
            }
        )
    ) {
        destinationPlayer.assets.push(numericAssetId);
    }

    // 闇スーモを消費
    usingPlayer.inventory.splice(
        inventoryIndex,
        1
    );

    return {
        type: type,
        assetId: numericAssetId,
        assetName: asset.name,
        price: asset.price
    };

}
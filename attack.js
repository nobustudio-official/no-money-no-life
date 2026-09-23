// =========================
// 攻撃魔法のダメージ計算
// =========================

function calculateMagicDamage(
    player,
    magic
) {

    if (
        !player ||
        !magic ||
        magic.type !== "attack"
    ) {

        return 0;

    }


    // 魔法の基本ダメージ
    // 魔力 × 魔法ごとの倍率
    const baseDamage =
        Number(player.magicPower || 0) *
        Number(magic.powerRate || 0);


    // アイテムによる与ダメージ補正を適用
    return getPlayerDamage(
        player,
        baseDamage
    );

}

// =========================
// 魔法コスト計算
// =========================

function calculateMagicCost(
    player,
    magic,
    battleState
) {

    if (
        !player ||
        !magic
    ) {

        return 0;

    }


    const magicPower =
        Number(player.magicPower || 0) *
        Number(
            battleState?.magicPowerRate || 1
        );


    return Math.floor(
        magicPower *
        Number(magic.costRate || 0)
    );

}

// =========================
// モンスターHPへのダメージ適用
// =========================

function applyMonsterDamage(
    monsterHP,
    damage
) {

    return Math.max(
        0,
        Number(monsterHP || 0) -
        Number(damage || 0)
    );

}

// =========================
// ボスへの実ダメージ計算
// =========================

function calculateActualDamage(
    damage,
    bossHP
) {

    return Math.min(
        Math.max(
            0,
            Number(damage || 0)
        ),
        Math.max(
            0,
            Number(bossHP || 0)
        )
    );

}

// =========================
// ボスHPへのダメージ適用
// =========================

function applyBossDamage(
    bossHP,
    damage
) {

    return Math.max(
        0,
        Number(bossHP || 0) -
        Number(damage || 0)
    );

}

// =========================
// モンスターから受けるダメージ
// =========================

function getMonsterDamage(
    player,
    damage
) {

    const damageReduction =
        getItemEffect(
            player,
            "damageReduction"
        );


    const finalDamage =
        Math.max(
            0,
            damage -
            damageReduction
        );


    console.log(
        `${player.name}：${finalDamage}ダメージを受けました`
    );


    return finalDamage;

}

// =========================
// アイテムによる与ダメージ補正
// =========================

function getPlayerDamage(
    player,
    damage
) {

    const damageBonus =
        getItemEffect(
            player,
            "damageBonus"
        );


    const finalDamage =
        Math.max(
            0,
            damage +
            damageBonus
        );


    console.log(
        `${player.name}：${finalDamage}ダメージを与えました`
    );


    return finalDamage;

}

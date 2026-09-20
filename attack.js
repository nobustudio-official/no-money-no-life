// =========================
// モンスターから受けるダメージ
// =========================

function getMonsterDamage(
    player,
    damage
) {

    const damageReduction =
        getPossessionEffect(
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
// 所持品による与ダメージ補正
// =========================

function getPlayerDamage(
    player,
    damage
) {

    const damageBonus =
        getPossessionEffect(
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

// =========================
// 魔法による与ダメージ計算
// =========================

function calculateMagicDamage(
    player,
    magic
) {

    const baseDamage =
        Math.floor(
            player.magicPower *
            magic.powerRate
        );

    return getPlayerDamage(
        player,
        baseDamage
    );

}

// =========================
// 実ダメージ計算
// =========================

function calculateActualDamage(
    damage,
    targetHP
) {

    return Math.min(
        damage,
        targetHP
    );

}

// =========================
// モンスターへのダメージ適用
// =========================

function applyMonsterDamage(
    monsterHP,
    damage
) {

    return Math.max(
        0,
        monsterHP - damage
    );

}

// =========================
// ボスへのダメージ適用
// =========================

function applyBossDamage(
    bossHP,
    damage
) {

    return Math.max(
        0,
        bossHP - damage
    );

}

// =========================
// ボスへのダメージ適用
// =========================

function applyBossDamage(
    bossHP,
    damage
) {

    return Math.max(
        0,
        bossHP - damage
    );

}

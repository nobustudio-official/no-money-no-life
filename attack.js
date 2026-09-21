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
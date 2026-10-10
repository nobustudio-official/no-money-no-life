// =========================
// 戦闘中バフ処理
// =========================

function tryApplyBattleBuff(
    magic,
    battleState
) {

    if (
        !magic ||
        magic.type !== "buff"
    ) {

        return {
            success: false
        };

    }


    // =========================
    // 成功確率判定
    // =========================

    const successRate =
        magic.buffSuccessRate ?? 1;

    const success =
        Math.random() < successRate;


    if (!success) {

        console.log(
            `${magic.name}：バフ失敗`
        );

        return {
            success: false
        };

    }


    // =========================
    // 自分の魔力アップ
    // =========================

    if (
        magic.buffTarget === "self" &&
        magic.buffStat === "magicPower"
    ) {

        battleState.magicPowerRate *=
            magic.buffRate;

    }


    // =========================
    // 敵の攻撃力ダウン
    // =========================

    if (
        magic.buffTarget === "enemy" &&
        magic.buffStat === "attackPower"
    ) {

        battleState.enemyAttackRate *=
            magic.buffRate;

    }


    console.log(
        `${magic.name}：バフ成功`
    );


    return {
        success: true
    };

}

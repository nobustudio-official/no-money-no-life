// =========================
// BGM
// =========================

// 基本音量
const BGM_VOLUME = 0.25;
const SE_VOLUME = 0.7;

//冒険
const adventureBGM =
    new Audio("BGM/冒険.mp3");

let bgmAudioContext = null;

let adventureBGMGain = null;
let townBGMGain = null;
let nobilityBGMGain = null;
let bossVictoryBGMGain = null;
let bossBattleBGMGain = null;
let maouFastBGMGain = null;
let maouFinalBGMGain = null;
let maouEndBGMGain = null;

adventureBGM.loop = true;
adventureBGM.volume = 1.0;
adventureBGM.preload = "auto";


// =========================
// BGM共通再生処理
// Web / スマホ対応
// =========================

function setupBGM(
    bgm,
    gainNode,
    gainSetter
) {

    // =========================
    // ローカル環境
    // =========================

    if (location.protocol === "file:") {

        stopAllBGM();

        bgm.volume =
            BGM_VOLUME;

        bgm.currentTime = 0;

        bgm.play().catch(
            function (error) {

                console.warn(
                    "【BGM】再生失敗：",
                    error
                );

            }
        );

        return;
    }


    // =========================
    // Web環境
    // =========================

    if (!bgmAudioContext) {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        bgmAudioContext =
            new AudioContext();

    }


    // =========================
    // GainNode作成
    // =========================

    if (!gainNode) {

        gainNode =
            bgmAudioContext.createGain();

        const source =
            bgmAudioContext.createMediaElementSource(
                bgm
            );

        source.connect(
            gainNode
        );

        gainNode.connect(
            bgmAudioContext.destination
        );

        gainNode.gain.value =
            BGM_VOLUME;

        gainSetter(
            gainNode
        );

    }


    // =========================
    // 現在のBGMを停止
    // =========================

    stopAllBGM();


    // =========================
    // BGMを最初から再生
    // =========================

    bgm.currentTime = 0;

    bgm.play().catch(
        function (error) {

            console.warn(
                "【BGM】再生失敗：",
                error
            );

        }
    );


    // =========================
    // AudioContextを再開
    // =========================

    if (
        bgmAudioContext.state ===
        "suspended"
    ) {

        bgmAudioContext.resume();

    }

}

// =========================
// BGM GainNode設定
// =========================

function setAdventureBGMGain(
    gain
) {

    adventureBGMGain =
        gain;

}


function setTownBGMGain(
    gain
) {

    townBGMGain =
        gain;

}


function setNobilityBGMGain(
    gain
) {

    nobilityBGMGain =
        gain;

}


function setBossVictoryBGMGain(
    gain
) {

    bossVictoryBGMGain =
        gain;

}


function setBossBattleBGMGain(
    gain
) {

    bossBattleBGMGain =
        gain;

}

function setMaouFastBGMGain(
    gain
) {

    maouFastBGMGain =
        gain;

}


function setMaouFinalBGMGain(
    gain
) {

    maouFinalBGMGain =
        gain;

}


function setMaouEndBGMGain(
    gain
) {

    maouEndBGMGain =
        gain;

}

// =========================
// 冒険BGM
// =========================

function setupAdventureBGM() {

    // =========================
    // ローカル環境
    // =========================

    if (location.protocol === "file:") {

        stopAllBGM();

        adventureBGM.volume =
            BGM_VOLUME;

        adventureBGM.currentTime = 0;

        adventureBGM.play().catch(
            function (error) {

                console.warn(
                    "【冒険BGM】再生失敗：",
                    error
                );

            }
        );

        return;
    }


    // =========================
    // Web環境
    // =========================

    if (!bgmAudioContext) {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        bgmAudioContext =
            new AudioContext();

    }


    if (!adventureBGMGain) {

        adventureBGMGain =
            bgmAudioContext.createGain();

        const source =
            bgmAudioContext.createMediaElementSource(
                adventureBGM
            );

        source.connect(
            adventureBGMGain
        );

        adventureBGMGain.connect(
            bgmAudioContext.destination
        );

        adventureBGMGain.gain.value =
            BGM_VOLUME;

    }


    stopAllBGM();

    adventureBGM.currentTime = 0;

    adventureBGM.play().catch(
        function (error) {

            console.warn(
                "【冒険BGM】再生失敗：",
                error
            );

        }
    );


    if (
        bgmAudioContext.state ===
        "suspended"
    ) {

        bgmAudioContext.resume();

    }

}

// =========================
// 各BGMのWeb / スマホ用設定
// =========================

function setupBGMGain(
    bgm,
    gainNode
) {

    if (location.protocol === "file:") {

        return;

    }


    if (!bgmAudioContext) {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        bgmAudioContext =
            new AudioContext();

    }


    if (gainNode) {

        return gainNode;

    }


    const newGain =
        bgmAudioContext.createGain();

    const source =
        bgmAudioContext.createMediaElementSource(
            bgm
        );

    source.connect(
        newGain
    );

    newGain.connect(
        bgmAudioContext.destination
    );

    newGain.gain.value =
        BGM_VOLUME;

    return newGain;

}

//街
const townBGM =
    new Audio("BGM/街.mp3");

townBGM.loop = true;
townBGM.volume = BGM_VOLUME;
townBGM.preload = "auto";

//貴族
const nobilityBGM =
    new Audio("BGM/貴族.mp3");

nobilityBGM.loop = true;
nobilityBGM.volume = BGM_VOLUME;
nobilityBGM.preload = "auto";

//凱旋
const bossVictoryBGM =
    new Audio("BGM/凱旋.mp3");
bossVictoryBGM.loop = true;
bossVictoryBGM.volume = BGM_VOLUME;
bossVictoryBGM.preload = "auto";

//ボス戦
const bossBattleBGM =
    new Audio("BGM/ボス戦.mp3");

bossBattleBGM.loop = true;
bossBattleBGM.volume = BGM_VOLUME;
bossBattleBGM.preload = "auto";

//魔王-fast
const maouFastBGM =
    new Audio("BGM/魔王-fast.mp3");

maouFastBGM.loop = true;
maouFastBGM.volume = BGM_VOLUME;
maouFastBGM.preload = "auto";

//魔王-final
const maouFinalBGM =
    new Audio("BGM/魔王-final.mp3");

maouFinalBGM.loop = true;
maouFinalBGM.volume = BGM_VOLUME;
maouFinalBGM.preload = "auto";

//魔王-end
const maouEndBGM =
    new Audio("BGM/魔王-end.mp3");

maouEndBGM.loop = true;
maouEndBGM.volume = BGM_VOLUME;
maouEndBGM.preload = "auto";


// =========================
// すべてのBGMを停止
// =========================

function stopAllBGM() {

    adventureBGM.pause();
    townBGM.pause();
    nobilityBGM.pause();
    bossVictoryBGM.pause();
    bossBattleBGM.pause();
    maouFastBGM.pause();
    maouFinalBGM.pause();
    maouEndBGM.pause();

}

// =========================
// すべてのBGMの音量を設定
// =========================

function setBGMVolume(volume) {

    // =========================
    // 冒険BGM
    // =========================

    if (adventureBGMGain) {

        adventureBGMGain.gain.value =
            volume;

    } else {

        adventureBGM.volume =
            volume;

    }


    // =========================
    // 街BGM
    // =========================

    if (townBGMGain) {

        townBGMGain.gain.value =
            volume;

    } else {

        townBGM.volume =
            volume;

    }


    // =========================
    // 貴族BGM
    // =========================

    if (nobilityBGMGain) {

        nobilityBGMGain.gain.value =
            volume;

    } else {

        nobilityBGM.volume =
            volume;

    }


    // =========================
    // 凱旋BGM
    // =========================

    if (bossVictoryBGMGain) {

        bossVictoryBGMGain.gain.value =
            volume;

    } else {

        bossVictoryBGM.volume =
            volume;

    }


    // =========================
    // ボス戦BGM
    // =========================

    if (bossBattleBGMGain) {

        bossBattleBGMGain.gain.value =
            volume;

    } else {

        bossBattleBGM.volume =
            volume;

    }

    // =========================
// 魔王-fast BGM
// =========================

if (maouFastBGMGain) {

    maouFastBGMGain.gain.value =
        volume;

} else {

    maouFastBGM.volume =
        volume;

}


// =========================
// 魔王-final BGM
// =========================

if (maouFinalBGMGain) {

    maouFinalBGMGain.gain.value =
        volume;

} else {

    maouFinalBGM.volume =
        volume;

}


// =========================
// 魔王-end BGM
// =========================

if (maouEndBGMGain) {

    maouEndBGMGain.gain.value =
        volume;

} else {

    maouEndBGM.volume =
        volume;

}

}

// =========================
// SE
// =========================



//開始音
const startSound =
    new Audio("sounds/シャララン.wav");
startSound.preload = "auto";

//サイコロ回転中
const diceSound =
    new Audio("sounds/サイコロ.wav");
diceSound.preload = "auto";

//サイコロ停止
const stopSound =
    new Audio("sounds/サイコロ停止.mp3");
stopSound.preload = "auto";

//ボタン音
const buttonSound =
    new Audio("sounds/決定ボタン.mp3");
buttonSound.preload = "auto";

//ルーレット回転中
const rouletteSound =
    new Audio("sounds/ルーレット回転中.mp3");
rouletteSound.preload = "auto";

//ルーレット停止
const roulettestopSound =
    new Audio("sounds/ルーレット停止.mp3");
roulettestopSound.preload = "auto";

//プレイヤー切り替え
const switchingSound =
    new Audio("sounds/プレイヤー切り替え.mp3");
switchingSound.preload = "auto";

//仮面割れる
const kamenSound =
    new Audio("sounds/ガラスが割れる2.mp3");
kamenSound.preload = "auto";

//魔王第二形態
const secondFormSound =
    new Audio("sounds/忍び寄る恐怖.mp3");
secondFormSound.preload = "auto";

//瞬間移動
const warpSound =
    new Audio("sounds/瞬間移動.mp3");
warpSound.preload = "auto";

//叩き派遣
const tatakiSound =
    new Audio("sounds/センチネル.mp3");
tatakiSound.preload = "auto";

//ロストマジック，ロスノート
const lostSound =
    new Audio("sounds/ドンドンパフパフ.mp3");
lostSound.preload = "auto";

//送金奪金
const sendSound =
    new Audio("sounds/金額表示.mp3");
sendSound.preload = "auto";

//ギブミーフォーユー
const send2Sound =
    new Audio("sounds/回想.mp3");
send2Sound.preload = "auto";
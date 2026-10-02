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

adventureBGM.loop = true;
adventureBGM.volume = 1.0;
adventureBGM.preload = "auto";

// =========================
// BGM共通再生処理
// Web / スマホ対応
// =========================

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


// =========================
// すべてのBGMを停止
// =========================

function stopAllBGM() {

    adventureBGM.pause();
    townBGM.pause();
    nobilityBGM.pause();
    bossVictoryBGM.pause();
    bossBattleBGM.pause();

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

}

// =========================
// SE
// =========================

//サイコロ
const diceSound =
    new Audio("sounds/サイコロ.wav");
diceSound.preload = "auto";

//開始音
const startSound =
    new Audio("sounds/シャララン.wav");
startSound.preload = "auto";

//決定音
const buttonSound =
    new Audio("sounds/決定ボタン.mp3");
buttonSound.preload = "auto";

//プレイヤー切り替え
const switchingSound =
    new Audio("sounds/プレイヤー切り替え.mp3");
switchingSound.preload = "auto";

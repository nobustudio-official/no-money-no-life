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

adventureBGM.loop = true;
adventureBGM.volume = 1.0;
adventureBGM.preload = "auto";

        // 冒険BGM 音量コントロール
        function setupAdventureBGM() {

    // =========================
    // ローカル環境
    // =========================

    if (location.protocol === "file:") {

        adventureBGM.volume =
            BGM_VOLUME;

        adventureBGM.currentTime = 0;

        adventureBGM.play();

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

// 再生開始
adventureBGM.play();

    // AudioContextを再開
    if (
        bgmAudioContext.state ===
        "suspended"
    ) {
        bgmAudioContext.resume();
    }
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
    // その他のBGM
    // =========================

    townBGM.volume =
        volume;

    nobilityBGM.volume =
        volume;

    bossVictoryBGM.volume =
        volume;

    bossBattleBGM.volume =
        volume;

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

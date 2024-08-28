import SlotAstrosSetting from "./SlotAstros.Setting";

const { ccclass, property } = cc._decorator;

export enum SLOT_SOUND_TYPE {
  ANTICIPATION = "anticipation",
  BACKGRLOOP = "backgrLoop",
  BANGUPEND = "bangupEnd",
  BANGUPLOOP = "bangupLoop",
  BANGUPSTART = "bangupStart",
  BIGWINSTART = "bigWinStart",
  BONUSREELSTOP = "bonusReelStop",
  BONUSWIN = "bonusWin",
  FSHIT = "fsHit",
  FSLOOP = "fsLoop",
  FSPOPUP = "fsPopup",
  FSPRELOADERFX = "fsPreloaderFx",
  FSPRELOADERLOOP = "fsPreloaderLoop",
  FSSTART = "fsStart",
  FSSTARTX2 = "fsStartx2",
  HIGHLIGHTS = "highlights",
  HIGHLIGHTSBIG = "highlightsBig",
  INTROENTERGAME = "introEnterGame",
  JACKSIREN = "jackSiren",
  JPHIT1 = "jpHit1",
  JPHIT2 = "jpHit2",
  JPHIT3 = "jpHit3",
  JPSPAWN1 = "jpSpawn1",
  JPSPAWN2 = "jpSpawn2",
  JPSPAWN3 = "jpSpawn3",
  LEVELMULTIPLY = "levelMultiply",
  LEVELUNLOCK = "levelUnlock",
  MEGAWINSTART = "megaWinStart",
  PAYTABLEPAGES = "payTablePages",
  PLAYBUTTON = "playButton",
  REELSPINLOOP0 = "reelSpinLoop0",
  REELSPINLOOP1 = "reelSpinLoop1",
  REELSPINLOOP2 = "reelSpinLoop2",
  REELSPINLOOP3 = "reelSpinLoop3",
  REELSPINLOOP4 = "reelSpinLoop4",
  REELSPINMECHLOOP = "reelSpinMechLoop",
  REELSTOP = "reelStop",
  SUPERWINSTART = "superWinStart",
  TOPWINPOPUP = "topWinPopup",
  TOPWINSPLASH = "topWinSplash",
  WILDHIT = "wildHit",
  WINSMALL = "winSmall",
  WINTILES = "winTiles",
}

@ccclass
export default class SlotAstrosMusicManager extends cc.Component {
  public static instance: SlotAstrosMusicManager = null;
  @property(cc.AudioClip)
  private sounds: cc.AudioClip = null;

  @property(cc.JsonAsset)
  private file: cc.JsonAsset = null;

  public musicStatus: boolean = true;

  private bgMusic: cc.AudioSource = null;
  private sound1: cc.AudioSource = null;
  private sound2: cc.AudioSource = null;
  private sound3: cc.AudioSource = null;
  private loop: cc.AudioSource = null;

  private _volume: number = 1;

  private data = null;

  onLoad() {
    SlotAstrosMusicManager.instance = this;
    this.data = this.file.json.sprite;

    this.bgMusic = this.node.addComponent(cc.AudioSource);
    this.bgMusic.clip = this.sounds;

    this.sound1 = this.node.addComponent(cc.AudioSource);
    this.sound1.clip = this.sounds;

    this.sound2 = this.node.addComponent(cc.AudioSource);
    this.sound2.clip = this.sounds;

    this.sound3 = this.node.addComponent(cc.AudioSource);
    this.sound3.clip = this.sounds;

    this.loop = this.node.addComponent(cc.AudioSource);
    this.loop.clip = this.sounds;
  }

  onDestroy() {}

  public init() {
    this.setSystemVolume(1);
  }

  public getSystemVolume() {
    return this._volume;
  }

  public setSystemVolume(volume: number) {
    this._volume = volume;
    this.bgMusic.volume = volume;
    this.sound1.volume = volume;
    this.sound2.volume = volume;
    this.sound3.volume = volume;
    this.loop.volume = volume;
    this.musicStatus = volume === 0 ? false : true;

  }

  public playType(type: string, i: number) {
    let time = this.data[type];
    if (time && this.musicStatus) {
      switch (i) {
        case 1:
          this.playActionMusic1(time);
          break;

        case 2:
          this.playActionMusic2(time);
          break;

        case 3:
          this.playActionMusic3(time);
          break;
      }
    }
  }

  private playActionMusic1(time: Array<number>) {
    this.sound1.unscheduleAllCallbacks();
    this.sound1.stop();
    this.sound1.volume = this._volume;
    this.sound1.play();
    this.sound1.setCurrentTime(time[0] / 1000);
    this.sound1.scheduleOnce(() => {
      this.sound1.stop();
    }, time[1] / 1000);
  }

  private playActionMusic2(time: Array<number>) {
    this.sound2.unscheduleAllCallbacks();
    this.sound2.stop();
    this.sound2.volume = this._volume;
    this.sound2.play();
    this.sound2.setCurrentTime(time[0] / 1000);
    this.sound2.scheduleOnce(() => {
      this.sound2.stop();
    }, time[1] / 1000);
  }

  private playActionMusic3(time: Array<number>) {
    this.sound3.unscheduleAllCallbacks();
    this.sound3.stop();
    this.sound3.volume = this._volume;
    this.sound3.play();
    this.sound3.setCurrentTime(time[0] / 1000);
    this.sound3.scheduleOnce(() => {
      this.sound3.stop();
    }, time[1] / 1000);
  }

  public playBgMusic() {
    this.bgMusic.unscheduleAllCallbacks();
    this.bgMusic.stop();
    let time = this.data["backgrLoop"];
    if (time && this.musicStatus) {
      this.bgMusic.volume = this._volume;
      this.bgMusic.play();
      this.bgMusic.setCurrentTime(time[0] / 1000);
      this.bgMusic.schedule(
        () => {
          this.bgMusic.setCurrentTime(time[0] / 1000);
        },
        time[1] / 1000,
        cc.macro.REPEAT_FOREVER
      );
    }
  }

  public stopBgMusic(){
    this.bgMusic.unscheduleAllCallbacks();
    this.bgMusic.stop();
  }

  public playLoop(type: string) {
    this.loop.unscheduleAllCallbacks();
    this.loop.stop();
    let time = this.data[type];
    if (time && this.musicStatus) {
      this.loop.volume = this._volume;
      this.loop.play();
      this.loop.setCurrentTime(time[0] / 1000);
      this.loop.schedule(
        () => {
          this.loop.setCurrentTime(time[0] / 1000);
        },
        time[1] / 1000,
        cc.macro.REPEAT_FOREVER
      );
    }
  }

  public stopLoop() {
    this.loop.unscheduleAllCallbacks();
    this.loop.stop();
  }

  public stopAll() {
    cc.audioEngine.stopAll();
  }
}

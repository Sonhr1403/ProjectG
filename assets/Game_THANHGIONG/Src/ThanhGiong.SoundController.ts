import ThanhGiongMain from "./ThanhGiong.Controller";

const { ccclass, property } = cc._decorator;

export enum SLOT_SOUND_TYPE {
  BACKGROUND = 0,
  START_SPIN = 1,
  BTN_CLICK = 2,
  STOP_SPIN = 4,
  STOP_SPIN_BOOSTER = 5,
  RESPIN_APPEAR = 7,
  LIGHT_EFFECT = 8,
  BACKGROUND_FREE = 9,
  SMALL_WIN = 10,
  COIN_COUNT_UP = 11,
  BIG_WIN = 13,
  MEGA_WIN = 14,
  SUPER_WIN = 15,
  LONG_WIN = 16,
  RESPIN_COIN_GREEN = 17,
  RESPIN_COIN_RED = 18,
  SCATTER = 24,
  SCATTER_4_SEC = 25,
  FREEGAME_PANEL = 26,
}

@ccclass
export default class ThanhGiongSoundController extends cc.Component {
  public static instance: ThanhGiongSoundController = null;
  @property(cc.AudioClip)
  public mainBGM: cc.AudioClip = null;
  @property(cc.AudioClip)
  public freeBGM: cc.AudioClip = null;
  @property(cc.AudioClip)
  public featureBGM: cc.AudioClip = null;
  @property(cc.AudioClip)
  private btnClick: cc.AudioClip = null;

  @property(cc.AudioClip)
  private spinStart: cc.AudioClip = null;
  @property(cc.AudioClip)
  private spinEnd: cc.AudioClip = null;
  @property(cc.AudioClip)
  private spinEndBooster: cc.AudioClip = null;
  @property(cc.AudioClip)
  public lightEffect: cc.AudioClip = null;
  @property(cc.AudioClip)
  public coinCountUp: cc.AudioClip = null;
  
  @property(cc.AudioClip)
  private smallWin: cc.AudioClip = null;
  @property(cc.AudioClip)
  private bigWin: cc.AudioClip = null;
  @property(cc.AudioClip)
  private megaWin: cc.AudioClip = null;
  @property(cc.AudioClip)
  private superWin: cc.AudioClip = null;
  @property(cc.AudioClip)
  public longWin: cc.AudioClip = null;
  @property(cc.AudioClip)
  private scatterWin: cc.AudioClip = null;
  @property(cc.AudioClip)
  private freegamePanel: cc.AudioClip = null;
  @property(cc.AudioClip)
  private respinSmall: cc.AudioClip = null;
  @property(cc.AudioClip)
  private respinBig: cc.AudioClip = null;
  @property(cc.AudioClip)
  private respinCoinAppear: cc.AudioClip = null;
  @property(cc.AudioClip)
  private scatterAppear: cc.AudioClip[] = [];

  private _audioId: number = -1;
  private _fxId: number = -1;
  private _sfxId: number = -1;
  private _volume: number = 1;
  private musicStatus: boolean = true;
  private scatterCount: number = 0;
  onLoad() {
    ThanhGiongSoundController.instance = this;
  }

  public init() {
    this.setSystemVolume(1);
  }

  public getSystemVolume() {
    return this._volume;
  }

  public setSystemVolume(volume: number) {
    this._volume = volume;
    cc.audioEngine.pause(this._audioId);
    cc.audioEngine.setVolume(this._audioId, volume);
    cc.audioEngine.resume(this._audioId);
  }

  public playType(type: number) {
    if (this.getSystemVolume() > 0) {
      let audioClip: cc.AudioClip = null;
      switch (type) {
        case SLOT_SOUND_TYPE.BTN_CLICK:
          audioClip = this.btnClick;
          break;
        case SLOT_SOUND_TYPE.START_SPIN:
          audioClip = this.spinStart;
          this.scatterCount = 0;
          break;
        case SLOT_SOUND_TYPE.STOP_SPIN:
          audioClip = this.spinEnd;
          break;
        case SLOT_SOUND_TYPE.STOP_SPIN_BOOSTER:
          audioClip = this.spinEndBooster;
          break;
        case SLOT_SOUND_TYPE.LIGHT_EFFECT:
          audioClip = this.lightEffect;
          break;
        case SLOT_SOUND_TYPE.SMALL_WIN:
          audioClip = this.smallWin;
          break;
        case SLOT_SOUND_TYPE.COIN_COUNT_UP:
          audioClip = this.coinCountUp;
          break;
        case SLOT_SOUND_TYPE.BIG_WIN:
          audioClip = this.bigWin;
          break;
        case SLOT_SOUND_TYPE.MEGA_WIN:
          audioClip = this.megaWin;
          break;
        case SLOT_SOUND_TYPE.SUPER_WIN:
          audioClip = this.superWin;
          break;
        case SLOT_SOUND_TYPE.LONG_WIN:
          audioClip = this.longWin;
        case SLOT_SOUND_TYPE.SCATTER_4_SEC:
          audioClip = this.scatterWin;
          break;
        case SLOT_SOUND_TYPE.FREEGAME_PANEL:
          audioClip = this.freegamePanel;
          break;
        case SLOT_SOUND_TYPE.RESPIN_COIN_GREEN:
          audioClip = this.respinSmall;
          break;
        case SLOT_SOUND_TYPE.RESPIN_COIN_RED:
          audioClip = this.respinBig;
          break;
        case SLOT_SOUND_TYPE.RESPIN_APPEAR:
          audioClip = this.respinCoinAppear;
          break;
       
      }
      if (audioClip && this.musicStatus) {
        this.playActionMusic(audioClip);
      }
    }
  }

  public playActionMusic(audioClip: cc.AudioClip) {
    this._sfxId = cc.audioEngine.play(audioClip, false, this._volume);
  }

  public playSlotMusic(audioClip: cc.AudioClip) {
    cc.audioEngine.stop(this._audioId);
    this._audioId = cc.audioEngine.play(audioClip, true, this._volume);
  }

  public stopSlotMusic() {
    cc.audioEngine.stop(this._audioId);
  }

  public playTypeLoop(audioClip: cc.AudioClip) {
    cc.audioEngine.stop(this._fxId);
    this._fxId = cc.audioEngine.play(audioClip, true, this._volume);
  }

  public playSoundScatter() {
    this.scatterCount += 1;
    let audioClipScatter;
    switch (Number(this.scatterCount)) {
      case 1:
        audioClipScatter = this.scatterAppear[0];
        break;
      case 2:
        audioClipScatter = this.scatterAppear[1];
        break;
      case 3:
        audioClipScatter = this.scatterAppear[2];
        break;
      case 4:
        audioClipScatter = this.scatterAppear[2];
        break;
      case 5:
        audioClipScatter = this.scatterAppear[2];
        break;
    }
    if (this.getSystemVolume() > 0) {
      cc.audioEngine.play(audioClipScatter, false, this._volume);
    }
  }

  public stopPlayLoop() {
    cc.audioEngine.stop(this._fxId);
  }
  public stopPlayAction() {
    cc.audioEngine.stop(this._sfxId);
  }

  public stopAll() {
    cc.audioEngine.stopAll();
  }
}

import VanessaMain from "./Vanessa.Controller";

const { ccclass, property } = cc._decorator;

export enum SLOT_SOUND_TYPE {
  BACKGROUND = 0,
  START_SPIN = 1,
  BTN_CLICK = 2,
  TRANSITION_TROLLEY = 3,
  STOP_SPIN = 4,
  LEADER_START_CHANGE = 5,
  LEADER_DONE_CHANGE = 6,
  LEADER_WIN = 7,
  LIGHT_EFFECT = 8,
  BACKGROUND_FREE = 9,
  SMALL_WIN = 10,
  COIN_COUNT_UP = 11,
  ROULETTE_WIN = 12,
  BIG_WIN = 13,
  MEGA_WIN = 14,
  SUPER_WIN = 15,
  SWORD_ATTACK = 16,
  WHIP_ATTACK = 17,
  LEADER_FREE_START_SPIN = 18,
  LEADER_FREE_WIN = 19,
  LONG_WIN = 20,
  FRAME_ONE = 21,
  FRAME_TWO = 22,
  FRAME_THREE = 23,
  FRAME_FOUR = 24,
  SCATTER_4_SEC = 25,
}

@ccclass
export default class VanessaSoundController extends cc.Component {
  public static instance: VanessaSoundController = null;
  @property(cc.AudioClip)
  public mainBGM: cc.AudioClip = null;
  @property(cc.AudioClip)
  public freeBGM: cc.AudioClip = null;
  @property(cc.AudioClip)
  public featureBGM: cc.AudioClip = null;

  @property(cc.AudioClip)
  private leaderStartChange: cc.AudioClip = null;
  @property(cc.AudioClip)
  private leaderDoneChange: cc.AudioClip = null;
  @property(cc.AudioClip)
  private leaderWin: cc.AudioClip = null;

  @property(cc.AudioClip)
  private leaderFreeStartSpin: cc.AudioClip = null;
  @property(cc.AudioClip)
  private leaderFreeWin: cc.AudioClip = null;

  @property(cc.AudioClip)
  private btnClick: cc.AudioClip = null;

  @property(cc.AudioClip)
  private swordAttack: cc.AudioClip = null;
  @property(cc.AudioClip)
  private whipAttack: cc.AudioClip = null;

  @property(cc.AudioClip)
  private spinStart: cc.AudioClip = null;
  @property(cc.AudioClip)
  private spinEnd: cc.AudioClip = null;
  @property(cc.AudioClip)
  public lightEffect: cc.AudioClip = null;
  @property(cc.AudioClip)
  private smallWin: cc.AudioClip = null;
  @property(cc.AudioClip)
  public coinCountUp: cc.AudioClip = null;
  @property(cc.AudioClip)
  private rouletteWin: cc.AudioClip = null;
  @property(cc.AudioClip)
  private bigWin: cc.AudioClip = null;
  @property(cc.AudioClip)
  private megaWin: cc.AudioClip = null;
  @property(cc.AudioClip)
  private superWin: cc.AudioClip = null;
  @property(cc.AudioClip)
  public longWin: cc.AudioClip = null;
  @property(cc.AudioClip)
  private scatter4sec: cc.AudioClip = null;

  @property(cc.AudioClip)
  private frameFeatureOne: cc.AudioClip[] = [];
  @property(cc.AudioClip)
  private frameFeatureTwo: cc.AudioClip[] = [];
  @property(cc.AudioClip)
  private frameFeatureThree: cc.AudioClip[] = [];
  @property(cc.AudioClip)
  private frameFeatureFour: cc.AudioClip[] = [];
  @property(cc.AudioClip)
  private scatterAppear: cc.AudioClip[] = [];

  private _audioId: number = -1;
  private _fxId: number = -1;
  private _sfxId: number = -1;
  private _volume: number = 1;
  private musicStatus: boolean = true;
  private scatterCount: number = 0;
  onLoad() {
    VanessaSoundController.instance = this;
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
        case SLOT_SOUND_TYPE.LEADER_START_CHANGE:
          audioClip = this.leaderStartChange;
          break;
        case SLOT_SOUND_TYPE.LEADER_DONE_CHANGE:
          audioClip = this.leaderDoneChange;
          break;
        case SLOT_SOUND_TYPE.STOP_SPIN:
          audioClip = this.spinEnd;
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
          break;
        case SLOT_SOUND_TYPE.LEADER_FREE_START_SPIN:
          audioClip = this.leaderFreeStartSpin;
          break;
        case SLOT_SOUND_TYPE.LEADER_FREE_WIN:
          audioClip = this.leaderFreeWin;
          break;
        case SLOT_SOUND_TYPE.ROULETTE_WIN:
          audioClip = this.rouletteWin;
          break;
        case SLOT_SOUND_TYPE.SCATTER_4_SEC:
          audioClip = this.scatter4sec;
          break;
        case SLOT_SOUND_TYPE.SWORD_ATTACK:
          audioClip = this.swordAttack;
          break;
        case SLOT_SOUND_TYPE.WHIP_ATTACK:
          audioClip = this.whipAttack;
          break;
        case SLOT_SOUND_TYPE.FRAME_ONE:
          switch (VanessaMain.instance.powerFeature) {
            case 1:
              audioClip = this.frameFeatureOne[0];
              break;
            case 2:
              audioClip = this.frameFeatureOne[1];
              break;
            case 3:
              audioClip = this.frameFeatureOne[2];
              break;
          }
          break;
        case SLOT_SOUND_TYPE.FRAME_TWO:
          switch (VanessaMain.instance.powerFeature) {
            case 1:
              audioClip = this.frameFeatureTwo[0];
              break;
            case 2:
              audioClip = this.frameFeatureTwo[1];
              break;
            case 3:
              audioClip = this.frameFeatureTwo[2];
              break;
          }
          break;
        case SLOT_SOUND_TYPE.FRAME_THREE:
          switch (VanessaMain.instance.powerFeature) {
            case 1:
              audioClip = this.frameFeatureThree[0];
              break;
            case 2:
              audioClip = this.frameFeatureThree[1];
              break;
            case 3:
              audioClip = this.frameFeatureThree[2];
              break;
          }
          break;
        case SLOT_SOUND_TYPE.FRAME_FOUR:
          switch (VanessaMain.instance.powerFeature) {
            case 1:
              audioClip = this.frameFeatureFour[0];
              break;
            case 2:
              audioClip = this.frameFeatureFour[2];
              break;
            case 3:
              audioClip = this.frameFeatureFour[2];
              break;
          }
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
    cc.audioEngine.play(audioClipScatter, false, this._volume);
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

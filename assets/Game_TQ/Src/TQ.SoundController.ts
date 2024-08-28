import TQMain from "./TQ.Controller";

const { ccclass, property } = cc._decorator;

export enum SLOT_SOUND_TYPE {
  BACKGROUND = 0,
  START_SPIN = 1,
  BTN_CLICK = 2,
  TRANSITION_TROLLEY = 3,
  STOP_SPIN = 4,
  LEADER_START_SPIN = 5,
  LEADER_TRANSITION = 6,
  LEADER_WIN = 7,
  LIGHT_EFFECT = 8,
  BACKGROUND_FREE = 9,
  SMALL_WIN = 10,
  COIN_COUNT_UP = 11,
  LEADER_SPECIAL_WILD = 12,
  BIG_WIN = 13,
  MEGA_WIN = 14,
  SUPER_WIN = 15,
  SPECIAL_WILD_ACTIVE = 16,
  SPECIAL_WILD_APPEAR = 17,
  LEADER_FREE_START_SPIN = 18,
  LEADER_FREE_WIN = 19,
  LONG_WIN = 20,
}

@ccclass
export default class TQSoundController extends cc.Component {
  public static instance: TQSoundController = null;
  //TODO: THIẾU AUDIO BIG WIN

  @property(cc.AudioClip)
  public zhugeBGM: cc.AudioClip = null;
  @property(cc.AudioClip)
  public guanBGM: cc.AudioClip = null;
  @property(cc.AudioClip)
  public zhangBGM: cc.AudioClip = null;
  @property(cc.AudioClip)
  public zhugeFreeBGM: cc.AudioClip = null; //TODO: CHƯA CÓ -> CẦN ĐI ĐÀO DATA
  @property(cc.AudioClip)
  public guanFreeBGM: cc.AudioClip = null;
  @property(cc.AudioClip)
  public zhangFreeBGM: cc.AudioClip = null;
  @property(cc.AudioClip)
  public leaderStartSpin: cc.AudioClip[] = [];
  @property(cc.AudioClip)
  public leaderTransition: cc.AudioClip[] = [];
  @property(cc.AudioClip)
  public leaderSpecialWild: cc.AudioClip[] = [];
  @property(cc.AudioClip)
  public leaderFreeStartSpin: cc.AudioClip = null;
  @property(cc.AudioClip)
  public leaderFreeWin: cc.AudioClip = null;
  @property(cc.AudioClip)
  public leaderWin: cc.AudioClip[] = []; //TODO: CHƯA CÓ CỦA SCENE 1 -> CẦN ĐI ĐÀO DATA
  @property(cc.AudioClip)
  public btnClick: cc.AudioClip = null;
  @property(cc.AudioClip)
  public trolley: cc.AudioClip = null;
  @property(cc.AudioClip)
  public spinStart: cc.AudioClip = null;
  @property(cc.AudioClip)
  public spinEnd: cc.AudioClip = null;
  @property(cc.AudioClip)
  public lightEffect: cc.AudioClip = null;
  @property(cc.AudioClip)
  public smallWin: cc.AudioClip = null;
  @property(cc.AudioClip)
  public coinCountUp: cc.AudioClip = null;
  @property(cc.AudioClip)
  public bigWin: cc.AudioClip = null;
  @property(cc.AudioClip)
  public megaWin: cc.AudioClip = null;
  @property(cc.AudioClip)
  public superWin: cc.AudioClip = null;
  @property(cc.AudioClip)
  public longWin: cc.AudioClip = null; // when line win has cell on all column (5 cells win)
  @property(cc.AudioClip)
  public specialWild: cc.AudioClip[] = [];
  @property(cc.AudioClip)
  public specialWildAppear: cc.AudioClip[] = [];
  @property(cc.AudioClip)
  public scatterAppear: cc.AudioClip[] = [];

  private _audioId: number = -1;
  private _fxId: number = -1;
  private _sfxId: number = -1;
  private _volume: number = 1;
  private musicStatus: boolean = true;
  private scatterCount: number = 0
  onLoad() {
    TQSoundController.instance = this;
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
    let audioClip: cc.AudioClip = null;
    switch (type) {
      case SLOT_SOUND_TYPE.BTN_CLICK:
        audioClip = this.btnClick;
        break;
      case SLOT_SOUND_TYPE.START_SPIN:
        audioClip = this.spinStart;
        this.scatterCount = 0 
        break;
      case SLOT_SOUND_TYPE.STOP_SPIN:
        audioClip = this.spinEnd;
        break;
      case SLOT_SOUND_TYPE.LEADER_START_SPIN:
        switch (TQMain.instance.slotOrientation) {
          case 1:
            audioClip = this.leaderStartSpin[0];
            break;
          case 2:
            audioClip = this.leaderStartSpin[1];
            break;
          case 3:
            audioClip = this.leaderStartSpin[2];
            break;
        }
        break;
      case SLOT_SOUND_TYPE.LEADER_TRANSITION:
        switch (TQMain.instance.slotOrientation) {
          case 1:
            audioClip = this.leaderTransition[0];
            break;
          case 2:
            audioClip = this.leaderTransition[1];
            break;
          case 3:
            audioClip = this.leaderTransition[2];
            break;
        }
        break;
      case SLOT_SOUND_TYPE.LEADER_WIN:
        switch (TQMain.instance.slotOrientation) {
          case 1:
            audioClip = this.leaderWin[2]; //TODO: TẠM THỜI DO CHƯA ĐÀO ĐƯỢC NHẠC
            break;
          case 2:
            audioClip = this.leaderWin[1];
            break;
          case 3:
            audioClip = this.leaderWin[2];
            break;
        }
        break;
      case SLOT_SOUND_TYPE.LEADER_SPECIAL_WILD:
        switch (TQMain.instance.slotOrientation) {
          case 1:
            audioClip = this.leaderSpecialWild[0];
            break;
          case 2:
            audioClip = this.leaderSpecialWild[1];
            break;
          case 3:
            audioClip = this.leaderSpecialWild[2];
            break;
        }
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
      case SLOT_SOUND_TYPE.SPECIAL_WILD_ACTIVE:
        switch (TQMain.instance.slotOrientation) {
          case 1:
            audioClip = this.specialWild[0];
            break;
          case 2:
            audioClip = this.specialWild[1];
            break;
          case 3:
            audioClip = this.specialWild[2];
            break;
        }
        break;
      case SLOT_SOUND_TYPE.SPECIAL_WILD_APPEAR:
        switch (TQMain.instance.slotOrientation) {
          case 1:
            audioClip = this.specialWildAppear[0];
            break;
          case 2:
            audioClip = this.specialWildAppear[0];
            break;
          case 3:
            audioClip = this.specialWildAppear[1];
            break;
        }
        break;
      case SLOT_SOUND_TYPE.LEADER_FREE_START_SPIN:
        audioClip = this.leaderFreeStartSpin;
        break;
      case SLOT_SOUND_TYPE.LEADER_FREE_WIN:
        audioClip = this.leaderFreeWin;
        break;
    }
    if (audioClip && this.musicStatus) {
      this.playActionMusic(audioClip);
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
    this.scatterCount += 1
    let audioClipScatter
    switch (Number(this.scatterCount)) {
      case 1:
        audioClipScatter = this.scatterAppear[0]
        break;
      case 2:
        audioClipScatter = this.scatterAppear[1]
        break;
      case 3:
        audioClipScatter = this.scatterAppear[2]
        break;
      case 4:
        audioClipScatter = this.scatterAppear[2]
        break;
      case 5:
        audioClipScatter = this.scatterAppear[2]
        break;
    }
    cc.audioEngine.play(audioClipScatter, false, this._volume)
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

const { ccclass, property } = cc._decorator;

export enum BC_SOUND_TYPE {
    BACKGROUND = 0,
    START_NEW_GAME = 1,
    OPEN_BOWL = 2,
    SHAKE_BOWL = 3,
    TIME_LIMIT = 4,
    TIME_END = 5,
    LOSER = 6,
    WINNER = 7,
    CHIP_BET = 8,
    CHIP_MOVE_TABLE = 9,
    CHIP_MOVE_DEALER = 10,
    BTN_CLICK = 11
}

@ccclass
export default class BCSoundControler extends cc.Component {
    public static instance: BCSoundControler = null;

    @property(cc.AudioClip)
    public voiceStartNewGame: cc.AudioClip = null;

    @property(cc.AudioClip)
    public openBowl: cc.AudioClip = null;

    @property(cc.AudioClip)
    public shakeBowl: cc.AudioClip = null;

    @property(cc.AudioClip)
    public timeLimit: cc.AudioClip = null;

    @property(cc.AudioClip)
    public timeEnd: cc.AudioClip = null;

    @property(cc.AudioClip)
    public loser: cc.AudioClip = null;

    @property(cc.AudioClip)
    public winner: cc.AudioClip = null;

    @property(cc.AudioClip)
    public chipBet: cc.AudioClip = null;

    @property(cc.AudioClip)
    public chipMoveTable: cc.AudioClip = null;

    @property(cc.AudioClip)
    public chipMoveDealer: cc.AudioClip = null;

    @property(cc.AudioClip)
    public backgroundAudio: cc.AudioClip = null;

    @property(cc.AudioClip)
    public btnClick: cc.AudioClip = null;

    private _volume: number = 1;
    private isStopMusic: boolean = false;

    onLoad() {
        BCSoundControler.instance = this;
    }

    start() {
        BCSoundControler.instance = this;
    }

    public playBackgroundAudio() {
        this.isStopMusic = false;
        cc.audioEngine.stopMusic();
        cc.audioEngine.stopAll();
        cc.audioEngine.uncacheAll();
        this.setSystemVolume(this._volume);
        cc.audioEngine.play(this.backgroundAudio, true, this._volume);
    }

    private setSystemVolume(volume: number) {
        this._volume = volume;
        cc.audioEngine.setEffectsVolume(this._volume)
        cc.audioEngine.setMusicVolume(this._volume);
    }

    public playSoundByType(type: number) {
        let audioClip: cc.AudioClip = null;
        switch (type) {
            case BC_SOUND_TYPE.START_NEW_GAME:
                audioClip = this.voiceStartNewGame;
                break;

            case BC_SOUND_TYPE.OPEN_BOWL:
                audioClip = this.openBowl;
                break;

            case BC_SOUND_TYPE.SHAKE_BOWL:
                audioClip = this.shakeBowl;
                break;

            case BC_SOUND_TYPE.TIME_LIMIT:
                audioClip = this.timeLimit;
                break;

            case BC_SOUND_TYPE.TIME_END:
                audioClip = this.timeEnd;
                break;

            case BC_SOUND_TYPE.LOSER:
                audioClip = this.loser;
                break;

            case BC_SOUND_TYPE.WINNER:
                audioClip = this.winner;
                break;

            case BC_SOUND_TYPE.CHIP_BET:
                audioClip = this.chipBet;
                break;

            case BC_SOUND_TYPE.CHIP_MOVE_TABLE:
                audioClip = this.chipMoveTable;
                break;

            case BC_SOUND_TYPE.CHIP_MOVE_DEALER:
                audioClip = this.chipMoveDealer;
                break;

            case BC_SOUND_TYPE.BTN_CLICK:
                audioClip = this.btnClick;
                break;
        }

        if (audioClip instanceof cc.AudioClip) {
            cc.audioEngine.play(audioClip, false, this._volume);
        }
    }

    public onOffMusic(isOn: boolean) {
        this.isStopMusic = !isOn;
        this._volume = (isOn)? 1: 0;
        this.setSystemVolume(this._volume);
        if (!isOn) {
            cc.audioEngine.stopAll();
            cc.audioEngine.uncacheAll();
            cc.audioEngine.stopMusic();
        } else {
            this.playBackgroundAudio();
        }
    }
}

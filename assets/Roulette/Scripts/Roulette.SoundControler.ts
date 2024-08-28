
const { ccclass, property } = cc._decorator;

export enum RLT_SOUND_TYPE {
    BACKGROUND = 0,
    START_NEW_GAME = 1,
    SPIN_ROULETTE = 3,
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
export default class RLTSoundControler extends cc.Component {
    public static instance: RLTSoundControler = null;

    @property(cc.AudioClip)
    public voiceStartNewGame: cc.AudioClip = null;

    @property(cc.AudioClip)
    public spinRoulette: cc.AudioClip = null;

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
    public btnClick: cc.AudioClip = null;

    private _audioId: number = -1;
    private _volume: number = 1;

    private musicStatus: boolean = true;

    start() {
        RLTSoundControler.instance = this;
    }


    public init() {
        this.setSystemVolume(0.5);
    }


    public getSystemVolume() {
        return this._volume;
    }

    public setSystemVolume(volume: number) {
        this._volume = volume;
    }

    public playType(type: number) {
        let audioClip: cc.AudioClip = null;
        switch (type) {
            case RLT_SOUND_TYPE.BACKGROUND:
                ////
                break;
            case RLT_SOUND_TYPE.START_NEW_GAME:
                audioClip = this.voiceStartNewGame;
                break;
            case RLT_SOUND_TYPE.SPIN_ROULETTE:
                audioClip = this.spinRoulette;
                break;
            case RLT_SOUND_TYPE.TIME_LIMIT:
                audioClip = this.timeLimit;
                break;
            case RLT_SOUND_TYPE.TIME_END:
                audioClip = this.timeEnd;
                break;
            case RLT_SOUND_TYPE.LOSER:
                audioClip = this.loser;
                break;
            case RLT_SOUND_TYPE.WINNER:
                audioClip = this.winner;
                break;
            case RLT_SOUND_TYPE.CHIP_BET:
                audioClip = this.chipBet;
                break;
            case RLT_SOUND_TYPE.CHIP_MOVE_TABLE:
                audioClip = this.chipMoveTable;
                break;
            case RLT_SOUND_TYPE.CHIP_MOVE_DEALER:
                audioClip = this.chipMoveDealer;
                break;
            case RLT_SOUND_TYPE.BTN_CLICK:
                audioClip = this.btnClick;
                break;
        }
        if (audioClip && this.musicStatus) {
            this.playActionMusic(audioClip);
        }
    }

    private playActionMusic(audioClip: cc.AudioClip) {
        cc.audioEngine.play(audioClip, false, this._volume);
    }

    public playRouletteMusic(audioClip: cc.AudioClip) {
        this._audioId = cc.audioEngine.play(audioClip, true, this._volume);
    }

    public setMusicStatus(status: boolean){
        this.musicStatus = status;
    }

    public getMusicStatus(){
        return this.musicStatus;
    }

    public stopAll() {
        cc.audioEngine.stopAll();
    }
}

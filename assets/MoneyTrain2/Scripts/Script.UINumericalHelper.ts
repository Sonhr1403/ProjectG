
const { ccclass, property } = cc._decorator;

@ccclass
export default class MoneyTrain2NumericalHelper extends cc.Component {
    public static instance: MoneyTrain2NumericalHelper = null;
    public static scheduleForLabel(label: cc.Label, data: number, duration: number = 0.5, proto: string = "%s") {
        let comp = label.node.getComponent(MoneyTrain2NumericalHelper);
        if (!comp) {
            comp = label.node.addComponent(MoneyTrain2NumericalHelper);
            comp.protoString = proto;
        }
        comp.scheduleProgress(data, duration);
    }

    public get label(): cc.Label {
        if (!this._label) {
            this._label = this.node.getComponent(cc.Label);
        }
        return this._label;
    }
    private _label: cc.Label = null;

    public get data(): number {
        return this._data;
    }

    public set data(value: number) {
        this._data = value;
    }
    private _data: number = 0;
    private _delta: number = 0;
    private _start: number = 0;
    private _duration: number = 0;

    private _elapsed: number = 0;

    private _progressing: boolean = false;

    public get protoString(): string {
        return this._protoString;
    }

    public set protoString(value: string) {
        this._protoString = value;
    }
    private _protoString: string = "%s";

    onLoad() {
        MoneyTrain2NumericalHelper.instance = this;
        if (!this.label) {
            throw "You must add cc.Label component to use this helper";
        }
    }

    start() {
        if (this.label) {
            this.label.string = this.formatNumber(this._data);
        }
    }

    onDisable() {
        this._progressing = false;
        this.unscheduleAllCallbacks();
    }

    scheduleProgress(number: number, duration: number = 0.5) {
        this._data = 0;
        this._delta = 0;
        this._start = 0;
        this._duration = 0;
        this._elapsed = 0;
        if (number == null || number == undefined || typeof number != "number" || (!this._progressing && this._data == number)) return;
        if (duration > 0) {
            this._elapsed = 0;
            this._duration = duration;
            this._progressing = true;
            this._start = this._data;
            this._delta = number - this._start;

            this.unscheduleAllCallbacks();
            this.schedule(this.updateLabel, 0);
        } else {
            this._elapsed = 0;
            this._duration = 0;
            this._progressing = false;
            this._start = this._data;
            this._delta = number - this._start;
            this._data = number;
            this.unscheduleAllCallbacks();
            if (this._label) {
                this._label.string = this._protoString.replace(/%s/, this.formatNumber(this._data));
            }
        }

    }

    formatNumber(num: number, digits: number = 0): string {
        if (num == 0)
            return "0";
        if (digits != 0) {
            return num.toFixed(digits).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        }
        return num.toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    updateLabel(dt: number) {
        if (this._progressing) {
            this._elapsed += dt;
            let r = Math.min(1, this._elapsed / this._duration);
            this._data = this._start + this._delta * Math.pow(r, 1 / 5);
            if (r == 1) {
                this._data = this._start + this._delta;
                this._progressing = false;
                this.unscheduleAllCallbacks();
            }
            if (this._label) {
                this._label.string = this._protoString.replace(/%s/, this.formatNumber(this._data));
            }
        }
    }
}

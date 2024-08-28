const { ccclass, property } = cc._decorator;

@ccclass
export default class BOOGYIChip extends cc.Component {

    @property(cc.Label)
    public label: cc.Label = null;

    @property(cc.Sprite)
    public sprChip: Array<cc.Sprite> = [];

    public init(money:any): void {
        if (money) {
            this.label.string = this.convert2Label(money);
        } else {
            this.label.string = "";
        }
    }

    public convert2Label(num): any {
        let data = num;
        let returnKey = '';

        if ((data / 1000) >= 1) {
            data = data / 1000
            returnKey = "K";
            if ((data / 1000) >= 1) {
                data = data / 1000
                returnKey = "M";
                if ((data / 1000) >= 1) {
                    data = data / 1000
                    returnKey = "B";
                    if ((data / 1000) >= 1) {
                        data = data / 1000
                        returnKey = "T";
                    }
                }
            }
        }

        if (!this.isInt(data)) {
            if (data > 100) {
                data = data.toFixed(1)
            } else if (data > 10) {
                data = data.toFixed(2)
            } else {
                data = data.toFixed(2);
            }
        }
        return data + returnKey;
    }

    public isInt(num): boolean {
        return num % 1 === 0;
    }

}

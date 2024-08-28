const { ccclass, property } = cc._decorator;

@ccclass
export default class Chip extends cc.Component {

    @property(cc.Label)
    public label: cc.Label = null;

    @property(cc.Sprite)
    public sprChip: cc.Sprite = null

    @property(cc.SpriteAtlas)
    public spriteAtlasChip: cc.SpriteAtlas = null;

    public init(money: any): void {
        if (money) {
            this.label.string = this.convert2Label(money);
            let strImage = this.getSpriteFrame(money);
            this.sprChip.spriteFrame = this.spriteAtlasChip.getSpriteFrame(strImage);
        } else {
            this.label.string = "";
        }
    }

    private getSpriteFrame(num): string {
        let strChip = "ske_chip_xanhdt";
        let strNum = num.toString()
        if (strNum.indexOf("1") >= 0) {
            strChip = "ske_chip_cam";
        }
        if (strNum.indexOf("2") >= 0) {
            strChip = "ske_chip_tim";
        }
        if (strNum.indexOf("5") >= 0) {
            strChip = "ske_chip_vang";
        }
        return strChip;
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

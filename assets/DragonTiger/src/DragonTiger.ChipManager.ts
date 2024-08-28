import DragonTiger_Chip from "./DragonTiger.Chip";
import { DragonTiger_Const } from "./DragonTiger.Const";
import DragonTiger_GameManager from "./DragonTiger.GameManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DragonTiger_ChipManager extends cc.Component {

    @property(cc.SpriteFrame)
    spfChip: cc.SpriteFrame[] = [];

    @property(cc.Prefab)
    prfChip: cc.Prefab = null;

    private _pool: cc.NodePool = new cc.NodePool();
    private _listChip: Array<cc.Node> = [];
    private _listMyChip: Array<cc.Node> = [];

    lsPosBet = [cc.v2(-350, 50), cc.v2(350, 50), cc.v2(500, -210), cc.v2(0, -210), cc.v2(-500, -210)]
    totalChipBet = [0, 0, 0, 0, 0]
    chipMyBet = [0, 0, 0, 0, 0]

    getTotalMyBet() {
        let total = 0;
        for (let t of this.chipMyBet)
            total += t;

        return total;
    }

    getChipIdxByAmount(chipAmout: number): number {
        return DragonTiger_Const.CHIP_AMOUNT.indexOf(chipAmout);

    }

    public getChip(): cc.Node {
        let nodeChip: cc.Node = null;

        if (this._pool.size() > 0) {
            nodeChip = this._pool.get();
        } else {
            nodeChip = cc.instantiate(this.prfChip);
        }
        return nodeChip;
    }

    private putChip(nodeChip: cc.Node) {
        if (!nodeChip) {
            BGUI.ZLog.error("nodeChip is null");
            return;
        }
        this._pool.put(nodeChip);
        BGUI.ZLog.log("this.putChip.size() ====" + this._pool.size());
    }

    addChip(idxChip: number, typePot: number, playerBet = '', parent: cc.Node = this.node || cc.Canvas.instance.node): DragonTiger_Chip {
        let nodeChip: cc.Node = this.getChip();
        nodeChip.parent = parent;
        nodeChip.scale = nodeChip.scale;
        nodeChip.opacity = 255;
        nodeChip.zIndex = 99;
        let chip = nodeChip.getComponent(DragonTiger_Chip);
        chip.setData(idxChip, typePot);

        this._listChip.push(nodeChip);

        if (playerBet === BGUI.UserManager.instance.mainUserInfo.nickname)
            this._listMyChip.push(chip.node)

        // console.log(this.arrChip)
        return chip;
    }

    unBetChip() {
        for (let id = 0; id < this._listMyChip.length; id++) {
            let chip = this._listMyChip[id].getComponent(DragonTiger_Chip);

            let posTo = DragonTiger_GameManager.instance.playerManager.listPlayer[0].node.getPosition();
            let posFrom = chip.node.getPosition();

            chip.node.setPosition(posFrom);
            chip.actionMoveChipToSlot(posFrom, posTo);
        }
    }

    genChipValue(value) {
        let arrChip = []
        let chip = value

        if (chip <= 0)
            return arrChip

        while (chip > 0) {
            for (let i = DragonTiger_Const.CHIP_AMOUNT.length - 1; i >= 0; i--) {
                if (chip >= DragonTiger_Const.CHIP_AMOUNT[i]) {
                    chip -= DragonTiger_Const.CHIP_AMOUNT[i]
                    arrChip.push(DragonTiger_Const.CHIP_AMOUNT[i])
                    break;
                }
            }
        }

        return arrChip;
    }

    chipReconnect(listTotalBet, listMyBet) {
        this.cleanUP();
        this.totalChipBet = listTotalBet
        this.chipMyBet = listMyBet

        for (let idPot = 0; idPot < this.totalChipBet.length; idPot++) {
            let chip = this.totalChipBet[idPot];
            DragonTiger_GameManager.instance.potOnTableManager.showTotalBet(idPot, chip);
            let arr = this.genChipValue(chip);

            for (let i = 0; i < arr.length; i++) {
                let amountBet = arr[i]
                let chipIdx = this.getChipIdxByAmount(amountBet)

                let posTo = this.lsPosBet[idPot].clone();
                if (idPot < 2) {
                    posTo.x += (Math.round(Math.random()) * 2 - 1) * Math.floor(Math.random() * 200)
                    posTo.y += (Math.round(Math.random()) * 2 - 1) * Math.floor(Math.random() * 50)
                }
                else {
                    posTo.x += (Math.round(Math.random()) * 2 - 1) * Math.floor(Math.random() * 100)
                    posTo.y += (Math.round(Math.random()) * 2 - 1) * Math.floor(Math.random() * 50)
                }

                this.totalChipBet[idPot] += amountBet
                let chip = this.addChip(chipIdx, idPot)
                chip.node.setPosition(posTo);
            }
        }

        for (let idPot = 0; idPot < this.chipMyBet.length; idPot++) {
            let chip = this.chipMyBet[idPot];
            DragonTiger_GameManager.instance.potOnTableManager.showMyBet(idPot, chip);
            let arr = this.genChipValue(chip);

            for (let i = 0; i < arr.length; i++) {
                let amountBet = arr[i]
                let chipIdx = this.getChipIdxByAmount(amountBet)

                let posTo = this.lsPosBet[idPot].clone();
                if (idPot < 2) {
                    posTo.x += (Math.round(Math.random()) * 2 - 1) * Math.floor(Math.random() * 200)
                    posTo.y += (Math.round(Math.random()) * 2 - 1) * Math.floor(Math.random() * 50)
                }
                else {
                    posTo.x += (Math.round(Math.random()) * 2 - 1) * Math.floor(Math.random() * 100)
                    posTo.y += (Math.round(Math.random()) * 2 - 1) * Math.floor(Math.random() * 50)
                }

                this.chipMyBet[idPot] += amountBet
                let chip = this.addChip(chipIdx, idPot, BGUI.UserManager.instance.mainUserInfo.nickname)
                chip.node.setPosition(posTo);
            }
        }
    }

    /**
     * 
     * @param idxSlot -> index của người chơi
     * @param idxChip -> tiền trong
     * @param typePot -> cửa bet 
     * @param idPot -> vị trí cột trong phần bet
     * @param from 
     * @param to 
     */

    moveToPotBet(idxChip: number, typePot: number, from: cc.Vec2, to: cc.Vec2, playerBet = '') {
        // this.addChip(idx, amount, typePot).moveToPos(from, to);
        let chip = this.addChip(idxChip, typePot, playerBet)
        chip.moveToPos(from, to)


    }

    moveToPotWin(idxChip: number, typePot: number, from: cc.Vec2, to: cc.Vec2) {
        // this.addChip(idx, amount, typePot).moveToPos(from, to);
        this.addChip(idxChip, typePot).moveToPotWin(from, to)
    }

    getAllChip(): Array<cc.Node> {
        return this._listChip;
    }

    isChipWin(listResult: Array<string>, item: cc.Node) {
        var idx = item.getComponent(DragonTiger_Chip).getTypePot();
        return listResult.includes(idx.toString());
    }

    getChipWin(listResult: Array<string>): Array<cc.Node> {
        return this._listChip.filter(this.isChipWin.bind(null, listResult));
    }

    isChipLose(listResult: Array<string>, item: cc.Node) {
        var idx = item.getComponent(DragonTiger_Chip).getTypePot();
        return !listResult.includes(idx.toString());
    }

    getChipLose(listResult: Array<string>): Array<cc.Node> {
        return this._listChip.filter(this.isChipLose.bind(null, listResult));
    }

    getChipWinOnSlot(arr1: Array<cc.Node>, arr2: Array<string>) {
        return arr1.filter(this.isChipWinOnSlot.bind(null, arr2));
    }

    isChipWinOnSlot(listResult: Array<string>, item: cc.Node) {
        var idx = item.getComponent(DragonTiger_Chip).getTypePot();
        return listResult.includes(idx.toString());
    }


    cleanUP() {
        //clear list chip node
        if (this._listChip.length > 0) {
            this._listChip.forEach(function (chip: cc.Node) {
                return chip.removeFromParent();
            });
        }

        for (var i = 0; i < this._listChip.length; i++) {
            this._listChip.splice(i, this._listChip.length);
        }
        this._listChip = [];

        this.totalChipBet = [0, 0, 0, 0, 0];
        this.chipMyBet = [0, 0, 0, 0, 0];

        //clear pool
        if (this._pool.size() > 0) {
            this._pool.clear();
        }
    }
}

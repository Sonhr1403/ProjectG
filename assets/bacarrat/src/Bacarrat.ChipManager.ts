import Bacarrat_Chip from "./Bacarrat.Chip";
import { Bacarrat_Const } from "./Bacarrat.Const";
import Bacarrat_GameManager from "./Bacarrat.GameManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Bacarrat_ChipManager extends cc.Component {

    @property(cc.SpriteFrame)
    spfChip: Array<cc.SpriteFrame> = [];

    private _pool: cc.NodePool = new cc.NodePool();
    private _listChip: Array<cc.Node> = [];
    @property(cc.Prefab)
    prfChip: cc.Prefab = null;

    lsPosBet = [
        [cc.v2(-625, -100), cc.v2(-580, -100), cc.v2(-535, -100), cc.v2(-490, -100)], //player
        [cc.v2(625, -100), cc.v2(580, -100), cc.v2(535, -100), cc.v2(490, -100)], //banker
        [cc.v2(-110, -150), cc.v2(110, -150)],
        [cc.v2(-230, -150)],
        [cc.v2(230, -150)],
        [cc.v2(-180, -340), cc.v2(180, -340)]
    ]

    arrChip = [
        [[], [], [], []],
        [[], [], [], []],
        [[], []],
        [[]],
        [[]],
        [[], []]
    ]

    arrBet = [
        [[], [], [], []],
        [[], [], [], []],
        [[], []],
        [[]],
        [[]],
        [[], []]
    ]

    totalBet = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0],
        [0],
        [0],
        [0, 0]
    ]

    mergeChip() {
        return;
        let arrBetClone = [...this.arrBet]
        let arrTotalBet = [...this.totalBet]

        for (let gate = 0; gate < arrTotalBet.length; gate++) {
            arrBetClone[gate] = []
            for (let id = 0; id < arrTotalBet[gate].length; id++) {
                let chip = arrTotalBet[gate][id];
                let arr = []
                while (chip > 0) {
                    for (let i = Bacarrat_Const.CHIP_AMOUNT.length - 1; i >= 0; i--) {
                        if (chip >= Bacarrat_Const.CHIP_AMOUNT[i]) {
                            chip -= Bacarrat_Const.CHIP_AMOUNT[i]
                            arr.push(Bacarrat_Const.CHIP_AMOUNT[i])
                            break;
                        }
                    }
                }
                arrBetClone[gate].push(arr)
            }
        }
        // BGUI.ZLog.log("arrBet = ", this.arrBet)
        // BGUI.ZLog.log("totalBet = ", this.totalBet)
        // BGUI.ZLog.log("arrChip = ", this.arrChip)

        for (let gate = 0; gate < this.arrChip.length; gate++) {
            for (let id = 0; id < this.arrChip[gate].length; id++) {
                for (let i = 0; i < arrBetClone[gate][id].length; i++) {
                    // BGUI.ZLog.log(this.arrChip[gate][id][i]);
                    let chip: Bacarrat_Chip = this.arrChip[gate][id][i].getComponent(Bacarrat_Chip)
                    let idChip = Bacarrat_Const.CHIP_AMOUNT.indexOf(arrBetClone[gate][id][i])
                    chip.setData(chip.getIdxSlot(), idChip, chip.getTypePot(), chip.getIdPos());
                }

                let ix = arrBetClone[gate][id].length
                while (ix < this.arrChip[gate][id].length) {
                    let idC = this._listChip.indexOf(this.arrChip[gate][id][ix])
                    this.arrChip[gate][id][ix].getComponent(Bacarrat_Chip).destroyChip();
                    this.arrChip[gate][id].splice(ix, 1);
                    this._listChip.splice(idC, 1)
                }
            }
        }

        this.arrBet = [...arrBetClone]
    }

    getTotalBetAllUser(idPot: number): number {
        //     BGUI.ZLog.log('getTotalBetAllUser idPot--> ', idPot);
        //  BGUI.ZLog.log('getTotalBetAllUser _listChip--> ', this._listChip);
        let getAllChipByIdPot: Array<cc.Node> = this._listChip.filter(e => {
            if (e) {
                let comp = e.getComponent(Bacarrat_Chip)
                let pot = comp.getTypePot();
                return pot == idPot;
            }
        })

        //   BGUI.ZLog.log('getTotalBetAllUser getAllChipByIdPot--> ', getAllChipByIdPot);

        let totalGoldByPot = 0;
        getAllChipByIdPot.forEach((e => {
            if (e) {
                let amount = e.getComponent(Bacarrat_Chip).getAmountChip();
                totalGoldByPot += amount;
            }
        }))

        return totalGoldByPot;
    }

    getTotalBetBySlotIdx(idxSlot: number, idPot: number): number {
        //lấy tất cả đống chip của slot đặt vào cửa
        let getAllChipBySlot: Array<cc.Node> = this._listChip.filter(e => {
            if (e) {
                let comp = e.getComponent(Bacarrat_Chip)
                let _slotIdx = comp.getIdxSlot();
                return idxSlot == _slotIdx;
            }
        })
        //lấy tất cả chip theo pot của slot đó đặt
        let getChipByPot: Array<cc.Node> = getAllChipBySlot.filter(e => {
            if (e) {
                let comp = e.getComponent(Bacarrat_Chip)
                let pot = comp.getTypePot();
                return pot == idPot;
            }
        })

        //   BGUI.ZLog.log('getTotalBetAllUser getAllChipByIdPot--> ', getAllChipByIdPot);

        let totalGoldByPot = 0;
        getChipByPot.forEach((e => {
            if (e) {
                let amount = e.getComponent(Bacarrat_Chip).getAmountChip();
                totalGoldByPot += amount;
            }
        }))

        return totalGoldByPot
    }

    updateViewChip() {

        for (let gate = 0; gate < this.arrChip.length; gate++) {
            for (let idxPot = 0; idxPot < this.arrChip[gate].length; idxPot++) {
                let arrClone = [...this.arrChip[gate][idxPot]]

                if (arrClone.length > 10) {
                    let startPos = arrClone.length - 10;

                    for (let i = 0; i < startPos; i++) {
                        this.arrChip[gate][idxPot][i].active = false;
                    }

                    let id = 0;
                    for (let i = startPos; i < arrClone.length; i++) {
                        this.arrChip[gate][idxPot][i].stopAllActions();
                        this.arrChip[gate][idxPot][i].y = this.lsPosBet[gate][idxPot].clone().y + 4 * id;
                        this.arrChip[gate][idxPot][i].x = this.lsPosBet[gate][idxPot].clone().x;
                        
                        id++;
                    }
                }
            }
        }
    }

    resetArrData() {

        for (let gate = 0; gate < this.arrChip.length; gate++) {
            for (let id = 0; id < this.arrChip[gate].length; id++) {
                for (let i = 0; i < this.arrChip[gate][id].length; i++) {
                    let chip = this.arrChip[gate][id][i];
                    if (chip) {
                        chip.removeFromParent(true);
                    }

                }
            }
        }

        this.arrChip = [
            [[], [], [], []],
            [[], [], [], []],
            [[], []],
            [[]],
            [[]],
            [[], []]
        ]
    }

    getChipIdxByAmount(chipAmout: number): number {
        return Bacarrat_Const.CHIP_AMOUNT.indexOf(chipAmout);

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

    public addChip(idx: number, idxChip: number, typePot: number, idPot: number, parent: cc.Node = this.node || cc.Canvas.instance.node): Bacarrat_Chip {
        let nodeChip: cc.Node = this.getChip();
        nodeChip.parent = parent;
        nodeChip.scale = nodeChip.scale;
        nodeChip.opacity = 255;
        nodeChip.zIndex = 99;
        let chip = nodeChip.getComponent(Bacarrat_Chip);
        chip.setData(idx, idxChip, typePot, idPot);

        this.arrChip[typePot][idPot].push(nodeChip)
        this._listChip.push(nodeChip);

        // BGUI.ZLog.log(this.arrChip)
        return chip;
    }

    chipReconnect(listPlayer) {
        for (let pl of listPlayer) {
            // BGUI.ZLog.log('pl  ---- ', pl)
            if (pl.listChipPot) {
                for (let pot = 0; pot < pl.listChipPot[0].length; pot++) {
                    let dataChip = pl.listChipPot[0][pot];
                    // BGUI.ZLog.log('dataChip = ', dataChip)
                    for (let id = 0; id < dataChip.length; id++) {
                        let rdPotBet = pot;
                        let amountBet = dataChip[id]
                        let playerBet = pl.nickName;

                        let idColumOfPot = BGUI.Utils.randomInt(0, Bacarrat_GameManager.instance.chipManager.lsPosBet[rdPotBet].length - 1);
                        let chipIdx = this.getChipIdxByAmount(amountBet)
                        let rdSlotIdx = Bacarrat_GameManager.instance.playerManager.getSlotIdxByNickName(playerBet);

                        let posTo = Bacarrat_GameManager.instance.chipManager.lsPosBet[rdPotBet][idColumOfPot].clone();
                        posTo.y += 4 * Math.min(Bacarrat_GameManager.instance.chipManager.arrChip[rdPotBet][idColumOfPot].length, 9)

                        let chip = this.addChip(rdSlotIdx, chipIdx, rdPotBet, idColumOfPot)
                        chip.node.setPosition(posTo);
                        this.updateViewChip();

                        let totalGoldFromPot = Bacarrat_GameManager.instance.chipManager.getTotalBetAllUser(rdPotBet)
                        Bacarrat_GameManager.instance.potOnTableManager.showTotalBet(rdPotBet, totalGoldFromPot);
                        if (playerBet === BGUI.UserManager.instance.mainUserInfo.nickname) {
                            let mySlotIdx = 0;
                            let totalMyBetByPot = Bacarrat_GameManager.instance.chipManager.getTotalBetBySlotIdx(mySlotIdx, rdPotBet)
                            Bacarrat_GameManager.instance.potOnTableManager.showMyBet(rdPotBet, totalMyBetByPot);
                        }
                    }
                }
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

    moveToPotBet(idxSlot: number, idxChip: number, typePot: number, idPot: number, from: cc.Vec2, to: cc.Vec2) {
        // this.addChip(idx, amount, typePot).moveToPos(from, to);
        this.addChip(idxSlot, idxChip, typePot, idPot).moveToPos(from, to)
    }

    moveToPotWin(idxSlot: number, idxChip: number, typePot: number, idPot: number, from: cc.Vec2, to: cc.Vec2) {
        // this.addChip(idx, amount, typePot).moveToPos(from, to);
        this.addChip(idxSlot, idxChip, typePot, idPot).moveToPotWin(from, to)
    }


    getAllChip(): Array<cc.Node> {
        return this._listChip;
    }

    isChipWin(listResult: Array<string>, item: cc.Node) {
        var idx = item.getComponent(Bacarrat_Chip).getTypePot();
        return listResult.includes(idx.toString());
    }

    getChipWin(listResult: Array<string>): Array<cc.Node> {
        return this._listChip.filter(this.isChipWin.bind(null, listResult));
    }

    isChipLose(listResult: Array<string>, item: cc.Node) {
        var idx = item.getComponent(Bacarrat_Chip).getTypePot();
        return !listResult.includes(idx.toString());
    }

    getChipLose(listResult: Array<string>): Array<cc.Node> {
        return this._listChip.filter(this.isChipLose.bind(null, listResult));
    }

    getChipWinOnSlot(arr1: Array<cc.Node>, arr2: Array<string>) {
        return arr1.filter(this.isChipWinOnSlot.bind(null, arr2));
    }

    isChipWinOnSlot(listResult: Array<string>, item: cc.Node) {
        var idx = item.getComponent(Bacarrat_Chip).getTypePot();
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


        //clear pool
        if (this._pool.size() > 0) {
            this._pool.clear();
        }

        this.resetArrData()
    }
}

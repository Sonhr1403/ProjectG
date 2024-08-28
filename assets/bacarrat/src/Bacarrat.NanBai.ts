import Bacarrat_Card from "./Bacarrat.Card";
import Bacarrat_GameManager from "./Bacarrat.GameManager";
import { SOUNDTYPE } from "./Bacarrat.SoundManager";

const TouchType = {
    Inside: 1,
    InEdge: 2,
    Outside: 3
}

const { ccclass, property } = cc._decorator;

@ccclass
export default class Bacarrat_NanBai extends cc.Component {

    @property(cc.Sprite)
    card: cc.Sprite = null
    @property(cc.Sprite)
    bgMaterialNode: cc.Sprite = null
    @property(cc.Sprite)
    zmMaterialNode: cc.Sprite = null
    @property(cc.Node)
    touchLayer: cc.Node = null

    @property(cc.Node)
    lb_time: cc.Node = null

    _bgMaterial = null
    _zmMaterial = null
    pukeDisRatio = 0.3
    touchFirstPos = null

    timeOpen = 5;
    isOpen = false;

    _vtCard: number

    start() {
        cc.dynamicAtlasManager.enabled = true;

        //     this.initData();

        //     // this.labelAngle = this.node.getChildByName("labelAngle").getComponent(cc.Label);

        this._bgMaterial = this.bgMaterialNode.getMaterials()[0];
        this._zmMaterial = this.zmMaterialNode.getMaterials()[0];


        let shadowDis = this.bgMaterialNode.node.width * this.bgMaterialNode.node.scaleX * 0.1
        this._zmMaterial.effect.setProperty('shadowDis', shadowDis);

        this.touchLayer.on(cc.Node.EventType.TOUCH_START, this.touchBegan, this);
        this.touchLayer.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.touchLayer.on(cc.Node.EventType.TOUCH_END, this.touchEnded, this)
        this.touchLayer.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnded, this)
    }

    update(dt) {
        if (this.isOpen)
            return

        if (this.timeOpen > 0) {
            this.timeOpen -= dt
            this.lb_time.getChildByName('lb_time').getComponent(cc.Label).string = Math.round(this.timeOpen) + ''
        }
        else {
            this.isOpen = true
            this.openCard()
        }
    }

    touchBegan(event) {
        let pos = event.getLocation();
        let touchTp = this.getTouchTypeByNode(pos, this.bgMaterialNode.node);

        if (touchTp == TouchType.InEdge) {
            this.touchFirstPos = pos;
        }
    }

    touchMove(event) {
        let pos = event.getLocation();

        if (this.touchFirstPos)
            this.runActionCard(this.touchFirstPos, pos);
    }

    touchEnded(event) {
        this.touchFirstPos = null;
        // this.rotateFirstPos = null;
        // this.resetPos();

        this.openCard();
    }


    getRotatePos(originPos, tagerPos, angle) {
        let val = angle / (180 / Math.PI);
        let disPos = cc.v2(tagerPos.x - originPos.x, tagerPos.y - originPos.y);
        let rPos = cc.v2(0.0, 0.0);
        rPos.x = disPos.x * Math.cos(val) - disPos.y * Math.sin(val);
        rPos.y = disPos.x * Math.sin(val) + disPos.y * Math.cos(val);
        rPos.x = rPos.x + originPos.x;
        rPos.y = rPos.y + originPos.y;
        return rPos
    }

    getTouchTypeByNode(pos, node) {

        let nodePos = node.convertToWorldSpaceAR(cc.v2(0, 0));
        let anchorX = node.anchorX;
        let anchorY = node.anchorY;
        let angle = node.angle;

        let pWidth = node.width * node.scaleX;

        let pHeight = node.height * node.scaleY;

        let disWidth = Math.max(10, pWidth * this.pukeDisRatio);

        let disHeight = Math.max(10, pHeight * this.pukeDisRatio);


        let left_up = cc.v2(-pWidth * anchorX + nodePos.x, pHeight * (1 - anchorY) + nodePos.y);

        let left_bottom = cc.v2(-pWidth * anchorX + nodePos.x, -pHeight * anchorY + nodePos.y);

        let right_bottom = cc.v2(pWidth * (1 - anchorX) + nodePos.x, -pHeight * anchorY + nodePos.y);

        let right_up = cc.v2(pWidth * (1 - anchorX) + nodePos.x, pHeight * (1 - anchorY) + nodePos.y);


        let inside_left_up = cc.v2(left_up.x + disWidth, left_up.y - disHeight);

        let inside_left_bottom = cc.v2(left_bottom.x + disWidth, left_bottom.y + disHeight);

        let inside_right_bottom = cc.v2(right_bottom.x - disWidth, right_bottom.y + disHeight);

        let inside_right_up = cc.v2(right_up.x - disWidth, right_up.y - disHeight);


        left_up = this.getRotatePos(nodePos, left_up, angle);
        left_bottom = this.getRotatePos(nodePos, left_bottom, angle);
        right_bottom = this.getRotatePos(nodePos, right_bottom, angle);
        right_up = this.getRotatePos(nodePos, right_up, angle);

        inside_left_up = this.getRotatePos(nodePos, inside_left_up, angle);
        inside_left_bottom = this.getRotatePos(nodePos, inside_left_bottom, angle);
        inside_right_bottom = this.getRotatePos(nodePos, inside_right_bottom, angle);
        inside_right_up = this.getRotatePos(nodePos, inside_right_up, angle);


        let xlist = [left_up.x, left_bottom.x, right_bottom.x, right_up.x];
        let ylist = [left_up.y, left_bottom.y, right_bottom.y, right_up.y];

        let xlistInside = [inside_left_up.x, inside_left_bottom.x, inside_right_bottom.x, inside_right_up.x];
        let ylistInside = [inside_left_up.y, inside_left_bottom.y, inside_right_bottom.y, inside_right_up.y];

        if (this.isInside(4, xlist, ylist, pos) && !this.isInside(4, xlistInside, ylistInside, pos)) {
            return TouchType.InEdge;
        } else if (this.isInside(4, xlistInside, ylistInside, pos)) {
            return TouchType.Inside;
        }
        return TouchType.Outside;
    }


    resetPos() {
        let initPos = cc.v2(0, 0);
        this._bgMaterial.effect.setProperty('firstPos', initPos);
        this._bgMaterial.effect.setProperty('secondPos', initPos);
        this._zmMaterial.effect.setProperty('firstPos', initPos);
        this._zmMaterial.effect.setProperty('secondPos', initPos);
    }


    runActionCard(firstPos, secondPos) {
        this._bgMaterial.effect.setProperty('firstPos', firstPos);
        this._bgMaterial.effect.setProperty('secondPos', secondPos);
        this._zmMaterial.effect.setProperty('firstPos', firstPos);
        this._zmMaterial.effect.setProperty('secondPos', secondPos);
    }

    isInside(posCount, xlist, ylist, pos) {
        let rbool = false;
        let j = posCount - 1;
        for (let i = 0; i < posCount; j = i++) {
            let ybool = (ylist[i] > pos.y) != (ylist[j] > pos.y);
            let xbool = pos.x < (xlist[j] - xlist[i]) * (pos.y - ylist[i]) / (ylist[j] - ylist[i]) + xlist[i];
            if (ybool && xbool) {
                rbool = !rbool
            }
        }

        return rbool;
    }

    setDataCard(vtC, data) {
        this._vtCard = vtC

        let comp = this.card.getComponent(Bacarrat_Card);
        comp.setId(data);
        comp.setSpriteCard()

        this.card.node.active = true;
        this.bgMaterialNode.node.active = true;

        this.timeOpen = 6;
        this.isOpen = false
        this.lb_time.active = true
    }

    openCard() {
        Bacarrat_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.FLIPCARDS);
        this.isOpen = true
        cc.tween(this.bgMaterialNode.node)
            .to(0.1, { opacity: 0 })
            .delay(0.2)
            .call(() => {
                Bacarrat_GameManager.instance.cardManager.moveCardNanBaiToTable(this._vtCard)
                this.node.active = false;
            })
            .start();
    }
}

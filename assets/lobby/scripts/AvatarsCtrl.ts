// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class AvatarsCtrl extends cc.Component {

    static instance: AvatarsCtrl = null;

    @property(cc.SpriteFrame)
    listSpfAvatars: Array<cc.SpriteFrame> = [];

    @property(cc.SpriteFrame)
    defaultAvatars: cc.SpriteFrame = null;
    
    onLoad(): void {
        AvatarsCtrl.instance = this;
        BGUI.ZLog.log("===========================HeaderCtrl========================================")
        BGUI.ZLog.log("===========================LOBBYCTRL========================================")
        BGUI.ZLog.log("===========================UICENTER========================================")
        BGUI.ZLog.log("===========================nJackpot========================================")
        BGUI.ZLog.log("===========================nJackpot-Left========================================")
        BGUI.ZLog.log("===========================nMinigames========================================")
        BGUI.ZLog.log("===========================nTournament========================================")
        BGUI.ZLog.log("===========================nEvent-GiftCode========================================")
        BGUI.ZLog.log("===========================nDapTrung========================================")
        BGUI.ZLog.log("===========================nFooter========================================")
        BGUI.ZLog.log("===========================nEvents========================================")
        BGUI.ZLog.log("===========================LOBBYCTRL========================================")


        
    }
}

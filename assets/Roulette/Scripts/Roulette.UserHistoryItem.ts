// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import RLTUSERHISTORY from "./Roulette.UserHistory";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RLTUSERHISTORYITEM extends cc.Component {

    private id: string = '';

    /////////////////////////////////////////////////

    public setId(id: number) {
        this.id = id.toString();
    }

    public getId(){
        return this.id;
    }

    public onClickDetail(){
        RLTUSERHISTORY.instance.showDetail(parseInt(this.id));
    }
}

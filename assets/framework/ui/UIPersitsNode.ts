
const {ccclass, property} = cc._decorator;

@ccclass
export default class UIPersitsNode extends cc.Component {



    onLoad(){
        cc.game.addPersistRootNode(this.node);
    }

  
}

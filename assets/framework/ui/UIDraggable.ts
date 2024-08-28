
const { ccclass, property } = cc._decorator;

@ccclass
export default class UIDraggable extends BGUI.UIDraggable {
    @property
    draggable: boolean = true;

    @property
    backToStartPosition: boolean = false;

    @property
    autoFitEdge: boolean = false;

}

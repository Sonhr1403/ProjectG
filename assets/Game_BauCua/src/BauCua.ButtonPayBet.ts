const { ccclass, property } = cc._decorator;

@ccclass
export default class ButtonPayBet extends cc.Component {
    @property(cc.Button)
    button: cc.Button = null;

    @property(cc.Label)
    lblTotal: cc.Label = null;

    @property(cc.Label)
    lblBeted: cc.Label = null;

    @property(cc.Node)
    overlay: cc.Node = null;

    @property(cc.Node)
    lblFactor: cc.Node = null;

    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Node)
    dia: cc.Node = null;
}
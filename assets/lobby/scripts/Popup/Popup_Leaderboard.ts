import LeaderBoardItem from "./Popup_Leaderboard_Item";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PopUp_LeaderBoard extends cc.Component {
  public static instance: PopUp_LeaderBoard = null;

  protected onLoad(): void {
      PopUp_LeaderBoard.instance = this;
  }

  @property(cc.Prefab)
  prefabLeaderboardItems: cc.Prefab = null;
  
  @property(cc.Node)
  contentListLeaderboardPlayer: cc.Node = null;

  public createItem(length: number, topPlayers) {
    this.contentListLeaderboardPlayer.removeAllChildren(true);
    for (let idx = 0; idx < length; idx++) {
      let item = cc.instantiate(this.prefabLeaderboardItems);
      item.getComponent(LeaderBoardItem).initItem(idx, topPlayers[idx]);
      this.contentListLeaderboardPlayer.addChild(item);
    }
  }

  hide(){
    this.node.active = false;
  }
}

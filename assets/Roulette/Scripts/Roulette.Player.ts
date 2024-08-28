// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import { RouletteNetwork } from "./Roulette.Cmd";
import RLTCommon from "./Roulette.Common";

const { ccclass, property } = cc._decorator;

const RLT_PLAYER_CONFIG = cc.Enum({ ME: 0, GUEST: 1, OTHER: 2 });

@ccclass
export default class RLTPlayer extends cc.Component {
  @property({ type: RLT_PLAYER_CONFIG })
  public userType: number = RLT_PLAYER_CONFIG.GUEST;

  @property(cc.Node)
  public spAvatar: cc.Node = null;

  @property(cc.Node)
  public nAura: cc.Node = null;

  @property(cc.Node)
  public nChips: cc.Node = null;

  @property(cc.Label)
  public lbNickName: cc.Label = null;

  @property(cc.Label)
  public lbBalance: cc.Label = null;

  @property(cc.Node)
  public pnMessage: cc.Node = null;

  @property(cc.Label)
  public lbNumberUser: cc.Label = null;

  @property(cc.Node)
  public pnPrize: cc.Node = null;

  @property(cc.Label)
  public lbGold: cc.Label = null;

  @property(cc.Font)
  public fontPlayer: Array<cc.Font> = [];

  @property(cc.Node)
  public nKiss: cc.Node = null;

  @property(cc.SpriteFrame)
  public defaultAvatars: cc.SpriteFrame = null;

  private infoUser: RouletteNetwork.User = null;

  private listUserPosition: Array<cc.Vec3> = [
    cc.v3(-868, 305.5, 0),
    cc.v3(-868, 114.5, 0),
    cc.v3(-868, -76.5, 0),
    cc.v3(-868, -267.5, 0),
    cc.v3(867, 305.5, 0),
    cc.v3(867, 114.5, 0),
    cc.v3(867, -76.5, 0),
  ];
  // LIFE-CYCLE CALLBACKS:

  protected onLoad(): void {
    this.hidePlayer();
  }

  start() {
    this.activePnPrize(false);
    this.activePnMessage(false);
    this.activeAura(false);
    this.activeKiss(false);
  }

  public resetNewGame(): void {
    this.activePnPrize(false);
    this.activePnMessage(false);
    this.activeAura(false);
    this.activeKiss(false);
  }

  public init(index: number) {
    this.node.position = this.listUserPosition[index];
  }

  public addChip(nChip: cc.Node) {
    nChip.setPosition(cc.v3(0, 0, 0));
    this.nChips.addChild(nChip);
  }

  public updateInfo(user: RouletteNetwork.User) {
    this.infoUser = user;
    this.setNickName(user.displayName);
    this.setBalance(user.balance);
    this.setAvatar(user.avatar);
  }

  public setNickName(displayName: string) {
    this.lbNickName.getComponent(cc.Label).string =
      displayName.length <= 8 ? displayName : displayName.substring(0, 8) + "...";
  }

  public setBalance(balance: number) {
    this.infoUser.balance = balance;
    this.lbBalance.getComponent(cc.Label).string =
      RLTCommon.convert2Label(balance);
  }

  public getBalance() {
    let infoUser = this.getInfoUser();
    return infoUser ? infoUser.balance : 0;
  }

  public setAvatar(link: string) {
    let defaultAva = this.defaultAvatars;
    switch (link) {
      case "":
        this.spAvatar.getComponent(cc.Sprite).spriteFrame = defaultAva;
        break;
    
      default:
        cc.assetManager.loadRemote(link, (err, texture) => {
          if (err) {
            console.error("Failed to load image: ", err);
            this.spAvatar.getComponent(cc.Sprite).spriteFrame = defaultAva;
            return;
          }

          if (texture instanceof cc.Texture2D) {
            let spTemp = new cc.SpriteFrame(texture);
            this.spAvatar.getComponent(cc.Sprite).spriteFrame = spTemp;
          } else {
            console.error("Loaded asset is not a Texture2D");
            this.spAvatar.getComponent(cc.Sprite).spriteFrame = defaultAva;
            return;
          }
        })
        break;
    }

    if (this.userType === RLT_PLAYER_CONFIG.ME) {
      this.spAvatar.width = 157;
      this.spAvatar.height = 155;
    } else {
      this.spAvatar.width = 115;
      this.spAvatar.height = 115;
    }
  }

  public getInfoUser() {
    return this.infoUser ? this.infoUser : null;
  }

  public get nickName() {
    return this.infoUser ? this.infoUser.userName : null;
  }

  public get isMe() {
    return this.infoUser ? this.infoUser.isMe : false;
  }

  public getArrayWin(): Array<any> {
    var temp = this.infoUser.listWin;
    if (temp) {
      return temp.split(";");
    }
    return [];
  }

  public getArrayListBet(): Array<any> {
    var temp = this.infoUser.listBet;
    const builder = [];
    const betPerPotArr = temp.split("/");
    betPerPotArr.forEach((betPerPotItem) => {
      const arr1 = betPerPotItem.split("&");
      if (arr1.length > 1) {
        const potId = arr1[0];
        const betChipArr = arr1[1].split(";");
        betChipArr.forEach((item2) => {
          if (item2) {
            const chip = item2.split(":");
            for (let i = 0; i < Number(chip[1]); i++) {
              builder.push(potId, ":", chip[0], ";");
            }
          }
        });
      }
    });
    let stringBet = builder.join("");
    if (stringBet.length > 0) {
      stringBet = stringBet.substring(0, stringBet.length - 1);
    }
    if (stringBet) {
      return stringBet.split(";");
    }
    return [];
  }

  public hidePlayer() {
    if (this.userType == RLT_PLAYER_CONFIG.GUEST) {
      this.node.active = false;
    } else {
      this.node.active = true;
    }
  }

  public showPlayer() {
    this.node.active = true;
  }

  private showChatMsg(content): void {
    this.activePnMessage(true);
    let nMessage = this.pnMessage.getChildByName("MESSAGE");
    nMessage.active = true;
    nMessage.getChildByName("Label").getComponent(cc.Label).string = content;
    this.scheduleOnce(() => {
      nMessage.getChildByName("Label").getComponent(cc.Label).string = "";
      nMessage.active = false;
    }, 4);
  }

  private showChatEmotion(idEmoi): void {
    this.activePnMessage(true);
    let nEmoij = this.pnMessage.getChildByName("EMOIJ");
    nEmoij.active = true;
    nEmoij.getComponent(sp.Skeleton).setAnimation(0, idEmoi.toString(), true);
    this.scheduleOnce(() => {
      nEmoij.active = false;
    }, 4);
  }

  public renderNumberPlayer(numberUser: number) {
    if (this.lbNumberUser) {
      this.lbNumberUser.string = RLTCommon.convert2Label(numberUser);
    }
  }

  public showPrize(money: number) {
    let isWin = money > 0;
    let ccFont = isWin ? this.fontPlayer[0] : this.fontPlayer[1];
    let str = isWin ? "+" : "-";
    this.activePnPrize(isWin);
    this.activeAura(isWin);
    this.statusOfPlayer(isWin);
    if (isWin && this.lbGold) {
      this.lbGold.string = "+" + RLTCommon.convert2Label(money);
      this.lbGold.node.setPosition(cc.v2(0, 50));
      this.lbGold.node.runAction(
        cc.sequence(
          cc.spawn(
            cc.fadeTo(0.3, 255),
            cc.scaleTo(0.1, 1).easing(cc.easeBounceOut())
          ),
          cc.moveBy(1, cc.v2(0, 100)),
          cc.callFunc(() => {
            this.lbGold.node.stopAllActions();
            this.activePnPrize(false);
            this.statusOfPlayer(false);
          })
        )
      );
    }
  }

  public responseChat(res: RouletteNetwork.RouletteReceiveChat) {
    let isIcon = res.isIcon;
    let message = res.strData;
    if (
      this.userType == RLT_PLAYER_CONFIG.GUEST ||
      this.userType == RLT_PLAYER_CONFIG.ME
    ) {
      if (isIcon) {
        this.showChatEmotion(message);
      } else {
        let content = LanguageMgr.getString(message);
        this.showChatMsg(content);
      }
    }
  }

  private statusOfPlayer(isWin: boolean) {
    if (this.spAvatar) {
      this.spAvatar.color = isWin
        ? new cc.Color().fromHEX("#999999")
        : new cc.Color().fromHEX("#FFFFFF");
    }
  }

  private activeAura(isActive: boolean) {
    if (this.nAura instanceof cc.Node) {
      this.nAura.active = isActive;
    }
  }

  private activePnPrize(isActive: boolean) {
    if (this.pnPrize instanceof cc.Node) {
      this.pnPrize.active = isActive;
    }
  }

  private activePnMessage(isActive: boolean) {
    if (this.pnMessage instanceof cc.Node) {
      this.pnMessage.active = isActive;
    }
  }

  public kiss() {
    this.activeKiss(true);
    this.scheduleOnce(() => {
      this.activeKiss(false);
    }, 1.3);
  }

  private activeKiss(isActive: boolean) {
    if (this.nKiss) {
      this.nKiss.active = isActive;
      this.nKiss.getComponent(sp.Skeleton).setAnimation(0, "animation", false);
    }
  }

  public onClick(event) {
    RouletteNetwork.Send.sendListExternalUser();
  }
}

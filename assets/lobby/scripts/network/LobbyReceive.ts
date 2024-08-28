import { LobbyCmdId } from "../../LobbyConst";

export namespace cmdReceive {
  export class CmdReceivedUrlLivestream extends BGUI.BaseInPacket {
    public error = null;
    public status = null;
    public linkFrame = "";
    public linkHls = "";
    protected unpack(): void {
      this.error = this.getError();
      this.status = this.getInt();
      this.linkFrame = this.getString();
      this.linkHls = this.getString();
    }
  }

  export class ResEventGetListGift extends BGUI.BaseInPacket {
    protected unpack(): void {
      this.status = this.getLong();
    }
    status = 0;
  }

  export class ResGiftCode extends BGUI.BaseInPacket {
    protected unpack(): void {
      this.error = this.getError();
      this.currentMoneyVin = this.getLong();
      this.currentMoneyXu = this.getLong();
      this.moneyGiftCodeVin = this.getLong();
      this.moneyGiftCodeXu = this.getLong();
    }
    error = 0;
    currentMoneyVin = 0;
    currentMoneyXu = 1;
    moneyGiftCodeVin = 0;
    moneyGiftCodeXu = 0;
  }
  export class ResGetLinkLiveStream extends BGUI.BaseInPacket {
    protected unpack(): void {
      this.error = this.getError();
      this.linkGame = this.getString();
    }
    error = 0;
    linkGame = "";
  }
  export class ResResultExchange extends BGUI.BaseInPacket {
    protected unpack(): void {
      this.error = this.getError();
      this.moneyUse = this.getLong();
      this.currentMoney = this.getLong();
    }
    error = 0;
    moneyUse = 0;
    currentMoney = 0;
  }
  export class ResCheckNickname extends BGUI.BaseInPacket {
    protected unpack(): void {
      this.error = this.getError();
      this.type = this.getByte();
      this.fee = this.getByte();
    }
    error = -99;
    type = 0;
    fee = 0;
  }
  export class ResExchange extends BGUI.BaseInPacket {
    protected unpack(): void {
      this.error = this.getError();
      this.moneyUse = this.getLong();
    }
    error = 0;
    moneyUse = 0;
  }

  export class ResExchangeNew extends BGUI.BaseInPacket {
    protected unpack(): void {
      this.error = this.getError();
    }
    error = 0;
  }

  export class ResStatusLogin extends BGUI.BaseInPacket {
    protected unpack(): void {
      this.type = this.getLong();
    }
    type = 0;
  }
  export class ResGetMail extends BGUI.BaseInPacket {
    protected unpack(): void {
      this.total = this.getInt();
      this.subject = this.getString();
      this.content = this.getString();
    }
    total = 0;
    subject = "";
    content = "";
  }
  export class ResUpdateMail extends BGUI.BaseInPacket {
    protected unpack(): void {
      this.total = this.getLong();
      this.status = this.getLong();
    }
    total = 0;
    status = 0;
  }
  export class ResNewMail extends BGUI.BaseInPacket {
    protected unpack(): void {}
  }
  export class ResUpdateMoney extends BGUI.BaseInPacket {
    protected unpack(): void {
      this.currentMoney = this.getLong();
      this.moneyType = this.getShort();
    }
    currentMoney = 0;
    moneyType = 0;
  }

  export class ResVinTotalOfUser extends BGUI.BaseInPacket {
    public vinTotal: number = 0;

    protected unpack(): void {
      this.vinTotal = this.getLong();
    }
  }

  export class ResOTP extends BGUI.BaseInPacket {
    protected unpack(): void {
      this.error = this.getError();
    }
    error = 0;
  }
  export class ResVQMM extends BGUI.BaseInPacket {
    protected unpack(): void {
      this.error = this.getError();
      this.prizeVin = this.getString();
      this.prizeXu = this.getString();
      this.prizeSlot = this.getString();
      this.remainCount = this.getShort();
      this.currentMoneyVin = this.getLong();
      this.currentMoneyXu = this.getLong();
    }
    error = 0;
    prizeVin = "";
    prizeXu = "";
    prizeSlot = "";
    remainCount = 0;
    currentMoneyVin = 0;
    currentMoneyXu = 0;
  }
  export class ResUpdateUserInfo extends BGUI.BaseInPacket {
    protected unpack(): void {
      this.error = this.getError();
    }
    error = 0;
  }
  export class CmdReceivedWithDrawalVietName extends BGUI.BaseInPacket {
    protected unpack(): void {
      this.error = this.getError();
    }
    error = 0;
  }
  export class ResGetMoneyHoanCuoc extends BGUI.BaseInPacket {
    protected unpack(): void {
      this.error = this.getError();
      this.money = this.getLong();
    }
    error = 0;
    money = 0;
  }

  export class ResSecurityInfo extends BGUI.BaseInPacket {
    protected unpack(): void {
      this.error = this.getError();
      this.username = this.getString();
      this.cmt = this.getString();
      this.email = this.getString();
      this.mobile = this.getString();
      this.mobileSecure = this.getByte();
      this.emailSecure = this.getByte();
      this.appSecure = this.getByte();
      this.loginSecure = this.getByte();
      this.moneyLoginOtp = this.getLong();
      this.moneyUse = this.getLong();
      this.safe = this.getLong();
      this.configGame = this.getString();
      this.setupPwdSafe = this.getByte();
    }
    error = 0;
    username = "";
    cmt = "";
    email = "";
    mobile = "";
    mobileSecure = 0;
    emailSecure = 0;
    appSecure = 0;
    loginSecure = 0;
    moneyLoginOtp = 0;
    moneyUse = 0;
    safe = 0;
    configGame = "";
    setupPwdSafe = 0;
  }

  export class ReceivedHoanTienCuoc extends BGUI.BaseInPacket {
    protected unpack(): void {
      this.error = this.getError();
      this.money = this.getLong();
    }
    error = 0;
    money = 0;
  }

  export class ReceivedUpdateSlotJackpot extends BGUI.BaseInPacket {
    jackpots: string;
    protected unpack(): void {
      this.jackpots = this.getString();
    }
  }

  export class ReceivedUpdateAllJackpot extends BGUI.BaseInPacket {
    protected unpack(): void {
      for (let i = 0; i < 18; i++) {
        this.jackpots.push(this.getLong());
      }
    }
    jackpots: number[] = [];
  }

  export class ReceivedNhanThuongTopVip extends BGUI.BaseInPacket {
    protected unpack(): void {
      this.results = this.getLong();
    }
    results = 0;
  }

  export class ReceivedUpdateTimeTaiXiu extends BGUI.BaseInPacket {
    protected unpack(): void {
      this.remainTime = this.getByte();
      this.bettingState = this.getBool();
    }
    remainTime = 0;
    bettingState = false;
  }
  export class ReceivedProgressTopVipInfo extends BGUI.BaseInPacket {
    protected unpack(): void {
      this.moneyProgress = this.getLong();
    }
    moneyProgress = 0;
  }
  export class ReceivedConvertDiamond extends BGUI.BaseInPacket {
    protected unpack(): void {
      this.diamond = this.getLong();
    }
    diamond = 0;
  }
  export class CmdReceiveNhanThuong extends BGUI.BaseInPacket {
    protected unpack(): void {
      this.result = this.getLong();
    }
    result = 0;
  }
  export class CmdReceiveCheckGiftcode extends BGUI.BaseInPacket {
    protected unpack(): void {
      this.money = this.getLong();
    }
    money = 0;
  }
  export class CmdRunEvent extends BGUI.BaseInPacket {
    protected unpack(): void {
      this.status = this.getByte();
      this.content = this.getString();
    }
    status = 0;
    content = "";
  }
  export class CmdReceivedBroadcastMessage extends BGUI.BaseInPacket {
    protected unpack(): void {
      this.content = this.getString();
    }
    content = "";
  }
  export class CmdReceivedBroadcastMessageTopCuoc extends BGUI.BaseInPacket {
    protected unpack(): void {
      this.date = this.getString();
      this.content = this.getString();
    }
    date = "";
    content = "";
  }
  export class CmdReceivedUpdateChangePhone extends BGUI.BaseInPacket {
    protected unpack(): void {
      this.error = this.getError();
    }
    error = 0;
  }
  export class CmdReceivedListGift extends BGUI.BaseInPacket {
    protected unpack(): void {
      this.ids = this.getString();
    }
    ids = "";
  }
  export class CmdReceivedOpenGiftXmas extends BGUI.BaseInPacket {
    protected unpack(): void {
      this.result = this.getString();
    }
    result = "";
  }

  export class CmdReceivedCheckLuckyMoneyLunar extends BGUI.BaseInPacket {
    protected unpack(): void {
      this.errorCode = this.getError();
    }
    errorCode;
  }

  export class CmdReceivedRewardLuckyMoneyLunar extends BGUI.BaseInPacket {
    protected unpack(): void {
      this.moneyReceive = this.getLong();
    }
    moneyReceive;
  }

  export class CmdReceivedGetListWord extends BGUI.BaseInPacket {
    protected unpack(): void {
      this.totalText = this.getInt();
      this.listText = this.getString();
    }
    totalText;
    listText;
  }

  export class CmdReceivedMergeWord extends BGUI.BaseInPacket {
    protected unpack(): void {
      this.eventInfo = this.getString();
    }
    eventInfo;
  }

  export class CmdReceivedDiemDanh extends BGUI.BaseInPacket {
    protected unpack(): void {
      this.error = this.getError();
      this.results = this.getString();
    }
    error;
    results;
  }

  export class ResSafeMoney extends BGUI.BaseInPacket {
    protected unpack(): void {
      this.error = this.getError();
      this.moneyUse = this.getLong();
      this.safe = this.getLong();
    }
    error = 0;
    moneyUse = 0;
    safe = 0;
  }

  export class ResSafeCreatePass extends BGUI.BaseInPacket {
    protected unpack(): void {
      this.error = this.getError();
    }
    error = 0;
  }

  export class ResSafeUpdatePass extends BGUI.BaseInPacket {
    protected unpack(): void {
      this.error = this.getError();
    }
    error = 0;
  }

  export class ResResultSafeMoney extends BGUI.BaseInPacket {
    protected unpack(): void {
      this.error = this.getError();
      this.moneyUse = this.getLong();
      this.safe = this.getLong();
      this.currentMoney = this.getLong();
    }
    error = 0;
    moneyUse = 0;
    safe = 0;
    currentMoney = 0;
  }

  export class CmdReceivedGetBalance extends BGUI.BaseInPacket {
    public error = null;
    public totalVin: number = 0;

    protected unpack(): void {
      this.error = this.getError();
      this.totalVin = this.getLong();
    }
  }

  export class CmdReceivedCkCheckGiftCode extends BGUI.BaseInPacket {
    public money: number = 0;

    protected unpack(): void {
      this.money = this.getLong();
    }
  }

  // =========== Merge Word ===========

  export class CmdReceivedLigature extends BGUI.BaseInPacket {
    //20140
    public errorCode = null;
    public result: string = "";

    protected unpack(): void {
      this.errorCode = this.getError();
      this.result = this.getString();
    }
  }

  export class CmdReceivedSellCharacter extends BGUI.BaseInPacket {
    public errorCode;
    public price: number;
    public wordText: string;
    public nickname: string;
    public isBuy;

    protected unpack(): void {
      this.errorCode = this.getError();
      this.wordText = this.getString();
      this.nickname = this.getString();
      this.price = this.getLong();
      this.isBuy = this.getByte();
    }
  }

  export class CmdReceivedBoughtChar extends BGUI.BaseInPacket {
    // 20141
    public errorCode;
    protected unpack(): void {
      this.errorCode = this.getError();
    }
  }

  export class CmdReceivedTransactionCharacter extends BGUI.BaseInPacket {
    //20143
    public errorCode;
    public price: number;
    public wordId: number;
    public wordText: string;
    public nickname: string;

    protected unpack(): void {
      this.errorCode = this.getError();
      this.wordId = this.getLong();
      this.wordText = this.getString();
      this.nickname = this.getString();
      this.price = this.getLong();
    }
  }

  export class ReceivedChangeDisplayName extends BGUI.BaseInPacket {
    //20154
    public done: number;
    public error;

    protected unpack(): void {
      this.done = this.getShort();
      this.error = this.getError();
    }
  }

  export class ReceivedUpdatePlayerInfo extends BGUI.BaseInPacket {
    //20153
    public error;
    public id: number;
    public userName: string;
    public vinTotal: number;
    public displayName: string;
    public avatar: string;
    public winRate: number;
    public viplvl: number;
    public totalMatch: number;

    protected unpack(): void {
      this.error = this.getError();
      this.id = this.getInt();
      this.userName = this.getString();
      this.vinTotal = this.getLong();
      this.displayName = this.getString();
      this.avatar = this.getString();
      this.winRate = this.getDouble();
      this.viplvl = this.getInt();
      this.totalMatch = this.getInt();
    }
  }

  export class ReceivedGiftCode extends BGUI.BaseInPacket {
    //20017
    public error;
    public currentMoneyVin: number;
    public currentMoneyXu: number;
    public moneyGiftCodeVin: number;
    public moneyGiftCodeXu: number;

    protected unpack(): void {
      this.error = this.getError();
      this.currentMoneyVin = this.getLong();
      this.currentMoneyXu = this.getLong();
      this.moneyGiftCodeVin = this.getLong();
      this.moneyGiftCodeXu = this.getLong();
    }
  }

  export class ReceivedFreeChips extends BGUI.BaseInPacket {
    //20152
    public error;
    public currentMoneyVin: number;

    protected unpack(): void {
      this.error = this.getError();
      this.currentMoneyVin = this.getLong();
    }
  }

  export interface ImpMailInfo {
    id: number;
    title: string;
    author: string;
    createTime: string;
    content: string;
    status: number;
    sysMail: number;
    gold: number;
    isClaimed: boolean;
    type: number;
  }

  export class ReceivedMail extends BGUI.BaseInPacket {
    //20156
    public error;
    public listSize;
    public list: Array<ImpMailInfo> = [];
    protected unpack(): void {
      this.error = this.getError();
      this.listSize = this.getShort();
      this.list = [];
      for (var i = 0; i < this.listSize; i++) {
        let item: ImpMailInfo = {
          id: this.getInt(),
          title: this.getString(),
          author: this.getString(),
          createTime: this.getString(),
          content: this.getString(),
          status: this.getInt(),
          sysMail: this.getInt(),
          gold: this.getLong(),
          isClaimed: this.getBool(),
          type: this.getInt(),
        };
        this.list.push(item);
      }
    }
  }

  export class ReceiveDeleteMails extends BGUI.BaseInPacket {
    public totalMailDeleted: number;
    public totalMailUnread: number;

    protected unpack(): void {
      this.totalMailDeleted = this.getLong();
      this.totalMailUnread = this.getLong();
    }
  }

  export class ReceivedReadMails extends BGUI.BaseInPacket {
    public total: number;
    public status: number;

    protected unpack(): void {
      this.total = this.getLong();
      this.status = this.getLong();
    }
  }

  export class ReceivedClaimedGold extends BGUI.BaseInPacket {
    public currentMoneyVin: number;
    public error;
    protected unpack(): void {
      this.currentMoneyVin = this.getLong();
      this.error = this.getError();
    }
  }

  export interface playerTemp {
    displayName: string;
    currentMoney: number;
    avatar: string;
    viplvl: number;
  }

  export class ReceivedTopPlayers extends BGUI.BaseInPacket {
    //20151
    public error;
    public sizeTopPlayer: number;
    public topPlayers = [];

    protected unpack(): void {
      this.error = this.getError();
      this.sizeTopPlayer = this.getShort();
      for (let index = 0; index < this.sizeTopPlayer; index++) {
        let player: playerTemp = {
          displayName: "",
          currentMoney: 0,
          avatar: "",
          viplvl: -1,
        };
        player = {
          displayName: this.getString(),
          currentMoney: this.getLong(),
          avatar: this.getString(),
          viplvl: this.getInt(),
        };
        this.topPlayers.push(player);
      }
    }
  }

  export interface friendListTemp {
    userName: string;
    displayName: string;
    vinTotal: number;
    viplvl: number;
    avatar: string;
    // nickname: string;
  }

  export class ReceivedListFriend extends BGUI.BaseInPacket {
    //20161
    public error;
    public listSize;
    public list: Array<friendListTemp> = [];
    protected unpack(): void {
      this.error = this.getError();
      this.listSize = this.getShort();
      
      for (var i = 0; i < this.listSize; i++) {
        let item: friendListTemp = {
          userName: this.getString(),
          displayName: this.getString(),
          vinTotal: this.getLong(),
          viplvl: this.getInt(),
          avatar: this.getString(),
          // nickname: this.getString()
        };
        this.list.push(item);
      }
    }
  }
  export class ReceivedAddFriend extends BGUI.BaseInPacket {
    //20158
    public error;
    public userName: string;
    public displayName: string;
    public vinTotal: number;
    public vipLevel: number;

    protected unpack(): void {
      this.error = this.getError();
      this.userName = this.getString();
      this.displayName = this.getString();
      this.vinTotal = this.getInt();
      this.vipLevel = this.getInt();
    }
  }

  // list friend: 20161

  // output:
  //         bf.putShort((byte)this.listFriend.size());
  //         for (FriendMsg sres : listFriend){
  //             this.putStr(bf, sres.userName);
  //             this.putStr(bf, sres.displayName);
  //             bf.putLong(sres.vinTotal);
  //             bf.putInt(sres.vipLevel);
  //         }


  
  // add Friend:
  // 20158

  // input: String userName;

  // output:
  // bf.putShort((byte)this.listFriend.size());
  // for (FriendMsg sres : listFriend){
  // this.putStr(bf, sres.userName);
  // this.putStr(bf, sres.displayName);
  // bf.putLong(sres.vinTotal);
  // bf.putInt(sres.vipLevel);
  // }
}

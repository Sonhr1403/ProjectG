import { List } from "lodash";
import { LobbyCmdId } from "../../LobbyConst";

export class SendLogin extends BGUI.BaseOutPacket {
  public nickName: string;
  public accessToken: string;

  public getCmdId(): number {
    return LobbyCmdId.USER_LOGIN;
  }
  public putData(): void {
    this.putString(this.nickName);
    this.putString(this.accessToken);
  }
}
export class SendGiftCode extends BGUI.BaseOutPacket {
  public giftcode: string;

  public getCmdId(): number {
    return LobbyCmdId.GIFT_CODE;
  }
  public putData(): void {
    this.putString(this.giftcode);
  }
}
export class SendGetLinkLiveStream extends BGUI.BaseOutPacket {
  public typeHtml: number;
  public gameId: number;

  public getCmdId(): number {
    return LobbyCmdId.GET_LINK_LIVESTREAM;
  }
  public putData() {
    this.putInt(this.typeHtml);
    this.putInt(this.gameId);
    this.updateSize();
  }
}
export class SendGetLinkBanCa extends BGUI.BaseOutPacket {
  public typeHtml: number;
  public gameId: number;

  public getCmdId(): number {
    return LobbyCmdId.GET_LINK_BET;
  }
  public putData() {
    this.putInt(this.typeHtml);
    this.putInt(this.gameId);
    this.updateSize();
  }
}
export class SendGetLinkBet extends BGUI.BaseOutPacket {
  public typeHtml: number;

  public getCmdId(): number {
    return LobbyCmdId.GET_LINK_BET;
  }
  public putData() {
    this.putInt(this.typeHtml);
    this.updateSize();
  }
}
export class SendExchange extends BGUI.BaseOutPacket {
  //receiver, moneyExchange, description
  public receiver: string;
  public moneyExchange: number;
  public description: string;

  public getCmdId(): number {
    return LobbyCmdId.EXCHANGE_VIN;
  }
  public putData() {
    this.putString(this.receiver);
    this.putLong(this.moneyExchange);
    this.putString(this.description);
    this.updateSize();
  }
}

export class SendOTP extends BGUI.BaseOutPacket {
  //receiver, moneyExchange, description
  public otp: string;
  public type: number;

  public getCmdId(): number {
    return LobbyCmdId.SEND_OTP;
  }
  public putData() {
    this.putString(this.otp);
    this.putByte(this.type);
    this.updateSize();
  }
}

export class SendExchangeNew extends BGUI.BaseOutPacket {
  //receiver, moneyExchange, description
  public receiver: String;
  public moneyExchange: number;
  public description: string;
  public otp: string;

  public getCmdId(): number {
    return LobbyCmdId.EXCHANGE_VIN_NEW;
  }
  public putData() {
    this.putString(this.receiver);
    this.putLong(this.moneyExchange);
    this.putString(this.description);
    this.putString(this.otp);
    this.updateSize();
  }
}

export class SendVQMM extends BGUI.BaseOutPacket {
  public getCmdId(): number {
    return LobbyCmdId.START_NEW_VQMM;
  }
  public putData() {
    this.updateSize();
  }
}
export class SendSecurityInfo extends BGUI.BaseOutPacket {
  public getCmdId(): number {
    return LobbyCmdId.GET_INFORMATION_SERCURITY;
  }
  public putData() {
    this.updateSize();
  }
}
export class SendGetMoneyHoanCuoc extends BGUI.BaseOutPacket {
  public getCmdId(): number {
    return LobbyCmdId.GET_MONEY_HOANCUOC;
  }
  public putData() {
    this.updateSize();
  }
}

export class CmdSendActivePhone extends BGUI.BaseOutPacket {
  public getCmdId(): number {
    return LobbyCmdId.ACTIVE_MOBILE;
  }
  public putData() {
    this.updateSize();
  }
}

export class SendUpdateUserInfo extends BGUI.BaseOutPacket {
  public cmt = "";
  public email = "";
  public phone = "";
  public getCmdId(): number {
    return LobbyCmdId.UPDATE_USER_INFO;
  }
  public putData() {
    this.putString(this.cmt);
    this.putString(this.email);
    this.putString(this.phone);
    this.updateSize();
  }
}
export class SendCheckNickname extends BGUI.BaseOutPacket {
  public nickname = "";
  public getCmdId(): number {
    return LobbyCmdId.CHECK_NICK_NAME;
  }
  public putData() {
    this.putString(this.nickname);
    this.updateSize();
  }
}
export class SendChangePassword extends BGUI.BaseOutPacket {
  public oldPass = "";
  public newPass = "";

  public getCmdId(): number {
    return LobbyCmdId.CHANGEPASS;
  }
  public putData() {
    this.putString(this.oldPass);
    this.putString(this.newPass);

    this.updateSize();
  }
}

export class SendSubcribeJackpot extends BGUI.BaseOutPacket {
  public getCmdId(): number {
    return LobbyCmdId.SUBCRIBE_JACPORT;
  }
  public putData() {
    this.updateSize();
  }
}

export class SendSubcribeAllJackpot extends BGUI.BaseOutPacket {
  public getCmdId(): number {
    return 20101;
  }
  public putData() {
    this.updateSize();
  }
}

export class SendNhanThuongVip extends BGUI.BaseOutPacket {
  public getCmdId(): number {
    return LobbyCmdId.NHAN_THUONG_TOPVIP;
  }
  public putData() {
    this.updateSize();
  }
}
export class CmdSendProgressTopVip extends BGUI.BaseOutPacket {
  public getCmdId(): number {
    return LobbyCmdId.PROGRESS_VIP_INFO;
  }
  public putData() {
    this.updateSize();
  }
}
export class CmdSendConvertDiamond extends BGUI.BaseOutPacket {
  public numberDiamond = 0;
  public getCmdId(): number {
    return LobbyCmdId.CONVERT_DIAMOND;
  }
  public putData() {
    this.putLong(this.numberDiamond);
    this.updateSize();
  }
}
export class CmdSendNhanThuong extends BGUI.BaseOutPacket {
  public missionCode = "";
  public getCmdId(): number {
    return LobbyCmdId.LOBBY_EVENT_NHAN_THUONG;
  }
  public putData() {
    this.putString(this.missionCode);
    this.updateSize();
  }
}
export class CmdSendCheckGiftcode extends BGUI.BaseOutPacket {
  public getCmdId(): number {
    return LobbyCmdId.LOBBY_CK_CHECK_GIFT_CODE;
  }
  public putData() {
    this.updateSize();
  }
}
export class CmdUpdateMail extends BGUI.BaseOutPacket {
  public mailId = 0;
  public getCmdId(): number {
    return LobbyCmdId.LOBBY_UPDATE_STATUS_B_MAIL;
  }
  public putData() {
    this.putLong(this.mailId);
    this.updateSize();
  }
}
export class CmdSendUpdateChangePhone extends BGUI.BaseOutPacket {
  public email = "";
  public phone = "";
  public otp = "";
  public getCmdId(): number {
    return LobbyCmdId.LOBBY_CHANGE_MOBILE_OTP;
  }
  public putData() {
    this.putString(this.email);
    this.putString(this.phone);
    this.putString(this.otp);
    this.updateSize();
  }
}
export class CmdSendOpenGiftXmas extends BGUI.BaseOutPacket {
  public giftId = 0;
  public getCmdId(): number {
    return LobbyCmdId.OPEN_GIFT_XMAS;
  }
  public putData() {
    this.putLong(this.giftId);
    this.updateSize();
  }
}
export class CmdSendRewardDeposit extends BGUI.BaseOutPacket {
  public getCmdId(): number {
    return LobbyCmdId.REWARD_PROGRESS_NAP;
  }
  public putData() {
    this.updateSize();
  }
}

export class CmdSendCheckLuckyMoneyLuna extends BGUI.BaseOutPacket {
  public getCmdId(): number {
    return LobbyCmdId.LOBBY_EVENT_CHECK_LUCKY_MONEY_LUNAR;
  }
  public putData() {
    this.updateSize();
  }
}

export class CmdSendRewardLuckyMoneyLuna extends BGUI.BaseOutPacket {
  public getCmdId(): number {
    return LobbyCmdId.LOBBY_EVENT_REWARD_LUCKY_MONEY_LUNAR;
  }
  public putData() {
    this.updateSize();
  }
}

export class CmdSendMergeWord extends BGUI.BaseOutPacket {
  public getCmdId(): number {
    return LobbyCmdId.LOBBY_EVENT_MERGE_WORD;
  }
  public listWordId: string;

  public putData() {
    this.putString(this.listWordId);
    this.updateSize();
  }
}

// export class CmdSendDiemDanh extends BGUI.BaseOutPacket {
//     public getCmdId(): number {
//         return LobbyCmdId.SEND_DIEMDANH;
//     }

//     public putData() {
//         this.updateSize()
//     }
// }

export class CmdBreakEggLobby extends BGUI.BaseOutPacket {
  public eggId = 0;
  public getCmdId(): number {
    return LobbyCmdId.BREAK_EGG_LOBBY;
  }

  public putData() {
    this.putLong(this.eggId);
    this.updateSize();
  }
}

export class CmdSendWithDrawalVietName extends BGUI.BaseOutPacket {
  public bankId: string;
  public bankBranch: string;
  public accountHolder: string;
  public accountNumber: string;
  public strMoney: string;
  public otp: string;
  public currency: string;
  public info: string;
  public getCmdId(): number {
    return LobbyCmdId.LOBBY_WITHDRAWAL_VIETNAM;
  }

  public putData() {
    this.putString(this.bankId);
    this.putString(this.bankBranch);
    this.putString(this.accountHolder);
    this.putString(this.accountNumber);
    this.putString(this.strMoney);
    this.putString(this.otp);
    this.putString(this.currency);
    this.putString(this.info);
    this.updateSize();
  }
}

export class SendSafeMoney extends BGUI.BaseOutPacket {
  public type: number;
  public moneyExchange: number;
  public password: string;

  public getCmdId(): number {
    return LobbyCmdId.SAFE_MONEY;
  }
  public putData() {
    this.putByte(this.type);
    this.putLong(this.moneyExchange);
    this.putString(this.password);
    this.updateSize();
  }
}

export class SendSafeCreatePassword extends BGUI.BaseOutPacket {
  public pass: string;
  public repass: string;

  public getCmdId(): number {
    return LobbyCmdId.SAFE_CREATE_PASS;
  }
  public putData() {
    this.putString(this.pass);
    this.putString(this.repass);
    this.updateSize();
  }
}

export class SendSafeUpdatePassword extends BGUI.BaseOutPacket {
  public oldpass: string;
  public pass: string;
  public repass: string;

  public getCmdId(): number {
    return LobbyCmdId.SAFE_UPDATE_PASS;
  }
  public putData() {
    this.putString(this.oldpass);
    this.putString(this.pass);
    this.putString(this.repass);
    this.updateSize();
  }
}

export class CmdSendCkCheckGiftCode extends BGUI.BaseOutPacket {
  public type;

  public getCmdId(): number {
    return LobbyCmdId.LOBBY_CK_CHECK_GIFT_CODE;
  }
  public putData() {
    this.putInt(this.type);
    this.updateSize();
  }
}

//// SEND
export class CmdSendGetBalance extends BGUI.BaseOutPacket {
  public getCmdId(): number {
    return LobbyCmdId.MINI_GET_BALANCE;
  }
  public putData(): void {
    // TODO
  }
}

export class sendCheckDevice extends BGUI.BaseOutPacket {
  public deviceInfo: string;

  public getCmdId(): number {
    return LobbyCmdId.CHECK_DEVICE;
  }
  public putData() {
    this.putString(this.deviceInfo);
    this.updateSize();
  }
}

export class CmdSendLigature extends BGUI.BaseOutPacket {
  public strIdChar: string;
  public getCmdId(): number {
    return LobbyCmdId.LIGATURE_CHARACTER;
  }
  public putData() {
    this.putString(this.strIdChar);
    this.updateSize();
  }
}

export class CmdSendSaleCharacter extends BGUI.BaseOutPacket {
  public wordId: number;
  public price: number;
  public wordText: string;
  public nickname: string;
  public getCmdId(): number {
    return LobbyCmdId.LIGATURE_SEND_SELL_CHARACTER;
  }
  public putData() {
    this.putLong(this.wordId);
    this.putString(this.wordText);
    this.putString(this.nickname);
    this.putLong(this.price);
    this.updateSize();
  }
}

export class CmdSendConfirmBuyCharacter extends BGUI.BaseOutPacket {
  public wordId: number;
  public price: number;
  public wordText: string;
  public nickname: string;
  public isBuy;
  public getCmdId(): number {
    return LobbyCmdId.LIGATURE_SR_TRANSACTION_CHARACTER;
  }
  public putData() {
    this.putLong(this.wordId);
    this.putString(this.wordText);
    this.putString(this.nickname);
    this.putLong(this.price);
    this.putByte(this.isBuy);
    this.updateSize();
  }
}

export namespace LobbySend {
  export class SendChangeAvatar extends BGUI.BaseOutPacket {
    public avatarId: number;

    public getCmdId(): number {
      return LobbyCmdId.CHANGE_AVATAR;
    }
    public putData() {
      this.putLong(this.avatarId);
    }
  }

  export class SendChangeDisplayName extends BGUI.BaseOutPacket {
    public nickName: string;

    public getCmdId(): number {
      return LobbyCmdId.CHANGE_DISPLAYNAME;
    }
    public putData() {
      this.putString(this.nickName);
    }
  }

  export class SendUpdatePlayerInfo extends BGUI.BaseOutPacket {
    public getCmdId(): number {
      return LobbyCmdId.PLAYER_PROFILE;
    }
    public putData() {}
  }

  export class SendGiftCode extends BGUI.BaseOutPacket {
    public giftCode: string;

    public getCmdId(): number {
      return LobbyCmdId.GIFT_CODE;
    }

    public putData() {
      this.putString(this.giftCode);
    }
  }

  export class SendFreeChips extends BGUI.BaseOutPacket {
    public getCmdId(): number {
      return LobbyCmdId.FREE_CHIPS;
    }

    public putData() {}
  }

  export class SendMail extends BGUI.BaseOutPacket {
    public getCmdId(): number {
      return LobbyCmdId.RECEIVE_MAIL;
    }

    public putData() {}
  }

  export class deleteMail extends BGUI.BaseOutPacket {
    public ids: Array<number>;

    public getCmdId(): number {
      return LobbyCmdId.DELETE_MAIL;
    }
    public putData(): void {
      this.putShort(this.ids.length);
      for (let i = 0; i < this.ids.length; i++) {
        this.putInt(this.ids[i]);
      }
    }
  }

  export class readMail extends BGUI.BaseOutPacket {
    public id: number;

    public getCmdId(): number {
      return LobbyCmdId.READ_MAIL;
    }
    public putData(): void {
      this.putInt(this.id);
    }
  }

  export class claimGold extends BGUI.BaseOutPacket {
    public id: number;

    public getCmdId(): number {
      return LobbyCmdId.CLAIM_GOLD;
    }
    public putData(): void {
      this.putInt(this.id);
    }
  }

  // Read mail:

  // Command id: 20111
  // Input cmd:  id   => inbox mail id

  // Response:
  //     public long total;  // Tổng số mail chưa đọc
  //     public long status; // Trả về giá trị = 0 (đã đọc)

  // Delete mail:

  // Command id: 20149
  // Input cmd:  id   => inbox mail id

  // Response:
  //     public long total;  // Tổng số mail chưa đọc
  //     public long status; // Trả về giá trị = 2 (đã xóa)
  export class SendTopPlayer extends BGUI.BaseOutPacket {
    public getCmdId(): number {
      return LobbyCmdId.TOP_PLAYERS;
    }

    public putData() {}
  }

  export class SendListFriend extends BGUI.BaseOutPacket {
    public getCmdId(): number {
      return LobbyCmdId.LIST_FRIEND;
    }

    public putData() {}
  }

  export class AddFriend extends BGUI.BaseOutPacket {
    public userName: string;

    public getCmdId(): number {
      return LobbyCmdId.ADD_FRIEND;
    }

    public putData(): void {
      this.putInt(this.userName);
    }
  }
  export class DeleteFriend extends BGUI.BaseOutPacket {
    public userName: string;

    public getCmdId(): number {
      return LobbyCmdId.DELETE_FRIEND;
    }

    public putData(): void {
      this.putInt(this.userName);
    }
  }
  //   delete: 20159

  // input: String userName:
}

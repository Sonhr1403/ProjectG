import { PlinkoConnector } from "./Plinko.Connector";

export namespace PlinkoCmd {
  export class Cmd {
    static CMD_PLINKO_LOGIN = 1;
    static CMD_PLINKO_LOGOUT = 2;
    static CMD_PLINKO_JOINGAME = 4000;
    static CMD_PLINKO_EXITGAME = 4001;
    static CMD_PLINKO_BET = 4002;
    static CMD_PLINKO_RESULT = 4003;
  }



  export class Send {
    public static sendPlinkoBet(
      riskLevel: number,
      row: number,
      amount: number,
      numberBall: number,
      allAtOnce: boolean,
      
    ) {
      let pk = new PlinkoCmd.PlinkoSendBet();
      pk.riskLevel = riskLevel;
      pk.row = row;
      pk.amount = amount;
      pk.numberBall = numberBall;
      pk.allAtOnce = allAtOnce;
      PlinkoConnector.instance.sendPacket(pk);
    }

    public static sendPlinkoJoinGame() {
      let pk = new PlinkoCmd.PlinkoSendJoinGame();
      PlinkoConnector.instance.sendPacket(pk);
    }
    public static sendPlinkoExitGame(username) {
      let pk = new PlinkoCmd.PlinkoSendExitGame();
      pk.userName = username
      PlinkoConnector.instance.sendPacket(pk);
    }
    
  }

  export class PlinkoSendExitGame extends BGUI.BaseOutPacket {
    //4001
    public userName: string;

    getCmdId(): number {
      return Cmd.CMD_PLINKO_EXITGAME;
    }
    putData(): void {
      this.putString(this.userName);
    }
  }

  export class PlinkoSendJoinGame extends BGUI.BaseOutPacket {
    //4000

    getCmdId(): number {
      return Cmd.CMD_PLINKO_JOINGAME;
    }
    putData(): void {
    }
  }
  export class PlinkoSendBet extends BGUI.BaseOutPacket {
    //4002
    public riskLevel: number;
    public row: number;
    public amount: number;
    public numberBall: number;
    public allAtOnce: boolean;
   

    getCmdId(): number {
      return Cmd.CMD_PLINKO_BET;
    }
    putData(): void {
      this.putInt(this.riskLevel);
      this.putInt(this.row);
      this.putLong(this.amount);
      this.putInt(this.numberBall);
      this.putByte(this.allAtOnce);
      
    }
  }

  //Receive Start

  export class PlinkoReceivedLogin extends BGUI.BaseInPacket {
    public err: number = -1;

    protected unpack(): void {
        this.err = this.getError();
    }
  }

  export class PlinkoReceivedJoinGame extends BGUI.BaseInPacket {
    //4000

    public userName: string = "";
    public displayName: string = "";
    public avatar: string = ""; 
    public gold: number = 0;
    protected unpack(): void {
        
            this.userName = this.getString();
            this.displayName = this.getString();
            this.avatar = this.getString();
            this.gold = this.getLong();
      
    }
  }
  export class PlinkoReceivedOutGame extends BGUI.BaseInPacket {
    //4001
    public userName: string;
    protected unpack(): void {
      this.userName = this.getString();
    }
  }
  export class PlinkoReceiveBetResult extends BGUI.BaseInPacket {
    //4003
    public betSize: number = null
    public betResults: Array<BetResults> = []
    protected unpack(): void {
      this.betSize = this.getShort();   
      for (let i = 0; i < this.betSize; i++) {
        let itemBet: BetResults = {
          moneyBet: this.getLong(),
          payout: this.getLong(),
          goal: this.getDouble(),
          curentMoney:this.getLong()
        };
        this.betResults.push(itemBet);
      }   
    }
  }

  export interface BetResults {
    moneyBet: number;
    payout: number;
    goal: number;
    curentMoney:number
  }

  
}

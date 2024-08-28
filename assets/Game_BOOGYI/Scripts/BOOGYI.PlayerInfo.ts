export default interface PlayerInfo {
    seatId: number | -1;
    playerPos: number | -1;
    avatar: string;
    nickName: string;
    currentMoney: number;
    isViewer: boolean | false;
    hasFold: number;
    hasAllIn: number;
    currentBet: number;
    status: number | -1;

}
export const CardLogic = {
    getCardScore(list) {
        let score = -1;
        let hangduoi = this.getScore(list[0], list[1], list[2])
        let hangtren = this.getScore(list[3], list[4]);
        if (hangduoi == 10) {
            score = hangtren;
        }
        return score;
    },

    checkBoolay(list) {
        let score = 0;
        let card1 = list[0];
        let card2 = list[1];
        let card3 = list[2];
        let card4 = list[3];
        let card5 = list[4];
        score = (Math.floor(card1 / 4) + 1 + Math.floor(card2 / 4) + 1 + Math.floor(card3 / 4) + 1 + Math.floor(card4 / 4) + 1 + Math.floor(card5 / 4) + 1);
        if (score == 10) {
            return true;
        }
        return false
    },

    checkBoogyi(list) {
        let score1 = -1;
        let score2 = -1;
        let card1 = list[0];
        let card2 = list[1];
        let card3 = list[2];
        let card4 = list[3];
        let card5 = list[4];
        score1 =
          Math.floor(card1 / 4) +
          1 +
          Math.floor(card2 / 4) +
          1 +
          Math.floor(card3 / 4) +
          1;
    
        score2 =
          Math.floor(card4 / 4) +
          1 +
          Math.floor(card5 / 4) +
          1;
    
        let score = score1 + score2;
        if (score == 20 || (score1 == 20 && score2 == 10)) {
          return true;
        }
        return false;
      },

    getScore(card1 = 0, card2 = 0, card3 = -4) {
        let score = 0;
        score = (Math.floor(card1 / 4) + 1 + Math.floor(card2 / 4) + 1 + Math.floor(card3 / 4) + 1) % 10;
        if (score == 0) {
            score = 10;
        }
        return score
    }
}


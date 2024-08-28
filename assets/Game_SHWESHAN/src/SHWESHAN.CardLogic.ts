import BaseCard from "./SHWESHAN.BaseCard";
import SHWESHANController from "./SHWESHAN.Controller";

export const CardLogic = {
    sortVector(vector: BaseCard[], reverse: boolean): void {
        vector.sort(function (c1, c2) {
            if (c1.N < c2.N) {
                return -1;
            } else if (c1.N > c2.N) {
                return 1;
            } else if (c1.S > c2.S) {
                return 1;
            } else if (c1.S < c2.S) {
                return -1;
            } else
                return 0;
        });
        if (reverse)
            vector.reverse();
    },

    sortList(list: number[]): void {
        if (list.length === 0) {
            return;
        }
        var i = 0;
        while (i < list.length - 1) {
            var p1 = list[i];

            var j;
            for (j = i + 1; j < list.length; j++) {
                var p2 = list[j];

                if (p1 > p2) {
                    var temp = p1;
                    list[i] = list[j];
                    list[j] = temp;
                    i = 0;
                    break;
                }
            }
            if (i !== 0 || j === list.length) {
                i++;
            }
        }
    },

    containCard(arr: BaseCard[], card: BaseCard): boolean {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].getIdx() == card.getIdx())
                return true;
        }
        return false;
    },

    isPairs(list: BaseCard[]): boolean {
        if (list.length !== 2)
            return false;
        return list[0].N === list[1].N;
    },

    isThreeOfAKind(list: BaseCard[]): boolean {
        if (list.length !== 3)
            return false;
        return (list[0].N === list[1].N) && (list[1].N === list[2].N);
    },

    isFourOfAKind(list: BaseCard[]): boolean {
        if (list.length !== 4)
            return false;
        return (list[0].N === list[1].N) && (list[1].N === list[2].N) && (list[2].N === list[3].N);
    },

    isThreePairsStraight(list: BaseCard[]): boolean {
        if (list.length !== 6)
            return false;
        for (var i = 0; i < list.length; i++) {
            var card = list[i];
            if (card.N === 15) {
                return false;
            }
        }
        return (list[0].N === list[1].N) &&
            (list[1].N === list[2].N - 1) &&
            (list[1].N === list[3].N - 1) &&
            (list[1].N === list[4].N - 2) &&
            (list[1].N === list[5].N - 2);
    },

    isFourPairsStraight(list: BaseCard[]): boolean {
        if (list.length !== 8)
            return false;
        for (var i = 0; i < list.length; i++) {
            var card = list[i];
            if (card.N === 15) {
                return false;
            }
        }
        return (list[0].N === list[1].N) &&
            (list[1].N === list[2].N - 1) &&
            (list[1].N === list[3].N - 1) &&
            (list[1].N === list[4].N - 2) &&
            (list[1].N === list[5].N - 2) &&
            (list[1].N === list[6].N - 3) &&
            (list[1].N === list[7].N - 3);
    },

    getHigherStraight(list: BaseCard[], myCardsIn: BaseCard[], sam: boolean = false): BaseCard[] {
        if (sam === undefined) sam = false;
        var myCards = CardLogic.loaiboxamdoivatuquy(myCardsIn);
        CardLogic.sortVector(myCardsIn, false);

        var straight: BaseCard[] = [];
        if (myCards.length < list.length)
            return straight;
        for (var i = 0; i < myCards.length - 1; i++) {
            if (myCards[i].N < list[0].N)
                continue;
            if (myCards[i].N === list[0].N && sam)
                continue;
            if (myCards.length - i < list.length)
                break;
            for (var j = 0; j < list.length; j++) {
                var k = j;
                if (j > 0) {
                    while ((i + k < myCards.length - 1) && (straight[j - 1].N === myCards[i + k].N))
                        k++;
                    // avoid to add same N into straight
                }
                if (j < list.length - 1) {
                    straight.push(myCards[i + k]);
                } else if ((myCards[i + k].N === list[j].N) && (myCards[i + k].S < list[j].S)) {
                    var s = k;
                    while ((i + s < myCards.length - 1) && (list[j].N === myCards[i + s].N) && (myCards[i + s].S < list[j].S))
                        s++;
                    if (s > k) s--;
                    straight.push(myCards[i + s]);
                    // find the bigger S for last card if have the same N
                } else {
                    straight.push(myCards[i + k]);
                }
            }
            if ((straight.length === list.length) && (sam ? CardLogic.isStraight_Sam(straight) : CardLogic.isStraight(straight))) {
                if (straight[0].N === list[0].N) {
                    if (straight[list.length - 1].S > list[list.length - 1].S) {
                        return straight;
                    } else {
                        straight = [];
                    }
                } else {
                    return straight;
                }
            } else {
                straight = [];
            }
        }
        return straight;
    },

    loaiboxamdoivatuquy(myCardsIn: BaseCard[]): BaseCard[] {
        // luu y myCardsIn da sort
        //    myCardsIn.Sort(delegate(Card x, Card y) {
        //        if(x.N> y.N)
        //            return 1;
        //        if(x.N == y.N)
        //            return y.S- x.S; // intent xep nguoc
        //        return -1;
        //    });
        CardLogic.sortVector(myCardsIn, false);

        var list: BaseCard[] = [];
        var n = 0;
        var c = 0; // so lan gap cay n
        // danh sach nhung cay bai bi bo
        for (var i = 0; i < myCardsIn.length; i++) {
            if (n === myCardsIn[i].N) {
                c++;
                if (c < 2)
                    list.push(myCardsIn[i]);
            } else {
                c = 1;
                n = myCardsIn[i].N;
                list.push(myCardsIn[i]);
            }
        }
        // sort lai input list
        //    myCardsIn.Sort(ComparisionTienLen);
        CardLogic.sortVector(myCardsIn, false);
        return list;
    },

    isStraight_Sam(cards: BaseCard[]): boolean {
        if (cards.length < 3)
            return false;
        // sanh 2,3,4 Q,K,A
        var valueList1 = [];
        // sanh 1,2,3,4
        var valueList2 = [];
        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            valueList1.push(card.N == 15 ? 2 : card.N);
            valueList2.push(card.N == 15 ? 2 : (card.N == 14 ? 1 : card.N));
        }

        if (CardLogic.checkSanh_sam(valueList1)) {
            return true;
        }

        if (CardLogic.checkSanh_sam(valueList2)) {
            return true;
        }

        return false;
    },

    isStraight(cards: BaseCard[]): boolean {

        var isStraight = true;
        if (cards.length < 3)
            return false;
        for (var i = 0; i < cards.length - 1; i++) {
            var n1 = cards[i].N;
            var n2 = cards[i + 1].N;
            if (n1 === 15 || n2 === 15)
                return false;
            isStraight = isStraight && (n1 + 1 === n2);
        }
        return isStraight;
    },

    checkSanh_sam(cards: number[]): boolean {
        if (cards.length < 3)
            return false;
        //    cards.Sort();
        CardLogic.sortList(cards);
        var isSanh = true;
        var n_start = cards[0];
        for (var i = 1; i < cards.length; i++) {
            isSanh = isSanh && (cards[i] === (n_start + i));
        }
        return isSanh;
    },

    getCombination(arr: BaseCard[], n: number, r: number, vectorCombinations: Array<BaseCard[]>): void {
        // A temporary array to store all combination one by one
        var data = [];
        for (var i = 0; i < r; i++) {
            let card = cc.instantiate(SHWESHANController.instance.prfCard).getComponent(BaseCard);
            card.setTextureWithCode(8);
            data.push(card);
        }

        // Print all combination using temprary array 'data[]'
        CardLogic.combinationUtil(arr, data, 0, n - 1, 0, r, vectorCombinations);
    },

    combinationUtil(arr: BaseCard[], data: BaseCard[], start: number,
        end: number, index: number, r: number, vectorCombinations: Array<BaseCard[]>): void {
        // Current combination is ready to be printed, print it
        if (index == r) {
            var temp = [];
            for (var j = 0; j < r; j++) {
                temp.push(data[j]);
            }
            vectorCombinations.push(temp);
            return;
        }

        // replace index with all possible elements. The condition
        // "end-i+1 >= r-index" makes sure that including one element
        // at index will make a combination with remaining elements
        // at remaining positions
        for (var i = start; i <= end && end - i + 1 >= r - index; i++) {
            data[index] = arr[i];
            CardLogic.combinationUtil(arr, data, i + 1, end, index + 1, r, vectorCombinations);
        }
    },

    getRecommendCards(list: BaseCard[], myCards: BaseCard[]): BaseCard[] {
        // luon nho phai sort list
        //    list.Sort(ComparisionTienLen);
        CardLogic.sortVector(list, false);

        var cards: BaseCard[] = [];
        if (list.length == 1) {
            var card = list[0];
            if (card.N === 15) { // neu la 2
                // tim cay 2 lon hon
                for (var i = 0; i < myCards.length; i++) {
                    var icard = myCards[i];
                    if (icard.N === 15 && icard.S > card.S) {
                        cards.push(icard);
                        return cards;
                    }
                }
                // tim tu quy
                cards = CardLogic.getHigherFours(0, myCards);
                if (cards.length > 0)
                    return cards;

                // tim 4 doi thong
                // vi tim 4 doi thong bat ky nen cho card_max = 3 bich

                //            GameCard *cmax = new GameCard();
                var cmax = cc.instantiate(SHWESHANController.instance.prfCard).getComponent(BaseCard);
                cmax.setTextureWithCode(8);

                cards = CardLogic.getHigherFourPairs(cmax, myCards);
                if (cards.length > 0)
                    return cards;

                // tim 3 doi thong
                return CardLogic.getHigherThreePairs(cmax, myCards);
            }
            else {
                for (var i = 0; i < myCards.length; i++) {
                    var c = myCards[i];
                    if (c.N > card.N) {
                        cards.push(c);
                        break;
                    }
                    if (c.N === card.N && c.S > card.S) {
                        cards.push(c);
                        break;
                    }
                }
            }
            return cards;
        }
        else if (CardLogic.isPairs(list)) {
            // tim doi 2 lon hon
            cards = CardLogic.getHigherPairs(list, myCards);

            if (cards.length > 0) {
                return cards;
            }
            else if (list[0].N === 15) {
                // neu la doi 2
                // tim tu quy
                cards = CardLogic.getHigherFours(0, myCards);
                if (cards.length > 0) {
                    return cards;
                }

                // tim 4 doi thong
                // vi tim 4 doi thong bat ky nen cho card_max = 3 bich
                var cmax = cc.instantiate(SHWESHANController.instance.prfCard).getComponent(BaseCard);
                cmax.setTextureWithCode(8);


                cards = CardLogic.getHigherFourPairs(cmax, myCards);
                if (cards.length > 0)
                    return cards;
            }
        }
        else if (CardLogic.isThreeOfAKind(list)) {
            return CardLogic.getHigherThrees(list, myCards);
        }
        else if (CardLogic.isFourOfAKind(list)) {
            cards = CardLogic.getHigherFoursList(list, myCards);
            if (cards.length > 0) {
                return cards;
            }

            // tim 4 doi thong
            // vi tim 4 doi thong bat ky nen cho card_max = 3 bich
            var cmax = cc.instantiate(SHWESHANController.instance.prfCard).getComponent(BaseCard);
            cmax.setTextureWithCode(8);

            cards = CardLogic.getHigherFourPairs(cmax, myCards);
            if (cards.length > 0)
                return cards;
            //        return getHigherFours(list, myCards);
        }
        else if (CardLogic.isThreePairsStraight(list)) {
            cards = CardLogic.getHigherFourPairsList(list, myCards);
            if (cards.length < 1)
                cards = CardLogic.getHigherThreePairsList(list, myCards);
            if (cards.length < 1) {
                var cmax = cc.instantiate(SHWESHANController.instance.prfCard).getComponent(BaseCard);
                cmax.setTextureWithCode(8);
                cards = CardLogic.getHigherFourPairs(cmax, myCards);
            }
            if (cards.length < 1)
                return CardLogic.getHigherFours(0, myCards);
        }
        else if (CardLogic.isStraight(list)) {
            return CardLogic.getHigherStraight(list, myCards);
        }
        else if (CardLogic.isFourPairsStraight(list)) {
            return CardLogic.getHigherFourPairsList(list, myCards);
        }
        return cards;
    },

    getHigherFoursList(list: BaseCard[], myCards: BaseCard[]): BaseCard[] {
        return CardLogic.getHigherFours(list[0].N, myCards);
    },

    getHigherThrees(list: BaseCard[], myCards: BaseCard[], sam: boolean = false): BaseCard[] {
        if (sam === undefined) sam = false;
        var threes = [];
        if (myCards.length < 3)
            return threes;
        CardLogic.sortVector(myCards, false);

        for (var i = 0; i < myCards.length - 2; i++) {
            if (myCards[i].N < list[0].N)
                continue;
            if (myCards[i].N === list[0].N && sam)
                continue;
            if ((myCards[i].N === myCards[i + 1].N) && (myCards[i + 1].N === myCards[i + 2].N)) {
                if (myCards[i].N === list[0].N) {
                    if (myCards[i + 2].S > list[2].S) {
                        threes.push(myCards[i]);
                        threes.push(myCards[i + 1]);
                        threes.push(myCards[i + 2]);
                        return threes;
                    }
                }
                else {
                    threes.push(myCards[i]);
                    threes.push(myCards[i + 1]);
                    threes.push(myCards[i + 2]);
                    return threes;
                }
            }
        }
        return threes;
    },

    getHigherFours(n: number, myCards: BaseCard[]): BaseCard[] {
        var fours = [];
        if (myCards.length < 4)
            return fours;
        CardLogic.sortVector(myCards, false);

        for (var i = 0; i < myCards.length - 3; i++) {
            if (myCards[i].N < n)
                continue;
            if ((myCards[i].N === myCards[i + 1].N) && (myCards[i + 1].N === myCards[i + 2].N) && (myCards[i + 2].N === myCards[i + 3].N)) {
                fours.push(myCards[i]);
                fours.push(myCards[i + 1]);
                fours.push(myCards[i + 2]);
                fours.push(myCards[i + 3]);
                return fours;
            }
        }
        return fours;
    },

    getHigherPairs(list: BaseCard[], myCards: BaseCard[], sam: boolean = false): BaseCard[] {
        if (sam === undefined) sam = false;
        var pairs = [];
        if (myCards.length < 2)
            return pairs;
        CardLogic.sortVector(myCards, false);

        //		Debug.LogError("N :"+ list[0).N);
        for (var i = 0; i < myCards.length - 1; i++) {
            if (myCards[i].N < list[0].N)
                continue;
            if (myCards[i].N === list[0].N && sam)
                continue;
            if (myCards[i].N === myCards[i + 1].N) {
                if (myCards[i].N === list[0].N) {
                    if (myCards[i + 1].S > list[1].S) {
                        pairs.push(myCards[i]);
                        pairs.push(myCards[i + 1]);
                        return pairs;
                    }
                }
                else {
                    pairs.push(myCards[i]);
                    pairs.push(myCards[i + 1]);
                    return pairs;
                }
            }
        }
        return pairs;
    },

    getHigherThreePairsList(list: BaseCard[], myCards: BaseCard[], sam: boolean = false): BaseCard[] {
        if (sam === undefined) sam = false;
        return CardLogic.getHigherThreePairs(list[list.length - 1], myCards, sam);
    },

    getHigherThreePairs(cmax: BaseCard, myCardsIn: BaseCard[], sam: boolean = false): BaseCard[] {
        if (sam === undefined) sam = false;
        // bo tat ca cac xam va tu quy trong list cua minh
        CardLogic.sortVector(myCardsIn, false);

        var myCards = CardLogic.loaiboxamvatuquy(myCardsIn);

        var sixs = [];
        if (myCards.length < 6)
            return sixs;
        for (var i = 0; i < myCards.length - 5; i++) {
            if (myCards[i].N < (cmax.N - 2))
                continue;
            if (myCards[i].N === (cmax.N - 2) && sam)
                continue;
            if ((myCards[i].N === myCards[i + 1].N)
                && (myCards[i].N === myCards[i + 2].N - 1)
                && (myCards[i].N === myCards[i + 3].N - 1)
                && (myCards[i].N === myCards[i + 4].N - 2)
                && (myCards[i].N === myCards[i + 5].N - 2)
                && myCards[i + 5].N !== 15) {

                if (myCards[i].N == (cmax.N - 2)) {
                    if (myCards[i + 5].S > cmax.S) {
                        sixs.push(myCards[i]);
                        sixs.push(myCards[i + 1]);
                        sixs.push(myCards[i + 2]);
                        sixs.push(myCards[i + 3]);
                        sixs.push(myCards[i + 4]);
                        sixs.push(myCards[i + 5]);
                        return sixs;
                    }
                }
                else {
                    sixs.push(myCards[i]);
                    sixs.push(myCards[i + 1]);
                    sixs.push(myCards[i + 2]);
                    sixs.push(myCards[i + 3]);
                    sixs.push(myCards[i + 4]);
                    sixs.push(myCards[i + 5]);
                    return sixs;
                }
            }
        }
        return sixs;
    },


    getHigherFourPairsList(list: BaseCard[], myCards: BaseCard[], sam: boolean = false): BaseCard[] {
        if (sam === undefined) sam = false;
        return CardLogic.getHigherFourPairs(list[list.length - 1], myCards, sam);
    },

    getHigherFourPairs(cmax: BaseCard, myCardsIn: BaseCard[], sam: boolean = false): BaseCard[] {
        if (sam === undefined) sam = false;
        // bo tat ca cac xam va tu quy trong list cua minh
        //    myCardsIn.Sort(ComparisionTienLen);
        CardLogic.sortVector(myCardsIn, false);

        var myCards = CardLogic.loaiboxamvatuquy(myCardsIn);
        //		Debug.LogError("cmax: "+ cmax.N +" S: "+ cmax.S);

        var eights = [];
        if (myCards.length < 8)
            return eights;
        for (var i = 0; i < myCards.length - 7; i++) {
            if (myCards[i].N < (cmax.N - 3))
                continue;
            if (myCards[i].N === (cmax.N - 3) && sam)
                continue;
            if ((myCards[i].N === myCards[i + 1].N)
                && (myCards[i].N === myCards[i + 2].N - 1)
                && (myCards[i].N === myCards[i + 3].N - 1)
                && (myCards[i].N === myCards[i + 4].N - 2)
                && (myCards[i].N === myCards[i + 5].N - 2)
                && (myCards[i].N === myCards[i + 6].N - 3)
                && (myCards[i].N === myCards[i + 7].N - 3)) {
                if (myCards[i].N === (cmax.N - 3)) {
                    if (myCards[i + 7].S > cmax.S) {
                        eights.push(myCards[i]);
                        eights.push(myCards[i + 1]);
                        eights.push(myCards[i + 2]);
                        eights.push(myCards[i + 3]);
                        eights.push(myCards[i + 4]);
                        eights.push(myCards[i + 5]);
                        eights.push(myCards[i + 6]);
                        eights.push(myCards[i + 7]);
                        return eights;
                    }
                }
                else {
                    eights.push(myCards[i]);
                    eights.push(myCards[i + 1]);
                    eights.push(myCards[i + 2]);
                    eights.push(myCards[i + 3]);
                    eights.push(myCards[i + 4]);
                    eights.push(myCards[i + 5]);
                    eights.push(myCards[i + 6]);
                    eights.push(myCards[i + 7]);
                    return eights;
                }
            }
        }
        return eights;
    },

    loaiboxamvatuquy(myCardsIn: BaseCard[]): BaseCard[] {
        // luu y myCardsIn da sort

        CardLogic.sortVector(myCardsIn, false);

        var list = [];
        var n = 0;
        var c = 0; // so lan gap cay n
        // danh sach nhung cay bai bi bo
        for (var i = 0; i < myCardsIn.length; i++) {
            if (n === myCardsIn[i].N) {
                c++;
                if (c < 3)
                    list.push(myCardsIn[i]);
            } else {
                c = 1;
                n = myCardsIn[i].N;
                list.push(myCardsIn[i]);
            }
        }
        // sort lai input list
        //    myCardsIn.Sort(ComparisionTienLen);
        CardLogic.sortVector(myCardsIn, false);
        return list;
    },


    //LOGIC SAMMMMMMMMMMMMMMMMMMMMMMMM
    getRecommendCards_Sam(list: BaseCard[], myCards: BaseCard[]): BaseCard[] {
        // luon nho phai sort list
        //    list.Sort(ComparisionTienLen);
        CardLogic.sortVector(list, false);

        var cards: BaseCard[] = [];
        if (list.length == 1) {
            var card = list[0];
            if (card.N === 15) { // neu la 2
                // tim tu quy
                return CardLogic.getHigherFours(0, myCards);
            }
            else {
                for (var i = 0; i < myCards.length; i++) {
                    var c = myCards[i];
                    if (c.N > card.N) {
                        cards.push(c);
                        break;
                    }
                }
            }
            return cards;
        }
        else if (CardLogic.isPairs(list)) {
            // tim doi lon hon
            if (list[0].N == 15) // doi 2
            {
                cards = CardLogic.getTwoFour(list);
                if (cards.length > 0)
                    return cards;
            } else
                return CardLogic.getHigherPairs(list, myCards, true);
        }
        else if (CardLogic.isThreeOfAKind(list)) {
            return CardLogic.getHigherThrees(list, myCards, true);
        }
        else if (CardLogic.isFourOfAKind(list)) {
            return CardLogic.getHigherFoursList(list, myCards);
        }
        else if (CardLogic.isStraight_Sam(list)) {
            return CardLogic.getHigherStraight_Sam(list, myCards, true);
        }
        return cards;
    },

    getTwoFour(list: BaseCard[]): BaseCard[] {
        var _vectorCombinationOfCards = [];

        CardLogic.getCombination(list, list.length, 8, _vectorCombinationOfCards);
        for (var i = 0; i < _vectorCombinationOfCards.length; i++) {
            if (CardLogic.isTwoFour(_vectorCombinationOfCards[i])) {
                return _vectorCombinationOfCards[i];
            }
        }
        return [];
    },

    getHigherStraight_Sam(list: BaseCard[], myCardsIn: BaseCard[], sam: boolean = false): BaseCard[] {
        if (sam === undefined) sam = false;
        var myCards = CardLogic.loaiboxamdoivatuquy(myCardsIn);
        CardLogic.sortVector(myCards, false);

        var straight = [];
        if (myCards.length < list.length)
            return straight;

        var myCardsValues = [];
        var listValues = [];

        var containsA = false;

        if (list[list.length - 2].N == 14) { //kiem tra co A va 2 hay ko
            containsA = true;
        }

        for (let i = 0; i < myCards.length; i++) {
            let n = myCards[i].N;
            if (n == 15) {
                n = 2;
            }
            myCardsValues.push(n);
        }
        for (let i = 0; i < list.length; i++) {
            let n = list[i].N;
            if (n == 15) {
                n = 2;
            }
            if (containsA && n == 14) {
                n = 1;
            }
            listValues.push(n);
        }
        CardLogic.sortList(myCardsValues);
        CardLogic.sortList(listValues);

        var check = -1;
        for (var i = 0; i < myCardsValues.length; i++) {
            if (myCardsValues[i] > listValues[0]) {
                var maxMyCardValuesSize = myCardsValues.length - i;
                if (maxMyCardValuesSize < listValues.length) {
                    break;
                }
                else {
                    var temp1 = listValues.length - 1;
                    var temp2 = myCardsValues[i + temp1] - myCardsValues[i];
                    if (temp1 == temp2) {
                        check = i;
                        break;
                    }
                }
            }
        }

        if (check != -1) {
            for (var i = check; i < (check + listValues.length); i++) {
                for (var j = 0; j < myCards.length; j++) {
                    var n = myCards[j].N;
                    if (n == 15) {
                        n = 2;
                    }

                    if (n == myCardsValues[i]) {
                        straight.push(myCards[j]);
                        break;
                    }
                }
            }
        }

        return straight;
    },

    isTwoFour(list: BaseCard[]): boolean {
        CardLogic.sortVector(list, false);
        return (list[0].N == list[1].N &&
            list[0].N == list[2].N &&
            list[0].N == list[3].N) &&
            (list[4].N == list[5].N &&
                list[4].N == list[6].N &&
                list[4].N == list[7].N);

    },

    getCardScore(list){
        let score = -1;
        let slot1 = this.getScore(list[0],list[1],list[2])
        let slot2 = this.getScore(list[3],list[4]);
        if(slot1 == 10){
            score = slot2;
        }
        return score;
    },

    checkBoolay(list){
        let score = 0;
        let card1 = list[0];
        let card2 = list[1];
        let card3 = list[2];
        let card4 = list[3];
        let card5 = list[4];
        score = (Math.floor(card1 / 4) + 1 + Math.floor(card2 / 4) + 1 + Math.floor(card3 / 4) + 1 + Math.floor(card4 / 4) + 1 + Math.floor(card5 / 4) + 1);
        if(score == 10){
            return true;
        }
        return false
    },
    getScore(card1 = 0, card2 = 0, card3 = -4){
        let score = 0;
        score = (Math.floor(card1 / 4) + 1 + Math.floor(card2 / 4) + 1 + Math.floor(card3 / 4) + 1) % 10;
        if(score == 0){
            score = 10;
        }
        return score
    },

    checkMultipleBet(list){
        if(list.length > 2){
            //checksuit
            if(this.getSingleSuit(list[0]) == this.getSingleSuit(list[1]) && this.getSingleSuit(list[0]) == this.getSingleSuit(list[2])){
                return 3;
            }else if(this.getSingleRank(list[0]) == this.getSingleRank(list[1]) && this.getSingleRank(list[0]) == this.getSingleRank(list[2])){
                return 5;
            }
        }else{
            if(this.getSingleSuit(list[0]) == this.getSingleSuit(list[1])){
                return 2;
            }
        }
        return 1;
    },

    getSingleScore(idxCard){
        let score = 0;
        if((Math.floor(idxCard / 4) + 1) >= 10 ){
            score = 0;
        }else{
            score = Math.floor(idxCard / 4) + 1
        }
        return score
    },

    getSingleRank(idxCard){
        let rank = 0;
        rank = Math.floor(idxCard / 4) + 1
        if(rank == 1){
            rank = 14;
        }
        return rank
    },

    getSingleSuit(idxCard){
        let suit = -1;
        return idxCard % 4 + 1
    }
}


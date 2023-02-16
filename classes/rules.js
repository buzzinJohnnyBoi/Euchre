class rules {
    static trickend(game) {
        var cards = game.playArea.cards.slice();
        temp123.push(game.playArea.cards.slice());//delteras;ldkf
        var trump = false;
        var highestCardIndex = 0;
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            if(card.suit == game.trump || (card.value == game.trumpOrder.bower && card.suit == game.trumpOrder[game.trump])) {
                trump = true;
                break;
            }
        }
        if(trump) {
            var order = [];
            var leftIndex = game.trumpOrder.order.indexOf(game.trumpOrder.bower);
            highestCardIndex = -1;
            var orderIndex = -1;
            for (let i = 0; i < game.trumpOrder.order.length; i++) {
                if(i == leftIndex) {
                    order.push(new card(game.trumpOrder.order[i], game.trumpOrder[game.trump]));
                }
                else {
                    order.push(new card(game.trumpOrder.order[i], game.trump));
                }
            }
            for (let i = 0; i < cards.length; i++) {
                for (let j = 0; j < order.length; j++) {
                    if(cards[i].suit == order[j].suit && cards[i].value == order[j].value) {
                        if(j > orderIndex) {
                            highestCardIndex = i;
                            orderIndex = j;
                            break;
                        }
                    }
                }
            }
        }
        else {
            var cardLeadIndex = game.playArea.lastPlayindex - 1;
            if(cardLeadIndex <= -1) {
                cardLeadIndex += game.players.length;
            }
            var leadSuit = cards[cardLeadIndex].suit;

            for (let i = 1; i < cards.length; i++) {
                if(leadSuit == cards[i].suit && game.order.indexOf(cards[highestCardIndex].value) < game.order.indexOf(cards[i].value)) {
                    highestCardIndex = i;
                }
            }
        }
        game.players[highestCardIndex].tricks++;
        game.leadIndex = highestCardIndex;
        game.leadSuit = null;
        game.playArea.lastPlayindex = null;
        for (let i = 0; i < game.playArea.cards.length; i++) {
            game.playArea.cards[i] = null;                
        }
    }
    static playCard(game, player, card) {
        if(game.leadSuit == null) {
            if(game.leadIndex == player.id) {
                if(game.trumpOrder.bower == card.value && game.trumpOrder[game.trump] == card.suit) {
                    game.leadSuit = game.trump;
                }
                else {
                    game.leadSuit = card.suit;
                }
                return true;
            }
        }
        else {
            if((card.suit == game.leadSuit && (card.value != game.trumpOrder.bower || card.suit != game.trumpOrder[game.trump])) || (game.trump == game.leadSuit && game.trumpOrder.bower == card.value && game.trumpOrder[game.trump] == card.suit)) {
                return true;
            }
            for (let index = 0; index < player.cards.length; index++) {
                const handcard = player.cards[index];
                if((handcard.suit == game.leadSuit && (handcard.value != game.trumpOrder.bower || handcard.suit != game.trumpOrder[game.trump])) || (game.trump == game.leadSuit && game.trumpOrder.bower == handcard.value && game.trumpOrder[game.trump] == handcard.suit)) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }
    static scoring(teams, madeArray, totalTricks) {
        for (let i = 0; i < teams.length; i++) {
            if(madeArray[i].made) {
                if(madeArray[i].tricks == totalTricks) {
                    teams[i].score += 2;
                }
                else if(madeArray[i].tricks > totalTricks/2) {
                    teams[i].score += 1;
                }
            }       
            else {
                if(madeArray[i].tricks > totalTricks/2) {
                    teams[i].score += 2;
                }
            }     
        }
    }
}
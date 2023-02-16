class card {
    constructor(value, suit) {
        this.value = value;
        this.suit = suit;
    }
}

class deck {
    constructor(values, suits) {
        let deck = [];
        for (let i = 0; i < suits.length; i++) {
            for (let j = 0; j < values.length; j++) {
                deck.push(new card(values[j], suits[i]));
            }       
        }
        this.cards = deck;
    }
    shuffle() {
        var cards = [...this.cards];
        var shuffledDeck = [];
        while(cards.length != 0) {
            var rand = this.random(0, cards.length - 1);
            shuffledDeck.push(cards[rand]);
            cards.splice(rand, 1);
        }
        return shuffledDeck;
    }
    random(min, max) {
        return Math.round(Math.random() * (max - min)) + min;
    }
}

class player {
    constructor(id, x, y, angle) {
        this.id = id;
        this.name = undefined;
        this.tricks = 0;
        this.cards = [];
        this.x = x;
        this.y = y;
        this.angle = angle;
    }
}



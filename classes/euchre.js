var temp123 = []; //delte

class Euchre {
    constructor(values, trumpvalues, suits, numplayers, playerTeams, numcards, cardSize, cardHeight, playerSize) {
        this.deck = new deck(values, suits);
        this.cardSize = cardSize;
        this.cardHeight = cardHeight;
        this.playerSize = playerSize;
        var players = [];
        var angleInc = Math.PI * 2 / numplayers;
        var w = canvas.width/2;
        for (let i = 0; i < numplayers; i++) {
            const ang = i * angleInc;
            players.push(new player(i, Math.sin(ang) * (w - playerSize/2) + w, Math.cos(ang) * (w - playerSize/2) + w, -ang));            
        }
        this.playArea = {
            x: w,
            y: w,
            w: w,
            h: w,
            angle: 0,
            cards: [],
            lastPlayindex: null
        }
        for (let i = 0; i < numplayers; i++) {
            this.playArea.cards.push(null);
        }
        this.players = players;
        this.numcards = numcards;
        this.remainingCards = [];
        this.teams = []
        for (let i = 0; i < playerTeams.length; i++) {
            var name = "";
            for (let j = 0; j < playerTeams[i].players.length; j++) {
                name +=  playerTeams[i].players[j] + "|";               
            }
            this.teams.push({
                score: 0,
                madeIt: false,
                players: playerTeams[i].players,
                name: name,
                color: playerTeams[i].color
            });            
        }
        this.dealerIndex = 0;//maybe cahgne
        this.stage = 0;
        this.menu = {
            w: 200,
            h: 200,
            stage: [
                ["take it up", "pass"],
                ["C", "S", "H", "D", "pass"], // change this
                ["go alone", "play with partner"],

            ],
            instruct: [
                [],
                [
                    {
                        type: "make", suit: "C"
                    },
                    {
                        type: "make", suit: "S"
                    },
                    {
                        type: "make", suit: "H"
                    },
                    {
                        type: "make", suit: "D"
                    },
                    {
                        type: "pass",
                    },
                ],
                [
                    {
                        type: "alone", bool: true
                    },
                    {
                        type: "alone", bool: false
                    },
                ]
            ]
        }
        this.makeIndex = 3; //change
        this.leadIndex = 3;//change
        this.selectedCard = {playerIndex: -1, playerCardIndex: -1}
        this.leadSuit = null;
        this.trump = "S";
        this.order = values;
        this.trumpOrder = trumpvalues;
    }
    deal() {
        var shuffledDeck = this.deck.shuffle();
        let cardindex = 0;
        for (let i = 0; i < this.numcards; i++) {
            for (let j = 0; j < this.players.length; j++) {
                this.players[j].cards.push(shuffledDeck[cardindex]);
                cardindex++;
            }
        }
        while(shuffledDeck.length > cardindex) {
            this.remainingCards.push(shuffledDeck[cardindex]);
            cardindex++;
        }
        this.trump = this.remainingCards[0].suit;
    }
    newHand() {
        this.dealerIndex = this.normalizeIndex(--this.dealerIndex);
        this.makeIndex = this.dealerIndex;
        if(!this.hasCards()) {
            var made = []
            for (let i = 0; i < this.teams.length; i++) {
                made.push({index: i, made: this.teams[i].madeIt, tricks: this.teamTricks(i)});
            }
            rules.scoring(this.teams, made, this.numcards)
            this.makeIndex = this.normalizeIndex(this.makeIndex - 1);
        }
        else {
            this.makeIndex = this.normalizeIndex(this.makeIndex);
        }
        this.leadIndex = this.dealerIndex - 1;
        this.leadIndex = this.normalizeIndex(this.leadIndex);
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].cards = [];            
            this.players[i].tricks = 0;
        }
        this.remainingCards = [];
        for (let i = 0; i < this.teams.length; i++) {
            this.teams[i].madeIt = false;            
        }
        this.deal();
        this.stage = 0;
    }
    normalizeIndex(index) {
        if(index < 0) {
            index += this.players.length;
        }
        else if(index > this.players.length - 1) {
            index += this.players.length;
        }
        return index;
    }
    hasCards() {
        for (let i = 0; i < this.players.length; i++) {
            if(this.players[i].cards.length != 0) {
                return true;
            }
        }
        return false;
    }
    teamTricks(index) {
        var total = 0;
        for (let i = 0; i < this.teams[index].players.length; i++) {
            const player = this.players[this.teams[index].players[i]];
            total += player.tricks;
        }
        return total;
    }
    update(mousex, mousey) {
        if(this.selectedCard.playerIndex != -1) {
            var i = this.selectedCard.playerIndex;
            var j = this.selectedCard.playerCardIndex;
            const numcards = (this.players[i].cards.length - 1)/2;
            var x = (this.cardSize + 1) * (j - numcards) * Math.cos(this.players[i].angle) + this.players[i].x;
            var y = (this.cardSize + 1) * (j - numcards) * Math.sin(this.players[i].angle) + this.players[i].y;
            
            var case1;
            var case2;
            if(this.players[i].angle == 0) {
                case1 = mousex - x > this.cardSize && Math.abs(y - mousey) < this.cardHeight * 2;
                case2 = x - mousex > this.cardSize && Math.abs(y - mousey) < this.cardHeight * 2;
            }
            else if(this.players[i].angle == -Math.PI/2) {
                case1 = y - mousey > this.cardSize && Math.abs(x - mousex) < this.cardHeight * 2;
                case2 = mousey - y > this.cardSize && Math.abs(x - mousex) < this.cardHeight * 2;
            }
            else if(this.players[i].angle == -Math.PI) {
                case1 = x - mousex > this.cardSize && Math.abs(y - mousey) < this.cardHeight * 2;
                case2 = mousex - x > this.cardSize && Math.abs(y - mousey) < this.cardHeight * 2;
            }
            else {
                case1 = mousey - y > this.cardSize && Math.abs(x - mousex) < this.cardHeight * 2;
                case2 = y - mousey > this.cardSize && Math.abs(x - mousex) < this.cardHeight * 2;
            }
            if(case1) {
                if(j < this.players[i].cards.length - 1) {
                    var temp = this.players[i].cards[j];
                    this.players[i].cards[j] = this.players[i].cards[j + 1];
                    this.players[i].cards[j + 1] = temp;
                    this.selectedCard.playerCardIndex++;
                }
            }
            else if(case2) {
                if(j > 0) {
                    var temp = this.players[i].cards[j];
                    this.players[i].cards[j] = this.players[i].cards[j - 1];
                    this.players[i].cards[j - 1] = temp;
                    this.selectedCard.playerCardIndex--;
                }
            }
        }
        this.draw(mousex, mousey);
    }
    draw(mousex, mousey) {
        draw.score(0, 0, 45, 100, this.teams);
        draw.rect(this.playArea.x - this.playArea.w/2, this.playArea.y - this.playArea.h/2, this.playArea.w, this.playArea.h, "gray", 3);
        draw.fillRect(this.playArea.x - this.playArea.w/2, this.playArea.y - this.playArea.h/2, this.playArea.w, this.playArea.h, "#524342");
        if(this.stage != 1) {
            draw.trump(this.playArea.x - this.playArea.w/4, this.playArea.y + this.playArea.h/3, this.playArea.w, this.trump);
        }
        else {
            draw.trump(this.playArea.x - this.playArea.w/4, this.playArea.y + this.playArea.h/3, this.playArea.w, null);
        }
        var inc = (2 * Math.PI)/(this.players.length);
        for (let i = 0; i < this.playArea.cards.length; i++) {
            const card = this.playArea.cards[i];
            if(card != null) {
                draw.card(this.playArea.x + Math.sin(i * inc) * this.playArea.w/4, this.playArea.y + Math.cos(i * -inc) * this.playArea.w/4, this.cardSize, this.cardHeight, i * -inc, "white", card);       
            }
        }
        for (let i = 0; i < this.players.length; i++) {
            draw.player(this.teams, this.players[i], this.playerSize)
            const numcards = (this.players[i].cards.length - 1)/2;
            for (let j = 0; j < this.players[i].cards.length; j++) {
                const card = this.players[i].cards[j];
                if(i == this.selectedCard.playerIndex && j == this.selectedCard.playerCardIndex) {
                    draw.card(mousex, mousey, this.cardSize, this.cardHeight, this.players[i].angle, "gray", card);                
                }
                else {
                    draw.card((this.cardSize + 1) * (j - numcards) * Math.cos(this.players[i].angle) + this.players[i].x, (this.cardSize + 1) * (j - numcards) * Math.sin(this.players[i].angle) + this.players[i].y, this.cardSize, this.cardHeight, this.players[i].angle, "white", card);                

                }
            } 
            for (let j = 0; j < this.players[i].tricks; j++) {
                draw.card(this.players[i].x - (this.cardSize + 1) * (j - this.numcards) * Math.cos(this.players[i].angle) + Math.cos(this.players[i].angle) * j * this.cardSize / 2, this.players[i].y - (this.cardSize + 1) * (j - this.numcards) * Math.sin(this.players[i].angle) + Math.sin(this.players[i].angle) * j * this.cardSize / 2, this.cardSize, this.cardHeight, this.players[i].angle, "white", null, false);                
            }       

        }
        if(this.stage == 0) {
            draw.card(this.cardSize * -(this.numcards/2 + 1.5) * Math.cos(this.players[this.dealerIndex].angle) + this.players[this.dealerIndex].x, this.cardSize * -(this.numcards/2 + 1.5) * Math.sin(this.players[this.dealerIndex].angle) + this.players[this.dealerIndex].y, this.cardSize, this.cardHeight, this.players[this.dealerIndex].angle, "white", this.remainingCards[0]);   
        }
        else if(this.stage != 2) {
            draw.card(this.cardSize * -(this.numcards/2 + 1.5) * Math.cos(this.players[this.dealerIndex].angle) + this.players[this.dealerIndex].x, this.cardSize * -(this.numcards/2 + 1.5) * Math.sin(this.players[this.dealerIndex].angle) + this.players[this.dealerIndex].y, this.cardSize, this.cardHeight, this.players[this.dealerIndex].angle, "white", this.remainingCards[0], false);   
        }
        if(this.stage == 0) {
            var p = this.players[this.makeIndex];
            var dimensions = {w: this.menu.w, h: this.menu.h/this.menu.stage[0].length}
            for (let i = 0; i < Math.round(this.menu.h/dimensions.h); i++) {
                //draw.menu(p.x + Math.sin(p.angle) * dimensions.w * j + Math.sin(p.angle) * dimensions.h * i + Math.sin(p.angle) * dimensions.w/2, p.y - Math.cos(p.angle) * dimensions.h + dimensions.h * i * Math.cos(p.angle) + Math.cos(p.angle) * dimensions.w * j  - Math.cos(p.angle) * dimensions.w/2, dimensions.w, dimensions.h, p.angle, this.menu.stage[0][i + j * Math.round(this.menu.w/dimensions.w)], "rgb("+ i * 100 +", 188, 19)");
                const x = p.x + Math.sin(p.angle) * dimensions.w/2 + Math.sin(p.angle) * dimensions.w/2 * i;
                const y = p.y - Math.cos(p.angle) * dimensions.h - Math.cos(p.angle) * dimensions.h * i;
                draw.menu(x, y, dimensions.w, dimensions.h, p.angle, this.menu.stage[0][i], "rgb("+ i * 5 + 200 +","+ i * 5 + 160 +", 0)");
            }
        }
        else if(this.stage == 1) {
            var p = this.players[this.makeIndex];
            var dimensions = {w: this.menu.w, h: this.menu.h/(this.menu.stage[1].length - 1)}
            var items = [];
            for (let i = 0; i < this.menu.instruct[1].length; i++) {
                if(this.menu.instruct[1][i].suit != this.trump) {
                    items.push(this.menu.stage[1][i]);
                }
            }
            for (let i = 0; i < Math.round(this.menu.h/dimensions.h); i++) {
                const x = p.x + Math.sin(p.angle) * dimensions.w/2 + Math.sin(p.angle) * dimensions.h * (i - 0.75);
                const y = p.y - Math.cos(p.angle) * dimensions.w/2 - Math.cos(p.angle) * dimensions.h * (i - 0.75);
                draw.menu(x, y, dimensions.w, dimensions.h, p.angle, items[i], "rgb("+ (i + 1) * 50 +","+ (i + 1) * 50 +", 100)");
            }
        }
        else if(this.stage == 1.5) {
            var p = this.players[this.makeIndex];
            var dimensions = {w: this.menu.w, h: this.menu.h/(this.menu.stage[2].length)}
            var items = this.menu.stage[2];
            for (let i = 0; i < Math.round(this.menu.h/dimensions.h); i++) {
                const x = p.x + Math.sin(p.angle) * dimensions.w/2 + Math.sin(p.angle) * dimensions.h * i;
                const y = p.y - Math.cos(p.angle) * dimensions.w/2 - Math.cos(p.angle) * dimensions.h * i;
                draw.menu(x, y, dimensions.w, dimensions.h, p.angle, items[i], "rgb("+ (i + 1) * 50 +","+ (i + 1) * 50 +", 100)");
            }
        }
    }
    drawSelectedCard(mousex, mousey) {
        if(this.selectedCard.playerIndex != -1) {
            var i = this.selectedCard.playerIndex;
            var j = this.selectedCard.playerCardIndex;
            const card = this.players[i].cards[j];
            draw.card(mousex, mousey, this.cardSize, this.cardHeight, this.players[i].angle, "gray", card);
        }
    }
    mouseUp(x, y) {
        var nextindex = this.playArea.lastPlayindex - 1;
        if(nextindex < 0) {
            nextindex += this.players.length;
        } 
        if(this.stage == 2 && pointInRect({x: x, y: y}, this.playArea) && this.selectedCard.playerIndex > -1 && (this.selectedCard.playerIndex == nextindex || this.playArea.lastPlayindex == null)) {
            if (rules.playCard(this, this.players[this.selectedCard.playerIndex], this.players[this.selectedCard.playerIndex].cards[this.selectedCard.playerCardIndex])) {
                this.playArea.cards[this.selectedCard.playerIndex] = this.players[this.selectedCard.playerIndex].cards[this.selectedCard.playerCardIndex];
                this.players[this.selectedCard.playerIndex].cards.splice(this.selectedCard.playerCardIndex, 1);
                this.playArea.lastPlayindex = this.selectedCard.playerIndex;
            }
            else {
                console.log("nope")
            }
            if(!this.playArea.cards.includes(null, 0)) {
                rules.trickend(this);
                if(!this.hasCards()) {
                    this.newHand();
                    console.log("team 0 2 " + this.teams[0].score)
                    console.log("team 1 3 " + this.teams[1].score)
                }
            }
        }
        if(this.stage == 0.5 && this.selectedCard.playerIndex == this.dealerIndex && this.onTurnUpCard(x, y)) {
            this.remainingCards.push(this.players[this.selectedCard.playerIndex].cards[this.selectedCard.playerCardIndex]);
            this.players[this.selectedCard.playerIndex].cards.splice(this.selectedCard.playerCardIndex, 1);
            this.stage = 1.5;
        }
        this.selectedCard = {playerIndex: -1, playerCardIndex: -1}
    }
    onclick(x, y) {
        var card = this.oncard(x, y);
        if(!!card) {
            this.selectedCard = card;
        }
        else {
            this.selectedCard = {playerIndex: -1, playerCardIndex: -1}
        }
        if(this.stage == 0) {
            var p = this.players[this.makeIndex];
            if(pointInRect({x: x, y: y}, {x: p.x + Math.sin(p.angle) * this.menu.w, y: p.y - Math.cos(p.angle) * this.menu.h, w: this.menu.w, h: this.menu.h/2, angle: p.angle})) {
                if(this.makeIndex == this.dealerIndex) {
                    this.stage = 1;
                }
                this.makeIndex--;
                if(this.makeIndex < 0) {
                    this.makeIndex += this.players.length;
                }
            }
            else if(pointInRect({x: x, y: y}, {x: p.x + Math.sin(p.angle) * this.menu.w - Math.sin(p.angle) * this.menu.w/2, y: p.y - Math.cos(p.angle) * this.menu.h + Math.cos(p.angle) * this.menu.w/2, w: this.menu.w, h: this.menu.h/2, angle: p.angle})) {
                var team = this.findTeam(p);
                this.teams[team].madeIt = true;
                this.stage = 0.5;
                this.players[this.dealerIndex].cards.push(this.remainingCards[0]);
            }
            // draw.menu(p.x + Math.sin(p.angle) * this.menu.w, p.y - Math.cos(p.angle) * this.menu.h, this.menu.w, this.menu.h, p.angle, ["take it up", "pass"]);
        }
        else if(this.stage == 1) {
            var items = [];
            for (let i = 0; i < this.menu.instruct[1].length; i++) {
                if(this.menu.instruct[1][i].suit != this.trump) {
                    items.push(this.menu.instruct[1][i]);
                }
            }
            var p = this.players[this.makeIndex];
            var rect = {
                x: p.x + Math.sin(p.angle) * this.menu.w/2 + Math.sin(p.angle) * this.menu.w/4,
                y: p.y - Math.cos(p.angle) * this.menu.h/2 - Math.cos(p.angle) * this.menu.h/4,
                w: this.menu.w,
                h: this.menu.h,
                angle: p.angle,
            }
            if(pointInRect({x: x, y: y}, rect)) {
                var h = this.menu.h/(items.length);
                var textIndex;
                rect.h = h;
                for (let i = 0; i < items.length; i++) {
                    rect.x = p.x + Math.sin(p.angle) * this.menu.h/2 + Math.sin(p.angle) * h * (i - 0.75);
                    rect.y = p.y - Math.cos(p.angle) * this.menu.h/2 - Math.cos(p.angle) * h * (i - 0.75);
                    if(pointInRect({x: x, y: y}, rect)) {
                        textIndex = i;
                        break;
                    }
                }
                if(textIndex != undefined) {
                    if("pass" == items[textIndex].type) {
                        if(this.makeIndex == this.dealerIndex) {
                            this.newHand();
                        }
                        this.makeIndex--;
                        if(this.makeIndex < 0) {
                            this.makeIndex += this.players.length;
                        }
                    }
                    else {
                        var team = this.findTeam(p);
                        this.teams[team].madeIt = true;
                        this.stage = 1.5;
                        this.trump = items[textIndex].suit;
                    }
                }
                // draw.menu(x, y, dimensions.w, dimensions.h, p.angle, this.menu.stage[1][i], "rgb("+ (i + 1) * 50 +","+ (i + 1) * 50 +", 100)");

            }
        }
        else if(this.stage == 1.5) {
            var items = this.menu.instruct[2];
            var p = this.players[this.makeIndex];
            var rect = {
                x: p.x + Math.sin(p.angle) * this.menu.w/2 + Math.sin(p.angle) * this.menu.w/4,
                y: p.y - Math.cos(p.angle) * this.menu.h/2 - Math.cos(p.angle) * this.menu.h/4,
                w: this.menu.w,
                h: this.menu.h,
                angle: p.angle,
            }
            if(pointInRect({x: x, y: y}, rect)) {
                var h = this.menu.h/(items.length);
                var textIndex;
                rect.h = h;
                for (let i = 0; i < items.length; i++) {
                    rect.x = p.x + Math.sin(p.angle) * this.menu.h/2 + Math.sin(p.angle) * h * (i);
                    rect.y = p.y - Math.cos(p.angle) * this.menu.h/2 - Math.cos(p.angle) * h * (i);
                    if(pointInRect({x: x, y: y}, rect)) {
                        textIndex = i;
                        break;
                    }
                }
                if(textIndex != undefined) {
                    console.log(items[textIndex]);
                    if("alone" == items[textIndex].type && items[textIndex].bool) {

                    }
                    else {
                        this.stage = 2;
                    }
                }
            }
        }
    }
    findTeam(player) {
        for (let i = 0; i < this.teams.length; i++) {
            if(this.teams[i].players.includes(player.id)) {
                return i;
            }          
        }
    }
    oncard(x, y) {
        for (let i = 0; i < this.players.length; i++) {
            const numcards = (this.players[i].cards.length - 1)/2;
            for (let j = 0; j < this.players[i].cards.length; j++) {
                const card = this.players[i].cards[j];

                var selectedcard = pointInRect(
                {
                    x: x,
                    y: y
                },    
                {
                    x: (this.cardSize + 1) * (j - numcards) * Math.cos(this.players[i].angle) + this.players[i].x, 
                    y: (this.cardSize + 1) * (j - numcards) * Math.sin(this.players[i].angle) + this.players[i].y, 
                    w: this.cardSize, 
                    h: this.cardHeight, 
                    angle: this.players[i].angle
                });       
                if(selectedcard) {
                    return {playerIndex: i, playerCardIndex: j};
                }
        
            }            
        }
        return false;
    }
    onTurnUpCard(x, y) {  
        if(pointInRect(
        {
            x: x,
            y: y
        },    
        {
            x: this.cardSize * -(this.numcards/2 + 1.5) * Math.cos(this.players[this.dealerIndex].angle) + this.players[this.dealerIndex].x, 
            y: this.cardSize * -(this.numcards/2 + 1.5) * Math.sin(this.players[this.dealerIndex].angle) + this.players[this.dealerIndex].y, 
            w: this.cardSize, 
            h: this.cardHeight, 
            angle: this.players[this.dealerIndex].angle
        })) {
            return true;
        }
    }
}
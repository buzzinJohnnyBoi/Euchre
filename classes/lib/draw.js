var cardback = document.querySelector("#card");


class draw {
    static card(x, y, w, h, angle, color, card, faceup = true) {
        ctx.save()
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.translate(-x, -y);
        
        
        
        if(faceup) {
            this.fillRect(x - w/2, y - h/2, w, h, color);
            ctx.font = "20px Arial";
            var text = card.value; 
            if(card.suit == "C") {
                text += "♣";
                ctx.fillStyle = "black";
            }
            else if(card.suit == "D") {
                text += "♦";
                ctx.fillStyle = "red";
            }
            else if(card.suit == "H") {
                text += "♥";
                ctx.fillStyle = "red";
            }
            else if(card.suit == "S") {
                text += "♠";
                ctx.fillStyle = "black";
            }
            ctx.fillText(text, x - w/3, y);
        }
        else {
            ctx.drawImage(cardback, x - w/2, y - h/2, w, h);
        }
    
    
        ctx.translate(-x, -y);
        ctx.rotate(-angle);
        ctx.restore();
    }
    static player(teams, player, size) {
        for (let i = 0; i < teams.length; i++) {
            if(teams[i].players.includes(player.id)) {
                this.fillRect(player.x - size/2, player.y - size/2, size, size, teams[i].color);
            }
        }
    }
    static fillRect(x, y, w, h, color) {
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
        ctx.stroke();
    }
    static rect(x, y, w, h, color, linewidth, context = ctx) {
        context.lineJoin = "round";
        context.beginPath();
        context.lineWidth = "" + linewidth + "";
        context.strokeStyle = color;
        context.rect(x, y, w, h);
        context.stroke();
    }
    static menu(x, y, w, h, angle, text, color) {
        ctx.save()
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.translate(-x, -y);
        
        this.fillRect(x - w/2, y - h/2, w, h, color); 
        ctx.font = "20px Arial";
        ctx.fillStyle = "black";
        // var inc = h/(text.length - 1);
        ctx.fillText(text, x - w/3, y - h/3 + 20);


        ctx.translate(-x, -y);
        ctx.rotate(-angle);
        ctx.restore();
    }
    static trump(x, y, w, trump) {
        ctx.font = w + "px Arial";
        var text;
        if(trump == "C") {
            text = "♣";
            ctx.fillStyle = "black";
        }
        else if(trump == "D") {
            text = "♦";
            ctx.fillStyle = "red";
        }
        else if(trump == "H") {
            text = "♥";
            ctx.fillStyle = "red";
        }
        else if(trump == "S") {
            text = "♠";
            ctx.fillStyle = "black";
        }
        else {
            text = "?";
            ctx.fillStyle = "pink";
        }
        ctx.fillText(text, x, y);
    }
    static drawLine(x1, y1, x2, y2, stroke = 'black', width = 3) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = stroke;
        ctx.lineWidth = width;
        ctx.stroke();
    }
    static score(x, y, w, height, teams) {
        var h = height/teams.length;
        for (let i = 0; i < teams.length; i++) {
            const t = teams[i];
            this.fillRect(x, y + i * h, w, h, t.color);
            ctx.font = "20px Arial";
            ctx.fillStyle = "black";
            ctx.fillText(t.score, x - t.score.toString().length * 5 + 25, y + i * h + 15/2 + h/2);
        }
    }
}

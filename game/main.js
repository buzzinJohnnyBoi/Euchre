document.querySelector("body").style.backgroundColor = "rgb(10, 10, 10)";


var canvas = document.getElementById("cav1");
canvas.style.position = "absolute";
var ctx = canvas.getContext("2d");

function update() {
    updateCanvas();
    game.update(mouse.x - parseInt(canvas.style.left), mouse.y - parseInt(canvas.style.top));
}

function updateCanvas() {
    var size;
    if(window.innerHeight < window.innerWidth) {
        size = window.innerHeight;
        canvas.style.left = (window.innerWidth - size)/2 + "px";
        canvas.style.top = "0px";
    }
    else {
        size = window.innerWidth;
        canvas.style.top = (window.innerHeight - size)/2 + "px";
        canvas.style.left = "0px";
    }
    canvas.width = size;
    canvas.height = size;
    ctx.fillRect(0, 0, size, size);
}

function mouseDown() {
    var left = parseInt(canvas.style.left);
    var top = parseInt(canvas.style.top);
    
    var x = mouse.x;
    var y = mouse.y;

    var size = parseInt(canvas.width);
    if(left < x && x < left + size) {
        if(top < y && y < top + size) {
            game.onclick(mouse.x - left, mouse.y - top);
        } 
    }    
    update();
}
function mouseMove() {
    // game.drawSelectedCard(mouse.x - parseInt(canvas.style.left), mouse.y - parseInt(canvas.style.top));
    update();
}

function mouseUp() {
    game.mouseUp(mouse.x - parseInt(canvas.style.left), mouse.y - parseInt(canvas.style.top));
    update();
}

updateCanvas();
var trumpOrder = {
    order: ["9", "10", "Q", "K", "A", "J", "J"],
    bower: "J",
    "C": "S",
    "S": "C",
    "D": "H",
    "H": "D",
}
var playerTeams = [
    {
        players: [0, 2],
        color: "blue"
    },
    {
        players: [1, 3],
        color: "red"
    }
]
var game = new Euchre(["9", "10", "J", "Q", "K", "A"], trumpOrder, ["C", "S", "D", "H"], 4, playerTeams, 5, 50, 75, 100);
// var game = new Euchre(["7", "8", "9", "10", "J", "Q", "K", "A"], trumpOrder, ["C", "D", "H", "S"], 6, 5, 50, 75, 100);
game.deal();

// setInterval(update, 100)
update();
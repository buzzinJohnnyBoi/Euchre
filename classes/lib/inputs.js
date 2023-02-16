var keys = {
    "w": false,
    "a": false,
    "s": false,
    "d": false,
    " ": false,
    "x": false,
    "b": false,
    "ArrowUp": false,
    "ArrowRight": false,
    "ArrowDown": false,
    "ArrowLeft": false
}
function Keypress(e) {
    keys[e.key] = true;
}

function KeyUp(e) {
    keys[e.key] = false;
}
var mouse = {
    pressed: false,
    lastPressed: false,
    lastPos: {
        x: 0,
        y: 0
    },
    x: 0,
    y: 0
}

function MouseUp(e) {
    if(mouse.pressed == true) {
        mouse.pressed = false;
        mouseUp();
    }
}
function MouseDown(e) {
    if(mouse.pressed == false) {
        mouse.pressed = true;
        mouseDown();
    }
}

function MouseMove(e) {
    mouse.x = e.x;
    mouse.y = e.y;
    mouseMove();
}

document.addEventListener("keydown", Keypress);
document.addEventListener("keyup", KeyUp);
document.addEventListener("mouseup", MouseUp);
document.addEventListener("mousedown", MouseDown);
document.addEventListener("mousemove", MouseMove);
window.addEventListener("resize", (event) => {
    update();
});
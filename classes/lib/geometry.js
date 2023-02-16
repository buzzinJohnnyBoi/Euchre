function pointInRect(point, rect) {
    var x = Math.abs(point.x - rect.x);
    var y = Math.abs(point.y - rect.y);

    if(rect.angle == 0 || rect.angle == -Math.PI) {
        if(x <= rect.w/2 && y <= rect.h/2) {
            return true;
        }
    }
    else {
        if(x <= rect.h/2 && y <= rect.w/2) {
            return true;
        }
    }

    return false;
}

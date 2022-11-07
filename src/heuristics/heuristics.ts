

/**
 * Euclid distance (l2 norm);
 */
export const l2 = (a: any, b: any) => {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Manhattan distance (l1 norm);
 */
export const l1 = (a: any, b: any) => {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.abs(dx) + Math.abs(dy);
}


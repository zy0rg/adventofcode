const directions = {
    E: 0,
    N: 1,
    W: 2,
    S: 3,
    L: 4,
    R: 5,
    F: 6
};

const parse = (input) => input.split('\n').map((str) => [directions[str.charAt(0)], +str.substring(1)]);
const navigate = (parsed) => {
    let x = 0;
    let y = 0;
    let direction = 0;

    const instructions = [
        (range) => x += range,
        (range) => y -= range,
        (range) => x -= range,
        (range) => y += range,
        (angle) => direction = (direction + angle / 90) % 4,
        (angle) => direction = (direction - angle / 90 + 16) % 4,
        (range) => instructions[direction](range)
    ];

    parsed.forEach(([dir, range]) => instructions[dir](range));

    return [x, y];
};
const waypoint = (parsed) => {
    let shipX = 0;
    let shipY = 0;
    let x = 10;
    let y = -1;

    const rotate = (n) => {
        while (n--) {
            [x, y] = [y, -x];
        }
    };

    const instructions = [
        (range) => x += range,
        (range) => y -= range,
        (range) => x -= range,
        (range) => y += range,
        (angle) => rotate(angle / 90),
        (angle) => rotate(4 - angle / 90),
        (times) => {
            shipX += x * times;
            shipY += y * times;
        }
    ];

    parsed.forEach(([dir, range]) => instructions[dir](range));

    return [shipX, shipY];
};

export default (input) => {
    const parsed = parse(input);
    const result1 = navigate(parsed);
    const result2 = waypoint(parsed);

    return [
        Math.abs(result1[0]) + Math.abs(result1[1]),
        Math.abs(result2[0]) + Math.abs(result2[1])
    ];
}

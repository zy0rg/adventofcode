const slopes = [
    [1, 1],
    [3, 1],
    [5, 1],
    [7, 1],
    [1, 2]
];

export default (input) => {
    const parsed = input.split('\n');

    let result1;
    let result2 = 1;

    slopes.forEach(([xOffset, yOffset], i) => {
        let count = 0;

        for (let y = 0, x = 0; y < parsed.length; y += yOffset, x += xOffset) {
            const row = parsed[y];
            if (row.charAt(x % row.length) === '#') {
                count++;
            }
        }

        if (i === 1) {
            result1 = count;
        }

        result2 *= count;
    });

    return [result1, result2];
}

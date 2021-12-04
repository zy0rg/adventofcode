const parse = (input) => input.split('\n').map((str) => +str);

const solve = (raw, maxDepth) => {
    const input = new Uint16Array(raw);
    const limit = maxDepth - 1;
    const max = input.length - 1;
    const indexCutoff = max - maxDepth;
    const depthIndex = new Uint16Array(maxDepth).fill(0);
    let depth = 0;
    let index = -1;
    let left = 2020;

    do {
        index++;

        // log(index, depth);

        if (input[index] <= left) {
            if (depth === limit) {
                if (input[index] === left) {
                    depthIndex[depth] = index;
                    return depthIndex.map((index) => input[index]);
                }
            } else if (input[index] < left && index < (indexCutoff + depth)) {
                depthIndex[depth] = index;
                left -= input[index];
                depth++;
            }
        }
    } while (index !== max || (--depth >= 0 && (left += input[index = depthIndex[depth]])));

    return [];
}

export default (input) => {
    const parsed = parse(input);

    const result1 = solve(parsed, 2);
    const result2 = solve(parsed, 3);

    return [
        result1[0] * result1[1],
        result2[0] * result2[1] * result2[2]
    ];
}

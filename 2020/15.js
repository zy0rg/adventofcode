const solve = (parsed, steps) => {
    const positions = new Int32Array(steps).fill(-1);

    let num = parsed.pop();

    parsed.forEach((num, pos) => positions[num] = pos);

    let pos = parsed.length;
    let last = 0;
    const limit = steps - 1;

    while (pos < limit) {
        last = positions[num];
        positions[num] = pos;
        if (last === -1) {
            num = 0;
        } else {
            num = pos - last;
        }
        pos++;
    }

    return num;
}

const padStart = (num, length) => {
    const str = num.toString();
    return `${new Array(length - str.length).fill(' ').join('')}${str}`;
}

export default (input) => {
    const parsed = input.split(',').map((str) => +str);

    // const a = solve([1,2], 200);
    // const b = solve([2], 200);
    //
    // a.map((a, i) => console.log(padStart(a, 5), padStart(b[i], 5)));

    return [
        solve(parsed.slice(), 2020),
        solve(parsed, 30000000)
    ];
}

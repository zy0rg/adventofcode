const iterate = (current, next, steps) => {
    const max = next.length - 1;

    while (steps--) {
        let target = current;

        const one = next[current];
        const two = next[one];
        const three = next[two];

        current = next[current] = next[three];

        do {
            if (target === 0) {
                target = max;
            } else {
                target--;
            }
        } while (target === one || target === two || target === three);

        next[three] = next[target];
        next[target] = one;
    }
}

export default (input) => {
    const board = input.split('').map((str) => str - 1);
    const length = board.length;

    const first = board[0];
    const next1 = new Uint8Array(length);
    const next2 = new Uint32Array(1000000);

    let current = first;
    for (let i = 1; i < length; i++) {
        next1[current] = next2[current] = current = board[i];
    }
    next1[current] = first;

    for (let i = length; i < 999999;) {
        next2[i] = ++i;
    }
    next2[current] = length;
    next2[999999] = first;

    iterate(first, next1, 100);
    iterate(first, next2, 10000000);

    current = 0;
    const result1 = [];
    do {
        result1.push((current = next1[current]) + 1);
    } while (next1[current] !== 0);

    current = next2[0];

    return [
        result1.join(''),
        (current + 1) * (next2[current] + 1)
    ];
}

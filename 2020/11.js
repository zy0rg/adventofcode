const parse = (input) => input.split('\n');

const solve = (neighbors, tolerance) => {
    let full = 0;
    const unresolved = new Set(Array.from(neighbors, (e, i) => i));
    const neighborCount = neighbors.map((arr) => arr.length);

    do {
        const empty = [];

        for (let i of unresolved) {
            if (neighborCount[i] < tolerance) {
                full++;
                unresolved.delete(i);
                empty.push(...neighbors[i]);
            }
        }

        for (let i of new Set(empty)) {
            if (unresolved.has(i)) {
                unresolved.delete(i);
                neighbors[i].forEach((neighbor) => neighborCount[neighbor]--);
            }
        }
    } while (unresolved.size);

    return full;
};

export default (input) => {
    const parsed = parse(input);

    const width = parsed[0].length;
    const maxX = width - 1;
    const size = width * parsed.length;
    const offsetTopRight = width - 1;
    const offsetTopLeft = width + 1;

    const positions = new Int16Array(size);

    const neighbors = [];
    const visible = [];

    let index = 0;
    let id = 0;

    // const start = performance.now();

    parsed.forEach((line, y) => {
        const len = line.length;

        for (let x = 0; x < len; x++) {
            if (line[x] === 'L') {
                positions[id] = index;

                neighbors[index] = [];
                visible[index] = [];

                const add = (offset, limit) => {
                    let i = id - offset;
                    let pos = positions[i];
                    if (pos !== -1) {
                        visible[index].push(pos);
                        visible[pos].push(index);
                        neighbors[index].push(pos);
                        neighbors[pos].push(index);
                    } else {
                        while (--limit > 0) {
                            i -= offset;
                            pos = positions[i];
                            if (pos !== -1) {
                                visible[index].push(pos);
                                visible[pos].push(index);
                                break;
                            }
                        }
                    }
                };

                if (x !== 0) {
                    add(1, x);
                }
                if (y !== 0) {
                    add(width, y);
                    if (x !== 0) {
                        add(offsetTopLeft, x > y ? y: x);
                    }
                    if (x !== maxX) {
                        const limit = maxX - x;
                        add(offsetTopRight, limit > y ? y: limit);
                    }
                }

                index++;
            } else {
                positions[id] = -1;
            }
            id++;
        }
    });

    // const end = performance.now();

    const result1 = solve(neighbors, 4);
    // const end1 = performance.now();

    const result2 = solve(visible, 5);
    // const end2 = performance.now();
    // console.log(end - start, end1 - end, end2 - end1)

    return [
        result1,
        result2
    ];
}

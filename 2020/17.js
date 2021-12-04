const dimensions = 4;
const bitness = 6;

const size = 2 ** bitness;
const limit = size / 2;

const dimensionOffsets = new Int32Array(dimensions);
const dimensionNeighbors = new Array(dimensions);

let currentNeighbors = [0];
for (let i = 0, bit = 1; i < dimensions; i++, bit *= size) {
    dimensionOffsets[i] = bit;
    currentNeighbors = [
        ...currentNeighbors.map((id) => id + bit),
        ...currentNeighbors,
        ...currentNeighbors.map((id) => id - bit)
    ];
    dimensionNeighbors[i] = new Int32Array(currentNeighbors.filter((id) => id));
}

const parse = (input) => {
    const parsed = [];

    const lines = input.split('\n');

    const xOffset = Math.floor(lines[0].length / 2);
    const yOffset = Math.floor(lines.length / 2);

    const yMultiplier = dimensionOffsets[1];

    lines.map((str, y) =>
        str.split('').map((char, x) => {
            if (char === '#') {
                parsed.push((y - yOffset + limit) * yMultiplier + x - xOffset + limit)
            }
        }));

    return parsed;
}

const solve = (parsed, dimensions, steps) => {
    const toAdd = [];
    const toDelete = [];
    const field = new Set();
    const fieldNeighbors = new Map();
    const neighbors = dimensionNeighbors[dimensions - 1];

    const inc = (id) => {
        field.add(id);
        neighbors.forEach((n) => {
            n += id;

            if (fieldNeighbors.has(n)) {
                fieldNeighbors.set(n, fieldNeighbors.get(n) + 1);
            } else {
                fieldNeighbors.set(n, 1);
            }
        });
    };

    const dec = (id) => {
        field.delete(id);
        neighbors.forEach((n) => {
            n += id;
            const toDec = fieldNeighbors.get(n);
            if (toDec === 1) {
                fieldNeighbors.delete(n);
            } else {
                fieldNeighbors.set(n, toDec - 1);
            }
        });
    };

    const add = dimensionOffsets.slice(2, dimensions).reduce((res, offset) => res + offset * limit, 0);
    parsed.forEach((id) => inc(id + add));

    while (steps--) {
        fieldNeighbors.forEach((count, id) => {
            if (field.has(id)) {
                if (count < 2 || count > 3) {
                    toDelete.push(id);
                }
            } else {
                if (count === 3) {
                    toAdd.push(id);
                }
            }
        });
        field.forEach((id) => {
            if (!fieldNeighbors.has(id)) {
                toDelete.push(id);
            }
        });

        toAdd.forEach(inc);
        toDelete.forEach(dec);

        // console.log(toAdd, toDelete);
        // console.log(field.size, toAdd.length, toDelete.length);

        toAdd.length = 0;
        toDelete.length = 0;

        // console.log(field)
    }

    return field.size;
};

export default (input) => {
    const parsed = parse(input);

    return [
        solve(parsed, 3, 6),
        solve(parsed, 4, 6)
    ];
};

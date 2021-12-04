const parse = (input) => {
    const split = input.split('\n\n');
    const length = split.length;
    const gridSize = Math.sqrt(length);

    const ids = new Int16Array(length);
    const tiles = new Array(length);

    split.forEach((tile, i) => {
        const [str, ...lines] = tile.split('\n');

        ids[i] = str.substring(5, 9);
        tiles[i] = lines;
    });

    return [ids, tiles, gridSize];
};

const prepareOptions = (tiles) => {
    const size = tiles[0][0].length;
    const max = size - 1;
    const multiplier = 2 ** size;

    const bits = new Uint16Array(size);
    const reverseBits = new Uint16Array(size);

    let bit = 1;
    let reverseBit = multiplier;
    for (let i = 0; i < size; i++) {
        reverseBit /= 2;
        reverseBits[i] = reverseBit;
        bits[i] = bit;
        bit *= 2;
    }

    const byLeft = new Map();
    const byTop = new Map();
    const byTopLeft = new Map();
    const all = new Array(tiles.length * 8);

    let x = 0;

    const add = (target, id, option) => {
        if (target.has(id)) {
            target.get(id).push(option);
        } else {
            target.set(id, [option]);
        }
    }
    const addOption = (top, right, bottom, left, i) => {
        const option = [i, bottom, right];
        add(byLeft, left, option);
        add(byTop, top, option);
        add(byTopLeft, top + left * multiplier, option);
        all[x++] = option;
    }

    tiles.forEach((lines, i) => {
        const topLine = lines[0];
        const bottomLine = lines[max];

        let top = 0;
        let topReverse = 0;
        let bottom = 0;
        let bottomReverse = 0;
        let right = 0;
        let rightReverse = 0;
        let left = 0;
        let leftReverse = 0;

        for (let j = 0; j < size; j++) {
            if (topLine[j] === '#') {
                top += bits[j];
                topReverse += reverseBits[j];
            }
            if (bottomLine[j] === '#') {
                bottom += bits[j];
                bottomReverse += reverseBits[j];
            }
            if (lines[j][0] === '#') {
                left += bits[j];
                leftReverse += reverseBits[j];
            }
            if (lines[j][max] === '#') {
                right += bits[j];
                rightReverse += reverseBits[j];
            }
        }

        addOption(top, right, bottom, left, i);
        addOption(right, bottomReverse, left, topReverse, i);
        addOption(bottomReverse, leftReverse, topReverse, rightReverse, i);
        addOption(leftReverse, top, rightReverse, bottom, i);
        addOption(topReverse, left, bottomReverse, right, i);
        addOption(left, bottom, right, top, i);
        addOption(bottom, rightReverse, top, leftReverse, i);
        addOption(rightReverse, topReverse, leftReverse, bottomReverse, i);
    });

    return [all, byLeft, byTop, byTopLeft, size, multiplier];
};

const alignmentGetters = [
    (tile, x, y) => tile[y + 1][x + 1],
    (tile, x, y, limit) => tile[x + 1][limit - y],
    (tile, x, y, limit) => tile[limit - y][limit - x],
    (tile, x, y, limit) => tile[limit - x][y + 1],
    (tile, x, y, limit) => tile[y + 1][limit - x],
    (tile, x, y) => tile[x + 1][y + 1],
    (tile, x, y, limit) => tile[limit - y][x + 1],
    (tile, x, y, limit) => tile[limit - x][limit - y]
];

export default (input) => {
    const [ids, tiles, gridSize] = parse(input);
    const [all, byLeft, byTop, byTopLeft, size, multiplier] = prepareOptions(tiles);

    const used = new Set();

    const rowBottoms = new Array(gridSize);
    const rowRights = new Array(gridSize);
    for (let i = 0; i < gridSize; i++) {
        rowBottoms[i] = new Int16Array(gridSize);
        rowRights[i] = new Int16Array(gridSize);
    }
    const zeroBottoms = rowBottoms[0];
    const zeroRights = rowRights[0];

    let current = tiles.length;
    const cells = new Array(tiles.length);
    const cellAlignment = new Array(tiles.length);

    const some = (source, rights, bottoms, x, callback) => source
        ? source.some((option) => {
            const [i, bottom, right] = option;
            if (used.has(i)) {
                return false;
            }
            used.add(i);
            rights[x] = right;
            bottoms[x] = bottom
            const result = callback();
            if (result) {
                const index = all.indexOf(option);
                cells[--current] = i;
                cellAlignment[current] = index % 8;
            }
            used.delete(i);
            return result;
        })
        : false;

    const findOptionsByLeft = (rights, bottoms, x) => {
        if (x === gridSize) {
            return solveRow(bottoms, 1);
        }
        return some(
            byLeft.get(rights[x - 1]),
            rights,
            bottoms,
            x,
            () => findOptionsByLeft(rights, bottoms, x + 1)
        );
    }

    const findOptionsByTopLeft = (rights, bottoms, tops, x, y) => {
        if (x === gridSize) {
            return solveRow(bottoms, y + 1);
        }
        return some(
            byTopLeft.get(tops[x] + rights[x - 1] * multiplier),
            rights,
            bottoms,
            x,
            () => findOptionsByTopLeft(rights, bottoms, tops, x + 1, y)
        );
    }

    const solveRow = (tops, y) => {
        if (y === gridSize) {
            return true;
        }
        const bottoms = rowBottoms[y];
        const rights = rowRights[y];
        return some(
            byTop.get(tops[0]),
            rights,
            bottoms,
            0,
            () => findOptionsByTopLeft(rights, bottoms, tops, 1, y)
        );
    }

    const found = some(
        all,
        zeroRights,
        zeroBottoms,
        0,
        () => findOptionsByLeft(zeroRights, zeroBottoms, 1, solveRow)
    );

    // console.log(cells)
    // console.log(cellAlignment)
    // console.log(found);

    const limit = size - 2;
    const width = gridSize * limit;
    const image = new Array(width * width);
    for (let y = 0; y < gridSize; y++) {
        const yOffset = y * width * limit;
        for (let x = 0; x < gridSize; x++) {
            const xyOffset = yOffset + x * limit;
            const tile = tiles[cells[current]];
            const getter = alignmentGetters[cellAlignment[current]];
            for (let ty = 0; ty < limit; ty++) {
                const offset = xyOffset + ty * width;
                for (let tx = 0; tx < limit; tx++) {
                    image[offset + tx] = getter(tile, tx, ty, limit) === '#';
                }
            }
            current++;
        }
    }
    const monsters = new Set();

    const maxStart = width - 17;
    const maxReverse = maxStart - 2;
    const maxLine = width - 1;

    for (let i = 1; i < maxLine; i++) {
        for (let j = 0; j < maxStart; j++) {
            const x = i * width + j;
            if (
                image[x] &&
                image[x + 5] &&
                image[x + 6] &&
                image[x + 11] &&
                image[x + 12] &&
                image[x + 17]
            ) {
                if (
                    image[x + width + 1] &&
                    image[x + width + 4] &&
                    image[x + width + 7] &&
                    image[x + width + 10] &&
                    image[x + width + 13] &&
                    image[x + width + 16]
                ) {
                    if (
                        j < maxReverse &&
                        image[x + 18] &&
                        image[x + 19] &&
                        image[x - width + 18]
                    ) {
                        monsters.add(x);
                        monsters.add(x + 5);
                        monsters.add(x + 6);
                        monsters.add(x + 11);
                        monsters.add(x + 12);
                        monsters.add(x + 17);
                        monsters.add(x + width + 1);
                        monsters.add(x + width + 4);
                        monsters.add(x + width + 7);
                        monsters.add(x + width + 10);
                        monsters.add(x + width + 13);
                        monsters.add(x + width + 16);
                        monsters.add(x + 18);
                        monsters.add(x + 19);
                        monsters.add(x - width + 18);
                        // console.log('a')
                    }
                    if (
                        j > 2 &&
                        image[x - 1] &&
                        image[x - 2] &&
                        image[x - width - 1]
                    ) {
                        monsters.add(x);
                        monsters.add(x + 5);
                        monsters.add(x + 6);
                        monsters.add(x + 11);
                        monsters.add(x + 12);
                        monsters.add(x + 17);
                        monsters.add(x + width + 1);
                        monsters.add(x + width + 4);
                        monsters.add(x + width + 7);
                        monsters.add(x + width + 10);
                        monsters.add(x + width + 13);
                        monsters.add(x + width + 16);
                        monsters.add(x - 1);
                        monsters.add(x - 2);
                        monsters.add(x - width - 1);
                        // console.log('b')
                    }
                }
                if (
                    image[x - width + 1] &&
                    image[x - width + 4] &&
                    image[x - width + 7] &&
                    image[x - width + 10] &&
                    image[x - width + 13] &&
                    image[x - width + 16]
                ) {
                    if (
                        j < maxReverse &&
                        image[x + 18] &&
                        image[x + 19] &&
                        image[x + width + 18]
                    ) {
                        monsters.add(x);
                        monsters.add(x + 5);
                        monsters.add(x + 6);
                        monsters.add(x + 11);
                        monsters.add(x + 12);
                        monsters.add(x + 17);
                        monsters.add(x - width + 1);
                        monsters.add(x - width + 4);
                        monsters.add(x - width + 7);
                        monsters.add(x - width + 10);
                        monsters.add(x - width + 13);
                        monsters.add(x - width + 16);
                        monsters.add(x + 18);
                        monsters.add(x + 19);
                        monsters.add(x + width + 18);
                        // console.log('c')
                    }
                    if (
                        j > 2 &&
                        image[x - 1] &&
                        image[x - 2] &&
                        image[x + width - 1]
                    ) {
                        monsters.add(x);
                        monsters.add(x + 5);
                        monsters.add(x + 6);
                        monsters.add(x + 11);
                        monsters.add(x + 12);
                        monsters.add(x + 17);
                        monsters.add(x - width + 1);
                        monsters.add(x - width + 4);
                        monsters.add(x - width + 7);
                        monsters.add(x - width + 10);
                        monsters.add(x - width + 13);
                        monsters.add(x - width + 16);
                        monsters.add(x - 1);
                        monsters.add(x - 2);
                        monsters.add(x + width - 1);
                        // console.log('d')
                    }
                }
            }
            const y = j * width + i;
            if (
                image[y + width * 5] &&
                image[y + width * 6] &&
                image[y + width * 11] &&
                image[y + width * 12] &&
                image[y + width * 17]
            ) {
                if (
                    image[y + 1 + width] &&
                    image[y + 1 + width * 4] &&
                    image[y + 1 + width * 7] &&
                    image[y + 1 + width * 10] &&
                    image[y + 1 + width * 13] &&
                    image[y + 1 + width * 16]
                ) {
                    if (
                        j < maxReverse &&
                        image[y + width * 18] &&
                        image[y + width * 19] &&
                        image[y - 1 + width * 18]
                    ) {
                        monsters.add(y);
                        monsters.add(y + width * 5);
                        monsters.add(y + width * 6);
                        monsters.add(y + width * 11);
                        monsters.add(y + width * 12);
                        monsters.add(y + width * 17);
                        monsters.add(y + 1 + width);
                        monsters.add(y + 1 + width * 4);
                        monsters.add(y + 1 + width * 7);
                        monsters.add(y + 1 + width * 10);
                        monsters.add(y + 1 + width * 13);
                        monsters.add(y + 1 + width * 16);
                        monsters.add(y + width * 18);
                        monsters.add(y + width * 19);
                        monsters.add(y - 1 + width * 18);
                        // console.log('e')
                    }
                    if (
                        j > 2 &&
                        image[y - width] &&
                        image[y - width * 2] &&
                        image[y - 1 - width]
                    ) {
                        monsters.add(y);
                        monsters.add(y + width * 5);
                        monsters.add(y + width * 6);
                        monsters.add(y + width * 11);
                        monsters.add(y + width * 12);
                        monsters.add(y + width * 17);
                        monsters.add(y + 1 + width);
                        monsters.add(y + 1 + width * 4);
                        monsters.add(y + 1 + width * 7);
                        monsters.add(y + 1 + width * 10);
                        monsters.add(y + 1 + width * 13);
                        monsters.add(y + 1 + width * 16);
                        monsters.add(y - width);
                        monsters.add(y - width * 2);
                        monsters.add(y - 1 - width);
                        // console.log('f')
                    }
                }
                if (
                    image[y - 1 + width] &&
                    image[y - 1 + width * 4] &&
                    image[y - 1 + width * 7] &&
                    image[y - 1 + width * 10] &&
                    image[y - 1 + width * 13] &&
                    image[y - 1 + width * 16]
                ) {
                    if (
                        j < maxReverse &&
                        image[y + width * 18] &&
                        image[y + width * 19] &&
                        image[y + 1 + width * 18]
                    ) {
                        monsters.add(y);
                        monsters.add(y + width * 5);
                        monsters.add(y + width * 6);
                        monsters.add(y + width * 11);
                        monsters.add(y + width * 12);
                        monsters.add(y + width * 17);
                        monsters.add(y - 1 + width);
                        monsters.add(y - 1 + width * 4);
                        monsters.add(y - 1 + width * 7);
                        monsters.add(y - 1 + width * 10);
                        monsters.add(y - 1 + width * 13);
                        monsters.add(y - 1 + width * 16);
                        monsters.add(y + width * 18);
                        monsters.add(y + width * 19);
                        monsters.add(y + 1 + width * 18);
                        // console.log('g')
                    }
                    if (
                        j > 2 &&
                        image[y - width] &&
                        image[y - width * 2] &&
                        image[y + 1 - width]
                    ) {
                        monsters.add(y);
                        monsters.add(y + width * 5);
                        monsters.add(y + width * 6);
                        monsters.add(y + width * 11);
                        monsters.add(y + width * 12);
                        monsters.add(y + width * 17);
                        monsters.add(y - 1 + width);
                        monsters.add(y - 1 + width * 4);
                        monsters.add(y - 1 + width * 7);
                        monsters.add(y - 1 + width * 10);
                        monsters.add(y - 1 + width * 13);
                        monsters.add(y - 1 + width * 16);
                        monsters.add(y - width);
                        monsters.add(y - width * 2);
                        monsters.add(y + 1 - width);
                        // console.log('h')
                    }
                }
            }
        }
    }

    // for (let i = 0; i < width; i++) {
    //     console.log(image.slice(width * i, width * (i + 1)).map(((val, j) => val ? monsters.has(i * width + j) ? 'O' : '#' : '.')).join(''))
    // }

    return [
        ids[cells[0]] * ids[cells[gridSize - 1]] * ids[cells[tiles.length - 1]] * ids[cells[tiles.length - gridSize]],
        image.filter((cell) => cell).length - monsters.size
    ];
}

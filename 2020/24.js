const offset = 256;
const width = offset * 2;
const start = offset + offset * width;

const e = 1;
const w = -1;
const ne = -width;
const nw = -width - 1;
const se = width + 1;
const sw = width;

export default (input) => {
    const black = new Uint8Array(width * width).fill(0);
    let blackCount = 0;

    input.split('\n').forEach((str) => {
        let coord = start;
        let i = 0;
        const length = str.length;

        while (i < length) {
            switch (str.charAt(i)) {
                case 'e':
                    coord += e;
                    break;
                case 'w':
                    coord += w;
                    break;
                case 'n':
                    if (str.charAt(++i) === 'e') {
                        coord += ne;
                    } else {
                        coord += nw;
                    }
                    break;
                case 's':
                    if (str.charAt(++i) === 'e') {
                        coord += se;
                    } else {
                        coord += sw;
                    }
                    break;
            }
            i++;
        }

        if (black[coord] === 1) {
            black[coord] = 0;
            blackCount--;
        } else {
            black[coord] = 1;
            blackCount++;
        }
    });

    const result1 = blackCount;

    const toFlip = [];
    const toCheck = new Set();
    const checked = new Set();

    const check = (i) => {
        if (checked.has(i)) {
            return;
        }
        let count = 0;
        if (black[i + e] === 1) {
            count++;
        }
        if (black[i + w] === 1) {
            count++;
        }
        if (black[i + ne] === 1) {
            count++;
        }
        if (black[i + nw] === 1) {
            count++;
        }
        if (black[i + se] === 1) {
            count++;
        }
        if (black[i + sw] === 1) {
            count++;
        }
        if (black[i] === 1
            ? count === 0 || count > 2
            : count === 2) {
            toFlip.push(i);
        }
    };

    black.forEach((val, i) => {
        if (val === 0) {
            return;
        }
        toCheck.add(i);
        toCheck.add(i + e);
        toCheck.add(i + w);
        toCheck.add(i + ne);
        toCheck.add(i + nw);
        toCheck.add(i + se);
        toCheck.add(i + sw);
    });

    let days = 0;
    while (days++ < 100) {
        Array.from(toCheck).forEach(check);
        toCheck.clear();
        toFlip.forEach((i) => {
            if (black[i] === 1) {
                black[i] = 0;
                blackCount--;
            } else {
                black[i] = 1;
                blackCount++;
            }
            toCheck.add(i + e);
            toCheck.add(i + w);
            toCheck.add(i + ne);
            toCheck.add(i + nw);
            toCheck.add(i + se);
            toCheck.add(i + sw);
        });
        toFlip.length = 0;
        checked.clear();
    }

    return [
        result1,
        blackCount
    ];
}

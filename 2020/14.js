const bin = (int) => int.toString(2).padStart(36, '0');

const bits = new Array(36);
let bit = bits[0] = 1n;
for (let i = 35; i >= 0; i--) {
    bits[i] = bit;
    bit *= 2n;
}

export default (input) => {
    const used1 = new Set();
    const used2 = new Set();
    let result1 = 0n;
    let result2 = 0n;

    input
        .split(/\n?mask = /)
        .slice(1)
        .reverse()
        .map((str) => {
            const [maskStr, ...lines] = str.split('\n');
            const ones = [];
            let mask = BigInt(`0b${
                maskStr.split('').map((str, i) => {
                    if (str === 'X') {
                        ones.push(bits[i]);
                        return 0;
                    } else {
                        return str;
                    }
                }).join('')
            }`);

            const positiveMask = mask;
            const negativeMask = ones.reduce((res, bits) => res | bits, mask);
            const cutoffMask = ~(positiveMask ^ negativeMask);

            const options = [];
            const limit = ones.length;
            const down = new Array(limit).fill(true);
            let i = limit - 1;

            const lastZero = ~ones[0];
            mask = mask | ones[0];

            while (i !== limit) {
                if (i === 0) {
                    options.push(mask & lastZero);
                    options.push(mask);
                    i++;
                } else {
                    if (down[i]) {
                        down[i] = false;
                        i--;
                    } else {
                        mask = mask ^ ones[i];
                        if (mask & ones[i]) {
                            i--;
                        } else {
                            down[i] = true;
                            i++;
                        }
                    }
                }
            }
            // console.log(options.map(bin).join('\n'))
            // console.log(cutoffMask.toString(2))
            // console.log(positiveMask.toString(2))

            lines.reverse().forEach((str) => {
                const index = +str.substring(4, str.indexOf(']'));
                const value = BigInt(str.substring(str.lastIndexOf(' ')));
                const prep2 = BigInt(index) & cutoffMask | positiveMask;

                if (!used1.has(index)) {
                    used1.add(index);
                    result1 += value & negativeMask | positiveMask;
                }

                let free = options.length;

                options.forEach((option) => {
                    const i = prep2 | option;
                    if (used2.has(i)) {
                        free--;
                    } else {
                        used2.add(i);
                    }
                });

                result2 += BigInt(free) * value;
            });
        });

    return [
        result1,
        result2
    ];
}

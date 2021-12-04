const parse = (input) => input.split('\n').map((str) => {
    const [op, num] = str.split(' ');
    return [op, +num];
});

const calculateAcc = (parsed, fix = (a) => a) => {
    let i = 0;
    let acc = 0;
    const visited = new Set([parsed.length]);

    while (!visited.has(i)) {
        visited.add(i);
        const [op, num] = fix(parsed[i], i);
        switch (op) {
            case 'acc':
                acc += num;
                i++;
                break;
            case 'jmp':
                i += num;
                break;
            case 'nop':
                i++;
                break;
        }
    }

    return acc;
};

const findSources = (parsed) => {
    const sources = [];

    parsed.forEach(([op, num], i) => {
        const dest = op === 'jmp'
            ? i + num
            : i + 1;
        if (sources.hasOwnProperty(dest)) {
            sources[dest].push(i);
        } else {
            sources[dest] = [i];
        }
    });

    return sources;
};

const findPaths = (sources, i) => {
    const result = new Set();

    const iterate = (i) => {
        if (sources.hasOwnProperty(i)) {
            sources[i].forEach((i) => {
                result.add(i);
                iterate(i);
            });
        }
    };

    iterate(i);

    return result;
};

export default (input) => {
    const parsed = parse(input);
    const sources = findSources(parsed);
    const pathsToEnd = findPaths(sources, parsed.length);

    // console.log([...pathsToEnd].sort());

    const fix = (entry, i) => {
        const [op, num] = entry;
        switch (op) {
            case 'jmp':
                if (pathsToEnd.has(i + 1) && !pathsToEnd.has(i + num)) {
                    return ['nop', num];
                }
                break;
            case 'nop':
                if (pathsToEnd.has(i + num) && !pathsToEnd.has(i + 1)) {
                    return ['jmp', num];
                }
                break;
        }
        return entry;
    };

    return [
        calculateAcc(parsed),
        calculateAcc(parsed, fix)
    ];
}


const parse = (input) => {
    const result = {};

    const regex = /(\w+ \w+) bags contain ([^.]+)./;
    const typeRegex = /(\d+) ([\w ]+) bags?/;

    input.split('\n').forEach((line) => {
        const [, type, content] = regex.exec(line);
        const arr = result[type] = [];
        if (content !== 'no other bags') {
            content.split(', ').forEach((str) => {
                const [, count, type] = typeRegex.exec(str);
                arr.push([type, count]);
            });
        }
    });

    return result;
};

const reverse = (parsed) => {
    const result = {};

    Object.keys(parsed).forEach((type) => {
        parsed[type].forEach(([subType]) => {
            if (result.hasOwnProperty(subType)) {
                result[subType].push(type);
            } else {
                result[subType] = [type];
            }
        });
    });

    return result;
};

const findAll = (type, reversed) => {
    const result = new Set();

    const find = (type) => {
        if (reversed.hasOwnProperty(type)) {
            const parents = reversed[type];
            parents.forEach((parent) => {
                result.add(parent);
                find(parent);
            });
        }
    };

    find(type);

    return result;
};

const count = (type, parsed) => {
    const process = (type) =>
        parsed.hasOwnProperty(type)
            ? parsed[type].reduce((result, [subType, count]) => result + count * process(subType), 1)
            : 1;

    return process(type) - 1;
}


export default (input) => {
    const parsed = parse(input);
    const reversed = reverse(parsed);

    return [
        findAll('shiny gold', reversed).size,
        count('shiny gold', parsed)
    ];
}

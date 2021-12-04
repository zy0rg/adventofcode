const parse = (input) => {
    const [rulesStr, yourStr, nearbyStr] = input.split('\n\n');
    const ruleRegEx = /[\w ]+: (\d+)-(\d+) or (\d+)-(\d+)/;

    return {
        rules: rulesStr.split('\n').map((str) => {
            const [, a, b, c, d] = ruleRegEx.exec(str);
            return [+a, +b, +c, +d];
        }),
        your: yourStr.split('\n')[1].split(',').map((str) => +str),
        nearby: nearbyStr.split('\n').slice(1).map((str) => str.split(',').map((str) => +str))
    };
};

export default (input) => {
    const {rules, your, nearby} = parse(input);

    const validNumbers = new Set();

    rules.forEach(([a, b, c, d]) => {
        for (let i = a; i <= b; i++) {
            validNumbers.add(i);
        }
        for (let i = c; i <= d; i++) {
            validNumbers.add(i);
        }
    });

    let invalid = 0;

    const matching = your.map(() => rules.slice());
    const ruleOccurrences = new Array(rules.length).fill(your.length);
    const length = your.length;

    const removeByOccurrence = (rule) => {
        const i = rules.indexOf(rule);
        if ((--ruleOccurrences[i]) === 1) {
            for (let j = 0; j < length; j++) {
                if (j === i) {
                    continue;
                }
                const alt = matching[j];
                const index = alt.indexOf(rule);
                if (index !== -1) {
                    alt.splice(index + 1).forEach(removeByOccurrence);
                    alt.splice(0, index).forEach(removeByOccurrence);
                }
            }
        }
    };

    const removeBySize = (check, i) => {
        if (check.length === 1) {
            const rule = check[0];
            for (let j = 0; j < length; j++) {
                const alt = matching[j];
                if (alt === check) {
                    continue;
                }
                const index = alt.indexOf(rule);
                if (index !== -1) {
                    alt.splice(index, 1);
                    removeBySize(alt, index);
                }
            }
            return true;
        }
        return false;
    };

    nearby.filter((ticket) => {
        if (!ticket.some((num) => {
            if (!validNumbers.has(num)) {
                invalid += num;
                return true;
            }
        })) {
            for (let i = 0; i < length; i++) {
                const check = matching[i];
                if (check.length === 1) {
                    continue;
                }
                const num = ticket[i];
                for (let j = check.length - 1; j >= 0; j--) {
                    const rule = check[j];
                    const [a, b, c, d] = rule;
                    if (num < a || num > d || (num > b && num < c)) {
                        check.splice(j, 1);
                        removeByOccurrence(rule, check);
                        if (removeBySize(check, j)) {
                            break;
                        }
                    }
                }
            }
        }
    });

    // console.log(matching.map((check) => check));
    const result2 = rules
        .slice(0, 6)
        .map((rule) => matching
            .findIndex((check) => check[0] === rule))
        .map((index) => your[index])
        .reduce((a, b) => a * b);

    return [invalid, result2]
};

const parse = (input) => {
    const [rulesStr, patternsStr] = input.split('\n\n');

    return [
        new Map(rulesStr.split('\n').map((ruleStr) => ruleStr.split(': '))),
        patternsStr.split('\n')
    ];
};

const prepareRule = (str, getRule) => {
    if (str.charAt(0) === '"') {
        const char = str.charAt(1);
        return (pattern, i, next) => pattern.charAt(i) === char
            ? next(i + 1)
            : false;
    }
    const [a, b] = str.split(' | ').map((choice) => {
        const [a, b, c] = choice.split(' ').map(getRule);
        return b == null
            ? a
            : c == null
                ? (pattern, i, next) => a(pattern, i, (i) => b(pattern, i, next))
                : (pattern, i, next) => a(pattern, i, (i) => b(pattern, i, (i) => c(pattern, i, next)))
    });
    return b == null
        ? a
        : (pattern, i, next) => a(pattern, i, next) || b(pattern, i, next);
};

const prepareRuleZero = (rules) => {
    const prepared = new Array(rules.size);
    const preparing = new Set();

    const getRule = (id) => {
        if (prepared.hasOwnProperty(id)) {
            return prepared[id];
        }
        if (preparing.has(id)) {
            return (pattern, i, next) => prepared[id](pattern, i, next);
        }
        preparing.add(id);
        const result = prepared[id] = prepareRule(rules.get(id), getRule);
        preparing.delete(id);
        return result;
    };

    const rule = getRule('0');

    return (pattern) => rule(pattern, 0, (i) => i === pattern.length);
};

export default (input) => {
    const [rules, patterns] = parse(input);

    const rule1 = prepareRuleZero(rules);

    rules.set('8', '42 | 42 8');
    rules.set('11', '42 31 | 42 11 31');

    const rule2 = prepareRuleZero(rules);

    return [
        patterns.filter(rule1).length,
        patterns.filter(rule2).length
    ];
}

const countAllOptions = (diff) => {
    const multipliers = [0, 1, 2];
    const spans = [];
    let i = 0;
    let mul = 2;

    while ((i = diff.indexOf(1, i)) !== -1) {
        const start = i;
        i = diff.indexOf(3, start);
        if (i === -1) {
            i = diff.length;
        }
        const span = i - start;
        while (span >= mul) {
            multipliers[mul] = 1 + multipliers[mul - 1] + multipliers[mul - 2];
            mul++;
        }
        spans.push(span);
    }

    return spans.reduce((result, span) => result * multipliers[span], 1);
};

export default (input) => {
    const diff = input
        .split('\n')
        .map((str) => +str)
        .sort((a, b) => a - b)
        .map((num, i, arr) => i === 0 ? num : num - arr[i - 1]);

    const ones = diff.filter((a) => a === 1).length;

    return [
        (diff.length - ones + 1) * ones,
        countAllOptions(diff)
    ];
}

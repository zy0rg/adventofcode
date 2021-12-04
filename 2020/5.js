const replacement = {
    'R': '1',
    'B': '1',
    'L': '0',
    'F': '0'
};

export default (input) => {
    const occupied = input
        .split('\n')
        .map((str) => parseInt(str.split('').map((char) => replacement[char]).join(''), 2));
    const min = Math.min(...occupied);
    const max = Math.max(...occupied);
    const set = new Set(occupied);

    for (let i = min; i < max; i++) {
        if (!set.has(i)) {
            return [max, i];
        }
    }
}

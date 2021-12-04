const parse = (input) => input.split('\n').map((str) => +str);

const findInvalid = (input, length) => {
    loop: for (let i = length; i < input.length; i++) {
        const num = input[i];
        const start = i - length;
        for (let j = start + 1; j < i; j++) {
            const a = input[j];
            for (let k = start; k < j; k++) {
                if (num === a + input[k]) {
                    continue loop;
                }
            }
        }
        return num;
    }
};

const findSum = (input, target) => {
    const max = input.length - 1;
    loop: for (let i = 0; i < max; i++) {
        let sum = input[i];
        for (let j = i + 1; j < input.length; j++) {
            sum += input[j];
            if (sum > target) {
                continue loop;
            } else if (sum === target) {
                const range = input.slice(i, j + 1);
                return Math.min(...range) + Math.max(...range);
            }
        }
    }
};

export default (input) => {
    const parsed = parse(input);
    const result1 = findInvalid(parsed, 25);
    const result2 = findSum(parsed, result1);

    return [result1, result2];
}

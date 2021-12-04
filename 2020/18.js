const calc = (str) => {
    const len = str.length;

    const result = new Array(20).fill(0);
    const operation = new Uint8Array(20).fill(0);
    let depth = 0;
    let val = 0;

    for (let i = 0; i < len; i++) {
        const char = str[i];
        switch (char) {
            case ' ':
                break;
            case '(':
                depth++;
                break;
            case ')':
                val = result[depth];
                result[depth] = 0;
                operation[depth] = 0;
                depth--;
                if (operation[depth]) {
                    result[depth] *= val;
                } else {
                    result[depth] += val;
                }
                break;
            case '+':
                operation[depth] = 0;
                break;
            case '*':
                operation[depth] = 1;
                break;
            default:
                if (operation[depth]) {
                    result[depth] *= char;
                } else {
                    result[depth] += +char;
                }
        }
    }

    return result[0];
}

const calc1 = (str) => {
    while (str.includes('(')) {
        str = str.replace(/\(([^()]+)\)/, (match, content) => calc1(content));
    }
    let multiply = false;
    return str.split(' ').reduce((res, char) => {
        if (char === '*') {
            multiply = true;
        } else if (char === '+') {
            multiply = false
        } else if (multiply) {
            return res * char
        } else {
            return res + parseInt(char);
        }
        return res;
    }, 0);
}

const calc2 = (str) => {
    while (str.includes('(')) {
        str = str.replace(/\(([^()]+)\)/, (match, content) => calc2(content));
    }
    while (str.includes('+')) {
        str = str.replace(/(\d+) \+ (\d+)/, (match, a, b) => parseInt(a) + parseInt(b));
    }
    return +str.split(' * ').reduce((a, b) => a * b);
}

export default (input) => {
    const parsed = input.split('\n');

    return [
        parsed.map(calc).reduce((a, b) => a + b),
        parsed.map(calc2).reduce((a, b) => a + b),
    ];
}

const num = (val, min, max) => {
    const num = +val;
    return num >= min && num <= max;
};

const colors = new Set([
    'amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'
]);

const validation = {
    byr: (val) => num(val, 1920, 2002),
    iyr: (val) => num(val, 2010, 2020),
    eyr: (val) => num(val, 2020, 2030),
    hgt: (val) => {
        const unit = val.substr(val.length - 2);
        const digits = val.substr(0, val.length - 2);
        switch (unit) {
            case 'cm':
                return num(digits, 150, 193);
            case 'in':
                return num(digits, 59, 76);
            default:
                return false;
        }
    },
    hcl: (val) => /^#[0-9a-f]{6}$/.test(val),
    ecl: (val) => colors.has(val),
    pid: (val) => /^\d{9}$/.test(val)
}

export default (input) => {
    let result1 = 0;
    let result2 = 0;

    input.split('\n\n').forEach((str) => {
        let count = 0;
        let valid = 0;

        str.split(/\s+/).forEach((str) => {
            const [field, value] = str.split(':');
            if (validation.hasOwnProperty(field)) {
                count++;
                if (validation[field](value)) {
                    valid++;
                }
            }
        });

        if (count === 7) {
            result1++;
            if (valid === 7) {
                result2++;
            }
        }
    });

    return [result1, result2];
}

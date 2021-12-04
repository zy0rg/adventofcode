
const regex = /(\d+)-(\d+) (\w): (\w+)/;

export default (input) => {
    let result1 = 0;
    let result2 = 0;

    input.split('\n').map((str) => {
        const [, minStr, maxStr, char, value] = regex.exec(str);
        const min = +minStr;
        const max = +maxStr;

        let count = 0;
        let index = 0;
        while ((index = value.indexOf(char, index) + 1)) {
            count++;
        }
        if (count >= min && count <= max) {
            result1++;
        }
        if ((value.charAt(min - 1) === char) !== (value.charAt(max - 1) === char)) {
            result2++;
        }

    });

    return [result1, result2];
}

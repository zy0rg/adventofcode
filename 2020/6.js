export default (input) => {
    let result1 = 0;
    let result2 = 0;

    input.split('\n\n').forEach((str) => {
        const split = str.split('\n').map((value) => value.split(''));
        const any = new Set(split[0]);
        let all = split[0].slice();
        split.slice(1).forEach((chars) => {
            all = all.filter((i) => chars.includes(i));
            chars.forEach((char) => any.add(char));
        });
        result1 += any.size;
        result2 += all.length;
        // console.log(i, any.size, all.length);
    });

    return [result1, result2];
}

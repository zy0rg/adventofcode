const subject = 7;
const divider = 20201227;
const remainder = divider % subject;


const solve = (target) => {
    let num = 1;
    let i = 0;
    while (num !== target) {
        num = (num * subject) % divider;
        i++;
    }
    return i;
};

export default (input) => {
    const [door, card] = input.split('\n').map((str) => +str);

    let num = 1;
    const doorKey = solve(door);
    for (let i = 0; i < doorKey; i++) {
        num = (num * card) % divider;
    }

    return [
        num
    ];
}

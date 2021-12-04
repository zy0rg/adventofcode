const parse = (input) => {
    const [a, b] = input.split('\n');
    return [+a, b.split(',').map((str) => +str)];
};
const nearest = (offset, buses) => {
    const timeLeft = buses.map((schedule) => schedule - (offset % schedule));
    const least = Math.min(...timeLeft.filter((num) => Number.isInteger(num)));
    return least * buses[timeLeft.indexOf(least)];
};
const contest = (buses) => {
    let current = 1;
    let step = 1;
    buses.forEach((schedule, offset) => {
        if (Number.isInteger(schedule)) {
            const leftover = (schedule - offset % schedule) % schedule;
            while (current % schedule !== leftover) {
                current += step;
            }
            step *= schedule;
        }
    });
    return current;
};

export default (input) => {
    const [offset, buses] = parse(input);

    return [
        nearest(offset, buses),
        contest(buses)
    ];
}

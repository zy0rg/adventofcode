const fuel = (mass) => Math.max(Math.floor(mass / 3) - 2, 0);
const calculateFuel = (arr) => arr.map(fuel);
const sum = (arr) => arr.reduce((res, f) => res + f);

export default (input) => {
    const parsed = input.split('\n');
    let currentFuel = calculateFuel(parsed);

    let result1 = sum(currentFuel);
    let result2 = result1

    while ((currentFuel = currentFuel.filter((a) => a > 0)).length) {
        currentFuel = calculateFuel(currentFuel);
        result2 += sum(currentFuel);
    }

    return [result1, result2]
}

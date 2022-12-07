export default (input) => {
    const parsedInput = input
        .split('\n\n')
        .map((str) => str
            .split('\n')
            .map((str) => parseInt(str)))

    const sums = parsedInput
        .map((values) =>
            values.reduce((a, b) => a + b, 0))
        .sort((a, b) => b - a)

    let result1 = sums[0]
    let result2 = sums[0] + sums[1] + sums[2]


    return [result1, result2]
}

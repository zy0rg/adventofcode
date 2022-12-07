export default (input) => {
    const parsed = input
        .split('\n')
        .map((str) => str
            .split(/[,-]/)
            .map((str) => parseInt(str)))

    let result1 = 0
    let result2 = 0

    parsed.forEach(([a, b, c, d]) => {
        if (a >= c && b <= d || a <= c && b >= d) {
            result1++
            result2++
        } else if (a >= c && a <= d || b >= c && b <= d) {
            result2++
        }
    })

    return [result1, result2]
}
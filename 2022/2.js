export default (input) => {
    const split = input
        .split('\n')
        .map((str) => str.split(' '))

    let result1 = 0
    let result2 = 0

    split.forEach(([a, b]) => {
        if (b === 'X') {
            result1 += 1
            if (a === 'A') {
                result1 += 3
            } else if (a === 'C') {
                result1 += 6
            }
            if (a === 'A') {
                result2 += 3
            } else if (a === 'B') {
                result2 += 1
            } else {
                result2 += 2
            }
        } else if (b === 'Y') {
            result1 += 2
            if (a === 'B') {
                result1 += 3
            } else if (a === 'A') {
                result1 += 6
            }
            result2 += 3
            if (a === 'A') {
                result2 += 1
            } else if (a === 'B') {
                result2 += 2
            } else {
                result2 += 3
            }
        } else {
            result1 += 3
            if (a === 'C') {
                result1 += 3
            } else if (a === 'B') {
                result1 += 6
            }
            result2 += 6
            if (a === 'A') {
                result2 += 2
            } else if (a === 'B') {
                result2 += 3
            } else {
                result2 += 1
            }
        }
    })

    return [result1, result2]
}
const maxOffset = 10000
const length = 10

export default (input) => {
    const parsed = input.split('\n').map((str) => {
        const [direction, amount] = str.split(' ')
        return [direction, +amount]
    })

    const startPosition = maxOffset / 2

    let xh = startPosition
    let yh = startPosition
    let xt = startPosition
    let yt = startPosition

    const snake = new Array(length).fill(null).map(() => [startPosition, startPosition])

    const result1 = new Set([startPosition * maxOffset + startPosition])
    const result2 = new Set([startPosition * maxOffset + startPosition])

    parsed.forEach(([direction, amount]) => {
        // part 1
        if (direction === 'U') {
            yh -= amount
            const target = yh + 1
            if (yt > target) {
                xt = xh
                do {
                    yt--
                    result1.add(yt * maxOffset + xt)
                } while (yt !== target)
            }
        } else if (direction === 'D') {
            yh += amount
            const target = yh - 1
            if (yt < target) {
                xt = xh
                do {
                    yt++
                    result1.add(yt * maxOffset + xt)
                } while (yt !== target)
            }
        } else if (direction === 'L') {
            xh -= amount
            const target = xh + 1
            if (xt > target) {
                yt = yh
                do {
                    xt--
                    result1.add(yt * maxOffset + xt)
                } while (xt !== target)
            }
        } else {
            xh += amount
            const target = xh - 1
            if (xt < target) {
                yt = yh
                do {
                    xt++
                    result1.add(yt * maxOffset + xt)
                } while (xt !== target)
            }
        }

        // part 2
        loop: while (amount-- > 0) {
            if (direction === 'U') {
                snake[0][1]--
            } else if (direction === 'D') {
                snake[0][1]++
            } else if (direction === 'L') {
                snake[0][0]--
            } else {
                snake[0][0]++
            }
            let [x, y] = snake[0]
            for (let i = 1; i < length; i++) {
                const knot = snake[i]
                const dx = x - knot[0]
                const dy = y - knot[1]
                if (dx === 2) {
                    knot[0] = --x
                    if (dy === 2) {
                        knot[1] = --y
                    } else if (dy === -2) {
                        knot[1] = ++y
                    } else {
                        knot[1] = y
                    }
                } else if (dx === -2) {
                    knot[0] = ++x
                    if (dy === 2) {
                        knot[1] = --y
                    } else if (dy === -2) {
                        knot[1] = ++y
                    } else {
                        knot[1] = y
                    }
                } else {
                    if (dy === 2) {
                        knot[0] = x
                        knot[1] = --y
                    } else if (dy === -2) {
                        knot[0] = x
                        knot[1] = ++y
                    } else {
                        continue loop
                    }
                }
            }
            result2.add(y * maxOffset + x)
        }
    })

    return [result1.size, result2.size]
}
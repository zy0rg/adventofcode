export default (input) => {
    const parsed = input.split('\n').map((str) => str.split('').map((str) => parseInt(str)))

    const height = parsed.length
    const width = parsed[0].length
    const result1 = new Set()

    for (let y = 0; y < height; y++) {
        const row = parsed[y]
        let current = -1
        for (let x = 0; x < width; x++) {
            const next = row[x]
            if (next > current) {
                current = next
                result1.add(x * height + y)
            } else if (current === 9) {
                break
            }
        }
        current = -1
        for (let x = width - 1; x > 0; x--) {
            const next = row[x]
            if (next > current) {
                current = next
                result1.add(x * height + y)
            } else if (current === 9) {
                break
            }
        }
    }
    for (let x = width - 2; x > 0; x--) {
        let current = -1
        for (let y = 0; y < height; y++) {
            const next = parsed[y][x]
            if (next > current) {
                current = next
                result1.add(x * height + y)
            } else if (current === 9) {
                break
            }
        }
        current = -1
        for (let y = width - 1; y > 0; y--) {
            const next = parsed[y][x]
            if (next > current) {
                current = next
                result1.add(x * height + y)
            } else if (current === 9) {
                break
            }
        }
    }

    let result2 = 0
    const maxY = height - 1
    const maxX = width - 1

    for (let y = 0; y < height; y++) {
        const row = parsed[y]
        for (let x = 0; x < width; x++) {
            const current = row[x]
            let t = y
            let b = y
            let l = x
            let r = x
            do {
                if (t === 0) {
                    break
                }
                t--
            } while (parsed[t][x] < current)
            do {
                if (b === maxY) {
                    break
                }
                b++
            } while (parsed[b][x] < current)
            do {
                if (l === 0) {
                    break
                }
                l--
            } while (row[l] < current)
            do {
                if (r === maxX) {
                    break
                }
                r++
            } while (row[r] < current)
            const score = (y - t) * (b - y) * (x - l) * (r - x)
            if (score > result2) {
                result2 = score
            }
        }
    }

    return [result1.size, result2]
}
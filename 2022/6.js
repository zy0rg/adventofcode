const firstDistinct = (input, count) => {
    const max = input.length - count

    loop: for (let i = 0; i <= max; i++) {
        for (let x = i + count - 1; x >= i; x--) {
            const char = input.charAt(x)
            for (let y = x - 1; y >= i; y--) {
                if (input.charAt(y) === char) {
                    i = y
                    continue loop
                }
            }
        }
        return i + count
    }
}

export default (input) => {
    return [firstDistinct(input, 4), firstDistinct(input, 14)]
}
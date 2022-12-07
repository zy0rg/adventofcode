const priorities = {}

for (let i = 1; i <= 26; i++) {
    priorities[String.fromCharCode(i + 96)] = i
    priorities[String.fromCharCode(i + 64)] = i + 26
}

export default (input) => {
    const parsed = input.split('\n')

    let result1 = 0

    parsed.forEach((str) => {
        const used = new Set()
        const {length} = str
        const half = length / 2
        for (let i = 0; i < half; i++) {
            const char = str.charAt(i)
            if (!used.has(char) && str.indexOf(char, half) !== -1) {
                result1 += priorities[char]
                used.add(char)
            }
        }
    })

    const {length} = parsed
    let result2 = 0

    loop: for (let i = 0; i < length; i += 3) {
        const first = parsed[i]
        const second = parsed[i + 1]
        const third = parsed[i + 2]
        const {length} = first
        for (let i = 0; i < length; i++) {
            const char = first.charAt(i)
            if (second.includes(char) && third.includes(char)) {
                result2 += priorities[char]
                continue loop
            }
        }
    }

    return [result1, result2]
}
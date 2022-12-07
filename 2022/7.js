export default (input) => {
    const parsed = input.split('\n')

    const {length} = parsed

    const dirs = []

    const dir = (parent) => {
        const x = {
            dirs: {},
            files: {},
            parent,
            size: 0
        }
        dirs.push(x)
        return x
    }

    const root = dir(null)

    let current = null

    for (let i = 0; i < length; i++) {
        const line = parsed[i]
        const [a, b, c] = line.split(' ')
        if (a === '$') {
            if (b === 'ls') {
                continue
            }
            if (c === '/') {
                current = root
            } else if (c === '..') {
                current = current.parent
            } else {
                if (current.dirs.hasOwnProperty(c)) {
                    current.dirs[c] = dir(current)
                }
                current = current.dirs[c]
            }
        } else if (a === 'dir') {
            if (!current.dirs.hasOwnProperty(b)) {
                current.dirs[b] = dir(current)
            }
        } else if (!current.files.hasOwnProperty(b)) {
            current.files[b] = +a
            current.size += +a
        }
    }

    const sizes = dirs
        .reverse()
        .map((dir) => {
            dir.size += Object.keys(dir.dirs).reduce((result, name) => result + dir.dirs[name].size, 0)
            return dir.size
        })

    const result1 = sizes.filter((size) => size <= 100000).reduce((a, b) => a + b)

    const toFree = root.size - 70000000 + 30000000

    const result2 = Math.min(...sizes.filter((size) => size >= toFree))

    return [result1, result2]
}
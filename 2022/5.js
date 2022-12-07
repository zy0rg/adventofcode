export default (input) => {
    const [cratesStr, movesStr] = input.split('\n\n')
    const crates = cratesStr.split('\n')
    const moves = movesStr.split('\n').map((str) => {
        const [,count,,from,,to] = str.split(' ')
        return [+count, from - 1, to - 1]
    })

    const columns = []

    for (let i = crates.length - 2; i >= 0; i--) {
        const line = crates[i]
        const {length} = line
        for (let j = 1, x = 0; j < length; j += 4, x++) {
            const char = line.charAt(j)
            if (char !== ' ') {
                if (columns[x] == null) {
                    columns[x] = [char]
                } else {
                    columns[x].push(char)
                }
            }
        }
    }

    const columns2 = columns.map((column) => Array.from(column))

    moves.forEach(([count, from, to]) => {
        const fromColumn = columns[from]
        const toColumn = columns[to]
        const {length} = fromColumn
        const target = length - count
        for (let i = length - 1; i >= target; i--) {
            toColumn.push(fromColumn[i])
        }
        fromColumn.length = target

        columns2[to].push(...columns2[from].splice(-count))
    })

    const result1 = columns.map((column) => column[column.length - 1]).join('')
    const result2 = columns2.map((column) => column[column.length - 1]).join('')

    return [result1, result2]
}
const skip = new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'])

export default (input) => {
	const parsed = input.split('\n')
	const max = parsed.length - 1

	let result1 = 0
	let result2 = 0

	const values = new Map()
	const added = new Map()

	const save = (adjacent, num) => {
		result1 += num
		if (adjacent[0] !== -1) {
			adjacent.forEach((i) => {
				if (values.has(i)) {
					if (added.has(i)){
						result2 -= added.get(i)
						added.set(i, 0)
					} else {
						const value = values.get(i) * num
						result2 += value
						added.set(i, value)
					}
				} else {
					values.set(i, num)
				}
			})
		}
	}

	parsed.forEach((str, row) => {
		const {length} = str
		let num = 0
		let adjacent = []
		const test = (adjacent, i) => {
			if (row > 0) {
				checkStar(adjacent, i, row - 1, parsed[row - 1][i])
			}
			if (row < max) {
				checkStar(adjacent, i, row + 1, parsed[row + 1][i])
			}
		}
		const checkStar = (adjacent, i, row, char) => {
			if (char === '*') {
				if (adjacent[0] === -1) {
					adjacent[0] = row * length + i
				} else {
					adjacent.push(row * length + i)
				}
			} else if (adjacent.length === 0 && !skip.has(char)) {
				adjacent[0] = -1
			}
		}
		for (let i = 0; i < length; i++) {
			const char = str[i]
			switch (char) {
				case '0':
					num = num * 10
					break
				case '1':
					num = num * 10 + 1
					break
				case '2':
					num = num * 10 + 2
					break
				case '3':
					num = num * 10 + 3
					break
				case '4':
					num = num * 10 + 4
					break
				case '5':
					num = num * 10 + 5
					break
				case '6':
					num = num * 10 + 6
					break
				case '7':
					num = num * 10 + 7
					break
				case '8':
					num = num * 10 + 8
					break
				case '9':
					num = num * 10 + 9
					break
				case '.':
					if (num !== 0) {
						if (adjacent.length > 0) {
							const add = []
							test(add, i)
							if (add.length > 0) {
								adjacent.push(...add)
							}
							save(adjacent, num)
							adjacent = add
						} else {
							test(adjacent, i)
							if (adjacent.length > 0) {
								save(adjacent, num)
							}
						}
						num = 0
					} else {
						if (adjacent.length > 0) {
							adjacent.length = 0
						}
						test(adjacent, i)
					}
					continue
				default:
					const add = char === '*'
						? [row * length + i]
						: [-1]
					test(add, i)
					if (num !== 0) {
						if (adjacent.length > 0) {
							adjacent.push(...add)
							save(adjacent, num)
						} else {
							save(add, num)
						}
						num = 0
					}
					adjacent = add
					continue
			}
			test(adjacent, i)
		}
		if (num !== 0 && adjacent.length > 0) {
			save(adjacent, num)
		}
	})
	return [result1, result2]
}

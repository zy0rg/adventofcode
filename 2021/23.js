const letters = {
	A: 0,
	B: 1,
	C: 2,
	D: 3
}
const scoreByValue = new Uint16Array([1, 10, 100, 1000])
const columnByValue = {
	1: 0,
	10: 1,
	100: 2,
	1000: 3
}

export default (input) => {
	let a1 = letters[input[31]]
	let a2 = letters[input[45]]
	let b1 = letters[input[33]]
	let b2 = letters[input[47]]
	let c1 = letters[input[35]]
	let c2 = letters[input[49]]
	let d1 = letters[input[37]]
	let d2 = letters[input[51]]

	const values = new Uint8Array(23).fill(4)

	const left = values.subarray(0, 2)
	const right = values.subarray(2, 4)
	const middle = values.subarray(4, 7)

	const columns = [
		values.subarray(7, 11),
		values.subarray(11, 15),
		values.subarray(15, 19),
		values.subarray(19, 23)
	]

	let depth = 1

	columns[0].set([a1, 3, 3, a2])
	columns[1].set([b1, 2, 1, b2])
	columns[2].set([c1, 1, 0, c2])
	columns[3].set([d1, 0, 2, d2])
	left.fill(4)
	right.fill(4)
	middle.fill(4)

	const columnFull = [false, false, false, false]

	let minScore = Infinity
	let score = 0

	const visited = new Map()

	const move = () => {
		const moveAndRollback = (value, to, j, from, i, cost) => {
			const increment = scoreByValue[value] * (j + 2 + cost)
			score += increment
			if (score < minScore) {
				to[j] = value
				from[i] = 4
				const id = values.reduce((result, value) => result * 5 + value)
				if (!visited.has(id) || visited.get(id) > score) {
					visited.set(id, score)
					move()
				}
				from[i] = value
				to[j] = 4
			}
			score -= increment
		}
		const moveIntoColumn = (value, from, i, cost) => {
			const column = columns[value]
			for (let j = depth; j >= 0; j--) {
				if (column[j] === 4) {
					if (j === 0) {
						columnFull[value] = true
						if (columnFull.includes(false)) {
							moveAndRollback(value, column, j, from, i, cost)
						} else {
							const increment = scoreByValue[value] * (j + 2 + cost)
							score += increment
							if (score < minScore) {
								minScore = score
							}
							score -= increment
						}
						columnFull[value] = false
					} else {
						moveAndRollback(value, column, j, from, i, cost)
					}
					return
				}
				if (column[j] !== value) {
					return
				}
			}
		}
		const pathIsFree = (from, to) => {
			for (let m = from; m < to; m++) {
				if (middle[m] !== 4) {
					return false
				}
			}
			return true
		}

		for (let i = 0; i < 2; i++) {
			const value = left[i]
			if (value === 4) {
				continue
			}
			if (pathIsFree(0, value)) {
				moveIntoColumn(value, left, i, i + value * 2)
			}
			break
		}
		for (let i = 0; i < 2; i++) {
			const value = right[i]
			if (value === 4) {
				continue
			}
			if (pathIsFree(value, 3)) {
				moveIntoColumn(value, right, i, i + (3 - value) * 2)
			}
			break
		}
		for (let i = 0; i < 3; i++) {
			const value = middle[i]
			if (value === 4) {
				continue
			}
			if (value > i) {
				if (pathIsFree(i + 1, value)) {
					moveIntoColumn(value, middle, i, (value - i - 1) * 2)
				}
			} else {
				if (pathIsFree(value, i)) {
					moveIntoColumn(value, middle, i, (i - value) * 2)
				}
			}
		}
		columnLoop: for (let c = 0; c < 4; c++) {
			if (columnFull[c]) {
				continue
			}
			const source = columns[c]
			for (let i = 0; i <= depth; i++) {
				const value = source[i]
				if (value === 4) {
					continue
				}
				if (value > c) {
					if (pathIsFree(c, value)) {
						moveIntoColumn(value, source, i, i + (value - c) * 2)
					}
				} else if (value < c) {
					if (pathIsFree(value, c)) {
						moveIntoColumn(value, source, i, i + (c - value) * 2)
					}
				} else {
					for (let i = depth; i >= 0; i--) {
						if (source[i] === value) {
							continue
						}
						if (source[i] === 4) {
							continue columnLoop
						}
						break
					}
				}
				if (pathIsFree(0, c)) {
					for (let j = 0; j < 2; j++) {
						if (left[j] !== 4) {
							break
						}
						moveAndRollback(value, left, j, source, i, i + c * 2)
					}
				}
				if (pathIsFree(c, 3)) {
					for (let j = 0; j < 2; j++) {
						if (right[j] !== 4) {
							break
						}
						moveAndRollback(value, right, j, source, i, i + (3 - c) * 2)
					}
				}
				for (let j = 0; j < 3; j++) {
					if (c > j) {
						if (pathIsFree(j, c)) {
							moveAndRollback(value, middle, j, source, i, i + (c - j - 1) * 2)
						}
					} else {
						if (pathIsFree(c, j + 1)) {
							moveAndRollback(value, middle, j, source, i, i + (j - c) * 2)
						}
					}
				}
				break
			}
		}
	}

	move()

	// something is wrong. the correct solution is 43226

	return [minScore]
}

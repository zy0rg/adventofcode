export default (input) => {
	const parsed = input.split('').map((char) => char === '>')
	const {length} = parsed

	const repeatability = length % 5 === 0
		? length
		: length * 5
	let offset = 0

	const board = [
		[false, false, false, false, false, false, false],
		[false, false, false, false, false, false, false],
		[false, false, false, false, false, false, false],
		[false, false, false, false, false, false, false],
		[true, true, true, true, true, true, true]
	]

	let wind = 0

	const keys = new Map()

	const move = (i) => {
		const rock = i % 5
		let x = 2
		let y = 0
		if (rock === 0) { // _
			const width = 4
			const max = 7 - width
			while (true) {
				const right = parsed[wind]
				wind = (wind + 1) % length
				if (right) {
					if (x < max) {
						if (board[y][x + 4]) {
						} else {
							x++
						}
					}
				} else if (x > 0) {
					if (board[y][x - 1]) {
					} else {
						x--
					}
				}
				const nextRow = board[y + 1]
				if (nextRow[x] || nextRow[x + 1] || nextRow[x + 2] || nextRow[x + 3]) {
					const row = board[y]
					row[x] = true
					row[x + 1] = true
					row[x + 2] = true
					row[x + 3] = true
					for (let range = 3 - y; range >= 0; range--) {
						board.unshift([false, false, false, false, false, false, false])
					}
					break
				}
				y++
			}
		} else if (rock === 1) { // +
			const width = 3
			const max = 7 - width
			while (true) {
				const right = parsed[wind]
				wind = (wind + 1) % length
				if (right) {
					if (x < max) {
						const next = x + 2
						if (board[y][next]) {
						} else if (y > 0 && board[y - 1][x + 3]) {
						} else if (y > 1 && board[y - 2][next]) {
						} else {
							x++
						}
					}
				} else if (x > 0) {
					if (board[y][x]) {
					} else if (y > 0 && board[y - 1][x - 1]) {
					} else if (y > 1 && board[y - 2][x]) {
					} else {
						x--
					}
				}
				const row = board[y]
				const nextRow = board[y + 1]
				if (row[x] || nextRow[x + 1] || row[x + 2]) {
					row[x + 1] = true
					board[y - 1][x] = true
					board[y - 1][x + 1] = true
					board[y - 1][x + 2] = true
					board[y - 2][x + 1] = true
					for (let range = 3 - y + 2; range >= 0; range--) {
						board.unshift([false, false, false, false, false, false, false])
					}
					break
				}
				y++
			}
		} else if (rock === 2) { // _|
			const width = 3
			const max = 7 - width
			while (true) {
				const right = parsed[wind]
				wind = (wind + 1) % length
				if (right) {
					if (x < max) {
						const next = x + 3
						if (board[y][next]) {
						} else if (y > 0 && board[y - 1][next]) {
						} else if (y > 1 && board[y - 2][next]) {
						} else {
							x++
						}
					}
				} else if (x > 0) {
					const next = x + 1
					if (board[y][x - 1]) {
					} else if (y > 0 && board[y - 1][next]) {
					} else if (y > 1 && board[y - 2][next]) {
					} else {
						x--
					}
				}
				const nextRow = board[y + 1]
				if (nextRow[x] || nextRow[x + 1] || nextRow[x + 2]) {
					const row = board[y]
					row[x] = true
					row[x + 1] = true
					row[x + 2] = true
					board[y - 1][x + 2] = true
					board[y - 2][x + 2] = true
					for (let range = 3 - y + 2; range >= 0; range--) {
						board.unshift([false, false, false, false, false, false, false])
					}
					break
				}
				y++
			}
		} else if (rock === 3) { // |
			const width = 1
			const max = 7 - width
			while (true) {
				const right = parsed[wind]
				wind = (wind + 1) % length
				if (right) {
					if (x < max) {
						const next = x + 1
						if (board[y][next]) {
						} else if (y > 0 && board[y - 1][next]) {
						} else if (y > 1 && board[y - 2][next]) {
						} else if (y > 2 && board[y - 3][next]) {
						} else {
							x++
						}
					}
				} else if (x > 0) {
					const next = x - 1
					if (board[y][next]) {
					} else if (y > 0 && board[y - 1][next]) {
					} else if (y > 1 && board[y - 2][next]) {
					} else if (y > 2 && board[y - 3][next]) {
					} else {
						x--
					}
				}
				if (board[y + 1][x]) {
					board[y][x] = true
					board[y - 1][x] = true
					board[y - 2][x] = true
					board[y - 3][x] = true
					for (let range = 3 - y + 3; range >= 0; range--) {
						board.unshift([false, false, false, false, false, false, false])
					}
					break
				}
				y++
			}
		} else { // square
			const width = 2
			const max = 7 - width
			while (true) {
				const right = parsed[wind]
				wind = (wind + 1) % length
				if (right) {
					if (x < max) {
						const next = x + 2
						if (board[y][next]) {
						} else if (y > 0 && board[y - 1][next]) {
						} else {
							x++
						}
					}
				} else if (x > 0) {
					const next = x - 1
					if (board[y][next]) {
					} else if (y > 0 && board[y - 1][next]) {
					} else {
						x--
					}
				}
				const nextRow = board[y + 1]
				if (nextRow[x] || nextRow[x + 1]) {
					board[y][x] = true
					board[y][x + 1] = true
					board[y - 1][x] = true
					board[y - 1][x + 1] = true
					for (let range = 3 - y + 1; range >= 0; range--) {
						board.unshift([false, false, false, false, false, false, false])
					}
					break
				}
				y++
			}
		}
		if (i % 100 === 0) {
			offset += board.length - 200
			board.length = 200
		}
		if (i % 5 === 0) {
			const max = new Array(7)
			for (let x = 0; x < 7; x++) {
				let y = 0
				while (board[y][x] === false) {
					y++
				}
				max[x] = y
			}
			const key = max.reduce((result, i) => result * 200 + i) * length + wind
			if (keys.has(key)) {
				const arr = keys.get(key)
				arr.push([i, offset])
				if (arr.length > 5) {
					return key
				}
			} else {
				keys.set(key, [[i, offset]])
			}
		}
		return null
	}

	for (let i = 0; i < 2022; i++) {
		move(i)
	}

	const result1 = board.length - 5 + offset

	let prevI = 0
	let prevOffset = 0

	for (let i = 2022; i < 20000; i++) {
		const key = move(i)
		// todo: detect repetition pattern automatically
		if (i % 3500 === 0) {
			prevI = i
			prevOffset = offset
		}
		if (key != null) {
			const arr = keys.get(key)
			const {length} = arr
			const arrx = arr.slice(1).map(([i, offset], x) => {
				const [i1, offset1] = arr[x]
				return [i - i1, offset - offset1]
			})
			if (arr.every(([i, offset], x) => {
				if (x < 2 || x < length - 4) {
					return true
				}
				const [i1, offset1] = arr[x - 1]
				const [i2, offset2] = arr[x - 2]
				return i - i1 === i1 - i2 && offset - offset1 === offset1 - offset2
			})) {
debugger
			}
		}
	}

	// console.log(board.map((row) => row.map((full) => full ? '\u2588' : ' ').join('')).join('\n'))

	const result2 = board.length - 5 + offset

	return [result1, result2]
}

export default (input) => {
	const parsed = input.split('\n\n')

	let result1 = 0
	let result2 = 0

	parsed.forEach((str) => {
		const rows = str.split('\n')
		const height = rows.length
		const width = rows[0].length

		const rowValues = new Uint32Array(height)
		const columnValues = new Uint32Array(width)

		for (let y = 0; y < height; y++) {
			const row = rows[y]
			for (let x = 0; x < width; x++) {
				rowValues[y] *= 2
				columnValues[x] *= 2
				if (row[x] === '#') {
					rowValues[y]++
					columnValues[x]++
				}
			}
		}

		loop: for (let i = 1; i < height; i++) {
			let smudge = false
			for (let from = i - 1, to = i; from >= 0 && to < height; from--, to++) {
				if (rowValues[from] !== rowValues[to]) {
					if (smudge) {
						continue loop
					} else {
						const diff = rowValues[from] ^ rowValues[to]
						if ((diff & (diff - 1)) === 0) {
							smudge = true
						} else {
							continue loop
						}
					}
				}
			}
			if (smudge) {
				result2 += i * 100
			} else {
				result1 += i * 100
			}
		}

		loop: for (let i = 1; i < width; i++) {
			let smudge = false
			for (let from = i - 1, to = i; from >= 0 && to < width; from--, to++) {
				if (columnValues[from] !== columnValues[to]) {
					if (smudge) {
						continue loop
					} else {
						const diff = columnValues[from] ^ columnValues[to]
						if ((diff & (diff - 1)) === 0) {
							smudge = true
						} else {
							continue loop
						}
					}
				}
			}
			if (smudge) {
				result2 += i
			} else {
				result1 += i
			}
		}
	})

	return [result1, result2]
}

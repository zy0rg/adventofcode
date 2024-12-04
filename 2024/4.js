export default (input) => {
	const rows = input.split('\n').map((row) => row.split(''))
	const {length: height} = rows
	const {length: width} = rows[0]

	const maxHeight1 = height - 4
	const maxWidth1 = width - 4
	const maxHeight2 = height - 1
	const maxWidth2 = width - 1

	let result1 = 0
	let result2 = 0

	const test1 = (x, y, xDiff, yDiff) => {
		x += xDiff
		y += yDiff
		if (rows[y][x] !== 'M') {
			return
		}
		x += xDiff
		y += yDiff
		if (rows[y][x] === 'A' && rows[y + yDiff][x + xDiff] === 'S') {
			result1++
		}
	}

	for (let y = 0; y < height; y++) {
		const row = rows[y]
		for (let x = 0; x < width; x++) {
			if (row[x] === 'X') {
				if (x >= 3) {
					test1(x, y, -1, 0)
					if (y >= 3) {
						test1(x, y, -1, -1)
					}
					if (y <= maxHeight1) {
						test1(x, y, -1, 1)
					}
				}
				if (x <= maxWidth1) {
					test1(x, y, 1, 0)
					if (y >= 3) {
						test1(x, y, 1, -1)
					}
					if (y <= maxHeight1) {
						test1(x, y, 1, 1)
					}
				}
				if (y >= 3) {
					test1(x, y, 0, -1)
				}
				if (y <= maxHeight1) {
					test1(x, y, 0, 1)
				}
			} else if (row[x] === 'A' && x > 0 && x < maxWidth2 && y > 0 && y < maxHeight2) {
				const prev = rows[y - 1]
				const next = rows[y + 1]
				if (((prev[x - 1] === 'M' && next[x + 1] === 'S') || (prev[x - 1] === 'S' && next[x + 1] === 'M')) &&
					((prev[x + 1] === 'M' && next[x - 1] === 'S') || (prev[x + 1] === 'S' && next[x - 1] === 'M'))) {
					result2++
				}
			}
		}
	}

	return [result1, result2]
}

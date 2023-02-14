export default (input) => {
	const parsed = input
		.split('\n')
		.map((str) => str
			.split(' -> ')
			.map((str) => str
				.split(',')
				.map((str) => parseInt(str))))

	const map = new Array(1000)
	for (let x = 0; x < 1000; x++) {
		map[x] = new Uint8Array(1000)
	}

	let maxY = 0

	parsed.forEach((coords) => {
		const {length} = coords
		let [x, y] = coords[0]
		if (y > maxY) {
			maxY = y
		}
		map[x][y] = 1
		for (let i = 1; i < length; i++) {
			const [x1, y1] = coords[i]
			if (x1 === x) {
				if (y1 > maxY) {
					maxY = y1
				}
				const column = map[x]
				while (y1 > y) {
					column[++y] = 1
				}
				while (y1 < y) {
					column[--y] = 1
				}
			} else {
				while (x1 > x) {
					map[++x][y] = 1
				}
				while (x1 < x) {
					map[--x][y] = 1
				}
			}
		}
	})

	let result1 = 0

	const add = (x, fromY) => {
		const column = map[x]
		const y = column.indexOf(1, fromY)
		if (y === fromY) {
			return false
		}
		if (y === -1) {
			return false
		}
		if (map[x - 1][y] === 0) {
			return add(x - 1, y)
		}
		if (map[x + 1][y] === 0) {
			return add(x + 1, y)
		}
		column[y - 1] = 1
		return true
	}

	while (true) {
		if (add(500, 0)) {
			result1++
		} else {
			break
		}
	}

	let result2 = result1
	maxY += 2

	for (let x = 0; x < 1000; x++) {
		map[x][maxY] = 1
	}

	while (true) {
		if (add(500, 0)) {
			result2++
		} else {
			break
		}
	}

	return [result1, result2]
}

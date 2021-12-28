const neighborsById = new Array(100)

let id = 0
for (let y = 0; y < 10; y++) {
	for (let x = 0; x < 10; x++, id++) {
		const neighbors = neighborsById[id] = []
		if (x !== 0) {
			neighbors.push(id - 1)
			if (y !== 0) {
				neighbors.push(id - 11)
			}
			if (y !== 9) {
				neighbors.push(id + 9)
			}
		}
		if (x !== 9) {
			neighbors.push(id + 1)
			if (y !== 0) {
				neighbors.push(id - 9)
			}
			if (y !== 9) {
				neighbors.push(id + 11)
			}
		}
		if (y !== 0) {
			neighbors.push(id - 10)
		}
		if (y !== 9) {
			neighbors.push(id + 10)
		}
	}
}

export default (input) => {
	const map = new Uint8Array(100)

	let position = 0
	let id = 0
	for (let y = 0; y < 10; y++) {
		for (let x = 0; x < 10; x++, position++, id++) {
			map[id] = input[position]
		}
		position++
	}

	let result1 = 0

	const flash = (id) => {
		const value = map[id]
		if (value === 10) {
			return
		}
		map[id]++
		if (value === 9) {
			const neighbors = neighborsById[id]
			const len = neighbors.length
			for (let i = 0; i < len; i++) {
				flash(neighbors[i])
			}
		}
	}

	let turn = 0
	for (; turn < 100; turn++) {
		for (let id = 0; id < 100; id++) {
			flash(id)
		}
		for (let id = 0; id < 100; id++) {
			if (map[id] === 10) {
				map[id] = 0
				result1++
			}
		}
	}

	let count
	do {
		count = 0
		for (let id = 0; id < 100; id++) {
			flash(id)
		}
		for (let id = 0; id < 100; id++) {
			if (map[id] === 10) {
				map[id] = 0
				count++
			}
		}
		turn++
	} while (count !== 100)

	return [result1, turn]
}

export default (input) => {
	const parsed = input.split('\n')

	const height = parsed.length
	const width = parsed[0].length
	const size = width * height
	const points = []

	let candidates = new Array(width).fill(false)
	let previousCandidates = new Array(width).fill(false)

	let id = 0
	const map = new Uint8Array(size)

	for (let y = 0; y < height; y++) {
		const current = parsed[y].split('').map((str) => parseInt(str))
		let previousNum = 10
		for (let x = 0; x < width; x++, id++) {
			const num = map[id] = current[x]
			if (previousCandidates[x] && num > map[id - width]) {
				points.push(id - width)
			}
			if (num < previousNum) {
				candidates[x] = y === 0 || num < map[id - width]
				if (candidates[x - 1]) {
					candidates[x - 1] = false
				}
			} else {
				candidates[x] = false
			}
			previousNum = num
		}
		[previousCandidates, candidates] = [candidates, previousCandidates]
	}

	for (let x = 0; x < width; x++) {
		if (previousCandidates[x]) {
			points.push(id - width + x)
		}
	}

	const len = points.length
	let result1 = len

	let a = 0
	let b = 0
	let c = 0
	const basin = new Set()
	const test = (id, previousNum) => {
		if (basin.has(id)) {
			return
		}
		const num = map[id]
		if (num === 9) {
			return
		}
		if (num > previousNum) {
			basin.add(id)
			if (id > width) {
				test(id - width, num)
			}
			if (id % width !== 0) {
				test(id - 1, num)
			}
			const bottom = id + width
			if (bottom < size) {
				test(bottom, num)
			}
			const right = id + 1
			if (right % width !== 0) {
				test(right, num)
			}
		}
	}

	for (let i = 0; i < len; i++) {
		const id = points[i]
		const value = map[id]
		result1 += value
		test(id, -1)
		const size = basin.size
		if (size > c) {
			if (size > b) {
				if (size > a) {
					[a, b, c] = [size, a, b]
				} else {
					[b, c] = [size, b]
				}
			} else {
				c = size
			}
		}
		basin.clear()
	}

	return [
		result1,
		a * b * c
	]
}

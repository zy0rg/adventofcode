export default (input) => {
	const parsed = input.split('\n')

	const overlaps1 = new Uint8Array(1000000)
	const overlaps2 = new Uint8Array(1000000)

	let result1 = 0
	let result2 = 0

	parsed.forEach((str) => {
		const [x1Str, y1Str, x2Str, y2Str] = str.split(/ -> |,/)

		let id
		let length
		let delta
		let diagonal

		if (x1Str === x2Str) {
			const x = parseInt(x1Str)
			const y1 = parseInt(y1Str)
			const y2 = parseInt(y2Str)
			if (y1 < y2) {
				id = y1 * 1000 + x
				length = y2 - y1
			} else {
				id = y2 * 1000 + x
				length = y1 - y2
			}
			delta = 1000
			diagonal = false
		} else if (y1Str === y2Str) {
			const x1 = parseInt(x1Str)
			const x2 = parseInt(x2Str)
			const y = parseInt(y1Str)
			if (x1 < x2) {
				id = y * 1000 + x1
				length = x2 - x1
			} else {
				id = y * 1000 + x2
				length = x1 - x2
			}
			delta = 1
			diagonal = false
		} else {
			const x1 = parseInt(x1Str)
			const x2 = parseInt(x2Str)
			const y1 = parseInt(y1Str)
			const y2 = parseInt(y2Str)
			if (y1 < y2) {
				id = y1 * 1000 + x1
				length = y2 - y1
				delta = x1 < x2
					? 1001
					: 999
			} else {
				id = y2 * 1000 + x2
				length = y1 - y2
				delta = x1 < x2
					? 999
					: 1001
			}
			diagonal = true
		}

		for (let i = 0; i <= length; i++) {
			if (diagonal) {
				const value = overlaps2[id]
				if (value === 0) {
					overlaps2[id] = 1
					if (overlaps1[id] === 1) {
						result2++
					}
				} else if (value === 1) {
					overlaps2[id] = 2
					if (overlaps1[id] === 0) {
						result2++
					}
				}
			} else {
				const value = overlaps1[id]
				if (value === 0) {
					overlaps1[id] = 1
					if (overlaps2[id] === 1) {
						result2++
					}
				} else if (value === 1) {
					overlaps1[id] = 2
					result1++
					if (overlaps2[id] === 0) {
						result2++
					}
				}
			}
			id += delta
		}
	})

	return [result1, result2]
}

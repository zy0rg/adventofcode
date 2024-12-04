export default (input) => {
	const parsed = input.split('\n')

	const height = parsed.length
	const width = parsed[0].length
	const size = height * width

	const maxX = width - 1
	const maxY = height - 1
	const maxX2 = width - 4
	const maxY2 = height - 4
	const destination = size - 1

	const map = new Uint8Array(size)

	let i = 0
	for (let y = 0; y < height; y++) {
		const row = parsed[y]
		for (let x = 0; x < width; x++) {
			map[i++] = row[x]
		}
	}

	let baseline = 0
	let x = 0
	let y = 0

	while (true) {
		if (x < maxX) {
			x++
		} else {
			x--
		}
		let i = y * width + x
		baseline += map[i]
		if (i === destination) {
			break
		}
		if (y < maxY) {
			y++
		} else {
			y--
		}
		i = y * width + x
		baseline += map[i]
		if (i === destination) {
			break
		}
	}

	const outputCache = new Int16Array(width * height * 2).fill(-1)
	const inputCache = new Int16Array(width * height * 2).fill(baseline)

	// 0 up
	// 1 right
	// 2 down
	// 3 left
	const move = (x, y, horizontal, inputValue) => {
		const i = x + y * width
		if (i === destination) {
			return inputValue
		}
		const key = i * 2 + (horizontal ? 1 : 0)

		if (inputCache[key] < inputValue) {
			return baseline
		}
		if (inputCache[key] === inputValue && outputCache[key] !== -1) {
			return outputCache[key]
		}

		inputCache[key] = inputValue

		let min = baseline

		if (horizontal) {
			if (y !== 0) {
				const max = y > 3 ? 3 : y
				let position = i
				let value = inputValue
				for (let j = 1; j <= max; j++) {
					position -= width
					value += map[position]
					const result = move(x, y - j, false, value)
					if (result < min) {
						min = result
					}
				}
			}

			if (y !== maxY) {
				const max = Math.min(3, maxY - y)
				let position = i
				let value = inputValue
				for (let j = 1; j <= max; j++) {
					position += width
					value += map[position]
					const result = move(x, y + j, false, value)
					if (result < min) {
						min = result
					}
				}
			}
		} else {
			if (x !== 0) {
				const max = x > 3 ? 3 : x
				let position = i
				let value = inputValue
				for (let j = 1; j <= max; j++) {
					position--
					value += map[position]
					const result = move(x - j, y, true, value)
					if (result < min) {
						min = result
					}
				}
			}

			if (x !== maxX) {
				const max = Math.min(3, maxX - x)
				let position = i
				let value = inputValue
				for (let j = 1; j <= max; j++) {
					position++
					value += map[position]
					const result = move(x + j, y, true, value)
					if (result < min) {
						min = result
					}
				}
			}
		}

		outputCache[key] = min
		return min
	}

	const result1 = Math.min(move(0, 0, false, 0), move(0, 0, true, 0))

	let baseline2 = 0
	x = 0
	y = 0

	while (true) {
		let i = y * width + x
		if (x < maxX2) {
			for (let j = Math.min(10, maxX - x); j >= 1; j--) {
				x++
				i++
				baseline2 += map[i]
			}
		} else {
			for (let j = 4; j >= 1; j--) {
				x--
				i--
				baseline2 += map[i]
			}
		}
		if (i === destination) {
			break
		}
		if (y < maxY2) {
			for (let j = Math.min(10, maxY - y); j >= 1; j--) {
				y++
				i += width
				baseline2 += map[i]
			}
		} else {
			for (let j = 4; j >= 1; j--) {
				y--
				i -= width
				baseline2 += map[i]
			}
		}
		if (i === destination) {
			break
		}
	}

	outputCache.fill(-1)
	inputCache.fill(baseline2)

	const move2 = (x, y, horizontal, inputValue) => {
		const i = x + y * width
		if (i === destination) {
			return inputValue
		}
		const key = i * 2 + (horizontal ? 1 : 0)

		if (inputCache[key] < inputValue) {
			return baseline2
		}
		if (inputCache[key] === inputValue && outputCache[key] !== -1) {
			return outputCache[key]
		}

		inputCache[key] = inputValue

		let min = baseline2

		if (horizontal) {
			if (y >= 4) {
				const max = y > 10 ? 10 : y
				let position = i
				let value = inputValue
				let j = 1
				for (; j < 4; j++) {
					position -= width
					value += map[position]
				}
				for (; j <= max; j++) {
					position -= width
					value += map[position]
					const result = move2(x, y - j, false, value)
					if (result < min) {
						min = result
					}
				}
			}

			if (y < maxY2) {
				const max = Math.min(10, maxY - y)
				let position = i
				let value = inputValue
				let j = 1
				for (; j < 4; j++) {
					position += width
					value += map[position]
				}
				for (; j <= max; j++) {
					position += width
					value += map[position]
					const result = move2(x, y + j, false, value)
					if (result < min) {
						min = result
					}
				}
			}
		} else {
			if (x >= 4) {
				const max = x > 10 ? 10 : x
				let position = i
				let value = inputValue
				let j = 1
				for (; j < 4; j++) {
					position--
					value += map[position]
				}
				for (; j <= max; j++) {
					position--
					value += map[position]
					const result = move2(x - j, y, true, value)
					if (result < min) {
						min = result
					}
				}
			}

			if (x < maxX2) {
				const max = Math.min(10, maxX - x)
				let position = i
				let value = inputValue
				let j = 1
				for (; j < 4; j++) {
					position++
					value += map[position]
				}
				for (; j <= max; j++) {
					position++
					value += map[position]
					const result = move2(x + j, y, true, value)
					if (result < min) {
						min = result
					}
				}
			}
		}

		outputCache[key] = min
		return min
	}

	const result2 = Math.min(move2(0, 0, false, 0), move2(0, 0, true, 0))

	return [result1, result2]
}

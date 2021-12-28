export default (input) => {
	const parsed = input.split('\n')

	const length = parsed.length
	const width = length * 5
	const size = width * width
	const blockYOffset = width * length

	const map = new Uint8Array(size)
	const min = new Uint32Array(size)

	let offset = 0
	parsed.forEach((str) => {
		for (let i = 0; i < length; i++) {
			const rawValue = parseInt(str[i])
			for (let y = 0; y < 5; y++) {
				for (let x = 0; x < 5; x++) {
					map[x * length + y * blockYOffset + i + offset] = (rawValue + x + y) % 9 || 9
				}
			}
		}
		offset += width
	})

	for (let position = 0; position < size; position++) {
		if (position < width) {
			min[position] = position === 0
				? 1
				: min[position - 1] + map[position]
		} else if (position % width === 0) {
			min[position] = min[position - width] + map[position]
		} else {
			let nextTop = position - width
			let nextLeft = position - 1
			const top = min[nextTop]
			const left = min[nextLeft]
			if (top > left) {
				let value = left + map[position]
				min[position] = value
				while (min[nextTop] > map[nextTop] + value) {
					min[nextTop] = map[nextTop] + value
					if (nextTop > width) {
						value = min[nextTop]
						nextTop -= width
					} else {
						break
					}
				}
			} else {
				let value = top + map[position]
				min[position] = value
				while (min[nextLeft] > map[nextLeft] + value) {
					min[nextLeft] = map[nextLeft] + value
					if (nextLeft % width !== 0) {
						value = min[nextLeft]
						nextLeft--
					} else {
						break
					}
				}
			}
		}
	}

	let lastRow = width * (length - 1)
	let lastColumn = length - 1
	let end = lastRow + length - 1

	let sum = 0

	const check = (position) => {
		const value = map[position]
		sum += value
		if (sum < min[position]) {
			min[position] = sum
			if (position !== end) {
				const x = position % width
				if (position < lastRow) {
					check(position + width)
				}
				if (x !== lastColumn) {
					check(position + 1)
				}
				if (position > width) {
					check(position - width)
				}
				if (x !== 0) {
					check(position - 1)
				}
			}
		}
		sum -= value
	}

	check(1)
	check(width)

	const result1 = min[end]

	lastRow = size - width
	lastColumn = width - 1
	end = size - 1

	for (let i = 0; i < length; i++) {
		const right = length + width * i
		sum = min[right - 1]
		check(right)
		const bottom = blockYOffset + i
		sum = min[bottom - width]
		check(bottom)
	}

	const result2 = min[end]

	return [result1, result2]
}

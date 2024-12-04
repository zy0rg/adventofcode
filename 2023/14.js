export default (input) => {
	const parsed = input.split('\n')

	const height = parsed.length
	const width = parsed[0].length

	const lastBlock = new Uint8Array(width)

	let result1 = 0

	const map = new Uint8Array(width * height)

	for (let y = 0; y < height; y++) {
		const row = parsed[y]
		for (let x = 0; x < width; x++) {
			const char = row[x]
			if (char === 'O') {
				map[y * width + x] = 1
				result1 += height - lastBlock[x]
				lastBlock[x]++
			} else if (char === '#') {
				map[y * width + x] = 2
				lastBlock[x] = y + 1
			}
		}
	}

	const cache = new Map()

	for (let i = 0; i < 1000000000; i++) {
		lastBlock.fill(0)
		for (let y = 0; y < height; y++) {
			for (let x = 0, i = y * width; x < width; x++, i++) {
				const char = map[i]
				if (char === 1) {
					map[i] = 0
					map[lastBlock[x] * width + x] = 1
					lastBlock[x]++
				} else if (char === 2) {
					lastBlock[x] = y + 1
				}
			}
		}
		lastBlock.fill(0)
		for (let x = 0; x < width; x++) {
			for (let y = 0, i = x; y < height; y++, i += width) {
				const char = map[i]
				if (char === 1) {
					map[i] = 0
					map[y * width + lastBlock[y]] = 1
					lastBlock[y]++
				} else if (char === 2) {
					lastBlock[y] = x + 1
				}
			}
		}
		lastBlock.fill(height - 1)
		for (let y = height - 1; y >= 0; y--) {
			for (let x = 0, i = y * width; x < width; x++, i++) {
				const char = map[i]
				if (char === 1) {
					map[i] = 0
					map[lastBlock[x] * width + x] = 1
					lastBlock[x]--
				} else if (char === 2) {
					lastBlock[x] = y - 1
				}
			}
		}
		lastBlock.fill(width - 1)
		for (let x = width - 1; x >= 0; x--) {
			for (let y = 0, i = x; y < height; y++, i += width) {
				const char = map[i]
				if (char === 1) {
					map[i] = 0
					map[y * width + lastBlock[y]] = 1
					lastBlock[y]--
				} else if (char === 2) {
					lastBlock[y] = x - 1
				}
			}
		}
		const key = map.join('')
		if (cache.has(key)) {
			i = 1000000000 - (1000000000 - i) % (i - cache.get(key))
			cache.clear()
		} else {
			cache.set(key, i)
		}
	}

	let result2 = 0

	for (let y = 0; y < height; y++) {
		for (let x = 0, i = y * width; x < width; x++, i++) {
			if (map[i] === 1) {
				// log2.push([height - y, x, y])
				result2 += height - y
			}
		}
	}

	// console.log(log2.sort((a, b) => a[1] - b[1] || a[2] - b[2]).join('\n'))

	return [result1, result2]
}

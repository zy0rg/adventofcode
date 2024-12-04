export default (input) => {
	const parsed = input.split('\n')

	const height = parsed.length
	const width = parsed[0].length

	const maxX = width - 1
	const maxY = height - 1

	let sum = 0

	const visited = new Uint8Array(width * height)

	// directions
	// 1 up
	// 2 right
	// 4 down
	// 8 left

	const test = (x, y, direction) => {
		const id = x + y * width
		if ((visited[id] & direction) !== 0) {
			return
		}
		if (visited[id] === 0) {
			sum++
		}
		visited[id] |= direction
		switch (parsed[y][x]) {
			case '.':
				switch (direction) {
					case 1:
						if (y !== 0) {
							test(x, y - 1, 1)
						}
						break
					case 2:
						if (x !== maxX) {
							test(x + 1, y, 2)
						}
						break
					case 4:
						if (y !== maxY) {
							test(x, y + 1, 4)
						}
						break
					case 8:
						if (x !== 0) {
							test(x - 1, y, 8)
						}
				}
				break
			case '/':
				switch (direction) {
					case 1:
						if (x !== maxX) {
							test(x + 1, y, 2)
						}
						break
					case 2:
						if (y !== 0) {
							test(x, y - 1, 1)
						}
						break
					case 4:
						if (x !== 0) {
							test(x - 1, y, 8)
						}
						break
					case 8:
						if (y !== maxY) {
							test(x, y + 1, 4)
						}
				}
				break
			case '\\':
				switch (direction) {
					case 1:
						if (x !== 0) {
							test(x - 1, y, 8)
						}
						break
					case 2:
						if (y !== maxY) {
							test(x, y + 1, 4)
						}
						break
					case 4:
						if (x !== maxX) {
							test(x + 1, y, 2)
						}
						break
					case 8:
						if (y !== 0) {
							test(x, y - 1, 1)
						}
				}
				break
			case '|':
				switch (direction) {
					case 1:
						if (y !== 0) {
							test(x, y - 1, 1)
						}
						break
					case 4:
						if (y !== maxY) {
							test(x, y + 1, 4)
						}
						break
					default:
						if (y !== 0) {
							test(x, y - 1, 1)
						}
						if (y !== maxY) {
							test(x, y + 1, 4)
						}
				}
				break
			case '-':
				switch (direction) {
					case 2:
						if (x !== maxX) {
							test(x + 1, y, 2)
						}
						break
					case 8:
						if (x !== 0) {
							test(x - 1, y, 8)
						}
						break
					default:
						if (x !== maxX) {
							test(x + 1, y, 2)
						}
						if (x !== 0) {
							test(x - 1, y, 8)
						}
				}
		}
	}

	test(0, 0, 2)

	const result1 = sum

	let result2 = 0

	for (let x = 0; x < width; x++) {
		sum = 0
		visited.fill(0)
		test(x, 0, 4)
		if (sum > result2) {
			result2 = sum
		}
		sum = 0
		visited.fill(0)
		test(x, maxY, 1)
		if (sum > result2) {
			result2 = sum
		}
	}

	for (let y = 0; y < height; y++) {
		sum = 0
		visited.fill(0)
		test(0, y, 2)
		if (sum > result2) {
			result2 = sum
		}
		sum = 0
		visited.fill(0)
		test(maxX, y, 8)
		if (sum > result2) {
			result2 = sum
		}
	}

	return [result1, result2]
}

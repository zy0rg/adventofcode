export default (input) => {
	const parsed = input.split('\n')

	const addWall = (x, y, end, lines, add, remove) => {
		lines.add(y)
		lines.add(end)
		if (add.has(y)) {
			add.get(y).push(x)
		} else {
			add.set(y, [x])
		}
		if (remove.has(end)) {
			remove.get(end).add(x)
		} else {
			remove.set(end, new Set([x]))
		}
	}

	let x = 0
	let y = 0
	const lines = new Set()
	const add = new Map()
	const remove = new Map()

	let x2 = 0
	let y2 = 0
	const lines2 = new Set()
	const add2 = new Map()
	const remove2 = new Map()

	parsed.forEach((str) => {
		const length = str.length
		const distance = parseInt(str.substring(2))
		const distance2 = parseInt(str.substring(length - 7, length - 2), 16)
		switch (str[0]) {
			case 'U':
				addWall(x, y -= distance, y + distance, lines, add, remove)
				break
			case 'R':
				x += distance
				break
			case 'D':
				addWall(x, y, y += distance, lines, add, remove)
				break
			case 'L':
				x -= distance
				break
		}
		switch (str[length - 2]) {
			case '3':
				addWall(x2, y2 -= distance2, y2 + distance2, lines2, add2, remove2)
				break
			case '0':
				x2 += distance2
				break
			case '1':
				addWall(x2, y2, y2 += distance2, lines2, add2, remove2)
				break
			case '2':
				x2 -= distance2
				break
		}
	})

	const solve = (lines, add, remove) => {

		let result = 0
		let lastY = 0
		let walls = []

		Array
			.from(lines)
			.sort((a, b) => a - b)
			.forEach((y) => {
				let width = 0
				const length = walls.length
				for (let i = 0; i < length; i += 2) {
					width += walls[i + 1] - walls[i] + 1
				}
				result += width * (y - lastY - 1)
				const lastWalls = walls
				if (remove.has(y)) {
					const wallsToRemove = remove.get(y)
					walls = walls.filter((x) => !wallsToRemove.has(x))
					if (add.has(y)) {
						walls.push(...add.get(y))
						walls.sort((a, b) => a - b)
					}
				} else if (add.has(y)) {
					walls = walls.slice()
					walls.push(...add.get(y))
					walls.sort((a, b) => a - b)
				}
				let j = 0
				let newLength = walls.length
				for (let i = 0; i < newLength; i += 2) {
					const start = walls[i]
					const end = walls[i + 1]
					result += end - start + 1
					while (j < length) {
						const lastStart = lastWalls[j]
						const lastEnd = lastWalls[j + 1]
						if (lastEnd <= end) {
							if (lastEnd < start) {
								result += lastEnd - lastStart + 1
							} else if (lastStart < start) {
								result += start - lastStart
							}
						} else {
							if (lastStart <= end) {
								if (lastStart < start) {
									result += start - lastStart
								}
								lastWalls[j] = end + 1
							}
							break
						}
						j += 2
					}
				}
				while (j < length) {
					result += lastWalls[j + 1] - lastWalls[j] + 1
					j += 2
				}
				lastY = y
			})
		return result
	}

	return [
		solve(lines, add, remove),
		solve(lines2, add2, remove2)
	]
}

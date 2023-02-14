export default (input) => {
	const parsed = input.split('\n')

	const directions = []
	const positions = []

	const height = parsed.length - 2
	const width = parsed[0].length - 2
	const max = height * width

	const exit = max - 1
	const maxX = width - 1
	const maxY = exit - width

	for (let y = 1; y <= height; y++) {
		const row = parsed[y]
		for (let x = 1; x <= width; x++) {
			const char = row.charAt(x)
			if (char === '>') {
				directions.push(0)
			} else if (char === 'v') {
				directions.push(1)
			} else if (char === '<') {
				directions.push(2)
			} else if (char === '^') {
				directions.push(3)
			} else {
				continue
			}
			positions.push((y - 1) * width + x - 1)
		}
	}

	const hurricanesCount = directions.length

	const moveHurricanes = () => {
		const occupied = new Set()

		for (let i = 0; i < hurricanesCount; i++) {
			const direction = directions[i]
			const position = positions[i]
			let next
			if (direction === 0) {
				const x = position % width
				next = x === maxX
					? position - maxX
					: position + 1
			} else if (direction === 1) {
				const y = position + width
				next = y >= max
					? y % width
					: y
			} else if (direction === 2) {
				const x = position % width
				next = x === 0
					? position - 1 + width
					: position - 1
			} else {
				const y = position - width
				next = y < 0
					? y + max
					: y
			}
			positions[i] = next
			occupied.add(next)
		}

		return occupied
	}

	const move = (options, target) => {
		let depth = 1
		while (true) {
			const occupied = moveHurricanes()
			const nextOptions = new Set()

			options.forEach((position) => {
				const x = position % width
				if (!occupied.has(position)) {
					nextOptions.add(position)
				}
				if (x !== maxX && position >= 0 && position < max) {
					const next = position + 1
					if (!occupied.has(next)) {
						nextOptions.add(next)
					}
				}
				if (position <= maxY) {
					const next = position + width
					if (!occupied.has(next)) {
						nextOptions.add(next)
					}
				}
				if (x !== 0 && position >= 0 && position < max) {
					const next = position - 1
					if (!occupied.has(next)) {
						nextOptions.add(next)
					}
				}
				if (position >= width) {
					const next = position - width
					if (!occupied.has(next)) {
						nextOptions.add(next)
					}
				}
			})

			depth++

			if (nextOptions.has(target)) {
				break
			}

			options = [...nextOptions]
		}

		return depth
	}

	const result1 = move([-width], exit)
	moveHurricanes()
	const back = move([exit + width], 0)
	moveHurricanes()
	const result2 = result1 + back + move([-width], exit)

	return [result1, result2]
}

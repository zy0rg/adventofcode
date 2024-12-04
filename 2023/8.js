export default (input) => {
	const [pathStr, , ...directionsStrArray] = input.split('\n')

	const pathLength = pathStr.length
	const path = new Uint8Array(pathLength)

	for (let i = 0; i < pathLength; i++) {
		if (pathStr[i] === 'R') {
			path[i] = 1
		}
	}

	let index = 0
	const directionIds = new Map()
	const directionsLength = directionsStrArray.length
	const left = new Uint16Array(directionsLength)
	const right = new Uint16Array(directionsLength)

	const part2Positions = []
	const part2Destinations = new Set()

	directionsStrArray.map((str) => {
		const name = str.substring(0, 3)
		const left = str.substring(7, 10)
		const right = str.substring(12, 15)

		if (name[2] === 'A') {
			part2Positions.push(index)
		}
		if (name[2] === 'Z') {
			part2Destinations.add(index)
		}

		directionIds.set(name, index++)

		return [left, right]
	}).forEach(([l, r], i) => {
		left[i] = directionIds.get(l)
		right[i] = directionIds.get(r)
	})

	const destination = directionIds.get('ZZZ')
	let directionPosition = directionIds.get('AAA')
	let cycles = 0
	let pathPosition = 0

	while (directionPosition !== destination) {
		directionPosition = path[pathPosition++] === 1
			? right[directionPosition]
			: left[directionPosition]
		if (pathPosition === pathLength) {
			pathPosition = 0
			cycles++
		}
	}

	const commonDivisors = []

	part2Positions.forEach((position) => {
		let cycles = 0
		let pathPosition = 0
		while (!part2Destinations.has(position)) {
			position = path[pathPosition++] === 1
				? right[position]
				: left[position]
			if (pathPosition === pathLength) {
				pathPosition = 0
				cycles++
			}
		}
		// const destination = position
		// do {
		// 	position = path[pathPosition++] === 1
		// 		? right[position]
		// 		: left[position]
		// 	if (pathPosition === pathLength) {
		// 		pathPosition = 0
		// 		cycles++
		// 	}
		// } while (position !== destination)

		let commonDivisorsIndex = 0

		const addDivisor = (i) => {
			const index = commonDivisors.indexOf(i, commonDivisorsIndex)
			if (index === -1) {
				const insertTo = commonDivisors.findIndex((num) => num > i)
				if (insertTo === -1) {
					commonDivisors.push(i)
					commonDivisorsIndex = commonDivisors.length
				} else {
					commonDivisors.splice(insertTo, 0, i)
					commonDivisorsIndex = insertTo
				}
			} else {
				commonDivisorsIndex = index + 1
			}
		}

		let num = pathPosition + cycles * pathLength
		for (let i = 2; i < num / 2; i++) {
			if (num % i === 0) {
				addDivisor(i)
				num /= i
				i--
			}
		}

		addDivisor(num)
	})

	return [
		pathPosition + cycles * pathLength,
		commonDivisors.reduce((a, b) => a * b)
	]
}

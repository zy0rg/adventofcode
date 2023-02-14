export default (input) => {
	const parsed = input.split('\n').map((str) => str.split(',').map((str) => parseInt(str)))

	const internal = new Set()
	const wall = new Set()
	const double = new Set()
	const toTest = new Set()

	const maxCoordinate = 100
	const xMultiplier = 1
	const yMultiplier = xMultiplier * maxCoordinate
	const zMultiplier = yMultiplier * maxCoordinate
	const typeMultiplier = zMultiplier * maxCoordinate

	// type: 0: horizontal, 1: vertical side, 2: vertical front

	let maxX = 0
	let maxY = 0
	let maxZ = 0

	const add = (type, coordinate) => {
		const id = coordinate + type * typeMultiplier
		if (wall.has(id)) {
			double.add(id)
		} else {
			wall.add(id)
		}
	}

	const addToTest = (coordinate) => {
		if (!internal.has(coordinate)) {
			toTest.add(coordinate)
		}
	}

	parsed.forEach(([x, y, z]) => {
		if (x > maxX) {
			maxX = x
		}
		if (y > maxY) {
			maxY = y
		}
		if (z > maxZ) {
			maxZ = z
		}
		const coordinate = x * xMultiplier
			+ y * yMultiplier
			+ z * zMultiplier
		internal.add(coordinate)
		if (toTest.has(coordinate)) {
			toTest.delete(coordinate)
		}

		add(0, coordinate) // top
		add(0, coordinate + yMultiplier) // bottom
		add(1, coordinate) // left
		add(1, coordinate + xMultiplier) // right
		add(2, coordinate) // front
		add(2, coordinate + zMultiplier) // back

		addToTest(coordinate - yMultiplier)
		addToTest(coordinate + yMultiplier)
		addToTest(coordinate - xMultiplier)
		addToTest(coordinate + xMultiplier)
		addToTest(coordinate - zMultiplier)
		addToTest(coordinate + zMultiplier)
	})

	const result1 = wall.size - double.size

	const visited = new Set()
	const external = new Set()

	const checkIfInternal = (coordinate) => {
		if (visited.has(coordinate)) {
			return true
		}
		if (internal.has(coordinate)) {
			return true
		}
		if (external.has(coordinate)) {
			return false
		}
		visited.add(coordinate)

		const x = Math.floor((coordinate % yMultiplier) / xMultiplier)
		const y = Math.floor((coordinate % zMultiplier) / yMultiplier)
		const z = Math.floor(coordinate / zMultiplier)

		if (y < 0 || y > maxY || x < 0 || x > maxX || z < 0 || z > maxZ) {
			return false
		}

		const top = coordinate - yMultiplier
		const bottom = coordinate + yMultiplier
		const left = coordinate - xMultiplier
		const right = coordinate + xMultiplier
		const front = coordinate - zMultiplier
		const back = coordinate + zMultiplier

		const result = checkIfInternal(top)
			&& checkIfInternal(bottom)
			&& checkIfInternal(left)
			&& checkIfInternal(right)
			&& checkIfInternal(front)
			&& checkIfInternal(back)

		if (result) {
			// TODO: find out why it doesn't work
			// internal.add(coordinate)
		} else {
			external.add(coordinate)
		}

		return result
	}

	const markWall = (type, coordinate) => {
		const id = coordinate + type * typeMultiplier
		if (wall.has(id)) {
			double.add(id)
		}
	}

	for (let coordinate of toTest) {
		visited.clear()
		if (checkIfInternal(coordinate)) {
			markWall(0, coordinate) // top
			markWall(0, coordinate + yMultiplier) // bottom
			markWall(1, coordinate) // left
			markWall(1, coordinate + xMultiplier) // right
			markWall(2, coordinate) // front
			markWall(2, coordinate + zMultiplier) // back
		}
	}

	const result2 = wall.size - double.size

	return [result1, result2]
}

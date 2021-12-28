const char = ['.', '>', 'v']

const stringify = (array, width) => {
	const {length} = array
	const result = []
	for (let i = 0; i < length; i += width) {
		result.push(Array.from(array.subarray(i, i + width)).map((value) => char[value]).join(''))
	}
	return result.join('\n')
}

export default (input) => {
	const lines = input.split('\n')
	const height = lines.length
	const width = lines[0].length

	let map = new Uint8Array(width * height)
	let altMap = map.slice()
	const right = []
	const down = []

	let id = 0
	lines.forEach((str) => {
		for (let i = 0; i < width; i++) {
			const value = str[i]
			if (value === '>') {
				map[id] = 1
				right.push(id)
			} else if (value === 'v') {
				map[id] = 2
				down.push(id)
			}
			id++
		}
	})

	const lastLine = height - 1
	const lastColumn = width - 1
	const downCount = down.length
	const rightCount = right.length
	let moved = true
	let i = 0

	while (moved) {
		i++
		moved = false
		for (let i = 0; i < rightCount; i++) {
			const id = right[i]
			const nextId = id % width === lastColumn
				? id - lastColumn
				: id + 1
			if (map[nextId] === 0) {
				altMap[nextId] = 1
				right[i] = nextId
				moved = true
			} else {
				altMap[id] = 1
			}
		}
		for (let i = 0; i < downCount; i++) {
			const id = down[i]
			const nextId = id / width >= lastLine
				? id % width
				: id + width
			if (map[nextId] !== 2 && altMap[nextId] === 0) {
				altMap[nextId] = 2
				down[i] = nextId
				moved = true
			} else {
				altMap[id] = 2
			}
		}
		map.fill(0);
		[map, altMap] = [altMap, map]
	}

	return [i]
}

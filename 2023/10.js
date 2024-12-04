const detectShape = (a, b) => {
	switch (a) {
		case 0:
			switch (b) {
				case 1:
					return 'L'
				case 2:
					return '|'
				case 3:
					return 'J'
			}
			break
		case 1:
			switch (b) {
				case 0:
					return 'L'
				case 2:
					return 'F'
				case 3:
					return '-'
			}
			break
		case 2:
			switch (b) {
				case 0:
					return '|'
				case 1:
					return 'F'
				case 3:
					return '7'
			}
			break
		case 3:
			switch (b) {
				case 0:
					return 'J'
				case 1:
					return '-'
				case 2:
					return '7'
			}
			break
	}
}

export default (input) => {
	const parsed = input.split('\n')
	const height = parsed.length
	const width = parsed[0].length

	const loops = [[]]
	const loopIndices = new Int16Array(width * height)
	const lastRowConnectedDown = new Array(width).fill(false)

	let s = -1
	let targetLoop = -1
	let sShape = '.'
	// 0 top
	// 1 right
	// 2 bottom
	// 3 left
	const adjacent = new Map()

	parsed.forEach((str, y) => {
		let connectedRight = false
		for (let x = 0; x < width; x++) {
			const char = str[x]
			const position = y * width + x
			let loopIndex = 0
			switch (char) {
				case '|':
					if (lastRowConnectedDown[x]) {
						loopIndex = loopIndices[position - width]
					} else if (y > 0 && s === position - width) {
						loopIndex = loops.length
						loops.push([])
						adjacent.set(loopIndex, 2)
						lastRowConnectedDown[x] = true
					}
					connectedRight = false
					break
				case '-':
					lastRowConnectedDown[x] = false
					if (connectedRight) {
						loopIndex = loopIndices[position - 1]
					} else if (x > 0 && s === position - 1) {
						loopIndex = loops.length
						loops.push([])
						adjacent.set(loopIndex, 1)
						connectedRight = true
					}
					break
				case 'L':
					if (lastRowConnectedDown[x]) {
						loopIndex = loopIndices[position - width]
						lastRowConnectedDown[x] = false
						connectedRight = true
					} else if (y > 0 && s === position - width) {
						loopIndex = loops.length
						loops.push([])
						adjacent.set(loopIndex, 2)
						connectedRight = true
					} else {
						connectedRight = false
					}
					break
				case 'J':
					if (lastRowConnectedDown[x]) {
						loopIndex = loopIndices[position - width]
						if (connectedRight) {
							const leftIndex = loopIndices[position - 1]
							if (leftIndex !== loopIndex) {
								loops[loopIndex].push(...loops[leftIndex])
								loops[leftIndex].forEach((position) => {
									loopIndices[position] = loopIndex
								})
								loops[leftIndex].length = 0
								if (adjacent.has(leftIndex)) {
									if (adjacent.has(loopIndex)) {
										targetLoop = loopIndex
										sShape = detectShape(adjacent.get(leftIndex), adjacent.get(loopIndex))
									} else {
										adjacent.set(loopIndex, adjacent.get(leftIndex))
										adjacent.delete(leftIndex)
									}
								}
							}
							connectedRight = false
						} else if (x > 0 && s === position - 1) {
							if (adjacent.has(loopIndex)) {
								targetLoop = loopIndex
								sShape = detectShape(1, adjacent.get(loopIndex))
							} else {
								adjacent.set(loopIndex, 1)
							}
						}
						lastRowConnectedDown[x] = false
					} else if (connectedRight) {
						loopIndex = loopIndices[position - 1]
						if (y > 0 && s === position - width) {
							if (adjacent.has(loopIndex)) {
								targetLoop = loopIndex
								sShape = detectShape(2, adjacent.get(loopIndex))
							} else {
								adjacent.set(loopIndex, 2)
							}
						}
						connectedRight = false
					}
					break
				case '7':
					if (connectedRight) {
						loopIndex = loopIndices[position - 1]
						lastRowConnectedDown[x] = true
					} else if (x > 0 && s === position - 1) {
						loopIndex = loops.length
						loops.push([])
						adjacent.set(loopIndex, 1)
						lastRowConnectedDown[x] = true
					} else {
						lastRowConnectedDown[x] = false
					}
					connectedRight = false
					break
				case 'F':
					lastRowConnectedDown[x] = true
					connectedRight = true
					loopIndex = loops.length
					loops.push([])
					break
				case 'S':
					s = position
					if (lastRowConnectedDown[x]) {
						const topIndex = loopIndices[position - width]
						if (connectedRight) {
							const leftIndex = loopIndices[position - 1]
							if (topIndex === leftIndex) {
								targetLoop = topIndex
								sShape = 'J'
							} else {
								adjacent.set(topIndex, 0)
								adjacent.set(leftIndex, 3)
							}
						} else {
							adjacent.set(topIndex, 0)
						}
					} else if (connectedRight) {
						const leftIndex = loopIndices[position - 1]
						adjacent.set(leftIndex, 3)
					}
					lastRowConnectedDown[x] = false
					connectedRight = false
					continue
				case '.':
					lastRowConnectedDown[x] = false
					connectedRight = false
					continue
			}
			loopIndices[position] = loopIndex
			loops[loopIndex].push(position)
		}
	})

	const result1 = (loops[targetLoop].length + 1) / 2

	loopIndices[s] = targetLoop

	let result2 = 0
	// 0 don't count
	// 1 count
	// 2 start counting if line goes down (7)
	// 3 start counting if line goes up (J)
	let count = 0

	loopIndices.forEach((index, position) => {
		if (index === targetLoop) {
			const x = position % width
			let shape = position === s
				? sShape
				: parsed[(position - x) / width][x]
			switch (shape) {
				case '|':
					count = count === 1
						? 0
						: 1
					break
				case 'L':
					count = count === 1
						? 3
						: 2
					break
				case 'J':
					count = count === 3
						? 1
						: 0
					break
				case '7':
					count = count === 2
						? 1
						: 0
					break
				case 'F':
					count = count === 1
						? 2
						: 3
					break
				case 'S':
					break
			}
		} else if (count === 1) {
			result2++
		}
	})

	return [result1, result2]
}

export default (input) => {
	// const blocks = input.split('\n').map((str) => str.split(/[,~]/).map((str) => parseInt(str)))

	const values = new Int16Array(input.split(/[,~\s]/))
	const length = values.length / 6
	const blocks = new Array(length)

	let minX = Infinity
	let minY = Infinity
	let maxX = -Infinity
	let maxY = -Infinity

	for (let i = 0, offset = 0; i < length; i++) {
		const [x0, y0, , x1, y1] = blocks[i] = values.subarray(offset, offset += 6)
		if (x0 < minX) {
			minX = x0
		}
		if (x1 > maxX) {
			maxX = x1
		}
		if (y0 < minY) {
			minY = y0
		}
		if (y1 > maxY) {
			maxY = y1
		}
	}

	const width = maxX - minX + 1
	const size = width * (maxY - minY + 1)
	const heightMap = new Int16Array(size)
	const blocksMap = new Int16Array(size).fill(-1)
	const supports = new Array(length)
	const uniqueSupports = new Array(length)
	const supportedBy = new Array(length)
	const sorted = blocks.sort((a, b) => a[2] - b[2])

	for (let i = 0; i < length; i++) {
		supports[i] = []
		uniqueSupports[i] = []
	}

	sorted.forEach(([x0, y0, z0, x1, y1, z1], index) => {
		let z = 0
		const start = (y0 - minY) * width + x0 - minX
		for (let y = y0, i = start; y <= y1; y++, i += width) {
			for (let x = x0; x <= x1; x++, i++) {
				if (heightMap[i] > z) {
					z = heightMap[i]
				}
			}
			i--
		}
		const nextZ = z + z1 - z0 + 1
		const supportedBySet = new Set()
		for (let y = y0, i = start; y <= y1; y++, i += width) {
			for (let x = x0; x <= x1; x++, i++) {
				if (heightMap[i] === z && blocksMap[i] !== -1) {
					supportedBySet.add(blocksMap[i])
				}
				heightMap[i] = nextZ
				blocksMap[i] = index
			}
			i--
		}
		const supportedByArray = supportedBy[index] =Array.from(supportedBySet)
		if (supportedByArray.length === 1) {
				supports[supportedByArray[0]].push(index)
				uniqueSupports[supportedByArray[0]].push(index)
		} else {
			supportedByArray.forEach((supporter) => {
				supports[supporter].push(index)
			})
		}
	})

	let result1 = 0

	uniqueSupports.forEach((arr) => {
		if (arr.length === 0) {
			result1++
		}
	})

	let result2 = 0

	const removed = new Set()

	const remove = (index) => {
		let result = 0
		const next = []
		supports[index].forEach((index) => {
			if (supportedBy[index].some((index) => !removed.has(index))) {
				return
			}
			if (!removed.has(index)) {
				removed.add(index)
				next.push(index)
				result++
			}
		})
		next.forEach((index) => {
			result += remove(index)
		})
		return result
	}

	for (let i = 0; i < length; i++) {
		removed.add(i)
		result2 += remove(i)
		removed.clear()
	}

	return [result1, result2]
}

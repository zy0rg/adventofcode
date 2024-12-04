export default (input) => {
	const parsed = input.split('\n')
	const width = parsed[0].length
	const height = parsed.length
	const maxX = width - 1
	const maxY = height - 1

	// const map = new Array(height)
	//
	// for (let y = 0; y < height; y++) {
	// 	map[y] = new Array(width).fill(' ')
	// }

	const junctionIds = new Map()
	junctionIds.set(1, 0) // start
	junctionIds.set(maxY * width + maxX - 1, 1) // end

	let x = 1
	let y = 1
	let currentJunction = 1
	let currentPath = 0
	let currentLength = 1
	const currentOptions = []
	let pathId = 0
	let fromJunctionId = 0
	const pendingPaths = []
	const junctionPaths = [[], []]

	let previous = 1

	while (true) {
		const str = parsed[y]
		const i = y * width + x
		if (x > 0) {
			const next = str[x - 1]
			if (next !== '#' && previous !== i - 1) {
				currentOptions.push([x - 1, y])
			}
		}
		if (x < maxX) {
			const next = str[x + 1]
			if (next !== '#' && previous !== i + 1) {
				currentOptions.push([x + 1, y])
			}
		}
		if (y > 0) {
			const next = parsed[y - 1][x]
			if (next !== '#' && previous !== i - width) {
				currentOptions.push([x, y - 1])
			}
		}
		if (y < maxY) {
			const next = parsed[y + 1][x]
			if (next !== '#' && previous !== i + width) {
				currentOptions.push([x, y + 1])
			}
		}
		// map[y][x] = pathId.toString(36).split('').pop()
		if (currentOptions.length === 1) {
			previous = i
			currentLength++
			[x, y] = currentOptions[0]
			currentOptions.length = 0
			continue
		}
		const junctionId = junctionIds.has(i)
			? junctionIds.get(i)
			: ++currentJunction
		if (currentOptions.length !== 0 && !junctionIds.has(i)) {
			junctionIds.set(i, junctionId)
			junctionPaths[junctionId] = []
			currentOptions.forEach(([x, y]) => {
				const position = y * width + x
				const pathId = ++currentPath
				const path = [junctionId, pathId, x, y, position]
				switch (parsed[y][x]) {
					case '.':
						break
					case '^':
						if (i - position !== width) {
							return
						}
						path[3]--
						break
					case '>':
						if (position - i !== 1) {
							return
						}
						path[2]++
						break
					case 'v':
						if (position - i !== width) {
							return
						}
						path[3]++
						break
					case '<':
						if (i - position !== 1) {
							return
						}
						path[2]--
						break
				}
				// map[y][x] = pathId.toString(36).split('').pop()
				pendingPaths.push(path)
			})
		}
		junctionPaths[fromJunctionId].push([junctionId, currentLength])
		if (pendingPaths.length === 0) {
			break
		}
		[fromJunctionId, pathId, x, y, previous] = pendingPaths.shift()
		currentLength = 2
		currentOptions.length = 0
	}

	// console.log(map.map((str) => str.join('')).join('\n'))

	const visited = new Set()

	const findLongest = (i) => {
		if (i === 1) {
			return 0 // end
		}
		if (visited.has(i)) {
			return -Infinity
		}
		visited.add(i)
		const next = junctionPaths[i]
		const max = Math.max(...next.map(([i, length]) => length + findLongest(i)))
		visited.delete(i)
		return max
	}

	const result1 = findLongest(0)

	junctionPaths.forEach((paths, j) => {
		paths.forEach(([i, length]) => {
			if (!junctionPaths[i].some(([to]) => to === j)) {
				junctionPaths[i].push([j, length])
			}
		})
	})

	return [
		result1,
		findLongest(0)
	]
}

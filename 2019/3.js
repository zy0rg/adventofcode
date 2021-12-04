const parse = (input) => input
	.split('\n')
	.map((str) => str
		.split(',')
		.map((item) => [item.charAt(0), +item.substring(1)]))

const iterate = (arr, callback) => {
	let x = 0
	let y = 0
	let r = 0

	arr.forEach(([dir, length]) => {
		switch (dir) {
			case 'U':
				for (let i = 0; i < length; i++) {
					callback(x, ++y, ++r)
				}
				break
			case 'D':
				for (let i = 0; i < length; i++) {
					callback(x, --y, ++r)
				}
				break
			case 'L':
				for (let i = 0; i < length; i++) {
					callback(--x, y, ++r)
				}
				break
			case 'R':
				for (let i = 0; i < length; i++) {
					callback(++x, y, ++r)
				}
				break
		}
	})
}

export default (input) => {
	const parsed = parse(input)

	const visited = new Map([['0,0', 0]])
	const crossPositions = []
	const crossRanges = []

	iterate(parsed[0], (x, y, i) => {
		const key = `${x},${y}`
		if (!visited.has(key)) {
			visited.set(key, i)
		}
	})
	iterate(parsed[1], (x, y, i) => {
		const key = `${x},${y}`
		if (visited.has(key)) {
			crossPositions.push(Math.abs(x) + Math.abs(y))
			crossRanges.push(visited.get(key) + i)
		}
	})

	return [Math.min(...crossPositions), Math.min(...crossRanges)]
}

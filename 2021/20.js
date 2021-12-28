const maxSteps = 50

export default (input) => {
	const [mappingsStr, mapStr] = input.split('\n\n')

	const mappings = new Uint8Array(512)
	for (let i = 0; i < 512; i++) {
		if (mappingsStr[i] === '#') {
			mappings[i] = mappingsStr[i] === '#'
		}
	}

	const linesStr = mapStr.split('\n')
	const height = linesStr.length
	const rawWidth = linesStr[0].length
	const extendedHeight = height + maxSteps * 2
	const extendedWidth = rawWidth + maxSteps * 2
	let map = {}
	let alt = {}
	let defaultValue = 0

	linesStr.forEach((str, y) => {
		let id = (y + maxSteps) * extendedWidth + maxSteps
		for (let x = 0; x < rawWidth; x++, id++) {
			map[id] = str[x] === '#' ? 1 : 0
		}
	})

	const tl = -extendedWidth - 1
	const tc = -extendedWidth
	const tr = -extendedWidth + 1
	const cl = -1
	const cr = 1
	const bl = extendedWidth - 1
	const bc = extendedWidth
	const br = extendedWidth + 1

	const get = (id) => map[id] ?? defaultValue

	const turn = (step) => {
		const min = maxSteps - step
		const maxY = extendedHeight - min
		const maxX = extendedWidth - min
		for (let y = min; y < maxY; y++) {
			let id = y * extendedWidth + min
			for (let x = min; x < maxX; x++, id++) {
				const value =
					get(id + tl) * 256 +
					get(id + tc) * 128 +
					get(id + tr) * 64 +
					get(id + cl) * 32 +
					get(id) * 16 +
					get(id + cr) * 8 +
					get(id + bl) * 4 +
					get(id + bc) * 2 +
					get(id + br)
				alt[id] = mappings[value]
			}
		}
		defaultValue = mappings[defaultValue === 0 ? 0 : 511];
		[map, alt] = [alt, map]
	}

	turn(1)
	turn(2)

	let result1 = 0

	for (let i of Object.keys(map)) {
		if (map[i] === 1) {
			result1++
		}
	}

	for (let i = 3; i <= 50; i++) {
		turn(i)
	}

	let result2 = 0

	for (let i of Object.keys(map)) {
		if (map[i] === 1) {
			result2++
		}
	}

	return [result1, result2]
}

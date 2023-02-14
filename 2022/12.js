export default (input) => {
	const parsed = input.split('\n')

	const height = parsed.length
	const width = parsed[0].length

	const size = height * width
	const maxX = width - 1
	const maxY = size - width

	let i = 0
	let start = 0
	let end = 0
	const map = new Uint8Array(size)
	const distance = new Uint32Array(size)
	distance.fill(-1)

	parsed.forEach((str) => {
		for (let x = 0; x < width; x++) {
			const code = str.charCodeAt(x)
			if (code === 83) {
				start = i
				map[i++] = 0
			} else if (code === 69) {
				distance[i] = 0
				end = i
				map[i++] = 25
			} else {
				map[i++] = code - 97
			}
		}
	})

	const stack = new Uint32Array(size)
	stack[0] = end
	let stackLength = 1

	let min = distance[0]

	while (stackLength > 0) {
		stackLength--
		const i = stack[stackLength]
		const v = map[i]
		const vm = v - 1
		const d = distance[i]
		const dp = d + 1
		const x = i % width
		if (v === 0 && d < min) {
			min = d
		}
		if (x > 0) {
			const n = i - 1
			const vx = map[n]
			if (vx >= vm && distance[n] > dp) {
				distance[n] = dp
				stack[stackLength] = n
				stackLength++
			}
		}
		if (x < maxX) {
			const n = i + 1
			const vx = map[n]
			if (vx >= vm && distance[n] > dp) {
				distance[n] = dp
				stack[stackLength] = n
				stackLength++
			}
		}
		if (i >= width) {
			const n = i - width
			const vx = map[n]
			if (vx >= vm && distance[n] > dp) {
				distance[n] = dp
				stack[stackLength] = n
				stackLength++
			}
		}
		if (i < maxY) {
			const n = i + width
			const vx = map[n]
			if (vx >= vm && distance[n] > dp) {
				distance[n] = dp
				stack[stackLength] = n
				stackLength++
			}
		}
	}

	return [distance[start], min]
}

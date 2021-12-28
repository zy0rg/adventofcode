export default (input) => {
	const width = 25
	const height = 6
	const size = width * height
	let min = Infinity
	let result1 = 0
	const image = new Uint8Array(size).fill(2)

	let x = 0
	let zero = 0
	let one = 0
	let two = 0
	input.split('').forEach((char) => {
		if (char === '0') {
			zero++
			if (image[x] === 2) {
				image[x] = 0
			}
		} else if (char === '1') {
			one++
			if (image[x] === 2) {
				image[x] = 1
			}
		} else if (char === '2') {
			two++
		}
		x++
		if (x === size) {
			x = 0
			if (zero < min) {
				min = zero
				result1 = one * two
				zero = 0
				one = 0
				two = 0
			}
		}
	})

	let result2 = ['']

	for (let i = 0; i < size; i += width) {
		result2.push(Array.from(image.subarray(i, i + width), (value) => value === 1 ? '\u2588' : ' ').join(''))
	}

	return [result1, result2.join('\n')]
}

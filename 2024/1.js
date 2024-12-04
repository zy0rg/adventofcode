export default (input) => {
	const rows = input.split('\n')
	const {length} = rows
	const left = new Int32Array(length)
	const right = new Int32Array(length)

	for (let i = 0; i < length; i++) {
		([left[i], right[i]] = rows[i].split('   '))
	}

	left.sort((a, b) => a - b)
	right.sort((a, b) => a - b)

	let result1 = 0
	let result2 = 0
	let z = 0

	for (let i = 0; i < length; i++) {
		const a = left[i]
		const b = right[i]
		result1 += a > b ? a - b : b - a
		for (let j = z; j < length; j++) {
			const b = right[j]
			if (a === b) {
				result2 += a
			} else if (b > a) {
				break
			} else {
				z++
			}
		}
	}

	return [result1, result2]
}

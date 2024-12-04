const getNext = (array, length) => {
	const max = length - 1
	const first = array[0]
	let allZero = true
	for (let i = 0; i < max; i++) {
		if ((array[i] = array[i + 1] - array[i]) !== 0) {
			allZero = false
		}
	}
	if (allZero) {
		return [first, first]
	}
	const [f, l] = getNext(array, max)
	return [first - f, array[max] + l]
}

export default (input) => {
	let result1 = 0
	let result2 = 0

	input.split('\n').map((str) => {
		const numbers = new Int32Array(str.split(' '))
		const [prev, next] = getNext(numbers, numbers.length)
		result1 += next
		result2 += prev
	})

	return [result1, result2]
}

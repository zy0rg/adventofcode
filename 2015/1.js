export default (input) => {
	const length = input.length
	let result1 = 0
	let result2 = -1

	for (let i = 0;i<length;i++) {
		if (input[i] === '(') {
			result1++
		} else {
			result1--
			if (result1 < 0 && result2 === -1) {
				result2 = i + 1
			}
		}
	}

	return [result1, result2]
}

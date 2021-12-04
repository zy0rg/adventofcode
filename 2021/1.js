export default (input) => {
	let result1 = 0
	let result2 = 0

	input
		.split('\n')
		.map((str) => parseInt(str))
		.forEach((num, i, arr) => {
			if (i > 0) {
				if (num > arr[i - 1]) {
					result1++
				}
				if (i > 2) {
					if (num > arr[i - 3]) {
						result2++
					}
				}
			}
		});

	return [result1, result2]
}

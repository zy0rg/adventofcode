export default (input) => {
	const parsed = input.split('\n')

	const digits = []

	const add = (diff, i) => {
		const value = digits.hasOwnProperty(i)
			? digits[i] + diff
			: diff
		if (value < -2) {
			digits[i] = value + 5
			add(-1, i + 1)
		} else if (value > 2) {
			digits[i] = value - 5
			add(1, i + 1)
		} else {
			digits[i] = value
		}
	}

	parsed.forEach((str) =>
		str.split('').reverse().forEach((char, i) => {
			if (char === '2') {
				add(2, i)
			} else if (char === '1') {
				add(1, i)
			} else if (char === '-') {
				add(-1, i)
			} else if (char === '=') {
				add(-2, i)
			}
		}))

	const result1 = digits
		.map((value) =>
			value === -2
				? '='
				: value === -1
					? '-'
					: value)
		.reverse()
		.join('')

	return [result1]
}

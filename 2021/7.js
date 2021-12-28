export default (input) => {
	const values = input.split(',').map((str) => parseInt(str))
	const len = values.length
	const max = Math.max(...values) + 1
	const counts = new Uint16Array(max)

	for (let i = 0; i < len; i++) {
		counts[values[i]]++
	}

	const limit = len / 2
	let count = 0
	let sum1 = 0
	let i = 0

	for (; count < limit; i++) {
		sum1 += count
		const value = counts[i]
		if (value !== 0) {
			count += value
		}
	}

	sum1 -= (len - count) * (i - 1) // this might be incorrect

	for (; i < max; i++) {
		const value = counts[i]
		if (value !== 0) {
			sum1 += value * i
		}
	}

	let i1 = 0
	let c1 = 0
	let s1 = 0
	let x1 = 0
	let i2 = max - 1
	let c2 = 0
	let s2 = 0
	let x2 = 0

	while (i1 <= i2) {
		if (s1 <= s2) {
			x1 += (s1 += c1)
			const value = counts[i1]
			if (value !== 0) {
				c1 += value
			}
			i1++
		} else {
			x2 += (s2 += c2)
			const value = counts[i2]
			if (value !== 0) {
				c2 += value
			}
			i2--
		}
	}

	s1 += c1
	s2 += c2

	if (s1 <= s2) {
		x1 += s1
	} else {
		x2 += s2
	}

	return [sum1, x1 + x2]
}

const cache = new Float64Array(261)
cache.set([1, 1, 1, 1, 1, 1, 2, 2, 2])

for (let day = 9; day < 261; day++) {
	cache[day] = cache[day - 7] + cache[day - 9]
}

const [e80, d80, c80, b80, a80] = cache.subarray(80, 85)
const [e256, d256, c256, b256, a256] = cache.subarray(256)

export default (input) => {
	const len = input.length
	const counts = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}

	for (let i = 0; i < len; i += 2) {
		counts[input[i]]++
	}

	const {1: a, 2: b, 3: c, 4: d, 5: e} = counts

	return [
		a80 * a +
		b80 * b +
		c80 * c +
		d80 * d +
		e80 * e,
		a256 * a +
		b256 * b +
		c256 * c +
		d256 * d +
		e256 * e
	]
}

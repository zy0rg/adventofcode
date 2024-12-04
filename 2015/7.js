export default (input) => {
	const operations = new Map()

	input.split('\n').forEach((str) => {
		const [a, b, c, d, e] = str.split(' ')
		if (b === '->') {
			operations.set(c, [b, a])
		} else if (a === 'NOT') {
			operations.set(d, [a, b])
		} else {
			operations.set(e, [b, a, c])
		}
	})

	const cache = new Map()

	const calculate = (key) => {
		if (cache.has(key)) {
			return cache.get(key)
		}
		let value = parseInt(key)
		if (Number.isFinite(value)) {
			cache.set(key, value)
			return value
		}
		const [operation, left, right] = operations.get(key)
		switch (operation) {
			case '->':
				value = calculate(left)
				break
			case 'NOT':
				value = 65535 - calculate(left)
				break
			case 'AND':
				value = calculate(left) & calculate(right)
				break
			case 'OR':
				value = calculate(left) | calculate(right)
				break
			case 'LSHIFT':
				value = calculate(left) << right
				break
			case 'RSHIFT':
				value = calculate(left) >> right
				break
		}
		cache.set(key, value)
		return value
	}

	const result1 = calculate('a')

	cache.clear()
	cache.set('b', result1)

	return [result1, calculate('a')]
}

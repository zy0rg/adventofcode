export default (input) => {
	const parsed = input.split('\n')

	const {length} = parsed
	const names = new Array(length)
	const indices = new Map()
	const values = new Array(length)
	const resolved = new Array(length).fill(false)
	const left = new Array(length)
	const right = new Array(length)
	const operations = new Array(length)
	const dependent = new Map()

	const pending = []

	parsed.forEach((str, i) => {
		const [name, l, op, r] = str.split(/:? /)
		names[i] = name
		indices.set(name, i)
		const value = parseInt(l)
		if (Number.isNaN(value)) {
			left[i] = l
			if (dependent.has(l)) {
				dependent.get(l).push(i)
			} else {
				dependent.set(l, [i])
			}
			right[i] = r
			if (dependent.has(r)) {
				dependent.get(r).push(i)
			} else {
				dependent.set(r, [i])
			}
			operations[i] = op
		} else {
			values[i] = value
			resolved[i] = true
			pending.push(name)
		}
	})

	const resolvePending = (pending, resolved, values) => {
		while (pending.length) {
			const name = pending.shift()
			if (dependent.has(name)) {
				dependent.get(name).forEach((i) => {
					const leftIndex = indices.get(left[i])
					if (resolved[leftIndex]) {
						const rightIndex = indices.get(right[i])
						if (resolved[rightIndex]) {
							const leftValue = values[leftIndex]
							const rightValue = values[rightIndex]
							const operation = operations[i]
							if (operation === '+') {
								values[i] = leftValue + rightValue
							} else if (operation === '-') {
								values[i] = leftValue - rightValue
							} else if (operation === '*') {
								values[i] = leftValue * rightValue
							} else if (operation === '/') {
								values[i] = leftValue / rightValue
							}
							resolved[i] = true
							pending.push(names[i])
						}
					}
				})
			}
		}
	}

	const rootIndex = indices.get('root')
	const values1 = values.slice()
	resolvePending(pending.slice(), resolved.slice(), values1)

	const result1 = values1[rootIndex]

	const humanIndex = indices.get('humn')
	resolved[humanIndex] = false
	resolvePending(pending.filter((name) => name !== 'humn'), resolved, values)

	const leftRoot = indices.get(left[rootIndex])
	const rightRoot = indices.get(right[rootIndex])

	let [expectedValue, index] = resolved[leftRoot]
		? [values[leftRoot], rightRoot]
		: [values[rightRoot], leftRoot]

	while (index !== humanIndex) {
		const leftIndex = indices.get(left[index])
		const rightIndex = indices.get(right[index])
		const operation = operations[index]
		if (resolved[leftIndex]) {
			index = rightIndex
			const value = values[leftIndex]
			if (operation === '+') {
				expectedValue -= value
			} else if (operation === '-') {
				expectedValue = value - expectedValue
			} else if (operation === '*') {
				expectedValue /= value
			} else if (operation === '/') {
				expectedValue = value / expectedValue
			}
		} else {
			index = leftIndex
			const value = values[rightIndex]
			if (operation === '+') {
				expectedValue -= value
			} else if (operation === '-') {
				expectedValue += value
			} else if (operation === '*') {
				expectedValue /= value
			} else if (operation === '/') {
				expectedValue *= value
			}
		}
	}

	const result2 = expectedValue

	return [result1, result2]
}

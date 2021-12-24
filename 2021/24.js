const indices = {
	w: 0,
	x: 1,
	y: 2,
	z: 3
}

export default (input) => {
	const parseOperation = (op, aIndex, b) => {
		const num = parseInt(b)
		if (Number.isNaN(num)) {
			const bIndex = indices[b]
			switch (op) {
				case 'add':
					return (variables) => {
						variables[aIndex] += variables[bIndex]
						return true
					}
				case 'mul':
					return (variables) => {
						variables[aIndex] *= variables[bIndex]
						return true
					}
				case 'div':
					return (variables) => {
						const b = variables[bIndex]
						if (b === 0) {
							return false
						}
						variables[aIndex] = Math.floor(variables[aIndex] / b)
						return true
					}
				case 'mod':
					return (variables) => {
						const a = variables[aIndex]
						const b = variables[bIndex]
						if (a < 0 || b <= 0) {
							return false
						}
						variables[aIndex] = a % b
						return true
					}
				case 'eql':
					return (variables) => {
						variables[aIndex] = variables[aIndex] === variables[bIndex]
							? 1
							: 0
						return true
					}
			}
		} else {
			switch (op) {
				case 'add':
					if (num === 0) {
						return null
					}
					return (variables) => {
						variables[aIndex] += num
						return true
					}
				case 'mul':
					if (num === 1) {
						return null
					} else if (num === 0) {
						return (variables) => {
							variables[aIndex] = 0
							return true
						}
					}
					return (variables) => {
						variables[aIndex] *= num
						return true
					}
				case 'div':
					if (num === 1) {
						return null
					}
					return (variables) => {
						variables[aIndex] = Math.floor(variables[aIndex] / num)
						return true
					}
				case 'mod':
					return (variables) => {
						const a = variables[aIndex]
						if (a < 0) {
							return false
						}
						variables[aIndex] = a % num
						return true
					}
				case 'eql':
					return (variables) => {
						variables[aIndex] = variables[aIndex] === num
							? 1
							: 0
						return true
					}
			}
		}
	}

	const groups = []
	let currentOps = null

	input.split('\n').forEach((str) => {
		const [op, a, b] = str.split(' ')
		const aIndex = indices[a]
		if (op === 'inp') {
			const operations = currentOps = []
			groups.push((variables, value) => {
				variables[aIndex] = value
				return operations.every((operation) => {
					return operation(variables)
				})
			})
		} else {
			const operation = parseOperation(op, aIndex, b)
			if (operation != null) {
				currentOps.push(operation)
			}
		}
	})

	const last = groups.length - 1

	const cache = new Map()

	ge

	const test = (i, variables) => {
		const execute = groups[i]
		const slice = variables.slice()
		for (let value = 9; value > 0; value--) {
			if (execute(slice, value)) {
				if (i === last) {
					if (slice[3] === 0) {
						return value
					}
				} else {
					const result = test(i + 1, slice)
					if (result !== 0) {
						return result + value * (10 ** (last - i))
					}
				}
			}
			slice.set(variables)
		}
		return 0
	}

	const result1 = test(5, new Int32Array(4))

	return [result1]
}

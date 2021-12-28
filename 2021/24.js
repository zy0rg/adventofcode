const indices = {
	w: 0,
	x: 1,
	y: 2,
	z: 3
}

const filter = (operations) => {
	const definiteVariables = [0, 0, 0, 0]
	let result = operations.map((operation) => {
		const [op, aIndex, b, isReference] = operation
		const value = isReference
			? definiteVariables[b]
			: b
		switch (op) {
			case 'set':
				definiteVariables[aIndex] = value
				break
			case 'inp':
				definiteVariables[aIndex] = null
				break
			case 'add':
				if (value === 0) {
					return null
				} else if (value == null) {
					definiteVariables[aIndex] = null
				} else if (definiteVariables[aIndex] != null) {
					definiteVariables[aIndex] += value
				}
				break
			case 'mul':
				if (value === 1 || definiteVariables[aIndex] === 0) {
					return null
				} else if (value === 0) {
					definiteVariables[aIndex] = 0
				} else if (value == null) {
					definiteVariables[aIndex] = null
				} else if (definiteVariables[aIndex] != null) {
					definiteVariables[aIndex] *= value
				}
				break
			case 'div':
				if (value === 1 || definiteVariables[aIndex] === 0) {
					return null
				} else if (value == null) {
					definiteVariables[aIndex] = null
				} else if (definiteVariables[aIndex] != null) {
					Math.floor(definiteVariables[aIndex] / value)
				}
				break
			case 'mod':
				if (definiteVariables[aIndex] === 0) {
					return null
				} else if (value == null) {
					definiteVariables[aIndex] = null
				} else if (definiteVariables[aIndex] != null) {
					definiteVariables[aIndex] %= value
				}
				break
			case 'eql':
				if (value == null) {
					definiteVariables[aIndex] = null
				} else if (definiteVariables[aIndex] != null) {
					definiteVariables[aIndex] = definiteVariables[aIndex] === value ? 1 : 0
				}
				break
		}
		if (definiteVariables[aIndex] != null) {
			return ['set', aIndex, definiteVariables[aIndex], false]
		} else if (isReference && value != null) {
			return [op, aIndex, value, false]
		}
		return operation
	})

	result = result.filter((operation) => operation != null)
	const unusedVariables = [true, true, true, false]

	for (let i = result.length - 1; i > 0; i--) {
		const [op, aIndex, b, isReference] = result[i]
		if (op === 'inp') {
			unusedVariables[aIndex] = true
		} else if (unusedVariables[aIndex]) {
			result[i] = null
		} else if (op === 'set') {
			unusedVariables[aIndex] = true
		} else if (isReference) {
			unusedVariables[b] = false
		}
	}

	result = result.filter((operation) => operation != null)

	return result
}

const prepareOperation = ([op, aIndex, rawB, isReference]) => {
	const a = `variables[${aIndex}]`
	const b = isReference ? `variables[${rawB}]` : rawB
	switch (op) {
		case 'set':
			return `${a} = ${b}`
		case 'add':
			return `${a} += ${b}`
		case 'mul':
			return `${a} *= ${b}`
		case 'div':
			return isReference
				? `
						const b = ${b}
						if (b === 0) {
							return false
						}
						${a} = Math.floor(${a} / b)
					`
				: `${a} = Math.floor(${a} / ${b})`
		case 'mod':
			return isReference
				? `
						const a = ${a}
						const b = ${b}
						if (a < 0 || b <= 0) {
							return false
						}
						${a} = a % b
					`
				: `
						const a = ${a}
						if (a < 0) {
							return false
						}
						${a} = a % ${b}
					`
		case 'eql':
			return `${a} = ${a} === ${b} ? 1 : 0`
	}
}

const prepareFunction = (operations) => {
	const lines = operations.map(prepareOperation)
	lines.push('return true')
	return new Function('variables', lines.join('\n'))
}

export default (input) => {
	const operations = filter(input.split('\n').map((str) => {
		const [op, a, b] = str.split(' ')
		const num = parseInt(b)
		const isReference = op !== 'inp' && Number.isNaN(num)
		return [op, indices[a], isReference ? indices[b] : num, isReference]
	}))

	const groupOperations = []
	let currentOps = null

	operations.forEach((operation) => {
		if (operation[0] === 'inp') {
			groupOperations.push(currentOps = [])
		} else {
			currentOps.push(operation)
		}
	})

	const groups = groupOperations.map(prepareFunction)
	const groupCache = new Array(groups.length).fill(0).map(() => new Set())
	const groupVariables = new Array(groups.length).fill(0).map(() => new Int32Array(4))
	const last = groups.length - 1
	let i = 0
	groupVariables[i][0] = 9

	while (true) {
		const variables = groupVariables[i]
		const z = variables[3]
		if (variables[0] === 1) {
			groupCache[i].add(z)
			i--
		} else {
			if (groups[i](variables)) {
				const resultZ = variables[3]
				if (i === last) {
					if (resultZ === 0) {
						break
					}
				} else if (!groupCache[i + 1].has(resultZ)) {
					++i
					groupVariables[i][0] = 9
					groupVariables[i][3] = resultZ
				}
			}
			variables[0]--
			variables[3] = z
		}
	}

	const result1 = groupVariables.reduce((result, [w]) => (result + 1) * 10 + w, -1)

	i = 0
	groupVariables[i][0] = 1

	while (true) {
		const variables = groupVariables[i]
		const z = variables[3]
		if (variables[0] === 9) {
			groupCache[i].add(z)
			i--
		} else {
			if (groups[i](variables)) {
				const resultZ = variables[3]
				if (i === last) {
					if (resultZ === 0) {
						break
					}
				} else if (!groupCache[i + 1].has(resultZ)) {
					++i
					groupVariables[i][0] = 1
					groupVariables[i][3] = resultZ
				}
			}
			variables[0]++
			variables[3] = z
		}
	}

	const result2 = groupVariables.reduce((result, [w]) => (result - 1) * 10 + w, 1)

	return [result1, result2]
}

const props = {
	x: 0,
	m: 1,
	a: 2,
	s: 3
}

export default (input) => {
	const [rulesStr, partsStr] = input.split('\n\n')
	const rules = rulesStr.split('\n')
	const length = rules.length

	let i = 0
	const ids = new Map()
	const getId = (name) => {
		if (ids.has(name)) {
			return ids.get(name)
		}
		const id = i++
		ids.set(name, id)
		return id
	}

	const tests = new Array(length + 2)
	const tests2 = new Array(length + 2)
	tests[getId('A')] = () => true
	tests[getId('R')] = () => false
	tests2[getId('A')] = ([xFrom, mFrom, aFrom, sFrom, xTo, mTo, aTo, sTo]) =>
		(xTo - xFrom) * (mTo - mFrom) * (aTo - aFrom) * (sTo - sFrom)
	tests2[getId('R')] = () => 0

	rules.forEach((str) => {
		const [name, ...steps] = str.split(/[{},]/)
		let index = steps.length - 2
		const ref = getId(steps[index])
		let test = (part) => tests[ref](part)
		let test2 = (range) => tests2[ref](range)
		index--
		while (index >= 0) {
			const [condition, target] = steps[index].split(':')
			const prop = props[condition[0]]
			const toProp = prop + 4
			const value = parseInt(condition.substring(2))
			const ref = getId(target)
			const nextTest = test
			const nextTest2 = test2

			if (condition[1] === '>') {
				test = (part) => part[prop] > value ? tests[ref](part) : nextTest(part)
				test2 = (range) => {
					const from = range[prop]
					const to = range[toProp]

					// real input 1 4000 inclusive - range 0 4000
					// value 5
					// real fail 1 5 - range 0 5
					// real pass 6 4000 - range 5 4000
					if (to >= value) {
						if (from < value) {
							let result = 0
							range[prop] = value
							result += tests2[ref](range) // matched
							range[prop] = from
							range[toProp] = value
							result += nextTest2(range) // non-matched
							range[toProp] = to
							return result
						} else {
							return tests2[ref](range)
						}
					} else {
						return nextTest2(range)
					}
				}
			} else {
				test = (part) => part[prop] < value ? tests[ref](part) : nextTest2(part)
				test2 = (range) => {
					const from = range[prop]
					const to = range[toProp]

					// real input 1 4000 inclusive - range 0 4000
					// value 5
					// real fail 5 4000 - range 4 4000
					// real pass 1 4 - range 0 4

					const adjusted = value - 1
					if (to >= adjusted) {
						if (from < adjusted) {
							let result = 0
							range[prop] = adjusted
							result += nextTest2(range) // non-matched
							range[prop] = from
							range[toProp] = adjusted
							result += tests2[ref](range) // matched
							range[toProp] = to
							return result
						} else {
							return nextTest2(range)
						}
					} else {
						return tests2[ref](range)
					}
				}
			}

			index--
		}
		tests[getId(name)] = test
		tests2[ids.get(name)] = test2
	})

	const test = tests[ids.get('in')]
	let result1 = 0

	partsStr.split('\n').forEach((str) => {
		const [, xStr, mStr, aStr, sStr] = str.split('=')
		const x = parseInt(xStr)
		const m = parseInt(mStr)
		const a = parseInt(aStr)
		const s = parseInt(sStr)

		if (test([x, m, a, s])) {
			result1 += x + m + a + s
		}
	})

	return [
		result1,
		tests2[ids.get('in')]([0, 0, 0, 0, 4000, 4000, 4000, 4000])
	]
}

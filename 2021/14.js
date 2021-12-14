export default (input) => {
	const [polymerStr, mutationsStr] = input.split('\n\n')
	const mutationsArray = mutationsStr.split('\n')

	const mutationsCount = mutationsArray.length
	const indices = new Map()
	const abc = new Array(mutationsCount)

	mutationsArray.forEach((str, i) => {
		const a = str.charCodeAt(0)
		const b = str.charCodeAt(1)
		const c = str.charCodeAt(6)

		indices.set(a * 100 + b, i)
		abc[i] = [a, b, c]
	})

	const length = polymerStr.length
	const counts = new Uint16Array(100)
	const targets = new Uint8Array(mutationsCount)
	const productA = new Uint8Array(mutationsCount)
	const productB = new Uint8Array(mutationsCount)

	abc.forEach(([a, b, c], i) => {
		targets[i] = b
		productA[i] = indices.get(a * 100 + c)
		productB[i] = indices.get(c * 100 + b)
	})

	const pairCounts = new Uint8Array(mutationsCount)

	let previous = polymerStr.charCodeAt(0)

	counts[previous]++

	for (let i = 1; i < length; i++) {
		const current = polymerStr.charCodeAt(i)

		pairCounts[indices.get(previous * 100 + current)]++

		previous = current
	}

	const minMax = () => {
		let min = Infinity
		let max = 0

		counts.forEach((a) => {
			if (a !== 0) {
				if (min > a) {
					min = a
				}
				if (max < a) {
					max = a
				}
			}
		})

		return max - min
	}

	let step = 0

	const increments = pairCounts.slice()

	for (; step < 10; step++) {
		for (let i = 0; i < mutationsCount; i++) {
			const count = pairCounts[i]
			increments[productA[i]] += count
			increments[productB[i]] += count
		}

		pairCounts.set(increments)
	}

	const result1 = minMax()

	const result2 = minMax()

	return [result1, result2]
}

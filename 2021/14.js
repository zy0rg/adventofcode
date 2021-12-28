export default (input) => {
	const [polymerStr, mutationsStr] = input.split('\n\n')
	const mutationsArray = mutationsStr.split('\n')

	const length = mutationsArray.length
	const indices = new Map()
	const abc = new Array(length)

	mutationsArray.forEach((str, i) => {
		const a = str.charCodeAt(0)
		const b = str.charCodeAt(1)
		const c = str.charCodeAt(6)

		indices.set(a * 100 + b, i)
		abc[i] = [a, b, c]
	})

	const polymerLength = polymerStr.length
	const targets = new Uint8Array(length)
	const productA = new Uint8Array(length)
	const productB = new Uint8Array(length)
	const productC = new Uint8Array(length)
	const counts = new Float64Array(100)
	let pairCounts = new Float64Array(length)
	let nextPairCounts = new Float64Array(length)

	abc.forEach(([a, b, c], i) => {
		targets[i] = b
		productA[i] = indices.get(a * 100 + c)
		productB[i] = indices.get(c * 100 + b)
		productC[i] = c
	})

	let previous = polymerStr.charCodeAt(0)

	counts[previous]++

	for (let i = 1; i < polymerLength; i++) {
		const current = polymerStr.charCodeAt(i)

		counts[current]++
		pairCounts[indices.get(previous * 100 + current)]++

		previous = current
	}

	const getResult = () => {
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
	let result1 = 0
	let result2 = 0

	while (true) {
		for (let i = 0; i < length; i++) {
			const count = pairCounts[i]
			nextPairCounts[productA[i]] += count
			nextPairCounts[productB[i]] += count
			counts[productC[i]] += count
		}

		[pairCounts, nextPairCounts] = [nextPairCounts, pairCounts]
		nextPairCounts.fill(0)

		step++

		if (step === 10) {
			result1 = getResult()
		} else if (step === 40) {
			result2 = getResult()
			break
		}
	}

	return [result1, result2]
}

export default (input) => {
	const parsed = input.split('\n\n')
		.map((str) => str.split('\n')
			.map((str) => JSON.parse(str)))

	const compare = (left, right) => {
		let {length} = right
		if (left.length < length) {
			length = left.length
		}

		for (let i = 0; i < length; i++) {
			const l = left[i]
			const r = right[i]
			if (typeof l === 'number') {
				if (typeof r === 'number') {
					if (l > r) {
						return -1
					} else if (r > l) {
						return 1
					}
				} else {
					const result = compare([l], r)
					if (result !== 0) {
						return result
					}
				}
			} else {
				if (typeof r === 'number') {
					const result = compare(l, [r])
					if (result !== 0) {
						return result
					}
				} else {
					const result = compare(l, r)
					if (result !== 0) {
						return result
					}
				}
			}
		}

		if (left.length < right.length) {
			return 1
		} else if (left.length > right.length) {
			return -1
		} else {
			return 0
		}
	}

	const result1 = parsed.reduce((result, [l, r], i) => {
		return compare(l, r) === 1
			? result + i + 1
			: result
	}, 0)

	const a = [[2]]
	const b = [[6]]
	const part2 = [a, b].concat(...parsed).sort((a, b) => compare(b, a))
	const result2 = (part2.indexOf(a) + 1) * (part2.indexOf(b) + 1)

	return [result1, result2]
}

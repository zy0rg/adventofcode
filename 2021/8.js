export default (input) => {
	const parsed = input.split('\n')

	let result1 = 0

	const result2 = parsed.reduce((sum, str) => {
		const [inputStr, outputStr] = str.split(' | ')

		const counts = {
			a: 0,
			b: 0,
			c: 0,
			d: 0,
			e: 0,
			f: 0,
			g: 0
		}

		let a1
		let a2

		let b
		let c
		let e

		inputStr.split(' ').forEach((str) => {
			const len = str.length

			if (len === 2) {
				[a1, a2] = str
			}

			for (let i = 0; i < len; i++) {
				counts[str[i]]++
			}
		})

		Object.keys(counts).forEach((char) => {
			const count = counts[char]
			if (count === 4) {
				e = char
			} else if (count === 6) {
				b = char
			} else if (count === 8 && (a1 === char || a2 === char)) {
				c = char
			}
		})

		return sum + outputStr.split(' ').reduce((result, str) => {
			const len = str.length

			if (len === 2) {
				result1++
				return result * 10 + 1
			} else if (len === 3) {
				result1++
				return result * 10 + 7
			} else if (len === 4) {
				result1++
				return result * 10 + 4
			} else if (len === 5) {
				for (let i = 0; i < len; i++) {
					const char = str[i]
					if (char === e) {
						return result * 10 + 2
					} else if (char === b) {
						return result * 10 + 5
					}
				}
				return result * 10 + 3
			} else if (len === 6) {
				for (let i = 0; i < len; i++) {
					const char = str[i]
					if (char === e) {
						for (; i < len; i++) {
							if (str[i] === c) {
								return result * 10
							}
						}
						return result * 10 + 6
					} else if (char === c) {
						for (; i < len; i++) {
							if (str[i] === e) {
								return result * 10
							}
						}
						return result * 10 + 9
					}
				}
				return result * 10 + 3
			} else {
				result1++
				return result * 10 + 8
			}
		}, 0)
	}, 0)

	return [result1, result2]
}

export default (input) => {
	const parsed = input.split('\n')

	let result1 = 0
	let result2 = 0

	const multipliers = new Uint32Array(parsed.length)
	multipliers.fill(1)

	parsed.forEach((str, i) => {
		const [, win, match] = str.split(/ *[:|] +/g)
		const winSet = new Set(win.split(/ +/g))
		let next = i
		const multiplier = multipliers[i]
		match.split(/ +/g).forEach((val) => {
			if (winSet.has(val)) {
				next++
				multipliers[next] += multiplier
			}
		})
		if (next !== i) {
			result1 += Math.pow(2, next - i - 1)
		}
		result2 += multiplier
	})

	return [result1, result2]
}

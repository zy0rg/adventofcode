export default (input) => {
	const parsed = input.split('\n')

	let i = 0
	let x = 1

	let target = 20
	let result1 = 0

	const screen = new Uint8Array(40 * 6)

	parsed.forEach((str) => {
		const p = i % 40
		if (str === 'noop') {
			if (p === x + 1 || p === x || p === x - 1) {
				screen[i] = 1
			}
			i++
			if (i === target) {
				result1 += target * x
				target += 40
			}
		} else {
			if (p === x + 1) {
				screen[i] = 1
			} else if (p === x || p === x - 1) {
				screen[i + 1] = 1
				screen[i] = 1
			} else if (p === x - 2) {
				screen[i + 1] = 1
			}
			i += 2
			if (i >= target) {
				result1 += target * x
				target += 40
			}
			x += parseInt(str.substring(5))
		}
	})

	const result2 = new Array(6)
	for (let i = 0; i < 6; i++) {
		const line = Array.from(screen.subarray(i * 40, (i + 1) * 40))
		result2[i] = line.map((pixel) => pixel === 1 ? '\u2588' : ' ').join('')
	}

	return [result1, `\n` + result2.join('\n')]
}

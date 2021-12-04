export default (input) => {
	let x = 0
	let y = 0
	let depth = 0

	input
		.split('\n')
		.forEach((str) => {
			const [direction, amountStr] = str.split(' ')
			const amount = parseInt(amountStr)
			if (direction === 'forward') {
				x += amount
				depth += y * amount
			} else if (direction === 'down') {
				y += amount
			} else if (direction === 'up') {
				y -= amount
			}
		});

	return [x * y, x * depth]
}

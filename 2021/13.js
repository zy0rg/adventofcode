export default (input) => {
	const [coordsStr, foldsStr] = input.split('\n\n')

	const xFolds = []
	const yFolds = []
	let firstX
	let firstY

	foldsStr.split('\n').forEach((str, i) => {
		const edge = parseInt(str.substring(13))
		if (str[11] === 'x') {
			xFolds.push(edge)
			if (i === 0) {
				firstX = (value) =>
					value < edge
						? value
						: edge * 2 - value
				firstY = (value) => value
			}
		} else {
			yFolds.push(edge)
			if (i === 0) {
				firstX = (value) => value
				firstY = (value) =>
					value < edge
						? value
						: edge * 2 - value
			}
		}
	})

	const xLength = xFolds.length
	const yLength = yFolds.length
	const width = xFolds[xLength - 1]
	const height = yFolds[yLength - 1]

	const xDouble = width * 2
	const yDouble = height * 2
	const xDivisor = xDouble + 2
	const yDivisor = yDouble + 2

	const fold = (value, size, double, divisor) => {
		const divided = value % divisor
		return divided > size
			? double - divided
			: divided
	}

	const first = new Set()
	const dots = new Array(height)

	for (let i = 0; i < height; i++) {
		dots[i] = new Array(width).fill(' ')
	}

	coordsStr.split('\n').forEach((str) => {
		const [xStr, yStr] = str.split(',')
		const x = parseInt(xStr)
		const y = parseInt(yStr)
		first.add(firstX(x) + firstY(y) * 10000)
		dots[fold(y, height, yDouble, yDivisor)][fold(x, width, xDouble, xDivisor)] = '\u2588'
	})

	return [
		first.size,
		`\n` + dots.map((line) => line.join('')).join('\n')
	]
}

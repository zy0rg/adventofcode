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

	const fold = (folds, length, value) => {
		for (let i = 0; i < length; i++) {
			const edge = folds[i]
			if (value > edge) {
				value = edge * 2 - value
			}
		}
		return value
	}

	const width = xFolds[xLength - 1]
	const height = yFolds[yLength - 1]
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
		dots[fold(yFolds, yLength, y)][fold(xFolds, xLength, x)] = '\u2588'
	})

	return [
		first.size,
		`\n` + dots.map((line) => line.join('')).join('\n')
	]
}

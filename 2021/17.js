for (let x = 1; x < 50; x++) {
	for (let step = 0; step < 10; step++) {

	}
}


export default (input) => {
	const [, xMinStr, xMaxStr, yMinStr, yMaxStr] = /x=(\d+)\.\.(\d+), y=(-?\d+)..(-?\d+)/.exec(input)
	const xMin = parseInt(xMinStr)
	const xMax = parseInt(xMaxStr)
	const yMin = parseInt(yMinStr)
	const yMax = parseInt(yMaxStr)

	const xStaleStart = Math.ceil((Math.sqrt(xMin * 8 + 1) - 1) / 2)
	const xStaleEnd = Math.floor((Math.sqrt(xMax * 8 + 1) - 1) / 2)
	const optionsAfterStale = xStaleEnd - xStaleStart + 1
	const yMaxLimit = -yMin

	const result1 = yMaxLimit * (yMaxLimit - 1) / 2
	let result2 = 0

	const yForStep = new Map()

	for (let y = yMin; y <= yMaxLimit; y++) {
		let ySpeed
		let step
		if (y >= 0) {
			ySpeed = -y - 1
			step = y * 2 + 1
		} else {
			ySpeed = y
			step = 0
		}
		let position = 0
		while (position > yMax) {
			position += ySpeed
			ySpeed--
			step++
		}
		if (position >= yMin) {
			if (step > xStaleEnd) {
				result2 += optionsAfterStale
				continue
			}
			do {
				if (yForStep.has(step)) {
					yForStep.get(step).push(y)
				} else {
					yForStep.set(step, [y])
				}
				position += ySpeed
				ySpeed--
				step++
			} while (position >= yMin)
		}
	}
	const maxStep = Math.max(...yForStep.keys())

	loop: for (let x = xStaleStart; x <= xMax; x++) {
		let xSpeed = x
		let step = 0
		let position = 0
		const yOptions = new Set()
		while (position < xMin) {
			position += xSpeed
			if (xSpeed === 0) {
				continue loop
			}
			xSpeed--
			step++
		}
		while (position <= xMax && step <= maxStep) {
			if (yForStep.has(step)) {
				yForStep.get(step).forEach((y) => yOptions.add(y))
			}
			if (xSpeed !== 0) {
				position += xSpeed
				xSpeed--
			}
			step++
		}
		result2 += yOptions.size
	}

	return [result1, result2]
}

//                                                                                                     20,-10    21,-10    22,-10    23,-10    24,-10    25,-10    26,-10    27,-10    28,-10    29,-10    30,-10
//                                                                                                     20,-9     21,-9     22,-9     23,-9     24,-9     25,-9     26,-9     27,-9     28,-9     29,-9     30,-9
//                                                                                                     20,-8     21,-8     22,-8     23,-8     24,-8     25,-8     26,-8     27,-8     28,-8     29,-8     30,-8
//                                                                                                     20,-7     21,-7     22,-7     23,-7     24,-7     25,-7     26,-7     27,-7     28,-7     29,-7     30,-7
//                                                                                                     20,-6     21,-6     22,-6     23,-6     24,-6     25,-6     26,-6     27,-6     28,-6     29,-6     30,-6
//                                                                                                     20,-5     21,-5     22,-5     23,-5     24,-5     25,-5     26,-5     27,-5     28,-5     29,-5     30,-5
//                                                   11,-4     12,-4     13,-4     14,-4     15,-4
//                                                   11,-3     12,-3     13,-3     14,-3     15,-3
//                               9,-2      10,-2     11,-2     12,-2     13,-2     14,-2     15,-2
//                               9,-1      10,-1     11,-1
//                     8,-2      9,0
//           7,-1      8,-1
// 6,0       7,0       8,0
// 6,1       7,1       8,1
// 6,2       7,2
// 6,3       7,3
// 6,4       7,4
// 6,5       7,5
// 6,6       7,6
// 6,7       7,7
// 6,8       7,8
// 6,9       7,9

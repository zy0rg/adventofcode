export default (input) => {
	// const [mapStr, pathStr] = input.split('\n\n')
	// const rows = mapStr.split('\n')
	// const stepCounts = pathStr.split(/(?=[^\d])/)
	//
	// const {length} = rows
	// const minX = new Array(length)
	// const maxX = new Array(length)
	// let maxLength = 0
	//
	// rows.forEach((str, i) => {
	// 	if (str.length > maxLength) {
	// 		maxLength = str.length
	// 	}
	// 	const firstDot = str.indexOf('.')
	// 	const lastDot = str.lastIndexOf('.')
	// 	const firstHash = str.indexOf('#')
	// 	const lastHash = str.lastIndexOf('#')
	// 	minX[i] = firstDot === -1
	// 		? firstHash
	// 		: firstHash === -1
	// 			? firstDot
	// 			: Math.min(firstDot, firstHash)
	// 	maxX[i] = lastDot === -1
	// 		? lastHash
	// 		: lastHash === -1
	// 			? lastDot
	// 			: Math.max(lastDot, lastHash)
	// })
	//
	// const minY = new Array(maxLength)
	// const maxY = new Array(maxLength)
	//
	// for (let x = 0; x < maxLength; x++) {
	// 	minY[x] = minX.findIndex((min, y) =>
	// 		min <= x && maxX[y] >= x)
	// 	maxY[x] = minX.findIndex((min, y) =>
	// 		min <= x && maxX[y] >= x)
	// }
	//
	// const move = (x, y, direction, steps) => {
	// 	if (direction === 0) {
	// 		const row = rows[y]
	// 		const max = maxX[y]
	// 		const min = minX[y]
	// 		while (steps-- !== 0) {
	// 			if (x === max) {
	// 				if (row.charAt(min) === '#') {
	// 					break
	// 				}
	// 				x = min
	// 			} else {
	// 				x++
	// 				if (row.charAt(x) === '#') {
	// 					x--
	// 					break
	// 				}
	// 			}
	// 		}
	// 	} else if (direction === 1) {
	// 		const max = maxY[x]
	// 		const min = minY[x]
	// 		while (steps-- !== 0) {
	// 			if (y === max) {
	// 				if (rows[min].charAt(x) === '#') {
	// 					break
	// 				}
	// 				y = min
	// 			} else {
	// 				y++
	// 				if (rows[y].charAt(x) === '#') {
	// 					y--
	// 					break
	// 				}
	// 			}
	// 		}
	// 	} else if (direction === 2) {
	// 		const row = rows[y]
	// 		const max = maxX[y]
	// 		const min = minX[y]
	// 		while (steps-- !== 0) {
	// 			if (x === min) {
	// 				if (row.charAt(max) === '#') {
	// 					break
	// 				}
	// 				x = max
	// 			} else {
	// 				x--
	// 				if (row.charAt(x) === '#') {
	// 					x++
	// 					break
	// 				}
	// 			}
	// 		}
	// 	} else {
	// 		const max = maxY[x]
	// 		const min = minY[x]
	// 		while (steps-- !== 0) {
	// 			if (y === min) {
	// 				if (rows[max].charAt(x) === '#') {
	// 					break
	// 				}
	// 				y = max
	// 			} else {
	// 				y--
	// 				if (rows[y].charAt(x) === '#') {
	// 					y++
	// 					break
	// 				}
	// 			}
	// 		}
	// 	}
	// 	return [x, y, direction]
	// }
	//
	// const moveAndEvaluate = (move) => {
	// 	let y = 0
	// 	let x = minX[0]
	// 	// 0 right
	// 	// 1 down
	// 	// 2 left
	// 	// 3 up
	// 	let direction = 0
	// 	move(x, y, direction, parseInt(stepCounts[0]))
	// 	for (let i = 1; i < stepCounts.length; i++) {
	// 		const step = stepCounts[i]
	// 		direction = step.charAt(0) === 'R'
	// 			? direction === 3
	// 				? 0
	// 				: direction + 1
	// 			: direction === 0
	// 				? 3
	// 				: direction - 1
	// 		const steps = parseInt(step.substring(1))
	// 		;[x, y, direction] = move(x, y, direction, steps)
	// 	}
	// 	return (y + 1) * 1000 + (x + 1) * 4 + direction
	// }
	//
	// const minXNext = minX.map((x, y) => {
	// 	switch (Math.floor(y / 50)) {
	// 		case 0:
	// 			return [0, 149 - y, 0] // 1l = 4l
	// 		case 1:
	// 			return [y - 50, 100, 1] // 3l = 4u
	// 		case 2:
	// 			return [50, 149 - y, 0] // 4l = 1l
	// 		case 3:
	// 			return [y - 100, 0, 1] // 6l = 1u
	// 	}
	// })
	//
	// const maxXNext = maxX.map((x, y) => {
	// 	switch (Math.floor(y / 50)) {
	// 		case 0:
	// 			return [99, 149 - y, 2] // 2r = 5r
	// 		case 1:
	// 			return [y + 50, 49, 3] // 3r = 2d
	// 		case 2:
	// 			return [149, 149 - y, 2] // 5r = 2r
	// 		case 3:
	// 			return [y - 100, 149, 3] // 6r = 5d
	// 	}
	// })
	//
	// //  12
	// //  3
	// // 45
	// // 6
	//
	// const minYNext = minY.map((y, x) => {
	// 	switch (Math.floor(x / 50)) {
	// 		case 0:
	// 			return [50, x + 50, 0] // 4u = 3l
	// 		case 1:
	// 			return [0, x + 100, 0] // 1u = 6l
	// 		case 2:
	// 			return [x - 100, 199, 3] // 2u = 6d
	// 	}
	// })
	//
	// const maxYNext = maxY.map((y, x) => {
	// 	switch (Math.floor(x / 50)) {
	// 		case 0:
	// 			return [x + 100, 0, 1] // 6d = 2u
	// 		case 1:
	// 			return [49, x + 100, 2] // 5d = 6r
	// 		case 2:
	// 			return [99, x - 50, 2] // 2d = 3r
	// 	}
	// })
	//
	// const tryWrap = ([x, y, direction], fallback, steps) => {
	// 	if (rows[y].charAt(x) === '#') {
	// 		return fallback
	// 	}
	// 	return move2(x, y, direction, steps)
	// }
	//
	// const move2 = (x, y, direction, steps) => {
	// 	if (direction === 0) {
	// 		const row = rows[y]
	// 		const max = maxX[y]
	// 		while (steps-- !== 0) {
	// 			if (x === max) {
	// 				return tryWrap(maxXNext[y], [x, y, direction], steps)
	// 			} else {
	// 				x++
	// 				if (row.charAt(x) === '#') {
	// 					x--
	// 					break
	// 				}
	// 			}
	// 		}
	// 	} else if (direction === 1) {
	// 		const max = maxY[x]
	// 		while (steps-- !== 0) {
	// 			if (y === max) {
	// 				return tryWrap(maxYNext[x], [x, y, direction], steps)
	// 			} else {
	// 				y++
	// 				if (rows[y].charAt(x) === '#') {
	// 					y--
	// 					break
	// 				}
	// 			}
	// 		}
	// 	} else if (direction === 2) {
	// 		const row = rows[y]
	// 		const min = minX[y]
	// 		while (steps-- !== 0) {
	// 			if (x === min) {
	// 				return tryWrap(minXNext[y], [x, y, direction], steps)
	// 			} else {
	// 				x--
	// 				if (row.charAt(x) === '#') {
	// 					x++
	// 					break
	// 				}
	// 			}
	// 		}
	// 	} else {
	// 		const min = minY[x]
	// 		while (steps-- !== 0) {
	// 			if (y === min) {
	// 				return tryWrap(minYNext[x], [x, y, direction], steps)
	// 			} else {
	// 				y--
	// 				if (rows[y].charAt(x) === '#') {
	// 					y++
	// 					break
	// 				}
	// 			}
	// 		}
	// 	}
	// 	return [x, y, direction]
	// }
	//
	// const result1 = moveAndEvaluate(move)
	// const result2 = moveAndEvaluate(move2)

	// return [result1, result2]
}

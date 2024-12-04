// const {length} = transformations
//
// let result2 = Infinity
//
// const test = (i, seedStart, seedEnd) => {
// 	if (i === length) {
// 		if (seedStart < result2) {
// 			result2 = seedStart
// 		}
// 		return
// 	}
// 	const matched = transformations[i].some(([start, end, diff]) => {
// 		if (seedStart >= end) {
// 			// s --+-
// 			// t -+--
// 			return false
// 		}
// 		if (seedEnd <= start) {
// 			// s -+--
// 			// t --+-
// 			return false
// 		}
// 		if (seedStart < start) {
// 			if (seedEnd > end) {
// 				// s -+*+-
// 				// t --+--
// 				test(i + 1, start + diff, end + diff)
// 				test(i, end, seedEnd)
// 			} else {
// 				// if (seedEnd < end)
// 				//  s -+*--
// 				//  t --++-
// 				// else
// 				//  s -+*-
// 				//  t --+-
// 				test(i + 1, start + diff, seedEnd + diff)
// 			}
// 			seedEnd = start
// 		} else if (seedEnd > end) {
// 			// if (seedStart > start)
// 			//  s --*+-
// 			//  t -++--
// 			// else
// 			//  s -*+-
// 			//  t -+--
// 			test(i + 1, seedStart + diff, end + diff)
// 			seedStart = end
// 		} else {
// 			// if (seedStart > start)
// 			//  if (seedEnd < end)
// 			//   s --*--
// 			//   t -+++-
// 			//  else
// 			//   s --*-
// 			//   t -++-
// 			// else
// 			//  if (seedEnd < end)
// 			//   s -*--
// 			//   t -++-
// 			//  else
// 			//   s -*-
// 			//   t -+-
// 			test(i + 1, seedStart + diff, seedEnd + diff)
// 			return true
// 		}
// 		return false
// 	})
//
// 	if (!matched) {
// 		test(i + 1, seedStart, seedEnd)
// 	}
// }

export default (input) => {
	const [seedStr, ...transformationsStr] = input.split('\n\n')
	const seeds = seedStr.split(' ').slice(1).map((str) => parseInt(str))
	const transformations = transformationsStr.map((str) =>
		str.split('\n').slice(1).map((str) => {
			const [destStr, startStr, lenStr] = str.split(' ')
			const start = parseInt(startStr)
			return [start, start + parseInt(lenStr), parseInt(destStr) - start]
		}))

	let current1 = new Float64Array(seeds)
	let next1 = new Float64Array(seeds.length)

	let current2 = new Array(seeds.length / 2)
	let next2 = []

	for (let i = 0, j = 0; i < seeds.length; i += 2, j++) {
		current2[j] = [seeds[i], seeds[i] + seeds[i + 1]]
		// test(0, seeds[i], seeds[i] + seeds[i + 1])
	}

	transformations.forEach((ranges) => {
		next1.set(current1)
		ranges.forEach(([start, end, diff]) => {
			current1.forEach((value, i) => {
				if (value >= start && value < end) {
					next1[i] = value + diff
				}
			})

			let length = current2.length
			for (let i = 0; i < length; i++) {
				const seed = current2[i]
				const [seedStart, seedEnd] = seed
				if (seedStart >= end) {
					// s --+-
					// t -+--
					continue
				}
				if (seedEnd <= start) {
					// s -+--
					// t --+-
					continue
				}
				if (seedStart < start) {
					if (seedEnd > end) {
						// s -+*+-
						// t --+--
						next2.push(([start + diff, end + diff]))
						current2.push([end, seedEnd])
					} else {
						// if (seedEnd < end)
						//  s -+*--
						//  t --++-
						// else
						//  s -+*-
						//  t --+-
						next2.push(([start + diff, seedEnd + diff]))
					}
					seed[1] = start
				} else if (seedEnd > end) {
					// if (seedStart > start)
					//  s --*+-
					//  t -++--
					// else
					//  s -*+-
					//  t -+--
					next2.push(([seedStart + diff, end + diff]))
					seed[0] = end
				} else {
					// if (seedStart > start)
					//  if (seedEnd < end)
					//   s --*--
					//   t -+++-
					//  else
					//   s --*-
					//   t -++-
					// else
					//  if (seedEnd < end)
					//   s -*--
					//   t -++-
					//  else
					//   s -*-
					//   t -+-
					next2.push(([seedStart + diff, seedEnd + diff]))
					current2.splice(i, 1)
					length--
					i--
				}
			}
		})
		current2.push(...next2)
		next2.length = 0
		;[current1, next1] = [next1, current1]
	})

	return [
		Math.min(...current1),
		Math.min(...current2.map(([start]) => start))
	]
}

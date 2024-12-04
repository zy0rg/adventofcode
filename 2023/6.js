export default (input) => {
	const [timesStr, distancesStr] = input.split('\n')

	const timesSplit = timesStr.split(/\s+/).slice(1)
	const distancesSplit = distancesStr.split(/\s+/).slice(1)

	const times = timesSplit.map((str) => parseInt(str))
	const distances = distancesSplit.map((str) => parseInt(str))

	let result1 = 1

	loop: for (let j = 0; j < times.length; j++){
		const time = times[j]
		const distance = distances[j]

		for (let index = 1; index < time; index++) {
			if (index * (time - index) > distance) {
				result1 *= time + 1 - 2 * index
				continue loop
			}
		}
	}

	const time = parseInt(timesSplit.join(''))
	const distance = parseInt(distancesSplit.join(''))

	// let index = 1
	//
	// while (index < time) {
	// 	const value = index * (time - index)
	// 	if (value > distance) {
	// 		index--
	// 		break
	// 	}
	// 	index++
	// }

	let delta = Math.floor(time / 4)
	let index = delta

	while (delta > 0) {
		delta = Math.floor(delta / 2)
		if (index * (time - index) > distance) {
			index -= delta
		} else {
			index += delta
		}
	}

	if (index * (time - index) > distance) {
		index--
	}

	// const index = Math.floor((time - Math.sqrt(time * time - 4 * distance)) / 2) + 1

	return [result1, time - 2 * index - 1]
}

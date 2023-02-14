export default (input) => {
	const parsed = input.split('\n').map((str) => {
		const [a, tunnelsStr] = str.split(/; tunnels? leads? to valves? /)
		const tunnels = tunnelsStr.split(', ')
		const rate = parseInt(a.substring(23))
		const [, id] = a.split(' ')
		return [id, rate, tunnels]
	})

	const {length} = parsed

	let i = 0
	let multiplier = 1
	const ids = {}
	const rates = new Uint16Array(length)
	const multipliers = new Uint16Array(length)
	const paths = new Array(length)

	const getId = (id) => {
		if (ids.hasOwnProperty(id)) {
			return ids[id]
		}
		return ids[id] = i++
	}

	parsed.forEach(([strId, rate, tunnels]) => {
		const id = getId(strId)
		if (rate !== 0) {
			rates[id] = rate
			multipliers[id] = multiplier
			multiplier *= 2
		}
		paths[id] = tunnels.map(getId)
	})

	const idMultiplier = multiplier
	const elMultiplier = multiplier * length
	const depthMultiplier = elMultiplier * length

	const cache = new Map()

	const evaluate1 = (id, openedValves, depth) => {
		if (depth <= 1) {
			return 0
		}

		const key = openedValves + id * idMultiplier + depth * depthMultiplier

		if (cache.has(key)) {
			return cache.get(key)
		}

		let max = 0

		const next = depth - 1
		const multiplier = multipliers[id]

		if (rates[id] !== 0 && (multiplier & openedValves) === 0) {
			const result = next * rates[id] + evaluate1(id, openedValves + multiplier, next)
			if (result > max) {
				max = result
			}
		}
		paths[id].forEach((id) => {
			const result = evaluate1(id, openedValves, next)
			if (result > max) {
				max = result
			}
		})

		cache.set(key, max)

		return max
	}

	const cache2 = new Int16Array(depthMultiplier * 27).fill(-1)

	const evaluate2 = (id, el, openedValves, depth) => {
		if (depth <= 1) {
			return 0
		}

		if (id > el) {
			[id, el] = [el, id]
		}

		const key = openedValves
			+ id * idMultiplier
			+ el * elMultiplier
			+ depth * depthMultiplier

		if (cache2[key] !== -1) {
			return cache2[key]
		}

		let max = 0

		const next = depth - 1

		const multiplier = multipliers[id]
		const value = rates[id] !== 0 && (multiplier & openedValves) === 0
			? next * rates[id]
			: 0
		const idPaths = paths[id]
		const idLength = idPaths.length

		const multiplierEl = multipliers[el]
		const valueEl = rates[el] !== 0 && (multiplierEl & openedValves) === 0
			? next * rates[el]
			: 0
		const elPaths = paths[el]
		const elLength = elPaths.length

		if (el === id) {
			if (value !== 0) {
				for (let e = 0; e < elLength; e++) {
					const result = value + evaluate2(id, elPaths[e], openedValves + multiplier, next)
					if (result > max) {
						max = result
					}
				}
			}
			for (let i = 0; i < idLength; i++) {
				for (let e = i + 1; e < idLength; e++) {
					const result = evaluate2(idPaths[i], idPaths[e], openedValves, next)
					if (result > max) {
						max = result
					}
				}
			}
		} else {
			if (value !== 0) {
				if (valueEl !== 0) {
					const result = value + valueEl + evaluate2(id, el, openedValves + multiplier + multiplierEl, next)
					if (result > max) {
						max = result
					}
				}
				for (let e = 0; e < elLength; e++) {
					const result = value + evaluate2(id, elPaths[e], openedValves + multiplier, next)
					if (result > max) {
						max = result
					}
				}
			}
			if (valueEl !== 0) {
				for (let i = 0; i < idLength; i++) {
					const result = valueEl + evaluate2(idPaths[i], el, openedValves + multiplierEl, next)
					if (result > max) {
						max = result
					}
				}
			}
			for (let i = 0; i < idLength; i++) {
				for (let e = 0; e < elLength; e++) {
					const result = evaluate2(idPaths[i], elPaths[e], openedValves, next)
					if (result > max) {
						max = result
					}
				}
			}
		}

		cache2[key] = max

		return max
	}

	const id = getId('AA')

	const result1 = evaluate1(id, 0, 30)
	const result2 = evaluate2(id, id, 0, 26)

	return [result1, result2]
}

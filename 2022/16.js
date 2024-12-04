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

	const destinations = []

	parsed.forEach(([strId, rate, tunnels]) => {
		const id = getId(strId)
		if (rate !== 0) {
			rates[id] = rate
			multipliers[id] = multiplier
			multiplier *= 2
			destinations.push(id)
		}
		paths[id] = tunnels.map(getId)
	})

	const destLength = destinations.length

	const distances = new Uint8Array(length * length).fill(255)

	const addConnection = (from, to, distance) => {
		if (from === to) {
			return
		}
		const id = from < to ? to + from * length : to * length + from
		if (distances[id] > distance) {
			distances[id] = distance
			paths[from].forEach((from) => {
				addConnection(from, to, distance + 1)
			})
			paths[to].forEach((to) => {
				addConnection(from, to, distance + 1)
			})
		}
	}

	paths.forEach((paths, from) => {
		paths.forEach((to) => {
			addConnection(from, to, 1)
		})
	})

	for (let to = 0; to < length; to++) {
		distances[to * length + to] = 0
		for (let from = to + 1; from < length; from++) {
			distances[from * length + to] = distances[from + to * length]
		}
	}

	const evaluate = (from, openedValves, depth) => {
		let max = 0
		destinations.forEach((to, i) => {
			if (openedValves[i] === 0) {
				const distance = distances[from * length + to]
				const next = depth - distance - 1
				if (next > 0) {
					openedValves[i] = 1
					const result = rates[to] * next + evaluate(to, openedValves, next)
					openedValves[i] = 0
					if (result > max) {
						max = result
					}
				}
			}
		})
		return max
	}

	const id = getId('AA')

	const evaluate2 = (a, b, depth, limit) => {
		let max = evaluate(id, a, depth) + evaluate(id, b, depth)
		if (max > limit) {
			for (let i = 0; i < destLength; i++) {
				if (a[i] === 0) {
					a[i] = 1
					b[i] = 0
					const result = evaluate2(a, b, depth, max)
					a[i] = 0
					b[i] = 1
					if (result > max) {
						max = result
					}
				}
			}
		}
		return max
	}

	return [
		evaluate(id, new Uint8Array(destLength), 30),
		evaluate2(new Uint8Array(destLength), new Uint8Array(destLength).fill(1), 26, 0)
	]
}

export default (input) => {
	const ids = new Map()
	const connections = []
	const paths = []

	const getId = (name) => {
		if (ids.has(name)) {
			return ids.get(name)
		}
		paths.push([])
		return ids.set(name, paths.length)
	}

	input.split('\n').map((str) => {
		const [from, , to, , distanceStr] = str.split(' ')

		const fromId = getId(from)
		const toId = getId(to)
		// connections.push([, getId(to), parseInt(distanceStr)])
	})

	const length = ids.size

	const distances = new Uint8Array(length * length)

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

	return []
}

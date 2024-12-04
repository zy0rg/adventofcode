export default (input) => {
	const fromIds = []
	const toIds = []
	const connections = []
	let ci = 0
	let lastId = 0
	const ids = new Map()
	const getId = (name) => {
		if (ids.has(name)) {
			return ids.get(name)
		}
		const id = lastId++
		ids.set(name, id)
		connections[id] = []
		return id
	}

	input.split('\n').forEach((str) => {
		const [from, ...to] = str.split(/:? /)
		const fromId = getId(from)
		to.forEach((str) => {
			const toId = getId(str)
			const connectionId = ci++
			fromIds[connectionId] = fromId
			toIds[connectionId] = toId
			connections[fromId].push([toId, connectionId])
			connections[toId].push([fromId, connectionId])
		})
	})

	const length = lastId
	const skip2Length = ci
	const skip1Length = skip2Length - 1
	const skip0Length = skip2Length - 2

	const connected = new Set([0])
	const usedConnections = new Set()
	let skip0, skip1, skip2

	const test = (i, to) =>
		connections[i].some(([i, connectionId]) => {
			if (connectionId === skip0) {
				return false
			}
			if (connectionId === skip1) {
				return false
			}
			if (connectionId === skip2) {
				return false
			}
			if (!connected.has(i)) {
				connected.add(i)
				usedConnections.add(connectionId)
				if (to.has(i) || test(i, to)) {
					return true
				}
			}
			return false
		})

	const count = (i) =>
		connections[i].forEach(([i, connectionId]) => {
			if (connectionId === skip0 || connectionId === skip1 || connectionId === skip2) {
				return
			}
			if (!connected.has(i)) {
				connected.add(i)
				count(i)
			}
		})

	const addTo = (i, to, upTo) => {
		to.add(i)
		connections[i].forEach(([i, connectionId]) => {
			if (connectionId !== skip0 && connectionId < upTo && !to.has(i)) {
				addTo(i, to, upTo)
			}
		})
	}

	loop: for (skip0 = 0; skip0 < skip0Length; skip0++) {
		console.log(`${skip0}/${skip0Length}`)
		skip1 = skip0 + 1
		const to = new Set([toIds[skip0]])
		connected.clear()
		connected.add(fromIds[skip0])
		usedConnections.clear()
		test(fromIds[skip0], to)
		const array1 = Array.from(usedConnections).sort((a, b) => a - b)
		const len = array1.length
		for (let i = 0; i < len; i++) {
			skip1 = array1[i]
			if (skip1 <= skip0) {
				continue
			}
			for (let i = 0; i < skip1; i++) {
				if (i === skip0) {
					continue
				}
				if (to.has(fromIds[i])) {
					if (!to.has(toIds[i])) {
						addTo(toIds[i], to, skip1)
				}
			} else {
					if (to.has(toIds[i])) {
						addTo(fromIds[i], to, skip1)
					}
				}
			}
			skip2 = skip1 + 1
			connected.clear()
			connected.add(fromIds[skip0])
			usedConnections.clear()
			if (!test(fromIds[skip0], to)) {
				break loop
			}
			const array2 = Array.from(usedConnections)
			const intersection2 = new Set(array2)
			const len = array2.length
			for (let i = 0; i < len; i++) {
				skip2 = array2[i]
				if (skip2 <= skip0 || skip2 === skip1 || !intersection2.has(skip2)) {
					continue
				}
				connected.clear()
				connected.add(fromIds[skip0])
				usedConnections.clear()
				if (!test(fromIds[skip0], to)) {
					break loop
				}
				for (let i of intersection2) {
					if (!usedConnections.has(i)) {
						intersection2.delete(i)
					}
				}
			}
		}
	}

	connected.clear()
	connected.add(0)
	count(0)

	return [connected.size * (length - connected.size)]
}

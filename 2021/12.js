export default (input) => {
	const parsed = input.split('\n')

	const connections = []
	const allowedVisits = []

	const ids = {}
	let id = 0

	const getId = (str) => {
		if (ids.hasOwnProperty(str)) {
			return ids[str]
		}
		ids[str] = id
		connections[id] = []
		allowedVisits[id] = /[a-z]/.test(str)
			? 1
			: -1
		return id++
	}

	parsed.forEach((str) => {
		const [fromStr, toStr] = str.split('-')
		const fromId = getId(fromStr)
		const toId = getId(toStr)
		connections[fromId].push(toId)
		connections[toId].push(fromId)
	})

	const start = ids['start']
	const end = ids['end']

	let result1 = 0
	let result2 = 0
	let visitedTwice = false

	const move = (id) => {
		const next = connections[id]
		let len = next.length
		for (let i = 0; i < len; i++) {
			const nextId = next[i]
			if (nextId === end) {
				if (!visitedTwice) {
					result1++
				}
				result2++
			} else if (allowedVisits[nextId] === 0) {
				if (nextId !== start && !visitedTwice) {
					visitedTwice = true
					move(nextId)
					visitedTwice = false
				}
			} else {
				allowedVisits[nextId]--
				move(nextId)
				allowedVisits[nextId]++
			}
		}
	}

	allowedVisits[start] = 0
	move(start)

	return [result1, result2]
}

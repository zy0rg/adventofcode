export default (input) => {
	const parsed = input.split('\n')
	const height = parsed.length
	const width = parsed[0].length

	const steps = 64
	const adaptedWidth = width + steps * 2

	const even = new Set()
	const odd = new Set()
	let added = []
	const walls = new Set()

	parsed.forEach((row, index) => {
		let id = (index + steps) * adaptedWidth + steps
		let length = row.length
		for (let i = 0; i < length; i++) {
			if (row[i] === '#') {
				walls.add(id)
			} else if (row[i] === 'S') {
				added.push(id)
				even.add(id)
			}
			id++
		}
	})

	let isEven = true

	for (let step = 0; step < steps; step++) {
		const clone = added
		added = []
		const target = isEven ? odd : even
		isEven = !isEven
		clone.forEach((id) => {
			let next = id - adaptedWidth // up
			if (!walls.has(next) && !target.has(next)) {
				target.add(next)
				added.push(next)
			}
			next = id + 1 // right
			if (!walls.has(next) && !target.has(next)) {
				target.add(next)
				added.push(next)
			}
			next = id + adaptedWidth // down
			if (!walls.has(next) && !target.has(next)) {
				target.add(next)
				added.push(next)
			}
			next = id -1 // left
			if (!walls.has(next) && !target.has(next)) {
				target.add(next)
				added.push(next)
			}
		})
	}

	const result1 = (isEven ? even : odd).size

	return [result1]
}

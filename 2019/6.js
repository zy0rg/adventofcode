export default (input) => {
	const parsed = input.split('\n')

	const orbits = new Map()

	parsed.forEach((str) => {
		const [value, key] = str.split(')')
		orbits.set(key, value)
	})

	const counts = new Map()

	const count = (value, key) => {
		if (counts.has(key)) {
			return counts.get(key)
		}

		const result = orbits.has(value)
			? 1 + count(orbits.get(value), value)
			: 1

		counts.set(key, result)

		return result
	}

	let sum = 0

	orbits.forEach((value, key) => {
		sum += count(value, key)
	})

	let length = 0
	const you = []

	let current = orbits.get('YOU')

	do {
		you.push(current)
		current = orbits.get(current)
	} while (current != null)

	current = orbits.get('SAN')

	do {
		const index = you.indexOf(current)
		if (index !== -1) {
			length += index
			break
		}
		current = orbits.get(current)
		length++
	} while (current != null)

	return [sum, length]
}

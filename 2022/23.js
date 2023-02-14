export default (input) => {
	const elves = new Set()

	const size = 10000
	const offset = size / 2

	input.split('\n').forEach((str, y) => str.split('').forEach((char, x) => {
		if (char === '#') {
			elves.add((y + offset) * size + (x + offset))
		}
	}))

	const n = -size
	const nw = -size - 1
	const w = -1
	const sw = size - 1
	const s = size
	const se = size + 1
	const e = 1
	const ne = -size + 1

	const north = (position) =>
		elves.has(position + nw) ||
		elves.has(position + n) ||
		elves.has(position + ne)
			? 0
			: position + n

	const east = (position) =>
		elves.has(position + ne) ||
		elves.has(position + e) ||
		elves.has(position + se)
			? 0
			: position + e

	const south = (position) =>
		elves.has(position + se) ||
		elves.has(position + s) ||
		elves.has(position + sw)
			? 0
			: position + s

	const west = (position) =>
		elves.has(position + sw) ||
		elves.has(position + w) ||
		elves.has(position + nw)
			? 0
			: position + w

	const next = new Map()

	let i = 0

	const move = () => {
		const type = i % 4
		let moved = 0
		for (let position of elves) {
			if (!(
				elves.has(position + nw) ||
				elves.has(position + n) ||
				elves.has(position + ne) ||
				elves.has(position + e) ||
				elves.has(position + se) ||
				elves.has(position + s) ||
				elves.has(position + sw) ||
				elves.has(position + w)
			)) {
				continue
			}
			const direction = type === 0
				? north(position) || south(position) || west(position) || east(position)
				: type === 1
					? south(position) || west(position) || east(position) || north(position)
					: type === 2
						? west(position) || east(position) || north(position) || south(position)
						: east(position) || north(position) || south(position) || west(position)
			if (direction !== 0) {
				if (next.has(direction)) {
					next.set(direction, 0)
					moved--
				} else {
					next.set(direction, position)
					moved++
				}
			}
		}
		next.forEach((position, direction) => {
			if (position !== 0) {
				elves.delete(position)
				elves.add(direction)
			}
		})
		next.clear()
		i++
		return moved
	}

	const calculate = () => {
		let minX = size
		let maxX = -size
		let minY = size
		let maxY = -size

		for (let position of elves) {
			const y = Math.floor(position / size) - offset
			const x = position % size - offset
			if (minX > x) {
				minX = x
			}
			if (maxX < x) {
				maxX = x
			}
			if (minY > y) {
				minY = y
			}
			if (maxY < y) {
				maxY = y
			}
		}

		return (maxX - minX + 1) * (maxY - minY + 1) - elves.size
	}

	while (i < 10) {
		move()
	}
	const result1 = calculate()

	while (move() !== 0) {
	}
	const result2 = i

	return [result1, result2]
}

export default (input) => {
	const parsed = input.split('\n').map((str) => {
		const [, xs, ys, xb, yb] = str.split('=')
		return [
			parseInt(xs),
			parseInt(ys),
			parseInt(xb),
			parseInt(yb)
		]
	})

	const y1 = 2000000
	const maxY = 4000000
	const maxX = 4000000
	const halfY = maxY / 2

	const beacons = new Set()

	const processed = parsed.map(([xs, ys, xb, yb]) => {
		if (yb === y1) {
			beacons.add(xb)
		}
		return [xs, ys, Math.abs(xb - xs) + Math.abs(yb - ys)]
	})

	const evaluate = (y) => {
		const slices = []

		processed.forEach(([xs, ys, range]) => {
			const delta = Math.abs(ys - y)
			if (delta > range) {
				return
			}
			const reducedRange = range - delta
			const from = xs - reducedRange
			const to = xs + reducedRange
			add(slices, from, to)
		})

		return slices
	}

	const result1 = evaluate(y1).reduce((result, [from, to]) => result + to - from + 1, 0)
	let result2 = 0

	const test2 = (y) => {
		const slices = evaluate(y)
		if (slices[0][0] > 0) {
			result2 = y
			return true
		} else {
			const slice = slices.find(([, to]) => to >= -1 && to < maxX)
			if (slice != null) {
				result2 = y + (slice[1] + 1) * 4000000
				return true
			}
		}
		return false
	}

	for (let t = 0; t <= halfY; t++) {
		if (test2(halfY - t)) {
			break
		}
		if (test2(halfY + t)) {
			break
		}
	}

	return [result1 - beacons.size, result2]
}

const createTestSlices = () => [[4, 6], [10, 14], [16, 22]]

const reference = (slices, from, to) => {
	const set = new Set()
	slices.concat([[from, to]]).forEach(([from, to]) => {
		while (from <= to) {
			set.add(from)
			from++
		}
	})
	const array = [...set].sort((a, b) => a - b)
	let toX = array[0]
	let fromX = toX
	const result = []
	for (let i = 1; i < array.length; i++) {
		const current = array[i]
		if (current === toX + 1) {
			toX++
		} else {
			result.push([fromX, toX])
			fromX = toX = current
		}
	}
	result.push([fromX, toX])
	return result
}

const add = (slices, from, to) => {
	const {length} = slices

	if (length === 0) {
		slices.push([from, to])
		return slices
	}

	const max = length - 1

	let fromFrom = max // where "from" is placed between slices "from"
	for (; fromFrom >= 0; fromFrom--) {
		if (slices[fromFrom][0] <= from) {
			break
		}
	}

	let toFrom = max // where "to" is placed between slices "from"
	for (; toFrom >= 0; toFrom--) {
		if (slices[toFrom][0] <= to + 1) {
			break
		}
	}

	const fromTo = slices.findIndex(([, fromTo]) => fromTo >= from - 1) // where "from" is placed between slices "to"

	if (fromTo === -1) { // current is after all slices
		slices.push([from, to])
	} else if (toFrom === -1) { // current is before all slices
		slices.unshift([from, to])
	} else if (fromFrom === -1) { // current begins before any slices
		if (toFrom === length) { // current covers all slices
			const slice = slices[0]
			slice[0] = from
			if (to > slice[1]) {
				slice[1] = to
			}
			slices.length = 1
		} else if (toFrom === 0) { // current intersects with the first one
			const slice = slices[0]
			slice[0] = from
			if (to > slice[1]) {
				slice[1] = to
			}
		} else {
			const slice = slices[toFrom]
			slice[0] = from
			if (to > slice[1]) {
				slice[1] = to
			}
			slices.splice(0, toFrom)
		}
	} else if (fromFrom === fromTo) { // current should be merged to the end of this slice
		const slice = slices[fromFrom]
		if (toFrom === length) { // current covers all slices after
			slice[1] = to
			slices.length = fromFrom + 1
		} else if (toFrom === fromFrom) { // current does not intersect with the next slice
			if (slice[1] < to) {
				slice[1] = to
			}
		} else { // current intersects next and maybe multiple slices
			slice[1] = Math.max(to, slices[toFrom][1])
			slices.splice(fromFrom + 1, toFrom - fromFrom)
		}
	} else { // current should be placed after this slice, but may be merged with the next one
		if (fromFrom === toFrom) {
			slices.splice(fromTo, 0, [from, to])
		} else {
			const slice = slices[toFrom]
			slice[0] = from
			if (to > slice[1]) {
				slice[1] = to
			}
			if (fromFrom + 1 !== toFrom) {
				slices.splice(fromFrom + 1, toFrom - fromFrom - 1)
			}
		}
	}

	return slices
}

const test = () => {
	for (let from = 0; from < 30; from++) {
		for (let to = from; to < 30; to++) {
			const ref = reference(createTestSlices(), from, to)
			const result = add(createTestSlices(), from, to)
			if (ref.length !== result.length || ref.some(([fromRef, toRef], i) => {
				const [from, to] = result[i]
				return from !== fromRef || to !== toRef
			})) {
				add(createTestSlices(), from, to)
			}
		}
	}
}

// test()

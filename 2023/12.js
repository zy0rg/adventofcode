const count = (str, values, multiplier) => {
	const cellsLength = str.length
	const valuesLength = values.length
	const limit = valuesLength * multiplier
	const lastHashIndex = str.lastIndexOf('#')
	const cells = new Uint8Array(cellsLength)

	for (let i = 0; i < cellsLength; i++) {
		cells[i] = str.charCodeAt(i)
	}

	const cache = new Float64Array(limit * cellsLength).fill(-1)

	const countOptions = (index, valuesIndex) => {
		if (valuesIndex === limit) {
			// if some hashes left in the input, but no values left then current combination is invalid
			return index > lastHashIndex
				? 1
				: 0
		}
		if (index >= cellsLength) {
			return 0
		}
		const key = index * limit + valuesIndex
		if (cache[key] !== -1) {
			return cache[key]
		}
		let count = 0
		const value = values[valuesIndex % valuesLength]
		const max = cellsLength - value
		loop: for (let i = index; i <= max; i++) {
			let commit = false
			for (let x = 0; x < value; x++) {
				if (cells[i + x] === 46) {
					if (commit) {
						break loop
					}
					continue loop
				} else if (cells[i + x] === 35) {
					commit = true
				}
			}
			if (i === max || cells[i + value] !== 35) {
				count += countOptions(i + value + 1, valuesIndex + 1)
			}
			if (cells[i] === 35) {
				break
			}
		}
		cache[key] = count
		return count
	}

	return countOptions(0, 0)
}

export default (input) => {
	const parsed = input.split('\n')

	let result1 = 0
	let result2 = 0

	parsed.forEach((str) => {
		const [cells, valuesStr] = str.split(' ')
		const values = new Uint8Array(valuesStr.split(','))

		result1 += count(cells, values, 1)
		result2 += count(`${cells}?${cells}?${cells}?${cells}?${cells}`, values, 5)
	})

	return [result1, result2]
}

export default (input) => {
	const parsed = new Int16Array(input.split('\n'))
	const {length} = parsed
	const last = length - 1

	const arr = new Int16Array(parsed)
	const indices = new Int16Array(arr.length)
	for (let i = 0; i < length; i++) {
		indices[i] = i
	}

	const scramble = (arr, indices) => {
		const shift = (position, target) => {
			const value = arr[position]
			const index = indices[position]
			if (position > target) {
				for (let current = position; current > target; current--) {
					const next = current - 1
					indices[current] = indices[next]
					arr[current] = arr[next]
				}
			} else {
				for (let current = position; current < target; current++) {
					const next = current + 1
					indices[current] = indices[next]
					arr[current] = arr[next]
				}
			}
			indices[target] = index
			arr[target] = value
		}

		for (let index = 0; index < length; index++) {
			const position = indices.indexOf(index)
			const value = arr[position]
			const targetRaw = (value + position) % last

			if (value === 0) {

			} else if (value > 0) {
				shift(position, targetRaw)
			} else {
				shift(position, targetRaw + last)
			}
		}
	}

	const calc = (arr) => {
		const zero = arr.indexOf(0)
		const x1000 = arr[(zero + 1000) % length]
		const x2000 = arr[(zero + 2000) % length]
		const x3000 = arr[(zero + 3000) % length]
		return x1000 + x2000 + x3000
	}

	const arr1 = arr.slice()
	scramble(arr1, indices.slice())

	const arr2 = (new Float64Array(arr)).map((value) => 811589153 * value)
	for (let i = 0; i < 10; i++) {
		scramble(arr2, indices)
	}

	return [calc(arr1), calc(arr2)]
}

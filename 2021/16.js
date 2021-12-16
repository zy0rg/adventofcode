const hex = {
	0: 0,
	1: 1,
	2: 2,
	3: 3,
	4: 4,
	5: 5,
	6: 6,
	7: 7,
	8: 8,
	9: 9,
	A: 10,
	B: 11,
	C: 12,
	D: 13,
	E: 14,
	F: 15
}

export default (input) => {
	const length = input.length
	let i = 0
	let bits = 0
	let bitsLength = 0

	let hasMoreBits = true

	const read = (count) => {
		while (bitsLength < count) {
			if (i === length) {
				hasMoreBits = false
				return 0
			}
			bits = (bits << 4) + hex[input[i++]]
			bitsLength += 4
		}
		const offset = bitsLength - count
		const value = bits >> offset
		bits -= value << offset
		bitsLength -= count
		return value
	}

	let result1 = 0

	do {
		const version = read(3)
		const type = read(3)
		result1 += version
		if (type === 4) {
			let number = 0
			let group
			while ((group = read(5)) & 16) {
				number = (number << 4) + (group - 16)
			}
			number = (number << 4) + group
		} else {
			const packetType = read(1)
			if (packetType === 0) {
				const packetLength = read(15)
			} else {
				const packetCount = read(11)
			}
		}
	} while (hasMoreBits)

	return [result1]
}

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
	let i = 0
	let bits = 0
	let bitsLength = 0

	let result1 = 0

	const read = (count) => {
		while (bitsLength < count) {
			bits = (bits << 4) + hex[input[i++]]
			bitsLength += 4
		}
		const offset = bitsLength - count
		const value = bits >> offset
		bits -= value << offset
		bitsLength -= count
		return value
	}

	const execute = () => {
		const version = read(3)
		const type = read(3)
		result1 += version
		if (type === 4) {
			let number = 0
			let group
			while ((group = read(5)) & 16) {
				number = number * 16 + (group - 16)
			}
			return number * 16 + group
		} else {
			const packetType = read(1)
			const packets = []
			if (packetType === 0) {
				const packetLength = read(15)
				const limit = i * 4 + 4 - bitsLength + packetLength
				do {
					packets.push(execute())
				} while (i * 4 + 4 - bitsLength < limit)
			} else {
				const packetCount = read(11)
				for (let i = 0; i < packetCount; i++) {
					packets.push(execute())
				}
			}
			switch (type) {
				case 0:
					return packets.reduce((a, b) => a + b)
				case 1:
					return packets.reduce((a, b) => a * b)
				case 2:
					return Math.min(...packets)
				case 3:
					return Math.max(...packets)
				case 5:
					return packets[0] > packets[1]
						? 1
						: 0
				case 6:
					return packets[1] > packets[0]
						? 1
						: 0
				case 7:
					return packets[0] === packets[1]
						? 1
						: 0
			}
		}
	}

	const result2 = execute()

	return [result1, result2]
}

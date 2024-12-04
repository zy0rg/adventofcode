export default (input) => {
	let result1 = 0
	const boxes = new Array(256)

	input.split(',').forEach((str) => {
		let hash = 0
		const length = str.length

		const addition = str[length - 1] !== '-'
		const labelEndIndex = addition ? length - 2 : length - 1
		let i = 0

		for (; i < labelEndIndex; i++) {
			const code = str.charCodeAt(i)
			hash = (hash + code) * 17 % 256
		}

		if (boxes[hash] == null) {
			boxes[hash] = []
		}

		const label = str.substring(0, labelEndIndex)
		const box = boxes[hash]
		const index = box.findIndex((lens) => lens[0] === label)

		if (addition) {
			const value = parseInt(str.substring(length - 1))
			if (index === -1) {
				box.push([label, value])
			} else {
				box[index][1] = value
			}
		} else if (index !== -1) {
			box.splice(index, 1)
		}

		for (; i < length; i++) {
			const code = str.charCodeAt(i)
			hash = (hash + code) * 17 % 256
		}

		result1 += hash
	})

	let result2 = 0

	boxes.forEach((box, boxIndex) => {
		box.forEach((lens, lensIndex) => {
			result2 += (boxIndex + 1) * (lensIndex + 1) * lens[1]
		})
	})

	return [result1, result2]
}

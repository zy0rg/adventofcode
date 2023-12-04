export default (input) => {
	const parsed = input.split('\n')

	let result1 = 0
	let result2 = 0

	parsed.forEach((str) => {
		const words = str.split(/[:,;]? /g)
		const {length} = words
		let maxRed = 0
		let maxGreen = 0
		let maxBlue = 0
		for (let i = 2; i < length; i+=2) {
			const num = +words[i]
			switch (words[i + 1]) {
				case 'red':
					if (num > maxRed) {
						maxRed = num
					}
					break
				case 'green':
					if (num > maxGreen) {
						maxGreen = num
					}
					break
				case 'blue':
					if (num > maxBlue) {
						maxBlue = num
					}
					break
			}
		}
		if (maxRed <= 12 && maxGreen <= 13 && maxBlue <= 14) {
			result1 += +words[1]
		}
		result2 += maxRed * maxGreen * maxBlue
	})

	return [result1, result2]
}

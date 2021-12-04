export default (input) => {
	const parsed = input.split('\n')

	const totalCount = parsed.length
	const length = parsed[0].length
	const counts = new Array(length).fill(0)

	let positive = []
	let negative = []

	parsed.forEach((str) => {
		for (let i = 0; i < length; i++) {
			if (str.charAt(i) === '1') {
				counts[i]++
			}
		}
		if (str.charAt(0) === '1') {
			positive.push(str)
		} else {
			negative.push(str)
		}
	})

	const common = counts.map((count) => Math.round(count / totalCount))
	const inverse = common.map((bit) => 1 - bit)

	let oxygen
	let co2

	if (common[0] === 1) {
		oxygen = positive
		co2 = negative
	} else {
		oxygen = negative
		co2 = positive
	}

	let char = 1

	while (oxygen.length > 1) {
		positive = []
		negative = []

		oxygen.forEach((str) => {
			if (str.charAt(char) === '1') {
				positive.push(str)
			} else {
				negative.push(str)
			}
		})

		oxygen = positive.length >= negative.length
			? positive
			: negative

		char++
	}

	char = 1

	while (co2.length > 1) {
		positive = []
		negative = []

		co2.forEach((str) => {
			if (str.charAt(char) === '1') {
				positive.push(str)
			} else {
				negative.push(str)
			}
		})

		co2 = positive.length < negative.length
			? positive
			: negative

		char++
	}

	return [
		parseInt(common.join(''), 2) * parseInt(inverse.join(''), 2),
		parseInt(oxygen[0],2) * parseInt(co2[0], 2)
	]
}

const regex = /mul\((\d{1,3}),(\d{1,3})\)|do(n't)?\(\)/g

export default (input)=> {
	let match = null

	let result1 = 0
	let result2 = 0
	let add = true

	while((match = regex.exec(input)) != null) {
		switch (match[0]) {
			case 'do()':
				add = true
				break
			case 'don\'t()':
				add = false
				break
			default:
				const value = match[1] * match[2]
				result1 += value
				if (add) {
					result2 += value
				}
		}
	}

	return [result1, result2]
}

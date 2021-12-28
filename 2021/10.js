const scoreByChar = {
	'(': 1,
	'[': 2,
	'{': 3,
	'<': 4
}

export default (input) => {
	const parsed = input.split('\n')

	let result1 = 0
	const scores = []

	parsed.forEach((str) => {
		const len = str.length
		const queue = []
		for (let i = 0; i < len; i++) {
			const char = str[i]
			switch (char) {
				case '(':
				case '[':
				case '{':
				case '<':
					queue.unshift(char)
					break
				case ')':
					if (queue[0] === '(') {
						queue.shift()
						break
					} else {
						result1 += 3
						return
					}
				case ']':
					if (queue[0] === '[') {
						queue.shift()
						break
					} else {
						result1 += 57
						return
					}
				case '}':
					if (queue[0] === '{') {
						queue.shift()
						break
					} else {
						result1 += 1197
						return
					}
				case '>':
					if (queue[0] === '<') {
						queue.shift()
						break
					} else {
						result1 += 25137
						return
					}
			}
		}
		let score = 0
		queue.forEach((char) => {
			score = score * 5 + scoreByChar[char]
		})
		scores.push(score)
	})

	return [
		result1,
		scores.sort((a, b) => a - b)[Math.floor(scores.length / 2)]
	]
}

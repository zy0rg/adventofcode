const dictionary = [
	'one',
	'two',
	'three',
	'four',
	'five',
	'six',
	'seven',
	'eight',
	'nine'
]

const map = new Map()

dictionary.forEach((value, i) => {
	let current = map
	value.split('').forEach((char) => {
		if (current.has(char)) {
			current = current.get(char)
		} else {
			const child = new Map()
			current.set(char, child)
			current = child
		}
	})
	current.set('value', i + 1)
})

const test = (str, i, length) => {
	let char = str[i]
	const num = +char
	if (Number.isFinite(num)) {
		return num
	}
	let current = map
	while (i < length) {
		if (current.has(char)) {
			current = current.get(char)
			if (current.has('value')) {
				return current.get('value')
			}
			char = str[++i]
		} else {
			return null
		}
	}
	return null
}

export default (input) => {
	const parsedInput = input.split('\n')

	let result1 = 0
	let result2 = 0

	parsedInput.forEach((str) => {
		const {length} = str

		let first1 = null
		for (let i = 0; i < length; i++) {
			const num = +str[i]
			if (Number.isFinite(num)) {
				first1 = num
				break
			}
		}
		let last1 = null
		for (let i = length - 1; i >= 0; i--) {
			const num = +str[i]
			if (Number.isFinite(num)) {
				last1 = num
				break
			}
		}
		result1 += first1 * 10 + last1

		let first2 = null
		for (let i = 0; i < length; i++) {
			const num = test(str, i, length)
			if (num != null) {
				first2 = num
				break
			}
		}
		let last2 = null
		for (let i = length - 1; i >= 0; i--) {
			const num = test(str, i, length)
			if (num != null) {
				last2 = num
				break
			}
		}
		result2 += first2 * 10 + last2
	})

	return [result1, result2]
}

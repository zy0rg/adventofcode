const map = {
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
	'[': -1,
	']': -2
}

const parse = (str) => str.split(/,|/).map((char) => map[char])
const stringify = (array) => array.map((value, i) => {
	if (value === -1) {
		return '['
	} else if (value === -2) {
		if (array[i + 1] > -2) {
			return '],'
		} else {
			return ']'
		}
	} else if (array[i + 1] > -2) {
		return value + ','
	} else {
		return value
	}
}).join('')
const add = (left, right) => [-1].concat(left, right, [-2])

const reduce = (array) => {
	const length = array.length
	let depth = 0
	let lastNumberPosition = -1
	let firstLargeNumberPosition = -1
	for (let i = 0; i < length; i++) {
		const value = array[i]
		if (value === -1) {
			depth++
		} else if (value === -2) {
			depth--
		} else if (depth === 5) {
			if (lastNumberPosition !== -1) {
				array[lastNumberPosition] += value
			}
			for (let j = i + 3; j < length; j++) {
				const value = array[j]
				if (value >= 0) {
					array[j] += array[i + 1]
					break
				}
			}
			array.splice(i - 1, 4, 0)
			return true
		} else {
			if (value >= 10) {
				if (firstLargeNumberPosition === -1) {
					firstLargeNumberPosition = i
				}
			}
			lastNumberPosition = i
		}
	}
	if (firstLargeNumberPosition !== -1) {
		const value = array[firstLargeNumberPosition]
		const left = Math.floor(value / 2)
		const right = value - left
		array.splice(firstLargeNumberPosition, 1, -1, left, right, -2)
		return true
	}
	return false
}

const multiply = (array) => {
	const {length} = array
	if (length === 1) {
		return array[0]
	}
	let depth = 0
	for (let i = 1; i < length; i++) {
		const value = array[i]
		if (value === -1) {
			depth++
		} else if (value === -2) {
			depth--
		}
		if (depth === 0) {
			return multiply(array.slice(1, i + 1)) * 3 +
				multiply(array.slice(i + 1, length - 1)) * 2
		}
	}
	throw 'something went wrong'
}

export default (input) => {
	const numbers = input.split('\n').map(parse)

	const result1 = multiply(numbers.map((array) => array.slice()).reduce((result, current) => {
		const sum = add(result, current)
		while (reduce(sum)) {
		}
		// console.log(stringify(array))
		return sum
	}))

	const {length} = numbers

	let result2 = 0

	for (let i = 0; i < length; i++) {
		const left = numbers[i]
		for (let j = 0; j < length; j++) {
			if (i !== j) {
				const sum = add(left.slice(), numbers[j].slice())
				while (reduce(sum)) {
				}
				const magnitude = multiply(sum)
				if (magnitude > result2) {
					result2 = magnitude
				}
			}
		}
	}

	return [result1, result2]
}

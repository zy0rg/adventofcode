import {createProgram} from './5.js'

const test1 = (parsed, free, setting) => {
	if (free.length === 1) {
		return createProgram(parsed.slice())(free[0], setting)
	}

	let max = 0
	const sub = free.slice(1)

	for (let i = 0, len = free.length; i < len; i++) {
		const output = test1(parsed, sub, createProgram(parsed.slice())(free[i], setting))
		if (max < output) {
			max = output
		}
		sub[i] = free[i]
	}

	return max
}

const order = new Uint8Array(5)
const programs = new Array(5)

const test2 = (parsed, free) => {
	if (free.length === 1) {
		order[4] = free[0]
		let value = 0
		for (let i = 0; i < 5; i++) {
			value = (programs[i] = createProgram(parsed.slice()))(order[i], value)
		}
		let output = value
		do {
			for (let i = 0; i < 5; i++) {
				output = programs[i](output)
			}
			if (output == null) {
				return value
			}
			value = output
		} while (true)
	}

	const sub = free.slice(1)
	const len = free.length
	const index = 5 - len
	let max = 0

	for (let i = 0; i < len; i++) {
		order[index] = free[i]
		const output = test2(parsed, sub)
		if (max < output) {
			max = output
		}
		sub[i] = free[i]
	}

	return max
}

export default (input) => {
	const parsed = input.split(',').map((str) => +str)

	return [
		test1(parsed, new Uint8Array([0, 1, 2, 3, 4]), 0),
		test2(parsed, new Uint8Array([5, 6, 7, 8, 9]))
	]
}

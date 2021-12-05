export const createProgram = (program) => {
	let i = 0

	return (...input) => {
		let inputIndex = 0

		while (true) {
			const code = program[i]
			const op = code % 100

			if (op === 99) {
				return null
			}

			if (op === 3) {
				program[program[i + 1]] = input[inputIndex++]
				i += 2
				continue
			}

			const a = code % 1000 >= 100
				? program[i + 1]
				: program[program[i + 1]]

			if (op === 4) {
				i += 2
				return a
			}

			const b = code % 10000 >= 1000
				? program[i + 2]
				: program[program[i + 2]]

			if (op === 1) {
				program[program[i + 3]] = a + b
				i += 4
			} else if (op === 2) {
				program[program[i + 3]] = a * b
				i += 4
			} else if (op === 5) {
				if (a !== 0) {
					i = b
				} else {
					i += 3
				}
			} else if (op === 6) {
				if (a === 0) {
					i = b
				} else {
					i += 3
				}
			} else if (op === 7) {
				program[program[i + 3]] = a < b
					? 1
					: 0
				i += 4
			} else if (op === 8) {
				program[program[i + 3]] = a === b
					? 1
					: 0
				i += 4
			}
		}
	}
}

const read = (program, input) => {
	const fn = createProgram(program)
	let output = 0
	do {
		const result = fn(input)
		if (result == null) {
			return output
		}
		output = result
	} while (true)
}

export default (input) => {
	const parsed = input.split(',').map((str) => +str)

	return [read(parsed.slice(), 1), read(parsed, 5)]
}

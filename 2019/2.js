const exec = (parsed, a, b) => {
	const input = parsed.slice()

	input[1] = a
	input[2] = b

	let i = 0
	let op

	while ((op = input[i]) !== 99) {
		if (op === 1) {
			input[input[i + 3]] = input[input[i + 1]] + input[input[i + 2]]
		} else if (op === 2) {
			input[input[i + 3]] = input[input[i + 1]] * input[input[i + 2]]
		}
		i += 4
	}

	return input[0]
}

export default (input) => {
	const parsed = input.split(',').map((str) => +str)

	let result1 = exec(parsed, 12, 2)

	for (let i = 0; i < 1000; i++) {
		for (let j = 0; j < 100; j++) {
			if (exec(parsed, i, j) === 19690720) {
				return [result1, i * 100 + j]
			}
		}
	}
}


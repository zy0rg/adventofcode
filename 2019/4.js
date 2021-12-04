export default (input) => {
	const [fromStr, toStr] = input.split('-')
	const from = parseInt(fromStr)
	const to = parseInt(toStr)

	let count = 0
	let valid = false
	let count2 = 0
	let valid2index = 0

	for (let i = from; i <= to; i++) {
		valid = false
		valid2index = 0
		const a = Math.floor(i / 100000)
		const b = Math.floor(i % 100000 / 10000)
		if (a > b) {
			continue
		} else if (a === b) {
			valid = true
			valid2index = 1
		}
		const c = Math.floor(i % 10000 / 1000)
		if (b > c) {
			continue
		} else if (b === c) {
			valid = true
			if (valid2index === 0) {
				valid2index = 2
			} else if (valid2index === 1) {
				valid2index = 0
			}
		}
		const d = Math.floor(i % 1000 / 100)
		if (c > d) {
			continue
		} else if (c === d) {
			valid = true
			if (valid2index === 0) {
				if (b !== d) {
					valid2index = 3
				}
			} else if (valid2index === 2) {
				valid2index = 0
			}
		}
		const e = Math.floor(i % 100 / 10)
		if (d > e) {
			continue
		} else if (d === e) {
			valid = true
			if (valid2index === 0) {
				if (c !== e) {
					valid2index = 4
				}
			} else if (valid2index === 3) {
				valid2index = 0
			}
		}
		const f = i % 10
		if (e > f) {
			continue
		} else if (e === f) {
			valid = true
			if (valid2index === 0) {
				if (d !== f) {
					valid2index = 5
				}
			} else if (valid2index === 4) {
				valid2index = 0
			}
		}
		if (valid) {
			count++
			if (valid2index !== 0) {
				count2++
			}
		}
	}

	return [count, count2]
}

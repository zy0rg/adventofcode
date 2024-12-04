export default (input) => {
	const rows = input.split('\n')
	const {length} = rows

	let result1 = 0
	let result2 = 0

	const failTest = (row) => {
		const {length} = row
		loop: for (let fail = 0; fail < length; fail++) {
			let prev = row[fail === 0 ? 1 : 0]
			const num = row[fail < 2 ? 2 : 1]
			let inc = true
			if (num === prev) {
				continue
			} else if (num < prev) {
				if (prev - num > 3) {
					continue
				}
				inc = false
			} else if (num - prev > 3) {
				continue
			}
			prev = num
			if (inc) {
				for (let j = fail < 3 ? 3 : 2; j < length; j++) {
					if (j === fail) {
						continue
					}
					const num = row[j]
					if (num <= prev || (num - prev > 3)) {
						continue loop
					}
					prev = num
				}
			} else {
				for (let j = fail < 3 ? 3 : 2; j < length; j++) {
					if (j === fail) {
						continue
					}
					const num = row[j]
					if (num >= prev || (prev - num > 3)) {
						continue loop
					}
					prev = num
				}
			}
			result2++
			break
		}
	}

	loop: for (let i = 0; i < length; i++) {
		const row = rows[i].split(' ').map((str) => parseInt(str))
		let prev = row[0]
		const num = row[1]
		let inc = true
		if (num === prev) {
			failTest(row)
			continue
		} else if (num < prev) {
			if (prev - num > 3) {
				failTest(row)
				continue
			}
			inc = false
		} else if (num - prev > 3) {
			failTest(row)
			continue
		}
		prev = num
		const {length} = row
		if (inc) {
			for (let j = 2; j < length; j++) {
				const num = row[j]
				if (num <= prev || (num - prev > 3)) {
					failTest(row)
					continue loop
				}
				prev = num
			}
		} else {
			for (let j = 2; j < length; j++) {
				const num = row[j]
				if (num >= prev || (prev - num > 3)) {
					failTest(row)
					continue loop
				}
				prev = num
			}
		}
		result1++
		result2++
	}

	return [result1, result2]
}

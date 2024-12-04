const regex = /(\w+) (\d+),(\d+) through (\d+),(\d+)/

export default (input) => {
	const field = new Uint8Array(1000000)
	const field2 = new Uint8Array(1000000)

	input.split('\n').forEach((str) => {
		const [, operation, fromXStr, fromYStr, toXStr, toYStr] = regex.exec(str)
		const toX = parseInt(toXStr)
		const toY = parseInt(toYStr)
		switch (operation) {
			case 'on':
				for (let x = parseInt(fromXStr); x <= toX; x++) {
					for (let y = parseInt(fromYStr); y <= toY; y++) {
						const id = x * 1000 + y
						field[id] = 1
						field2[id]++
					}
				}
				break
			case 'off':
				for (let x = parseInt(fromXStr); x <= toX; x++) {
					for (let y = parseInt(fromYStr); y <= toY; y++) {
						const id = x * 1000 + y
						field[id] = 0
						if (field2[id] > 0) {
							field2[id]--
						}
					}
				}
				break
			case 'toggle':
				for (let x = parseInt(fromXStr); x <= toX; x++) {
					for (let y = parseInt(fromYStr); y <= toY; y++) {
						const id = x * 1000 + y
						field[id] = 1 - field[id]
						field2[id] += 2
					}
				}
				break
		}
	})

	let result1 = 0
	let result2 = 0

	for (let i = 0; i < 1000000; i++) {
		if (field[i]) {
			result1++
		}
		result2 += field2[i]
	}

	return [result1, result2]
}

export default (input) => {
	const length = input.length

	let position = 0
	const visited = new Set()

	let santa = 0
	let robo = 0
	const visited2 = new Set()

	for (let i = 0; i < length; i++) {
		let direction = 0
		switch (input[i]) {
			case '>':
				direction = 1
				break
			case '<':
				direction = -1
				break
			case '^':
				direction = length
				break
			case 'v':
				direction = -length
		}
		position += direction
		visited.add(position)
		if (i % 2 === 1) {
			robo += direction
			visited2.add(robo)
		} else {
			santa += direction
			visited2.add(santa)
		}
	}

	return [visited.size, visited2.size]
}

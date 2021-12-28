const next = new Uint16Array(100)
const score = new Uint16Array(100)

for (let i = 0; i < 100; i++) {
	next[i] = (i + 3) % 100
	score[i] = (i + 2) * 3
}

score[97] = 297
score[98] = 200
score[99] = 103

const probabilities = new Uint8Array([1, 3, 6, 7, 6, 3, 1])

export default (input) => {
	const [firstLine, secondLine] = input.split('\n')
	const firstStart = parseInt(firstLine.substr(28))
	const secondStart = parseInt(secondLine.substr(28))

	let step = 0
	let dice = 0
	let first = firstStart
	let second = secondStart
	let firstScore = 0
	let secondScore = 0

	let result1

	do {
		++step
		firstScore += (first = (first + score[dice] - 1) % 10 + 1)
		dice = next[dice]
		if (firstScore >= 1000) {
			result1 = step * 3 * secondScore
			break
		}
		++step
		secondScore += (second = (second + score[dice] - 1) % 10 + 1)
		dice = next[dice]
		if (secondScore >= 1000) {
			result1 = step * 3 * firstScore
			break
		}
	} while (true)

	const wins = new Float64Array(2)

	const roll = (position, score, opposite, oppositeScore, multiplier, player) => {
		for (let i = 0; i < 7; i++) {
			const newPosition = (position + i + 2) % 10 + 1
			const newScore = score + newPosition
			if (newScore >= 21) {
				wins[player] += multiplier * probabilities[i]
			} else {
				roll(opposite, oppositeScore, newPosition, newScore, multiplier * probabilities[i], 1 - player)
			}
		}
	}

	roll(firstStart, 0, secondStart, 0, 1, 0)

	const result2 = Math.max(...wins)

	return [result1, result2]
}

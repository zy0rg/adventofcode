export default  (input) => {
	const [numbersStr, ...boardsStr] = input.split('\n\n')

	const boardSums = new Uint16Array(boardsStr.length)
	const numberLines = new Map()

	let line = 0
	boardsStr.forEach((str, board) => {
		const linesStr = str.split('\n')
		linesStr.forEach((str) => {
			const offset = board * 10 + 5
			str.trim().split(/\s+/).forEach((str, column) => {
				let number = parseInt(str)
				boardSums[board] += number
				if (numberLines.has(number)) {
					numberLines.get(number).push(line, offset + column)
				} else {
					numberLines.set(number, [line, offset + column])
				}
			})
			line++
		})
		line += 5
	})

	const lineMatchedNumbers = new Uint8Array(line)
	const numbers = numbersStr.split(',')
	let boardsThatDidNotWin = boardsStr.map((str, i) => i)

	let result1 = -1
	let result2 = -1

	loop: for (let i = 0, len = numbers.length; i < len; i++) {
		const number = parseInt(numbers[i])

		if (numberLines.has(number)) {
			const lines = numberLines.get(number)
			for (let i = 0, len = lines.length; i < len; i++) {
				const line = lines[i]
				const board = Math.floor(line / 10)
				if (line % 10 < 5) {
					boardSums[board] -= number
				}
				if (lineMatchedNumbers[line] === 4) {
					if (result1 === -1) {
						result1 = boardSums[board] * number
					}
					const index = boardsThatDidNotWin.indexOf(board)
					if (index !== -1) {
						if (boardsThatDidNotWin.length === 1) {
							result2 = boardSums[board] * number
							break loop
						} else {
							boardsThatDidNotWin.splice(index, 1)
						}
					}
				} else {
					lineMatchedNumbers[line]++
				}
			}
		}
	}

	return [result1, result2]
}

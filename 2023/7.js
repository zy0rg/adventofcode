const order = {
	2: 2,
	3: 3,
	4: 4,
	5: 5,
	6: 6,
	7: 7,
	8: 8,
	9: 9,
	T: 10,
	J: 11,
	Q: 12,
	K: 13,
	A: 14
}

export default (input) => {
	const cards = input.split('\n').map((str) => {
		const map = new Map()
		let cards = 0
		let jokerCards = 0
		let max = 0
		let jokers = 0
		for (let i = 0; i < 5; i++) {
			const card = order[str[i]]
			cards = cards * 15 + card
			if (card === 11) {
				jokers++
				jokerCards = jokerCards * 15 + 1
			} else {
				jokerCards = jokerCards * 15 + card
			}
			if (map.has(card)) {
				const count = map.get(card) + 1
				if (count > max) {
					max = count
				}
				map.set(card, count)
			} else {
				map.set(card, 1)
			}
		}
		// AAAAA - 0
		// AAAAB - 1
		// AAABB - 2
		// AAABC - 3
		// AABBC - 4
		// AABCD - 5
		// ABCDE - 6
		let type = 0
		let jokersType = 0
		switch (map.size) {
			case 2:
				type = max === 4
					? 1
					: 2
				if (jokers === 0) {
					jokersType = type
				}
				break
			case 3:
				type = max === 3
					? 3
					: 4
				jokersType = jokers === 0
					? type
					: max === 3 || jokers === 2
						? 1
						: 2
				break
			case 4:
				type = 5
				jokersType = jokers === 0
					? type
					: 3
				break
			case 5:
				type = 6
				jokersType = jokers === 0
					? type
					: 5
				break
		}
		return {
			value: parseInt(str.substring(6)),
			cards,
			type,
			jokersType,
			jokerCards
		}
	})

	cards.sort((a, b) =>
		b.type - a.type ||
		a.cards - b.cards
	)

	const result1 = cards.reduce((result, {value}, i) => result + value * (i + 1), 0)

	cards.sort((a, b) =>
		b.jokersType - a.jokersType ||
		a.jokerCards - b.jokerCards
	)

	const result2 = cards.reduce((result, {value}, i) => result + value * (i + 1), 0)

	return [result1, result2]
}

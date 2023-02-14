export default (input) => {
	const monkeys = []
	const monkeys2 = []
	let totalItems = 0
	let divisor = 1

	input.split('\n\n').map((str) => {
		const [monkeyStr, itemsStr, operationStr, testStr, ifTrueStr, ifFalseStr] = str.split('\n')
		const operation = operationStr.charAt(23)
		const argument = operationStr.substring(25)
		const divisibleBy = +(testStr.substring(21))
		const items = itemsStr.substring(18).split(', ').map((str) => parseInt(str))
		const ifTrue = +(ifTrueStr.substring(29))
		const ifFalse = +(ifFalseStr.substring(30))

		totalItems += items.length

		const num = +argument
		monkeys.push({
			items,
			fn: argument === 'old'
				? operation === '+'
					? (old) => old * 2
					: (old) => old * old
				: operation === '+'
					? (old) => old + num
					: (old) => old * num,
			divisibleBy,
			ifTrue,
			ifFalse,
			i: 0
		})

		divisor *= divisibleBy
		monkeys2.push({
			items,
			itemCount: items.length,
			square: argument === 'old',
			multiply: operation === '*',
			num,
			divisibleBy,
			ifTrue,
			ifFalse,
			i: 0
		})
	})

	monkeys2.forEach((monkey) => {
		const array = new Uint32Array(totalItems)
		array.set(monkey.items)
		monkey.items = array
	})

	const {length} = monkeys

	for (let step = 0; step < 20; step++) {
		for (let i = 0; i < length; i++) {
			const monkey = monkeys[i]
			const {items, fn, divisibleBy, ifTrue, ifFalse} = monkey
			items.forEach((value) => {
				value = Math.floor(fn(value) / 3)
				const next = value % divisibleBy === 0
					? ifTrue
					: ifFalse
				monkeys[next].items.push(value)
			})
			monkey.i += items.length
			items.length = 0
		}
	}

	for (let step = 0; step < 10000; step++) {
		for (let i = 0; i < length; i++) {
			const monkey = monkeys2[i]
			const {items, itemCount, square, multiply, num, divisibleBy, ifTrue, ifFalse} = monkey
			for (let x = 0; x < itemCount; x++) {
				let value = items[x]
				if (square) {
					value *= value
				} else if (multiply) {
					value *= num
				} else {
					value += num
				}
				const next = monkeys2[value % divisibleBy === 0
					? ifTrue
					: ifFalse]
				next.items[next.itemCount] = value % divisor
				next.itemCount++
			}
			monkey.i += itemCount
			monkey.itemCount = 0
		}
	}

	monkeys.sort((a, b) => b.i - a.i)

	const result1 = monkeys[0].i * monkeys[1].i

	monkeys2.sort((a, b) => b.i - a.i)

	const result2 = monkeys2[0].i * monkeys2[1].i

	return [result1, result2]
}

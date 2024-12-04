export default (input) => {
	const parsed = input.split('\n')

	let broadcaster = 0

	const fn = []
	const state = []
	const inputs = []

	const stack = []

	let lows = 0
	let highs = 0

	const addHigh = () => {
		highs++
	}
	const addLow = () => {
		lows++
	}

	let i = 0
	const ids = new Map()
	const getId = (name) => {
		if (ids.has(name)) {
			return ids.get(name)
		}
		const id = i++
		ids.set(name, id)
		const lowIndex = id * 2
		state[id] = -1
		fn[lowIndex] = addLow
		fn[lowIndex + 1] = addHigh
		return id
	}

	parsed.forEach((str) => {
		const [name, outputStr] = str.split(' -> ')
		const output = outputStr.split(', ').map(getId)
		const lowOutput = output.map((id) => id * 2)
		const highOutput = lowOutput.map((id) => id + 1)
		if (name === 'broadcaster') {
			const id = getId(name)
			const lowIndex = broadcaster = id * 2
			output.forEach((target) => {
				if (inputs[target] == null) {
					inputs[target] = [id]
				} else {
					inputs[target].push(id)
				}
			})
			fn[lowIndex] = () => {
				lows++
				state[id] = 0
				stack.push(...lowOutput)
			}
			fn[lowIndex + 1] = () => {
				highs++
				state[id] = 1
				stack.push(...highOutput)
			}
		} else {
			const id = getId(name.substring(1))
			const lowIndex = id * 2
			output.forEach((target) => {
				if (inputs[target] == null) {
					inputs[target] = [id]
				} else {
					inputs[target].push(id)
				}
			})
			if (name[0] === '%') {
				fn[lowIndex] = () => {
					lows++
					if (state[id] === 1) {
						state[id] = 0
						stack.push(...lowOutput)
					} else {
						state[id] = 1
						stack.push(...highOutput)
					}
				}
			} else {
				fn[lowIndex] = () => {
					lows++
					state[id] = 1
					stack.push(...highOutput)
				}
				fn[lowIndex + 1] = () => {
					highs++
					if (inputs[id].every((id) => state[id] === 1)) {
						state[id] = 0
						stack.push(...lowOutput)
					} else {
						state[id] = 1
						stack.push(...highOutput)
					}
				}
			}
		}
	})

	const rxLow = getId('rx') * 2
	const rxFn = fn[rxLow]


	let result2 = 0
	let push = 0

	fn[rxLow] = () => {
		result2 = push + 1
		fn[rxLow] = rxFn
		rxFn()
	}

	const mr = getId('mr')
	const kk = getId('kk')
	const gl = getId('gl')
	const bb = getId('bb')

	const wrap = (name) => {
		const id = getId(name)
		const lowIndex = id * 2
		const lowFn = fn[lowIndex]
		fn[lowIndex] = () => {
			lowFn()
			if (state[id] === 1) {
				console.log(name, push, [state[mr], state[kk], state[gl], state[bb]])
			}
		}
	}

	wrap('mr')
	wrap('kk')
	wrap('gl')
	wrap('bb')

	for (; push < 1000; push++) {
		fn[broadcaster]()
		while (stack.length > 0) {
			fn[stack.shift()]()
		}
	}

	const result1 = lows * highs

	return [result1, result2]
}

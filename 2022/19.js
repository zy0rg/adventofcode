export default (input) => {
	const parsed = input
		.substring(10)
		.split(/\s+Blueprint/)
		.map((str) => {
			const id = parseInt(str)
			const [, ore, clay, obsidian, geode] = str.split(/[.:]\s+Each \w+ robot costs /)
			const oreOre = parseInt(ore)
			const clayOre = parseInt(clay)
			const [a, b] = obsidian.split(' and ')
			const obsidianOre = parseInt(a)
			const obsidianClay = parseInt(b)
			const [c, d] = geode.split(' and ')
			const geodeOre = parseInt(c)
			const geodeObsidian = parseInt(d)
			return [id, oreOre, clayOre, obsidianOre, obsidianClay, geodeOre, geodeObsidian]
		})

	const resMultiplier = 80
	const robotMultiplier = 80

	const oreMultiplier = 1
	const clayMultiplier = oreMultiplier * resMultiplier
	const obsidianMultiplier = clayMultiplier * resMultiplier
	const geodeMultiplier = obsidianMultiplier * resMultiplier

	const oreRobotMultiplier = geodeMultiplier * resMultiplier
	const clayRobotMultiplier = oreRobotMultiplier * robotMultiplier
	const obsidianRobotMultiplier = clayRobotMultiplier * robotMultiplier
	const geodeRobotMultiplier = obsidianRobotMultiplier * robotMultiplier

	const movesMultiplier = geodeRobotMultiplier * robotMultiplier

	const calculateEffectiveness = (entries, depth) => entries.map(([
		id, oreOre, clayOre, obsidianOre, obsidianClay, geodeOre, geodeObsidian
	]) => {
		const cache = new Map()
		const bestByMove = new Array(depth)
		for (let i = 0; i < depth; i++) {
			bestByMove[i] = new Uint16Array(8)
		}
		const cacheLimit = 5 // moves - 22

		let total = 0
		let fromCache = 0
		let cutByBest = 0

		const evaluate = (ore, clay, obsidian, geode, oreRobot, clayRobot, obsidianRobot, geodeRobot, moves) => {
			total++

			const id = ore
				+ clay * clayMultiplier
				+ obsidian * obsidianMultiplier
				+ geode * geodeMultiplier
				+ oreRobot * oreRobotMultiplier
				+ clayRobot * clayRobotMultiplier
				+ obsidianRobot * obsidianRobotMultiplier
				+ geodeRobot * geodeRobotMultiplier
				+ moves * movesMultiplier

			if (moves > cacheLimit && cache.has(id)) {
				fromCache++
				return cache.get(id)
			}

			const nextOre = ore + oreRobot
			const nextClay = clay + clayRobot
			const nextObsidian = obsidian + obsidianRobot
			const nextGeode = geode + geodeRobot

			const next = moves - 1

			if (next === 0) {
				return nextGeode
			}

			const best = bestByMove[next]
			const [bestOre, bestClay, bestObsidian, bestGeode, bestOreRobot, bestClayRobot, bestObsidianRobot, bestGeodeRobot] = best
			if (ore <= bestOre && clay <= bestClay && obsidian <= bestObsidian && geode <= bestGeode
				&& oreRobot <= bestOreRobot && clayRobot <= bestClayRobot && obsidianRobot <= bestObsidianRobot && geodeRobot <= bestGeodeRobot) {
				cache.set(id, 0)
				cutByBest++
				return 0
			}
			if (ore >= bestOre && clay >= bestClay && obsidian >= bestObsidian && geode >= bestGeode
				&& oreRobot >= bestOreRobot && clayRobot >= bestClayRobot && obsidianRobot >= bestObsidianRobot && geodeRobot >= bestGeodeRobot) {
				best.set([ore, clay, obsidian, geode, oreRobot, clayRobot, obsidianRobot, geodeRobot])
			}

			let max = 0

			if (obsidian >= geodeObsidian && ore >= geodeOre) {
				const result = evaluate(nextOre - geodeOre, nextClay, nextObsidian - geodeObsidian, nextGeode, oreRobot, clayRobot, obsidianRobot, geodeRobot + 1, next)
				if (result > max) {
					max = result
				}
			}

			if (clay >= obsidianClay && ore >= obsidianOre) {
				const result = evaluate(nextOre - obsidianOre, nextClay - obsidianClay, nextObsidian, nextGeode, oreRobot, clayRobot, obsidianRobot + 1, geodeRobot, next)
				if (result > max) {
					max = result
				}
			}

			if (ore >= clayOre) {
				const result = evaluate(nextOre - clayOre, nextClay, nextObsidian, nextGeode, oreRobot, clayRobot + 1, obsidianRobot, geodeRobot, next)
				if (result > max) {
					max = result
				}
			}

			if (ore >= oreOre) {
				const result = evaluate(nextOre - oreOre, nextClay, nextObsidian, nextGeode, oreRobot + 1, clayRobot, obsidianRobot, geodeRobot, next)
				if (result > max) {
					max = result
				}
			}

			const result = evaluate(nextOre, nextClay, nextObsidian, nextGeode, oreRobot, clayRobot, obsidianRobot, geodeRobot, next)
			if (result > max) {
				max = result
			}

			if (moves > cacheLimit) {
				cache.set(id, max)
			}

			return max
		}

		const result = evaluate(
			0,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			depth
		)

		return result
	})

	const result1 = 0 // calculateEffectiveness(parsed, 24).reduce((result, value, i) => result + value * (i + 1))

	const result2 = calculateEffectiveness(parsed.slice(0, 3), 32).reduce((result, value) => result * value)

	return [result1, result2]
}

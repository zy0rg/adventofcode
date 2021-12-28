const getId = (x, y, z) => BigInt(x) + BigInt(y) * 100000n + BigInt(z) * 10000000000n
const getCoordsFromId = (id) => {
	let z = id / 10000000000n
	id -= z * 10000000000n
	if (id > 5000000000n) {
		z++
		id -= 10000000000n
	} else if (id < -5000000000n) {
		z--
		id += 10000000000n
	}
	let y = id / 100000n
	id -= y * 100000n
	if (id > 50000n) {
		y++
		id -= 100000n
	} else if (id < -50000n) {
		y--
		id += 100000n
	}
	return [Number(id), Number(y), Number(z)]
}

export default (input) => {
	const scanners = input.split('\n\n').map((str) => {
		const beacons = str.split('\n')
		const length = beacons.length
		const linesCount = length - 1
		const rotations = new Array(24)
		for (let i = 0; i < 24; i++) {
			rotations[i] = new Array(linesCount)
		}
		for (let i = 0; i < linesCount; i++) {
			const line = beacons[i + 1]
			const [x, y, z] = line.split(',').map((str) => parseInt(str))
			rotations[0][i] = getId(x, y, z)
			rotations[1][i] = getId(x, -y, -z)
			rotations[2][i] = getId(x, z, -y)
			rotations[3][i] = getId(x, -z, y)
			rotations[4][i] = getId(-x, y, -z)
			rotations[5][i] = getId(-x, -y, z)
			rotations[6][i] = getId(-x, z, y)
			rotations[7][i] = getId(-x, -z, -y)
			rotations[8][i] = getId(y, x, -z)
			rotations[9][i] = getId(y, -x, z)
			rotations[10][i] = getId(y, z, x)
			rotations[11][i] = getId(y, -z, -x)
			rotations[12][i] = getId(-y, x, z)
			rotations[13][i] = getId(-y, -x, -z)
			rotations[14][i] = getId(-y, z, -x)
			rotations[15][i] = getId(-y, -z, x)
			rotations[16][i] = getId(z, x, y)
			rotations[17][i] = getId(z, -x, -y)
			rotations[18][i] = getId(z, y, -x)
			rotations[19][i] = getId(z, -y, x)
			rotations[20][i] = getId(-z, x, -y)
			rotations[21][i] = getId(-z, -x, y)
			rotations[22][i] = getId(-z, y, x)
			rotations[23][i] = getId(-z, -y, -x)
		}
		return rotations
	})

	const limit = 12
	const scannerCount = scanners.length
	const map = scanners[0][0].slice()
	let mapLength = map.length
	const mapSet = new Set(map)
	const coords = [[0, 0, 0]]
	let left = scanners.slice(1)
	let leftCount = left.length
	let scannerLimits = new Array(leftCount).fill(limit)

	loop: while (leftCount > 0) {
		for (let i = 0; i < leftCount; i++) {
			const rotations = left[i]
			const scannerLength = rotations[0].length
			for (let m = scannerLimits[i]; m < mapLength; m++) {
				const mapBeacon = map[m]
				for (let r = 0; r < 24; r++) {
					const scanner = rotations[r]
					for (let s = 0; s < scannerLength; s++) {
						const offset = mapBeacon - scanner[s]
						let matches = 0
						let stop = scannerLength - limit
						for (let j = 0; j <= stop; j++) {
							if (mapSet.has(scanner[j] + offset)) {
								if (++matches === limit) {
									for (let j = 0; j < scannerLength; j++) {
										const offsetBeacon = scanner[j] + offset
										if (!mapSet.has(offsetBeacon)) {
											map.push(offsetBeacon)
											mapSet.add(offsetBeacon)
											mapLength++
										}
									}
									coords.push(getCoordsFromId(offset))
									left = left.slice(i + 1).concat((left.slice(0, i)))
									scannerLimits = scannerLimits.slice(i + 1).concat((scannerLimits.slice(0, i)))
									leftCount--
									continue loop
								}
								stop++
							}
						}
					}
				}
			}
			scannerLimits[i] = mapLength
		}
		console.log('something went wrong')
		break
	}

	let max = 0

	for (let a = 0; a < scannerCount; a++) {
		const [x, y, z] = coords[a]
		for (let b = a + 1; b < scannerCount; b++) {
			const [x2, y2, z2] = coords[b]
			const value = (x2 > x ? x2 - x : x - x2) + (y2 > y ? y2 - y : y - y2) + (z2 > z ? z2 - z : z - z2)
			if (value > max) {
				max = value
			}
		}
	}

	return [map.length, max]
}

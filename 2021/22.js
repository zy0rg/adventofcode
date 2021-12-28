export default (input) => {
	const operations = input.split('\n').map((str) => {
		const [, opStr, xMinStr, xMaxStr, yMinStr, yMaxStr, zMinStr, zMaxStr] = /(\w+) x=(-?\d+)\.\.(-?\d+),y=(-?\d+)..(-?\d+),z=(-?\d+)..(-?\d+)/.exec(str)
		return new Float64Array([
			opStr === 'on' ? 1 : 0,
			parseInt(xMinStr),
			parseInt(xMaxStr),
			parseInt(yMinStr),
			parseInt(yMaxStr),
			parseInt(zMinStr),
			parseInt(zMaxStr)
		])
	})

	const map = new Float64Array(101 * 101 * 101)
	const regions = []

	operations.forEach((region) => {
		const [value, xMin, xMax, yMin, yMax, zMin, zMax] = region
		const {length} = regions

		for (let i = 0; i < length; i++) {
			const [valueC, xMinC, xMaxC, yMinC, yMaxC, zMinC, zMaxC] = regions[i]
			if (
				xMin > xMaxC || xMax < xMinC ||
				yMin > yMaxC || yMax < yMinC ||
				zMin > zMaxC || zMax < zMinC
			) {
				continue
			}
			regions.push(new Float64Array([
				-valueC,
				xMin > xMinC ? xMin : xMinC,
				xMax < xMaxC ? xMax : xMaxC,
				yMin > yMinC ? yMin : yMinC,
				yMax < yMaxC ? yMax : yMaxC,
				zMin > zMinC ? zMin : zMinC,
				zMax < zMaxC ? zMax : zMaxC
			]))
		}

		if (value === 1) {
			regions.push(region)
		}

		if (xMin <= 50 && xMax >= -50 && yMin <= 50 && yMax >= -50 && zMin <= 50 && zMax >= -50) {
			const xMinCut = xMin < -50 ? 0 : xMin + 50
			const xMaxCut = xMax > 50 ? 100 : xMax + 50
			const yMinCut = yMin < -50 ? 0 : yMin + 50
			const yMaxCut = yMax > 50 ? 100 : yMax + 50
			const zMinCut = zMin < -50 ? 0 : zMin + 50
			const zMaxCut = zMax > 50 ? 100 : zMax + 50
			for (let x = xMinCut; x <= xMaxCut; x++) {
				for (let y = yMinCut; y <= yMaxCut; y++) {
					for (let z = zMinCut; z <= zMaxCut; z++) {
						map[z * 10201 + y * 101 + x] = value
					}
				}
			}
		}
	})

	const result1 = map.reduce((a, b) => a + b)
	let result2 = 0
	regions.forEach(([value, xMin, xMax, yMin, yMax, zMin, zMax]) => {
		result2 += value * (xMax - xMin + 1) * (yMax - yMin + 1) * (zMax - zMin + 1)
	})

	return [result1, result2]
}

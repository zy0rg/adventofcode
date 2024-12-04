export default (input) => {
	const values = new Float64Array(input.split(/ *[,@\s] */))
	const length = values.length / 6
	const paths = new Array(length)

	const min = 200000000000000
	const max = 400000000000000

	for (let i = 0, offset = 0; i < length; i++) {
		paths[i] = values.subarray(offset, offset += 6)
	}

	let result1 = 0

	for (let i = 0; i < length; i++) {
		const [x1, y1, vx1, vy1] = paths[i]

		for (let j = i + 1; j < length; j++) {
			const [x2, y2, , vx2, vy2] = paths[j]

			// x = x1 + vx1 * t1
			// x = x2 + vx2 * t2
			// y = y1 + vy1 * t1
			// y = y2 + vy2 * t2
			// t1 = (x - x1) / vx1
			// x1 + vx1 * t1 = x2 + vx2 * t2
			// y1 + vy1 * t1 = y2 + vy2 * t2
			// t1 = (x2 + vx2 * t2 - x1) / vx1
			// y1 + vy1 * (x2 + vx2 * t2 - x1) / vx1 = y2 + vy2 * t2
			// vy1 * (x2 + vx2 * t2 - x1) = (y2 + vy2 * t2 - y1) * vx1
			// vy1 * (x2 - x1) + vy1 * vx2 * t2 = vx1 * (y2 - y1) + vx1 * vy2 * t2
			// t2 * (vy1 * vx2 - vx1 * vy2) = vx1 * (y2 - y1) - vy1 * (x2 - x1)

			const t2 = (vx1 * (y2 - y1) - vy1 * (x2 - x1)) / (vy1 * vx2 - vx1 * vy2)
			if (t2 < 0) {
				continue
			}
			const x = x2 + vx2 * t2
			if (x < min || x > max) {
				continue
			}
			const t1 = (x - x1) / vx1
			if (t1 < 0) {
				continue
			}
			const y = y2 + vy2 * t2
			if (y < min || y > max) {
				continue
			}
			result1++
		}
	}

	let x = 0
	let vx = 1
	let y = 0
	let vy = 1
	let z = 0
	let vz = 1

	for (let i = length - 1; i >= 0; i--) {
		const [x1, y1, z1, vx1, vy1, vz1] = paths[i]

		// x = x1 + vx1 * t
		// x = x0 + vx0 * t
		// x0 + vx0 * t = x1 + vx1 * t
		// vx0 * t - vx1 * t = x1 - x0
		// t * (vx0 - vx1) = (x1 - x0)
		// t = (x1 - x0) / (vx0 - vx1)
		const tx = (x1 - x) / (vx - vx1)
		const ty = (y1 - y) / (vy - vy1)
		const tz =  (z1 - z) / (vz - vz1)

		if (tx === ty && tx === tz) {
			break
		}

		const ax = (tz + ty) / 4 + Math.max(1, tx) / 2
		const ay = (tx + tz) / 4 + Math.max(1, ty) / 2
		const az = (tx + ty) / 4 + Math.max(1, tz) / 2

		;[x, vx] = [x1 + (vx1 - vx) * ax, (x1 - x) / ax + vx1]
		;[y, vy] = [y1 + (vy1 - vy) * ay, (y1 - y) / ay + vy1]
		;[z, vz] = [z1 + (vz1 - vz) * az, (z1 - z) / az + vz1]

		if (i === 0) {
			i = length
		}
	}

	// assume t1 = 0
	// t = (x1 - x0) / (vx0 - vx1)
	// x0 = x1, y0 = y1
	// t2 = (x2 - x1) / (vx0 - vx2) = (y2 - y1) / (vy0 - vy2)
	// t3 = (x3 - x1) / (vx0 - vx3) = (y3 - y1) / (vy0 - vy3)


	return [result1]
}

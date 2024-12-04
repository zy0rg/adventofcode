export default (input) => {
	let result1 = 0
	let result2 = 0

	input.split('\n').forEach((str) => {
		const [x, y, z] = str.split('x').map((str) => parseInt(str))
		const a = x * y
		const b = x * z
		const c = y * z

		result1 += (a + b + c) * 2 + Math.min(a, b, c)
		result2 += (x + y + z - Math.max(x, y, z)) * 2 + x * y * z
	})

	return [result1, result2]
}

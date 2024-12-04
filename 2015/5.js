export default (input) => {
	let result1 = 0
	let result2 = 0

	input.split('\n').forEach((str) => {
		if (/[aeiou].*[aeiou].*[aeiou]/.test(str) &&
			/(\w)\1/.test(str) &&
			!/(ab|cd|pq|xy)/.test(str)) {
			result1++
		}
		if (/(\w\w).*\1/.test(str) &&
			/(\w).\1/.test(str)) {
			result2++
		}
	})

	return [result1, result2]
}

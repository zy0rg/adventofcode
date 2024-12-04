export default (input) => {
	let result1 = 0
	let result2 = 0

	input.split('\n').forEach((str) => {
		result1 += str.length - str.replace(/\\(\\|"|x\w\w)/g, '-').length + 2
		result2 += str.replace(/["\\]/g, '++').length - str.length + 2
	})

	return [result1, result2]
}

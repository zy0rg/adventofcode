import crypto from 'crypto'

let hash = crypto.createHash('md5')

export default (input) => {
	return []
	let result1 = 1
	for (; result1 < 100000000; result1++) {
		const value = crypto.createHash('md5').update(input + result1).digest('hex')
		if (value.startsWith('00000')) {
			break
		}
	}
	let result2 = result1
	for (; result2 < 100000000; result2++) {
		const value = crypto.createHash('md5').update(input + result2).digest('hex')
		if (value.startsWith('000000')) {
			break
		}
	}
	return [result1, result2]
}

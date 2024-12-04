export default (input) => {
const parsed = input.split('\n')
const height = parsed.length
const width = parsed[0].length

let stars = 0
let range = 0
let range2 = 0
let result1 = 0
let result2 = 0

for (let y = 0; y < height; y++){
	const row = parsed[y]
	let rowStars = 0
	for (let x = 0; x < width; x++) {
		if (row[x] === '#') {
			rowStars++
		}
	}
	if (rowStars === 0) {
		range += stars
		range2 += stars * 1000000
	} else {
		result1 += range * rowStars
		result2 += range2 * rowStars
		stars += rowStars
		range2 += stars
	}
	range += stars
}

stars = 0
range = 0
range2 = 0
for (let x = 0; x < width; x++) {
	let columnStars = 0
	for (let y = 0; y < height; y++) {
		if (parsed[y][x] === '#') {
			columnStars++
		}
	}
	if (columnStars === 0) {
		range += stars
		range2 += stars * 1000000
	} else {
		result1 += range * columnStars
		result2 += range2 * columnStars
		stars += columnStars
		range2 += stars
	}
	range += stars
}

return [result1, result2]
}

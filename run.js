import {performance} from 'perf_hooks'
import {access, mkdir, readdir, readFile, unlink} from 'fs/promises'
import {createWriteStream, constants} from 'fs'
import https from 'https'

const session = '' // insert your session cookie here
const tests = 20

const download = (url, options, dest) => new Promise((resolve, reject) => {
	const file = createWriteStream(dest)
	https.get(url, options, (response) => {
		response.pipe(file)
		file.on('finish', () => file.close())
		file.on('close', resolve)
	}).on('error', (err) =>
		unlink(dest).then(() => reject(err), reject)
	)
})

const getSolution = async (year, day) => (await import(`./${year}/${day}.js`)).default

const getInput = async (year, day) => {
	const filename = `./${year}/input/${day}`
	try {
		await access(filename, constants.R_OK | constants.W_OK)
	} catch {
		await download(`https://adventofcode.com/${year}/day/${day}/input`, {
			headers: {
				Cookie: `session=${session}`
			}
		}, filename)
	}
	return (await readFile(filename, {encoding: 'utf-8'})).trimEnd()
}

const ensureDir = async (path) => {
	try {
		await access(path, constants.R_OK | constants.W_OK)
	} catch {
		await mkdir(path)
	}
}

const formatTiming = (timing) => timing.toFixed(5).padStart(10)

const execute = async (year) => {
	const dir = `./${year}`
	const inputDir = `${dir}/input`

	const [files] = await Promise.all([
		readdir(dir),
		ensureDir(inputDir)
	])

	const days = files
		.filter((fileName) => /^\d+\.js/.test(fileName))
		.map((fileName) => +fileName.substring(0, fileName.length - 3))
		.sort((a, b) => a - b)

	const tasks = await Promise.all(days.map((day) => Promise.all([
		getInput(year, day),
		getSolution(year, day)
	])))

	tasks.forEach(([input, task], i) => {
		let result
		const timings = new Float64Array(tests)
		for (let i = 0; i < tests; i++) {
			const start = performance.now()
			result = task(input)
			const end = performance.now()
			timings[i] = end - start
		}
		console.log(`${
			(days[i]).toString().padStart(2)
		}. ${
			tests === 1
				? formatTiming(timings[0])
				: `${formatTiming(Math.min(...timings))} - ${formatTiming(Math.max(...timings))}`
		} : ${
			result.join(', ')
		}`)
	})
}

execute(2022)

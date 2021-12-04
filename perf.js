import {performance} from 'perf_hooks';
import fs from 'fs/promises';

const skip = new Set([]);

const execute = async (year) => {
    const files = await fs.readdir(`./${year}`);
    const days = [];
    files.forEach((fileName) => {
        if (/^\d+\.js/.test(fileName)) {
            const day = +fileName.substring(0, fileName.length - 3);
            if (!skip.has(day)) {
                days.push(day);
            }
        }
    });
    days.sort((a, b) => a - b);
    const [input, ...tasks] = await Promise.all(['input'].concat(days).map(async (file) => (await import(`./${year}/${file}.js`)).default));

    tasks.forEach((task, i) => {
        const day = days[i];
        const inputStr = input[day - 1].trim();
        const start = performance.now();
        const result = task(inputStr);
        const end = performance.now();
        console.log(`${(day).toString().padStart(2)}: ${(end - start).toFixed(5).padStart(10)} - ${result.join(', ')}`);
    });
};

execute(2020);

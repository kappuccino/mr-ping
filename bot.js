require('dotenv').config()

const ping = require('ping')
const dayjs = require('dayjs')
const {sadd} = require('./redis')

const hosts = ['192.168.1.1', '192.168.0.1', 'google.com', 'yahoo.com']

;(async () => {
	for await (let host of hosts){
		await check(host)
	}

	process.exit()
})()

async function check(host){

	const res = await ping.promise.probe(host, {
		timeout: 10,
		extra: ['-i', '2']
	})

	const time = dayjs().format('YYYY-MM-DD HH:mm:ss')

	console.log('→', time, `"${host}"`, res.alive ? 'ALIVE' : 'DEAD', res.time)

	const value = {time, value: res.time}

	const key = `ping:${host}:${dayjs().format('YYYY-MM-DD')}`
	const val = JSON.stringify(value)

	await sadd(key, val)
}

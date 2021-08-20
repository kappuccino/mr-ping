require('dotenv').config()
const dayjs = require('dayjs')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const {mget, keys, smembers, get, del} = require('./redis')

const app = express()
const port = process.env.PORT

app.use(express.static('public'))

app.use('*', cors((req, callback) => {
	callback(null, {
		credentials: true,
		origin: req.get('origin')
	})
}))

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", req.get('origin'))
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Auth")
	res.header("Access-Control-Allow-Methods", "GET, POST, OPTION")
	res.header("X-Frame-Options", "GOFORIT");

	if ('OPTIONS' === req.method) return res.sendStatus(200)

	next()
})

app.use(morgan('tiny'))

app.get('/ping', async (req, res, next) => {


	try{
		let data = await keys('ping:*')
		data = data
			.map(v => v.substring(5)) // remove "ping:"
			.map(v => {
				const p = v.indexOf(':')
				return v.substring(0, p)
			})

		// Clean doublon
		data = Array.from(new Set([...data]))

		data = data.sort((a, z) => a > z ? 1 : -1)

		return res.json(data)
	} catch(err){
		next(err)
	}

})

app.get('/ping/:host', async (req, res, next) => {

	const prompt = `ping:${req.params.host}:`

	try{
		let data = await keys(prompt+'*')
		data = data
			.map(v => v.substring(prompt.length))
			.sort((z,a) => a.date > z.date ? 1 : -1)

		return res.json(data)
	} catch(err){
		next(err)
	}

})

app.get('/ping/:host/:date', async (req, res, next) => {

	try{
		let data = await smembers(`ping:${req.params.host}:${req.params.date}`)

		data = data
			.map(v => {
				try{
					const o = JSON.parse(v)
					const d = new Date(o.time)
					return {...o, time: d.getTime()}
				} catch(e){
					return null
				}
			})
			.filter(x => Boolean(x))
			.sort((z,a) => a.time > z.time ? 1 : -1)
			.reverse()

		return res.json(data)
	} catch(err){
		next(err)
	}

})



app.listen(port, async () => {
	console.log('App listening on port ' + port)
})

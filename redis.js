const redis = require("redis")

const client = redis.createClient({
	url: process.env.REDIS,
	return_buffers: true
})

/*
const clientBuffer = redis.createClient({
	url: process.env.REDIS,
})
*/

// if you'd like to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });

client.on("error", function (err) {
	console.log("Redis Error ", err)
})

//const date = new Date()
//client.set('last-app-start', date.toString())

function del(key) {
	return new Promise((resolve, reject) => {

		client.del(key, (err, reply) => {
			if (err) return reject(err)
			resolve(reply ? reply.toString() : null)
		})

	})
}

function mget(key) {
	return new Promise((resolve, reject) => {

		client.mget(key, (err, reply) => {
			if (err) return reject(err)
			resolve(reply ? reply.toString() : null)
		})

	})
}

function get(key) {
	return new Promise((resolve, reject) => {

		client.get(key, (err, reply) => {
			if (err) return reject(err)
			resolve(reply ? reply.toString() : null)
		})

	})
}

function getBuffer(key) {
	return new Promise((resolve, reject) => {

		client.get(key, (err, reply) => {
			if (err) return reject(err)
			resolve(reply ? reply : null)
		})

	})
}

function keys(key) {
	return new Promise((resolve, reject) => {
		client.keys(key, (err, reply) => {
			if (err) return reject(err)
			resolve(reply.map(r => r.toString()))
		})
	})
}

function smembers(key) {
	return new Promise((resolve, reject) => {

		client.smembers(key, (err, reply) => {
			if (err) return reject(err)
			resolve(reply.length ? reply.map(m => m.toString()) : [])
		})

	})
}

function set(key, value) {
	return new Promise((resolve, reject) => {
		client.set(key, value, (err, reply) => {
			if (err) return reject(err)
			resolve(reply ? reply.toString() : null)
		})
	})
}

function setex(key, ttl, value) {
	return new Promise((resolve, reject) => {
		client.setex(key, ttl, value, (err, reply) => {
			if (err) return reject(err)
			resolve(reply ? reply.toString() : null)
		})
	})
}

function setexBuffer(key, ttl, value) {
	return new Promise((resolve, reject) => {
		client.setex(key, ttl, value, (err, reply) => {
			if (err) return reject(err)
			resolve(reply || null)
		})
	})
}

function sadd(key, value) {
	return new Promise((resolve, reject) => {
		client.sadd(key, value, (err, reply) => {
			if (err) return reject(err)
			resolve(reply ? reply.toString() : null)
		})
	})
}

function srem(key, ...values) {
	return new Promise((resolve, reject) => {
		client.srem(key, ...values, (err, reply) => {
			if (err) return reject(err)
			resolve(reply ? reply.toString() : null)
		})
	})
}

function saddMulti(key, ...values) {
	return new Promise((resolve, reject) => {
		client.sadd(key, ...values, (err, reply) => {
			if (err) return reject(err)
			resolve(reply ? reply.toString() : null)
		})
	})
}

function sremMulti(key, ...values) {
	return new Promise((resolve, reject) => {
		client.srem(key, ...values, (err, reply) => {
			if (err) return reject(err)
			resolve(reply ? reply.toString() : null)
		})
	})
}



module.exports = {
	client,
	del,
	get,
	mget,
	getBuffer,
	keys,
	smembers,
	set,
	setex,
	setexBuffer,
	sadd,
	srem,
	saddMulti,
	sremMulti
}

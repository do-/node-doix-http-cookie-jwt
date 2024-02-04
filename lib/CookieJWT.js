const {CookieSession} = require ('doix-http')
const jwt             = require ('jsonwebtoken')

class CookieJWT extends CookieSession {

	constructor (o) {
	
		super (o)

		for (const k of ['claim', 'sign', 'verify']) this [k] = o [k] || {}

		this.sign.expiresIn = this.ttl + 'm'
	
	}

	async getPrivateKey () {

		return ' '

	}
	
	async getPublicKey () {

		return ' '
		
	}

	async getUserBySessionId (id) {

		try {

			return jwt.verify (id, await this.getPublicKey (), this.verify).sub

		}
		catch (err) {

			return null

		}

	}

	async getOutgoingSessionId (job) {

		return jwt.sign (

			{...this.claim, sub: job.user},
			
			await this.getPrivateKey (),
			
			this.sign
		
		)

	}

}

module.exports = CookieJWT
const http = require ('http')
const {HttpRouter} = require ('doix-http')
const {Writable} = require ('stream')
const winston = require ('winston')
const logger = winston.createLogger({
	transports: [
//	  new winston.transports.Console (),
	  new winston.transports.Stream ({stream: new Writable ({write(){}})})
	]
})

let port = 8010

module.exports = {

	getResponse: async function (o) {

		if (!o.listen) o.listen = {}
		if (!o.listen.host) o.listen.host = '127.0.0.1'
		if (!o.listen.port) o.listen.port = ++ port

		if (!o.requestOptions) o.requestOptions = {}
		if (o.requestOptions.body == null) o.requestOptions.body = ''

		const {listen, service, path, requestOptions} = o

		try {

			var r = new HttpRouter ({name: 'httpEndPoint', listen, logger})
			
			for (const s of Array.isArray (service) ? service : [service]) r.add (s)

			r.listen ()

			const rp = await new Promise ((ok, fail) => {

				const rq = http.request (`http://${listen.host}:${listen.port}${path}`, requestOptions, ok)

				rq.end (requestOptions.body)

			})

			const a = []; for await (b of rp) a.push (b)

			rp.responseText = Buffer.concat (a).toString ()
			
			if (rp.headers ['content-type'] === 'application/json; charset=utf-8') rp.responseJson = JSON.parse (rp.responseText)

			return rp

		}
		catch (x) {

			console.log (x)

		}
		finally {

			await r.close ()

		}

	}

}
const Application = require ('./lib/Application.js')
const {getResponse} = require ('./lib/MockServer.js')
const {CookieJWT} = require ('..')
const jwt = require ('jsonwebtoken')
 
const newApp = () => {

	jest.resetModules ()

	return a = new Application ()

}

const newSvc = app => {

	const svc = app.createBackService ()

	new CookieJWT ({ttl: 10}).plugInto (svc)

	return svc

}

async function getResponseFromWebService (svc, path, requestOptions, port) {

	return getResponse ({service: [svc], path, requestOptions, listen: {port}})

}

test ('auth', async () => {

	const app = newApp (), svc = newSvc (app)

	const rp = await getResponseFromWebService (svc, '/?type=sessions&action=create', {method: 'POST', body: '{}'}, 8021)

	const cookie = rp.headers ['set-cookie'] [0], sid = cookie.slice (4, cookie.indexOf (';'))

	const content = jwt.verify (sid, ' ')

	expect (content.sub.id).toBe (1)

	const rp1 = await getResponseFromWebService (svc, '/?type=users&part=current', {method: 'POST', body: '{}', headers: {Cookie: `sid=${sid}`}}, 8022)

	expect (rp1.responseJson.content.id).toBe (1)
	
	const rp2 = await getResponseFromWebService (svc, '/?type=sessions&action=delete', {method: 'POST', body: '{}', headers: {Cookie: `sid=${sid}`}}, 8023)

	expect (rp2.headers ['set-cookie'] [0]).toMatch ('sid=;')

})
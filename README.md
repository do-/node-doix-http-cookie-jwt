![workflow](https://github.com/do-/node-doix-http-cookie-jwt/actions/workflows/main.yml/badge.svg)
![Jest coverage](./badges/coverage-jest%20coverage.svg)


`node-doix-http-cookie-jwt` is a plug in for the [`doix`](https://github.com/do-/node-doix) framework providing an HTTP cookie based session mechanism using [JSON Web Tokens](https://jwt.io/).

Here, the whole user information record (seen as `this.user` in each [Job](https://github.com/do-/node-doix/wiki/Job) instance) is completely included in the cookie value as the `sub` property of the JSON Web Token's `claim`.

# Installation
```
npm install doix-http-cookie-jwt
```
# Usage
Upon instantiating your [WebService](https://github.com/do-/node-doix-http/wiki/WebService) descendant as `myWebService`:

```js
const {CookieJWT} = require ('doix-http-cookie-jwt')

const sessionProvider = new CookieJWT ({
  //  name: 'sid',
  //  ttl: 60,
  //  claim: {},
  //  sign: {},
  //  verify: {},
})

// sessionProvider.getPrivateKey = async () => {...}
// sessionProvider.getPublicKey  = async () => {...}

sessionProvider.plugInto (myWebService)
```

# Options
| Name | Type | Default | Description | Note
| ---- | -- | -- | -- | -- |
| `name` | String | `'sid'` | name of the cookie |
| `ttl` | int | 60 | time to live, in minutes | multiplied by 60, passed to the Redis [set](https://redis.io/commands/set/) command as the `EX` option
| `claim` | Object | `{}` | the claim part of the JWT | the `sub` property is always overridden with the user info
| `sign` | Object | `{}` | options for [sign ()](https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback) | 
| `verify` | Object | `{}` | options for [verify ()](https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback) | 

# Methods
| Name | Description | Default implementation
| ---- | -- | -- 
| `getPrivateKey ()` | returns the private key for using with [sign ()](https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback) | `' '`
| `getPublicKey ()` | returns the public key for using with [verify ()](https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback) | `' '`

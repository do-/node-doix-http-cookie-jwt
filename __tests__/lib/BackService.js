const {WebService} = require ('doix-http')

module.exports = class extends WebService {

	constructor (app, o) {
		
	    super (app, {
	    
			name: 'webBackEnd',

			methods: ['POST'],

			on: {

				error : function (error) {

					if (typeof error === 'string') error = Error (error)
					
					while (error.cause) error = error.cause
					
					this.error = error

				},

			},


			stringify: content => {
			
				return JSON.stringify ({
					success: true, 
					content, 
				})
				
			},
		
			...o

	    })

	}

}
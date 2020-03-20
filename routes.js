const routes = module.exports = require('next-routes')()
 
routes
.add('index')
.add('channel', '/:slug.:id', 'channel')
.add('potcast', '/:slugChannel.:idChannel/:slug.:id', 'potcast')
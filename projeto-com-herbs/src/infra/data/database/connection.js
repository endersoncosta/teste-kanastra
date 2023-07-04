const knex = require('knex')
const config = require('../../config')

module.exports = knex(config.database)
module.exports.chunkSize = config.database.chunkSize
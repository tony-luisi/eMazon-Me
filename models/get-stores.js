'use strict'

var Knex = require('knex')
var knexConfig = require('../knexfile')

var knex = Knex(knexConfig[process.env.NODE_ENV || 'development'])

module.exports = () => knex.select().table('stores')
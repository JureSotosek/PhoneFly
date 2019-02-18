const { makeBindingClass } = require('graphql-binding')
const schema = require('./schema.graphql')

module.exports = makeBindingClass({ schema })
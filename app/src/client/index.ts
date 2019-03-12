import preval from 'preval.macro'
import { makeBindingClass } from 'graphql-binding'
import { makeExecutableSchema } from 'graphql-tools'
import { BindingConstructor, Binding } from './binding'

const typeDefs = preval`
  const fs = require("fs");
  const path = require("path");
  module.exports = fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8");
`

const schema = makeExecutableSchema({ typeDefs })

export default makeBindingClass<BindingConstructor<Binding>>({
  schema,
})

import preval from 'preval.macro'

const typeDefs = preval`
  const fs = require("fs");
  const path = require("path");
  module.exports = fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8");
`

export default typeDefs

// THIS IS NOT THE PRIMARY WEBPACK CONFIG
// This webpack config is here just so it bundles all of the outputs
// of the `build` command in to one file. This is needed becuase FBInstant
// games dont allow loading of files after inital load, see:
// https://github.com/facebook/create-react-app/issues/3365#issuecomment-376546407

const path = require('path')
const glob = require('glob')

module.exports = {
  entry: {
    'bundle.js': glob
      .sync('build/static/?(js|css)/*.?(js|css)')
      .map(f => path.resolve(__dirname, f)),
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: 'public',
  },
}

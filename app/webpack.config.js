module.exports = {
  entry: ['./src/index.tsx'],
  module: {
    rules: [
      {
        test: /\.(jsx?|tsx?)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
    ],
  },
  resolve: {
    extensions: ['*', '.mjs', '.js', '.jsx', '.ts', '.tsx', '.d.ts'],
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js',
  },
  node: {
    fs: 'empty',
    module: 'empty',
  },
}

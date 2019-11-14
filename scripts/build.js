// Custom build script is here to prevent code splitting
// of the `build` command. This is needed becuase FBInstant
// games dont allow loading of files after inital load, see:
// https://github.com/facebook/create-react-app/issues/5306#issuecomment-433425838

const rewire = require('rewire');
const defaults = rewire('react-scripts/scripts/build.js');
let config = defaults.__get__('config');

config.optimization.splitChunks = {
    cacheGroups: {
        default: false,
    },
};

config.optimization.runtimeChunk = false;
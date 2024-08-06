const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
    // Other configuration...
    plugins: [
        new NodePolyfillPlugin(),
    ],
    resolve: {
        fallback: {
            "buffer": require.resolve("buffer/"),
            // Add other fallbacks here if needed
        },
    },
};

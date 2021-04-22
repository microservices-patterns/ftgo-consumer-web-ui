// babel.config.js
console.log('babel.config.js');

module.exports = {
  presets: [
    [ '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    // https://github.com/testing-library/react-testing-library/issues/810
    ['@babel/preset-react', {
      "runtime": "automatic"
    }]
  ],
  plugins: [
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-class-properties',
//    '@babel/plugin-syntax-jsx'
  ],
  "env": {
    "test": {
      "plugins": ["@babel/plugin-transform-modules-commonjs"]
    },
    "development": {
      "plugins": ["@babel/plugin-transform-modules-commonjs"]
    }
  },
};

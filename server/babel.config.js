// babel.config.js
console.log('babel.config.js');

module.exports = {
  presets: [
    [ '@babel/preset-env',
      {
        'useBuiltIns': 'usage', // 'usage', // alternative mode: "entry"
        'corejs': '3.15',
        'targets': {
          'node': 'current'
        },
        'shippedProposals': true,
        'modules': 'auto',
        debug: true,
      },
    ],

  ],
//  plugins: [
//    // https://babeljs.io/docs/en/babel-plugin-transform-runtime#docsNav
//    [
//      '@babel/plugin-transform-runtime',
//      {
//        'regenerator': true,
//      }
//    ],
////    '@babel/plugin-transform-modules-commonjs',
//    '@babel/plugin-proposal-export-namespace-from',
//    '@babel/plugin-proposal-class-properties',
//    //    '@babel/plugin-syntax-jsx'
//  ]
};

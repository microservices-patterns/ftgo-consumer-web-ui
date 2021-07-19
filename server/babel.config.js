// babel.config.js
console.log('babel.config.js');

module.exports =
//export default
{
  presets: [
    [ '@babel/preset-env',
      {
        'useBuiltIns': 'entry', // 'usage', // alternative mode: "entry"
        'debug': true,
        'corejs': '3.15',
        'targets': {
          'node': '12.22.1'
        },
        'shippedProposals': true,
        'modules': 'auto',
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

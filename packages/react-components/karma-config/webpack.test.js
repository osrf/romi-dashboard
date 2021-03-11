'use strict';

const path = require('path');
const webpack = require('webpack');
// Helper functions
const ROOT = path.resolve(__dirname, '..');

function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [ROOT].concat(args));
}

const coverageLoader = {
  enforce: 'post',
  test: /\.(ts|tsx)$/,
  loader: 'istanbul-instrumenter-loader',
  include: root('lib'),
  exclude: [/\.(e2e|spec|d|stories)\.ts$/, /node_modules/],
  // esModules Set to true to instrument ES2015 Modules
  options: {
    esModules: true,
  },
};

/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = (options) => {
  const moduleRules = [
    /**
     * Typescript loader support for .ts
     * See: https://github.com/s-panferov/awesome-typescript-loader
     */
    {
      test: /\.(tsx|ts)$/,
      loader: 'awesome-typescript-loader',
      options: {
        // use inline sourcemaps for "karma-remap-coverage" reporter
        sourceMap: false,
        inlineSourceMap: true,
        compilerOptions: {
          removeComments: true,
        },
        declaration: false,
      },
      exclude: [/\.e2e\.ts$/],
    },
    {
      test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
      use: [
        {
          loader: 'file-loader',
        },
      ],
    },
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    },
  ];

  if (options.coverage) {
    moduleRules.push(coverageLoader);
  }

  return {
    mode: options.env,

    /**
     * Options affecting the resolving of modules.
     * See: http://webpack.github.io/docs/configuration.html#resolve
     */
    resolve: {
      /**
       * An array of extensions that should be used to resolve modules.
       * See: http://webpack.github.io/docs/configuration.html#resolve-extensions
       */
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],

      /**
       * Make sure root is src
       */
      modules: [path.resolve(__dirname, 'lib'), 'node_modules'],
    },

    /**
     * Options affecting the normal modules.
     * See: http://webpack.github.io/docs/configuration.html#module
     */
    module: {
      rules: moduleRules,
    },

    /**
     * Include polyfills or mocks for various node stuff
     * Description: Node configuration
     *
     * See: https://webpack.github.io/docs/configuration.html#node
     */
    node: {
      global: true,
    },

    // https://stackoverflow.com/questions/65018431/webpack-5-uncaught-referenceerror-process-is-not-defined
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
    ],

    externals: {
      jsdom: 'window',
      cheerio: 'window',
      'react/lib/ExecutionEnvironment': 'true',
      'react/addons': 'true',
      'react/lib/ReactContext': 'window',
    },
  };
};

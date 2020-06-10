const path = require("path");
const webpack = require("webpack");
const VueLoader = require("vue-loader");

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    // This is where the `main-content` component is
    app: "./dystill-web/resources/js/app.js",
    fonts: "./dystill-web/resources/js/fonts.js"
  },
  output: {
    filename: "[name].js",
    chunkFilename: "[name].bundle.js",
    // Folder where the output of webpack's result go.
    path: __dirname + "/build/public/js/",
    publicPath: "/js/"
  },
  module: {
    rules: [
      {
        // vue-loader config to load `.vue` files or single file components.
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          plugins: ["@babel/plugin-syntax-dynamic-import"],
          loaders: {
            // https://vue-loader.vuejs.org/guide/scoped-css.html#mixing-local-and-global-styles
            css: [
              "vue-style-loader",
              {
                loader: "css-loader"
              }
            ],
            js: ["babel-loader"]
          },
          cacheBusting: true
        }
      },
      {
        // This is required for other javascript you are gonna write besides vue.
        test: /\.js$/,
        loader: "babel-loader",
        options: {
          plugins: [
            "@babel/plugin-syntax-dynamic-import",
            [
              "root-import",
              {
                rootPathPrefix: "~/",
                rootPathSuffix: "./dystill-web/resources/js/"
              }
            ]
          ]
        }
      },
      {
        test: /\.scss$/,
        use: [
          "vue-style-loader",
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                includePaths: ["./tmp", "./src/resources/assets/sass"]
              }
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"]
      },
      {
        test: /\.(svg|eot|woff|woff2|ttf)$/,
        use: ['file-loader']
      }
    ]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    // Exchanges, adds, or removes modules while an application is running, without a full reload.
    new webpack.HotModuleReplacementPlugin(),
    new VueLoader.VueLoaderPlugin()
  ],
  resolve: {
    /**
     * The compiler-included build of vue which allows to use vue templates
     * without pre-compiling them
     */
    alias: {
      vue$: "vue/dist/vue.esm.js"
    },
    extensions: ["*", ".vue", ".js", ".json"]
  },
  // webpack outputs performance related stuff in the browser.
  performance: {
    hints: false
  }
};

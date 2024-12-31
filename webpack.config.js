import { dirname, resolve as _resolve, join } from 'path';
import { fileURLToPath } from 'url';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the package name and version from the environment variable
const libraryName = process.env.npm_package_name;
const libraryVersion = process.env.npm_package_version;

const mode = process.argv.includes('--mode=production') ? 'production' : 'development';

export default {
  mode: mode,
  resolve: {
    alias: {
      '@assets': _resolve(__dirname, 'src/assets'),
      '@components': _resolve(__dirname, 'src/scripts/components'),
      '@mixins': _resolve(__dirname, 'src/scripts/mixins'),
      '@models': _resolve(__dirname, 'src/scripts/models'),
      '@root': _resolve(__dirname, './'),
      '@scripts': _resolve(__dirname, 'src/scripts'),
      '@services': _resolve(__dirname, 'src/scripts/services'),
      '@styles': _resolve(__dirname, 'src/styles')
    }
  },
  optimization: {
    minimize: mode === 'production',
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: mode === 'production',
          }
        }
      }),
      new CssMinimizerPlugin()
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `${libraryName}-${libraryVersion}.css` // Output CSS filename
    })
  ],
  entry: {
    main: '@scripts/main.js',
  },
  output: {
    filename: `${libraryName}-${libraryVersion}.js`,
    path: _resolve(__dirname, 'dist'),
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.(svg|jpg|png)$/,
        include: join(__dirname, 'src/assets'),
        type: 'asset/resource'
      },
      {
        test: /\.woff$/,
        include: join(__dirname, 'src/assets'),
        type: 'asset/resource'
      }
    ]
  },
  stats: {
    colors: true // Enable colored console output
  },
  ...(mode !== 'production' && { devtool: 'eval-cheap-module-source-map' })
};

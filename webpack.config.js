/** webpack 扩展 */

module.exports = function(webpackConfig) {

   webpackConfig.module.noParse = /moment.js/ ;

  return webpackConfig;
};

/**
 * Module dependencies.
 */

var convert = require('convert-source-map');
var extend = require('extend');
var debug = require('debug')('duo-uglify');
var Uglify = require('uglify-js');

/**
 * Returns an uglify _alternate_ plugin (operates on the entire build for a JS
 * entry file)
 *
 * @param {Object} o
 * @returns {Function}
 */

module.exports = function (o) {
  debug('initializing', o);

  return alternate(function uglify(build, entry) {
    if (entry.type !== 'js') return;

    var results = minify(entry.duo.sourceMap(), build);

    build.code = results.code;
    build.map = results.map;
  });

  function minify(sourceMap, build) {
    if (!sourceMap)                  return none(build);
    else if (sourceMap === 'inline') return inline(build);
    else                             return external(build);
  }

  function none(build) {
    debug('no source-map');
    return Uglify.minify(build.code, extend({ fromString: true }, o));
  }

  function inline(build) {
    debug('inline source-map');
    var src = convert.removeComments(build.code);
    var map = convert.fromSource(build.code).toObject();

    var results = Uglify.minify(src, extend({
      fromString: true,
      inSourceMap: map,
      outSourceMap: 'inline'
    }, o));

    // restore the correct source map comment
    results.code = convert.removeMapFileComments(results.code);
    results.code += '\n' + convert.fromJSON(results.map).toComment();
    delete results.map;
    return results;
  }

  function external(build) {
    debug('external source-map');
    var src = build.code;
    var map = convert.fromJSON(build.map).toObject();

    return Uglify.minify(src, extend({
      fromString: true,
      inSourceMap: map,
      outSourceMap: src.match(convert.mapFileCommentRegex).pop()
    }, o));
  }
};

function alternate(fn) {
  fn.alternate = true;
  return fn;
}

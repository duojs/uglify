/* eslint-disable camelcase */

/**
 * Module dependencies.
 */

var assert = require('assert');
var Duo = require('duo');
var uglify = require('..');

/**
 * Tests.
 */

describe('duo-uglify', function () {
  it('should compress js files', function (done) {
    build('simple').run(function (err, results) {
      if (err) return done(err);
      assert.equal(results.code.indexOf('\n'), -1); // 1 line
      done();
    });
  });

  it('should proxy additional options', function (done) {
    var options = { compress: { drop_debugger: false } };
    build('options', options).run(function (err, results) {
      if (err) return done(err);
      assert(results.code.indexOf('debugger;') > -1);
      done();
    });
  });

  it('should automatically detect inline source-maps', function (done) {
    build('simple').sourceMap('inline').run(function (err, results) {
      if (err) return done(err);
      assert(results.code.indexOf('//# sourceMappingURL=data') > -1);
      assert(!results.map);
      done();
    });
  });

  it('should automatically detect external source-maps', function (done) {
    build('simple').sourceMap(true).run(function (err, results) {
      if (err) return done(err);
      assert.equal(results.code.indexOf('//# sourceMappingURL=data'), -1);
      assert(results.map);
      done();
    });
  });
});

/**
 * Returns a duo builder for the given fixture.
 *
 * @param {String} fixture    The name of fixture (w/o fixtures/ or .js)
 * @param {Object} [options]  Options for the uglify plugin
 * @returns {Duo}
 */

function build(fixture, options) {
  return Duo(__dirname)
    .cache(false)
    .entry('fixtures/' + fixture + '.js')
    .use(uglify(options));
}

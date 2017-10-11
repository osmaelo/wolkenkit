'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var shell = require('../shell');

var installPackage = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(packageName, version) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (packageName) {
              _context.next = 2;
              break;
            }

            throw new Error('Name is missing.');

          case 2:
            if (version) {
              _context.next = 4;
              break;
            }

            throw new Error('Version is missing.');

          case 4:
            _context.next = 6;
            return shell.exec('npm install -g ' + packageName + '@' + version, { silent: true });

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function installPackage(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = installPackage;
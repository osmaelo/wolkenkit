'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var buntstift = require('buntstift'),
    getUsage = require('command-line-usage'),
    processenv = require('processenv');

var defaults = require('../defaults.json'),
    globalOptionDefinitions = require('../globalOptionDefinitions'),
    showProgress = require('../showProgress'),
    wolkenkit = require('../../wolkenkit');

var install = {
  description: 'List installed wolkenkit versions.',

  getOptionDefinitions: function getOptionDefinitions() {
    var _this = this;

    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt('return', [{
                name: 'env',
                alias: 'e',
                type: String,
                defaultValue: processenv('WOLKENKIT_ENV') || defaults.env,
                description: 'select environment',
                typeLabel: '<env>'
              }]);

            case 1:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this);
    }))();
  },
  run: function run(options) {
    var _this2 = this;

    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var directory, env, help, verbose, stopWaiting;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (options) {
                _context2.next = 2;
                break;
              }

              throw new Error('Options are missing.');

            case 2:
              if (options.env) {
                _context2.next = 4;
                break;
              }

              throw new Error('Environment is missing.');

            case 4:
              directory = process.cwd(), env = options.env, help = options.help, verbose = options.verbose;

              if (!help) {
                _context2.next = 23;
                break;
              }

              _context2.t0 = buntstift;
              _context2.t1 = getUsage;
              _context2.t2 = { header: 'wolkenkit ls', content: _this2.description };
              _context2.t3 = { header: 'Synopsis', content: 'wolkenkit ls [--env <env>]' };
              _context2.t4 = [];
              _context2.t5 = _toConsumableArray;
              _context2.next = 14;
              return _this2.getOptionDefinitions();

            case 14:
              _context2.t6 = _context2.sent;
              _context2.t7 = (0, _context2.t5)(_context2.t6);
              _context2.t8 = _toConsumableArray(globalOptionDefinitions);
              _context2.t9 = _context2.t4.concat.call(_context2.t4, _context2.t7, _context2.t8);
              _context2.t10 = {
                header: 'Options',
                optionList: _context2.t9
              };
              _context2.t11 = { header: 'Remarks',
                content: ['If you don\'t specify an environment, \'' + (processenv('WOLKENKIT_ENV') || defaults.env) + '\' will be used as default.']
              };
              _context2.t12 = [_context2.t2, _context2.t3, _context2.t10, _context2.t11];
              _context2.t13 = (0, _context2.t1)(_context2.t12);
              return _context2.abrupt('return', _context2.t0.info.call(_context2.t0, _context2.t13));

            case 23:
              stopWaiting = buntstift.wait();
              _context2.prev = 24;
              _context2.next = 27;
              return wolkenkit.ls({ directory: directory, env: env }, showProgress(verbose, stopWaiting));

            case 27:
              _context2.next = 34;
              break;

            case 29:
              _context2.prev = 29;
              _context2.t14 = _context2['catch'](24);

              stopWaiting();
              buntstift.error('Failed to list installed wolkenkit versions.');

              throw _context2.t14;

            case 34:

              stopWaiting();

            case 35:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, _this2, [[24, 29]]);
    }))();
  }
};

module.exports = install;
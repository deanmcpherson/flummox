/**
 * fluxMixin
 *
 * Exports a function that creates a React component mixin. Implements methods
 * from reactComponentMethods.
 *
 * Any arguments passed to the mixin creator are passed to `connectToStores()`
 * and used as the return value of `getInitialState()`. This lets you handle
 * all of the state initialization and updates in a single place, while removing
 * the burden of manually adding and removing store listeners.
 *
 * @example
 * let Component = React.createClass({
 *   mixins: [fluxMixin({
 *     storeA: store => ({
 *       foo: store.state.a,
 *     }),
 *     storeB: store => ({
 *       bar: store.state.b,
 *     })
 *   }]
 * });
 */

'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Flux = require('../Flux');

var _reactComponentMethods = require('./reactComponentMethods');

var _reactComponentMethods2 = _interopRequireDefault(_reactComponentMethods);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

exports['default'] = function (React) {
  var _createReactComponentMethods = (0, _reactComponentMethods2['default'])(React);

  var instanceMethods = _createReactComponentMethods.instanceMethods;
  var staticProperties = _createReactComponentMethods.staticProperties;

  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    function getInitialState() {
      this.initialize();
      return this.connectToStores.apply(this, args);
    }

    return (0, _objectAssign2['default'])({ getInitialState: getInitialState }, instanceMethods, staticProperties);
  };
};

module.exports = exports['default'];
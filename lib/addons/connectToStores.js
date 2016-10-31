/**
 * Higher-order component form of connectToStores
 */

'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _reactComponentMethods = require('./reactComponentMethods');

var _reactComponentMethods2 = _interopRequireDefault(_reactComponentMethods);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

exports['default'] = function (React) {
  var _createReactComponentMethods = (0, _reactComponentMethods2['default'])(React);

  var instanceMethods = _createReactComponentMethods.instanceMethods;
  var staticProperties = _createReactComponentMethods.staticProperties;

  return function (BaseComponent, stores, stateGetter) {
    var ConnectedComponent = (function (_React$Component) {
      var _class = function ConnectedComponent(props, context) {
        _classCallCheck(this, _class);

        _React$Component.call(this, props, context);

        this.initialize();

        this.state = this.connectToStores(stores, stateGetter);
      };

      _inherits(_class, _React$Component);

      _class.prototype.render = function render() {
        return React.createElement(BaseComponent, _extends({}, this.state, this.props));
      };

      return _class;
    })(React.Component);

    (0, _objectAssign2['default'])(ConnectedComponent.prototype, instanceMethods);

    (0, _objectAssign2['default'])(ConnectedComponent, staticProperties);

    return ConnectedComponent;
  };
};

module.exports = exports['default'];
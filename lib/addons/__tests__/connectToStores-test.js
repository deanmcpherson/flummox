'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('../react');

var _addContext = require('./addContext');

var _addContext2 = _interopRequireDefault(_addContext);

var _Flux = require('../../Flux');

var _reactAddons = require('react/addons');

var _reactAddons2 = _interopRequireDefault(_reactAddons);

var PropTypes = _reactAddons2['default'].PropTypes;
var TestUtils = _reactAddons2['default'].addons.TestUtils;

var TestActions = (function (_Actions) {
  function TestActions() {
    _classCallCheck(this, TestActions);

    if (_Actions != null) {
      _Actions.apply(this, arguments);
    }
  }

  _inherits(TestActions, _Actions);

  TestActions.prototype.getSomething = function getSomething(something) {
    return something;
  };

  return TestActions;
})(_Flux.Actions);

var TestStore = (function (_Store) {
  function TestStore(flux) {
    _classCallCheck(this, TestStore);

    _Store.call(this);

    var testActions = flux.getActions('test');
    this.register(testActions.getSomething, this.handleGetSomething);

    this.state = {
      something: null
    };
  }

  _inherits(TestStore, _Store);

  TestStore.prototype.handleGetSomething = function handleGetSomething(something) {
    this.setState({ something: something });
  };

  return TestStore;
})(_Flux.Store);

var Flux = (function (_Flummox) {
  function Flux() {
    _classCallCheck(this, Flux);

    _Flummox.call(this);

    this.createActions('test', TestActions);
    this.createStore('test', TestStore, this);
  }

  _inherits(Flux, _Flummox);

  return Flux;
})(_Flux.Flummox);

describe('connectToStores (HoC)', function () {
  it('gets Flux from either props or context', function () {
    var flux = new Flux();
    var contextComponent = undefined,
        propsComponent = undefined;

    var BaseComponent = (function (_React$Component) {
      function BaseComponent() {
        _classCallCheck(this, BaseComponent);

        if (_React$Component != null) {
          _React$Component.apply(this, arguments);
        }
      }

      _inherits(BaseComponent, _React$Component);

      BaseComponent.prototype.render = function render() {
        return _reactAddons2['default'].createElement('div', null);
      };

      return BaseComponent;
    })(_reactAddons2['default'].Component);

    var ConnectedComponent = (0, _react.connectToStores)(BaseComponent, 'test');

    var ContextComponent = (0, _addContext2['default'])(ConnectedComponent, { flux: flux }, { flux: _reactAddons2['default'].PropTypes.instanceOf(_Flux.Flummox) });

    var tree = TestUtils.renderIntoDocument(_reactAddons2['default'].createElement(ContextComponent, null));

    contextComponent = TestUtils.findRenderedComponentWithType(tree, ConnectedComponent);

    propsComponent = TestUtils.renderIntoDocument(_reactAddons2['default'].createElement(ConnectedComponent, { flux: flux }));

    expect(contextComponent.flux).to.be.an['instanceof'](_Flux.Flummox);
    expect(propsComponent.flux).to.be.an['instanceof'](_Flux.Flummox);
  });

  it('transfers props', function () {
    var flux = new Flux();

    var BaseComponent = (function (_React$Component2) {
      function BaseComponent() {
        _classCallCheck(this, BaseComponent);

        if (_React$Component2 != null) {
          _React$Component2.apply(this, arguments);
        }
      }

      _inherits(BaseComponent, _React$Component2);

      BaseComponent.prototype.render = function render() {
        return _reactAddons2['default'].createElement('div', null);
      };

      return BaseComponent;
    })(_reactAddons2['default'].Component);

    var ConnectedComponent = (0, _react.connectToStores)(BaseComponent, 'test');

    var tree = TestUtils.renderIntoDocument(_reactAddons2['default'].createElement(ConnectedComponent, { flux: flux, foo: 'bar', bar: 'baz' }));

    var component = TestUtils.findRenderedComponentWithType(tree, BaseComponent);

    expect(component.props.foo).to.equal('bar');
    expect(component.props.bar).to.equal('baz');
  });

  it('syncs with store after state change', function () {
    var flux = new Flux();

    var BaseComponent = (function (_React$Component3) {
      function BaseComponent() {
        _classCallCheck(this, BaseComponent);

        if (_React$Component3 != null) {
          _React$Component3.apply(this, arguments);
        }
      }

      _inherits(BaseComponent, _React$Component3);

      BaseComponent.prototype.render = function render() {
        return _reactAddons2['default'].createElement('div', null);
      };

      return BaseComponent;
    })(_reactAddons2['default'].Component);

    var ConnectedComponent = (0, _react.connectToStores)(BaseComponent, 'test');

    var tree = TestUtils.renderIntoDocument(_reactAddons2['default'].createElement(ConnectedComponent, { flux: flux }));

    var component = TestUtils.findRenderedComponentWithType(tree, BaseComponent);

    var getSomething = flux.getActions('test').getSomething;

    expect(component.props.something).to.be['null'];

    getSomething('do');

    expect(component.props.something).to.equal('do');

    getSomething('re');

    expect(component.props.something).to.equal('re');
  });
});
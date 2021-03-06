'use strict';

var _this = this;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _Flux = require('../Flux');

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

function createSerializableStore(serializedState) {
  return (function (_Store) {
    function SerializableStore() {
      _classCallCheck(this, SerializableStore);

      if (_Store != null) {
        _Store.apply(this, arguments);
      }
    }

    _inherits(SerializableStore, _Store);

    SerializableStore.serialize = function serialize() {
      return serializedState;
    };

    SerializableStore.deserialize = function deserialize(stateString) {
      return {
        stateString: stateString,
        deserialized: true
      };
    };

    return SerializableStore;
  })(_Flux.Store);
}

describe('Flux', function () {

  describe('#createStore()', function () {
    it('throws if key already exists', function () {
      var flux = new _Flux.Flux();

      var TestStore = (function (_Store2) {
        function TestStore() {
          _classCallCheck(this, TestStore);

          if (_Store2 != null) {
            _Store2.apply(this, arguments);
          }
        }

        _inherits(TestStore, _Store2);

        return TestStore;
      })(_Flux.Store);

      flux.createStore('ExampleStore', TestStore);
      expect(flux.createStore.bind(flux, 'ExampleStore', TestStore)).to['throw']('You\'ve attempted to create multiple stores with key ExampleStore. ' + 'Keys must be unique.');
    });

    it('throws if Store is not a prototype of class', function () {
      var flux = new _Flux.Flux();

      var ForgotToExtendStore = function ForgotToExtendStore() {
        _classCallCheck(this, ForgotToExtendStore);
      };

      expect(flux.createStore.bind(flux, 'Flux', ForgotToExtendStore)).to['throw']('You\'ve attempted to create a store from the class ' + 'ForgotToExtendStore, which does not have the base Store class in its ' + 'prototype chain. Make sure you\'re using the `extends` keyword: ' + '`class ForgotToExtendStore extends Store { ... }`');
    });

    it('registers store\'s handler with central dispatcher', function () {
      var ExampleStore = (function (_Store3) {
        function ExampleStore() {
          _classCallCheck(this, ExampleStore);

          if (_Store3 != null) {
            _Store3.apply(this, arguments);
          }
        }

        _inherits(ExampleStore, _Store3);

        return ExampleStore;
      })(_Flux.Store);

      var spy1 = _sinon2['default'].spy();
      var spy2 = _sinon2['default'].spy();

      ExampleStore.prototype.foo = 'bar';
      ExampleStore.prototype.handler = function (_payload) {
        spy1(_payload);
        spy2(this.foo);
      };

      var flux = new _Flux.Flux();
      flux.createStore('ExampleStore', ExampleStore);

      var payload = 'foobar';
      flux.dispatch('actionId', payload);
      expect(spy1.getCall(0).args[0].body).to.equal('foobar');
      expect(spy2.calledWith('bar')).to.be['true'];
    });

    it('returns the created store instance', function () {
      var ExampleStore = (function (_Store4) {
        function ExampleStore() {
          _classCallCheck(this, ExampleStore);

          if (_Store4 != null) {
            _Store4.apply(this, arguments);
          }
        }

        _inherits(ExampleStore, _Store4);

        return ExampleStore;
      })(_Flux.Store);

      var flux = new _Flux.Flux();
      var store = flux.createStore('ExampleStore', ExampleStore);
      expect(store).to.be.an.instanceOf(ExampleStore);
    });
  });

  describe('#getStore()', function () {
    it('retrieves store for key', function () {
      var flux = new _Flux.Flux();

      var TestStore = (function (_Store5) {
        function TestStore() {
          _classCallCheck(this, TestStore);

          if (_Store5 != null) {
            _Store5.apply(this, arguments);
          }
        }

        _inherits(TestStore, _Store5);

        return TestStore;
      })(_Flux.Store);

      flux.createStore('ExampleStore', TestStore);
      expect(flux.getStore('ExampleStore')).to.be.an.instanceOf(_Flux.Store);
      expect(flux.getStore('NonexistentStore')).to.be.undefined;
    });
  });

  describe('#removeStore()', function () {
    it('throws if key does not exist', function () {
      var flux = new _Flux.Flux();

      var TestStore = (function (_Store6) {
        function TestStore() {
          _classCallCheck(this, TestStore);

          if (_Store6 != null) {
            _Store6.apply(this, arguments);
          }
        }

        _inherits(TestStore, _Store6);

        return TestStore;
      })(_Flux.Store);

      flux.createStore('ExampleStore', TestStore);
      expect(flux.removeStore.bind(flux, 'NonexistentStore')).to['throw']('You\'ve attempted to remove store with key NonexistentStore which does not exist.');
    });

    it('deletes store instance', function () {
      var flux = new _Flux.Flux();

      var TestStore = (function (_Store7) {
        function TestStore() {
          _classCallCheck(this, TestStore);

          if (_Store7 != null) {
            _Store7.apply(this, arguments);
          }
        }

        _inherits(TestStore, _Store7);

        return TestStore;
      })(_Flux.Store);

      var store = flux.createStore('ExampleStore', TestStore);
      expect(flux.dispatcher.$Dispatcher_callbacks[store._token]).to.be['function'];
      flux.removeStore('ExampleStore');
      expect(flux._stores.ExampleStore).to.be.undefined;
      expect(flux.dispatcher.$Dispatcher_callbacks[store._token]).to.be.undefined;
    });
  });

  describe('#createActions()', function () {
    it('throws if key already exists', function () {
      var TestActions = (function (_Actions) {
        function TestActions() {
          _classCallCheck(this, TestActions);

          if (_Actions != null) {
            _Actions.apply(this, arguments);
          }
        }

        _inherits(TestActions, _Actions);

        return TestActions;
      })(_Flux.Actions);

      var flux = new _Flux.Flux();
      flux.createActions('ExampleActions', TestActions);

      expect(flux.createActions.bind(flux, 'ExampleActions', _Flux.Actions)).to['throw']('You\'ve attempted to create multiple actions with key ExampleActions. ' + 'Keys must be unique.');
    });

    it('throws if Actions is a class without base Actions class in its prototype chain', function () {
      var flux = new _Flux.Flux();

      var ForgotToExtendActions = function ForgotToExtendActions() {
        _classCallCheck(this, ForgotToExtendActions);
      };

      expect(flux.createActions.bind(flux, 'Flux', ForgotToExtendActions)).to['throw']('You\'ve attempted to create actions from the class ' + 'ForgotToExtendActions, which does not have the base Actions class ' + 'in its prototype chain. Make sure you\'re using the `extends` ' + 'keyword: `class ForgotToExtendActions extends Actions { ... }`');
    });

    it('accepts plain old JavaScript object', function () {
      var flux = new _Flux.Flux();

      flux.createActions('foobar', {
        foo: function foo() {
          return 'bar';
        },

        bar: function bar() {
          return 'baz';
        }
      });

      expect(flux.getActions('foobar')).to.be.an['instanceof'](_Flux.Actions);
      expect(flux.getActions('foobar').foo()).to.equal('bar');
      expect(flux.getActions('foobar').bar()).to.equal('baz');
    });

    it('returns the created action\'s instance', function () {
      var TestActions = (function (_Actions2) {
        function TestActions() {
          _classCallCheck(this, TestActions);

          if (_Actions2 != null) {
            _Actions2.apply(this, arguments);
          }
        }

        _inherits(TestActions, _Actions2);

        return TestActions;
      })(_Flux.Actions);

      var flux = new _Flux.Flux();
      var actions = flux.createActions('TestActions', TestActions);
      expect(actions).to.be.an.instanceOf(TestActions);
    });
  });

  describe('#getActions()', function () {
    var TestActions = (function (_Actions3) {
      function TestActions() {
        _classCallCheck(this, TestActions);

        if (_Actions3 != null) {
          _Actions3.apply(this, arguments);
        }
      }

      _inherits(TestActions, _Actions3);

      return TestActions;
    })(_Flux.Actions);

    it('retrieves actions for key', function () {
      var flux = new _Flux.Flux();
      flux.createActions('TestActions', TestActions);

      expect(flux.getActions('TestActions')).to.be.an.instanceOf(_Flux.Actions);
      expect(flux.getActions('NonexistentActions')).to.be.undefined;
    });
  });

  describe('#getActionIds() / #getConstants()', function () {
    var TestActions = (function (_Actions4) {
      function TestActions() {
        _classCallCheck(this, TestActions);

        if (_Actions4 != null) {
          _Actions4.apply(this, arguments);
        }
      }

      _inherits(TestActions, _Actions4);

      TestActions.prototype.getFoo = function getFoo() {};

      return TestActions;
    })(_Flux.Actions);

    it('retrives ids of actions for key', function () {
      var flux = new _Flux.Flux();
      flux.createActions('TestActions', TestActions);

      expect(flux.getActionIds('TestActions').getFoo).to.be.a('string');
      expect(flux.getActionIds('NonexistentActions')).to.be.undefined;

      expect(flux.getConstants('TestActions').getFoo).to.be.a('string');
      expect(flux.getConstants('NonexistentActions')).to.be.undefined;
    });
  });

  describe('#removeActions()', function () {
    it('throws if key does not exist', function () {
      var flux = new _Flux.Flux();

      var TestActions = (function (_Actions5) {
        function TestActions() {
          _classCallCheck(this, TestActions);

          if (_Actions5 != null) {
            _Actions5.apply(this, arguments);
          }
        }

        _inherits(TestActions, _Actions5);

        return TestActions;
      })(_Flux.Actions);

      flux.createActions('TestActions', TestActions);
      expect(flux.removeActions.bind(flux, 'NonexistentActions')).to['throw']('You\'ve attempted to remove actions with key NonexistentActions which does not exist.');
    });

    it('deletes actions instance', function () {
      var flux = new _Flux.Flux();

      var TestActions = (function (_Store8) {
        function TestActions() {
          _classCallCheck(this, TestActions);

          if (_Store8 != null) {
            _Store8.apply(this, arguments);
          }
        }

        _inherits(TestActions, _Store8);

        return TestActions;
      })(_Flux.Store);

      flux.createStore('TestActions', TestActions);
      flux.removeStore('TestActions');
      expect(flux._actions.TestActions).to.be.undefined;
    });
  });

  describe('#getAllActionIds() / #getAllConstants()', function () {
    var TestFooActions = (function (_Actions6) {
      function TestFooActions() {
        _classCallCheck(this, TestFooActions);

        if (_Actions6 != null) {
          _Actions6.apply(this, arguments);
        }
      }

      _inherits(TestFooActions, _Actions6);

      TestFooActions.prototype.getFoo = function getFoo() {};

      TestFooActions.prototype.getBar = function getBar() {};

      return TestFooActions;
    })(_Flux.Actions);

    var TestBarActions = (function (_Actions7) {
      function TestBarActions() {
        _classCallCheck(this, TestBarActions);

        if (_Actions7 != null) {
          _Actions7.apply(this, arguments);
        }
      }

      _inherits(TestBarActions, _Actions7);

      TestBarActions.prototype.getFoo = function getFoo() {};

      TestBarActions.prototype.getBar = function getBar() {};

      return TestBarActions;
    })(_Flux.Actions);

    it('retrives ids of all actions', function () {
      var flux = new _Flux.Flux();
      flux.createActions('TestFooActions', TestFooActions);
      flux.createActions('TestBarActions', TestBarActions);

      expect(flux.getAllActionIds()).to.be.an('array');
      expect(flux.getAllActionIds()[0]).to.be.a('string');
      expect(flux.getAllActionIds()).to.have.length(4);

      expect(flux.getAllConstants()).to.be.an('array');
      expect(flux.getAllConstants()[0]).to.be.a('string');
      expect(flux.getAllConstants()).to.have.length(4);
    });
  });

  describe('#dispatch()', function () {

    it('delegates to dispatcher', function () {
      var flux = new _Flux.Flux();
      var dispatch = _sinon2['default'].spy();
      flux.dispatcher = { dispatch: dispatch };
      var actionId = 'actionId';

      flux.dispatch(actionId, 'foobar');

      expect(dispatch.firstCall.args[0]).to.deep.equal({
        actionId: actionId,
        body: 'foobar'
      });
    });

    it('emits dispatch event', function () {
      var flux = new _Flux.Flux();
      var listener = _sinon2['default'].spy();

      flux.addListener('dispatch', listener);

      var actionId = 'actionId';

      flux.dispatch(actionId, 'foobar');

      expect(listener.calledOnce).to.be['true'];
      expect(listener.firstCall.args[0]).to.deep.equal({
        actionId: actionId,
        body: 'foobar'
      });
    });
  });

  describe('#dispatchAsync()', function () {

    it('delegates to dispatcher', function callee$2$0() {
      var flux, dispatch, actionId;
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            flux = new _Flux.Flux();
            dispatch = _sinon2['default'].spy();

            flux.dispatcher = { dispatch: dispatch };
            actionId = 'actionId';
            context$3$0.next = 6;
            return regeneratorRuntime.awrap(flux.dispatchAsync(actionId, Promise.resolve('foobar')));

          case 6:

            expect(dispatch.callCount).to.equal(2);

            expect(dispatch.firstCall.args[0].actionId).to.equal(actionId);
            expect(dispatch.firstCall.args[0].async).to.equal('begin');

            expect(dispatch.secondCall.args[0].actionId).to.equal(actionId);
            expect(dispatch.secondCall.args[0].body).to.equal('foobar');
            expect(dispatch.secondCall.args[0].async).to.equal('success');

          case 12:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });

    it('adds unique dispatch id to keep track of async actions', function callee$2$0() {
      var flux, dispatch, actionId;
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            flux = new _Flux.Flux();
            dispatch = _sinon2['default'].spy();

            flux.dispatcher = { dispatch: dispatch };
            actionId = 'actionId';
            context$3$0.next = 6;
            return regeneratorRuntime.awrap(flux.dispatchAsync(actionId, Promise.resolve('foobar')));

          case 6:

            expect(dispatch.firstCall.args[0].async).to.equal('begin');
            expect(dispatch.secondCall.args[0].async).to.equal('success');

            expect(dispatch.firstCall.args[0].dispatchId).to.equal(dispatch.secondCall.args[0].dispatchId);

            context$3$0.next = 11;
            return regeneratorRuntime.awrap(flux.dispatchAsync(actionId, Promise.reject(new Error())));

          case 11:

            expect(dispatch.thirdCall.args[0].async).to.equal('begin');
            expect(dispatch.getCall(3).args[0].async).to.equal('failure');

            expect(dispatch.thirdCall.args[0].dispatchId).to.equal(dispatch.getCall(3).args[0].dispatchId);

          case 14:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });

    it('emits dispatch event', function callee$2$0() {
      var flux, listener, actionId;
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            flux = new _Flux.Flux();
            listener = _sinon2['default'].spy();

            flux.addListener('dispatch', listener);

            actionId = 'actionId';
            context$3$0.next = 6;
            return regeneratorRuntime.awrap(flux.dispatchAsync(actionId, Promise.resolve('foobar')));

          case 6:

            expect(listener.calledTwice).to.be['true'];
            expect(listener.firstCall.args[0].actionId).to.equal(actionId);
            expect(listener.firstCall.args[0].async).to.equal('begin');
            expect(listener.secondCall.args[0].actionId).to.equal(actionId);
            expect(listener.secondCall.args[0].async).to.equal('success');

          case 11:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });

    it('resolves to value of given promise', function (done) {
      var flux = new _Flux.Flux();
      var dispatch = _sinon2['default'].spy();
      flux.dispatcher = { dispatch: dispatch };
      var actionId = 'actionId';

      expect(flux.dispatchAsync(actionId, Promise.resolve('foobar'))).to.eventually.equal('foobar').notify(done);
    });

    it('dispatches with error if promise rejects', function callee$2$0() {
      var flux, dispatch, actionId, error;
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            flux = new _Flux.Flux();
            dispatch = _sinon2['default'].spy();

            flux.dispatcher = { dispatch: dispatch };
            actionId = 'actionId';
            error = new Error('error');
            context$3$0.next = 7;
            return regeneratorRuntime.awrap(flux.dispatchAsync(actionId, Promise.reject(error)));

          case 7:

            expect(dispatch.callCount).to.equal(2);
            expect(dispatch.firstCall.args[0].actionId).to.equal(actionId);
            expect(dispatch.firstCall.args[0].async).to.equal('begin');
            expect(dispatch.secondCall.args[0].actionId).to.equal(actionId);
            expect(dispatch.secondCall.args[0].async).to.equal('failure');
            expect(dispatch.secondCall.args[0].error).to.be.an['instanceof'](Error);

          case 13:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });

    it('emit errors that occur as result of dispatch', function callee$2$0() {
      var ExampleStore, flux, listener, actionId, store;
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            ExampleStore = (function (_Store9) {
              function ExampleStore() {
                _classCallCheck(this, ExampleStore);

                if (_Store9 != null) {
                  _Store9.apply(this, arguments);
                }
              }

              _inherits(ExampleStore, _Store9);

              return ExampleStore;
            })(_Flux.Store);

            flux = new _Flux.Flux();
            listener = _sinon2['default'].spy();

            flux.addListener('error', listener);

            actionId = 'actionId';
            store = flux.createStore('example', ExampleStore);

            store.registerAsync(actionId, null, function () {
              throw new Error('success error');
            }, function () {
              throw new Error('failure error');
            });

            context$3$0.next = 9;
            return regeneratorRuntime.awrap(expect(flux.dispatchAsync(actionId, Promise.resolve('foobar'))).to.be.rejectedWith('success error'));

          case 9:
            expect(listener.calledOnce).to.be['true'];
            expect(listener.firstCall.args[0].message).to.equal('success error');

            context$3$0.next = 13;
            return regeneratorRuntime.awrap(expect(flux.dispatchAsync(actionId, Promise.reject(new Error('foobar')))).to.be.rejectedWith('failure error'));

          case 13:
            expect(listener.calledTwice).to.be['true'];
            expect(listener.secondCall.args[0].message).to.equal('failure error');

          case 15:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });
  });

  describe('#removeAllStoreListeners', function () {
    it('removes all listeners from stores', function () {
      var TestStore = (function (_Store10) {
        function TestStore() {
          _classCallCheck(this, TestStore);

          if (_Store10 != null) {
            _Store10.apply(this, arguments);
          }
        }

        _inherits(TestStore, _Store10);

        return TestStore;
      })(_Flux.Store);

      var flux = new _Flux.Flux();
      var storeA = flux.createStore('storeA', TestStore);
      var storeB = flux.createStore('storeB', TestStore);

      var listener = function listener() {};

      storeA.addListener('change', listener);
      storeA.addListener('change', listener);
      storeB.addListener('change', listener);
      storeB.addListener('change', listener);

      expect(storeA.listeners('change').length).to.equal(2);
      expect(storeB.listeners('change').length).to.equal(2);

      flux.removeAllStoreListeners();

      expect(storeA.listeners('change').length).to.equal(0);
      expect(storeB.listeners('change').length).to.equal(0);
    });
  });

  describe('#serialize()', function () {

    it('returns state of all the stores as a JSON string', function () {
      var flux = new _Flux.Flux();

      flux.createStore('foo', createSerializableStore('foo state'));
      flux.createStore('bar', createSerializableStore('bar state'));
      flux.createStore('baz', createSerializableStore('baz state'));

      expect(JSON.parse(flux.serialize())).to.deep.equal({
        foo: 'foo state',
        bar: 'bar state',
        baz: 'baz state'
      });
    });

    it('ignores stores whose classes do not implement .serialize()', function () {
      var flux = new _Flux.Flux();

      var TestStore = (function (_Store11) {
        function TestStore() {
          _classCallCheck(this, TestStore);

          if (_Store11 != null) {
            _Store11.apply(this, arguments);
          }
        }

        _inherits(TestStore, _Store11);

        return TestStore;
      })(_Flux.Store);

      flux.createStore('foo', createSerializableStore('foo state'));
      flux.createStore('bar', createSerializableStore('bar state'));
      flux.createStore('baz', TestStore);

      expect(JSON.parse(flux.serialize())).to.deep.equal({
        foo: 'foo state',
        bar: 'bar state'
      });
    });

    it('warns if any store classes .serialize() returns a non-string', function () {
      var flux = new _Flux.Flux();
      var warn = _sinon2['default'].spy(console, 'warn');

      flux.createStore('foo', createSerializableStore({}));
      flux.serialize();

      expect(warn.firstCall.args[0]).to.equal('The store with key \'foo\' was not serialized because the static ' + 'method `SerializableStore.serialize()` returned a non-string with ' + 'type \'object\'.');

      console.warn.restore();
    });

    it('warns and skips stores whose classes do not implement .deserialize()', function () {
      var flux = new _Flux.Flux();
      var warn = _sinon2['default'].spy(console, 'warn');

      var TestStore = (function (_Store12) {
        function TestStore() {
          _classCallCheck(this, TestStore);

          if (_Store12 != null) {
            _Store12.apply(this, arguments);
          }
        }

        _inherits(TestStore, _Store12);

        TestStore.serialize = function serialize() {
          return 'state string';
        };

        return TestStore;
      })(_Flux.Store);

      flux.createStore('test', TestStore);
      flux.serialize();

      expect(warn.firstCall.args[0]).to.equal('The class `TestStore` has a `serialize()` method, but no ' + 'corresponding `deserialize()` method.');

      console.warn.restore();
    });
  });

  describe('#deserialize()', function () {

    it('converts a serialized string into state and uses it to replace state of stores', function () {
      var flux = new _Flux.Flux();

      flux.createStore('foo', createSerializableStore());
      flux.createStore('bar', createSerializableStore());
      flux.createStore('baz', createSerializableStore());

      flux.deserialize('{\n        "foo": "foo state",\n        "bar": "bar state",\n        "baz": "baz state"\n      }');

      var fooStore = flux.getStore('foo');
      var barStore = flux.getStore('bar');
      var bazStore = flux.getStore('baz');

      expect(fooStore.state.stateString).to.equal('foo state');
      expect(fooStore.state.deserialized).to.be['true'];
      expect(barStore.state.stateString).to.equal('bar state');
      expect(barStore.state.deserialized).to.be['true'];
      expect(bazStore.state.stateString).to.equal('baz state');
      expect(bazStore.state.deserialized).to.be['true'];
    });

    it('warns and skips if passed string is invalid JSON', function () {
      var flux = new _Flux.Flux();

      var TestStore = (function (_Store13) {
        function TestStore() {
          _classCallCheck(this, TestStore);

          if (_Store13 != null) {
            _Store13.apply(this, arguments);
          }
        }

        _inherits(TestStore, _Store13);

        return TestStore;
      })(_Flux.Store);

      flux.createStore('foo', TestStore);

      expect(flux.deserialize.bind(flux, 'not JSON')).to['throw']('Invalid value passed to `Flux#deserialize()`: not JSON');
    });

    it('warns and skips stores whose classes do not implement .serialize()', function () {
      var flux = new _Flux.Flux();
      var warn = _sinon2['default'].spy(console, 'warn');

      var TestStore = (function (_Store14) {
        function TestStore() {
          _classCallCheck(this, TestStore);

          if (_Store14 != null) {
            _Store14.apply(this, arguments);
          }
        }

        _inherits(TestStore, _Store14);

        TestStore.deserialize = function deserialize() {
          return {};
        };

        return TestStore;
      })(_Flux.Store);

      flux.createStore('test', TestStore);
      flux.deserialize('{"test": "test state"}');

      expect(warn.firstCall.args[0]).to.equal('The class `TestStore` has a `deserialize()` method, but no ' + 'corresponding `serialize()` method.');

      console.warn.restore();
    });

    it('ignores stores whose classes do not implement .deserialize()', function () {
      var flux = new _Flux.Flux();

      var TestStore = (function (_Store15) {
        function TestStore() {
          _classCallCheck(this, TestStore);

          if (_Store15 != null) {
            _Store15.apply(this, arguments);
          }
        }

        _inherits(TestStore, _Store15);

        return TestStore;
      })(_Flux.Store);

      flux.createStore('foo', createSerializableStore());
      flux.createStore('bar', createSerializableStore());
      flux.createStore('baz', TestStore);

      flux.deserialize('{\n        "foo": "foo state",\n        "bar": "bar state",\n        "baz": "baz state"\n      }');

      var fooStore = flux.getStore('foo');
      var barStore = flux.getStore('bar');
      var bazStore = flux.getStore('baz');

      expect(fooStore.state.stateString).to.equal('foo state');
      expect(fooStore.state.deserialized).to.be['true'];
      expect(barStore.state.stateString).to.equal('bar state');
      expect(barStore.state.deserialized).to.be['true'];
      expect(bazStore.state).to.be['null'];
    });
  });
});
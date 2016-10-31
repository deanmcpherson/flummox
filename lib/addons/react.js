'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _FluxComponent = require('./FluxComponent');

var _FluxComponent2 = _interopRequireDefault(_FluxComponent);

var _fluxMixin = require('./fluxMixin');

var _fluxMixin2 = _interopRequireDefault(_fluxMixin);

var _connectToStores = require('./connectToStores');

var _connectToStores2 = _interopRequireDefault(_connectToStores);

var FluxComponent = (0, _FluxComponent2['default'])(_react2['default'], 'span');
exports.FluxComponent = FluxComponent;
var fluxMixin = (0, _fluxMixin2['default'])(_react2['default']);
exports.fluxMixin = fluxMixin;
var connectToStores = (0, _connectToStores2['default'])(_react2['default']);
exports.connectToStores = connectToStores;
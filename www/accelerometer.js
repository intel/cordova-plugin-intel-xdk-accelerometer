/*
Copyright 2015 Intel Corporation

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file 
except in compliance with the License. You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the 
License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
either express or implied. See the License for the specific language governing permissions 
and limitations under the License
*/
var exec = require('cordova/exec'),
	AccelerationOptions = require('./accelerationOptions'),
	Acceleration = require('./acceleration');

/**
 * Provides access to the various acceleration features on the device.
 */
module.exports = {
	// Define object for receiving acceleration values
	//_accel: {x:0.00490979, y:0.031255003, z:-0.9399254},
	_accel: {x:0, y:0, z:0},

	/**
	 * Asynchronously acquires the current acceleration.
	 * @param {Function} successCallback The function to call when the acceleration
	 * data is available
	 * @param {AccelerationOptions} options The options for getting the accelerometer data
	 * such as timeout.
	 */
 	getCurrentAcceleration: function(successCallback, options) {
		// If the acceleration is available then call success
		// If the acceleration is not available then call error
	
		//validate options object
		var _options = new intel.xdk.accelerationOptions.AccelerationOptions();

		if(typeof(options)=="object"){
			if(typeof(options.adjustForRotation)=="boolean") _options.adjustForRotation = options.adjustForRotation;
		}

		// Created for iPhone, Iphone passes back _accel obj litteral
		if (typeof successCallback == "function") {
			var accel = new intel.xdk.acceleration.Acceleration(this._accel.x, this._accel.y, this._accel.z, _options.adjustForRotation);
			
			successCallback(accel);
		}
	},

	/**
	 * Asynchronously acquires the acceleration repeatedly at a given interval.
	 * @param {Function} successCallback The function to call each time the acceleration
	 * data is available
	 * @param {AccelerationOptions} options The options for getting the accelerometer data
	 * such as timeout.
	 */
	watchAcceleration: function(successCallback, options) {
		//validate options object
		var _options = new intel.xdk.accelerationOptions.AccelerationOptions();
		if(typeof(options)=="object"){
			var parsedFreq = parseInt(options.frequency);
			if(typeof(parsedFreq)=="number" && !isNaN(parsedFreq)) {
				_options.frequency = parsedFreq<25?25:parsedFreq;
			}
			if(typeof(options.adjustForRotation)=="boolean") _options.adjustForRotation = options.adjustForRotation;
		}
		//AppMobiAccelerometer.start(_options.frequency);
		exec(null, null, "IntelXDKAccelerometer", "start", [_options.frequency]);
		this.getCurrentAcceleration(successCallback, _options);
		return setInterval(function() {
			intel.xdk.accelerometer.getCurrentAcceleration(successCallback, _options);
		}, _options.frequency);
	},
	
	setAcceleration: function(accel) {
		this._accel = accel;
	},
	
	clearWatch: function(timer) {
		clearTimeout(timer);
		exec(null, null, "IntelXDKAccelerometer", "stop", []);
	}
}
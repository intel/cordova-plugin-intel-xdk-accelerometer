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
	module.exports = {
		/**
		 * This class contains acceleration information
		 * @constructor
		 * @param {Number} x The force applied by the device in the x-axis.
		 * @param {Number} y The force applied by the device in the y-axis.
		 * @param {Number} z The force applied by the device in the z-axis.
		 * @param {boolean} doRotate If true, rotate axes based on device rotation.
		 */
		Acceleration: function(x, y, z, doRotate) {
			//if (this._accel == null)
			//	this._accel = new this.Acceleration(0, 0, 0, false);
			
			if(doRotate) {
				//TODO: figure out orientation
				var orientation = 0;		//AppMobi.device.orientation;
				if(orientation==0) {
				//portrait
				} else if (orientation==90) {
				//landscape left
					var temp = y, y = -x, x = temp;
				} else if (orientation==180) {
				//upside-down portrait
					x = -x, y = -y;
				} else if (orientation==-90) {
				//landscape right
					var temp = x, x = -y, y = temp;
				}
			}
			/**
			 * The force applied by the device in the x-axis.
			 */
			this.x = x;
			/**
			 * The force applied by the device in the y-axis.
			 */
			this.y = y;
			/**
			 * The force applied by the device in the z-axis.
			 */
			this.z = z;
			/**
			 * The time that the acceleration was obtained.
			 */
			this.timestamp = new Date().getTime();
		}
	}
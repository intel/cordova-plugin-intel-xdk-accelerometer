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
    
    var _accelerometer;
    var isRunning = false;
    var time = 1000;
    var orientation = "";
    var adjustForRotation = false;
    var SuccessCallback = null;
    var ErrorCallback = null;
    
    cordova.commandProxy.add("IntelXDKAccelerometer", {
        start: function (successCallback, errorCallback, params) {
            var time = "1000";
            SuccessCallback = successCallback;
            ErrorCallback = errorCallback;

            if (params.length > 0)
                time = params[0];

            if (params.length > 1)
                adjustForRotation = params[1];

            if (params.length > 2)
                orientation = params[2];

            if (!this.isRunning)
            {
                try
                {
                    _accelerometer = Windows.Devices.Sensors.Accelerometer.getDefault();
                    _accelerometer.reportInterval = time;
                    _accelerometer.addEventListener("readingchanged", readingchanged_handler);

                    this.isRunning = true;
                }
                catch (ex)
                {
                }
            }
        },
     
        stop: function (successCallback, errorCallback, params) {
            if (this.isRunning && _accelerometer != null) {
                _accelerometer.removeEventListener("readingchanged", readingchanged_handler);

                // Restore the default report interval to release resources while the sensor is not in use
                _accelerometer.ReportInterval = 0;
                this.isRunning = false;
            }
        },
        getAccelerometerReading: function (successCallback, errorCallback, params) {
            SuccessCallback(intel.xdk.accelerometer._accel);
        }
    });

    // making this global for a quick implementation.  will correct later.
    function readingchanged_handler (e) {
        var reading = e.reading;
        var x = reading.accelerationX;
        var y = reading.accelerationY;
        var z = reading.accelerationZ;

        if (Windows.Graphics.Display.DisplayProperties.currentOrientation == Windows.Graphics.Display.DisplayOrientations.portrait
            || Windows.Graphics.Display.DisplayProperties.currentOrientation == Windows.Graphics.Display.DisplayOrientations.portraitFlipped) {
            var oldx = x, oldy = y;
            y = oldx * -1;
            x = oldy;
        }

        intel.xdk.accelerometer._accel = new intel.xdk.acceleration.Acceleration(x, y, z, false);
        SuccessCallback(new intel.xdk.acceleration.Acceleration(x, y, z, false));
    }

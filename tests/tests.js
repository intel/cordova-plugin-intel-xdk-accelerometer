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
exports.defineAutoTests = function() {
    describe('intel.xdk.accelerometer', function () {
        var startRange = -2, endRange = 2;

        it('is defined', function () {
            expect(intel.xdk.accelerometer).toBeDefined();
            expect(intel.xdk.accelerationOptions).toBeDefined();
        });

        describe('getCurrentAcceleration', function () { 
             it('is a function', function () {
                expect(intel.xdk.accelerometer.getCurrentAcceleration).toBeDefined();
                expect(typeof intel.xdk.accelerometer.getCurrentAcceleration).toBe('function');
            });

            it('gets the value set by setAcceleration', function (done) {
                var accelVal = {x: -0.5, y: 0, z: 0.5};
                intel.xdk.accelerometer.setAcceleration(accelVal);
                intel.xdk.accelerometer.getCurrentAcceleration(callBack);
                function callBack(accel) {
                    expect(accel).toBeDefined();
                    expect(accel.x).toBeDefined();
                    expect(typeof accel.x).toBe('number');
                    expect(accel.x).toBe(accelVal.x);
                    expect(accel.y).toBeDefined();
                    expect(typeof accel.y).toBe('number');
                    expect(accel.y).toBe(accelVal.y);
                    expect(accel.z).toBeDefined();
                    expect(typeof accel.z).toBe('number');
                    expect(accel.z).toBe(accelVal.z);
                    done();
                };
            });
        });

        describe ('watchAcceleration and clearWatch', function() {

            it('are functions', function() {
                expect(intel.xdk.accelerometer.watchAcceleration).toBeDefined();
                expect(typeof intel.xdk.accelerometer.watchAcceleration).toBe('function');
                expect(intel.xdk.accelerometer.clearWatch).toBeDefined();
                expect(typeof intel.xdk.accelerometer.clearWatch).toBe('function');
            });

            it('will start and stop receiving acceleration callbacks', function(done) {
                var numCallbacks = 0;
                var watch = intel.xdk.accelerometer.watchAcceleration(callBack);
                function callBack(accel) {
                    if (++numCallbacks == 3) {
                        intel.xdk.accelerometer.clearWatch(watch);
                        // Allow time to get another sample if the clearWatch call didn't work.
                        setTimeout(function(){ done(); }, 500);
                    }
                    expect(numCallbacks).not.toBeGreaterThan(3);
                    expect(accel).toBeDefined();
                    expect(accel.x).toBeDefined();
                    expect(typeof accel.x).toBe('number');
                    expect(accel.x).toBeLessThan(endRange);
                    expect(accel.x).toBeGreaterThan(startRange);
                    expect(accel.y).toBeDefined();
                    expect(typeof accel.y).toBe('number');
                    expect(accel.y).toBeLessThan(endRange);
                    expect(accel.y).toBeGreaterThan(startRange);
                    expect(accel.z).toBeDefined();
                    expect(typeof accel.z).toBe('number');
                    expect(accel.z).toBeLessThan(endRange);
                    expect(accel.z).toBeGreaterThan(startRange);
                };
            });
        });

    });
};

exports.defineManualTests = function(contentEl, createActionButton) {
    
    var accelerometer_test_1 = '<h3>getCurrentAcceleration</h3>' +
        '<div id="getCurrentAccelerationButton"></div>' +
        'Expected result: should display accelearion object in the info widget';
    
    var accelerometer_test_2 = '<h3>startListening</h3>' +
        '<div id="startListeningButton"></div>' +
        'Expected result: call startListening';
    
    var accelerometer_test_3 = '<h3>stopListening</h3>' +
        '<div id="stopListeningButton"></div>' +
        'Expected result: call stopListening()';
    
    /** Append each button markup to the content */
    var accelerometer_suite = accelerometer_test_1 + accelerometer_test_2 + accelerometer_test_3;
    contentEl.innerHTML = '<div id="info"></div>' + accelerometer_suite;
    
    /** Timer for watchAcceleration */
    var accelerometerTimer = null;
    
    function logMessage(message, color) {
        var log = document.getElementById('info');
        var logLine = document.createElement('div');
        if (color) {
            logLine.style.color = color;
        }
        logLine.innerHTML = message;
        log.appendChild(logLine);
    }

    function clearLog() {
        var log = document.getElementById('info');
        log.innerHTML = '';
    }
    
    /** Print an acceleration object in the test window's info box. */
    function displayAcceleration(accel) {
        var message =
            'Acceleration X: ' + accel.x + '<br/>' +
            'Acceleration Y: ' + accel.y + '<br/>' +
            'Acceleration Z: ' + accel.z + '<br/>' +
            'Timestamp     : ' + accel.timestamp;
        clearLog();
        logMessage(message);
    }

    createActionButton('getCurrentAcceleration', function() {
        /** call getCurrentAcceleration */
        var options = { adjustForRotation: true };
        intel.xdk.accelerometer.getCurrentAcceleration(displayAcceleration, options);
    }, "getCurrentAccelerationButton");
    
    createActionButton('startListening',function(){
        var options = { frequency: 1000 };
        if(accelerometerTimer === null) {
            accelerometerTimer = intel.xdk.accelerometer.watchAcceleration(displayAcceleration, options);
        }
    },"startListeningButton");
    
    createActionButton('stopListening',function(){
        if(accelerometerTimer !== null) {
            intel.xdk.accelerometer.clearWatch(accelerometerTimer);
            accelerometerTimer = null;
        }
    },"stopListeningButton");
};

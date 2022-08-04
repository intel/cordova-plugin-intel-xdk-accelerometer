DISCONTINUATION OF PROJECT.

This project will no longer be maintained by Intel.

Intel has ceased development and contributions including, but not limited to, maintenance, bug fixes, new releases, or updates, to this project. 

Intel no longer accepts patches to this project.

If you have an ongoing need to use this project, are interested in independently developing it, or would like to maintain patches for the open source software community, please create your own fork of this project. 
DISCONTINUATION OF PROJECT.  This project will no longer be maintained by Intel.  Intel will not provide or guarantee development of or support for this project, including but not limited to, maintenance, bug fixes, new releases or updates.  Patches to this project are no longer accepted by Intel.  In an effort to support the developer community, Intel has made this project available under the terms of the Apache License, Version 2. If you have an ongoing need to use this project, are interested in independently developing it, or would like to maintain patches for the community, please create your own fork of the project.

intel.xdk.accelerometer
=======================

Use the accelerometer object to listen to the device's motion sensor.

>   _This Intel XDK Cordova plugin and API has been deprecated. Please use the
>   equivalent standard Cordova 
>   [accelerometer](https://github.com/apache/cordova-plugin-device-motion)
>   plugin instead._

Description
-----------

The accelerometer is that device on a smartphone that detects movement. The
accelerometer object is used to track the accelerometer on the device. Success
and failure callback functions need to be defined in your Javascript.
Successful data is returned as an object with the attributes `.x`, `.y`, and
`.z`. Values of accelerometer samples for each axis range from -1 to 1.

### Methods

-   [clearWatch](#clearwatch) — This method stops the process started by
    [watchAcceleration](#watchacceleration) when it is passed the appropriate
    watch timer object.
    
-   [getCurrentAcceleration](#getcurrentacceleration) — This method will
    asynchronously acquire the device's acceleration when it is called.
    
-   [watchAcceleration](#watchacceleration) — This method will asynchronously
    acquire the device's acceleration repeatedly at a given interval.

Methods
-------

### clearWatch

This method stops the process started by [watchAcceleration](#watchacceleration)
when it is passed the appropriate watch timer object.

```javascript
intel.xdk.accelerometer.clearWatch(watchID);
```

#### Available Platforms

-   Apple iOS
-   Google Android
-   Microsoft Windows 8 - BETA
-   Microsoft Windows Phone 8 - BETA

#### Parameters

-   **watchID:** The ID returned by accelerometer.watchAcceleration.

#### Example

```javascript
var watchID = intel.xdk.accelerometer.watchAcceleration(onSuccess, options);
// ... later on ...
intel.xdk.accelerometer.clearWatch(watchID);
```

### getCurrentAcceleration

This method will asynchronously acquire the device's acceleration when it is
called.

```javascript
intel.xdk.accelerometer.getCurrentAcceleration(accelerometerSuccess,accelerometerOptions);
```

#### Description

This method will asynchronously acquire the acceleration on the device when it
is called. The optional acceleration options parameter is looking for a
javascript object with the `.adjustForRotation` property which changes the
values of the `.x` and `.y` parameter based on the device orientation. The
success function callback is triggered once data is available. Successful data
is returned as an object with the attributes ``.x``, ``.y``, and ``.z``.

#### Available Platforms

-   Apple iOS
-   Google Android
-   Microsoft Windows 8 - BETA
-   Microsoft Windows Phone 8 - BETA

#### Parameters

-   **accelerometerSuccess:** A function executed when the method successfully
    detects an accelerometer change.
-   **accelerometerOptions:** An object that contains the `adjustForRotation`
    property to set it to adjust for device orientation or not.

#### Example

```javascript
function getSingleAcceleration() {
    intel.xdk.accelerometer.getCurrentAcceleration(
       function(evt){
           document.getElementById("accelerometerReadings").innerHTML =
                'Acceleration X: ' + evt.x + '<br/>' +
                'Acceleration Y: ' + evt.y + '<br/>' +
                'Acceleration Z: ' + evt.z + '<br/>' +
                'Timestamp: '      + evt.timestamp;
       }, {adjustForRotation:false});
}
```

### watchAcceleration

This method will asynchronously acquire the device's acceleration repeatedly at
a given interval

```javascript
var watchID = intel.xdk.accelerometer.watchAcceleration(accelerometerSuccess,accelerometerOptions);
```

#### Description

This method will asynchronously acquire the acceleration repeatedly at a given
interval. The acceleration options parameter is looking for a javascript object
with two properties: `.frequency` which changes that millisecond interval for
refresh and has a default of 500 and `.adjustForRotation` which changes the
values of the `.x` and `.y` parameter based on the device orientation. The
success function callback is triggered each time data is available. Successful
data is returned as an object with the attributes `.x`, `.y`, and `.z`. This
method returns a watch timer object to be cleared with
[clearWatch](#clearwatch).

#### Available Platforms

-   Apple iOS
-   Google Android
-   Microsoft Windows 8 - BETA
-   Microsoft Windows Phone 8 - BETA

#### Parameters

-   **accelerometerSuccess:** A function executed when the method successfully
    detects an accelerometer change.
-   **accelerometerOptions:** An object that contains properties which will
    modify how the accelerometer information is accessed.

#### Returns

-   **watchID:** A unique identifier returned from this method that can be used
    to stop watching for an accelerometer change.

#### Example

```javascript
function onSuccess(acceleration) {
    alert('Acceleration X: ' + acceleration.x + '\n' +
        'Acceleration Y: ' + acceleration.y + '\n' +
        'Acceleration Z: ' + acceleration.z + '\n' +
        'Timestamp: '      + acceleration.timestamp + '\n');
};

var options = { frequency: 3000, adjustForRotation: true  };  // Update every 3 seconds

var watchID = intel.xdk.accelerometer.watchAcceleration(onSuccess, options);
```

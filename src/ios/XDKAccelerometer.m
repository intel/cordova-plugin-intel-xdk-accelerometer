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

#import "XDKAccelerometer.h"
#import "XDKAccelerometerFilter.h"

@interface XDKAccelerometer () <UIAccelerometerDelegate>

//! Difference between number of start calls and number of stop calls.
@property (nonatomic)	int     listenerCount;

//remove effects of gravity
//@property (nonatomic)	AccelerometerFilter* hifilter;

//isolate effects of gravity (for device orientation)
//@property (nonatomic) AccelerometerFilter *lofilter;

@end

@implementation XDKAccelerometer

// defaults to 100 msec
#define kDefaultAccelerometerInterval   100
// max rate of 40 msec
#define kMinAccelerometerInterval       40
// min rate of 1/sec
#define kMaxAccelerometerInterval       1000

- (void) start:(CDVInvokedUrlCommand*)command
{
    NSInteger intervalArg = [[command argumentAtIndex:0 withDefault:@0 andClass:[NSNumber class]]
                    integerValue];

    NSInteger interval = intervalArg = 0                         ? kDefaultAccelerometerInterval
                       : intervalArg < kMinAccelerometerInterval ? kMinAccelerometerInterval
                       : intervalArg > kMaxAccelerometerInterval ? kMaxAccelerometerInterval
                       :                                           intervalArg
                       ;

	UIAccelerometer* accel = [UIAccelerometer sharedAccelerometer];
	// accelerometer expects fractional seconds, but we have msecs
	accel.updateInterval = interval / 1000.0;
    if (self.listenerCount++ == 0) accel.delegate = self;

	//self.hifilter = [[HighpassFilter alloc] initWithSampleRate:desiredFrequency_num cutoffFrequency:5.0];
	//self.hifilter.adaptive = true;
	//self.lofilter = [[LowpassFilter alloc] initWithSampleRate:desiredFrequency_num cutoffFrequency:5.0];
	//self.lofilter.adaptive = true;
}


- (void) stop:(CDVInvokedUrlCommand*)command
{
    if (self.listenerCount > 0) {
        if (--self.listenerCount == 0) [UIAccelerometer sharedAccelerometer].delegate = nil;
    }
}

//! Send Accel Data back to the Javascript.
- (void) accelerometer:(UIAccelerometer *)accelerometer
         didAccelerate:(UIAcceleration *)acceleration
{
	if(self.listenerCount != 0)
	{
		NSString* script = [NSString stringWithFormat:
                            @"intel.xdk.accelerometer.setAcceleration("
                            "new intel.xdk.acceleration.Acceleration(%f,%f,%f,false));",
                            acceleration.x, acceleration.y, acceleration.z];
        [self.commandDelegate evalJs:script];
	}
}

@end

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

// This file is derived from the file AccelerometerFilter.h in the AccelerometerGraph
// sample project provided by Apple Inc. at
//
//      https://developer.apple.com/library/ios/samplecode/AccelerometerGraph/

#import <UIKit/UIKit.h>

// Basic filter object. 
@interface XDKAccelerometerFilter : NSObject
{
	BOOL adaptive;
	UIAccelerationValue x, y, z;
}

// Add a UIAcceleration to the filter.
-(void)addAcceleration:(UIAcceleration*)accel;

@property(nonatomic, readonly) UIAccelerationValue x;
@property(nonatomic, readonly) UIAccelerationValue y;
@property(nonatomic, readonly) UIAccelerationValue z;

@property(nonatomic, getter=isAdaptive) BOOL adaptive;
@property(nonatomic, readonly) NSString *name;

@end

// A filter class to represent a lowpass filter
@interface XDKLowpassFilter : XDKAccelerometerFilter
{
	double filterConstant;
	UIAccelerationValue lastX, lastY, lastZ;
}

-(id)initWithSampleRate:(double)rate cutoffFrequency:(double)freq;

@end

// A filter class to represent a highpass filter.
@interface XDKHighpassFilter : XDKAccelerometerFilter
{
	double filterConstant;
	UIAccelerationValue lastX, lastY, lastZ;
}

-(id)initWithSampleRate:(double)rate cutoffFrequency:(double)freq;

@end
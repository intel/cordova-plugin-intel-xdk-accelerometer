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
package com.intel.xdk.accelerometer;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;


import static android.hardware.SensorManager.DATA_X;
import static android.hardware.SensorManager.DATA_Y;
import static android.hardware.SensorManager.DATA_Z;
import android.content.Context;
import android.content.res.Configuration;
import android.hardware.SensorListener;
import android.hardware.SensorManager;
import android.webkit.JavascriptInterface;
import android.app.Activity;

@SuppressWarnings("deprecation")
public class Accelerometer extends CordovaPlugin  implements SensorListener{
	String mKey;
	int mTime = 10000;
	public boolean started = false;
	
	private SensorManager sensorManager;
	
	private long lastUpdate = -1;
	
	private Activity activity;
	
	public Accelerometer(){
	}
	
	@Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        
        //get convenience reference to activity
        activity = cordova.getActivity();
        
        sensorManager = (SensorManager) activity.getSystemService(Context.SENSOR_SERVICE);
	}
	
    /**
     * Executes the request and returns PluginResult.
     *
     * @param action            The action to execute.
     * @param args              JSONArray of arguments for the plugin.
     * @param callbackContext   The callback context used when calling back into JavaScript.
     * @return                  True when the action was valid, false otherwise.
     */
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("start")) {
        	int time = 0;
            this.start(args.getInt(0));
        }
        else if (action.equals("stop")) {
            this.stop();
        }
        else {
            return false;
        }

        // All actions are async.
        //callbackContext.success();
        return true;
    }

/*	@Override
	public void stopCommand() {
		stop();
	}*/
	
	@JavascriptInterface
	public void start(int time)
	{
		mTime = time;
		if (!started)
		{
			sensorManager.registerListener(this, SensorManager.SENSOR_ACCELEROMETER, SensorManager.SENSOR_DELAY_GAME);
			started = true;
		}
	}
	
	@JavascriptInterface
	public void stop()
	{
		if(started) {
			sensorManager.unregisterListener(this);
			started = false;
		}
	}

	public void onAccuracyChanged(int sensor, int accuracy) {
		// This should call the FAIL method
	}
	
	public void onSensorChanged(int sensor, float[] values) {
		if (sensor != SensorManager.SENSOR_ACCELEROMETER || values.length < 3)
		      return;
		long curTime = System.currentTimeMillis();

		if (lastUpdate == -1 || (curTime - lastUpdate) > mTime) {
			
			lastUpdate = curTime;
			
			//android reports 0-10 - make it 0-1 for consistency with iPhone
			float x = values[DATA_X]/10;
			float y = values[DATA_Y]/10;
			float z = values[DATA_Z]/10;
			
			//if in landscape, android swaps x and y axes - swap them back for consistency with iPhone
			if(activity.getResources().getConfiguration().orientation == Configuration.ORIENTATION_LANDSCAPE) {
				float oldx = x, oldy = y;
				y = oldx * -1;
				x = oldy;
			}
			//wrapped in try/catch to fix errors after closing can roll in appLab
			String js = "javascript:intel.xdk.accelerometer.setAcceleration(new intel.xdk.acceleration.Acceleration("+x+","+y+","+z+",false));";
			//String js = "javascript:new intel.xdk.acceleration.Acceleration("+x+","+y+","+z+",false);";
			//String js = "javascript:console.log('before'); new intel.xdk.acceleration.Acceleration("+x+","+y+","+z+",false);console.log('after'); ";
			//String js = "javascript:alert('0');";
			//would be nice to have a roundtrip feedback loop in order to stop injecting when it is causing errors
			
			webView.loadUrl(js);
		}
	}	
}

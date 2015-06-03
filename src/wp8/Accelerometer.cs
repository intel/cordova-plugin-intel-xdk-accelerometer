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

using Microsoft.Devices.Sensors;
using Microsoft.Phone.Reactive;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Threading;
using Windows.UI.Core;
using WPCordovaClassLib.Cordova;
using WPCordovaClassLib.Cordova.Commands;
using WPCordovaClassLib.CordovaLib;

/// <summary>
namespace Cordova.Extension.Commands
{
    /// Accelerometer Command
    /// </summary>
    public class IntelXDKAccelerometer : BaseCommand
    {
        private Microsoft.Devices.Sensors.Accelerometer _accelerometer;
        private bool isRunning = false;
        private int time = 1000;
        private string orientation = "";
        private bool adjustForRotation = false;

        #region Constructor
        /// <summary>
        /// IntelDebug Constructor
        /// </summary>
        public IntelXDKAccelerometer()
        { }
        #endregion

        #region appMobi.js Handlers
        /// <summary>
        /// Starts listening for acceleration sensor
        /// </summary>
        /// <returns>status of listener</returns>
        public void start(string parameters)
        {
            string[] args = WPCordovaClassLib.Cordova.JSON.JsonHelper.Deserialize<string[]>(parameters);

            string time = "1000";

            if (args.Length > 0)
                time = args[0];

            // account for the callback param
            if (args.Length > 2)
                adjustForRotation = bool.Parse(args[1]);

            // account for the callback param
            if (args.Length > 3)
                orientation = args[2];

            if (!this.isRunning)
            {
                if (this._accelerometer == null)
                {
                    _accelerometer = new Microsoft.Devices.Sensors.Accelerometer();
                }

                int tmpTime;
                int.TryParse(time, out tmpTime);

                this.time = tmpTime;
                try
                {
                    lock (_accelerometer)
                    {
                        _accelerometer = new Microsoft.Devices.Sensors.Accelerometer();
                        _accelerometer.TimeBetweenUpdates = TimeSpan.FromMilliseconds(this.time);
                        _accelerometer.CurrentValueChanged += new EventHandler<SensorReadingEventArgs<AccelerometerReading>>(accelerometer_CurrentValueChanged);

                        this.isRunning = true;
                        _accelerometer.Start();
                    }
                }
                catch (Exception)
                {

                }
            }
        }

        /// <summary>
        /// Stops listening for acceleration sensor
        /// </summary>
        /// <param name="parameters"></param>
        public void stop(string parameters)
        {
            string[] args = WPCordovaClassLib.Cordova.JSON.JsonHelper.Deserialize<string[]>(parameters);

            if (this.isRunning && _accelerometer != null)
            {
                lock (_accelerometer)
                {
                    _accelerometer.CurrentValueChanged -= accelerometer_CurrentValueChanged;
                    _accelerometer.Stop();
                    this.isRunning = false;
                }
            }
        }
        #endregion

        #region Private Methods
        /// <summary>
        /// Event Handler for when Current Value Changed
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void accelerometer_CurrentValueChanged(object sender, SensorReadingEventArgs<AccelerometerReading> e)
        {
            AccelerometerReading reading = e.SensorReading;

            float x = reading.Acceleration.X;
            float y = reading.Acceleration.Y;
            float z = reading.Acceleration.Z;

            if (this.orientation.ToUpper().Equals("LANDSCAPE"))
            {
                float oldx = x, oldy = y;
                y = oldx * -1;
                x = oldy;
            }

            string js = String.Format("javascript:intel.xdk.accelerometer.setAcceleration(new intel.xdk.acceleration.Acceleration({0},{1},{2},false));",
            //string js = String.Format("javascript:intel.xdk.accelerometer._accel=new intel.xdk.acceleration.Acceleration({0},{1},{2},false);",
            string.Format("{0,5:0.000}", x),
            string.Format("{0,5:0.000}", y),
            string.Format("{0,5:0.000}", z));

            //InjectJS(js);
            InvokeCustomScript(new ScriptCallback("eval", new string[] { js }), false);
        }
        #endregion
    }
}
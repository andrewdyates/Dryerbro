// Javascript : Appcelerator Titanium
// -*- coding: utf-8 -*-
// Copyright © 2011 Benjamin Gilbert
// All Rights Reserved

/* Config.js: Dryer Bro configruation for vibration detection.
 * 
 */

Config = {


    last300Values: [],
	i: 0,
	avg: 0,
	VIBRATION_THRESHOLD: 20,
	
	_checkArray: function(e) {
		int numNonZeros;
		var total;
		var average = 0.0;
		
		for (int j = 0; j < 300; j++) {
			if (last300Values(j) != 0) {
				numNonZeros++;
				total += e;
			}
		}
		average = total / numNonZeros;		
		if (average < this.VIBRATION_THRESHOLD) {
			Ti.App.fireEvent("off");
		}
    },

	vibrationUpdated: function (e) {
		/* Handle logic for when the dryer is done.
		 * 
		 * Each call checks recent values and determines if the dryer is on or off.
		 * 
		 * Args:
		 *   e: accelererometer value in mm/s^2
		 */
		var sa
		this.last300Values[this.i % 300] = e;
		this.i++;
		
		if (e < this.VIBRATION_THRESHOLD) {
			this._checkArray(e);
		} else {
			Ti.App.fireEvent("on");
		}
	}

};

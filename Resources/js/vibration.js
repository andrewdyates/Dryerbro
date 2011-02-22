// Javascript : Appcelerator Titanium
// -*- coding: utf-8 -*-
// Copyright © 2011 Andrew D. Yates
// All Rights Reserved
/* Vibration.js: Detect iPhone and Android vibrations with Appcelerator.
 * 
 * andrewyates.name@gmail.com
 * https://github.com/andrewdyates
 * 
 * Change Log: 
 *   Feb 21: 
 *     unscaled to mm/s^2
 *     added "vibration" property
 *     added event hook "update_vibration"
 */

Sampler = {
    /* Model Accelerometer samples.
     * 
     * Attributes:
     *   UNIT_SCALE: CONST num of input scale,  m/s^2
     *   MAX_SIZE: CONST int >0 of maximum samples saved
     *   ERROR: CONST int =>0 of sampling error in units, unitless
     *   items: [[int, int, int],] of (x,y,z) saved samples, unitless
     *   mean: [num, num, num] of (x,y,z) means, m/s^2
     *   std_dev: [num, num, num] of (x,y,z) smoothed standard deviations, m/s^2
     *   vibration: num of vibration, mm/s^2
     */

    // units m/s^2, measured for iPhone 3GS (Andrew's model)
    UNIT_SCALE: 0.0181121826171875,
    MAX_SIZE: 15,
    ERROR: 0.5,

    items: [],
    mean: [],
    std_dev: [],
    vibration: null,

    clear: function() {
	/* Clear all sample values. 
	 * */
	this.items = [];
	this.mean = [];
	this.std_dev = [];
    },

    push: function(x, y, z) {
	/* Save scaled sample on this.items.
	 * 
	 * Each call updates computed values and resizes this.items.
	 * 
	 * Args:
	 *   x: num of x coordinate from accelerometer reading
	 *   y: num of y coordinate from accelerometer reading
	 *   z: num of z coordinate from accelerometer reading
	 */
	var sample = [x, y, z];
	sample = sample.map(this._scale);
	this.items.push(sample);
	if (this.items.length > this.MAX_SIZE) {
	    this.items.shift();
	}
	this._update();
    },

    _scale: function(x) {
	return Math.round(x / Sampler.UNIT_SCALE);
    },

    _unscale: function(x) {
	return x * Sampler.UNIT_SCALE;
    },

    _update: function() {
	/* Update computed values: mean, std_dev.
	 *  */
	var sums = [0, 0, 0];
	var sum_sqs = [0, 0, 0];
	var mean, std_dev = [];
	var n;
	var i, k;
	var variance_k;

	var scale_n = function(x) { return x/n; };
	var square = function(x) { return Math.pow(x, 2); };
	var sum = function(a, b) { return a+b; };

	n = this.items.length;
	// edge case if no samples: exit, do not update
	if(n == 0) {
	    this.clear();
	    return null;
	}
	
	// Compute sums
	for (i=0; i<n; i++) {
	    for (k=0; k<=2; k++) {
		sums[k] += this.items[i][k];
		sum_sqs[k] += square(this.items[i][k]);
	    }
	}

	// Compute means
	mean = sums.map(scale_n);

        // Compute error-corrected standard deviations
	for (k=0; k<=2; k++) {
            variance_k = (sum_sqs[k] - n * square(mean[k], 2)) / n;
            std_dev[k] = Math.sqrt(variance_k) - this.ERROR;
            if (std_dev[k] < 0) {
                std_dev[k] = 0;
            }
        }

	// Set Computed Values to standard units (m/s^2)
	this.mean = mean.map(this._unscale);
	this.std_dev = std_dev.map(this._unscale);
	// Set Vibration to mm/s^2
 	this.vibration = this.std_dev.reduce(sum) * 1000;

	// Fire updated event
	Ti.App.fireEvent('vibration_updated', {vibration:this.vibration});
	//
	// LISTEN USING:
	// 
	// Ti.App.addEventListener('vibration_updated', function(e) {
        //   do_something(e.vibration);
        // }

	return true;
    }
};

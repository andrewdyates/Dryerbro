/* Dryer Bro
 * http://dryerbro.com
 * CSE 772 Capstone Project, The Ohio State University
 * 
 * Author: Eric Kerr
 * Email: EricPKerr [at] gmail [dot] com
 * URL: http://erickerr.com
 */

Ti.include("libs/vibration_js/vibration.js");
Ti.include("libs/utils.js");
Ti.include("UI.message.js");

var StateMachine = {
  _state: null,
  _states: [
    'waiting', // Waiting for Dryer to start
    'running', // Dryer has started running
    'extended', // Dryer has been running for an extended period of time
    'completed', // Dryer has stopped after running for an extended period of time
    'error' // There was an error
  ],
  
  WAITING_SEQUENTIAL_ACTIVE_DURATION: 5, // Wait 5 seconds of active vibrations in waiting before moving to running
  RUNNING_SEQUENTIAL_ACTIVE_DURATION: 15, // Wait 15 seconds of active vibrations in running before moving to extended
  EXTENDED_SEQUENTIAL_INACTIVE_DURATION: 35, // Wait 35 seconds of inactive vibrations before moving to completed
  
  WAITING_INACTIVE_DELAY: 10, // Show a tip after 10 seconds to put the device on a dryer in Waiting.
  
  RUNNING_MAX_RESET_TRIES: 10, // Number of times to reset in running before throwing an error
  
  ACTIVE_VIBRATION_THRESHOLD: 8,
  
  _accelerometerHandler: null, // Pointer to accelerometer handler to remove later if necessary
  
  init: function() {
    Vibration.start();
    
    this.switchState('waiting');
  },
  
  now: function() {
    return (new Date()).getTime() / 1000;
  },
  
  switchState: function(state) {
    if(this._state == state) {
      Ti.API.info("Race Condition: State already running - " + state);
      return;
    }
    if(this._states.indexOf(state) < 0) {
      Ti.API.info("ERROR: Invalid State - " + state);
      return;
    }
    Ti.API.info("StateMachine: Current State - " + state);
    this._state = state;
    this['_state' + state.charAt(0).toUpperCase() + state.slice(1)]();
  },
  
  _stateWaiting: function() {
    // Wait until we get continuous vibration for 5 seconds before proceeding
    Ti.App.fireEvent('vibrationStateWaiting');
    
    var that = this, begin = this.now();
    
    var delayTimeout = setTimeout(function(){
      Ti.App.fireEvent('vibrationStateWaitingDelay');
    }, this.WAITING_INACTIVE_DELAY * 1000)
    
    var waitingCallback = function(v) {
      v = v.vibration;
      if(v >= that.ACTIVE_VIBRATION_THRESHOLD) {
        if(that.now() - begin >= that.WAITING_SEQUENTIAL_ACTIVE_DURATION) {
          clearTimeout(delayTimeout);
          Ti.App.removeEventListener('vibration_update', waitingCallback);
          that.switchState('running');
        }
      } else {
        begin = that.now();
      }
    }
    Ti.App.addEventListener('vibration_update', waitingCallback);
  },
  
  _stateRunning: function() {
    // Must have vibrations for 15 consecutive seconds, then it goes into extended mode.
    // If 10 resets are reached, then it will throw an error.
    Ti.App.fireEvent('vibrationStateRunning');
    
    var that = this, begin = this.now(), resets = 0;
    
    var runningCallback = function(v) {
      v = v.vibration;
      if(v >= that.ACTIVE_VIBRATION_THRESHOLD) {
        if(that.now() - begin >= that.RUNNING_SEQUENTIAL_ACTIVE_DURATION) {
          Ti.App.removeEventListener('vibration_update', runningCallback);
          that.switchState('extended');
        }
      } else {
        begin = that.now();
        if(++resets >= that.RUNNING_MAX_RESET_TRIES) {
          Ti.App.removeEventListener('vibration_update', runningCallback);
          that.switchState('error');
        }
      }
    }
    Ti.App.addEventListener('vibration_update', runningCallback);
  },
  
  _stateExtended: function() {
    // Dryer has been opperating for at least 20 consecutive seconds.
    // This waits for 35 consecutive seconds of the dryer being off, then the dryer is done.
    Ti.App.fireEvent('vibrationStateExtended');
    
    var that = this, begin = this.now();
    
    var extendedCallback = function(v) {
      v = v.vibration;
      if(v < that.ACTIVE_VIBRATION_THRESHOLD) {
        if(that.now() - begin >= that.EXTENDED_SEQUENTIAL_INACTIVE_DURATION) {
          Ti.App.removeEventListener('vibration_update', extendedCallback);
          that.switchState('completed');
        }
      } else {
        begin = that.now();
      }
    }
    Ti.App.addEventListener('vibration_update', extendedCallback);
  },
  
  _stateCompleted: function() {
    Ti.App.fireEvent('vibrationStateCompleted');
  },
  
  _stateError: function() {
    Ti.App.fireEvent('vibrationStateError', "Not sure what's going on, there was an error.");
  }
}
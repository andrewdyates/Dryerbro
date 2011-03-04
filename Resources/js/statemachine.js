/* Dryer Bro
 * http://dryerbro.com
 * CSE 772 Capstone Project, The Ohio State University
 * 
 * Author: Eric Kerr
 * Email: EricPKerr [at] gmail [dot] com
 * URL: http://erickerr.com
 */

Ti.include("vibration.js");
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
  
  WAITING_SEQUENTIAL_ACTIVE_VIBRATIONS: 50, // Wait 5 seconds of active vibrations in waiting before moving to running
  RUNNING_SEQUENTIAL_ACTIVE_VIBRATIONS: 15, // Wait 15 seconds of active vibrations in running before moving to extended
  EXTENDED_SEQUENTIAL_INACTIVE_VIBRATIONS: 350, // Wait 35 seconds of inactive vibrations before moving to completed
  
  RUNNING_MAX_RESET_TRIES: 10, // Number of times to reset in running before throwing an error
  
  ACTIVE_VIBRATION_THRESHOLD: 20,
  
  _accelerometerHandler: null, // Pointer to accelerometer handler to remove later if necessary
  
  init: function(){
    message("INIT");
    this._accelerometerHandler = function(e){
      Vibration.push(e.x, e.y, e.z);
      message("X: " + e.x + " Y:" + e.y);
    };
    Ti.Accelerometer.addEventListener('update', this._accelerometerHandler);
    
    this.switchState('waiting');
  },
  
  switchState: function(state)
  {
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
  
  _stateWaiting: function(){
    // Wait until we get continuous vibration for 5 seconds before proceeding
    Ti.App.fireEvent('vibrationStateWaiting');
    
    var that = this, sequential = 0;
    
    var waitingCallback = function(v) {
      if(v >= that.ACTIVE_VIBRATION_THRESHOLD) {
        sequential++;
        if(sequential >= that.WAITING_SEQUENTIAL_ACTIVE_VIBRATIONS) {
          Ti.App.removeEventListener('vibration_updated', waitingCallback);
          //Vibration.removeHandler(waitingCallback);
          that.switchState('running');
        }
      } else {
        sequential = 0;
      }
    }
    Ti.App.addEventListener('vibration_updated', waitingCallback);
    //Vibration.addHandler(waitingCallback);
  },
  
  _stateRunning: function(){
    // Must have vibrations for 15 consecutive seconds, then it goes into extended mode.
    // If 10 resets are reached, then it will throw an error.
    Ti.App.fireEvent('vibrationStateRunning');
    
    var that = this, sequential = 0, sequentialResets = 0;
    
    var runningCallback = function(v) {
      if(v >= that.ACTIVE_VIBRATION_THRESHOLD) {
        sequential++;
        if(sequential >= that.RUNNING_SEQUENTIAL_ACTIVE_VIBRATIONS) {
          //Vibration.removeHandler(runningCallback);
          Ti.App.removeEventListener('vibration_updated', runningCallback);
          that.switchState('extended');
        }
      } else {
        sequential = 0;
        sequentialResets++;
        if(sequentialResets >= that.RUNNING_MAX_RESET_TRIES) {
          //Vibration.removeHandler(runningCallback);
          Ti.App.removeEventListener('vibration_updated', runningCallback);
          that.switchState('error');
        }
      }
    }
    //Vibration.addHandler(runningCallback);
    Ti.App.addEventListener('vibration_updated', runningCallback);
  },
  
  _stateExtended: function(){
    // Dryer has been opperating for at least 20 consecutive seconds.
    // This waits for 35 consecutive seconds of the dryer being off, then the dryer is done.
    Ti.App.fireEvent('vibrationStateExtended');
    
    var that = this, sequential = 0;
    
    var extendedCallback = function(v) {
      if(v < that.ACTIVE_VIBRATION_THRESHOLD) {
        sequential++;
        if(sequential >= that.EXTENDED_SEQUENTIAL_INACTIVE_VIBRATIONS) {
          //Vibration.removeHandler(extendedCallback);
          Ti.App.removeEventListener('vibration_updated', extendedCallback);
          that.switchState('completed');
        }
      } else {
        sequential = 0;
      }
    }
    //Vibration.addHandler(extendedCallback);
    Ti.App.addEventListener('vibration_updated', extendedCallback);
  },
  
  _stateCompleted: function(){
    Ti.App.fireEvent('vibrationStateCompleted');
  },
  
  _stateError: function(){
    Ti.App.fireEvent('vibrationStateError', "Not sure what's going on, there was an error.");
  }
}
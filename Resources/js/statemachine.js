Ti.include("vibration.js");

var StateMachine = {
  _state: 0,
  _states: [
    'waiting', // Waiting for Dryer to start
    'running', // Dryer has started running
    'extended', // Dryer has been running for an extended period of time
    'completed' // Dryer has stopped after running for an extended period of time
  ],
  
  _vibrationHandler: null, // Pointer to vibration handler to remove later if necessary
  _accelerometerHandler: null, // Pointer to accelerometer handler to remove later if necessary
  
  init: function(){
    this._accelerometerHandler = function(e){
      Vibration.push(e.x, e.y, e.z);
    };
    Ti.Accelerometer.addEventListener('update', this._accelerometerHandler);
    
    this._vibrationHandler = function(v){
      Ti.App.fireEvent('vibration', v);
    };
    Vibration.addHandler(this._vibrationHandler);
    
    this.switchState('waiting');
  },
  
  switchState: function(state)
  {
    if(state.constructor === String){ // Switching by name
      stateIndex = this._states.indexOf(state);
      if(stateIndex < 0) {
        Ti.API.info("Error: Invalid State (" + stateIndex + " => " + state + ")");
        return;
      }
      this._state = stateIndex;
    } else if(state.constructor === Number){ // Switching by index
      this._state = state;
      state = this._states[state];
    } else {
      Ti.API.info("Error: Invalid State (Should be String or Number) => " + state);
      return;
    }
    this['_state' + state.charAt(0).toUpperCase() + state.slice(1)]();
  },
  
  _stateWaiting: function(){
    
  },
  
  _stateRunning: function(){
    
  },
  
  _stateExtended: function(){
    
  },
  
  _stateCompleted: function(){
    
  }
}
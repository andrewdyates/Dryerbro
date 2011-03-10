/* Dryer Bro
 * http://dryerbro.com
 * CSE 772 Capstone Project, The Ohio State University
 * 
 * Author: Eric Kerr
 * Email: EricPKerr [at] gmail [dot] com
 * URL: http://erickerr.com
 */

Ti.include("libs/json.js");
Ti.include("libs/md5.js");
Ti.include("UI.message.js");
Ti.include("UI.helper.js");
Ti.include("statemachine.js");
Ti.include("persons.js");
Ti.include("db.js");

var win = Titanium.UI.currentWindow;

var persons = new Persons();

var tf = Titanium.UI.createTextArea({
    value: "Chill, we're waiting on your dryer...",
    backgroundColor: '#FFF',
    height: 150,
    width: 296,
    top: 14,
    font:{fontSize:17, fontFamily:'Helvetica Neue'},
    color: '#535353',
    textAlign: 'left',
    editable: false,
    enabled: false,
    borderRadius: 8,
    borderColor: '#4a91e6',
    borderWidth: 1,
    zIndex: 10
});
win.add(tf);

var tf_label = Titanium.UI.createTextField({
  font:{fontSize:14, fontFamily:'Helvetica Neue', fontWeight:'bold'},
  color: '#FFF',
  textAlign: 'left',
  editable: false,
  enabled: false,
  left: 20,
  top: 168,
  height: 20,
  value: 'Dryer Status'
});
win.add(tf_label);

var vib_label = Titanium.UI.createTextField({
  font:{fontSize:14, fontFamily:'Helvetica Neue', fontWeight:'bold'},
  color: '#a9eaff',
  textAlign: 'right',
  editable: false,
  enabled: false,
  right: 20,
  top: 168,
  height: 20,
  value: ''
});
win.add(vib_label);

Ti.App.addEventListener('vibration_update', function(v){
  vib_label.value = Math.round(v.vibration);
});

var action = Titanium.UI.createButton({
  color: '#FFF',
  backgroundImage:'../images/btn_red_off.png',
  backgroundSelectedImage:'../images/btn_red_on.png',
  backgroundDisabledImage: '../images/btn_red_off.png',
  top: 342,
  width: 301,
  height: 57,
  font: {fontSize:20,fontWeight:'bold',fontFamily:'Helvetica Neue'},
  title:'Cancel Tracking'
});
win.add(action);

action.addEventListener('click', function(){
  win.close();
});

var listeners = {
  'vibrationStateWaitingDelay': function(){
    var h = helper('tip', 'Pro Tip', 'Put device on dryer, let it do work.');
    h.top = 166;
    win.add(h);
    h.show();
    setTimeout(function(){ h.hide(); }, 6000);
  },
  
  'vibrationStateWaiting': function(){
    tf.value = "Chill, we're waiting on your dryer...";
    win.setTitle('Waiting');
  },
  
  'vibrationStateRunning': function(){
    tf.value = "Dryer's good to go. We'll just check that everything is running OK for a little bit, and then you'll be fresh in no time.";
    win.setTitle('Running');
  },
  
  'vibrationStateExtended': function(){
    tf.value = "Dryer's running great bro.";
    win.setTitle('Running');
  },
  
  'vibrationStateCompleted': function(){
    tf.value = "Pretty sure dryer's done, dude.";
    win.setTitle('Completed');
    persons.load();
    var xhr = Titanium.Network.createHTTPClient();
    xhr.onload = function(){
      tf.value = "Pretty sure dryer's done, dude. Errbody's been notified.";
    };
    xhr.onerror = function(){};
    var people = JSON.stringify(persons.persons);
    var hash = md5(Keys.salt + people);
    xhr.open("GET", 'http://dryerbro.com/gateway.php?hash=' + hash + '&data=' + people + '&message=' + DB.get('message'));
    xhr.send();
  },
  
  'vibrationStateError': function(message){
    tf.value = "Not sure what's going on, there was an error. Press \"Cancel Tracking\" and try again.";
  }
}

for(var evt in listeners) {
  var handler = listeners[evt];
  Ti.App.addEventListener(evt, handler);
}

// make sure we unlisten on the way out
win.addEventListener('close', function() {
  for(var evt in listeners) {
    var handler = listeners[evt];
    Ti.App.removeEventListener(evt, handler);
  }
});

StateMachine.init(win);
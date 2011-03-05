/* Dryer Bro
 * http://dryerbro.com
 * CSE 772 Capstone Project, The Ohio State University
 * 
 * Author: Eric Kerr
 * Email: EricPKerr [at] gmail [dot] com
 * URL: http://erickerr.com
 */

Ti.include("UI.message.js");
Ti.include("statemachine.js");
Ti.include("persons.js");

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

Ti.App.addEventListener('vibrationStateWaiting', function(){
  tf.value = "Chill, we're waiting on your dryer...";
});

Ti.App.addEventListener('vibrationStateRunning', function(){
  tf.value = "Dryer's good to go.  You'll be fresh in no time.";
});

Ti.App.addEventListener('vibrationStateExtended', function(){
  tf.value = "Dryer's running great bro.";
});

Ti.App.addEventListener('vibrationStateCompleted', function(){
  tf.value = "Pretty sure dryer's done, dude.";
  persons.load();
  var message = Titanium.App.Properties.getString('message');
  persons.dispatchNotifications(message, function(t){
    tf.value = t;
    //tf.value = "Pretty sure dryer's done, dude. Your bros have been notified."
  });
});

Ti.App.addEventListener('vibrationStateError', function(message){
  tf.value = "Not sure what's going on, there was an error.";
});

StateMachine.init();

/*
var sms_demo = Titanium.UI.createButton({title: 'SMS'});
win.rightNavButton = sms_demo;

sms_demo.addEventListener('click', function(){
  var xhr = Titanium.Network.createHTTPClient();
  xhr.onload = function(){
    tf.value = 'SMS Sent!';
  };
  xhr.onerror = function(){};
  xhr.open("GET",'http://erickerr.com/dryerbro/gateway.php?hash=98becb860b65396dfbaa0bab81096254&data=[{"number":"7408159478"},{"number":"2163751978"}]');
  xhr.send();
});
*/
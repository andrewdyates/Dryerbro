Ti.include("UI.message.js");
Ti.include("statemachine.js");

var win = Titanium.UI.currentWindow;

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
});

Ti.App.addEventListener('vibrationStateError', function(){
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
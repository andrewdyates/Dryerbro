Ti.include("message.js");
Ti.include("persons.js");

String.prototype.pluralize = function(count) {
  return count == 1 ? (count + ' ' + this) : (count + ' ' + this + 's');
}

var win = Titanium.UI.currentWindow;
var persons = new Persons();

tf_default = "Hey bro, laundry's done!";
tf_value = Titanium.App.Properties.getString("message");
if(tf_value == null || tf_value.length == 0){
  tf_value = tf_default;
}

var tf = Titanium.UI.createTextArea({
    value: tf_value,
    backgroundColor: '#FFF',
    height: 100,
    width: 296,
    top: 14,
    font:{fontSize:17, fontFamily:'Helvetica Neue'},
    color: '#535353',
    textAlign: 'left',
    appearance: Titanium.UI.KEYBOARD_APPEARANCE_ALERT,
    keyboardType: Titanium.UI.KEYBOARD_ASCII,
    borderRadius: 8,
    borderColor: '#4a91e6',
    borderWidth: 1,
    duration: 700,
    zIndex: 10
});
win.add(tf);

tf.addEventListener('focus', function(){
  if(tf.value == tf_default) tf.value = '';
  action.hide();
  tf.height = 172;
});
tf.addEventListener('blur', function(){
  if(tf.value == '') tf.value = tf_default;
  action.show();
  Titanium.App.Properties.setString("message", tf.value)
  tf.height = 100;
});
tf.show();

var bros = Titanium.UI.createView({
  width: 296,
  height: 50,
  top: 130,
  touchEnabled: true,
  backgroundColor: '#FFF',
  borderRadius: 8,
  borderColor: '#4a91e6',
  borderWidth: 1
});
win.add(bros);

var bros_label = Titanium.UI.createTextField({
  font:{fontSize:17, fontFamily:'Helvetica Neue', fontWeight:'bold'},
  color: '#000',
  editable: false,
  enabled: false,
  left: 10,
  value: 'Nofifying'
});
bros.add(bros_label);

var bros_count = Titanium.UI.createTextField({
  font:{fontSize:16, fontFamily:'Helvetica Neue'},
  color: '#395587',
  textAlign: 'right',
  editable: false,
  enabled: false,
  right: 26,
  value: 'bro'.pluralize(persons.length)
});
bros.add(bros_count);

Ti.App.addEventListener('personsChange', function(){
  persons.load(); //Reload
  Ti.API.info("EVENT personsChange")
  bros_count.setValue('bro'.pluralize(persons.length));
});

var bros_arrow = Titanium.UI.createView({
  width: 10,
  height: 15,
  right: 10,
  backgroundImage: '../images/bg_arrow.png'
});
bros.add(bros_arrow);

bros.addEventListener('click', function(){
  old_bg = bros.backgroundColor;
  old_bc = bros.borderColor;
  old_cc = bros_count.color;
  old_lc = bros_label.color;
  
  bros.backgroundColor = '#0b2a55';
  bros.borderColor = '#051429';
  bros_count.color = '#FFF';
  bros_label.color = '#FFF';
  
  var editwin = Titanium.UI.createWindow({
    url: 'window.list.js',
    id: 'editwin1',
    title: 'Notified Bros',
    barColor: '#0b2a55',
    top: 0,
    left: 0,
    tabBarHidden: true,
    backgroundImage: '../images/bg_body_list.png',
    zIndex: 2
  });
  
  Titanium.UI.currentTab.open(editwin);
  
  setTimeout(function(){
    bros.backgroundColor = old_bg;
    bros.borderColor = old_bc;
    bros_count.color = old_cc;
    bros_label.color = old_lc;
  }, 600);
});



var action = Titanium.UI.createButton({
  color: '#FFF',
  backgroundImage:'../images/btn_green_off.png',
  backgroundSelectedImage:'../images/btn_green_on.png',
  backgroundDisabledImage: '../images/btn_green_off.png',
  top: 342,
  width: 301,
  height: 57,
  font: {fontSize:20,fontWeight:'bold',fontFamily:'Helvetica Neue'},
  title:'Start Tracking, Bro'
});
win.add(action);

action.addEventListener('click', function(){
  var runningwin = Titanium.UI.createWindow({
    url: 'window.running.js',
    id: 'runningwin1',
    title: 'Running',
    barColor: '#0b2a55',
    top: 0,
    left: 0,
    tabBarHidden: true,
    backgroundImage: '../images/bg_body_main.png',
    zIndex: 2
  });
  Titanium.UI.currentTab.open(runningwin);
});

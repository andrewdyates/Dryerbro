/* Dryer Bro
 * http://dryerbro.com
 * CSE 772 Capstone Project, The Ohio State University
 * 
 * Author: Eric Kerr
 * Email: EricPKerr [at] gmail [dot] com
 * URL: http://erickerr.com
 */

var messageWin = Titanium.UI.createWindow({
  height:30,
  width:250,
  bottom:70,
  borderRadius:10,
  touchEnabled:false,
  zIndex:10,
  orientationModes : [
    Titanium.UI.PORTRAIT,
    Titanium.UI.UPSIDE_PORTRAIT,
    Titanium.UI.LANDSCAPE_LEFT,
    Titanium.UI.LANDSCAPE_RIGHT
  ]
});
var messageView = Titanium.UI.createView({
  id:'messageview',
  height:30,
  width:250,
  borderRadius:10,
  backgroundColor:'#000',
  opacity:0.7,
  touchEnabled:false
});

var messageLabel = Titanium.UI.createLabel({
  id:'messagelabel',
  text:'',
  color:'#fff',
  width:250,
  height:'auto',
  font:{
    fontFamily:'Helvetica Neue',
    fontSize:13
  },
  textAlign:'center'
});
messageWin.add(messageView);
messageWin.add(messageLabel);

var messageTimeout = null;

function message(msg, duration){
  Ti.API.debug('message (debug): ' + msg);
  Ti.API.info('message (info): ' + msg);
  messageLabel.text = msg;
  messageWin.open();
  if(messageTimeout) clearTimeout(messageTimeout);
  messageTimeout = setTimeout(function(){
    messageTimeout = null;
    messageWin.close({
      opacity:0,
      duration:500
    });
  }, duration || 2000);
}
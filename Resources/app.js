/* Dryer Bro
 * http://dryerbro.com
 * CSE 772 Capstone Project, The Ohio State University
 * 
 * Author: Eric Kerr
 * Email: EricPKerr [at] gmail [dot] com
 * URL: http://erickerr.com
 */

var tabGroup = Titanium.UI.createTabGroup({id:'tabGroup1'});

var netConnected = Ti.Network.online;

var winmain = Titanium.UI.createWindow({
  url: 'js/window.main.js',
  id: 'win1',
  title: 'DryerBro',
  barColor: '#0b2a55',
  top: 0,
  left: 0,
  tabBarHidden: true,
  backgroundImage: 'images/bg_body_main.png',
  zIndex: 1
});

var tab1 = Titanium.UI.createTab({
  id: 'tab1',
  window: winmain
});

tabGroup.addTab(tab1);

tabGroup.open({
  transition:Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
});

if (! netConnected) {
  alert("Hey bro, ya need internets to tell bros bout laundry.");
}
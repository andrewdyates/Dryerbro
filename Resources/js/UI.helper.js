/* Dryer Bro
 * http://dryerbro.com
 * CSE 772 Capstone Project, The Ohio State University
 * 
 * Author: Eric Kerr
 * Email: EricPKerr [at] gmail [dot] com
 * URL: http://erickerr.com
 */

function helper(type, headingText, descText)
{
  var elem = Ti.UI.createView({
    backgroundImage: '../images/bg_helper_' + type + '.png',
    zIndex: 10,
    width: 299,
    height: 77,
    visible: false
  });
  
  var header = Ti.UI.createLabel({
    color:'#FFF',
    font:{fontSize:17, fontWeight:'bold', fontFamily:'Helvetica Neue'},
    height: 17,
    left: 64,
    top: 25,
    text: headingText
  });
  elem.add(header);
  
  var desc = Ti.UI.createLabel({
    color:'#a2aaaf',
    font:{fontSize:13, fontFamily:'Helvetica Neue'},
    height: 13,
    left: 64,
    top: 46,
    text: descText
  });
  elem.add(desc);
  
  return elem;
}
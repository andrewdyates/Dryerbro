/* Dryer Bro
 * http://dryerbro.com
 * CSE 772 Capstone Project, The Ohio State University
 * 
 * Author: Eric Kerr
 * Email: EricPKerr [at] gmail [dot] com
 * URL: http://erickerr.com
 */

var DB = {
  get: function(key, deft) {
    var val = Titanium.App.Properties.getString(key);
    return val != null ? val : (deft || null);
  },
  
  set: function(key, value) {
    Titanium.App.Properties.setString(key, value);
  }
};
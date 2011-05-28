Function.prototype.bind = function( obj ) {
  var slice = [].slice,
    args = slice.call(arguments, 1), 
    self = this, 
    nop = function () {}, 
    bound = function () {
      return self.apply( this instanceof nop ? this : ( obj || {} ), 
                args.concat( slice.call(arguments) ) );  
    };
  
  nop.prototype = self.prototype;
  
  bound.prototype = new nop();
  
  return bound;
};

String.prototype.pluralize = function(count) {
  return count + ' ' + this + (count == 1 ? '' : 's');
};

Array.prototype.random = function(){
  return this[Math.floor(Math.random() * this.length)];
};

Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

//https://github.com/appcelerator/KitchenSink/blob/master/Resources/examples/version.js
function isiOS4Plus(){
  if (Titanium.Platform.name == 'iPhone OS'){
    var version = Titanium.Platform.version.split(".");
    var major = parseInt(version[0]);
    if (major >= 4) return true;
  }
  return false;
}
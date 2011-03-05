/* Dryer Bro
 * http://dryerbro.com
 * CSE 772 Capstone Project, The Ohio State University
 * 
 * Author: Eric Kerr
 * Email: EricPKerr [at] gmail [dot] com
 * URL: http://erickerr.com
 */

Ti.include("libs/json.js");
Ti.include("keys.js");
Ti.include("db.js");

function Persons(){
  this.persons = [];
  this.keyProperty = "persons";
  this.load();
  return this;
}

Persons.prototype.demo = function(){
  this.persons = [{
    name: 'Eric Kerr',
    method: 'call',
  },{
    name: 'Ben Gilbert',
    method: 'sms'
  },{
    name: 'Drew Yates',
    method: 'mail'
  },{
    name: 'Eric Kerr',
    method: 'sms'
  }];
  this.persons = this.persons.length;
  return this;
}

Persons.prototype._isDuplicatePerson = function(person){
  for(var i = 0, len = this.persons.length; i < len; i++){
    var compare = this.get(i);
    if(person.name == compare.name &&
      person.method == compare.method &&
      person.handle == compare.handle)
        return true;
  }
  return false;
}

Persons.prototype.load = function(){ //Database Load
  var persons = DB.get(this.keyProperty, "[]");
  this.persons = JSON.parse(persons);
  this.length = this.persons.length;
  return this;
}

Persons.prototype.save = function(){ //Database Save
  DB.set(this.keyProperty, JSON.stringify(this.persons))
  return this;
}

Persons.prototype.add = function(person){
  if(!this._isDuplicatePerson(person)){
    this.persons.push(person);
    this.length = this.persons.length;
    this.save();
    Ti.App.fireEvent("personsChange");
  }
  return this;
}

Persons.prototype.remove = function(index){
  this.persons.remove(index);
  this.length = this.persons.length;
  this.save();
  Ti.App.fireEvent("personsChange");
  return this;
}

Persons.prototype.get = function(index){
  return this.persons[index] || null;
}
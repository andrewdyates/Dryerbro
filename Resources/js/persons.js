Ti.include("libs/json.js");
Ti.include("libs/md5.js");

function Persons(){
  this.persons = [];
  this.keyProperty = "persons";
  this.load();
  return this._finalize();
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
  return this._finalize();
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

Persons.prototype._finalize = function(){
  this.length = this.persons.length;
  this.save();
  return this;
}


Persons.prototype.load = function(){ //Database Load
  var persons = Titanium.App.Properties.getString(this.keyProperty);
  if(persons == null || persons.length == 0) persons = "[]";
  this.persons = JSON.parse(persons);
  return this._finalize();
}

Persons.prototype.save = function(){ //Database Save
  Titanium.App.Properties.setString(this.keyProperty, JSON.stringify(this.persons));
  return this;
}

Persons.prototype.add = function(person){
  if(!this._isDuplicatePerson(person)){
    this.persons.push(person);
    Ti.App.fireEvent("personsChange");
  }
  return this._finalize();
}

Persons.prototype.remove = function(index){
  this.persons.remove(index);
  Ti.App.fireEvent("personsChange");
  return this._finalize();
}

Persons.prototype.get = function(index){
  return this.persons[index] || null;
}

function reportPersons(){
  Titanium.API.info("Persons: " + Titanium.App.Properties.getString("persons"));
}

setInterval(reportPersons, 5000);
reportPersons();
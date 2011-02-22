function Persons(){
  this.persons = [];
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
    if(person.name == compare.name && person.method == compare.method) return true;
  }
  return false;
}

Persons.prototype._finalize = function(){
  this.length = this.persons.length;
  return this;
}


Persons.prototype.load = function(){ //Database Load
  //TODO(eric);
  return this._finalize();
}

Persons.prototype.save = function(){ //Database Save
  //TODO(eric)
  return this._finalize();
}

Persons.prototype.add = function(person){
  if(!this._isDuplicatePerson(person)){
    this.persons.push(person);
  }
  return this._finalize();
}

Persons.prototype.remove = function(index){
  this.persons.remove(index);
  return this._finalize();
}

Persons.prototype.get = function(index){
  return this.persons[index];
}
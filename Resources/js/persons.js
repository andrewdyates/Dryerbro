function Persons(){
  this.persons = [];
  return this.finalize();
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
  return this.finalize();
}

Persons.prototype.load = function(){ //Database Load
  //TODO(eric);
  return this.finalize();
}

Persons.prototype.save = function(){ //Database Save
  //TODO(eric)
  return this.finalize();
}

Persons.prototype.add = function(person){
  this.persons.add(person);
  return this.finalize();
}

Persons.prototype.remove = function(index){
  this.persons.remove(index);
  return this.finalize();
}

Persons.prototype.finalize = function(){
  this.length = this.persons.length;
  return this;
}

Persons.prototype.get = function(index){
  return this.persons[index];
}
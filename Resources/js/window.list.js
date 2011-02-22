Ti.include("message.js");
Ti.include("persons.js");

Array.prototype.random = function(){
  return this[Math.floor(Math.random() * this.length)];
}

Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

var win = Titanium.UI.currentWindow;

var btn_add = Titanium.UI.createButton({title: 'Add'});
win.rightNavButton = btn_add;

btn_add.addEventListener('click', function(){
  var methods = {
    selectedProperty: function(e) {
      var person = {
        name: e.person.fullName
      }
      if(e.property == 'iphone' || e.property == 'phone') {
        person.number = e.value;
        var dialog = Titanium.UI.createOptionDialog({
          options:['Call: ' + e.value, 'SMS: ' + e.value],
          title: 'Bro, how you tryina shout?'
        });
        dialog.addEventListener('click',function(e){
          if(e.index == 0){
            person.method = 'call';
          } else {
            person.method = 'sms';
          }
          persons.add(person);
          renderTable();
        });
        dialog.show();
      } else if(e.property == 'email'){
        person.method = 'mail';
        person.mail = e.value;
        persons.add(person);
        renderTable();
      } else {
        return; // ERROR
      }
    }
  };
  Titanium.Contacts.showContacts(methods);
});

function buildRow(person){
  
  person = person || {
    name: 'Eric Kerr',
    method: ['call', 'sms', 'mail'].random()
  }
  
  var row = Ti.UI.createTableViewRow();
  row.borderColor = '#8dbcef';
  row.height = 45;
  
  var user = Ti.UI.createLabel({
    color:'#000',
    font:{fontSize:19, fontWeight:'bold', fontFamily:'Helvetica Neue'},
    left: 38,
    top: 7,
    height: 30,
    width: 200,
    text: person.name
  });
  row.add(user);
  
  var icon = Ti.UI.createView({
    backgroundImage: '../images/icon_' + person.method + '.png',
    right: 10,
    width: 28,
    height: 28
  });
  row.add(icon);
  
  var remove = Ti.UI.createView({
    backgroundImage: '../images/btn_remove.png',
    left: 4,
    width: 28,
    height: 28
  });
  row.add(remove);
  
  return row;
}

var table = Titanium.UI.createTableView({
  data:[],
  backgroundColor: 'transparent',
  backgroundRowColor: 'transparent',
  borderColor: '#8dbcef'
});

table.addEventListener('click', function(e){
  var rowIndex = e.index, person = persons.get(e.index);
  var method = {
    'call': 'Call',
    'sms': 'SMS',
    'mail': 'Mail'
  }[person.method];
  
  var alert = Titanium.UI.createAlertDialog({
    title: person.name + ' (' + method + ')',
    message: 'Do you want to remove this bro?',
    buttonNames: ['Cancel','OK']
  });
  alert.addEventListener('click', function(e){
    if(e.index == 0) return; //They canceled
    table.deleteRow(rowIndex);
    persons.remove(rowIndex).save();
  });
  alert.show();
});

win.add(table);

var persons = (new Persons()).demo();

function renderTable(){
  var
    tableRows = [],
    len = persons.length;
  
  for(var i = 0; i<len; i++)
    tableRows.push(buildRow(persons.get(i)));
  
  table.setData(tableRows);
}

renderTable();
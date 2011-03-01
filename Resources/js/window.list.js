Ti.include("UI.message.js");
Ti.include("UI.helper.js");
Ti.include("persons.js");
Ti.include("utils.js");

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
        person.handle = e.value;
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
        person.handle = e.value;
        persons.add(person);
        renderTable();
      } else {
        var err = Titanium.UI.createAlertDialog({
          title: 'Invalid Option',
          message: "You must choose a valid\nPhone Number or Email Address",
          buttonNames: ['OK, My Bad']
        });
        err.addEventListener('click', function(e){
          err.hide();
        });
        err.show();
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
  visible: false,
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
    persons.remove(rowIndex);
    updateTableVisibility();
  });
  alert.show();
});

win.add(table);

//var persons = (new Persons()).demo();
var persons = new Persons();

var addBroTip = helper('tip', 'Pro Tip', "Press Add to hook a bro up.");
addBroTip.top = 5;
win.add(addBroTip);

function renderTable(){
  var
    tableRows = [];
  
  for(var i = 0; i<persons.length; i++)
    tableRows.push(buildRow(persons.get(i)));
  
  table.setData(tableRows);
  
  updateTableVisibility();
}

function updateTableVisibility(){
  if(persons.length == 0) {
    table.hide();
    addBroTip.show();
  } else {
    table.show();
    addBroTip.hide();
  }
}

renderTable();
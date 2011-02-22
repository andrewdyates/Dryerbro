Ti.include("message.js");

Array.prototype.random = function(){
  return this[Math.floor(Math.random() * this.length)];
}

var win = Titanium.UI.currentWindow;

var btn_add = Titanium.UI.createButton({title: 'Add'});
win.rightNavButton = btn_add;

btn_add.addEventListener('click', function(){
  
});

var rows = [];

function buildRow(person){
  
  person = {
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

rows[0] = buildRow();
rows[1] = buildRow();
rows[2] = buildRow();
rows[3] = buildRow();

var table = Ti.UI.createTableView({
  data:rows,
  backgroundColor: 'transparent',
  backgroundRowColor: 'transparent',
  borderColor: '#8dbcef'
});

win.add(table);
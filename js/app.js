
'use strict';
var app = app || {}; // create namespace for our app

// var user = 'Test User';
window.user = 'SENDER';

// window.receiver = 'RECEIVER';
window.receiver = 'RECEIVER';


// instance of the Collection
app.messageList = new app.MessageList();


app.userList = new app.UserList();


//--------------
// Routers
//--------------

app.Router = Backbone.Router.extend({
  routes: {
    '*filter' : 'setFilter'
  },
  setFilter: function(params) {
    params = params || '';
    console.log('app.router.params = ' + params);
    window.filter = params.trim() || '';
    app.messageList.trigger('reset');
    app.userList.trigger('reset');
  }
});



//--------------
// Initializers
//--------------   

var init = function() {
  app.router = new app.Router();
  Backbone.history.start();    
  app.appView = new app.AppView();
  app.conView = new app.SidebarView();
  app.conView.render();
  app.appView.render();

  

  window.emojiPicker = new EmojiPicker({
  emojiable_selector: '[data-emojiable=true]',
  assetsPath: 'lib/img/',
  popupButtonClasses: 'fa fa-smile-o'
  });

  window.emojiPicker.discover();
}



var run = function() {  
  setInterval(function(){ 
    app.messageList.fetch();
    app.userList.fetch();
  }, 1000);
}

var addUser = function(newname, stat) {
  // HOW?
  var exists = false;

  app.userList.each(function(user){

    if (user.get('name') === newname) {
      exists = true;
      console.log('Found the user!');
    }
  });

  if (!exists) {
    app.userList.create({
      name: newname, 
      status: stat, 
      time: (new Date()).toTimeString().split(' ')[0]
    });
    console.log('Created new user: ' + newname);
  } 
  else {
    app.userList.each(function(user) {
       if (user.get('name') === newname) {
          user.destroy();
          console.log('Updated user: ' + newname);

          app.userList.create({
            name: newname, 
            status: stat, 
            time: (new Date()).toTimeString().split(' ')[0]
          });
       }
    }, this)
  }
}

var changeUser = function(username) {
  window.user = username;
  app.conView.render();
  app.appView.render();
}

// addUser(window.user);
// addUser(window.receiver);




$(document).ready(function(){
  $('.main_section').hide();

  $('.submitUser').on('click', function() {
    window.user = $('.inputText').val().toString();
    app.conView.render();
    app.appView.render();
  });

  $('.changeStatus').on('click', function(){
    var stat = $('.user-name').val().trim().toString();
    var myuser = app.userList.checkUser(window.user)[0].save({status: stat});

    app.statusView = new app.StatusView({model: app.userList.checkUser(window.user)[0]});

    app.statusView.render();

  });

  $('#signin').on('click', function(){
    

    var name = $('#inputusername').val().trim();
    var s = $('#inputstatus').val().trim();


    window.user = name;
    $('#username').html(window.user);

    $('#loginform').hide();
    $('.main_section').show();

    init();
    addUser(name, s);

    app.statusView = new app.StatusView({model: app.userList.checkUser(window.user)[0]});

    app.statusView.render();
    run();

  });

  $("#emo1").on('click', function(){
    var text = $('.form-control').val().trim();
    console.log(text);
  });




});
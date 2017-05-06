var app = app || {};

//--------------
// Models
//--------------
app.Message = Backbone.Model.extend({
  defaults: {
    title: '',
    completed: false,
    selected: false, 
    edited: false, 
    deleted: false,
    color: 'black',
    sender: ''
  },
  toggle: function(){
    this.save({ selected: !this.get('selected')});
  },
  // initialize: function() {
  //   this.time = (new Date()).toTimeString();
  //   console.log(this.time);
  // }
});

app.User = Backbone.Model.extend({
  defaults: {
    name: '', 
    status: '', 
    time: ''
  }
});

//--------------
// Collections
//--------------
app.MessageList = Backbone.Collection.extend({
  model: app.Message,
  //localStorage: new Store('backbone-chat'),
  // localStorage: new Backbone.LocalStorage("SomeCollection"),
  localStorage: function() {
    var storageName = window.user < window.receiver ? window.user + ' ' + window.receiver : window.receiver + ' ' + window.user;
    return new Store(storageName);
  }, 
  getSender: function() {
    return this.filter(function( message ) {
      return message.get('sender');
    });
  },
  getReceiver: function() {
    return this.filter(function( message ) {
      return message.get('receiver');
    });
  },
  selected: function() {
        return this.filter(function( message ) {
          return message.get('selected');
        });
      }
  // remaining: function() {
  //   return this.without.apply( this, this.completed() );
  // }      
});


app.UserList = Backbone.Collection.extend({
  model: app.User,

  localStorage: function() {
    return new Store('users');  
  },
  

  checkUser: function(name){
    return this.filter(function(user){
      return user.get('name') === name;
    });
  }, 

  notMe: function() {
    return this.filter(function(model){
        return model.get('name') !== window.user
      });
  }, 

  comparator: function(user) {
        return -user.get('time');
  }
});


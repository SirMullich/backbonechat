var app = app || {};

//--------------
// Views
//--------------

// renders individual message items list (li)
app.MessageView = Marionette.View.extend({
  template: '#message-template',
  tagName: 'li',
  //model: message,
  // template: _.template($('#item-template').html()),


  // render: function(){
  //   // this.$el.html(this.template(this.model.toJSON()));
  //   this.input = this.$('.edit');
  //   return this; // enable chained calls
  // },

  onRender: function(){
    // manipulate the `el` here. it's already
    // been rendered, and is full of the view's
    // HTML, ready to go.
    this.input = this.$('.edit');
    if (this.model.get('deleted')) {
      this.$el.find('p').addClass('deleted');
    }

    if (this.model.get('edited')) {
      this.$el.find('p').addClass('edited');
      console.log('in render of MessageView');
      //console.log(this.$el);
    }

    var msg = this.model.get('title');

    if (msg.startsWith("http")) {
      this.$el.find('p').addClass('link');
    } 

    if (this.model.get('selected')) {
      this.$el.addClass('selected');
    }

    switch(this.model.get('color')){
      case 'red':
        this.$el.addClass('redtext');
        break;
      case 'blue':
        this.$el.addClass('bluetext');
        break;
      case 'green':
        this.$el.addClass('greentext');
        break;
      default:
        break;
    }
  },

  ui: {
    paragraph: 'p',
  },


  initialize: function(){
    
    this.$el.addClass('left');
    this.$el.addClass('clearfix');
    this.model.on('change', this.render, this);
    this.model.on('mydestroy', this.remove, this); // remove: Convenience Backbone's function for removing the view from the DOM.
  },
  events: {
    'click' : 'select',
    'dblclick p' : 'edit',
    'keypress .edit' : 'updateOnEnter',
    'blur .edit' : 'close',
    'click .toggle': 'toggleCompleted',
    'click .destroy': 'mydestroy'
  },
  select: function() {
    this.model.toggle();
    console.log('sel: ' + this.model.get('selected'));
    if (this.model.get('selected')) {
      this.$el.addClass('selected');

    } 
    else {
      this.$el.removeClass('selected');
    }
    
  },
  edit: function(){
    this.$el.addClass('editing');
    // this.input.css('display', 'inline');
    this.input.focus();
    console.log('double click edit');
  },
  close: function(){
    console.log('in CLOSE');
    var value = this.input.val().trim();

    // SAVE changed value
    if(value) {
      this.model.save({title: value});
    }
    this.$el.removeClass('editing');
    this.model.save({edited: true});
    //reapply();
  },
  updateOnEnter: function(e){
    if(e.which == 13){
      this.close();
    }
  },
  toggleCompleted: function(){
    this.model.toggle();
  },

  mydestroy: function(){
    console.log('DESTROY was called');
    this.model.save({title: 'Message deleted.'});
    this.model.save({deleted: true});
    // this.model.destroy();
  }      
});




app.StatusView = Marionette.View.extend({
  template: '#status-template', 
  tagName: '<div>', 
  el: '.new_message_head', 
  

  ui: {
    paragraph: 'p',
    label: 'label'
  },

  events: {
    'dblclick #client' : 'edit',
    'keypress #nameinput' : 'updateOnEnter',
    'blur #nameinput' : 'close',

    'dblclick #clientstatus' : 'edit2',
    'keypress #statusinput' : 'updateOnEnter2',
    'blur #statusinput' : 'close2',
  }, 

  edit: function(){
    this.$el.addClass('editing');
    //this.$(label).css('display', 'none');
    this.nameinput.css('display', 'inline');
    this.nameinput.focus();
    console.log('double click edit');
  },
  close: function(){
    console.log('in CLOSE');
    var value = this.nameinput.val().trim();

    // SAVE changed value
    if(value) {
      this.model.save({name: value});
    }
    this.nameinput.css('display', 'none');
    this.$el.removeClass('editing');
    this.render();
  },
  updateOnEnter: function(e){
    if(e.which == 13){
      this.close();
    }
  },

  edit2: function(){
    this.$el.addClass('editing');
    //this.$(label).css('display', 'none');
    this.statusinput.css('display', 'inline');
    this.statusinput.focus();
    console.log('double click edit');
  },
  close2: function(){
    console.log('in CLOSE');
    var value = this.statusinput.val().trim();

    // SAVE changed value
    if(value) {
      this.model.save({status: value});
    }
    this.statusinput.css('display', 'none');
    this.$el.removeClass('editing');
    this.render();
  },

  updateOnEnter2: function(e){
    if(e.which == 13){
      this.close2();
    }
  },






  onRender: function(){
    this.nameinput = this.$('#nameinput');
    this.statusinput = this.$('#statusinput');
    console.log('On Render status');
  }

});


app.ConversationView = Marionette.View.extend({
  template: '#conversation-template',
  tagName: 'li',
  //model: message,
  // template: _.template($('#item-template').html()),


  // render: function(){
  //   // this.$el.html(this.template(this.model.toJSON()));
  //   this.input = this.$('.edit');
  //   return this; // enable chained calls
  // },

  onRender: function(){
  },

  ui: {
    paragraph: 'p',
    span: 'span'
  },


  initialize: function(){
    this.$el.addClass('left');
    this.$el.addClass('clearfix');
    this.model.on('change', this.render, this);
    this.model.on('destroy', this.remove, this); // remove: Convenience Backbone's function for removing the view from the DOM.
  },
  events: {
    'click .primary-font': 'loadChat',
    'click .delete-chat': 'deleteChat'
    //'click .destroy': 'destroy'
  },

  loadChat: function(){
    window.receiver = this.model.get('name');
    // app.appView = new app.AppView();
    app.appView.render();
  },

  deleteChat: function() {
    console.log('in Chat-Destroy');
    
    var model;

    while (model = app.messageList.first()) {
      model.destroy();
    }
    app.appView.render();
    this.render();
  },
  // ,
  // destroy: function(){
  //   this.model.save({title: 'Message deleted.'});
  //   this.model.save({deleted: true});
  //   // this.model.destroy();
  // }      
});

var chat = Marionette.CollectionView.extend({
    tagName: 'div',
    childView: app.MessageView
  });

var cons = Marionette.CollectionView.extend({
  tagName: 'div', 
  childView: app.ConversationView
});

// renders the full list of message items calling MessageView for each one.
app.AppView = Marionette.View.extend({
  el: '.chat_area',
  template: '#chat-template',

  regions: {
      messages: '.messages-list'
    },

  ui: {
    input: 'textarea',
    submit: 'button',
    list: 'ul', 
    img: 'img',
    span: 'span'
  },

  initialize: function () {
    app.messageList.on('add', this.addAll, this);
    app.messageList.on('reset', this.addAll, this);
    app.messageList.fetch(); // Loads list from local storage
  },
  events: {
    'keypress #new-message': 'createMessageOnEnter', 
    'click #red': 'paintred', 
    'click #blue': 'paintblue', 
    'click #green': 'paintgreen', 
    'click #black': 'paintblack',
    'click #delete': 'delete',
    'click @ui.submit': function(){
        // var text = window.user + ': ';
        var text = this.ui.input.val().trim();
        console.log('inside SUBMIT now ' + text);
        this.getChildView('messages')
          .collection
          .create({
            title: text, 
            completed: false,
            edited: false, 
            deleted: false,
            selected: false, 
            time: (new Date()).toTimeString().split(' ')[0], 
            sender: window.user, 
            receiver: window.receiver
          });
        // REAPPLY CSS
        //reapply();
        this.ui.input.val('');
      }
  },

  delete: function(){
    console.log('in destroy');
    app.messageList.each(function(model){
      if (model.get('selected')) {
        model.save({title: 'Message deleted.'});
        model.save({deleted: true});
      }
    });
  },

  paintred: function() {
    app.messageList.each(function(model){
      if (model.get('selected')) {model.set({color: 'red'});}
    });
  },

  paintblue: function() {
    app.messageList.each(function(model){
      if (model.get('selected')) {model.set({color: 'blue'});}
    });
  },

  paintgreen: function() {
    app.messageList.each(function(model){
      if (model.get('selected')) {model.set({color: 'green'});}
    });
  },

  paintblack: function() {
    app.messageList.each(function(model){
      if (model.get('selected')) {model.set({color: 'black'});}
    });
  },

  addOne: function(message){
    var view = new app.MessageView({model: message});
    this.ui.list.append(view.render().el);
  },

  addAll: function(){
    this.ui.list.html(''); // clean the message list
    //this.$el.html(''); // clean the message list
    console.log('addAll was called');
    // filter message item list

    app.messageList.each(function(message) {
       var view = new app.MessageView({ model: message });
       // console.log(message);

       this.ui.list.append(view.render().el);

      //
       // if ((message.get('sender') === window.user && message.get('receiver') === window.receiver) || (message.get('sender') === window.receiver && message.get('receiver') === window.user)) {
       //    //   console.log('sender = ' + message.get('sender'));
       //    //  console.log('receiver = ' + message.get('receiver'));
       //    //  console.log('current user = ' + window.user);
       //    //  console.log('current receiver = ' + window.receiver);
       //    // console.log('in stupid if...');
       //    this.ui.list.append(view.render().el);
       // }
       
    }, this)

    // switch(window.filter){
    //   case 'pending':
    //     _.each(app.messageList.remaining(), this.addOne);
    //     break;
    //   case 'completed':
    //     _.each(app.messageList.completed(), this.addOne);
    //     break;            
    //   default:
    //     app.messageList.each(this.addOne, this);
    //     break;
    // }
  },
  onRender: function(){
      console.log('appView onRender');
      //app.messageList.reset();
      app.messageList.fetch();
      this.showChildView('messages', new chat({
        collection: app.messageList
      }));
      this.addAll();
      $('#username').html(window.user);


      window.emojiPicker = new EmojiPicker({
        emojiable_selector: '[data-emojiable=true]',
        assetsPath: 'lib/img/',
        popupButtonClasses: 'fa fa-smile-o'
      });
      window.emojiPicker.discover();
    },

  newAttributes: function(){
    return {
      title: '', 
      completed: false,
      edited: false, 
      deleted: false, 
      time: (new Date()).toTimeString().split(' ')[0], 
      sender: window.user, 
      receiver: window.receiver
    }
  }
});

// renders sidebar
app.SidebarView = Marionette.View.extend({
  el: '.member_list',
  template: '#sidebar-template', 

  regions: {
    conversations: '.chat-list'
  },

  ui: {
    list: 'ul'
  }, 

  initialize: function () {
    app.userList.on('add', this.addAllCons, this);
    app.userList.on('reset', this.addAllCons, this);
    app.userList.fetch(); // Loads list from local storage
  },

  events: {

  }, 


  // addAllCons: function() {
  //   this.ui.list.html(''); // clean the message list
  //   //this.$el.html(''); // clean the message list
  //   console.log('addAllCons was called');
  //   // filter message item list

  //   app.messageList.each(function(message) {
  //      var view = new app.ConversationView({ model: message });
  //      // console.log(message);
  //      console.log('sender = ' + message.sender);
  //       console.log(window.user);
  //      if (()) {
  //         console.log('In If adding conversation');
  //         this.ui.list.append(view.render().el);
  //      }
       
  //   }, this)
  // },
  populate: function(userName) {
    window.user = userName;
    this.getChildView('conversations')
          .collection
          .create({
            name: userName
          });
  },

  addAllCons: function(){
    this.ui.list.html(''); // clean the message list
    //this.$el.html(''); // clean the message list
    console.log('addAllCons was called');
    // filter message item list

    app.userList.each(function(user) {
       var view = new app.ConversationView({ model: user });
       // console.log(message);

      //
       if (user.get('name') != window.user) {
          //   console.log('sender = ' + message.get('sender'));
          //  console.log('receiver = ' + message.get('receiver'));
          //  console.log('current user = ' + window.user);
          //  console.log('current receiver = ' + window.receiver);
          // console.log('in stupid if...');
          this.ui.list.append(view.render().el);
       }
       
    }, this)
  },

  onRender: function(){
      console.log('conversationView onRender');
      app.userList.fetch();
      // app.userList.each(function(model, index){
      //   if (model.get('name') !== window.user) {
      //   } else {
      //     return model;
      //   }
      // });

      // HOW?

      this.showChildView('conversations', new cons({
        collection: app.userList
      }));

      this.addAllCons();

      $('#username').html(window.user);
    }

});




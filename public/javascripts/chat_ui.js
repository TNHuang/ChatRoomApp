(function () {
  if(typeof ChatApp === "undefined"){
    window.ChatApp = {};
  }
  var socket = io();
  var chat = new ChatApp.Chat(socket);

  var ChatUi = ChatApp.ChatUi = function () {
    this.bindSubmitEvent();
  }

  ChatApp.ChatUi.prototype.bindSubmitEvent = function () {
    $(".chat-form").on("submit", function (event) {
      event.preventDefault();
      var message = $('input.chat-text').val();

      chat.processCommand(message);
    }),

    $('.nickname-form').on("submit", function (event) {
      event.preventDefault();

      var nickname = $('input#username').val();
      chat.changeNickName(nickname);
    })

  };

  socket.on('reply-message', function (data) {
    $('.name-status').empty();
    var payload = data.payload;
    $('.chat-box').append( payload.nickname + ": " + payload.text + "<br>");
  });

  socket.on('nicknameChangeResult', function (data) {
    $('.name-status').html(data.message);
    chat.socket.emit('getUsersList');
  });

  socket.on('usersListResults', function (data) {
    var nicknames = data.list;
    var output ="";
    for (var key in nicknames) {
      output = output + "<li>" + nicknames[key] + "</li><br>"
    }
    $(".users-list").html(output);
  });

  socket.on('user disconnected', function (data) {
    $('.name-status').html(data.message);
  })
})()
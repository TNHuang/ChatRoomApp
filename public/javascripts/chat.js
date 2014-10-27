(function () {
  if (typeof ChatApp === "undefined") {
    window.ChatApp = {};
  }

  var Chat = ChatApp.Chat = function (socket) {
    this.socket = socket;
    // this.nickname = "anonymous";
  };

  Chat.prototype.sendMessage = function (message) {
    this.socket.emit('message', {text: message});
  };

  Chat.prototype.changeNickName = function (nickname) {
    this.socket.emit('nicknameChangeRequest', {nickname: nickname});
  };

  Chat.prototype.processCommand = function (input) {
    var commands = input.match(/(\/\w+) (.*)/ );

    if (commands !== null) {
      var command = commands[1];
      var args = commands[2];
      if (command === "\/nick") {
        this.changeNickName(args);
      }else{
        $('.name-status').html("not a valid command");
      }
    } else {
      this.sendMessage(input);
    }
    this.socket.emit('getUsersList');

  }


})();
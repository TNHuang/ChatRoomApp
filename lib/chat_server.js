
function createChat(server) {
  var io = require('socket.io')(server);
  var guestnumber = 1;
  var nicknames = {};
  io.on('connection', function (socket) {

    nicknames[socket.id] = "guest"+ guestnumber;
    guestnumber += 1;
    socket.on('message', function (data) {
      var payload = { text: data.text, nickname: nicknames[socket.id]};
      io.emit('reply-message', {payload: payload});
    });

    socket.on('nicknameChangeRequest', function (data) {
      var new_nick_name = data.nickname;
      if ( isValidName(new_nick_name, nicknames) ) {
        nicknames[socket.id] = new_nick_name;
        socket.emit('nicknameChangeResult', {
          success: true,
          message: 'Nickname Changed!'
        });
      } else {
        socket.emit('nicknameChangeResult', {
          success: false,
          message: 'Names cannot begin with "Guest" or duplicate existing name'
        });
      }
    });

    socket.on('getUsersList', function (data) {
      io.emit('usersListResults', {list: nicknames});
    })
    socket.on('disconnect', function () {
        delete(nicknames[socket.id]);
      });
  });
}


function isValidName(nickname, nicknames) {
  if (nickname.match(/^guest/)) {
    return false; //if new name contain guest, it's a bad name
  }
  for (var key in nicknames) {
     if (nicknames[key] === nickname) { return false; }
  }
  return true;
}

module.exports.createChat = createChat;



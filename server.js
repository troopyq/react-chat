const express = require('express');
const app = express();
const cors = require('cors');

const server = require('http').Server(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const port = 8888;

const rooms = new Map();

app.use(cors());
app.use(express.json());

app.post('/rooms', (req, res) => {
  const { roomId, userName } = req.body;
  console.log('запрос', userName);
  if (!rooms.has(roomId)) {
    rooms.set(
      roomId,
      new Map([
        ['users', new Map()],
        ['messages', []],
      ]),
    );
  }
  res.json([...rooms.keys()]);
});

io.on('connection', (socket) => {
  socket.on('ROOM:JOIN', ({ roomId, userName }) => {
    console.log('connected: ', userName);

    socket.join(roomId);
    rooms.get(roomId).get('users').set(socket.id, userName);
    const users = [...rooms.get(roomId).get('users').entries()].map((el) => ({
      userId: el[0],
      userName: el[1],
    }));
    console.log(users);
    socket.emit('ROOM:USER', { userId: socket.id, userName });
    io.to(roomId).emit('ROOM:JOINED', { users });
  });

  socket.on('ROOM:NEW_MESSAGE', ({ roomId, userName, content, date }) => {
    const mess = { userName, content, date };
    socket.join(roomId);

    rooms.get(roomId).get('messages').push(mess);
    io.to(roomId).emit('ROOM:NEW_MESSAGE', mess);
  });

  socket.on('ROOM:CHANGE', ({ roomId, toRoomId, userName }) => {
    const changeRoom1 = `${socket.id}:${toRoomId}`;
    const changeRoom2 = `${toRoomId}:${socket.id}`;
    socket.leave(roomId);

    if (!rooms.has(changeRoom1)) {
      if (!rooms.has(changeRoom2)) {
        rooms.set(
          changeRoom1,
          new Map([
            ['users', new Map()],
            ['messages', []],
          ]),
        );
        socket.join(changeRoom1);
        rooms.get(changeRoom1).get('users').set(socket.id, userName);
        const users = [...rooms.get(changeRoom1).get('users').entries()].map((el) => ({
          userId: el[0],
          userName: el[1],
        }));
        io.to(changeRoom1).emit('ROOM:CHANGE', { users, roomId: changeRoom1 });
      } else {
        socket.join(changeRoom2);
        rooms.get(changeRoom2).get('users').set(socket.id, userName);
        const users = [...rooms.get(changeRoom2).get('users').entries()].map((el) => ({
          userId: el[0],
          userName: el[1],
        }));
        io.to(changeRoom2).emit('ROOM:CHANGE', { users, roomId: changeRoom2 });
      }
    } else {
      socket.join(changeRoom1);
      rooms.get(changeRoom1).get('users').set(socket.id, userName);
      const users = [...rooms.get(changeRoom1).get('users').entries()].map((el) => ({
        userId: el[0],
        userName: el[1],
      }));
      io.to(changeRoom1).emit('ROOM:CHANGE', { users, roomId: changeRoom1 });
    }
  });

  socket.on('disconnect', () => {
    rooms.forEach((value, roomId) => {
      if (value.get('users').get(socket.id)) {
        console.log('disconnected: ', value.get('users').get(socket.id));
      }
      if (value.get('users').delete(socket.id)) {
        const users = [...value.get('users').values()];
        io.to(roomId).emit('ROOM:SET_USERS', { users });
      }
    });
  });
});

server.listen(port, (err) => {
  if (err) {
    throw Error(err);
  }
  console.log('Сервер запущен');
});

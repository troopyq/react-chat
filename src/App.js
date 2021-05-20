import { useEffect, useReducer } from 'react';
import socket from './socket.js';
import reducer from './reducer';

import './App.scss';
import JoinBlock from './components/JoinBlock.jsx';
import { ChatBlock } from './components/ChatBlock.jsx';

function App() {
  const [state, dispatch] = useReducer(reducer, {
    joined: false,
    room: {},
    roomId: null,
    user: {},
    users: [],
    messages: [],
    rooms: [],
  });

  const onLogin = (obj) => {
    dispatch({
      type: 'JOINED',
      payload: obj,
    });
    socket.emit('ROOM:JOIN', obj);
  };

  const setUsers = ({ users, roomId }) => {
    dispatch({
      type: 'SET_USERS',
      payload: users,
    });
    console.log(roomId);
    if (roomId) {
      dispatch({
        type: 'SET_ROOMID',
        payload: roomId,
      });
    }
  };

  const enterToRoom = (toRoomId) => {
    // socket.emit('ROOM:CHANGE', { roomId: state.roomId, toRoomId, user: state.user.userName });
  };

  useEffect(() => {
    socket.on('ROOM:USER', (user) => {
      dispatch({
        type: 'SET_USER',
        payload: user,
      });
    });
    socket.on('ROOM:JOINED', setUsers);
    socket.on('ROOM:SET_USERS', setUsers);
    socket.on('ROOM:NEW_MESSAGE', (mess) => {
      dispatch({
        type: 'NEW_MESSAGES',
        payload: mess,
      });
    });

    socket.on('ROOM:CHANGE', setUsers);
  }, []);

  return (
    <div className='wrapper'>
      {(!state.joined && <JoinBlock onLogin={onLogin} />) || (
        <ChatBlock enterToRoom={enterToRoom} {...state} />
      )}
    </div>
  );
}

export default App;

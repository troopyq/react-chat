import { useEffect, useState } from 'react';
import socket from '../socket';
import { ListMessages } from './ListMessages';

export const ChatBlock = (state) => {
  const [message, setMessage] = useState('');
  const [isRecord, setIsRecord] = useState(false);
  const { users, messages, user, roomId, enterToRoom } = state;

  const onRecord = () => {
    setIsRecord(() => !isRecord);
  };

  const onSendMessage = () => {
    console.log(state);
    if (!message.length) {
      return;
    }

    const mess = {
      roomId,
      userName: user.userName,
      content: message,
      date: {
        time: new Date().getHours() + ':' + new Date().getMinutes(),
        // date: `${new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())}`,
      },
    };
    socket.emit('ROOM:NEW_MESSAGE', mess);

    setMessage('');
  };

  console.log(state);

  return (
    <div className='window'>
      <div className='users'>
        <h3>
          Комната:{' '}
          <span onClick={() => enterToRoom(roomId)} data-room={roomId} className='room'>
            {roomId}
          </span>
        </h3>
        <h3>Онлайн ({users.length}):</h3>
        <ul>
          {users.map((user, key) => (
            <li onClick={() => enterToRoom(user.userId)} className='user' key={key + user.userId}>
              {user.userName}
            </li>
          ))}
        </ul>
      </div>
      <div id='chat'>
        <ListMessages {...state} />
        <div className='fields'>
          <textarea
            value={message}
            onChange={(e) => setMessage(() => e.target.value)}
            name='message'></textarea>
          <button onClick={onSendMessage}>Отправить</button>
          {(isRecord && (
            <button onClick={onRecord}>
              <div className='record record-on'></div>
            </button>
          )) || (
            <button onClick={onRecord}>
              <div className='record record-off'></div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

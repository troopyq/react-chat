import axios from 'axios';
import { useState } from 'react';

const JoinBlock = ({ onLogin }) => {
  const [roomId, setRoomId] = useState('');
  const [userName, setUserName] = useState('');
  const [isLoading, setLoading] = useState(false);

  function onEnter() {
    if (!roomId || !userName) {
      return alert('Неверные данные!');
    }
    setLoading(true);
    const obj = { roomId, userName };
    axios.post('/rooms', obj).then((res) => {
      onLogin(obj);
      return res;
    });
  }

  return (
    <div className='join-block'>
      <input
        type='text'
        placeholder='Room ID'
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <input
        type='text'
        placeholder='User'
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <button disabled={isLoading} onClick={onEnter}>
        {isLoading ? 'ВХОД...' : 'ВОЙТИ'}
      </button>
    </div>
  );
};

export default JoinBlock;

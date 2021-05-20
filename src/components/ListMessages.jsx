import { useEffect, useRef } from 'react';

export const ListMessages = ({ messages, user }) => {
  const ul = useRef(null);

  useEffect(() => {
    console.log(ul.current.lastElementChild);
    if (ul.current.lastElementChild !== null) {
      ul.current.lastElementChild.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
  }, [messages]);

  return (
    <ul ref={ul} className='messages'>
      {messages.map((mess, id) => (
        <li
          className={`${user.userName === mess.userName ? 'mess_your' : ''}`}
          key={mess.userName + mess.date.time + id}>
          <span className='user_name'>{mess.userName}</span>
          <div className='user_mess'>
            <p className='user_mess'>{mess.content}</p>
            <span className='mess_date'>{mess.date.time}</span>
          </div>
        </li>
      ))}
    </ul>
  );
};

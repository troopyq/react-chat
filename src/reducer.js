export default (state, action) => {
  switch (action.type) {
    case 'JOINED':
      return {
        ...state,
        joined: true,
        roomId: action.payload.roomId,
        userName: action.payload.userName,
      };

    case 'SET_ROOMID':
      return {
        ...state,
        roomId: action.payload,
      };
    case 'SET_ROOM':
      return {
        ...state,
        room: {
          roomId: action.payload.roomId,
          roomName: action.payload.roomName,
        },
      };

    case 'SET_USERS':
      return {
        ...state,
        users: [...action.payload],
      };
    case 'SET_USER':
      return {
        ...state,
        user: {
          userName: action.payload.userName,
          userId: action.payload.userId,
        },
      };

    case 'SET_ROOMS':
      return {
        ...state,
        rooms: action.payload,
      };

    case 'NEW_MESSAGES':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };

    default:
      return state;
  }
};

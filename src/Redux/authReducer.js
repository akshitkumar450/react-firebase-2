const initialState = {
  user: null,
  isReady: false,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
      };
    case "READY":
      return {
        user: action.payload,
        isReady: true,
      };
    default:
      return state;
  }
};

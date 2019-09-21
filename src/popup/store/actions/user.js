export const SET_MESSAGE_AS_SEEN = 'SET_MESSAGE_AS_SEEN';

export function setMessageAsSeen(messageName) {
  return {
    type: SET_MESSAGE_AS_SEEN,
    payload: messageName
  };
}

export const SET_NEW_STARTER = 'SET_NEW_STARTER';

export function setNewStarter(isNewStarter) {
  return {
    type: SET_NEW_STARTER,
    payload: isNewStarter
  };
}

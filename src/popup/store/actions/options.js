export const SET_SHOW_ADD_BUTTON = 'SET_SHOW_ADD_BUTTON';

export function setShowAddButton(shouldShow) {
  return {
    type: SET_SHOW_ADD_BUTTON,
    payload: shouldShow
  };
}

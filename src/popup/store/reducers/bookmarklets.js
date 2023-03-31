import {
  SET_BOOKMARKLETS,
  ADD_RECENT_BOOKMARKLET
} from '../actions/bookmarklets';

const defaultState = {
  loaded: false,
  all: [],
  recent: []
};

export const MAX_RECENTS_LENGTH = 7;

export default function bookmarksReducer(state = defaultState, action) {
  switch (action.type) {
    case SET_BOOKMARKLETS:
      return Object.assign({}, state, {
        loaded: true,
        all: action.payload
      });
    case ADD_RECENT_BOOKMARKLET:
      // Remove payload ID from any previous recent IDs.
      // This also removes any duplicates that somehow ended up in there,
      // though unlikely without tampering.
      const recentsWithoutPayloadId = state.recent.filter(
        (id) => id !== action.payload
      );

      // Add the payload ID back onto the end of the array.
      const recentsWithPayloadIdAtEnd = [
        ...recentsWithoutPayloadId,
        action.payload
      ];

      // Trim recent list if too big.
      const suggestedSliceIndex =
        recentsWithPayloadIdAtEnd.length - MAX_RECENTS_LENGTH;
      const startSliceIndex = suggestedSliceIndex > 0 ? suggestedSliceIndex : 0;
      const trimmedRecents = recentsWithPayloadIdAtEnd.slice(
        startSliceIndex,
        recentsWithPayloadIdAtEnd.length
      );

      return {
        ...state,
        recent: trimmedRecents
      };
    default:
      return state;
  }
}

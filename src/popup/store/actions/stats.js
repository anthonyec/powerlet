export function firePageView() {
  return async (dispatch, getState, { stats }) => {
    stats.fire('pageview');
  };
}

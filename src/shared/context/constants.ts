/**
 * Initiates the shared data state to avoid null validations
 */
export const SHARED_DATA_INITIAL_STATE = {
  user: {
    info: undefined,
    isFetching: false,
    isAuthenticated: false,
  },
};

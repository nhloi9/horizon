export const messages = {
  NOT_FOUND: {
    ec: 404,
    msg: 'API not found'
  },
  ACCESS_TOKEN_EXPIRED: {
    ec: 419,
    msg: 'Access token expired'
  },
  ACCESS_TOKEN_INVALID: {
    ec: 420,
    msg: 'Access token is invalid'
  },
  INTERNAL_SERVER_ERROR: {
    ec: 500,
    msg: 'Internal server error'
  },
  // user
  USER_REGISTERED_SUCCESS: {},
  USER_EXISTED: {
    // msg: 'User already exists',
    ec: 1000
  },
  USER_INVALID_ACTIVE_TOKEN: {
    msg: 'Invalid active token',
    ec: 1001
  },
  USER_NOT_FOUND: {
    ec: 1006
  },
  USER_INCORECT_EMAIL_PASSWORD: {
    ec: 1003
  },
  USER_ACTIVE_SUCCESS: {},
  OAUTH_ERROR: {
    ec: 1004
  },
  USER_UNAUTHENTICATED: {
    ec: 1005
  },

  FRIEND_REQUEST_DUPLICATE: {
    ec: 2000
  },
  FRIEND_REQUEST_SUCCESS: {
    ec: 2001
  },
  FRIEND_REQUEST_NOT_FOUND: {
    ec: 2002
  },

  FRIEND_REQUEST_DELETE_SUCCESS: {
    ec: 2003
  }
}

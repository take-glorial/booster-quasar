const TokenKey = 'take-token'

function _GETTOKEN () {
  return localStorage.getItem(TokenKey)
}

export function getToken () {
  if (_GETTOKEN()) { return JSON.parse(_GETTOKEN()).token }
}

export function setToken (tokenWithUser) {
  localStorage.setItem(TokenKey, JSON.stringify(tokenWithUser))
}

export function removeToken () {
  localStorage.removeItem(TokenKey)
}

export function getUserFromToken () {
  if (_GETTOKEN()) { return JSON.parse(_GETTOKEN()).user }
}

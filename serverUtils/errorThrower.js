/**
 * Throws errors depending on the response message
 *
 * @param {object} response - A response of an outbound API request.
 * @param {object} cookies - Optional Cookies object containing cookies.
 */
const errorThrower = (response, cookies) => {
  // Gitlab api error
  if (cookies) {
    if (response?.message === '401 Unauthorized' || !cookies.get('accessToken') || !cookies.get('username')) { throw new Error('401 Unauthorized') }
  } else {
    if (response?.message === '401 Unauthorized') { throw new Error('401 Unauthorized') }
  }
}

export default errorThrower

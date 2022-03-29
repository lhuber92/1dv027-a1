import Cookies from 'cookies'
/**
 * Throws errors depending on the response message
 *
 * @param {object} response - A response of an outbound API request.
 */
const errorThrower = (response) => {
  const cookies = new Cookies(req, res)
  // Gitlab api error
  if (response?.message === '401 Unauthorized' || !cookies.get('accessToken') || !cookies.get('username')) { throw new Error('401 Unauthorized') }
}

export default errorThrower

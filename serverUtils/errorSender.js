import Cookies from 'cookies'

/**
 * Sends an error response.
 * 
 * @param {object} error - An error with a message
 * @param {object} req - NextJS HTTP request object
 * @param {object} res - NextJS HTTP response object
 */
const errorSender = (error, req, res) => {
  const cookies = new Cookies(req, res)
  if (!cookies.get('accessToken') || !cookies.get('username') || error?.message === '401 Unauthorized') {
    res.status(401).json({
      errorCode: 401,
      errorMessage: 'Login required.',
      errorType: 'loginError'
    })
  } else {
    res.status(404).json({
      errorCode: 404,
      errorMessage: 'Apologies. An unexpected error occurred.',
      errorType: 'gitlabberError'
    })
  }
}

export default errorSender

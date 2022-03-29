import Cookies from 'cookies'
import errorSender from '../../serverUtils/errorSender.js';

/**
 * API Handler
 * Logs out the logged-in user.
 * 
 * @param {object} req - NextJS HTTP request object
 * @param {object} res - NextJS HTTP response object
 */
export default async function handler(req, res) {
  try {
    const cookies = new Cookies(req, res)

    // Delete the cookies
    cookies.set("accessToken")
    cookies.set("username")

    res.redirect(307, 'http://localhost:3000/') 
  } catch (error) {
    errorSender(error, req, res)
  }
}
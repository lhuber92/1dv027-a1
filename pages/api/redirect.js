import jwt_decode from "jwt-decode";
import cookieSetter from '../../serverUtils/cookieSetter.js';
import errorSender from '../../serverUtils/errorSender.js';
import errorThrower from '../../serverUtils/errorThrower.js';

/**
 * API Handler
 * Gets access token and user-details with help of a code. Part of the authorization code flow described here:
 * https://docs.gitlab.com/ee/api/oauth2.html#authorization-code-flow
 * 
 * @param {object} req - NextJS HTTP request object
 * @param {object} res - NextJS HTTP response object
 */
export default async function handler(req, res) {
  try {
    // Get the access token, with help of "code"
    let accessTokenResponse = await fetch(
      `https://gitlab.lnu.se/oauth/token?client_id=${process.env.APP_ID}&client_secret=${process.env.APP_SECRET}&code=${req.query.code}&grant_type=authorization_code&redirect_uri=${process.env.REDIRECT_URL}`,
      { method: 'POST' }
    )
    accessTokenResponse = await accessTokenResponse.json()
    errorThrower(accessTokenResponse)
    
    // Done in order to get the username
    let userDetailsResponse = await fetch(
      'https://gitlab.lnu.se/api/v4/user/',
      { 
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + accessTokenResponse.access_token }
      }
    )
    userDetailsResponse = await userDetailsResponse.json()
    errorThrower(userDetailsResponse)
    
    cookieSetter(req, res, accessTokenResponse.access_token, userDetailsResponse.username)
    res.redirect(307, process.env.BASE_URL) 
  } catch (error) {
    errorSender(error, req, res)
  }
}
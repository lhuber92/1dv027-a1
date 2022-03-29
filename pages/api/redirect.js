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
    console.log('ddddddddddddddddddddddddddd')
    // Get the access token, with help of "code"
    let accessTokenResponse = await fetch(
      `https://gitlab.lnu.se/oauth/token?client_id=${process.env.APP_ID}&client_secret=${process.env.APP_SECRET}&code=${req.query.code}&grant_type=authorization_code&redirect_uri=${process.env.REDIRECT_URL}`,
      { method: 'POST' }
    )
    accessTokenRespo
    nse = await accessTokenResponse.json()
    console.log('aaaaaaaaaaaaaaaa')
    console.log(accessTokenResponse)
    errorThrower(accessTokenResponse)
    
    // Get user details with help of the id_token provided in accessTokenResponse
    const userDetails = jwt_decode(accessTokenResponse.id_token)
    const username = userDetails.email.substring(0, 7)
    
    cookieSetter(req, res, accessTokenResponse.access_token, username)
    res.redirect(307, process.env.BASE_URL) 
  } catch (error) {
    console.log('bbbbbbbbb')
    console.log(error)
    errorSender(error, req, res)
  }
}
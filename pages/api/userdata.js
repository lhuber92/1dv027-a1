import Cookies from 'cookies'
import cookieSetter from '../../serverUtils/cookieSetter.js';
import errorThrower from '../../serverUtils/errorThrower.js';
import errorSender from '../../serverUtils/errorSender.js';
import checkFileExists from '../../publicUtils/checkFileExists.js';

/**
 * API Handler
 * Gets profile-related data of the logged in user.
 * 
 * @param {object} req - NextJS HTTP request object
 * @param {object} res - NextJS HTTP response object
 */
export default async function handler(req, res) {
  try {
    const cookies = new Cookies(req, res)
  
    let userdataResponse = await fetch(
      'https://gitlab.lnu.se/api/v4/user/',
      { 
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + cookies.get('accessToken') }
      }
    )
    userdataResponse = await userdataResponse.json()
    errorThrower(userdataResponse, cookies)

    // If image exist, create a localImagePath and set it, otherwise create a localImagePath with empty value.
    // Also set userdataResponse.hasLocalImage to true or false.
    const localImagePath = `./public/uploads/${cookies.get('username')}.jpeg`
    const fileExists = await checkFileExists(localImagePath)
    if (fileExists) {
      userdataResponse.imagePath = `/uploads/${cookies.get('username')}.jpeg`
      userdataResponse.hasLocalImage = true
    } else {
      userdataResponse.imagePath = userdataResponse.avatar_url
      userdataResponse.hasLocalImage = false
    }
    
    cookieSetter(req, res, cookies.get('accessToken'), cookies.get('username'))
    res.status(200).json(userdataResponse)
  } catch (error) {
    errorSender(error, req, res)
  }
}
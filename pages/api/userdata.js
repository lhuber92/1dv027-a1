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
    // const localImagePath = `./public/uploads/${cookies.get('username')}.jpeg`

    // For demo purposes only. NextJS recommends a third party service for image storage since uploaded images are only
    // visible after the app is rebuilt (npm run build)
    // More info here: https://github.com/vercel/next.js/pull/17203/commits/572345f0d59fbfa30fa7538b0cffd69e152959d6
    // And in my long comment in api/upload.js
    const localImagePath = `./public/uploads/default.jpeg`
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
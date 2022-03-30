import * as fs from 'fs'
import errorSender from '../../serverUtils/errorSender.js';
import Cookies from 'cookies'
const mv = require('mv');

/**
 * API Handler
 * Deletes the locally stored profile picture of the logged in user.
 * 
 * @param {object} req - NextJS HTTP request object
 * @param {object} res - NextJS HTTP response object
 */
export default async function handler (req, res) {
  try {
    const cookies = new Cookies(req, res)
    const username = cookies.get('username')
    if (!username) { throw new Error() }

    // const localImagePath = `./public/uploads/${username}.jpeg`
    // For demo purposes only. NextJS recommends a third party service for image storage since uploaded images are only
    // visible after the app is rebuilt (npm run build)
    // More info here: https://github.com/vercel/next.js/pull/17203/commits/572345f0d59fbfa30fa7538b0cffd69e152959d6
    // And in my long comment in api/upload.js
    const localImagePath = './public/uploads/default.jpeg'
    await fs.promises.unlink(localImagePath, fs.constants.F_OK) // Delete file
    .then(() => { res.status(200).end() })
    .catch((error) => { throw error })
  } catch (error) {
    errorSender(error, req, res)
  }  
}
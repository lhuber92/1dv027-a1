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

    const localImagePath = `./public/uploads/${username}.jpeg`
    await fs.promises.unlink(localImagePath, fs.constants.F_OK) // Delete file
    .then(() => { res.status(200).end() })
    .catch((error) => { throw error })
  } catch (error) {
    errorSender(error, req, res)
  }  
}
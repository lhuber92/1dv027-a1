import { IncomingForm } from 'formidable'
import errorSender from '../../serverUtils/errorSender.js';
import Cookies from 'cookies'
const mv = require('mv');


export const config = {
    api: {
       bodyParser: true,
       sizeLimit: '25mb',
    }
};

/**
 * API Handler
 * Takes a local file and saves it to the local storage.
 * Inspiration found here:
 * https://fullstacksoup.blog/2021/11/04/next-js-upload-image-to-public-folder/
 * 
 * @param {object} req - NextJS HTTP request object
 * @param {object} res - NextJS HTTP response object
 */
export default async function handler (req, res) {
  try {
    const cookies = new Cookies(req, res)
    const username = cookies.get('username')
    if (!username) { throw new Error() }

    // Save the provided image
    await new Promise((resolve, reject) => {
      const form = new IncomingForm()
      form.parse(req, (err, fields, files) => {
          if (err || !files?.file?.filepath) return reject(err)
          const oldPath = files.file.filepath;
          const newPath = `./public/uploads/${username}.jpeg`;
          mv(oldPath, newPath, function(err) {});
          res.status(200).json({ newPath })
      })
   })

  // In case promise wasn't resolved.
  throw new Error()
  } catch (error) {
    errorSender(error, req, res)
  }  
}
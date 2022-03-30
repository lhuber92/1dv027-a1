import { IncomingForm } from 'formidable'
import errorSender from '../../serverUtils/errorSender.js';
import Cookies from 'cookies'
const mv = require('mv');


export const config = {
    api: {
       bodyParser: false,
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
          // const newPath = `./public/uploads/${username}.jpeg`;

          // Important!
          // Note from nextJS:
          // **Note**: Only assets that are in the `public` directory at [build time](/docs/api-reference/cli.md#build)
          // will be served by Next.js. Files added to the directory after build time won't be
          // discoverable until your code is rebuilt. We recommend using a third party service like 
          // [AWS S3](https://aws.amazon.com/s3/) for persistant file storage.

          // Since the app needs to be rebuilt (npm run build) every time to discover any new files put in the /public
          // folder uploading images there isn't viable. If this was a live app I would here send a fetch request
          // with the image to a third party image storage provider instead.
          // To make the app usable for demonstration purposes there was already a "default.jpeg" file in the public folder
          // at build-time. So when uploading an image NextJS will find default.jpeg. When deleting an image it will also
          // notice that nothing is there. The only issue with this is if we have multiple users. They would all share the same
          // image. So deleting / changing it would affect the next user.
          // More info here (see line 27): https://github.com/vercel/next.js/pull/17203/commits/572345f0d59fbfa30fa7538b0cffd69e152959d6
          //
          // Example usage for sending to a third party:
          // const data = new FormData();
          // data.append("nextJSImage", files.file)
          // const response = await fetch('https://imageservice', { method: "POST", data })
          const newPath = './public/uploads/default.jpeg'
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
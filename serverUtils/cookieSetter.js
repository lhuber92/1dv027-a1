import Cookies from 'cookies'

/**
 * Sets httpsonly cookies used by the response object.
 * 
 * @param {object} req - NextJS HTTP request object
 * @param {object} res - NextJS HTTP response object
 * @param {string} accessToken - GitLab access token
 * @param {string} username - Gitlab username tied to access token
 */
const cookieSender = (req, res, accessToken, username) => {
  // Set data in cookie
  // Inspiration found here: https://www.youtube.com/watch?v=w8n7Soz7khw
  const cookies = new Cookies(req, res)

  cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.ENVIRONMENT !== "development",
    maxAge: 7200000, // 2 hours
    sameSite: "strict",
    path: "/"
  })

  cookies.set("username", username, {
    httpOnly: true,
    secure: process.env.ENVIRONMENT !== "development",
    maxAge: 7200000,
    sameSite: "strict",
    path: "/"
  })
}

export default cookieSender

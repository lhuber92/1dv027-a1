import Cookies from 'cookies'
import errorSender from '../../serverUtils/errorSender.js';
import errorThrower from '../../serverUtils/errorThrower.js';

/**
 * API Handler.
 * Gets the last 101 commits of logged in user.
 * 
 * @param {object} req - NextJS HTTP request object
 * @param {object} res - NextJS HTTP response object
 */
export default async function handler(req, res) {
  try {
    const cookies = new Cookies(req, res)

    // Fetch last 100 gitlab events data with help of the access token.
    let eventsResponse1 = await fetch(
      `https://gitlab.lnu.se/api/v4/users/${cookies.get('username')}/events?per_page=100`,
      { 
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + cookies.get('accessToken') }
      }
    )
    eventsResponse1 = await eventsResponse1.json()
    errorThrower(eventsResponse1)
  
    // Fetch Event 101(including) - 120 (including). Gitlab defaults to 20 events per page.
    let eventsResponse2 = await fetch(
      `https://gitlab.lnu.se/api/v4/users/${cookies.get('username')}/events?page=6`,
      { 
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + cookies.get('accessToken') }
      }
    )
    eventsResponse2 = await eventsResponse2.json()
    errorThrower(eventsResponse2)
  
    // Only get the 101:th event
    const lastEvent = eventsResponse2[0]
    
    // Push the 101:th event into the array of the first 100 events
    eventsResponse1.push(lastEvent)

    res.status(200).json(eventsResponse1)
  } catch (error) {
    console.log(error)
    errorSender(error, req, res)
  }
}
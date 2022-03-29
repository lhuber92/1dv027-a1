import messages from '../config/messages'
import conditionalError from './conditionalError.js'

/**
 * Wraps API calls to return unified responses or errors.
 * GET method is used other method is stated in the config object.
 * Sample usage from a parent component:
 * let response = await apiClient(props.baseUrl + apiRoutes.UPLOAD, { method: "POST", body }).request()
 * if (response.error) { return setError(response.error) }
 * response = await response.json()
 * 
 * @param {string} url - The url to call.
 * @param {object} config - Optional config object. Contains method and body objects.
 * @returns - The request method to use.
 */
const apiClient = (url, config = {}) => {

  /**
   * Makes the request
   *
   * @returns - A result of the request (not parsed in JSON yet), or an error object.
   */
  const request = async () => {
    try {
      const result = await fetch(url, config)
      if (!result.ok) { return conditionalError(result) }
      return result
    } catch (error) {
      console.log('adsadsdads')
      return { error: messages.STANDARD_ERROR_MESSAGE }
    }
  }

  return { request }
}

export default apiClient

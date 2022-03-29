/**
 * Throws errors depending on the response message
 *
 * @param {object} response - A response of an outbound API request.
 */
const errorThrower = (response) => {
  // Gitlab api error
  if (response?.message === '401 Unauthorized') { throw new Error(userdataResponse.message) }
}

export default errorThrower

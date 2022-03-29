import messages from '../config/messages'

/**
 * Returns a standardised error object with a message.
 * The text of the error depends on the response.
 *
 * @param {object} response - A response of an outbound API request.
 * 
 * @returns - A standardised error object with a message.
 */
const conditionalError = (response) => {
  if (response?.status === 401) {
    return { error: messages.LOGIN_MESSAGE }
  } else {
    return { error: messages.STANDARD_ERROR_MESSAGE }
  }
}

export default conditionalError

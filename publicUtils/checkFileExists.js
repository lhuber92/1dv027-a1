import * as fs from 'fs'

// Inspiration found here:
// https://stackoverflow.com/questions/17699599/node-js-check-if-file-exists
/**
 * Checks if a file exists at the provided filePath
 *
 * @param {string} filePath - The path where to check
 * 
 * @returns - True if found, otherwise false
 */
const checkFileExists = async (filePath) => {
  return fs.promises.access(filePath, fs.constants.F_OK)
           .then(() => { return true })
           .catch(() => { return false })
}

export default checkFileExists

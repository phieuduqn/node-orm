import * as locale from './locale'
import stringTemplate from '../../utils/string-template'


export const getMessageFromType = (type, language = 'en') => {
  if (locale[language] && locale[language][type]) {
    return locale[language][type]
  }
  return locale.en[type]
}

/**
 *
 * @param {*} message Message template:
 * @param {*} params param to replace to message template {
 *  projectName,
 *  date,
 *  ...
 * }
 * @returns {*} return missing field || undefined
 */
export const validateArguments = (message = '', params = {}) => {
  const regexBetweenTwoBlock = /(?<={{)(.*?)(?=}})/g
  const argumentKeys = message.match(regexBetweenTwoBlock)

  if (!argumentKeys || !argumentKeys.length) {
    return
  }

  return argumentKeys.find(f => !params[f])
}

export const formatMessage = (message, params) => {
  return stringTemplate(message, params)
}

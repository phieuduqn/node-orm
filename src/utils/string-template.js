/* eslint-disable prefer-rest-params */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-destructuring */


// TEMPLATE: A {{variable}}


const nargs = /\{{([0-9a-zA-Z_]+)\}}/g
/**
 * (message, {})
 *
 * @param {*message} string Hello {{name}}
 * @param {*param} object  {name: "Marry"}
 * @returns
 */
function stringTemplate(string) {
  let args

  if (arguments.length === 2 && typeof arguments[1] === 'object') {
    args = arguments[1]
  } else {
    args = new Array(arguments.length - 1)
    for (let i = 1; i < arguments.length; ++i) {
      args[i - 1] = arguments[i]
    }
  }

  if (!args || !args.hasOwnProperty) {
    args = {}
  }

  return string.replace(nargs, (match, i, index) => {
    let result

    if (string[index - 1] === '{' &&
              string[index + match.length] === '}') {
      return i
    } else {
      result = args.hasOwnProperty(i) ? args[i] : null
      if (result === null || result === undefined) {
        return ''
      }

      return result
    }
  })
}

export default stringTemplate

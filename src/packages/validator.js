import validate from 'express-validation'
import user from './user/validation'
import moderator from './moderator/validation'
import setting from './setting/validator'
import role from './role/validation'

function parse(object) {
  const data = {};
  for (const key of Object.keys(object)) {
    data[key] = validate(object[key])
  }
  return data
}

export default {
  user: parse(user),
  moderator: parse(moderator),
  setting: parse(setting),
  role: parse(role)
}


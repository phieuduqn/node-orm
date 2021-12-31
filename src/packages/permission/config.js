
const ALLOWED_CREATE_ATTRIBUTE = [
  'name',
  'role'
];

const ALLOWED_UPDATE_ATTRIBUTE = [
  'name',
  'status'
];

const status = {
  active: 1,
  inactive: 0
}

const superAdmin = 'superadmin'

const statusList = Object.values(status)

export default {
  ALLOWED_CREATE_ATTRIBUTE,
  ALLOWED_UPDATE_ATTRIBUTE,
  status,
  statusList,
  superAdmin
}

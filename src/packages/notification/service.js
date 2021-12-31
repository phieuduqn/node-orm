import { pick } from 'lodash'
import repo from './repository'
import { getMessageFromType, validateArguments, formatMessage } from './util'
import { commonLocale } from '../../locales'
import config from './config'
import notificationQueue from './jobs/notification'
import to from '../../utils/to'
import configUser from '../user/config'
import logger from '../../logger/index'

const index = async (request) => {
  const [{ rows, count }, unread] = await Promise.all([
    repo.findAll(request),
    repo.countRecords({ ...request, read: 0 })
  ])

  return {
    unread,
    count,
    rows
  }
}

const show = async (id, user = {}) => {
  const data = await repo.findById(id)
  if (user._id === data.toId && data.read === 0) {
    repo.updateOne(id, { read: 1 })
  }

  return data
}

const create = async (body = {}) => {
  return repo.create(body)
}

const update = async (id, body) => {
  return repo.updateOne(id, body)
}

const destroy = async (id) => {
  return repo.destroy(id)
}

const destroyMultiple = async (body, user) => {
  const { ids } = body
  return repo.destroyMultiple({ ids, toId: user._id })
}


const markAsRead = async (body, user) => {
  const { ids } = body

  return repo.markAsRead({ ids, toId: user._id })
}

/**
 *
 * @param {*} body {
 * fromId
 * toId
 * action
 * params {
 *      // param variable to replace to message template
 *  }
 * }
 * @param {*} userSession
 * @param {*} queueOption {delay, cron} format Bull package
 * @returns
 */
const handleSendNotification = async (body, userSession = {}, queueOption = {}) => {
  return new Promise(async (resolve, reject) => {
    const { fromId, toId, action, params = {} } = body
    // TODO:
    // HANDLE MESSAGE AND SEND TO QUEUE
    // HANDLE QUEUE TO GET AND SEND MESSAGE TO SOCKET GATEWAY
    // SAVE NOTIFICATION DATA
    if (!action || !action.value) {
      return resolve({})
    }

    const message = getMessageFromType(action.value, 'en')
    const missingParam = validateArguments(message, params)
    if (missingParam) {
      return reject(JSON.stringify({ ...commonLocale.customRequireField,
        value: {
          field: `params.${missingParam}`
        }
      }))
    }

    const notification = {
      message: formatMessage(message, params),
      action: action.value,
      labels: action.labels,
      messageTemplate: message,
      params,
      fromId: fromId || null,
      toId,
      referType: action.page,
      referAction: action.referAction,
      referValue: params.referValue,
    }
    // const data = await repo.create(notification)
    // CALL QUEUE
    notificationQueue.add({
      toId,
      topic: config.TOPIC,
      userSession: pick(userSession, configUser.basicUserInfo),
      message: notification
    }, queueOption)

    return resolve(notification)
  })
}

const sendNotification = async (body, userSession = {}, queueOption = {}) => {
  const [error, result] = await to(handleSendNotification(body, userSession, queueOption))
  if (error) {
    // LOGGER
    logger.error({
      event: 'notification',
      message: `Error send notify action ${body ? body.action : undefined}`,
      error,
      data: { body, queueOption }
    })
    console.log(`Error send notify action ${body ? body.action : undefined}`, error)
    return {}
  }

  return result
}


export default {
  index,
  show,
  create,
  update,
  destroy,
  destroyMultiple,
  sendNotification,
  markAsRead
}


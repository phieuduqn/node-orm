/* eslint-disable no-unused-vars */
import { cloneDeep } from 'lodash'
import Queue from 'bull'
import socketUtils from '../../../utils/socket-io'
import config from '../config'
import repo from '../repository'
import logger from '../../../logger/index'

export const queueConfig = {
  queueName: 'notifications:notification'
}

const bullOptions = {
  prefix: '{bull}',
  defaultJobOptions: {
    // delay: 0, // Run after 20s
    removeOnComplete: true
  },
  redis: { port: process.env.REDIS_PORT, host: process.env.REDIS_URL },
  // createClient: redisUtil.client
};

// console.log({ port: process.env.REDIS_PORT, host: process.env.REDIS_URL });
const queue = new Queue(queueConfig.queueName, bullOptions);
async function run(body = {}) {
  const { toId, topic, userSession, message, room } = body
  if (message && message.action === config.NOTIFY_ACTION.accountNotVerified.value) {
    // Custom Handle Message
    // return
  }


  const notifyData = cloneDeep(message)
  notifyData._id = undefined
  notifyData.createdAt = undefined
  notifyData.updatedAt = undefined
  const notification = await repo.create(notifyData).catch(e => console.log(e))
  if (room) {
    // Emit Socket
    socketUtils.toroom(room, topic, notification)
  }
  if (toId) {
    // Emit Socket
    socketUtils.touser(toId, topic, notification)
  }


  return true
}


export function start() {
  queue.process((job, done) => {
    run(job.data).then(async ({ needRemoveRepead }) => {
      if (needRemoveRepead) {
        // remove repeatable by key after 2 seconds
        setTimeout(async () => {
          await queue.removeRepeatable(job.name, { ...job.opts.repeat });
          console.log('Repeatable job is removed by key');
        }, 2000);
      }
      done()
    }).catch((e) => {
      console.error(`Run fail job: [${job.queue.name}]\n`, e)
      logger.error({
        event: queueConfig.queueName,
        message: `Run fail job: [${job.queue.name}]\n'`,
        data: job.data,
        error: e,
      })
      done(e)
    })
  })
  return queue
}

export default queue

import express from 'express'
import { createBullBoard } from 'bull-board'
import { BullAdapter } from 'bull-board/bullAdapter'
import { start as startHandlerNotification } from '../../packages/notification/jobs/notification'
import init from '../../init'

const app = express()
init(app)
const { router } = createBullBoard([
  new BullAdapter(startHandlerNotification()),
])
const port = process.env.QUEUE_BOARD_PORT || 5500
const accessToken = process.env.QUEUE_TOKEN

app.use('/admin/queues', (req, res, next) => {
  if (req.path.includes('static') || req.path.includes('api')) {
    return next()
  }
  if (req.query.token !== accessToken) {
    return res.status(404).send('Not found')
  }
  next()
}, router)
app.listen(port)
console.log(`Check at: http://localhost:${port}/admin/queues`)

console.log('QUEUE ENV', process.env.NODE_ENV)

export default function startQueue() {
  console.log(`Queue: ${Date.now()}`);
}

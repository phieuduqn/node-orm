/* eslint-disable no-unused-vars */
import { authen } from '../../middleware/socketMiddleware';
import redisUtil from '../../utils/redisUtil'
import { CLIENT_SOCKET_KEY } from './constant'


const socket = (io) => {
  io.use((clientSocket, next) => {
    const token = clientSocket.handshake.query.token || ''
    // TODO Authentication
    authen(token, (tokenData) => {
      if (tokenData && tokenData.id) {
        clientSocket.user = tokenData
        next()
      } else {
        clientSocket.disconnect(0);
      }
    })
  }).on('connection', (client) => {
    client.join(`u_${client.user.id}`)
    /**
     * log client active data is user info
     */
    client.on('test', (data) => {
      client.emit('test', data);
    });

    client.on('active', (data) => {
      client.broadcast.emit('online-user', { _id: client.user.id });
    });
    /**
   * log client idle data is user id
   */
    client.on('idle', (data) => {
      client.broadcast.emit('offline-user', { _id: client.user.id });
    });
    /**
   * join client to specify room. data is room name
   */
    client.on('joinroom', (data) => {
      client.join(data);
    });
    /**
   * leave from room. data is room name
   */
    client.on('leaveroom', (data) => {
      client.leave(data);
    });
    /**
   * send message to room from client
   */
    client.on('toroom', (data) => {

    })
    client.on('touser', (data) => {

    });
    client.on('disconnect', (socketDis) => {
      // announce the offline status of a new user
      client.leave(`u_${client.user.id}`)
      client.broadcast.emit('offline-user', { _id: client.user.id });
    });
  })
};

export default socket

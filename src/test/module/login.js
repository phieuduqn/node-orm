/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

import faker from 'faker'
import chai from 'chai'
import chaiHttp from 'chai-http'
import server from '../../index'
import { UserSeq } from '../../models'

const should = chai.should()
const loginDetails = {
  success: {
    email: 'devzzz@gmail.com',
    password: '123456'
  },
  notVerify: {
    email: 'mingzzz@gmail.com',
    password: '123456'
  },
  notExist: {
    email: faker.internet.email(),
    password: '123456'
  }
}


export const login = function (callback) {
  let token = ''

  chai.use(chaiHttp)
  const module = '******************************************* LOGIN *******************************************'
  describe(module, async () => {
    describe('/POST login', () => {
      it('it should GET token', (done) => {
        chai
          .request(server)
          .post('/api/v1/auth/login')
          .send(loginDetails.success)
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.an('object')
            res.body.data.should.be.an('object')
            res.body.data.should.have.property('accessToken')
            token = res.body.data.accessToken
            done()
          })
      })
    })
    after(() => {
      callback(token)
    })
  })
}

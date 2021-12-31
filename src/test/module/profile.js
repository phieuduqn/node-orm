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

export const profile = function (token) {
  chai.use(chaiHttp)
  const module = '******************************************* PROFILE *******************************************'
  describe(module, async () => {
    describe('/GET profile', async () => {
      it('it should NOT be able to consume the route since no token was sent', (done) => {
        chai
          .request(server)
          .get('/api/v1/user/profile')
          .end((err, res) => {
            res.should.have.status(401)
            done()
          })
      })
      it('it should GET profile', (done) => {
        chai
          .request(server)
          .get('/api/v1/user/profile')
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.an('object')
            res.body.data.should.be.an('object')
            res.body.data.should.include.keys('_id', 'email')
            done()
          })
      })
    })
    describe('/PATCH profile', () => {
      it('it should NOT UPDATE if not exist token', (done) => {
        const user = {}
        chai
          .request(server)
          .patch('/api/v1/user/profile')
          .send(user)
          .end((err, res) => {
            res.should.have.status(401)
            done()
          })
      })
      it('it should UPDATE profile', (done) => {
        const user = {
          fullName: 'Test123456',
          avatar: 'https://dual-lite-media-dev-bucket.s3.ap-south-1.amazonaws.com/public/images/2021-6-11/15/dab27afddd0111079628d90afffe5ecd_origin',
          skills: [{ name: ' PHP', code: 'php' }],
        }
        chai
          .request(server)
          .patch('/api/v1/user/profile')
          .set('Authorization', `Bearer ${token}`)
          .send(user)
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.data.should.be.a('object')
            res.body.data.should.have.property('fullName').eql(user.fullName)
            res.body.data.should.have.property('avatar').eql(user.avatar)
            res.body.data.skills.should.be.a('array')
            done()
          })
      })
    })
    after(() => {
    // AFTER HOOK HANDLE
      UserSeq.update({
        fullName: 'Dev',
        avatar: null,
        skills: []
      }, {
        where: { email: loginDetails.success.email }
      })
    })
  })
}

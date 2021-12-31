/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import faker from 'faker'
import chai from 'chai'
import chaiHttp from 'chai-http'
import { UserSeq, VerifyEmailSeq } from '../../models'
import server from '../../index'

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
const createdID = []
let createdUser = null
const email = faker.internet.email()
const password = '123456'
let token = null

export const auth = function (callback) {
  chai.use(chaiHttp)
  const module = '******************************************* AUTH *******************************************'
  describe(module, async () => {
    describe('/GET /', () => {
      it('it should GET home API url', (done) => {
        chai
          .request(server)
          .get('/')
          .end((err, res) => {
            res.should.have.status(404)
            done()
          })
      })
    })
    describe('/POST register', async () => {
      it('it should POST register', (done) => {
        const user = {
          fullName: faker.random.words(),
          email,
          password
        }
        chai
          .request(server)
          .post('/api/v1/auth/signUp')
          .send(user)
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.an('object')
            res.body.data.should.be.an('object')
            res.body.data.should.include.keys('_id')
            createdID.push(res.body.data._id)
            createdUser = res.body.data
            done()
          })
      })

      it('it should NOT POST a register if email already exists', (done) => {
        const user = {
          fullName: faker.random.words(),
          email,
          password
        }
        chai
          .request(server)
          .post('/api/v1/auth/signUp')
          .send(user)
          .end((err, res) => {
            res.should.have.status(409)
            done()
          })
      })
    })


    describe('/POST verify', () => {
      it('it should NOT POST verify if email is not register', (done) => {
        chai
          .request(server)
          .post('/api/v1/auth/verifyEmailOTP')
          .send({
            email: faker.internet.email(),
            code: 1111
          })
          .end((err, res) => {
            res.should.have.status(400)
            done()
          })
      })
      it('it should NOT POST verify if code is wrong', (done) => {
        chai
          .request(server)
          .post('/api/v1/auth/verifyEmailOTP')
          .send({
            email,
            code: 1121
          })
          .end((err, res) => {
            res.should.have.status(400)
            done()
          })
      })
      it('it should POST verify', (done) => {
        VerifyEmailSeq.findOne({ where: { email: createdUser.email, isActive: true }, raw: true })
          .then((codeModel) => {
            chai
              .request(server)
              .post('/api/v1/auth/verifyEmailOTP')
              .send({
                email,
                code: codeModel.code
              })
              .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.an('object')
                res.body.data.should.be.an('object')
                res.body.data.should.include.keys('accessToken')
                done()
              })
          })
      })
    })


    describe('/POST login', () => {
      it('it should NOT GET token if email is not verified', (done) => {
        chai
          .request(server)
          .post('/api/v1/auth/login')
          .send(loginDetails.notVerify)
          .end((err, res) => {
            res.should.have.status(200)
            res.body.data.should.have.property('isVerifiedEmail').eql(false)
            done()
          })
      })
      it('it should NOT GET token if email is not register', (done) => {
        chai
          .request(server)
          .post('/api/v1/auth/login')
          .send(loginDetails.notExist)
          .end((err, res) => {
            res.should.have.status(400)
            done()
          })
      })
      it('it should GET token', (done) => {
        chai
          .request(server)
          .post('/api/v1/auth/login')
          .send({ email, password })
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

    describe('/POST forgot otp', () => {
      it('it should NOT POST forgot otp if email is not register', (done) => {
        chai
          .request(server)
          .post('/api/v1/auth/resendExcAuOTP')
          .send({ email: loginDetails.notExist.email, type: 'forgot' })
          .end((err, res) => {
            res.should.have.status(400)
            done()
          })
      })
      it('it should NOT POST forgot otp if email is not verify', (done) => {
        chai
          .request(server)
          .post('/api/v1/auth/resendExcAuOTP')
          .send({ email: loginDetails.notVerify.email, type: 'forgot' })
          .end((err, res) => {
            res.should.have.status(400)
            done()
          })
      })
      it('it should POST forgot otp', (done) => {
        chai
          .request(server)
          .post('/api/v1/auth/resendExcAuOTP')
          .send({
            email,
            type: 'forgot'
          })
          .end((err, res) => {
            res.should.have.status(200)
            done()
          })
      })
    })

    describe('/POST is valid OTP', () => {
      it('it should NOT POST is valid OTP if otp is not exists', (done) => {
        chai
          .request(server)
          .post('/api/v1/auth/isValidOTP')
          .send({ email: loginDetails.notExist.email, code: 1111 })
          .end((err, res) => {
            res.should.have.status(400)
            done()
          })
      })
      it('it should POST is valid OTP', (done) => {
        VerifyEmailSeq.findOne({
          where: { email, isActive: true },
          raw: true
        }).then((codeModel) => {
          chai
            .request(server)
            .post('/api/v1/auth/isValidOTP')
            .send({
              email,
              code: codeModel.code
            })
            .end((err, res) => {
              res.should.have.status(200)
              done()
            })
        })
      })
    })

    describe('/POST Change Password', () => {
      it('it should NOT POST Change Password if email is not exists', (done) => {
        chai
          .request(server)
          .post('/api/v1/auth/changePwd')
          .send({ email: loginDetails.notExist.email, code: 1111, password: '123987' })
          .end((err, res) => {
            res.should.have.status(400)
            done()
          })
      })
      it('it should NOT POST Change Password if email is not verified', (done) => {
        chai
          .request(server)
          .post('/api/v1/auth/changePwd')
          .send({ email: loginDetails.notVerify.email, code: 1111, password: '123987' })
          .end((err, res) => {
            res.should.have.status(400)
            done()
          })
      })
      it('it should POST Change Password ', (done) => {
        VerifyEmailSeq.findOne({
          where: { email, isActive: true }, raw: true
        }).then((codeModel) => {
          chai
            .request(server)
            .post('/api/v1/auth/changePwd')
            .send({ email, code: codeModel.code, password: '123456' })
            .end((err, res) => {
              res.should.have.status(200)
              done()
            })
        })
      })
    })

    after(() => {
      callback(token)
      createdID.forEach((id) => {
        UserSeq.destroy({ where: { _id: id } })
      })
    })
  })
}

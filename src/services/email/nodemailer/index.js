import path from 'path'
import { sendMail } from './transport'

const sendMailVerify = async (user = {}, code, expiredTime) => {
  // TODO get from config model
  const sendEmail = process.env.MAIL_SENDER

  const data = {
    expiredTime,
    code,
    user,
    year: new Date().getFullYear()
  }
  const templatePath = path.join(__dirname, '../template/SignupEmail.ejs')
  return sendMail(sendEmail, user.email, '[app_name] Verify your email address', data, templatePath)
}

const sendMailForgotPwd = async (user = {}, code, expiredTime) => {
  // TODO get from config model
  const sendEmail = process.env.MAIL_SENDER

  const data = {
    expiredTime,
    code,
    user,
    year: new Date().getFullYear()
  }
  const templatePath = path.join(__dirname, '../template/RecoverPassword.ejs')
  return sendMail(sendEmail, user.email, '[app_name] Reset your password', data, templatePath)
}


export {
  sendMailVerify,
  sendMailForgotPwd
}

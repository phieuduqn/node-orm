import nodemailer from 'nodemailer'
import ejs from 'ejs'
import fs from 'fs'

const debug = require('debug')('app_name-api: email');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: process.env.MAIL_IS_SECURE !== 'false',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  }
})

transporter
  .verify()
  .then(() => debug('SMTP is working...'))
  .catch((error) => {
    debug('Error smtp: %o', error);
    throw error;
  });
/**
 * Get file content async
 * @param templatePath
 * @return {Promise<unknown>}
 */
const getContentFileAsync = (templatePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(templatePath, 'utf8', (err, file) => {
      if (err) {
        reject(err)
      } else {
        resolve(file)
      }
    });
  })
}
/**
   * Get html string from template file
   * @param {string} templatePath
   * @param {object} data
   * @return {Promise<string>}
   */
const getHtmlFromTemplate = async (templatePath, data) => {
  const contentFile = await getContentFileAsync(templatePath)
  const compiledTmpl = ejs.compile(contentFile, { filename: templatePath })
  return compiledTmpl(data)
}
/**
 *
 * @param {*} opts
 */
const sendMail = async (from = process.env.MAIL_USER, to, subject, data, templatePath) => {
  try {
    const opts = {
      from,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject: subject || 'app_name',
      html: await getHtmlFromTemplate(templatePath, data),
    }
    await transporter.sendMail(opts)
    return true
  } catch (error) {
    console.log('Error send mail: ', error)
    return false
  }
}

export {
  sendMail
}

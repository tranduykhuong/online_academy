import nodemailer from 'nodemailer'
import {htmlToText} from 'html-to-text'


export default class Email {
  constructor(email) {
    this.to = email;
    this.from = 'ONLINE ACADEMY'
  }

  newTransport() {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'huynhtanvinhktqn123@gmail.com',
        pass: 'huynhtanvinhktqn0201',
        clientId: '590571309648-dfnv8ffon6keofsc04cl7ip7vr7oe4lf.apps.googleusercontent.com',
        clientSecret:'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',
        refreshToken: '1//0giirYOteNRUpCgYIARAAGBASNwF-L9IrAthiYg2TJywfxPQqiVBbqmqe_-FDAq7qxSJKHBykO0UItV84t0sD5v5Sfa3p31vKJGE'
      }
    })
  }

  async sendOTP(OTP) {
    const html = `
      <div>
        <h2>Chào mừng bạn đến với ONLINE ACADEMY</h2>
        <h4>Vui lòng nhập OTP sau để xác nhận đăng ký tài khoản!</h4>
        <p><strong>OTP: </strong>${OTP}</p>
      </div>
    `
    await this.newTransport().sendMail({
      from: this.from,
      to: this.to,
      subject: "Khởi tạo tài khoản",
      html
    })
  }
}

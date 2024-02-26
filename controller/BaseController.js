const axios = require('axios')

class BaseController {
  constructor() {
    this.options = {
      baseURL: process.env.BASE_URL,
      ValidateStatus: (status)=>{
        return true
      }
    }
    this.client = axios.create(this.options)
  }

  async login(userEmail=process.env.EMAIL, userPassword=process.env.PASSWORD) {
    const authResp = await axios.post(`${process.env.BASE_URL}/auth/signin`, {
      email: userEmail == 'default' ? process.env.EMAIL : userEmail,
      password: userPassword == 'default' ? process.env.PASSWORD : userPassword,
      remember: false
    })

    const sid = authResp.headers['set-cookie'][0].split(';')[0]
    this.options.headers = {Cookie: sid}
  }

  get(url) {
    return this.client.get(url, this.options)
  }

  post(url, data) {
    return this.client.post(url, data, this.options)
  }

  delete(url) {
    return this.client.delete(url, this.options)
  }
}

module.exports.BaseController = BaseController
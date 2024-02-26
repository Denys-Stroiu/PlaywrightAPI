const { BaseController } = require('./BaseController')

class CarController extends BaseController {
  constructor() {
    super()
    this.API_BRANDS = '/cars/brands'
    this.API_MODELS = '/cars/models'
    this.API_CARS = '/cars'
    this.CARS_ID = '/cars/{id}'
  }

  async createCar(car) {
    return this.post(this.API_CARS, car)
  }

  async deleteCarById(id) {
    return this.delete(this.CARS_ID.replace('{id}', id))
  }

  async getAllModels() {
    return this.get(this.API_MODELS)
  }

  async getUsersCars() {
    return this.get(this.API_CARS)
  }
}

module.exports.CarController = CarController
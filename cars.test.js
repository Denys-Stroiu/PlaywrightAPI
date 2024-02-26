const { CarController } = require('./controller/CarController')

test('create cars with all brabds and models', async () => {
  const carsController = new CarController()
  await carsController.login()
  const carsResponse = await carsController.getAllModels()

  for(const car of carsResponse.data.data) {
    const createCar = await carsController.createCar({
      "carBrandId": car.carBrandId,
      "carModelId": car.id,
      "mileage": 122
    })
    expect(createCar.status).toBe(201)
  }

  //Verify that all brands and models are added to the user's account
  const userCars = await carsController.getUsersCars()
  expect(userCars.data.data.length).toBe(carsResponse.data.data.length)
})

test('car should not be added without carBrandId', async () => {
  const carsController = new CarController()
  await carsController.login()

  try{
    await carsController.createCar({
      "carModelId": 1,
      "mileage": 122
    })
  } catch(error) {
    expect(error.response.status).toBe(400);
  } 
})

test('car should not be added without carModelId', async () => {
  const carsController = new CarController()
  await carsController.login()

  try{
    await carsController.createCar({
      "carBrandId": 1,
      "mileage": 122
    })
  } catch(error) {
    expect(error.response.status).toBe(400);
  }
})

test('car should not be added without mileage', async () => {
  const carsController = new CarController()
  await carsController.login()

  try{
    await carsController.createCar({
      "carModelId": 1,
      "carBrandId": 1
    })
  } catch(error) {
    expect(error.response.status).toBe(400);
  }
})

test('user with not valid email should not be able to add cars', async () => {
  try{
    const carsController = new CarController()
    await carsController.login("notvalidEmail", 'default')
    await carsController.createCar({
      "carModelId": 1,
      "carBrandId": 1
    })
  } catch(error) {
    expect(error.response.status).toBe(400);
  }
})

test('user with not valid password shoudl not be able to add cars', async () => {
  try{
    const carsController = new CarController()
    await carsController.login('default', "notvalidPassword")
    await carsController.createCar({
      "carModelId": 1,
      "carBrandId": 1
    })
  } catch(error) {
    expect(error.response.status).toBe(400);
  }
})

afterAll(async () => {
  // Delete all user's cars
  const carsController = new CarController()
  await carsController.login()
  const userCars = await carsController.getUsersCars()
  const carBrandIds = [...new Set(userCars.data.data.map(car => car.id))]

  for (const id of carBrandIds) {
    await carsController.deleteCarById(id);
  }
});
const axios = require('axios')

/**
 * User
 * aqa-tomRid7@gmail.com 
 * Qa123456!
 */
let brandResponse = []
let carsResponse = []
let client

async function deleteItems(ids) {
  for (const id of ids) {
    await axios.delete(`/cars/${id}`);
  }
}

beforeAll(async () => {
  const authResp = await axios.post('https://qauto.forstudy.space/api/auth/signin', {
    email: 'aqa-tomRid7@gmail.com',
    password: 'Qa123456!',
    remember: false
  })

  const sid = authResp.headers['set-cookie'][0].split(';')[0]
  client = axios.create({
    baseURL: 'https://qauto.forstudy.space/api',
    ValidateStatus: (status)=>{return status >=200 && status < 500},
    headers: {
      Cookie: sid
    }
  })

  brandResponse = await axios({
    method: 'get',
    url: 'https://qauto.forstudy.space/api/cars/brands'
  })

  carsResponse = await axios({
    method: 'get',
    url: 'https://qauto.forstudy.space/api/cars/models'
  })
});


test('create cars with all brabds and models', async () => {
  for(const car of carsResponse.data.data) {
    const createCar = await client.post('/cars', {
      "carBrandId": car.carBrandId,
      "carModelId": car.id,
      "mileage": 122
    })

    expect(createCar.status).toBe(201)
  }

  //Verify that all brands and models are added to the user's account
  const userCars = await client.get('/cars')
  expect(userCars.data.data.length).toBe(carsResponse.data.data.length)
})

test('car should not be added without carBrandId', async () => {
  try{
    await client.post('/cars', {
      "carModelId": 1,
      "mileage": 122
    })
  } catch(error) {
    expect(error.response.status).toBe(400);
  } 
})

test('car should not be added without carModelId', async () => {
  try{
    await client.post('/cars', {
      "carBrandId": 1,
      "mileage": 122
    })
  } catch(error) {
    expect(error.response.status).toBe(400);
  } 
})

test('car should not be added without mileage', async () => {
  try{
    await client.post('/cars', {
      "carBrandId": 1,
      "carBrandId": 1
    })
  } catch(error) {
    expect(error.response.status).toBe(400);
  } 
})

test('user with not valid email should not be able to add cars', async () => {
  try{
    const authResp = await axios.post('https://qauto.forstudy.space/api/auth/signin', {
      email: 'aqa-tomRid7NotValid@gmail.com',
      password: 'Qa123456!',
      remember: false
    })
  
    const sid = authResp.headers['set-cookie'][0].split(';')[0]
    let clientWrongEmail = axios.create({
      baseURL: 'https://qauto.forstudy.space/api',
      ValidateStatus: (status)=>{return status >=200 && status < 500},
      headers: {
        Cookie: sid
      }
    })

    await clientWrongEmail.post('/cars', {
      "carBrandId": 1,
      "carModelId": 1,
      "mileage": 122
    })
  } catch(error) {
    expect(error.response.status).toBe(400);
  }
})

test('user with not valid password shoudl not be able to add cars', async () => {
  try{
    const authResp = await axios.post('https://qauto.forstudy.space/api/auth/signin', {
      email: 'aqa-tomRid7@gmail.com',
      password: 'Qa123456!NotValid',
      remember: false
    })
  
    const sid = authResp.headers['set-cookie'][0].split(';')[0]
    let clientWrongEmail = axios.create({
      baseURL: 'https://qauto.forstudy.space/api',
      ValidateStatus: (status)=>{return status >=200 && status < 500},
      headers: {
        Cookie: sid
      }
    })

    await clientWrongEmail.post('/cars', {
      "carBrandId": 1,
      "carModelId": 1,
      "mileage": 122
    })
  } catch(error) {
    expect(error.response.status).toBe(400);
  }
})

afterAll(async () => {
  //Delete all user's cars
  const userCars = await client.get('/cars')
  const carBrandIds = [...new Set(userCars.data.data.map(car => car.id))]

  for (const id of carBrandIds) {
    await client.delete(`/cars/${id}`);
  }
});
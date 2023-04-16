const request  = require('supertest');
const { response } = require('../../app');
const app = require('../../app')


describe('Test GET/launches', ()=>{
    test('It should respond with 200 success',async () =>{
        const response = await request(app)
        .get('/launches')
        .expect('Content-Type', /json/)
        .expect(200)
        // expect(response.statusCode).toBe(200);
    });
});



describe('Test POST/launch', ()=>{
const completeLaunchData = {
    mission:"USS enterprise",
    rocket:"NCC-1707-D",
    target:'Kepler-186',
    launchDate:"January 4, 2028"
};

const launchDataWithoutDate = {
    mission:"USS enterprise",
    rocket:"NCC-1707-D",
    target:'Kepler-186',
};

const launchDataWithInvalidDate = {
    mission:"USS enterprise",
    rocket:"NCC-1707-D",
    target:'Kepler-186',
    launchDate:"invalidDate"
};



    test('It should respond with 201 create', async () =>{
        const response = await request(app)
        .post('/launches')
        .send(completeLaunchData)
        .expect('Content-Type', /json/)
        .expect(201)

        const requestDate = new Date(completeLaunchData.launchDate).valueOf();
        const responseDate = new Date(response.body.launchDate).valueOf();
        expect(responseDate).toBe(requestDate);

        expect(response.body).toMatchObject(launchDataWithoutDate)

    });
    test("It should catch missing required properties", async () =>{
        const response = await request(app)
        .post('/launches')
        .send(launchDataWithoutDate)
        .expect('Content-Type', /json/)
        .expect(400);

        expect(response.body).toStrictEqual({
            error:"please fill the required details",
        });
    });


    test("It should catch invalid dates", async () =>{
        const response = await request(app)
        .post('/launches')
        .send(launchDataWithInvalidDate)
        .expect('Content-Type', /json/)
        .expect(400);

        expect(response.body).toStrictEqual({
            error:"Not a valid date.",
        });
    });
});
# Node.js and Express Server

This backend server is serviced by Node.js, Express and MongoDB.

## Getting Started

1. Clone this repository
    `git clone https://github.com/yeppog/allez.git`bash

2. Ensure Node.js is installed. You can get Node.js here <https://nodejs.org/en/>

3. Run the following command to get the dependencies

    ```bash
    $ cd allez
    $ npm install
    > Installing dependencies
    ```

4. Run the server

    ```bash
    $ npm start
    > Server started on port 3001
    ```

## API Documentation

1. Register
    Register can be called at the endpoint `./api/users/register` and expects a `POST` request.

    The required fields are:
    - email: `string`
    - username: `string`
    - password: `string`

    A sample POST request using HTTPie can be found below:
    `http post :3001/api/users/register username="test" email="test" password="test"`

2. Login
    Login can be called at the endpoint `./api/users/login` and expects a `POST` request.

    The required fields are:
    - email: `string`
    - password: `string`

    A sample POST request using HTTPie can be found below:
    `http post :3001/api/users/login username="test" email="test" password="test"`

3. Verify JWT
    Verifying a JWT token can bne called at the endpoint './api/users/verify` and expects a `POST` request. Returns User data if the token is valid.

    The required header is:
    - `auth-token`: `string`

    A sample POST request using HTTPie can be found below:
    `http post :3001/api/users/verify auth-token:<JWT_TOKEN>"`

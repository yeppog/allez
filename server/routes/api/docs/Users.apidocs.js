/**
 * @swagger
 * components:
 *  schemas:
 *      LoginCredentials:
 *          type: object
 *          required:
 *              - email
 *              - password
 *          properties:
 *              email:
 *                  type: string
 *                  description: The email of the account being logged on to.
 *              password:
 *                  type: string
 *                  description: The password of the account being logged on to.
 *      RegisterCredentials:
 *          type: object
 *          required:
 *              - username
 *              - email
 *              - password
 *          properties:
 *              email:
 *                  type: string
 *                  description: The email of the account to be created with.
 *              password:
 *                  type: string
 *                  description: The password of the account to be created with.
 *              username:
 *                  type: string
 *                  description: The username of the account to be created with.
 *      ResetCredentials:
 *          type: object
 *          required:
 *              - email
 *          properties:
 *              email:
 *                  type: string
 *                  description: The email of the account to reset.
 *
 *      ResetEndCredentials:
 *          type: object
 *          required:
 *              - token
 *              - password
 *          properties:
 *              token:
 *                  type: string
 *                  description: JWT Token issued.
 *              password:
 *                  type: string
 *                  description: New password to use.
 *
 *
 *
 *
 *
 *
 */

/**
 * @openapi
 * /api/users/register:
 *  post:
 *      description: Registers a new user onto the database.
 *      tags: [Users]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/RegisterCredentials'
 *      responses:
 *          200:
 *              description: Sends an email out to the email address registered with
 *
 * @openapi
 * /api/users/login:
 *  post:
 *      description: Logs in a user. Performs a verification with the stored password hash.
 *      tags: [Users]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/LoginCredentials'
 *      responses:
 *          200:
 *              description: Returns a JWT token that can be used to keep a user logged in. Returns User data.
 *          400:
 *              description: Bad request. The json received has missing fields
 *
 *
 *
 *
 * /api/users/verify:
 *  get:
 *      description: Checks if a JWT token is valid. Then returns the user's data in json format
 *      tags: [Users]
 *      parameters:
 *          - in: header
 *            name: token
 *            schema:
 *              type: string
 *            required: true
 *
 *      responses:
 *          200:
 *              description: Returns a JWT token that can be used to keep a user logged in.
 *          400:
 *              description: Bad request. The json received has missing fields
 *
 * /api/users/reset:
 *  post:
 *      description: Receives an email address to reset a password. Then sends an email out to the user with a JWT token.
 *      tags: [Users]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/ResetCredentials'
 *      responses:
 *          200:
 *              description: OK.
 *          400:
 *              description: Bad request. Email not specified.
 *          401:
 *              description: Authorization fail. User does not exist.
 *          500:
 *              description: Unexpected error.
 *
 * /api/users/reset/end:
 *  post:
 *      description: Receives a new password for a user and updates their password.
 *      tags: [Users]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/ResetEndCredentials'
 *      responses:
 *          200:
 *              description: OK.
 *          400:
 *              description: Bad request. No token specified.
 *          401:
 *              descriptiopn: Unauthorised. Token has expired.
 *          500:
 *              description: Unexpected error.
 */

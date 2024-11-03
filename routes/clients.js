const express = require("express")
const router = express.Router()
const { validatorRegister, validatorLogin, validatorUpdate, validatorGetClient } = require("../validators/clients")
const { registerCtrl, loginCtrl, updateClient, deletefisClient } = require("../controllers/clients")
const {authMiddleware} = require("../midleware/sesion")


/**
 * @openapi
 * /api/register:
 *  post:
 *      tags:
 *      - Client
 *      summary: Register a new client
 *      description: Registers a new client in the system
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/client"
 *      responses:
 *          '200':
 *              description: Client successfully registered
 *          '401':
 *              description: Validation error
 */
router.post("/register", validatorRegister, registerCtrl);

/**
 * @openapi
 * /api/login:
 *  post:
 *      tags:
 *      - Client
 *      summary: Client login
 *      description: Allows a client to log into the system
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/login"
 *      responses:
 *          '200':
 *              description: Login successful
 *          '401':
 *              description: Invalid credentials
 */
router.post("/login", validatorLogin, loginCtrl);

/**
 * @openapi
 * /api/client/{id}:
 *  put:
 *      tags:
 *      - Client
 *      summary: Update client information
 *      description: Updates the information of an existing client
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: string
 *            description: The ID of the client to update
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/client"
 *      responses:
 *          '200':
 *              description: Client successfully updated
 *          '401':
 *              description: Authorization error
 *          '404':
 *              description: Client not found
 */
router.put("/:id", authMiddleware, validatorUpdate, updateClient);

/**
 * @openapi
 * /api/client/{id}:
 *  delete:
 *      tags:
 *      - Client
 *      summary: Delete a client
 *      description: Deletes an existing client by ID
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: string
 *            description: The ID of the client to delete
 *      responses:
 *          '200':
 *              description: Client successfully deleted
 *          '401':
 *              description: Authorization error
 *          '404':
 *              description: Client not found
 */
router.delete("/:id", authMiddleware, validatorGetClient, deletefisClient);

module.exports = router
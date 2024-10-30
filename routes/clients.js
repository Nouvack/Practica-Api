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
 *      summary: Client register
 *      description: Register a new client
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/client"
 *      responses:
 *          '200':
 *              description: Returns the inserted object
 *          '401':
 *              description: Validation error
 */
router.post("/register", validatorRegister, registerCtrl)

/**
 * @openapi
 * /api/login:
 *  post:
 *      tags:
 *      - Client
 *      summary: Login client
 *      description: ''
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/login"
 *      responses:
 *          '200':
 *              description: Returns the inserted object
 *          '401':
 *              description: Validation error
 */
router.post("/login", validatorLogin, loginCtrl)

router.put("/:id", authMiddleware, validatorUpdate, updateClient)

router.put("/:id", authMiddleware, validatorUpdate, updateClient)

router.delete("/:id", authMiddleware, validatorGetClient, deletefisClient)

module.exports = router
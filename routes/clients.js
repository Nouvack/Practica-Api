const express = require("express")
const router = express.Router()
const { validatorRegister, validatorLogin, validatorGetClient } = require("../validators/clients")
const { registerCtrl, loginCtrl, updateClient, deletefisClient } = require("../controllers/clients")
const {authMiddleware} = require("../midleware/sesion")

/**
 * @swagger
 * /api/clients/register:
 *   post:
 *     tags:
 *       - Client
 *     summary: Register a new client
 *     description: This endpoint allows for registering a new client with their details, including name, email, password, age, city, and interests. The password will be securely encrypted before being stored.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/client"
 *     responses:
 *       200:
 *         description: Returns the inserted client object (excluding the password).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 client:
 *                   $ref: "#/components/schemas/client"
 *       401:
 *         description: Validation error.
 *       500:
 *         description: Server error while registering the client.
 */
router.post("/register", validatorRegister, registerCtrl);

/**
 * @swagger
 * /api/clients/login:
 *   post:
 *     tags:
 *       - Client
 *     summary: Login Client
 *     description: This endpoint authenticates a client using their email and password. If the credentials are valid, it returns a token and client details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/client"
 *     responses:
 *       200:
 *         description: Returns a token and client details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Authentication token for the client.
 *                 client:
 *                   $ref: "#/components/schemas/client"
 *       401:
 *         description: Invalid password or validation error.
 *       404:
 *         description: Client not found.
 *       500:
 *         description: Server error while processing the login request.
 */
router.post("/login", validatorLogin, loginCtrl);

/**
 * @swagger
 * /api/clients/update/{id}:
 *   put:
 *     tags:
 *       - Client
 *     summary: Update client information
 *     description: This endpoint allows an authenticated client to update their profile information. The request requires a valid token, and the `id` in the path must match the `id` in the token.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the client to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/client"
 *     responses:
 *       200:
 *         description: Returns the updated client information.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/client"
 *       403:
 *         description: Authorization error. The client is not allowed to update this profile.
 *       404:
 *         description: Client not found.
 *       500:
 *         description: Server error while updating the client.
 */
router.put("/update/:id", authMiddleware, validatorRegister, updateClient);

/**
 * @swagger
 * /api/clients/delete/{id}:
 *   delete:
 *     summary: Delete a specific Client by its ID
 *     description: This endpoint allows an authorized commerce to delete a client by its ID. Only the client with the same ID can perform this operation.
 *     tags:
 *       - Client
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the client to delete.
 *     responses:
 *       200:
 *         description: The client was successfully deleted.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Eliminado"
 *       403:
 *         description: Authorization error. The client is not allowed to delete this client.
 *       404:
 *         description: client not found.
 *       500:
 *         description: Error while deleting the client.
 */
router.delete("/delete/:id", authMiddleware, validatorGetClient, deletefisClient);

module.exports = router
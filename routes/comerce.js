const express = require("express")
const {getComerces, getComerce, createComerce, updateComerce, deleteComerce, deletefisComerce, send } = require("../controllers/comerce")//Importamos las funciones que vienen del controlador
const { validatorGetItem, validatorCreateitem, validatorUpdate, validatorUpdateComerce } = require("../validators/comerce")
const {authMiddleware, authComerWare} = require("../midleware/sesion")
const checkRol = require("../midleware/role")
const { validatorMail } = require("../validators/comerce")
const router = express.Router()

//Aqui se definen las rutas que usaremos para las solicitudes en el documento http
/**
 * @swagger
 * /api/comerce:
 *   get:
 *     summary: Get all comerces
 *     description: This endpoint retrieves a list of all comerces stored in the database. The results are sorted in ascending order by the `cif` field.
 *     tags:
 *       - Comerces
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of comerces sorted by `cif`.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/comerce"
 *       401:
 *         description: Unauthorized. The user does not have the required permissions.
 *       500:
 *         description: Server error while retrieving comerces.
 */
router.get('/', authMiddleware, checkRol("admin"), getComerces);

/**
 * @swagger
 * /api/comerce/{cif}:
 *   get:
 *     summary: Get a single comerce by cif
 *     description: This endpoint retrieves a single comerces stored in the database.
 *     tags:
 *       - Comerces
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A single comerce`.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/comerce"
 *       401:
 *         description: Unauthorized. The user does not have the required permissions.
 *       500:
 *         description: Server error while retrieving comerces.
 */
router.get('/:cif', authMiddleware, checkRol("admin"), validatorGetItem, getComerce);

/**
 * @swagger
 * /api/comerce/:
 *   post:
 *     summary: Create a new commerce
 *     description: This endpoint allows an admin to create a new commerce. The `email` must be unique for each commerce.
 *     tags:
 *       - Comerces
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/comerce"
 *     responses:
 *       200:
 *         description: Returns the created commerce and a token for authentication.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Authentication token for the created commerce.
 *                 comerce:
 *                   $ref: "#/components/schemas/comerce"
 *       401:
 *         description: Unauthorized. The user does not have the required permissions.
 *       409:
 *         description: A commerce with the provided email already exists.
 *       500:
 *         description: Server error while creating the commerce.
 */
router.post("/", authMiddleware, checkRol("admin"), validatorCreateitem, createComerce);

/**
 * @swagger
 * /api/comerce/mail:
 *   post:
 *     summary: Send an email
 *     description: This endpoint allows an authorized commerce to send emails. The `to` field accepts a list of recipient email addresses.
 *     tags:
 *       - Comerces
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/comerce"
 *     responses:
 *       200:
 *         description: Email sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messageId:
 *                   type: string
 *                   description: Unique identifier for the sent email.
 *                   example: "<abc123@example.com>"
 *                 status:
 *                   type: string
 *                   description: Status of the email sending process.
 *                   example: "success"
 *       400:
 *         description: Bad request. Missing or invalid fields in the request body.
 *       401:
 *         description: Unauthorized. The user does not have the required permissions.
 *       500:
 *         description: Server error while sending the email.
 */
router.post("/mail", authComerWare, validatorMail, send);

/**
 * @swagger
 * /api/comerce:
 *   put:
 *     summary: Update commerce information
 *     description: This endpoint allows an admin to update the information of a commerce identified by its `cif`. The request requires admin privileges and a valid token.
 *     tags:
 *       - Comerces
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: cif
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier (CIF) of the commerce to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/comerce"
 *     responses:
 *       200:
 *         description: The updated commerce information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: "#/components/schemas/comerce"
 *       400:
 *         description: Bad request. Missing or invalid fields in the query or body.
 *       401:
 *         description: Unauthorized. The user does not have the required permissions.
 *       404:
 *         description: Commerce not found.
 *       500:
 *         description: Server error while updating the commerce.
 */
router.put("/", authMiddleware, checkRol("admin"), validatorUpdateComerce, updateComerce);

/**
 * @swagger
 * /api/comerce:
 *   delete:
 *     summary: Delete a commerce by CIF
 *     description: This endpoint permanently deletes a commerce from the database. Only users with the `admin` role can perform this operation.
 *     tags:
 *       - Comerces
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: cif
 *         required: true
 *         schema:
 *           type: string
 *           example: "B12345678"
 *         description: The unique identifier (CIF) of the commerce to delete.
 *     responses:
 *       200:
 *         description: Commerce successfully deleted.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Eliminado"
 *       400:
 *         description: Missing or invalid `cif` parameter.
 *       401:
 *         description: Unauthorized. The user is not authenticated.
 *       403:
 *         description: Forbidden. The user does not have the `admin` role.
 *       404:
 *         description: Commerce not found.
 *       500:
 *         description: Server error while deleting the commerce.
 */
router.delete("/", authMiddleware, checkRol("admin"), validatorGetItem, deletefisComerce);

/**
 * @swagger
 * /api/comerce/archive:
 *   delete:
 *     summary: Archive (soft delete) a commerce by CIF
 *     description: This endpoint performs a soft delete of a commerce. The commerce is not permanently removed from the database but is marked as deleted and can be restored later.
 *     tags:
 *       - Comerces
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: cif
 *         required: true
 *         schema:
 *           type: string
 *           example: "B12345678"
 *         description: The unique identifier (CIF) of the commerce to archive.
 *     responses:
 *       200:
 *         description: Commerce successfully archived.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Eliminado"
 *       400:
 *         description: Missing or invalid `cif` parameter.
 *       401:
 *         description: Unauthorized. The user is not authenticated.
 *       403:
 *         description: Forbidden. The user does not have the `admin` role.
 *       404:
 *         description: Commerce not found.
 *       500:
 *         description: Server error while archiving the commerce.
 */
router.delete("/archive/", authMiddleware, checkRol("admin"), validatorGetItem, deleteComerce);

module.exports = router
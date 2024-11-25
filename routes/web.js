const express = require("express")
const { getWebs, createWeb, updateWeb, deleteWeb, deletefisWeb, patchimg, patchText, patchScore, getClients } = require("../controllers/web")//Importamos las funciones que vienen del controlador
const { validatorGetWeb, validatorCreateWeb } = require("../validators/web")
const { authComerWare, authMiddleware } = require("../midleware/sesion")
const uploadMiddleware = require("../utils/handleStorage")
const router = express.Router()

//Aqui se definen las rutas que usaremos para las solicitudes en el documento http
/**
 * @swagger
 * /:
 *   get:
 *     summary: Get a list of webs or a single web
 *     description: This endpoint allows filtering and retrieving information about webs stored in the database. It also supports retrieving a specific web by its ID.
 *     tags:
 *       - Webs
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter webs by city. Case-insensitive.
 *       - in: query
 *         name: act
 *         schema:
 *           type: string
 *         description: Filter webs by activity. Case-insensitive.
 *       - in: query
 *         name: scoring
 *         schema:
 *           type: boolean
 *         description: If present, webs will be sorted by client review score in descending order.
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: Unique ID of a specific web.
 *     responses:
 *       200:
 *         description: A list of webs or a single web.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/web'
 *       500:
 *         description: Error while retrieving webs.
 */
router.get("/", getWebs);

/**
 * @swagger
 * /api/web/clients:
 *   get:
 *     summary: Get a list of clients based on their city and/or interests.
 *     description: This endpoint allows filtering and retrieving information about clients stored in the database. You can filter by `city`, `interest`, or both.
 *     tags:
 *       - Webs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter clients by city. Case-insensitive.
 *       - in: query
 *         name: interest
 *         schema:
 *           type: string
 *         description: Filter clients by interest. Case-insensitive.
 *     responses:
 *       200:
 *         description: A list of clients matching the filters.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/client'
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *       500:
 *         description: Error while retrieving clients.
 */
router.get("/clients/", authComerWare, getClients);

/**
 * @swagger
 * /:
 *   post:
 *     summary: Create a new web and associate it with a commerce
 *     description: This endpoint allows you to create a new web and associate it with a commerce. It ensures that the commerce does not already have an associated page before creating a new one.
 *     tags:
 *       - Webs
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/web' # Reference to the web schema
 *     responses:
 *       200:
 *         description: Successfully created a new web and associated it with the commerce.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/web'
 *       401:
 *         description: The commerce already has an associated page.
 *       500:
 *         description: An internal server error occurred.
 */
router.post("/", authComerWare, validatorCreateWeb, createWeb);

/**
 * @swagger
 * /api/web/{id}:
 *   put:
 *     summary: Update a specific web by its ID
 *     description: This endpoint updates the information of an existing web. The commerce must be authorized, and the ID in the token must match the web ID being updated.
 *     tags:
 *       - Webs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the web to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/web'
 *     responses:
 *       200:
 *         description: The updated web object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/web'
 *       403:
 *         description: Authorization error. The commerce is not allowed to update this web.
 *       404:
 *         description: Web not found.
 *       500:
 *         description: Error while updating the web.
 */
router.put("/:id", authComerWare, validatorGetWeb, validatorCreateWeb, updateWeb);

/**
 * @swagger
 * /api/web/text/{id}:
 *   patch:
 *     summary: Update the text field of a specific web by its ID
 *     description: This endpoint allows you to update the `text` field of a web by appending new items. The commerce must be authorized, and the ID in the token must match the web ID being updated.
 *     tags:
 *       - Webs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the web to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Nuevo texto del artículo sobre Lima"]
 *     responses:
 *       200:
 *         description: The updated web object with the new text appended.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/web'
 *       403:
 *         description: Authorization error. The commerce is not allowed to update this web.
 *       404:
 *         description: Web not found.
 *       500:
 *         description: Error while updating the web.
 */
router.patch("/text/:id", authComerWare, validatorGetWeb, patchText);

/**
 * @swagger
 * /api/web/review/{id}:
 *   patch:
 *     summary: Update the client review of a specific web by its ID
 *     description: This endpoint allows you to add new scores and reviews to the `client_review` field of a web. The `scoring` and `reviews` fields are updated by appending new values to the existing arrays.
 *     tags:
 *       - Webs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the web to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               client_review:
 *                 type: object
 *                 properties:
 *                   scoring:
 *                     type: array
 *                     items:
 *                       type: number
 *                     example: [4]
 *                   reviews:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["Muy buen artículo"]
 *     responses:
 *       200:
 *         description: The updated web object with the new reviews and scores appended.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/web'
 *       400:
 *         description: Bad Request. Invalid data format or missing fields.
 *       404:
 *         description: Web not found.
 *       500:
 *         description: Error while updating the web.
 */
router.patch("/review/:id", authMiddleware, validatorGetWeb, patchScore);

/**
 * @swagger
 * /api/web/img/{id}:
 *   patch:
 *     summary: Add an image to the web's img array
 *     description: This endpoint allows authorized commerces to upload and add a new image to the `img` field of a specific web. The `img` field is updated by appending the URL of the uploaded image.
 *     tags:
 *       - Webs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the web to update.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload.
 *     responses:
 *       200:
 *         description: The updated web object with the new image URL added to the `img` field.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/web'
 *       403:
 *         description: Authorization error. The commerce is not allowed to update this web.
 *       500:
 *         description: Error while adding the image.
 */
router.patch("/img/:id", authComerWare, validatorGetWeb, uploadMiddleware.single("image"), patchimg);

/**
 * @swagger
 * /api/web/{id}:
 *   delete:
 *     summary: Delete a specific web by its ID
 *     description: This endpoint allows an authorized commerce to delete a web by its ID. Only the commerce that owns the web can perform this operation.
 *     tags:
 *       - Webs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the web to delete.
 *     responses:
 *       200:
 *         description: The web was successfully deleted.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Eliminado"
 *       403:
 *         description: Authorization error. The commerce is not allowed to delete this web.
 *       404:
 *         description: Web not found.
 *       500:
 *         description: Error while deleting the web.
 */
router.delete("/:id", authComerWare, validatorGetWeb, deletefisWeb);

/**
 * @swagger
 * /api/web/archive/{id}:
 *   delete:
 *     summary: Archive a specific web by its ID
 *     description: This endpoint allows an authorized commerce to archive a web by its ID. Only the commerce that owns the web can perform this operation. The web will be logically deleted or archived.
 *     tags:
 *       - Webs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the web to archive.
 *     responses:
 *       200:
 *         description: The web was successfully archived.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Eliminado"
 *       403:
 *         description: Authorization error. The commerce is not allowed to archive this web.
 *       404:
 *         description: Web not found.
 *       500:
 *         description: Error while archiving the web.
 */
router.delete("/archive/:id", authComerWare, validatorGetWeb, deleteWeb);

module.exports = router
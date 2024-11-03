const express = require("express")
const { getWebs, getWeb, createWeb, updateWeb, deleteWeb, deletefisWeb, patchimg, patchWeb, getclients } = require("../controllers/web")//Importamos las funciones que vienen del controlador
const { validatorGetWeb, validatorCreateWeb } = require("../validators/web")
const {authComerWare} = require("../midleware/sesion")
const uploadMiddleware = require("../utils/handleStorage")
const router = express.Router()

//Aqui se definen las rutas que usaremos para las solicitudes en el documento http
/**
 * @openapi
 * /api/web:
 *  get:
 *      tags:
 *      - Web
 *      summary: Get all webs
 *      description: Retrieves a list of all webs
 *      responses:
 *          '200':
 *              description: A list of webs
 */
router.get('/', getWebs);

/**
 * @openapi
 * /api/web/{id}:
 *  get:
 *      tags:
 *      - Web
 *      summary: Get a web by ID
 *      description: Retrieves a specific web by its ID
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: string
 *            description: The ID of the web to retrieve
 *      responses:
 *          '200':
 *              description: Web found
 *          '404':
 *              description: Web not found
 */
router.get('/:id', validatorGetWeb, getWeb);

/**
 * @openapi
 * /api/web/clients/{interests}:
 *  get:
 *      tags:
 *      - Web
 *      summary: Get clients by interest
 *      description: Retrieves clients interested in a specific activity
 *      parameters:
 *          - in: path
 *            name: interests
 *            required: true
 *            schema:
 *                type: string
 *            description: The interest to filter clients by
 *      responses:
 *          '200':
 *              description: Clients found
 *          '404':
 *              description: No clients found
 */
router.get("/clients/:interests", getclients);

/**
 * @openapi
 * /api/web:
 *  post:
 *      tags:
 *      - Web
 *      summary: Create a new web
 *      description: Creates a new web resource
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/web"
 *      responses:
 *          '201':
 *              description: Web created successfully
 *          '401':
 *              description: Unauthorized
 */
router.post("/", authComerWare, validatorCreateWeb, createWeb);

/**
 * @openapi
 * /api/web/{id}:
 *  put:
 *      tags:
 *      - Web
 *      summary: Update a web by ID
 *      description: Updates a specific web by its ID
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: string
 *            description: The ID of the web to update
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/web"
 *      responses:
 *          '200':
 *              description: Web updated successfully
 *          '404':
 *              description: Web not found
 */
router.put("/:id", authComerWare, validatorGetWeb, validatorCreateWeb, updateWeb);

/**
 * @openapi
 * /api/web/text/{id}:
 *  patch:
 *      tags:
 *      - Web
 *      summary: Update text of a web
 *      description: Updates the text content of a specific web by its ID
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: string
 *            description: The ID of the web to update text
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          text:
 *                              type: array
 *                              items:
 *                                  type: string
 *      responses:
 *          '200':
 *              description: Text updated successfully
 *          '404':
 *              description: Web not found
 */
router.patch("/text/:id", authComerWare, validatorGetWeb, patchWeb);

/**
 * @openapi
 * /api/web/img/{id}:
 *  patch:
 *      tags:
 *      - Web
 *      summary: Update image of a web
 *      description: Adds an image to a specific web by its ID
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: string
 *            description: The ID of the web to update image
 *      requestBody:
 *          required: true
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          image:
 *                              type: string
 *                              format: binary
 *      responses:
 *          '200':
 *              description: Image updated successfully
 *          '404':
 *              description: Web not found
 */
router.patch("/img/:id", authComerWare, validatorGetWeb, uploadMiddleware.single("image"), patchimg);

/**
 * @openapi
 * /api/web/{id}:
 *  delete:
 *      tags:
 *      - Web
 *      summary: Soft delete a web by ID
 *      description: Soft deletes a specific web by its ID
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: string
 *            description: The ID of the web to soft delete
 *      responses:
 *          '200':
 *              description: Web soft deleted successfully
 *          '404':
 *              description: Web not found
 */
router.delete("/:id", authComerWare, validatorGetWeb, deletefisWeb);

/**
 * @openapi
 * /api/web/archive/{id}:
 *  delete:
 *      tags:
 *      - Web
 *      summary: Permanently delete a web by ID
 *      description: Permanently deletes a specific web by its ID
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: string
 *            description: The ID of the web to delete permanently
 *      responses:
 *          '200':
 *              description: Web permanently deleted successfully
 *          '404':
 *              description: Web not found
 */
router.delete("/archive/:id", authComerWare, validatorGetWeb, deleteWeb);


module.exports = router
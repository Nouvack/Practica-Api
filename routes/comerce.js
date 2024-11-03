const express = require("express")
const {getComerces, getComerce, createComerce, updateComerce, deleteComerce, deletefisComerce } = require("../controllers/comerce")//Importamos las funciones que vienen del controlador
const { validatorGetItem, validatorCreateitem } = require("../validators/comerce")
const {authMiddleware} = require("../midleware/sesion")
const checkRol = require("../midleware/role")
const router = express.Router()

//Aqui se definen las rutas que usaremos para las solicitudes en el documento http
/**
 * @openapi
 * /api/comerce:
 *  get:
 *      tags:
 *      - Comerce
 *      summary: Get all comerces
 *      description: Retrieves a list of all comerces (requires admin role)
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          '200':
 *              description: A list of comerces
 *          '401':
 *              description: Unauthorized
 */
router.get('/', authMiddleware, checkRol("admin"), getComerces);

/**
 * @openapi
 * /api/comerce/{cif}:
 *  get:
 *      tags:
 *      - Comerce
 *      summary: Get a single comerce by CIF
 *      description: Retrieves a specific comerce by its CIF (requires admin role)
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: cif
 *            required: true
 *            schema:
 *                type: string
 *            description: The CIF of the comerce to retrieve
 *      responses:
 *          '200':
 *              description: Comerce found
 *          '401':
 *              description: Unauthorized
 *          '404':
 *              description: Comerce not found
 */
router.get('/:cif', authMiddleware, checkRol("admin"), validatorGetItem, getComerce);

/**
 * @openapi
 * /api/comerce:
 *  post:
 *      tags:
 *      - Comerce
 *      summary: Create a new comerce
 *      description: Creates a new comerce (requires admin role)
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/comerce"
 *      responses:
 *          '201':
 *              description: Comerce created successfully
 *          '400':
 *              description: Validation error
 *          '401':
 *              description: Unauthorized
 */
router.post("/", authMiddleware, checkRol("admin"), validatorCreateitem, createComerce);

/**
 * @openapi
 * /api/comerce/{cif}:
 *  put:
 *      tags:
 *      - Comerce
 *      summary: Update a comerce by CIF
 *      description: Updates a specific comerce by its CIF (requires admin role)
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: cif
 *            required: true
 *            schema:
 *                type: string
 *            description: The CIF of the comerce to update
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/comerce"
 *      responses:
 *          '200':
 *              description: Comerce updated successfully
 *          '400':
 *              description: Validation error
 *          '401':
 *              description: Unauthorized
 *          '404':
 *              description: Comerce not found
 */
router.put("/:cif", authMiddleware, checkRol("admin"), validatorGetItem, validatorCreateitem, updateComerce);

/**
 * @openapi
 * /api/comerce/{cif}:
 *  delete:
 *      tags:
 *      - Comerce
 *      summary: Soft delete a comerce by CIF
 *      description: Soft deletes a specific comerce by its CIF
 *      parameters:
 *          - in: path
 *            name: cif
 *            required: true
 *            schema:
 *                type: string
 *            description: The CIF of the comerce to soft delete
 *      responses:
 *          '200':
 *              description: Comerce soft deleted successfully
 *          '401':
 *              description: Unauthorized
 *          '404':
 *              description: Comerce not found
 */
router.delete("/:cif", validatorGetItem, deletefisComerce);

/**
 * @openapi
 * /api/comerce/archive/{cif}:
 *  delete:
 *      tags:
 *      - Comerce
 *      summary: Permanently delete a comerce by CIF
 *      description: Permanently deletes a specific comerce by its CIF
 *      parameters:
 *          - in: path
 *            name: cif
 *            required: true
 *            schema:
 *                type: string
 *            description: The CIF of the comerce to delete permanently
 *      responses:
 *          '200':
 *              description: Comerce permanently deleted successfully
 *          '401':
 *              description: Unauthorized
 *          '404':
 *              description: Comerce not found
 */
router.delete("/archive/:cif", validatorGetItem, deleteComerce);

module.exports = router
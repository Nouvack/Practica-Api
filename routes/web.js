const express = require("express")
const { getWebs, getWeb, createWeb, updateWeb, deleteWeb, deletefisWeb, patchimg } = require("../controllers/web")//Importamos las funciones que vienen del controlador
const { validatorGetWeb, validatorCreateWeb } = require("../validators/web")
const uploadMiddleware = require("../utils/handleStorage")
const router = express.Router()

//Aqui se definen las rutas que usaremos para las solicitudes en el documento http
router.get('/', getWebs)
router.get('/:id', validatorGetWeb, getWeb)
router.post("/", validatorCreateWeb, createWeb)
router.put("/:id", validatorGetWeb, validatorCreateWeb, updateWeb)
router.patch("/:id", validatorGetWeb, uploadMiddleware.single("image"), patchimg)
router.delete("/:id", validatorGetWeb, deletefisWeb)
router.delete("/archive/:id", validatorGetWeb, deleteWeb)

module.exports = router
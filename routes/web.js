const express = require("express")
const { getWebs, getWeb, createWeb, updateWeb, deleteWeb, deletefisWeb, patchimg, patchWeb } = require("../controllers/web")//Importamos las funciones que vienen del controlador
const { validatorGetWeb, validatorCreateWeb } = require("../validators/web")
const {authComerWare} = require("../midleware/sesion")
const uploadMiddleware = require("../utils/handleStorage")
const router = express.Router()

//Aqui se definen las rutas que usaremos para las solicitudes en el documento http
router.get('/', getWebs)
router.get('/:id',validatorGetWeb, getWeb)
router.post("/",authComerWare, validatorCreateWeb, createWeb)
router.put("/:id", authComerWare,validatorGetWeb, validatorCreateWeb, updateWeb)
router.patch("/text/:id", authComerWare, validatorGetWeb, patchWeb)
router.patch("/img/:id",authComerWare,validatorGetWeb, uploadMiddleware.single("image"), patchimg)
router.delete("/:id",authComerWare, validatorGetWeb, deletefisWeb)
router.delete("/archive/:id",authComerWare, validatorGetWeb, deleteWeb)

module.exports = router
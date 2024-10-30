const express = require("express")
const { getItems, getItem, createItem, updateItem, deleteItem, deletefisItem } = require("../controllers/comerce")//Importamos las funciones que vienen del controlador
const { validatorGetItem, validatorCreateitem } = require("../validators/comerce")
const {authMiddleware} = require("../midleware/sesion")
const checkRol = require("../midleware/role")
const router = express.Router()

//Aqui se definen las rutas que usaremos para las solicitudes en el documento http
router.get('/', authMiddleware, checkRol("admin"), getItems)
router.get('/:cif',authMiddleware, checkRol("admin"), validatorGetItem, getItem)
router.post("/",authMiddleware, checkRol("admin"), validatorCreateitem, createItem)
router.put("/:cif", authMiddleware, checkRol("admin"),validatorGetItem, validatorCreateitem, updateItem)
router.delete("/:cif", validatorGetItem, deletefisItem)
router.delete("/archive/:cif", validatorGetItem, deleteItem)
module.exports = router
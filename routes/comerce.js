const express = require("express")
const { getItems, getItem, createItem, updateItem, deleteItem, deletefisItem } = require("../controllers/comerce")//Importamos las funciones que vienen del controlador
const { validatorGetItem, validatorCreateitem } = require("../validators/comerce")
const router = express.Router()

//Aqui se definen las rutas que usaremos para las solicitudes en el documento http
router.get('/', getItems)
router.get('/:cif', validatorGetItem, getItem)
router.post("/", validatorCreateitem, createItem)
router.put("/:cif", validatorGetItem, validatorCreateitem, updateItem)
router.delete("/:cif", validatorGetItem, deletefisItem)
router.delete("/archive/:cif", validatorGetItem, deleteItem)
module.exports = router
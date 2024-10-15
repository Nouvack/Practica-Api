const express = require("express")
const { getItems, getItem, createItem, updateItem, deleteItem, deletefisItem } = require("../controllers/comerce")//Importamos las funciones que vienen del controlador
const router = express.Router()

//Aqui se definen las rutas que usaremos para las solicitudes en el documento http
router.get('/', getItems)
router.get('/:cif', getItem)
router.post("/", createItem)
router.put("/:cif", updateItem)
router.delete("/:cif", deletefisItem)
router.delete("/archive/:cif", deleteItem)
module.exports = router
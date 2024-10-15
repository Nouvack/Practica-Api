//Todo este codigo se encarga de simplificar la forma en como le pasamos la rutas de los archivos que ciertas funciones necesitan
//Por ejemplo cierta funcion necesita del archivo "hola.js", esta funcion se encarga de pasarle como "hola"
const express = require("express")
const fs = require("fs")
const router = express.Router()

const removeExtension = (fileName) => {
    return fileName.split('.').shift()
}

fs.readdirSync(__dirname).filter((file) => {
    const name = removeExtension(file);
    if (name != 'index') {
        router.use('/' + name, require('./' + name))
    }
})

module.exports = router
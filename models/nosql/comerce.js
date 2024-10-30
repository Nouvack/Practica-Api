const mongoose = require('mongoose')
const mongooseDelete = require("mongoose-delete")//Importamos dos modulos
const comSchema = new mongoose.Schema(
    {
        name: {
            type: String
        },
        cif: {
            type: String
        },
        adress: {
            type: String
        },
        email: {
            type: String,
            unique: true
        },
        phone: {
            type: String
        },
        id_page: {
            type: mongoose.Schema.Types.ObjectId
        }
    }
)

comSchema.plugin(mongooseDelete, { overrideMethods: "all" })//Sobreescribimos los metodos como find, findone, para que se ignoren los documentos eliminados
module.exports = mongoose.model("Comerce", comSchema)//Exportamos el modelo
const mongoose = require('mongoose')
const mongooseDelete = require("mongoose-delete")//Importamos dos modulos
const clientSchema = new mongoose.Schema(
    {
        name: {
            type: String
        },
        email: {
            type: String,
            unique: true
        },
        password: {
            type: String
        },
        age: {
            type: String
        },
        city: {
            type: String
        },
        interests: {
            type: [String]
        },
        spam: {
            type: Boolean
        },
        role: {
            type: ["client", "admin"], // es el enum de SQL
            default: "client"
        }
    }
)

clientSchema.plugin(mongooseDelete, { overrideMethods: "all" })//Sobreescribimos los metodos como find, findone, para que se ignoren los documentos eliminados
module.exports = mongoose.model("Client", clientSchema)//Exportamos el modelo
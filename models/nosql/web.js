const mongoose = require('mongoose')
const mongooseDelete = require("mongoose-delete")//Importamos dos modulos
const webSchema = new mongoose.Schema(
    {
        city: {
            type: String
        },
        activity: {
            type: String
        },
        tittle: {
            type: String
        },
        sumary: {
            type: String
        },
        text: {
            type: [String]
        },
        img: {
            type: [String]
        },
        client_review: {
            scoring: {
                type: [Number],
                min: 0,
                max: 5
            },
            total_score: {
                type: Number
            },
            reviews: {
                type: [String]
            }
        }
    }
)

webSchema.plugin(mongooseDelete, { overrideMethods: "all" })//Sobreescribimos los metodos como find, findone, para que se ignoren los documentos eliminados
module.exports = mongoose.model("Web", webSchema)//Exportamos el modelo
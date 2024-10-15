const mongoose = require('mongoose')//Importa el modulo necesario para conectarlo con la base de datos

const dbConnect = () => {//Funcion que establece la conexion con la base de datos
    const db_uri = process.env.DB_URI//DB_URI viene a ser la url de la base de datos
    mongoose.set('strictQuery', false)
    try {
        mongoose.connect(db_uri)
    } catch (error) {
        console.err("Error conectando a la BD:", error)

    }
    mongoose.connection.on("connected", () => console.log("Conectado a la BD"))

}

module.exports = dbConnect
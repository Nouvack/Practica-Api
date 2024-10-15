//Aqui se ejecuta todo el api
const express = require("express")
//const cors = require("cors")
require('dotenv').config();//Esto es para las variables de entorno
const dbConnect = require("./config/mongo")//Aqui importa la funcion dbConnect desde el archivo mongo
//const router = require("./routes")

const app = express()
//Le decimos a la app de Express() que use cors para evitar el error Cross-Domain (XD)
//app.arguments(cors())
app.use(express.json())

app.use("/api", require("./routes"))//Se configura como se pasan las rutas en las solicitudes

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log("Servidor escuchando en el puerto " + port)
    dbConnect();
})

//Aqui se ejecuta todo el api
const express = require("express")
require('dotenv').config();//Esto es para las variables de entorno
const dbConnect = require("./config/mongo")//Aqui importa la funcion dbConnect desde el archivo mongo
const morganBody = require("morgan-body")
const { IncomingWebhook } = require("@slack/webhook")
const loggerStream = require("./utils/handleLogger")
const swaggerUi = require("swagger-ui-express")
const swaggerSpecs = require("./docs/swagger")
const cors = require("cors")

const app = express()
app.use(cors());
app.use(express.static("storage"))
app.use(express.json())
app.use("/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpecs)
)

app.use("/api", require("./routes"))//Se configura como se pasan las rutas en las solicitudes



const port = process.env.PORT || 3000


morganBody(app, {
    noColors: true,
    skip: function (req, res) {
        return res.statusCode < 400
    },
    stream: loggerStream
})

app.listen(port, () => {
    console.log("Servidor escuchando en el puerto " + port)
    dbConnect();
})

module.exports = app
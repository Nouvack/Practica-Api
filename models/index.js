const models = {
    comerModel: require("./nosql/comerce"),//Se recibe el modelo
    webModel: require("./nosql/web"),
    clientModel: require("./nosql/clients")
}
module.exports = models//Posteriormente se exporta
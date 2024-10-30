const { matchedData } = require("express-validator")
const { tokenClient } = require("../utils/handleJwt.js")
const { encrypt, compare } = require("../utils/handlePassword.js")
const { handleHttpError } = require("../utils/handleErrror.js")
const { clientModel } = require('../models/index.js')

const registerCtrl = async (req, res) => {
    try {
        req = matchedData(req)
        const password = await encrypt(req.password)
        const body = { ...req, password } // Con "..." duplicamos el objeto y le añadimos o sobreescribimos una propiedad
        const dataClient = await clientModel.create(body)
        dataClient.set('password', undefined, { strict: false })
        const data = {
            client: dataClient
        }
        res.send(data)
    } catch (err) {
        console.log(err)
        handleHttpError(res, "ERROR_REGISTER_USER")
    }
}
//TODO router.post("/login", (req, res) => {}

const loginCtrl = async (req, res) => {
    try {
        req = matchedData(req)
        const client = await clientModel.findOne({ email: req.email }).select("password name role email")
        if (!client) {
            handleHttpError(res, "USER_NOT_EXISTS", 404)
            return
        }
        const hashPassword = client.password;
        const check = await compare(req.password, hashPassword)
        if (!check) {
            handleHttpError(res, "INVALID_PASSWORD", 401)
            return
        }
        client.set("password", undefined, { strict: false }) //Si no queremos que se muestre el hash en la respuesta
        const data = {
            token: await tokenClient(client),
            client
        }
        res.send(data)
    } catch (err) {
        console.log(err)
        handleHttpError(res, "ERROR_LOGIN_USER")
    }
}

const updateClient = async (req, res) => {
    try {
        //Extrae el id y el resto lo asigna a la constante body
        // const { id, ...body } = matchedData(req) //Extrae el id y el resto lo asigna a la constante body
        // const id = req.params.id
        // const {body} = req
        const token_id = req.user._id
        const id = req.params.id
        if (!token_id.equals(id)) {
            handleHttpError(res, "AUTH_ERROR", 403)
            return
        }
        const body = matchedData(req)
        const data = await clientModel.findByIdAndUpdate(id, body, { new: true })
        res.send(data)
    } catch (err) {
        console.log(err)
        handleHttpError(res, 'ERROR_UPDATE_USER')
    }
}

const deletefisClient = async (req, res) => {
    try {
        const token_id = req.user._id
        const id = req.params.id
        if (!token_id.equals(id)) {
            handleHttpError(res, "AUTH_ERROR", 403)
            return
        }
        const del = await clientModel.deleteOne({ _id: id });
        res.send("Eliminado");//Funcion de borrado fisico, lo que significa que, en este caso, usando el cif de referencia, el comercio se borra permanentemente de la base de datos, 
    } catch (err) {
        res.send("No se pudo", err);
    }
}

module.exports = { registerCtrl, loginCtrl, updateClient, deletefisClient }
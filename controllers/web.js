const { webModel, comerModel } = require("../models/index")//Importamos el esquema usado en models
const mongooseDelete = require("mongoose-delete")//Importamos para poder hacer el borrado logico
const { handleHttpError } = require("../utils/handleErrror")
const { matchedData } = require("express-validator")

const getWebs = async (req, res) => {//Funcion para mostrar todos los datos que hay almacenados en la DB
    try {// Control de excepciones para las funciones
        const data = await webModel.find({});//Este fracmento se encarga de ordenar en base al id de manera ascendente(-1 si queremos descendente) 
        res.send(data)
    } catch (err) {
        handleHttpError(res, "ERROR", 500)
    }
}

const getWeb = async (req, res) => {
    try {
        const id = req.params.id
        const data = await webModel.findById(id)//Funcion que me muestra una sola web en base a su id
        res.send({ data })
    } catch (err) {
        handleHttpError(res, "ERROR", 500)
    }
}

const createWeb = async (req, res) => {
    try {
        const comerce = req.comerce
        if (comerce.id_page) {
            handleHttpError(res, "COMERCE_ALREADY_HAD_A_PAGE", 401)
            return
        }
        const { body } = req
        const data = await webModel.create(body)//Aqui se encarga de agregar nuevas web con los datos que le mandamos
        await comerModel.findByIdAndUpdate(comerce._id, { id_page: data._id }, { new: true })
        res.send(data)
    } catch (err) {
        handleHttpError(res, "ERROR", 500)
    }
}

const patchWeb = async (req, res) => {
    try {
        const token_id = req.comerce.id_page
        const id = req.params.id
        if (!token_id.equals(id) || !token_id) {
            handleHttpError(res, "AUTH_ERROR", 403)
            return
        }
        const { body } = req
        const data = await webModel.findByIdAndUpdate(id, body, { new: true })
        res.send(data)
    } catch (err) {
        console.log(err)
        handleHttpError(res, 'ERROR_UPDATE_WEB')
    }
}

const updateWeb = async (req, res) => {
    try {
        const token_id = req.comerce.id_page
        const id = req.params.id
        if (!token_id || !token_id.equals(id)) {
            handleHttpError(res, "AUTH_ERROR", 403)
            return
        }
        const body = matchedData(req)
        const data = await webModel.findByIdAndUpdate(id, body, { new: true })
        res.send(data)
    } catch (err) {
        console.log(err)
        handleHttpError(res, 'ERROR_UPDATE_WEB')
    }
}

const patchimg = async (req, res) => {
    try {
        const token_id = req.comerce.id_page
        const id = req.params.id
        if (!token_id || !token_id.equals(id)) {
            handleHttpError(res, "AUTH_ERROR", 403)
            return
        }
        const {file} = req
        const fileData = {
            filename: file.filename,
            url: process.env.PUBLIC_URL + "/" + file.filename
        }
        const data = await webModel.findOneAndUpdate({_id: id}, { $push: { img: fileData.url } }, { new: true })

        res.send(data)
    } catch (err) {
        handleHttpError(res, "ERROR", 500)
    }
}


const deletefisWeb = async (req, res) => {
    try {
        const comerce = req.comerce
        const token_id = req.comerce.id_page
        const id = req.params.id
        if (!token_id.equals(id)) {
            handleHttpError(res, "AUTH_ERROR", 403)
            return
        }
        const del = await webModel.deleteOne({ _id: id });
        await comerModel.findByIdAndUpdate(comerce._id, { id_page: null }, { new: true })
        res.send("Eliminado")
    } catch (err) {
        console.log(err)
        handleHttpError(res, 'ERROR_DELETE_WEB')
    }
}

const deleteWeb = async (req, res) => {
    try {
        const token_id = req.comerce.id_page
        const id = req.params.id
        if (!token_id.equals(id)) {
            handleHttpError(res, "AUTH_ERROR", 403)
            return
        }
        const del = await webModel.delete({ _id: id });
        res.send("Eliminado")
    } catch (err) {
        console.log(err)
        handleHttpError(res, 'ERROR_DELETE_WEB')
    }
}

module.exports = {//Exporto las funciones para la ruta de la web
    getWeb, getWebs,

    createWeb, updateWeb,

    patchimg, patchWeb,

    deleteWeb, deletefisWeb
};
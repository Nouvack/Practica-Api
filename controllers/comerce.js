const { comerModel } = require("../models/index")//Importamos el esquema usado en models
const mongooseDelete = require("mongoose-delete")//Importamos para poder hacer el borrado logico
const { matchedData } = require("express-validator")
const { tokenComerce } = require("../utils/handleJwt.js")
const { handleHttpError } = require("../utils/handleErrror.js")
const { sendEmail } = require('../utils/handleEmail')

const getComerces = async (req, res) => {//Funcion para mostrar todos los datos que hay almacenados en la DB
    try {// Control de excepciones para las funciones
        const data = await comerModel.find().sort({ cif: 1 });//Este fracmento se encarga de ordenar en base al cif de manera ascendente(-1 si queremos descendente) 
        res.send(data)
    } catch (err) {
        handleHttpError(res, 'ERROR_GET_COMERCES')
    }
}

const getComerce = async (req, res) => {
    try {
        const cif = req.params.cif
        const dataComerce = await comerModel.findOne({ cif: cif })//Funcion que me muestra un solo comercio en base a su cif
        const data = {
            token: await tokenComerce({ cif: dataComerce.cif }),
            comerce: dataComerce
        }
        res.send({ data })
    } catch (err) {
        handleHttpError(res, 'ERROR_GET_COMERCE')
    }
}

const createComerce = async (req, res) => {//Crear un comercio y devuelve el comercio nuevo junto con su token
    try {
        const { body } = req
        const existingComer = await comerModel.findOne({ email: body.email });
        if (existingComer) {
            handleHttpError(res, "ERROR_COMERCE_ALREADY_EXISTS", 409);
            return;
        }
        const dataComerce = await comerModel.create(body)
        const data = {
            token: await tokenComerce({ cif: dataComerce.cif }),
            comerce: dataComerce
        }
        res.send(data)
    } catch (err) {
        handleHttpError(res, "ERROR_CREATE_COMERCE")
    }
}

const updateComerce = async (req, res) => {
    try {
        const { cif } = req.query; 
        const { body } = req;
        const data = await comerModel.findOneAndUpdate({ cif }, body, { new: true });
        res.send({ data });
    } catch (err) {
        handleHttpError(res, 'ERROR_UPDATE_COMERCE');
    }

}

const send = async (req, res) => {
    try {
        const info = matchedData(req)
        const data = await sendEmail(info)
        res.send(data)
    } catch (err) {
        //console.log(err)
        handleHttpError(res, 'ERROR_SEND_EMAIL')
    }
}

const deletefisComerce = async (req, res) => {
    try {
        const cif = req.query;
        const del = await comerModel.deleteOne( cif );
        res.json(del);//Funcion de borrado fisico, lo que significa que, en este caso, usando el cif de referencia, el comercio se borra permanentemente de la base de datos, 
    } catch (err) {
        handleHttpError(res, 'ERROR_DELETE_COMERCE')
    }
}

const deleteComerce = async (req, res) => {
    try {
        const cif = req.query;
        const del = await comerModel.delete(cif);//Funcion de borrado logico que borra el comercio, pero con opcion de recuperar los datos borrados
        res.json(del)
    } catch (err) {
        handleHttpError(res, 'ERROR_DELETE_COMERCE')
    }
}

module.exports = {//Exporto las funciones para la ruta de comercio
    getComerces, getComerce, send,

    createComerce, updateComerce,

    deleteComerce, deletefisComerce
};
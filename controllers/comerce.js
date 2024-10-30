const { comerModel } = require("../models/index")//Importamos el esquema usado en models
const mongooseDelete = require("mongoose-delete")//Importamos para poder hacer el borrado logico
const { matchedData } = require("express-validator")
const { tokenComerce } = require("../utils/handleJwt.js")
const { handleHttpError } = require("../utils/handleErrror.js")

const getItems = async (req, res) => {//Funcion para mostrar todos los datos que hay almacenados en la DB
    try {// Control de excepciones para las funciones
        const data = await comerModel.find().sort({ cif: 1 });//Este fracmento se encarga de ordenar en base al cif de manera ascendente(-1 si queremos descendente) 
        res.send(data)
    } catch (err) {
        res.send("Ocurrio un error", err)
    }
}

const getItem = async (req, res) => {
    try {
        const cif = req.params.cif
        const dataComerce = await comerModel.findOne({ cif: cif })//Funcion que me muestra un solo comercio en base a su cif
        const data = {
            token: await tokenComerce({cif: dataComerce.cif}),
            comerce: dataComerce 
        }
        res.send({ data })
    } catch (err) {
        res.send("Ocurrio un error", err)
    }
}

// const createItem = async (req, res) => {
//     try {
//         const { body } = req
//         const data = await comerModel.create(body)//Aqui se encarga de agregar nuevos comercios con los datos que le mandamos
//         res.send(data)
//     } catch (err) {
//         res.send("Ocurrio un error", err)
//     }
// }



const createItem = async (req, res) => {
    try {
        const { body } = req
        const existingComer = await comerModel.findOne({ email: body.email });
        if (existingComer) {
            handleHttpError(res, "ERROR_COMERCE_ALREADY_EXISTS", 409);
            return;
        }
        const dataComerce = await comerModel.create(body)
        const data = {
            token: await tokenComerce({cif: dataComerce.cif}),
            comerce: dataComerce 
        }
        res.send(data)
    } catch (err) {
        console.log(err)
        handleHttpError(res, "ERROR_CREATE_COMERCE")
    }
}





const updateItem = async (req, res) => {
    try {
        const cif = req.params.cif;
        const { body } = req;
        const data = await comerModel.findOneAndUpdate({ cif: cif }, body, { new: true });//Funcion para modificar un comercio, en base a su cif, una vez modificado se muestra el comercio actualizado
        res.send({ data });
    } catch (err) {
        res.send("Ocurrio un error", err);
    }

}

const deletefisItem = async (req, res) => {
    try {
        const cif = req.params.cif;
        const del = await comerModel.deleteOne({ cif: cif });
        res.send("Eliminado");//Funcion de borrado fisico, lo que significa que, en este caso, usando el cif de referencia, el comercio se borra permanentemente de la base de datos, 
    } catch (err) {
        res.send("No se pudo", err);
    }
}

const deleteItem = async (req, res) => {
    try {
        const cif = req.params.cif;
        const del = await comerModel.delete({ cif: cif });//Funcion de borrado logico que borra el comercio, pero con opcion de recuperar los datos borrados
        res.send("Eliminado");
    } catch (err) {
        res.send("No se pudo", err);
    }
}

module.exports = {//Exporto las funciones para la ruta de comercio
    getItems, getItem,

    createItem, updateItem,

    deleteItem, deletefisItem
};
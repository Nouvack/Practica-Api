const { webModel, comerModel, clientModel } = require("../models/index")//Importamos el esquema usado en models
const mongooseDelete = require("mongoose-delete")//Importamos para poder hacer el borrado logico
const { handleHttpError } = require("../utils/handleErrror")
const { matchedData } = require("express-validator")

const getWebs = async (req, res) => {//Buscar web por id ciudad actividad o ordenado en base a su scoring
    try {
        const { city, act, scoring, id } = req.query
        const filter = {};

        if (city) {
            filter.city = { $regex: city, $options: 'i' }
        }
        if (act) {
            filter.activity = { $regex: act, $options: 'i' }
        }
        let data;
        if (scoring) {
            data = await webModel.find(filter).sort({ "client_review.scoring": -1 })
        }
        else if (id) {
            data = await webModel.findById(id)
        } else {
            data = await webModel.find(filter)
        }
        res.send(data);
    } catch (err) {
        handleHttpError(res, "ERROR_GET_WEBS");
    }
};

const getClients = async (req, res) => {//Obtener clientes en base a sus intereses o ciudad
    try {
        const { interest, city } = req.query;

        const filter = {spam:true};
        if (interest) {
            filter.interests = { $regex: interest, $options: 'i' };
        }
        if (city) {
            filter.city = { $regex: city, $options: 'i' };
        }
        const data = await clientModel.find(filter);
        res.send(data);
    } catch (err) {
        handleHttpError(res, "ERROR_GET_CLIENTS")
};
}

const createWeb = async (req, res) => {//Crear una web
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
        handleHttpError(res, "ERROR_CREATE_WEB")
    }
}

const patchText = async (req, res) => {//Insertar texto en una web
    try {
        const token_id = req.comerce.id_page
        const id = req.params.id
        if (!token_id.equals(id) || !token_id) {
            handleHttpError(res, "AUTH_ERROR", 403)
            return
        }
        const { body } = req
        const data = await webModel.findByIdAndUpdate(id, {$push: body}, { new: true })
        res.send(data)
    } catch (err) {
        handleHttpError(res, 'ERROR_PATCH_TEXT')
    }
}

const patchScore = async (req, res) => {//Hacer una review en una web
    try {
        const id = req.params.id;
        const { client_review } = req.body;
        const updateData = {};

        if (client_review.scoring) {
            updateData['client_review.scoring'] = client_review.scoring
        }
        if (client_review.reviews) {
            updateData['client_review.reviews'] = client_review.reviews
        }
        const data = await webModel.findByIdAndUpdate(id,{$push: updateData, $inc: { 'client_review.total_score': 1 }},{ new: true });
        res.send(data); 
    } catch (err) {
        handleHttpError(res, 'ERROR_PATCH_SCORE');
    }
};

const updateWeb = async (req, res) => {//Actualizar una web, primero se verifica si la web a actualizar pertenece al comercio que hace la peticion
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
        handleHttpError(res, 'ERROR_UPDATE_WEB')
    }
}

const patchimg = async (req, res) => {//Poner una imagen en la web
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
        handleHttpError(res, "ERROR_PATCH_IMG")
    }
}


const deletefisWeb = async (req, res) => {//Borrado fisico de una web
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
        res.json(del)
    } catch (err) {
        console.log(err)
        handleHttpError(res, 'ERROR_DELETE_WEB')
    }
}

const deleteWeb = async (req, res) => {//Borrado logico de una web
    try {
        const token_id = req.comerce.id_page
        const id = req.params.id
        if (!token_id.equals(id)) {
            handleHttpError(res, "AUTH_ERROR", 403)
            return
        }
        const del = await webModel.delete({ _id: id });
        res.json(del)
    } catch (err) {
        console.log(err)
        handleHttpError(res, 'ERROR_DELETE_WEB')
    }
}

module.exports = {//Exporto las funciones para la ruta de la web
 getWebs, getClients, 

    createWeb, updateWeb,

    patchimg, patchText, patchScore,

    deleteWeb, deletefisWeb
};
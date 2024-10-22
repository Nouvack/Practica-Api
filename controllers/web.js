const { webModel } = require("../models/index")//Importamos el esquema usado en models
const mongooseDelete = require("mongoose-delete")//Importamos para poder hacer el borrado logico

const getWebs = async (req, res) => {//Funcion para mostrar todos los datos que hay almacenados en la DB
    try {// Control de excepciones para las funciones
        const data = await webModel.find({});//Este fracmento se encarga de ordenar en base al id de manera ascendente(-1 si queremos descendente) 
        res.send(data)
    } catch (err) {
        res.send("Ocurrio un error", err)
    }
}

const getWeb = async (req, res) => {
    try {
        const id = req.params.id
        const data = await webModel.findById(id)//Funcion que me muestra una sola web en base a su id
        res.send({ data })
    } catch (err) {
        res.send("Ocurrio un error", err)
    }
}

const createWeb = async (req, res) => {
    try {
        const { body } = req
        const data = await webModel.create(body)//Aqui se encarga de agregar nuevas web con los datos que le mandamos
        res.send(data)
    } catch (err) {
        res.send("Ocurrio un error", err)
    }
}

const updateWeb = async (req, res) => {
    try {
        const id = req.params.id;
        const { body } = req;
        const data = await webModel.findOneAndUpdate({ _id: id }, body, { new: true });//Funcion para modificar una web, en base a su id, una vez modificado se muestra la web actualizado
        res.send({ data });
    } catch (err) {
        res.send("Ocurrio un error", err);
    }

}

const patchimg = async (req, res) => {
    try {
        const id = req.params.id;
        const { body, file } = req
        const fileData = {
            url: process.env.PUBLIC_URL + "/" + file.filename
        }
        const data = await webModel.findOneAndUpdate({ _id: id }, { img: [fileData.url] }, { new: true })
        res.send(data)
    } catch (err) {
        console.log(res, "Error")
    }
}


const deletefisWeb = async (req, res) => {
    try {
        const id = req.params.id;
        const del = await webModel.deleteOne({ _id: id });
        res.send("Eliminado");//Funcion de borrado fisico, lo que significa que, en este caso, usando el id de referencia, la web se borra permanentemente de la base de datos, 
    } catch (err) {
        res.send("No se pudo", err);
    }
}

const deleteWeb = async (req, res) => {
    try {
        const id = req.params.id;
        const del = await webModel.delete({ _id: id });//Funcion de borrado logico que borra la web, pero con opcion de recuperar los datos borrados
        res.send("Eliminado");
    } catch (err) {
        res.send("No se pudo", err);
    }
}

module.exports = {//Exporto las funciones para la ruta de la web
    getWeb, getWebs,

    createWeb, updateWeb,

    patchimg,

    deleteWeb, deletefisWeb
};
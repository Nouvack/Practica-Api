const { clientModel, comerModel } = require("../models")
const { handleHttpError } = require("../utils/handleErrror")
const { verifyToken } = require("../utils/handleJwt")

const authMiddleware = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            handleHttpError(res, "NOT_TOKEN", 401)
            return
        }
        // Nos llega la palabra reservada Bearer (es un estándar) y el Token, así que me quedo con la última parte
        const token = req.headers.authorization.split(' ').pop()
        //Del token, miramos en Payload (revisar verifyToken de utils/handleJwt)
        const dataToken = await verifyToken(token)
        if (!dataToken._id) {
            handleHttpError(res, "ERROR_ID_TOKEN", 401)
            return
        }
        const user = await clientModel.findById(dataToken._id)
        req.user = user
        next()
    } catch (err) {
        handleHttpError(res, "NOT_SESSION", 401)
    }
}

const authComerWare = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            handleHttpError(res, "NOT_TOKEN", 401)
            return
        }
        // Nos llega la palabra reservada Bearer (es un estándar) y el Token, así que me quedo con la última parte
        const token = req.headers.authorization.split(' ').pop()
        //Del token, miramos en Payload (revisar verifyToken de utils/handleJwt)
        const dataToken = await verifyToken(token)
        if (!dataToken.cif) {
            handleHttpError(res, "ERROR_CIF_TOKEN", 401)
            return
        }
        const comerce = await comerModel.findOne({cif: dataToken.cif})
        req.comerce = comerce
        next()
    } catch (err) {
        handleHttpError(res, "NOT_SESSION", 401)
    }
}


module.exports = {authMiddleware, authComerWare}
const { check } = require("express-validator")
const validateResults = require("../utils/handleValidators")

const validatorCreateitem = [
    check('name').exists().notEmpty(),
    check('cif').exists().notEmpty(),
    check('adress').exists().notEmpty(),
    check('email').exists().isEmail(),
    check('phone').exists().notEmpty(),
    check('id_page').exists(),
    (req, res, next) => {
        return validateResults(req, res, next);
    }
];

const validatorGetItem = [
    check('cif').exists().notEmpty(),
    (req, res, next) => {
        return validateResults(req, res, next);
    }
];

module.exports = { validatorCreateitem, validatorGetItem }
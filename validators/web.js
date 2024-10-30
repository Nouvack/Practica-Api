const { check } = require("express-validator")
const validateResults = require("../utils/handleValidators")

const validatorCreateWeb = [
    check('city').exists().notEmpty(),
    check('activity').exists().notEmpty(),
    check('tittle').exists().notEmpty(),
    check('sumary').exists().notEmpty(),
    check('text').exists().notEmpty().isArray(),
    check('img').exists().isArray(),
    check('client_review.scoring').optional().isNumeric().isFloat({ min: 0, max: 5 }),
    check('client_review.score').optional().isNumeric(),
    check('client_review.reviews').optional().isString(),
    (req, res, next) => {
        return validateResults(req, res, next);
    }
];

const validatorGetWeb = [
    check('id').exists().notEmpty(),
    (req, res, next) => {
        return validateResults(req, res, next);
    }
];

module.exports = { validatorCreateWeb, validatorGetWeb }
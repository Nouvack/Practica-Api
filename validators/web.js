const { check } = require("express-validator")
const validateResults = require("../utils/handleValidators")

const validatorCreateWeb = [
    check('city').exists().notEmpty(),
    check('activity').exists().notEmpty(),
    check('tittle').exists().notEmpty(),
    check('sumary').exists().notEmpty(),
    check('text').exists().isArray(),
    check('img').exists().isArray(),
    check('client_review.scoring').optional().isArray(),
    check('client_review.total_score').optional().isNumeric(),
    check('client_review.reviews').optional().isArray(),
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
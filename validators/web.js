const { check } = require("express-validator")
const validateResults = require("../utils/handleValidators")

const validatorCreateWeb = [
    check('city').exists().notEmpty().isString(),
    check('activity').exists().notEmpty().isString(),
    check('tittle').exists().notEmpty().isString(),
    check('sumary').exists().notEmpty().isString(),
    check('text').exists().notEmpty().isArray(),
    check('img').exists().isArray(),
    check('user_review.scoring').optional().isNumeric().isFloat({ min: 0, max: 5 }),
    check('user_review.score').optional().isNumeric(),
    check('user_review.reviews').optional().isString(),
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
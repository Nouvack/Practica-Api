const jwt = require("jsonwebtoken")
const JWT_SECRET = process.env.JWT_SECRET

const tokenClient = (client) => {
    const sign = jwt.sign(
        {
            _id: client._id,
            role: client.role,
        },
        JWT_SECRET,
        {
            expiresIn: "4h"
        }
    )
    return sign
}

const tokenComerce = (comerce) => {
    const sign = jwt.sign(
        {
            cif: comerce.cif
        },
        JWT_SECRET,
        {
            expiresIn: "365d"
        }
    )
    return sign
}



const verifyToken = (tokenJwt) => {
    try {
        return jwt.verify(tokenJwt, JWT_SECRET)
    } catch (err) {
        console.log(err)
    }
}

module.exports = { tokenClient, tokenComerce, verifyToken }
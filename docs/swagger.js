const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Practica-Api",
            version: "0.1.0",
            description: "This is a CRUD API application made with Express and documented with Swagger",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "Noam",
                url: "https://u-tad.com",
                email: "noamsantanderb@gmail.com",
            },
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                },
            },
            schemas: {
                client: {
                    type: "object",
                    required: ["name", "email", "password"],
                    properties: {
                        name: {
                            type: "string",
                            example: "Juan Pérez"
                        },
                        email: {
                            type: "string",
                            format: "email",
                            example: "juan.perez@example.com"
                        },
                        password: {
                            type: "string",
                            example: "mySecurePassword"
                        },
                        age: {
                            type: "string",
                            example: "30"
                        },
                        city: {
                            type: "string",
                            example: "Madrid"
                        },
                        interests: {
                            type: "array",
                            items: {
                                type: "string",
                                example: "sports"
                            }
                        },
                        spam: {
                            type: "boolean",
                            example: true
                        },
                        role: {
                            type: "string",
                            enum: ["client", "admin"],
                            example: "client"
                        }
                    }
                },
                comerce: {
                    type: "object",
                    required: ["name", "email", "cif"],
                    properties: {
                        name: {
                            type: "string",
                            example: "Tech Solutions"
                        },
                        email: {
                            type: "string",
                            format: "email",
                            example: "contact@techsolutions.com"
                        },
                        cif: {
                            type: "string",
                            example: "B12345678"
                        },
                        adress: {
                            type: "string",
                            example: "123 Calle Principal, Ciudad"
                        },
                        phone: {
                            type: "string",
                            example: "+34 123 456 789"
                        },
                        id_page: {
                            type: "integer",
                            example: 1
                        },
                        deleted: {
                            type: "boolean",
                            example: false
                        }
                    }
                },
                web: {
                    type: "object",
                    required: ["city", "activity", "tittle"],
                    properties: {
                        city: {
                            type: "string",
                            example: "Lima"
                        },
                        activity: {
                            type: "string",
                            example: "Turismo"
                        },
                        tittle: {
                            type: "string",
                            example: "Ven y disfruta de las maravillas de Lima"
                        },
                        sumary: {
                            type: "string",
                            example: "Nos enfocamos en explorar la ciudad de Lima"
                        },
                        text: {
                            type: "array",
                            items: {
                                type: "string"
                            },
                            example: []
                        },
                        img: {
                            type: "array",
                            items: {
                                type: "string"
                            },
                            example: [] 
                        },
                        client_review: {
                            type: "object",
                            properties: {
                                scoring: {
                                    type: "array",
                                    items: {
                                        type: "number"
                                    },
                                    example: [] 
                                },
                                total_score: {
                                    type: "number",
                                    example: 0 
                                },
                                reviews: {
                                    type: "array",
                                    items: {
                                        type: "string"
                                    },
                                    example: []
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    apis: ["./routes/*.js"],
};

module.exports = swaggerJsdoc(options);

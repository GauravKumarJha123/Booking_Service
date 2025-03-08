const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { options } = require('joi');

const swaggerOptions = {
    definition : {
        openapi : "3.0.0",
        info : {
            title : 'Booking API Doc',
            version : '1.0.0',
            description : 'A simple Express booking API'
        },
        servers : [
            {
                url : "http://localhost:2001",
                description : "Local Development server"
            },
            {
                url : "will be deployed onr render",
                description : "Production server"
            }
        ],
    },
    apis : ['./src/utils/swagger/bookingDocs.js']    
}

const specs = swaggerJsdoc(swaggerOptions);

module.exports = specs;
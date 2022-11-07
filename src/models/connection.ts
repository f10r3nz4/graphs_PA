const { Sequelize } = require('sequelize');
const config = require('../config/database'); 

const seq = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'mysql',
    operatorsAliases: 'false',
    logging: false
});  

module.exports = seq
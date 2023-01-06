const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const FileDownloaded = sequelize.define('fileDownloaded', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    fileURL: Sequelize.STRING
});

module.exports = FileDownloaded;
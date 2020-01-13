'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Akuns', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            kode: {
                allowNull: true,
                type: Sequelize.STRING
            },
            nama_akun: {
                allowNull: false,
                type: Sequelize.STRING
            },
            balance_awal: {
                allowNull: false,
                type: Sequelize.DECIMAL
            },
            balance_akhir: {
                allowNull: false,
                type: Sequelize.DECIMAL
            },
            kode_parent: {
                type: Sequelize.INTEGER,
                allowNull: true,
                hierarchy: true,
                references: {
                    model: 'Akuns',
                    key: 'id',
                }
            },
            satuan: {
                type: Sequelize.STRING
            },
            image: {
                allowNull: true,
                type: Sequelize.STRING
            },
            file: {
                allowNull: true,
                type: Sequelize.STRING
            },
            isActive: {
                allowNull: false,
                type: Sequelize.BOOLEAN
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Akuns');
    }
};
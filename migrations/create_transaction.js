'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Transactions', {
            kode_transaksi: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            jenis_transaksi: {
                type: Sequelize.STRING
            },
            tanggal_transaksi: {
                allowNull: false,
                type: Sequelize.DATE
            },
            kode_akun: {
                allowNull: false,
                type: Sequelize.INTEGER,
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
                references: {
                    model: 'Akuns',
                    key: 'id',
                }
            },
            keterangan: {
                type: Sequelize.STRING
            },
            debit: {
                type: Sequelize.DECIMAL
            },
            kredit: {
                type: Sequelize.DECIMAL
            },
            saldo_awal: {
                type: Sequelize.DECIMAL
            },
            saldo_akhir: {
                type: Sequelize.DECIMAL
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
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Transactions');
    }
};
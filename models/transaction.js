'use strict';
module.exports = (sequelize, DataTypes) => {
    const Transaction = sequelize.define('Transaction', {
        jenis_transaksi: DataTypes.STRING,
        tanggal_transaksi: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        kode_akun: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        keterangan: DataTypes.STRING,
        debit: DataTypes.DECIMAL,
        kredit: DataTypes.DECIMAL,
        saldo_awal: DataTypes.DECIMAL,
        saldo_akhir: DataTypes.DECIMAL,
        image: DataTypes.STRING,
        file: DataTypes.STRING,
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        }
    }, {});
    Transaction.associate = function(models) {
        // associations can be defined here
        Transaction.belongsTo(models.Akun, { as: 'akun', foreignKey: 'kode_akun' });
    };
    return Transaction;
};
'use strict';
module.exports = (sequelize, DataTypes) => {
    const Akun = sequelize.define('Akun', {
        kode: DataTypes.STRING,
        nama_akun: DataTypes.STRING,
        nama_akun: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        balance_awal: DataTypes.DECIMAL,
        balance_akhir: DataTypes.DECIMAL,
        kode_parent: {
            type: DataTypes.INTEGER,
            hierarchy: true
        },
        satuan: DataTypes.STRING,
        image: DataTypes.STRING,
        file: DataTypes.STRING,
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        }
    }, {});

    //Akun.isHierarchy();

    Akun.associate = function(models) {
        // associations can be defined here
        Akun.hasMany(models.Transaction, {
            foreignKey: 'kode_akun',
            as: 'transaction',
        })

        Akun.belongsTo(models.Akun, { as: 'parent', foreignKey: 'kode_parent' })
        Akun.hasMany(models.Akun, { as: 'children', foreignKey: 'kode_parent' })
            //Akun.belongsToMany(Akun, { as: 'descendents', foreignKey: 'kode_parent', through: folderAncestor })
            //folder.belongsToMany(folder, { as: 'ancestors', foreignKey: 'folderId', through: folderAncestor })
    };
    return Akun;
};
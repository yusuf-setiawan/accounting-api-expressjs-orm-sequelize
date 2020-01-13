const Akun = require('../models').Akun;
var utils = require('../utils')
const Sequelize = require('sequelize');
const Transaction = require('../models').Transaction;
const Op = Sequelize.Op;
const db = require('../models/index');

module.exports = {
    create(req, res) {
        try {
            //console.log('file', req.files);
            //console.log('body', req.body)

            if (req.files.length > 0) {
                for (var i = 0; i < req.files.length; i++) {
                    if (i == 0) {
                        var imagePath = req.files[i].path.substring(7).replace(/\\/g, "/");
                    } else if (i == 1)
                        var filePath = req.files[i].path.substring(7).replace(/\\/g, "/");
                };
                //console.log('imagePath', imagePath)
                //console.log('filePath', filePath)
            }
            //else
            //return res.status(404).send('image and file not found');


            let where = {
                id: req.body.kode_akun,
                isActive: true
            }

            var debit = parseFloat(req.body.debit);
            var kredit = parseFloat(req.body.kredit);
            var saldoAwal = 0;

            if (!isNaN(debit) && !isNaN(kredit)) {
                if ((debit > 0 && kredit == 0) || (kredit > 0 && debit == 0))
                    console.log('valid data')
                else {
                    if (debit > 0 && kredit > 0)
                        return res.status(404).send('debit and credit cannot have value both, must choose one of them');
                    else
                        return res.status(404).send('transaction value must be not negative and more than zero');
                }
            } else
                return res.status(404).send('debit or credit must be number');

            Akun.findOne({
                    where: where,
                    order: [
                        ['id', 'DESC']
                    ],
                })
                .then((akun) => {
                    //console.log('akun', akun)
                    if (akun == null)
                        return res.status(404).send('akun not found');
                    else {
                        Transaction.findOne({
                                where: {
                                    kode_akun: req.body.kode_akun,
                                },
                                order: [
                                    ['id', 'DESC']
                                ],
                            })
                            .then((lastTrans) => {
                                if (lastTrans != null)
                                    saldoAwal = lastTrans.dataValues.saldo_akhir;

                                var saldoAkhir = parseFloat(saldoAwal) + debit - kredit;
                                //console.log('saldoAkhir', saldoAkhir)

                                return Transaction
                                    .create({
                                        kode_akun: req.body.kode_akun,
                                        jenis_transaksi: req.body.jenis_transaksi,
                                        tanggal_transaksi: req.body.tanggal_transaksi,
                                        keterangan: req.body.keterangan,
                                        debit: debit,
                                        kredit: kredit,
                                        saldo_awal: saldoAwal,
                                        saldo_akhir: saldoAkhir,
                                        image: imagePath,
                                        file: filePath,
                                        isActive: true
                                    })
                                    .then(trans => {
                                        akun.update({ balance_akhir: saldoAkhir })
                                            .then(akun => res.status(201).send(trans))
                                    })
                                    .catch(error => res.status(400).send(error));
                            })
                            .catch(error => res.status(400).send(error));
                    }
                })
                .catch(error => res.status(400).send(error));
        } catch (error) {
            return res.status(400).send(error)
        }
    },

    findAll(req, res) {
        //var url = req.headers.host;
        let transQuery = {};
        var where = utils.filterTransaction(req.query);
        where.isActive = true;
        transQuery.where = where;

        var pagination = utils.pagination(req.query['page'], req.query['itemperpage']);
        var orderBy = utils.orderBy(req.query['sort']);

        transQuery.offset = pagination.offset;
        transQuery.limit = pagination.limit;
        transQuery.order = orderBy;

        //console.log('transQuery = ', transQuery)
        return Transaction
            .findAll(transQuery)
            .then((transaction) => {
                if (transaction == null || transaction.length == 0)
                    return res.status(404).send('record not found');
                else
                    return res.status(200).send(transaction)
            })
            .catch(error => res.status(400).send(error));
    },

    findOne(req, res) {
        return Transaction.findOne({
                where: { id: req.params.id, isActive: true },
                include: {
                    model: Akun,
                    as: 'akun'
                }
            })
            .then((transaction) => {
                if (transaction == null)
                    return res.status(400).send('record not found');
                else {
                    //transaction.image = req, transaction.image);
                    //transaction.file = req, transaction.file);
                    return res.status(200).send(transaction)
                }
            })
            .catch(error => res.status(400).send(error));
    },

    findMutasi(req, res) {
        var transQuery = {
            order: [
                ['tanggal_transaksi']
            ]
        };
        var where = {
            kode_akun: req.params.id
        };

        if (req.query['start_date'] != undefined)
            var start_date = req.query['start_date'];

        if (req.query['end_date'] != undefined)
            var end_date = req.query['end_date'];

        if (req.query['start_date'] != undefined && req.query['end_date'] != undefined) {
            var tanggal_transaksi = {
                [Op.between]: [req.query['start_date'], req.query['end_date']]
            }
        } else {
            if (req.query['start_date'] != undefined) {
                var tanggal_transaksi = {
                    [Op.gte]: req.query['start_date']
                }
            } else if (req.query['end_date'] != undefined) {
                var tanggal_transaksi = {
                    [Op.lte]: req.query['end_date']
                }
            }
        }

        if (tanggal_transaksi != undefined)
            where.tanggal_transaksi = tanggal_transaksi;

        transQuery.where = where;

        //console.log('transQuery = ', transQuery)
        return Transaction
            .findAll(transQuery)
            .then((transaction) => {
                if (transaction == null || transaction.length == 0)
                    return res.status(404).send('record not found');
                else
                    return res.status(200).send(transaction)
            })
            .catch(error => res.status(400).send(error));
    },

    update(req, res) {
        let selisih = 0;
        var lastSaldoAkhir = 0;
        var kode_akun;
        var idparams = {
            [Op.gte]: req.params.id
        };


        //console.log('file', req.files);
        //console.log('body', req.body)

        if (req.files.length > 0) {
            for (var i = 0; i < req.files.length; i++) {
                if (i == 0) {
                    var imagePath = req.files[i].path.substring(7).replace(/\\/g, "/");;
                } else if (i == 1)
                    var filePath = req.files[i].path.substring(7).replace(/\\/g, "/");;
            };
            //console.log('imagePath', imagePath)
            //console.log('filePath', filePath)
        }
        //else
        //    return res.status(404).send('image and file not found');


        Transaction.findOne({
                where: { id: req.params.id, isActive: true },
            })
            .then((transaction) => {
                if (transaction == null)
                    return res.status(400).send('record not found');

                kode_akun = transaction.dataValues.kode_akun;
                Transaction.findAll({
                        where: {
                            id: idparams,
                            kode_akun: kode_akun,
                            isActive: true
                        },
                        order: [
                            ['id']
                        ]
                    })
                    .then(transactions => {
                        const updatePromises = transactions.map(transaction => {
                            let updates = {};
                            var trans = transaction.dataValues;
                            if (trans.id == req.params.id) {
                                var currSaldoAkhir = parseFloat(trans.saldo_awal) + parseFloat(req.body.debit) - parseFloat(req.body.kredit);
                                selisih = parseFloat(trans.saldo_akhir) - currSaldoAkhir;
                                updates = utils.transactionModel(req);
                                updates.saldo_akhir = currSaldoAkhir;

                                if (imagePath != undefined)
                                    updates.image = imagePath
                                if (filePath != undefined)
                                    updates.file = filePath

                                //console.log('body', updates)

                            } else {
                                updates.saldo_awal = parseFloat(trans.saldo_awal) - selisih;
                                updates.saldo_akhir = parseFloat(trans.saldo_akhir) - selisih;
                            }

                            //console.log('updates', updates);
                            lastSaldoAkhir = updates.saldo_akhir;
                            return transaction.update(updates);
                        });

                        Akun.findOne({
                                where: {
                                    id: kode_akun,
                                    isActive: true
                                }
                            })
                            .then((akun) => {
                                if (akun == null)
                                    return res.status(404).send('akun not found');

                                const updateAkunPromises = akun.update({ balance_akhir: lastSaldoAkhir })

                                return db.Sequelize.Promise.all([updatePromises, updateAkunPromises])
                            })
                            .then(updatedRecord => {
                                //console.log('updatedRecord', updatedRecord);
                                if (updatedRecord.length > 0) {
                                    res.status(200).send('updated successfully');
                                } else {
                                    res.status(404).send('record not found')
                                }
                            })
                            .catch(error => res.status(400).send(error));

                    })
                    .catch(error => res.status(400).send(error));
            })

    },

    destroy(req, res) {
        let selisih = 0;
        var lastSaldoAkhir = 0;

        var kode_akun;
        var idparams = {
            [Op.gte]: req.params.id
        };

        Transaction.findOne({
                where: { id: req.params.id, isActive: true },
            })
            .then((transaction) => {
                if (transaction == null)
                    return res.status(400).send('record not found');

                kode_akun = transaction.dataValues.kode_akun;

                Transaction.findAll({
                        where: { id: idparams, kode_akun: kode_akun, isActive: true }
                    })
                    .then(transactions => {
                        const updatePromises = transactions.map(transaction => {
                            let updates = {};
                            var trans = transaction.dataValues;
                            if (trans.id == req.params.id) {
                                updates.isActive = false;

                                selisih = parseFloat(trans.saldo_akhir) - parseFloat(trans.saldo_awal);
                                return transaction.update(updates);
                                //return transaction.destroy();
                            } else {
                                updates.saldo_awal = parseFloat(trans.saldo_awal) - selisih;
                                updates.saldo_akhir = parseFloat(trans.saldo_akhir) - selisih;

                                lastSaldoAkhir = updates.saldo_akhir;
                                //console.log('updates', updates);
                                return transaction.update(updates);
                            }
                        });

                        Akun.findOne({
                                where: {
                                    id: kode_akun,
                                    isActive: true
                                }
                            })
                            .then((akun) => {
                                if (akun == null)
                                    return res.status(404).send('akun not found');

                                const updateAkunPromises = akun.update({ balance_akhir: lastSaldoAkhir })

                                return db.Sequelize.Promise.all([updatePromises, updateAkunPromises])
                            })
                            .then(deletedRecord => {
                                if (deletedRecord.length > 0) {
                                    res.status(200).send('Deleted successfully');
                                } else {
                                    res.status(404).send('record not found')
                                }
                            })
                            .catch(error => res.status(400).send(error));
                    })
            })
    }
}
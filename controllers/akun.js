const Akun = require('../models').Akun;
const Transaction = require('../models').Transaction;
var utils = require('../utils')

module.exports = {
    create(req, res) {
        console.log('file', req);
        console.log('body', req.body);
        console.log('file', req.files);
        console.log('nama_akun', req.body.nama_akun);
        //console.log('body', req.body)

        if (req.files != undefined) {
            if (req.files.length > 0) {
                for (var i = 0; i < req.files.length; i++) {
                    if (i == 0) {
                        var imagePath = req.files[i].path.substring(7).replace(/\\/g, "/");;
                    } else if (i == 1)
                        var filePath = req.files[i].path.substring(7).replace(/\\/g, "/");;
                };
                //console.log('imagePath', imagePath)
                //console.log('filePath', filePath)
            } else
                return res.status(404).send('image and file not found');
        }
        if (req.body.kode_parent != undefined) {
            if (req.body.kode_parent != '') {
                var kode_parent = req.body.kode_parent;
                Akun.findOne({
                        where: {
                            id: kode_parent,
                            isActive: true
                        }
                    })
                    .then((akun) => {
                        if (akun == null)
                            return res.status(404).send('parent not found');
                    });
            }
        }

        return Akun
            .create({
                nama_akun: req.body.nama_akun,
                balance_awal: req.body.balance_awal,
                balance_akhir: req.body.balance_awal,
                kode_parent: kode_parent,
                satuan: req.body.satuan,
                json_data: req.body.json_data,
                kode: req.body.kode,
                image: imagePath,
                file: filePath,
                isActive: true
            })
            .then(akun => res.status(201).send(akun))
            .catch(error => res.status(400).send(error));

    },

    findAll(req, res) {
        //var url = req.headers.host;
        let akunQuery = {};
        var where = utils.filterAkun(req.query);
        where.isActive = true;
        akunQuery.where = where;

        var pagination = utils.pagination(req.query['page'], req.query['itemperpage']);
        var orderBy = utils.orderBy(req.query['sort']);

        akunQuery.offset = pagination.offset;
        akunQuery.limit = pagination.limit;
        akunQuery.order = orderBy;

        if (req.query['withChild'] != undefined) {
            if (req.query['childDepth'] != undefined) {
                var childDepth = parseInt(req.query['childDepth']);
                if (childDepth > 0) {
                    var includeData = utils.buildTreeIncludes(Akun, childDepth);
                    akunQuery.include = includeData;
                }
            }
        }

        return Akun.findAll(akunQuery)
            .then((akun) => {
                //console.log('akun', akun)
                if (akun == null || akun.length == 0)
                    return res.status(404).send('record not found');
                else
                    return res.status(200).send(akun)
            })
            .catch(error => res.status(400).send(error));
    },

    findOne(req, res) {
        return Akun.findOne({
                where: {
                    id: req.params.id,
                    isActive: true
                },
                include: [{
                    model: Transaction,
                    as: 'transaction'
                }]
            })
            .then((akun) => {
                if (akun == null)
                    return res.status(200).send('record not found');
                else {
                    return res.status(200).send(akun)
                }
            })
            .catch(error => res.status(400).send(error));
    },

    update(req, res) {
        let body = {};
        let where = {
            id: req.params.id,
            isActive: true
        }

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



        if (req.body.kode_parent != undefined) {
            if (req.body.kode_parent == req.params.id)
                return res.status(400).send('parent id should not be same with id');

            if (req.body.kode_parent == '') {

                body = utils.akunModel(req);
                Akun.findOne({
                        where: where
                    })
                    .then((akun) => {
                        if (akun == null)
                            return res.status(404).send('record not found');

                        body.kode_parent = null;

                        if (imagePath != undefined)
                            body.image = imagePath
                        if (filePath != undefined)
                            body.file = filePath

                        //console.log('body', body)

                        akun.update(body)
                            .then(akun => res.status(200).send('Updated successfully'))
                    })
                    .catch(error => res.status(400).send(error));
            } else {
                Akun.findOne({
                        where: {
                            id: req.body.kode_parent,
                            isActive: true
                        }
                    })
                    .then((akun) => {
                        if (akun == null) {
                            return res.status(404).send('parent not found');
                        } else {
                            Akun.findOne({
                                    where: where
                                })
                                .then((akun) => {

                                    if (akun == null)
                                        return res.status(404).send('record not found');

                                    body = utils.akunModel(req);
                                    body.kode_parent = req.body.kode_parent;

                                    if (imagePath != undefined)
                                        body.image = imagePath
                                    if (filePath != undefined)
                                        body.file = filePath
                                        //console.log('body', body)
                                    akun.update(body)
                                        .then(akun => res.status(200).send('Updated successfully'))
                                })
                                .catch(error => res.status(400).send(error));
                        }
                    });
            }
        }
    },

    destroy(req, res) {
        Akun.findOne({
                where: {
                    id: req.params.id,
                    isActive: true
                }
            })
            .then((akun) => {
                if (akun == null)
                    return res.status(404).send('record not found');

                akun.update({
                        isActive: false,
                        kode_parent: null
                    })
                    .then(akun => res.status(200).send('Deleted successfully'))
            })
            .catch(error => res.status(400).send(error));
    },

    /*
    hardDestroy(req, res) {
            return Akun.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(function(deletedRecord) {
            if (deletedRecord === 1) {
                res.status(200).send('Deleted successfully');
            } else {
                res.status(404).send('Record not found')
            }
        })
        .catch(function(error) {
            res.status(400).send(error);
        });
    }
    */

}
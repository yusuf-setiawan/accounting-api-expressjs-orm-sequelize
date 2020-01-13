const Sequelize = require('sequelize');

exports.orderBy = function(sort) {
    console.log('sort', sort)
    let result = [];
    let arrDet = [];
    let arr = [];

    if (sort != undefined) {
        arr = sort.split(",");

        for (var i = 0; i < arr.length; i++) {
            arrDet = [];
            var desc = arr[i].substring(0, 1);

            if (desc == '-') {
                var item = arr[i].replace(/\-/g, '')
                arrDet.push(item);
                arrDet.push('DESC');
            } else
                arrDet.push(arr[i]);

            result.push(arrDet);
        };
    }
    return result;
};

exports.buildTreeIncludes = function(model, level) {
    let result = {};
    if (level > 0) {
        result = {
            model: model,
            as: 'children',
        }
        var includeData = this.buildTreeIncludes(model, level - 1);
        if (includeData.as != undefined)
            result.include = includeData;
    }
    return result;
}

exports.pagination = function(page, itemperpage) {
    console.log('page', page)
    console.log('itemperpage', itemperpage)
    let result = {};
    var Page = 0;
    var Limit = 10;

    if (itemperpage != undefined)
        Limit = parseInt(itemperpage);

    if (page != undefined)
        Page = parseInt(page) * Limit - Limit;

    result.offset = Page;
    result.limit = Limit;

    return result;
    //return ` LIMIT ${Page},${Limit}`;
};

exports.arrangeQuery = function(name, value) {
    var result = '';

    if (value != undefined)
        result += ` and ${name} like '%${value}%'`;

    return result;
}

exports.arrangeNumericQuery = function(name, value, ) {
    var result = '';

    if (value != undefined) {
        if (value.substring(0, 1) == '>' || value.substring(0, 1) == '<')
            result += ` and ${name} ${value}`;

        else
            result += ` and ${name} = ${value}`;
    }

    return result;
}

exports.filterAkun = function(query) {
    const Op = Sequelize.Op;
    let where = {};

    if (query['id'] != undefined) {
        let id = {
            [Op.like]: '%' + query['id'] + '%'
        };
        where.id = id
    }

    if (query['nama_akun'] != undefined) {
        let nama_akun = {
            [Op.like]: '%' + query['nama_akun'] + '%'
        };
        where.nama_akun = nama_akun
    }

    if (query['kode'] != undefined) {
        let kode = {
            [Op.like]: '%' + query['kode'] + '%'
        };
        where.kode = kode
    }

    if (query['balance_awal'] != undefined) {
        let balance_awal = {};
        if (query['balance_awal'].substring(0, 1) == '>') {
            if (query['balance_awal'].substring(1, 2) == '=') {
                var value = parseInt(query['balance_awal'].substring(2));
                balance_awal = {
                    [Op.gte]: parseInt(query['balance_awal'].substring(2))
                };
            } else
                balance_awal = {
                    [Op.gt]: parseInt(query['balance_awal'].substring(1))
                };
        } else if (query['balance_awal'].substring(0, 1) == '<') {
            if (query['balance_awal'].substring(1, 2) == '=') {
                balance_awal = {
                    [Op.lte]: parseInt(query['balance_awal'].substring(2))
                };
            } else
                balance_awal = {
                    [Op.lt]: parseInt(query['balance_awal'].substring(1))
                };
        } else
            balance_awal = {
                [Op.eq]: query['balance_awal']
            };
        where.balance_awal = balance_awal
    }

    if (query['balance_akhir'] != undefined) {
        let balance_akhir = {};
        if (query['balance_akhir'].substring(0, 1) == '>') {
            if (query['balance_akhir'].substring(1, 2) == '=') {
                balance_akhir = {
                    [Op.gte]: parseInt(query['balance_akhir'].substring(2))
                };
            } else
                balance_akhir = {
                    [Op.gt]: parseInt(query['balance_akhir'].substring(1))
                };
        } else if (query['balance_akhir'].substring(0, 1) == '<') {
            if (query['balance_akhir'].substring(1, 2) == '=') {
                balance_akhir = {
                    [Op.lte]: parseInt(query['balance_akhir'].substring(2))
                };
            } else
                balance_akhir = {
                    [Op.lt]: parseInt(query['balance_akhir'].substring(1))
                };
        } else
            balance_akhir = {
                [Op.eq]: query['balance_akhir']
            };
        where.balance_akhir = balance_akhir
    }

    if (query['kode_parent'] != undefined) {
        let kode_parent = {
            [Op.like]: '%' + query['kode_parent'] + '%'
        };
        where.kode_parent = kode_parent
    }

    if (query['satuan'] != undefined) {
        let satuan = {
            [Op.like]: '%' + query['satuan'] + '%'
        };
        where.satuan = satuan
    }

    console.log('where', where)
    return where;
};

exports.transactionModel = function(req) {
    let model = {};
    if (req.body.jenis_transaksi != undefined)
        model.jenis_transaksi = req.body.jenis_transaksi;
    if (req.body.tanggal_transaksi != undefined)
        model.tanggal_transaksi = req.body.tanggal_transaksi;
    if (req.body.kode_akun != undefined)
        model.kode_akun = req.body.kode_akun;
    if (req.body.keterangan != undefined)
        model.keterangan = req.body.keterangan;
    if (req.body.debit != undefined)
        model.debit = req.body.debit;
    if (req.body.kredit != undefined)
        model.kredit = req.body.kredit;
    if (req.body.saldo_awal != undefined)
        model.saldo_awal = req.body.saldo_awal;
    if (req.body.saldo_akhir != undefined)
        model.saldo_akhir = req.body.saldo_akhir;
    if (req.files.image != undefined)
        model.image = req.files.image;
    if (req.files.file != undefined)
        model.file = req.files.file;

    return model;
}

exports.akunModel = function(req) {
    let body = {};
    if (req.body.kode != undefined)
        body.kode = req.body.kode;
    if (req.body.nama_akun != undefined)
        body.nama_akun = req.body.nama_akun;
    if (req.body.balance_awal != undefined)
        body.balance_awal = req.body.balance_awal;
    if (req.body.balance_akhir != undefined)
        body.balance_akhir = req.body.balance_akhir;
    if (req.body.satuan != undefined)
        body.satuan = req.body.satuan;
    if (req.files.image != undefined)
        body.image = req.files.image;
    if (req.files.file != undefined)
        body.file = req.files.file;
    return body;
}

exports.filterTransaction = function(query) {
    const Op = Sequelize.Op;
    let where = {};

    if (query['id'] != undefined) {
        let id = {
            [Op.like]: '%' + query['id'] + '%'
        };
        where.id = id
    }

    if (query['jenis_transaksi'] != undefined) {
        let jenis_transaksi = {
            [Op.like]: '%' + query['jenis_transaksi'] + '%'
        };
        where.jenis_transaksi = jenis_transaksi
    }

    if (query['tanggal_transaksi'] != undefined) {
        let tanggal_transaksi = {};
        if (query['tanggal_transaksi'].substring(0, 1) == '>') {
            if (query['tanggal_transaksi'].substring(1, 2) == '=') {
                var value = parseInt(query['tanggal_transaksi'].substring(2));
                tanggal_transaksi = {
                    [Op.gte]: parseInt(query['tanggal_transaksi'].substring(2))
                };
            } else
                tanggal_transaksi = {
                    [Op.gt]: parseInt(query['tanggal_transaksi'].substring(1))
                };
        } else if (query['tanggal_transaksi'].substring(0, 1) == '<') {
            if (query['tanggal_transaksi'].substring(1, 2) == '=') {
                tanggal_transaksi = {
                    [Op.lte]: parseInt(query['tanggal_transaksi'].substring(2))
                };
            } else
                tanggal_transaksi = {
                    [Op.lt]: parseInt(query['tanggal_transaksi'].substring(1))
                };
        } else
            tanggal_transaksi = {
                [Op.eq]: query['tanggal_transaksi']
            };
        where.tanggal_transaksi = tanggal_transaksi
    }

    if (query['kode_akun'] != undefined) {
        let kode_akun = {
            [Op.like]: '%' + query['kode_akun'] + '%'
        };
        where.kode_akun = kode_akun
    }

    if (query['keterangan'] != undefined) {
        let keterangan = {
            [Op.like]: '%' + query['keterangan'] + '%'
        };
        where.keterangan = keterangan
    }

    if (query['debit'] != undefined) {
        let debit = {};
        if (query['debit'].substring(0, 1) == '>') {
            if (query['debit'].substring(1, 2) == '=') {
                var value = parseInt(query['debit'].substring(2));
                debit = {
                    [Op.gte]: parseInt(query['debit'].substring(2))
                };
            } else
                debit = {
                    [Op.gt]: parseInt(query['debit'].substring(1))
                };
        } else if (query['debit'].substring(0, 1) == '<') {
            if (query['debit'].substring(1, 2) == '=') {
                debit = {
                    [Op.lte]: parseInt(query['debit'].substring(2))
                };
            } else
                debit = {
                    [Op.lt]: parseInt(query['debit'].substring(1))
                };
        } else
            debit = {
                [Op.eq]: query['debit']
            };
        where.debit = debit
    }

    if (query['kredit'] != undefined) {
        let kredit = {};
        if (query['kredit'].substring(0, 1) == '>') {
            if (query['kredit'].substring(1, 2) == '=') {
                var value = parseInt(query['kredit'].substring(2));
                kredit = {
                    [Op.gte]: parseInt(query['kredit'].substring(2))
                };
            } else
                kredit = {
                    [Op.gt]: parseInt(query['kredit'].substring(1))
                };
        } else if (query['kredit'].substring(0, 1) == '<') {
            if (query['kredit'].substring(1, 2) == '=') {
                kredit = {
                    [Op.lte]: parseInt(query['kredit'].substring(2))
                };
            } else
                kredit = {
                    [Op.lt]: parseInt(query['kredit'].substring(1))
                };
        } else
            kredit = {
                [Op.eq]: query['kredit']
            };
        where.kredit = kredit
    }


    if (query['saldo_awal'] != undefined) {
        let saldo_awal = {};
        if (query['saldo_awal'].substring(0, 1) == '>') {
            if (query['saldo_awal'].substring(1, 2) == '=') {
                var value = parseInt(query['saldo_awal'].substring(2));
                saldo_awal = {
                    [Op.gte]: parseInt(query['saldo_awal'].substring(2))
                };
            } else
                saldo_awal = {
                    [Op.gt]: parseInt(query['saldo_awal'].substring(1))
                };
        } else if (query['saldo_awal'].substring(0, 1) == '<') {
            if (query['saldo_awal'].substring(1, 2) == '=') {
                saldo_awal = {
                    [Op.lte]: parseInt(query['saldo_awal'].substring(2))
                };
            } else
                saldo_awal = {
                    [Op.lt]: parseInt(query['saldo_awal'].substring(1))
                };
        } else
            saldo_awal = {
                [Op.eq]: query['saldo_awal']
            };
        where.saldo_awal = saldo_awal
    }


    if (query['saldo_akhir'] != undefined) {
        let saldo_akhir = {};
        if (query['saldo_akhir'].substring(0, 1) == '>') {
            if (query['saldo_akhir'].substring(1, 2) == '=') {
                var value = parseInt(query['saldo_akhir'].substring(2));
                saldo_akhir = {
                    [Op.gte]: parseInt(query['saldo_akhir'].substring(2))
                };
            } else
                saldo_akhir = {
                    [Op.gt]: parseInt(query['saldo_akhir'].substring(1))
                };
        } else if (query['saldo_akhir'].substring(0, 1) == '<') {
            if (query['saldo_akhir'].substring(1, 2) == '=') {
                saldo_akhir = {
                    [Op.lte]: parseInt(query['saldo_akhir'].substring(2))
                };
            } else
                saldo_akhir = {
                    [Op.lt]: parseInt(query['saldo_akhir'].substring(1))
                };
        } else
            saldo_akhir = {
                [Op.eq]: query['saldo_akhir']
            };
        where.saldo_akhir = saldo_akhir
    }

    console.log('where', where)
    return where;
};
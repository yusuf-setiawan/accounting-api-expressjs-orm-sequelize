const akunController = require('../controllers').akun;
const transactionController = require('../controllers').transaction;

var multer = require('multer')

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/images/')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname);

    }
});

var upload = multer({ storage: storage });


module.exports = (app) => {
    app.get('/api', (req, res) => res.status(200).send({
        message: 'Welcome to Accounting API!',
    }))

    app.get('/api/akun', akunController.findAll);
    app.get('/api/akun/:id', akunController.findOne);
    app.post('/api/akun', upload.any(), akunController.create);
    app.put('/api/akun/:id', upload.any(), akunController.update);
    app.delete('/api/akun/:id', akunController.destroy);

    app.get('/api/mutasi/:id', transactionController.findMutasi);

    app.get('/api/transaction', transactionController.findAll);
    app.get('/api/transaction/:id', transactionController.findOne);
    app.post('/api/transaction', upload.any(), transactionController.create);
    app.put('/api/transaction/:id', upload.any(), transactionController.update);
    app.delete('/api/transaction/:id', transactionController.destroy);
}
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const crypto = require('crypto')
const path = require('path');


let storage = new GridFsStorage({
    url: `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ds125862.mlab.com:25862/hackton_db`,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    },

})

let upload = multer({ storage: storage }).single('avatar');

module.exports = upload

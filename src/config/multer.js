const multer = require('multer')
const path = require('path')
const crypto = require('crypto')
const aws = require('aws-sdk')
const multerS3 = require('multer-s3')

const storageTypes = {
    local: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'))
        },
        filename: (req, file, cb) => {
            // Chama o crypto para gerar um quantidade aleatório de 16 bytes
            crypto.randomBytes(16, (err, hash) => {
                // Verifica se teve erro
                if(err) cb(err)

                // Concatena o hash gerado pelo crypto convertido para string em hexadecimal + o nome original do arquivo enviado pelo usuário
                file.key = `${hash.toString('hex')}-${file.originalname}`

                // Salva o novo nome da imagem
                cb(null, file.key)
            })
        },
    }),
    s3: multerS3({
        s3: new aws.S3(),
        bucket: 'curso-storage-upload',
        // Lê o tipo do arquivo e atribui o content type como o tipo do arquivo, impedindo que force o download
        contentType: multerS3.AUTO_CONTENT_TYPE,
        // Permite que todos possam visualizar o arquivo
        acl: 'public-read',
        key: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                // Verifica se teve erro
                if(err) cb(err)

                // Concatena o hash gerado pelo crypto convertido para string em hexadecimal + o nome original do arquivo enviado pelo usuário
                const fileName = `${hash.toString('hex')}-${file.originalname}`

                // Salva o novo nome da imagem
                cb(null, fileName)
            })
        }
    })
}

module.exports = {
    // Caso não tenha nada definido em destination, define o destino para onde os arquivos vão depois de terminar o upload
    dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    storage: storageTypes[process.env.STORAGE_TYPE],
    // Define os limites dos arquivos
    limits: {
        // Tamanho do arquivo
        fileSize: 2 * 1024 * 1024 // 2mb
    },
    // Filtra o upload de arquivos
    fileFilter: (req, file, cb) => {
        // Declara os tipos de images que serão aceitos no app
        const allowedMimes = [
            'image/jpeg',
            'image/pjpeg',
            'image/png',
            'image/gif'
        ]

        // Verifica se o arquivo enviado contem a extensão aceita pelo app
        if(allowedMimes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error('Invalid file type.'))
        }
    }
}
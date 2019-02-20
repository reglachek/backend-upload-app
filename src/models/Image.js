const mongoose = require('mongoose')
const aws = require('aws-sdk')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const s3 = new aws.S3()

const ImageSchema = new mongoose.Schema({
    // Nome original da image
    name: String,
    // Tamanho da imagem
    size: Number,
    // Hash gerado pelo crypto
    key: String,
    // Url gerado pela amazon
    url: String,
    // Hora atual do upLoad
    createdAt: {
        type: Date,
        default: Date.now
    }    
})

ImageSchema.pre('save', function() {
    if(!this.url) {
        this.url = `${process.env.APP_URL}/files/${this.key}`
    }
})

ImageSchema.pre('remove', function() {
    if(process.env.STORAGE_TYPE  === 's3') {
        return s3.deleteObject({
            Bucket: 'curso-storage-upload',
            Key: this.key
        }).promise()
    } else {
        return promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'tmp', 'uploads', this.key))
    }
})

module.exports = mongoose.model('Image', ImageSchema)

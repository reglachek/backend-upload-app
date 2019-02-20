const routes = require('express').Router()
const multer = require('multer')

const multerConfig = require('./config/multer')
const ImageModel = require('./models/Image')

/*
Adiciona na rota um middleware do multer passando suas configurações por parâmetro e dizendo através do método single() que será enviado uma imagem por vez e que essa images serão enviadas através do campo de name 'file' do formulário.

O multer popula o campo file da requisição com os dados das imagens enviadas
*/
routes.post('/posts', multer(multerConfig).single('file'), async (req, res) => {
    // Desestrutura os dados populados pelo multer
    const { orginalname: name, size, key, location: url = '' } = req.file

    const createdImg = await ImageModel.create({
        name,
        size,
        key,
        url
    })
    return res.json(createdImg)
})

// Lista todas as imagens salvas
routes.get('/posts', async (req, res) => {
    const images = await ImageModel.find({})

    return res.json(images)
})

routes.delete('/posts/:id', async (req, res) => {
    const imageDelete = await ImageModel.findById(req.params.id)

    await imageDelete.remove()

    return res.send({
        message: 'Sua imagem foi deletada com sucesso'
    })
})

module.exports = routes

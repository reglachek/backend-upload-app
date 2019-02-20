require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const path = require('path')
const cors = require('cors')

const app = express()

// Database setup
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true
})

// Libera para que todos os dominios possam acessar a API
app.use(cors())

// Faz o express entender o formato json na requisições
app.use(express.json())

// Middleware responsável por possibilitar o express lidar com requisições do tipo urlencode, facilita o envio de arquivos
app.use(express.urlencoded({ extended: true }))

app.use(morgan('dev'))

app.use(require('./routes'))

app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')))

app.listen(3000, () => {
    console.log('Server rodando na porta 3000')
})

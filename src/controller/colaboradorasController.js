const Colaboradoras = require('../models/colaboradorasModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const SECRET = process.env.SECRET

const create = (req, res) => {
    const senhaComHash = bcrypt.hashSync(req.body.senha, 10)
    req.body.senha = senhaComHash
    const colaboradora = new Colaboradoras(req.body)
    colaboradora.save(function (err) {
        if (err) {
            res.status(500).send({ message: err.message })
        }
        res.status(201).send(colaboradora)
        
    })
}

const getAll = (req,res) => {
    Colaboradoras.find(function (err, colaboradoras) {
        if (err) {
            res.status(500).send({ message: err.message })
        }
        res.status(200).send(colaboradoras)
    })
}

const deleteById = async (req, res) => {
    // req.body é o corpinho todo e o req.params é o parametro (ex. esse é o id)
    try {
        const { id } = req.params
        await Colaboradoras.findByIdAndDelete(id)
        const message = `A colaboradora com o id ${id} foi deletada com sucesso!`
        res.status(200).json({ message })
    } catch {
        res.status(500).json({ message: error.message })
    }
}

const login = (req, res) => {
    Colaboradoras.findOne({email: req.body.email}, function (error, colaboradora) {
        if (!colaboradora) {
            return res.status(404).send("não existe colaboradora com este email!")
        }

        const senhaValida = bcrypt.compareSync(req.body.senha, colaboradora.senha)

        if (!senhaValida) {
            return res.status(403).send("que senha é essa?")
        }

        jwt.sign({ email: req.body.email}, SECRET)
        res.status(200).send(token)
    })
}

module.exports = {
    create, getAll, deleteById, login
}
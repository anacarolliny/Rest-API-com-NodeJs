const express = require("express")
const router = express.Router()//aqui declarando que é uma rota do express


// RETORNA TODOS OS PRODUTOS
router.get("/", (req, res, next) => { //retorna todos os pedidos
    res.status(200).send({
        mensagem: "Retorna os pedidos"
    })
})


// INSERE UM PEDIDO
router.post("/", (req, res, next) => {
    const pedido = { // criar o objeto e pegar irformacoes direto do body
        id_produto: req.body.id_produto,
        quantidade: req.body.quantidade
    }

    res.status(201).send({
        mensagem: "O pedido foi criado",
        pedidoCriado: pedido
    })
})


// RETORNA OS DADOS DE UM PRODUTO
router.get("/:id_pedido", (req, res, next) => { // entra em detalhes de um unico pedido
    const id = req.params.id_pedido // aqui iremos selecionar o id do pedido atravez dos params

    if (id === "especial") { // teste de parametros
        res.status(200).send({
            mensagem: "detalhes do pedido",
            id_pedido: id
        })
    } else {
        res.status(200).send({
            mensagem: "Voce passou um ID"
        })
    }

})

//DELETA UM PEDIDO
router.delete("/", (req, res, next) => {
    res.status(201).send({
        mensagem: "Pedido excluído"
    })
})

module.exports = router // exporta produtos com esses verbos, o POST e GET
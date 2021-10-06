const express = require("express")
const router = express.Router()//aqui declarando que é uma rota do express
const mysql = require("../mysql").pool // o .pool é para exportar o arquivo inteiro

// RETORNA TODOS OS PRODUTOS
router.get("/", (req, res, next) => { //retorna todos os produtos
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            "SELECT * FROM produtos",
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                return res.status(200).send({ response: resultado })
            }
        )
    })

})


// INSERE UM PRODUTO
router.post("/", (req, res, next) => {
    if (error) { return res.status(500).send({ error: error }) }
    mysql.getConnection((error, conn) => { // conexão com o banco
        conn.query(
            "INSERT INTO produtos (nome, preco) VALUES (?,?)",
            [req.body.nome, req.body.preco],
            (error, resultado, field) => {
                conn.release()//muito importante porque quando ele entrar na callback tem que liberar a query
                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null
                    })

                }

                res.status(201).send({
                    mensagem: "Produto Inserido com sucesso",
                    id_produto: resultado.insertId // id que foi inserido lembrando que a coluna pe autoincrementável

                })
            }
        )
    })


})


// RETORNA OS DADOS DE UM PRODUTO
router.get("/:id_produto", (req, res, next) => { // entra em detalhes de um unico produto
    const id = req.params.id_produto // aqui iremos selecionar o id do prodto atravez dos params

    if (id === "especial") { // teste de parametros
        res.status(200).send({
            mensagem: "Voce descobriu o Id Especial",
            id: id
        })
    } else {
        res.status(200).send({
            mensagem: "Voce passou um ID"
        })
    }

})

// ALTERA UM PRODUTO
router.patch("/", (req, res, next) => {
    res.status(201).send({
        mensagem: "Pedido alterado"
    })
})

//DELETA UM PRODUTO
router.delete("/", (req, res, next) => {
    res.status(201).send({
        mensagem: "Produto excluido"
    })
})

module.exports = router // exporta produtos com esses verbos, o POST e GET
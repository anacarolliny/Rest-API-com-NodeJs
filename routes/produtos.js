const express = require("express")
const router = express.Router()//aqui declarando que é uma rota do express
const mysql = require("../mysql").pool // o .pool é para exportar o arquivo inteiro

// RETORNA TODOS OS PRODUTOS
router.get("/", (req, res, next) => { //retorna todos os produtos
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) } // retorna um erro se nao conseguir acessar a conexão
        conn.query(
            "SELECT * FROM produtos",
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                const response = { // Aqui posso documentar meu método Get melhor, boas praticas
                    quantidade: result.length,
                    produtos: result.map(prod => { // no array e produtos, cada item dele vou modificar o valor, vai ter esse padrão
                        return {
                            id_produto: prod.id_produto,
                            nome: prod.nome,
                            preco: prod.preco,
                            request: { //
                                tipo: "GET",
                                descricao: "Retorna o detalhe de um ID específico",//documentação dos meus métodos
                                url: "http://localhost:3000/produtos/" + prod.id_produto // link para se clicar na API vai redirecionar para o GET individual do produto
                            }
                        }
                    })
                }
                return res.status(200).send(response) // executando essa query, ela vai ser retornar minha const response
            }
        )
    })

})


// INSERE UM PRODUTO
router.post("/", (req, res, next) => {

    mysql.getConnection((error, conn) => { // conexão com o banco
        if (error) { return res.status(500).send({ error: error }) } // retorna um erro se nao conseguir acessar a conexão
        conn.query(
            "INSERT INTO produtos (nome, preco) VALUES (?,?)",
            [req.body.nome, req.body.preco],
            (error, result, field) => {
                conn.release()//muito importante porque quando ele entrar na callback tem que liberar a query
                if (error) { return res.status(500).send({ error: error }) } // retorna um erro se nao conseguir executar a query

                const response = {
                    mensagem: "Produto inserido com sucesso",
                    produtoCriado: {
                        id_produto: result.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: "POST",
                            descricao: "Insere um produto",
                            url: "http:localhost:3000/produtos"
                        }
                    }
                }
                return res.status(201).send(response)
            }
        )
    })


})


// RETORNA OS DADOS DE UM PRODUTO
router.get("/:id_produto", (req, res, next) => { // entra em detalhes de um unico produto
    //const id = req.params.id_produto // aqui iremos selecionar o id do prodto atravez dos params
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) } // aqui é o callback da conexão
        conn.query(
            "SELECT * FROM  produtos WHERE id_produto = ?; ",
            [req.params.id_produto],
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }//aqui é o callback da query

                if (result.length == 0) { // tratamento de erro
                    return res.status(404).send({
                        mensagem: "Não foi encontrado produto com esse ID"
                    })
                }
                const response = { // Aqui posso documentar meu método Get melhor, boas praticas
                    produto: {
                        id_produto: result[0].id_produto,
                        nome: result[0].nome,
                        preco: result[0].preco,
                        request: { //
                            tipo: "GET",
                            descricao: "Retorna o produto selecionado",//documentação dos meus métodos
                            url: "http://localhost:3000/produtos/"  // link para se clicar na API vai redirecionar para o GET individual do produto
                        }
                    }

                }
                return res.status(200).send(response) // executando essa query, ela vai ser retornar minha const response
            }

        )
    })

})


// ALTERA UM PRODUTO
router.patch("/", (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `UPDATE produtos
             SET nome = ?,
              preco = ?
               WHERE id_produto =?`,
            [
                req.body.nome, req.body.preco, req.body.id_produto
            ],
            (error, result, field) => {
                conn.release()
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: "Produto alterado com sucesso",
                    produtoAtualizado: {
                        id_produto: req.body.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: "PATCH",
                            descricao: "Altera um produto",
                            url: "http:localhost:3000/produtos/" + req.body.id_produto
                        }
                    }
                }
                return res.status(202).send(response)

            }
        )
    })
})




//DELETA UM PRODUTO
router.delete("/", (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query( //  a query já é um callback em si
            "DELETE FROM produtos WHERE id_produto = ?", [req.body.id_produto],
            (error, resultado, field) => {
                conn.release()
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem : "Produto removido com sucesso",
                    request : {
                        tipo : "POST",
                        descricao : "Insere um produto",
                        url: "http://localhost:3000/produtos",
                        body:{
                            nome: "String",
                            preco : "Number"
                        }
                    }
                }
                res.status(202).send(response)
            }
        )
    })

})

module.exports = router // exporta produtos com esses verbos, o POST e GET